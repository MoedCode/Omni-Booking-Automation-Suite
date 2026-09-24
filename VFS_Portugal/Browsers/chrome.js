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

        this.instanceData = {
            city: instanceData?.city || defaultBatchConfig.city,
            appointmentCategory: instanceData?.appointmentCategory || defaultBatchConfig.appointmentCategory,
            subCategory: instanceData?.subCategory || defaultBatchConfig.subCategory
        };
        
        // Loop State & Constraints
        this.currentAttempt = 1;
        this.maxAttempts = parseInt(instanceData?.attempts) || defaultBatchConfig.attempts;
        this.attemptDelayStr = instanceData?.attemptDelay || defaultBatchConfig.attemptDelay;
        
        this.switches = parseInt(instanceData?.switches) || defaultBatchConfig.switches;
        this.switchDelay = parseInt(instanceData?.switchDelay) || defaultBatchConfig.switchDelay;

        // New End/Separator settings
        this.autoClose = instanceData?.autoClose ?? defaultBatchConfig.autoClose;
        this.attemptSeparator = instanceData?.attemptSeparator || defaultBatchConfig.attemptSeparator;

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
                    let isAvailable = false;
                    let currentSwitch = 0;
                    const maxSwitches = this.switches;

                    // Execute sub-category switching loop
                    while (currentSwitch < maxSwitches) {
                        currentSwitch++;
                        this.logStatus(`[Switch ${currentSwitch}/${maxSwitches}] Checking target criteria...`);

                        const formFilled = await this.injectSmartFormFiller(this.instanceData);
                        if (!formFilled) {
                            this.logWarning("appointmentDetails", "Form filling aborted or failed.");
                            break;
                        }

                        const status = await this.checkAppointmentAvailability();
                        if (status === 'available') {
                            isAvailable = true;
                            break; // Stop switching immediately
                        }

                        // If NOT available and we have more switches requested
                        if (currentSwitch < maxSwitches) {
                            this.logStatus(`[Switch] Waiting ${this.switchDelay}ms before randomly changing sub-category...`);
                            await new Promise(r => setTimeout(r, this.switchDelay));
                            
                            // Select a random alternate sub-category to reset Angular state
                            await this.page.evaluate(async (cfg) => {
                                const sleep = ms => new Promise(res => setTimeout(res, ms));
                                const trigger = document.querySelector(`mat-select[formcontrolname="visaCategoryCode"]`);
                                if (trigger) {
                                    trigger.click();
                                    await sleep(800);
                                    const panelId = trigger.getAttribute('aria-controls');
                                    const panel = document.getElementById(panelId) || document.querySelector('.mat-mdc-select-panel');
                                    if (panel) {
                                        const options = Array.from(panel.querySelectorAll('mat-option'));
                                        const otherOpts = options.filter(opt => opt.innerText && !opt.innerText.toLowerCase().includes(cfg.subCategory.toLowerCase()));
                                        if (otherOpts.length > 0) {
                                            otherOpts[Math.floor(Math.random() * otherOpts.length)].click();
                                            await sleep(800);
                                            let loader = document.querySelector('ngx-ui-loader .ngx-overlay');
                                            while (loader && window.getComputedStyle(loader).display !== 'none' && loader.offsetHeight > 0) {
                                                await sleep(500);
                                                loader = document.querySelector('ngx-ui-loader .ngx-overlay');
                                            }
                                        } else {
                                            document.body.click();
                                            await sleep(500);
                                        }
                                    }
                                }
                            }, this.instanceData);
                            
                            this.logStatus(`[Switch] Waiting ${this.switchDelay}ms before returning to target...`);
                            await new Promise(r => setTimeout(r, this.switchDelay));
                        }
                    }

                    if (isAvailable) {
                        this.completedActivities.add('appointmentDetails');
                        this.logStatus(`[Success] 🚨 TARGET AVAILABLE! Bringing browser window on-screen...`);
                        
                        // Dynamically pull the browser onto the screen if it was running headlessly
                        if (this.headless) {
                            await this.bringWindowOnScreen();
                        }

                        this.isOrchestratorRunning = false; // Freeze bot, wait for user
                        return; 
                    }

                    // No appointment found after all switches.
                    // Random 1 to 2 second human delay before signing out
                    const humanDelay = Math.floor(Math.random() * 1000) + 1000;
                    this.logStatus(`[No Appointment] Mimicking human wait for ${humanDelay}ms...`);
                    await new Promise(r => setTimeout(r, humanDelay));

                    // Check full Attempts loop
                    if (this.currentAttempt < this.maxAttempts) {
                        this.currentAttempt++;
                        const parsedDelay = this.parseAttemptDelay(this.attemptDelayStr);
                        
                        this.logStatus(`[Attempt Complete] Waiting ${parsedDelay}ms before next attempt...`);
                        await new Promise(r => setTimeout(r, parsedDelay));

                        // Execute Separator Behavior
                        const sep = (this.attemptSeparator || '').toLowerCase();
                        this.completedActivities.delete('signIn');
                        this.completedActivities.delete('dashboard');

                        if (sep === 'refresh current page') {
                            this.logStatus(`[Attempt ${this.currentAttempt}/${this.maxAttempts}] Refreshing page...`);
                            await this.page.reload({ waitUntil: 'domcontentloaded' });
                            
                        } else if (sep === 'log out and restart') {
                            await this.performSignOut();
                            this.logStatus(`[Attempt ${this.currentAttempt}/${this.maxAttempts}] Restarting browser engine...`);
                            this.isOrchestratorRunning = false; 
                            await this.closeBrowser();
                            
                            // Start new browser asynchronously and safely drop this thread
                            this.launchBrowser().catch(e => this.logError('restart', e.message));
                            return; 
                            
                        } else if (sep === 'restart window') {
                            this.logStatus(`[Attempt ${this.currentAttempt}/${this.maxAttempts}] Restarting browser engine...`);
                            this.isOrchestratorRunning = false; 
                            await this.closeBrowser();
                            
                            // Start new browser asynchronously and safely drop this thread
                            this.launchBrowser().catch(e => this.logError('restart', e.message));
                            return; 
                        } else {
                            // Default Fallback
                            this.logStatus(`[Attempt ${this.currentAttempt}/${this.maxAttempts}] Refreshing page...`);
                            await this.page.reload({ waitUntil: 'domcontentloaded' });
                        }
                    } else {
                        // Max attempts reached
                        if (this.autoClose) {
                            this.logStatus(`[Finished] Max attempts reached. Auto-closing browser.`);
                            await this.performSignOut();
                            this.terminate();
                        } else {
                            this.logStatus(`[Finished] Max attempts reached. Auto-close disabled. Session parked.`);
                            this.isOrchestratorRunning = false; 
                        }
                    }
                }
            }
        };
        this.currentOrderedDom = [];
    }

    /**
     * Resizes and moves the simulated headless browser to the center of the active monitor.
     * Uses explicit coordinates to break Windows OS off-screen positional locks.
     */
    async bringWindowOnScreen() {
        if (!this.page || !this.browser) return;
        try {
            const session = await this.page.target().createCDPSession();
            const { windowId } = await session.send('Browser.getWindowForTarget');
            
            // 1. Force the state to 'normal' first to unstick it from off-screen max/min bounds
            await session.send('Browser.setWindowBounds', {
                windowId,
                bounds: { windowState: 'normal' }
            });
            await new Promise(r => setTimeout(r, 200));

            // 2. Explicitly teleport the window to a fully visible coordinate on the primary monitor
            await session.send('Browser.setWindowBounds', {
                windowId,
                bounds: { left: 50, top: 50, width: 1300, height: 900 }
            });
            await new Promise(r => setTimeout(r, 200));
            
            // 3. Force maximize to snap it cleanly to the screen
            await session.send('Browser.setWindowBounds', {
                windowId,
                bounds: { windowState: 'maximized' }
            });

            await this.page.bringToFront();
            this.headless = false; // Sync internal state
            this.logStatus("[Display] 🖥️ Brought browser window on-screen.");
        } catch (e) {
            this.logWarning("display", "Could not bring window on-screen: " + e.message);
        }
    }

    parseAttemptDelay(delayStr) {
        if (!delayStr) return 0;
        // Standardizes dd/hh/mm/ss. Reverses array so index: 0=secs, 1=mins, 2=hrs, 3=days
        const parts = String(delayStr).split(/[\/\-:]/).map(n => parseInt(n) || 0).reverse();
        let ms = 0;
        if (parts[0]) ms += parts[0] * 1000; // seconds
        if (parts[1]) ms += parts[1] * 60000; // minutes
        if (parts[2]) ms += parts[2] * 3600000; // hours
        if (parts[3]) ms += parts[3] * 86400000; // days
        return ms;
    }

    async launchBrowser() {
        try {
            this.logStatus(`[Worker] Launching browser (Invisible Mode: ${this.headless})...`);

            let activeArgs = this.browserArgs.filter(arg => arg !== '--start-maximized');

            if (this.headless) {
                activeArgs.push('--window-position=-32000,-32000'); 
                activeArgs.push('--window-size=1920,1080'); 
            } else {
                activeArgs.push('--start-maximized'); 
            }

            this.browser = await puppeteer.launch({
                headless: false, 
                channel: this.channel ? this.channel : undefined,
                defaultViewport: null, 
                args: activeArgs
            });

            const pages = await this.browser.pages();
            this.page = pages.length > 0 ? pages[0] : await this.browser.newPage();

            await this.page.setBypassCSP(true);

            await this.page.evaluateOnNewDocument((accountEmail) => {
                const prefix = `[${accountEmail}] `;
                
                const enforcePageTitle = () => {
                    if (document.title && !document.title.startsWith(prefix)) {
                        const cleanTitle = document.title.replace(/^\[.*?\]\s*/, '');
                        document.title = prefix + cleanTitle;
                    }
                };

                window.addEventListener('DOMContentLoaded', () => {
                    enforcePageTitle();
                    const titleElement = document.querySelector('title');
                    if (titleElement) {
                        new MutationObserver(enforcePageTitle).observe(titleElement, { childList: true, characterData: true, subtree: true });
                    }
                });
                
                setInterval(enforcePageTitle, 1000);
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

        if (await this.isPresent(Selectors.common.cookieBanner.container)) detected.push('cookies');
        if (await this.captchaHandler.isPresent()) {
            if (!(await this.captchaHandler.isResolved())) detected.push('captcha');
        }
        if (await this.isPresent(Selectors.signIn.email)) detected.push('signIn');
        if (await this.isPresent(Selectors.dashboard.startNewBooking)) detected.push('dashboard');
        if (await this.isPresent(Selectors.appointmentDetails.centerDropdown)) detected.push('appointmentDetails');

        detected.sort((a, b) => (this.mappedActions[a]?.priority ?? 99) - (this.mappedActions[b]?.priority ?? 99));
        this.currentOrderedDom = [...detected];
        return this.currentOrderedDom;
    }

    cordinateActivitysQueue(scannedActions) {
        this.activitysQueue = scannedActions.filter(actionKey => {
            const dependencies = this.mappedActions[actionKey]?.dependencies || [];
            if (!dependencies.every(dep => this.completedActivities.has(dep))) {
                if (Date.now() - this.lastDeferLogTime >= 10000) {
                    this.logStatus(`[Orchestrator] ⏸️ Deferring [${actionKey}] - Waiting on dependencies...`);
                    this.lastDeferLogTime = Date.now();
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
        if (!email || !password) {
            this.isOrchestratorRunning = false;
            return;
        }

        this.logStatus(`[Worker] Entering credentials for: ${email}`);

        try {
            await this.typeByDescriptor(Selectors.signIn.email, email);
            await this.typeByDescriptor(Selectors.signIn.password, password);

            if (await this.captchaHandler.isPresent()) {
                if (!(await this.captchaHandler.isResolved())) {
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

    async performSignOut() {
        try {
            this.logStatus("[SignOut] Executing secure sign out...");
            await this.page.evaluate(() => {
                const navDropdown = document.querySelector('#navbarDropdown');
                if (navDropdown) navDropdown.click();
            });
            await new Promise(r => setTimeout(r, 800));
            
            await this.page.evaluate(() => {
                const links = Array.from(document.querySelectorAll('a'));
                const signout = links.find(l => l.innerText.includes('Sign Out') || l.innerText.includes('Logout'));
                if (signout) signout.click();
            });
            await new Promise(r => setTimeout(r, 2000));
            this.logStatus("[SignOut] ✅ Signed out successfully.");
        } catch (e) {
            this.logWarning("signout", "Could not cleanly sign out: " + e.message);
        }
    }

    async injectSmartFormFiller(config) {
        this.logStatus("[Appointment Details] Mapping Target Criteria...");
        
        try {
            return await this.page.evaluate(async (cfg) => {
                const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

                const waitForLoader = async () => {
                    let loader = document.querySelector('ngx-ui-loader .ngx-overlay');
                    while (loader && window.getComputedStyle(loader).display !== 'none' && loader.offsetHeight > 0) {
                        await sleep(500);
                        loader = document.querySelector('ngx-ui-loader .ngx-overlay');
                    }
                };

                const selectDropdownByText = async (controlName, targetText) => {
                    if (!targetText || targetText.trim() === '') return true; 
                    
                    const trigger = document.querySelector(`mat-select[formcontrolname="${controlName}"]`);
                    if (!trigger) return false;

                    const selectedValueSpan = trigger.querySelector('.mat-mdc-select-value-text');
                    if (selectedValueSpan && selectedValueSpan.innerText.toLowerCase().includes(targetText.toLowerCase())) {
                        return true; 
                    }

                    await waitForLoader();
                    trigger.click();
                    await sleep(800); 

                    const panelId = trigger.getAttribute('aria-controls');
                    const panel = document.getElementById(panelId) || document.querySelector('.mat-mdc-select-panel');
                    
                    if (!panel) return false;

                    const options = Array.from(panel.querySelectorAll('mat-option'));
                    const targetOption = options.find(opt => 
                        opt.innerText && opt.innerText.toLowerCase().includes(targetText.toLowerCase())
                    );

                    if (targetOption) {
                        targetOption.click();
                        await sleep(500); 
                        await waitForLoader(); 
                        return true;
                    } else {
                        document.body.click(); 
                        await sleep(500);
                        return false;
                    }
                };

                const isCityDone = await selectDropdownByText('centerCode', cfg.city);
                if (isCityDone) {
                    const isCatDone = await selectDropdownByText('selectedSubvisaCategory', cfg.appointmentCategory);
                    if (isCatDone) {
                        return await selectDropdownByText('visaCategoryCode', cfg.subCategory);
                    }
                }
                return false;

            }, config);

        } catch (error) {
            this.logError("appointmentDetails", `Smart injection execution failed: ${error.message}`);
            return false;
        }
    }

    async checkAppointmentAvailability() {
        this.logStatus("[Scanner] Awaiting appointment availability result...");
        
        try {
            const result = await this.page.evaluate(() => {
                return new Promise((resolve) => {
                    let attempts = 0;
                    
                    const interval = setInterval(() => {
                        attempts++;
                        if (attempts > 120) {
                            clearInterval(interval);
                            resolve({ status: 'timeout', message: 'Evaluation timed out.' });
                            return;
                        }

                        const alertBox = document.querySelector('div[role="alert"]');
                        if (alertBox && alertBox.offsetHeight > 0) {
                            const text = (alertBox.textContent || alertBox.innerText || '').toLowerCase();
                            
                            // Check explicit negative phrases
                            if (text.includes('no appointment') || text.includes('sorry') || text.includes('try again')) {
                                clearInterval(interval);
                                resolve({ status: 'unavailable', message: text.trim() });
                                return;
                            }
                            
                            // Explicit check for known positive string from VFS
                            if (text.includes('earliest available slot')) {
                                const buttons = Array.from(document.querySelectorAll('button'));
                                const continueBtn = buttons.find(b => (b.textContent || '').includes('Continue'));
                                if (continueBtn && !continueBtn.disabled && continueBtn.offsetHeight > 0) {
                                    clearInterval(interval);
                                    continueBtn.click();
                                    resolve({ status: 'available', message: text.trim() });
                                    return;
                                }
                            }
                        }

                        // Fallback: If no alert box is found but the Continue button is active
                        const buttons = Array.from(document.querySelectorAll('button'));
                        const continueBtn = buttons.find(b => (b.textContent || '').includes('Continue'));
                        if (continueBtn && !continueBtn.disabled && continueBtn.offsetHeight > 0 && !document.querySelector('ngx-ui-loader .ngx-overlay')) {
                            clearInterval(interval);
                            continueBtn.click(); 
                            resolve({ status: 'available', message: 'Proceeding to Your Details phase.' });
                            return;
                        }
                    }, 500); 
                });
            });
            
            // Return status manually string mapped so the upper loop handles logic seamlessly
            if (result.status === 'unavailable') {
                this.logStatus(`[Result] 🚫 ${result.message}`);
                if (typeof this.onAppointmentResult === 'function') this.onAppointmentResult('unavailable');
                return 'unavailable';
            } else if (result.status === 'available') {
                this.logStatus(`[Result] ✅ Appointments found! ${result.message}`);
                if (typeof this.onAppointmentResult === 'function') this.onAppointmentResult('available');
                return 'available';
            } else {
                this.logStatus(`[Result] ⏳ Timeout waiting for availability.`);
                if (typeof this.onAppointmentResult === 'function') this.onAppointmentResult('idle');
                return 'timeout';
            }
        } catch (e) {
            this.logStatus(`[Result] ⏳ Error reading availability: ${e.message}`);
            if (typeof this.onAppointmentResult === 'function') this.onAppointmentResult('idle');
            return 'error';
        }
    }

    terminate() {
        this.isOrchestratorRunning = false;
        this.closeBrowser();
        rl.close();
    }
}