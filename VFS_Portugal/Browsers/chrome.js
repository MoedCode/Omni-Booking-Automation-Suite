/* Omni-Booking-Automation-Suite/VFS_Portugal/Browsers/chrome.js */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { EgPtrLoginURL, BROWSER_ARGS, CHANNEL, terminationCmds, debug, actionsConfig, cookiesAcceptant, defaultBatchConfig } from '../Config/settings.js';
import Selectors from '../Config/Selectors.js';
import { injectionSignIn, fillYourDetails, signInSelectors } from './injection.js';
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

const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export class ChromeWorker extends BaseBrowser {
    constructor({ headless = false, targetUrl = EgPtrLoginURL, email, password, instanceData, inputMethod } = {}) {
        super();
        this.targetUrl = targetUrl;
        this.headless = headless;
        this.channel = CHANNEL;
        this.browserArgs = BROWSER_ARGS;

        this.email = email;
        this.password = password;

        // BUGFIX: the old code kept only city/appointmentCategory/subCategory, so firstName, lastName,
        // dateOfBirth, passportNumber, ... never reached fillYourDetails. Merge everything; blank values
        // fall back to defaultBatchConfig.
        const mergedData = { ...defaultBatchConfig };
        for (const [k, v] of Object.entries(instanceData || {})) {
            if (v !== undefined && v !== null && String(v).trim() !== '') mergedData[k] = v;
        }
        if (!mergedData.account) mergedData.account = email; // contact email falls back to the login email
        this.instanceData = mergedData;
        
        // Loop State & Constraints
        this.currentAttempt = 1;
        this.maxAttempts = parseInt(instanceData?.attempts) || defaultBatchConfig.attempts;
        this.attemptDelayStr = instanceData?.attemptDelay || defaultBatchConfig.attemptDelay;
        
        this.switches = parseInt(instanceData?.switches) || defaultBatchConfig.switches;
        this.switchDelay = parseInt(instanceData?.switchDelay) || defaultBatchConfig.switchDelay;

        // New End/Separator settings
        this.autoClose = instanceData?.autoClose ?? defaultBatchConfig.autoClose;
        this.attemptSeparator = instanceData?.attemptSeparator || defaultBatchConfig.attemptSeparator;
        this.inputMethod = inputMethod || instanceData?.inputMethod || instanceData?.fillMode || instanceData?.typingMode || defaultBatchConfig.fillMode || 'fill';

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
                    await this.signIn(this.email, this.password, this.inputMethod);
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
                    // Already succeeded: Continue was clicked, wait for the router to reach Your Details.
                    // If the page is still here after 20s, forget the success and run the check again.
                    if (this.completedActivities.has('appointmentDetails')) {
                        if (Date.now() - (this.appointmentCompletedAt || 0) < 20000) {
                            await new Promise(r => setTimeout(r, 500));
                            return;
                        }
                        this.completedActivities.delete('appointmentDetails');
                        this.logWarning("appointmentDetails", "Still on Appointment Details 20s after Continue - checking again.");
                    }

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
                        this.appointmentCompletedAt = Date.now();
                        this.logStatus(`[Success] 🚨 TARGET AVAILABLE! Bringing browser window on-screen...`);
                        
                        // Dynamically pull the browser onto the screen if it was running headlessly
                        if (this.headless) {
                            await this.bringWindowOnScreen();
                        }

                        // BUGFIX: the bot used to freeze here, so Your Details was never filled.
                        // Keep the orchestrator running; the 'yourDetails' action takes over.
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
            },
            yourDetails: {
                priority: actionsConfig.yourDetails.priority,
                startDelay: actionsConfig.yourDetails.startDelay,
                endDelay: actionsConfig.yourDetails.endDelay,
                dependencies: [], // the page itself proves we are at this stage, so a refresh can never block it
                method: async () => {
                    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
                    const st = await this.getYourDetailsState();
                    if (!st.present) { await sleep(400); return; }

                    const autoSave = this.instanceData.autoSave === undefined
                        ? true
                        : (this.instanceData.autoSave === true || String(this.instanceData.autoSave).toLowerCase() === 'true');

                    const filled = st.invalid === 0 && (st.fillOk || st.empty === 0);

                    // ---------- 1) FILL (also runs again after a refresh: the new form is empty) ----------
                    if (!filled) {
                        if (st.fillTries >= 3) {
                            if (!st.warnFill) {
                                this.logWarning("yourDetails", "Could not complete the form after 3 tries - please finish it manually.");
                                await this.setYourDetailsFlag({ warnFill: true });
                            }
                            await sleep(3000);
                            return;
                        }

                        await this.page.waitForFunction(() => {
                            const l = document.querySelector('ngx-ui-loader .ngx-overlay');
                            return !l || l.offsetHeight === 0 || window.getComputedStyle(l).display === 'none';
                        }, { timeout: 15000 }).catch(() => {});

                        await this.setYourDetailsFlag({ fillTries: st.fillTries + 1 });
                        this.logStatus(`[Your Details] Filling form (try ${st.fillTries + 1}/3)...`);

                        const payload = { ...this.instanceData, inputMethod: this.inputMethod };
                        const res = await this.page.evaluate(fillYourDetails, payload)
                            .catch((e) => ({ success: false, error: `injection-error: ${e.message}` }));

                        if (res.success) {
                            await this.setYourDetailsFlag({ fillOk: true });
                            this.logStatus(`[Your Details] ✅ Filled: ${res.filled.join(', ')}`);
                        } else {
                            this.logWarning("yourDetails", `Not complete -> ${JSON.stringify(res)}`);
                        }
                        return;
                    }

                    // ---------- 2) SAVE ----------
                    if (!autoSave) {
                        if (!st.warnManual) {
                            this.logStatus("[Your Details] Form is filled. autoSave is off - press Save yourself.");
                            await this.setYourDetailsFlag({ warnManual: true });
                        }
                        await sleep(2000);
                        return;
                    }

                    if (st.saveTries >= 3) {
                        if (!st.warnSave) {
                            this.logWarning("yourDetails", "Save did not go through after 3 tries - please press Save manually.");
                            await this.setYourDetailsFlag({ warnSave: true });
                        }
                        await sleep(3000);
                        return;
                    }

                    // The page asks for a 7 second wait before saving; add a random human margin
                    const waitMs = Math.max(0, 7500 - st.ageMs) + rnd(300, 1200);
                    this.logStatus(`[Your Details] Saving in ${Math.round(waitMs / 1000)}s (try ${st.saveTries + 1}/3)...`);
                    await sleep(waitMs);

                    await this.setYourDetailsFlag({ saveTries: st.saveTries + 1 });
                    const outcome = await this.clickSaveAndVerify();

                    if (outcome.status === 'navigated') {
                        this.completedActivities.add('yourDetails');
                        this.logStatus("[Your Details] ✅ Saved - the portal moved on to the next step.");
                        if (this.headless) await this.bringWindowOnScreen();
                    } else {
                        this.logWarning("yourDetails", `Save result: ${outcome.status}${outcome.message ? ' - ' + outcome.message : ''}`);
                    }
                }
            },
            yourDetailsSummary: {
                priority: actionsConfig.yourDetailsSummary.priority,
                startDelay: actionsConfig.yourDetailsSummary.startDelay,
                endDelay: actionsConfig.yourDetailsSummary.endDelay,
                dependencies: [],
                method: async () => {
                    const sleep = ms => new Promise(r => setTimeout(r, ms));
                    this.logStatus("[Your Details Summary] Executing native click on Continue...");
                    
                    try {
                        const clicked = await this.page.evaluate(async () => {
                            const sleep = ms => new Promise(res => setTimeout(res, ms));
                            for (let i = 0; i < 15; i++) {
                                const btn = Array.from(document.querySelectorAll('button')).find(b => {
                                    const txt = (b.innerText || '').toLowerCase();
                                    return txt.includes('continue') && b.offsetHeight > 0;
                                });
                                if (btn && !btn.disabled && !btn.classList.contains('disabled') && btn.getAttribute('aria-disabled') !== 'true') {
                                    btn.scrollIntoView({ behavior: 'instant', block: 'center' });
                                    btn.click();
                                    return true;
                                }
                                await sleep(500);
                            }
                            return false;
                        });

                        if (clicked) {
                            this.logStatus("[Your Details Summary] ✅ Clicked Continue.");
                            await sleep(1500);
                            this.completedActivities.add('yourDetailsSummary');
                        } else {
                            this.logWarning("yourDetailsSummary", `Failed to natively click Continue: Button not found or disabled.`);
                        }
                    } catch (e) {
                        this.logWarning("yourDetailsSummary", `Failed to natively click Continue: ${e.message}`);
                    }
                }
            },
            bookAppointment: {
                priority: actionsConfig.bookAppointment.priority,
                startDelay: actionsConfig.bookAppointment.startDelay,
                endDelay: actionsConfig.bookAppointment.endDelay,
                dependencies: [],
                method: async () => {
                    const sleep = ms => new Promise(r => setTimeout(r, ms));
                    this.logStatus("[Book Appointment] Handling calendar and slots...");
                    
                    // Click "Choose a slot" radio if not selected
                    await this.page.evaluate(() => {
                        const radio = document.querySelector('input[type="radio"][value="0"]');
                        if (radio && !radio.checked) radio.click();
                    });
                    await sleep(1000);

                    // Network interception logic fallback to DOM
                    let targetDate = null;
                    if (this.lastCalendarResponse) {
                        const str = JSON.stringify(this.lastCalendarResponse);
                        const dates = str.match(/\d{4}-\d{2}-\d{2}/g);
                        if (dates && dates.length > 0) {
                            const futureDates = dates.filter(d => parseInt(d.split('-')[0]) >= 2026);
                            if (futureDates.length > 0) {
                                targetDate = futureDates.sort()[0];
                            }
                        }
                    }

                    // Fallback to DOM parsing
                    if (!targetDate) {
                        targetDate = await this.page.evaluate(() => {
                            const avail = document.querySelector('td.date-availiable[data-date], td.fc-day-future.date-availiable[data-date]');
                            return avail ? avail.getAttribute('data-date') : null;
                        });
                    }

                    if (targetDate) {
                        this.logStatus(`[Book Appointment] Earliest available date found: ${targetDate}. Clicking...`);
                        await this.page.evaluate((date) => {
                            const td = document.querySelector(`td[data-date="${date}"]`);
                            if (td) {
                                const clickable = td.querySelector('a.fc-event') || td.querySelector('.fc-daygrid-day-frame') || td;
                                clickable.click();
                            }
                        }, targetDate);
                        await sleep(1500);

                        // Select time slot from dropdown
                        const targetTime = this.instanceData.appointmentTime || 'All';
                        await this.page.evaluate(async (timePref) => {
                            const sleep = ms => new Promise(res => setTimeout(res, ms));
                            
                            // Check for No Slots Available
                            const alertBox = document.querySelector('.card-body');
                            if (alertBox && alertBox.innerText.includes('No Slots Available')) {
                                timePref = 'All'; // Fallback to All
                            }

                            // Find the time dropdown (it is usually the last mat-select on the page if there are multiple)
                            const timeDropdowns = Array.from(document.querySelectorAll('mat-select'));
                            let timeDropdown = timeDropdowns.find(el => {
                                const parent = el.closest('div.row, div.col-12, div.form-group');
                                return parent && parent.innerText && parent.innerText.includes('time');
                            });
                            if (!timeDropdown && timeDropdowns.length > 0) {
                                timeDropdown = timeDropdowns[timeDropdowns.length - 1];
                            }

                            if (timeDropdown) {
                                timeDropdown.click();
                                await sleep(800);
                                const panelId = timeDropdown.getAttribute('aria-controls');
                                const panel = document.getElementById(panelId) || document.querySelector('.mat-mdc-select-panel');
                                if (panel) {
                                    const options = Array.from(panel.querySelectorAll('mat-option'));
                                    let targetOption = options.find(opt => opt.innerText && opt.innerText.toLowerCase().includes(timePref.toLowerCase()));
                                    if (!targetOption && timePref !== 'All') {
                                        targetOption = options.find(opt => opt.innerText && opt.innerText.toLowerCase().includes('all'));
                                    }
                                    if (targetOption) {
                                        targetOption.click();
                                        await sleep(1000);
                                    } else {
                                        document.body.click();
                                        await sleep(500);
                                    }
                                }
                            }

                            // Find and click the slot radio based on preference
                            // Note: VFS uses mat-radio-button. The top one is "Choose a slot" (value="0")
                            const radios = Array.from(document.querySelectorAll('mat-radio-button'));
                            const slotRadios = radios.filter(r => {
                                const input = r.querySelector('input[type="radio"]');
                                return input && input.value !== "0";
                            });

                            if (slotRadios.length > 0) {
                                // Click the label inside the radio for Angular to register
                                const label = slotRadios[0].querySelector('label') || slotRadios[0];
                                label.click();
                            } else {
                                // Fallback
                                const slots = Array.from(document.querySelectorAll('.ba-slot-radio, input[name="timeSlot"], input[type="radio"]'));
                                const validSlots = slots.filter(r => r.value !== "0");
                                if (validSlots.length > 0) {
                                    validSlots[0].click();
                                }
                            }
                        }, targetTime);
                        await sleep(1500);

                        // Click continue safely waiting for it to be enabled
                        const continueClicked = await this.page.evaluate(async () => {
                            const sleep = ms => new Promise(res => setTimeout(res, ms));
                            for (let i = 0; i < 15; i++) {
                                const btn = Array.from(document.querySelectorAll('button')).find(b => (b.innerText || '').includes('Continue') && b.offsetHeight > 0);
                                if (btn && !btn.disabled && !btn.classList.contains('disabled') && btn.getAttribute('aria-disabled') !== 'true') {
                                    btn.click();
                                    return true;
                                }
                                await sleep(500);
                            }
                            return false;
                        });
                        
                        if (continueClicked) {
                            this.logStatus("[Book Appointment] ✅ Clicked Continue.");
                            await sleep(1500);
                            this.completedActivities.add('bookAppointment');
                        } else {
                            this.logWarning("bookAppointment", "Continue button remained disabled or not found.");
                        }
                    } else {
                        this.logStatus("[Book Appointment] No dates found. Clicking Next Month...");
                        await this.page.evaluate(() => {
                            const next = document.querySelector('.fc-next-button');
                            if (next && !next.disabled) next.click();
                        });
                    }
                }
            },
            services: {
                priority: actionsConfig.services.priority,
                startDelay: actionsConfig.services.startDelay,
                endDelay: actionsConfig.services.endDelay,
                dependencies: [],
                method: async () => {
                    const sleep = ms => new Promise(r => setTimeout(r, ms));
                    this.logStatus("[Services] Proceeding without adding services...");
                    const btn = await this.page.evaluateHandle(() => {
                        return Array.from(document.querySelectorAll('button')).find(b => (b.innerText || '').includes('Continue') && b.offsetHeight > 0);
                    });
                    if (btn) {
                        await btn.click();
                        await sleep(1500);
                        this.completedActivities.add('services');
                    }
                }
            },
            review: {
                priority: actionsConfig.review.priority,
                startDelay: actionsConfig.review.startDelay,
                endDelay: actionsConfig.review.endDelay,
                dependencies: [],
                method: async () => {
                    const sleep = ms => new Promise(r => setTimeout(r, ms));
                    this.logStatus("[Review] Accepting Terms and Conditions...");
                    
                    // Click T&C checkbox safely
                    await this.page.evaluate(() => {
                        const checkboxes = Array.from(document.querySelectorAll('mat-checkbox input[type="checkbox"]'));
                        for (const checkboxInput of checkboxes) {
                            if (!checkboxInput.checked) {
                                const label = document.querySelector(`label[for="${checkboxInput.id}"]`);
                                if (label) {
                                    label.click();
                                } else {
                                    checkboxInput.click();
                                }
                            }
                        }
                    });
                    await sleep(1000);

                    // Click Pay Online / Continue
                    this.logStatus("[Review] Clicking Pay Online...");
                    const clicked = await this.page.evaluate(async () => {
                        const sleep = ms => new Promise(res => setTimeout(res, ms));
                        for (let i = 0; i < 15; i++) {
                            const btn = Array.from(document.querySelectorAll('button')).find(b => {
                                const text = (b.innerText || '').toLowerCase();
                                return (text.includes('pay online') || text.includes('continue')) && b.offsetHeight > 0;
                            });
                            if (btn && !btn.disabled && !btn.classList.contains('disabled') && btn.getAttribute('aria-disabled') !== 'true') {
                                btn.click();
                                return true;
                            }
                            await sleep(500);
                        }
                        return false;
                    });

                    if (clicked) {
                        this.logStatus("[Review] ✅ Proceeded to payment.");
                        await sleep(1500);
                        this.completedActivities.add('review');
                    } else {
                        this.logWarning("review", "Pay Online button not found or remained disabled.");
                    }
                }
            },
            paymentDisclaimer: {
                priority: actionsConfig.paymentDisclaimer.priority,
                startDelay: actionsConfig.paymentDisclaimer.startDelay,
                endDelay: actionsConfig.paymentDisclaimer.endDelay,
                dependencies: [],
                method: async () => {
                    const sleep = ms => new Promise(r => setTimeout(r, ms));
                    this.logStatus("[Payment Disclaimer] Accepting disclaimer...");
                    const btn = await this.page.evaluateHandle(() => {
                        return Array.from(document.querySelectorAll('button')).find(b => {
                            const text = (b.innerText || '');
                            return (text.includes('Continue') || text.includes('Accept')) && b.offsetHeight > 0;
                        });
                    });
                    if (btn) {
                        await btn.click();
                        await sleep(1500);
                        this.completedActivities.add('paymentDisclaimer');
                        this.logStatus("[PayFort] 🚨 Reached payment portal! Manual payment required.");
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

            // Set up network interceptor for calendar availability
            this.page.on('response', async (response) => {
                try {
                    const url = response.url();
                    if (!url.includes('/applicants') && (url.includes('availability') || url.includes('appointment/slots') || url.includes('appointment'))) {
                        const contentType = response.headers()['content-type'] || '';
                        if (contentType.includes('application/json')) {
                            const data = await response.json();
                            if (data) {
                                this.lastCalendarResponse = data;
                            }
                        }
                    }
                } catch (e) {
                    // Ignore errors for interceptor
                }
            });

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

    /** Reads the Your Details form state. Progress flags live on the #dateOfBirth element itself,
     *  so a refresh or a re-rendered form automatically starts again from zero. */
    async getYourDetailsState() {
        try {
            return await this.page.evaluate(() => {
                const dob = document.querySelector('#dateOfBirth');
                if (!dob || dob.offsetHeight === 0) return { present: false };
                if (!dob.__omni) {
                    dob.__omni = { readyAt: Date.now(), fillTries: 0, saveTries: 0, fillOk: false, warnFill: false, warnSave: false, warnManual: false };
                }
                const vis = (el) => el.offsetHeight > 0;
                const inputs = Array.from(document.querySelectorAll('input'))
                    .filter(i => vis(i) && !['hidden', 'checkbox', 'radio', 'file'].includes((i.type || '').toLowerCase()));
                const selects = Array.from(document.querySelectorAll('mat-select')).filter(vis);
                const emptyInputs = inputs.filter(i => !String(i.value).trim()).length;
                const emptySelects = selects.filter(s => !((s.querySelector('.mat-mdc-select-value-text') || {}).textContent || '').trim()).length;
                return {
                    present: true,
                    ...dob.__omni,
                    ageMs: Date.now() - dob.__omni.readyAt,
                    empty: emptyInputs + emptySelects,
                    invalid: inputs.filter(i => i.classList.contains('ng-invalid')).length
                };
            });
        } catch (e) {
            return { present: false };
        }
    }

    async setYourDetailsFlag(patch) {
        try {
            await this.page.evaluate((p) => {
                const dob = document.querySelector('#dateOfBirth');
                if (dob && dob.__omni) Object.assign(dob.__omni, p);
            }, patch);
        } catch (e) {}
    }

    /** Real mouse click on Save, then checks that the page really moved on (or shows an error). */
    async clickSaveAndVerify() {
        const sleep = (ms) => new Promise(r => setTimeout(r, ms));
        try {
            const handle = await this.page.evaluateHandle(() =>
                Array.from(document.querySelectorAll('button'))
                    .find(b => b.offsetHeight > 0 && /^\s*save\s*$/i.test(b.textContent || '')) || null
            );
            const btn = handle.asElement();
            if (!btn) return { status: 'no-button' };

            await this.page.waitForFunction(
                (b) => !b.disabled && !b.classList.contains('disabled') && b.getAttribute('aria-disabled') !== 'true',
                { timeout: 15000 }, btn
            ).catch(() => {});

            await btn.evaluate((b) => b.scrollIntoView({ block: 'center', behavior: 'instant' }));
            await sleep(rnd(250, 700));

            try {
                await btn.click({ delay: rnd(40, 120) }); // genuine mouse events
            } catch (e) {
                await btn.evaluate((b) => b.click());    // fallback
            }

            const result = await this.page.waitForFunction(() => {
                if (!location.href.includes('/your-details')) return 'navigated';
                const err = Array.from(document.querySelectorAll('.errorMessage, div[role="alert"], .alert-danger'))
                    .find(e => e.offsetHeight > 0 && (e.textContent || '').trim());
                if (err) return 'error: ' + err.textContent.trim().slice(0, 160);
                return false;
            }, { timeout: 20000, polling: 300 }).catch(() => null);

            const value = result ? await result.jsonValue() : 'timeout';
            if (value === 'navigated') return { status: 'navigated' };
            if (String(value).startsWith('error:')) return { status: 'error', message: value };
            return { status: 'timeout' };
        } catch (e) {
            // e.g. "Execution context was destroyed" because the page navigated right after the click
            const stillThere = await this.isYourDetailsPage();
            return stillThere ? { status: 'error', message: e.message } : { status: 'navigated' };
        }
    }

    async isYourDetailsPage() {
        if (!this.page) return false;
        try {
            if (this.page.url().includes('/your-details')) return true;
            return !!(await this.page.$('#dateOfBirth'));
        } catch (e) {
            return false;
        }
    }

    async domScanner() {
        if (!this.page) return [];
        const detected = [];
        const onYourDetails = await this.isYourDetailsPage();

        if (await this.isPresent(Selectors.common.cookieBanner.container)) detected.push('cookies');
        if (await this.captchaHandler.isPresent()) {
            if (!(await this.captchaHandler.isResolved())) detected.push('captcha');
        }
        if (!onYourDetails && await this.isPresent(Selectors.signIn.email)) detected.push('signIn');
        if (await this.isPresent(Selectors.dashboard.startNewBooking)) detected.push('dashboard');
        if (await this.isPresent(Selectors.appointmentDetails.centerDropdown)) detected.push('appointmentDetails');
        
        const hasSummary = await this.isPresent(Selectors.yourDetailsSummary.pageHeader);
        if (onYourDetails && !hasSummary) detected.push('yourDetails');
        if (hasSummary) detected.push('yourDetailsSummary');
        
        if (await this.isPresent(Selectors.bookAppointment.pageHeader)) detected.push('bookAppointment');
        if (await this.isPresent(Selectors.services.pageHeader)) detected.push('services');
        if (await this.isPresent(Selectors.review.pageHeader)) detected.push('review');
        if (await this.isPresent(Selectors.paymentDisclaimer.pageHeader)) detected.push('paymentDisclaimer');

        // Whenever an earlier stage is on screen again (refresh, session expired, user went back),
        // forget the stages after it so the bot redoes them instead of waiting forever.
        const stages = ['signIn', 'dashboard', 'appointmentDetails', 'yourDetails', 'yourDetailsSummary', 'bookAppointment', 'services', 'review', 'paymentDisclaimer'];
        const firstSeen = stages.findIndex(s => detected.includes(s));
        if (firstSeen !== -1) {
            for (const s of stages.slice(firstSeen + 1)) {
                this.completedActivities.delete(s);
                if (this.warnedBypasses) this.warnedBypasses.delete(s);
            }
        }

        // Logic to track sequence and detect skipped (bypassed) operations
        if (!this.warnedBypasses) this.warnedBypasses = new Set();
        const detectedStages = detected.filter(s => stages.includes(s));
        if (detectedStages.length > 0) {
            const highestDetectedIdx = Math.max(...detectedStages.map(s => stages.indexOf(s)));
            // Check if any previous stages were skipped (not in completedActivities)
            for (let i = 0; i < highestDetectedIdx; i++) {
                const stage = stages[i];
                // 'yourDetails' is sometimes genuinely skipped if the portal bypasses it, we can still warn.
                if (!this.completedActivities.has(stage) && !this.warnedBypasses.has(stage)) {
                    this.warnedBypasses.add(stage);
                    this.logWarning("sequence_bypass", `Bypassed operation: '${stage}' was skipped or incomplete before reaching '${stages[highestDetectedIdx]}'.`);
                }
            }
        }

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

    async signIn(account = this.email, password = this.password, inputMethod = this.inputMethod) {
        if (!this.page) return;
        if (!account || !password) {
            this.logError("credential", "Email/password not provided");
            this.isOrchestratorRunning = false;
            return;
        }
        this.inputMethod = inputMethod || this.inputMethod || 'fill';

        this.logStatus(`[Worker] Entering credentials for: ${account} (mode: ${this.inputMethod})`);

        try {
            // Primary path: inject and invoke injectionSignIn in browser context.
            const result = await this.page.evaluate(injectionSignIn, {
                account,
                password,
                selectors: signInSelectors,
                inputMethod: this.inputMethod,
            }).catch((e) => ({ ok: false, reason: `injection-error: ${e.message}` }));

            if (result && result.captcha === 'pending') {
                this.logStatus("[Worker] Turnstile captcha pending — deferring submit until solved...");
                if (!(await this.captchaHandler.isResolved())) return;
            }

            if (result && result.ok) {
                this.logStatus(`[Worker] ✅ Sign-in submitted via injection (method: ${result.method}).`);
                await this.page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
                return;
            }

            // Fallback: legacy Node-side fill + submit.
            this.logWarning("signin", `Injection path: ${result?.reason || 'unknown'} — using fallback.`);
            await this.typeByDescriptor(Selectors.signIn.email, account);
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
