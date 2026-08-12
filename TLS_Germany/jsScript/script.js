// ==UserScript==
// @name         𝑵𝒆𝒘 𝑺𝒄𝒓𝒊𝒑𝒕 𝑻𝒍𝒔 𝑴𝒐𝒏𝒕𝒉 𝑩𝒚 Abanob khames
// @namespace    http://tampermonkey.net/
// @version      5.9.5
// @description  Force target month + completely HIDE past months & their slots from DOM. visas-de only.
// @match        https://*.tlscontact.com/*
// @run-at       document-start
// @grant        none
// @noframes
// ==/UserScript==
(() => {
  'use strict';

  const CFG_KEY = 'mo_tls_force_v42';
  const HUD_STATE_KEY = 'mo_tls_hud_state_v1';
  const DEF = {
    monthIdx: 7,          // Aug
    year: 2026,
    maxYear: 2027,
    maxMonth: 12,
    hidePastMonths: true,
    hidePastSlots: true,
    autoNavigate: true,
    swapCurrentDate: true
  };
  const S = Object.assign({}, DEF, JSON.parse(localStorage.getItem(CFG_KEY) || '{}'));
  const save = () => { try { localStorage.setItem(CFG_KEY, JSON.stringify(S)); } catch {} };

  // HUD visibility state (hidden = floating button only / shown = full panel)
  let HUD_HIDDEN = false;
  try { HUD_HIDDEN = localStorage.getItem(HUD_STATE_KEY) === 'hidden'; } catch {}
  const saveHudState = (hidden) => { try { localStorage.setItem(HUD_STATE_KEY, hidden ? 'hidden' : 'shown'); } catch {} };

  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
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

  let patchCount = 0;
  let scriptTagPatches = 0;
  let nextFPatches = 0;
  let fetchPatches = 0;
  let xhrPatches = 0;
  let hiddenMonthsCount = 0;
  let hiddenSlotsCount = 0;
  let navClickCount = 0;
  let currentDatePatches = 0;
  let lastNavClickTime = 0;
  let navDoneOrStuck = false;

  // ============================================================
  // patchString
  // ============================================================
  function patchString(text) {
    if (typeof text !== 'string' || text.length < 10) return text;
    const hasMax = text.indexOf('maxDate') !== -1;
    const hasCur = S.swapCurrentDate && text.indexOf('currentDate') !== -1;
    if (!hasMax && !hasCur) return text;

    let out = text;
    const before = out;

    if (hasMax) {
      const newDate = buildMaxDate();
      out = out.replace(/"maxDate"\s*:\s*"(\$D)?[^"]*"/g, (_, p) => `"maxDate":"${p || ''}${newDate}"`);
      out = out.replace(/\\"maxDate\\"\s*:\s*\\"(\$D)?(?:[^"\\]|\\.)*?\\"/g, (_, p) => `\\"maxDate\\":\\"${p || ''}${newDate}\\"`);
      out = out.replace(/\\\\"maxDate\\\\"\s*:\s*\\\\"(\$D)?(?:[^"\\]|\\.)*?\\\\"/g, (_, p) => `\\\\"maxDate\\\\":\\\\"${p || ''}${newDate}\\\\"`);
    }

    if (hasCur) {
      const cdStr = buildCurrentDateStr();
      const ctBefore = out;
      out = out.replace(/"currentDate"\s*:\s*"\d{2}-\d{4}"/g, `"currentDate":"${cdStr}"`);
      out = out.replace(/\\"currentDate\\"\s*:\s*\\"\d{2}-\d{4}\\"/g, `\\"currentDate\\":\\"${cdStr}\\"`);
      out = out.replace(/\\\\"currentDate\\\\"\s*:\s*\\\\"\d{2}-\d{4}\\\\"/g, `\\\\"currentDate\\\\":\\\\"${cdStr}\\\\"`);
      if (out !== ctBefore) currentDatePatches++;
    }

    if (out !== before) patchCount++;
    return out;
  }

  // ============================================================
  // LAYER 1: HTMLScriptElement.prototype.text setter
  // ============================================================
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
            if (patched !== v) { scriptTagPatches++; return origSet.call(this, patched); }
          }
          return origSet.call(this, v);
        }
      });
    }
  } catch (e) {}

  // ============================================================
  // LAYER 2: script tag observer
  // ============================================================
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
      try { node.textContent = patched; scriptTagPatches++; } catch (e) {}
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

  // ============================================================
  // LAYER 3: __next_f
  // ============================================================
  function hookNextFArray(arr) {
    if (!Array.isArray(arr) || arr.__mo_hooked) return;
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      if (Array.isArray(item) && typeof item[1] === 'string') {
        const after = patchString(item[1]);
        if (after !== item[1]) { item[1] = after; nextFPatches++; }
      }
    }
    const origPush = arr.push.bind(arr);
    Object.defineProperty(arr, 'push', {
      configurable: true, writable: true,
      value: function(...items) {
        for (const item of items) {
          if (Array.isArray(item) && typeof item[1] === 'string') {
            const before = item[1];
            const after = patchString(before);
            if (after !== before) { nextFPatches++; item[1] = after; }
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

  // ============================================================
  // LAYER 4: fetch
  // ============================================================
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
        fetchPatches++;
        return new Response(patched, { status: res.status, statusText: res.statusText, headers: res.headers });
      }
    } catch (e) {}
    return res;
  };

  // ============================================================
  // LAYER 5: XHR
  // ============================================================
  const OrigXHR = window.XMLHttpRequest;
  function PatchedXHR() {
    const xhr = new OrigXHR();
    const origOpen = xhr.open;
    xhr.open = function(method, url, ...rest) {
      if (S.swapCurrentDate && typeof url === 'string' && /currentDate=\d{2}-\d{4}/.test(url)) {
        url = url.replace(/currentDate=\d{2}-\d{4}/, `currentDate=${buildCurrentDateStr()}`);
      }
      this._mo_url = url;
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
            xhrPatches++;
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
  // Helpers
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

  function getNextButton() {
    const all = Array.from(document.querySelectorAll('[data-testid="btn-next-month-available"], [data-testid="btn-next-month-unavailable"]'));
    return all.find(el => el.style.display !== 'none') || null;
  }

  // ============================================================
  // HIDE past months
  // ============================================================
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
        if (el.dataset.moHidden !== '1') {
          el.dataset.moHidden = '1';
          hiddenMonthsCount++;
        }
        el.style.display = 'none';
      } else if (el.dataset.moHidden === '1') {
        el.dataset.moHidden = '0';
        el.style.display = '';
      }
    });
  }

  // ============================================================
  // HIDE past slots
  // ============================================================
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
        if (card.dataset.moSlotHidden !== '1') {
          card.dataset.moSlotHidden = '1';
          hiddenSlotsCount++;
        }
        card.style.display = 'none';
      } else if (card.dataset.moSlotHidden === '1') {
        card.dataset.moSlotHidden = '0';
        card.style.display = '';
      }
    });
  }

  // ============================================================
  // "Loading..." badge
  // ============================================================
  function injectShowingBadge() {
    if (!S.hidePastMonths) {
      const old = document.getElementById('mo-empty-badge');
      if (old) old.remove();
      return;
    }

    const container = document.querySelector('.relative.flex.items-center.overflow-hidden.px-4');
    if (!container) return;

    const visibleMonths = container.querySelectorAll('[data-testid^="btn-"]:not([style*="display: none"])');
    if (visibleMonths.length > 0) {
      const old = document.getElementById('mo-empty-badge');
      if (old) old.remove();
      return;
    }

    if (!document.getElementById('mo-empty-badge')) {
      const badge = document.createElement('div');
      badge.id = 'mo-empty-badge';
      badge.style.cssText = `
        padding: 8px 16px; text-align: center; width: 100%;
        color: #64748b; font-size: 14px; font-style: italic;
      `;
      badge.textContent = `Loading ${MONTHS_FULL[S.monthIdx]} ${S.year}...`;
      container.appendChild(badge);
    }
  }

  // ============================================================
  // AUTO-NAVIGATE
  // ============================================================
  function autoNavigateToTarget() {
    if (!S.autoNavigate || navDoneOrStuck) return;

    const tYM = targetYM();
    const curYM = getCurrentMonthYM();
    if (curYM == null) return;
    if (curYM >= tYM) { navDoneOrStuck = true; return; }

    const now = Date.now();
    if (now - lastNavClickTime < 700) return;

    let nextBtn = document.querySelector(
      '[data-testid="btn-next-month-available"], [data-testid="btn-next-month-unavailable"]'
    );
    if (!nextBtn) return;

    const nextLabel = parseMonthLabel(nextBtn.textContent);
    if (!nextLabel) return;
    if (nextLabel.ym > tYM) { navDoneOrStuck = true; return; }
    if (nextLabel.ym === curYM) { navDoneOrStuck = true; return; }

    lastNavClickTime = now;
    navClickCount++;

    const wasHidden = nextBtn.dataset.moHidden;
    const prevDisplay = nextBtn.style.display;
    nextBtn.style.display = '';
    nextBtn.classList.remove('MonthSelector_--disabled__sfMZm');
    nextBtn.classList.add('MonthSelector_--active__K1ooB');
    nextBtn.style.pointerEvents = 'auto';

    try {
      const evt = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
      nextBtn.dispatchEvent(evt);
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

  // ============================================================
  // Observers + intervals
  // ============================================================
  let domMo = null;
  function startDomObserver() {
    if (domMo) try { domMo.disconnect(); } catch {}
    domMo = new MutationObserver(() => {
      hidePastMonths();
      hidePastSlots();
      injectShowingBadge();
    });
    if (document.body) {
      domMo.observe(document.body, { childList: true, subtree: true });
    }
  }

  function reapply() {
    try { hidePastMonths(); } catch {}
    try { hidePastSlots(); } catch {}
    try { injectShowingBadge(); } catch {}
    try { startDomObserver(); } catch {}
    resetNavState();
  }

  let lastUrl = location.href;
  setInterval(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(reapply, 300);
      setTimeout(reapply, 1000);
      setTimeout(reapply, 2500);
    }
  }, 500);

  setInterval(autoNavigateToTarget, 500);

  // ============================================================
  // HUD + Floating launcher button
  // ============================================================
  function applyHudVisibility() {
    const box = document.getElementById('mo-hud');
    const launcher = document.getElementById('mo-launcher');
    if (!box || !launcher) return;
    if (HUD_HIDDEN) {
      box.style.setProperty('display', 'none', 'important');
      launcher.style.setProperty('display', 'flex', 'important');
    } else {
      box.style.removeProperty('display');
      launcher.style.setProperty('display', 'none', 'important');
    }
  }

  function buildHUD() {
    const style = document.createElement('style');
    style.textContent = `
      #mo-hud {
        position: fixed; right: 14px; bottom: 14px; z-index: 2147483600;
        width: 320px; max-height: calc(100vh - 28px); overflow: hidden;
        background: linear-gradient(160deg, #0f1729 0%, #1a1f3a 50%, #0f1729 100%);
        border: 1px solid rgba(99,102,241,0.3); border-radius: 14px;
        box-shadow: 0 20px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.15) inset, 0 0 30px rgba(99,102,241,0.1);
        font-family: 'Inter','Segoe UI',system-ui,-apple-system,sans-serif;
        font-size: 12px; color: #e2e8f0; backdrop-filter: blur(20px);
        transition: transform 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.25s;
      }
      #mo-hud.mo-collapsed { transform: translateY(calc(100% - 44px)); }
      #mo-hud-head {
        padding: 11px 14px;
        background: linear-gradient(90deg, rgba(99,102,241,0.18), rgba(168,85,247,0.12));
        border-bottom: 1px solid rgba(99,102,241,0.2);
        display: flex; align-items: center; justify-content: space-between;
        user-select: none;
      }
      #mo-hud-title {
        font-weight: 700; letter-spacing: 2px; font-size: 13px;
        background: linear-gradient(90deg, #67e8f9, #a78bfa, #f0abfc);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      }
      #mo-hud-ver { font-size: 9px; color: #fbbf24; letter-spacing: 1.5px;
        padding: 2px 7px; border: 1px solid rgba(251,191,36,0.4); border-radius: 4px; background: rgba(251,191,36,0.08); }
      .mo-hud-btn {
        background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
        color: #cbd5e1; width: 22px; height: 22px; border-radius: 5px; font-size: 14px; cursor: pointer; line-height: 1;
        display: flex; align-items: center; justify-content: center; transition: all 0.15s;
        padding: 0; font-family: inherit;
      }
      .mo-hud-btn:hover { background: rgba(99,102,241,0.2); color: #fff; }
      #mo-hud-close {
        color: #a78bfa;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 1.5px;
        width: auto;
        padding: 0 8px;
        background: linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.12));
        border-color: rgba(168,85,247,0.4);
      }
      #mo-hud-close:hover {
        background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(168,85,247,0.25));
        color: #fff;
        border-color: rgba(168,85,247,0.7);
        box-shadow: 0 0 12px rgba(168,85,247,0.4);
      }
      #mo-hud-body { padding: 12px 14px; overflow-y: auto; max-height: calc(100vh - 88px); }
      #mo-hud-body::-webkit-scrollbar { width: 5px; }
      #mo-hud-body::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
      #mo-hud-body::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 3px; }
      .mo-section { margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid rgba(99,102,241,0.12); }
      .mo-section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
      .mo-label { font-size: 9px; color: #94a3b8; letter-spacing: 1.5px; text-transform: uppercase;
        font-weight: 600; margin-bottom: 7px; display: flex; align-items: center; gap: 6px; }
      .mo-label::before { content: ''; width: 3px; height: 10px; border-radius: 2px;
        background: linear-gradient(180deg, #67e8f9, #a78bfa); }
      .mo-month-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; }
      .mo-month-btn { padding: 6px 4px; border: 1px solid rgba(99,102,241,0.25);
        background: rgba(15,23,41,0.6); color: #cbd5e1; border-radius: 6px; cursor: pointer; font-size: 11px;
        font-family: inherit; font-weight: 600; transition: all 0.15s; letter-spacing: 0.3px; }
      .mo-month-btn:hover { background: rgba(99,102,241,0.2); border-color: rgba(99,102,241,0.6); color: #fff; }
      .mo-month-btn.mo-active { background: linear-gradient(180deg, #10b981, #059669);
        border-color: #34d399; color: #fff; box-shadow: 0 0 12px rgba(16,185,129,0.4); }
      .mo-row { display: flex; gap: 8px; align-items: center; }
      .mo-row + .mo-row { margin-top: 8px; }
      .mo-input { flex: 1; min-width: 0; padding: 7px 10px; border: 1px solid rgba(99,102,241,0.25);
        background: rgba(15,23,41,0.8); color: #f1f5f9; border-radius: 6px; font-size: 12px;
        font-family: inherit; transition: all 0.15s; }
      .mo-input:focus { outline: none; border-color: rgba(99,102,241,0.7); box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
      .mo-input-label { font-size: 10px; color: #94a3b8; min-width: 14px; font-weight: 600; }
      .mo-btn { padding: 7px 12px; border-radius: 6px; cursor: pointer; font-family: inherit;
        font-size: 11px; font-weight: 700; letter-spacing: 0.5px; transition: all 0.15s; border: 1px solid transparent; }
      .mo-btn-primary { background: linear-gradient(180deg, #10b981, #059669); color: #fff; border-color: #34d399; }
      .mo-btn-primary:hover { box-shadow: 0 0 14px rgba(16,185,129,0.5); transform: translateY(-1px); }
      .mo-btn-warn { background: linear-gradient(180deg, #f59e0b, #d97706); color: #fff; border-color: #fbbf24; }
      .mo-btn-warn:hover { box-shadow: 0 0 14px rgba(245,158,11,0.5); transform: translateY(-1px); }
      .mo-btn-ghost { background: rgba(255,255,255,0.04); color: #cbd5e1; border-color: rgba(255,255,255,0.1); }
      .mo-btn-ghost:hover { background: rgba(99,102,241,0.15); color: #fff; border-color: rgba(99,102,241,0.4); }
      .mo-status-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 12px; font-size: 11px; }
      .mo-status-item { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; }
      .mo-status-k { color: #94a3b8; font-size: 10px; }
      .mo-pill { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 700;
        letter-spacing: 0.5px; font-family: 'JetBrains Mono', monospace; }
      .mo-toggle-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 6px 0; }
      .mo-toggle-row span { font-size: 11px; color: #cbd5e1; font-weight: 500; }
      .mo-switch { position: relative; width: 36px; height: 20px; background: rgba(255,255,255,0.1);
        border-radius: 10px; cursor: pointer; transition: background 0.2s; flex-shrink: 0; }
      .mo-switch::after { content: ''; position: absolute; left: 2px; top: 2px; width: 16px; height: 16px;
        border-radius: 50%; background: #fff; transition: left 0.2s; }
      .mo-switch.mo-on { background: linear-gradient(90deg, #10b981, #34d399); }
      .mo-switch.mo-on::after { left: 18px; }
      .mo-counters { display: flex; flex-wrap: wrap; gap: 4px; font-size: 10px; font-family: 'JetBrains Mono', monospace; }
      .mo-counter { padding: 3px 7px; border-radius: 4px; background: rgba(15,23,41,0.8);
        border: 1px solid rgba(99,102,241,0.2); }
      .mo-c-script { color: #34d399; } .mo-c-nf { color: #67e8f9; } .mo-c-fetch { color: #fbbf24; }
      .mo-c-xhr { color: #f0abfc; } .mo-c-hide { color: #fb923c; } .mo-c-nav { color: #a5b4fc; }
      .mo-c-cd { color: #f0abfc; } .mo-c-total { color: #fff; font-weight: 700; }

      /* Floating launcher (shown when HUD is hidden) — TLS pill, bottom-right */
      #mo-launcher {
        position: fixed !important;
        right: 14px !important;
        bottom: 14px !important;
        top: auto !important;
        left: auto !important;
        transform: none !important;
        z-index: 2147483647 !important;
        padding: 0 22px; height: 50px; border-radius: 25px;
        background: linear-gradient(135deg, #0f1729 0%, #1e293b 50%, #0f1729 100%);
        border: 1.5px solid rgba(99,102,241,0.5);
        box-shadow:
          0 12px 32px rgba(0,0,0,0.6),
          0 0 0 1px rgba(99,102,241,0.2) inset,
          0 0 30px rgba(168,85,247,0.35);
        cursor: pointer;
        align-items: center; justify-content: center;
        font-family: 'Inter','Segoe UI',system-ui,sans-serif;
        transition: transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s, border-color 0.2s;
        user-select: none; overflow: hidden;
      }
      #mo-launcher:hover {
        transform: translateY(-3px) scale(1.05) !important;
        border-color: rgba(168,85,247,0.8);
        box-shadow:
          0 16px 40px rgba(0,0,0,0.7),
          0 0 0 1px rgba(168,85,247,0.5) inset,
          0 0 40px rgba(168,85,247,0.6);
      }
      #mo-launcher:active { transform: translateY(0) scale(0.97) !important; }
      #mo-launcher .mo-launcher-text {
        font-size: 20px;
        font-weight: 900;
        letter-spacing: 5px;
        padding-left: 3px; /* visual balance for the wide letter-spacing */
        background: linear-gradient(90deg, #67e8f9 0%, #a78bfa 50%, #f0abfc 100%);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        filter: drop-shadow(0 1px 2px rgba(0,0,0,0.4));
        position: relative; z-index: 2;
        white-space: nowrap;
      }
      #mo-launcher .mo-launcher-pulse {
        position: absolute; inset: -1px; border-radius: 25px;
        border: 1.5px solid rgba(168,85,247,0.5);
        animation: mo-pulse 2.2s ease-out infinite;
        pointer-events: none;
      }
      #mo-launcher .mo-launcher-shine {
        position: absolute; inset: 0; border-radius: 25px;
        background: linear-gradient(120deg,
          transparent 30%,
          rgba(255,255,255,0.1) 50%,
          transparent 70%);
        pointer-events: none;
        animation: mo-shine 3.5s ease-in-out infinite;
      }
      @keyframes mo-pulse {
        0% { transform: scale(1); opacity: 0.7; }
        100% { transform: scale(1.15); opacity: 0; }
      }
      @keyframes mo-shine {
        0%, 100% { transform: translateX(-100%); opacity: 0; }
        50% { transform: translateX(100%); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    // Floating launcher button (shows when HUD is hidden)
    const launcher = document.createElement('div');
    launcher.id = 'mo-launcher';
    launcher.title = 'Open TLS Month Control';
    launcher.style.display = 'none'; // start hidden; applyHudVisibility() will fix
    launcher.innerHTML = `<span class="mo-launcher-shine"></span><span class="mo-launcher-pulse"></span><span class="mo-launcher-text">TLS</span>`;
    launcher.onclick = () => {
      HUD_HIDDEN = false;
      saveHudState(false);
      applyHudVisibility();
    };
    document.body.appendChild(launcher);

    const box = document.createElement('div');
    box.id = 'mo-hud';
    box.innerHTML = `
      <div id="mo-hud-head">
        <span id="mo-hud-title">𝑵𝒆𝒘 𝑺𝒄𝒓𝒊𝒑𝒕 𝑻𝒍𝒔 𝑴𝒐𝒏𝒕𝒉 𝑩𝒚 𝑴𝒐𝒉𝒂𝒎𝒆𝒅</span>
        <div style="display:flex;align-items:center;gap:6px">
          <span id="mo-hud-ver">v5.9</span>
          <button id="mo-hud-close" class="mo-hud-btn" title="Hide (shrink to TLS button)">TLS</button>
        </div>
      </div>
      <div id="mo-hud-body">
        <div class="mo-section">
          <div class="mo-label">Target Month (first visible)</div>
          <div class="mo-month-grid" id="mo-months"></div>
          <div class="mo-row" style="margin-top:8px">
            <span class="mo-input-label">Y</span>
            <input id="mo_year" class="mo-input" type="number" min="2024" max="2030" value="${S.year}">
            <button id="mo_apply" class="mo-btn mo-btn-primary">Save</button>
          </div>
        </div>

        <div class="mo-section">
          <div class="mo-label">Behavior</div>
          <div class="mo-toggle-row">
            <span>Swap currentDate (server-side)</span>
            <div id="mo_swap_toggle" class="mo-switch ${S.swapCurrentDate ? 'mo-on' : ''}"></div>
          </div>
          <div class="mo-toggle-row">
            <span>Auto-navigate (fallback)</span>
            <div id="mo_nav_toggle" class="mo-switch ${S.autoNavigate ? 'mo-on' : ''}"></div>
          </div>
          <div class="mo-toggle-row">
            <span>Hide months before target</span>
            <div id="mo_hide_m_toggle" class="mo-switch ${S.hidePastMonths ? 'mo-on' : ''}"></div>
          </div>
          <div class="mo-toggle-row">
            <span>Hide slots before target</span>
            <div id="mo_hide_s_toggle" class="mo-switch ${S.hidePastSlots ? 'mo-on' : ''}"></div>
          </div>
        </div>

        <div class="mo-section">
          <div class="mo-label">maxDate Override</div>
          <div class="mo-row">
            <span class="mo-input-label">Y</span>
            <input id="mo_max_y" class="mo-input" type="number" min="2025" max="2030" value="${S.maxYear}">
            <span class="mo-input-label">M</span>
            <input id="mo_max_m" class="mo-input" type="number" min="1" max="12" value="${S.maxMonth}">
            <button id="mo_max_apply" class="mo-btn mo-btn-warn">Set</button>
          </div>
          <div style="margin-top:6px;color:#64748b;font-size:10px">↻ Reload for server-side swap/maxDate</div>
        </div>

        <div class="mo-section">
          <div class="mo-label">Status</div>
          <div class="mo-status-grid">
            <div class="mo-status-item">
              <span class="mo-status-k">Target</span>
              <span class="mo-pill" id="mo_saved" style="background:rgba(16,185,129,0.15);color:#34d399">${MONTHS[S.monthIdx]} ${S.year}</span>
            </div>
            <div class="mo-status-item">
              <span class="mo-status-k">maxDate</span>
              <span class="mo-pill" id="mo_maxd" style="background:rgba(251,191,36,0.15);color:#fbbf24">${S.maxYear}-${String(S.maxMonth).padStart(2,'0')}</span>
            </div>
            <div class="mo-status-item">
              <span class="mo-status-k">currentDate</span>
              <span class="mo-pill" id="mo_cd" style="background:rgba(240,171,252,0.15);color:#f0abfc">${buildCurrentDateStr()}</span>
            </div>
            <div class="mo-status-item">
              <span class="mo-status-k">Showing</span>
              <span class="mo-pill" id="mo_cur" style="background:rgba(103,232,249,0.15);color:#67e8f9">—</span>
            </div>
          </div>
          <div class="mo-counters" style="margin-top:8px">
            <span class="mo-counter mo-c-script">script:<span id="mo_c_script">0</span></span>
            <span class="mo-counter mo-c-nf">nf:<span id="mo_c_nf">0</span></span>
            <span class="mo-counter mo-c-fetch">fetch:<span id="mo_c_fetch">0</span></span>
            <span class="mo-counter mo-c-xhr">xhr:<span id="mo_c_xhr">0</span></span>
            <span class="mo-counter mo-c-cd">cd:<span id="mo_c_cd">0</span></span>
            <span class="mo-counter mo-c-hide">hide:<span id="mo_c_hide">0</span></span>
            <span class="mo-counter mo-c-nav">nav:<span id="mo_c_nav">0</span></span>
            <span class="mo-counter mo-c-total">Σ:<span id="mo_count">0</span></span>
          </div>
        </div>

        <div class="mo-section" style="display:flex;gap:6px">
          <button id="mo_jump" class="mo-btn mo-btn-primary" style="flex:1">→ Jump</button>
          <button id="mo_reapply" class="mo-btn mo-btn-ghost" style="flex:1">↻ Reapply</button>
          <button id="mo_reload" class="mo-btn mo-btn-ghost" style="flex:1">⟳ Reload</button>
        </div>
      </div>
    `;
    document.body.appendChild(box);

    const mGrid = box.querySelector('#mo-months');
    MONTHS.forEach((m, i) => {
      const btn = document.createElement('button');
      btn.className = 'mo-month-btn' + (i === S.monthIdx ? ' mo-active' : '');
      btn.dataset.mi = i; btn.textContent = m;
      mGrid.appendChild(btn);
    });

    function clearAllHidden() {
      document.querySelectorAll('[data-mo-hidden="1"]').forEach(el => {
        el.dataset.moHidden = '0'; el.style.display = '';
      });
      document.querySelectorAll('[data-mo-slot-hidden="1"]').forEach(el => {
        el.dataset.moSlotHidden = '0'; el.style.display = '';
      });
      const badge = document.getElementById('mo-empty-badge');
      if (badge) badge.remove();
      hiddenMonthsCount = 0; hiddenSlotsCount = 0;
    }

    function refreshInfo() {
      const sv = box.querySelector('#mo_saved');
      const mx = box.querySelector('#mo_maxd');
      const cd = box.querySelector('#mo_cd');
      if (sv) sv.textContent = `${MONTHS[S.monthIdx]} ${S.year}`;
      if (mx) mx.textContent = `${S.maxYear}-${String(S.maxMonth).padStart(2,'0')}`;
      if (cd) cd.textContent = buildCurrentDateStr();
      box.querySelectorAll('.mo-month-btn').forEach(btn => {
        const i = parseInt(btn.dataset.mi, 10);
        btn.classList.toggle('mo-active', i === S.monthIdx);
      });
      clearAllHidden();
      resetNavState();
      hidePastMonths();
      hidePastSlots();
      injectShowingBadge();
    }

    box.querySelectorAll('.mo-month-btn').forEach(btn => {
      btn.onclick = () => { S.monthIdx = parseInt(btn.dataset.mi, 10); save(); refreshInfo(); };
    });
    box.querySelector('#mo_apply').onclick = () => {
      S.year = parseInt(box.querySelector('#mo_year').value, 10); save(); refreshInfo();
    };
    box.querySelector('#mo_max_apply').onclick = () => {
      S.maxYear = parseInt(box.querySelector('#mo_max_y').value, 10);
      S.maxMonth = parseInt(box.querySelector('#mo_max_m').value, 10);
      save(); refreshInfo();
    };
    box.querySelector('#mo_hide_m_toggle').onclick = (e) => {
      S.hidePastMonths = !S.hidePastMonths; save();
      e.currentTarget.classList.toggle('mo-on', S.hidePastMonths);
      if (!S.hidePastMonths) clearAllHidden();
      hidePastMonths(); hidePastSlots(); injectShowingBadge();
    };
    box.querySelector('#mo_hide_s_toggle').onclick = (e) => {
      S.hidePastSlots = !S.hidePastSlots; save();
      e.currentTarget.classList.toggle('mo-on', S.hidePastSlots);
      hidePastSlots();
    };
    box.querySelector('#mo_nav_toggle').onclick = (e) => {
      S.autoNavigate = !S.autoNavigate; save();
      e.currentTarget.classList.toggle('mo-on', S.autoNavigate);
      if (S.autoNavigate) resetNavState();
    };
    box.querySelector('#mo_swap_toggle').onclick = (e) => {
      S.swapCurrentDate = !S.swapCurrentDate; save();
      e.currentTarget.classList.toggle('mo-on', S.swapCurrentDate);
    };
    box.querySelector('#mo_jump').onclick = () => {
      resetNavState();
      let i = 0;
      const id = setInterval(() => {
        i++;
        const cur = getCurrentMonthYM();
        if (cur == null || cur >= targetYM() || i > 24 || navDoneOrStuck) {
          clearInterval(id); return;
        }
        autoNavigateToTarget();
      }, 600);
    };
    box.querySelector('#mo_reapply').onclick = () => { reapply(); };
    box.querySelector('#mo_reload').onclick = () => { location.reload(); };

    const closeBtn = box.querySelector('#mo-hud-close');

    // Close (TLS) button -> hide HUD, show floating launcher
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      HUD_HIDDEN = true;
      saveHudState(true);
      applyHudVisibility();
    };

    // Apply saved visibility state
    applyHudVisibility();

    setInterval(() => {
      const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
      set('mo_count', patchCount);
      set('mo_c_script', scriptTagPatches);
      set('mo_c_nf', nextFPatches);
      set('mo_c_fetch', fetchPatches);
      set('mo_c_xhr', xhrPatches);
      set('mo_c_cd', currentDatePatches);
      set('mo_c_hide', hiddenMonthsCount);
      set('mo_c_nav', navClickCount);

      const curYM = getCurrentMonthYM();
      const curPill = document.getElementById('mo_cur');
      if (curPill) {
        if (curYM == null) curPill.textContent = '—';
        else {
          const y = Math.floor(curYM / 12);
          const mi = curYM % 12;
          curPill.textContent = `${MONTHS[mi]} ${y}`;
          if (curYM >= targetYM()) {
            curPill.style.background = 'rgba(16,185,129,0.15)';
            curPill.style.color = '#34d399';
          } else {
            curPill.style.background = 'rgba(239,68,68,0.15)';
            curPill.style.color = '#f87171';
          }
        }
      }
    }, 500);
  }

  function start() {
    hidePastMonths();
    hidePastSlots();
    injectShowingBadge();
    startDomObserver();
    buildHUD();
    setTimeout(autoNavigateToTarget, 800);
    setTimeout(autoNavigateToTarget, 1600);
    setTimeout(autoNavigateToTarget, 2400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();