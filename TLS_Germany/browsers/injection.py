import datetime
from seleniumbase import Driver

JS_PAYLOAD = r"""
// ==UserScript==
// @name         TLS Headless Configurable Injector
// @namespace    http://tampermonkey.net/
// @version      6.0.0
// @description  Headless script to force target month, controlled by Python.
// @match        https://*.tlscontact.com/*
// @run-at       document-start
// @grant        none
// @noframes
// ==/UserScript==
(() => {
  'use strict';

  // Global configuration object. Python will define these values on injection
  // and can modify them live using execute_script for "hot-patching".
  window.TLS_CONFIG = {
    monthIdx: __MONTH_IDX__,
    year: __YEAR__,
    maxYear: __MAX_YEAR__,
    maxMonth: __MAX_MONTH__,
    hidePastMonths: __HIDE_MONTHS__,
    hidePastSlots: __HIDE_SLOTS__,
    autoNavigate: __AUTO_NAV__,
    swapCurrentDate: __SWAP_DATE__
  };
  const S = window.TLS_CONFIG; // Shorthand for the global config

  const MONTHS_FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const buildMaxDate = () => {
    const y = String(S.maxYear).padStart(4, '0');
    const m = String(S.maxMonth).padStart(2, '0');
    return `${y}-${m}-01T00:00:00.000Z`;
  };

  const buildCurrentDateStr = () => {
    const m = String(S.monthIdx + 1).padStart(2, '0');
    const y = String(S.year).padStart(4, '0');
    return `${m}-${y}`;
  };

  let lastNavClickTime = 0;
  let navDoneOrStuck = false;

  // Intercepts and modifies date-related data in JSON/JS strings.
  function patchString(text) {
    if (typeof text !== 'string' || text.length < 10) return text;
    const hasMax = text.indexOf('maxDate') !== -1;
    const hasCur = S.swapCurrentDate && text.indexOf('currentDate') !== -1;
    if (!hasMax && !hasCur) return text;

    let out = text;

    if (hasMax) {
      const newDate = buildMaxDate();
      out = out.replace(/"maxDate"\s*:\s*"(\$D)?[^"]*"/g, (_, p) => `"maxDate":"${p || ''}${newDate}"`);
      out = out.replace(/\\"maxDate\\"\s*:\s*\\"(\$D)?(?:[^"\\]|\\.)*?\\"/g, (_, p) => `\\"maxDate\\":\\"${p || ''}${newDate}\\"`);
      out = out.replace(/\\\\"maxDate\\\\"\s*:\s*\\\\"(\$D)?(?:[^"\\]|\\.)*?\\\\"/g, (_, p) => `\\\\"maxDate\\\\":\\\\"${p || ''}${newDate}\\\\"`);
    }

    if (hasCur) {
      const cdStr = buildCurrentDateStr();
      out = out.replace(/"currentDate"\s*:\s*"\d{2}-\d{4}"/g, `"currentDate":"${cdStr}"`);
      out = out.replace(/\\"currentDate\\"\s*:\s*\\"\d{2}-\d{4}\\"/g, `\\"currentDate\\":\\"${cdStr}\\"`);
      out = out.replace(/\\\\"currentDate\\\\"\s*:\s*\\\\"\d{2}-\d{4}\\\\"/g, `\\\\"currentDate\\\\":\\\\"${cdStr}\\\\"`);
    }
    return out;
  }

  // LAYER 1: HTMLScriptElement.prototype.text setter
  try {
    const proto = HTMLScriptElement.prototype;
    const desc = Object.getOwnPropertyDescriptor(proto, 'text') ||
                 Object.getOwnPropertyDescriptor(Element.prototype, 'textContent') ||
                 Object.getOwnPropertyDescriptor(Node.prototype, 'textContent');
    if (desc && desc.set) {
      const origSet = desc.set;
      const origGet = desc.get;
      Object.defineProperty(proto, 'text', {
        configurable: true,
        get() { return origGet ? origGet.call(this) : this.textContent; },
        set(v) {
          if (typeof v === 'string' && (v.indexOf('maxDate') !== -1 || v.indexOf('currentDate') !== -1)) {
            const patched = patchString(v);
            if (patched !== v) { return origSet.call(this, patched); }
          }
          return origSet.call(this, v);
        }
      });
    }
  } catch (e) {}

  // LAYER 2: script tag observer
  function patchScriptNode(node) {
    if (!node || node.nodeType !== 1 || node.tagName !== 'SCRIPT' || node.src || (node.dataset && node.dataset.moPatched === '1')) return;
    const txt = node.textContent;
    if (!txt || (txt.indexOf('maxDate') === -1 && txt.indexOf('currentDate') === -1)) return;
    const patched = patchString(txt);
    if (patched !== txt) {
      try { node.textContent = patched; } catch (e) {}
    }
    if (node.dataset) node.dataset.moPatched = '1';
  }

  const docObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const n of m.addedNodes) {
        if (n.nodeType === 1) {
          if (n.tagName === 'SCRIPT') patchScriptNode(n);
          else if (n.querySelectorAll) n.querySelectorAll('script').forEach(patchScriptNode);
        }
      }
      if (m.type === 'characterData' && m.target && m.target.parentNode &&
          m.target.parentNode.tagName === 'SCRIPT') {
        patchScriptNode(m.target.parentNode);
      }
    }
  });

  if (document.documentElement) {
    docObserver.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  } else {
    const earlyInt = setInterval(() => {
      if (document.documentElement) {
        clearInterval(earlyInt);
        docObserver.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
        if (document.querySelectorAll) document.querySelectorAll('script').forEach(patchScriptNode);
      }
    }, 1);
  }
  if (document.querySelectorAll) document.querySelectorAll('script').forEach(patchScriptNode);

  // LAYER 3: __next_f (Next.js data payload)
  function hookNextFArray(arr) {
    if (!Array.isArray(arr) || arr.__mo_hooked) return;
    for (let i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i]) && typeof arr[i][1] === 'string') {
        arr[i][1] = patchString(arr[i][1]);
      }
    }
    const origPush = arr.push.bind(arr);
    Object.defineProperty(arr, 'push', {
      configurable: true, writable: true,
      value: function(...items) {
        for (const item of items) {
          if (Array.isArray(item) && typeof item[1] === 'string') {
            item[1] = patchString(item[1]);
          }
        }
        return origPush(...items);
      }
    });
    Object.defineProperty(arr, '__mo_hooked', { value: true });
  }
  let _nextF;
  Object.defineProperty(window, '__next_f', {
    configurable: true,
    get() { return _nextF; },
    set(arr) { _nextF = arr; if (Array.isArray(arr)) hookNextFArray(arr); }
  });

  // LAYER 4: fetch
  const origFetch = window.fetch;
  window.fetch = async function(...args) {
    try {
      if (S.swapCurrentDate && args[0]) {
        const url = typeof args[0] === 'string' ? args[0] : (args[0].url || '');
        if (url && /currentDate=\d{2}-\d{4}/.test(url)) {
          const newUrl = url.replace(/currentDate=\d{2}-\d{4}/, `currentDate=${buildCurrentDateStr()}`);
          if (typeof args[0] === 'string') args[0] = newUrl;
        }
      }
    } catch {}
    const res = await origFetch.apply(this, args);
    try {
      const ct = (res.headers.get('content-type') || '').toLowerCase();
      if (!ct.includes('json') && !ct.includes('text/plain') && !ct.includes('text/x-component')) return res;
      const clone = res.clone();
      const text = await clone.text();
      const patched = patchString(text);
      if (patched !== text) {
        return new Response(patched, { status: res.status, statusText: res.statusText, headers: res.headers });
      }
    } catch (e) {}
    return res;
  };

  // LAYER 5: XHR
  const OrigXHR = window.XMLHttpRequest;
  function PatchedXHR() {
    const xhr = new OrigXHR();
    const origOpen = xhr.open;
    xhr.open = function(method, url, ...rest) {
      if (S.swapCurrentDate && typeof url === 'string' && /currentDate=\d{2}-\d{4}/.test(url)) {
        url = url.replace(/currentDate=\d{2}-\d{4}/, `currentDate=${buildCurrentDateStr()}`);
      }
      return origOpen.call(this, method, url, ...rest);
    };
    xhr.addEventListener('readystatechange', function() {
      if (xhr.readyState === 4) {
        try {
          const ct = (xhr.getResponseHeader('content-type') || '').toLowerCase();
          if (ct && !ct.includes('json') && !ct.includes('text/plain') && !ct.includes('text/x-component')) return;
          const original = xhr.responseText;
          const patched = patchString(original);
          if (patched !== original) {
            Object.defineProperty(xhr, 'responseText', { get: () => patched, configurable: true });
            try { Object.defineProperty(xhr, 'response', { get: () => patched, configurable: true }); } catch {}
          }
        } catch {}
      }
    });
    return xhr;
  }
  PatchedXHR.prototype = OrigXHR.prototype;
  window.XMLHttpRequest = PatchedXHR;

  // Helpers
  function parseMonthLabel(txt) {
    const m = (txt || '').trim().match(/(\w+)\s+(\d{4})/);
    if (!m) return null;
    const idx = MONTHS_FULL.findIndex(mm => mm.toLowerCase() === m[1].toLowerCase());
    if (idx < 0) return null;
    return { month: idx, year: parseInt(m[2], 10), ym: parseInt(m[2], 10) * 12 + idx };
  }

  function targetYM() { return S.year * 12 + S.monthIdx; }

  function getCurrentMonthYM() {
    const cur = document.querySelector('[data-testid="btn-current-month-available"], [data-testid="btn-current-month-unavailable"]');
    if (!cur || cur.style.display === 'none') {
      const visible = Array.from(document.querySelectorAll(
        '[data-testid^="btn-current-month-"]:not([style*="display: none"]),' +
        '[data-testid^="btn-next-month-"]:not([style*="display: none"])'
      )).find(el => el.offsetParent !== null);
      if (!visible) return null;
      const p = parseMonthLabel(visible.textContent);
      return p ? p.ym : null;
    }
    const p = parseMonthLabel(cur.textContent);
    return p ? p.ym : null;
  }

  // HIDE past months
  function hidePastMonths() {
    if (!S.hidePastMonths) {
      document.querySelectorAll('[data-mo-hidden="1"]').forEach(el => {
        el.dataset.moHidden = '0';
        el.style.display = '';
      });
      return;
    }

    const tYM = targetYM();
    const monthButtons = document.querySelectorAll(
      '[data-testid="btn-prev-month-unavailable"],[data-testid="btn-prev-month-available"],' +
      '[data-testid="btn-current-month-available"],[data-testid="btn-current-month-unavailable"],' +
      '[data-testid="btn-next-month-unavailable"],[data-testid="btn-next-month-available"]'
    );

    monthButtons.forEach(el => {
      const p = parseMonthLabel(el.textContent);
      if (!p) return;

      if (p.ym < tYM) {
        el.dataset.moHidden = '1';
        el.style.display = 'none';
      } else if (el.dataset.moHidden === '1') {
        el.dataset.moHidden = '0';
        el.style.display = '';
      }
    });
  }

  // HIDE past slots
  function hidePastSlots() {
    if (!S.hidePastSlots) {
      document.querySelectorAll('[data-mo-slot-hidden="1"]').forEach(card => {
        card.dataset.moSlotHidden = '0';
        card.style.display = '';
      });
      return;
    }

    const tYM = targetYM();
    const curYM = getCurrentMonthYM();
    if (curYM == null) return;

    const dayCards = document.querySelectorAll('.AppointmentDay_appointment-day__1Qnz1, [class*="AppointmentDay_appointment-day"]');
    const shouldHide = curYM < tYM;

    dayCards.forEach(card => {
      if (shouldHide) {
        card.dataset.moSlotHidden = '1';
        card.style.display = 'none';
      } else if (card.dataset.moSlotHidden === '1') {
        card.dataset.moSlotHidden = '0';
        card.style.display = '';
      }
    });
  }

  // AUTO-NAVIGATE
  function autoNavigateToTarget() {
    if (!S.autoNavigate || navDoneOrStuck) return;

    const tYM = targetYM();
    const curYM = getCurrentMonthYM();
    if (curYM == null) return;
    if (curYM >= tYM) { navDoneOrStuck = true; return; }

    const now = Date.now();
    if (now - lastNavClickTime < 700) return;

    let nextBtn = document.querySelector('[data-testid="btn-next-month-available"], [data-testid="btn-next-month-unavailable"]');
    if (!nextBtn) return;

    const nextLabel = parseMonthLabel(nextBtn.textContent);
    if (!nextLabel || nextLabel.ym > tYM || nextLabel.ym === curYM) {
      navDoneOrStuck = true;
      return;
    }

    lastNavClickTime = now;

    const wasHidden = nextBtn.dataset.moHidden;
    const prevDisplay = nextBtn.style.display;
    nextBtn.style.display = '';
    nextBtn.classList.remove('MonthSelector_--disabled__sfMZm');
    nextBtn.classList.add('MonthSelector_--active__K1ooB');
    nextBtn.style.pointerEvents = 'auto';

    try {
      nextBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    } catch (e) {
      try { nextBtn.click(); } catch {}
    }

    setTimeout(() => {
      if (wasHidden === '1') nextBtn.style.display = 'none';
      else nextBtn.style.display = prevDisplay;
      hidePastMonths();
      hidePastSlots();
    }, 50);
  }

  function resetNavState() { navDoneOrStuck = false; lastNavClickTime = 0; }

  // Observers + intervals
  let domMo = null;
  function startDomObserver() {
    if (domMo) try { domMo.disconnect(); } catch {}
    domMo = new MutationObserver(() => {
      hidePastMonths();
      hidePastSlots();
    });
    if (document.body) {
      domMo.observe(document.body, { childList: true, subtree: true });
    }
  }

  function reapply() {
    try { hidePastMonths(); } catch {}
    try { hidePastSlots(); } catch {}
    try { startDomObserver(); } catch {}
    resetNavState();
  }

  let lastUrl = location.href;
  setInterval(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(reapply, 300);
      setTimeout(reapply, 1000);
    }
  }, 500);

  setInterval(autoNavigateToTarget, 500);

  // Main execution
  function start() {
    hidePastMonths();
    hidePastSlots();
    startDomObserver();
    setTimeout(autoNavigateToTarget, 800); // Initial navigation attempts
    setTimeout(autoNavigateToTarget, 1600);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
"""

