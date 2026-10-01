/* Omni-Booking-Automation-Suite/VFS_Portugal/Browsers/injection.js */

/**
 * Universal Selectors for Sign-in, Cookie banners, and Cloudflare Turnstile
 */
export const signInSelectors = {
  cookieAccept: [
    '#onetrust-accept-btn-handler',
    'button#onetrust-accept-btn-handler',
    '//button[@id="onetrust-accept-btn-handler"]',
    '#onetrust-banner-sdk button',
  ],
  cookieBanner: [
    '#onetrust-banner-sdk',
    'div[id="onetrust-consent-sdk"]',
    '.onetrust-pc-dark-filter',
  ],
  email: [
    'input#email',
    'input[formcontrolname="username"]',
    'input[placeholder="jane.doe@email.com"]',
    'input[type="email"]',
    'input[name="email"]',
  ],
  password: [
    'input#password',
    'input[formcontrolname="password"]',
    'input[placeholder="**********"]',
    'input[type="password"]',
    'input[name="password"]',
  ],
  submit: [
    'button[mat-stroked-button]',
    'button.mat-mdc-outlined-button.btn-brand-orange',
    'button[type="submit"]',
    '//button[contains(., "Sign In")]',
  ],
  submitText: ['Sign In', 'Sign in', 'Log In'],
  captchaContainer: [
    'app-cloudflare-captcha-container',
    'div[appcloudflarerecaptcha]',
    'iframe[src*="challenges.cloudflare.com"]',
  ],
  captchaResponseInput: [
    'input[name="cf-turnstile-response"]',
    'input#cf-chl-widget-zbnd6_response',
  ],
};

/**
 * Core Sign-in Implementation
 * Runs inside the browser DOM context via page.evaluate() or window.chromeWorker.signin().
 * 
 * @param {{ account: string, email?: string, password: string, selectors?: object, inputMethod?: string }} config
 * @returns {Promise<{ ok: boolean, reason?: string, captcha?: string, method?: string }>}
 */
