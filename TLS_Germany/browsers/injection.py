"""
Omni-Booking-Automation-Suite/TLS_Germany/browsers/injection.py
Generates and injects a dynamic, headless JavaScript payload to bypass date restrictions.
"""
from seleniumbase import Driver
import datetime
import time

def get_bypass_payload(target_month_str: str, max_year: int = 2027, max_month: int = 12, js_swap: bool = True, **kwargs) -> str:
    """
    Constructs the JavaScript payload safely.
    Uses .replace() to avoid Python f-string escaping issues with JS Regex.
    Accepts **kwargs to prevent unexpected argument crashes.
    """
    try:
        target_date_obj = datetime.datetime.strptime(target_month_str, "%B %Y")
        target_year = str(target_date_obj.year)
        target_month_index = str(target_date_obj.month - 1)
    except ValueError:
        target_year = "2026"
        target_month_index = "11"

    swap_str = "true" if js_swap else "false"
    max_date_str = f"{max_year}-{str(max_month).zfill(2)}-01T00:00:00.000Z"

    js_code = r"""
    (() => {
      'use strict';
      
      const TARGET_MONTH_IDX = __TARGET_MONTH_IDX__;
      const TARGET_YEAR = __TARGET_YEAR__;
      const MAX_DATE = "__MAX_DATE__";
      const ENABLE_SWAP = __ENABLE_SWAP__;

      const buildCurrentDateStr = () => {
        const m = String(TARGET_MONTH_IDX + 1).padStart(2, '0');
        const y = String(TARGET_YEAR).padStart(4, '0');
        return `${m}-${y}`;
      };

      function patchString(text) {
        if (typeof text !== 'string' || text.length < 10) return text;
        const hasMax = text.indexOf('maxDate') !== -1;
        const hasCur = ENABLE_SWAP && text.indexOf('currentDate') !== -1;
        if (!hasMax && !hasCur) return text;

        let out = text;

        if (hasMax) {
          const newDate = MAX_DATE;
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
                if (patched !== v) return origSet.call(this, patched);
              }
              return origSet.call(this, v);
            }
          });
        }
      } catch (e) {}

      // LAYER 2: script tag observer for Next.js Hydration
      function patchScriptNode(node) {
        if (!node || node.nodeType !== 1) return;
        if (node.tagName !== 'SCRIPT') return;
        if (node.src) return;
        if (node.dataset && node.dataset.moPatched === '1') return;
        const txt = node.textContent;
        if (!txt) return;
        if (txt.indexOf('maxDate') === -1 && txt.indexOf('currentDate') === -1) return;
        const patched = patchString(txt);
        if (patched !== txt) {
          try { node.textContent = patched; } catch (e) {}
        }
        if (node.dataset) node.dataset.moPatched = '1';
      }

      function scanForScripts(root) {
        if (!root) return;
        if (root.nodeType === 1 && root.tagName === 'SCRIPT') patchScriptNode(root);
        else if (root.querySelectorAll) root.querySelectorAll('script').forEach(patchScriptNode);
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
            scanForScripts(document.documentElement);
          }
        }, 1);
      }
      scanForScripts(document.documentElement);

      // LAYER 3: __next_f
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

      // LAYER 4: fetch
      const origFetch = window.fetch;
      window.fetch = async function(...args) {
        try {
          if (ENABLE_SWAP && args[0]) {
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
          if (ENABLE_SWAP && typeof url === 'string' && /currentDate=\d{2}-\d{4}/.test(url)) {
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

    })();
    """

    js_code = js_code.replace('__TARGET_MONTH_IDX__', target_month_index)
    js_code = js_code.replace('__TARGET_YEAR__', target_year)
    js_code = js_code.replace('__MAX_DATE__', max_date_str)
    js_code = js_code.replace('__ENABLE_SWAP__', swap_str)

    return js_code

def inject_date_bypass(
    driver: Driver,
    target_month_str: str,
    max_year: int = 2027,
    max_month: int = 12,
    js_swap: bool = True,
    **kwargs
) -> None:
    """
    Injects the generated payload into the browser environment.
    Accepts **kwargs to safely absorb any extra parameters passed by the bot.
    """
    try:
        payload = get_bypass_payload(target_month_str, max_year, max_month, js_swap, **kwargs)
        
        raw_driver = driver.driver if hasattr(driver, "driver") else driver
        
        # 1. حقن عبر CDP للصفحات الجديدة
        raw_driver.execute_cdp_cmd('Page.addScriptToEvaluateOnNewDocument', {'source': payload})
        
        # 2. تنفيذ فوري في الصفحة الحالية
        try:
            driver.execute_script(payload)
        except Exception as e:
            pass
        
        print(f"    - [💉] INJECTION SUCCESS: Target={target_month_str}, Max={max_year}-{max_month:02d}, Swap={js_swap}")
        
        # 3. إعادة تحميل الصفحة إذا كنا في صفحة حجز المواعيد لتطبيق الـ Hydration
        current_url = driver.current_url
        if "appointment-booking" in current_url:
            print(f"    - [🔄] Refreshing page to apply date bypass hydration...")
            driver.refresh()
            time.sleep(3)
            
    except Exception as e:
        print(f"    - [❌] INJECTION ERROR: {e}")