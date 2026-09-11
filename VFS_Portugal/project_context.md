
# VFS_Portugal/Config
## *selectors.js*
```javascript
/* Omni-Booking-Automation-Suite/VFS_Portugal/Config/Selectors.js */

/**
 * Semantic Element Descriptors for VFS Global
 * Elements are defined by human-readable semantic attributes
 * rather than hardcoded CSS classes.
 */
const Selectors = {
    common: {
        cookieBanner: {
            container: {
                elementType: "Container",
                selector: "#onetrust-banner-sdk"
            },
            acceptButton: {
                elementType: "Button",
                text: ["Accept All Cookies", "Accept All", "Accept"]
            },
            rejectButton: {
                elementType: "Button",
                text: ["Accept Only Necessary", "Reject All"]
            }
        }
    },

    signIn: {
        email: {
            elementType: "TextInput",
            label: ["Email", "Email*", "E-mail", "Username"],
            placeholder: ["jane.doe@email.com", "email"]
        },
        password: {
            elementType: "TextInput",
            label: ["Password", "Password*"],
            placeholder: ["**********", "password"]
        },
        submitButton: {
            elementType: "Button",
            text: ["Sign In", "Sign in", "Log In"]
        }
    },

    captcha: {
        container: {
            elementType: "Container",
            selector: "app-cloudflare-captcha-container"
        },
        iframe: {
            elementType: "Iframe",
            selector: 'iframe[src*="challenges.cloudflare.com"]'
        },
        responseInput: {
            elementType: "HiddenInput",
            selector: 'input[name="cf-turnstile-response"]'
        }
    },

    dashboard: {
        startNewBooking: {
            elementType: "Button",
            text: ["Start New Booking", "New Booking"]
        }
    }
};

module.exports = Selectors;
```
## *settings.js*
```javascript
/* Omni-Booking-Automation-Suite/VFS_Portugal/Config/Settings.js */
const path = require('path');
const FILE_PATH = path.resolve(__dirname, '../VFS_accounts.xlsx');
const EgPtrLoginURL = "https://visa.vfsglobal.com/egy/en/prt/login";

const allKeys = {
    mandatoryKeys: ["account", "password"],
    allowedKeys: [
        "account", 
        "password", 
        "country", 
        "city", 
        "appointmentCategory",
        "subCategory"
    ],
    keyConv: {
        password: ["passwords", "pass", "pwd"], 
        account: ["accounts", "email", "username"],
        appointmentCategory: ["appointment category", "appointment_category", "appointment-category"],
        city: ["cites"],
        country: ["country's"]
    }
};

const terminationCmds = ["exit", "\\q", "q"];
const BROWSER_ARGS = ['--start-maximized', '--no-sandbox', '--disable-setuid-sandbox'];
const CHANNEL = '';

const debug = { operationalStatus: true, warnings: true, errors: true };

const actionsConfig = {
    cookies: { priority: 1, startDelay: 300, endDelay: 500 },
    captcha: { priority: 2, startDelay: 300, endDelay: 500 },
    signIn: { priority: 3, startDelay: 300, endDelay: 0 },
    injection: { priority: 4, startDelay: 5000, endDelay: 1000 },
    default: { priority: 99, startDelay: 100, endDelay: 100 }
};


const cookiesAcceptant = "Accept All"; 

module.exports = {
    allKeys,
    FILE_PATH,
    EgPtrLoginURL,
    BROWSER_ARGS, 
    CHANNEL,
    terminationCmds,
    debug,
    actionsConfig,
    cookiesAcceptant
};
```
## *staticSelectors.js*
```javascript
/* Omni-Booking-Automation-Suite\VFS_Portugal/Config/Selectors.js*/

/**
 * Selectors Configuration for VFS Global (Portugal - Egypt Portal)
 * 
 * Hierarchy:
 * Selectors -> [Page] -> [Section] -> [Element Name] -> [Array of Selectors]
 * 
 * Note: Field key names strictly match the keys in Config/Settings.js (allKeys).
 */

const Selectors = {
  // Global & Common Components across the portal
  common: {
    cookieBanner: {
      bannerContainer: [
        '#onetrust-banner-sdk',
        'div[id="onetrust-consent-sdk"]',
        '.onetrust-pc-dark-filter'
      ],
      acceptButton: [
        '#onetrust-accept-btn-handler',
        'button#onetrust-accept-btn-handler',
        '//button[@id="onetrust-accept-btn-handler"]'
      ],
      rejectButton: [
        '#onetrust-reject-all-handler',
        'button#onetrust-reject-all-handler'
      ],
      preferencesButton: [
        '#onetrust-pc-btn-handler',
        'button.cookie-setting-link'
      ]
    },
    loaders: {
      spinnerOverlay: [
        'ngx-ui-loader .ngx-overlay',
        '.ngx-overlay.loading-foreground',
        '.ngx-foreground-spinner',
        '#loader'
      ],
      spinnerAnimation: [
        '.sk-ball-spin-clockwise',
        '.ngx-foreground-spinner div'
      ],
      cdkBackdrop: [
        '.cdk-overlay-backdrop',
        '.cdk-overlay-dark-backdrop'
      ]
    },
    header: {
      logo: [
        'header .navbar-brand img',
        'img[alt="VFS.Global logo"]',
        'a.navbar-brand'
      ],
      languageDropdown: [
        '#dropdownMenuButton',
        'button#dropdownMenuButton',
        '//button[@id="dropdownMenuButton"]'
      ],
      notifications: [
        'app-notification',
        '.notification-container'
      ]
    },
    footer: {
      contactUsLink: [
        'a[href*="contact-us"]',
        '//a[contains(text(), "Contact Us")]'
      ],
      versionInfo: [
        'footer.footer-bottom .container',
        'footer .c-brand-grey-para'
      ]
    }
  },

  // 1. Login Page (https://visa.vfsglobal.com/egy/en/prt/login)
  login: {
    header: {
      title: [
        'app-login h1',
        'h1.fs-21',
        '//h1[contains(text(), "Sign in")]'
      ],
      subtitle: [
        'app-login p.c-brand-grey-para',
        '//p[contains(text(), "Enter your email and password to continue")]'
      ]
    },
    form: {
      // Key matches Settings.js allKeys: "account"
      account: [
        'input#email',
        'input[formcontrolname="username"]',
        'input[placeholder="jane.doe@email.com"]',
        '//input[@id="email"]',
        '//input[@formcontrolname="username"]'
      ],
      // Key matches Settings.js allKeys: "password"
      password: [
        'input#password',
        'input[formcontrolname="password"]',
        'input[placeholder="**********"]',
        '//input[@id="password"]',
        '//input[@formcontrolname="password"]'
      ],
      passwordToggleIcon: [
        'i.icon-toggle',
        'i.fa-eye',
        'i[aria-label="Show Password"]'
      ],
      captchaContainer: [
        'app-cloudflare-captcha-container',
        'div[appcloudflarerecaptcha]',
        'iframe[src*="challenges.cloudflare.com"]'
      ],
      captchaResponseInput: [
        'input[name="cf-turnstile-response"]',
        'input#cf-chl-widget-zbnd6_response'
      ],
      submitButton: [
        'button[mat-stroked-button]',
        'button.mat-mdc-outlined-button.btn-brand-orange',
        '//button[contains(., "Sign In")]',
        '//button[.//span[contains(text(), "Sign In")]]'
      ]
    },
    links: {
      forgotPassword: [
        '//a[contains(text(), "Forgot Password")]',
        'a.cursor-pointer:has-text("Forgot Password")'
      ],
      registerAccount: [
        '//a[contains(text(), "I don\'t have an account")]',
        'a.cursor-pointer:has-text("I don\'t have an account")'
      ],
      activateAccount: [
        '//a[contains(text(), "Activate my account")]',
        'a.cursor-pointer:has-text("Activate my account")'
      ]
    }
  },

  // 2. Dashboard Page (https://visa.vfsglobal.com/egy/en/prt/dashboard)
  dashboard: {
    header: {
      userDropdown: [
        '#navbarDropdown',
        'a#navbarDropdown.dropdown-toggle',
        '//a[contains(text(), "My Account")]'
      ],
      signOutButton: [
        'a.nav-link:has-text("Sign Out")',
        '//a[contains(text(), "Sign Out")]',
        '//a[contains(text(), "Logout")]'
      ]
    },
    mainContent: {
      startNewBookingButton: [
        'button.custom-height-button.btn-brand-orange',
        'button.btn-brand-orange.d-none.d-lg-inline-block',
        'div.col-12.col-sm-auto button.btn-brand-orange',
        '//button[contains(., "Start New Booking")]',
        '//span[contains(text(), "Start New Booking")]/ancestor::button'
      ],
      activeApplicationsTab: [
        '#mat-tab-group-0-label-0',
        'div[role="tab"]#mat-tab-group-0-label-0',
        '//div[@role="tab"][contains(., "Active application(s)")]'
      ],
      noApplicationsMessage: [
        'mat-tab-body .mat-mdc-tab-body-content div:has-text("No Application(s) Found")',
        '//div[contains(text(), "No Application(s) Found.")]'
      ],
      deleteAccountLink: [
        'a.cursor-pointer:has-text("Delete My Account")',
        '//a[contains(text(), "Delete My Account")]'
      ]
    }
  },

  // 3. Appointment Details Page (https://visa.vfsglobal.com/egy/en/prt/application-detail)
  appointmentDetails: {
    stepper: {
      container: [
        '#stepper',
        'nav.navbar ul.steps-nav'
      ],
      stepAppointmentDetails: [
        'ul.steps-nav li:nth-child(1)',
        '//span[contains(text(), "Appointment Details")]/ancestor::li'
      ],
      stepYourDetails: [
        'ul.steps-nav li:nth-child(2)',
        '//span[contains(text(), "Your Details")]/ancestor::li'
      ],
      stepBookAppointment: [
        'ul.steps-nav li:nth-child(3)',
        '//span[contains(text(), "Book Appointment")]/ancestor::li'
      ],
      stepServices: [
        'ul.steps-nav li:nth-child(4)',
        '//span[contains(text(), "Services")]/ancestor::li'
      ],
      stepReview: [
        'ul.steps-nav li:nth-child(5)',
        '//span[contains(text(), "Review")]/ancestor::li'
      ]
    },
    header: {
      accountDropdown: [
        '#navbarDropdown',
        'a#navbarDropdown',
        '//a[contains(text(), "My Account")]'
      ],
      dashboardMenuItem: [
        'a.dropdown-item:has-text("Dashboard")',
        '//a[contains(@class, "dropdown-item") and contains(text(), "Dashboard")]'
      ],
      logoutMenuItem: [
        'a.dropdown-item.bg-brand-orange',
        '//a[contains(@class, "dropdown-item") and contains(text(), "Logout")]'
      ]
    },
    form: {
      cardContainer: [
        'mat-card.form-card',
        'app-eligibility-criteria mat-card'
      ],
      // Key matches Settings.js allKeys: "city" (Application Centre)
      city: {
        label: [
          'label#mat-select-value-1',
          'label[for="mat-select-0"]',
          '//label[contains(., "Choose your Application Centre")]'
        ],
        trigger: [
          'mat-select#mat-select-0',
          'mat-select[formcontrolname="centerCode"]',
          '//mat-select[@formcontrolname="centerCode"]',
          '//mat-select[@id="mat-select-0"]'
        ],
        selectedValueText: [
          '#mat-select-value-0 span',
          'mat-select[formcontrolname="centerCode"] .mat-mdc-select-value'
        ],
        errorMessage: [
          '#errorMsg .errorMessage',
          '.form-group.form-error .errorMessage',
          '//div[contains(text(), "Please select your centre")]'
        ]
      },
      // Key matches Settings.js allKeys: "appointmentCategory"
      appointmentCategory: {
        label: [
          'label#mat-select-value-5',
          'label[for="mat-select-4"]',
          '//label[contains(., "Choose your appointment category")]'
        ],
        trigger: [
          'mat-select#mat-select-2',
          'mat-select[formcontrolname="selectedSubvisaCategory"]',
          '//mat-select[@formcontrolname="selectedSubvisaCategory"]',
          '//mat-select[@id="mat-select-2"]'
        ],
        selectedValueText: [
          '#mat-select-value-2 span',
          'mat-select[formcontrolname="selectedSubvisaCategory"] .mat-mdc-select-value'
        ]
      },
      // Key matches Settings.js allKeys: "subCategory"
      subCategory: {
        label: [
          'label#mat-select-value-3',
          'label[for="mat-select-2"]',
          '//label[contains(., "Choose your sub-category")]'
        ],
        trigger: [
          'mat-select#mat-select-1',
          'mat-select[formcontrolname="visaCategoryCode"]',
          '//mat-select[@formcontrolname="visaCategoryCode"]',
          '//mat-select[@id="mat-select-1"]'
        ],
        selectedValueText: [
          '#mat-select-value-1 span',
          'mat-select[formcontrolname="visaCategoryCode"] .mat-mdc-select-value'
        ]
      },
      continueButton: [
        'button[mat-raised-button].btn-brand-orange',
        'mat-card button.mat-mdc-raised-button',
        '//button[contains(., "Continue")]',
        '//span[contains(text(), "Continue")]/ancestor::button'
      ]
    },
    dropdownPanels: {
      // Options panel for City / Application Centre
      cityPanel: {
        container: [
          '#mat-select-0-panel',
          'div[role="listbox"]#mat-select-0-panel'
        ],
        allOptions: [
          '#mat-select-0-panel mat-option',
          'div[role="listbox"]#mat-select-0-panel mat-option'
        ],
        alexandria: [
          'mat-option#AEX',
          '//mat-option[@id="AEX"]',
          '//mat-option[contains(., "Alexandria")]'
        ],
        cairo: [
          'mat-option#CAI',
          '//mat-option[@id="CAI"]',
          '//mat-option[contains(., "Cairo")]'
        ]
      },
      // Options panel for Appointment Category
      appointmentCategoryPanel: {
        container: [
          '#mat-select-2-panel',
          'div[role="listbox"]#mat-select-2-panel',
          '#cdk-overlay-1 div[role="listbox"]'
        ],
        allOptions: [
          '#mat-select-2-panel mat-option',
          'div[role="listbox"]#mat-select-2-panel mat-option'
        ],
        appeal: [
          'mat-option#apl',
          '//mat-option[@id="apl"]',
          '//mat-option[contains(., "Appeal")]'
        ],
        nationalVisa: [
          'mat-option#Long\\ ',
          'mat-option[id^="Long"]',
          '//mat-option[contains(., "National Visa")]'
        ],
        shortTermVisa: [
          'mat-option#1',
          '//mat-option[@id="1"]',
          '//mat-option[contains(., "Short Term Visa")]'
        ]
      },
      // Options panel for Sub-category
      subCategoryPanel: {
        container: [
          '#mat-select-1-panel',
          'div[role="listbox"]#mat-select-1-panel'
        ],
        allOptions: [
          '#mat-select-1-panel mat-option',
          'div[role="listbox"]#mat-select-1-panel mat-option'
        ],
        jobSeeker: [
          'mat-option#JB',
          '//mat-option[@id="JB"]',
          '//mat-option[contains(., "Job seeker")]'
        ],
        longTermVisaNational: [
          'mat-option#LT',
          '//mat-option[@id="LT"]',
          '//mat-option[contains(., "Long Term Visa - National")]'
        ],
        subordinatedWork: [
          'mat-option#SWC',
          '//mat-option[@id="SWC"]',
          '//mat-option[contains(., "Subordinated Work")]'
        ]
      }
    }
  }
};

module.exports = Selectors;
```

------------------------------------------------

