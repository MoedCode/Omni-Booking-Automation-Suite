#!/usr/bin/env python3
"""
Omni-Booking-Automation-Suite/TLS_Germany/browsers/chrome.py
Synchronous Thread-Based Implementation
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import threading
import time
from typing import Optional, Dict
import datetime
import ctypes
from seleniumbase import Driver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from config.selectors import TLS_SELECTORS
from config import settings
from browsers.browser_base import BrowserBase
from browsers.injection import inject_date_bypass
from config.settings import *

class ChromeManager:
    """
    Manages an isolated Chrome browser instance using pure threading.
    Handles lifecycle, threading, and precision timing.
    Delegates all page interaction to BrowserBase.
    """

    _driver_init_lock = threading.Lock()

    def __init__(
        self,
        account: str,
        password: str,
        url: str,
        target_month: str,
        target_city: str,
        target_hr: int = 0,
        target_min: int = 0,
        target_sec: int = 0,
        target_ms: int = 0,
        proxy_address: Optional[str] = None
    ) -> None:
        self.account = account
        self.password = password
        self.target_url = url
        self.target_month = target_month
        self.target_city = target_city
        self.target_hr = int(target_hr)
        self.target_min = int(target_min)
        self.target_sec = int(target_sec)
        self.target_ms = int(target_ms)
        self.proxy_address = proxy_address
        self.countdown = 0
        
        self.account_safe_name = "".join([c if c.isalnum() else "_" for c in self.account])
        self.profile_path = os.path.abspath(f"./runtime_profiles/{self.account_safe_name}")
        self.window_title = f"Omni-Booking :: {self.account}"
        
        self.thread: Optional[threading.Thread] = None
        self.is_running = False
        self.driver: Optional[Driver] = None
        self.appointment_found = False
        self.status = "Idle"

        # --- HOT-PATCH DASHBOARD VARIABLES ---
        self.max_year = "2027"
        self.max_month = "12"
        self.js_swap = True
        self.js_nav = True
        self.js_hide_m = True
        self.js_hide_s = True

    def _show_dialog(self, title, message, terminate_only=False):
        """
        Shows a native OS message box that safely blocks the background thread.
        """
        try:
            if terminate_only:
                flags = 0 | 0x10  # MB_OK | MB_ICONERROR
                ctypes.windll.user32.MessageBoxW(0, message, title, flags)
                return "CANCEL"
            else:
                flags = 1 | 0x30  # MB_OKCANCEL | MB_ICONWARNING
                result = ctypes.windll.user32.MessageBoxW(0, message, title, flags)
                return "OK" if result == 1 else "CANCEL"
        except Exception as e:
            print(f"Dialog error: {e}")
            return "CANCEL"

    def _build_stealth_profile(self) -> list:
        os.makedirs(self.profile_path, exist_ok=True)
        flags = [
            f"--user-data-dir={self.profile_path}",
            "--window-size=1280,800",
            "--disable-blink-features=AutomationControlled",
            "--disable-infobars",
            "--no-sandbox",
            "--disk-cache-size=1",
            "--media-cache-size=1",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--disable-extensions"
        ]
        if self.proxy_address:
            flags.append(f"--proxy-server={self.proxy_address}")
        return flags

    def start_engine(self) -> None:
        if self.is_running:
            return

        self.is_running = True
        self.thread = threading.Thread(
            target=self._run_task,
            name=f"Thread_{self.account}",
            daemon=True
        )
        self.thread.start()

    def _run_task(self) -> None:
        print(f"[🧵] Thread started for: {self.account}")
        self.status = "Initializing"

        try:
            with ChromeManager._driver_init_lock:
                self.status = "Launching Driver"
                self.driver = Driver(
                    uc=True,
                    incognito=False,
                    chromium_arg=",".join(self._build_stealth_profile())
                )
            self.driver.execute_script(f"document.title = '{self.window_title}'")

            inject_date_bypass(self.driver, self.target_month)

            self.status = "Navigating to Start URL"
            self.driver.get(self.target_url)

            # =========================================================
            # NEW ROUTING LOGIC: Intelligent Welcome & App List Handler
            # =========================================================
            self._route_smartly()

            if not self.is_running: return # Exit if routing decided to terminate

            self.status = "Routing to Dashboard"
            navigator = BrowserBase(
                driver=self.driver, 
                account=self.account, 
                password=self.password,
                target_city=self.target_city,
                is_running_flag=lambda: self.is_running
            )

            while self.is_running:
                navigator.navigate_to_target_state()
                if not self.is_running: break

                self._appointment_check_loop()
                if not self.is_running: break

                print(f"[{self.account}] Returned from check loop. Re-validating state...")
                time.sleep(3) 

        except ValueError as ve:
            self.is_running = False
            self.status = f"Error: {str(ve)}"
            print(f"❌ [Fatal Error in {self.account}]: {ve}")

        except Exception as e:
            if self.is_running:
                error_msg = str(e).split('\n')[0]
                print(f"❌ [Error in {self.account}]: {error_msg}")
                self.status = f"Error: {error_msg}"
                self.is_running = False
        
        print(f"[💡] Thread for {self.account} has exited.")

    def _route_smartly(self):
        """Intelligently handles Welcome Page (Login) and App List (City Select) before handing over to navigator."""
        time.sleep(2)
        
        # 1. Handle Welcome Page (Login Button)
        if "welcome" in self.driver.current_url.lower() or len(self.driver.find_elements(By.XPATH, "//*[contains(text(), 'Welcome to the Visa Application Centre')]")) > 0:
            print(f"[🌐] {self.account} on Welcome page. Looking for Login option...")
            
            # --- INTELLIGENT LOGIN BUTTON FINDER ---
            login_clicked = False
            
            # Form 1: Direct Span/Button in the header
            direct_login = self.driver.find_elements(By.XPATH, "//span[contains(text(), 'LOGIN') or contains(text(), 'Login')]")
            for span in direct_login:
                if span.is_displayed():
                    print(f"    - Found direct Login button. Clicking...")
                    self.driver.execute_script("arguments[0].click();", span)
                    login_clicked = True
                    break
            
            # Form 2: Hidden in Dropdown Menu under User Icon
            if not login_clicked:
                user_icons = self.driver.find_elements(By.CSS_SELECTOR, "svg[aria-label='User icon']")
                if user_icons and user_icons[0].is_displayed():
                    print(f"    - Direct Login not visible. Clicking User Icon to open dropdown...")
                    self.driver.execute_script("arguments[0].click();", user_icons[0])
                    time.sleep(1) 
                    
                    dropdown_login = self.driver.find_elements(By.CSS_SELECTOR, "div#login")
                    if dropdown_login and dropdown_login[0].is_displayed():
                        print(f"    - Found dropdown Login option. Clicking...")
                        self.driver.execute_script("arguments[0].click();", dropdown_login[0])
                        login_clicked = True

            # Form 3: Anchor tag fallback
            if not login_clicked:
                login_links = self.driver.find_elements(By.CSS_SELECTOR, "a[href*='/login']")
                if login_links:
                    print(f"    - Found Login link via href. Clicking...")
                    self.driver.execute_script("arguments[0].click();", login_links[0])
            
            time.sleep(3)

        # 2. Handle Application List Page (City Select)
        if "travel-groups" in self.driver.current_url.lower() or len(self.driver.find_elements(By.XPATH, "//*[contains(text(), 'Application manager') or contains(text(), 'Application list')]")) > 0:
            print(f"[📋] {self.account} on application list page.")
            time.sleep(2) 
            tabs = self.driver.find_elements(By.CSS_SELECTOR, "div.light-scroll a")
            
            if not tabs:
                print(f"❌ [{self.account}] No city tabs found at all!")
                self._show_dialog(
                    "Configuration Error", 
                    f"Account: {self.account}\n\nNo cities or applications found at all. The bot will now terminate.",
                    terminate_only=True
                )
                self.stop_engine()
                return

            target_found = False
            current_city = ""
            target_tab_element = None
            
            for tab in tabs:
                try:
                    city_name_elem = tab.find_element(By.CSS_SELECTOR, "p.whitespace-nowrap")
                    city_name = city_name_elem.text.strip()
                    
                    inner_div = tab.find_element(By.CSS_SELECTOR, "div.TlsTab_tls-tab__7rpn8")
                    if "TlsTab_--selected" in inner_div.get_attribute("class"):
                        current_city = city_name

                    if self.target_city.lower() in city_name.lower():
                        target_found = True
                        target_tab_element = tab
                except Exception:
                    continue

            if target_found:
                if current_city.lower() != self.target_city.lower():
                    print(f"    - Current tab is '{current_city}'. Switching to '{self.target_city}'...")
                    self.driver.execute_script("arguments[0].click();", target_tab_element)
                    time.sleep(2)
                else:
                    print(f"    - Correct city tab '{self.target_city}' is already selected.")
            else:
                print(f"    - [❌] CRITICAL: Target city '{self.target_city}' not found. Current is '{current_city}'.")
                user_choice = self._show_dialog(
                    "City Not Found", 
                    f"Account: {self.account}\n\nThe bot didn't find '{self.target_city}' in the Application manager.\n\nThe currently selected city is '{current_city}'.\n\nClick 'OK' to ignore and keep looking for an appointment in '{current_city}', or click 'Cancel' to close this window and terminate the bot instantly.",
                    terminate_only=False
                )
                
                if user_choice == "OK":
                    print(f"    - User chose to proceed with current city '{current_city}'.")
                    self.target_city = current_city  
                else:
                    print(f"    - User chose to terminate.")
                    self.stop_engine()
                    return

    def _inject_hot_patch(self):
        if not self.driver: return
        js_code = f"""
            try {{
                var maxInput = document.querySelector('input[name="maxDate"]');
                if (maxInput) {{
                    maxInput.value = '{self.max_year}-{str(self.max_month).zfill(2)}';
                }}
                
                if ({str(self.js_hide_s).lower()}) {{
                    var disabledSlots = document.querySelectorAll('button[data-testid="btn-unavailable-slot"]');
                    disabledSlots.forEach(slot => {{
                        var container = slot.closest('.group\\\\/item');
                        if (container) container.style.display = 'none';
                    }});
                }}
                
                if ({str(self.js_hide_m).lower()}) {{
                    document.querySelectorAll('button.MonthSelector_month-selector_button__An0eF').forEach(btn => {{
                        if (btn.hasAttribute('disabled')) {{
                            btn.style.display = 'none';
                        }}
                    }});
                }}
            }} catch(e) {{
                console.log("Hot-Patch injection error:", e);
            }}
        """
        try:
            self.driver.execute_script(js_code)
        except Exception:
            pass

    def _appointment_check_loop(self) -> None:
        """
        Continuously checks for appointments on the booking page at a set interval.
        """
        print(f"[{self.account}] Now monitoring for appointments...")
        while self.is_running:
            if "/appointment-booking/" not in self.driver.current_url:
                self.status = "Re-routing: Off booking page."
                print(f"🗺️ [{self.account}] {self.status} - returning to navigator.")
                return 
            
            found = self.check_appointment()
            
            if found:
                self.status = "Appointments Found!"
                self.appointment_found = True
                print(f"✅✅✅ [{self.account}] APPOINTMENTS FOUND! ✅✅✅")
                while self.is_running:
                    time.sleep(1)
                return 
            
            target_second = self.target_sec
            if not (0 <= target_second <= 59):
                interval = self.target_sec if self.target_sec > 0 else settings.APPOINTMENT_CHECK_INTERVAL_SECONDS
                for i in range(interval, 0, -1):
                    if not self.is_running: return
                    self.countdown = i
                    self.status = f"No appointments. Retrying in {i}s..."
                    time.sleep(1)
            else:
                while self.is_running and datetime.datetime.now().second != target_second:
                    remaining_seconds = (target_second - datetime.datetime.now().second + 60) % 60
                    self.countdown = remaining_seconds
                    self.status = f"No appointments. Syncing for : {target_second:02d}. Retrying in {remaining_seconds}s..."
                    time.sleep(1 - (datetime.datetime.now().microsecond / 1_000_000.0))
            
            if self.is_running:
                print(f"[{self.account}] Performing direct refresh to check again...")
                self.status = "Refreshing..."
                self.driver.refresh()
                time.sleep(2) 
                self._inject_hot_patch() # Inject immediately after refresh

    def check_appointment(self) -> bool:
        """
        Performs a single check on the current page for available appointments.
        This involves navigating to the correct month first.
        Returns True if an appointment is found, False otherwise.
        """
        try:
            self.status = f"Checking for month: {self.target_month}"
            
            if self.js_nav:
                month_found = self._navigate_to_target_month()
                if not month_found:
                    return False

            self.status = f"Scanning {self.target_month} for slots..."
            page_text = self.driver.get_text("body").lower()
            
            no_slots_message_found = False
            for message in settings.appointment_results:
                if message.lower() in page_text:
                    print(f"    - No appointment slots available for {self.target_month}. Found text: '{message}'")
                    no_slots_message_found = True
                    break
            
            if no_slots_message_found:
                return False

            if self.driver.is_element_visible(TLS_SELECTORS['appointment_booking']['available_slot']):
                print(f"    - 'No slots' message not found AND an available slot is visible. Appointments are available.")
                
                # Auto-Click the first available slot!
                available_slots = self.driver.find_elements(By.CSS_SELECTOR, TLS_SELECTORS['appointment_booking']['available_slot'])
                if available_slots:
                    self.driver.execute_script("arguments[0].click();", available_slots[0])
                    
                return True
            
            print(f"    - 'No slots' message not found, but no available slots were detected either. Assuming no appointments for now.")
            return False

        except Exception as e:
            error_msg = str(e).split('\n')[0]
            self.status = f"Error checking page: {error_msg}"
            print(f"❌ [{self.account}] {self.status}")
            return False

    def _navigate_to_target_month(self) -> bool:
        """
        Navigates the calendar month-by-month until the target month is selected.
        Returns True on success, False on failure.
        """
        try:
            try:
                target_date = datetime.datetime.strptime(self.target_month, "%B %Y")
            except ValueError:
                self.status = f"Error: Invalid month format '{self.target_month}'. Must be 'Month Year'."
                print(f"❌ [{self.account}] {self.status}")
                return False

            for _ in range(24):
                if not self.is_running: return False

                wait = WebDriverWait(self.driver, settings.WAIT_TIMEOUT_ELEMENT_READY)
                wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, TLS_SELECTORS['appointment_booking']['month_selector_container'])))
                
                current_month_element = self.driver.find_element(By.CSS_SELECTOR, TLS_SELECTORS['appointment_booking']['current_month_button'])
                current_month_text = current_month_element.text.strip()
                
                try:
                    current_date = datetime.datetime.strptime(current_month_text, "%B %Y")
                except ValueError:
                    self.status = f"Error: Could not parse current month '{current_month_text}'."
                    print(f"❌ [{self.account}] {self.status}")
                    return False

                if current_date.year == target_date.year and current_date.month == target_date.month:
                    print(f"    - Correct month '{self.target_month}' is displayed.")
                    return True

                if target_date > current_date:
                    next_button_selector = "[data-testid^='btn-next-month-']"
                    try:
                        button = self.driver.find_element(By.CSS_SELECTOR, next_button_selector)
                        if button.is_displayed():
                            print(f"    - Navigating from {current_month_text} to next month...")
                            # Using JS Click to avoid Invalid Selector errors
                            self.driver.execute_script("arguments[0].click();", button) 
                            time.sleep(1.5)
                        else:
                            self.status = f"Error: Cannot reach '{self.target_month}'. 'Next' button is not visible."
                            print(f"❌ [{self.account}] {self.status}")
                            return False
                    except NoSuchElementException:
                        self.status = f"Error: Cannot reach '{self.target_month}'. 'Next' button not found."
                        print(f"❌ [{self.account}] {self.status}")
                        return False
                else: 
                    prev_button_selector = "[data-testid^='btn-prev-month-']"
                    try:
                        button = self.driver.find_element(By.CSS_SELECTOR, prev_button_selector)
                        if button.is_displayed():
                            print(f"    - Navigating from {current_month_text} to previous month...")
                            # Using JS Click to avoid Invalid Selector errors
                            self.driver.execute_script("arguments[0].click();", button) 
                            time.sleep(1.5)
                        else:
                            self.status = f"Error: Cannot reach '{self.target_month}'. 'Previous' button is not interactable."
                            print(f"❌ [{self.account}] {self.status}")
                            return False
                    except NoSuchElementException:
                        self.status = f"Error: Cannot reach '{self.target_month}'. 'Previous' button not found."
                        print(f"❌ [{self.account}] {self.status}")
                        return False
            
            self.status = f"Error: Failed to navigate to '{self.target_month}' after multiple attempts."
            print(f"❌ [{self.account}] {self.status}")
            return False
        except Exception as e:
            error_msg = str(e).split('\n')[0]
            self.status = f"Error during month navigation: {error_msg}"
            print(f"❌ [{self.account}] {self.status}")
            return False

    def stop_engine(self) -> None:
        if not self.is_running: return
        
        self.is_running = False 
        
        if self.driver:
            try:
                self.driver.quit()
            except Exception:
                pass
            self.driver = None
            
        if "Error" not in self.status and self.status != "Finished" and not self.appointment_found:
            self.status = "Terminated"

if __name__ == "__main__":
    pass