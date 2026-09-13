/* Omni-Booking-Automation-Suite/VFS_Portugal/Browsers/chrome.js */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { EgPtrLoginURL, BROWSER_ARGS, CHANNEL, terminationCmds, debug, actionsConfig, cookiesAcceptant, defaultBatchConfig } from '../Config/settings.js';
import Selectors from '../Config/Selectors.js';
import { BaseBrowser } from './BaseBrowser.js';
import { CaptchaHandler } from './captchaHandler.js';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({ input, output });
puppeteer.use(StealthPlugin());

export class ChromeWorker extends BaseBrowser {
    constructor({ headless = false, targetUrl = EgPtrLoginURL, email, password, instanceData } = {}) {
        super();
        this.targetUrl = targetUrl;
        this.headless = headless;
        this.channel = CHANNEL;
        this.browserArgs = BROWSER_ARGS;

        this.email = email;
        this.password = password;

        // Apply GUI Hot Batch data, falling back to global settings defaults if fields are empty
        this.instanceData = {
            city: instanceData?.city || defaultBatchConfig.city,
            appointmentCategory: instanceData?.appointmentCategory || defaultBatchConfig.appointmentCategory,
            subCategory: instanceData?.subCategory || defaultBatchConfig.subCategory
        };

        this.isOrchestratorRunning = false;
        this.captchaHandler = new CaptchaHandler(this);
        this.lastDeferLogTime = 0;
        this.completedActivities = new Set();
        this.activitysQueue = [];

        this.mappedActions = {
            cookies: {
                priority: actionsConfig.cookies.priority,
                startDelay: actionsConfig.cookies.startDelay,
                endDelay: actionsConfig.cookies.endDelay,
                dependencies: [],
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
                dependencies: [],
                method: async () => {
                    await this.signIn();
                    this.completedActivities.add('signIn');
                }
            },
            dashboard: {
                priority: actionsConfig.dashboard.priority,
                startDelay: actionsConfig.dashboard.startDelay,
                endDelay: actionsConfig.dashboard.endDelay,
                dependencies: ['signIn'],
                method: async () => {
                    this.logStatus("[Dashboard] Executing external click on 'Start New Booking'...");
                    await this.clickByDescriptor(Selectors.dashboard.startNewBooking);
                    this.completedActivities.add('dashboard');
                }
            },
            appointmentDetails: {
                priority: actionsConfig.appointmentDetails.priority,
                startDelay: actionsConfig.appointmentDetails.startDelay,
                endDelay: actionsConfig.appointmentDetails.endDelay,
                dependencies: ['dashboard'],
                method: async () => {
                    await this.injectSmartFormFiller(this.instanceData);
                    this.completedActivities.add('appointmentDetails');
                }
            }
        };
        this.currentOrderedDom = [];
    }

