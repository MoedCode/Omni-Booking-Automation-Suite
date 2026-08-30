/* Omni-Booking-Automation-Suite/VFS_Portugal/Browsers/chrome.js */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { EgPtrLoginURL, BROWSER_ARGS, CHANNEL, terminationCmds } from '../Config/settings.js';
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
        this.operationalStatus = ['idl'];
        
        // State properties to hold the active session
        this.browser = null;
        this.page = null;
        this.warnings = {};
        this.errors = null;
    }

    /**
     * Asynchronously launches the browser and navigates to the target URL.
     */
    async launchBrowser() {
        try {
            this.operationalStatus.push(`[Worker] Launching browser (Headless: ${this.headless})...`);
            
            // Use the dynamic class properties configured in the constructor
            this.browser = await puppeteer.launch({
                headless: this.headless,
                channel: this.channel,
                defaultViewport: null,
                args: this.browserArgs
            });
            this.operationalStatus.push(`OPENING`);
            
            const pages = await this.browser.pages();
            this.page = pages.length > 0 ? pages[0] : await this.browser.newPage();

            this.operationalStatus.push("[Worker] Navigating to VFS...");
            await this.page.goto(this.targetUrl, { waitUntil: 'domcontentloaded' });
            
            this.operationalStatus.push("[Worker] Page loaded. Injecting script...");
            
            // Inject the Tampermonkey script and polyfills
            await this.injectCustomerScript('./customer_script.js');

        } catch (error) {
            this.operationalStatus.push("[Worker] Initialization Error: " + error.message);
        } finally {
            this.operationalStatus.push("holding...");
        }
    }

    /**
     * Checks if any selector from an array of fallback selectors exists in the DOM.
     * @param {string|string[]} selectors - A single selector or array of fallback selectors.
     * @returns {boolean} - True if at least one selector is found on the page.
     */
    async _isElementPresent(selectors) {
        if (!this.page) return false;

        // Ensure we are working with an array, even if a single string is passed
        const selectorArray = Array.isArray(selectors) ? selectors : [selectors];

        for (const selector of selectorArray) {
            try {
                // page.$() returns the element if found, or null if not found
                const element = await this.page.$(selector);
                if (element !== null) {
                    return true; 
                }
            } catch (error) {
                // Ignore invalid selector errors and continue to the next fallback
                continue;
            }
        }
        return false;
    }

    /**
     * Identifies the current page location based on DOM elements.
     */
    async getCurrentLocation() {
        if (!this.page) {
            return "BROWSER_NOT_INITIALIZED";
        }

        // 1. Check Login Page using Selectors object
        if (await this._isElementPresent(Selectors.login.form.account)) {
            return "LOGIN_PAGE";
        }

        // 2. Check Appointment Details using Selectors object
        if (await this._isElementPresent(Selectors.appointmentDetails.stepper.container)) {
            return "APPOINTMENT_DETAILS";
        }

        // 3. Check Dashboard using Selectors object (Desktop or Mobile)
        if (await this._isElementPresent(Selectors.dashboard.actions.startNewBookingDesktop) || 
            await this._isElementPresent(Selectors.dashboard.actions.startNewBookingMobile)) {
            return "DASHBOARD";
        }

        // Fallback
        const currentUrl = this.page.url();
        console.log(`[Location]: UNKNOWN_STATE (${currentUrl})`);
        return "UNKNOWN_STATE";
    }

    /**
     * Example method for future DOM interaction.
     */
    async clickElement(selector) {
        if (!this.page) throw new Error("Browser page is not initialized.");
        await this.page.waitForSelector(selector);
        await this.page.click(selector);
    }

    /**
     * Safely closes the specific browser instance managed by this class.
     */


    /**
     * Injects the Tampermonkey script and its required polyfills into the active page.
     * @param {string} relativePath - The path to the customer_script.js file.
     */
    async injectCustomerScript(relativePath) {
        if (!this.page) {
            this.errors = {"injection": "[Worker] Cannot inject script: Page not initialized."};
            return;
        }

        try {
            this.operationalStatus.push("[Worker] Injecting polyfills and script...");
            
            // 1. Inject Polyfills for Tampermonkey GM_ functions
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

            // 2. Read the script file from your system
            await this.acceptCookies();
            const absolutePath = path.resolve(process.cwd(), relativePath);
            const scriptContent = fs.readFileSync(absolutePath, 'utf-8');
            
            // 3. Inject the script content into the page
            await this.page.addScriptTag({ content: scriptContent });
            
            console.log(`[Worker] Script successfully injected: ${relativePath}`);
        } catch (error) {
            console.error(`[Worker] Script injection failed: ${error.message}`);
        }
    }
/**
     * Checks for the cookie banner and clicks the "Accept All Cookies" button if it appears.
     */
    async acceptCookies() {
        if (!this.page) return;

        this.operationalStatus.push("[Worker] Checking for cookie banner...");
        
        try {
            const acceptSelectors = Selectors.common.cookieBanner.acceptButton;

            for (const selector of acceptSelectors) {
                try {
                    // Wait up to 4 seconds for the button to become visible in the DOM
                    const button = await this.page.waitForSelector(selector, { timeout: 4000, visible: true });
                    if (button) {
                        await button.click();
                        this.operationalStatus.push(`[Worker] Cookie banner accepted using selector: ${selector}`);
                        
                        // Give the UI 1 second to fade out the banner overlay
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        return; 
                    }
                } catch (err) {
                    // If this specific selector times out, silently continue to the next fallback
                    continue;
                }
            }
            
            this.operationalStatus.push("[Worker] Cookie banner not found or already accepted.");
        } catch (error) {
            this.operationalStatus.push("[Worker] Error handling cookie banner: " + error.message);
        }
    }
    async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
            
            this.browser = null;
            this.page = null;
            console.log("[Worker] Browser closed.");
        }
    }

    /**
     * Closes the browser and exits the readline interface.
     */
    terminate(){
        this.closeBrowser();
        rl.close();
    }
}

// Example Execution
if (import.meta.main) {
    // Easily scale to multiple instances by instantiating new objects
    const worker1 = new ChromeWorker({ headless: false });
    await worker1.launchBrowser();
    
    let terminate = false;
    while(!terminate){
        console.log(await worker1.getCurrentLocation());
        const answer = await rl.question("VFS-bot:) ");
        
        let command = answer.trim().toLocaleLowerCase();
        if(terminationCmds.includes(command)){
            console.log("Exiting...");
            worker1.terminate();
            terminate = true; 
        }
    }
}