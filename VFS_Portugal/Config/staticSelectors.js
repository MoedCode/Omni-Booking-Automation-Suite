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