# VFS_Portugal/Browsers
## *BaseBrowser.js*
```javascript
/* Omni-Booking-Automation-Suite/VFS_Portugal/Browsers/BaseBrowser.js */

import { debug } from '../Config/settings.js';

export class BaseBrowser {
    constructor() {
        this.browser = null;
        this.page = null;
        
        this.operationalStatus = ['idl'];
        this.warnings = {};
        this.errors = {};
    }

    logStatus(message) {
        this.operationalStatus.push(message);
        if (debug?.operationalStatus) {
            console.log(`[${new Date().toLocaleTimeString()}] ${message}`);
        }
    }

    logWarning(key, message) {
        this.warnings[key] = message;
        if (debug?.warnings) {
            console.warn(`[${new Date().toLocaleTimeString()}] ⚠️ [Warning - ${key}]: ${message}`);
        }
    }

    logError(key, message) {
        this.errors[key] = message;
        if (debug?.errors) {
            console.error(`[${new Date().toLocaleTimeString()}] ❌ [Error - ${key}]: ${message}`);
        }
    }

    /**
     * Helper to determine if an element is genuinely visible on screen.
     */
    async checkVisibility(element) {
        return await this.page.evaluate((el) => {
            if (!el) return false;
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetHeight > 0;
        }, element);
    }

    async findInput(descriptor) {
        if (!this.page) return null;

        const handle = await this.page.evaluateHandle((desc) => {
            const clean = (str) => (str || '').toLowerCase().replace(/[*_:\s\-]/g, ' ').trim();
            const isVisible = (el) => el && window.getComputedStyle(el).display !== 'none' && window.getComputedStyle(el).visibility !== 'hidden' && el.offsetHeight > 0;

            if (desc.label && desc.label.length > 0) {
                const labels = Array.from(document.querySelectorAll('label'));
                for (const lbl of labels) {
                    const lblText = clean(lbl.innerText || lbl.textContent);
                    const matched = desc.label.some(l => lblText.includes(clean(l)));
                    
                    if (matched) {
                        const forAttr = lbl.getAttribute('for');
                        if (forAttr) {
                            const input = document.getElementById(forAttr);
                            if (input && input.tagName === 'INPUT' && isVisible(input)) return input;
                        }

                        const container = lbl.closest('.form-group, mat-form-field, .mat-mdc-form-field');
                        if (container) {
                            const input = container.querySelector('input:not([type="hidden"]):not(.d-none)');
                            if (input && isVisible(input)) return input;
                        }

                        let sibling = lbl.nextElementSibling;
                        while (sibling) {
                            const input = sibling.tagName === 'INPUT' 
                                ? sibling 
                                : sibling.querySelector('input:not([type="hidden"]):not(.d-none)');
                            if (input && isVisible(input)) return input;
                            sibling = sibling.nextElementSibling;
                        }
                    }
                }
            }

            if (desc.placeholder && desc.placeholder.length > 0) {
                const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"]):not(.d-none)'));
                for (const inp of inputs) {
                    const ph = clean(inp.getAttribute('placeholder'));
                    const matched = desc.placeholder.some(p => ph.includes(clean(p)));
                    if (matched && isVisible(inp)) return inp;
                }
            }

            return null;
        }, descriptor);

        return handle.asElement();
    }

    async findButton(descriptor) {
        if (!this.page) return null;

        const handle = await this.page.evaluateHandle((desc) => {
            const clean = (str) => (str || '').toLowerCase().replace(/[*_:\s\-]/g, ' ').trim();
            const buttons = Array.from(document.querySelectorAll('button, a[role="button"], input[type="submit"]'));
            
            for (const btn of buttons) {
                const btnText = clean(btn.innerText || btn.textContent || btn.value);
                const matched = desc.text.some(t => btnText.includes(clean(t)));
                
                // Ensure button is fully visible before returning it
                if (matched) {
                    const style = window.getComputedStyle(btn);
                    if (style.display !== 'none' && style.visibility !== 'hidden' && btn.offsetHeight > 0) {
                        return btn;
                    }
                }
            }
            return null;
        }, descriptor);

        return handle.asElement();
    }

    /**
     * Waits actively for a semantic element to exist and become visible.
     */
    async waitForDescriptor(descriptor, type = 'Button', timeout = 15000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const el = type === 'Button' ? await this.findButton(descriptor) : await this.findInput(descriptor);
            if (el) return el;
            await new Promise(r => setTimeout(r, 500)); // Poll every 500ms
        }
        return null;
    }

    async isPresent(descriptor) {
        if (!this.page) return false;

        try {
            if (descriptor.elementType === 'TextInput') {
                const el = await this.findInput(descriptor);
                return el !== null;
            }
            if (descriptor.elementType === 'Button') {
                const el = await this.findButton(descriptor);
                return el !== null;
            }
            if (descriptor.selector) {
                // Instantly checks exact visibility without timeout locks
                const isVisible = await this.page.evaluate((sel) => {
                    const el = document.querySelector(sel);
                    return el && window.getComputedStyle(el).display !== 'none' && window.getComputedStyle(el).visibility !== 'hidden' && el.offsetHeight > 0;
                }, descriptor.selector);
                return Boolean(isVisible);
            }
        } catch (e) {
            return false;
        }
        return false;
    }

    /**
     * Safely clears and types text. 
     * Delay increased to 120ms to prevent Angular from dropping fast keystrokes.
     */
    async typeByDescriptor(descriptor, text, delay = 120) {
        // Safely wait for the input to render before interacting
        const input = await this.waitForDescriptor(descriptor, 'TextInput');
        if (!input) {
            throw new Error(`Input matching descriptor not found or not visible.`);
        }
        
        await this.page.evaluate((el) => {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, input);
        
        // Physical clearing is safer for framework tracking
        await input.click({ clickCount: 3 });
        await this.page.keyboard.press('Backspace');
        await new Promise(r => setTimeout(r, 200)); 
        
        await input.type(text, { delay });
    }

    async clickByDescriptor(descriptor) {
        // Safely wait for the button to render before clicking
        const button = await this.waitForDescriptor(descriptor, 'Button');
        if (!button) {
            throw new Error(`Button matching descriptor not found or not visible.`);
        }
        
        await this.page.evaluate((btn) => {
            btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            btn.click();
        }, button);
    }

    async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            this.page = null;
            this.logStatus("[Worker] Browser closed.");
        }
    }
}
```
## *captchaHandler.js*
```javascript
/* Omni-Booking-Automation-Suite/VFS_Portugal/Browsers/captchaHandler.js */

import Selectors from '../Config/Selectors.js';

export class CaptchaHandler {
    /**
     * @param {import('./BaseBrowser.js').BaseBrowser} worker
     */
    constructor(worker) {
        this.worker = worker;
    }

    get page() {
        return this.worker.page;
    }

    async isPresent() {
        if (!this.page) return false;
        const containerSelector = Selectors.captcha.container.selector;
        return (await this.page.$(containerSelector)) !== null;
    }

    async isResolved() {
        if (!this.page) return false;
        try {
            const inputSelector = Selectors.captcha.responseInput.selector;
            const token = await this.page.$eval(inputSelector, el => el.value).catch(() => '');
            return Boolean(token && token.trim().length > 20);
        } catch {
            return false;
        }
    }

    async resolve(timeout = 60000) {
        if (!this.page) return false;

        this.worker.logStatus("[Captcha] Inspecting Cloudflare Challenge...");

        try {
            const containerSelector = Selectors.captcha.container.selector;
            const inputSelector = Selectors.captcha.responseInput.selector;

            // 1. Wait for the outer container to exist
            const container = await this.page.waitForSelector(containerSelector, { timeout: 15000 });
            await new Promise(r => setTimeout(r, 2000));

            let clickedViaFrame = false;

            // 2. STRATEGY 1: Pierce Shadow DOM via Puppeteer's Frame Tree
            const cfFrame = this.page.frames().find(f => f.url().includes('challenges.cloudflare.com'));
            
            if (cfFrame) {
                try {
                    // Wait for the body of the Turnstile iframe and click it
                    const frameBody = await cfFrame.waitForSelector('body', { timeout: 3000 });
                    if (frameBody) {
                        // Scroll container into view first to ensure native click works
                        await this.page.evaluate((el) => {
                            el.scrollIntoView({ behavior: 'instant', block: 'center' });
                        }, container);
                        
                        await frameBody.click();
                        this.worker.logStatus("[Captcha] Clicked widget directly via Frame Tree.");
                        clickedViaFrame = true;
                    }
                } catch (e) {
                    this.worker.logWarning("captcha", "Frame click failed, falling back to geometric click.");
                }
            }

            // 3. STRATEGY 2: Smart Geometric Click (If frame piercing fails)
            if (!clickedViaFrame && container) {
                // Crucial: Bring the element to the center of the viewport before clicking
                await this.page.evaluate((el) => {
                    el.scrollIntoView({ behavior: 'instant', block: 'center' });
                }, container);

                await new Promise(r => setTimeout(r, 1000)); // Wait for scroll to settle

                const box = await container.boundingBox();
                if (box) {
                    let targetX = box.x + 30; // Default: widget is aligned to the left
                    
                    // If container is wider than a standard Turnstile widget (300px), it's likely centered
                    if (box.width > 400) {
                        targetX = box.x + (box.width / 2) - 120; // 120px left of the center hits the checkbox
                    }
                    
                    const targetY = box.y + (box.height / 2);

                    await this.page.mouse.click(targetX, targetY);
                    this.worker.logStatus("[Captcha] Clicked widget coordinates (Smart Geometric Bypass).");
                }
            }

            this.worker.logStatus("[Captcha] Waiting for verification token...");

            // 4. Wait until the hidden input gets the generated token
            await this.page.waitForFunction((selector) => {
                const el = document.querySelector(selector);
                return el && el.value && el.value.trim().length > 20;
            }, { timeout }, inputSelector);

            this.worker.logStatus("[Captcha] ✅ Token successfully received.");
            return true;

        } catch (error) {
            this.worker.logError("captcha", `Verification failed or timed out: ${error.message}`);
            return false;
        }
    }
}
```
## *chrome.js*
```javascript
/* Omni-Booking-Automation-Suite/VFS_Portugal/Browsers/chrome.js */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { EgPtrLoginURL, BROWSER_ARGS, CHANNEL, terminationCmds, debug, actionsConfig, cookiesAcceptant } from '../Config/settings.js';
import Selectors from '../Config/Selectors.js';
import { BaseBrowser } from './BaseBrowser.js';
import { CaptchaHandler } from './captchaHandler.js';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import fs from 'node:fs';
import path from 'node:path';

const rl = readline.createInterface({ input, output });
puppeteer.use(StealthPlugin());

export class ChromeWorker extends BaseBrowser {
    constructor({ headless = true, targetUrl = EgPtrLoginURL, email, password } = {}) {
        super();
        this.targetUrl = targetUrl;
        this.headless = headless;
        this.channel = CHANNEL;
        this.browserArgs = BROWSER_ARGS;

        this.email = email;
        this.password = password;

        this.isOrchestratorRunning = false;
        this.captchaHandler = new CaptchaHandler(this);
        this.lastDeferLogTime = 0;
        // Inside ChromeWorker constructor
        this.completedActivities = new Set();
        this.activitysQueue = []; // Holds the final approved queue

        this.mappedActions = {
            cookies: {
                priority: actionsConfig.cookies.priority,
                startDelay: actionsConfig.cookies.startDelay,
                endDelay: actionsConfig.cookies.endDelay,
                dependencies: [], // No dependencies
                method: this.cookiesHandler.bind(this)
            },
            captcha: {
                priority: actionsConfig.captcha.priority,
                startDelay: actionsConfig.captcha.startDelay,
                endDelay: actionsConfig.captcha.endDelay,
                dependencies: [],
                method: async () => {
                    const success = await this.captchaHandler.resolve();
                    if (success) this.completedActivities.add('captcha');
                }
            },
            dashboard: {
                priority: 5, // Automatically runs after login
                startDelay: 1000,
                endDelay: 5000,
                dependencies: ['signIn'],
                method: async () => {
                    this.logStatus("[Orchestrator] Dashboard active. Awaiting bookings pipeline...");
                }
            },
            signIn: {
                priority: actionsConfig.signIn.priority,
                startDelay: actionsConfig.signIn.startDelay,
                endDelay: actionsConfig.signIn.endDelay,
                dependencies: [], // Captcha handles itself dynamically, but you could add it here if preferred
                method: async () => {
                    await this.signIn();
                    this.completedActivities.add('signIn'); // 👈 FIX: Mark as completed
                }
            },
            injection: {
                priority: actionsConfig.injection.priority,
                startDelay: actionsConfig.injection.startDelay,
                endDelay: actionsConfig.injection.endDelay,
                dependencies: ['signIn'], // HARD DEPENDENCY: signIn MUST be completed first
                method: async () => {
                    await this.injection('./customer_script.js');
                    this.completedActivities.add('injection');
                }
            }
        };
                // 📋 Current Ordered DOM Action Queue
        this.currentOrderedDom = [];
    }

    async launchBrowser() {
        try {
            this.logStatus(`[Worker] Launching browser (Headless: ${this.headless})...`);

            this.browser = await puppeteer.launch({
                headless: this.headless,
                channel: this.channel,
                defaultViewport: null,
                args: this.browserArgs
            });

            const pages = await this.browser.pages();
            this.page = pages.length > 0 ? pages[0] : await this.browser.newPage();

            await this.page.setBypassCSP(true);

            this.logStatus("[Worker] Navigating to target portal...");
            await this.page.goto(this.targetUrl, { waitUntil: 'domcontentloaded' });
            this.logStatus("[Worker] Page loaded successfully.");

            // Removed hardcoded injection here. Orchestrator handles it now.
            // Bun.sleepSync(3000);

            this.startOrchestrator();

        } catch (error) {
            this.logError("initialization", `Initialization Error: ${error.message}`);
        }
    }

    async domScanner() {
            if (!this.page) return [];
            const detected = [];

            if (await this.isPresent(Selectors.common.cookieBanner.container)) {
                detected.push('cookies');
            }

            if (await this.captchaHandler.isPresent()) {
                const resolved = await this.captchaHandler.isResolved();
                if (!resolved) detected.push('captcha');
            }

            if (await this.isPresent(Selectors.signIn.email)) {
                detected.push('signIn');
            }

            // 👈 FIX: Detect the Dashboard
            if (await this.isPresent(Selectors.dashboard.startNewBooking)) {
                detected.push('dashboard');
            }
            
            // Detect if injection is needed by checking if the polyfill exists
            const isScriptInjected = await this.page.evaluate(() => typeof window.GM_setValue !== 'undefined').catch(() => false);
            if (!isScriptInjected) {
                detected.push('injection');
            }

            // Sort actions dynamically based on mapped configuration priorities
            detected.sort((a, b) => {
                const prioA = this.mappedActions[a]?.priority ?? actionsConfig.default.priority;
                const prioB = this.mappedActions[b]?.priority ?? actionsConfig.default.priority;
                return prioA - prioB;
            });

            this.currentOrderedDom = [...detected];
            return this.currentOrderedDom;
        }
    cordinateActivitysQueue(scannedActions) {
        this.activitysQueue = scannedActions.filter(actionKey => {
            const dependencies = this.mappedActions[actionKey]?.dependencies || [];
            
            // Check if every dependency for this action exists in the completed tracker
            const allDependenciesMet = dependencies.every(dep => this.completedActivities.has(dep));
            const now = Date.now();
            if (!allDependenciesMet) {
                // Log only if 10 seconds have elapsed since the last deferral log
                if (now - this.lastDeferLogTime >= 10000) {
                    this.logStatus(`[Orchestrator] ⏸️ Deferring [${actionKey}] - Waiting on dependencies: ${dependencies.join(', ')}`);
                    this.lastDeferLogTime = now;
                }
                return false; // Remove from this cycle's execution queue
                }
            
            return true; // Approved for execution
        });
    }

    async startOrchestrator() {
        this.isOrchestratorRunning = true;
        this.logStatus("[Orchestrator] Dynamic state loop started.");
        
        while (this.isOrchestratorRunning && this.page) {
            try {
                const scannedActions = await this.domScanner();
                this.cordinateActivitysQueue(scannedActions);

                if (this.activitysQueue.length === 0) {
                    await new Promise(r => setTimeout(r, actionsConfig.default.startDelay)); // 👈 Fix
                    continue;
                }

                const currentActionKey = this.activitysQueue[0];
                const actionMeta = this.mappedActions[currentActionKey];

                if (actionMeta && typeof actionMeta.method === 'function') {
                    if (actionMeta.startDelay > 0) await new Promise(r => setTimeout(r, actionMeta.startDelay)); // 👈 Fix
                    
                    this.logStatus(`[Orchestrator] Executing action: [${currentActionKey}]`);
                    
                    await actionMeta.method();

                    if (actionMeta.endDelay > 0) await new Promise(r => setTimeout(r, actionMeta.endDelay)); // 👈 Fix
                } else {
                    await new Promise(r => setTimeout(r, actionsConfig.default.startDelay)); // 👈 Fix
                }

                await new Promise(r => setTimeout(r, actionsConfig.default.endDelay)); // 👈 Fix

            } catch (error) {
                this.logError("orchestrator", `Loop Error: ${error.message}`);
                await new Promise(r => setTimeout(r, actionsConfig.default.startDelay)); // 👈 Fix
            }
        }
    }
    async cookiesHandler() {
        this.logStatus("[Worker] Processing cookies based on preferences...");
        try {
            const pref = (cookiesAcceptant || 'All').toLowerCase();
            const descriptor = (pref.includes('necessary') || pref.includes('only') || pref === 'reject') 
                ? Selectors.common.cookieBanner.rejectButton 
                : Selectors.common.cookieBanner.acceptButton;

            await this.clickByDescriptor(descriptor);
            this.logStatus("[Worker] ✅ Cookies preference applied.");
            await new Promise(r => setTimeout(r, 1000));
        } catch (error) {
            this.logError("cookies", `Failed to handle cookie banner: ${error.message}`);
        }
    }

    async signIn(email = this.email, password = this.password) {
        if (!this.page) return;

        !email && (this.errors.credential = "Email not provided");
        !password && (this.errors.credential = "Password not provided");

        if (this.errors.credential) {
            this.logError("credential", this.errors.credential);
            this.isOrchestratorRunning = false;
            if (debug?.errors) throw new Error(this.errors.credential);
            return;
        }

        this.logStatus(`[Worker] Entering credentials for: ${email}`);

        try {
            await this.typeByDescriptor(Selectors.signIn.email, email);
            await this.typeByDescriptor(Selectors.signIn.password, password);

            if (await this.captchaHandler.isPresent()) {
                const tokenReady = await this.captchaHandler.isResolved();
                if (!tokenReady) {
                    this.logStatus("[Worker] Deferring Sign In submission until Captcha is solved...");
                    return; 
                }
            }

            const btn = await this.findButton(Selectors.signIn.submitButton);
            if (!btn) throw new Error("Sign In button not found.");

            await this.page.waitForFunction((button) => !button.disabled, { timeout: 15000 }, btn);
            await new Promise(r => setTimeout(r, 500));

            await Promise.all([
                this.page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {}),
                this.page.evaluate(b => b.click(), btn) 
            ]);

            this.logStatus("[Worker] ✅ Sign-in submitted successfully.");

        } catch (error) {
            this.logError("signin", `Sign-in execution error: ${error.message}`);
        }
    }

    async injection(relativePath) {
        try {
            await this.page.evaluate(() => {
                if (typeof window.GM_setValue === 'undefined') {
                    window.GM_setValue = (k, v) => localStorage.setItem('VFS_TM_' + k, v);
                    window.GM_getValue = (k, d) => localStorage.getItem('VFS_TM_' + k) || d;
                    window.GM_addStyle = (css) => {
                        const style = document.createElement('style');
                        style.textContent = css;
                        document.head.appendChild(style);
                    };
                }
            });

            const absolutePath = path.resolve(process.cwd(), relativePath);
            const scriptContent = fs.readFileSync(absolutePath, 'utf-8');
            await this.page.addScriptTag({ content: scriptContent });
            this.logStatus(`[Worker] ✅ Extension script injected: ${relativePath}`);
        } catch (error) {
            this.logError("injection", `Script injection failed: ${error.message}`);
        }
    }

    terminate() {
        this.isOrchestratorRunning = false;
        this.closeBrowser();
        rl.close();
    }
}

// Execution Block
if (import.meta.main) {
    const accounts = [
        { email: "sirmohamedh@gmail.com", password: "Moed!vsfG@26" },
        // { email: "sirmohamedh@gmail.com", password: "Moed!vsfG@26" },
        // { email: "sirmohamedh@gmail.com", password: "Moed!vsfG@26" }
    ];

    // 1. إنشاء الـ Workers في مصفوفة موحدة
    const workers = accounts.map(acc => new ChromeWorker({
        headless: false,
        email: acc.email,
        password: acc.password
    }));

    // 2. تشغيل كل المتصفحات في نفس الوقت بالتوازي
    console.log(`[Main] Launching ${workers.length} browser instances concurrently...`);
    await Promise.all(workers.map(worker => worker.launchBrowser()));

    // 3. إدارة الإيقاف لجميع النسخ بنقرة واحدة
    let terminate = false;
    while (!terminate) {
        const answer = await rl.question("VFS-bot:) ");
        const command = answer.trim().toLowerCase();

        if (terminationCmds.includes(command)) {
            console.log("Shutting down all bots...");
            workers.forEach(worker => worker.terminate());
            terminate = true;
        }
    }
}
```
## *chrome.py*
```py
import time
from seleniumbase import SB
from selenium.common.exceptions import WebDriverException, NoSuchWindowException

def open_vfs_website(url, headless=False):
    with SB(uc=True, headless=headless) as sb:
        print(f"Opening VFS (Headless: {headless})...")
        sb.open(url)
        print("Page loaded successfully.")
        print("[Status] Running... Close the Chrome window or press Ctrl+C to stop.")

        consecutive_errors = 0
        max_errors = 3  # Only exit if the window fails to respond 3 times in a row

        while True:
            try:
                # 1. Check if user pressed Ctrl+C or windows are gone
                handles = sb.driver.window_handles
                if not handles or len(handles) == 0:
                    print("\n[Event] Browser window closed by user.")
                    break

                # 2. Ping active window state
                _ = sb.driver.title
                
                # Reset error counter on successful ping
                consecutive_errors = 0
                time.sleep(1)

            except KeyboardInterrupt:
                print("\n[Event] Manual interruption (Ctrl+C).")
                break

            except (NoSuchWindowException, WebDriverException) as e:
                consecutive_errors += 1
                if consecutive_errors >= max_errors:
                    print(f"\n[Event] Browser disconnected permanently: {e}")
                    break
                time.sleep(1)

            except Exception as e:
                print(f"\n[Warning] Transient error ignored: {e}")
                time.sleep(1)

        print("Exiting context manager...")

    print("Cleanup complete. Browser terminated.")


if __name__ == "__main__":
    target_url = "https://visa.vfsglobal.com/egy/en/prt/login"
    open_vfs_website(target_url, headless=False)
    
    
''' previous implementation
import time
from seleniumbase import SB

def open_vfs_website(url, headless=False):
    """
    Opens the VFS login page and keeps the browser running 
    directly in the main thread until manual user action.
    """
    # What: Initialize SeleniumBase with Undetected ChromeDriver (uc=True)
    # Why: Bypasses Cloudflare bot detection on VFS Global without extra thread overhead.
    with SB(uc=True, headless=headless) as sb:
        print(f"Opening VFS (Headless: {headless})...")
        
        # What: Navigate directly to the URL
        # Why: Loads the target page into the active session.
        sb.open(url)
        print("Page loaded successfully.")

        try:
            # What: Halt execution right here inside the 'with' block
            # Why: As long as the script waits at input(), the 'with' block 
            # remains active and the browser stays open.
            input("\n[Browser Active] Press ENTER or Ctrl+C in this terminal to close the browser...\n")
            
        except KeyboardInterrupt:
            # What: Catch manual termination via terminal (Ctrl+C)
            # Why: Prevents ugly stack traces when you stop the script manually.
            print("\nTermination signal received.")

        print("Exiting context... closing browser.")
        
    # What: Exiting the 'with' scope triggers driver cleanup
    # Why: Gracefully shuts down Chrome and terminates all driver processes.
    print("Browser closed successfully.")


if __name__ == "__main__":
    target_url = "https://visa.vfsglobal.com/egy/en/prt/login"
    
    # Run synchronously in the foreground
    open_vfs_website(target_url, headless=True)
'''
```
## *injection.js*
```javascript
/* Omni-Booking-Automation-Suite/VFS_Portugal/Browsers/injection.js*/
```
## *run.js*
```javascript
/* Omni-Booking-Automation-Suite/VFS_Portugal/run.js */

import { fork } from 'node:child_process';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { terminationCmds } from './Config/settings.js';
import { ChromeWorker } from './Browsers/chrome.js';

// ==========================================
// 1. WORKER PROCESS (Isolated Child)
// ==========================================
if (process.env.IS_CHILD_WORKER === 'true') {
    let currentWorker = null;

    process.on('message', async (data) => {
        if (data.action === 'START') {
            const { account } = data;

            currentWorker = new ChromeWorker({
                headless: false,
                email: account.email,
                password: account.password
            });

            // إعادة توجيه الـ Logs للعملية الرئيسية عبر قناة IPC
            currentWorker.logStatus = (msg) => {
                if (process.send) {
                    process.send({ type: 'log', message: msg });
                }
            };

            try {
                await currentWorker.launchBrowser();
            } catch (err) {
                if (process.send) {
                    process.send({ type: 'log', message: `❌ Process Error: ${err.message}` });
                }
            }
        }

        if (data.action === 'TERMINATE') {
            if (currentWorker) {
                currentWorker.terminate();
            }
            process.exit(0);
        }
    });
} 

// ==========================================
// 2. MAIN PROCESS (CLI & Supervisor)
// ==========================================
else {
    const rl = readline.createInterface({ input, output });

    // ضع الحسابات التي تريد تشغيلها هنا
    const accounts = [
        { email: "sirmohamedh@gmail.com", password: "Moed!vsfG@26" },
        // { email: "account2@gmail.com", password: "Password2@" },
    ];

    console.log(`\n🚀 [Main Process] Spawning ${accounts.length} independent OS Process(es)...\n`);

    const childProcesses = [];

    for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        const index = i + 1;

        // تشغيل نفس الملف في Process فرعي جديد تماماً ومعزول
        const child = fork(process.argv[1], [], {
            env: { ...process.env, IS_CHILD_WORKER: 'true' },
            stdio: ['ignore', 'inherit', 'inherit', 'ipc'] // 'ignore' يمنع الـ child من لمس الـ stdin
        });

        // استقبال وطباعة الرسائل من الـ Worker
        child.on('message', (data) => {
            if (data.type === 'log') {
                console.log(`[Worker-${index} | ${account.email}] ${data.message}`);
            }
        });

        // إرسال أمر البدء
        child.send({ action: 'START', account });
        childProcesses.push(child);

        // فاصل زمني لتفادي صدمة فتح متصفحات متعددة في نفس الثانية
        if (i < accounts.length - 1) {
            await new Promise(r => setTimeout(r, 3000));
        }
    }

    // إدارة الإيقاف الفوري لجميع الـ Processes من الـ Main
    let terminate = false;
    while (!terminate) {
        const answer = await rl.question("\nVFS-bot (type 'q' or 'exit' to stop all): ");
        const command = answer.trim().toLowerCase();

        if (terminationCmds.includes(command)) {
            console.log("\n🛑 [Main Process] Terminating all browser instances...");
            for (const child of childProcesses) {
                child.send({ action: 'TERMINATE' });
            }

            // إعطاء مهلة ثانية واحدة للإغلاق النظيف ثم إنهاء العملية
            setTimeout(() => {
                for (const child of childProcesses) {
                    try { child.kill(); } catch {}
                }
                rl.close();
                process.exit(0);
            }, 1000);

            terminate = true;
        }
    }
}
```

------------------------------------------------

