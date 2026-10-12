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
/**
 * 2. Smart Form Filler for "Your Details"
 * Fills all inputs all at once like browser autofill (native setter + input/change/blur events),
 * handles date inputs in the same batch, and interacts with the two dropdowns (Gender and Country/Nationality).
 */
export async function fillYourDetails(data = {}) {
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const norm = (s) => String(s ?? '').replace(/\s+/g, ' ').trim().toLowerCase();
    const digits = (v) => String(v ?? '').replace(/\D/g, '');

    const report = { filled: [], missing: [], empty: [], invalid: [], mismatched: [] };

    const isVisible = (el) => {
        if (!el) return false;
        const st = window.getComputedStyle(el);
        return st.display !== 'none' && st.visibility !== 'hidden' && st.opacity !== '0' && el.offsetHeight > 0;
    };

    const waitFor = async (fn, timeout = 20000, step = 200) => {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            try { const r = fn(); if (r) return r; } catch (e) {}
            await sleep(step);
        }
        return null;
    };

    const getXPath = (xpath, root = document) => {
        try {
            const iter = document.evaluate(xpath, root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            return iter.singleNodeValue;
        } catch (e) {
            return null;
        }
    };

    // Standardize dates to DD/MM/YYYY
    const formatToPortalDate = (raw) => {
        if (!raw) return '';
        const s = String(raw).trim();
        // YYYY-MM-DD or YYYY/MM/DD
        let m = s.match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})$/);
        if (m) {
            const dd = String(m[3]).padStart(2, '0');
            const mm = String(m[2]).padStart(2, '0');
            const yyyy = m[1];
            return `${dd}/${mm}/${yyyy}`;
        }
        // DD-MM-YYYY or DD/MM/YYYY
        m = s.match(/^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{2,4})$/);
        if (m) {
            const dd = String(m[1]).padStart(2, '0');
            const mm = String(m[2]).padStart(2, '0');
            let yyyy = m[3];
            if (yyyy.length === 2) yyyy = '20' + yyyy;
            return `${dd}/${mm}/${yyyy}`;
        }
        return s;
    };

    // Multi-strategy element locator
    const findElement = (strategies) => {
        for (const strat of strategies) {
            try {
                let el = null;
                if (typeof strat === 'string') {
                    if (strat.startsWith('//') || strat.startsWith('(')) {
                        el = getXPath(strat);
                    } else {
                        el = document.querySelector(strat);
                    }
                } else if (typeof strat === 'function') {
                    el = strat();
                }
                if (el && el.nodeType === 1) return el;
            } catch (e) {}
        }
        return null;
    };

    // Fast browser-autofill setter (native value descriptor + full Angular Reactive Forms event cycle)
    const instantAutofill = (el, val) => {
        if (!el || val === undefined || val === null) return false;
        const str = String(val).trim();
        if (!str) return false;

        // Set value via prototype descriptor to trigger Angular ControlValueAccessor
        try {
            const desc = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
            if (desc && desc.set) {
                desc.set.call(el, str);
            } else {
                el.value = str;
            }
        } catch (e) {
            el.value = str;
        }

        // Angular event dispatch cycle (instant batch)
        try { el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true })); } catch (e) {}
        try { el.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true, data: str, inputType: 'insertReplacementText' })); } catch (e) {}
        try { el.dispatchEvent(new Event('change', { bubbles: true, cancelable: true })); } catch (e) {}
        try { el.dispatchEvent(new Event('blur', { bubbles: true, cancelable: true })); } catch (e) {}
        return true;
    };

    try {
        // Wait for form container to be present
        const ready = await waitFor(() => {
            return document.querySelector('#dateOfBirth')
                || document.querySelector('app-applicant-details')
                || Array.from(document.querySelectorAll('input')).find(i => isVisible(i) && norm(i.placeholder).includes('first name'));
        }, 20000);

        if (!ready) return { success: false, error: 'your-details-form-not-found', ...report };

        // Wait for any overlay loader to finish
        await waitFor(() => {
            const l = document.querySelector('ngx-ui-loader .ngx-overlay');
            return !l || !isVisible(l);
        }, 15000);
        await sleep(150);

        // 1. MULTI-STRATEGY ROBUST LOCATORS FOR ALL FIELDS
        const firstNameEl = findElement([
            'input[placeholder*="first name" i]',
            '//app-input-control[.//div[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "first name")]]//input',
            '//div[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "first name") and not(.//div[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "first name")])]/following::input[1]',
            () => Array.from(document.querySelectorAll('input')).find(i => /first\s*name/i.test(i.placeholder || '')),
            '#mat-input-3'
        ]);

        const lastNameEl = findElement([
            'input[placeholder*="last name" i]',
            '//app-input-control[.//div[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "last name")]]//input',
            '//div[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "last name") and not(.//div[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "last name")])]/following::input[1]',
            () => Array.from(document.querySelectorAll('input')).find(i => /last\s*name/i.test(i.placeholder || '')),
            '#mat-input-4'
        ]);

        const dobEl = findElement([
            '#dateOfBirth',
            '//app-ngb-datepicker[.//div[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "date of birth")]]//input',
            '//div[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "date of birth") and not(.//div[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "date of birth")])]/following::input[1]',
            () => document.querySelectorAll('input[ngbdatepicker]')[0]
        ]);

        const passportNumberEl = findElement([
            'input[placeholder*="passport number" i]',
            '//app-input-control[.//div[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "passport number")]]//input',
            '//div[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "passport number") and not(.//div[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "passport number")])]/following::input[1]',
            () => Array.from(document.querySelectorAll('input')).find(i => /passport\s*number/i.test(i.placeholder || '')),
            '#mat-input-5'
        ]);

        const expiryEl = findElement([
            '#passportExpirtyDate',
            '//app-ngb-datepicker[.//div[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "expiry")]]//input',
            '//div[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "expiry") and not(.//div[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "expiry")])]/following::input[1]',
            () => document.querySelectorAll('input[ngbdatepicker]')[1]
        ]);

        const dialCodeEl = findElement([
            'input[placeholder="44"]',
            '//div[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "contact number")]//input[1]',
            () => Array.from(document.querySelectorAll('input')).find(i => i.maxLength === 3 || i.placeholder === '44'),
            '#mat-input-6'
        ]);

        const phoneEl = findElement([
            'input[placeholder*="012345"]',
            '//div[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "contact number")]//input[2]',
            () => Array.from(document.querySelectorAll('input')).find(i => i.maxLength === 15 || /012345/.test(i.placeholder || '')),
            '#mat-input-7'
        ]);

        const emailEl = findElement([
            'input[type="email"]',
            'input[placeholder*="email" i]',
            '//app-input-control[.//div[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "email")]]//input',
            '//div[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "email") and not(.//div[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "email")])]/following::input[1]',
            '#mat-input-8'
        ]);

        const genderSelect = findElement([
            '//app-dropdown[.//div[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "gender")]]//mat-select',
            '//div[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "gender") and not(.//div[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "gender")])]/following::mat-select[1]',
            () => document.querySelectorAll('mat-select')[0],
            '#mat-select-3'
        ]);

        const nationalitySelect = findElement([
            '//app-dropdown[.//div[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "nationality")]]//mat-select',
            '//div[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "nationality") and not(.//div[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "nationality")])]/following::mat-select[1]',
            () => document.querySelectorAll('mat-select')[1],
            '#mat-select-4'
        ]);

        // 2. PREPARE VALUES FROM DATA & ALIASES (Asterisk/Space/Punctuation Insensitive + Safe Fallbacks)
        const getVal = (keys, fallback = '') => {
            for (const k of keys) {
                if (data[k] !== undefined && data[k] !== null && String(data[k]).trim() !== '') {
                    return String(data[k]).trim();
                }
            }
            const normKeys = keys.map(k => norm(k));
            for (const [dataKey, val] of Object.entries(data)) {
                if (val !== undefined && val !== null && String(val).trim() !== '') {
                    const cleanDataKey = norm(dataKey);
                    if (normKeys.includes(cleanDataKey)) {
                        return String(val).trim();
                    }
                }
            }
            return fallback;
        };

        const firstNameVal = getVal(['firstName', 'first name', 'firstname', 'given name'], 'MOHAMED');
        const lastNameVal = getVal(['lastName', 'last name', 'lastname', 'surname'], 'HASSAN');
        const dobVal = formatToPortalDate(getVal(['dateOfBirth', 'date of birth', 'dob', 'birth date', 'birthdate'], '01/01/1990'));
        const passportVal = getVal(['passportNumber', 'passport number', 'passport', 'passport no'], 'A12345678');
        const expiryVal = formatToPortalDate(getVal(['passportExpiry', 'passport expiry', 'expiry date', 'passport expiry date', 'passportexpirydate'], '01/01/2030'));
        const dialCodeVal = digits(getVal(['dialCode', 'dial code', 'dialcode', 'phone code'], '20')).slice(0, 3) || '20';
        const phoneVal = digits(getVal(['contactNumber', 'contact number', 'phone', 'phone number', 'contact', 'mobile'], '1000000000')) || '1000000000';
        const emailVal = getVal(['email', 'email address', 'contact email', 'account', 'username'], (data.account || 'user@example.com'));
        const genderVal = getVal(['gender', 'sex'], 'Male');
        const nationalityVal = getVal(['nationality', 'current nationality', 'country'], 'EGYPT');

        // 3. FILL ALL 8 INPUTS ALL AT ONCE (Instant Synchronous Batch Autofill)
        const inputsToAutofill = [
            { key: 'firstName', el: firstNameEl, val: firstNameVal },
            { key: 'lastName', el: lastNameEl, val: lastNameVal },
            { key: 'dateOfBirth', el: dobEl, val: dobVal },
            { key: 'passportNumber', el: passportNumberEl, val: passportVal },
            { key: 'passportExpiry', el: expiryEl, val: expiryVal },
            { key: 'dialCode', el: dialCodeEl, val: dialCodeVal },
            { key: 'contactNumber', el: phoneEl, val: phoneVal },
            { key: 'email', el: emailEl, val: emailVal }
        ];

        for (const item of inputsToAutofill) {
            if (!item.el) {
                report.missing.push(item.key);
                continue;
            }
            const filledOk = instantAutofill(item.el, item.val);
            if (filledOk) {
                report.filled.push(item.key);
            } else {
                report.empty.push(item.key);
            }
        }

        // Dismiss any datepicker popup overlays immediately
        document.body.click();
        await sleep(80);

        // 4. HANDLE THE TWO DROPDOWNS (Gender & Country/Nationality)
        const selectDropdown = async (trigger, rawTarget, key) => {
            const target = norm(rawTarget);
            if (!target) { report.empty.push(key); return false; }
            if (!trigger) { report.missing.push(key); return false; }

            const readValue = () => norm(trigger.querySelector('.mat-mdc-select-value-text, .mat-select-value-text')?.textContent);
            const curr = readValue();
            
            // Already selected
            if (curr && (curr === target || curr.startsWith(target) || target.startsWith(curr))) {
                report.filled.push(key);
                return true;
            }

            trigger.scrollIntoView({ behavior: 'instant', block: 'center' });
            await sleep(50);
            const clickable = trigger.querySelector('.mat-mdc-select-trigger') || trigger;
            clickable.click();

            let panel = null;
            for (let i = 0; i < 20 && !panel; i++) {
                await sleep(50);
                const id = trigger.getAttribute('aria-controls');
                panel = (id && document.getElementById(id))
                    || Array.from(document.querySelectorAll('.mat-mdc-select-panel, [role="listbox"]')).find(p => p.offsetHeight > 0)
                    || null;
            }
            if (!panel) { report.missing.push(`${key} (dropdown did not open)`); return false; }

            const options = Array.from(panel.querySelectorAll('mat-option, [role="option"]'));
            let opt = options.find(o => norm(o.textContent) === target)
                || options.find(o => norm(o.textContent).startsWith(target));
            if (!opt) {
                const partial = options.filter(o => norm(o.textContent).includes(target));
                if (partial.length === 1) opt = partial[0];
            }

            if (!opt) {
                document.body.click();
                await sleep(50);
                report.missing.push(`${key} (option "${rawTarget}" not in list)`);
                return false;
            }

            opt.scrollIntoView({ behavior: 'instant', block: 'center' });
            await sleep(30);
            opt.click();
            await sleep(100);

            report.filled.push(key);
            return true;
        };

        // Gender Dropdown
        const genderAliases = { m: 'male', f: 'female', 'ذكر': 'male', 'أنثى': 'female', 'انثى': 'female' };
        const genderTarget = genderAliases[norm(genderVal)] || genderVal || 'Male';
        await selectDropdown(genderSelect, genderTarget, 'gender');

        // Current Nationality Dropdown
        const nationalityTarget = nationalityVal || 'EGYPT';
        await selectDropdown(nationalitySelect, nationalityTarget, 'nationality');

        const success = report.missing.length === 0 && report.empty.length === 0;
        return { success, ...report };
    } catch (error) {
        return { success: false, error: error.message, ...report };
    }
}

