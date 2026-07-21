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
            # 1. التحقق من عدم وجود حظر مؤقت من جوجل بسبب كثرة المحاولات
            if self.driver.is_element_visible(TLS_SELECTORS['recaptcha_v2']['error_message']):
                print(f"[❌][{thread_id}] IP blocked from audio challenge (Automated queries detected).")
                return False

            # 2. الضغط على زر PLAY أولاً لتوليد ملف الصوت وجلب الرابط الخاص به
            print(f"    - Looking for PLAY button...")
            self.driver.wait_for_element_visible(TLS_SELECTORS['recaptcha_v2']['audio_play_button'], timeout=10)
            self.driver.click(TLS_SELECTORS['recaptcha_v2']['audio_play_button'])
            print(f"    - Clicked PLAY button successfully.")
            time.sleep(2) # الانتظار لحين بدء تحميل الصوت في المتصفح

            # 3. استخراج رابط الصوت الفعلي من عنصر الـ audio أو الـ source الداخلي
            audio_url = None
            try:
                # محاولة قراءة رابط الـ src من عنصر الـ audio مباشرة
                audio_url = self.driver.get_attribute(TLS_SELECTORS['recaptcha_v2']['audio_source'], "src")
            except:
                pass

            if not audio_url:
                # بديل: سحب الرابط عبر JavaScript من داخل الـ DOM إذا كان مخفياً
                audio_url = self.driver.execute_script(
                    "var audio = document.querySelector('audio'); return audio ? audio.src : '';"
                )

            if not audio_url or not audio_url.startswith("http"):
                print(f"[❌][{thread_id}] Could not capture audio stream URL.")
                return False

            print(f"    - Audio stream URL captured. Downloading...")

            # 4. مسارات الملفات المؤقتة الخاصة بهذا الـ Thread
            timestamp = int(time.time())
            mp3_path = os.path.abspath(f"./downloaded_files/audio_{thread_id}_{timestamp}.mp3")
            wav_path = os.path.abspath(f"./downloaded_files/audio_{thread_id}_{timestamp}.wav")

            # 5. تحميل ملف الصوت باستخدام جلسة المتصفح (Session & Cookies) لتجنب حظر جوجل
            session = requests.Session()
            for cookie in self.driver.get_cookies():
                session.cookies.set(cookie['name'], cookie['value'])
            
            response = session.get(audio_url, headers={'User-Agent': self.driver.get_user_agent()})
            with open(mp3_path, 'wb') as f:
                f.write(response.content)

            # 6. تحويل الملف الصوتي من MP3 إلى WAV عبر Pydub وتحويله لنص
            AudioSegment.from_mp3(mp3_path).export(wav_path, format="wav")
            recognizer = sr.Recognizer()
            with sr.AudioFile(wav_path) as source:
                audio_data = recognizer.record(source)
            
            transcribed_text = recognizer.recognize_google(audio_data).lower()
            print(f"    - Transcription successful: '{transcribed_text}'")

            # 7. كتابة النص في خانة الإدخال والضغط على Verify
            self.driver.type(TLS_SELECTORS['recaptcha_v2']['audio_response_input'], transcribed_text)
            time.sleep(1)
            self.driver.click(TLS_SELECTORS['recaptcha_v2']['verify_button'])
            print(f"    - Submitted transcription and clicked Verify.")
            time.sleep(3)
            return True

        except Exception as e:
            print(f"[❌][{thread_id}] Audio challenge processing failed: {str(e).splitlines()[0]}")
            return False
        finally:
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
            # 💡 معالجة مشكلة Click Intercepted: الانتظار قليلاً لضمان استقرار الصفحة واختفاء التراكيب المؤقتة
            time.sleep(2)

            # الخطوة 1: تحديد الـ Iframe الخاص بالمربع والضغط عليه بأمان
            self.driver.wait_for_element_visible(TLS_SELECTORS['recaptcha_v2']['checkbox_iframe'], timeout=12)
            checkbox_iframe = self.driver.find_element("css selector", TLS_SELECTORS['recaptcha_v2']['checkbox_iframe'])
            
            # التأكد من تمرير الشاشة ليصل العنصر لمنتصف الشاشة (لتجنب الـ interception)
            self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", checkbox_iframe)
            time.sleep(1)

            self.driver.switch_to.frame(checkbox_iframe)
            self.driver.wait_for_element_visible(TLS_SELECTORS['recaptcha_v2']['checkbox'], timeout=10)
            self.driver.click(TLS_SELECTORS['recaptcha_v2']['checkbox'])
            
            self.driver.switch_to.default_content()
            print(f"    - Clicked checkbox. Waiting for challenge...")
            time.sleep(3)

            # الخطوة 1.5: التحقق هل تم حلها بـ "صح أخضر" فوراً بدون تحديث؟
            self.driver.switch_to.frame(checkbox_iframe)
            is_checked = self.driver.get_attribute(TLS_SELECTORS['recaptcha_v2']['checkbox'], "aria-checked")
            self.driver.switch_to.default_content()

            if str(is_checked).lower() == "true":
                print(f"[✅][{thread_id}] CAPTCHA instantly solved (Green Checkmark).")
                return True

            # الخطوة 2: التحقق من ظهور نافذة التحدي (Challenge Iframe) والانتقال لها
            if self.driver.is_element_visible(TLS_SELECTORS['recaptcha_v2']['challenge_iframe']):
                challenge_iframe_element = self.driver.find_element("css selector", TLS_SELECTORS['recaptcha_v2']['challenge_iframe'])
                self.driver.switch_to.frame(challenge_iframe_element)
                
                # الضغط على زر السماعة (Audio Button) لتحويل التحدي لصوتي
                self.driver.wait_for_element_visible(TLS_SELECTORS['recaptcha_v2']['audio_button'], timeout=10)
                self.driver.click(TLS_SELECTORS['recaptcha_v2']['audio_button'])
                print(f"    - Switched to audio challenge.")
                time.sleep(2)

                # تشغيل دالة معالجة التحدي الصوتي
                if not self._solve_audio_challenge_modal(thread_id):
                    self.driver.switch_to.default_content()
                    return False
            else:
                print(f"[❌][{thread_id}] Challenge iframe not found.")
                self.driver.switch_to.default_content()
                return False

            # الخطوة 3: التأكد النهائي من نجاح التحقق
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