# VFS_Portugal/FileHandler
## *sheetsHandler.js*
```javascript
/* Omni-Booking-Automation-Suite\VFS_Portugal/FileHandler/SheetsHandler.js */

const fs = require('fs');
const XLSX = require('xlsx');
const settings = require('../Config/Settings');
const { allKeys } = require('../Config/Settings');

class SheetHandler {
    /**
     * Creates an instance of SheetHandler.
     * @param {Object} keysConfig - Object containing mandatoryKeys, allowedKeys, and keyConv
     * @param {string} defaultFilePath - Default path to the spreadsheet
     */
    constructor(keysConfig = settings.allKeys, defaultFilePath = settings.FILE_PATH) {
        this.allKeysConfig = keysConfig || {};
        this.mandatoryKeys = new Set(this.allKeysConfig.mandatoryKeys || []);
        this.allowedKeys = new Set(this.allKeysConfig.allowedKeys || []);
        this.keyConv = this.allKeysConfig.keyConv || {};
        this.defaultFilePath = defaultFilePath;

        this.hasMandatory = this.mandatoryKeys.size > 0;
        this.hasAllowed = this.allowedKeys.size > 0;
        this.allValidKeys = new Set([...this.mandatoryKeys, ...this.allowedKeys]);
    }

    /**
     * Centralized File Path Handler.
     * Validates and resolves the file path. All file-loading methods must use this.
     * @param {string} customPath - Optional path provided at runtime
     * @returns {string} - A verified, existing file path
     */
    resolveFilePath(customPath) {
        const targetPath = customPath || this.defaultFilePath;

        if (!targetPath) {
            throw new Error("[File Error] No file path provided and no default path is set.");
        }

        if (!fs.existsSync(targetPath)) {
            throw new Error(`[File Error] File does not exist at path: ${targetPath}`);
        }

        return targetPath;
    }

    /**
     * Standardizes Excel header variations (spaces, dashes, underscores, caps) 
     * and maps them to standard keys using `keyConv` and fuzzy matching.
     */
    _normalizeRowKeys(rawRow) {
        const normalizedRow = {};

        for (let [rawKey, value] of Object.entries(rawRow)) {
            rawKey = rawKey.trim();
            let finalKey = rawKey;

            // 1. Direct match with allowed keys
            if (this.allValidKeys.has(rawKey)) {
                normalizedRow[rawKey] = value;
                continue;
            }

            // 2. Map via keyConv aliases
            let aliasMatched = false;
            for (const [standardKey, aliases] of Object.entries(this.keyConv)) {
                const lowerAliases = aliases.map(a => a.toLowerCase());
                if (lowerAliases.includes(rawKey.toLowerCase())) {
                    finalKey = standardKey;
                    aliasMatched = true;
                    break;
                }
            }

            // 3. Fallback: Fuzzy matching (handles spaces, hyphens, underscores, capitalization automatically)
            // e.g., "Appointment_Category" -> "appointmentcategory" -> matches "appointmentCategory"
            if (!aliasMatched) {
                const fuzzyRawKey = rawKey.replace(/[-_ ]/g, "").toLowerCase();
                
                for (const validKey of this.allValidKeys) {
                    const fuzzyValidKey = validKey.replace(/[-_ ]/g, "").toLowerCase();
                    if (fuzzyRawKey === fuzzyValidKey) {
                        finalKey = validKey;
                        break;
                    }
                }
            }

            // Save the value under the standardized key
            normalizedRow[finalKey] = value;
        }

        return normalizedRow;
    }

    /**
     * Safely validates and parses the dataset.
     * @returns {Object} A structured result dictionary
     */
    sanitizeParsing(rawRows) {
        const warnings = [];
        const validData = [];
        let ignoredRowsCount = 0;

        if (!rawRows || rawRows.length === 0) {
            return this._createResult(false, [], 'The source file/sheet contains no data rows.', warnings, 0, 0, 0);
        }

        // Apply Key Conversion and Normalization
        const normalizedRows = rawRows.map(row => this._normalizeRowKeys(row));
        // console.log(`=> \n`, normalizedRows, "\n");
        // 1. File-Level Validation
        if (this.hasMandatory) {
            const fileHeaders = new Set();
            normalizedRows.forEach((row) => {
                Object.keys(row).forEach((k) => fileHeaders.add(k));
            });   

            const missingMandatoryColumns = [];
            for (const mandatoryKey of this.mandatoryKeys) {
                if (!fileHeaders.has(mandatoryKey)) {
                    missingMandatoryColumns.push(mandatoryKey);
                }
            }

            if (missingMandatoryColumns.length > 0) {
                const errorMsg = `[File-Level Error] File rejected. Missing mandatory column(s): [${missingMandatoryColumns.join(', ')}]`;
                return this._createResult(false, [], errorMsg, [errorMsg], normalizedRows.length, 0, normalizedRows.length);
            }
        }

        // 2. Row-Level Validation
        normalizedRows.forEach((row, index) => {
            const rowNumber = index + 2; 
            let isRowValid = true;

            // Check A: Mandatory values validation
            if (this.hasMandatory) {
                for (const mandatoryKey of this.mandatoryKeys) {
                    const val = row[mandatoryKey];
                    const isEmpty = val === undefined || val === null || (typeof val === 'string' && val.trim() === '');

                    if (isEmpty) {
                        warnings.push(`[Row ${rowNumber}] Ignored: Missing mandatory value for key "${mandatoryKey}".`);
                        isRowValid = false;
                        break;
                    }
                }
            }

            if (!isRowValid) {
                ignoredRowsCount++;
                return;
            }

            // Check B: Allowed / Lookup keys validation
            if (this.hasAllowed) {
                for (const [key, val] of Object.entries(row)) {
                    const hasValue = val !== undefined && val !== null && (typeof val === 'string' ? val.trim() !== '' : true);

                    if (hasValue && !this.allValidKeys.has(key)) {
                        warnings.push(`[Row ${rowNumber}] Ignored: Contains unauthorized/unrecognized column key "${key}".`);
                        isRowValid = false;
                        break;
                    }
                }
            }

            if (!isRowValid) {
                ignoredRowsCount++;
                return;
            }

            // Sanitize mapped record
            const cleanRecord = {};
            const keysToKeep = this.hasAllowed ? this.allValidKeys : Object.keys(row);

            for (const key of keysToKeep) {
                if (row.hasOwnProperty(key)) {
                    const value = row[key];
                    cleanRecord[key] = typeof value === 'string' ? value.trim() : (value ?? '');
                } else if (this.hasAllowed) {
                    cleanRecord[key] = '';
                }
            }

            validData.push(cleanRecord);
        });

        return this._createResult(true, validData, null, warnings, normalizedRows.length, validData.length, ignoredRowsCount);
    }

    /**
     * Loads and parses records from an Excel file.
     * @param {string} customPath - Optional. Overrides the default FILE_PATH.
     * @param {string} sheetName - Optional specific sheet name to read.
     */
    loadFromExcel(customPath, sheetName) {
        try {
            // Safely resolve the file path using the centralized method
            const validPath = this.resolveFilePath(customPath);

            const workbook = XLSX.readFile(validPath);
            const targetSheetName = sheetName || workbook.SheetNames[0];
            const sheet = workbook.Sheets[targetSheetName];

            if (!sheet) {
                return this._createErrorResult(`Sheet "${targetSheetName}" was not found in the Excel workbook.`);
            }

            const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });
            return this.sanitizeParsing(rawRows);

        } catch (error) {
            return this._createErrorResult(`Failed to load Excel file: ${error.message}`);
        }
    }

    /**
     * Loads and parses records from a CSV file.
     * @param {string} customPath - Optional. Overrides the default FILE_PATH.
     */
    loadFromCsv(customPath) {
        try {
            // Safely resolve the file path using the centralized method
            const validPath = this.resolveFilePath(customPath);
            
            const workbook = XLSX.readFile(validPath, { type: 'file' });
            const firstSheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[firstSheetName];

            const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });
            return this.sanitizeParsing(rawRows);

        } catch (error) {
            return this._createErrorResult(`Failed to load CSV file: ${error.message}`);
        }
    }

    _createResult(success, data, error, warnings, totalRowsProcessed, validRowsCount, ignoredRowsCount) {
        return { success, data, error, warnings, totalRowsProcessed, validRowsCount, ignoredRowsCount };
    }

    _createErrorResult(message) {
        return this._createResult(false, [], message, [], 0, 0, 0);
    }
}

module.exports = SheetHandler;

// ==========================================
// Test Block (Executed when run directly)
// ==========================================
if (require.main === module) {
    (async () => {
        console.log("[Test Execution Started] Initializing SheetHandler...");
        
        // Instantiate using default settings and file path from Settings.js
        
        const handler = new SheetHandler();

        try {
            console.log(`[Test] Attempting to read Excel file from path: "${handler.defaultFilePath}"`);
            
            const result = handler.loadFromExcel();

            console.log("\n--- Parsing Execution Results ---");
            console.log(`Success Status : ${result.success}`);
            console.log(`Total Processed: ${result.totalRowsProcessed}`);
            console.log(`Valid Rows     : ${result.validRowsCount}`);
            console.log(`Ignored Rows   : ${result.ignoredRowsCount}`);

            if (result.error) {
                console.error(`\n❌ Error Encountered:\n${result.error}`);
            }

            if (result.warnings && result.warnings.length > 0) {
                console.warn(`\n⚠️ Warnings / Ignored Details:\n`, result.warnings);
            }

            if (result.success && result.data.length > 0) {
                console.log(`\n✅ Successfully Parsed Data Records:\n`, result.data);
            }

        } catch (error) {
            console.error("\n❌ Critical Test Exception Caught:", error.message);
        }
    })();
}
```

------------------------------------------------

----------  GUI -----------------


