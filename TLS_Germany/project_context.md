# Project Context File



## FILE: ./app.py

```py
#!/usr/bin/env python3
"""
Omni-Booking-Automation-Suite/TLS_Germany/app.py
Application entry point.
"""
import os
import sys

# Ensure the script can find project modules from the root directory
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from PyQt6.QtWidgets import QApplication
from gui.main_window import MainWindow

if __name__ == "__main__":
    app = QApplication(sys.argv)
    dashboard = MainWindow()
    dashboard.show()
    sys.exit(app.exec())
```


## FILE: ./project_context.md

```md

```


## FILE: ./project_context.py

```py
#!/usr/bin/env python3

import os

def create_context_file(output_file="project_context.md"):
    # المجلدات التي سيتم تجاهلها بالكامل
    exclude_dirs = {'.git', '__pycache__', 'venv', 'wenv', '.env', '.idea', '.vscode', 'downloaded_files'}
    
    # الامتدادات التي نريد تضمينها
    include_extensions = ('.py', '.qss', '.md')
    
    with open(output_file, 'w', encoding='utf-8') as outfile:
        outfile.write("# Project Context File\n\n")
        
        for root, dirs, files in os.walk('.'):
            # استبعاد المجلدات المحددة من البحث
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            
            for file in files:
                if file.endswith(include_extensions):
                    file_path = os.path.join(root, file)
                    
                    # استخراج الامتداد لتحديد نوع الكود في الماركدوان
                    ext = os.path.splitext(file)[1][1:]
                    
                    outfile.write(f"\n\n## FILE: {file_path}\n\n")
                    outfile.write(f"```{ext}\n")
                    
                    try:
                        with open(file_path, 'r', encoding='utf-8') as infile:
                            outfile.write(infile.read())
                    except Exception as e:
                        outfile.write(f"Error reading file: {e}")
                        
                    outfile.write(f"\n```\n")
                    
    print(f"✅ تم إنشاء الملف بنجاح: {output_file}")

if __name__ == "__main__":
    create_context_file()
```


## FILE: ./prompt.md

```md

```


## FILE: ./temp.py

```py
import threading
import time

def task(name, delay=2):
    print(f"{name} is starting")
    time.sleep(delay)
    print(f"{name} has finished")

# Create two threads
thread1 = threading.Thread(target=task, args=("Process A",2))
thread2 = threading.Thread(target=task, args=("Process B",3))

# Start both threads
print("Main thread: Starting worker threads")
thread1.start()
thread2.start()

print("Main thread: Worker threads are running...")

# Wait for both threads to complete
thread1.join()
# thread2.join()
print("Main thread: Worker threads have Terminated")
```


## FILE: ./temp1.py

```py
import threading
import time

# Simulated function to download a file from a server
def download_file(server_name):
    print(f"Starting download from {server_name}...")
    time.sleep(2)  # Simulates 2 seconds of network/download lag
    print(f"Finished download from {server_name}.")

def main():
    servers = ["Server A", "Server B", "Server C"]
    start_time = time.time()

    print("--- Starting Threaded Downloads ---")
    threads = []
    
    # Create and start a thread for each server download
    for server in servers:
        t = threading.Thread(target=download_file, args=(server,))
        threads.append(t)
        t.start()

    # Wait for all download threads to finish before moving forward
    for t in threads:
        t.join()

    end_time = time.time()
    elapsed_time = end_time - start_time
    print(f"Total threaded execution time: {elapsed_time:.2f} seconds")

if __name__ == "__main__":
    main()
```


## FILE: ./theme.py

```py
# --- Global Stylesheet (QSS) for the Cyber Tactical Dark Theme ---
# This defines the entire visual profile of the application.
CYBER_DARK_STYLESHEET = """
    /* Main Window & Dialogs */
    QMainWindow, QDialog {
        background-color: #0B0F17; /* Deep Canvas Charcoal/Navy */
    }

    /* Labels */
    QLabel {
        color: #94A3B8; /* Slate Gray */
        font-size: 14px;
    }

    /* Input Fields */
    QLineEdit {
        background-color: #0F1420;
        color: #E2E8F0;
        border: 1px solid #334155;
        border-radius: 4px;
        padding: 8px;
        font-size: 14px;
    }
    QLineEdit:focus {
        border-color: #4F46E5; /* Indigo for focus */
    }

    /* Buttons */
    QPushButton {
        background-color: #334155; /* Slate */
        color: #E2E8F0;
        border: none;
        border-radius: 4px;
        padding: 8px 16px;
        font-size: 14px;
        font-weight: bold;
    }
    QPushButton:hover {
        background-color: #475569;
    }
    QPushButton:pressed {
        background-color: #1E293B;
    }

    /* Primary Action Button (Deploy) */
    QPushButton#deployButton {
        background-color: #2563EB; /* Blue */
        color: white;
    }
    QPushButton#deployButton:hover {
        background-color: #3B82F6;
    }

    /* Destructive Action Button (Terminate Suite) */
    QPushButton#terminateSuiteButton {
        background-color: #991B1B; /* Dark Crimson */
        color: white;
    }
    QPushButton#terminateSuiteButton:hover {
        background-color: #B91C1C;
    }

    /* Table Widget */
    QTableWidget {
        background-color: #121824; /* Panel Container */
        color: #94A3B8;
        border: 1px solid #334155;
        gridline-color: #1E293B;
        font-size: 13px;
    }

    /* Table Header */
    QHeaderView::section {
        background-color: #1E293B;
        color: #94A3B8;
        padding: 8px;
        border: 1px solid #334155;
        font-weight: bold;
    }

    /* Table Cells */
    QTableWidget::item {
        padding: 8px;
        border-bottom: 1px solid #1E293B;
    }
    QTableWidget::item:selected {
        background-color: #334155;
        color: #F1F5F9;
    }

    /* Scrollbars */
    QScrollBar:vertical, QScrollBar:horizontal {
        border: none;
        background: #121824;
        width: 10px;
        height: 10px;
        margin: 0px 0px 0px 0px;
    }
    QScrollBar::handle:vertical, QScrollBar::handle:horizontal {
        background: #334155;
        min-height: 20px;
        min-width: 20px;
        border-radius: 5px;
    }

    /* SpinBox for Hot-Patching */
    QSpinBox {
        background-color: #0F1420;
        color: #E2E8F0;
        border: 1px solid #334155;
        border-radius: 4px;
        padding: 5px;
        font-size: 16px;
        font-weight: bold;
    }
    QSpinBox::up-button, QSpinBox::down-button {
        width: 20px;
    }
"""
```


## FILE: ./browsers/browser_base.py

```py
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

        if self.driver.is_element_visible(TLS_SELECTORS['login_form']['email_input_field']):
            return "login_form"
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
        selector_key = f"{city_name.lower().replace(' ', '_')}_center_route"

        try:
            city_selector = TLS_SELECTORS['choose_city'][selector_key]
            self.actor.human_click(city_selector)
            print(f"    - Clicked on city link for {city_name}.")
        except KeyError:
            print(f"[❌] CRITICAL: No selector found for city '{city_name}'")
            time.sleep(10) 

    def _workflow_info_page(self) -> None:
        print(f"[ℹ️] {self.account} found info page. Navigating to login...")
        self.actor.human_click(TLS_SELECTORS['info_page']['header_login_btn'])
```


## FILE: ./browsers/captcha_handler.py

```py
"""
Omni-Booking-Automation-Suite/TLS_Germany/browsers/captcha_handler.py

Required dependencies for audio bypass:
pip install SpeechRecognition pydub requests
(Requires FFmpeg installed on system PATH for pydub to convert audio)
"""
import os
import time
import threading
import requests
import speech_recognition as sr
from pydub import AudioSegment
from seleniumbase import Driver
from config.selectors import TLS_SELECTORS

