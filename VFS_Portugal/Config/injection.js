/* Omni-Booking-Automation-Suite/VFS_Portugal/Config/injection.js */

/**
 * Selectors used by the injected sign-in routine.
 * Kept here (per spec: selectors provided in config/injection.js) and
 * mirrored from Config/staticSelectors.js + Config/selectors.js.
 */
export const signInSelectors = {
  cookieAccept: [
    '#onetrust-accept-btn-handler',
    'button#onetrust-accept-btn-handler',
    '#onetrust-banner-sdk button',
  ],
  cookieBanner: ['#onetrust-banner-sdk', 'div[id="onetrust-consent-sdk"]'],
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
 * Runs INSIDE the browser context via page.evaluate(injectionSignIn, {...}).
 * Must stay fully self-contained (no outer-scope references).
 *
 * @param {{ account: string, password: string, selectors?: object, inputMethod?: string }} config
 * @returns {Promise<{ ok: boolean, reason?: string, captcha?: string, method?: string }>}
 */
export async function injectionSignIn(config) {
  const cfg = config || {};
  const account = cfg.account || '';
  const password = cfg.password || '';
  const S = cfg.selectors || {};
  let inputMethod = (cfg.inputMethod || 'fill').toLowerCase();
  const VALID = ['typing', 'paste', 'fill', 'random'];
  if (!VALID.includes(inputMethod)) inputMethod = 'fill';
  // 'random': pick per execution
  let method = inputMethod;
  if (method === 'random') {
    const pool = ['typing', 'paste', 'fill'];
    method = pool[Math.floor(Math.random() * pool.length)];
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const firstVisible = (selectors) => {
    const list = Array.isArray(selectors) ? selectors : [selectors];
    for (const sel of list) {
      if (!sel) continue;
      let el = null;
      try {
        el = document.querySelector(sel);
      } catch { continue; }
      if (!el) continue;
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || el.offsetHeight === 0) continue;
      return el;
    }
    return null;
  };

  // a) Accept cookies using available selectors
  try {
    const acceptBtn = firstVisible(S.cookieAccept || []);
    if (acceptBtn) {
      acceptBtn.scrollIntoView({ block: 'center' });
      acceptBtn.click();
      await sleep(800);
    } else {
      // fallback: click any visible button whose text matches accept labels
      const labels = ['accept all cookies', 'accept all', 'accept'];
      const btns = Array.from(document.querySelectorAll('button'));
      const match = btns.find((b) => {
        const t = (b.innerText || b.textContent || '').trim().toLowerCase();
        return labels.includes(t) && b.offsetHeight > 0;
      });
      if (match) { match.click(); await sleep(800); }
    }
  } catch { /* non-fatal */ }

  // b) Handle Cloudflare Turnstile/captcha if present
  let captchaState = 'absent';
  try {
    const containers = S.captchaContainer || [];
    const hasContainer = containers.some((sel) => { try { return !!document.querySelector(sel); } catch { return false; } });
    const tokenSelectors = S.captchaResponseInput || [];
    let token = '';
    for (const sel of tokenSelectors) {
      try {
        const inp = document.querySelector(sel);
        if (inp && inp.value && inp.value.trim().length > 20) { token = inp.value; break; }
      } catch { /* ignore */ }
    }
    if (hasContainer) {
      captchaState = token ? 'solved' : 'pending';
      if (!token) {
        // Attempt a best-effort click on the widget checkbox area so a visible
        // run can be solved manually; never throws.
        try {
          const frame = document.querySelector('iframe[src*="challenges.cloudflare.com"]');
          const holder = frame ? (frame.closest('div') || frame) : firstVisible(containers);
          if (holder && holder.scrollIntoView) holder.scrollIntoView({ block: 'center' });
        } catch { /* ignore */ }
      }
    }
  } catch { /* non-fatal */ }

  // c) Fill the login form based on selectors
  const fireAngularEvents = (el) => {
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
    el.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }));
  };

  const nativeSetValue = (el, value) => {
    const proto = el.tagName === 'TEXTAREA'
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
    const desc = Object.getOwnPropertyDescriptor(proto, 'value');
    if (desc && desc.set) desc.set.call(el, value);
    else el.value = value;
    fireAngularEvents(el);
  };

  const typeLetterByLetter = async (el, value) => {
    el.focus();
    el.click();
    // triple-click select + backspace to clear (physical, Angular-safe)
    document.execCommand && document.execCommand('selectAll', false, null);
    for (const ch of value) {
      el.dispatchEvent(new KeyboardEvent('keydown', { key: ch, bubbles: true }));
      el.dispatchEvent(new KeyboardEvent('keypress', { key: ch, bubbles: true }));
      nativeSetValue(el, (el.value || '') + ch);
      el.dispatchEvent(new KeyboardEvent('keyup', { key: ch, bubbles: true }));
      await sleep(rnd(35, 130));
    }
  };

  const pasteValue = async (el, value) => {
    el.focus();
    el.click();
    document.execCommand && document.execCommand('selectAll', false, null);
    let pasted = false;
    try {
      const dt = new DataTransfer();
      dt.setData('text/plain', value);
      const evt = new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: dt });
      pasted = el.dispatchEvent(evt);
      // If the page has no paste handler, apply value via native setter.
      if (pasted) {
        const before = el.value;
        await sleep(60);
        if (el.value === before) nativeSetValue(el, value);
        else fireAngularEvents(el);
      } else {
        nativeSetValue(el, value);
      }
    } catch {
      nativeSetValue(el, value);
    }
  };

  const fillInstant = async (el, value) => {
    el.focus();
    nativeSetValue(el, '');
    nativeSetValue(el, value);
    await sleep(50);
  };

  const applyMethod = async (el, value) => {
    if (method === 'typing') return typeLetterByLetter(el, value);
    if (method === 'paste') return pasteValue(el, value);
    return fillInstant(el, value);
  };

  const emailEl = firstVisible(S.email || []);
  const passEl = firstVisible(S.password || []);
  if (!emailEl) return { ok: false, reason: 'email-not-found', captcha: captchaState, method };
  if (!passEl) return { ok: false, reason: 'password-not-found', captcha: captchaState, method };

  emailEl.scrollIntoView({ block: 'center' });
  await applyMethod(emailEl, account);
  await sleep(rnd(150, 450));
  passEl.scrollIntoView({ block: 'center' });
  await applyMethod(passEl, password);
  await sleep(300);

  const verify = (el, expected) => (el.value || '') === expected;
  if (!verify(emailEl, account) || !verify(passEl, password)) {
    // One repair pass with instant fill before reporting failure.
    nativeSetValue(emailEl, account);
    nativeSetValue(passEl, password);
    if (!verify(emailEl, account) || !verify(passEl, password)) {
      return { ok: false, reason: 'fill-verify-failed', captcha: captchaState, method };
    }
  }

  // d) Click submit (sign-in submission handled here so typing mode is atomic)
  let btn = firstVisible(S.submit || []);
  if (!btn) {
    const wants = (S.submitText || []).map((t) => t.toLowerCase());
    btn = Array.from(document.querySelectorAll('button, input[type="submit"]')).find((b) => {
      const t = ((b.innerText || b.textContent || b.value) || '').trim().toLowerCase();
      return wants.some((w) => t.includes(w.toLowerCase())) && b.offsetHeight > 0;
    }) || null;
  }
  if (!btn) return { ok: false, reason: 'submit-not-found', captcha: captchaState, method };
  btn.scrollIntoView({ block: 'center' });
  await sleep(300);
  btn.click();
  return { ok: true, captcha: captchaState, method };
}

export default { signInSelectors, injectionSignIn };