# VFS_Portugal/gui
## *.gitignore*
```text
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```
## *bun.lock*
```lock
{
  "lockfileVersion": 1,
  "configVersion": 1,
  "workspaces": {
    "": {
      "name": "gui",
      "dependencies": {
        "concurrently": "^10.0.5",
        "cross-env": "^10.1.0",
        "electron": "^44.2.0",
        "react": "^19.2.8",
        "react-dom": "^19.2.8",
        "wait-on": "^9.1.0",
      },
      "devDependencies": {
        "@eslint/js": "^10.0.1",
        "@types/react": "^19.2.18",
        "@types/react-dom": "^19.2.4",
        "@vitejs/plugin-react": "^6.1.0",
        "eslint": "^10.9.0",
        "eslint-plugin-react-hooks": "^7.1.1",
        "eslint-plugin-react-refresh": "^0.5.4",
        "globals": "^17.11.0",
        "vite": "^8.2.2",
      },
    },
  },
  "packages": {
    "@babel/code-frame": ["@babel/code-frame@7.29.7", "", { "dependencies": { "@babel/helper-validator-identifier": "^7.29.7", "js-tokens": "^4.0.0", "picocolors": "^1.1.1" } }, "sha512-Aup7aUOfpbAUg2ROOJN6Iw5f9DMBlzu0mIkm/malLQFN/YQgO48wCj0Kxa3sEHJvPVFg7siR+qRInwXd2qhQKw=="],

    "@babel/compat-data": ["@babel/compat-data@7.29.7", "", {}, "sha512-locTkQyKvwIEgBzVrn8693ebc97F2U8ZHjbXwDXJ5Fn2TCpNwTlKcaKLkdHop5c/icOFE7qt7Q9JC5hnKNa6Gg=="],

    "@babel/core": ["@babel/core@7.29.7", "", { "dependencies": { "@babel/code-frame": "^7.29.7", "@babel/generator": "^7.29.7", "@babel/helper-compilation-targets": "^7.29.7", "@babel/helper-module-transforms": "^7.29.7", "@babel/helpers": "^7.29.7", "@babel/parser": "^7.29.7", "@babel/template": "^7.29.7", "@babel/traverse": "^7.29.7", "@babel/types": "^7.29.7", "@jridgewell/remapping": "^2.3.5", "convert-source-map": "^2.0.0", "debug": "^4.1.0", "gensync": "^1.0.0-beta.2", "json5": "^2.2.3", "semver": "^6.3.1" } }, "sha512-RgHBCvtjbOK2gXSNBNIkNoEc9qoVEtau3hj8gEqKQuL3HZAibKarWFEI3Lfm6EYKkLalOh8eSrj9b+ch9H/VBA=="],

    "@babel/generator": ["@babel/generator@7.29.8", "", { "dependencies": { "@babel/parser": "^7.29.8", "@babel/types": "^7.29.8", "@jridgewell/gen-mapping": "^0.3.12", "@jridgewell/trace-mapping": "^0.3.28", "jsesc": "^3.0.2" } }, "sha512-gZbepsdh3WDtgZKWL+vTPh71LSBrm/Y4/QDZBVCcYfmeTEEuoOYwlSy+G1StfJg+/Zy550u/3TATbm7qDbbMtg=="],

    "@babel/helper-compilation-targets": ["@babel/helper-compilation-targets@7.29.7", "", { "dependencies": { "@babel/compat-data": "^7.29.7", "@babel/helper-validator-option": "^7.29.7", "browserslist": "^4.24.0", "lru-cache": "^5.1.1", "semver": "^6.3.1" } }, "sha512-wem6WaBj4NaVYVdNhLPPVacES6ZJ+KBBfSkTMD3YZxbP3rm3Di85tJU5ljaUNhaOynt+Aj0xruhYuzQBt8n71g=="],

    "@babel/helper-globals": ["@babel/helper-globals@7.29.7", "", {}, "sha512-3nQVUAtvkKH9zahfWgw96Jc/uFOmjACE1kQz82E2lqWmHBgjzbNlsC22nuQTfahmWeQtTq5nQ/4Nnd2A1wj4zA=="],

    "@babel/helper-module-imports": ["@babel/helper-module-imports@7.29.7", "", { "dependencies": { "@babel/traverse": "^7.29.7", "@babel/types": "^7.29.7" } }, "sha512-ejHwrQQYcm9xnTivShn2IDOlIzInN34AXskvq9QicvCtEzq1Vzclu/tKF8Jq1Cg8JG2GL6/EmjgsCT7lXepE3g=="],

    "@babel/helper-module-transforms": ["@babel/helper-module-transforms@7.29.7", "", { "dependencies": { "@babel/helper-module-imports": "^7.29.7", "@babel/helper-validator-identifier": "^7.29.7", "@babel/traverse": "^7.29.7" }, "peerDependencies": { "@babel/core": "^7.0.0" } }, "sha512-UPUVSyXbOh627KiCIGQSgwWzGeBKLkaJ9PJEdrngIwMSzxLR4jS4+f1f1jb7VzBbg8nFLaYotvVPFCTqdrmTAg=="],

    "@babel/helper-string-parser": ["@babel/helper-string-parser@7.29.7", "", {}, "sha512-Pb5ijPrZ89GDH8223L4UP8i6QApWxs04RbPQJTeWDV0/keR2E36MeKnyr6LYmUUvqRRI+Iv87SuF1W6ErINzYw=="],

    "@babel/helper-validator-identifier": ["@babel/helper-validator-identifier@7.29.7", "", {}, "sha512-qehxGkRj55h/ff8EMaJ+cYhyaKlHIxqYDn682wQD7RNp9UujOQsHog2uS0r2vzr4pW+sXf90NeeayjcNaX3fFg=="],

    "@babel/helper-validator-option": ["@babel/helper-validator-option@7.29.7", "", {}, "sha512-N9ZErrD+yW5geCDtBqnOoxmR8+tNKiGuxKlDpuJxfsqpa2dFcexaziGAE/qoHLiDDreVNMupxGmSoNlyvsA3gw=="],

    "@babel/helpers": ["@babel/helpers@7.29.7", "", { "dependencies": { "@babel/template": "^7.29.7", "@babel/types": "^7.29.7" } }, "sha512-1k2lAGRMfHTcwuNYcCNUmaUffmQv8KWMfh2iJUUeRlwlwH4FdNG7mfPI10NPfLHJFThE4Tyr4mv7kTNZOiPuBg=="],

    "@babel/parser": ["@babel/parser@7.29.8", "", { "dependencies": { "@babel/types": "^7.29.8" }, "bin": "./bin/babel-parser.js" }, "sha512-E8lTAYNB1KW+FH+VGJuZM1ioAx2E6oVlvQFRrf5P8ZZmsiJXYAD9vTFV7yyEURNzgh1dFqMZuO6tUwcARbqFCA=="],

    "@babel/template": ["@babel/template@7.29.7", "", { "dependencies": { "@babel/code-frame": "^7.29.7", "@babel/parser": "^7.29.7", "@babel/types": "^7.29.7" } }, "sha512-puq+Gf35oI24FeN11LkoUQFqv9uwNeWpxXZi/Ji3rRIoKAzKnxRaZ+Gkj0vKS9ZCiTESfng1N9LyOyXvo+m+Gg=="],

    "@babel/traverse": ["@babel/traverse@7.29.8", "", { "dependencies": { "@babel/code-frame": "^7.29.7", "@babel/generator": "^7.29.8", "@babel/helper-globals": "^7.29.7", "@babel/parser": "^7.29.8", "@babel/template": "^7.29.7", "@babel/types": "^7.29.8", "debug": "^4.3.1" } }, "sha512-I5z7H3bf/41ktsNVLtpN0wAa336HkqIHQ5BuPLEhTkt1jVSyZpeNKIzTgEWmlxjdg81R0IgUCcaE+Ok3NvrfZg=="],

    "@babel/types": ["@babel/types@7.29.8", "", { "dependencies": { "@babel/helper-string-parser": "^7.29.7", "@babel/helper-validator-identifier": "^7.29.7" } }, "sha512-Vj1jF3cPfxg7OAfoI7QnVKLoILlm2JF9pnVHrX8qx7AHMiYWT+NDAA7jChlNgRS4WTLc/fD1lXLmPixluj+3Gg=="],

    "@cacheable/memory": ["@cacheable/memory@2.2.0", "", { "dependencies": { "@cacheable/utils": "^2.5.0", "@keyv/bigmap": "^1.3.1", "hookified": "^1.15.1", "keyv": "^5.6.0" } }, "sha512-CTLKqLItRCEixEAewD3/j9DB3/o96gpTPD4eJ1v+DGOlxZRZncRQkGYqqnAGCscYd6RNeXfGeiuCphsPtqyIfQ=="],

    "@cacheable/utils": ["@cacheable/utils@2.5.0", "", { "dependencies": { "hashery": "^1.5.1", "keyv": "^5.6.0" } }, "sha512-buipgOVDkkPXNR5+xBpDw7Zk2n1EvU7qBJCNUcL7rhQ//kfpOXPAvQ511Os0vpLYJ1pZnvudNytkQt2hst3wqA=="],

    "@electron-internal/extract-zip": ["@electron-internal/extract-zip@1.0.5", "", {}, "sha512-+bqFCP98pLI0Tt0XQo1TmlXtwjWchISndDOxCkEcIuUgXWpBnLyRI+2DU+mesvnMMX6L1XDqYNA0lXNDHd/yiA=="],

    "@electron/get": ["@electron/get@5.1.0", "", { "dependencies": { "debug": "^4.1.1", "env-paths": "^3.0.0", "graceful-fs": "^4.2.11", "progress": "^2.0.3", "semver": "^7.6.3", "sumchecker": "^3.0.1" }, "optionalDependencies": { "undici": "^7.24.4" } }, "sha512-3kSBtG8ObcTVfXanm5vVJ6UnBLEVmVsRk1M+vGqCuMBV+XLCbJYuWQful+yIy0GQDsSlK0kHEriEHn7SPk4EnA=="],

    "@epic-web/invariant": ["@epic-web/invariant@1.0.0", "", {}, "sha512-lrTPqgvfFQtR/eY/qkIzp98OGdNJu0m5ji3q/nJI8v3SXkRKEnWiOxMmbvcSoAIzv/cGiuvRy57k4suKQSAdwA=="],

    "@eslint-community/eslint-utils": ["@eslint-community/eslint-utils@4.10.1", "", { "dependencies": { "eslint-visitor-keys": "^3.4.3" }, "peerDependencies": { "eslint": "^6.0.0 || ^7.0.0 || >=8.0.0" } }, "sha512-cuadcxVFE8sDK6iWJbs8Sn0av2Nrh2QSGQhVlBW9AaAHqHwjWsZHT8LJ4hFGPh7ASBV2deFdM7H/DPjulmh8rg=="],

    "@eslint-community/regexpp": ["@eslint-community/regexpp@4.12.2", "", {}, "sha512-EriSTlt5OC9/7SXkRSCAhfSxxoSUgBm33OH+IkwbdpgoqsSsUg7y3uh+IICI/Qg4BBWr3U2i39RpmycbxMq4ew=="],

    "@eslint/config-array": ["@eslint/config-array@0.23.5", "", { "dependencies": { "@eslint/object-schema": "^3.0.5", "debug": "^4.3.1", "minimatch": "^10.2.4" } }, "sha512-Y3kKLvC1dvTOT+oGlqNQ1XLqK6D1HU2YXPc52NmAlJZbMMWDzGYXMiPRJ8TYD39muD/OTjlZmNJ4ib7dvSrMBA=="],

    "@eslint/config-helpers": ["@eslint/config-helpers@0.7.0", "", { "dependencies": { "@eslint/core": "^1.2.1" } }, "sha512-DObd/KKUsU+FaFv4PLxSRenpXfQWmPXXP3pPZ6/K1PCrMu2vQpMDMuQe/BqYeoLcz8ro0bVDF1RxOJgfVEdhUw=="],

    "@eslint/core": ["@eslint/core@1.2.1", "", { "dependencies": { "@types/json-schema": "^7.0.15" } }, "sha512-MwcE1P+AZ4C6DWlpin/OmOA54mmIZ/+xZuJiQd4SyB29oAJjN30UW9wkKNptW2ctp4cEsvhlLY/CsQ1uoHDloQ=="],

    "@eslint/js": ["@eslint/js@10.0.1", "", { "peerDependencies": { "eslint": "^10.0.0" }, "optionalPeers": ["eslint"] }, "sha512-zeR9k5pd4gxjZ0abRoIaxdc7I3nDktoXZk2qOv9gCNWx3mVwEn32VRhyLaRsDiJjTs0xq/T8mfPtyuXu7GWBcA=="],

    "@eslint/object-schema": ["@eslint/object-schema@3.0.5", "", {}, "sha512-vqTaUEgxzm+YDSdElad6PiRoX4t8VGDjCtt05zn4nU810UIx/uNEV7/lZJ6KwFThKZOzOxzXy48da+No7HZaMw=="],

    "@eslint/plugin-kit": ["@eslint/plugin-kit@0.7.3", "", { "dependencies": { "@eslint/core": "^1.2.1", "levn": "^0.4.1" } }, "sha512-IkO+/KEUvwbVpiURZg+P7zF74z5Jxe0UgJxVni+RtoHQ6IZieXaO02kmadomap/q+l6bc/jdPGGqTjhuZnuz1Q=="],

    "@hapi/address": ["@hapi/address@5.1.1", "", { "dependencies": { "@hapi/hoek": "^11.0.2" } }, "sha512-A+po2d/dVoY7cYajycYI43ZbYMXukuopIsqCjh5QzsBCipDtdofHntljDlpccMjIfTy6UOkg+5KPriwYch2bXA=="],

    "@hapi/formula": ["@hapi/formula@3.0.2", "", {}, "sha512-hY5YPNXzw1He7s0iqkRQi+uMGh383CGdyyIGYtB+W5N3KHPXoqychklvHhKCC9M3Xtv0OCs/IHw+r4dcHtBYWw=="],

    "@hapi/hoek": ["@hapi/hoek@11.0.7", "", {}, "sha512-HV5undWkKzcB4RZUusqOpcgxOaq6VOAH7zhhIr2g3G8NF/MlFO75SjOr2NfuSx0Mh40+1FqCkagKLJRykUWoFQ=="],

    "@hapi/pinpoint": ["@hapi/pinpoint@2.0.1", "", {}, "sha512-EKQmr16tM8s16vTT3cA5L0kZZcTMU5DUOZTuvpnY738m+jyP3JIUj+Mm1xc1rsLkGBQ/gVnfKYPwOmPg1tUR4Q=="],

    "@hapi/tlds": ["@hapi/tlds@1.1.7", "", {}, "sha512-MgNjRwy9Ti92yVAixLmDc8dd1bJIKwO9qlWCfFQRwRmUEDPQHYn4G6hwPFvFGUTzAa0FsS+inMjLin7GnyBRhA=="],

    "@hapi/topo": ["@hapi/topo@6.0.2", "", { "dependencies": { "@hapi/hoek": "^11.0.2" } }, "sha512-KR3rD5inZbGMrHmgPxsJ9dbi6zEK+C3ZwUwTa+eMwWLz7oijWUTWD2pMSNNYJAU6Qq+65NkxXjqHr/7LM2Xkqg=="],

    "@humanfs/core": ["@humanfs/core@0.19.2", "", { "dependencies": { "@humanfs/types": "^0.15.0" } }, "sha512-UhXNm+CFMWcbChXywFwkmhqjs3PRCmcSa/hfBgLIb7oQ5HNb1wS0icWsGtSAUNgefHeI+eBrA8I1fxmbHsGdvA=="],

    "@humanfs/node": ["@humanfs/node@0.16.8", "", { "dependencies": { "@humanfs/core": "^0.19.2", "@humanfs/types": "^0.15.0", "@humanwhocodes/retry": "^0.4.0" } }, "sha512-gE1eQNZ3R++kTzFUpdGlpmy8kDZD/MLyHqDwqjkVQI0JMdI1D51sy1H958PNXYkM2rAac7e5/CnIKZrHtPh3BQ=="],

    "@humanfs/types": ["@humanfs/types@0.15.0", "", {}, "sha512-ZZ1w0aoQkwuUuC7Yf+7sdeaNfqQiiLcSRbfI08oAxqLtpXQr9AIVX7Ay7HLDuiLYAaFPu8oBYNq/QIi9URHJ3Q=="],

    "@humanwhocodes/module-importer": ["@humanwhocodes/module-importer@1.0.1", "", {}, "sha512-bxveV4V8v5Yb4ncFTT3rPSgZBOpCkjfK0y4oVVVJwIuDVBRMDXrPyXRL988i5ap9m9bnyEEjWfm5WkBmtffLfA=="],

    "@humanwhocodes/retry": ["@humanwhocodes/retry@0.4.3", "", {}, "sha512-bV0Tgo9K4hfPCek+aMAn81RppFKv2ySDQeMoSZuvTASywNTnVJCArCZE2FWqpvIatKu7VMRLWlR1EazvVhDyhQ=="],

    "@jridgewell/gen-mapping": ["@jridgewell/gen-mapping@0.3.13", "", { "dependencies": { "@jridgewell/sourcemap-codec": "^1.5.0", "@jridgewell/trace-mapping": "^0.3.24" } }, "sha512-2kkt/7niJ6MgEPxF0bYdQ6etZaA+fQvDcLKckhy1yIQOzaoKjBBjSj63/aLVjYE3qhRt5dvM+uUyfCg6UKCBbA=="],

    "@jridgewell/remapping": ["@jridgewell/remapping@2.3.5", "", { "dependencies": { "@jridgewell/gen-mapping": "^0.3.5", "@jridgewell/trace-mapping": "^0.3.24" } }, "sha512-LI9u/+laYG4Ds1TDKSJW2YPrIlcVYOwi2fUC6xB43lueCjgxV4lffOCZCtYFiH6TNOX+tQKXx97T4IKHbhyHEQ=="],

    "@jridgewell/resolve-uri": ["@jridgewell/resolve-uri@3.1.2", "", {}, "sha512-bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw=="],

    "@jridgewell/sourcemap-codec": ["@jridgewell/sourcemap-codec@1.6.0", "", {}, "sha512-T7jf+5zgsZHwNJ4lvQ7/aezbyk0nNX+zJVWpmHA7VYsEx7a7qr5Rg5IbtJFqkgze5Y2sruq1RUY8Q837Od7iFw=="],

    "@jridgewell/trace-mapping": ["@jridgewell/trace-mapping@0.3.31", "", { "dependencies": { "@jridgewell/resolve-uri": "^3.1.0", "@jridgewell/sourcemap-codec": "^1.4.14" } }, "sha512-zzNR+SdQSDJzc8joaeP8QQoCQr8NuYx2dIIytl1QeBEZHJ9uW6hebsrYgbz8hJwUQao3TWCMtmfV8Nu1twOLAw=="],

    "@keyv/bigmap": ["@keyv/bigmap@1.3.1", "", { "dependencies": { "hashery": "^1.4.0", "hookified": "^1.15.0" }, "peerDependencies": { "keyv": "^5.6.0" } }, "sha512-WbzE9sdmQtKy8vrNPa9BRnwZh5UF4s1KTmSK0KUVLo3eff5BlQNNWDnFOouNpKfPKDnms9xynJjsMYjMaT/aFQ=="],

    "@keyv/serialize": ["@keyv/serialize@1.1.1", "", {}, "sha512-dXn3FZhPv0US+7dtJsIi2R+c7qWYiReoEh5zUntWCf4oSpMNib8FDhSoed6m3QyZdx5hK7iLFkYk3rNxwt8vTA=="],

    "@oxc-project/types": ["@oxc-project/types@0.148.0", "", {}, "sha512-Nm4s/jB+4FpFsPhWGEC4h7rzksesmtnMXomo6rCMcg/b8zLQuOziRgkCS1fxDCXOlJB/6Q8oABOZ/OP6RIPj9A=="],

    "@rolldown/binding-android-arm-eabi": ["@rolldown/binding-android-arm-eabi@1.2.7", "", { "os": "android", "cpu": "arm" }, "sha512-EypzgnYCwyVY4NDHKzGmNJT5b+XaQEBniHxsMdeIQLB/tcCzZnhqrzHpZFbX9iaxx+5RiB8caATBtfvZP7zVxQ=="],

    "@rolldown/binding-android-arm64": ["@rolldown/binding-android-arm64@1.2.7", "", { "os": "android", "cpu": "arm64" }, "sha512-l17HE9EweWaqJZhuUuNBN/FzM62xw+DECVnJyvMsxn8vJFAGLy5QfLDoYAcronkAN8VxKZHezDpulHDPx95vFw=="],

    "@rolldown/binding-darwin-arm64": ["@rolldown/binding-darwin-arm64@1.2.7", "", { "os": "darwin", "cpu": "arm64" }, "sha512-8ED8ELFvHXc6OCETIn4gXObPiaR6bckM/ipXtbzlPVDRMBfEGjCKgO90F9YtfdpDatVx/ZQw7aZ1vUMf/+T3Mw=="],

    "@rolldown/binding-darwin-x64": ["@rolldown/binding-darwin-x64@1.2.7", "", { "os": "darwin", "cpu": "x64" }, "sha512-/WPripjtiAIZ2tWY7ddijORT0Ujg87wxWW/qcoFVCKAWVDPhtY0xr7Dj0M3GyNGz60jGwTElhro/mkF9dT7dDQ=="],

    "@rolldown/binding-freebsd-x64": ["@rolldown/binding-freebsd-x64@1.2.7", "", { "os": "freebsd", "cpu": "x64" }, "sha512-14DI4NcqpvbICxSnGLx3PmtDaWqRP/KGSGb6C+JLLVPeZRl6dKdHba3pGsqT3vpdTqhEYIPG0MMQ8c0xYqoJxA=="],

    "@rolldown/binding-linux-arm-gnueabihf": ["@rolldown/binding-linux-arm-gnueabihf@1.2.7", "", { "os": "linux", "cpu": "arm" }, "sha512-bxrWIRvHWQvbJwi+VIie/kDJmQxcNE6xxWwZdqF/ExVAigtHkv54WTLQPb+QsZdnFy18fg7JPfWGL0RH6vwIlQ=="],

    "@rolldown/binding-linux-arm64-gnu": ["@rolldown/binding-linux-arm64-gnu@1.2.7", "", { "os": "linux", "cpu": "arm64" }, "sha512-toOY2BChBZyuxU7OYX6Tn389di4IzAqPTycVcci0O7FSfBqzRB3RZn+K5Is6ANf4tmgRd/K1yZTsNTXbkXsnLg=="],

    "@rolldown/binding-linux-arm64-musl": ["@rolldown/binding-linux-arm64-musl@1.2.7", "", { "os": "linux", "cpu": "arm64" }, "sha512-lAIXTH/aiLRLxsTgQvfhjo4K1ydWIp00+V0voOr9beb/9ZmkUFrSIb03dXNFRgMNvkE6oGsF10ioQ6UsI+vS5Q=="],

    "@rolldown/binding-linux-ppc64-gnu": ["@rolldown/binding-linux-ppc64-gnu@1.2.7", "", { "os": "linux", "cpu": "ppc64" }, "sha512-kdnwS28Pkenp/mZMRwjXXXwxQ7pIsm+bF919LUK93BOyhcLsrVKdP2p9fxpiPNPAbNuch8ypQt0pm2P2LYCAGg=="],

    "@rolldown/binding-linux-s390x-gnu": ["@rolldown/binding-linux-s390x-gnu@1.2.7", "", { "os": "linux", "cpu": "s390x" }, "sha512-516OdsyLdr5E65paF3yBF55t8mfm9+gmtCsK3xI7XKXIT7EfRlHhxL8K/NR6Hu8BWSgF5+1w74lTL0+nxcc8Qw=="],

    "@rolldown/binding-linux-x64-gnu": ["@rolldown/binding-linux-x64-gnu@1.2.7", "", { "os": "linux", "cpu": "x64" }, "sha512-r8/z8n7GFaYRln3xmP1Cxy0HH/HLM0uBUPkEuSVEfKGDA89M0FsZRZJRSwe/tJjRx+fpH/gjorfhB8tmEbSFLA=="],

    "@rolldown/binding-linux-x64-musl": ["@rolldown/binding-linux-x64-musl@1.2.7", "", { "os": "linux", "cpu": "x64" }, "sha512-pAsE8iiDxUg1xBqdhrTfg45AVDVpirjz00sblEYClGNNcMnDb+e8beQgqIAw6LvauX/APvgxUnwrgun/YYGBhw=="],

    "@rolldown/binding-openharmony-arm64": ["@rolldown/binding-openharmony-arm64@1.2.7", "", { "os": "none", "cpu": "arm64" }, "sha512-lTcIYmmnQQA8Or/2DatS6oSqcdLHvendjS+zLu+FwgToynWMRSmQdpM65fTANJgIS4mjbMOo5KT2lnT9SAb96w=="],

    "@rolldown/binding-win32-arm64-msvc": ["@rolldown/binding-win32-arm64-msvc@1.2.7", "", { "os": "win32", "cpu": "arm64" }, "sha512-e3Gu3WxbNk/UqQhxqU7YIYO+9ZBvWNz3U+h/qRFosscMFzdRPbXYSaSWgSnklv2fz1TgzBTcti2z35c/7irsHw=="],

    "@rolldown/binding-win32-x64-msvc": ["@rolldown/binding-win32-x64-msvc@1.2.7", "", { "os": "win32", "cpu": "x64" }, "sha512-W/jg5qoRSqjsEv0+dZi4e687mcHqmVuU0P4fK6qS/xjetW2Gmc1W8j//z5nAeNcC8Ttm0hV46IjcYeuVwYhuiw=="],

    "@rolldown/pluginutils": ["@rolldown/pluginutils@1.0.1", "", {}, "sha512-2j9bGt5Jh8hj+vPtgzPtl72j0yRxHAyumoo6TNfAjsLB04UtpSvPbPcDcBMxz7n+9CYB0c1GxQFxYRg2jimqGw=="],

    "@standard-schema/spec": ["@standard-schema/spec@1.1.0", "", {}, "sha512-l2aFy5jALhniG5HgqrD6jXLi/rUWrKvqN/qJx6yoJsgKhblVd+iqqU4RCXavm/jPityDo5TCvKMnpjKnOriy0w=="],

    "@types/esrecurse": ["@types/esrecurse@4.3.1", "", {}, "sha512-xJBAbDifo5hpffDBuHl0Y8ywswbiAp/Wi7Y/GtAgSlZyIABppyurxVueOPE8LUQOxdlgi6Zqce7uoEpqNTeiUw=="],

    "@types/estree": ["@types/estree@1.0.9", "", {}, "sha512-GhdPgy1el4/ImP05X05Uw4cw2/M93BCUmnEvWZNStlCzEKME4Fkk+YpoA5OiHNQmoS7Cafb8Xa3Pya8m1Qrzeg=="],

    "@types/json-schema": ["@types/json-schema@7.0.15", "", {}, "sha512-5+fP8P8MFNC+AyZCDxrB2pkZFPGzqQWUzpSeuuVLvm8VMcorNYavBqoFcxK8bQz4Qsbn4oUEEem4wDLfcysGHA=="],

    "@types/node": ["@types/node@24.13.3", "", { "dependencies": { "undici-types": "~7.18.0" } }, "sha512-Dh8vAsV36ig5wa9OX4pXvMc9D3Veibfw2wix0CUwYODLD8nkj9UsLjASr49nPg+2eKzxhBV+v7L8pXvT4e639Q=="],

    "@types/react": ["@types/react@19.2.18", "", { "dependencies": { "csstype": "^3.2.2" } }, "sha512-AnzbBERsrLKtk2XSfTbYRLjQPdy116Sty4q+T+Bp3IC4l6jNBvreVPAHmpq9qhXQM7CXZPjLVmGMw9sy+hxQ3w=="],

    "@types/react-dom": ["@types/react-dom@19.2.7", "", { "peerDependencies": { "@types/react": "^19.2.0" } }, "sha512-I8bPpDLcHBv1qiIiXDCy71Rt8eQDKJP0sMSWJphDdAcdqiJ1sGpZamavoEIRZmYzjia9LuEb2HlYdDpmoENpvQ=="],

    "@vitejs/plugin-react": ["@vitejs/plugin-react@6.1.1", "", { "dependencies": { "@rolldown/pluginutils": "^1.0.1" }, "peerDependencies": { "@rolldown/plugin-babel": "^0.1.7 || ^0.2.0", "babel-plugin-react-compiler": "^1.0.0", "oxc-transform-react": "^0.145.0", "vite": "^8.0.0" }, "optionalPeers": ["@rolldown/plugin-babel", "babel-plugin-react-compiler", "oxc-transform-react"] }, "sha512-yxLaQV9gkhS8ezJqCM6+ndU7mDY6gqAg75NQ+0IjwEI8IYOmQCgkRwHKVSfWXW076DsqMo0Dk+0FK1U+M5RgFw=="],

    "acorn": ["acorn@8.18.0", "", { "bin": { "acorn": "bin/acorn" } }, "sha512-lGq+9yr1/GuAWaVYIHRjvvySG5/4VfKIvC8EWxStPdcDh/Ka7FG3twP6v4d5BkravUilhIAsG4Qj83t02LWUPQ=="],

    "acorn-jsx": ["acorn-jsx@5.3.2", "", { "peerDependencies": { "acorn": "^6.0.0 || ^7.0.0 || ^8.0.0" } }, "sha512-rq9s+JNhf0IChjtDXxllJ7g41oZk5SlXtp0LHwyA5cejwn7vKmKp4pPri6YEePv2PU65sAsegbXtIinmDFDXgQ=="],

    "agent-base": ["agent-base@6.0.2", "", { "dependencies": { "debug": "4" } }, "sha512-RZNwNclF7+MS/8bDg70amg32dyeZGZxiDuQmZxKLAlQjr3jGyLx+4Kkk58UO7D2QdgFIQCovuSuZESne6RG6XQ=="],

    "ajv": ["ajv@6.15.0", "", { "dependencies": { "fast-deep-equal": "^3.1.1", "fast-json-stable-stringify": "^2.0.0", "json-schema-traverse": "^0.4.1", "uri-js": "^4.2.2" } }, "sha512-fgFx7Hfoq60ytK2c7DhnF8jIvzYgOMxfugjLOSMHjLIPgenqa7S7oaagATUq99mV6IYvN2tRmC0wnTYX6iPbMw=="],

    "ansi-regex": ["ansi-regex@6.3.0", "", {}, "sha512-WpDfL7NO6j7tH88IDBNVdUJxDh9nmCteAVW9dsep846XdwF4naCBK+/tGLX3KJgcpgMRXCFlTM2hKGoK9FsdrQ=="],

    "ansi-styles": ["ansi-styles@6.2.3", "", {}, "sha512-4Dj6M28JB+oAH8kFkTLUo+a2jwOFkuqb3yucU0CANcRRUbxS0cP0nZYCGjcc3BNXwRIsUVmDGgzawme7zvJHvg=="],

    "asynckit": ["asynckit@0.4.0", "", {}, "sha512-Oei9OH4tRh0YqU3GxhX79dM/mwVgvbZJaSNaRk+bshkj0S5cfHcgYakreBjrHwatXKbz+IoIdYLxrKim2MjW0Q=="],

    "axios": ["axios@1.20.0", "", { "dependencies": { "follow-redirects": "^1.16.0", "form-data": "^4.0.6", "https-proxy-agent": "^5.0.1", "proxy-from-env": "^2.1.0" } }, "sha512-r8aOh8j9cGKpgQAqpzrUHnSIc6a59Y3Xf/cv8sy1DrHCkZHzQGEuoq1tARk6qSyDdtQGSDgpb9kFlruzPvrgwg=="],

    "balanced-match": ["balanced-match@4.0.4", "", {}, "sha512-BLrgEcRTwX2o6gGxGOCNyMvGSp35YofuYzw9h1IMTRmKqttAZZVU67bdb9Pr2vUHA8+j3i2tJfjO6C6+4myGTA=="],

    "baseline-browser-mapping": ["baseline-browser-mapping@2.11.21", "", { "bin": { "baseline-browser-mapping": "dist/cli.cjs" } }, "sha512-uh8vpY/1/YyFkunIDFH/12p7/7VdPKA1hejMVEbdkEaWnUz0Hesvx5EbiU6XxjyHZIOju+ZMbQJkRh+es3/spQ=="],

    "brace-expansion": ["brace-expansion@5.0.9", "", { "dependencies": { "balanced-match": "^4.0.2" } }, "sha512-ScQ4IuvIEF1TMlP7Zt+vjJ//9zlPb2SDcxWxM3bk8s6t6GGdJ7KO1dCcTidOPJKePW30LE/2cT7wCyPho9/Wxg=="],

    "browserslist": ["browserslist@4.28.9", "", { "dependencies": { "baseline-browser-mapping": "^2.11.20", "caniuse-lite": "^1.0.30001810", "electron-to-chromium": "^1.5.420", "node-releases": "^2.0.54", "update-browserslist-db": "^1.3.2" }, "bin": { "browserslist": "cli.js" } }, "sha512-EWazOblFYUvlGZcfGhPUPmYh3nikUxBVb+y9MJun5f3hBi812X+8MSQTujLBtgK3cf51fJWbWfOjyeO954d+Eg=="],

    "cacheable": ["cacheable@2.5.0", "", { "dependencies": { "@cacheable/memory": "^2.2.0", "@cacheable/utils": "^2.5.0", "hookified": "^1.15.0", "keyv": "^5.6.0", "qified": "^0.10.1" } }, "sha512-60cyAOytib/OzBw1JNSoSV/boK1AtHryDIjvVBk7XbN4ugfkM3+Sry7fEjNgPMGgOjuaZPAp8ruZ0Cxafwyq9g=="],

    "call-bind-apply-helpers": ["call-bind-apply-helpers@1.0.2", "", { "dependencies": { "es-errors": "^1.3.0", "function-bind": "^1.1.2" } }, "sha512-Sp1ablJ0ivDkSzjcaJdxEunN5/XvksFJ2sMBFfq6x0ryhQV/2b/KwFe21cMpmHtPOSij8K99/wSfoEuTObmuMQ=="],

    "caniuse-lite": ["caniuse-lite@1.0.30001810", "", {}, "sha512-TITQPUkaz+aVk5GL6NhOdwk1aEaNTSDPsGFWrTuhKGtjTF70jL/Oht2W4c6rXUe5fu7Ie19VIahAXHIIiWWNeg=="],

    "chalk": ["chalk@5.6.2", "", {}, "sha512-7NzBL0rN6fMUW+f7A6Io4h40qQlG+xGmtMxfbnH/K7TAtt8JQWVQK+6g0UXKMeVJoyV5EkkNsErQ8pVD3bLHbA=="],

    "cliui": ["cliui@9.0.1", "", { "dependencies": { "string-width": "^7.2.0", "strip-ansi": "^7.1.0", "wrap-ansi": "^9.0.0" } }, "sha512-k7ndgKhwoQveBL+/1tqGJYNz097I7WOvwbmmU2AR5+magtbjPWQTS1C5vzGkBC8Ym8UWRzfKUzUUqFLypY4Q+w=="],

    "combined-stream": ["combined-stream@1.0.8", "", { "dependencies": { "delayed-stream": "~1.0.0" } }, "sha512-FQN4MRfuJeHf7cBbBMJFXhKSDq+2kAArBlmRBvcvFE5BB1HZKXtSFASDhdlz9zOYwxh8lDdnvmMOe/+5cdoEdg=="],

    "concurrently": ["concurrently@10.0.5", "", { "dependencies": { "chalk": "5.6.2", "rxjs": "7.8.2", "shell-quote": "1.9.0", "supports-color": "10.2.2", "tree-kill": "1.2.2", "yargs": "18.0.0" }, "bin": { "conc": "dist/bin/index.js", "concurrently": "dist/bin/index.js" } }, "sha512-JaP/CoftUrCcAFW/g//RbgEGwlelnEae6cfBLgH6ZdO6s8jPkn6p9SB9u6pdVxYXoiSnFqseOlHfrEfF82TVOg=="],

    "convert-source-map": ["convert-source-map@2.0.0", "", {}, "sha512-Kvp459HrV2FEJ1CAsi1Ku+MY3kasH19TFykTz2xWmMeq6bk2NU3XXvfJ+Q61m0xktWwt+1HSYf3JZsTms3aRJg=="],

    "cross-env": ["cross-env@10.1.0", "", { "dependencies": { "@epic-web/invariant": "^1.0.0", "cross-spawn": "^7.0.6" }, "bin": { "cross-env": "dist/bin/cross-env.js", "cross-env-shell": "dist/bin/cross-env-shell.js" } }, "sha512-GsYosgnACZTADcmEyJctkJIoqAhHjttw7RsFrVoJNXbsWWqaq6Ym+7kZjq6mS45O0jij6vtiReppKQEtqWy6Dw=="],

    "cross-spawn": ["cross-spawn@7.0.6", "", { "dependencies": { "path-key": "^3.1.0", "shebang-command": "^2.0.0", "which": "^2.0.1" } }, "sha512-uV2QOWP2nWzsy2aMp8aRibhi9dlzF5Hgh5SHaB9OiTGEyDTiJJyx0uy51QXdyWbtAHNua4XJzUKca3OzKUd3vA=="],

    "csstype": ["csstype@3.2.3", "", {}, "sha512-z1HGKcYy2xA8AGQfwrn0PAy+PB7X/GSj3UVJW9qKyn43xWa+gl5nXmU4qqLMRzWVLFC8KusUX8T/0kCiOYpAIQ=="],

    "debug": ["debug@4.4.3", "", { "dependencies": { "ms": "^2.1.3" }, "peerDependencies": { "supports-color": "*" }, "optionalPeers": ["supports-color"] }, "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA=="],

    "deep-is": ["deep-is@0.1.4", "", {}, "sha512-oIPzksmTg4/MriiaYGO+okXDT7ztn/w3Eptv/+gSIdMdKsJo0u4CfYNFJPy+4SKMuCqGw2wxnA+URMg3t8a/bQ=="],

    "delayed-stream": ["delayed-stream@1.0.0", "", {}, "sha512-ZySD7Nf91aLB0RxL4KGrKHBXl7Eds1DAmEdcoVawXnLD7SDhpNgtuII2aAkg7a7QS41jxPSZ17p4VdGnMHk3MQ=="],

    "detect-libc": ["detect-libc@2.1.2", "", {}, "sha512-Btj2BOOO83o3WyH59e8MgXsxEQVcarkUOpEYrubB0urwnN10yQ364rsiByU11nZlqWYZm05i/of7io4mzihBtQ=="],

    "dunder-proto": ["dunder-proto@1.0.1", "", { "dependencies": { "call-bind-apply-helpers": "^1.0.1", "es-errors": "^1.3.0", "gopd": "^1.2.0" } }, "sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A=="],

    "electron": ["electron@44.2.0", "", { "dependencies": { "@electron-internal/extract-zip": "^1.0.1", "@electron/get": "^5.0.0", "@types/node": "^24.9.0" }, "bin": { "electron": "cli.js", "install-electron": "install.js" } }, "sha512-oK1icjhapp3xsUZycO9WZaLmd3hJnA7ieobC4mpdtO1pEN+PPGWpA3m1Mgzzuc1wzSD2Wai4zcH4yfpGJqxFMA=="],

    "electron-to-chromium": ["electron-to-chromium@1.5.422", "", {}, "sha512-UvA/32XqrLDdZSn7Jllo1AYNcWji/G0d5M0GTViE7KoGBiMunw3a34Sb2KO4ZZyrSEhqsxFoVhWWJshdyfKqJA=="],

    "emoji-regex": ["emoji-regex@10.6.0", "", {}, "sha512-toUI84YS5YmxW219erniWD0CIVOo46xGKColeNQRgOzDorgBi1v4D71/OFzgD9GO2UGKIv1C3Sp8DAn0+j5w7A=="],

    "env-paths": ["env-paths@3.0.0", "", {}, "sha512-dtJUTepzMW3Lm/NPxRf3wP4642UWhjL2sQxc+ym2YMj1m/H2zDNQOlezafzkHwn6sMstjHTwG6iQQsctDW/b1A=="],

    "es-define-property": ["es-define-property@1.0.1", "", {}, "sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g=="],

    "es-errors": ["es-errors@1.3.0", "", {}, "sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw=="],

    "es-object-atoms": ["es-object-atoms@1.1.2", "", { "dependencies": { "es-errors": "^1.3.0" } }, "sha512-HWcBoN6NileqtSydK2FqHbS/LoDd2pqrnQHLyJzBj4kOp/ky2MWMN694xOfkK8/SnUsW2DH7EfyVlydKCsm1Zw=="],

    "es-set-tostringtag": ["es-set-tostringtag@2.1.0", "", { "dependencies": { "es-errors": "^1.3.0", "get-intrinsic": "^1.2.6", "has-tostringtag": "^1.0.2", "hasown": "^2.0.2" } }, "sha512-j6vWzfrGVfyXxge+O0x5sh6cvxAog0a/4Rdd2K36zCMV5eJ+/+tOAngRO8cODMNWbVRdVlmGZQL2YS3yR8bIUA=="],

    "escalade": ["escalade@3.2.0", "", {}, "sha512-WUj2qlxaQtO4g6Pq5c29GTcWGDyd8itL8zTlipgECz3JesAiiOKotd8JU6otB3PACgG6xkJUyVhboMS+bje/jA=="],

    "escape-string-regexp": ["escape-string-regexp@4.0.0", "", {}, "sha512-TtpcNJ3XAzx3Gq8sWRzJaVajRs0uVxA2YAkdb1jm2YkPz4G6egUFAyA3n5vtEIZefPk5Wa4UXbKuS5fKkJWdgA=="],

    "eslint": ["eslint@10.10.0", "", { "dependencies": { "@eslint-community/eslint-utils": "^4.8.0", "@eslint-community/regexpp": "^4.12.2", "@eslint/config-array": "^0.23.5", "@eslint/config-helpers": "^0.7.0", "@eslint/core": "^1.2.1", "@eslint/plugin-kit": "^0.7.3", "@humanfs/node": "^0.16.6", "@humanwhocodes/module-importer": "^1.0.1", "@humanwhocodes/retry": "^0.4.2", "@types/estree": "^1.0.6", "ajv": "^6.14.0", "cross-spawn": "^7.0.6", "debug": "^4.3.2", "escape-string-regexp": "^4.0.0", "eslint-scope": "^9.1.2", "eslint-visitor-keys": "^5.0.1", "espree": "^11.2.0", "esquery": "^1.7.0", "esutils": "^2.0.2", "fast-deep-equal": "^3.1.3", "file-entry-cache": "11.1.5 || >11.1.6 <12", "find-up": "^5.0.0", "glob-parent": "^6.0.2", "ignore": "^5.2.0", "imurmurhash": "^0.1.4", "is-glob": "^4.0.0", "json-stable-stringify-without-jsonify": "^1.0.1", "minimatch": "^10.2.5", "natural-compare": "^1.4.0", "optionator": "^0.9.3" }, "peerDependencies": { "jiti": "*" }, "optionalPeers": ["jiti"], "bin": { "eslint": "bin/eslint.js" } }, "sha512-NPXn6r5zl4uET1DAVPaOwzX3rut4c0wcmw3dWJAfOsTM5+TogXo0DDjz8pwm/hL8cyVNpHqeK4JpN0NjnyFFNw=="],

    "eslint-plugin-react-hooks": ["eslint-plugin-react-hooks@7.1.1", "", { "dependencies": { "@babel/core": "^7.24.4", "@babel/parser": "^7.24.4", "hermes-parser": "^0.25.1", "zod": "^3.25.0 || ^4.0.0", "zod-validation-error": "^3.5.0 || ^4.0.0" }, "peerDependencies": { "eslint": "^3.0.0 || ^4.0.0 || ^5.0.0 || ^6.0.0 || ^7.0.0 || ^8.0.0-0 || ^9.0.0 || ^10.0.0" } }, "sha512-f2I7Gw6JbvCexzIInuSbZpfdQ44D7iqdWX01FKLvrPgqxoE7oMj8clOfto8U6vYiz4yd5oKu39rRSVOe1zRu0g=="],

    "eslint-plugin-react-refresh": ["eslint-plugin-react-refresh@0.5.6", "", { "peerDependencies": { "eslint": "^9 || ^10" } }, "sha512-uZnh24On2bk478AkaDAKcpRiYhS3qFSaSNvpXxV6/Ek/BBDICkWGG7MnBSfjnIlCVBei5vsLlIeQYxbF22+Udg=="],

    "eslint-scope": ["eslint-scope@9.1.2", "", { "dependencies": { "@types/esrecurse": "^4.3.1", "@types/estree": "^1.0.8", "esrecurse": "^4.3.0", "estraverse": "^5.2.0" } }, "sha512-xS90H51cKw0jltxmvmHy2Iai1LIqrfbw57b79w/J7MfvDfkIkFZ+kj6zC3BjtUwh150HsSSdxXZcsuv72miDFQ=="],

    "eslint-visitor-keys": ["eslint-visitor-keys@5.0.1", "", {}, "sha512-tD40eHxA35h0PEIZNeIjkHoDR4YjjJp34biM0mDvplBe//mB+IHCqHDGV7pxF+7MklTvighcCPPZC7ynWyjdTA=="],

    "espree": ["espree@11.2.0", "", { "dependencies": { "acorn": "^8.16.0", "acorn-jsx": "^5.3.2", "eslint-visitor-keys": "^5.0.1" } }, "sha512-7p3DrVEIopW1B1avAGLuCSh1jubc01H2JHc8B4qqGblmg5gI9yumBgACjWo4JlIc04ufug4xJ3SQI8HkS/Rgzw=="],

    "esquery": ["esquery@1.7.0", "", { "dependencies": { "estraverse": "^5.1.0" } }, "sha512-Ap6G0WQwcU/LHsvLwON1fAQX9Zp0A2Y6Y/cJBl9r/JbW90Zyg4/zbG6zzKa2OTALELarYHmKu0GhpM5EO+7T0g=="],

    "esrecurse": ["esrecurse@4.3.0", "", { "dependencies": { "estraverse": "^5.2.0" } }, "sha512-KmfKL3b6G+RXvP8N1vr3Tq1kL/oCFgn2NYXEtqP8/L3pKapUA4G8cFVaoF3SU323CD4XypR/ffioHmkti6/Tag=="],

    "estraverse": ["estraverse@5.3.0", "", {}, "sha512-MMdARuVEQziNTeJD8DgMqmhwR11BRQ/cBP+pLtYdSTnf3MIO8fFeiINEbX36ZdNlfU/7A9f3gUw49B3oQsvwBA=="],

    "esutils": ["esutils@2.0.3", "", {}, "sha512-kVscqXk4OCp68SZ0dkgEKVi6/8ij300KBWTJq32P/dYeWTSwK41WyTxalN1eRmA5Z9UU/LX9D7FWSmV9SAYx6g=="],

    "fast-deep-equal": ["fast-deep-equal@3.1.3", "", {}, "sha512-f3qQ9oQy9j2AhBe/H9VC91wLmKBCCU/gDOnKNAYG5hswO7BLKj09Hc5HYNz9cGI++xlpDCIgDaitVs03ATR84Q=="],

    "fast-json-stable-stringify": ["fast-json-stable-stringify@2.1.0", "", {}, "sha512-lhd/wF+Lk98HZoTCtlVraHtfh5XYijIjalXck7saUtuanSDyLMxnHhSXEDJqHxD7msR8D0uCmqlkwjCV8xvwHw=="],

    "fast-levenshtein": ["fast-levenshtein@2.0.6", "", {}, "sha512-DCXu6Ifhqcks7TZKY3Hxp3y6qphY5SJZmrWMDrKcERSOXWQdMhU9Ig/PYrzyw/ul9jOIyh0N4M0tbC5hodg8dw=="],

    "fdir": ["fdir@6.5.0", "", { "peerDependencies": { "picomatch": "^3 || ^4" }, "optionalPeers": ["picomatch"] }, "sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg=="],

    "file-entry-cache": ["file-entry-cache@11.1.5", "", { "dependencies": { "flat-cache": "^6.1.23" } }, "sha512-+PFTHITI08JIGhnNpGNI8T8inUpgZfk3GNEqfT9R2zZV2iFXg3CvqzSl/uEhs7TSGujYRELEANyDvS8Fj7+S7Q=="],

    "find-up": ["find-up@5.0.0", "", { "dependencies": { "locate-path": "^6.0.0", "path-exists": "^4.0.0" } }, "sha512-78/PXT1wlLLDgTzDs7sjq9hzz0vXD+zn+7wypEe4fXQxCmdmqfGsEPQxmiCSQI3ajFV91bVSsvNtrJRiW6nGng=="],

    "flat-cache": ["flat-cache@6.1.23", "", { "dependencies": { "cacheable": "^2.5.0", "flatted": "^3.4.2", "hookified": "^1.15.0" } }, "sha512-f++BY9pTk+983xK1FLzlLpmM0i0z+jHmx3QESGkURMXujQZz1k5wzwX6hjnQ8goaD0B+sYnDK1yZ6MTyZfUaqA=="],

    "flatted": ["flatted@3.4.4", "", {}, "sha512-5+ybhBZANEJxaH3X5evAFatUxLfEHSr7n6kYJ+1Qd0mUqr4eu9gIf6GDbWHf8RJijHrjjO8G+la14SlL2SeS1Q=="],

    "follow-redirects": ["follow-redirects@1.16.0", "", { "peerDependencies": { "debug": "*" }, "optionalPeers": ["debug"] }, "sha512-y5rN/uOsadFT/JfYwhxRS5R7Qce+g3zG97+JrtFZlC9klX/W5hD7iiLzScI4nZqUS7DNUdhPgw4xI8W2LuXlUw=="],

    "form-data": ["form-data@4.0.6", "", { "dependencies": { "asynckit": "^0.4.0", "combined-stream": "^1.0.8", "es-set-tostringtag": "^2.1.0", "hasown": "^2.0.4", "mime-types": "^2.1.35" } }, "sha512-vKatAh4SlVfgbv+YtmhiRjhEMJsYpsG1Y2rMQtR+SVSbytsSD1YGzDIcrAJmdFec88u/+VoGmxnl+80gL1tRCQ=="],

    "fsevents": ["fsevents@2.3.3", "", { "os": "darwin" }, "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw=="],

    "function-bind": ["function-bind@1.1.2", "", {}, "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA=="],

    "gensync": ["gensync@1.0.0-beta.2", "", {}, "sha512-3hN7NaskYvMDLQY55gnW3NQ+mesEAepTqlg+VEbj7zzqEMBVNhzcGYYeqFo/TlYz6eQiFcp1HcsCZO+nGgS8zg=="],

    "get-caller-file": ["get-caller-file@2.0.5", "", {}, "sha512-DyFP3BM/3YHTQOCUL/w0OZHR0lpKeGrxotcHWcqNEdnltqFwXVfhEBQ94eIo34AfQpo0rGki4cyIiftY06h2Fg=="],

    "get-east-asian-width": ["get-east-asian-width@1.6.0", "", {}, "sha512-QRbvDIbx6YklUe6RxeTeleMR0yv3cYH6PsPZHcnVn7xv7zO1BHN8r0XETu8n6Ye3Q+ahtSarc3WgtNWmehIBfA=="],

    "get-intrinsic": ["get-intrinsic@1.3.0", "", { "dependencies": { "call-bind-apply-helpers": "^1.0.2", "es-define-property": "^1.0.1", "es-errors": "^1.3.0", "es-object-atoms": "^1.1.1", "function-bind": "^1.1.2", "get-proto": "^1.0.1", "gopd": "^1.2.0", "has-symbols": "^1.1.0", "hasown": "^2.0.2", "math-intrinsics": "^1.1.0" } }, "sha512-9fSjSaos/fRIVIp+xSJlE6lfwhES7LNtKaCBIamHsjr2na1BiABJPo0mOjjz8GJDURarmCPGqaiVg5mfjb98CQ=="],

    "get-proto": ["get-proto@1.0.1", "", { "dependencies": { "dunder-proto": "^1.0.1", "es-object-atoms": "^1.0.0" } }, "sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g=="],

    "glob-parent": ["glob-parent@6.0.2", "", { "dependencies": { "is-glob": "^4.0.3" } }, "sha512-XxwI8EOhVQgWp6iDL+3b0r86f4d6AX6zSU55HfB4ydCEuXLXc5FcYeOu+nnGftS4TEju/11rt4KJPTMgbfmv4A=="],

    "globals": ["globals@17.12.0", "", {}, "sha512-cezEd/DTyyht9cvSSURyygXPfy04GtWO/5e6ZPvH7fCtjKz9PYOmuawphw1Ctd1f6C+5JypXfGD7ahNMXvevBA=="],

    "gopd": ["gopd@1.2.0", "", {}, "sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg=="],

    "graceful-fs": ["graceful-fs@4.2.11", "", {}, "sha512-RbJ5/jmFcNNCcDV5o9eTnBLJ/HszWV0P73bc+Ff4nS/rJj+YaS6IGyiOL0VoBYX+l1Wrl3k63h/KrH+nhJ0XvQ=="],

    "has-symbols": ["has-symbols@1.1.0", "", {}, "sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ=="],

    "has-tostringtag": ["has-tostringtag@1.0.2", "", { "dependencies": { "has-symbols": "^1.0.3" } }, "sha512-NqADB8VjPFLM2V0VvHUewwwsw0ZWBaIdgo+ieHtK3hasLz4qeCRjYcqfB6AQrBggRKppKF8L52/VqdVsO47Dlw=="],

    "hashery": ["hashery@1.5.1", "", { "dependencies": { "hookified": "^1.15.0" } }, "sha512-iZyKG96/JwPz1N55vj2Ie2vXbhu440zfUfJvSwEqEbeLluk7NnapfGqa7LH0mOsnDxTF85Mx8/dyR6HfqcbmbQ=="],

    "hasown": ["hasown@2.0.4", "", { "dependencies": { "function-bind": "^1.1.2" } }, "sha512-T2UbfbBEF32wiepXIsMlTW9+dDYC6wMh/t/vYA4tuOMKqWz/n3vr1NFSxQiyP+zk2mXsoMA/i/7qV6LKut1t1A=="],

    "hermes-estree": ["hermes-estree@0.25.1", "", {}, "sha512-0wUoCcLp+5Ev5pDW2OriHC2MJCbwLwuRx+gAqMTOkGKJJiBCLjtrvy4PWUGn6MIVefecRpzoOZ/UV6iGdOr+Cw=="],

    "hermes-parser": ["hermes-parser@0.25.1", "", { "dependencies": { "hermes-estree": "0.25.1" } }, "sha512-6pEjquH3rqaI6cYAXYPcz9MS4rY6R4ngRgrgfDshRptUZIc3lw0MCIJIGDj9++mfySOuPTHB4nrSW99BCvOPIA=="],

    "hookified": ["hookified@1.15.1", "", {}, "sha512-MvG/clsADq1GPM2KGo2nyfaWVyn9naPiXrqIe4jYjXNZQt238kWyOGrsyc/DmRAQ+Re6yeo6yX/yoNCG5KAEVg=="],

    "https-proxy-agent": ["https-proxy-agent@5.0.1", "", { "dependencies": { "agent-base": "6", "debug": "4" } }, "sha512-dFcAjpTQFgoLMzC2VwU+C/CbS7uRL0lWmxDITmqm7C+7F0Odmj6s9l6alZc6AELXhrnggM2CeWSXHGOdX2YtwA=="],

    "ignore": ["ignore@5.3.2", "", {}, "sha512-hsBTNUqQTDwkWtcdYI2i06Y/nUBEsNEDJKjWdigLvegy8kDuJAS8uRlpkkcQpyEXL0Z/pjDy5HBmMjRCJ2gq+g=="],

    "imurmurhash": ["imurmurhash@0.1.4", "", {}, "sha512-JmXMZ6wuvDmLiHEml9ykzqO6lwFbof0GG4IkcGaENdCRDDmMVnny7s5HsIgHCbaq0w2MyPhDqkhTUgS2LU2PHA=="],

    "is-extglob": ["is-extglob@2.1.1", "", {}, "sha512-SbKbANkN603Vi4jEZv49LeVJMn4yGwsbzZworEoyEiutsN3nJYdbO36zfhGJ6QEDpOZIFkDtnq5JRxmvl3jsoQ=="],

    "is-glob": ["is-glob@4.0.3", "", { "dependencies": { "is-extglob": "^2.1.1" } }, "sha512-xelSayHH36ZgE7ZWhli7pW34hNbNl8Ojv5KVmkJD4hBdD3th8Tfk9vYasLM+mXWOZhFkgZfxhLSnrwRr4elSSg=="],

    "isexe": ["isexe@2.0.0", "", {}, "sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw=="],

    "joi": ["joi@18.2.8", "", { "dependencies": { "@hapi/address": "^5.1.1", "@hapi/formula": "^3.0.2", "@hapi/hoek": "^11.0.7", "@hapi/pinpoint": "^2.0.1", "@hapi/tlds": "^1.1.1", "@hapi/topo": "^6.0.2", "@standard-schema/spec": "^1.1.0" } }, "sha512-G2TX62h58ZHuwqetJgP2F4ualakqAmZtBYe3jWen7gxQRw5xApX6crnFtuB91WC0c3ESBnva+kGSnb3+6pIQDQ=="],

    "js-tokens": ["js-tokens@4.0.0", "", {}, "sha512-RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ=="],

    "jsesc": ["jsesc@3.1.0", "", { "bin": { "jsesc": "bin/jsesc" } }, "sha512-/sM3dO2FOzXjKQhJuo0Q173wf2KOo8t4I8vHy6lF9poUp7bKT0/NHE8fPX23PwfhnykfqnC2xRxOnVw5XuGIaA=="],

    "json-schema-traverse": ["json-schema-traverse@0.4.1", "", {}, "sha512-xbbCH5dCYU5T8LcEhhuh7HJ88HXuW3qsI3Y0zOZFKfZEHcpWiHU/Jxzk629Brsab/mMiHQti9wMP+845RPe3Vg=="],

    "json-stable-stringify-without-jsonify": ["json-stable-stringify-without-jsonify@1.0.1", "", {}, "sha512-Bdboy+l7tA3OGW6FjyFHWkP5LuByj1Tk33Ljyq0axyzdk9//JSi2u3fP1QSmd1KNwq6VOKYGlAu87CisVir6Pw=="],

    "json5": ["json5@2.2.3", "", { "bin": { "json5": "lib/cli.js" } }, "sha512-XmOWe7eyHYH14cLdVPoyg+GOH3rYX++KpzrylJwSW98t3Nk+U8XOl8FWKOgwtzdb8lXGf6zYwDUzeHMWfxasyg=="],

    "keyv": ["keyv@5.6.0", "", { "dependencies": { "@keyv/serialize": "^1.1.1" } }, "sha512-CYDD3SOtsHtyXeEORYRx2qBtpDJFjRTGXUtmNEMGyzYOKj1TE3tycdlho7kA1Ufx9OYWZzg52QFBGALTirzDSw=="],

    "levn": ["levn@0.4.1", "", { "dependencies": { "prelude-ls": "^1.2.1", "type-check": "~0.4.0" } }, "sha512-+bT2uH4E5LGE7h/n3evcS/sQlJXCpIp6ym8OWJ5eV6+67Dsql/LaaT7qJBAt2rzfoa/5QBGBhxDix1dMt2kQKQ=="],

    "lightningcss": ["lightningcss@1.33.0", "", { "dependencies": { "detect-libc": "^2.0.3" }, "optionalDependencies": { "lightningcss-android-arm64": "1.33.0", "lightningcss-darwin-arm64": "1.33.0", "lightningcss-darwin-x64": "1.33.0", "lightningcss-freebsd-x64": "1.33.0", "lightningcss-linux-arm-gnueabihf": "1.33.0", "lightningcss-linux-arm64-gnu": "1.33.0", "lightningcss-linux-arm64-musl": "1.33.0", "lightningcss-linux-x64-gnu": "1.33.0", "lightningcss-linux-x64-musl": "1.33.0", "lightningcss-win32-arm64-msvc": "1.33.0", "lightningcss-win32-x64-msvc": "1.33.0" } }, "sha512-WkUDrojuJs0xkgGf2udWxa3yGBRxPtxUkB79i6aCZLRgc7PM8fZe9TosfPDcvEpQZbuFASnHYmRLBLUbmLOIIA=="],

    "lightningcss-android-arm64": ["lightningcss-android-arm64@1.33.0", "", { "os": "android", "cpu": "arm64" }, "sha512-gEpRTalKdosp4Bb8qWtc2iOgE5SeIHlpS1up9bFq2wAyYhl1UdTObYiHe98zEM9SQvSoqQZ1IQD0JNpg3Ml5pg=="],

    "lightningcss-darwin-arm64": ["lightningcss-darwin-arm64@1.33.0", "", { "os": "darwin", "cpu": "arm64" }, "sha512-Sciaz8eenNTKn9b3t7+xr0ipTp9YxKQY4npwQ3mrRuL0BAVHBLyZxofhaKBAVtzmtRZ/zTyo0/to4B1uWG/Djg=="],

    "lightningcss-darwin-x64": ["lightningcss-darwin-x64@1.33.0", "", { "os": "darwin", "cpu": "x64" }, "sha512-Z5UPAxzrjlWNNyGy6i65cJzzvgJ5D3T6wMvs+gWpY9d7qRhANrxqAp6LhxIgZhWEw18RfJTGcRxjuLIBr+m8XQ=="],

    "lightningcss-freebsd-x64": ["lightningcss-freebsd-x64@1.33.0", "", { "os": "freebsd", "cpu": "x64" }, "sha512-QQM/Ti/hQajJwCY+RiWuCZ9sdtI/XQk7nDK5vC8kkdwixezOlDgvDx7+RT+QjK6FcFT4MpsuoBnHIo/O3StRRg=="],

    "lightningcss-linux-arm-gnueabihf": ["lightningcss-linux-arm-gnueabihf@1.33.0", "", { "os": "linux", "cpu": "arm" }, "sha512-N7FVBe6iS24MlM6R/4RBTxGhQheZGs7tiQ9U32UtF75NzP5Q7xWPRqLBCKxlRQRk3rY1jCIPLzx7WzOhuUIRLQ=="],

    "lightningcss-linux-arm64-gnu": ["lightningcss-linux-arm64-gnu@1.33.0", "", { "os": "linux", "cpu": "arm64" }, "sha512-j2v/itmy4HlNxlc6voKXYgBqNi0Ng2LShg4z7GufpEgs05P+2suBVyi9I6YHq5uoVFx9ETin3eCEhLVyXGQnKg=="],

    "lightningcss-linux-arm64-musl": ["lightningcss-linux-arm64-musl@1.33.0", "", { "os": "linux", "cpu": "arm64" }, "sha512-yiO5ROMuYQgXbC60yjZU5CYSFZGKXL0HFATXt9mHJn1+zW55oCtMI9NfcVhYLMFDL7gV7oBPon/EmMMGg2OvtQ=="],

    "lightningcss-linux-x64-gnu": ["lightningcss-linux-x64-gnu@1.33.0", "", { "os": "linux", "cpu": "x64" }, "sha512-ar+Ju7LmcN0Jo4FpL4hpFybwNG9/3A/Br5KW2n2jyODg3MEZXaDYADdemoNS+BDNfMgKvylJLj4S5tyRActuAg=="],

    "lightningcss-linux-x64-musl": ["lightningcss-linux-x64-musl@1.33.0", "", { "os": "linux", "cpu": "x64" }, "sha512-RYiYbkokw0trfKqqzfF55lginwEPrD3OJDfTuJzFs1MK6iFnDenaz1fqLLtX4ITG3OktJQXOeTaw1awrBAlZPw=="],

    "lightningcss-win32-arm64-msvc": ["lightningcss-win32-arm64-msvc@1.33.0", "", { "os": "win32", "cpu": "arm64" }, "sha512-1K+MPfLSFVpphzpdbfkhlWk6wBrTObBzS2T6db10PNOZgR9GoVsAWzwNyuhUYYbTp23j+4RrncfujZ4uAzXvwA=="],

    "lightningcss-win32-x64-msvc": ["lightningcss-win32-x64-msvc@1.33.0", "", { "os": "win32", "cpu": "x64" }, "sha512-OlEICDx/Xl0FqSp4bry8zFnCvGpig3Gl4gCquvYwHuqJKEC1+n9NgDniFvqHGmMv1ZkqDJrDqKKSykTDX+ehuA=="],

    "locate-path": ["locate-path@6.0.0", "", { "dependencies": { "p-locate": "^5.0.0" } }, "sha512-iPZK6eYjbxRu3uB4/WZ3EsEIMJFMqAoopl3R+zuq0UjcAm/MO6KCweDgPfP3elTztoKP3KtnVHxTn2NHBSDVUw=="],

    "lodash": ["lodash@4.18.1", "", {}, "sha512-dMInicTPVE8d1e5otfwmmjlxkZoUpiVLwyeTdUsi/Caj/gfzzblBcCE5sRHV/AsjuCmxWrte2TNGSYuCeCq+0Q=="],

    "lru-cache": ["lru-cache@5.1.1", "", { "dependencies": { "yallist": "^3.0.2" } }, "sha512-KpNARQA3Iwv+jTA0utUVVbrh+Jlrr1Fv0e56GGzAFOXN7dk/FviaDW8LHmK52DlcH4WP2n6gI8vN1aesBFgo9w=="],

    "math-intrinsics": ["math-intrinsics@1.1.0", "", {}, "sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g=="],

    "mime-db": ["mime-db@1.52.0", "", {}, "sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg=="],

    "mime-types": ["mime-types@2.1.35", "", { "dependencies": { "mime-db": "1.52.0" } }, "sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw=="],

    "minimatch": ["minimatch@10.2.6", "", { "dependencies": { "brace-expansion": "^5.0.8" } }, "sha512-vpLQEs+VLCr1nU0BXS07maYoFwlDAH0gngQuuttxIwutDFEMHq2blX+8vpgxDdK3J1PwjCJiep77OitTZ4Ll1A=="],

    "minimist": ["minimist@1.2.8", "", {}, "sha512-2yyAR8qBkN3YuheJanUpWC5U3bb5osDywNB8RzDVlDwDHbocAJveqqj1u8+SVD7jkWT4yvsHCpWqqWqAxb0zCA=="],

    "ms": ["ms@2.1.3", "", {}, "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA=="],

    "nanoid": ["nanoid@3.3.18", "", { "bin": { "nanoid": "bin/nanoid.cjs" } }, "sha512-DTg4MJbGMWkfi6VZFdNt2/caMbQy4Ou+Op/hJQvGEWcnVfoA1QA+xzRKAzw9jD6+GVOOeYr/mIcuDSdug6F6+w=="],

    "natural-compare": ["natural-compare@1.4.0", "", {}, "sha512-OWND8ei3VtNC9h7V60qff3SVobHr996CTwgxubgyQYEpg290h9J0buyECNNJexkFm5sOajh5G116RYA1c8ZMSw=="],

    "node-releases": ["node-releases@2.0.54", "", {}, "sha512-YHs7BmmcsdAI5Ozuf8JZo6PT0mv2GIWC9vMfvUC3dp65M8hn7Ux8CPL+2oBI7juNuj9d0ndhTcznq2ODBps9cQ=="],

    "optionator": ["optionator@0.9.4", "", { "dependencies": { "deep-is": "^0.1.3", "fast-levenshtein": "^2.0.6", "levn": "^0.4.1", "prelude-ls": "^1.2.1", "type-check": "^0.4.0", "word-wrap": "^1.2.5" } }, "sha512-6IpQ7mKUxRcZNLIObR0hz7lxsapSSIYNZJwXPGeF0mTVqGKFIXj1DQcMoT22S3ROcLyY/rz0PWaWZ9ayWmad9g=="],

    "p-limit": ["p-limit@3.1.0", "", { "dependencies": { "yocto-queue": "^0.1.0" } }, "sha512-TYOanM3wGwNGsZN2cVTYPArw454xnXj5qmWF1bEoAc4+cU/ol7GVh7odevjp1FNHduHc3KZMcFduxU5Xc6uJRQ=="],

    "p-locate": ["p-locate@5.0.0", "", { "dependencies": { "p-limit": "^3.0.2" } }, "sha512-LaNjtRWUBY++zB5nE/NwcaoMylSPk+S+ZHNB1TzdbMJMny6dynpAGt7X/tl/QYq3TIeE6nxHppbo2LGymrG5Pw=="],

    "path-exists": ["path-exists@4.0.0", "", {}, "sha512-ak9Qy5Q7jYb2Wwcey5Fpvg2KoAc/ZIhLSLOSBmRmygPsGwkVVt0fZa0qrtMz+m6tJTAHfZQ8FnmB4MG4LWy7/w=="],

    "path-key": ["path-key@3.1.1", "", {}, "sha512-ojmeN0qd+y0jszEtoY48r0Peq5dwMEkIlCOu6Q5f41lfkswXuKtYrhgoTpLnyIcHm24Uhqx+5Tqm2InSwLhE6Q=="],

    "picocolors": ["picocolors@1.1.1", "", {}, "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA=="],

    "picomatch": ["picomatch@4.0.7", "", {}, "sha512-qcJu88Q2IWqJsDD529JKMdwGm/dvInW4HvQnRwiH9JtihJvzGOscDtHE3x1pBKeUOTysQ8kVmLnJ2kJu7yhcGA=="],

    "postcss": ["postcss@8.5.28", "", { "dependencies": { "nanoid": "^3.3.18", "picocolors": "^1.1.1", "source-map-js": "^1.2.1" } }, "sha512-RRuzqDtt5Y9h3quz5hWhK+TPnsmVs6WwSU6LkJMeY4HstUEDuYTG8UJSdawMRzmzAtV+KEoG8N3Qg2qLy5vM/A=="],

    "prelude-ls": ["prelude-ls@1.2.1", "", {}, "sha512-vkcDPrRZo1QZLbn5RLGPpg/WmIQ65qoWWhcGKf/b5eplkkarX0m9z8ppCat4mlOqUsWpyNuYgO3VRyrYHSzX5g=="],

    "progress": ["progress@2.0.3", "", {}, "sha512-7PiHtLll5LdnKIMw100I+8xJXR5gW2QwWYkT6iJva0bXitZKa/XMrSbdmg3r2Xnaidz9Qumd0VPaMrZlF9V9sA=="],

    "proxy-from-env": ["proxy-from-env@2.1.0", "", {}, "sha512-cJ+oHTW1VAEa8cJslgmUZrc+sjRKgAKl3Zyse6+PV38hZe/V6Z14TbCuXcan9F9ghlz4QrFr2c92TNF82UkYHA=="],

    "punycode": ["punycode@2.3.1", "", {}, "sha512-vYt7UD1U9Wg6138shLtLOvdAu+8DsC/ilFtEVHcH+wydcSpNE20AfSOduf6MkRFahL5FY7X1oU7nKVZFtfq8Fg=="],

    "qified": ["qified@0.10.1", "", { "dependencies": { "hookified": "^2.1.1" } }, "sha512-+Owyggi9IxT1ePKGafcI87ubSmxol6smwJ+RAHDQlx9+9cPwFWDiKFFCPuWhr9ignlGpZ9vDQLw67N4dcTVFEA=="],

    "react": ["react@19.2.8", "", {}, "sha512-PWaYA1L/q9u2u7xYQi+Y3L3Yfnie7XyLeaJICV1MGD6LprsBxcAqGjYyr0eY3p+QdsA+x/Irkt4Qif8D63+Sbw=="],

    "react-dom": ["react-dom@19.2.8", "", { "dependencies": { "scheduler": "^0.27.0" }, "peerDependencies": { "react": "^19.2.8" } }, "sha512-rVprimfGBG3DR+Tq0IQG2DT5PxKth1WIGDmj5yPmlzr4YBe7uyE+Du4oVqTDXZSHGGGXRtTJEGSSePyQCMBglQ=="],

    "rolldown": ["rolldown@1.2.7", "", { "dependencies": { "@oxc-project/types": "=0.148.0", "@rolldown/pluginutils": "^1.0.0" }, "optionalDependencies": { "@rolldown/binding-android-arm-eabi": "1.2.7", "@rolldown/binding-android-arm64": "1.2.7", "@rolldown/binding-darwin-arm64": "1.2.7", "@rolldown/binding-darwin-x64": "1.2.7", "@rolldown/binding-freebsd-x64": "1.2.7", "@rolldown/binding-linux-arm-gnueabihf": "1.2.7", "@rolldown/binding-linux-arm64-gnu": "1.2.7", "@rolldown/binding-linux-arm64-musl": "1.2.7", "@rolldown/binding-linux-ppc64-gnu": "1.2.7", "@rolldown/binding-linux-s390x-gnu": "1.2.7", "@rolldown/binding-linux-x64-gnu": "1.2.7", "@rolldown/binding-linux-x64-musl": "1.2.7", "@rolldown/binding-openharmony-arm64": "1.2.7", "@rolldown/binding-win32-arm64-msvc": "1.2.7", "@rolldown/binding-win32-x64-msvc": "1.2.7" }, "bin": { "rolldown": "./bin/cli.mjs" } }, "sha512-g0EtLvBjTUB7jhyV0S/TCup3v/XSVl45vUIGbOGU4QPiyjTenCe4mKuFvW9fEgYmS2Fo42AUssRmNuMziXdrig=="],

    "rxjs": ["rxjs@7.8.2", "", { "dependencies": { "tslib": "^2.1.0" } }, "sha512-dhKf903U/PQZY6boNNtAGdWbG85WAbjT/1xYoZIC7FAY0yWapOBQVsVrDl58W86//e1VpMNBtRV4MaXfdMySFA=="],

    "scheduler": ["scheduler@0.27.0", "", {}, "sha512-eNv+WrVbKu1f3vbYJT/xtiF5syA5HPIMtf9IgY/nKg0sWqzAUEvqY/xm7OcZc/qafLx/iO9FgOmeSAp4v5ti/Q=="],

    "semver": ["semver@6.3.1", "", { "bin": { "semver": "bin/semver.js" } }, "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA=="],

    "shebang-command": ["shebang-command@2.0.0", "", { "dependencies": { "shebang-regex": "^3.0.0" } }, "sha512-kHxr2zZpYtdmrN1qDjrrX/Z1rR1kG8Dx+gkpK1G4eXmvXswmcE1hTWBWYUzlraYw1/yZp6YuDY77YtvbN0dmDA=="],

    "shebang-regex": ["shebang-regex@3.0.0", "", {}, "sha512-7++dFhtcx3353uBaq8DDR4NuxBetBzC7ZQOhmTQInHEd6bSrXdiEyzCvG07Z44UYdLShWUyXt5M/yhz8ekcb1A=="],

    "shell-quote": ["shell-quote@1.9.0", "", {}, "sha512-Iov+JwFv/2HcTpcwNMKd8+IWNb8tboQJNQTkAY/LLVK7gGH9jy+LGkVqPxfekHl+yMmiqXszdGWXgkfml7hjqA=="],

    "source-map-js": ["source-map-js@1.2.1", "", {}, "sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA=="],

    "string-width": ["string-width@7.2.0", "", { "dependencies": { "emoji-regex": "^10.3.0", "get-east-asian-width": "^1.0.0", "strip-ansi": "^7.1.0" } }, "sha512-tsaTIkKW9b4N+AEj+SVA+WhJzV7/zMhcSu78mLKWSk7cXMOSHsBKFWUs0fWwq8QyK3MgJBQRX6Gbi4kYbdvGkQ=="],

    "strip-ansi": ["strip-ansi@7.2.0", "", { "dependencies": { "ansi-regex": "^6.2.2" } }, "sha512-yDPMNjp4WyfYBkHnjIRLfca1i6KMyGCtsVgoKe/z1+6vukgaENdgGBZt+ZmKPc4gavvEZ5OgHfHdrazhgNyG7w=="],

    "sumchecker": ["sumchecker@3.0.1", "", { "dependencies": { "debug": "^4.1.0" } }, "sha512-MvjXzkz/BOfyVDkG0oFOtBxHX2u3gKbMHIF/dXblZsgD3BWOFLmHovIpZY7BykJdAjcqRCBi1WYBNdEC9yI7vg=="],

    "supports-color": ["supports-color@10.2.2", "", {}, "sha512-SS+jx45GF1QjgEXQx4NJZV9ImqmO2NPz5FNsIHrsDjh2YsHnawpan7SNQ1o8NuhrbHZy9AZhIoCUiCeaW/C80g=="],

    "tinyglobby": ["tinyglobby@0.2.17", "", { "dependencies": { "fdir": "^6.5.0", "picomatch": "^4.0.4" } }, "sha512-wXR/dYpcqKmfWpEdZjiKJOwCNFndD0DMnrW/cYjVGttEkBfVgcLFHoNrlj47mjOVic9yyNu65alsgF4NQyTa2g=="],

    "tree-kill": ["tree-kill@1.2.2", "", { "bin": { "tree-kill": "cli.js" } }, "sha512-L0Orpi8qGpRG//Nd+H90vFB+3iHnue1zSSGmNOOCh1GLJ7rUKVwV2HvijphGQS2UmhUZewS9VgvxYIdgr+fG1A=="],

    "tslib": ["tslib@2.8.1", "", {}, "sha512-oJFu94HQb+KVduSUQL7wnpmqnfmLsOA/nAh6b6EH0wCEoK0/mPeXU6c3wKDV83MkOuHPRHtSXKKU99IBazS/2w=="],

    "type-check": ["type-check@0.4.0", "", { "dependencies": { "prelude-ls": "^1.2.1" } }, "sha512-XleUoc9uwGXqjWwXaUTZAmzMcFZ5858QA2vvx1Ur5xIcixXIP+8LnFDgRplU30us6teqdlskFfu+ae4K79Ooew=="],

    "undici": ["undici@7.29.1", "", {}, "sha512-RYONW2MeafgYlkVOKYKkA/Ag7BmXqgIWCa8t1m0JcxrQg9pI9lEqRhAOruOBCbAohOa/gkCF+iPi9hrgvTzu6Q=="],

    "undici-types": ["undici-types@7.18.2", "", {}, "sha512-AsuCzffGHJybSaRrmr5eHr81mwJU3kjw6M+uprWvCXiNeN9SOGwQ3Jn8jb8m3Z6izVgknn1R0FTCEAP2QrLY/w=="],

    "update-browserslist-db": ["update-browserslist-db@1.3.2", "", { "dependencies": { "escalade": "^3.2.0", "picocolors": "^1.1.1" }, "peerDependencies": { "browserslist": ">= 4.21.0" }, "bin": { "update-browserslist-db": "cli.js" } }, "sha512-UQ+MSxlhRm1bzjhU+DcuXfjFO1FzNtqhK5+9Yvlp90ItDLk5vT932A0rFu619nf7RVS+Y/VeaUW1jaRDqZ8VJw=="],

    "uri-js": ["uri-js@4.4.1", "", { "dependencies": { "punycode": "^2.1.0" } }, "sha512-7rKUyy33Q1yc98pQ1DAmLtwX109F7TIfWlW1Ydo8Wl1ii1SeHieeh0HHfPeL2fMXK6z0s8ecKs9frCuLJvndBg=="],

    "vite": ["vite@8.2.2", "", { "dependencies": { "lightningcss": "^1.33.0", "picomatch": "^4.0.5", "postcss": "^8.5.26", "rolldown": "~1.2.4", "tinyglobby": "^0.2.17" }, "optionalDependencies": { "fsevents": "~2.3.3" }, "peerDependencies": { "@types/node": "^20.19.0 || >=22.12.0", "@vitejs/devtools": "^0.4.0 || ^0.5.0", "esbuild": "^0.27.0 || ^0.28.0", "jiti": ">=1.21.0", "less": "^4.0.0", "sass": "^1.70.0", "sass-embedded": "^1.70.0", "stylus": ">=0.54.8", "sugarss": "^5.0.0", "terser": "^5.16.0", "tsx": "^4.8.1", "yaml": "^2.4.2" }, "optionalPeers": ["@types/node", "@vitejs/devtools", "esbuild", "jiti", "less", "sass", "sass-embedded", "stylus", "sugarss", "terser", "tsx", "yaml"], "bin": { "vite": "bin/vite.js" } }, "sha512-cFKLV/PRgAUlIRm5WjMjJ86jrftzpqcgH+Us+DS8mI3CDNiH30Whrz8uHL3+MOLPAgqbMBAqWdAHAphOAM+z/Q=="],

    "wait-on": ["wait-on@9.1.0", "", { "dependencies": { "axios": "^1.18.1", "joi": "^18.2.3", "lodash": "^4.18.1", "minimist": "^1.2.8", "rxjs": "^7.8.2" }, "bin": { "wait-on": "bin/wait-on" } }, "sha512-PymrLXHLBM1Ju/Xspb2ADUhbPSMvbnuNvy/mN2hWtpbJ3da0h3Ky1LqwKPG5QSVR57liyO0iUpfipYl/s5qNvA=="],

    "which": ["which@2.0.2", "", { "dependencies": { "isexe": "^2.0.0" }, "bin": { "node-which": "./bin/node-which" } }, "sha512-BLI3Tl1TW3Pvl70l3yq3Y64i+awpwXqsGBYWkkqMtnbXgrMD+yj7rhW0kuEDxzJaYXGjEW5ogapKNMEKNMjibA=="],

    "word-wrap": ["word-wrap@1.2.5", "", {}, "sha512-BN22B5eaMMI9UMtjrGd5g5eCYPpCPDUy0FJXbYsaT5zYxjFOckS53SQDE3pWkVoWpHXVb3BrYcEN4Twa55B5cA=="],

    "wrap-ansi": ["wrap-ansi@9.0.2", "", { "dependencies": { "ansi-styles": "^6.2.1", "string-width": "^7.0.0", "strip-ansi": "^7.1.0" } }, "sha512-42AtmgqjV+X1VpdOfyTGOYRi0/zsoLqtXQckTmqTeybT+BDIbM/Guxo7x3pE2vtpr1ok6xRqM9OpBe+Jyoqyww=="],

    "y18n": ["y18n@5.0.8", "", {}, "sha512-0pfFzegeDWJHJIAmTLRP2DwHjdF5s7jo9tuztdQxAhINCdvS+3nGINqPd00AphqJR/0LhANUS6/+7SCb98YOfA=="],

    "yallist": ["yallist@3.1.1", "", {}, "sha512-a4UGQaWPH59mOXUYnAG2ewncQS4i4F43Tv3JoAM+s2VDAmS9NsK8GpDMLrCHPksFT7h3K6TOoUNn2pb7RoXx4g=="],

    "yargs": ["yargs@18.0.0", "", { "dependencies": { "cliui": "^9.0.1", "escalade": "^3.1.1", "get-caller-file": "^2.0.5", "string-width": "^7.2.0", "y18n": "^5.0.5", "yargs-parser": "^22.0.0" } }, "sha512-4UEqdc2RYGHZc7Doyqkrqiln3p9X2DZVxaGbwhn2pi7MrRagKaOcIKe8L3OxYcbhXLgLFUS3zAYuQjKBQgmuNg=="],

    "yargs-parser": ["yargs-parser@22.0.0", "", {}, "sha512-rwu/ClNdSMpkSrUb+d6BRsSkLUq1fmfsY6TOpYzTwvwkg1/NRG85KBy3kq++A8LKQwX6lsu+aWad+2khvuXrqw=="],

    "yocto-queue": ["yocto-queue@0.1.0", "", {}, "sha512-rVksvsnNCdJ/ohGc6xgPwyN8eheCxsiLM8mxuE/t/mOVqJewPuO1miLpTHQiRgTKCLexL4MeAFVagts7HmNZ2Q=="],

    "zod": ["zod@4.5.4", "", {}, "sha512-sC95tT5iHHH9gtpj6A81kh+NEaRAUFN+qlUPDUbRfOMvNf5QCBqsb3WgvnpVtK5Y+4UfA6KqufotuTvMGiTlsA=="],

    "zod-validation-error": ["zod-validation-error@4.0.2", "", { "peerDependencies": { "zod": "^3.25.0 || ^4.0.0" } }, "sha512-Q6/nZLe6jxuU80qb/4uJ4t5v2VEZ44lzQjPDhYJNztRQ4wyWc6VF3D3Kb/fAuPetZQnhS3hnajCf9CsWesghLQ=="],

    "@electron/get/semver": ["semver@7.8.5", "", { "bin": { "semver": "bin/semver.js" } }, "sha512-Y7/KDsb8LjooZpwaqGyulO6DQlksgCncchHGk+sZIY4SBvUocMBEFH5Ur1fI4dV+Jvl0w6cjvucaIi40puRioA=="],

    "@eslint-community/eslint-utils/eslint-visitor-keys": ["eslint-visitor-keys@3.4.3", "", {}, "sha512-wpc+LXeiyiisxPlEkUzU6svyS1frIO3Mgxj1fdy7Pm8Ygzguax2N3Fa/D/ag1WqbOprdI+uY6wMUl8/a2G+iag=="],

    "qified/hookified": ["hookified@2.2.0", "", {}, "sha512-p/LgFzRN5FeoD3DLS6bkUapeye6E4SI6yJs6KetENd18S+FBthqYq2amJUWpt5z0EQwwHemidjY5OqJGEKm5uA=="],
  }
}
```
## *eslint.config.js*
```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])
```
## *index.html*
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>gui</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```
## *main.js*
```javascript
/* gui/main.js */
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// استيراد ملفات البوت الأساسية بنظام ES Modules
import { ChromeWorker } from '../Browsers/chrome.js';
import SheetHandler from '../FileHandler/SheetsHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
const activeWorkers = new Map();

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        backgroundColor: '#0f172a',
        webPreferences: {
            // ربط ملف الـ CJS الجديد
            preload: path.join(__dirname, 'preload.cjs'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });
    mainWindow.loadURL('http://localhost:5173');
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// --- File IPC Handlers ---
ipcMain.handle('select-local-file', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [{ name: 'Spreadsheets', extensions: ['xlsx', 'csv'] }]
    });
    if (canceled || filePaths.length === 0) return null;
    try {
        const handler = new SheetHandler();
        const result = handler.loadFromExcel(filePaths[0]);
        if (result.success) return result.data;
        throw new Error(result.error);
    } catch (error) {
        return { error: error.message };
    }
});

