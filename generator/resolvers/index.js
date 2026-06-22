'use strict';
// ─────────────────────────────────────────────────────────────────────────────
// resolvers/index.js — the resolver REGISTRY.
// A resolver is a domain answer-key: resolve(concept, opts) → { rounds, verified:true,
// source } or null. The registry tries registered resolvers; null means "no trusted
// source for this concept" → the caller falls back to LLM-proposed answers (badged).
// Resolvers register themselves (e.g. resolvers/tokenization.js).
// ─────────────────────────────────────────────────────────────────────────────

window.Resolvers = (function () {
  const registry = new Map();   // conceptKey → async resolver fn

  function register(keys, fn) {
    (Array.isArray(keys) ? keys : [keys]).forEach(k => registry.set(k.toLowerCase(), fn));
  }

  // Returns { rounds, verified, source } or null. Async (resolvers may load data).
  async function resolve(concept, opts) {
    const key = (concept || '').toLowerCase().trim();
    const fn = registry.get(key);
    if (!fn) return null;
    try {
      const out = await fn(concept, opts || {});
      if (out && Array.isArray(out.rounds) && out.rounds.length) return { verified: true, source: 'resolver', ...out };
      return null;
    } catch (_) {
      return null;
    }
  }

  function has(concept) { return registry.has((concept || '').toLowerCase().trim()); }
  function list() { return [...registry.keys()]; }

  return { register, resolve, has, list };
})();
