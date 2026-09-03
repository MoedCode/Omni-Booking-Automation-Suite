/* Omni-Booking-Automation-Suite/VFS_Portugal/Browsers/chrome.js */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { EgPtrLoginURL, BROWSER_ARGS, CHANNEL, terminationCmds, debug, processPriority, cookiesAcceptant } from '../Config/settings.js';
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

            await this.injection('./customer_script.js');
            this.startOrchestrator();

        } catch (error) {
            this.logError("initialization", `Initialization Error: ${error.message}`);
        }
    }

    async domScanner() {
        if (!this.page) return ['uninitialized'];
        const states = [];

        // Now correctly scans for the Cookie Container visibility
        if (await this.isPresent(Selectors.common.cookieBanner.container)) {
            states.push('cookies');
        }

        if (await this.captchaHandler.isPresent()) {
            const resolved = await this.captchaHandler.isResolved();
            if (!resolved) states.push('captcha');
        }

        if (await this.isPresent(Selectors.signIn.email)) {
            states.push('signIn');
        }

        if (await this.isPresent(Selectors.dashboard.startNewBooking)) {
            states.push('dashboard');
        }

        if (states.length === 0) states.push('unknown');
        return states;
    }

    async startOrchestrator() {
        this.isOrchestratorRunning = true;
        this.logStatus("[Orchestrator] Dynamic state loop started.");

        while (this.isOrchestratorRunning && this.page) {
            try {
                const activeStates = await this.domScanner();

                activeStates.sort((a, b) => {
                    const prioA = processPriority[a] ?? 999;
                    const prioB = processPriority[b] ?? 999;
                    return prioA - prioB;
                });

                const primaryAction = activeStates[0];

                switch (primaryAction) {
                    case 'cookies':
                        await this.cookiesHandler();
                        break;
                    case 'captcha':
                        await this.captchaHandler.resolve();
                        break;
                    case 'signIn':
                        await this.signIn();
                        break;
                    case 'dashboard':
                        this.logStatus("[Orchestrator] Dashboard active. Awaiting bookings pipeline...");
                        await new Promise(r => setTimeout(r, 10000));
                        break;
                    case 'unknown':
                    default:
                        await new Promise(r => setTimeout(r, 3000));
                        break;
                }

                await new Promise(r => setTimeout(r, 1500));

            } catch (error) {
                this.logError("orchestrator", `Loop Error: ${error.message}`);
                await new Promise(r => setTimeout(r, 2000));
            }
        }
    }

    /**
     * Resolves the cookies settings based on variables injected from Setting.js.
     */
    async cookiesHandler() {
        this.logStatus("[Worker] Processing cookies based on preferences...");
        try {
            const pref = (cookiesAcceptant || 'All').toLowerCase();
            
            // Decides which semantic descriptor to use dynamically
            const descriptor = (pref.includes('necessary') || pref.includes('only') || pref === 'reject') 
                ? Selectors.common.cookieBanner.rejectButton 
                : Selectors.common.cookieBanner.acceptButton;

            await this.clickByDescriptor(descriptor);
            this.logStatus(`[Worker] ✅ Cookies preference applied.`);
            
            // Give Angular a moment to fade the cookie overlay out so it doesn't block interactions
            await new Promise(r => setTimeout(r, 1500));
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
                this.page.evaluate(b => b.click(), btn) // Enforce native click
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
            this.logStatus(`[Worker] Extension script injected: ${relativePath}`);
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
    const worker1 = new ChromeWorker({
        headless: false,
        email: "sirmohamedh@gmail.com",
        password: "Moed!vsfG@26"
    });

    await worker1.launchBrowser();

    let terminate = false;
    while (!terminate) {
        const answer = await rl.question("VFS-bot:) ");
        const command = answer.trim().toLowerCase();

        if (terminationCmds.includes(command)) {
            console.log("Shutting down bot...");
            worker1.terminate();
            terminate = true;
        }
    }
}