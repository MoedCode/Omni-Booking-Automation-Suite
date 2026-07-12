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