# City of Tokens v1 — The Apprentice Oracle
## Full Game Redesign Spec

**Date:** 2026-06-09
**Status:** Draft — pending implementation plan
**Game:** City of Tokens
**Version:** v1 (simplified interactive puzzles + full Apprentice Oracle narrative)

---

## Overview

Complete redesign of City of Tokens from a quiz/tutorial prototype into a narrative-driven interactive experience. v1 uses simplified interactive puzzles validated against conceptual accuracy. The narrative wrapper is The Apprentice Oracle — a full story arc across all 8 levels.

This spec incorporates feedback from three agent reviews: creative-director (design pillars + MDA), game-designer (mechanic accuracy), and writer (narrative arc). Review notes are embedded throughout.

**Related spec:** `docs/specs/2026-06-09-town-square-self-attention.md` — the v2 deep mechanic design for Level 4. That spec is the north star for post-v1 iteration; it is not part of this implementation.

---

## Design Goals

- Ship v1 fast to get real user feedback on narrative framing and conceptual resonance
- Build genuine Discovery dynamics through mechanics that are structural analogs to the computations — not fluency tests
- Establish the Apprentice Oracle arc as the canonical narrative container for all 8 levels

---

## Target Aesthetics

Discovery primary — Challenge secondary — Fantasy supporting.

---

## Core Design Heuristic

From the game-designer review — use this to evaluate every level mechanic:

> **The player's action must be a structural analog to the computational operation, not a test of fluency with its output.** Where the simplification preserves the *shape* of the operation, the mechanic teaches. Where it preserves only the *theme*, it tests.

---

## Full Arc Aha Moment

> "I didn't become the Oracle. I am what the Oracle always was — the synthesis of all the voices I've attended to. And now I'm making my first prediction."

---

## Narrative Arc: The Apprentice Oracle

### Inciting Incident

**[Prose needed here before implementation]** Write one paragraph showing a citizen mid-sentence, the prediction failing, the silence. A half-finished thought hanging in the air. No one to complete it. This is what the Oracle's failure looks like at human scale — before the player is told anything.

The player arrives in the City of Tokens as a stranger, drawn by something they can't explain — a pull toward meaning. The Oracle — the city's prediction engine, the synthesis of all its citizens' voices — is failing. The city has grown: new voices, new patterns, speech the Oracle was never trained on. Predictions break mid-sentence.

The Oracle recognizes something in the player. It begins transferring itself, district by district. Each district gives the player one new capacity. The Oracle grows quieter as the player grows stronger.

### Oracle Voice Across Levels

**The Oracle must be present across all 8 levels** — one line of Oracle dialogue at the start of each level's intro. Its presence should grow quieter as the player gains more capacity. Its silence should be felt as a loss before the final level. Without this, the Oracle disappears for levels 2–7 and the arc loses its tension.

Example register: *"The Census Bureau. I always found this district cold."* Brief. Atmospheric. The Oracle is a presence, not a narrator.

### Final Beat

The player returns to the Oracle chamber. It's nearly gone. It speaks one last sentence — and stops mid-word. The player finishes it. Not because they know the answer — because they commit to the most likely continuation, and the city accepts it. The city goes still. Then erupts.

The player didn't become the Oracle. They are what the Oracle always was: the synthesis of all voices, completing what the city couldn't finish alone.

**Implementation requirement:** The final beat must be gated behind the Level 8 mechanic completing. The ending is earned through the distribution, not scripted.

### Narrative Accuracy Constraints

- **The Oracle is a pattern, not a person.** Frame the transfer as the player internalizing a process. The Oracle didn't choose to transfer — the pattern found the next carrier. Avoid language implying the Oracle has inner experience or self-awareness.
- **"City grew beyond it"** accurately represents training distribution shift. Distinguish between fixed knowledge (training weights, frozen) and processing ability (intact at inference). The Oracle can still process new input — what it lacks is knowledge of new patterns it was never trained on.
- **"Finishing the sentence correctly"** — preserve uncertainty in the framing. The player commits to a distribution; the highest-probability draw is accepted by the city. There is no correct answer — only a calibrated prediction.

---

## The 8 Levels

---

### Level 1 — The Gate
**Concept:** Tokenization + Embedding
**Aha moment:** Words aren't just words — they're positions in a space of meaning. And the splitting is surprising.

**Narrative beat:** The Gate is where the Oracle first perceives language. Raw speech arrives and gets broken into pieces — sometimes in unexpected places. Each piece finds its position in a space of all meaning. Some tokens land cleanly; some are stranded between clusters. Gift: you can parse meaning from sound.

**Core mechanic:**
1. A sentence arrives. Player clicks to split it into tokens — the splits are sometimes surprising (subword tokenization, e.g., "running" splits into "run" + "ning").
2. Tokens are then placed on a meaning map. Similar tokens cluster together.
3. An ambiguous token ("bank") is included — it lands stranded between two clusters (financial, river). That moment of ambiguity is the level's aha.

**Design note:** Two operations are present — tokenization (splitting) and embedding (placing). Don't collapse them silently. The splitting surprise is a free aha moment; don't skip it. The stranded "bank" image is the level's best beat.

