# Level 1 — The Gate
### Concept & Game Design Document

---

## 1. Overview

**Level name:** The Gate  
**Concept it teaches:** Tokenization  
**Position in game:** Entry point — the first thing that happens when text enters a transformer  
**Prototype:** `the-gate.html`

The Gate is a puzzle game where the player splits words into their smallest registered units before they can "enter the city" (the transformer). The mechanic mirrors what tokenization actually does: converting raw text into a sequence of token IDs before any processing begins.

---

## 2. The Learning Objective

By the end of Level 1, the player should understand three things:

1. **LLMs don't read words.** They read tokens — discrete chunks from a fixed vocabulary. The model never sees letters; it sees integers (token IDs).

2. **The vocabulary was built statistically, not linguistically.** Common character sequences earned their own slot through frequency in training data. Splits follow merge history, not word meaning. "believ" is a token; "believe" might not be.

3. **Fewer tokens is better.** The model always prefers the most efficient valid split. More tokens means more context window consumed, more steps to process. Efficiency is the goal.

These three ideas are the minimum viable understanding of tokenization. Everything else (BPE algorithm details, vocabulary size, multilingual tokenization inequality) is second-order.

---

## 3. Fit Within the Broader Game

The broader game is set inside a transformer architecture — a city that processes travelers (tokens) from the moment they arrive until the moment a prediction is made. Each level is a district of this city.

The Gate is the entry point. Nothing can happen downstream until tokenization is complete. This gives it a natural first-level position: it's where text stops being text and starts being something the model can work with.

The metaphor holds cleanly: travelers (words) arrive, the gatekeeper (tokenizer) consults a ledger (vocabulary), splits them into registered units, and they enter. Every subsequent level assumes this has already happened — the player has seen how raw text becomes tokens.

---

## 4. Core Mechanic

**Click-to-split.** The word is displayed as a row of character boxes. Clickable gaps sit between each pair of characters. Clicking a gap places a split marker there; clicking again removes it.

As the player adds and removes splits, each resulting segment is immediately validated against the current round's vocabulary and highlighted green (registered) or red (unknown). The player can only submit when all segments are green.

**Minimize tokens.** Multiple valid splits usually exist — individual characters are always valid, for instance. The goal is the most efficient valid split: fewest tokens, all registered. This is what BPE actually optimizes for.

**The ledger panel.** A sidebar shows the available tokens for the current word. Matched segments highlight in the panel as the player builds their split. This grounds the mechanic in the vocabulary concept and gives the player something to reason from rather than guess at.

---

## 5. Why This Mechanic

The alternatives considered:

- **Assemble from token tiles** (drag tiles to build the word): More game-like but inverts the relationship — tokenization is decomposition, not composition. The click-to-split mechanic maps directly to what actually happens.
- **Multiple choice** (pick the correct split from options): Removes active reasoning. The player guesses rather than constructs.
- **Type the tokens** (free text input): High friction, doesn't show the vocabulary constraint clearly.

Click-to-split wins because it makes the player do the decomposition themselves, the feedback (green/red) is immediate, and the vocabulary panel gives them the vocabulary constraint without making it a lookup puzzle.

---

## 6. Key Design Constraint

The vocabulary for each round must be curated so that the correct split is always the most token-efficient valid split. If a longer token (e.g., "unhappy" whole) were in the vocabulary, the player could beat the stated answer by using it. This would create a broken scoring system.

Rule: for each round, the vocabulary contains the correct token pieces plus smaller subwords and individual characters. Nothing that would allow a shorter split than the correct one.

This means the vocabulary is not the full GPT-4 vocabulary — it's a pedagogically curated subset designed to make each round's puzzle well-defined. The game is approximately accurate to real BPE behavior, not byte-for-byte accurate to any specific tokenizer.

---

## 7. Round Design

Seven rounds, ordered by what they introduce. Each round teaches one new tokenization principle on top of the previous ones.

---

### Round 1 — "hello"
**Correct split:** `["hello"]` — 1 token  
**Teaches:** Common words are registered whole. Not every word needs splitting.  
**Why this first:** The player learns the mechanic in a no-split scenario. They see the whole word go green immediately. They submit without clicking anything. This establishes that the game isn't about splitting everything — it's about finding the right split.

---

### Round 2 — "unhappy"
**Correct split:** `["un", "happy"]` — 2 tokens  
**Teaches:** Common prefixes earn their own token slot.  
**The principle:** "un-" appears across thousands of words. Frequency earns registration. This is the first round where the player has to make a decision, and the decision follows a principle they'll reuse (prefix recognition) in rounds 6 and 7.

---

### Round 3 — "tokenize"
**Correct split:** `["token", "ize"]` — 2 tokens  
**Teaches:** Common suffixes earn their own slot too.  
**The principle:** "-ize" appears in realize, emphasize, recognize, memorize. Suffixes work the same way as prefixes — frequency of occurrence drives registration. The round also has mild self-referential appeal.

---

### Round 4 — "don't"
**Correct split:** `["don", "'t"]` — 2 tokens  
**Teaches:** Punctuation creates split boundaries; contractions follow a predictable pattern.  
**The principle:** The apostrophe isn't a separator — it attaches to the second piece. "'t" is registered because -n't endings appear constantly. This is the first round with a non-alphabetic character and should prompt the player to think about punctuation as part of the vocabulary, not as a delimiter.

---

### Round 5 — "ChatGPT"
**Correct split:** `["Chat", "G", "PT"]` — 3 tokens  
**Teaches:** The vocabulary is frozen at training time. New proper nouns get approximated from existing pieces.  
**Why this matters:** This is the most counterintuitive round. The player expects "GPT" to be a unit — it isn't, because the vocabulary was built before "GPT" was common. This is the moment the player understands the frozen vocabulary constraint in a visceral way. It also explains real observed model behavior (early GPT models handling "ChatGPT" oddly).

