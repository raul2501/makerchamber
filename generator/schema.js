'use strict';
// ─────────────────────────────────────────────────────────────────────────────
// schema.js — ConceptCard validation + repair (THE SPINE).
// Never trust a card (AI or otherwise) before launching a game. validateAndRepair
// returns { ok, card, issues[] }. For split_match, the critical invariant is that
// every piece of `correct` is present in `vocab` (else the round is unwinnable),
// and that single-character fallbacks exist so any word can always be reduced.
// ─────────────────────────────────────────────────────────────────────────────

const TEMPLATES = ['split_match', 'attention_weights', 'balance_transform'];

// Deterministic template selection from free-text mechanics (spec rule).
function selectTemplate(mechanics) {
  const m = (mechanics || []).join(' ').toLowerCase();
  if (/\bsplit\b|\bmatch\b/.test(m)) return 'split_match';
  if (/\bcompare\b|\bweigh\b|\bcombine\b/.test(m)) return 'attention_weights';
  if (/\bbalance\b|\btransform\b/.test(m)) return 'balance_transform';
  return 'split_match'; // default
}

function validateAndRepairCard(raw) {
  const issues = [];
  const card = JSON.parse(JSON.stringify(raw || {}));

  // Template-agnostic shape.
  card.conceptName = card.conceptName || 'Untitled concept';
  card.oneLine = card.oneLine || '';
  card.targetLearner = card.targetLearner || 'Curious beginner';
  card.mechanics = Array.isArray(card.mechanics) ? card.mechanics : [];
  card.objects = Array.isArray(card.objects) ? card.objects : [];
  card.constraints = Array.isArray(card.constraints) ? card.constraints : [];
  card.templateType = TEMPLATES.includes(card.templateType)
    ? card.templateType
    : selectTemplate(card.mechanics);
  card.preTest = _repairQuestions(card.preTest, issues, 'preTest');
  card.postTest = _repairQuestions(card.postTest, issues, 'postTest');
  card.feedback = card.feedback || {};
  card.feedback.introLines = Array.isArray(card.feedback.introLines) ? card.feedback.introLines : [];
  card.feedback.objective = card.feedback.objective || '';
  card.feedback.doneTitle = card.feedback.doneTitle || 'Done.';
  card.feedback.doneBody = card.feedback.doneBody || '';
  card.payload = card.payload || {};

  // Template-specific repair.
  if (card.templateType === 'split_match') {
    _repairSplitMatch(card, issues);
  }

  const ok = issues.filter(i => i.fatal).length === 0;
  return { ok, card, issues };
}

function _repairQuestions(qs, issues, label) {
  if (!Array.isArray(qs) || qs.length === 0) {
    issues.push({ fatal: false, msg: `${label} missing — using empty set` });
    return [];
  }
  return qs.filter(q => q && q.q && Array.isArray(q.options) && q.options.length >= 2)
    .map(q => ({
      q: String(q.q),
      options: q.options.map(String),
      answerIndex: Number.isInteger(q.answerIndex) && q.answerIndex >= 0 && q.answerIndex < q.options.length ? q.answerIndex : 0,
    }));
}

// split_match: rounds = [{ word, correct[], vocab[], whatHappened, takeaway }].
// Invariant: every correct piece ∈ vocab; vocab always includes single chars so
// the word can always be reduced to valid pieces.
function _repairSplitMatch(card, issues) {
  let rounds = Array.isArray(card.payload.rounds) ? card.payload.rounds : [];
  if (rounds.length === 0) {
    issues.push({ fatal: true, msg: 'split_match has no rounds' });
    card.payload.rounds = [];
    return;
  }
  card.payload.rounds = rounds.map((r, i) => {
    const word = String(r.word || r.item || '').trim();
    const correct = Array.isArray(r.correct) && r.correct.length ? r.correct.map(String) : [word];
    const vocab = new Set((Array.isArray(r.vocab) ? r.vocab : []).map(String));
    // Guarantee every correct piece is registered.
    correct.forEach(p => vocab.add(p));
    // Guarantee single-character fallbacks for every char in the word.
    for (const ch of word) vocab.add(ch);
    if (!word) issues.push({ fatal: false, msg: `round ${i} has empty word` });
    if (correct.join('') !== word) {
      issues.push({ fatal: false, msg: `round ${i} ("${word}"): correct pieces don't reassemble to the word` });
    }
    return {
      word,
      correct,
      vocab: [...vocab].sort((a, b) => b.length - a.length || a.localeCompare(b)),
      whatHappened: r.whatHappened || '',
      takeaway: r.takeaway || '',
    };
  }).filter(r => r.word);

  if (card.payload.rounds.length === 0) {
    issues.push({ fatal: true, msg: 'split_match rounds all invalid after repair' });
  }
}

window.Schema = { selectTemplate, validateAndRepairCard, TEMPLATES };
