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
        # We can add selectors dynamically later, but these are the mandatory inputs
        selectors: Optional[Dict[str, str]] = None 
    ) -> None:
        """
        Initializes the Chrome Manager with strictly mandatory execution parameters.
        """
        # Mandatory Credentials & Targets
        self.account = account
        self.password = password
        self.target_url = url
        self.target_sec = int(target_sec)
        self.target_ms = int(target_ms)
        
        # Element Selectors (The "Smart Way" to handle UI changes)
        self.selectors = selectors or {}

        # Concurrency & State Anchors
        self.thread: Optional[threading.Thread] = None
        self.is_running = False
        self.driver = None

    def _build_stealth_profile(self) -> list:
        """
        Generates Chromium CLI arguments to enforce strict isolation and WAF evasion.
        Ensures each account acts as a completely distinct physical machine.
        """
        # Create a unique profile folder based on the account email
        safe_email_name = "".join([c if c.isalnum() else "_" for c in self.account])
        profile_path = os.path.abspath(f"./runtime_profiles/{safe_email_name}")
        
        flags = [
            f"--user-data-dir={profile_path}",
            "--window-size=1280,800",
            "--disable-blink-features=AutomationControlled",
            "--disable-infobars",
            "--no-sandbox"
        ]
        return flags

    def start_engine(self) -> None:
        """
        Triggered by the main GUI Window.
        Spawns a raw, isolated physical hardware thread for this specific account.
        """
        if self.is_running:
            print(f"[⚠️] Engine for {self.account} is already running.")
            return

        self.is_running = True
        self.thread = threading.Thread(
            target=self._thread_entry, 
            name=f"Thread_{self.account}", 
            daemon=True # Ensures thread dies if main app closes
        )
        self.thread.start()

    def _thread_entry(self) -> None:
        """
        Runs entirely inside the newly allocated OS thread.
        Initializes the Async Event loop for precise micro-timing.
        """
        print(f"[🧵 OS Thread] Physical isolation active for: {self.account}")
        
        # Create and run a new event loop strictly for this physical thread
        asyncio.run(self._async_core_lifecycle())

    async def _async_core_lifecycle(self) -> None:
        """
        The local async engine that controls the browser workflow.
        """
        print(f"[🔄 Async Loop] Booting Stealth Browser for {self.account}...")
        
        try:
            extra_flags = self._build_stealth_profile()
            
            # Initialize SeleniumBase Undetected ChromeDriver
            self.driver = Driver(
                uc=True,
                incognito=False, # We want persistent sessions in the profile dir
                chromium_arg=",".join(extra_flags)
            )
            
            # Step 1: Initial Navigation & Login (The Smart POM approach)
            await self._perform_login_workflow()
            
            # Step 2: Precision Wait Loop
            await self._precision_wait_loop()
            
            # Step 3: The Millisecond Trigger
            if self.is_running:
                await self._fire_booking_trigger()

        except Exception as e:
            print(f"❌ [Error] Instance {self.account} crashed: {str(e)}")
        finally:
            self.stop_engine()

    async def _perform_login_workflow(self) -> None:
        """
        Handles the pre-booking setup: navigating to the URL, logging in, 
        and getting to the target booking page.
        """
        if not self.driver:
            return

        print(f"[🌐] {self.account} navigating to: {self.target_url}")
        
        # We use asyncio.to_thread here to prevent the synchronous SeleniumBase commands
        # from temporarily blocking our async loop if the network is slow.
        await asyncio.to_thread(self.driver.get, self.target_url)
        
        # --- Example of Smart Element Handling ---
        # Instead of self.driver.find_element(By.ID, "username").send_keys(...)
        # We use SeleniumBase's built-in smart waits: type() waits for the element to be ready.
        
        # if 'email_field' in self.selectors:
        #     await asyncio.to_thread(self.driver.type, self.selectors['email_field'], self.account)
        #     await asyncio.to_thread(self.driver.type, self.selectors['password_field'], self.password)
        #     await asyncio.to_thread(self.driver.click, self.selectors['login_button'])
        
        print(f"[✅] {self.account} Login workflow complete. Awaiting sync...")

    async def _precision_wait_loop(self) -> None:
        """
        Tight microsecond check frame.
        """
        target_fraction = self.target_ms / 1000.0
        print(f"[⏱️] {self.account} Armed -> Target: {self.target_sec}s : {self.target_ms}ms")

        while self.is_running:
            now = time.time()
            current_sec = int(now) % 60
            
            # Stage 1: Coarse Sleep (Save CPU)
            if (self.target_sec - current_sec) % 60 > 1:
                await asyncio.sleep(0.1)
                continue
            
            # Stage 2: Microsecond Spin-Lock
            current_fraction = now - int(now)
            if current_sec == self.target_sec and current_fraction >= target_fraction:
                break
                
            await asyncio.sleep(0) 

    async def _fire_booking_trigger(self) -> None:
        """
        Execute actions precisely on the millisecond target.
        """
        fire_time = time.time()
        actual_ms = int((fire_time - int(fire_time)) * 1000)
        print(f"🚀 [💥 FIRE] {self.account} executed at {int(fire_time)%60}s : {actual_ms}ms")
        
        if self.driver:
            # Example: Click the refresh or booking button exactly now
            # await asyncio.to_thread(self.driver.click, self.selectors['refresh_button'])
            pass

    def stop_engine(self) -> None:
        """
        Gracefully terminates the thread and the browser.
        Can be triggered externally by the GUI's 'Stop' button.
        """
        self.is_running = False
        if self.driver:
            print(f"[🛑] Shutting down browser for {self.account}...")
            try:
                self.driver.quit()
            except:
                pass
            self.driver = None

if __name__ == "__main__":
    url = "https://auth.visas-de.tlscontact.com/auth/realms/atlas/protocol/openid-connect/auth?client_id=tlscitizen&redirect_uri=https%3A%2F%2Fvisas-de.tlscontact.com%2Fen-us%2Fauth-callback&state=%257B%2522csrf%2522%253A%2522dc7bdf04-a25f-42cb-9b16-80d9b8bd4feb%2522%257D&response_mode=query&response_type=code&scope=openid&nonce=499c5a00-d3c6-4c91-be14-13b22a03006e&ui_locales=en"
    chrome_instant = ChromeManager(
        account="tivime8259@preparmy.com",
        password="Yallavisa@@123", target_sec=3 , target_ms=500, url=url
    )
    chrome_instant.start_engine()