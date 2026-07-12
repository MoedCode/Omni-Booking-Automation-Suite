#!/usr/bin/env python3
"""
Omni-Booking-Automation-Suite/TLS_Germany/browsers/chrome.py
"""

import threading
import asyncio
import time
import os
from typing import Optional, Dict

# Standard SeleniumBase import for Undetected Mode
from seleniumbase import Driver

class ChromeManager:
    """
    Manages an isolated, stealthy Chrome browser instance for a single account.
    Implements a Hybrid Concurrency Model: OS Threads for physical browser isolation,
    and Asyncio Coroutines for microsecond precision timing.
    """

    def __init__(
        self,
        account: str,
        password: str,
        url: str,
        target_sec: int,
        target_ms: int,
        selectors: Optional[Dict[str, str]] = None,
        proxy_address: Optional[str] = None
    ) -> None:
        """
        Initializes the Chrome Manager with execution parameters.
        """
        # Mandatory Credentials & Targets
        self.account = account
        self.password = password
        self.target_url = url
        self.target_sec = int(target_sec)
        self.target_ms = int(target_ms)

        # Optional Network & UI Configurations
        self.selectors = selectors or {}
        self.proxy_address = proxy_address

        # Concurrency & State Anchors
        self.thread: Optional[threading.Thread] = None
        self.is_running = False
        self.driver = None

    def _build_stealth_profile(self) -> list:
        """
        Generates Chromium CLI arguments to enforce strict isolation and WAF evasion.
        """
        # Create a safe folder name based on the email address
        safe_email_name = "".join([c if c.isalnum() else "_" for c in self.account])
        profile_path = os.path.abspath(f"./runtime_profiles/{safe_email_name}")

        flags = [
            f"--user-data-dir={profile_path}",
            "--window-size=1280,800",
            "--disable-blink-features=AutomationControlled",
            "--disable-infobars",
            "--no-sandbox"
        ]
        
        # Centralized Network Plan: Inject a single proxy if provided in the data sheet
        if self.proxy_address:
            flags.append(f"--proxy-server={self.proxy_address}")

        return flags

    def start_engine(self) -> None:
        """
        Spawns an isolated physical hardware thread for this specific account.
        """
        if self.is_running:
            print(f"[⚠️] Engine for {self.account} is already running.")
            return

        self.is_running = True
        self.thread = threading.Thread(
            target=self._thread_entry,
            name=f"Thread_{self.account}",
            daemon=True 
        )
        self.thread.start()

    def _thread_entry(self) -> None:
        """
        Initializes the Async Event loop inside the newly allocated OS thread.
        """
        print(f"[🧵 OS Thread] Physical isolation active for: {self.account}")
        asyncio.run(self._async_core_lifecycle())

    async def _async_core_lifecycle(self) -> None:
        """
        The local async engine controlling the browser setup and execution.
        """
        print(f"[🔄 Async Loop] Booting Stealth Browser for {self.account}...")

        try:
            extra_flags = self._build_stealth_profile()

            # Initialize SeleniumBase Undetected ChromeDriver
            self.driver = Driver(
                uc=True,
                incognito=False,
                chromium_arg=",".join(extra_flags)
            )

            # Step 1: Initial Navigation & Login Workflow
            await self._perform_login_workflow()

            # Step 2: Precision Wait Loop (Targeting specific seconds/milliseconds)
            await self._precision_wait_loop()

            # Step 3: The Millisecond Trigger (Fires the action)
            if self.is_running:
                await self._fire_booking_trigger()

        except Exception as e:
            print(f"❌ [Error in Lifecycle for {self.account}]: {str(e)}")
        finally:
            # Leave the browser open for visual review without closing immediately
            print(f"[💡] Process finished for {self.account}. Browser remains open for review.")

    async def _perform_login_workflow(self) -> None:
        """
        Handles the initial page navigation asynchronously.
        """
        if not self.driver:
            return
            
        print(f"[🌐] {self.account} navigating to target URL...")
        await asyncio.to_thread(self.driver.get, self.target_url)
        
        # NOTE: Once your StealthActions class is ready, integrate it here like this:
        # self.actor = StealthActions(self.driver)
        # await self.actor.smart_type(TLS_SELECTORS['login_form']['email_input_field'], self.account)

    async def _precision_wait_loop(self) -> None:
        """
        High-precision timing engine utilizing coarse and fine sleep phases.
        """
        target_fraction = self.target_ms / 1000.0
        print(f"🎯 [Armed] {self.account} locked target -> {self.target_sec}s : {self.target_ms}ms")

        while self.is_running:
            now = time.time()
            current_sec = int(now) % 60

            # Stage 1: Coarse Sleep (Save CPU if target is far away)
            if (self.target_sec - current_sec) % 60 > 1:
                await asyncio.sleep(0.1)
                continue

            # Stage 2: Microsecond Spin-Lock (Final second precision)
            current_fraction = now - int(now)
            if current_sec == self.target_sec and current_fraction >= target_fraction:
                break

            await asyncio.sleep(0) # Yield control instantly to keep loop responsive

    async def _fire_booking_trigger(self) -> None:
        """
        Executes actions precisely on the millisecond target.
        """
        fire_time = time.time()
        actual_ms = int((fire_time - int(fire_time)) * 1000)
        print(f"🚀 [💥 FIRE] {self.account} executed hit at {int(fire_time)%60}s : {actual_ms}ms")

    def stop_engine(self) -> None:
        """
        Gracefully signals the loop to stop and cleans up the browser driver.
        """
        self.is_running = False
        if self.driver:
            try:
                self.driver.quit()
            except:
                pass
            self.driver = None


if __name__ == "__main__":
    # Test URL for authentication
    TEST_URL = "https://auth.visas-de.tlscontact.com/auth/realms/atlas/protocol/openid-connect/auth?client_id=tlscitizen&redirect_uri=https%3A%2F%2Fvisas-de.tlscontact.com%2Fen-us%2Fauth-callback&state=%257B%2522csrf%2522%253A%2522dc7bdf04-a25f-42cb-9b16-80d9b8bd4feb%2522%257D&response_mode=query&response_type=code&scope=openid&nonce=499c5a00-d3c6-4c91-be14-13b22a03006e&ui_locales=en"
    
    # Initialize the object
    chrome_instant = ChromeManager(
        account="tivime8259@preparmy.com",
        password="Yallavisa@@123", 
        target_sec=3, 
        target_ms=500, 
        url=TEST_URL
        # proxy_address="192.168.0.1:8080" # Pass proxy here if needed
    )
    
    # Start the engine
    chrome_instant.start_engine()
    
    # 🌟 The Graceful Shutdown Logic (Fixes the Fatal Python Error)
    try:
        # Command the main thread to wait for the browser thread to finish naturally
        if chrome_instant.thread:
            chrome_instant.thread.join()
            
    except KeyboardInterrupt:
        # Triggers immediately if you press Ctrl+C in the terminal
        print("\n[🛑] Force stop detected! Shutting down engines gracefully...")
        chrome_instant.stop_engine()
        
        # Wait briefly for the browser process to clean up its memory
        if chrome_instant.thread:
            chrome_instant.thread.join(timeout=3.0) 
            
        print("✅ Shutdown complete.")