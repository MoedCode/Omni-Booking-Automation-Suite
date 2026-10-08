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
        // Format as blinking yellow for the Operational State display
        const coloredMessage = `\x1b[5;33m⚠️ [Warning - ${key}]: ${message}\x1b[0m`;
        this.operationalStatus.push(coloredMessage);
        if (debug?.warnings) {
            console.warn(`[${new Date().toLocaleTimeString()}] ${coloredMessage}`);
        }
    }

    logError(key, message) {
        this.errors[key] = message;
        this.operationalStatus.push(`❌ [Error - ${key}]: ${message}`);
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
            if (descriptor.elementType === 'Heading') {
                const isVisible = await this.page.evaluate((desc) => {
                    const clean = (str) => (str || '').toLowerCase().replace(/[*_:\s\-]/g, ' ').trim();
                    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
                    for (const h of headings) {
                        const hText = clean(h.innerText || h.textContent);
                        const matched = desc.text.some(t => {
                            const cT = clean(t);
                            if (cT === 'your details') return hText === cT;
                            return hText.includes(cT);
                        });
                        if (matched && window.getComputedStyle(h).display !== 'none' && window.getComputedStyle(h).visibility !== 'hidden' && h.offsetHeight > 0) {
                            return true;
                        }
                    }
                    return false;
                }, descriptor);
                return Boolean(isVisible);
            }
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