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