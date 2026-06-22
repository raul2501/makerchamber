'use strict';
// ─────────────────────────────────────────────────────────────────────────────
// sandbox.js — B4 guardrails. Turns an untrusted LLM-generated HTML shell into a
// safe, playable game, or reports that it can't (so the caller falls back to the
// trusted split_match template).
//
//   1. validate(html)  — structural check: does it actually mount the SDK?
//   2. mount(el, {html, rounds, onComplete})
//        - injects <base> (so /generator/sdk/slash.js resolves) + the VERIFIED
//          rounds as window.GAME_ROUNDS + window.GAME_DONE (posts to parent)
//        - runs it in an iframe sandboxed with allow-scripts ONLY (opaque origin:
//          no access to parent storage/cookies, even under prompt injection)
//        - resolves onComplete when the game posts 'cf-game-done'
//
// The LLM page can't touch the mechanic (the SDK owns it), can't see the answers
// it didn't get (we inject them), and can't reach the parent page (sandbox).
// ─────────────────────────────────────────────────────────────────────────────

window.Sandbox = (function () {
  function validate(html) {
    const issues = [];
    if (!html || typeof html !== 'string') { return { ok: false, issues: ['no html'] }; }
    if (!/Slash\.mount\s*\(/.test(html)) issues.push('no Slash.mount() call');
    if (!/id\s*=\s*["']game["']/.test(html)) issues.push('no #game container');
    if (!html.includes('/generator/sdk/slash.js')) issues.push('does not load the Slash SDK');
    // The page must NOT define the injected globals — that would be it inventing data.
    if (/window\.GAME_ROUNDS\s*=/.test(html)) issues.push('page defines GAME_ROUNDS (must not)');
    return { ok: issues.length === 0, issues };
  }

  function injectRuntime(html, rounds) {
    const globals =
      '<base href="' + location.origin + '/">' +
      '<script>window.GAME_ROUNDS=' + JSON.stringify(rounds || []) + ';' +
      'window.GAME_DONE=function(){parent.postMessage({type:"cf-game-done"},"*");};<\/script>';
    // Run before any of the page's own scripts.
    if (/<head[^>]*>/i.test(html)) return html.replace(/<head[^>]*>/i, (m) => m + globals);
    if (/<html[^>]*>/i.test(html)) return html.replace(/<html[^>]*>/i, (m) => m + '<head>' + globals + '</head>');
    return globals + html;
  }

  // Returns { ok }. If ok=false, the caller should fall back to split_match.
  function mount(containerEl, opts) {
    const v = validate(opts && opts.html);
    if (!v.ok) return { ok: false, issues: v.issues };

    containerEl.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.setAttribute('sandbox', 'allow-scripts');           // opaque origin, no parent access
    iframe.style.cssText = 'width:100%;min-height:560px;border:0;display:block;border-radius:6px;background:#000;';
    iframe.srcdoc = injectRuntime(opts.html, opts.rounds);

    function onMsg(e) {
      if (e.source !== iframe.contentWindow) return;            // only this iframe
      if (e.data && e.data.type === 'cf-game-done') {
        window.removeEventListener('message', onMsg);
        if (opts.onComplete) opts.onComplete();
      }
    }
    window.addEventListener('message', onMsg);
    containerEl.appendChild(iframe);
    return { ok: true };
  }

  return { validate, mount, injectRuntime };
})();
