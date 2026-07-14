"""
Omni-Booking-Automation-Suite/TLS_Germany/browsers/browser_base.py
Handles page identification and specific page interactions continuously.
"""
import time
from typing import Callable
from seleniumbase import Driver
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from config import settings
from config.selectors import TLS_SELECTORS
from browsers.stealth_actions import StealthActions
from browsers.captcha_handler import CaptchaHandler

class BrowserBase:
    """
    Acts as the 'Brain' of the browser. Evaluates the current DOM state,
    identifies the page, and executes human-like actions in a continuous loop.
    """

    def __init__(self, driver: Driver, account: str, password: str, is_running_flag: Callable[[], bool]):
        self.driver = driver
        self.account = account
        self.password = password
        self.is_running = is_running_flag
        self.actor = StealthActions(self.driver)
        self.captcha_handler = CaptchaHandler(self.driver)
        self.login_attempted_on_this_page = False

    def identify_current_page(self) -> str:
        """
        Scans the page for unique element landmarks to determine the current state.
        """
        # Wait for the page to finish basic loading
        WebDriverWait(self.driver, settings.WAIT_TIMEOUT_ELEMENT_READY).until(
            lambda d: d.execute_script('return document.readyState') == 'complete'
        )

        # State identification is hierarchical. More specific pages first.

        # Is it the login form? This is a very distinct page.
        if self.driver.is_element_visible(TLS_SELECTORS['login_form']['email_input_field']):
            return "login_form"

        # Is it a full-page Cloudflare challenge?
        if "Just a moment..." in self.driver.get_title() and self.driver.is_element_visible(TLS_SELECTORS['cloudflare']['challenge_iframe']):
            return "cloudflare_captcha"

        # Check other landmarks
        if self.driver.is_element_visible(TLS_SELECTORS['choose_country']['select_dropdown']):
            return "choose_country"
        elif self.driver.is_element_visible(TLS_SELECTORS['choose_city']['search_submit_btn']):
            return "choose_city"
        elif self.driver.is_element_visible(TLS_SELECTORS['info_page']['header_login_btn']):
            return "info_page"
        elif self.driver.is_element_visible(TLS_SELECTORS['dashboard']['logged_in_anchor']):
            return "dashboard_ready"

        return "unknown"

    def navigate_to_target_state(self) -> None:
        """
        THE INFINITE LOOP: Constantly looks at the screen and moves forward 
        until the target dashboard state is reached or the thread is stopped.
        """
        while self.is_running():
            current_state = self.identify_current_page()

            # If we are no longer on the login page, reset the attempt flag.
            # This allows for a fresh login attempt if we return to this page later.
            if current_state != "login_form":
                self.login_attempted_on_this_page = False
            
            if current_state == "dashboard_ready":
                print(f"[🎯] {self.account} reached Dashboard. Handing over to timing engine...")
                break # Exit the routing loop
                
            elif current_state == "cloudflare_captcha":
                print(f"[🛡️] {self.account} hit Cloudflare Captcha. Standing by...")
                time.sleep(3) # Wait for auto-resolve or manual intervention

            elif current_state != "unknown":
                print(f"[📍] {self.account} identified location: {current_state.upper()}")
                self._handle_current_state(current_state)
            else:
                print(f"[⚠️] {self.account} is on an unknown page. Waiting...")
                time.sleep(2)
            
            # Brief pause to mimic human reaction and prevent tight-loop CPU overload
            time.sleep(2)

    def _handle_current_state(self, current_state: str) -> None:
        """Routes to the correct workflow based on the detected state."""
        try:
            if current_state == "login_form":
                self._workflow_login()
            elif current_state == "choose_country":
                self._workflow_choose_country()
            elif current_state == "choose_city":
                self._workflow_choose_city()
            elif current_state == "info_page":
                self._workflow_info_page()
        except Exception as e:
            print(f"[❌] {self.account} failed to handle {current_state}: {e}")

    # ==========================================
    # 🛠️ SPECIFIC PAGE WORKFLOWS
    # ==========================================

    def _workflow_login(self) -> None:
        """
        Executes the login sequence. Types credentials once, then waits for CAPTCHA
        or submits if no CAPTCHA is found.
        """
        # Step 1: Type credentials, but only if we haven't already on this page load.
        if not self.login_attempted_on_this_page:
            print(f"[🔐] {self.account} injecting credentials...")
            self.actor.smart_type(TLS_SELECTORS['login_form']['email_input_field'], self.account)
            self.actor.natural_delay()
            self.actor.smart_type(TLS_SELECTORS['login_form']['password_input_field'], self.password)
            self.login_attempted_on_this_page = True
            print(f"    - Credentials entered. Checking for CAPTCHA...")
            time.sleep(2) # Give CAPTCHA a moment to load after typing

        # Step 2: Check for CAPTCHA.
        if self.driver.is_element_visible(TLS_SELECTORS['login_form']['captcha_widget']):
            print(f"[🧩] {self.account} CAPTCHA detected on login form.")
            self.captcha_handler.solve_login_captcha() # Placeholder call
            
            # Per user request, wait and then warn if still on the same page.
            print(f"    - Waiting 10 seconds for manual CAPTCHA solve...")
            time.sleep(10)
            
            if self.identify_current_page() == "login_form":
                 print(f"[⚠️] Login stalled. Please solve CAPTCHA and click 'Login' manually.")
        else:
            # Step 3: No CAPTCHA is visible, so we can submit.
            print(f"    - No CAPTCHA detected. Submitting credentials.")
            self.actor.human_click(TLS_SELECTORS['login_form']['submit_login_btn'])
            print(f"[✅] {self.account} login submitted.")

    def _workflow_choose_country(self) -> None:
        """Executes the country selection dynamically."""
        print(f"[🌍] {self.account} handling country selection...")

        # Handle cookie banner if it appears. This makes the script more robust.
        try:
            # Use a short timeout as the banner may not exist.
            # This will raise an exception if not found, which we catch.
            self.driver.wait_for_element_visible(TLS_SELECTORS['choose_country']['cookie_close_btn'], timeout=3)
            print(f"    - Cookie banner detected. Closing it.")
            self.driver.click(TLS_SELECTORS['choose_country']['cookie_close_btn'])
            time.sleep(1) # Short delay for UI to update
        except Exception:
            # If the banner isn't there, we just continue.
            pass

        # Use standard Selenium for dropdowns for maximum compatibility
        dropdown_selector = TLS_SELECTORS['choose_country']['select_dropdown']
        
        # 1. Wait for the dropdown to be clickable and find it
        wait = WebDriverWait(self.driver, settings.WAIT_TIMEOUT_ELEMENT_READY)
        select_element = wait.until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, dropdown_selector))
        )
        
        # 2. Use the Select class to choose the option
        select = Select(select_element)
        select.select_by_visible_text(settings.RESIDENCE['country'])

        print(f"    - Selected country: {settings.RESIDENCE['country']}")
        self.actor.natural_delay()

        # 3. Click the confirmation button
        self.actor.human_click(TLS_SELECTORS['choose_country']['confirm_country_btn'])
        print(f"    - Confirmed country selection.")

    def _workflow_choose_city(self) -> None:
        """Executes the city selection dynamically."""
        print(f"[🏢] {self.account} handling city selection...")
        
        city_name = settings.RESIDENCE['city']
        selector_key = f"{city_name.lower().replace(' ', '_')}_center_route"

        try:
            city_selector = TLS_SELECTORS['choose_city'][selector_key]
            print(f"    - Found selector for city '{city_name}': {city_selector}")
            self.actor.human_click(city_selector)
            print(f"    - Clicked on city link for {city_name}.")
        except KeyError:
            print(f"[❌] CRITICAL: No selector found for city '{city_name}' with key '{selector_key}'.")
            print(f"    Please check RESIDENCE['city'] in 'config/settings.py' and 'config/selectors.py'.")
            time.sleep(10) # Pause to make the error obvious

    def _workflow_info_page(self) -> None:
        """Clicks the login button if stuck on the info page."""
        print(f"[ℹ️] {self.account} found info page. Navigating to login...")