class CaptchaHandler:
    """
    Handles detection and resolution of Google reCAPTCHA v2 using Audio Bypass.
    """
    def __init__(self, driver: Driver):
        self.driver = driver

    def solve_interstitial_captcha(self) -> None:
        """
        Triggered when the bot hits a full-page Cloudflare block ("Just a moment...").
        """
        print("[🧩] CaptchaHandler: Interstitial Cloudflare block detected. Waiting for resolution...")
        pass
        
    def _solve_audio_challenge_modal(self, thread_id: int) -> bool:
        """
        Handles the audio challenge modal after switching to its iframe.
        """
        mp3_path, wav_path = None, None
        try:
            # 1. Check for Audio Block (Google blocking IP from automated queries)
            if self.driver.is_element_visible(TLS_SELECTORS['recaptcha_v2']['error_message']):
                print(f"[❌][{thread_id}] IP blocked from audio challenge (Automated queries detected).")
                return False

            # 2. Click PLAY button to initialize the audio stream
            print(f"    - Looking for PLAY button...")
            self.driver.wait_for_element_visible(TLS_SELECTORS['recaptcha_v2']['audio_play_button'], timeout=10)
            # 💡 Using js_click() to bypass Google's invisible protective overlays (z-index: 2000000000)
            self.driver.js_click(TLS_SELECTORS['recaptcha_v2']['audio_play_button'])
            print(f"    - Clicked PLAY button successfully.")
            time.sleep(1)

            # 3. Extract Audio URL directly from the Download link (No need to open a new tab)
            self.driver.wait_for_element_present(TLS_SELECTORS['recaptcha_v2']['audio_download_link'], timeout=10)
            audio_url = self.driver.get_attribute(TLS_SELECTORS['recaptcha_v2']['audio_download_link'], "href")
            
            if not audio_url or not audio_url.startswith("http"):
                print(f"[❌][{thread_id}] Could not capture audio stream URL.")
                return False

            print(f"    - Audio stream URL captured. Downloading silently...")

            # 4. Generate unique file paths for thread safety
            timestamp = int(time.time())
            mp3_path = os.path.abspath(f"./downloaded_files/audio_{thread_id}_{timestamp}.mp3")
            wav_path = os.path.abspath(f"./downloaded_files/audio_{thread_id}_{timestamp}.wav")

            # 5. Download MP3 using session cookies to prevent access denied
            session = requests.Session()
            for cookie in self.driver.get_cookies():
                session.cookies.set(cookie['name'], cookie['value'])
            
            response = session.get(audio_url, headers={'User-Agent': self.driver.get_user_agent()})
            with open(mp3_path, 'wb') as f:
                f.write(response.content)

            # 6. Convert MP3 to WAV using Pydub & FFmpeg
            try:
                AudioSegment.from_mp3(mp3_path).export(wav_path, format="wav")
            except FileNotFoundError:
                print(f"\n[⚠️ CRITICAL ERROR][{thread_id}] FFmpeg IS NOT INSTALLED ON YOUR WINDOWS SYSTEM!")
                print("    -> Pydub cannot convert MP3 to WAV without FFmpeg.")
                print("    -> Please download FFmpeg and add it to your Windows PATH.\n")
                return False

            # 7. Transcribe WAV file to Text
            recognizer = sr.Recognizer()
            with sr.AudioFile(wav_path) as source:
                audio_data = recognizer.record(source)
            
            transcribed_text = recognizer.recognize_google(audio_data).lower()
            print(f"    - Transcription successful: '{transcribed_text}'")

            # 8. Type Response and Verify
            self.driver.type(TLS_SELECTORS['recaptcha_v2']['audio_response_input'], transcribed_text)
            time.sleep(1)
            # 💡 Using js_click() to bypass overlays again
            self.driver.js_click(TLS_SELECTORS['recaptcha_v2']['verify_button'])
            print(f"    - Submitted transcription and clicked Verify.")
            time.sleep(3)
            return True

        except Exception as e:
            print(f"[❌][{thread_id}] Audio challenge processing failed: {str(e).splitlines()[0]}")
            return False
        finally:
            # Clean up temp files
            if mp3_path and os.path.exists(mp3_path): os.remove(mp3_path)
            if wav_path and os.path.exists(wav_path): os.remove(wav_path)

    def solve_google_recaptcha(self) -> bool:
        """
        Main entry method called by BrowserBase to handle Google reCAPTCHA v2.
        """
        thread_id = threading.get_ident()
        print(f"[🧩][{thread_id}] reCAPTCHA v2 detected. Initiating Audio Bypass strategy...")
        
        os.makedirs("./downloaded_files", exist_ok=True)
        checkbox_iframe = None

        try:
            # Wait for stabilization
            time.sleep(2)

            # Step 1: Find and Switch to Checkbox Iframe
            self.driver.wait_for_element_visible(TLS_SELECTORS['recaptcha_v2']['checkbox_iframe'], timeout=12)
            checkbox_iframe = self.driver.find_element("css selector", TLS_SELECTORS['recaptcha_v2']['checkbox_iframe'])
            
            self.driver.switch_to.frame(checkbox_iframe)
            self.driver.wait_for_element_visible(TLS_SELECTORS['recaptcha_v2']['checkbox'], timeout=10)
            
            # 💡 Using js_click() to cut through Google's defensive layers
            self.driver.js_click(TLS_SELECTORS['recaptcha_v2']['checkbox'])
            
            self.driver.switch_to.default_content()
            print(f"    - Clicked checkbox. Waiting for challenge...")
            time.sleep(3)

            # Step 1.5: Check if instantly solved (Green Check)
            self.driver.switch_to.frame(checkbox_iframe)
            is_checked = self.driver.get_attribute(TLS_SELECTORS['recaptcha_v2']['checkbox'], "aria-checked")
            self.driver.switch_to.default_content()

            if str(is_checked).lower() == "true":
                print(f"[✅][{thread_id}] CAPTCHA instantly solved (Green Checkmark).")
                return True

            # Step 2: Switch to Challenge Iframe
            if self.driver.is_element_visible(TLS_SELECTORS['recaptcha_v2']['challenge_iframe']):
                challenge_iframe_element = self.driver.find_element("css selector", TLS_SELECTORS['recaptcha_v2']['challenge_iframe'])
                self.driver.switch_to.frame(challenge_iframe_element)
                
                # Click the Audio Headphone icon
                self.driver.wait_for_element_visible(TLS_SELECTORS['recaptcha_v2']['audio_button'], timeout=10)
                # 💡 Using js_click()
                self.driver.js_click(TLS_SELECTORS['recaptcha_v2']['audio_button'])
                print(f"    - Switched to audio challenge.")
                time.sleep(2)

                # Delegate to Audio Resolver logic
                if not self._solve_audio_challenge_modal(thread_id):
                    self.driver.switch_to.default_content()
                    return False
            else:
                print(f"[❌][{thread_id}] Challenge iframe not found.")
                self.driver.switch_to.default_content()
                return False

            # Step 3: Final Verification Check
            self.driver.switch_to.default_content()
            if checkbox_iframe:
                self.driver.switch_to.frame(checkbox_iframe)
                is_checked = self.driver.get_attribute(TLS_SELECTORS['recaptcha_v2']['checkbox'], "aria-checked")
                self.driver.switch_to.default_content()

                if str(is_checked).lower() == "true":
                    print(f"[✅][{thread_id}] CAPTCHA Audio Bypass successful!")
                    return True
            
            print(f"[❌][{thread_id}] CAPTCHA verification failed after audio attempt.")
            return False

        except Exception as e:
            print(f"[❌][{thread_id}] An unexpected error occurred during CAPTCHA bypass: {str(e).splitlines()[0]}")
            try:
                self.driver.switch_to.default_content()
            except:
                pass
            return False
