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
        "captcha_widget": "iframe[title='reCAPTCHA']"
    },

    # [4] Application List Page
    "application_list": {
        "page_title_header": "h1#page-title",
        "select_application_button": "//button[contains(., 'Select')]",
        "create_new_button": "span[data-testid='btn-create-new-travel-group']"
    },

    # [5] Service Level Page (Upsells/Insurance)
    "service_level": {
        "continue_btn": "a#book-appointment-btn, a[data-testid='btn-book-appointment']"
    },

    # [6] Dashboard Ready State (Calendar Page)
    "dashboard": {
        "logged_in_anchor": "a[href*='/logout'], button.user-profile, div.dashboard-container"
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
        "heading_text": "h2:contains('Performing security verification')", 
        "turnstile_iframe": "iframe[src*='challenges.cloudflare.com']",
        "turnstile_checkbox": "input[type='checkbox']", 
        "verification_successful_text": "h2:contains('Verification successful')" 
    }
}