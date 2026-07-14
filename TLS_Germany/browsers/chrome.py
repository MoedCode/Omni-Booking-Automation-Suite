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
        target_sec: int,
        target_ms: int,
        proxy_address: Optional[str] = None
    ) -> None:
        self.account = account
        self.password = password
        self.target_url = url
        self.target_sec = int(target_sec)
        self.target_ms = int(target_ms)
        self.proxy_address = proxy_address

        self.thread: Optional[threading.Thread] = None
        self.is_running = False
        self.driver = None

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

        try:
            # 1. Initialize browser
            self.driver = Driver(
                uc=True,
                incognito=False,
                chromium_arg=",".join(self._build_stealth_profile())
            )

            # 2. Navigate to the start URL
            self.driver.get(self.target_url)

            # 3. Hand over control to the BrowserBase (The State Machine)
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
                self._execute_action()

        except Exception as e:
            print(f"❌ [Error in {self.account}]: {e}")
        finally:
            print(f"[💡] Process finished for {self.account}.")
            self.stop_engine()

    def _wait_until_target(self) -> None:
        target_time = self.target_sec + (self.target_ms / 1000.0)
        print(f"🎯 [Armed] {self.account} waiting for {target_time}s")

        while self.is_running:
            now = time.time()
            if int(now) % 60 == self.target_sec:
                if (now - int(now)) >= (self.target_ms / 1000.0):
                    break
            time.sleep(0.001)

    def _execute_action(self) -> None:
        print(f"🚀 [💥 FIRE] {self.account} executed at {time.time()}")

    def stop_engine(self) -> None:
        self.is_running = False
        if self.driver:
            try:
                self.driver.quit()
            except:
                pass
            self.driver = None

if __name__ == "__main__":
    bot = ChromeManager(
        account="tivime8259@preparmy.com",
        password="Yallavisa@@123",
        target_sec=3,
        target_ms=500,
        url=BASE_URL # Testing from the base URL to verify routing works
    )

    bot.start_engine()
    try:
        bot.thread.join()
    except KeyboardInterrupt:
        bot.stop_engine()