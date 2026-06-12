# Copy Feedback — City of Tokens

## Game-Wide Principles

Emerging from playtesting sessions. Apply these across all levels when rewriting.

1. **Introduce world elements before using them.** If a game element (The Ledger, The Gate, etc.) appears in copy, the first mention must briefly establish what it is and where it came from. Never assume the player has built that context.

2. **Layman-first, always.** Every explanation must be understandable to someone with zero technical background. If a technical term is unavoidable, explain the concept in plain English before naming it. The name is the reward for understanding, not the starting point.

3. **Narrative flavor must earn its place.** Story-register lines ("A compound word arrives...") are only justified if they make the mechanic clearer or the moment more resonant. Flavor that doesn't teach or land emotionally should be cut or replaced with something that does one of those things.

4. **Positive example — what good looks like (Level 1, Round 3 explanation):**
   > *"The suffix '-ize' appears in realize, recognize, emphasize, memorize, and hundreds more — frequent enough for its own entry. 'token' is a common word. Together they form 2 tokens instead of 8 characters."*
   Simple, concrete, grounded in examples, no jargon.

5. **Jargon arrives last.** Technical terms are the conclusion, not the opener. Pattern: plain description of what just happened → why it matters → this is called [term]. (Applied in the InsightCard rewrite pass — see git history.)

---

## Level 1: The Gate (Tokenization / BPE)

### Session: 2026-06-12

---

#### Intro Callout — "The Ledger"

**Problem 1:** The callout opens with "The Ledger holds ~50,000 fragments" with no prior context for what The Ledger is, where it came from, or why it exists. Feels abrupt.

**Problem 2:** "Words that didn't get split until all their pieces fit. The cuts don't follow the meaning of words. They follow what was frequent." — too cryptic for a layman. "Pieces fit" and "cuts follow frequency" aren't self-explanatory without more grounding.

**Direction:** Introduce The Ledger as a vocabulary list the model built from training data. Explain that it doesn't contain full words — it contains the fragments that showed up most often. Rarer or longer words aren't in it whole, so they get broken down until their parts are. Make clear this is fixed at training time.

---

#### Round Stories (narrator flavor lines)

| Round | Current | Problem | Direction |
|---|---|---|---|
| unhappy | `A compound word arrives. The gatekeeper recognizes both halves — they've each earned their own entry.` | "Gatekeeper" is undefined; "compound word" is jargon; tells the player the answer before they play. No payoff. | Set up the interesting question instead: why does "un-" get its own slot? |
| tokenize | `A self-referential word arrives. The ledger knows both the stem and the ending.` | "Self-referential" is a meta-observation that adds nothing to comprehension. "Stem and ending" is jargon. | One clean observation: this word about tokenization is itself being tokenized. Keep it short and concrete. |

---

#### Insight / Explanation Cards

| Round | Field | Current | Problem | Direction |
|---|---|---|---|---|
| unhappy | insight | `...The more contexts a piece appears in, the more reliably it gets its own slot.` | "More contexts" too abstract. | Concrete: "un-" earns its entry because it appears in hundreds of words. Common prefixes/suffixes are reusable pieces — that's what earns them a slot. |
| unbelievable | explanation | `'believ' — not 'believe' — because BPE builds its vocabulary by greedily merging the most frequent character pairs...` | Jargon-first with no grounding. Pattern: explain the mechanism first (start with letters, find most common pair, merge, repeat), then name it (BPE). Show how 'believ' specifically emerged from that process via concrete words (believe, believing, believer). Jargon name is fine once the concept is established. |

**Positive (keep as-is):**
- Round 3 (tokenize) `explanation`: *"The suffix '-ize' appears in realize, recognize, emphasize, memorize, and hundreds more..."* — simple and correct.

---

#### Final Screen

**Problem:** The completion screen has no conceptual wrap-up. The player has just done tokenization 7 times and gets no synthesis — no name for the process, no connection to the bigger picture.

**Direction:** Add a 3–4 sentence blurb that:
1. Names what just happened: tokenization, done by a tokenizer
2. Explains what a tokenizer does (raw text → sequence of token IDs from the Ledger / vocabulary)
3. Connects to the bigger picture: this happens before the model understands anything
4. Notes that different models have different tokenizers (GPT-4 uses cl100k, Claude uses its own)

The word "tokenizer" can appear here for the first time — the player has now earned it.

---

#### Visual / Code Issues (not copy — fix in HTML directly)

- **How-to-play card body text invisible:** `.how-card-body { color: #6a5a45 }` on a `#5D5D5D` background. Near-zero contrast. Fix text color.
