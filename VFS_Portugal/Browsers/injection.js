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
 * 2. Your Details Form Filler
 *
 * Runs inside page.evaluate(fillYourDetails, data) so EVERYTHING must live inside this function.
 *
 * - Fields are filled in the same top-to-bottom order a person would use, with a RANDOM pause
 *   (data.fieldDelayMin..fieldDelayMax ms, default 400..1500) after every field, plus an occasional
 *   longer "thinking" pause. Typing speed per character is random as well.
 * - Fields that already hold the right value are skipped (a retry only touches what failed).
 * - Dates accept DD/MM/YYYY, D/M/YY, YYYY-MM-DD ... and are written as data.dateFormat (default DD/MM/YYYY).
 * - Returns { success, filled, missing, empty, invalid, mismatched } - never fails silently.
 *
 * Data keys: firstName, lastName, gender, dateOfBirth, nationality, passportNumber, passportExpiry,
 * dialCode, contactNumber, email|account, inputMethod, dateFormat, dateOrder ('DMY' | 'MDY'),
 * fieldDelayMin, fieldDelayMax.
 */
export async function fillYourDetails(data = {}) {
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
    const norm = (s) => String(s ?? '').replace(/\s+/g, ' ').trim().toLowerCase();

    let baseMethod = String(data.inputMethod || 'fill').toLowerCase();
    if (!['typing', 'paste', 'fill', 'random'].includes(baseMethod)) baseMethod = 'fill';
    const pickMethod = () => (baseMethod === 'random' ? ['typing', 'paste', 'fill'][rand(0, 2)] : baseMethod);

    const dateFormat = String(data.dateFormat || 'DD/MM/YYYY').toUpperCase();
    const dateOrder = String(data.dateOrder || 'DMY').toUpperCase();

    const delayMin = Math.max(0, parseInt(data.fieldDelayMin, 10) || 400);
    const delayMax = Math.max(delayMin, parseInt(data.fieldDelayMax, 10) || 1500);
    const humanPause = async () => {
        let ms = rand(delayMin, delayMax);
        if (Math.random() < 0.15) ms += rand(400, 1200); // occasional "thinking" pause
        await sleep(ms);
    };

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

    /**
     * Turns many date spellings into data.dateFormat. Returns null if it cannot be understood.
     *  - 4-digit year first (YYYY-MM-DD) is unambiguous
     *  - 2-digit years are expanded: DOB  -> 89 = 1989, 05 = 2005 ; expiry -> always 20xx
     *  - if one part is > 12 the day/month order is inferred, otherwise data.dateOrder (default DMY) is used
     */
    const normalizeDate = (raw, kind) => {
        const s = String(raw ?? '').trim();
        let d, m, y, mt;
        if ((mt = s.match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})$/))) {
            y = +mt[1]; m = +mt[2]; d = +mt[3];
        } else if ((mt = s.match(/^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{2}|\d{4})$/))) {
            let a = +mt[1], b = +mt[2];
            y = +mt[3];
            if (mt[3].length === 2) {
                const cur = new Date().getFullYear() % 100;
                if (kind === 'dob') y += (y <= cur ? 2000 : 1900);
                else y += 2000;
            }
            if (a > 12 && b <= 12) { d = a; m = b; }
            else if (b > 12 && a <= 12) { m = a; d = b; }
            else if (dateOrder === 'MDY') { m = a; d = b; }
            else { d = a; m = b; }
        } else return null;
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

        // Already correct (e.g. on a retry): leave it alone
        if (norm(el.value) === norm(val) && !el.classList.contains('ng-invalid')) {
            report.filled.push(key);
            return true;
        }

        const method = pickMethod();
        el.scrollIntoView({ behavior: 'instant', block: 'center' });
        el.focus();
        el.click();
        await sleep(rand(80, 250));

        setNativeValue(el, '');
        fire(el, 'input');

        if (method === 'typing') {
            for (const char of val) {
                el.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
                el.dispatchEvent(new KeyboardEvent('keypress', { key: char, bubbles: true }));
                setNativeValue(el, el.value + char);
                fire(el, 'input');
                el.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true }));
                await sleep(rand(40, 140));
            }
        } else if (method === 'paste') {
            try {
                const dt = new DataTransfer();
                dt.setData('text/plain', val);
                el.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: dt }));
            } catch (e) {}
            setNativeValue(el, val);
            fire(el, 'input');
            await sleep(rand(30, 90));
        } else { // fill
            setNativeValue(el, val);
            fire(el, 'input');
            await sleep(rand(20, 60));
        }

        fire(el, 'change');
        fire(el, 'blur');
        el.blur();
        if (isDate) {
            document.body.click(); // dismiss the ngb datepicker popup if it opened
            await sleep(250);
        } else {
            await sleep(120);
        }

        let ok = true;
        if (norm(el.value) !== norm(val)) {
            report.mismatched.push(`${key} (wanted "${val}", got "${el.value}")`);
            ok = false;
        } else if (el.classList.contains('ng-invalid')) {
            report.invalid.push(key);
            ok = false;
        } else {
            report.filled.push(key);
        }

        await humanPause(); // random gap before the next field
        return ok;
    };

    const selectDropdown = async (labelText, rawTarget, key) => {
        const target = norm(rawTarget);
        if (!target) { report.empty.push(key); return false; }

        const trigger = getField(labelText, 'mat-select');
        if (!trigger) { report.missing.push(key); return false; }

        const readValue = () => norm(trigger.querySelector('.mat-mdc-select-value-text')?.textContent);
        if (readValue() === target) { report.filled.push(key); return true; }

        trigger.scrollIntoView({ behavior: 'instant', block: 'center' });
        await sleep(rand(80, 250));
        (trigger.querySelector('.mat-mdc-select-trigger') || trigger).click();

        let panel = null;
        for (let i = 0; i < 20 && !panel; i++) {
            await sleep(150);
            const id = trigger.getAttribute('aria-controls');
            panel = (id && document.getElementById(id))
                || Array.from(document.querySelectorAll('.mat-mdc-select-panel, [role="listbox"]')).find(isVisible)
                || null;
        }
        if (!panel) { report.missing.push(`${key} (dropdown did not open)`); return false; }

        await sleep(rand(250, 600)); // "looking" at the list
        const options = Array.from(panel.querySelectorAll('mat-option'));
        let opt = options.find(o => norm(o.textContent) === target)
            || options.find(o => norm(o.textContent).startsWith(target));
        if (!opt) {
            const partial = options.filter(o => norm(o.textContent).includes(target));
            if (partial.length === 1) opt = partial[0];
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

        let ok = true;
        if (readValue() !== norm(opt.textContent)) {
            report.mismatched.push(`${key} (wanted "${rawTarget}", got "${readValue()}")`);
            ok = false;
        } else {
            report.filled.push(key);
        }
        await humanPause();
        return ok;
    };

    // ---------- main ----------
    try {
        const ready = await waitFor(() => document.querySelector('#dateOfBirth') || findLabels('first name').length, 20000);
        if (!ready) return { success: false, error: 'your-details-form-not-found', ...report };

        await waitFor(() => {
            const l = document.querySelector('ngx-ui-loader .ngx-overlay');
            return !l || !isVisible(l);
        }, 15000);
        await sleep(rand(300, 900));

        const digits = (v) => String(v ?? '').replace(/\D/g, '');
        const dialCode = digits(data.dialCode).slice(0, 3);
        const phone = digits(data.contactNumber);

        const genderAliases = { m: 'male', f: 'female', 'ذكر': 'male', 'أنثى': 'female', 'انثى': 'female' };
        const gender = genderAliases[norm(data.gender)] || data.gender;

        const dob = data.dateOfBirth ? normalizeDate(data.dateOfBirth, 'dob') : '';
        const expiry = data.passportExpiry ? normalizeDate(data.passportExpiry, 'expiry') : '';
        if (data.dateOfBirth && !dob) report.invalid.push(`dateOfBirth (unrecognized date "${data.dateOfBirth}")`);
        if (data.passportExpiry && !expiry) report.invalid.push(`passportExpiry (unrecognized date "${data.passportExpiry}")`);

        const dobEl = () => document.querySelector('#dateOfBirth') || getField('date of birth', 'input');
        const expiryEl = () => getField('passport expiry date', 'input') || getField('passport expiry', 'input');

        // Same order as the page, top to bottom
        await dispatchInput(getField('first name', 'input'), data.firstName, 'firstName');
        await dispatchInput(getField('last name', 'input'), data.lastName, 'lastName');
        await selectDropdown('gender', gender, 'gender');

        if (dob) await dispatchInput(dobEl(), dob, 'dateOfBirth', true);
        else if (!data.dateOfBirth) report.empty.push('dateOfBirth');

        await selectDropdown('current nationality', data.nationality, 'nationality');
        await dispatchInput(getField('passport number', 'input'), data.passportNumber, 'passportNumber');

        if (expiry) await dispatchInput(expiryEl(), expiry, 'passportExpiry', true);
        else if (!data.passportExpiry) report.empty.push('passportExpiry');

        // Contact number: 1st input = dial code, 2nd input = phone
        await dispatchInput(getField('contact number', 'input', 1), dialCode, 'dialCode');
        await dispatchInput(getField('contact number', 'input', 2), phone, 'contactNumber');
        await dispatchInput(getField('email', 'input'), data.email || data.account, 'email');

        const success = !report.missing.length && !report.empty.length
            && !report.invalid.length && !report.mismatched.length;
        return { success, ...report };
    } catch (error) {
        return { success: false, error: error.message, ...report };
    }
}