---

### Level 2 — The Map Room
**Concept:** Positional Encoding
**Aha moment:** Attention is inherently orderless — it processes all tokens in parallel and cannot see sequence. Position must be stamped on as a workaround.

**Narrative beat:** The Map Room encodes where each token sits in the sequence. Without position, the city's parallel listeners would hear all words simultaneously and lose the order. Gift: you understand that order is information that must be injected, not assumed.

**Core mechanic:**
1. Two sentences with the same words appear side by side: "dog bites man" / "man bites dog."
2. Without position stamps, the model holds an *identical* unordered set for both sentences. Player sees this directly.
3. Player stamps each token with its position number (1, 2, 3). The two sentences' token sets diverge.
4. The insight: position encoding is what makes them different to a parallel processor.

**What changed from earlier design:** Previously, player unscrambled shuffled tokens to reconstruct a sentence — teaching sequential reading, the opposite of the concept. Now, player stamps position onto tokens and sees how it breaks the ambiguity of orderless parallel processing.

**Sentence selection note:** Use a sentence where word order reversal completely changes meaning ("dog bites man" vs. "man bites dog"). Avoid sentences where the correct order is obvious from meaning alone — the player must feel the orderlessness, not infer the sequence.

---

### Level 3 — The Census Bureau
**Concept:** Attention Scores
**Aha moment:** Attention isn't a pointer to one token — it's a weighted field over all tokens. Most weights are low; a few peak.

**Narrative beat:** The Census Bureau measures how much every citizen needs to know about every other citizen. Not a roll call — a field of relevance, constantly shifting. Gift: you can measure relevance between any two pieces of meaning.

**Core mechanic:**
1. A target token is highlighted in a sentence (a pronoun or ambiguous reference).
2. All connection weights between that token and every other token are shown simultaneously as bars or intensity levels — a full relevance field.
3. Player adjusts a threshold slider. Connections above the threshold glow; below it, they fade. Most are low; a few peak.
4. Player sees the distribution shape — not a single referent, but a field with peaks.

**What changed from earlier design:** Previously, player drew one line from a target token to the single token it referred to — teaching attention as a discrete pointer. Now, player sees the full distribution and sets a threshold — teaching attention as a weighted field.

**Sentence selection note:** Use ambiguous pronouns ("The trophy didn't fit in the suitcase because it was too large") where the referent requires genuine reasoning. Avoid obvious cases where English fluency alone solves it.

---

### Level 4 — The Town Square
**Concept:** Self-Attention
**Aha moment:** The synthesis is a weighted sum — different distributions produce different understandings. The mechanism is the weighting, not a completeness check.

**Narrative beat:** In the town square, all citizens speak to all others at once. The Oracle doesn't attend equally — some voices resonate more for this moment. The synthesis reflects how the voices were weighted. Gift: you can direct what collective attention produces.

**Core mechanic:**
1. 5 citizens speak about a situation. Player has 10 chips to distribute across them.
2. Player allocates chips and commits. A synthesis forms reflecting their distribution.
3. Two pre-configured distributions are shown side by side — each producing a visibly different synthesis. Player can see: same voices, different weights, different understanding.
4. Player then makes their own distribution for a new situation.

**What changed from earlier design:** Previously, a synthesis formed with a gap and the player identified the missing voice — testing reading comprehension, teaching attention as completeness-checking. Now, player distributes a budget and sees how weights shape synthesis — teaching that the weighting mechanism IS the operation.

**Note:** The v2 mechanic for this level (tokens attending to each other, emergent loudness, player as observer of the pattern) is fully designed in `docs/specs/2026-06-09-town-square-self-attention.md`. The v1 budget mechanic is a deliberate simplification. Ship v1, get feedback, then consider v2.

**Pre-authored synthesis content:** 8–10 synthesis variants across different weight distributions must be written before implementation.

---

### Level 5 — The Thread
**Concept:** Residual Connections
**Aha moment:** output = input + what attention learned. The original signal is never fully overwritten.

**Narrative beat:** No matter how far you travel through the city, the thread connects back to where you began. Each layer adds to the representation; nothing replaces it entirely. Gift: you understand that the original signal is never lost.

**Core mechanic:**
1. A token is shown before attention and after attention — two states side by side.
2. Player identifies which elements were preserved from the original vs. which were added by attention.
3. Then: player toggles off the residual connection. The representation becomes only what attention produced — the original signal disappears.
4. Player restores the residual. The insight: preservation is a design choice, not an accident.

**Design note (from agent review):** This is the strongest-aligned puzzle in the game. Preserve it. The "sever the thread" toggle converts identification into manipulation-with-consequence — do not drop it.

---

### Level 6 — The Library
**Concept:** Feed-Forward Network
**Aha moment:** Attention figures out context; the Library applies what was learned long ago. The Library's output depends entirely on what attention left you knowing.

**Narrative beat:** After the crowd, there's a private consultation. The Library holds accumulated knowledge — not what citizens know now, but what was learned in long training. What the Library gives you depends entirely on where attention left you. Gift: you can apply deep stored knowledge to any moment.