ipcMain.handle('fetch-google-sheet', async (event, url) => {
    try {
        const sheetIdMatch = url.match(/\/d\/(.*?)(\/|$)/);
        if (!sheetIdMatch) throw new Error("Invalid Google Sheets URL");
        return [{ account: "fetched@sheet.com", password: "pwd", country: "Portugal", city: "Cairo" }];
    } catch (error) {
        return { error: error.message };
    }
});

// --- Bot IPC Handlers ---
/* gui/main.js */
ipcMain.on('launch-bots', async (event, instances) => {
    for (const instance of instances) {
        if (activeWorkers.has(instance.id)) continue;

        // Dynamic headless resolution (defaults to true)
        const isHeadless = instance.headless !== undefined ? instance.headless : true;

        const worker = new ChromeWorker({
            headless: isHeadless,
            email: instance.data.account,
            password: instance.data.password
        });
        
        worker.logStatus = (msg) => {
            event.reply('bot-status', { id: instance.id, status: msg });
        };
        worker.logError = (key, msg) => {
            event.reply('bot-status', { id: instance.id, status: `Error: ${msg}` });
        };

        activeWorkers.set(instance.id, worker);
        worker.launchBrowser();
        
        await new Promise(r => setTimeout(r, 2000));
    }
});
console.log(`\n\n\n   Hello From Main.js  ال main بمسي عليكم \n\n\n`);