export async function injectionSignIn(config = {}) {
  const account = config.account || config.email || '';
  const password = config.password || '';
  const S = config.selectors || signInSelectors;
  
  let rawMethod = (config.inputMethod || config.fillMode || config.typingMode || 'fill').toLowerCase();
  const validMethods = ['typing', 'paste', 'fill', 'random'];
  if (!validMethods.includes(rawMethod)) rawMethod = 'fill';

  // Resolve 'random' into an actual mode for this run
  let method = rawMethod;
  if (method === 'random') {
    const pool = ['typing', 'paste', 'fill'];
    method = pool[Math.floor(Math.random() * pool.length)];
  }

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const randomDelay = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const getFirstVisible = (selectors) => {
    const list = Array.isArray(selectors) ? selectors : [selectors];
    for (const sel of list) {
      if (!sel) continue;
      let el = null;
      try {
        if (sel.startsWith('//')) {
          el = document.evaluate(sel, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        } else {
          el = document.querySelector(sel);
        }
      } catch {
        continue;
      }
      if (!el) continue;
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || el.offsetHeight === 0) continue;
      return el;
    }
    return null;
  };

  // --- 1. ACCEPT COOKIES ---
  try {
    const acceptBtn = getFirstVisible(S.cookieAccept || []);
    if (acceptBtn) {
      acceptBtn.scrollIntoView({ behavior: 'instant', block: 'center' });
      acceptBtn.click();
      await sleep(800);
    } else {
      const labels = ['accept all cookies', 'accept all', 'accept'];
      const buttons = Array.from(document.querySelectorAll('button, a[role="button"]'));
      const textMatch = buttons.find((btn) => {
        const text = (btn.innerText || btn.textContent || '').trim().toLowerCase();
        return labels.includes(text) && btn.offsetHeight > 0;
      });
      if (textMatch) {
        textMatch.click();
        await sleep(800);
      }
    }
  } catch {
    // Cookie banner failure is non-fatal
  }

  // --- 2. CLOUDFLARE CAPTCHA INSPECTION ---
  let captchaState = 'absent';
  try {
    const containers = S.captchaContainer || [];
    const hasContainer = containers.some((sel) => {
      try {
        return !!document.querySelector(sel);
      } catch {
        return false;
      }
    });

    const tokenSelectors = S.captchaResponseInput || [];
    let token = '';
    for (const sel of tokenSelectors) {
      try {
        const inp = document.querySelector(sel);
        if (inp && inp.value && inp.value.trim().length > 20) {
          token = inp.value;
          break;
        }
      } catch {
        // Ignore evaluation errors
      }
    }

    if (hasContainer) {
      captchaState = token ? 'solved' : 'pending';
      if (!token) {
        const cfFrame = document.querySelector('iframe[src*="challenges.cloudflare.com"]');
        const holder = cfFrame ? (cfFrame.closest('div') || cfFrame) : getFirstVisible(containers);
        if (holder && holder.scrollIntoView) {
          holder.scrollIntoView({ behavior: 'instant', block: 'center' });
        }
      }
    }
  } catch {
    // Captcha detection failure is non-fatal
  }

  // --- 3. INPUT DISPATCHING & FORM FILLING ---
  const fireInputEvents = (el) => {
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new Event('blur', { bubbles: true }));
    el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
    el.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }));
  };

  const setNativeValue = (el, value) => {
    const proto = el.tagName === 'TEXTAREA'
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
    const desc = Object.getOwnPropertyDescriptor(proto, 'value');
    if (desc && desc.set) {
      desc.set.call(el, value);
    } else {
      el.value = value;
    }
    fireInputEvents(el);
  };

  // Mode A: Letter-by-letter with human cadence
  const applyTyping = async (el, value) => {
    el.focus();
    el.click();
    setNativeValue(el, '');

    for (const char of value) {
      el.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
      el.dispatchEvent(new KeyboardEvent('keypress', { key: char, bubbles: true }));
      setNativeValue(el, (el.value || '') + char);
      el.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true }));
      await sleep(randomDelay(40, 120));
    }
    fireInputEvents(el);
  };

  // Mode B: Simulate native clipboard paste
  const applyPaste = async (el, value) => {
    el.focus();
    el.click();
    setNativeValue(el, '');

    try {
      const dt = new DataTransfer();
      dt.setData('text/plain', value);
      const pasteEvent = new ClipboardEvent('paste', {
        bubbles: true,
        cancelable: true,
        clipboardData: dt,
      });
      const handled = el.dispatchEvent(pasteEvent);
      if (handled) {
        setNativeValue(el, value);
      }
    } catch {
      setNativeValue(el, value);
    }
    await sleep(60);
    fireInputEvents(el);
  };

  // Mode C: Instantaneous framework fill
  const applyFill = async (el, value) => {
    el.focus();
    setNativeValue(el, '');
    setNativeValue(el, value);
    await sleep(50);
  };

  const dispatchInput = async (el, value) => {
    if (method === 'typing') return applyTyping(el, value);
    if (method === 'paste') return applyPaste(el, value);
    return applyFill(el, value);
  };

  const emailEl = getFirstVisible(S.email || []);
  const passEl = getFirstVisible(S.password || []);

  if (!emailEl) return { ok: false, reason: 'email-input-not-found', captcha: captchaState, method };
  if (!passEl) return { ok: false, reason: 'password-input-not-found', captcha: captchaState, method };

  emailEl.scrollIntoView({ behavior: 'instant', block: 'center' });
  await dispatchInput(emailEl, account);
  await sleep(randomDelay(150, 350));

  passEl.scrollIntoView({ behavior: 'instant', block: 'center' });
  await dispatchInput(passEl, password);
  await sleep(randomDelay(200, 400));

  // Verify inputs were retained by Angular change detection
  const isCorrect = (el, expected) => (el.value || '') === expected;
  if (!isCorrect(emailEl, account) || !isCorrect(passEl, password)) {
    setNativeValue(emailEl, account);
    setNativeValue(passEl, password);
    if (!isCorrect(emailEl, account) || !isCorrect(passEl, password)) {
      return { ok: false, reason: 'validation-failed', captcha: captchaState, method };
    }
  }

  // --- 4. SUBMIT FORM ---
  let submitBtn = getFirstVisible(S.submit || []);
  if (!submitBtn) {
    const candidates = (S.submitText || []).map((t) => t.toLowerCase());
    const allButtons = Array.from(document.querySelectorAll('button, input[type="submit"]'));
    submitBtn = allButtons.find((btn) => {
      const text = ((btn.innerText || btn.textContent || btn.value) || '').trim().toLowerCase();
      return candidates.some((c) => text.includes(c)) && btn.offsetHeight > 0;
    }) || null;
  }

  if (!submitBtn) {
    return { ok: false, reason: 'submit-button-not-found', captcha: captchaState, method };
  }

  submitBtn.scrollIntoView({ behavior: 'instant', block: 'center' });
  await sleep(300);

  if (!submitBtn.disabled) {
    submitBtn.click();
    return { ok: true, captcha: captchaState, method };
  }

  return { ok: false, reason: 'submit-button-disabled', captcha: captchaState, method };
}

