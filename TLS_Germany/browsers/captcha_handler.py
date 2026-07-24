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

    def _dismiss_alerts(self):
        """Silently dismisses any unexpected browser alerts that freeze execution."""
        try:
            if self.driver.is_alert_present():
                self.driver.accept_alert()
        except Exception:
            pass

    def cloudflare(self) -> None:
        """
        Handles the Cloudflare Turnstile challenge page ("Performing security verification").
        This method waits in a loop, checking for multiple success conditions:
        1. The URL changing, which means the challenge was passed.
        2. A "Verification successful" message appearing.
        It will also attempt to click the interactive checkbox if it appears.
        """
        print("[🧩] CaptchaHandler: Cloudflare challenge detected. Waiting for resolution...")
        current_url = self.driver.current_url

        # Wait up to 45 seconds for the challenge to be solved.
        for i in range(45):
            # Primary success condition: URL has changed.
            if self.driver.current_url != current_url:
                print(f"[✅] CaptchaHandler: Cloudflare challenge passed (URL changed after {i+1}s).")
                time.sleep(3) # Allow next page to load
                return

            # Secondary success condition: "Verification successful" text appears.
            if self.driver.is_element_visible(TLS_SELECTORS['cloudflare']['verification_successful_text']):
                print("    - Cloudflare verification successful text found. Waiting for redirect...")
                try:
                    # Now, we must wait for the URL to change.
                    self.driver.wait_for_url_change(current_url, timeout=15)
                    print("[✅] CaptchaHandler: Cloudflare challenge passed and redirected.")
                    time.sleep(3)
                    return
                except Exception:
                    print("[⚠️] CaptchaHandler: Found success text but did not redirect in time.")
                    return # Exit, as something is wrong.

            # Interactive element handling: Periodically check for and click the checkbox.
            if i > 2 and i % 4 == 0:
                try:
                    checkbox_selector = f"{TLS_SELECTORS['cloudflare']['turnstile_iframe']} >>> {TLS_SELECTORS['cloudflare']['turnstile_checkbox']}"
                    if self.driver.is_element_visible(checkbox_selector):
                        print("    - Found interactive Cloudflare Turnstile. Attempting to click...")
                        self.driver.click(checkbox_selector)
                        print("    - Clicked Turnstile checkbox.")
                except Exception:
                    pass # It's fine if it's not there or fails; we'll just keep waiting.

            time.sleep(1)

        print("[⚠️] CaptchaHandler: Timed out waiting for Cloudflare page to resolve. The page might be stuck.")

    def _solve_audio_challenge_modal(self, thread_id: int) -> bool:
        """
        Handles the audio challenge modal after switching to its iframe.
        """
        mp3_path, wav_path = None, None
        try:
            self._dismiss_alerts()

            # 1. Check for Audio Block (Google blocking IP from automated queries)
            if self.driver.is_element_visible(TLS_SELECTORS['recaptcha_v2']['error_message']):
                print(f"[❌][{thread_id}] IP blocked from audio challenge (Automated queries detected).")
                return False

            # 2. Extract Audio URL directly (WE SKIP THE PLAY BUTTON ENTIRELY TO AVOID BOT DETECTION)
            print(f"    - Looking for audio download link...")
            self.driver.wait_for_element_present(TLS_SELECTORS['recaptcha_v2']['audio_download_link'], timeout=10)
            audio_url = self.driver.get_attribute(TLS_SELECTORS['recaptcha_v2']['audio_download_link'], "href")

            # Fallback if the download link is empty
            if not audio_url:
                audio_url = self.driver.get_attribute(TLS_SELECTORS['recaptcha_v2']['audio_source'], "src")

            if not audio_url or not audio_url.startswith("http"):
                print(f"[❌][{thread_id}] Could not capture audio stream URL.")
                return False

            print(f"    - Audio stream URL captured. Downloading silently...")

            # 3. Generate unique file paths for thread safety
            timestamp = int(time.time())
            mp3_path = os.path.abspath(f"./downloaded_files/audio_{thread_id}_{timestamp}.mp3")
            wav_path = os.path.abspath(f"./downloaded_files/audio_{thread_id}_{timestamp}.wav")

            # 4. Download MP3 using session cookies to prevent access denied
            session = requests.Session()
            for cookie in self.driver.get_cookies():
                session.cookies.set(cookie['name'], cookie['value'])
            
            response = session.get(audio_url, headers={'User-Agent': self.driver.get_user_agent()})
            with open(mp3_path, 'wb') as f:
                f.write(response.content)

            # 5. Convert MP3 to WAV using Pydub & FFmpeg
            try:
                AudioSegment.from_mp3(mp3_path).export(wav_path, format="wav")
            except FileNotFoundError:
                print(f"\n[⚠️ CRITICAL ERROR][{thread_id}] FFmpeg IS NOT INSTALLED OR NOT IN PATH!")
                print("    -> Pydub cannot convert MP3 to WAV without FFmpeg.")
                return False

            # 6. Transcribe WAV file to Text
            recognizer = sr.Recognizer()
            with sr.AudioFile(wav_path) as source:
                audio_data = recognizer.record(source)
            
            transcribed_text = recognizer.recognize_google(audio_data).lower()
            print(f"    - Transcription successful: '{transcribed_text}'")

            # 7. Type Response and Verify
            self.driver.type(TLS_SELECTORS['recaptcha_v2']['audio_response_input'], transcribed_text)
            time.sleep(0.5)
            # Using js_click() to bypass overlays
            self.driver.js_click(TLS_SELECTORS['recaptcha_v2']['verify_button'])
            print(f"    - Submitted transcription and clicked Verify.")
            time.sleep(3)
            return True

        except Exception as e:
            err_str = str(e)
            err_msg = err_str.splitlines()[0] if err_str.splitlines() else str(e.__class__.__name__)
            print(f"[❌][{thread_id}] Audio challenge processing failed: {err_msg}")
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
            self._dismiss_alerts()
            time.sleep(2)

            # Step 1: Find and Switch to Checkbox Iframe safely
            self.driver.wait_for_element_visible(TLS_SELECTORS['recaptcha_v2']['checkbox_iframe'], timeout=12)
            checkbox_iframe = self.driver.find_element("css selector", TLS_SELECTORS['recaptcha_v2']['checkbox_iframe'])
            
            # Scroll to center to avoid getting blocked by floating headers
            self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", checkbox_iframe)
            time.sleep(1)

            self.driver.switch_to.frame(checkbox_iframe)
            self.driver.wait_for_element_visible(TLS_SELECTORS['recaptcha_v2']['checkbox'], timeout=10)
            
            # Use js_click() to cut through Google's defensive layers
            self.driver.js_click(TLS_SELECTORS['recaptcha_v2']['checkbox'])
            
            self.driver.switch_to.default_content()
            print(f"    - Clicked checkbox. Waiting for challenge...")
            time.sleep(3)

            self._dismiss_alerts()

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
            err_str = str(e)
            err_msg = err_str.splitlines()[0] if err_str.splitlines() else str(e.__class__.__name__)
            print(f"[❌][{thread_id}] An unexpected error occurred during CAPTCHA bypass: {err_msg}")
            try:
                self.driver.switch_to.default_content()
            except:
                pass
            return False