def inject_date_bypass(
    driver: Driver,
    target_month_str: str,
    max_year: int = 2027,
    max_month: int = 12,
    hide_months: bool = True,  # NOSONAR
    hide_slots: bool = True,  # NOSONAR
    auto_nav: bool = True,  # NOSONAR
    swap_date: bool = True  # NOSONAR
) -> None:
    """
    Prepares and injects the headless, configurable date bypass script into the browser.

    This function uses a template for the JavaScript payload and dynamically
    replaces placeholders with runtime configuration values. This ensures
    the injected script is always configured correctly for the bot's current target.

    Args:
        driver: The SeleniumBase driver instance.
        target_month_str: The target month in "Month Year" format (e.g., "October 2026").
        max_year: The year for the 'maxDate' override.
        max_month: The month for the 'maxDate' override.
        hide_months: If true, hides month buttons before the target month.
        hide_slots: If true, hides appointment slots in months before the target.
        auto_nav: If true, programmatically clicks 'next month' to reach the target.
        swap_date: If true, swaps 'currentDate' in network requests.
    """
    try:
        # 1. Parse the target month string into year and a 0-based month index
        target_date_obj = datetime.datetime.strptime(target_month_str, "%B %Y")
        target_year = target_date_obj.year
        target_month_index = target_date_obj.month - 1  # 0-based for JavaScript

        # 2. Dynamically replace all placeholders in the JS template
        script_content = JS_PAYLOAD.replace(
            '__MONTH_IDX__', str(target_month_index)
        ).replace(
            '__YEAR__', str(target_year)
        ).replace(
            '__MAX_YEAR__', str(max_year)
        ).replace(
            '__MAX_MONTH__', str(max_month)
        ).replace(
            '__HIDE_MONTHS__', str(hide_months).lower()
        ).replace(
            '__HIDE_SLOTS__', str(hide_slots).lower()
        ).replace(
            '__AUTO_NAV__', str(auto_nav).lower()
        ).replace(
            '__SWAP_DATE__', str(swap_date).lower()
        )

        # 3. Inject the modified script to run on all new documents
        driver.execute_cdp_cmd(
            'Page.addScriptToEvaluateOnNewDocument',
            {'source': script_content}
        )
        print(f"    - [Injector] Injected headless JS for target: {target_month_str}.")

    except Exception as e:
        print(f"❌ [Injection Error] Failed to inject date bypass script: {e}")
        raise

def hot_patch_live_js_config(driver: Driver, target_month_str: str) -> None:
    """
    Updates the live, in-browser JavaScript configuration object instantly.

    This is designed to be called by the GUI's "Hot-Patch" dialog to change
    the bot's target month without needing to reload the page or reinject the script.

    Args:
        driver: The SeleniumBase driver instance of the running bot.
        target_month_str: The new target month in "Month Year" format.
    """
    try:
        # 1. Parse the new target month string
        target_date_obj = datetime.datetime.strptime(target_month_str, "%B %Y")
        new_year = target_date_obj.year
        new_month_index = target_date_obj.month - 1

        # 2. Build and execute a script to update the global config object in the browser
        js_command = (
            f"if (window.TLS_CONFIG) {{"
            f"  window.TLS_CONFIG.monthIdx = {new_month_index};"
            f"  window.TLS_CONFIG.year = {new_year};"
            f"  console.log('Hot-patched JS config. New target: {target_month_str}');"
            f"}}"
        )
        driver.execute_script(js_command)
        print(f"    - [Hot-Patch] Sent live update to JS config. New target: {target_month_str}")

    except Exception as e:
        print(f"❌ [Hot-Patch Error] Failed to update live JS config: {e}")