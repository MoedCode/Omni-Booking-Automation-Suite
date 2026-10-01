/* Omni-Booking-Automation-Suite/VFS_Portugal/Browsers/injection.js */

export const signInSelectors = {}; 

/**
 * 1. Sign-In Form Filler 
 */
export async function injectionSignIn(config = {}) {
    const account = config.account || config.email || '';
    const password = config.password || '';
    let rawMethod = (config.inputMethod || 'fill').toLowerCase();
    const validMethods = ['typing', 'paste', 'fill', 'random'];
    if (!validMethods.includes(rawMethod)) rawMethod = 'fill';

    let method = rawMethod;
    if (method === 'random') {
        method = ['typing', 'paste', 'fill'][Math.floor(Math.random() * 3)];
    }

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const randomDelay = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    
    const getXPath = (xpath) => {
        const iter = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        let node;
        while ((node = iter.iterateNext())) {
            const style = window.getComputedStyle(node);
            if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && node.offsetHeight > 0) {
                return node;
            }
        }
        return null;
    };

    // Cookies
    try {
        const cookieBtn = getXPath('//button[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "accept all")]');
        if (cookieBtn) {
            cookieBtn.scrollIntoView({ behavior: 'instant', block: 'center' });
            cookieBtn.click();
            await sleep(800);
        }
    } catch (e) {}

    // Cloudflare Challenge
    let captchaState = 'absent';
    try {
        const cfFrame = getXPath('//iframe[contains(@src, "challenges.cloudflare.com")]');
        if (cfFrame) {
            const token = document.evaluate('//input[@name="cf-turnstile-response" or contains(@name, "response")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (token && token.value && token.value.trim().length > 20) {
                captchaState = 'solved';
            } else {
                captchaState = 'pending';
                if (cfFrame.scrollIntoView) cfFrame.scrollIntoView({ behavior: 'instant', block: 'center' });
            }
        }
    } catch (e) {}

    const emailEl = getXPath('//input[@type="email" or contains(@name, "email") or contains(@placeholder, "email")] | //label[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "email")]/following::input[1]');
    const passEl = getXPath('//input[@type="password"] | //label[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "password")]/following::input[1]');

    if (!emailEl) return { ok: false, reason: 'email-input-not-found', captcha: captchaState, method };
    if (!passEl) return { ok: false, reason: 'password-input-not-found', captcha: captchaState, method };

    const dispatchInput = async (el, val) => {
        if (!el || !val) return;
        el.focus();
        el.click();
        
        const proto = window.HTMLInputElement.prototype;
        const desc = Object.getOwnPropertyDescriptor(proto, 'value');
        if (desc && desc.set) desc.set.call(el, '');
        else el.value = '';
        el.dispatchEvent(new Event('input', { bubbles: true }));

        if (method === 'typing') {
            for (const char of val) {
                el.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
                el.dispatchEvent(new KeyboardEvent('keypress', { key: char, bubbles: true }));
                if (desc && desc.set) desc.set.call(el, el.value + char);
                else el.value += char;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true }));
                await sleep(randomDelay(40, 120));
            }
        } else if (method === 'paste') {
            try {
                const dt = new DataTransfer();
                dt.setData('text/plain', val);
                el.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: dt }));
            } catch(e) {}
            if (desc && desc.set) desc.set.call(el, val);
            else el.value = val;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            await sleep(50);
        } else { // fill (browser)
            if (desc && desc.set) desc.set.call(el, val);
            else el.value = val;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            await sleep(20);
        }
        
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.dispatchEvent(new Event('blur', { bubbles: true }));
    };

    await dispatchInput(emailEl, account);
    await sleep(randomDelay(150, 350));
    await dispatchInput(passEl, password);
    await sleep(randomDelay(200, 400));

    const submitBtn = getXPath('//button[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "sign in") or contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "log in")] | //button[@type="submit"]');
    
    if (!submitBtn) return { ok: false, reason: 'submit-button-not-found', captcha: captchaState, method };

    submitBtn.scrollIntoView({ behavior: 'instant', block: 'center' });
    await sleep(300);

    submitBtn.removeAttribute('disabled');
    submitBtn.click();
    
    return { ok: true, captcha: captchaState, method };
}

