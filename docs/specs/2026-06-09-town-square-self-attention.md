# The Town Square — Level Design Spec
## Self-Attention: How Tokens Find Meaning in Each Other

**Date:** 2026-06-09
**Status:** Draft
**Game:** City of Tokens (The Apprentice Oracle)
**Level:** 4 — The Town Square
**Concept:** Self-Attention

---

## Overview

The Town Square teaches self-attention through a mechanic where citizens (tokens) interact with each other, and their loudness — their relevance — emerges from those interactions relative to the current question. The player does not distribute attention. They observe the pattern that emerges, read the synthesis it produces, and learn to trace what the Oracle understood and what it missed.

---

## The Aha Moment

Target insight (Pillar 4 — design backwards from this):

> "The Oracle didn't choose what to focus on. The voices figured out their own relevance — and the synthesis reflects that. Change the question, and the whole pattern shifts."

---

## MDA Chain (designed backwards)

**Target Aesthetics:** Discovery primary, Challenge secondary, Fantasy supporting.

**Dynamics that produce Discovery:**
- Citizens "talk to each other" through animated connections; the player watches loudness emerge rather than assign it
- The synthesis is already formed by the time the player reads it — they see the consequence, not the construction
- When the synthesis has a gap, the player traces it back to a quiet voice and understands: that voice's information didn't survive
- In Scene 3: the loudness pattern visibly shifts for a new question over the same citizens — the player sees attention reconfigure around a different query

**Dynamics that produce Challenge:**
- The quiet citizen (Mira) looks unimportant — small card, few words, positioned at the edge
- Players will initially overlook her; seeing the synthesis gap and tracing it to her is the difficulty
- Scene 3 requires revising the mental model built in Scene 2

**Mechanics that produce those dynamics:**
- 5 citizens with animated connection lines to each other
- Query arrives → connections animate → citizens settle at varying brightness based on relevance to the query
- Synthesis panel forms in the Oracle's own voice (not word-mixing)
- Player reads the synthesis; in Scenes 2 and 3, identifies the voice behind a gap or a shift

---

## Player Fantasy

You stand in the Town Square as the Oracle's apprentice. The voices around you aren't waiting for you to choose them — they're already talking to each other, already figuring out what matters for the question at hand. Your job isn't to listen harder. It's to read what the conversation produced.

---

## Core Mechanic

### Token Conversations

Each citizen card has visible connection lines to every other citizen. When a query arrives, these lines animate — each token measuring its relevance to every other token relative to the question. The animation runs automatically. It is brief (≈1.5 seconds), not laborious.

This is not the player's action. The conversations happen in response to the query.

### Loudness Emergence

After the animation, citizens settle at varying brightness. Louder/brighter citizens contributed more to the synthesis. Quieter citizens contributed less — but not zero. Every citizen has a baseline presence; no voice fully disappears. This baseline is the residual: the original signal that persists regardless of attention.

The loudness pattern is determined by the query, not by the player.

### The Synthesis

A panel at the center shows the Oracle's current understanding — a coherent statement in the Oracle's own voice. This is not a collage of citizens' words. It is what the Oracle now knows, in its own terms, shaped by what resonated.

Different loudness patterns produce different pre-authored synthesis statements. The synthesis is always grammatically complete but may have visible conceptual gaps when a key voice was quiet ("though the origin remains unclear").

### Player Interaction

**Scene 1 (Tutorial):** No challenge. Watch the animation, read the synthesis, understand what happened.

**Scene 2:** After the synthesis forms, the council asks a follow-up. The synthesis has a visible gap. The player is asked: *"Which voice would have completed this understanding?"* They tap one citizen. One correct answer.

**Scene 3:** Same citizens, different query, different loudness pattern. The player is asked: *"Which voice's role changed most between these two questions?"* They tap one citizen. One correct answer.

---

## Level Progression

### Scene 1 — The Fire (Tutorial)

