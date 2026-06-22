'use strict';
// ─────────────────────────────────────────────────────────────────────────────
// cards.js — CURATED ConceptCards (the demo-safe fallback path).
// These always work. AI generation (P4) is a wow-layer on top; if it fails or
// produces an invalid card, we fall back to one of these by templateType/concept.
// split_match rounds reuse the verified tokenization data from the-gate.html.
// ─────────────────────────────────────────────────────────────────────────────

const TOKENIZATION_CARD = {
  conceptName: 'Tokenization',
  oneLine: 'Before an AI can read text, it breaks each word into common chunks from a fixed vocabulary.',
  targetLearner: 'A curious adult who uses AI daily but has never seen how it reads.',
  mechanics: ['split', 'match'],
  objects: ['word', 'token', 'the Ledger (vocabulary)'],
  constraints: ['every piece must already exist in the vocabulary', 'splits follow frequency, not meaning'],
  templateType: 'split_match',
  preTest: [
    { q: 'When you type "unhappy" to an AI, what does it actually work with?',
      options: ['the whole word "unhappy"', 'the letters u-n-h-a-p-p-y', 'common chunks like "un" + "happy"', 'a picture of the word'],
      answerIndex: 2 },
    { q: 'What decides where a word gets split?',
      options: ['its meaning', 'how common the pieces are', 'the number of letters', 'grammar rules'],
      answerIndex: 1 },
  ],
  postTest: [
    { q: 'When you type "unhappy" to an AI, what does it actually work with?',
      options: ['the whole word "unhappy"', 'the letters u-n-h-a-p-p-y', 'common chunks like "un" + "happy"', 'a picture of the word'],
      answerIndex: 2 },
    { q: 'What decides where a word gets split?',
      options: ['its meaning', 'how common the pieces are', 'the number of letters', 'grammar rules'],
      answerIndex: 1 },
  ],
  feedback: {
    introLines: [
      'This level takes you through what happens when you type a sentence into your favourite AI chatbot.',
      'An AI uses a tokenizer to split words into pieces it already knows. Here, you do the splitting.',
    ],
    objective: 'Slash the word and move it through the Gate in as few tokens as possible.',
    doneTitle: 'Gate cleared.',
    doneBody: 'What you just did is called <strong>tokenization</strong> — every word an AI reads is broken into registered pieces, chosen by how often they appear, not what they mean.',
  },
  payload: {
    rounds: [
      { word: 'hello', correct: ['hello'],
        vocab: ['hello', 'ello', 'hell', 'ell', 'hel', 'llo', 'el', 'he', 'll', 'lo', 'e', 'h', 'l', 'o'],
        whatHappened: 'hello is a very common word.',
        takeaway: 'The most common words are kept whole, as a single piece.' },
      { word: 'unhappy', correct: ['un', 'happy'],
        vocab: ['happy', 'appy', 'app', 'hap', 'ppy', 'ap', 'ha', 'nh', 'pp', 'py', 'un', 'a', 'h', 'n', 'p', 'u', 'y'],
        whatHappened: '"un" and "happy" are both common pieces on their own.',
        takeaway: 'A word is split into the common pieces it is built from, not by grammar.' },
      { word: 'ChatGPT', correct: ['Chat', 'GPT'],
        vocab: ['Chat', 'Cha', 'GPT', 'hat', 'Ch', 'GP', 'PT', 'at', 'ha', 'C', 'G', 'P', 'T', 'a', 'h', 't'],
        whatHappened: '"GPT" shows up so often it became its own piece.',
        takeaway: 'The vocabulary grows to include new pieces that appear a lot in training data.' },
      { word: 'preprocessing', correct: ['pre', 'processing'],
        vocab: ['processing', 'rocessing', 'process', 'essing', 'proces', 'rocess', 'prep', 'proc', 'sing', 'ces', 'ess', 'ing', 'pre', 'pro', 'rep', 'roc', 'sin', 'ce', 'ep', 'es', 'in', 'ng', 'oc', 'pr', 're', 'ro', 'si', 'ss', 'c', 'e', 'g', 'i', 'n', 'o', 'p', 'r', 's'],
        whatHappened: '"pre" and "processing" are both very common pieces.',
        takeaway: 'Common pieces let even long words be stored in just a few tokens.' },
    ],
  },
};

