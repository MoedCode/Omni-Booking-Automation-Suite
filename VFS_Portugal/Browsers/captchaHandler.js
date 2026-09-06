/* Omni-Booking-Automation-Suite/VFS_Portugal/Browsers/captchaHandler.js */

import Selectors from '../Config/Selectors.js';

export class CaptchaHandler {
    /**
     * @param {import('./BaseBrowser.js').BaseBrowser} worker
     */
    constructor(worker) {
        this.worker = worker;
    }

    get page() {
        return this.worker.page;
    }

    async isPresent() {
        if (!this.page) return false;
        const containerSelector = Selectors.captcha.container.selector;
        return (await this.page.$(containerSelector)) !== null;
    }

    async isResolved() {
        if (!this.page) return false;
        try {
            const inputSelector = Selectors.captcha.responseInput.selector;
            const token = await this.page.$eval(inputSelector, el => el.value).catch(() => '');
            return Boolean(token && token.trim().length > 20);
        } catch {
            return false;
        }
    }

    async resolve(timeout = 60000) {
        if (!this.page) return false;

        this.worker.logStatus("[Captcha] Inspecting Cloudflare Challenge...");

        try {
            const containerSelector = Selectors.captcha.container.selector;
            const inputSelector = Selectors.captcha.responseInput.selector;

            // 1. Wait for the outer container to exist
            const container = await this.page.waitForSelector(containerSelector, { timeout: 15000 });
            await new Promise(r => setTimeout(r, 2000));

            let clickedViaFrame = false;

            // 2. STRATEGY 1: Pierce Shadow DOM via Puppeteer's Frame Tree
            const cfFrame = this.page.frames().find(f => f.url().includes('challenges.cloudflare.com'));
            
            if (cfFrame) {
                try {
                    // Wait for the body of the Turnstile iframe and click it
                    const frameBody = await cfFrame.waitForSelector('body', { timeout: 3000 });
                    if (frameBody) {
                        // Scroll container into view first to ensure native click works
                        await this.page.evaluate((el) => {
                            el.scrollIntoView({ behavior: 'instant', block: 'center' });
                        }, container);
                        
                        await frameBody.click();
                        this.worker.logStatus("[Captcha] Clicked widget directly via Frame Tree.");
                        clickedViaFrame = true;
                    }
                } catch (e) {
                    this.worker.logWarning("captcha", "Frame click failed, falling back to geometric click.");
                }
            }

            // 3. STRATEGY 2: Smart Geometric Click (If frame piercing fails)
            if (!clickedViaFrame && container) {
                // Crucial: Bring the element to the center of the viewport before clicking
                await this.page.evaluate((el) => {
                    el.scrollIntoView({ behavior: 'instant', block: 'center' });
                }, container);

                await new Promise(r => setTimeout(r, 1000)); // Wait for scroll to settle

                const box = await container.boundingBox();
                if (box) {
                    let targetX = box.x + 30; // Default: widget is aligned to the left
                    
                    // If container is wider than a standard Turnstile widget (300px), it's likely centered
                    if (box.width > 400) {
                        targetX = box.x + (box.width / 2) - 120; // 120px left of the center hits the checkbox
                    }
                    
                    const targetY = box.y + (box.height / 2);

                    await this.page.mouse.click(targetX, targetY);
                    this.worker.logStatus("[Captcha] Clicked widget coordinates (Smart Geometric Bypass).");
                }
            }

            this.worker.logStatus("[Captcha] Waiting for verification token...");

            // 4. Wait until the hidden input gets the generated token
            await this.page.waitForFunction((selector) => {
                const el = document.querySelector(selector);
                return el && el.value && el.value.trim().length > 20;
            }, { timeout }, inputSelector);

            this.worker.logStatus("[Captcha] ✅ Token successfully received.");
            return true;

        } catch (error) {
            this.worker.logError("captcha", `Verification failed or timed out: ${error.message}`);
            return false;
        }
    }
}