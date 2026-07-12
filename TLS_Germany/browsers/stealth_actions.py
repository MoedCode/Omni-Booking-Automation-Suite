"""
Omni-Booking-Automation-Suite/TLS_Germany/browsers/stealth_actions.py
"""
import time
import random
import asyncio
from seleniumbase import Driver
from config import settings

class StealthActions:
    """
    Binds to a Driver instance and generates a unique 'Digital Persona'.
    Executes human-like interactions (typing, clicking, scrolling) to bypass WAFs.
    """

    def __init__(self, driver: Driver):
        self.driver = driver
        
        # Generate a unique behavior profile for this specific thread instance.
        self.base_type_min = random.uniform(settings.TYPING_SPEED_MIN, settings.TYPING_SPEED_MIN + settings.PERSONA_TYPE_JITTER)
        self.base_type_max = random.uniform(settings.TYPING_SPEED_MAX - settings.PERSONA_TYPE_JITTER, settings.TYPING_SPEED_MAX)
        
        self.base_delay_min = random.uniform(settings.ACTION_DELAY_MIN, settings.ACTION_DELAY_MIN + settings.PERSONA_DELAY_JITTER)
        self.base_delay_max = random.uniform(settings.ACTION_DELAY_MAX - settings.PERSONA_DELAY_JITTER, settings.ACTION_DELAY_MAX)

    async def natural_delay(self, min_sec: float = None, max_sec: float = None) -> None:
        """Pauses execution using the persona's reaction time, or custom limits if provided."""
        sleep_time = random.uniform(min_sec or self.base_delay_min, max_sec or self.base_delay_max)
        await asyncio.sleep(sleep_time)

    async def smart_type(self, selector: str, text_to_type: str, timeout: int = settings.WAIT_TIMEOUT_ELEMENT_READY) -> None:
        """Waits for field, clears it, and types character-by-character using persona rhythms."""
        await asyncio.to_thread(self.driver.wait_for_element_interactable, selector, timeout=timeout)
        await asyncio.to_thread(self.driver.click, selector)
        await asyncio.to_thread(self.driver.clear, selector)

        for char in text_to_type:
            await asyncio.to_thread(self.driver.add_text, selector, char)
            delay = random.uniform(self.base_type_min, self.base_type_max)
            await asyncio.sleep(delay)

    async def human_click(self, selector: str, timeout: int = settings.WAIT_TIMEOUT_ELEMENT_READY) -> None:
        """Waits for element visibility, pauses briefly (targeting), then clicks."""
        await asyncio.to_thread(self.driver.wait_for_element_visible, selector, timeout=timeout)
        await asyncio.to_thread(self.driver.wait_for_element_clickable, selector, timeout=timeout)
        await self.natural_delay()
        await asyncio.to_thread(self.driver.click, selector)

    async def safe_scroll(self, selector: str, timeout: int = settings.WAIT_TIMEOUT_ELEMENT_READY) -> None:
        """Scrolls the element into the viewport smoothly to prevent off-screen click detection."""
        await asyncio.to_thread(self.driver.wait_for_element_present, selector, timeout=timeout)
        await self.natural_delay(0.2, 0.5) # Short pause before scrolling
        await asyncio.to_thread(self.driver.scroll_to, selector)
        await self.natural_delay(0.3, 0.7) # Let user 'read' after scrolling

    async def ensure_element_state(self, selector: str, timeout: int = settings.WAIT_TIMEOUT_ELEMENT_READY) -> bool:
        """Checks if an element exists and is visible without throwing fatal exceptions."""
        try:
            await asyncio.to_thread(self.driver.wait_for_element_visible, selector, timeout=timeout)
            return True
        except Exception:
            return False