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
            signIn: {
                priority: actionsConfig.signIn.priority,
                startDelay: actionsConfig.signIn.startDelay,
                endDelay: actionsConfig.signIn.endDelay,
                dependencies: [], // Captcha handles itself dynamically, but you could add it here if preferred
                method: this.signIn.bind(this)
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

        if (await this.isPresent(Selectors.common.cookieBanner.container)) detected.push('cookies');
        
        if (await this.captchaHandler.isPresent()) {
            if (!(await this.captchaHandler.isResolved())) detected.push('captcha');
        }

        if (await this.isPresent(Selectors.signIn.email)) detected.push('signIn');
        
        // Example injection detection: If we are not on the login page, or a target element is present
        const isScriptInjected = await this.page.evaluate(() => typeof window.GM_setValue !== 'undefined').catch(() => false);
        if (!isScriptInjected) detected.push('injection');

        // Sort purely by priority
        detected.sort((a, b) => {
            const prioA = this.mappedActions[a]?.priority ?? actionsConfig.default.priority;
            const prioB = this.mappedActions[b]?.priority ?? actionsConfig.default.priority;
            return prioA - prioB;
        });

        return detected;
    }
    cordinateActivitysQueue(scannedActions) {
        this.activitysQueue = scannedActions.filter(actionKey => {
            const dependencies = this.mappedActions[actionKey]?.dependencies || [];
            
            // Check if every dependency for this action exists in the completed tracker
            const allDependenciesMet = dependencies.every(dep => this.completedActivities.has(dep));
            
            if (!allDependenciesMet) {
                if (debug?.operationalStatus) {
                    console.log(`[Orchestrator] ⏸️ Deferring [${actionKey}] - Waiting on dependencies: ${dependencies.join(', ')}`);
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
                // 1. Scan the DOM for what is present (Sorted by Priority)
                const scannedActions = await this.domScanner();

                // 2. Filter out actions that are waiting on dependencies
                this.cordinateActivitysQueue(scannedActions);

                if (this.activitysQueue.length === 0) {
                    Bun.sleepSync(actionsConfig.default.startDelay);
                    continue;
                }

                // 3. Execute the top approved action
                const currentActionKey = this.activitysQueue[0];
                const actionMeta = this.mappedActions[currentActionKey];

                if (actionMeta && typeof actionMeta.method === 'function') {
                    if (actionMeta.startDelay > 0) Bun.sleepSync(actionMeta.startDelay);
                    
                    this.logStatus(`[Orchestrator] Executing action: [${currentActionKey}]`);
                    
                    await actionMeta.method();

                    if (actionMeta.endDelay > 0) Bun.sleepSync(actionMeta.endDelay);
                } else {
                    Bun.sleepSync(actionsConfig.default.startDelay);
                }

                Bun.sleepSync(actionsConfig.default.endDelay);

            } catch (error) {
                this.logError("orchestrator", `Loop Error: ${error.message}`);
                Bun.sleepSync(actionsConfig.default.startDelay);
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