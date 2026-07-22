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
    def __init__(self, driver: Driver, account: str, password: str, is_running_flag: Callable[[], bool]):
        self.driver = driver
        self.account = account
        self.password = password
        self.is_running = is_running_flag
        self.actor = StealthActions(self.driver)
        self.captcha_handler = CaptchaHandler(self.driver)
        self.login_attempted_on_this_page = False

    def identify_current_page(self) -> str:
        WebDriverWait(self.driver, settings.WAIT_TIMEOUT_ELEMENT_READY).until(
            lambda d: d.execute_script('return document.readyState') == 'complete'
        )

        # Priority 0: Check for Cloudflare interstitial page.
        if "Just a moment..." in self.driver.get_title() and self.driver.is_element_visible(TLS_SELECTORS['cloudflare']['heading_text']):
            return "cloudflare_interstitial"

        # Priority 1: Check for the application list page, a key post-login state.
        if self.driver.is_element_visible(TLS_SELECTORS['application_list']['page_title_header']):
            if "Application manager" in self.driver.get_text(TLS_SELECTORS['application_list']['page_title_header']):
                return "application_list"

        # Priority 2: Check for the final logged-in state (the main dashboard for appointment checking).
        if self.driver.is_element_visible(TLS_SELECTORS['dashboard']['logged_in_anchor']):
            return "dashboard_ready"

        # Priority 3: Check for the login form itself.
        if self.driver.is_element_visible(TLS_SELECTORS['login_form']['email_input_field']):
            return "login_form"

        # Priority 4 & 5: Check for specific pre-login setup pages.
        if self.driver.is_element_visible(TLS_SELECTORS['choose_country']['select_dropdown']):
            return "choose_country"
        
        if self.driver.is_element_visible(TLS_SELECTORS['choose_city']['page_title_header']):
            if "Select your Visa Application Centre" in self.driver.get_text(TLS_SELECTORS['choose_city']['page_title_header']):
                return "choose_city"

        # Priority 6: As a fallback, if a login button is visible in the header,
        # we're on a generic info page and need to log in. This implements your request
        # for a global "logged-out" check.
        if self.driver.is_element_visible(TLS_SELECTORS['info_page']['header_login_btn']):
            return "info_page"

        return "unknown"

    def navigate_to_target_state(self) -> None:
        while self.is_running():
            current_state = self.identify_current_page()

            if current_state != "login_form":
                self.login_attempted_on_this_page = False
            
            if current_state == "dashboard_ready":
                print(f"[🎯] {self.account} reached Dashboard. Handing over to timing engine...")
                break 

            elif current_state != "unknown":
                print(f"[📍] {self.account} identified location: {current_state.upper()}")
                self._handle_current_state(current_state)
            else:
                print(f"[⚠️] {self.account} is on an unknown page. Waiting...")
                time.sleep(2)
            
            time.sleep(2)

    def _handle_current_state(self, current_state: str) -> None:
        try:
            if current_state == "cloudflare_interstitial":
                self.captcha_handler.solve_interstitial_captcha()
            elif current_state == "login_form":
                self._workflow_login()
            elif current_state == "choose_country":
                self._workflow_choose_country()
            elif current_state == "choose_city":
                self._workflow_choose_city()
            elif current_state == "application_list":
                self._workflow_application_list()
            elif current_state == "info_page":
                self._workflow_info_page()
        except Exception as e:
            print(f"[❌] {self.account} failed to handle {current_state}: {e}")

    def _workflow_login(self) -> None:
        if not self.login_attempted_on_this_page:
            print(f"[🔐] {self.account} injecting credentials...")
            self.actor.smart_type(TLS_SELECTORS['login_form']['email_input_field'], self.account)
            self.actor.natural_delay()
            self.actor.smart_type(TLS_SELECTORS['login_form']['password_input_field'], self.password)
            self.login_attempted_on_this_page = True
            print(f"    - Credentials entered. Checking for CAPTCHA...")
            time.sleep(2) 

        # Step 2: Check for CAPTCHA.
        if self.driver.is_element_visible(TLS_SELECTORS['login_form']['captcha_widget']):
            print(f"[🧩] {self.account} CAPTCHA detected on login form.")
            
            # Attempt to solve automatically
            success = self.captcha_handler.solve_google_recaptcha() 
            
            if success:
                print(f"    - CAPTCHA solved successfully. Submitting credentials.")
                self.actor.human_click(TLS_SELECTORS['login_form']['submit_login_btn'])
                print(f"[✅] {self.account} login submitted.")
                time.sleep(3) # Wait for page to route
            else:
                print(f"    - Audio Bypass Blocked or Failed. Waiting 10 seconds for manual CAPTCHA solve...")
                time.sleep(10)
                
                # Fallback: Check if user solved it manually during the wait
                try:
                    # Use standard Selenium API for frame switching for better stability
                    checkbox_iframe = self.driver.find_element("css selector", TLS_SELECTORS['recaptcha_v2']['checkbox_iframe'])
                    self.driver.switch_to.frame(checkbox_iframe)
                    is_checked = self.driver.get_attribute(TLS_SELECTORS['recaptcha_v2']['checkbox'], "aria-checked")
                    self.driver.switch_to.default_content()
                    
                    if str(is_checked).lower() == "true":
                        print(f"    - Manual CAPTCHA solve detected. Submitting credentials.")
                        self.actor.human_click(TLS_SELECTORS['login_form']['submit_login_btn'])
                        print(f"[✅] {self.account} login submitted.")
                        time.sleep(3)
                        return
                except Exception:
                    self.driver.switch_to.default_content()
                
                if self.identify_current_page() == "login_form":
                     print(f"[⚠️] Login stalled. Please solve CAPTCHA and click 'Login' manually.")
        else:
            print(f"    - No CAPTCHA detected. Submitting credentials.")
            self.actor.human_click(TLS_SELECTORS['login_form']['submit_login_btn'])
            print(f"[✅] {self.account} login submitted.")
            time.sleep(3)

    def _workflow_choose_country(self) -> None:
        print(f"[🌍] {self.account} handling country selection...")
        try:
            self.driver.wait_for_element_visible(TLS_SELECTORS['choose_country']['cookie_close_btn'], timeout=3)
            self.driver.click(TLS_SELECTORS['choose_country']['cookie_close_btn'])
            time.sleep(1) 
        except Exception:
            pass

        dropdown_selector = TLS_SELECTORS['choose_country']['select_dropdown']
        wait = WebDriverWait(self.driver, settings.WAIT_TIMEOUT_ELEMENT_READY)
        select_element = wait.until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, dropdown_selector))
        )
        
        select = Select(select_element)
        select.select_by_visible_text(settings.RESIDENCE['country'])

        print(f"    - Selected country: {settings.RESIDENCE['country']}")
        self.actor.natural_delay()
        self.actor.human_click(TLS_SELECTORS['choose_country']['confirm_country_btn'])
        print(f"    - Confirmed country selection.")

    def _workflow_choose_city(self) -> None:
        print(f"[🏢] {self.account} handling city selection...")
        city_name = settings.RESIDENCE['city']
        
        # This is a more robust way to find the city, by iterating through the cards
        # and matching the city name by text, rather than relying on a hardcoded href.
        city_cards_selector = "div.TlsVacCard_tls-vac-card__DLGQr"
        self.driver.wait_for_element_visible(city_cards_selector)
        cards = self.driver.find_elements(city_cards_selector)
        
        city_found = False
        for card in cards:
            try:
                card_title = card.find_element(By.CSS_SELECTOR, TLS_SELECTORS['choose_city']['city_card_title']).text
                
                if city_name.lower() in card_title.lower():
                    print(f"    - Found card for city: {card_title}")
                    continue_button = card.find_element(By.CSS_SELECTOR, TLS_SELECTORS['choose_city']['generic_continue_btn'])
                    self.driver.execute_script("arguments[0].click();", continue_button)
                    print(f"    - Clicked 'Continue' for {city_name}.")
                    city_found = True
                    break
            except Exception as e:
                print(f"    - Error processing a city card: {e}")
                continue
                
        if not city_found:
            print(f"[❌] CRITICAL: Could not find city card for '{city_name}'")
            time.sleep(10)

    def _workflow_info_page(self) -> None:
        print(f"[ℹ️] {self.account} found info page. Navigating to login...")
        self.actor.human_click(TLS_SELECTORS['info_page']['header_login_btn'])

    def _workflow_application_list(self) -> None:
        print(f"[📋] {self.account} on application list page. Clicking 'Select'...")
        try:
            self.actor.human_click(TLS_SELECTORS['application_list']['select_application_button'])
            print(f"    - 'Select' button clicked.")
            time.sleep(3) # Wait for next page
        except Exception as e:
            print(f"[❌] {self.account} could not find or click the 'Select' button on the application list page: {e}")
            time.sleep(5)