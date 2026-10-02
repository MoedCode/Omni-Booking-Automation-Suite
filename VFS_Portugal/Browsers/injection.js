/* Omni-Booking-Automation-Suite/VFS_Portugal/Browsers/injection.js */

export const signInSelectors = {};

/**
 * 1. Sign-In Form Filler (unchanged)
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
            } catch (e) {}
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
 * 2. Your Details Form Filler (rewritten)
 *
 * Runs inside page.evaluate(fillYourDetails, data) so EVERYTHING must live inside this function.
 *
 * Fixes vs. the old version:
 *  - waits for the form + Angular loader before touching anything
 *  - label lookup uses the label's OWN text (no giant ancestor <div> matches)
 *  - dropdowns: exact option match ("Male" never matches "Female"), opens .mat-mdc-select-trigger,
 *    waits for the overlay panel, verifies the selected value afterwards
 *  - dates: normalized to data.dateFormat (default DD/MM/YYYY) and validated; ng-invalid is checked
 *  - dial code / phone are cleaned to digits
 *  - NO silent failures: returns { success, filled, missing, empty, invalid, mismatched }
 *
 * Expected data keys: firstName, lastName, gender, dateOfBirth, nationality, passportNumber,
 * passportExpiry, dialCode, contactNumber, email|account, inputMethod, dateFormat (optional).
 */
