/* Omni-Booking-Automation-Suite/VFS_Portugal/Browsers/chrome.js */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { EgPtrLoginURL, BROWSER_ARGS, CHANNEL, terminationCmds, debug } from '../Config/settings.js';
import Selectors from '../Config/Selectors.js';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import fs from 'node:fs';
import path from 'node:path';

const rl = readline.createInterface({ input, output });

// Register the plugin once globally
puppeteer.use(StealthPlugin());

export class ChromeWorker {
    /**
     * Initializes the configuration for a single browser worker.
     */
    constructor({ headless = true, targetUrl = EgPtrLoginURL, email, password } = {}) {
        this.targetUrl = targetUrl;
        this.headless = headless;
        this.channel = CHANNEL;
        this.browserArgs = BROWSER_ARGS;
        
        // 🛑 FIXED: Assign credentials to class properties
        this.email = email;
        this.password = password;
        
        // State properties to hold the active session
        this.browser = null;
        this.page = null;
        
        // Data stores for the GUI Dashboard
        this.operationalStatus = ['idl'];
        this.warnings = {};
        this.errors = {};
    }

    // ==========================================
    // 🛠️ Centralized Logging & Debugging System
    // ==========================================
    
    logStatus(message) {
        this.operationalStatus.push(message);
        if (debug?.operationalStatus) {
            const time = new Date().toLocaleTimeString();
            console.log(`[${time}] ${message}`);
        }
    }

    logWarning(key, message) {
        this.warnings[key] = message;
        if (debug?.warnings) {
            const time = new Date().toLocaleTimeString();
            console.warn(`[${time}] ⚠️ [Warning - ${key}]: ${message}`);
        }
    }

    logError(key, message) {
        this.errors[key] = message;
        if (debug?.errors) {
            const time = new Date().toLocaleTimeString();
            console.error(`[${time}] ❌ [Error - ${key}]: ${message}`);
        }
    }

    // ==========================================
    // 🌐 Browser Operations
    // ==========================================

    async launchBrowser() {
        try {
            this.logStatus(`[Worker] Launching browser (Headless: ${this.headless})...`);
            
            this.browser = await puppeteer.launch({
                headless: this.headless,
                channel: this.channel,
                defaultViewport: null,
                args: this.browserArgs
            });
            this.logStatus(`[Worker] OPENING`);
            
            const pages = await this.browser.pages();
            this.page = pages.length > 0 ? pages[0] : await this.browser.newPage();
            
            await this.page.setBypassCSP(true);
            
            this.logStatus("[Worker] Navigating to VFS...");
            await this.page.goto(this.targetUrl, { waitUntil: 'domcontentloaded' });
            this.logStatus("[Worker] Page loaded.");
            
            // 🛑 FIXED: Sequence of execution
            // 1. Accept Cookies
            await this.acceptCookies();
            
            // 2. Inject Script BEFORE logging in (so it captures API requests during login)
            await this.injectCustomerScript('./customer_script.js');
            
            // 3. Await the signIn process
            await this.signIn();
            
        } catch (error) {
            this.logError("initialization", `[Worker] Initialization Error: ${error.message}`);
        } finally {
            this.logStatus("[Worker] holding...");
        }
    }

    async _isElementPresent(selectors) {
        if (!this.page) return false;
        const selectorArray = Array.isArray(selectors) ? selectors : [selectors];

        for (const selector of selectorArray) {
            try {
                const element = await this.page.$(selector);
                if (element !== null) return true; 
            } catch (error) {
                continue;
            }
        }
        return false;
    }

    async getCurrentLocation() {
        if (!this.page) return "BROWSER_NOT_INITIALIZED";

        if (await this._isElementPresent(Selectors.login.form.account)) return "LOGIN_PAGE";
        if (await this._isElementPresent(Selectors.appointmentDetails.stepper.container)) return "APPOINTMENT_DETAILS";
        if (await this._isElementPresent(Selectors.dashboard.actions.startNewBookingDesktop) || 
            await this._isElementPresent(Selectors.dashboard.actions.startNewBookingMobile)) {
            return "DASHBOARD";
        }

        const currentUrl = this.page.url();
        return `UNKNOWN_STATE (${currentUrl})`;
    }

    // ==========================================
    // 🧩 Script Injection & Utilities
    // ==========================================

    async injectCustomerScript(relativePath) {
        if (!this.page) {
            this.logError("injection", "[Worker] Cannot inject script: Page not initialized.");
            return;
        }

        try {
            this.logStatus("[Worker] Injecting polyfills and script...");
            
            await this.page.evaluate(() => {
                if (typeof window.GM_setValue === 'undefined') {
                    window.GM_setValue = function(key, value) { 
                        localStorage.setItem('VFS_TM_' + key, value); 
                    };
                    window.GM_getValue = function(key, defaultValue) { 
                        return localStorage.getItem('VFS_TM_' + key) || defaultValue; 
                    };
                    window.GM_addStyle = function(css) {
                        const style = document.createElement('style');
                        style.textContent = css;
                        document.head.appendChild(style);
                    };
                }
            });

            const absolutePath = path.resolve(process.cwd(), relativePath);
            const scriptContent = fs.readFileSync(absolutePath, 'utf-8');
            
            await this.page.addScriptTag({ content: scriptContent });
            this.logStatus(`[Worker] Script successfully injected.`);
            
        } catch (error) {
            this.logError("injection", `[Worker] Script injection failed: ${error.message}`);
        }
    }

