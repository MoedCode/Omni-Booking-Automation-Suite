#!/usr/bin/env python3
"""
Omni-Booking-Automation-Suite/TLS_Germany/browsers/chrome.py
Synchronous Thread-Based Implementation
"""
import sys
import os
# Force Python to look one directory up (at TLS_Germany) so it can find the 'config' folder
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import threading
import time
from typing import Optional, Dict
from seleniumbase import Driver
from config.selectors import TLS_SELECTORS
from browsers.stealth_actions import StealthActions

class ChromeManager:
    """
    Manages an isolated Chrome browser instance using pure threading.
    Each instance runs in its own OS thread. No asyncio required.
    Designed for zero-disk footprint and maximum performance.
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
        """Returns browser flags optimized for performance and zero-disk usage."""
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
        """Spawns an isolated hardware thread for the account."""
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
        """Main sequential execution logic running inside the thread."""
        print(f"[🧵] Thread started for: {self.account}")

        try:
            # 1. Initialize browser
            self.driver = Driver(
                uc=True,
                incognito=False,
                chromium_arg=",".join(self._build_stealth_profile())
            )
            
            # 2. Login Workflow
            self._perform_login()

            # 3. Precision Timing
            self._wait_until_target()

            # 4. Trigger Action
            if self.is_running:
                self._execute_action()

        except Exception as e:
            print(f"❌ [Error in {self.account}]: {e}")
        finally:
            print(f"[💡] Process finished for {self.account}.")

    def _perform_login(self) -> None:
        """Navigates and types credentials sequentially."""
        self.driver.get(self.target_url)
        
        # Instantiate StealthActions for this thread
        actor = StealthActions(self.driver)
        
        # Sequentially perform login
        actor.smart_type(TLS_SELECTORS['login_form']['email_input_field'], self.account)
        actor.natural_delay()
        actor.smart_type(TLS_SELECTORS['login_form']['password_input_field'], self.password)
        actor.human_click(TLS_SELECTORS['login_form']['submit_login_btn'])
        print(f"[✅] {self.account} logged in.")

    def _wait_until_target(self) -> None:
        """High-precision sync wait loop without asyncio."""
        target_time = self.target_sec + (self.target_ms / 1000.0)
        print(f"🎯 [Armed] {self.account} waiting for {target_time}s")

        while self.is_running:
            now = time.time()
            # Logic: check current second and millisecond
            if int(now) % 60 == self.target_sec:
                # Tight precision check
                if (now - int(now)) >= (self.target_ms / 1000.0):
                    break
            
            # Small sleep to keep CPU usage low
            time.sleep(0.001)

    def _execute_action(self) -> None:
        """Fires the trigger."""
        print(f"🚀 [💥 FIRE] {self.account} executed at {time.time()}")

    def stop_engine(self) -> None:
        """Gracefully quits the driver."""
        self.is_running = False
        if self.driver:
            try:
                self.driver.quit()
            except:
                pass
            self.driver = None

if __name__ == "__main__":
    # Test logic
    from config.settings import START_URL
    
    bot = ChromeManager(
        account="tivime8259@preparmy.com",
        password="Yallavisa@@123",
        target_sec=3,
        target_ms=500,
        url=START_URL
    )
    
    bot.start_engine()
    
    try:
        # Keep main thread alive
        bot.thread.join()
    except KeyboardInterrupt:
        bot.stop_engine()