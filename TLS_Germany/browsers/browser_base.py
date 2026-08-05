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

        page_source = self.driver.get_page_source().lower()

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

        # Priority 5: Pre-login Country / Welcome Page
        if self.driver.is_element_visible(TLS_SELECTORS['choose_country']['select_dropdown']):
            return "choose_country"

        # Priority 6: Logged-in vs Logged-out Info Page Detection
        # Check if user icon exists, then examine the hidden DOM to be 100% sure
        if self.driver.is_element_present(TLS_SELECTORS['info_page']['user_icon_button']):
            if 'id="my-application"' in page_source or 'my application' in page_source:
                return "logged_in_info_page"
            elif 'id="login"' in page_source or 'href="/en-us/login"' in page_source:
                return "landing_welcome_page"

        # Priority 7: Pre-login Welcome Page Text Fallback
        if "welcome to the visa application centre" in page_source or \
           "welcome to the tlscontact visa application website" in page_source:
            if 'id="login"' in page_source or 'href="/en-us/login"' in page_source:
                return "landing_welcome_page"
            else:
                return "logged_in_info_page"
        
        # Priority 8: Choose City
        if self.driver.is_element_present(TLS_SELECTORS['choose_city']['page_title_header']):
            try:
                if "select your visa application centre" in self.driver.get_text(TLS_SELECTORS['choose_city']['page_title_header']).lower():
                    return "choose_city"
            except Exception:
                pass
        
        # Priority 9: Generic pre-login info page
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
            ctypes.windll.user32.MessageBoxW(0, text, title, 0x10 | 0x1000)
        except Exception as e:
            print(f"[⚠️] Could not show Windows alert: {e}")

    def _handle_current_state(self, current_state: str) -> None:
        try:
            if current_state == "cloudflare_interstitial":
                self.captcha_handler.cloudflare()
            elif current_state == "login_form":
                self._workflow_login()
            elif current_state == "landing_welcome_page":
                self._workflow_landing_welcome_page()
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
            # Propagate fatal login credential errors up to ChromeManager to terminate immediately
            if isinstance(e, ValueError) and ("Invalid username or password" in str(e) or "No application created" in str(e)):
                raise  
            
            print(f"[❌] {self.account} failed to handle {current_state}: {e}")

    def _workflow_landing_welcome_page(self) -> None:
        """Handles the Welcome landing page by clicking the User Icon and then clicking LOGIN."""
        print(f"[🌐] {self.account} on Welcome page. Looking for Login option...")
        try:
            # Check for Desktop LOGIN button
            login_link_selector = "a[href*='/login']"
            if self.driver.is_element_visible(login_link_selector):
                self.driver.js_click(login_link_selector)
                print(f"    - Clicked direct Login link.")
                time.sleep(2)
                return

            # Check for Mobile User Icon
            user_btn_selector = "svg[aria-label='User icon']"
            if self.driver.is_element_present(user_btn_selector):
                self.driver.js_click(user_btn_selector)
                print(f"    - Opened user account dropdown menu.")
                time.sleep(1.5)

                login_div = "div#login"
                self.driver.wait_for_element_present(login_div, timeout=5)
                self.driver.js_click(login_div)
                print(f"    - Clicked LOGIN option.")
                time.sleep(3)
        except Exception as e:
            print(f"[⚠️] Could not navigate from Welcome page to Login: {e}")
            time.sleep(3)

    def _workflow_login(self) -> None:
        # Give the page a moment to render potential error messages from a previous attempt.
        time.sleep(1.5)

        # 1. CRITICAL: Check for invalid credentials
        try:
            error_el = self.driver.find_element(By.CSS_SELECTOR, TLS_SELECTORS['login_form']['invalid_credentials_error'])
            error_text = error_el.text.strip().lower()
            if "invalid username or password" in error_text:
                print(f"[❌] {self.account} Invalid credentials detected. Terminating instance.")
                self._show_windows_alert("Invalid Credentials", f"The account '{self.account}' has invalid login credentials.\nThe bot for this instance will be terminated.")
                raise ValueError("Invalid username or password.")
        except Exception as e:
            if isinstance(e, ValueError): 
                raise # Re-raise immediately if invalid credentials
            pass # Continue normal login workflow

        # If we have already tried to log in on this specific page load, do not try again.
        if self.login_attempted_on_this_page:
            print(f"[⚠️] Login stalled on this page. Waiting for manual intervention or page change.")
            time.sleep(10)
            return

        # --- This is a fresh attempt on this page ---
        self.login_attempted_on_this_page = True
        
        print(f"[🔐] {self.account} injecting credentials...")
        self.actor.smart_type(TLS_SELECTORS['login_form']['email_input_field'], self.account)
        self.actor.natural_delay()
        self.actor.smart_type(TLS_SELECTORS['login_form']['password_input_field'], self.password)
        print(f"    - Credentials entered. Checking for CAPTCHA...")
        time.sleep(2)

        # Check for CAPTCHA.
        if self.driver.is_element_visible(TLS_SELECTORS['login_form']['captcha_widget']):
            print(f"[🧩] {self.account} CAPTCHA detected on login form.")
            success = self.captcha_handler.solve_google_recaptcha()
            
            if success:
                print(f"    - CAPTCHA solved successfully. Submitting credentials.")
                self.actor.human_click(TLS_SELECTORS['login_form']['submit_login_btn'])
                print(f"[✅] {self.account} login submitted.")
                time.sleep(3)
            else:
                print(f"    - CAPTCHA bypass failed. Waiting for manual intervention.")
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
        # This assumes the entire application is configured for one target country in settings.
        country_to_select = settings.DEFAULT_INSTANCE_SETTINGS.get('country', 'Egypt')
        select.select_by_visible_text(country_to_select)

        print(f"    - Selected country: {country_to_select}")
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
        self.actor.human_click(TLS_SELECTORS['info_page']['user_icon_button'])
        self.actor.natural_delay()
        
        # Click 'My Application' directly
        my_app_selector = "div#my-application"
        self.driver.wait_for_element_present(my_app_selector, timeout=5)
        self.driver.js_click(my_app_selector)
        print(f"    - Clicked 'My Application'.")
        time.sleep(2)

    def _workflow_application_list(self) -> None:
        print(f"[📋] {self.account} on application list page.")

        # --- Handle City Tabs via direct URL navigation ---
        city_tabs_selector = TLS_SELECTORS['application_list']['city_tabs']
        if self.driver.is_element_visible(city_tabs_selector):
            print(f"    - Multiple city centers detected. Checking if '{self.target_city}' is selected...")

            try:
                # 1. First, find if we are currently on the correct tab
                selected_tab_element = self.driver.find_element(TLS_SELECTORS['application_list']['selected_city_tab_text'])
                selected_tab_text = self.driver.execute_script("return arguments[0].textContent;", selected_tab_element).strip()

                if self.target_city.lower() in selected_tab_text.lower():
                    print(f"    - Correct city tab '{self.target_city}' is already selected.")
                else:
                    print(f"    - Current tab is '{selected_tab_text}'. Switching to '{self.target_city}'...")
                    
                    # 2. Extract the href attribute from the target city tab and navigate to it directly
                    all_tabs = self.driver.find_elements(city_tabs_selector)
                    tab_found = False
                    
                    for tab in all_tabs:
                        tab_html = tab.get_attribute("innerHTML").lower()
                        if self.target_city.lower() in tab_html:
                            target_url = tab.get_attribute("href")
                            if target_url:
                                print(f"    - Found link for '{self.target_city}'. Navigating directly to URL...")
                                self.driver.get(target_url) # Force navigation instead of clicking
                                tab_found = True
                                time.sleep(4)  # Wait for page to reload
                                break
                    
                    if not tab_found:
                        print(f"    - [⚠️] Warning: Could not find a tab for city '{self.target_city}'.")
            except Exception as e:
                print(f"    - [⚠️] Could not process city tabs: {e}. Proceeding with default.")

        # --- Check if an application actually exists ---
        page_text = self.driver.get_text("body").lower()
        if "no application created" in page_text:
            error_msg = f"No application exists for '{self.target_city}'. Please click 'Create a new application' manually."
            print(f"[❌] {self.account} {error_msg}")
            
            # Immediately show alert and stop the thread
            self._show_windows_alert("Missing Application", f"Account: {self.account}\nCity: {self.target_city}\n\n{error_msg}")
            raise ValueError("No application created.") 

        # --- Proceed to click the 'Select' button ---
        print(f"    - Looking for 'Select' button...")
        try:
            select_button_selector = TLS_SELECTORS['application_list']['select_application_button']
            self.driver.wait_for_element_present(select_button_selector, timeout=10)
            self.driver.js_click(select_button_selector)
            print(f"[✅] {self.account} successfully clicked 'Select'.")
            time.sleep(4)
        except Exception as e:
            error_msg = str(e).split('\n')[0]
            print(f"[❌] {self.account} failed to click 'Select' button: {error_msg}")
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