ipcMain.on('close-bots', (event, ids) => {
    for (const id of ids) {
        const worker = activeWorkers.get(id);
        if (worker) {
            worker.terminate();
            activeWorkers.delete(id);
            event.reply('bot-status', { id: id, status: 'Closed' });
        }
    }
});
```
## *package.json*
```json
{
  "name": "gui",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "main": "main.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "electron:start": "cross-env NODE_ENV=development electron .",
    "start": "concurrently \"bun run dev\" \"wait-on http://localhost:5173 && bun run electron:start\""
  },
  "dependencies": {
    "concurrently": "^10.0.5",
    "cross-env": "^10.1.0",
    "electron": "^44.2.0",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "wait-on": "^9.1.0"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.4",
    "@vitejs/plugin-react": "^6.1.0",
    "eslint": "^10.9.0",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.4",
    "globals": "^17.11.0",
    "vite": "^8.2.2"
  }
  
}
```
## *preload.cjs*
```javascript
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    selectLocalFile: () => ipcRenderer.invoke('select-local-file'),
    fetchGoogleSheet: (url) => ipcRenderer.invoke('fetch-google-sheet', url),
    
    // Bot Control Methods
    launchBots: (instances) => ipcRenderer.send('launch-bots', instances),
    closeBots: (ids) => ipcRenderer.send('close-bots', ids),
    
    // Status Listener
    onBotStatusUpdate: (callback) => ipcRenderer.on('bot-status', (_event, data) => callback(data))
});
```
## *README.md*
```markdown
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
```
## *vite.config.js*
```javascript
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
```

------------------------------------------------

## VFS_Portugal/gui/src
### *App.css*
```css
.counter {
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 5px;
  color: var(--accent);
  background: var(--accent-bg);
  border: 2px solid transparent;
  transition: border-color 0.3s;
  margin-bottom: 24px;

  &:hover {
    border-color: var(--accent-border);
  }
  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
}