---

### Round 6 — "unbelievable"
**Correct split:** `["un", "believ", "able"]` — 3 tokens  
**Teaches:** BPE splits follow merge frequency, not word meaning. Counterintuitive cuts are expected.  
**The friction point:** The player wants to split as `un + believe + able`. "believe" is not in the vocabulary — "believ" is, because the BPE merge history produced that unit. This is the most important round for correcting the misconception that tokenization is linguistically principled. The player should feel the wrongness of "believ" and learn that the algorithm doesn't care about words.

---

### Round 7 — "preprocessing"
**Correct split:** `["pre", "processing"]` — 2 tokens  
**Teaches:** Technical vocabulary tokenizes cleanly because technical terms appear frequently in training data.  
**Why this last:** It's a satisfying resolution after round 6's friction. The player applies the prefix principle from round 2 and finds that technical text is well-served by the tokenizer. A clean, confident ending before the results screen.

---

## 8. Scoring

Stars are awarded per round based on how close the player's split is to the model's actual tokenization.

| Result | Stars | Condition |
|---|---|---|
| Exact match | ★★★ | Same tokens, same count, same boundaries as the correct split |
| Right count, different split | ★★☆ | Same number of tokens as correct, but different boundaries |
| Valid but suboptimal | ★☆☆ | All segments in vocabulary, but more tokens than optimal |

The result screen shows both "Your tokens" and "Model's tokens" as numbers side by side, so the player understands exactly what happened before seeing the star rating. The star meaning is explained in plain language on every result screen — it is not assumed to be self-evident.

The 2-star case (same count, different split) is rare given the curated vocabulary but theoretically possible if two splits of equal token count are both valid. It is included for completeness.

---

## 9. Screen Flow

```
intro1 (What are tokens)
  → intro2 (How to play + scoring legend + worked example)
    → game (round 1)
      → result (round 1)
        → game (round 2)
          → result (round 2)
            ... (repeats 7 times)
              → final (summary + score)
```

The two intro screens are not skippable in the current build. In a future iteration, a "skip intro" option would be appropriate for returning players.

---

## 10. In-Game Feedback Loops

Three feedback systems run simultaneously during gameplay:

**Immediate visual feedback** — segments turn green or red as splits are placed. No submit required to see validity. This keeps the player in an explore-and-observe loop rather than a guess-and-check one.

**Adaptive hint text** — a text field below the token counter updates based on current state: invalid segments present → tells them to keep splitting or try different boundaries. All valid but suboptimal → tells them to try combining pieces. All valid and optimal → confirms they're ready to submit.

**Vocabulary panel highlighting** — tokens in the ledger panel highlight when they match a current segment. This closes the loop between "what's in the vocabulary" and "what I've currently selected," which is the core reasoning task.

---

## 11. What This Level Teaches vs. Doesn't Teach

### Teaches correctly
- LLMs process tokens, not words or characters
- Tokenization is the first step — nothing else can happen until it's done
- The vocabulary is fixed and finite
- Common sequences (prefixes, suffixes, whole words) earn registrations through frequency
- Proper nouns and new words get approximated from existing vocabulary pieces
- BPE cuts are statistical, not semantic — counterintuitive splits are expected and correct

### Does not teach (out of scope for this level)
- The BPE algorithm itself (the merge process, how the vocabulary was constructed)
- Vocabulary size and its tradeoffs
- Tokenization inequality across languages (non-English text often requires more tokens per word)
- Byte-level fallbacks for unknown characters
- How token boundaries affect the model's ability to learn certain patterns

These are second-order concepts. The player who completes Level 1 should be able to say "an LLM reads token IDs, not text, and the split is based on what's common in training data." That's the bar.

---

## 12. Open Design Questions

**Should we show the optimal token count upfront?**  
Currently shown as "?" and revealed only after submission. Showing it before submission would make the game easier but less exploratory. A middle ground: reveal it after one wrong attempt (i.e., after the player submits a suboptimal split and sees the result, then replays the round).

**Should rounds be replayable?**  
The current flow is linear with no replay. For a learning game, letting the player retry a round for a better score would reinforce the principle without increasing the round count. Worth adding.

**Is 7 rounds the right length?**  
7 rounds takes roughly 4–6 minutes. That feels right for a concept introduction. The risk is front-loading too many rounds on the same principle (rounds 2 and 3 both cover affix tokenization). Round 3 could be cut if the overall level feels too long.

**What happens after this level?**  
Level 2 (Embedding / The Map Room) receives the tokens produced by Level 1 and converts them into vectors. The handoff between levels should be explicit — the player should see that the tokens from Level 1 are the input to Level 2. This continuity is the thing that makes the levels feel like a world rather than disconnected minigames.

---

## 13. Technical Notes

**Current implementation:** Single-file HTML with vanilla JS. No dependencies. Vocabulary is hardcoded per round — not a real tokenizer call. This is intentional for the prototype.

**Accuracy note:** Token splits are approximately correct to GPT-style BPE tokenizers but are not byte-for-byte accurate to any specific tokenizer (cl100k_base, p50k, etc.). The vocabulary per round is curated for pedagogical clarity, not tokenizer fidelity. The concept is accurate; the specific splits are illustrative.

**If upgrading to real tokenization:** The `tiktoken` library has a WASM build that could run in-browser. This would make every round use actual GPT-4 tokenization. The tradeoff: some real splits are stranger than the curated ones and may confuse without additional explanation. Curated vocabulary is probably better for a learning context.
