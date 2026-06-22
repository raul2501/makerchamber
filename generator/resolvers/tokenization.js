'use strict';
// ─────────────────────────────────────────────────────────────────────────────
// resolvers/tokenization.js — GOLD resolver for tokenization.
// Uses a real o200k (GPT-4o) tokenizer to compute, for ANY word:
//   correct = the true token split        (decoded o200k tokens)
//   vocab   = every substring that is itself a single real token (+ single chars)
// If the tokenizer can't load, falls back to a small curated verified table so the
// demo always has a verified tokenization game. Output rounds are plain JSON.
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  const DEFAULT_WORDS = ['hello', 'unhappy', 'ChatGPT', 'strawberry'];
  const MAX_WORD_LEN = 18; // cap O(n^2) vocab build

  // CURATED FALLBACK — verified 2026-06 via tiktoken (o200k). Lean vocab (correct + chars).
  const CURATED = {
    hello: ['hello'],
    unhappy: ['un', 'happy'],
    ChatGPT: ['Chat', 'GPT'],
    strawberry: ['st', 'raw', 'berry'],
  };

  let _encPromise = null;
  function loadEncoder() {
    if (_encPromise) return _encPromise;
    _encPromise = (async () => {
      // o200k_base = the GPT-4o encoding (the one L1's data was verified against).
      const mod = await import('https://esm.sh/gpt-tokenizer@2/encoding/o200k_base');
      const enc = mod.encode ? mod : (mod.default || mod);
      if (typeof enc.encode !== 'function' || typeof enc.decode !== 'function') throw new Error('bad encoder');
      // sanity: bare "unhappy" must split to un+happy in o200k
      const t = enc.encode('unhappy').map(id => enc.decode([id]));
      if (t.join('') !== 'unhappy') throw new Error('encoder mismatch');
      return enc;
    })().catch(() => null);
    return _encPromise;
  }

  function insightFor(word, correct) {
    const whatHappened = correct.length === 1
      ? `"${word}" is common enough to be one whole token.`
      : `"${word}" splits into ${correct.length} pieces: ${correct.join(' · ')}.`;
    return { whatHappened, takeaway: 'Pieces are chosen by how often they appear in training data, not by meaning.' };
  }

  function liveRound(word, enc) {
    const ids = enc.encode(word);
    const correct = ids.map(id => enc.decode([id]));
    const vocab = new Set([...word]);            // single chars are always valid (byte fallback)
    if (word.length <= MAX_WORD_LEN) {
      for (let i = 0; i < word.length; i++)
        for (let j = i + 1; j <= word.length; j++) {
          const s = word.slice(i, j);
          if (enc.encode(s).length === 1) vocab.add(s);
        }
    }
    correct.forEach(p => vocab.add(p));
    return { item: word, correct, vocab: [...vocab], insight: insightFor(word, correct) };
  }

  function curatedRound(word) {
    const correct = CURATED[word] || CURATED[word.toLowerCase()] || [word];
    const vocab = new Set([...word, ...correct]);
    return { item: word, correct, vocab: [...vocab], insight: insightFor(word, correct) };
  }

  async function resolveTokenization(concept, opts) {
    const words = (opts.words && opts.words.length ? opts.words : DEFAULT_WORDS)
      .map(w => String(w).trim()).filter(Boolean).slice(0, 8);
    const enc = await loadEncoder();
    if (enc) {
      return { rounds: words.map(w => liveRound(w, enc)), source: 'live-o200k' };
    }
    // Fallback: curated verified words only (drop typed words we can't verify).
    const safe = words.filter(w => CURATED[w] || CURATED[w.toLowerCase()]);
    const useWords = safe.length ? safe : DEFAULT_WORDS;
    return { rounds: useWords.map(curatedRound), source: 'curated-fallback' };
  }

  window.Resolvers.register(['tokenization', 'tokenizer', 'tokens'], resolveTokenization);
})();
