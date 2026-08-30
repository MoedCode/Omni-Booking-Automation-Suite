/* Omni-Booking-Automation-Suite/VFS_Portugal/Config/Selectors.js */

/**
 * Comprehensive Selectors Configuration for VFS Global (Portugal - Egypt Portal)
 * 
 * Hierarchy:
 * Page Object -> Section Object -> Element Name -> [Array of Fallback Selectors]
 */

const Selectors = {
    // -----------------------------------------------------------
    // 1. Common / Shared Elements (Appears across multiple pages)
    // -----------------------------------------------------------
    common: {
        cookieBanner: {
            container: [
                'div#onetrust-banner-sdk',
                'div[aria-label="Cookie banner"]'
            ],
            acceptButton: [
                'button#onetrust-accept-btn-handler',
                'button:has-text("Accept All Cookies")'
            ],
            rejectButton: [
                'button#onetrust-reject-all-handler',
                'button:has-text("Accept Only Necessary")'
            ],
            preferencesButton: [
                'button#onetrust-pc-btn-handler',
                'button[aria-label*="Cookies Settings"]'
            ]
        },
        loaders: {
            overlay: [
                'ngx-ui-loader .ngx-overlay',
                '.ngx-overlay.loading-foreground',
                '#loader'
            ],
            spinner: [
                '.ngx-foreground-spinner',
                '.sk-ball-spin-clockwise'
            ]
        },
        cookieBanner: {
            container: ['#onetrust-banner-sdk'],
            acceptButton: [
                'button#onetrust-accept-btn-handler',
                '#onetrust-button-group .ot-button-order-0' // Fallback by order
            ],
            rejectButton: ['button#onetrust-reject-all-handler'],
            preferencesButton: ['button#onetrust-pc-btn-handler']
        },
        header: {
            logo: ['header.header-main a.navbar-brand img'],
            languageDropdown: [
                'button#dropdownMenuButton',
                'header .dropdown-toggle'
            ],
            languageOptions: {
                english: ['a.dropdown-item:has-text("English")'],
                portuguese: ['a.dropdown-item:has-text("Portuguese")']
            },
            logoutButton: [
                'a.dropdown-item:has-text("Logout")',
                'a.nav-link:has-text("Sign Out")'
            ]
        },
        footer: {
            container: ['footer.footer-bottom'],
            contactUsLink: ['footer a:has-text("Contact Us")'],
            aboutLink: ['footer a:has-text("About VFS Global")'],
            deleteAccountLink: ['footer a:has-text("Delete My Account")']
        }
    },

    // -----------------------------------------------------------
    // 2. Login Page
    // -----------------------------------------------------------
    login: {
        headers: {
            mainTitle: ['h1.fs-21:has-text("Sign in")'],
            subtitle: ['p.c-brand-grey-para:has-text("Enter your email and password")']
        },
        form: {
            account: [
                'input[formcontrolname="username"]',
                'input#email'
            ],
            password: [
                'input[formcontrolname="password"]',
                'input#password'
            ],
            showPasswordIcon: [
                'i.icon-toggle.fa-eye',
                'i[aria-label="Show Password"]'
            ],
            submitButton: [
                'button.btn-brand-orange:has-text("Sign In")',
                'button.mat-mdc-outlined-button'
            ]
        },
        links: {
            forgotPassword: ['a:has-text("Forgot Password")'],
            noAccount: ['a:has-text("I don\'t have an account")'],
            activateAccount: ['a:has-text("Activate my account")']
        },
        captcha: {
            container: ['app-cloudflare-captcha-container'],
            iframe: [
                'iframe[title*="Cloudflare"]',
                'iframe[src*="challenges.cloudflare.com"]'
            ],
            checkbox: ['.cb-c'] // This targets the actual checkbox inside the Cloudflare iframe if needed
        }
    },

    // -----------------------------------------------------------
    // 3. Dashboard Page
    // -----------------------------------------------------------
    dashboard: {
        headers: {
            srOnlyTitle: ['h1.sr-only:has-text("Dashboard")']
        },
        actions: {
            // Capturing both mobile and desktop versions of the button
            startNewBookingDesktop: [
                'button.custom-height-button:has-text("Start New Booking")'
            ],
            startNewBookingMobile: [
                'button.mat-btn-lg.btn-block:has-text("Start New Booking")'
            ]
        },
        tabs: {
            activeApplications: [
                '.mdc-tab__text-label:has-text("Active application(s)")',
                '#mat-tab-group-0-label-0'
            ],
            noApplicationsFound: [
                'div:has-text("No Application(s) Found.")',
                'mat-tab-body-content div'
            ]
        }
    },

    // -----------------------------------------------------------
    // 4. Appointment Details Page
    // -----------------------------------------------------------
    appointmentDetails: {
        stepper: {
            container: ['#stepper', 'ul.steps-nav'],
            activeStep: ['.nav-item.active a.nav-link span.name'],
            step1: ['li.nav-item:has(span.sr-num:has-text("1"))'],
            step2: ['li.nav-item:has(span.sr-num:has-text("2"))'],
            step3: ['li.nav-item:has(span.sr-num:has-text("3"))'],
            step4: ['li.nav-item:has(span.sr-num:has-text("4"))'],
            step5: ['li.nav-item:has(span.sr-num:has-text("5"))']
        },
        headers: {
            mainTitle: [
                'h1.fs-24:has-text("Appointment Details")',
                'mat-card h1'
            ],
            subtitle: [
                'p.c-brand-grey-para:has-text("Please provide information about the type of visa")'
            ]
        },
        form: {
            city: [
                'mat-select[formcontrolname="centerCode"]',
                'mat-select[aria-labelledby="mat-select-value-1"]'
            ],
            appointmentCategory: [
                'mat-select[formcontrolname="selectedSubvisaCategory"]',
                'mat-select[aria-labelledby="mat-select-value-5"]'
            ],
            subCategory: [
                'mat-select[formcontrolname="visaCategoryCode"]',
                'mat-select[aria-labelledby="mat-select-value-3"]'
            ],
            continueButton: [
                'button.btn-brand-orange:has-text("Continue")',
                'button.mat-mdc-raised-button:not([disabled])'
            ]
        },
        // Dropdown Panel Elements (Used for dynamic reading & comparing)
        dropdownPanel: {
            container: [
                '.mat-mdc-select-panel',
                'div[role="listbox"]'
            ],
            options: [
                'mat-option.mdc-list-item'
            ],
            optionText: [
                '.mdc-list-item__primary-text'
            ]
        },
        alerts: {
            errorMessages: [
                'div.errorMessage.c-brand-error',
                '#errorMsg'
            ]
        }
    }
};

module.exports = Selectors;