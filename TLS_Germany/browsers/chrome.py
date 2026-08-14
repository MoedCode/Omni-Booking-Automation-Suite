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
from typing import Optional
import datetime
from seleniumbase import Driver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from config.selectors import TLS_SELECTORS
from config import settings
from browsers.browser_base import BrowserBase
from browsers.injection import inject_date_bypass


class ChromeManager:
    """
    Manages an isolated Chrome browser instance using pure threading.
    Handles lifecycle, threading, and precision timing.
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
        self.max_year = 2027
        self.max_month = 12
        self.js_swap = True
        self.js_nav = True
        self.js_hide_m = True
        self.js_hide_s = True

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

    def _print_js_console_logs(self):
        """Fetches browser console logs and prints Hot-Patch messages to the Python Terminal."""
        if not self.driver: return
        try:
            logs = self.driver.get_log('browser')
            for log in logs:
                msg = log.get('message', '')
                # Filter to only show our JS injection logs
                if "Hot-Patch" in msg:
                    # Clean up standard Chrome log formatting
                    clean_msg = msg.split('"')[-2] if '"' in msg else msg
                    print(f"    [JS ⚙️] {self.account} -> {clean_msg}")
        except Exception:
            pass # Fails safely if logging is not enabled in standard chromedriver

    def _inject_hot_patch(self) -> None:
        """Injects the headless bypass engine into the active appointment booking DOM."""
        if not self.driver:
            return
        
        print(f"\n[🚀] {self.account} Initiating JavaScript DOM Hook for Appointment Page...")
        self.status = "Injecting JavaScript Engine..."
        try:
            success = inject_date_bypass(
                driver=self.driver,
                target_month_str=self.target_month,
                max_year=int(self.max_year),
                max_month=int(self.max_month),
                hide_past_months=self.js_hide_m,
                hide_past_slots=self.js_hide_s,
                auto_navigate=self.js_nav,
                swap_current_date=self.js_swap
            )
            
            if success:
                print(f"[✅] {self.account} JavaScript Engine successfully hooked. Monitoring background tasks...\n")
                time.sleep(1) # Give JS a moment to execute its hiding logic
                self._print_js_console_logs() # Print the hidden months to terminal
            else:
                print(f"[❌] {self.account} JavaScript Engine failed to hook (returned False).\n")
        except Exception as e:
            print(f"[❌] {self.account} CRITICAL INJECTION ERROR: {e}\n")

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

            self.status = "Navigating to Start URL"
            self.driver.get(self.target_url)

            self.status = "Routing to Dashboard"
            navigator = BrowserBase(
                driver=self.driver, 
                account=self.account, 
                password=self.password,
                target_city=self.target_city,
                is_running_flag=lambda: self.is_running
            )

            while self.is_running:
                # 1. Complete Login, 2FA, Select City & Application
                navigator.navigate_to_target_state()
                if not self.is_running:
                    break

                # 2. INJECT IMMEDIATELY UPON REACHING APPOINTMENT PAGE
                self._inject_hot_patch()

                # 3. Enter monitoring loop
                self._appointment_check_loop()
                if not self.is_running:
                    break

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

    def _appointment_check_loop(self) -> None:
        print(f"[{self.account}] Now monitoring for appointments...")
        while self.is_running:
            if "/appointment-booking/" not in self.driver.current_url:
                self.status = "Re-routing: Off booking page."
                print(f"🗺️ [{self.account}] {self.status} - returning to navigator.")
                return 
            
            # Print any new console logs generated by JS (like hiding newly loaded slots)
            self._print_js_console_logs()

            found = self.check_appointment()
            
            if found:
                self.status = "Appointments Found!"
                self.appointment_found = True
                print(f"✅✅✅ [{self.account}] APPOINTMENTS FOUND! ✅✅✅")
                while self.is_running:
                    time.sleep(1)
                return 
            
            # Precision timing synchronization
            target_second = self.target_sec
            if not (0 <= target_second <= 59):
                interval = self.target_sec if self.target_sec > 0 else settings.APPOINTMENT_CHECK_INTERVAL_SECONDS
                for i in range(interval, 0, -1):
                    if not self.is_running:
                        return
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
                print(f"[{self.account}] Performing sync refresh...")
                self.status = "Refreshing..."
                
                # Use get(url) to prevent WinError 10061 Socket Closure
                self.driver.get(self.driver.current_url) 
                time.sleep(2)
                
                # Re-inject the script right after page reload
                self._inject_hot_patch()

    def check_appointment(self) -> bool:
        try:
            self.status = f"Checking for month: {self.target_month}"
            
            # --- CRITICAL FIX ---
            # If JS is handling navigation OR swapping the date entirely, 
            # Python should NOT try to navigate, as it will crash trying to click hidden elements.
            if not self.js_nav and not self.js_swap:
                month_found = self._navigate_to_target_month()
                if not month_found:
                    return False

            self.status = f"Scanning {self.target_month} for slots..."
            
            # Wait for body to be fully ready before reading text
            self.driver.wait_for_element_present("body", timeout=5)
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
                print(f"    - Available slot detected!")
                available_slots = self.driver.find_elements(By.CSS_SELECTOR, TLS_SELECTORS['appointment_booking']['available_slot'])
                if available_slots:
                    self.driver.execute_script("arguments[0].click();", available_slots[0])
                return True
            
            return False

        except Exception as e:
            # Reformat exception so it doesn't just print "Message: "
            error_msg = str(e).replace('\n', ' | ')
            self.status = f"Error checking page"
            print(f"❌ [{self.account}] Exception during slot scan: {error_msg}")
            return False

    def _navigate_to_target_month(self) -> bool:
        try:
            target_date = datetime.datetime.strptime(self.target_month.strip(), "%B %Y")
        except ValueError:
            self.status = f"Error: Invalid month format '{self.target_month}'."
            print(f"❌ [{self.account}] {self.status}")
            return False

        for _ in range(24):
            if not self.is_running:
                return False

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
                return True

            if target_date > current_date:
                next_button_selector = "[data-testid^='btn-next-month-']"
                try:
                    button = self.driver.find_element(By.CSS_SELECTOR, next_button_selector)
                    if button.is_displayed():
                        self.driver.execute_script("arguments[0].click();", button) 
                        time.sleep(1.5)
                    else:
                        return False
                except NoSuchElementException:
                    return False
            else: 
                prev_button_selector = "[data-testid^='btn-prev-month-']"
                try:
                    button = self.driver.find_element(By.CSS_SELECTOR, prev_button_selector)
                    if button.is_displayed():
                        self.driver.execute_script("arguments[0].click();", button) 
                        time.sleep(1.5)
                    else:
                        return False
                except NoSuchElementException:
                    return False
        
        return False

    def stop_engine(self) -> None:
        if not self.is_running:
            return
        self.is_running = False 
        if self.driver:
            try:
                self.driver.quit()
            except Exception:
                pass
            self.driver = None
        if "Error" not in self.status and self.status != "Finished" and not self.appointment_found:
            self.status = "Terminated"