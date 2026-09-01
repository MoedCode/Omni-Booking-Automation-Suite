/* Omni-Booking-Automation-Suite/VFS_Portugal/Config/Selectors.js */

/**
 * Comprehensive Selectors Configuration for VFS Global (Portugal - Egypt Portal)
 * 
 * Hierarchy:
 * Page Object -> Section Object -> Element Name -> [Array of Fallback Selectors]
 * 
 * Note: Puppeteer's native ::-p-text() is used instead of Playwright's :has-text()
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
                'button::-p-text(Accept All Cookies)',
                '#onetrust-button-group .ot-button-order-0'
            ],
            rejectButton: [
                'button#onetrust-reject-all-handler',
                'button::-p-text(Accept Only Necessary)'
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
        header: {
            logo: ['header.header-main a.navbar-brand img'],
            languageDropdown: [
                'button#dropdownMenuButton',
                'header .dropdown-toggle'
            ],
            languageOptions: {
                english: ['a.dropdown-item::-p-text(English)'],
                portuguese: ['a.dropdown-item::-p-text(Portuguese)']
            },
            logoutButton: [
                'a.dropdown-item::-p-text(Logout)',
                'a.nav-link::-p-text(Sign Out)'
            ]
        },
        footer: {
            container: ['footer.footer-bottom'],
            contactUsLink: ['footer a::-p-text(Contact Us)'],
            aboutLink: ['footer a::-p-text(About VFS Global)'],
            deleteAccountLink: ['footer a::-p-text(Delete My Account)']
        }
    },

    // -----------------------------------------------------------
    // 2. Login Page
    // -----------------------------------------------------------
    login: {
        headers: {
            mainTitle: ['h1.fs-21::-p-text(Sign in)'],
            subtitle: ['p.c-brand-grey-para::-p-text(Enter your email and password)']
        },
        form: {
            account: [
                'input#email',
                'input[formcontrolname="username"]'
            ],
            password: [
                'input#password',
                'input[formcontrolname="password"]'
            ],
            showPasswordIcon: [
                'i.icon-toggle.fa-eye',
                'i[aria-label="Show Password"]'
            ],
            submitButton: [
                'button.btn-brand-orange',
                'button::-p-text(Sign In)',
                'button.mat-mdc-outlined-button'
            ]
        },
        links: {
            forgotPassword: ['a::-p-text(Forgot Password)'],
            noAccount: ['a::-p-text(I don\'t have an account)'],
            activateAccount: ['a::-p-text(Activate my account)']
        },
        captcha: {
            container: ['app-cloudflare-captcha-container'],
            iframe: [
                'iframe[src*="challenges.cloudflare.com"]',
                'iframe[title*="Cloudflare"]'
            ],
            checkbox: ['.cb-c', 'body'], // Targets inside the Cloudflare iframe
            responseInput: ['input[name="cf-turnstile-response"]'] // Hidden token input
        }
    },

    // -----------------------------------------------------------
    // 3. Dashboard Page
    // -----------------------------------------------------------
    dashboard: {
        headers: {
            srOnlyTitle: ['h1.sr-only::-p-text(Dashboard)']
        },
        actions: {
            startNewBookingDesktop: [
                'button.custom-height-button::-p-text(Start New Booking)'
            ],
            startNewBookingMobile: [
                'button.mat-btn-lg.btn-block::-p-text(Start New Booking)'
            ]
        },
        tabs: {
            activeApplications: [
                '.mdc-tab__text-label::-p-text(Active application(s))',
                '#mat-tab-group-0-label-0'
            ],
            noApplicationsFound: [
                'div::-p-text(No Application(s) Found.)',
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
            step1: ['li.nav-item:has(span.sr-num::-p-text(1))'],
            step2: ['li.nav-item:has(span.sr-num::-p-text(2))'],
            step3: ['li.nav-item:has(span.sr-num::-p-text(3))'],
            step4: ['li.nav-item:has(span.sr-num::-p-text(4))'],
            step5: ['li.nav-item:has(span.sr-num::-p-text(5))']
        },
        headers: {
            mainTitle: [
                'h1.fs-24::-p-text(Appointment Details)',
                'mat-card h1'
            ],
            subtitle: [
                'p.c-brand-grey-para::-p-text(Please provide information about the type of visa)'
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
                'button.btn-brand-orange::-p-text(Continue)',
                'button.mat-mdc-raised-button:not([disabled])'
            ]
        },
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