**Core mechanic:**
1. Token "bank" arrives post-attention in two different contexts — post-financial-attention and post-river-attention.
2. Player sees the Library's shelves and selects which knowledge fragments apply to the current post-attention state.
3. Different context → different fragments activate. Same surface word, different attention state, different Library output.
4. The mechanic teaches: FFN output is downstream of attention, not independent of it.

**Playtesting watch:** If players describe this as "looking up the answer in a database," the RAG misconception has taken hold. The fragments should pattern-match to the context state rather than being browsable by comprehension alone. Reframe UI if needed.

---

### Level 7 — The Tower
**Concept:** Layer Stacking
**Aha moment:** You enter as a word. You exit as a thought. One pass isn't enough — each layer applies the same type of operation to a richer input than the layer before received.

**Narrative beat:** The Tower repeats the city's work — not the same work, but the same kind of work, each time deeper. Each floor leaves the token richer than it arrived. Gift: understanding deepens through each pass.

**Core mechanic:**
1. An ambiguous token ("it" in "The trophy didn't fit in the suitcase because it was too large") starts unresolved at Layer 0.
2. Player clicks "add layer" one at a time. After each layer, the tower shows what the token now knows:
   - Layer 0: "it" — unresolved, two plausible referents
   - Layer 1: local context absorbed — pronoun near two objects, still ambiguous
   - Layer 2: broader structure — weighted lean toward one candidate
   - Layer 3: settled — one referent dominates
3. Player can also click "remove layer" — the resolution collapses back to ambiguity. They restore it.
4. The insight: you needed all three passes. Removing one undoes the resolution.

**What changed from earlier design:** Previously, player answered comprehension questions at each floor — testing the player's reading ability, not the mechanism. Now, player adds/removes layers and watches the token resolve and un-resolve — operating the depth, not demonstrating understanding.

**Accuracy note:** Each layer has distinct learned weights — this is not the same operation repeated. However, the emergent specialization (lower layers = syntactic, higher layers = semantic) is a reasonable and directionally correct simplification for v1.

---

### Level 8 — The Oracle
**Concept:** Output / Prediction
**Aha moment:** The Oracle doesn't know. It calculates the most likely continuation. There is no right answer — only a distribution, and a commitment.

**Narrative beat:** The Oracle is nearly gone. The player makes their first prediction as the new Oracle. A probability distribution appears over what comes next. The player commits. The city erupts. Gift: the Oracle's voice, now yours.

**Core mechanic:**
1. A sentence context is shown. A probability distribution appears over possible next tokens — some bright, some dim.
2. Player allocates 100 confidence points across the candidates *before* seeing the Oracle's distribution. They commit.
3. The Oracle's distribution is revealed. Player sees where they were calibrated and where they were overconfident.
4. Final moment: the Oracle's last sentence appears, stops mid-word. Player distributes confidence across possible completions and commits. The city accepts the highest-probability draw.

**Implementation requirement:** The final beat is gated behind the distribution mechanic completing. Not scripted.

**Sentence selection (critical):** Include genuinely ambiguous examples where spreading confidence is the correct move. If all examples are deterministic, players optimize by putting 100 points on one token — learning nothing about distributions.

---

## Agent Review Summary

This design was reviewed by three studio agents before spec was finalized:

**creative-director verdict:** Narrative arc is strong; L5 and L8 are the best-aligned levels. L2 and L3 had wrong causal arrows (must-fix). The dominant mechanic must show weighted/continuous attention, not discrete pick-one tasks.

**game-designer verdict:** L2 (wrong mechanism), L4 (inverse operation), and L3 (distribution collapsed to pointer) were the three biggest problems. L5 and L8 are the two strongest. Core heuristic: player's action must be structurally isomorphic to the computation.

**writer verdict:** Arc skeleton is strong, final beat is earned. Oracle absent from levels 2–7 is the primary structural weakness. Three narrative metaphors risk building wrong intuitions (Oracle-as-individual, "city grew beyond it," "finishing correctly"). Level 7 should use "you enter as a word, you exit as a thought."

---

## What's Not Yet Written (Pre-Implementation)

- **Narrative prose:** Inciting incident scene (one paragraph, citizen mid-sentence), Oracle voice line for each level, final beat copy
- **Synthesis copy:** Pre-authored synthesis variants for Level 4 (8–10 variants across weight distributions)
- **Example sentences:** Levels 2, 3, 7, 8 — selection is design-critical, not cosmetic (see level notes)
- **Visual direction:** District aesthetic per level, UI specs for new mechanics (threshold slider L3, chip allocation L4, layer toggle L7, probability bars L8)
- **Implementation plan:** Next step after spec review

---

## Acceptance Criteria

1. A player with no transformer knowledge completes all 8 levels without external explanation
2. After Level 8, the player can describe in their own words what an LLM does — without using "database" or "lookup"
3. No player describes any level as "just a quiz"
4. The final beat feels earned, not scripted
5. Zero console errors. All levels work on mobile (390×844 and 412×915)
6. Full playthrough under 45 minutes on first run
