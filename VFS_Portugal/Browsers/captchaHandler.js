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

    /**
     * Checks whether a Cloudflare captcha widget is present on the page.
     * We target the Container because the iframe is hidden inside a Closed Shadow DOM.
     */
    async isPresent() {
        if (!this.page) return false;
        const containerSelector = Selectors.captcha.container.selector;
        return (await this.page.$(containerSelector)) !== null;
    }

    /**
     * Checks if Cloudflare has already resolved and populated the response token.
     */
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

    /**
     * Waits for the Turnstile token to populate. 
     * Uses Geometric Bounding Box clicking to bypass Closed Shadow DOM restrictions.
     */
    async resolve(timeout = 60000) {
        if (!this.page) return false;

        this.worker.logStatus("[Captcha] Inspecting Cloudflare Challenge...");

        try {
            const containerSelector = Selectors.captcha.container.selector;
            const inputSelector = Selectors.captcha.responseInput.selector;

            // 1. Wait for the outer container to exist
            const container = await this.page.waitForSelector(containerSelector, { timeout: 15000 });

            // 2. Wait 2 seconds to ensure the iframe inside the shadow root has fully rendered
            await new Promise(r => setTimeout(r, 2000));

            // 3. Shadow DOM Bypass: Click using physical coordinates
            if (container) {
                const box = await container.boundingBox();
                if (box) {
                    // Click 30 pixels from the left edge (where the Turnstile checkbox is located)
                    await this.page.mouse.click(box.x + 30, box.y + (box.height / 2));
                    this.worker.logStatus("[Captcha] Clicked widget coordinates (Shadow DOM bypass).");
                }
            }

            this.worker.logStatus("[Captcha] Waiting for verification token...");

            // 4. Wait until the hidden input gets the long string token
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