    async launchBrowser() {
        try {
            this.logStatus(`[Worker] Launching browser (Headless: ${this.headless})...`);

            const activeArgs = this.headless 
                ? this.browserArgs.filter(arg => arg !== '--start-maximized') 
                : this.browserArgs;

            this.browser = await puppeteer.launch({
                headless: this.headless ? 'new' : false, 
                channel: this.channel ? this.channel : undefined,
                defaultViewport: null,
                args: activeArgs
            });

            const pages = await this.browser.pages();
            this.page = pages.length > 0 ? pages[0] : await this.browser.newPage();

            await this.page.setBypassCSP(true);

            // =====================================================================
            // Module 1: Continuous Page Title Modifier
            // =====================================================================
            // This script is evaluated natively inside the browser on every single page load.
            await this.page.evaluateOnNewDocument((accountEmail) => {
                const prefix = `[${accountEmail}] `;
                
                // Aggressive loop to bypass Angular's internal title router service
                setInterval(() => {
                    if (document.title && !document.title.startsWith(prefix)) {
                        // Strip existing bracketed tags to avoid nested prefix duplication
                        const cleanTitle = document.title.replace(/^\[.*?\]\s*/, '');
                        document.title = prefix + cleanTitle;
                    }
                }, 500); // 500ms guarantees the title is overridden immediately
            }, this.email);

            this.logStatus("[Worker] Navigating to target portal...");
            await this.page.goto(this.targetUrl, { waitUntil: 'domcontentloaded' });
            this.logStatus("[Worker] Page loaded successfully.");

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

        // Detect Dashboard view based on the presence of the Start New Booking button
        if (await this.isPresent(Selectors.dashboard.startNewBooking)) {
            detected.push('dashboard');
        }
        
        // Detect Appointment Details view based on the presence of the Angular center dropdown
        if (await this.isPresent(Selectors.appointmentDetails.centerDropdown)) {
            detected.push('appointmentDetails');
        }

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
            const allDependenciesMet = dependencies.every(dep => this.completedActivities.has(dep));
            const now = Date.now();
            
            if (!allDependenciesMet) {
                if (now - this.lastDeferLogTime >= 10000) {
                    this.logStatus(`[Orchestrator] ⏸️ Deferring [${actionKey}] - Waiting on dependencies: ${dependencies.join(', ')}`);
                    this.lastDeferLogTime = now;
                }
                return false;
            }
            return true;
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
                    await new Promise(r => setTimeout(r, 500));
                    continue;
                }

                const currentActionKey = this.activitysQueue[0];
                const actionMeta = this.mappedActions[currentActionKey];

                if (actionMeta && typeof actionMeta.method === 'function') {
                    if (actionMeta.startDelay > 0) await new Promise(r => setTimeout(r, actionMeta.startDelay));
                    
                    this.logStatus(`[Orchestrator] Executing action: [${currentActionKey}]`);
                    await actionMeta.method();

                    if (actionMeta.endDelay > 0) await new Promise(r => setTimeout(r, actionMeta.endDelay));
                } else {
                    await new Promise(r => setTimeout(r, 500));
                }

                await new Promise(r => setTimeout(r, 500));

            } catch (error) {
                this.logError("orchestrator", `Loop Error: ${error.message}`);
                await new Promise(r => setTimeout(r, 1000));
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

    // =====================================================================
    // Module 2: Smart Angular DOM Automator
    // =====================================================================
    /**
     * Injects an execution block directly into the page context to handle Angular dropdowns.
     * This relies strictly on element innerText parsing to map the Hot Batch config to the UI options.
     */
    async injectSmartFormFiller(config) {
        this.logStatus("[Appointment Details] Injecting smart Angular form logic...");
        
        try {
            await this.page.evaluate(async (cfg) => {
                
                // Utility to pause script execution without blocking the main browser thread
                const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

                // Helper to pause execution while the VFS Angular spinner overlay is visible
                const waitForLoader = async () => {
                    let loader = document.querySelector('ngx-ui-loader .ngx-overlay');
                    // Check if loader exists and is currently rendered on screen
                    while (loader && window.getComputedStyle(loader).display !== 'none' && loader.offsetHeight > 0) {
                        await sleep(500);
                        loader = document.querySelector('ngx-ui-loader .ngx-overlay');
                    }
                };

                /**
                 * Interacts with an Angular Material select element by matching internal text.
                 * @param {string} controlName - The exact 'formcontrolname' attribute of the target dropdown.
                 * @param {string} targetText - The specific string to search for within the dropdown options.
                 * @returns {boolean} - Returns true if the option is found and clicked, or if it is already selected.
                 */
                const selectDropdownByText = async (controlName, targetText) => {
                    // Bypass interaction safely if the user did not provide a configuration value
                    if (!targetText || targetText.trim() === '') return true; 
                    
                    const trigger = document.querySelector(`mat-select[formcontrolname="${controlName}"]`);
                    if (!trigger) return false;

                    // 1. Verify if the target value is already the active selection
                    const selectedValueSpan = trigger.querySelector('.mat-mdc-select-value-text');
                    if (selectedValueSpan && selectedValueSpan.innerText.toLowerCase().includes(targetText.toLowerCase())) {
                        return true; 
                    }

                    // Wait for any previous API calls to finish before clicking
                    await waitForLoader();

                    // 2. Dispatch a click event to render the CDK overlay panel containing the options
                    trigger.click();
                    await sleep(800); // Allow Angular animation to render the DOM elements

                    // 3. Locate the dynamically injected overlay panel
                    const panelId = trigger.getAttribute('aria-controls');
                    const panel = document.getElementById(panelId) || document.querySelector('.mat-mdc-select-panel');
                    
                    if (!panel) return false;

                    // 4. Retrieve all available options and filter them via innerText mapping
                    const options = Array.from(panel.querySelectorAll('mat-option'));
                    const targetOption = options.find(opt => 
                        opt.innerText && opt.innerText.toLowerCase().includes(targetText.toLowerCase())
                    );

                    if (targetOption) {
                        targetOption.click();
                        await sleep(500); 
                        await waitForLoader(); // Ensure the backend sync finishes before proceeding
                        return true;
                    } else {
                        // Click outside to collapse the panel if no matching text is discovered
                        document.body.click(); 
                        await sleep(500);
                        return false;
                    }
                };

                // Sequential Execution Pipeline: Ensure strict chronological execution of dependent dropdowns
                const isCityDone = await selectDropdownByText('centerCode', cfg.city);
                if (isCityDone) {
                    const isCatDone = await selectDropdownByText('selectedSubvisaCategory', cfg.appointmentCategory);
                    if (isCatDone) {
                        const isSubCatDone = await selectDropdownByText('visaCategoryCode', cfg.subCategory);
                        
                        // Proceed to submit the form once all parameters are successfully mapped
                        if (isSubCatDone) {
                            const continueBtn = Array.from(document.querySelectorAll('button')).find(b => 
                                b.innerText && b.innerText.includes('Continue')
                            );
                            if (continueBtn && !continueBtn.disabled) {
                                continueBtn.click();
                            }
                        }
                    }
                }

            }, config);

            this.logStatus("[Appointment Details] ✅ Form configuration dynamically injected and executed.");

        } catch (error) {
            this.logError("appointmentDetails", `Smart injection execution failed: ${error.message}`);
        }
    }

    terminate() {
        this.isOrchestratorRunning = false;
        this.closeBrowser();
        rl.close();
    }
}