```


## FILE: ./browsers/chrome.py

```py
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

    # Class-level lock to prevent race conditions during driver initialization,
    # especially when using seleniumbase's uc=True mode, which patches files on the fly.
    _driver_init_lock = threading.Lock()

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
        
        # --- Unique Identifiers for Isolation & Viewing ---
        # Create a filesystem-safe name for the profile directory
        self.account_safe_name = "".join([c if c.isalnum() else "_" for c in self.account])
        self.profile_path = os.path.abspath(f"./runtime_profiles/{self.account_safe_name}")
        self.window_title = f"Omni-Booking :: {self.account}"
        
        self.thread: Optional[threading.Thread] = None
        self.is_running = False
        self.driver: Optional[Driver] = None
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

            # 5. Precision Timing (Wait for the exact millisecond)
            if self.is_running:
                self._wait_until_target()

            # 6. Trigger Action
            if self.is_running:
                self.status = "Executing Action"
                self._execute_action()
                self.status = "Finished"
                
                # Idle loop: Keep browser open until stopped from the GUI
                while self.is_running:
                    time.sleep(0.5)

        except Exception as e:
            # This block is entered if an error occurs during automation,
            # or if driver.quit() is called by stop_engine, which raises an exception.
            if self.is_running: # If it's an unexpected error, not a manual stop
                error_msg = str(e).split('\n')[0]
                print(f"❌ [Error in {self.account}]: {error_msg}")
                self.status = f"Error: {error_msg}"
        
        # When the loop breaks (is_running=False) or an exception occurs, the thread ends.
        print(f"[💡] Thread for {self.account} has exited.")

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
                # Do not self-terminate. Instead, idle here with an error status
                # to allow the user to see the problem and take manual action.
                while self.is_running:
                    time.sleep(1)
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
        
        self.is_running = False # Signal thread to stop its loops
        
        if self.driver:
            try:
                self.driver.quit()
            except Exception:
                # Ignore errors, e.g., if browser was already closed manually
                pass
            self.driver = None
            
        if "Error" not in self.status and self.status != "Finished":
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
```


## FILE: ./browsers/stealth_actions.py

```py
import time
import random
from seleniumbase import Driver
from config import settings

class StealthActions:
    """
    Synchronous utility class for human-like browser interactions.
    """

    def __init__(self, driver: Driver):
        self.driver = driver
        self.base_type_min = random.uniform(settings.TYPING_SPEED_MIN, settings.TYPING_SPEED_MIN + settings.PERSONA_TYPE_JITTER)
        self.base_type_max = random.uniform(settings.TYPING_SPEED_MAX - settings.PERSONA_TYPE_JITTER, settings.TYPING_SPEED_MAX)
        self.base_delay_min = random.uniform(settings.ACTION_DELAY_MIN, settings.ACTION_DELAY_MIN + settings.PERSONA_DELAY_JITTER)
        self.base_delay_max = random.uniform(settings.ACTION_DELAY_MAX - settings.PERSONA_DELAY_JITTER, settings.ACTION_DELAY_MAX)

    def natural_delay(self, min_sec: float = None, max_sec: float = None) -> None:
        """Pause execution using standard time.sleep()."""
        sleep_time = random.uniform(min_sec or self.base_delay_min, max_sec or self.base_delay_max)
        time.sleep(sleep_time)

    def smart_type(self, selector: str, text_to_type: str, timeout: int = settings.WAIT_TIMEOUT_ELEMENT_READY) -> None:
            """Waits for field, clears it using JS, and types character-by-character."""
            
            # 1. الانتظار حتى يظهر العنصر
            self.driver.wait_for_element(selector, timeout=timeout)
            
            # 2. الوصول للعنصر كـ WebElement عادي
            # نستخدم find_element لأنها دالة قياسية موجودة في كل تعريفات Driver
            element = self.driver.find_element("css selector", selector)
            
            # 3. الطريقة الاحترافية لمسح الحقل باستخدام JavaScript
            # هذه الطريقة تتخطى أي مشاكل في المكتبات وتمسح الحقل فوراً
            self.driver.execute_script("arguments[0].value = '';", element)
            
            # 4. التركيز على الحقل والبدء في الكتابة
            self.driver.click(selector)
            for char in text_to_type:
                element.send_keys(char)
                time.sleep(random.uniform(self.base_type_min, self.base_type_max))
    def human_click(self, selector: str, timeout: int = settings.WAIT_TIMEOUT_ELEMENT_READY) -> None:
        """Wait for element visibility, pause briefly (targeting), then click."""
        # التعديل هنا أيضاً: استخدام الدالة الشاملة
        self.driver.wait_for_element(selector, timeout=timeout)
        
        self.natural_delay()
        self.driver.click(selector)
    def safe_scroll(self, selector: str, timeout: int = settings.WAIT_TIMEOUT_ELEMENT_READY) -> None:
        """Scroll element into viewport smoothly."""
        self.driver.wait_for_element(selector, timeout=timeout)
        self.natural_delay(0.2, 0.5)
        self.driver.scroll_to(selector)
        self.natural_delay(0.3, 0.7)
```


## FILE: ./browsers/__init__.py

```py
"""
Omni-Booking-Automation-Suite/TLS_Germany/browsers/__init__.py
"""
```


## FILE: ./config/selectors.py

```py
"""
Omni-Booking-Automation-Suite/TLS_Germany/config/selectors.py
Fully mapped selectors for the TLScontact Germany workflow engines
"""

TLS_SELECTORS = {
    # [0] choose_country
    "choose_country": {
        "splash_container": "div#splash-country-selector",
        "select_dropdown": "select#select-country",
        "confirm_country_btn": "a#btn-confirm-country",
        "apply_for_visa_btn": "button#btn-apply-for-a-visa",
        "cookie_close_btn": "button.osano-cm-close"
    },

    # [1] choose_city
    "choose_city": {
        "map_view_search_input": "input#search-vac-map-view",
        "list_view_search_input": "input#search-vac-list-view",
        "search_submit_btn": "input#search-vac-map-view + button",
        "generic_continue_btn": "button[data-testid='btn-select-vac']",

        # Specific regional routing links
        "alexandria_center_route": "a[href*='/vac/egALY2de']",
        "cairo_center_route": "a[href*='/vac/egCAI2de']",
        "hurghada_center_route": "a[href*='/vac/egHRG2de']",
        "6th_of_october_route": "a[href*='/vac/egHAC2de']"
    },

    # [2] info_page
    "info_page": {
        "header_login_btn": "a[href='/en-us/login']",
        "login_btn_inner_span": "a[href='/en-us/login'] span.TlsButton_tls-button__syUS5",
        "services_tab_link": "a[href$='/services']",
        "application_process_link": "a[href$='/application-process']",
        "news_bulletins_link": "a[href$='/news']",
        "address_hours_footer_link": "a[href$='/address-opening-hours']"
    },

    # [3] login_form
    "login_form": {
        "form_title_header": "h1#login-page-title",
        "email_input_field": "input#email-input-field",
        "password_input_field": "input#password-input-field",
        "forgot_password_btn": "a#forget-password",
        "submit_login_btn": "button#btn-login",
        "captcha_widget": "iframe[title='reCAPTCHA']"
    },
    
    # [4] Dashboard Ready State
    "dashboard": {
        "logged_in_anchor": "a[href*='/logout'], button.user-profile, div.dashboard-container"
    },

    # [5] Google reCAPTCHA v2 Elements
    "recaptcha_v2": {
        "checkbox_iframe": "iframe[title='reCAPTCHA']",
        "checkbox": "span#recaptcha-anchor",
        "challenge_iframe": "iframe[title*='recaptcha challenge']",
        "audio_play_button": "div.rc-audiochallenge-play-button button",
        "audio_button": "button#recaptcha-audio-button",
        "audio_source": "audio#audio-source",
        "audio_download_link": "a.rc-audiochallenge-tdownload-link",
        "audio_response_input": "input#audio-response",
        "verify_button": "button#recaptcha-verify-button",
        "error_message": "div.rc-audiochallenge-error-message",
        # Image Challenge selectors
        "image_challenge_payload": "div.rc-imageselect-payload",
        "image_challenge_instruction_desc": "div.rc-imageselect-desc",
        "image_challenge_instruction_strong": "div.rc-imageselect-desc strong",
        "image_challenge_tiles": "td.rc-imageselect-tile",
        "image_challenge_img": "img.rc-image-tile-33",
        "image_challenge_checkbox": "div.rc-imageselect-checkbox",
        "image_challenge_incorrect_response": "div.rc-imageselect-incorrect-response",
        "image_challenge_error_select_more": "div.rc-imageselect-error-select-more",
        "image_challenge_error_dynamic_more": "div.rc-imageselect-error-dynamic-more",
        "image_challenge_error_select_something": "div.rc-imageselect-error-select-something",
    }
}
```


## FILE: ./config/settings.py

```py
"""
Omni-Booking-Automation-Suite/TLS_Germany/config/settings.py
"""
URLS = [
    "https://visas-de.tlscontact.com/en-us",
    "https://auth.visas-de.tlscontact.com/auth/realms/atlas/protocol/openid-connect/auth?client_id=tlscitizen&redirect_uri=https%3A%2F%2Fvisas-de.tlscontact.com%2Fen-us%2Fauth-callback&state=%257B%2522csrf%2522%253A%2522bcbe284f-43fd-4829-9c87-402c56da8a4b%2522%257D&response_mode=query&response_type=code&scope=openid&nonce=b0768df2-85b0-44b6-8e98-212802dad580&ui_locales=en"
]