.hero {
  position: relative;

  .base,
  .framework,
  .vite {
    inset-inline: 0;
    margin: 0 auto;
  }

  .base {
    width: 170px;
    position: relative;
    z-index: 0;
  }

  .framework,
  .vite {
    position: absolute;
  }

  .framework {
    z-index: 1;
    top: 34px;
    height: 28px;
    transform: perspective(2000px) rotateZ(300deg) rotateX(44deg) rotateY(39deg)
      scale(1.4);
  }

  .vite {
    z-index: 0;
    top: 107px;
    height: 26px;
    width: auto;
    transform: perspective(2000px) rotateZ(300deg) rotateX(40deg) rotateY(39deg)
      scale(0.8);
  }
}

#center {
  display: flex;
  flex-direction: column;
  gap: 25px;
  place-content: center;
  place-items: center;
  flex-grow: 1;

  @media (max-width: 1024px) {
    padding: 32px 20px 24px;
    gap: 18px;
  }
}

#next-steps {
  display: flex;
  border-top: 1px solid var(--border);
  text-align: left;

  & > div {
    flex: 1 1 0;
    padding: 32px;
    @media (max-width: 1024px) {
      padding: 24px 20px;
    }
  }

  .icon {
    margin-bottom: 16px;
    width: 22px;
    height: 22px;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
  }
}

#docs {
  border-right: 1px solid var(--border);

  @media (max-width: 1024px) {
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
}

#next-steps ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 8px;
  margin: 32px 0 0;

  .logo {
    height: 18px;
  }

  a {
    color: var(--text-h);
    font-size: 16px;
    border-radius: 6px;
    background: var(--social-bg);
    display: flex;
    padding: 6px 12px;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    transition: box-shadow 0.3s;

    &:hover {
      box-shadow: var(--shadow);
    }
    .button-icon {
      height: 18px;
      width: 18px;
    }
  }

  @media (max-width: 1024px) {
    margin-top: 20px;
    flex-wrap: wrap;
    justify-content: center;

    li {
      flex: 1 1 calc(50% - 8px);
    }

    a {
      width: 100%;
      justify-content: center;
      box-sizing: border-box;
    }
  }
}

#spacer {
  height: 88px;
  border-top: 1px solid var(--border);
  @media (max-width: 1024px) {
    height: 48px;
  }
}

.ticks {
  position: relative;
  width: 100%;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: -4.5px;
    border: 5px solid transparent;
  }

  &::before {
    left: 0;
    border-left-color: var(--border);
  }
  &::after {
    right: 0;
    border-right-color: var(--border);
  }
}
```
### *App.jsx*
```jsx
/* gui/src/App.jsx */
import { useState, useEffect } from 'react';
import './theme.css';

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

