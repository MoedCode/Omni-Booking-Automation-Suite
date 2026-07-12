"""
Omni-Booking-Automation-Suite/TLS_Germany/config/selectors.py
Fully mapped selectors for the TLScontact Germany / Portugal workflow engines
"""

TLS_SELECTORS = {
    # [0] choose_country -> Extracted from Germany visa application centre & captured dropdown snapshots
    "choose_country": {
        "splash_container": "div#splash-country-selector",
        "select_dropdown": "select#select-country",
        "confirm_country_btn": "a#btn-confirm-country",
        "apply_for_visa_btn": "button#btn-apply-for-a-visa",
        "cookie_close_btn": "button.osano-cm-close"
    },
    
    # [1] choose_city -> Extracted from Germany Visa Application Centres view (Header: Select your VAC)
    "choose_city": {
        "map_view_search_input": "input#search-vac-map-view",
        "list_view_search_input": "input#search-vac-list-view",
        "search_submit_btn": "button:contains('Search')",
        "generic_continue_btn": "button[data-testid='btn-select-vac']",
        
        # Specific regional routing links (Smart choice target isolation)
        "alexandria_center_route": "a[href*='/vac/egALY2de']",
        "cairo_center_route": "a[href*='/vac/egCAI2de']",
        "hurghada_center_route": "a[href*='/vac/egHRG2de']",
        "6th_of_october_route": "a[href*='/vac/egHAC2de']"
    },
    
    # [2] info_page -> Extracted from German-visa services in Alexandria center landing dashboard
    "info_page": {
        "header_login_btn": "a[href='/en-us/login']",
        "login_btn_inner_span": "a[href='/en-us/login'] span.TlsButton_tls-button__syUS5",
        "services_tab_link": "a[href$='/services']",
        "application_process_link": "a[href$='/application-process']",
        "news_bulletins_link": "a[href$='/news']",
        "address_hours_footer_link": "a[href$='/address-opening-hours']"
    },
    
    # [3] login_form -> Extracted from TLScontact Keycloak Auth Central login page
    "login_form": {
        "form_title_header": "h1#login-page-title",
        "email_input_field": "input#email-input-field",       # native element attribute: name="username"
        "password_input_field": "input#password-input-field", # native element attribute: name="password"
        "forgot_password_btn": "a#forget-password",
        "submit_login_btn": "button#btn-login"
    }
}