BASE_URL = URLS[1]
START_URL = URLS[1]

# --- TARGET DYNAMICS ---
# This dictionary drives the workflow dynamically
RESIDENCE = {
    "country": "Egypt", 
    "city": "Alexandria"
}
ACCOUNTS_FOR_TEST ={
    "test1":{
        "account": "tivime8259@preparmy.com",
        "password": "Yallavisa@@123",

    },
    "me":{
        "account":"mohamed71291@gmail.com",
        "password":"moed-TLS-25",
    }
}
# --- TYPING PROFILES ---
TYPING_SPEED_MIN = 0.05
TYPING_SPEED_MAX = 0.15

# --- ACTION DELAYS ---
ACTION_DELAY_MIN = 0.5
ACTION_DELAY_MAX = 1.2

# --- DIGITAL PERSONA BASELINES ---
PERSONA_TYPE_JITTER = 0.03
PERSONA_DELAY_JITTER = 0.2

# --- TIMEOUTS ---
WAIT_TIMEOUT_ELEMENT_READY = 10
```


## FILE: ./config/__init__.py

```py
"""
Omni-Booking-Automation-Suite/TLS_Germany/config/__init__.py
"""

```


## FILE: ./core/data_handler.py

```py
"""
Omni-Booking-Automation-Suite/TLS_Germany/core/data_handler.py
"""

import os
import re
import pandas as pd
from typing import List, Dict, Any, Optional

class DataIngestor:
    """
    General File Parser for Omni-Booking Suite.
    Dynamically handles required columns, rejects invalid files, 
    and gracefully skips invalid rows while capturing all dynamic columns.
    """

    def __init__(self, target_columns: Optional[List[str]] = None) -> None:
        # Default mandatory columns if none are provided
        self.required_columns: List[str] = target_columns or ['Account', 'Password']

    def _sanitize_and_parse(self, df: pd.DataFrame) -> Dict[str, Any]:
        """
        Internal method to safely validate and parse the dataframe dynamically.
        Returns a structured dictionary with execution results.
        """
        # Clean column headers (removes accidental trailing spaces like "IP Address ")
        df.columns = df.columns.str.strip()

        # 1. File Level Validation
        missing_cols = [col for col in self.required_columns if col not in df.columns]
        if missing_cols:
            return {
                "success": False,
                "data": [],
                "error": f"File rejected. Missing required columns: {', '.join(missing_cols)}",
                "warnings": []
            }

        parsed_data = []
        warnings = []

        # 2. Row Level Validation & Dynamic Parsing
        for index, row in df.iterrows():
            try:
                row_dict = row.to_dict()
                row_is_valid = True
                
                # A. Validate mandatory columns
                for req_col in self.required_columns:
                    val = row_dict.get(req_col)
                    if pd.isna(val) or str(val).strip() == '' or str(val).strip().lower() == 'nan':
                        warnings.append(f"Row {index + 2} skipped: Missing required value for '{req_col}'.")
                        row_is_valid = False
                        break 
                
                if not row_is_valid:
                    continue

                # B. Dynamically clean and build the row payload
                cleaned_row = {}
                for key, val in row_dict.items():
                    if pd.isna(val):
                        cleaned_row[key] = None
                    elif isinstance(val, str):
                        cleaned_row[key] = val.strip()
                    else:
                        cleaned_row[key] = val

                # C. Ensure timing values are integers if they exist, otherwise default to 0
                for time_col in ['Second', 'Millisecond']:
                    if time_col in cleaned_row and cleaned_row[time_col] is not None:
                        try:
                            cleaned_row[time_col] = int(float(cleaned_row[time_col]))
                        except ValueError:
                            cleaned_row[time_col] = 0
                    elif time_col not in cleaned_row:
                        cleaned_row[time_col] = 0

                # D. Apply specific business logic fallbacks
                if 'Platform' not in cleaned_row or not cleaned_row['Platform']:
                    cleaned_row['Platform'] = 'TLS_Germany'
                    
                if 'Country' in cleaned_row and not cleaned_row['Country']:
                    cleaned_row['Country'] = 'blank'

                # Append the fully dynamic row dictionary
                parsed_data.append(cleaned_row)

            except Exception as e:
                warnings.append(f"Row {index + 2} skipped due to unexpected error: {str(e)}")
                
        return {
            "success": True,
            "data": parsed_data,
            "error": "",
            "warnings": warnings
        }

    def load_from_csv(self, file_path: str) -> Dict[str, Any]:
        if not os.path.exists(file_path):
            return {"success": False, "data": [], "error": "The selected CSV file does not exist.", "warnings": []}
        try:
            return self._sanitize_and_parse(pd.read_csv(file_path))
        except Exception as e:
            return {"success": False, "data": [], "error": f"Failed to read CSV file: {str(e)}", "warnings": []}

    def load_from_excel(self, file_path: str) -> Dict[str, Any]:
        if not os.path.exists(file_path):
            return {"success": False, "data": [], "error": "The selected Excel file does not exist.", "warnings": []}
        try:
            return self._sanitize_and_parse(pd.read_excel(file_path))
        except Exception as e:
            return {"success": False, "data": [], "error": f"Failed to read Excel file: {str(e)}", "warnings": []}

    def load_from_google_sheet(self, url: str) -> Dict[str, Any]:
        """
        Extracts data from a standard Google Sheets share link.
        Automatically converts the URL to a CSV export endpoint.
        """
        # Extract the Spreadsheet ID
        id_match = re.search(r'/d/([a-zA-Z0-9-_]+)', url)
        if not id_match:
            return {"success": False, "data": [], "error": "Invalid Google Sheets URL. Could not find Spreadsheet ID.", "warnings": []}
        
        spreadsheet_id = id_match.group(1)

        # Extract the GID (sheet page identifier) if present
        gid_match = re.search(r'[#&?]gid=([0-9]+)', url)
        
        if gid_match:
            gid = gid_match.group(1)
            export_url = f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}/export?format=csv&gid={gid}"
        else:
            export_url = f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}/export?format=csv"

        print(f"[🌐] Fetching Google Sheet: {export_url}")

        try:
            storage_options = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
            df = pd.read_csv(export_url, storage_options=storage_options)
            return self._sanitize_and_parse(df)
        except Exception as e:
            hint = "\n[Hint]: Ensure the Google Sheet is set to 'Anyone with the link can view'." if "HTTP Error 400" in str(e) else ""
            return {"success": False, "data": [], "error": f"Failed to fetch Google Sheet data: {str(e)}{hint}", "warnings": []}