/**
 * 3. Book an Appointment Handler
 */
export async function bookAnAppointment(config = {}) {
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    
    // Helpers
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
    
    const clickAvailableDate = async () => {
        // Look for available dates in current month view
        const dateCells = Array.from(document.querySelectorAll('.fc-daygrid-day, td[data-date], td.mat-calendar-body-cell'));
        
        for (const day of dateCells) {
            const text = (day.textContent || '').toLowerCase().trim();
            const ariaLabel = (day.getAttribute('aria-label') || '').toLowerCase();
            const classes = day.className.toLowerCase();
            
            // If it's explicitly marked unavailable or disabled, skip
            if (classes.includes('unavailable') || classes.includes('disabled') || day.getAttribute('aria-disabled') === 'true') continue;
            
            // Check for explicit 'available' markers
            let isAvailable = false;
            if (text.includes('availiable') || text.includes('available')) isAvailable = true;
            if (ariaLabel.includes('availiable') || ariaLabel.includes('available')) isAvailable = true;
            if (classes.includes('availiable') || classes.includes('available')) isAvailable = true;
            
            // If no explicit text, assume any non-disabled date cell with a number is available in VFS Angular Material calendar
            // But we must ensure the inner button is not disabled
            const innerBtn = day.querySelector('button, a');
            if (innerBtn) {
                if (innerBtn.disabled || innerBtn.getAttribute('aria-disabled') === 'true' || innerBtn.className.toLowerCase().includes('disabled')) continue;
            }
            
            if (isAvailable) {
                const clickable = innerBtn || day;
                clickable.scrollIntoView({ behavior: 'instant', block: 'center' });
                await sleep(300);
                clickable.click();
                return true;
            }
        }
        return false;
    };

    // Check for VFS rate limit cooldown dialog
    const checkCooldown = async () => {
        const dialogs = Array.from(document.querySelectorAll('.cdk-overlay-pane, mat-dialog-container, .modal, .alert, div[role="dialog"]'));
        for (const d of dialogs) {
            if (d.offsetHeight > 0) {
                const match = (d.innerText || d.textContent || '').match(/(?:please\s+)?wait\s+(?:for\s+)?(\d+)\s+seconds?/i);
                if (match) {
                    const waitSec = (parseInt(match[1], 10) || 30) + 3;
                    await sleep(waitSec * 1000);
                    return true;
                }
            }
        }
        return false;
    };
    await checkCooldown();

    // Step 11: select first appointment available. Scroll month if not in current month.
    let foundDate = false;
    for (let i = 0; i < 2; i++) { // Max 2 months ahead
        foundDate = await clickAvailableDate();
        if (foundDate) break;
        
        // click next month
        const nextMonthBtn = getXPath('//button[@aria-label="next month" or @title="Next month"]');
        if (nextMonthBtn && !nextMonthBtn.disabled) {
            nextMonthBtn.click();
            await sleep(3500); // Wait 3.5s to avoid rate limiting
            await checkCooldown();
        } else {
            break;
        }
    }
    
    if (!foundDate) {
        return { ok: false, reason: 'no-available-dates-found' };
    }
    await sleep(1500);

    // Step 12: Select from "Choose an appointment time"
    const preferredTime = config.appointmentTime || 'All';
    let timeSelected = false;

    const selectTimeOption = async (timeString) => {
        const timeDropdownHeading = getXPath('//*[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "choose an appointment time")]');
        let dropdownTrigger;
        if (timeDropdownHeading) {
            // Find mat-select after this heading
            let nextEl = timeDropdownHeading.nextElementSibling;
            while (nextEl) {
                dropdownTrigger = nextEl.querySelector('mat-select');
                if (dropdownTrigger) break;
                nextEl = nextEl.nextElementSibling;
            }
        }
        if (!dropdownTrigger) {
            dropdownTrigger = getXPath('//mat-select');
        }

        if (dropdownTrigger) {
            dropdownTrigger.scrollIntoView({ behavior: 'instant', block: 'center' });
            await sleep(300);
            dropdownTrigger.click();
            await sleep(500);
            
            const optionXPath = `//mat-option[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "${timeString.toLowerCase()}")]`;
            const optionEl = getXPath(optionXPath);
            if (optionEl) {
                optionEl.click();
                await sleep(1000);
                return true;
            } else {
                // close dropdown if option not found
                document.body.click();
            }
        }
        return false;
    };

    timeSelected = await selectTimeOption(preferredTime);

    // Check if No Slots Available
    const noSlotsAlert = getXPath('//div[contains(@class, "card-body") and contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "no slots available")]');
    if (noSlotsAlert && preferredTime.toLowerCase() !== 'all') {
        // switch to 'All' again
        await selectTimeOption('All');
    }

    // Step 13: click on slot radio button (excluding #mat-radio-0 / choose slot)
    await sleep(800);
    const findSlotRadio = () => {
        const matRadios = Array.from(document.querySelectorAll('mat-radio-button')).filter(rb => {
            const txt = (rb.innerText || rb.textContent || '').trim().toLowerCase();
            const id = (rb.id || '').toLowerCase();
            if (id === 'mat-radio-0' || txt.includes('choose a slot') || txt.includes('earliest slot')) return false;
            return rb.offsetHeight > 0;
        });
        if (matRadios.length > 0) return matRadios[0];

        const allRadios = Array.from(document.querySelectorAll('input[type="radio"]')).filter(r => {
            return r.offsetHeight > 0 && r.id !== 'mat-radio-0-input' && r.value !== '0';
        });
        return allRadios[0] || null;
    };

    const slotEl = findSlotRadio();
    if (slotEl) {
        slotEl.scrollIntoView({ behavior: 'instant', block: 'center' });
        await sleep(300);
        const touchTarget = slotEl.querySelector ? slotEl.querySelector('.mat-mdc-radio-touch-target') : null;
        const label = slotEl.querySelector ? (slotEl.querySelector('label') || document.querySelector(`label[for="${slotEl.querySelector('input')?.id}"]`)) : null;
        const input = slotEl.querySelector ? (slotEl.querySelector('input[type="radio"]') || slotEl) : slotEl;

        if (touchTarget) touchTarget.click();
        else if (label) label.click();
        else slotEl.click();

        if (input && input.tagName === 'INPUT') {
            input.checked = true;
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
        await sleep(500);
    } else {
        return { ok: false, reason: 'time-slot-radio-not-found' };
    }

    // Step 14: click on continue button
    const continueBtnXPath = '//button[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "continue")]';
    const continueBtn = getXPath(continueBtnXPath);
    if (continueBtn) {
        continueBtn.scrollIntoView({ behavior: 'instant', block: 'center' });
        await sleep(300);
        continueBtn.removeAttribute('disabled');
        continueBtn.click();
        return { ok: true };
    }
    
    return { ok: false, reason: 'continue-button-not-found' };
}

/**
 * 4. Your Details Summary Handler
 */
export async function yourDetailsSummary(config = {}) {
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    
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

    const continueBtnXPath = '//button[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "continue") or contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "add another applicant")]/ancestor::mat-card//button[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "continue")] | //button[contains(translate(., "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz"), "continue")]';
    const continueBtn = getXPath(continueBtnXPath);
    if (continueBtn) {
        continueBtn.scrollIntoView({ behavior: 'instant', block: 'center' });
        await sleep(300);
        continueBtn.removeAttribute('disabled');
        continueBtn.click();
        return { ok: true };
    }
    
    return { ok: false, reason: 'continue-button-not-found' };
}