export default function App() {
    const [instances, setInstances] = useState([]);
    const [sheetUrl, setSheetUrl] = useState('');
    
    // Global Headless Default (Defaults to true)
    const [defaultHeadless, setDefaultHeadless] = useState(true);
    
    // Theme State ('dark' | 'light')
    const [theme, setTheme] = useState('dark');

    // Modal State
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState(null);

    useEffect(() => {
        if (window.electronAPI) {
            window.electronAPI.onBotStatusUpdate(({ id, status }) => {
                setInstances(prev => prev.map(inst => 
                    inst.id === id ? { ...inst, status: status } : inst
                ));
            });
        }
    }, []);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    const handleLocalFile = async () => {
        const data = await window.electronAPI.selectLocalFile();
        if (data && !data.error) {
            const newInstances = data.map(item => ({
                id: generateId(),
                data: item,
                headless: defaultHeadless, // Inherits default headless state
                status: 'Idle',
                selected: false
            }));
            setInstances(prev => [...prev, ...newInstances]);
        } else if (data?.error) alert(data.error);
    };

    const handleGoogleSheet = async () => {
        const data = await window.electronAPI.fetchGoogleSheet(sheetUrl);
        if (data && !data.error) {
            const newInstances = data.map(item => ({
                id: generateId(),
                data: item,
                headless: defaultHeadless,
                status: 'Idle',
                selected: false
            }));
            setInstances(prev => [...prev, ...newInstances]);
            setSheetUrl('');
        }
    };

    const handleManualAdd = () => {
        setEditingId('NEW');
        setEditForm({
            account: '',
            password: '',
            country: '',
            city: '',
            appointmentCategory: '',
            subCategory: '',
            headless: defaultHeadless
        });
    };

    const toggleSelect = (id) => setInstances(prev => prev.map(inst => inst.id === id ? { ...inst, selected: !inst.selected } : inst));
    const toggleSelectAll = (e) => setInstances(prev => prev.map(inst => ({ ...inst, selected: e.target.checked })));

    const launchBots = (ids) => {
        const toLaunch = instances.filter(i => ids.includes(i.id));
        window.electronAPI.launchBots(toLaunch);
        setInstances(prev => prev.map(inst => ids.includes(inst.id) ? { ...inst, status: 'Launching...' } : inst));
    };

    const closeBots = (ids) => window.electronAPI.closeBots(ids);
    const deleteBots = (ids) => {
        closeBots(ids);
        setInstances(prev => prev.filter(inst => !ids.includes(inst.id)));
    };

    const selectedIds = instances.filter(i => i.selected).map(i => i.id);

    const startEdit = (inst) => {
        setEditingId(inst.id);
        setEditForm({ ...inst.data, headless: inst.headless ?? true });
    };
    
    const saveEdit = () => {
        if (!editForm.account) return alert("Account email is required");
        const { headless, ...dataFields } = editForm;

        if (editingId === 'NEW') {
            const newInst = {
                id: generateId(),
                data: dataFields,
                headless: headless,
                status: 'Idle',
                selected: false
            };
            setInstances(prev => [...prev, newInst]);
        } else {
            setInstances(prev => prev.map(inst => 
                inst.id === editingId ? { ...inst, data: dataFields, headless: headless } : inst
            ));
        }
        setEditingId(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm(null);
    };

    const copyInstanceData = (data) => {
        const text = `Account: ${data.account}\nPassword: ${data.password}\nCountry: ${data.country}\nCity: ${data.city}\nCategory: ${data.appointmentCategory}\nSub-category: ${data.subCategory}`;
        navigator.clipboard.writeText(text);
    };

    const copyStatus = (status) => navigator.clipboard.writeText(status);

    return (
        <div className={`app-container ${theme}-theme`}>
            <header className="header-panel">
                <div className="import-controls">
                    <button className="btn-add" onClick={handleManualAdd}>+ Add Account</button>
                    <button className="btn-outline" onClick={handleLocalFile}>📁 Browse Files...</button>
                    
                    <div className="sheet-fetcher">
                        <input 
                            type="text" 
                            placeholder="Google Sheet URL" 
                            value={sheetUrl} 
                            onChange={e => setSheetUrl(e.target.value)} 
                        />
                        <button className="btn-outline" onClick={handleGoogleSheet}>Fetch Cloud Sheet</button>
                    </div>

                    {/* Global Headless Switch */}
                    <div className="toggle-wrapper" title="Default headless setting for new instances">
                        <span className="toggle-title">Default Headless</span>
                        <label className="switch">
                            <input 
                                type="checkbox" 
                                checked={defaultHeadless} 
                                onChange={e => setDefaultHeadless(e.target.checked)} 
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    {/* Dark/Light Theme Button */}
                    <button className="btn-outline theme-toggle-btn" onClick={toggleTheme}>
                        {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
                    </button>
                </div>
            </header>

            <div className="bulk-actions">
                <button className="btn-launch" disabled={selectedIds.length === 0} onClick={() => launchBots(selectedIds)}>Launch Selected</button>
                <button className="btn-close" disabled={selectedIds.length === 0} onClick={() => closeBots(selectedIds)}>Close Selected</button>
                <button className="btn-delete" disabled={selectedIds.length === 0} onClick={() => deleteBots(selectedIds)}>Delete Selected</button>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th width="40px"><input type="checkbox" onChange={toggleSelectAll} checked={instances.length > 0 && selectedIds.length === instances.length} /></th>
                            <th width="40px">#</th>
                            <th width="240px">Target Account</th>
                            <th>Country</th>
                            <th>Target City</th>
                            <th>Category</th>
                            <th width="100px">Mode</th>
                            <th>Operational State</th>
                            <th width="240px" style={{textAlign:'center'}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {instances.map((inst, index) => (
                            <tr key={inst.id} onDoubleClick={() => startEdit(inst)} className={inst.selected ? 'selected-row' : ''}>
                                <td><input type="checkbox" checked={inst.selected} onChange={() => toggleSelect(inst.id)} /></td>
                                <td>{index + 1}</td>
                                <td>
                                    <div className="flex-row-copy">
                                        <span>{inst.data.account}</span>
                                        <button className="copy-btn" onClick={(e) => { e.stopPropagation(); copyInstanceData(inst.data); }} title="Copy Instance Data">📋</button>
                                    </div>
                                </td>
                                <td>{inst.data.country || '-'}</td>
                                <td>{inst.data.city || '-'}</td>
                                <td>{inst.data.appointmentCategory || '-'}</td>
                                <td>
                                    <span className={`badge ${inst.headless ? 'badge-headless' : 'badge-headed'}`}>
                                        {inst.headless ? 'Headless' : 'Headed'}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex-row-copy">
                                        <span className="status-text" title={inst.status}>{inst.status}</span>
                                        <button className="copy-btn" onClick={(e) => { e.stopPropagation(); copyStatus(inst.status); }} title="Copy Operational State">📋</button>
                                    </div>
                                </td>
                                <td className="action-cells">
                                    <button className="btn-sm btn-launch" onClick={(e) => { e.stopPropagation(); launchBots([inst.id]); }}>Launch</button>
                                    <button className="btn-sm btn-close" onClick={(e) => { e.stopPropagation(); closeBots([inst.id]); }}>Close</button>
                                    <button className="btn-sm btn-delete" onClick={(e) => { e.stopPropagation(); deleteBots([inst.id]); }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit / Add Modal */}
            {editingId && (
                <div className="modal-overlay" onClick={cancelEdit}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingId === 'NEW' ? 'Add New Instance' : 'Edit Instance'}</h3>
                            
                            {/* Instance Headless Switch */}
                            <div className="toggle-wrapper">
                                <span className="toggle-title">Headless</span>
                                <label className="switch">
                                    <input 
                                        type="checkbox" 
                                        checked={editForm.headless} 
                                        onChange={e => setEditForm({...editForm, headless: e.target.checked})} 
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Account Email</label>
                                <input type="text" value={editForm.account} onChange={e => setEditForm({...editForm, account: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input type="text" value={editForm.password} onChange={e => setEditForm({...editForm, password: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Country</label>
                                <input type="text" value={editForm.country} onChange={e => setEditForm({...editForm, country: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>City</label>
                                <input type="text" value={editForm.city} onChange={e => setEditForm({...editForm, city: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Appointment Category</label>
                                <input type="text" value={editForm.appointmentCategory} onChange={e => setEditForm({...editForm, appointmentCategory: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Sub Category</label>
                                <input type="text" value={editForm.subCategory} onChange={e => setEditForm({...editForm, subCategory: e.target.value})} />
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-outline" onClick={cancelEdit}>Cancel</button>
                            <button className="btn-launch" onClick={saveEdit}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
```
### *index.css*
```css
:root {
  --text: #6b6375;
  --text-h: #08060d;
  --bg: #fff;
  --border: #e5e4e7;
  --code-bg: #f4f3ec;
  --accent: #aa3bff;
  --accent-bg: rgba(170, 59, 255, 0.1);
  --accent-border: rgba(170, 59, 255, 0.5);
  --social-bg: rgba(244, 243, 236, 0.5);
  --shadow:
    rgba(0, 0, 0, 0.1) 0 10px 15px -3px, rgba(0, 0, 0, 0.05) 0 4px 6px -2px;

  --sans: system-ui, 'Segoe UI', Roboto, sans-serif;
  --heading: system-ui, 'Segoe UI', Roboto, sans-serif;
  --mono: ui-monospace, Consolas, monospace;

  font: 18px/145% var(--sans);
  letter-spacing: 0.18px;
  color-scheme: light dark;
  color: var(--text);
  background: var(--bg);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  @media (max-width: 1024px) {
    font-size: 16px;
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    --text: #9ca3af;
    --text-h: #f3f4f6;
    --bg: #16171d;
    --border: #2e303a;
    --code-bg: #1f2028;
    --accent: #c084fc;
    --accent-bg: rgba(192, 132, 252, 0.15);
    --accent-border: rgba(192, 132, 252, 0.5);
    --social-bg: rgba(47, 48, 58, 0.5);
    --shadow:
      rgba(0, 0, 0, 0.4) 0 10px 15px -3px, rgba(0, 0, 0, 0.25) 0 4px 6px -2px;
  }

  #social .button-icon {
    filter: invert(1) brightness(2);
  }
}

body {
  margin: 0;
}

#root {
  width: 1126px;
  max-width: 100%;
  margin: 0 auto;
  text-align: center;
  border-inline: 1px solid var(--border);
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

h1,
h2 {
  font-family: var(--heading);
  font-weight: 500;
  color: var(--text-h);
}

h1 {
  font-size: 56px;
  letter-spacing: -1.68px;
  margin: 32px 0;
  @media (max-width: 1024px) {
    font-size: 36px;
    margin: 20px 0;
  }
}
h2 {
  font-size: 24px;
  line-height: 118%;
  letter-spacing: -0.24px;
  margin: 0 0 8px;
  @media (max-width: 1024px) {
    font-size: 20px;
  }
}
p {
  margin: 0;
}

code,
.counter {
  font-family: var(--mono);
  display: inline-flex;
  border-radius: 4px;
  color: var(--text-h);
}

code {
  font-size: 15px;
  line-height: 135%;
  padding: 4px 8px;
  background: var(--code-bg);
}
```
### *main.jsx*
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```
### *theme.css*
```css
/* gui/src/theme.css */

/* --- Dark Theme Variables (Default) --- */
.dark-theme {
    --bg-main: #0f172a;
    --bg-panel: #1e293b;
    --bg-row-hover: #334155;
    --bg-selected: #1e3a5f;
    --text-main: #e2e8f0;
    --text-muted: #94a3b8;
    --border-color: #334155;
    --table-header-bg: #0b1120;
    --input-bg: #0f172a;
    --modal-overlay: rgba(0, 0, 0, 0.75);

    --color-launch: #0ea5e9;
    --color-close: #f59e0b;
    --color-delete: #ef4444;
    --color-add: #10b981;
}

/* --- Light Theme Variables --- */
.light-theme {
    --bg-main: #f1f5f9;
    --bg-panel: #ffffff;
    --bg-row-hover: #f8fafc;
    --bg-selected: #e0f2fe;
    --text-main: #0f172a;
    --text-muted: #64748b;
    --border-color: #cbd5e1;
    --table-header-bg: #e2e8f0;
    --input-bg: #f8fafc;
    --modal-overlay: rgba(15, 23, 42, 0.5);

    --color-launch: #0284c7;
    --color-close: #d97706;
    --color-delete: #dc2626;
    --color-add: #059669;
}

body {
    margin: 0;
    font-family: 'Segoe UI', Tahoma, sans-serif;
    background-color: var(--bg-main);
    color: var(--text-main);
}

.app-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding: 20px;
    box-sizing: border-box;
    background-color: var(--bg-main);
    transition: background-color 0.25s ease, color 0.25s ease;
}

.header-panel {
    background-color: var(--bg-panel);
    padding: 15px 20px;
    border-radius: 8px;
    margin-bottom: 15px;
    border: 1px solid var(--border-color);
}

.import-controls {
    display: flex;
    gap: 15px;
    align-items: center;
}

.sheet-fetcher {
    display: flex;
    gap: 5px;
    flex: 1;
}

.sheet-fetcher input {
    flex: 1;
    background: var(--input-bg);
    border: 1px solid var(--border-color);
    color: var(--text-main);
    padding: 8px 12px;
    border-radius: 4px;
}

.bulk-actions {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
}

/* Action Buttons */
button {
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    cursor: pointer;
    font-weight: 600;
    color: white;
    transition: opacity 0.2s, background-color 0.2s;
}
button:hover:not(:disabled) { opacity: 0.85; }
button:disabled { opacity: 0.35; cursor: not-allowed; }

.btn-add { background-color: var(--color-add); }
.btn-launch { background-color: var(--color-launch); }
.btn-close { background-color: var(--color-close); }
.btn-delete { background-color: var(--color-delete); }
.btn-outline { 
    background-color: transparent; 
    border: 1px solid var(--border-color); 
    color: var(--text-main); 
}

.theme-toggle-btn {
    min-width: 85px;
}

.btn-sm { padding: 4px 10px; font-size: 0.85em; border-radius: 3px; }

/* Table Container & Sticky Elements */
.table-container {
    flex: 1;
    background-color: var(--bg-panel);
    border-radius: 8px;
    border: 1px solid var(--border-color);
    overflow: auto;
    max-width: 100%;
}

.data-table {
    width: 100%;
    min-width: 1150px;
    border-collapse: separate;
    border-spacing: 0;
    text-align: left;
}

.data-table th, .data-table td {
    padding: 12px;
    border-bottom: 1px solid var(--border-color);
    font-size: 0.9em;
}

.data-table th {
    background-color: var(--table-header-bg);
    color: var(--text-muted);
    font-size: 0.82em;
    text-transform: uppercase;
    position: sticky;
    top: 0;
    z-index: 1;
}

.data-table tr:hover { background-color: var(--bg-row-hover); }
.data-table tr.selected-row { background-color: var(--bg-selected); }

.data-table th:last-child,
.data-table td:last-child {
    position: sticky;
    right: 0;
    background-color: var(--bg-panel);
    border-left: 2px solid var(--border-color);
    z-index: 2;
}

.data-table th:last-child {
    background-color: var(--table-header-bg);
    z-index: 3;
}

.data-table tr:hover td:last-child { background-color: var(--bg-row-hover); }
.data-table tr.selected-row td:last-child { background-color: var(--bg-selected); }

.action-cells {
    display: flex;
    gap: 5px;
    justify-content: center;
}

/* Status & Copy Elements */
.flex-row-copy {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

.copy-btn {
    background: transparent;
    border: none;
    padding: 2px 4px;
    font-size: 1.1em;
    cursor: pointer;
    filter: grayscale(100%);
    opacity: 0.4;
    transition: all 0.2s;
}
.copy-btn:hover {
    filter: grayscale(0%);
    opacity: 1;
    transform: scale(1.1);
}

.status-text {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 220px;
    cursor: help;
}

/* Badges */
.badge {
    display: inline-block;
    padding: 3px 8px;
    font-size: 0.78em;
    border-radius: 12px;
    font-weight: 600;
}
.badge-headless {
    background-color: rgba(14, 165, 233, 0.15);
    color: var(--color-launch);
    border: 1px solid var(--color-launch);
}
.badge-headed {
    background-color: rgba(245, 158, 11, 0.15);
    color: var(--color-close);
    border: 1px solid var(--color-close);
}

/* --- Drag/Slider Switch Styling --- */
.toggle-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
}

.toggle-title {
    font-size: 0.85em;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
}

.switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 22px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: var(--border-color);
    transition: 0.3s;
    border-radius: 22px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: var(--color-launch);
}

input:checked + .slider:before {
    transform: translateX(22px);
}

/* --- Modal Styling --- */
.modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: var(--modal-overlay);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
}

.modal-content {
    background: var(--bg-panel);
    padding: 24px;
    border-radius: 8px;
    width: 430px;
    border: 1px solid var(--border-color);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.modal-header h3 {
    margin: 0;
    font-size: 1.25em;
    color: var(--text-main);
}

.form-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.form-group label {
    font-size: 0.8em;
    font-weight: 700;
    color: var(--color-launch);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.form-group input {
    background: var(--input-bg);
    border: 1px solid var(--border-color);
    color: var(--text-main);
    padding: 10px;
    border-radius: 4px;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}
```

------------------------------------------------

## VFS_Portugal/gui/public
### *favicon.svg*
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="46" fill="none" viewBox="0 0 48 46"><path fill="#863bff" d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z" style="fill:#863bff;fill:color(display-p3 .5252 .23 1);fill-opacity:1"/><mask id="a" width="48" height="46" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path fill="#000" d="M25.842 44.938c-.664.844-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.183c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.498 0-3.579-1.842-3.579H1.133c-.92 0-1.456-1.04-.92-1.787L9.91.473c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.578 1.842 3.578h11.377c.943 0 1.473 1.088.89 1.832L25.843 44.94z" style="fill:#000;fill-opacity:1"/></mask><g mask="url(#a)"><g filter="url(#b)"><ellipse cx="5.508" cy="14.704" fill="#ede6ff" rx="5.508" ry="14.704" style="fill:#ede6ff;fill:color(display-p3 .9275 .9033 1);fill-opacity:1" transform="matrix(.00324 1 1 -.00324 -4.47 31.516)"/></g><g filter="url(#c)"><ellipse cx="10.399" cy="29.851" fill="#ede6ff" rx="10.399" ry="29.851" style="fill:#ede6ff;fill:color(display-p3 .9275 .9033 1);fill-opacity:1" transform="matrix(.00324 1 1 -.00324 -39.328 7.883)"/></g><g filter="url(#d)"><ellipse cx="5.508" cy="30.487" fill="#7e14ff" rx="5.508" ry="30.487" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.814 -25.913 -14.639)scale(1 -1)"/></g><g filter="url(#e)"><ellipse cx="5.508" cy="30.599" fill="#7e14ff" rx="5.508" ry="30.599" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.814 -32.644 -3.334)scale(1 -1)"/></g><g filter="url(#f)"><ellipse cx="5.508" cy="30.599" fill="#7e14ff" rx="5.508" ry="30.599" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="matrix(.00324 1 1 -.00324 -34.34 30.47)"/></g><g filter="url(#g)"><ellipse cx="14.072" cy="22.078" fill="#ede6ff" rx="14.072" ry="22.078" style="fill:#ede6ff;fill:color(display-p3 .9275 .9033 1);fill-opacity:1" transform="rotate(93.35 24.506 48.493)scale(-1 1)"/></g><g filter="url(#h)"><ellipse cx="3.47" cy="21.501" fill="#7e14ff" rx="3.47" ry="21.501" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.009 28.708 47.59)scale(-1 1)"/></g><g filter="url(#i)"><ellipse cx="3.47" cy="21.501" fill="#7e14ff" rx="3.47" ry="21.501" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.009 28.708 47.59)scale(-1 1)"/></g><g filter="url(#j)"><ellipse cx=".387" cy="8.972" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(39.51 .387 8.972)"/></g><g filter="url(#k)"><ellipse cx="47.523" cy="-6.092" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 47.523 -6.092)"/></g><g filter="url(#l)"><ellipse cx="41.412" cy="6.333" fill="#47bfff" rx="5.971" ry="9.665" style="fill:#47bfff;fill:color(display-p3 .2799 .748 1);fill-opacity:1" transform="rotate(37.892 41.412 6.333)"/></g><g filter="url(#m)"><ellipse cx="-1.879" cy="38.332" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 -1.88 38.332)"/></g><g filter="url(#n)"><ellipse cx="-1.879" cy="38.332" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 -1.88 38.332)"/></g><g filter="url(#o)"><ellipse cx="35.651" cy="29.907" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 35.651 29.907)"/></g><g filter="url(#p)"><ellipse cx="38.418" cy="32.4" fill="#47bfff" rx="5.971" ry="15.297" style="fill:#47bfff;fill:color(display-p3 .2799 .748 1);fill-opacity:1" transform="rotate(37.892 38.418 32.4)"/></g></g><defs><filter id="b" width="60.045" height="41.654" x="-19.77" y="16.149" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="7.659"/></filter><filter id="c" width="90.34" height="51.437" x="-54.613" y="-7.533" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="7.659"/></filter><filter id="d" width="79.355" height="29.4" x="-49.64" y="2.03" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="e" width="79.579" height="29.4" x="-45.045" y="20.029" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="f" width="79.579" height="29.4" x="-43.513" y="21.178" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="g" width="74.749" height="58.852" x="15.756" y="-17.901" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="7.659"/></filter><filter id="h" width="61.377" height="25.362" x="23.548" y="2.284" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="i" width="61.377" height="25.362" x="23.548" y="2.284" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="j" width="56.045" height="63.649" x="-27.636" y="-22.853" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="k" width="54.814" height="64.646" x="20.116" y="-38.415" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="l" width="33.541" height="35.313" x="24.641" y="-11.323" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="m" width="54.814" height="64.646" x="-29.286" y="6.009" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="n" width="54.814" height="64.646" x="-29.286" y="6.009" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="o" width="54.814" height="64.646" x="8.244" y="-2.416" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="p" width="39.409" height="43.623" x="18.713" y="10.588" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter></defs></svg>
```
### *icons.svg*
```svg
<svg xmlns="http://www.w3.org/2000/svg">
  <symbol id="bluesky-icon" viewBox="0 0 16 17">
    <g clip-path="url(#bluesky-clip)"><path fill="#08060d" d="M7.75 7.735c-.693-1.348-2.58-3.86-4.334-5.097-1.68-1.187-2.32-.981-2.74-.79C.188 2.065.1 2.812.1 3.251s.241 3.602.398 4.13c.52 1.744 2.367 2.333 4.07 2.145-2.495.37-4.71 1.278-1.805 4.512 3.196 3.309 4.38-.71 4.987-2.746.608 2.036 1.307 5.91 4.93 2.746 2.72-2.746.747-4.143-1.747-4.512 1.702.189 3.55-.4 4.07-2.145.156-.528.397-3.691.397-4.13s-.088-1.186-.575-1.406c-.42-.19-1.06-.395-2.741.79-1.755 1.24-3.64 3.752-4.334 5.099"/></g>
    <defs><clipPath id="bluesky-clip"><path fill="#fff" d="M.1.85h15.3v15.3H.1z"/></clipPath></defs>
  </symbol>
  <symbol id="discord-icon" viewBox="0 0 20 19">
    <path fill="#08060d" d="M16.224 3.768a14.5 14.5 0 0 0-3.67-1.153c-.158.286-.343.67-.47.976a13.5 13.5 0 0 0-4.067 0c-.128-.306-.317-.69-.476-.976A14.4 14.4 0 0 0 3.868 3.77C1.546 7.28.916 10.703 1.231 14.077a14.7 14.7 0 0 0 4.5 2.306q.545-.748.965-1.587a9.5 9.5 0 0 1-1.518-.74q.191-.14.372-.293c2.927 1.369 6.107 1.369 8.999 0q.183.152.372.294-.723.437-1.52.74.418.838.963 1.588a14.6 14.6 0 0 0 4.504-2.308c.37-3.911-.63-7.302-2.644-10.309m-9.13 8.234c-.878 0-1.599-.82-1.599-1.82 0-.998.705-1.82 1.6-1.82.894 0 1.614.82 1.599 1.82.001 1-.705 1.82-1.6 1.82m5.91 0c-.878 0-1.599-.82-1.599-1.82 0-.998.705-1.82 1.6-1.82.893 0 1.614.82 1.599 1.82 0 1-.706 1.82-1.6 1.82"/>
  </symbol>
  <symbol id="documentation-icon" viewBox="0 0 21 20">
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="m15.5 13.333 1.533 1.322c.645.555.967.833.967 1.178s-.322.623-.967 1.179L15.5 18.333m-3.333-5-1.534 1.322c-.644.555-.966.833-.966 1.178s.322.623.966 1.179l1.534 1.321"/>
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M17.167 10.836v-4.32c0-1.41 0-2.117-.224-2.68-.359-.906-1.118-1.621-2.08-1.96-.599-.21-1.349-.21-2.848-.21-2.623 0-3.935 0-4.983.369-1.684.591-3.013 1.842-3.641 3.428C3 6.449 3 7.684 3 10.154v2.122c0 2.558 0 3.838.706 4.726q.306.383.713.671c.76.536 1.79.64 3.581.66"/>
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M3 10a2.78 2.78 0 0 1 2.778-2.778c.555 0 1.209.097 1.748-.047.48-.129.854-.503.982-.982.145-.54.048-1.194.048-1.749a2.78 2.78 0 0 1 2.777-2.777"/>
  </symbol>
  <symbol id="github-icon" viewBox="0 0 19 19">
    <path fill="#08060d" fill-rule="evenodd" d="M9.356 1.85C5.05 1.85 1.57 5.356 1.57 9.694a7.84 7.84 0 0 0 5.324 7.44c.387.079.528-.168.528-.376 0-.182-.013-.805-.013-1.454-2.165.467-2.616-.935-2.616-.935-.349-.91-.864-1.143-.864-1.143-.71-.48.051-.48.051-.48.787.051 1.2.805 1.2.805.695 1.194 1.817.857 2.268.649.064-.507.27-.857.49-1.052-1.728-.182-3.545-.857-3.545-3.87 0-.857.31-1.558.8-2.104-.078-.195-.349-1 .077-2.078 0 0 .657-.208 2.14.805a7.5 7.5 0 0 1 1.946-.26c.657 0 1.328.092 1.946.26 1.483-1.013 2.14-.805 2.14-.805.426 1.078.155 1.883.078 2.078.502.546.799 1.247.799 2.104 0 3.013-1.818 3.675-3.558 3.87.284.247.528.714.528 1.454 0 1.052-.012 1.896-.012 2.156 0 .208.142.455.528.377a7.84 7.84 0 0 0 5.324-7.441c.013-4.338-3.48-7.844-7.773-7.844" clip-rule="evenodd"/>
  </symbol>
  <symbol id="social-icon" viewBox="0 0 20 20">
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M12.5 6.667a4.167 4.167 0 1 0-8.334 0 4.167 4.167 0 0 0 8.334 0"/>
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M2.5 16.667a5.833 5.833 0 0 1 8.75-5.053m3.837.474.513 1.035c.07.144.257.282.414.309l.93.155c.596.1.736.536.307.965l-.723.73a.64.64 0 0 0-.152.531l.207.903c.164.715-.213.991-.84.618l-.872-.52a.63.63 0 0 0-.577 0l-.872.52c-.624.373-1.003.094-.84-.618l.207-.903a.64.64 0 0 0-.152-.532l-.723-.729c-.426-.43-.289-.864.306-.964l.93-.156a.64.64 0 0 0 .412-.31l.513-1.034c.28-.562.735-.562 1.012 0"/>
  </symbol>
  <symbol id="x-icon" viewBox="0 0 19 19">
    <path fill="#08060d" fill-rule="evenodd" d="M1.893 1.98c.052.072 1.245 1.769 2.653 3.77l2.892 4.114c.183.261.333.48.333.486s-.068.089-.152.183l-.522.593-.765.867-3.597 4.087c-.375.426-.734.834-.798.905a1 1 0 0 0-.118.148c0 .01.236.017.664.017h.663l.729-.83c.4-.457.796-.906.879-.999a692 692 0 0 0 1.794-2.038c.034-.037.301-.34.594-.675l.551-.624.345-.392a7 7 0 0 1 .34-.374c.006 0 .93 1.306 2.052 2.903l2.084 2.965.045.063h2.275c1.87 0 2.273-.003 2.266-.021-.008-.02-1.098-1.572-3.894-5.547-2.013-2.862-2.28-3.246-2.273-3.266.008-.019.282-.332 2.085-2.38l2-2.274 1.567-1.782c.022-.028-.016-.03-.65-.03h-.674l-.3.342a871 871 0 0 1-1.782 2.025c-.067.075-.405.458-.75.852a100 100 0 0 1-.803.91c-.148.172-.299.344-.99 1.127-.304.343-.32.358-.345.327-.015-.019-.904-1.282-1.976-2.808L6.365 1.85H1.8zm1.782.91 8.078 11.294c.772 1.08 1.413 1.973 1.425 1.984.016.017.241.02 1.05.017l1.03-.004-2.694-3.766L7.796 5.75 5.722 2.852l-1.039-.004-1.039-.004z" clip-rule="evenodd"/>
  </symbol>
</svg>
```

------------------------------------------------
