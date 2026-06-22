'use strict';
// ─────────────────────────────────────────────────────────────────────────────
// app.js — generator shell. Screen flow:
//   input → card → pre-test → [launch split_match] → (return) → post-test → result
// The game runs as a separate page (templates/split_match.html); state is handed
// off via sessionStorage so the proven game engine is reused with zero rewrite.
// ─────────────────────────────────────────────────────────────────────────────

const SESSION_KEY = 'lgg_session';
const ACTIVE_CARD_KEY = 'activeCard';

let currentCard = null;
let preAnswers = [];
let postAnswers = [];

// ── screens ──
function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

// ── card generation (P0: curated lookup; P4 swaps in the AI call here) ──
function generateCard(concept) {
  const key = (concept || '').toLowerCase().trim();
  const raw = Cards.CURATED_CARDS[key] || Cards.TOKENIZATION_CARD;
  const { card } = Schema.validateAndRepairCard(raw);
  return card;
}

function renderCard(card) {
  const mechMatched = Schema.selectTemplate(card.mechanics);
  const box = document.getElementById('card-box');
  box.innerHTML = `
    <div class="card-concept">${esc(card.conceptName)}</div>
    <div class="card-oneline">${esc(card.oneLine)}</div>
    <div class="kv"><div class="k">Learner</div><div>${esc(card.targetLearner)}</div></div>
    <div class="kv"><div class="k">Mechanics</div><div class="chips">${card.mechanics.map(m =>
      `<span class="chip ${mechMatched === Schema.selectTemplate([m]) ? 'sel' : ''}">${esc(m)}</span>`).join('')}</div></div>
    <div class="kv"><div class="k">Objects</div><div class="chips">${card.objects.map(o => `<span class="chip">${esc(o)}</span>`).join('')}</div></div>
    <div class="kv"><div class="k">Template</div><div class="chips"><span class="chip sel">${esc(card.templateType)}</span></div></div>
  `;
  document.getElementById('pl-mech').textContent = card.mechanics.join(' / ') || 'mechanic';
  document.getElementById('pl-tmpl').textContent = card.templateType;
}

// ── tests ──
function renderTest(containerId, questions, answers, onChange) {
  const c = document.getElementById(containerId);
  c.innerHTML = questions.map((q, qi) => `
    <div class="q" data-qi="${qi}">
      <div class="q-text">${qi + 1}. ${esc(q.q)}</div>
      ${q.options.map((o, oi) => `<div class="opt" data-qi="${qi}" data-oi="${oi}">${esc(o)}</div>`).join('')}
    </div>`).join('') + `
    <div class="conf-wrap">
      <div class="conf-label">How confident are you about this concept?</div>
      <input type="range" min="1" max="5" value="3" class="conf-slider">
      <div class="conf-scale"><span>not at all</span><span>very</span></div>
    </div>`;
  c.querySelectorAll('.opt').forEach(el => {
    el.addEventListener('click', () => {
      const qi = +el.dataset.qi, oi = +el.dataset.oi;
      answers[qi] = oi;
      c.querySelectorAll(`.opt[data-qi="${qi}"]`).forEach(o => o.classList.remove('picked'));
      el.classList.add('picked');
      onChange();
    });
  });
  c.querySelector('.conf-slider').addEventListener('input', onChange);
}

function testComplete(questions, answers) {
  return questions.length > 0 && answers.length === questions.length && answers.every(a => a != null);
}
function score(questions, answers) {
  return questions.reduce((s, q, i) => s + (answers[i] === q.answerIndex ? 1 : 0), 0);
}
function confOf(containerId) {
  return +document.querySelector(`#${containerId} .conf-slider`).value;
}

// ── launch game ──
// Path A (generated): verified rounds → time-boxed LLM shell → validate → save →
//                     sandbox-mount inline → onComplete → post-test.
// Path B (fallback):  the trusted split_match template via sessionStorage handoff.
const GEN_TIMEOUT_MS = 55000; // generation runs ~42s; cap so the demo can't hang
let currentGameId = null;