if __name__ == "__main__":
    ingestor = DataIngestor()
    
    sheet_url = "https://docs.google.com/spreadsheets/d/12N0onox6RMsgRJ9uzzSGMkrKVqcCdfEnLm-GAsJyqPs/edit?usp=sharing"
    
    # Store the returned dictionary
    result = ingestor.load_from_google_sheet(sheet_url)
    
    if result["success"]:
        print(f"✅ Success! Loaded {len(result['data'])} accounts:\n")
        for row in result["data"]:
            print(row)
    else:
        print(f"❌ Critical Error: {result['error']}")
        
    if result["warnings"]:
        print("\n⚠️ Warnings (Skipped Rows):")
        for warn in result["warnings"]:
            print(f"- {warn}")
```


## FILE: ./core/__init__.py

```py
"""
Omni-Booking-Automation-Suite/TLS_Germany/core/__init__.py
"""

```


## FILE: ./gui/dialogs.py

```py
"""
Contains all QDialog-based pop-up windows for the application.
"""
from PyQt6.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QLabel, QSpinBox, QPushButton
)
from PyQt6.QtCore import Qt

from browsers.chrome import ChromeManager

class EditInstanceDialog(QDialog):
    """
    A modal dialog for live editing of a ChromeManager's target time parameters.
    Changes are "hot-patched" by directly modifying the attributes of the
    ChromeManager instance in memory while its thread is running.
    """
    def __init__(self, parent, instance: ChromeManager):
        super().__init__(parent)
        self.instance = instance

        self.setWindowTitle(f"Hot-Patch: {instance.account}")
        self.setModal(True)
        self.setFixedSize(320, 420)

        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(15)

        title_label = QLabel(f"Target: {instance.account}")
        title_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        title_label.setStyleSheet("font-size: 16px; font-weight: bold; color: #E2E8F0;")
        layout.addWidget(title_label)

        # Create spin boxes for time editing
        self.hour_spin = self._create_spinbox(layout, "Hour (0-23):", 0, 23, instance.target_hr)
        self.min_spin = self._create_spinbox(layout, "Minute (0-59):", 0, 59, instance.target_min)
        self.sec_spin = self._create_spinbox(layout, "Second (0-59):", 0, 59, instance.target_sec)
        self.ms_spin = self._create_spinbox(layout, "Millisecond (0-999):", 0, 999, instance.target_ms)

        layout.addStretch()

        # --- Action Buttons ---
        button_layout = QHBoxLayout()
        apply_btn = QPushButton("Apply Pulse")
        apply_btn.clicked.connect(self._apply_changes)
        cancel_btn = QPushButton("Cancel")
        cancel_btn.clicked.connect(self.reject)

        button_layout.addWidget(apply_btn)
        button_layout.addWidget(cancel_btn)
        layout.addLayout(button_layout)

    def _create_spinbox(self, layout: QVBoxLayout, label_text: str, min_val: int, max_val: int, initial_val: int) -> QSpinBox:
        """Factory helper to create a labeled QSpinBox and add it to the layout."""
        layout.addWidget(QLabel(label_text))
        spinbox = QSpinBox()
        spinbox.setRange(min_val, max_val)
        spinbox.setValue(initial_val)
        layout.addWidget(spinbox)
        return spinbox

    def _apply_changes(self):
        """
        Applies the new time values from the spinboxes directly to the
        ChromeManager instance's attributes. This is thread-safe for simple
        atomic assignments (like integers), and the running thread's timing loop
        is designed to read these values on each iteration.
        """
        new_hr = self.hour_spin.value()
        new_min = self.min_spin.value()
        new_sec = self.sec_spin.value()
        new_ms = self.ms_spin.value()

        # Direct memory update. This is thread-safe for simple assignments.
        self.instance.target_hr = new_hr
        self.instance.target_min = new_min
        self.instance.target_sec = new_sec
        self.instance.target_ms = new_ms

        print(f"[⚙️] Hot-Patch applied to {self.instance.account}. New target: {new_hr:02}:{new_min:02}:{new_sec:02}.{new_ms:03}")
        # Close the dialog
        self.accept()
```


## FILE: ./gui/get_page.py

```py
#!/usr/bin/env python
import os
import time
from seleniumbase import Driver

def dump_live_page_html(account_email: str, target_url: str):
    """
    Launches your isolated stealth browser profile, gives you time 
    to manually open the disappearing dropdown, and saves the live HTML.
    """
    # 1. Map to your existing isolated runtime profile folder
    safe_email = "".join([c if c.isalnum() else "_" for c in account_email])
    profile_path = os.path.abspath(f"./runtime_profiles/{safe_email}")
    
    flags = [
        f"--user-data-dir={profile_path}",
        "--window-size=1280,800",
        "--disable-blink-features=AutomationControlled"
    ]
    
    print(f"[🌐] Launching browser with session profile: {safe_email}")
    driver = Driver(uc=True, incognito=False, chromium_arg=",".join(flags))
    
    try:
        # 2. Navigate to your target TLScontact URL
        driver.get(target_url)
        
        # 3. The Countdown Window
        print("\n⏳ ACTION REQUIRED:")
        print("--> You have 8 seconds to click and EXPAND the dropdown menu on the screen now! Don't let go!")
        
        for i in range(8, 0, -1):
            print(f"Capturing live DOM snapshot in {i} seconds...", end="\r")
            time.sleep(1)
            
        # 4. Extract the exact live DOM state
        print("\n\n📸 Snapshot triggered! Extracting raw page source...")
        live_html = driver.page_source
        
        # 5. Save to your local project directory
        os.makedirs("./downloaded_files", exist_ok=True)
        output_file = "./downloaded_files/captured_dropdown_page.html"
        
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(live_html)
            
        print(f"✅ Success! Live HTML saved to: {output_file}")
        print("You can now open this file in VS Code and safely extract your CSS selectors.")
        
    except Exception as e:
        print(f"❌ Error encountered: {e}")
    finally:
        # Keep the browser open briefly for review, then close
        time.sleep(5)
        driver.quit()

if __name__ == "__main__":
    # Test values using your current working structures
    TARGET_ACCOUNT = "tivime8259@preparmy.com"
    TLS_URL = "https://visas-de.tlscontact.com/en-us" 
    
    dump_live_page_html(TARGET_ACCOUNT, TLS_URL)
```


## FILE: ./gui/gui.py

```py
#!/usr/bin/env python3
"""
Omni-Booking-Automation-Suite/TLS_Germany/gui.py
Application entry point.
"""
import os
import sys

# Ensure the script can find project modules from the root directory
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from PyQt6.QtWidgets import QApplication
from gui.main_window import MainWindow

if __name__ == "__main__":
    app = QApplication(sys.argv)
    dashboard = MainWindow()
    dashboard.show()
    sys.exit(app.exec())
```


## FILE: ./gui/main.py

```py
#!/usr/bin/env python3
"""
Omni-Booking-Automation-Suite/TLS_Germany/main.py
Application entry point.
"""
import os
import sys

# Ensure the script can find project modules from the root directory
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from PyQt6.QtWidgets import QApplication
from gui.main_window import MainWindow

if __name__ == "__main__":
    app = QApplication(sys.argv)
    dashboard = MainWindow()
    dashboard.show()
    sys.exit(app.exec())
```


## FILE: ./gui/main_window.py

```py
"""
The main application window class. Manages UI, data loading, thread orchestration,
and state monitoring for the browser automation suite.
"""
from typing import Dict, List, Any, Optional

