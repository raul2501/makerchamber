'use strict';
// ─────────────────────────────────────────────────────────────────────────────
// store.js — results persistence SEAM.
// Default impl: localStorage. Swap to Supabase at P5 by replacing the body of
// saveResult / getResults only; the rest of the app calls these two functions.
// ─────────────────────────────────────────────────────────────────────────────

const STORE_KEY = 'lgg_results_v1';

/**
 * Result {
 *   sessionId, concept, templateType,
 *   preScore, postScore, delta,          // test scores (0..N correct)
 *   total,                                // questions per test
 *   confBefore, confAfter,               // 1..5
 *   ts                                   // ISO string
 * }
 */
async function saveResult(result) {
  const all = _readLocal();
  all.push(result);
  localStorage.setItem(STORE_KEY, JSON.stringify(all));
  return result;
}

async function getResults() {
  return _readLocal();
}

async function clearResults() {
  localStorage.removeItem(STORE_KEY);
}

function _readLocal() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
  } catch (_) {
    return [];
  }
}

// Aggregate helper for the dashboard.
function summarize(results) {
  const n = results.length;
  if (!n) return { n: 0, avgPre: 0, avgPost: 0, avgDelta: 0, avgConfBefore: 0, avgConfAfter: 0, byConcept: {} };
  const sum = (f) => results.reduce((a, r) => a + (Number(f(r)) || 0), 0);
  const byConcept = {};
  for (const r of results) {
    const k = r.concept || 'unknown';
    (byConcept[k] = byConcept[k] || []).push(r);
  }
  return {
    n,
    avgPre: sum(r => r.preScore) / n,
    avgPost: sum(r => r.postScore) / n,
    avgDelta: sum(r => r.delta) / n,
    avgConfBefore: sum(r => r.confBefore) / n,
    avgConfAfter: sum(r => r.confAfter) / n,
    byConcept,
  };
}

window.Store = { saveResult, getResults, clearResults, summarize };
