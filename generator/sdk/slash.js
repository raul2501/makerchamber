'use strict';
// ═════════════════════════════════════════════════════════════════════════════
// Slash SDK — the trusted "split a thing into validated pieces" mechanic.
// Extracted from the-gate.html. The slash GEOMETRY is the playtested math, ported
// verbatim. The shell (themed page) mounts this and styles it via CSS hooks; it
// never reimplements the mechanic.
//
//   Slash.mount(containerEl, {
//     rounds: [{
//       item:     'unhappy',                 // the string to slash
//       correct:  ['un','happy'],            // the true split, shown at the reveal
//       accept:   (piece) => boolean,        // is this piece valid? (vocab membership, etc.)
//       insight?: { whatHappened, takeaway } // optional reveal copy
//     }],
//     onComplete: () => {},                  // called after the last round
//     options?: { showReveal: true }
//   })
//
// Theming: override CSS custom properties on the container (or a parent):
//   --slash-bg --slash-accent --slash-valid --slash-invalid --slash-text --slash-font-ui
// or target the class hooks (.slash-arena, .slash-piece, .slash-reveal, ...).
// ═════════════════════════════════════════════════════════════════════════════

window.Slash = (function () {
  const TUNING = { MIN_SWIPE: 16, HIT_PAD_Y: 14, HIT_PAD_X: 6, TRAIL_FADE_MS: 200, TRAIL_REMOVE_MS: 260 };
  let _styleInjected = false;
  let _idSeq = 0;

  function injectStyle() {
    if (_styleInjected) return;
    _styleInjected = true;
    const css = `
.slash-root { --slash-bg:#1a1a1a; --slash-accent:#FFC107; --slash-valid:#80d840; --slash-valid-bd:#3a6820;
  --slash-invalid:#e06060; --slash-invalid-bd:#7a2020; --slash-text:#eee; --slash-font-ui:'JetBrains Mono',monospace;
  color:var(--slash-text); width:100%; }
.slash-word-label { font-family:var(--slash-font-ui); font-size:11px; letter-spacing:4px; text-transform:uppercase; color:#888; text-align:center; margin-bottom:16px; }
.slash-arena { display:flex; flex-direction:column; align-items:center; width:100%; min-height:240px; position:relative;
  touch-action:none; user-select:none; cursor:crosshair; }
.slash-entry, .slash-through { width:100%; display:flex; flex-wrap:wrap; gap:8px; justify-content:center; padding:12px; }
.slash-entry { min-height:80px; align-items:flex-end; }
.slash-through { min-height:72px; align-items:flex-start; }
.slash-bar { width:100%; height:4px; background:linear-gradient(90deg,transparent,var(--slash-accent) 20%,var(--slash-accent) 80%,transparent); flex-shrink:0; }
.slash-piece { font-family:var(--slash-font-ui); font-size:30px; font-weight:600; padding:12px 18px; border-radius:3px; border:2px solid; white-space:nowrap; user-select:none;
  transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease; }
.slash-piece.piece-enter { opacity:0; transform:scale(0.8); }
.slash-piece.held-back { background:#2a0a0a; border-color:var(--slash-invalid-bd); color:var(--slash-invalid); touch-action:none; }
.slash-piece.valid { background:#0a1f08; border-color:var(--slash-valid-bd); color:var(--slash-valid); }
.slash-hint { text-align:center; font-family:var(--slash-font-ui); font-size:13px; color:#888; margin-top:16px; min-height:20px; }
.slash-actions { display:flex; flex-direction:column; align-items:center; gap:12px; margin-top:16px; }
.slash-pass { display:none; padding:13px 40px; background:var(--slash-valid-bd); color:#c8f080; border:none; font-family:var(--slash-font-ui); font-weight:600; font-size:15px; cursor:pointer; border-radius:2px; }
.slash-pass.visible { display:block; }
.slash-reset { padding:7px 16px; background:transparent; color:#888; border:1px solid #444; font-family:var(--slash-font-ui); font-size:12px; cursor:pointer; border-radius:2px; }
.slash-reset:hover { border-color:#888; color:#ccc; }
.slash-reveal { display:none; flex-direction:column; gap:18px; align-items:center; padding:8px 0; }
.slash-reveal.show { display:flex; }
.slash-reveal-cols { display:flex; gap:22px; align-items:center; flex-wrap:wrap; justify-content:center; }
.slash-col { display:flex; flex-direction:column; gap:8px; align-items:center; }
.slash-col-label { font-family:var(--slash-font-ui); font-size:9px; letter-spacing:3px; text-transform:uppercase; color:#888; }
.slash-chips { display:flex; flex-wrap:wrap; gap:8px; justify-content:center; }
.slash-chip { font-family:var(--slash-font-ui); font-size:17px; font-weight:600; padding:7px 12px; border-radius:3px; }
.slash-chip.correct { background:#0a1f08; border:2px solid var(--slash-valid-bd); color:var(--slash-valid); }
.slash-chip.same { background:#0a1f08; border:2px dashed var(--slash-valid-bd); color:var(--slash-valid); opacity:.7; }
.slash-chip.diff { background:#2a2a0a; border:2px dashed #7a6820; color:#c0a840; opacity:.8; }
.slash-vs { font-family:var(--slash-font-ui); color:#777; font-size:14px; }
.slash-insight { font-family:var(--slash-font-ui); font-size:14px; color:#cfcfcf; line-height:1.6; text-align:center; max-width:460px; }
.slash-insight b { color:var(--slash-accent); }
.slash-next { padding:13px 40px; background:#3a5870; color:#80c8e8; border:none; font-family:var(--slash-font-ui); font-weight:600; font-size:15px; cursor:pointer; border-radius:2px; }
.slash-svg { position:fixed; inset:0; width:100%; height:100%; pointer-events:none; z-index:9000; }
@media (prefers-reduced-motion: reduce){ .slash-piece{ transition:none; } }`;
    const el = document.createElement('style');
    el.id = 'slash-sdk-style';
    el.textContent = css;
    document.head.appendChild(el);
  }

  function mount(container, config) {
    injectStyle();
    const id = ++_idSeq;
    const rounds = (config.rounds || []).filter(r => r && r.item);
    const onComplete = config.onComplete || function () {};
    const showReveal = !(config.options && config.options.showReveal === false);

    // ── per-instance state ──
    let roundIdx = 0, word = '', cuts = new Set(), cutHistory = [];
    const pieceEls = new Map();
    let slashActive = false, slashPath = [], slashAnimId = null, slashPolyline = null, activePointerId = null;

    // ── DOM ──
    container.classList.add('slash-root');
    container.innerHTML = `
      <div class="slash-word-label"></div>
      <div class="slash-arena">
        <div class="slash-entry"></div>
        <div class="slash-bar"></div>
        <div class="slash-through"></div>
      </div>
      <div class="slash-hint"></div>
      <div class="slash-actions">
        <button class="slash-pass" type="button">Send through →</button>
        <button class="slash-reset" type="button">↺ reset</button>
      </div>
      <div class="slash-reveal">
        <div class="slash-reveal-cols">
          <div class="slash-col"><div class="slash-col-label">Your split</div><div class="slash-chips your"></div></div>
          <div class="slash-vs">vs</div>
          <div class="slash-col"><div class="slash-col-label">Correct split</div><div class="slash-chips correct"></div></div>
        </div>
        <div class="slash-insight"></div>
        <button class="slash-next" type="button">Next →</button>
      </div>`;
    const $ = (s) => container.querySelector(s);
    const arena = $('.slash-arena'), entry = $('.slash-entry'), through = $('.slash-through');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('slash-svg'); svg.id = 'slash-svg-' + id; document.body.appendChild(svg);

    // ── segments (single source of truth: word + cuts, validity via accept) ──
    function getSegments() {
      const r = rounds[roundIdx];
      const sorted = [...cuts].filter(c => c > 0 && c < word.length).sort((a, b) => a - b);
      const segs = []; let start = 0;
      for (const c of sorted) { segs.push({ text: word.slice(start, c), start, end: c }); start = c; }
      segs.push({ text: word.slice(start), start, end: word.length });
      // Validity comes from accept() (in-process) OR a serializable vocab array
      // (sandbox-safe — functions can't cross the iframe boundary in B3).
      const isValid = typeof r.accept === 'function'
        ? (p) => !!r.accept(p)
        : (p) => Array.isArray(r.vocab) && r.vocab.includes(p);
      return segs.map(s => ({ ...s, valid: isValid(s.text) }));
    }

    // ── keyed-reconcile render (no teardown / no flicker) ──
    function render() {
      const segs = getSegments();
      let allValid = segs.length > 0, anyHeld = false;
      const desiredEntry = [], desiredThrough = [], keys = new Set(), fresh = [];
      segs.forEach(seg => {
        const key = seg.start + '-' + seg.end; keys.add(key);
        let el = pieceEls.get(key);
        if (!el) { el = document.createElement('div'); el.className = 'slash-piece piece-enter'; el.textContent = seg.text; pieceEls.set(key, el); fresh.push(el); }
        el.dataset.start = String(seg.start);
        el.classList.toggle('valid', seg.valid); el.classList.toggle('held-back', !seg.valid);
        if (seg.valid) desiredThrough.push(el); else { desiredEntry.push(el); anyHeld = true; allValid = false; }
      });
      for (const [key, el] of [...pieceEls]) if (!keys.has(key)) { el.remove(); pieceEls.delete(key); }
      desiredEntry.forEach(el => entry.appendChild(el));
      desiredThrough.forEach(el => through.appendChild(el));
      if (fresh.length) requestAnimationFrame(() => fresh.forEach(el => el.classList.remove('piece-enter')));
      $('.slash-reset').disabled = cutHistory.length === 0;
      const pass = $('.slash-pass');
      if (allValid) { pass.classList.add('visible'); $('.slash-hint').textContent = cuts.size === 0 ? 'Already valid — send it through.' : 'All pieces valid — send them through.'; }
      else { pass.classList.remove('visible'); if (anyHeld) $('.slash-hint').textContent = 'Red pieces aren\'t valid yet. Slash a red piece to cut it smaller.'; }
    }

    function loadRound(i) {
      roundIdx = i; cuts = new Set(); cutHistory = []; pieceEls.clear();
      entry.innerHTML = ''; through.innerHTML = '';
      word = rounds[i].item;
      $('.slash-word-label').textContent = word;
      $('.slash-reveal').classList.remove('show');
      arena.style.display = ''; $('.slash-actions').style.display = '';
      render();
    }

    // ── slash input (geometry ported verbatim from the validated gate) ──
    function onDown(e) {
      if (slashActive) return; e.preventDefault();
      try { arena.setPointerCapture(e.pointerId); } catch (_) {} // non-fatal if no active pointer
      activePointerId = e.pointerId;
      slashActive = true; slashPath = [{ x: e.clientX, y: e.clientY }];
      slashPolyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      slashPolyline.setAttribute('stroke', 'rgba(255,193,7,0.7)'); slashPolyline.setAttribute('stroke-width', '3');
      slashPolyline.setAttribute('stroke-linecap', 'round'); slashPolyline.setAttribute('fill', 'none');
      svg.appendChild(slashPolyline); scheduleTrail();
    }
    function onMove(e) { if (!slashActive || e.pointerId !== activePointerId) return; e.preventDefault(); slashPath.push({ x: e.clientX, y: e.clientY }); }
    function onUp(e) {
      if (!slashActive || e.pointerId !== activePointerId) return; e.preventDefault();
      slashActive = false; activePointerId = null;
      if (slashAnimId) { cancelAnimationFrame(slashAnimId); slashAnimId = null; }
      fadeTrail(slashPolyline); slashPolyline = null;
      const path = slashPath; slashPath = [];
      if (path.length < 2) return;
      const dx = path[path.length - 1].x - path[0].x, dy = path[path.length - 1].y - path[0].y;
      if (Math.sqrt(dx * dx + dy * dy) < TUNING.MIN_SWIPE) return;
      resolveSlash(path);
    }
    function onCancel() { slashActive = false; activePointerId = null; if (slashAnimId) { cancelAnimationFrame(slashAnimId); slashAnimId = null; } fadeTrail(slashPolyline); slashPolyline = null; slashPath = []; }

    function fadeTrail(poly) { if (!poly) return; poly.style.transition = `opacity ${TUNING.TRAIL_FADE_MS}ms ease-out`; requestAnimationFrame(() => poly.style.opacity = '0'); setTimeout(() => poly.remove(), TUNING.TRAIL_REMOVE_MS); }
    function scheduleTrail() { if (!slashActive) return; slashAnimId = requestAnimationFrame(() => { if (slashPolyline && slashPath.length > 1) slashPolyline.setAttribute('points', slashPath.map(p => `${p.x},${p.y}`).join(' ')); scheduleTrail(); }); }

    function resolveSlash(path) {
      const chips = [...entry.querySelectorAll('.slash-piece.held-back')];
      for (const chip of chips) {
        const rect = chip.getBoundingClientRect();
        const crossX = chipSlashX(path, rect); if (crossX === null) continue;
        const start = parseInt(chip.dataset.start, 10); if (isNaN(start)) continue;
        const localGap = findNearestGap(chip, crossX); if (localGap === null) continue;
        const wordGap = start + localGap;
        if (!cuts.has(wordGap)) { cuts.add(wordGap); cutHistory.push(wordGap); }
        render(); return;
      }
    }
    function chipSlashX(path, rect) {
      const padY = TUNING.HIT_PAD_Y, padX = TUNING.HIT_PAD_X, xs = [];
      for (const p of path) if (p.y >= rect.top - padY && p.y <= rect.bottom + padY && p.x >= rect.left - padX && p.x <= rect.right + padX) xs.push(Math.max(rect.left, Math.min(rect.right, p.x)));
      if (xs.length) return xs[Math.floor(xs.length / 2)];
      const midY = (rect.top + rect.bottom) / 2, cx = crossXAtMidY(path, midY);
      return (cx >= rect.left && cx <= rect.right) ? cx : null;
    }
    function crossXAtMidY(path, midY) {
      for (let i = 1; i < path.length; i++) { const a = path[i - 1], b = path[i]; if ((a.y - midY) * (b.y - midY) <= 0) { const dy = b.y - a.y, t = Math.abs(dy) < 0.001 ? 0 : (midY - a.y) / dy; return a.x + t * (b.x - a.x); } }
      let best = path[0], bd = Math.abs(path[0].y - midY); for (const p of path) { const d = Math.abs(p.y - midY); if (d < bd) { bd = d; best = p; } } return best.x;
    }
    function findNearestGap(el, clientX) {
      const text = el.textContent, len = text.length; if (len < 2) return null;
      const centers = getCharCenters(el, text); if (!centers || centers.length < 2) return null;
      let bestGap = 1, bestD = Infinity;
      for (let g = 1; g <= len - 1; g++) { const gx = (centers[g - 1] + centers[g]) / 2, d = Math.abs(clientX - gx); if (d < bestD) { bestD = d; bestGap = g; } }
      return bestGap;
    }
    function getCharCenters(el, text) {
      const node = el.firstChild, centers = [];
      if (node && node.nodeType === Node.TEXT_NODE) {
        const range = document.createRange();
        for (let i = 0; i < text.length; i++) {
          try { range.setStart(node, i); range.setEnd(node, i + 1); const rs = range.getClientRects(); if (rs.length) { centers.push((rs[0].left + rs[0].right) / 2); continue; } } catch (_) {}
          const er = el.getBoundingClientRect(), cw = er.width / text.length; centers.push(er.left + cw * i + cw / 2);
        }
      } else { const er = el.getBoundingClientRect(), cw = er.width / text.length; for (let i = 0; i < text.length; i++) centers.push(er.left + cw * i + cw / 2); }
      return centers;
    }

    // ── pass → reveal → next ──
    function pass() {
      const playerSplit = getSegments().map(s => s.text);
      if (!showReveal) { advance(); return; }
      const r = rounds[roundIdx], correct = r.correct || [word];
      const your = container.querySelector('.slash-chips.your'); your.innerHTML = '';
      playerSplit.forEach(seg => { const c = document.createElement('div'); c.className = 'slash-chip ' + (correct.includes(seg) ? 'same' : 'diff'); c.textContent = seg; your.appendChild(c); });
      const cor = container.querySelector('.slash-chips.correct'); cor.innerHTML = '';
      correct.forEach(seg => { const c = document.createElement('div'); c.className = 'slash-chip correct'; c.textContent = seg; cor.appendChild(c); });
      const insight = r.insight || {};
      $('.slash-insight').innerHTML = [insight.whatHappened, insight.takeaway].filter(Boolean).map(t => `<div>${t}</div>`).join('');
      const last = roundIdx === rounds.length - 1;
      $('.slash-next').textContent = last ? 'Finish →' : 'Next →';
      arena.style.display = 'none'; $('.slash-actions').style.display = 'none';
      $('.slash-reveal').classList.add('show');
    }
    function advance() { if (roundIdx >= rounds.length - 1) finish(); else loadRound(roundIdx + 1); }
    function finish() { svg.remove(); onComplete(); }

    // ── wire ──
    arena.addEventListener('pointerdown', onDown);
    arena.addEventListener('pointermove', onMove);
    arena.addEventListener('pointerup', onUp);
    arena.addEventListener('pointercancel', onCancel);
    $('.slash-pass').addEventListener('click', pass);
    $('.slash-reset').addEventListener('click', () => loadRound(roundIdx));
    $('.slash-next').addEventListener('click', advance);

    if (!rounds.length) { container.innerHTML = '<div class="slash-hint">No rounds.</div>'; onComplete(); return { destroy() {} }; }
    loadRound(0);

    // small handle for the shell (cleanup if it tears down the page)
    return { destroy() { svg.remove(); } };
  }

  return { mount };
})();
