"""
Omni-Booking-Automation-Suite/TLS_Germany/browsers/browser_base.py
Handles page identification and specific page interactions continuously.
"""
import ctypes
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
    def __init__(self, driver: Driver, account: str, password: str, target_city: str, is_running_flag: Callable[[], bool]):
        self.driver = driver
        self.account = account
        self.password = password
        self.target_city = target_city
        self.is_running = is_running_flag
        self.actor = StealthActions(self.driver)
        self.captcha_handler = CaptchaHandler(self.driver)
        self.login_attempted_on_this_page = False

    def identify_current_page(self) -> str:
        WebDriverWait(self.driver, settings.WAIT_TIMEOUT_ELEMENT_READY).until(
            lambda d: d.execute_script('return document.readyState') == 'complete'
        )

        # Priority 0: Cloudflare
        if "Just a moment..." in self.driver.get_title() and self.driver.is_element_visible(TLS_SELECTORS['cloudflare']['heading_text']):
            return "cloudflare_interstitial"

        # Priority 1: Target Page - Appointment Booking (check this early)
        if self.driver.is_element_present(TLS_SELECTORS['appointment_booking']['page_title']):
            try:
                if "book your appointment" in self.driver.get_text(TLS_SELECTORS['appointment_booking']['page_title']).lower():
                    return "appointment_booking"
            except Exception:
                pass

        # Priority 2: Service Level (precedes appointment booking)
        if self.driver.is_element_visible(TLS_SELECTORS['service_level']['continue_btn']):
            return "service_level"

        # Priority 3: Application List
        if self.driver.is_element_present(TLS_SELECTORS['application_list']['page_title_header']):
            try:
                if "application manager" in self.driver.get_text(TLS_SELECTORS['application_list']['page_title_header']).lower():
                    return "application_list"
            except Exception:
                pass

        # Priority 4: Login Form
        if self.driver.is_element_visible(TLS_SELECTORS['login_form']['email_input_field']):
            return "login_form"

        # Priority 5 & 6: Pre-login setup
        if self.driver.is_element_visible(TLS_SELECTORS['choose_country']['select_dropdown']):
            return "choose_country"
        
        if self.driver.is_element_present(TLS_SELECTORS['choose_city']['page_title_header']):
            try:
                if "select your visa application centre" in self.driver.get_text(TLS_SELECTORS['choose_city']['page_title_header']).lower():
                    return "choose_city"
            except Exception:
                pass

        # Priority 7: Logged-in Welcome/Info Page
        if self.driver.is_element_visible(TLS_SELECTORS['info_page']['user_icon_button']):
            if self.driver.is_element_present("h1#page-title"):
                try:
                    if "welcome to the visa application centre" in self.driver.get_text("h1#page-title").lower():
                        return "logged_in_info_page"
                except Exception:
                    pass
        
        # Priority 8: Generic pre-login info page
        if self.driver.is_element_visible(TLS_SELECTORS['info_page']['header_login_btn']):
            return "info_page"
                
        return "unknown"

    def navigate_to_target_state(self) -> None:
        while self.is_running():
            current_state = self.identify_current_page()

            if current_state != "login_form":
                self.login_attempted_on_this_page = False
            
            if current_state == "appointment_booking":
                print(f"[🎯] {self.account} reached Appointment Booking page. Handing over to appointment checker...")
                break 

            elif current_state != "unknown":
                print(f"[📍] {self.account} identified location: {current_state.upper()}")
                self._handle_current_state(current_state)
            else:
                print(f"[⚠️] {self.account} is on an unknown page. Waiting...")
                time.sleep(2)
            
            time.sleep(2)

    def _show_windows_alert(self, title: str, text: str) -> None:
        """Shows a native Windows message box. This is a blocking call."""
        try:
            # MB_OK | MB_ICONERROR | MB_SYSTEMMODAL
            ctypes.windll.user32.MessageBoxW(0, text, title, 0x10 | 0x1000)
        except Exception as e:
            print(f"[⚠️] Could not show Windows alert: {e}")

    def _handle_current_state(self, current_state: str) -> None:
        try:
            if current_state == "cloudflare_interstitial":
                self.captcha_handler.cloudflare()
            elif current_state == "login_form":
                self._workflow_login()
            elif current_state == "choose_country":
                self._workflow_choose_country()
            elif current_state == "choose_city":
                self._workflow_choose_city()
            elif current_state == "application_list":
                self._workflow_application_list()
            elif current_state == "service_level":
                self._workflow_service_level()
            elif current_state == "info_page":
                self._workflow_info_page()
            elif current_state == "logged_in_info_page":
                self._workflow_logged_in_info_page()
        except Exception as e:
            # Check for our specific fatal error to re-raise it.
            if isinstance(e, ValueError) and "Invalid username or password" in str(e):
                raise  # Propagate the fatal error up to the main thread loop to terminate.
            
            # Otherwise, log it as a non-fatal error and allow the bot to continue.
            print(f"[❌] {self.account} failed to handle {current_state}: {e}")

    def _workflow_login(self) -> None:
        # Check for invalid credentials error first. This runs every time we land on the login page.
        invalid_creds_selector = TLS_SELECTORS['login_form']['invalid_credentials_error']
        if self.driver.is_element_visible(invalid_creds_selector):
            print(f"[❌] {self.account} Invalid credentials detected on page.")
            self._show_windows_alert(
                "Invalid Credentials",
                f"The account '{self.account}' has invalid login credentials.\n\nThe bot for this instance will be terminated."
            )
            # Raise a specific exception to be caught and handled by the main thread loop.
            raise ValueError("Invalid username or password.")

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
            success = self.captcha_handler.solve_google_recaptcha() 
            
            if success:
                print(f"    - CAPTCHA solved successfully. Submitting credentials.")
                self.actor.human_click(TLS_SELECTORS['login_form']['submit_login_btn'])
                print(f"[✅] {self.account} login submitted.")
                time.sleep(3)
            else:
                print(f"    - Audio Bypass Blocked or Failed. Waiting 10 seconds for manual CAPTCHA solve...")
                time.sleep(10)
                try:
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
        select.select_by_visible_text(settings.DEFAULT_INSTANCE_SETTINGS['country'])

        print(f"    - Selected country: {settings.DEFAULT_INSTANCE_SETTINGS['country']}")
        self.actor.natural_delay()
        self.actor.human_click(TLS_SELECTORS['choose_country']['confirm_country_btn'])
        print(f"    - Confirmed country selection.")

    def _workflow_choose_city(self) -> None:
        print(f"[🏢] {self.account} handling city selection...")
        city_name = self.target_city
        
        city_cards_selector = TLS_SELECTORS['choose_city']['city_card']
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

    def _workflow_logged_in_info_page(self) -> None:
        print(f"[👤] {self.account} on logged-in info page. Navigating to 'My Application'...")
        # Click user icon to reveal dropdown
        self.actor.human_click(TLS_SELECTORS['info_page']['user_icon_button'])
        self.actor.natural_delay()
        # Click 'My Application' in the dropdown
        self.driver.wait_for_element_visible(TLS_SELECTORS['info_page']['my_application_button'])
        self.actor.human_click(TLS_SELECTORS['info_page']['my_application_button'])
        print(f"    - Clicked 'My Application'.")

    def _workflow_application_list(self) -> None:
        print(f"[📋] {self.account} on application list page.")

        # --- Handle City Tabs if they exist ---
        city_tabs_selector = TLS_SELECTORS['application_list']['city_tabs']
        if self.driver.is_element_visible(city_tabs_selector):
            print(f"    - Multiple city centers detected. Ensuring '{self.target_city}' is selected...")

            try:
                selected_tab_text = self.driver.get_text(TLS_SELECTORS['application_list']['selected_city_tab_text']).strip()

                if self.target_city.lower() in selected_tab_text.lower():
                    print(f"    - Correct city tab '{self.target_city}' is already selected.")
                else:
                    print(f"    - Current tab is '{selected_tab_text}'. Switching to '{self.target_city}'...")
                    all_tabs = self.driver.find_elements(city_tabs_selector)
                    tab_found_and_clicked = False
                    for tab in all_tabs:
                        try:
                            tab_text = tab.find_element(By.CSS_SELECTOR, "p").text.strip()
                            if self.target_city.lower() in tab_text.lower():
                                self.driver.js_click(tab)
                                print(f"    - Clicked tab for '{self.target_city}'.")
                                tab_found_and_clicked = True
                                time.sleep(4)  # Wait for content to reload
                                break
                        except Exception:
                            continue
                    
                    if not tab_found_and_clicked:
                        print(f"    - [⚠️] Warning: Could not find a tab for city '{self.target_city}'. Proceeding with the current selection.")
            except Exception as e:
                print(f"    - [⚠️] Could not process city tabs: {e}. Proceeding with default.")

        # --- Proceed to click the 'Select' button ---
        print(f"    - Looking for 'Select' button...")
        try:
            select_button_selector = TLS_SELECTORS['application_list']['select_application_button']
            self.driver.wait_for_element_present(select_button_selector, timeout=15)
            self.driver.js_click(select_button_selector)
            print(f"[✅] {self.account} successfully clicked 'Select'.")
            time.sleep(4)
        except Exception as e:
            error_msg = str(e).split('\n')[0]
            print(f"[❌] {self.account} failed to click 'Select' button: {error_msg}")
            if self.driver.is_element_visible(TLS_SELECTORS['application_list']['create_new_button']):
                print(f"    - ⚠️ Hint: No active applications were found. You might need to click 'Create a new application' manually.")
            time.sleep(5)

    def _workflow_service_level(self) -> None:
        print(f"[⚙️] {self.account} on Service Level page. Clicking 'Continue'...")
        try:
            selector = TLS_SELECTORS['service_level']['continue_btn']
            self.driver.wait_for_element_present(selector, timeout=15)
            self.driver.js_click(selector)
            print(f"[✅] {self.account} skipped additional services successfully.")
            time.sleep(4)
        except Exception as e:
            error_msg = str(e).split('\n')[0]
            print(f"[❌] {self.account} failed to click 'Continue' on Service page: {error_msg}")
            time.sleep(5)