// Global aliases for DOM-level execution
export const signin = injectionSignIn;

/**
 * Self-executing Browser Automation Runtime
 * Attaches methods to window.chromeWorker and manages title/DOM automation.
 */
(function initializeInjectionRuntime() {
  if (typeof window === 'undefined') return;

  // Expose methods on window.chromeWorker for DOM callers
  window.chromeWorker = window.chromeWorker || {};
  window.chromeWorker.signin = injectionSignIn;
  window.chromeWorker.sginin = injectionSignIn;

  if (window.__VFS_BOT_INJECTED__) return;
  window.__VFS_BOT_INJECTED__ = true;

  const config = window.BOT_CONFIG || {};

  // Module 1: Continuous Page Title Modifier
  const updateTitle = () => {
    const prefix = `[${config.account || 'BOT'}] `;
    if (document.title && !document.title.startsWith(prefix)) {
      document.title = prefix + document.title.replace(/^\[.*?\]\s*/, '');
    }
  };

  const titleEl = document.querySelector('title');
  if (titleEl) {
    new MutationObserver(updateTitle).observe(titleEl, { childList: true, characterData: true, subtree: true });
  }
  setInterval(updateTitle, 1000);

  // Module 2: Background Angular DOM Automator
  setInterval(() => {
    // View A: Dashboard
    const startBtn = Array.from(document.querySelectorAll('button')).find(
      (b) => b.innerText && b.innerText.includes('Start New Booking')
    );
    if (startBtn && !startBtn.disabled && window.getComputedStyle(startBtn).display !== 'none') {
      startBtn.click();
    }

    // View B: Appointment Details Stepper Dropdowns
    const header = document.querySelector('h1');
    if (header && header.innerText.includes('Appointment Details')) {
      const selectDropdown = (formControlName, targetText) => {
        if (!targetText) return false;
        const trigger = document.querySelector(`mat-select[formcontrolname="${formControlName}"]`);
        if (!trigger) return false;

        const valueSpan = trigger.querySelector('.mat-mdc-select-value-text');
        const currentValue = valueSpan ? valueSpan.innerText : '';
        if (currentValue.toLowerCase().includes(targetText.toLowerCase())) {
          return true;
        }

        const panelId = trigger.getAttribute('aria-controls');
        const panel = document.getElementById(panelId);
        if (!panel) {
          trigger.click();
        } else {
          const options = Array.from(panel.querySelectorAll('mat-option'));
          const targetOpt = options.find((opt) => opt.innerText.toLowerCase().includes(targetText.toLowerCase()));
          if (targetOpt) {
            targetOpt.click();
          }
        }
        return false;
      };

      const isCenterDone = selectDropdown('centerCode', config.city);
      if (isCenterDone) {
        const isCatDone = selectDropdown('selectedSubvisaCategory', config.appointmentCategory);
        if (isCatDone) {
          const isSubCatDone = selectDropdown('visaCategoryCode', config.subCategory);
          if (isSubCatDone) {
            const continueBtn = Array.from(document.querySelectorAll('button')).find(
              (b) => b.innerText && b.innerText.includes('Continue')
            );
            if (continueBtn && !continueBtn.disabled) {
              continueBtn.click();
            }
          }
        }
      }
    }
  }, 1500);
})();

export default { signInSelectors, injectionSignIn, signin };