function toSdkRounds(rounds) {
  return (rounds || []).map(r => ({
    item: r.item || r.word,
    correct: r.correct,
    vocab: r.vocab,
    insight: r.insight || { whatHappened: r.whatHappened || '', takeaway: r.takeaway || '' },
  })).filter(r => r.item);
}

function withTimeout(promise, ms) {
  return Promise.race([promise, new Promise(res => setTimeout(() => res(null), ms))]);
}

function setGameStatus(msg) { document.getElementById('game-status').textContent = msg; }
function setAiBadge(verified, generated) {
  const el = document.getElementById('ai-badge');
  if (!generated) { el.innerHTML = ''; return; }
  el.innerHTML = verified
    ? '<span style="color:#80d840">● AI-generated game · answers verified</span>'
    : '<span style="color:#d8a93f">● AI-generated game · answers AI-suggested, unverified</span>';
}

async function launchGame() {
  currentGameId = null;
  const session = {
    sessionId: 'S' + Date.now() + '-' + Math.floor(Math.random() * 1e4),
    concept: currentCard.conceptName,
    templateType: currentCard.templateType,
    pre: { answers: preAnswers, score: score(currentCard.preTest, preAnswers), conf: confOf('pretest-qs') },
    stage: 'posttest',
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  sessionStorage.setItem(ACTIVE_CARD_KEY, JSON.stringify(currentCard));

  show('s-game');
  setAiBadge(false, false);
  setGameStatus('Preparing the game…');

  // 1) verified rounds where a resolver exists (the hybrid correctness gate)
  let resolved = null;
  try { resolved = await Resolvers.resolve(currentCard.conceptName, {}); } catch (_) {}
  const verified = !!(resolved && resolved.verified);
  const cardRounds = (currentCard.payload && currentCard.payload.rounds) || [];
  const sdkRounds = verified ? toSdkRounds(resolved.rounds) : toSdkRounds(cardRounds);

  // 2) try the LLM-generated shell (split_match only; time-boxed)
  let gen = null;
  if (currentCard.templateType === 'split_match' && sdkRounds.length) {
    setGameStatus('Generating a custom game with AI… (this can take ~40s)');
    gen = await withTimeout(ShellGen.generate({
      conceptName: currentCard.conceptName, oneLine: currentCard.oneLine, targetLearner: currentCard.targetLearner,
      worldStyle: {
        genre: 'neon courier city gate',
        mood: 'alive, readable, playful, not visually noisy',
        camera: 'side-view animated diorama',
        guideCharacter: 'small scanner courier',
        metaphor: 'valid token pieces are glowing access passes that let a message move through the city',
        motion: ['parallax skyline', 'idle guide character', 'scanner pulse', 'success sparks'],
      },
    }), GEN_TIMEOUT_MS);
  }

  // 3) generated path: validate → save the bundle → sandbox-mount inline
  if (gen && gen.html && Sandbox.validate(gen.html).ok) {
    setGameStatus('');
    setAiBadge(verified, true);
    currentGameId = await GameStore.saveGame({
      concept: currentCard.conceptName, audience: currentCard.targetLearner,
      conceptCard: currentCard, rounds: sdkRounds, shellHtml: gen.html, verified,
    });
    Sandbox.mount(document.getElementById('game-host'), { html: gen.html, rounds: sdkRounds, onComplete: showPosttest });
    return;
  }

  // 4) fallback: the trusted split_match template (sessionStorage handoff, full page)
  window.location.href = 'templates/' + (currentCard.templateType === 'split_match' ? 'split_match' : 'coming_soon') + '.html';
}

function showPosttest() {
  postAnswers = [];
  renderTest('posttest-qs', currentCard.postTest, postAnswers, () => {
    document.getElementById('to-result').disabled = !testComplete(currentCard.postTest, postAnswers);
  });
  show('s-posttest');
}

// ── resume after game (post-test) ──
function resumeIfReturning() {
  const s = readSession();
  const cardRaw = sessionStorage.getItem(ACTIVE_CARD_KEY);
  if (s && s.stage === 'posttest' && cardRaw) {
    currentCard = JSON.parse(cardRaw);
    showPosttest();   // returning from the trusted split_match fallback
    return true;
  }
  return false;
}

// ── result ──
async function finishAndSave() {
  const s = readSession();
  const postScore = score(currentCard.postTest, postAnswers);
  const total = currentCard.postTest.length;
  const result = {
    sessionId: s.sessionId,
    concept: s.concept,
    templateType: s.templateType,
    preScore: s.pre.score,
    postScore,
    total,
    delta: postScore - s.pre.score,
    confBefore: s.pre.conf,
    confAfter: confOf('posttest-qs'),
    ts: new Date().toISOString(),
  };
  await Store.saveResult(result);
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(ACTIVE_CARD_KEY);
  renderResult(result);
  show('s-result');
}

function renderResult(r) {
  document.getElementById('result-headline').textContent =
    r.delta > 0 ? `+${r.delta} of ${r.total} — it clicked.` : (r.delta === 0 ? 'Held steady.' : 'Mixed result.');
  document.getElementById('result-grid').innerHTML = `
    <div class="stat"><div class="v">${r.preScore}/${r.total}</div><div class="l">Before</div></div>
    <div class="stat"><div class="v">${r.postScore}/${r.total}</div><div class="l">After</div></div>
    <div class="stat delta"><div class="v">${r.delta >= 0 ? '+' : ''}${r.delta}</div><div class="l">Learning delta</div></div>`;
  document.getElementById('result-conf').textContent =
    `Confidence: ${r.confBefore}/5 → ${r.confAfter}/5  (${r.confAfter - r.confBefore >= 0 ? '+' : ''}${r.confAfter - r.confBefore})`;
  // Share box only for AI-generated games we actually saved a bundle for.
  const shareBox = document.getElementById('share-box');
  if (currentGameId) {
    shareBox.style.display = 'block';
    document.getElementById('share-url').value = GameStore.playUrl(currentGameId);
  } else {
    shareBox.style.display = 'none';
  }
}

// ── utils ──
function readSession() { try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); } catch (_) { return null; } }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