/**
 * 2. Your Details Form Filler 
 * Uses Advanced Semantic "Deep-Node" locating to find inputs strictly by text labels.
 */
export async function fillYourDetails(data = {}) {
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    
    let method = (data.inputMethod || 'fill').toLowerCase();
    if (method === 'random') method = ['typing', 'paste', 'fill'][Math.floor(Math.random() * 3)];

    const getXPath = (xpath) => {
        const iter = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        let node;
        while ((node = iter.iterateNext())) {
            const style = window.getComputedStyle(node);
            if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && node.offsetHeight > 0) {
                return node;
            }
        }
        return null;
    };

    // Semantic Finder: Looks for any label/div containing the text, then hops to the requested input/select tag.
    const getField = (labelText, tag = 'input', idx = 1) => {
        const lower = labelText.toLowerCase();
        return getXPath(`(//label[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${lower}')]/following::${tag} | //div[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${lower}')]/following::${tag} | //${tag}[contains(translate(@placeholder, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${lower}')])[${idx}]`);
    };

    const dispatchInput = async (el, val) => {
        if (!el || !val) return;
        el.focus();
        el.click();
        
        const proto = window.HTMLInputElement.prototype;
        const desc = Object.getOwnPropertyDescriptor(proto, 'value');
        if (desc && desc.set) desc.set.call(el, '');
        else el.value = '';
        el.dispatchEvent(new Event('input', { bubbles: true }));

        if (method === 'typing') {
            for (const char of val) {
                el.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
                el.dispatchEvent(new KeyboardEvent('keypress', { key: char, bubbles: true }));
                if (desc && desc.set) desc.set.call(el, el.value + char);
                else el.value += char;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true }));
                await sleep(Math.floor(Math.random() * (120 - 40 + 1)) + 40);
            }
        } else if (method === 'paste') {
            try {
                const dt = new DataTransfer();
                dt.setData('text/plain', val);
                el.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: dt }));
            } catch(e) {}
            if (desc && desc.set) desc.set.call(el, val);
            else el.value = val;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            await sleep(50);
        } else { // fill (browser)
            if (desc && desc.set) desc.set.call(el, val);
            else el.value = val;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            await sleep(20);
        }
        
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.dispatchEvent(new Event('blur', { bubbles: true }));
        
        // Force dismissal of datepicker if it popped up
        document.body.click(); 
    };

    const selectDropdown = async (labelText, targetValue) => {
        if (!targetValue) return;
        const trigger = getField(labelText, 'mat-select');
        
        if (!trigger) return;
        if (trigger.textContent.toLowerCase().includes(targetValue.toLowerCase())) return;

        trigger.click();
        await sleep(600);

        const panel = getXPath(`//div[@role='listbox']`);
        if (panel) {
            const optXpath = `.//mat-option//*[contains(translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${targetValue.toLowerCase()}')]`;
            const opt = document.evaluate(optXpath, panel, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            
            if (opt) opt.click();
            else document.body.click(); 
            
            await sleep(500);
        }
    };

    try {
        await dispatchInput(getField('first name', 'input'), data.firstName);
        await dispatchInput(getField('last name', 'input'), data.lastName);
        await dispatchInput(getField('passport number', 'input'), data.passportNumber);
        await dispatchInput(getField('email', 'input'), data.email || data.account);
        
        // Contact number uses index to jump to the right input fields (1 for Code, 2 for Phone)
        await dispatchInput(getField('contact number', 'input', 1), data.dialCode);
        await dispatchInput(getField('contact number', 'input', 2), data.contactNumber);

        // Date Pickers populated directly to avoid calendar overhead
        await dispatchInput(getField('date of birth', 'input'), data.dateOfBirth);
        await dispatchInput(getField('passport expiry', 'input'), data.passportExpiry);

        await selectDropdown('gender', data.gender);
        await selectDropdown('current nationality', data.nationality);

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}