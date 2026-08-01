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
from seleniumbase import Driver
from config.selectors import TLS_SELECTORS
from config import settings
from browsers.browser_base import BrowserBase
from config.settings import *

class ChromeManager:
    """
    Manages an isolated Chrome browser instance using pure threading.
    Handles lifecycle, threading, and precision timing.
    Delegates all page interaction to BrowserBase.
    """

    # Class-level lock to prevent race conditions during driver initialization,
    # especially when using seleniumbase's uc=True mode, which patches files on the fly.
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
        
        # --- Unique Identifiers for Isolation & Viewing ---
        # Create a filesystem-safe name for the profile directory
        self.account_safe_name = "".join([c if c.isalnum() else "_" for c in self.account])
        self.profile_path = os.path.abspath(f"./runtime_profiles/{self.account_safe_name}")
        self.window_title = f"Omni-Booking :: {self.account}"
        
        self.thread: Optional[threading.Thread] = None
        self.is_running = False
        self.driver: Optional[Driver] = None
        self.appointment_found = False
        self.status = "Idle"

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
            # 1. Initialize browser (synchronized to prevent race conditions)
            with ChromeManager._driver_init_lock:
                self.status = "Launching Driver"
                self.driver = Driver(
                    uc=True,
                    incognito=False,
                    chromium_arg=",".join(self._build_stealth_profile())
                )
            self.driver.execute_script(f"document.title = '{self.window_title}'")

            # 2. Navigate to the start URL
            self.status = "Navigating to Start URL"
            self.driver.get(self.target_url)

            # 3. Hand over control to the BrowserBase (The State Machine)
            self.status = "Routing to Dashboard"
            # Pass lambda to allow the loop to monitor the thread's running state
            navigator = BrowserBase(
                driver=self.driver, 
                account=self.account, 
                password=self.password,
                target_city=self.target_city,
                is_running_flag=lambda: self.is_running
            )

            # 4. Master control loop. This makes the bot resilient.
            # If it gets navigated away from the appointment page, it will
            # automatically re-run the navigation logic to get back.
            while self.is_running:
                # This will navigate to the appointment page. If it's already there, it will break quickly.
                navigator.navigate_to_target_state()
                if not self.is_running: break

                # This will run its own loop, checking for appointments.
                # If it ever gets navigated away, it will return.
                self._appointment_check_loop()
                if not self.is_running: break

                # If _appointment_check_loop returned, it means we are off-track.
                print(f"[{self.account}] Returned from check loop. Re-validating state...")
                time.sleep(3) # Small delay before re-navigating

        except Exception as e:
            # This block is entered if an error occurs during automation,
            # or if driver.quit() is called by stop_engine, which raises an exception.
            if self.is_running: # If it's an unexpected error, not a manual stop
                error_msg = str(e).split('\n')[0]
                print(f"❌ [Error in {self.account}]: {error_msg}")
                self.status = f"Error: {error_msg}"
        
        # When the loop breaks (is_running=False) or an exception occurs, the thread ends.
        print(f"[💡] Thread for {self.account} has exited.")

    def _appointment_check_loop(self) -> None:
            """
            Continuously checks for appointments on the booking page at a set interval.
            """
            print(f"[{self.account}] Now monitoring for appointments...")
            while self.is_running:
                # 1. Check if we are still on the correct page
                if "/appointment-booking/" not in self.driver.current_url:
                    self.status = "Re-routing: Off booking page."
                    print(f"🗺️ [{self.account}] {self.status} - returning to navigator.")
                    return # Exit the check loop to re-trigger navigation
                
                # 2. Perform the check
                found = self.check_appointment()
                
                if found:
                    self.status = "Appointments Found!"
                    self.appointment_found = True
                    print(f"✅✅✅ [{self.account}] APPOINTMENTS FOUND! ✅✅✅")
                    # Keep the browser open and status active until manually stopped
                    while self.is_running:
                        time.sleep(1)
                    return # Exit loop once found
                
                # 3. If not found, wait for the next interval
                # This logic supports two modes: synchronized (0-59s) and interval (>59s).
                
                target_second = self.target_sec
                if not (0 <= target_second <= 59):
                    # Interval Refresh Mode
                    interval = self.target_sec if self.target_sec > 0 else settings.APPOINTMENT_CHECK_INTERVAL_SECONDS
                    for i in range(interval, 0, -1):
                        if not self.is_running: return
                        self.countdown = i
                        self.status = f"No appointments. Retrying in {i}s..."
                        time.sleep(1)
                else:
                    # Synchronized Refresh Mode
                    while self.is_running and datetime.datetime.now().second != target_second:
                        remaining_seconds = (target_second - datetime.datetime.now().second + 60) % 60
                        self.countdown = remaining_seconds
                        self.status = f"No appointments. Syncing for : {target_second:02d}. Retrying in {remaining_seconds}s..."
                        time.sleep(1 - (datetime.datetime.now().microsecond / 1_000_000.0))
                
                # 4. Refresh the page to get new data
                if self.is_running:
                    print(f"[{self.account}] Performing direct refresh to check again...")
                    self.status = "Refreshing..."
                    self.driver.refresh()
                    time.sleep(5) # Wait for page to settle after refresh
    def check_appointment(self) -> bool:
        """
        Performs a single check on the current page for available appointments.
        This involves navigating to the correct month first.
        Returns True if an appointment is found, False otherwise.
        """
        try:
            self.status = f"Checking for month: {self.target_month}"
            
            # 1. Navigate to the correct month
            month_found = self._navigate_to_target_month()
            if not month_found:
                # Status is already set by the navigation method on failure
                return False

            # 2. Check for any "no slots" messages.
            # We get all text from the page's body and convert to lowercase for a case-insensitive search.
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

            # 3. As a positive confirmation, check if an actual appointment slot element is visible.
            # This avoids false positives if the "no slots" message is missing for some reason.
            if self.driver.is_element_visible(TLS_SELECTORS['appointment_booking']['available_slot']):
                print(f"    - 'No slots' message not found AND an available slot is visible. Appointments are available.")
                return True
            
            # 4. Fallback: If no negative message is found, but also no positive slot is found,
            # it's safer to assume there are no appointments. This can happen during page loads or with unexpected layouts.
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

            # Loop a max of 24 times to prevent infinite loops (e.g., 2 years of navigation)
            for _ in range(24):
                if not self.is_running: return False

                self.driver.wait_for_element_visible(TLS_SELECTORS['appointment_booking']['month_selector_container'])
                
                current_month_element = self.driver.find_element(TLS_SELECTORS['appointment_booking']['current_month_button'])
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
                    next_button_selector = TLS_SELECTORS['appointment_booking']['next_month_button']
                    if self.driver.is_element_visible(next_button_selector) and self.driver.is_element_clickable(next_button_selector):
                        print(f"    - Navigating from {current_month_text} to next month...")
                        self.driver.js_click(next_button_selector)
                        time.sleep(1.5)
                    else:
                        self.status = f"Error: Cannot reach '{self.target_month}'. 'Next' button is disabled."
                        print(f"❌ [{self.account}] {self.status}")
                        return False
                else: # target_date < current_date
                    prev_button_selector = TLS_SELECTORS['appointment_booking']['prev_month_button']
                    if self.driver.is_element_visible(prev_button_selector) and self.driver.is_element_clickable(prev_button_selector):
                        print(f"    - Navigating from {current_month_text} to previous month...")
                        self.driver.js_click(prev_button_selector)
                        time.sleep(1.5)
                    else:
                        self.status = f"Error: Cannot reach '{self.target_month}'. 'Previous' button is disabled."
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
        
        self.is_running = False # Signal thread to stop its loops
        
        if self.driver:
            try:
                self.driver.quit()
            except Exception:
                # Ignore errors, e.g., if browser was already closed manually
                pass
            self.driver = None
            
        if "Error" not in self.status and self.status != "Finished" and not self.appointment_found:
            self.status = "Terminated"

if __name__ == "__main__":
    bot = ChromeManager(
        account="tivime8259@preparmy.com",
        password="Yallavisa@@123", # Note: This is a test password
        target_month="September 2026", # Must include year
        target_city="Alexandria",
        target_hr=datetime.datetime.now().hour,
        target_min=datetime.datetime.now().minute,
        target_sec=(datetime.datetime.now().second + 10) % 60, # 10 seconds from now
        target_ms=0,
        url=BASE_URL # Testing from the base URL to verify routing works
    )

    bot.start_engine()
    try:
        bot.thread.join()
    except KeyboardInterrupt:
        bot.stop_engine()