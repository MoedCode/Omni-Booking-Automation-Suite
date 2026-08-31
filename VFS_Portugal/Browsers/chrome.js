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

// Register the plugin once globally, not inside the class, 
// to prevent memory leak warnings when launching tens of instances.
puppeteer.use(StealthPlugin());

export class ChromeWorker {
    /**
     * Initializes the configuration for a single browser worker.
     */
    constructor({ headless = true, targetUrl = EgPtrLoginURL } = {}) {
        this.targetUrl = targetUrl;
        this.headless = headless;
        this.channel = CHANNEL;
        this.browserArgs = BROWSER_ARGS;
        
        // State properties to hold the active session
        this.browser = null;
        this.page = null;
        
        // Data stores for the future GUI Dashboard
        this.operationalStatus = ['idl'];
        this.warnings = {};
        this.errors = {};
    }

    // ==========================================
    // 🛠️ Centralized Logging & Debugging System
    // ==========================================
    
    /**
     * Logs operational status for the GUI and conditionally to the terminal.
     */
    logStatus(message) {
        this.operationalStatus.push(message);
        if (debug?.operationalStatus) {
            const time = new Date().toLocaleTimeString();
            console.log(`[${time}] ${message}`);
        }
    }

    /**
     * Logs warnings for the GUI and conditionally to the terminal.
     */
    logWarning(key, message) {
        this.warnings[key] = message;
        if (debug?.warnings) {
            const time = new Date().toLocaleTimeString();
            console.warn(`[${time}] ⚠️ [Warning - ${key}]: ${message}`);
        }
    }

    /**
     * Logs errors for the GUI and conditionally to the terminal.
     */
    logError(key, message) {
        this.errors[key] = message;
        if (debug?.errors) {
            const time = new Date().toLocaleTimeString();
            console.error(`[${time}] ❌ [Error - ${key}]: ${message}`);
        }
    }

    // ==========================================

    /**
     * Asynchronously launches the browser and navigates to the target URL.
     */

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
            
            // 🛑 CRITICAL FIX: Bypass VFS's strict Content Security Policy
            // This prevents VFS from blocking the customer_script.js injection
            await this.page.setBypassCSP(true);
            
            this.logStatus("[Worker] Navigating to VFS...");
            await this.page.goto(this.targetUrl, { waitUntil: 'domcontentloaded' });
            
            this.logStatus("[Worker] Page loaded. Handling cookies & injecting script...");
            
            // Inject the Tampermonkey script and polyfills
            await this.acceptCookies();
            await this.injectCustomerScript('./customer_script.js');
            
        } catch (error) {
            this.logError("initialization", `[Worker] Initialization Error: ${error.message}`);
        } finally {
            this.logStatus("[Worker] holding...");
        }
    }

    /**
     * Checks if any selector from an array of fallback selectors exists in the DOM.
     */
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

    /**
     * Identifies the current page location based on DOM elements.
     */
    async getCurrentLocation() {
        if (!this.page) return "BROWSER_NOT_INITIALIZED";

        if (await this._isElementPresent(Selectors.login.form.account)) return "LOGIN_PAGE";
        if (await this._isElementPresent(Selectors.appointmentDetails.stepper.container)) return "APPOINTMENT_DETAILS";
        if (await this._isElementPresent(Selectors.dashboard.actions.startNewBookingDesktop) || 
            await this._isElementPresent(Selectors.dashboard.actions.startNewBookingMobile)) {
            return "DASHBOARD";
        }

        const currentUrl = this.page.url();
        this.logStatus(`[Location]: UNKNOWN_STATE (${currentUrl})`);
        return "UNKNOWN_STATE";
    }

    async clickElement(selector) {
        if (!this.page) throw new Error("Browser page is not initialized.");
        await this.page.waitForSelector(selector);
        await this.page.click(selector);
    }

    /**
     * Injects the Tampermonkey script and its required polyfills into the active page.
     */
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
            
            this.logStatus(`[Worker] Script successfully injected: ${relativePath}`);
        } catch (error) {
            this.logError("injection", `[Worker] Script injection failed: ${error.message}`);
        }
    }

    /**
     * Checks for the cookie banner and clicks the "Accept All Cookies" button if it appears.
     */
    async acceptCookies() {
        if (!this.page) return;

        this.logStatus("[Worker] Checking for cookie banner...");
        
        try {
            const acceptSelectors = Selectors.common.cookieBanner1.acceptButton;

            for (const selector of acceptSelectors) {
                try {
                    // Increased timeout to 8000ms for slow-loading VFS pages
                    const button = await this.page.waitForSelector(selector, { timeout: 8000, visible: true });
                    if (button) {
                        await button.click();
                        this.logStatus(`[Worker] Cookie banner accepted using selector: ${selector}`);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        return; 
                    }
                } catch (err) {
                    this.logWarning("cookie_selector_fail", `Selector '${selector}' failed/timeout.`);
                    continue;
                }
            }
            
            this.logStatus("[Worker] Cookie banner not found or already accepted.");
        } catch (error) {
            this.logError("cookie_banner", "[Worker] Error handling cookie banner: " + error.message);
        }
    }
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
    const worker1 = new ChromeWorker({ headless: false });
    await worker1.launchBrowser();
    
    let terminate = false;
    while(!terminate){
        // Only print the location if we are actively debugging the status
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