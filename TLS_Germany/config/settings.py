"""
Omni-Booking-Automation-Suite/TLS_Germany/config/settings.py
"""

# --- TYPING PROFILES ---
TYPING_SPEED_MIN = 0.05
TYPING_SPEED_MAX = 0.15

# --- ACTION DELAYS ---
ACTION_DELAY_MIN = 0.5
ACTION_DELAY_MAX = 1.2

# --- DIGITAL PERSONA BASELINES ---
# The jitter applied to create unique instances
PERSONA_TYPE_JITTER = 0.03
PERSONA_DELAY_JITTER = 0.2

# --- TIMEOUTS ---
WAIT_TIMEOUT_ELEMENT_READY = 10
START_URL = "https://visas-de.tlscontact.com/en-us"