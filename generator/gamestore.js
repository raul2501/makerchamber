'use strict';
// ─────────────────────────────────────────────────────────────────────────────
// gamestore.js — persistence SEAM for generated games (the unit you save/share).
// A "game" bundle = { id, concept, audience, conceptCard, rounds, shellHtml,
// verified, createdAt }. saveGame returns an id; a /play?id=<id> page loads it.
//
// Default impl: localStorage (works now, single-browser). B6 swaps the bodies of
// saveGame / loadGame for Supabase so links become cross-device shareable — the
// rest of the app only calls these two functions.
// ─────────────────────────────────────────────────────────────────────────────

window.GameStore = (function () {
  const KEY = 'lgg_games_v1';

  function _all() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (_) { return {}; } }
  function _write(obj) { localStorage.setItem(KEY, JSON.stringify(obj)); }
  function _id() { return 'g' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  // bundle: { concept, audience, conceptCard, rounds, shellHtml, verified }
  async function saveGame(bundle) {
    const id = bundle.id || _id();
    const all = _all();
    all[id] = Object.assign({ id, createdAt: new Date().toISOString() }, bundle);
    _write(all);
    return id;
  }

  async function loadGame(id) {
    return _all()[id] || null;
  }

  async function listGames() {
    return Object.values(_all()).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }

  // Shareable URL for a saved game (cross-device once B6 swaps to Supabase).
  function playUrl(id) {
    return location.origin + '/generator/play.html?id=' + encodeURIComponent(id);
  }

  return { saveGame, loadGame, listGames, playUrl };
})();
