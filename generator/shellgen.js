'use strict';
// ─────────────────────────────────────────────────────────────────────────────
// shellgen.js — browser client for the LLM shell generator (B3).
// Calls the serverless function /api/generate-shell. Returns the raw HTML string
// or null on any failure (no key, network error, empty/garbled output). The
// caller (B4) is responsible for validating, sandboxing, and falling back to the
// trusted split_match template when this returns null or an unmountable page.
// ─────────────────────────────────────────────────────────────────────────────

window.ShellGen = (function () {
  // input: { conceptName, oneLine, targetLearner, audience, mechanic }
  // returns: { html, mountable } | null
  async function generate(input) {
    try {
      const resp = await fetch('/api/generate-shell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input || {}),
      });
      if (!resp.ok) return null;
      const data = await resp.json();
      if (!data || !data.html || typeof data.html !== 'string') return null;
      return { html: data.html, mountable: !!data.mountable };
    } catch (_) {
      return null;
    }
  }

  return { generate };
})();