    async acceptCookies() {
        if (!this.page) return;
        this.logStatus("[Worker] Checking for cookie banner...");
        
        try {
            const acceptSelectors = Selectors.common.cookieBanner.acceptButton;

            for (const selector of acceptSelectors) {
                try {
                    const button = await this.page.waitForSelector(selector, { timeout: 8000, visible: true });
                    if (button) {
                        await button.click();
                        this.logStatus(`[Worker] Cookie banner accepted.`);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        return; 
                    }
                } catch (err) {
                    continue;
                }
            }
            this.logStatus("[Worker] Cookie banner not found or already accepted.");
        } catch (error) {
            this.logError("cookie_banner", "[Worker] Error handling cookie banner: " + error.message);
        }
    }

    // ==========================================
    // 🤖 Login & Captcha Automation
    // ==========================================

    /**
     * Handles the Cloudflare Turnstile Captcha widget.
     * Uses the hidden response input to bypass closed shadow DOM restrictions.
     */
    async handleCaptcha() {
        if (!this.page) return false;
        
        this.logStatus("[Worker] Handling Cloudflare Captcha...");
        
        try {
            const responseInputSelector = Selectors.login.captcha.responseInput[0];
            
            // 1. Ensure the Captcha container actually loaded
            await this.page.waitForSelector(responseInputSelector, { timeout: 15000 });
            
            this.logStatus("[Worker] Waiting for Cloudflare verification token (auto-solving)...");
            
            // 2. Wait until Cloudflare populates the hidden input with a long token string
            await this.page.waitForFunction((selector) => {
                const el = document.querySelector(selector);
                return el && el.value && el.value.length > 20;
            }, { timeout: 60000 }, responseInputSelector);

            this.logStatus("[Worker] ✅ Captcha resolved successfully!");
            return true;
            
        } catch (error) {
            this.logError("captcha", `Captcha handling failed or timed out: ${error.message}`);
            return false;
        }
    }

    async signIn(email = this.email, password = this.password) {
        if (!this.page) return;

        // Validation
        !email && (this.errors.credential = "Email not provided");
        !password && (this.errors.credential = "Password not provided");

        if (this.errors.credential) {
            this.logError("credential", this.errors.credential);
            if (debug?.errors) throw new Error(this.errors.credential);
            return;
        }

        this.logStatus(`[Worker] Attempting sign-in for: ${email}`);
        
        try {
            // Enter Email
            const emailSelector = Selectors.login.form.account[0];
            await this.page.waitForSelector(emailSelector, { visible: true, timeout: 10000 });
            await this.page.type(emailSelector, email, { delay: 60 });

            // Enter Password
            const passwordSelector = Selectors.login.form.password[0];
            await this.page.type(passwordSelector, password, { delay: 60 });

            // Handle Captcha
            const captchaResolved = await this.handleCaptcha();
            if (!captchaResolved) {
                throw new Error("Cannot proceed because Captcha verification failed.");
            }

            // Wait for Submit button to become active, then click
            const btnSelector = Selectors.login.form.submitButton[0];
            this.logStatus("[Worker] Waiting for Sign In button to become enabled...");
            
            await this.page.waitForSelector(`${btnSelector}:not([disabled])`, { timeout: 15000 });
            await new Promise(resolve => setTimeout(resolve, 800)); // Human-like delay
            
            await Promise.all([
                this.page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }),
                this.page.click(btnSelector)
            ]);
            
            this.logStatus("[Worker] ✅ Login successful, navigated to Dashboard.");

        } catch (error) {
            this.logError("signin", `Sign-in process failed: ${error.message}`);
            if (debug?.errors) throw error;
        }
    }

    // ==========================================
    // 🛑 Teardown
    // ==========================================

    async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            this.page = null;
            this.logStatus("[Worker] Browser closed.");
        }
    }

    terminate(){
        this.closeBrowser();
        rl.close();
    }
}

// Example Execution
if (import.meta.main) {
    const worker1 = new ChromeWorker({ 
        headless: false, 
        email: "sirmohamedh@gmail.com",
        password: "Moed!vsfG@26" // <-- Don't forget to add your password here to test
    });
    
    await worker1.launchBrowser();
    
    let terminate = false;
    while(!terminate){
        const location = await worker1.getCurrentLocation();
        if(debug?.operationalStatus) {
             console.log(`[${new Date().toLocaleTimeString()}] Current Location: ${location}`);
        }
        
        const answer = await rl.question("VFS-bot:) ");
        let command = answer.trim().toLocaleLowerCase();
        
        if(terminationCmds.includes(command)){
            console.log("Exiting...");
            worker1.terminate();
            terminate = true; 
        }
    }
}