**Citizens (3):**
- **Elder Maris:** "The smoke is coming from the eastern granaries — I saw it at dawn."
- **Guard Captain Fen:** "Three riders reported flames near the old mill road, eastern side."
- **Merchant Dov:** "I had a shipment arriving from the north this morning — the northern road was completely clear."

**Query:** "Oracle, where should we send the water brigade?"

**Loudness pattern:** Maris and Fen resonate strongly (both directional, both confirming east). Dov dims (northern road is irrelevant to the fire's location).

**Synthesis:** "Fire is confirmed in the eastern district, near the granaries and the mill road."

**Player action:** None beyond reading. The synthesis is complete. The council thanks the Oracle and sends the brigade east. The player sees a clean, unambiguous pattern as a baseline.

---

### Scene 2 — The Collapse (Hidden Critical Voice)

**Citizens (5):**
- **Blacksmith Oran:** "The stone foundation has been crumbling for months — I saw cracks last week."
- **Vendor Sera:** "Three stalls were destroyed — mid-morning, without warning."
- **Vendor Pol:** "It happened fast. One moment the floor, the next the ceiling."
- **City Planner Yeva:** "The adjacent buildings share the same foundation. They may also be at risk."
- **Mira** *(a child — small card, positioned at the edge of the group):* "My father said there was digging under that street last month."

**Query:** "Oracle, are the other market buildings safe?"

**Loudness pattern:** Yeva becomes very bright (directly answers the question). Oran becomes moderately bright (structural history). Sera and Pol stay dim (event description, not risk assessment). Mira stays quiet — her card is small and visually unassuming.

**Synthesis (Mira quiet):**
> "Adjacent buildings share the compromised foundation and face real risk — though the origin of the failure remains unclear."

**Gap:** "origin of the failure remains unclear"

**Player prompt:** *"Which voice would have completed this understanding?"*

**Correct answer:** Mira. Her information about digging beneath the street explains why the foundation failed — without it, the Oracle can assess risk but not cause.

**Feedback if correct:** Mira's card pulses. A second synthesis appears beside the first showing what the Oracle would have known: *"Adjacent buildings share the compromised foundation — and recent digging beneath the street likely caused the failure. Both the risk and its source are understood."* The contrast between the two syntheses is the teaching.

**Feedback if wrong:** The correct citizen is highlighted with a one-line explanation. No punitive loop — continue.

---

### Scene 3 — The Collapse, Revisited (Query-Dependence)

Same 5 citizens. Same event. Different question.

**Query:** "Oracle, when did this become a danger?"

**Loudness pattern shift:**
- Oran becomes very bright (cracks last week — direct timeline)
- Mira becomes bright (digging last month — earlier point on the timeline)
- Yeva dims significantly (risk assessment doesn't address when)
- Sera and Pol remain dim

**Synthesis:**
> "Structural weakness was visible at least a week before the collapse — and work beneath the street may have been the origin, going back further still."

**Player prompt:** *"Which voice's role changed most between the last question and this one?"*

**Correct answer:** Yeva. She was the loudest voice in Scene 2; she is now among the quietest. The same information, the same citizen — but a different question made her almost irrelevant. This is the clearest demonstration that attention is query-dependent, not fixed.

**Closing beat:** The district elder approaches.
> *"You're learning to hear — not by choosing, but by following what the question draws out."*

The Oracle's gift is transferred. The player moves to the next district.

---

## Narrative Context

This level sits within The Apprentice Oracle arc. The player is receiving the Oracle's capacities district by district. The Town Square confers **resonant hearing** — the ability to witness which voices a question draws forward, rather than imposing a filter.

This connects to the larger arc: the Oracle doesn't attend deliberately. It reads what emerges. The player is learning that their role as Oracle isn't to choose — it's to understand what the city's voices, in conversation with each other, already know.

---

## Technical Accuracy Notes

### What this mechanic teaches correctly
- Attention weights are not assigned by an external agent — they emerge from relationships between tokens relative to the query
- Different queries produce different attention distributions over the same context (Scenes 2 → 3)
- The synthesis reflects what resonated, not what was consciously selected
- Low-weight tokens still contribute (baseline presence approximates residual connections)
- Attention is traceable: you can identify which tokens shaped which parts of the output

### Deliberate simplifications
- **One global query vs. per-token queries:** In reality every token asks its own query simultaneously, producing N attention distributions. This mechanic shows one query (the council question) driving the whole pattern. The key insight — attention is query-dependent — is preserved; the full parallelism is not.
- **Attention as emergent computation vs. matrix math:** The animation implies tokens are "deciding" to resonate. In reality it is Q·K dot products followed by softmax — no agency involved. The framing ("loudness emerges") softens this but doesn't fully eliminate the sense of intentionality. Flagged as known deviation.
- **Synthesis as readable text vs. vector:** The synthesis panel shows a human-readable statement. In reality attention outputs are vectors; text appears only at the final projection layer. Necessary simplification for player legibility.
- **Single-head attention:** Multi-head attention is not represented. Each citizen "means" one thing in this mechanic; in reality different heads interpret tokens through different learned projections in parallel.

---

## Edge Cases

- **Player taps a partially correct answer in Scene 2** (e.g., Oran instead of Mira): Acknowledge the partial truth — Oran's information is present in the synthesis. Redirect: "Oran's voice is already here — find the one that isn't."
- **Player ignores synthesis panel before prompt appears:** Synthesis panel has a minimum 1.5-second dwell before the council follow-up appears. Not a hard block, but gives the synthesis time to be read.
- **Mobile layout:** Citizen cards must be minimum 44×44px touch targets. Connection line animation must remain legible at 390×844. Five cards in a pentagon layout; synthesis panel below.

---

## Tuning Knobs

| Parameter | Description | Starting Value |
|-----------|-------------|----------------|
| Animation duration | How long the connection-line conversations run | 1.5s |
| Loud citizen brightness | Opacity/glow of a high-relevance citizen | 100% + glow |
| Quiet citizen brightness | Opacity of a low-relevance citizen | 40% |
| Baseline (residual) brightness | Minimum opacity — no citizen goes below this | 65% |
| Mira's card size | Relative to other citizens — must look unassuming but not invisible | 80% scale |
| Synthesis dwell before prompt | Minimum time before follow-up question appears | 1.5s |

---

## Acceptance Criteria

1. A first-time player can complete Scene 1 without instruction — the mechanic is legible from the visual alone.
2. In Scene 2, the majority of first-time players attempt an incorrect answer before identifying Mira. (Tests that her quietness is creating the right difficulty.)
3. In Scene 3, the majority of players correctly identify Yeva as the citizen whose role shifted most. (Tests that query-dependence reads through the loudness change.)
4. No player in playtesting describes the mechanic as "the Oracle chooses what to listen to." Language and visual must support emergent-not-chosen framing.
5. No player describes the synthesis as "mixing the citizens' words." The Oracle's voice must read as distinct from the citizens' voices.
6. Level completes in 4–7 minutes on first play.
7. Zero console errors. Layout correct at 390×844 and 412×915.

---

## Dependencies

- **Story context:** Player has received prior districts' gifts (tokenization, positional encoding, attention scores). Assumes familiarity with the Oracle-transfer arc.
- **Visual direction:** Citizen card design, connection line style, synthesis panel layout, loudness visual language — requires Art Director direction before implementation.
- **Synthesis copy:** The pre-authored synthesis statements (8–10 variants across 3 scenes, covering loudness pattern permutations) must be written before implementation.
- **Broader redesign:** This spec pilots the mechanic axis for The Apprentice Oracle arc. The full 8-level redesign spec is not yet written — this level stands alone as a pilot.