from PyQt6.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, QLineEdit, QPushButton,
    QTableWidget, QTableWidgetItem, QHeaderView, QMessageBox, QFileDialog,
    QAbstractItemView
)
from PyQt6.QtCore import Qt, QTimer
from PyQt6.QtGui import QColor, QBrush

from core.data_handler import DataIngestor
from browsers.chrome import ChromeManager
from config.settings import BASE_URL
from .theme import CYBER_DARK_STYLESHEET
from .dialogs import EditInstanceDialog

# Attempt to import pywin32 for the "View" functionality on Windows
try:
    import win32gui
    import win32con
    PYWIN32_AVAILABLE = True
except ImportError:
    PYWIN32_AVAILABLE = False

class MainWindow(QMainWindow):
    """
    The main application window class. Manages UI, data loading, thread orchestration,
    and state monitoring for the browser automation suite.
    """
    def __init__(self):
        super().__init__()

        # --- Core Application Setup ---
        self.setWindowTitle("Omni-Booking Automation Suite :: TLS Germany")
        self.setGeometry(100, 100, 1400, 700)
        self.setStyleSheet(CYBER_DARK_STYLESHEET)

        # --- State Management ---
        self.data_ingestor = DataIngestor() # Handles loading data from files/sheets.
        # Core state dictionary: Maps an account's email (as a unique ID) to its controlling ChromeManager instance.
        self.active_instances: Dict[str, ChromeManager] = {}
        # Performance optimization: Maps an account's email to its current row index in the table for fast UI updates.
        self.account_to_row: Dict[str, int] = {}

        # --- UI Initialization ---
        self._init_ui()

        # --- Background Processes ---
        # This timer is the heart of the live dashboard, periodically calling a method to refresh the UI.
        self.monitor_timer = QTimer(self)
        self.monitor_timer.timeout.connect(self._update_dashboard_from_state)
        self.monitor_timer.start(500) # Poll every 500ms

    def _init_ui(self):
        """Constructs and lays out all GUI elements."""
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        main_layout = QVBoxLayout(central_widget)
        main_layout.setContentsMargins(10, 10, 10, 10)
        main_layout.setSpacing(10)

        # --- TOP FRAME: Data Ingestion Controls ---
        top_layout = QHBoxLayout()
        self.data_source_entry = QLineEdit()
        self.data_source_entry.setPlaceholderText("Enter local file path or Google Sheet URL")
        browse_btn = QPushButton("Browse Files...")
        browse_btn.clicked.connect(self._browse_local_file)
        fetch_btn = QPushButton("Fetch Cloud Sheet")
        fetch_btn.clicked.connect(self._fetch_google_sheet)

        top_layout.addWidget(self.data_source_entry)
        top_layout.addWidget(browse_btn)
        top_layout.addWidget(fetch_btn)
        main_layout.addLayout(top_layout)

        # --- MIDDLE FRAME: Instance Tracker Table ---
        self.table = QTableWidget()
        self.table.setColumnCount(6)
        self.table.setHorizontalHeaderLabels([
            "", "Target Account Context", "Operational State (Status)",
            "Trigger Matrix (H:M:S.ms)", "Network Tunnel Routing (Proxy)", "Actions"
        ])
        
        # Enforce comfortable vertical row section height so custom button layouts fit perfectly
        self.table.verticalHeader().setDefaultSectionSize(36)
        
        header = self.table.horizontalHeader()
        header.setSectionResizeMode(QHeaderView.ResizeMode.Stretch)
        header.setSectionResizeMode(0, QHeaderView.ResizeMode.ResizeToContents) # Checkbox
        header.setSectionResizeMode(1, QHeaderView.ResizeMode.Interactive)   # Account
        header.setSectionResizeMode(5, QHeaderView.ResizeMode.ResizeToContents) # Actions
        self.table.setColumnWidth(1, 350)

        # Allow selecting rows or individual cells for copy-pasting text.
        # Editing is disabled by default on QTableWidgetItems unless the 'ItemIsEditable' flag is set.
        self.table.setSelectionBehavior(QAbstractItemView.SelectionBehavior.SelectRows)
        self.table.setSelectionMode(QAbstractItemView.SelectionMode.SingleSelection)
        # Double-clicking a row still opens the edit dialog
        self.table.cellDoubleClicked.connect(self._open_edit_dialog)
        main_layout.addWidget(self.table)

        # --- BOTTOM FRAME: Main Control Panel ---
        bottom_layout = QHBoxLayout()
        deploy_btn = QPushButton("⚡ Deploy All Engines")
        deploy_btn.setObjectName("deployButton")
        deploy_btn.clicked.connect(self._deploy_all)

        edit_btn = QPushButton("⚙️ Hot-Patch Highlighted")
        edit_btn.clicked.connect(self._open_edit_dialog)

        select_all_btn = QPushButton("Select All")
        select_all_btn.clicked.connect(self._select_all)

        deselect_all_btn = QPushButton("Deselect All")
        deselect_all_btn.clicked.connect(self._deselect_all)

        terminate_selected_btn = QPushButton("Terminate Selected")
        terminate_selected_btn.clicked.connect(self._terminate_selected)

        delete_selected_btn = QPushButton("Delete Selected")
        delete_selected_btn.setStyleSheet("background-color: #7f1d1d; color: #f1f5f9;") # Dark Red
        delete_selected_btn.clicked.connect(self._delete_selected)

        terminate_all_btn = QPushButton("🛑 Terminate Suite")
        terminate_all_btn.setObjectName("terminateSuiteButton")
        terminate_all_btn.clicked.connect(self._terminate_all)

        bottom_layout.addWidget(deploy_btn)
        bottom_layout.addWidget(edit_btn)
        bottom_layout.addStretch(1)
        bottom_layout.addWidget(select_all_btn)
        bottom_layout.addWidget(deselect_all_btn)
        bottom_layout.addSpacing(20)
        bottom_layout.addWidget(terminate_selected_btn)
        bottom_layout.addWidget(delete_selected_btn)
        bottom_layout.addStretch(2)
        bottom_layout.addWidget(terminate_all_btn)
        main_layout.addLayout(bottom_layout)

    def _browse_local_file(self):
        """Opens a file dialog to select a local data file and loads it."""
        file_path, _ = QFileDialog.getOpenFileName(self, "Select Data File", "", "Data Files (*.xlsx *.xls *.csv)")
        if file_path:
            self.data_source_entry.setText(file_path)
            self._load_data(file_path)

    def _fetch_google_sheet(self):
        """Takes the URL from the entry box and attempts to load it as a Google Sheet."""
        url = self.data_source_entry.text().strip()
        if "docs.google.com" not in url:
            QMessageBox.critical(self, "Invalid URL", "Please enter a valid Google Sheets URL.")
            return
        self._load_data(url)

    def _load_data(self, source: str):
        """
        Central data loading function. It terminates any running instances,
        calls the DataIngestor, and then populates the UI table with the new data.
        """
        # Safety check: ensure user confirms before wiping existing session.
        if self.active_instances:
            reply = QMessageBox.question(self, "Confirm", "Loading new data will terminate all running instances. Continue?",
                                         QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No)
            if reply == QMessageBox.StandardButton.No: return
            self._terminate_all(silent=True)

        result = self.data_ingestor.load_from_source(source)

        if not result["success"]:
            QMessageBox.critical(self, "Data Loading Failed", result["error"])
            return
        if result["warnings"]:
            warnings_text = "\n".join(result["warnings"])
            QMessageBox.warning(self, "Data Loading Warnings", f"Some rows were skipped:\n\n{warnings_text}")

        self._populate_table(result["data"])

    def _populate_table(self, data: List[Dict[str, Any]]):
        """
        Clears the current table and state, then builds new ChromeManager instances
        and UI rows for each entry in the provided data.
        """
        self.table.setRowCount(0)
        self.active_instances.clear()
        self.account_to_row.clear()

        for i, row_data in enumerate(data):
            account = row_data.get('Account', f'N/A_{i}')
            manager = ChromeManager(
                account=account,
                password=row_data.get('Password', ''),
                url=BASE_URL,
                target_hr=int(row_data.get('Hour', 0)),
                target_min=int(row_data.get('Minute', 0)),
                target_sec=int(row_data.get('Second', 0)),
                target_ms=int(row_data.get('Millisecond', 0)),
                proxy_address=row_data.get('Proxy') if row_data.get('Proxy') != 'None' else None
            )
            self.active_instances[account] = manager
            self.account_to_row[account] = i

            self.table.insertRow(i)

            # Column 0: Checkbox
            check_item = QTableWidgetItem()
            check_item.setFlags(Qt.ItemFlag.ItemIsUserCheckable | Qt.ItemFlag.ItemIsEnabled)
            check_item.setCheckState(Qt.CheckState.Unchecked)
            self.table.setItem(i, 0, check_item)

            # Column 1: Account
            self.table.setItem(i, 1, QTableWidgetItem(account))
            # Column 2: Status
            self.table.setItem(i, 2, QTableWidgetItem(manager.status))
            # Column 3: Time
            time_str = f"{manager.target_hr:02}:{manager.target_min:02}:{manager.target_sec:02}.{manager.target_ms:03}"
            self.table.setItem(i, 3, QTableWidgetItem(time_str))
            # Column 4: Proxy
            self.table.setItem(i, 4, QTableWidgetItem(str(manager.proxy_address or 'None')))
            # Column 5: Actions
            self._add_action_buttons(i, account)

        self.table.resizeColumnsToContents()
        header = self.table.horizontalHeader()
        header.setSectionResizeMode(2, QHeaderView.ResizeMode.Stretch) # Status column
        header.setSectionResizeMode(5, QHeaderView.ResizeMode.ResizeToContents) # Actions

    def _add_action_buttons(self, row: int, account: str):
        """
        Creates a widget containing the 'View', 'Terminate', and 'Delete' buttons
        for a single row and sets it in the 'Actions' column.
        """
        actions_widget = QWidget()
        layout = QHBoxLayout(actions_widget)
        layout.setContentsMargins(5, 0, 5, 0)
        layout.setSpacing(5)

        # Normalized CSS theme templates: Compact padding prevents layout vertical truncation bugs entirely
        view_btn = QPushButton("View")
        view_btn.setToolTip("View this instance's browser window")
        view_btn.setStyleSheet("""
            QPushButton { 
                background-color: #0891B2; 
                color: white; 
                font-size: 11px; 
                padding: 4px 12px; 
                font-weight: bold; 
                border: none; 
                border-radius: 4px; 
            } 
            QPushButton:hover { 
                background-color: #06B6D4; 
            }
        """)
        view_btn.clicked.connect(lambda checked, acc=account: self._view_instance(acc))

        term_btn = QPushButton("Close")
        term_btn.setToolTip("Terminate this instance's process")
        term_btn.setStyleSheet("""
            QPushButton { 
                background-color: #D97706; 
                color: white; 
                font-size: 11px; 
                padding: 4px 12px; 
                font-weight: bold; 
                border: none; 
                border-radius: 4px; 
            } 
            QPushButton:hover { 
                background-color: #F59E0B; 
            }
        """)
        term_btn.clicked.connect(lambda checked, acc=account: self._terminate_instance(acc))

        del_btn = QPushButton("Delete")
        del_btn.setToolTip("Terminate and delete this instance from the list")
        del_btn.setStyleSheet("""
            QPushButton { 
                background-color: #B91C1C; 
                color: white; 
                font-size: 11px; 
                padding: 4px 12px; 
                font-weight: bold; 
                border: none; 
                border-radius: 4px; 
            } 
            QPushButton:hover { 
                background-color: #EF4444; 
            }
        """)
        del_btn.clicked.connect(lambda checked, acc=account: self._delete_instance(acc))

        layout.addWidget(view_btn)
        layout.addWidget(term_btn)
        layout.addWidget(del_btn)
        layout.addStretch()
        self.table.setCellWidget(row, 5, actions_widget)

    def _deploy_all(self):
        """Starts the automation engine for all loaded instances that are not already running."""
        if not self.active_instances:
            QMessageBox.information(self, "No Data", "Please load account data before deploying.")
            return
        for manager in self.active_instances.values():
            if not manager.is_running:
                manager.start_engine()

    def _terminate_all(self, silent: bool = False):
        """Stops the automation engine for all running instances."""
        if not self.active_instances and not silent:
            QMessageBox.information(self, "No Instances", "There are no active instances to terminate.")
            return
        for manager in self.active_instances.values():
            if manager.is_running:
                manager.stop_engine()

    def _terminate_selected(self):
        """Terminates all instances that have their checkbox ticked."""
        accounts = self._get_checked_accounts()
        if not accounts:
            QMessageBox.warning(self, "No Selection", "Please check one or more instances to terminate.")
            return
        for account in accounts:
            self._terminate_instance(account)

    def _terminate_instance(self, account: str):
        """Stops the engine for a specific instance by its account ID."""
        manager = self.active_instances.get(account)
        if manager and manager.is_running:
            manager.stop_engine()

    def _view_instance(self, account: str):
        """
        Brings an instance's browser window to the foreground.
        If the instance isn't running, it will be launched first.
        NOTE: This functionality relies on the 'pywin32' library and only works on Windows.
        """
        manager = self.active_instances.get(account)
        if not manager:
            return

        # If the instance is idle, clicking 'View' is a convenient way to launch it.
        if not manager.is_running:
            print(f"[▶️] 'View' clicked on idle instance. Launching {account}...")
            manager.start_engine()
            QMessageBox.information(self, "Instance Launching", f"The browser for {account} is now being launched.")
            return

        # On non-Windows systems or if pywin32 is not installed, inform the user.
        if not PYWIN32_AVAILABLE:
            QMessageBox.warning(self, "Feature Unavailable", "The 'pywin32' library is required to focus windows. Please install it (`pip install pywin32`) and restart.\n\nThis feature is only available on Windows.")
            return

        window_title = manager.window_title
        hwnd = win32gui.FindWindow(None, window_title)

        # If we found the window handle, use it to restore and focus the window.
        if hwnd:
            print(f"[👁️] Found window for {account} (HWND: {hwnd}). Bringing to front.")
            # Restore if minimized
            win32gui.ShowWindow(hwnd, win32con.SW_RESTORE)
            # Bring to foreground
            win32gui.SetForegroundWindow(hwnd)
        else:
            QMessageBox.warning(self, "Window Not Found", f"Could not find the browser window for {account}.\nIt might still be launching or may have been closed manually.")

    def _delete_instance(self, account: str):
        """Terminates and removes an instance entirely from the UI and state."""
        self._terminate_instance(account)

        row_to_remove = self.account_to_row.get(account)
        if row_to_remove is not None:
            self.table.removeRow(row_to_remove)
            if account in self.active_instances:
                del self.active_instances[account]
            # The row map will be incorrect after this, so we rebuild it.
            self._rebuild_row_map()

    def _delete_selected(self):
        """Terminates and removes all checked instances."""
        accounts = self._get_checked_accounts()
        if not accounts:
            QMessageBox.warning(self, "No Selection", "Please check one or more instances to delete.")
            return

        reply = QMessageBox.question(self, "Confirm Deletion", f"This will terminate and remove {len(accounts)} instance(s). Are you sure?",
                                     QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No)
        if reply == QMessageBox.StandardButton.No:
            return

        # Get a static list of rows to remove, sorted descending to avoid index errors
        rows_to_remove = sorted([self.account_to_row[acc] for acc in accounts if acc in self.account_to_row], reverse=True)

        for row in rows_to_remove:
            # Find account for this row before it's deleted (account is in column 1)
            account = self.table.item(row, 1).text()
            self._terminate_instance(account) # Stop thread
            if account in self.active_instances:
                del self.active_instances[account]

        # Remove rows from the table UI after processing
        for row in rows_to_remove:
            self.table.removeRow(row)

        # Finally, rebuild the clean mapping from account to the new row indices
        self._rebuild_row_map()

    def _get_checked_accounts(self) -> List[str]:
        """Returns a list of account names for all checked rows."""
        checked_accounts = []
        for row in range(self.table.rowCount()):
            # Checkbox is in column 0
            if self.table.item(row, 0).checkState() == Qt.CheckState.Checked:
                # Account is in column 1
                account_item = self.table.item(row, 1)
                if account_item:
                    checked_accounts.append(account_item.text())
        return checked_accounts

    def _open_edit_dialog(self):
        """Opens the 'Hot-Patch' dialog for the currently highlighted row in the table."""
        selected_rows = self.table.selectionModel().selectedRows()
        if not selected_rows:
            QMessageBox.warning(self, "No Selection", "Please highlight a single instance to edit.")
            return
        # Account is in column 1
        account = self.table.item(selected_rows[0].row(), 1).text()
        instance = self.active_instances.get(account)
        if instance:
            dialog = EditInstanceDialog(self, instance)
            dialog.exec()

    def _update_dashboard_from_state(self):
        """
        The heart of the dashboard's live updates. This method is called by a QTimer.
        It iterates through all active instances, reads their current state (status, time), and updates the UI table.
        """
        status_colors = {
            "active": QColor("#00FF66"), "error": QColor("#FF4D4D"),
            "loading": QColor("#FFD633"), "default": QColor("#0F1420")
        }

        for account, manager in self.active_instances.items():
            row = self.account_to_row.get(account)
            if row is None: continue

            # Update the 'Operational State (Status)' column and apply color-coding.
            status_item = self.table.item(row, 2)
            if status_item.text() != manager.status:
                status_item.setText(manager.status)
                status_lower = manager.status.lower()
                color_key = "default"
                if "error" in status_lower or "terminated" in status_lower: color_key = "error"
                elif "armed" in status_lower or "executing" in status_lower or "dashboard" in status_lower: color_key = "active"
                elif "init" in status_lower or "launching" in status_lower or "navigating" in status_lower or "routing" in status_lower: color_key = "loading"
                status_item.setBackground(QBrush(status_colors[color_key]))

            # Update the 'Trigger Matrix' column. This ensures changes from the Hot-Patch dialog are reflected.
            time_item = self.table.item(row, 3)
            new_time_str = f"{manager.target_hr:02}:{manager.target_min:02}:{manager.target_sec:02}.{manager.target_ms:03}"
            if time_item.text() != new_time_str:
                time_item.setText(new_time_str)

    def _select_all(self):
        """Sets all row checkboxes to checked."""
        for row in range(self.table.rowCount()):
            self.table.item(row, 0).setCheckState(Qt.CheckState.Checked)

    def _deselect_all(self):
        """Sets all row checkboxes to unchecked."""
        for row in range(self.table.rowCount()):
            self.table.item(row, 0).setCheckState(Qt.CheckState.Unchecked)

    def _rebuild_row_map(self):
        """
        Clears and rebuilds the account-to-row index map.
        This is a crucial maintenance step to call after any row(s) are deleted from the table,
        ensuring the fast lookup map doesn't point to incorrect or non-existent rows.
        """
        self.account_to_row.clear()
        for row in range(self.table.rowCount()):
            self.account_to_row[self.table.item(row, 1).text()] = row

    def closeEvent(self, event):
        """Handles the application close event, ensuring all threads are terminated."""
        reply = QMessageBox.question(self, 'Quit', "This will terminate all running browser instances. Are you sure?",
                                     QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No,
                                     QMessageBox.StandardButton.No)
        if reply == QMessageBox.StandardButton.Yes:
            self._terminate_all(silent=True)
            event.accept()
        else:
            event.ignore()


