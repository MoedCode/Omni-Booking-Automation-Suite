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

from browsers.browser_base import BrowserBase
from config.settings import *

class ChromeManager:
    """
    Manages an isolated Chrome browser instance using pure threading.
    Handles lifecycle, threading, and precision timing.
    Delegates all page interaction to BrowserBase.
    """

    def __init__(
        self,
        account: str,
        password: str,
        url: str,
        target_hr: int = 0,
        target_min: int = 0,
        target_sec: int = 0,
        target_ms: int = 0,
        proxy_address: Optional[str] = None
    ) -> None:
        self.account = account
        self.password = password
        self.target_url = url
        self.target_hr = int(target_hr)
        self.target_min = int(target_min)
        self.target_sec = int(target_sec)
        self.target_ms = int(target_ms)
        self.proxy_address = proxy_address

        self.thread: Optional[threading.Thread] = None
        self.is_running = False
        self.driver = None
        # Status attribute for rich feedback to the GUI
        self.status = "Idle"

    def _build_stealth_profile(self) -> list:
        flags = [
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
            # 1. Initialize browser
            self.status = "Launching Driver"
            self.driver = Driver(
                uc=True,
                incognito=False,
                chromium_arg=",".join(self._build_stealth_profile())
            )

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

            # 5. Precision Timing (Wait for the exact millisecond)
            if self.is_running:
                self._wait_until_target()

            # 6. Trigger Action
            if self.is_running:
                self.status = "Executing Action"
                self._execute_action()
                self.status = "Action Executed"

        except Exception as e:
            error_msg = str(e).split('\n')[0] # Get a concise error message
            print(f"❌ [Error in {self.account}]: {error_msg}")
            self.status = f"Error: {error_msg}"
        finally:
            if self.is_running: # If not stopped by an error or manual termination
                self.status = "Finished"
            print(f"[💡] Process finished for {self.account}.")
            self.stop_engine()

    def _wait_until_target(self) -> None:
        """
        Waits until the specified H:M:S.ms. This loop is designed to be
        responsive to on-the-fly changes of the target time attributes from the GUI.
        """
        while self.is_running:
            # Re-calculate target_datetime in every loop to allow for hot-patching
            now = datetime.datetime.now()
            try:
                target_datetime = now.replace(
                    hour=self.target_hr, 
                    minute=self.target_min, 
                    second=self.target_sec, 
                    microsecond=self.target_ms * 1000,
                )
            except ValueError:
                self.status = f"Error: Invalid time {self.target_hr}:{self.target_min}:{self.target_sec}"
                print(f"❌ [{self.account}] {self.status}")
                self.stop_engine() # Stop this thread as it has invalid config
                return

            # If target time has already passed for today, aim for the next day
            if now > target_datetime:
                target_datetime += datetime.timedelta(days=1)

            self.status = f"Armed for {target_datetime.strftime('%H:%M:%S')}.{self.target_ms:03d}"

            # This is a busy-wait loop for high precision. A small sleep prevents 100% CPU usage
            # while remaining highly responsive to the exact target millisecond.
            while self.is_running and datetime.datetime.now() < target_datetime:
                time.sleep(0.001) # 1ms sleep for precision

            # If the loop was exited because the thread was stopped, just return.
            if not self.is_running:
                return

            # If we reached here, it's time to fire. Break the outer loop.
            break

    def _execute_action(self) -> None:
        print(f"🚀 [💥 FIRE] {self.account} executed at {time.time()}")

    def stop_engine(self) -> None:
        if not self.is_running: return
        self.is_running = False
        if self.driver:
            try:
                self.driver.quit()
            except:
                pass
            self.driver = None
        if "Error" not in self.status:
            self.status = "Terminated"

if __name__ == "__main__":
    bot = ChromeManager(
        account="tivime8259@preparmy.com",
        password="Yallavisa@@123",
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