// A second substring-splittable concept (used from P2/P3 on). Syllables split
// contiguously, so the slash mechanic works unchanged.
const SYLLABLES_CARD = {
  conceptName: 'Syllables',
  oneLine: 'Words are spoken in beats called syllables — contiguous chunks of sound.',
  targetLearner: 'A young learner or language student breaking words into sound-beats.',
  mechanics: ['split', 'match'],
  objects: ['word', 'syllable'],
  constraints: ['each piece must be a real syllable chunk', 'pieces are contiguous'],
  templateType: 'split_match',
  preTest: [
    { q: 'How many syllables are in "banana"?', options: ['1', '2', '3', '4'], answerIndex: 2 },
    { q: 'A syllable is best described as…', options: ['a single letter', 'a beat of sound in a word', 'the meaning of a word', 'the first letter only'], answerIndex: 1 },
  ],
  postTest: [
    { q: 'How many syllables are in "banana"?', options: ['1', '2', '3', '4'], answerIndex: 2 },
    { q: 'A syllable is best described as…', options: ['a single letter', 'a beat of sound in a word', 'the meaning of a word', 'the first letter only'], answerIndex: 1 },
  ],
  feedback: {
    introLines: [
      'Every word is spoken in beats. Those beats are called syllables.',
      'Split each word into its sound-beats and clap them through.',
    ],
    objective: 'Split the word into its syllable beats.',
    doneTitle: 'Nicely clapped.',
    doneBody: 'Those beats are <strong>syllables</strong> — the chunks of sound a word is spoken in.',
  },
  payload: {
    rounds: [
      { word: 'banana', correct: ['ba', 'na', 'na'],
        vocab: ['ba', 'na', 'ban', 'ana', 'a', 'b', 'n'],
        whatHappened: 'ba-na-na: three even beats.', takeaway: 'Each beat is one syllable.' },
      { word: 'pencil', correct: ['pen', 'cil'],
        vocab: ['pen', 'cil', 'pe', 'ci', 'p', 'e', 'n', 'c', 'i', 'l'],
        whatHappened: 'pen-cil: two beats.', takeaway: 'Most short words have one or two syllables.' },
      { word: 'computer', correct: ['com', 'pu', 'ter'],
        vocab: ['com', 'pu', 'ter', 'put', 'co', 'te', 'c', 'o', 'm', 'p', 'u', 't', 'e', 'r'],
        whatHappened: 'com-pu-ter: three beats.', takeaway: 'Longer words stack more syllables.' },
    ],
  },
};

// Routes to a DIFFERENT template (attention_weights) — used to demo that the
// router correctly selects a template we haven't built yet (→ coming_soon stub).
// The pre/post check still runs, so the full pipeline completes.
const ATTENTION_CARD = {
  conceptName: 'Attention',
  oneLine: 'A model figures out a word\'s meaning by weighing how much each nearby word matters.',
  targetLearner: 'Someone who has met tokenization and embedding and wants the next step.',
  mechanics: ['compare', 'weigh', 'combine'],
  objects: ['word', 'context', 'attention weight'],
  constraints: ['weights sum to one', 'each word attends to every other word'],
  templateType: 'attention_weights',
  preTest: [
    { q: 'How does a model decide what "it" refers to in a sentence?', options: ['it guesses randomly', 'it weighs how relevant each other word is', 'it always picks the previous word', 'it cannot'], answerIndex: 1 },
    { q: 'In attention, the weights across words…', options: ['are all equal', 'sum to one', 'are fixed in advance', 'do not matter'], answerIndex: 1 },
  ],
  postTest: [
    { q: 'How does a model decide what "it" refers to in a sentence?', options: ['it guesses randomly', 'it weighs how relevant each other word is', 'it always picks the previous word', 'it cannot'], answerIndex: 1 },
    { q: 'In attention, the weights across words…', options: ['are all equal', 'sum to one', 'are fixed in advance', 'do not matter'], answerIndex: 1 },
  ],
  feedback: { introLines: [], objective: '', doneTitle: '', doneBody: '' },
  payload: {},
};

const CURATED_CARDS = {
  tokenization: TOKENIZATION_CARD,
  syllables: SYLLABLES_CARD,
  attention: ATTENTION_CARD,
};

// Fallback chooser: by concept name first, else by templateType, else tokenization.
function fallbackCard(conceptName, templateType) {
  const key = (conceptName || '').toLowerCase().trim();
  if (CURATED_CARDS[key]) return CURATED_CARDS[key];
  for (const c of Object.values(CURATED_CARDS)) {
    if (c.templateType === templateType) return c;
  }
  return TOKENIZATION_CARD;
}

window.Cards = { CURATED_CARDS, fallbackCard, TOKENIZATION_CARD, SYLLABLES_CARD };