// ── wiring ──
function init() {
  // suggestions from curated cards
  document.getElementById('suggestions').innerHTML = Object.keys(Cards.CURATED_CARDS)
    .map(k => `<span class="sugg" data-c="${k}">${k}</span>`).join('');
  document.querySelectorAll('.sugg').forEach(el =>
    el.addEventListener('click', () => { document.getElementById('concept-field').value = el.dataset.c; }));

  document.getElementById('generate-btn').addEventListener('click', () => {
    const concept = document.getElementById('concept-field').value || 'tokenization';
    currentCard = generateCard(concept);
    renderCard(currentCard);
    show('s-card');
  });
  document.getElementById('back-input').addEventListener('click', () => show('s-input'));
  document.getElementById('result-again').addEventListener('click', () => show('s-input'));

  document.getElementById('to-pretest').addEventListener('click', () => {
    preAnswers = [];
    renderTest('pretest-qs', currentCard.preTest, preAnswers, () => {
      document.getElementById('to-game').disabled = !testComplete(currentCard.preTest, preAnswers);
    });
    show('s-pretest');
  });
  document.getElementById('to-game').addEventListener('click', launchGame);
  document.getElementById('to-result').addEventListener('click', finishAndSave);

  const copyBtn = document.getElementById('share-copy');
  if (copyBtn) copyBtn.addEventListener('click', () => {
    const inp = document.getElementById('share-url');
    inp.select();
    if (navigator.clipboard) navigator.clipboard.writeText(inp.value).catch(() => {});
    copyBtn.textContent = 'Copied ✓';
    setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1500);
  });

  // If we're coming back from the game, jump straight to the post-test.
  resumeIfReturning();
}

init();
