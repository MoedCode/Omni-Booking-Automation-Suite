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
                # This logic supports two modes based on the value of `self.target_sec`:
                # 1. Synchronized Refresh: If `target_sec` is 0-59, the refresh is synchronized
                #    to that specific second of every minute. The countdown reflects time until that sync point.
                # 2. Interval Refresh: If `target_sec` is outside the 0-59 range, it's treated as a
                #    simple countdown interval in seconds.
                
                target_second = self.target_sec
                
                # If target_sec is not a valid second (0-59), use simple interval mode.
                if not (0 <= target_second <= 59):
                    interval = self.target_sec if self.target_sec > 0 else settings.APPOINTMENT_CHECK_INTERVAL_SECONDS
                    for i in range(interval, 0, -1):
                        if not self.is_running:
                            self.countdown = 0
                            return
                        self.countdown = i
                        self.status = f"No appointments. Retrying in {i}s..."
                        time.sleep(1)
                else:
                    # Synchronized refresh mode. This loop runs roughly once per second.
                    while self.is_running and datetime.datetime.now().second != target_second:
                        remaining_seconds = (target_second - datetime.datetime.now().second + 60) % 60
                        self.countdown = remaining_seconds
                        self.status = f"No appointments. Syncing for : {target_second:02d}. Retrying in {remaining_seconds}s..."
                        # Sleep for almost a second, waking up just before the next second starts.
                        time.sleep(1 - (datetime.datetime.now().microsecond / 1_000_000.0))
                
                # 4. Refresh the page to get new data
                # Soft Refresh: Navigate away and back to the booking page to trigger a data fetch
                # without a full page reload, which can cause React hydration errors on this SPA.
                if self.is_running:
                    print(f"[{self.account}] Performing soft refresh to check again...")
                    self.status = "Refreshing..."
                    try:
                        self.driver.click(TLS_SELECTORS['appointment_booking']['services_breadcrumb'])
                        time.sleep(1.5)
                        self.driver.click(TLS_SELECTORS['appointment_booking']['booking_breadcrumb'])
                        time.sleep(5) # Wait for page to settle after soft refresh
                    except Exception as e:
                        # Fallback to hard refresh if soft refresh fails for any reason
                        print(f"    - Soft refresh failed: {str(e).splitlines()[0]}. Falling back to hard refresh.")
                        self.driver.refresh()
                        time.sleep(5)
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
        Checks the currently visible months in the selector.
        If the target month is a button, it's clicked. If it's a <p> tag, it's already selected.
        This is a direct-action method and does not perform sequential navigation.
        Returns True on success, False on failure.
        """
        try:
            # Wait for the container holding the month buttons/labels to be visible
            container_selector = TLS_SELECTORS['appointment_booking']['month_selector_container']
            self.driver.wait_for_element_visible(container_selector, timeout=10)
            
            # Find all clickable buttons and non-clickable labels within the container
            month_elements = self.driver.find_elements(f"{container_selector} > *")

            if not month_elements:
                self.status = "Error: Month selector container is empty."
                print(f"❌ [{self.account}] {self.status}")
                return False

            for element in month_elements:
                # Check if the element's text matches the target month (e.g., "August 2026")
                if self.target_month.lower() in element.text.lower():
                    # If it's a <p> tag, it's the currently selected month.
                    if element.tag_name == 'p':
                        print(f"    - Month '{self.target_month}' is already selected.")
                        return True
                    
                    # If it's a <button> tag, it's an available (but not selected) month.
                    elif element.tag_name == 'button':
                        print(f"    - Found month '{self.target_month}' as a button. Clicking it...")
                        self.driver.execute_script("arguments[0].click();", element)
                        time.sleep(2) # Wait for the calendar to update after the click
                        return True

            # If the loop completes, the target month was not found in the visible elements.
            self.status = f"Error: Target month '{self.target_month}' not visible in the selector."
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