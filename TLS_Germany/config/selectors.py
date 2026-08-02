"""
Omni-Booking-Automation-Suite/TLS_Germany/config/selectors.py
Fully mapped selectors for the TLScontact Germany workflow engines
"""

TLS_SELECTORS = {
    # [0] choose_country & landing page navigation
    "choose_country": {
        "splash_container": "div#splash-country-selector",
        "select_dropdown": "select#select-country",
        "confirm_country_btn": "a#btn-confirm-country",
        "apply_for_visa_btn": "button#btn-apply-for-a-visa",
        "cookie_close_btn": "button.osano-cm-close",
        "user_dropdown_btn": "svg[aria-label='User icon']",
        "login_link": "div#login"
    },

    # [1] choose_city
    "choose_city": {
        "page_title_header": "h1#page-title",
        "map_view_search_input": "input#search-vac-map-view",
        "list_view_search_input": "input#search-vac-list-view",
        "search_submit_btn": "input#search-vac-map-view + button",
        "vac_list_container": "ul.flex.flex-wrap",  
        "city_card": "div.TlsVacCard_tls-vac-card__DLGQr",
        "city_card_title": "p.TlsVacCard_tls-vac-card_title__qk6jS",
        "generic_continue_btn": "button[data-testid='btn-select-vac']"
    },

    # [2] info_page
    "info_page": {
        "header_login_btn": "a[href*='/login']",
        "login_btn_inner_span": "a[href='/en-us/login'] span.TlsButton_tls-button__syUS5",
        "services_tab_link": "a[href$='/services']",
        "application_process_link": "a[href$='/application-process']",
        "news_bulletins_link": "a[href$='/news']",
        "address_hours_footer_link": "a[href$='/address-opening-hours']",
        "user_icon_button": "svg[aria-label='User icon']",
        "my_application_button": "div#my-application"
    },

    # [3] login_form
    "login_form": {
        "form_title_header": "h1#login-page-title",
        "email_input_field": "input#email-input-field",
        "password_input_field": "input#password-input-field",
        "forgot_password_btn": "a#forget-password",
        "submit_login_btn": "button#btn-login",
        "captcha_widget": "iframe[title='reCAPTCHA']",
        "invalid_credentials_error": "p.tls-input_error-label"
    },

    # [4] Application List Page
    "application_list": {
        "page_title_header": "h1#page-title",
        "city_tabs": "div.light-scroll a",
        "selected_city_tab_text": "div.TlsTab_--selected__85uu4 p",
        "select_application_button": "//*[contains(text(), 'Select') and (local-name()='button' or local-name()='a' or local-name()='span' or local-name()='div')]",
        "create_new_button": "span[data-testid='btn-create-new-travel-group']"
    },

    # [5] Service Level Page (Upsells/Insurance)
    "service_level": {
        "continue_btn": "a#book-appointment-btn, a[data-testid='btn-book-appointment']"
    },

    # [6] Appointment Booking Page (Calendar)
    "appointment_booking": {
        "page_title": "h1[data-test-id='page-title']",
        "month_selector_container": "div.relative.flex.items-center.overflow-hidden",
        
        # --- Month Navigation ---
        "current_month_button": "p[data-testid='btn-current-month-available']",
        "next_month_button": "button[data-testid='btn-next-month-available']",
        "prev_month_button": "button[data-testid='btn-prev-month-available']",
        
        # --- Slot Detection ---
        "available_slot": "button[data-testid^='appointment-slot-']",
        "book_appointment_button": "button:contains('Book your appointment')",
        "services_breadcrumb": "a[href*='/service-level']",
        "booking_breadcrumb": "a[href*='/appointment-booking']"
    },

    # [7] Google reCAPTCHA v2 Elements
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
    },

    # [8] Cloudflare Interstitial Page
    "cloudflare": {
        "page_title": "Just a moment...", 
        "heading_text": "h2#fTjHU3", 
        "turnstile_iframe": "iframe[src*='challenges.cloudflare.com']",
        "turnstile_checkbox": "input[type='checkbox']", 
        "verification_successful_text": "h2#yZFa8" 
    }
}