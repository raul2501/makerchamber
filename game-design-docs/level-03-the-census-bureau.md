# Level 3 — The Census Bureau
### Concept & Game Design Document

---

## 1. Overview

**Level name:** The Census Bureau  
**Concept it teaches:** Positional Encoding  
**Position:** Third — runs after embedding, before attention  
**Prototype:** `the-census-bureau.html`

Tokens leave the Map Room with semantic positions but no sense of order. The Census Bureau stamps each token with its sequence number before parallel processing begins — blended directly into the token's vector, not attached as a removable tag. Three rounds build from the bag-of-tokens problem, through the same-word-different-position insight, to the resolution of the parallel paradox.

---

## 2. Learning Objective

Three ideas:

1. **Without position, a transformer sees a set, not a sequence.** "Dog bites man" and "man bites dog" are identical to the model — same tokens, same embeddings, same everything.
2. **Position is added to the embedding vector.** Not tagged externally — numerically added, so it blends into the same representational space as meaning.
3. **Position encoding makes parallel processing possible.** Order is injected upfront so attention can fire on all tokens simultaneously without needing to read sequentially.

---

## 3. Narrative

Tokens have their starting positions on the semantic map. Now they need their sequence numbers stamped before they can proceed. The Census Bureau runs through each token once, blending their rank into their identity. It's a fast, mechanical step — but without it, the entire downstream architecture collapses into orderlessness.

---

## 4. The Three Rounds

**Round 1 — The Bag Problem**  
Two sentences ("dog bites man" / "man bites dog") are shown side by side with a `≡` indicator: without position, both produce identical token sets. The player drags three scrambled tokens into numbered slots to define the sequence. Once all slots are filled, `@1 @2 @3` badges animate onto both comparison sentences, the indicator flips to `≠`, and the explanation appears.

The key experience: the player performs the ordering manually, which makes the before/after comparison feel earned rather than told.

**Round 2 — Same Word, Different Position**  
Three sentences show "only" at positions 1, 2, and 3 — each producing a different grammatical meaning. On a mini-map, all three "only" tokens start at the same point (indistinguishable). The player hits "Apply position encoding." The three dots diverge to different positions on the map. The meaning labels appear.

This is the round's main insight: same token identity, different position signal, different final vector. The visual divergence on the map makes it concrete.

**Round 3 — The Parallel Paradox**  
A three-step timeline animates in sequence: tokens arrive raw → position stamps are applied → attention fires on all tokens simultaneously. No interaction — purely narrative. The paradox ("if everything is parallel, how does order exist?") is posed and answered in the same screen: order was baked in before the parallel step, so attention never needs to process sequentially.

This round serves as a conceptual closer and setup for Level 4, where the parallel attention mechanism finally runs.

---

## 5. Core Mechanic

Round 1 uses drag-and-drop slot filling — the player physically sequences the tokens. This is the only interactive mechanic; Rounds 2 and 3 are button-triggered reveals and animation sequences.

The drag-and-drop is intentionally simple: three tokens, three slots, one correct order. The puzzle difficulty is minimal because the learning isn't in the challenge of sorting — it's in the before/after comparison that the sorting triggers.

---

## 6. Design Decisions

**Position is shown as a badge blended into the token, not a separate field.** The `@1` notation and the visual treatment (badge that appears as part of the token chip) reinforces that position is added to the embedding, not stored separately.

**Round 3 is non-interactive.** The parallel paradox is a conceptual point, not a puzzle. Making it interactive would require either an artificial mechanic or a quiz — both weaker than just showing the timeline clearly and letting the player read it. The animation sequence (phases appearing with delays) gives it enough rhythm to feel active without requiring input.

**The "only" example is the level's strongest moment.** Three sentences, same word, three meanings, purely a function of position. This is more immediately graspable than the technical addition operation, and it connects abstract math to real language behavior.

---

## 7. What This Level Teaches vs. Doesn't Teach

Teaches: the bag-of-tokens problem, position as a component of the starting vector, same-word-different-position producing different representations, why parallelism requires upfront position encoding.

Doesn't teach: the specific encoding scheme (sinusoidal vs. learned vs. RoPE), how position and meaning interact during attention, why addition (vs. concatenation) is the right operation, how positional encoding degrades for sequences longer than training length.