export async function fillYourDetails(data = {}) {
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const norm = (s) => String(s ?? '').replace(/\s+/g, ' ').trim().toLowerCase();

    let method = String(data.inputMethod || 'fill').toLowerCase();
    if (!['typing', 'paste', 'fill', 'random'].includes(method)) method = 'fill';
    if (method === 'random') method = ['typing', 'paste', 'fill'][Math.floor(Math.random() * 3)];

    const dateFormat = String(data.dateFormat || 'DD/MM/YYYY').toUpperCase();

    const report = { filled: [], missing: [], empty: [], invalid: [], mismatched: [] };

    // ---------- helpers ----------
    const isVisible = (el) => {
        if (!el) return false;
        const st = window.getComputedStyle(el);
        return st.display !== 'none' && st.visibility !== 'hidden' && st.opacity !== '0' && el.offsetHeight > 0;
    };

    const waitFor = async (fn, timeout = 15000, step = 200) => {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            try { const r = fn(); if (r) return r; } catch (e) {}
            await sleep(step);
        }
        return null;
    };

    // Text that belongs directly to the element (ignores child elements such as <span class="asterisk">*</span>)
    const ownText = (n) => norm(
        Array.from(n.childNodes).filter(c => c.nodeType === 3).map(c => c.textContent).join(' ')
    ).replace(/\*/g, '').trim();

    const findLabels = (labelText) => {
        const t = norm(labelText);
        return Array.from(document.querySelectorAll('label, div, span, p, legend, mat-label'))
            .filter(n => isVisible(n) && ownText(n) === t);
    };

    const SKIP_TYPES = ['hidden', 'checkbox', 'radio', 'file', 'button', 'submit'];

    // First <tag> that appears AFTER the label in document order (idx is 1-based).
    const getField = (labelText, tag = 'input', idx = 1) => {
        const all = Array.from(document.querySelectorAll(tag)).filter(el =>
            isVisible(el) && !(tag === 'input' && SKIP_TYPES.includes((el.type || '').toLowerCase()))
        );
        for (const label of findLabels(labelText)) {
            const after = all.filter(el =>
                !label.contains(el) && (label.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING)
            );
            if (after[idx - 1]) return after[idx - 1];
        }
        // Fallback: placeholder text
        const t = norm(labelText);
        const byPlaceholder = all.filter(el => norm(el.getAttribute('placeholder')).includes(t));
        return byPlaceholder[idx - 1] || null;
    };

    const setNativeValue = (el, v) => {
        const desc = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
        if (desc && desc.set) desc.set.call(el, v);
        else el.value = v;
    };
    const fire = (el, type) => el.dispatchEvent(new Event(type, { bubbles: true }));

    // Accepts DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY, YYYY-MM-DD, YYYY/MM/DD -> returns string in dateFormat, or null
    const normalizeDate = (raw) => {
        const s = String(raw ?? '').trim();
        let d, m, y, mt;
        if ((mt = s.match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})$/))) { y = +mt[1]; m = +mt[2]; d = +mt[3]; }
        else if ((mt = s.match(/^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{4})$/))) { d = +mt[1]; m = +mt[2]; y = +mt[3]; }
        else return null;
        const probe = new Date(y, m - 1, d);
        if (probe.getFullYear() !== y || probe.getMonth() !== m - 1 || probe.getDate() !== d) return null;
        const dd = String(d).padStart(2, '0');
        const mm = String(m).padStart(2, '0');
        const sep = dateFormat.includes('-') ? '-' : (dateFormat.includes('.') ? '.' : '/');
        return dateFormat.startsWith('YYYY') ? `${y}${sep}${mm}${sep}${dd}` : `${dd}${sep}${mm}${sep}${y}`;
    };

    const dispatchInput = async (el, rawVal, key, isDate = false) => {
        const val = String(rawVal ?? '').trim();
        if (!val) { report.empty.push(key); return false; }
        if (!el) { report.missing.push(key); return false; }

        el.scrollIntoView({ behavior: 'instant', block: 'center' });
        el.focus();
        el.click();

        setNativeValue(el, '');
        fire(el, 'input');

        if (method === 'typing') {
            for (const char of val) {
                el.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
                el.dispatchEvent(new KeyboardEvent('keypress', { key: char, bubbles: true }));
                setNativeValue(el, el.value + char);
                fire(el, 'input');
                el.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true }));
                await sleep(Math.floor(Math.random() * 81) + 40);
            }
        } else if (method === 'paste') {
            try {
                const dt = new DataTransfer();
                dt.setData('text/plain', val);
                el.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: dt }));
            } catch (e) {}
            setNativeValue(el, val);
            fire(el, 'input');
            await sleep(50);
        } else { // fill
            setNativeValue(el, val);
            fire(el, 'input');
            await sleep(20);
        }

        fire(el, 'change');
        fire(el, 'blur');
        el.blur();
        if (isDate) document.body.click(); // dismiss the ngb datepicker popup if it opened

        await sleep(isDate ? 300 : 150);

        // Verify (case-insensitive: the page forces upper-case on many inputs)
        if (norm(el.value) !== norm(val)) {
            report.mismatched.push(`${key} (wanted "${val}", got "${el.value}")`);
            return false;
        }
        if (el.classList.contains('ng-invalid')) {
            report.invalid.push(key);
            return false;
        }
        report.filled.push(key);
        return true;
    };

    const selectDropdown = async (labelText, rawTarget, key) => {
        const target = norm(rawTarget);
        if (!target) { report.empty.push(key); return false; }

        const trigger = getField(labelText, 'mat-select');
        if (!trigger) { report.missing.push(key); return false; }

        const readValue = () => norm(trigger.querySelector('.mat-mdc-select-value-text')?.textContent);
        if (readValue() === target) { report.filled.push(key); return true; }

        trigger.scrollIntoView({ behavior: 'instant', block: 'center' });
        (trigger.querySelector('.mat-mdc-select-trigger') || trigger).click();

        // Wait for the overlay panel
        let panel = null;
        for (let i = 0; i < 20 && !panel; i++) {
            await sleep(150);
            const id = trigger.getAttribute('aria-controls');
            panel = (id && document.getElementById(id))
                || Array.from(document.querySelectorAll('.mat-mdc-select-panel, [role="listbox"]')).find(isVisible)
                || null;
        }
        if (!panel) { report.missing.push(`${key} (dropdown did not open)`); return false; }

        const options = Array.from(panel.querySelectorAll('mat-option'));
        let opt = options.find(o => norm(o.textContent) === target)
            || options.find(o => norm(o.textContent).startsWith(target));
        if (!opt) {
            const partial = options.filter(o => norm(o.textContent).includes(target));
            if (partial.length === 1) opt = partial[0]; // only accept an unambiguous partial match
        }

        if (!opt) {
            document.body.click();
            await sleep(400);
            report.missing.push(`${key} (option "${rawTarget}" not in list)`);
            return false;
        }

        opt.scrollIntoView({ behavior: 'instant', block: 'center' });
        opt.click();
        await sleep(500);

        if (readValue() !== norm(opt.textContent)) {
            report.mismatched.push(`${key} (wanted "${rawTarget}", got "${readValue()}")`);
            return false;
        }
        report.filled.push(key);
        return true;
    };

    // ---------- main ----------
    try {
        const ready = await waitFor(() => document.querySelector('#dateOfBirth') || findLabels('first name').length, 20000);
        if (!ready) return { success: false, error: 'your-details-form-not-found', ...report };

        await waitFor(() => {
            const l = document.querySelector('ngx-ui-loader .ngx-overlay');
            return !l || !isVisible(l);
        }, 15000);
        await sleep(300);

        // Clean inputs
        const digits = (v) => String(v ?? '').replace(/\D/g, '');
        const dialCode = digits(data.dialCode).slice(0, 3);
        const phone = digits(data.contactNumber);

        const genderAliases = { m: 'male', f: 'female', 'ذكر': 'male', 'أنثى': 'female', 'انثى': 'female' };
        const gender = genderAliases[norm(data.gender)] || data.gender;

        const dob = data.dateOfBirth ? normalizeDate(data.dateOfBirth) : '';
        const expiry = data.passportExpiry ? normalizeDate(data.passportExpiry) : '';
        if (data.dateOfBirth && !dob) report.invalid.push(`dateOfBirth (unrecognized date "${data.dateOfBirth}")`);
        if (data.passportExpiry && !expiry) report.invalid.push(`passportExpiry (unrecognized date "${data.passportExpiry}")`);

        await dispatchInput(getField('first name', 'input'), data.firstName, 'firstName');
        await dispatchInput(getField('last name', 'input'), data.lastName, 'lastName');
        await dispatchInput(getField('passport number', 'input'), data.passportNumber, 'passportNumber');

        // Contact number: 1st input = dial code, 2nd input = phone
        await dispatchInput(getField('contact number', 'input', 1), dialCode, 'dialCode');
        await dispatchInput(getField('contact number', 'input', 2), phone, 'contactNumber');

        await dispatchInput(getField('email', 'input'), data.email || data.account, 'email');

        // Dates (skipped if the date itself was invalid; already reported above)
        if (dob) {
            await dispatchInput(document.querySelector('#dateOfBirth') || getField('date of birth', 'input'), dob, 'dateOfBirth', true);
        } else if (!data.dateOfBirth) report.empty.push('dateOfBirth');

        if (expiry) {
            await dispatchInput(getField('passport expiry date', 'input') || getField('passport expiry', 'input'), expiry, 'passportExpiry', true);
        } else if (!data.passportExpiry) report.empty.push('passportExpiry');

        // Dropdowns
        await selectDropdown('gender', gender, 'gender');
        await selectDropdown('current nationality', data.nationality, 'nationality');

        const success = !report.missing.length && !report.empty.length
            && !report.invalid.length && !report.mismatched.length;
        return { success, ...report };
    } catch (error) {
        return { success: false, error: error.message, ...report };
    }
}