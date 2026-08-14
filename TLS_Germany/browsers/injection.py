# Omni-Booking-Automation-Suite/TLS_Germany/browsers/injection.py

import datetime
from seleniumbase import Driver

def get_headless_injection_script(
    target_month_idx: int,
    target_year: int,
    max_year: int = 2027,
    max_month: int = 12,
    hide_past_months: bool = True,
    hide_past_slots: bool = True,
    auto_navigate: bool = True,
    swap_current_date: bool = True
) -> str:
    """Generates the headless JavaScript payload with built-in logging."""
    
    js_config = f"""
    const S = {{
        monthIdx: {target_month_idx},
        year: {target_year},
        maxYear: {max_year},
        maxMonth: {max_month},
        hidePastMonths: {'true' if hide_past_months else 'false'},
        hidePastSlots: {'true' if hide_past_slots else 'false'},
        autoNavigate: {'true' if auto_navigate else 'false'},
        swapCurrentDate: {'true' if swap_current_date else 'false'}
    }};
    """

    js_engine = r"""
    (() => {
      'use strict';
      
      console.log("%c[💉 Hot-Patch Engine Active] Target: " + S.monthIdx + "/" + S.year + " | MaxDate: " + S.maxYear + "-" + S.maxMonth, "color: #34d399; font-weight: bold; font-size: 14px;");

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

      let navDoneOrStuck = false;
      let lastNavClickTime = 0;

      // ============================================================
      // Core Network Interceptor
      // ============================================================
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

      // LAYER 1: HTMLScriptElement prototype
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
                return origSet.call(this, patchString(v));
              }
              return origSet.call(this, v);
            }
          });
        }
      } catch (e) {}

      // LAYER 2: Hook Next.js Array
      function hookNextFArray(arr) {
        if (!Array.isArray(arr) || arr.__mo_hooked) return;
        for (let i = 0; i < arr.length; i++) {
          const item = arr[i];
          if (Array.isArray(item) && typeof item[1] === 'string') {
            item[1] = patchString(item[1]);
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
        Object.defineProperty(arr, '__mo_hooked', { value: true, enumerable: false, configurable: false, writable: false });
      }

      let _nextF, nextFHookInstalled = false;
      function installNextFHook() {
        if (nextFHookInstalled) return;
        try {
          if (Array.isArray(window.__next_f)) { _nextF = window.__next_f; hookNextFArray(_nextF); }
          Object.defineProperty(window, '__next_f', {
            configurable: true,
            get() { return _nextF; },
            set(arr) { _nextF = arr; if (Array.isArray(arr)) hookNextFArray(arr); }
          });
          nextFHookInstalled = true;
        } catch (e) {}
      }
      installNextFHook();

      // LAYER 3: Fetch Interceptor
      const origFetch = window.fetch;
      window.fetch = async function(...args) {
        try {
          if (S.swapCurrentDate && args[0]) {
            const url = typeof args[0] === 'string' ? args[0] : (args[0].url || '');
            if (url && /currentDate=\d{2}-\d{4}/.test(url)) {
              args[0] = url.replace(/currentDate=\d{2}-\d{4}/, `currentDate=${buildCurrentDateStr()}`);
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

      // LAYER 4: XHR Interceptor
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

      // ============================================================
      // DOM Sanitization
      // ============================================================
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

      function hidePastMonths() {
        if (!S.hidePastMonths) return;
        const tYM = targetYM();
        
        document.querySelectorAll(
          '[data-testid="btn-prev-month-unavailable"],[data-testid="btn-prev-month-available"],' +
          '[data-testid="btn-current-month-available"],[data-testid="btn-current-month-unavailable"],' +
          '[data-testid="btn-next-month-unavailable"],[data-testid="btn-next-month-available"]'
        ).forEach(el => {
          
          // VISUAL FIX: If server-side swap is active, explicitly rename the current active button 
          // to match the target month so it doesn't get hidden and proves the swap worked.
          if (S.swapCurrentDate && el.getAttribute('data-testid').includes('current-month')) {
              const targetStr = MONTHS_FULL[S.monthIdx] + ' ' + S.year;
              if (el.textContent.trim() !== targetStr) {
                  el.textContent = targetStr;
              }
          }

          const p = parseMonthLabel(el.textContent);
          if (p && p.ym < tYM && el.style.display !== 'none') {
             el.style.display = 'none';
             console.log("%c[👁️ Hot-Patch] Hiding past month: " + el.textContent.trim(), "color: #fb923c; font-size: 11px;");
          }
        });
      }

      function hidePastSlots() {
        if (!S.hidePastSlots) return;
        const tYM = targetYM();
        const curYM = getCurrentMonthYM();
        if (curYM == null || curYM >= tYM) return;

        document.querySelectorAll('.AppointmentDay_appointment-day__1Qnz1, [class*="AppointmentDay_appointment-day"]').forEach(card => {
            if (card.style.display !== 'none') {
                card.style.display = 'none';
                console.log("%c[👁️ Hot-Patch] Hiding irrelevant calendar slot grid.", "color: #fb923c; font-size: 11px;");
            }
        });
      }

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
        if (!nextLabel || nextLabel.ym > tYM || nextLabel.ym === curYM) { navDoneOrStuck = true; return; }

        lastNavClickTime = now;
        nextBtn.style.display = '';
        nextBtn.classList.remove('MonthSelector_--disabled__sfMZm');
        nextBtn.classList.add('MonthSelector_--active__K1ooB');
        nextBtn.style.pointerEvents = 'auto';

        try { 
            console.log("%c[🚀 Hot-Patch] Auto-navigating to next month: " + nextLabel.month + "/" + nextLabel.year, "color: #60a5fa; font-weight: bold;");
            nextBtn.click(); 
        } catch {}
      }

      const domMo = new MutationObserver(() => {
        hidePastMonths();
        hidePastSlots();
      });

      function start() {
        if (document.body) {
            domMo.observe(document.body, { childList: true, subtree: true });
        }
        hidePastMonths();
        hidePastSlots();
        setInterval(autoNavigateToTarget, 500);
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
      } else {
        start();
      }
    })();
    """
    return js_config + js_engine


def inject_date_bypass(
    driver: Driver,
    target_month_str: str,
    max_year: int = 2027,
    max_month: int = 12,
    hide_past_months: bool = True,
    hide_past_slots: bool = True,
    auto_navigate: bool = True,
    swap_current_date: bool = True
) -> bool:
    """Helper function to parse target month string and execute the headless script."""
    if not driver:
        return False

    try:
        dt = datetime.datetime.strptime(target_month_str.strip(), "%B %Y")
    except ValueError:
        try:
            dt = datetime.datetime.strptime(target_month_str.strip(), "%b %Y")
        except ValueError:
            print(f"[❌] Injection Error: Cannot parse month string '{target_month_str}'")
            return False

    target_month_idx = dt.month - 1
    target_year = dt.year

    payload = get_headless_injection_script(
        target_month_idx=target_month_idx,
        target_year=target_year,
        max_year=int(max_year),
        max_month=int(max_month),
        hide_past_months=hide_past_months,
        hide_past_slots=hide_past_slots,
        auto_navigate=auto_navigate,
        swap_current_date=swap_current_date
    )

    try:
        driver.execute_script(payload)
        return True
    except Exception as e:
        print(f"[⚠️] Failed to inject headless script: {e}")
        return False