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
        self.target_hr = int(target_hr)
        self.target_min = int(target_min)
        self.target_sec = int(target_sec)
        self.target_ms = int(target_ms)
        self.proxy_address = proxy_address
        
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
                is_running_flag=lambda: self.is_running
            )

            # 4. START THE INFINITE ROUTING LOOP
            navigator.navigate_to_target_state()

            # 5. APPOINTMENT CHECKING LOOP
            if self.is_running:
                self._appointment_check_loop()

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
                self.status = "Error: Navigated away from booking page."
                print(f"❌ [{self.account}] {self.status}")
                # Stop checking and idle with error status
                while self.is_running:
                    time.sleep(1)
                return
            
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
            self.status = f"No appointments. Retrying in {settings.APPOINTMENT_CHECK_INTERVAL_SECONDS}s..."
            
            # Sleep in small chunks to remain responsive to the stop signal
            for _ in range(settings.APPOINTMENT_CHECK_INTERVAL_SECONDS):
                if not self.is_running:
                    return
                time.sleep(1)
            
            # 4. Refresh the page to get new data
            if self.is_running:
                print(f"[{self.account}] Refreshing page to check again...")
                self.status = "Refreshing..."
                self.driver.refresh()
                time.sleep(5) # Wait for page to settle after refresh

    def check_appointment(self) -> bool:
        """
        Performs a single check on the current page for available appointments.
        Returns True if an appointment is found, False otherwise.
        """
        try:
            self.status = f"Checking for month: {self.target_month}"
            
            # 1. Select the target month
            self.driver.wait_for_element_visible(TLS_SELECTORS['appointment_booking']['month_selector_container'])
            month_buttons = self.driver.find_elements(TLS_SELECTORS['appointment_booking']['month_button'])
            
            month_found_and_clicked = False
            for button in month_buttons:
                if self.target_month.lower() in button.text.lower():
                    if "selected" not in button.get_attribute("class"):
                        self.driver.js_click(button)
                        print(f"    - Switched to month: {self.target_month}")
                        time.sleep(2) # Wait for calendar to update
                    month_found_and_clicked = True
                    break
            
            if not month_found_and_clicked:
                self.status = f"Error: Month '{self.target_month}' not found."
                print(f"❌ [{self.account}] {self.status}")
                return False

            # 2. Check for any "no slots" messages.
            # We get all text from the page's body and convert to lowercase for a case-insensitive search.
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
        password="Yallavisa@@123",
        target_month="September",
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