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