def _patch_data_ingestor():
    """Dynamically adds a generic load_from_source method to DataIngestor."""
    def load_from_source(self, source: str) -> Dict[str, Any]:
        if "docs.google.com" in source:
            return self.load_from_google_sheet(source)
        elif source.endswith(('.xlsx', '.xls')):
            return self.load_from_excel(source)
        elif source.endswith('.csv'):
            return self.load_from_csv(source)
        return {"success": False, "data": [], "error": "Unsupported file or URL format.", "warnings": []}
    DataIngestor.load_from_source = load_from_source

_patch_data_ingestor()
```


## FILE: ./gui/theme.py

```py
# --- Global Stylesheet (QSS) for the Cyber Tactical Dark Theme ---
# This defines the entire visual profile of the application.
CYBER_DARK_STYLESHEET = """
    /* Main Window & Dialogs */
    QMainWindow, QDialog {
        background-color: #0B0F17; /* Deep Canvas Charcoal/Navy */
    }

    /* Labels */
    QLabel {
        color: #94A3B8; /* Slate Gray */
        font-size: 14px;
    }

    /* Input Fields */
    QLineEdit {
        background-color: #0F1420;
        color: #E2E8F0;
        border: 1px solid #334155;
        border-radius: 4px;
        padding: 8px;
        font-size: 14px;
    }
    QLineEdit:focus {
        border-color: #4F46E5; /* Indigo for focus */
    }

    /* Buttons */
    QPushButton {
        background-color: #334155; /* Slate */
        color: #E2E8F0;
        border: none;
        border-radius: 4px;
        padding: 8px 16px;
        font-size: 14px;
        font-weight: bold;
    }
    QPushButton:hover {
        background-color: #475569;
    }
    QPushButton:pressed {
        background-color: #1E293B;
    }

    /* Primary Action Button (Deploy) */
    QPushButton#deployButton {
        background-color: #2563EB; /* Blue */
        color: white;
    }
    QPushButton#deployButton:hover {
        background-color: #3B82F6;
    }

    /* Destructive Action Button (Terminate Suite) */
    QPushButton#terminateSuiteButton {
        background-color: #991B1B; /* Dark Crimson */
        color: white;
    }
    QPushButton#terminateSuiteButton:hover {
        background-color: #B91C1C;
    }

    /* Table Widget */
    QTableWidget {
        background-color: #121824; /* Panel Container */
        color: #94A3B8;
        border: 1px solid #334155;
        gridline-color: #1E293B;
        font-size: 13px;
    }

    /* Table Header */
    QHeaderView::section {
        background-color: #1E293B;
        color: #94A3B8;
        padding: 8px;
        border: 1px solid #334155;
        font-weight: bold;
    }

    /* Table Cells */
    QTableWidget::item {
        padding: 8px;
        border-bottom: 1px solid #1E293B;
    }
    QTableWidget::item:selected {
        background-color: #334155;
        color: #F1F5F9;
    }

    /* Scrollbars */
    QScrollBar:vertical, QScrollBar:horizontal {
        border: none;
        background: #121824;
        width: 10px;
        height: 10px;
        margin: 0px 0px 0px 0px;
    }
    QScrollBar::handle:vertical, QScrollBar::handle:horizontal {
        background: #334155;
        min-height: 20px;
        min-width: 20px;
        border-radius: 5px;
    }

    /* SpinBox for Hot-Patching */
    QSpinBox {
        background-color: #0F1420;
        color: #E2E8F0;
        border: 1px solid #334155;
        border-radius: 4px;
        padding: 5px;
        font-size: 16px;
        font-weight: bold;
    }
    QSpinBox::up-button, QSpinBox::down-button {
        width: 20px;
    }
"""
```


## FILE: ./gui/__init__.py

```py

```
