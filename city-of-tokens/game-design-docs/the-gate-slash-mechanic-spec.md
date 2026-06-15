# The Gate (Level 1) — Slash Mechanic Spec

> **Status:** Approved for implementation. Concept prototype validated 2026-06-15
> (`prototypes/slash-gate-concept/prototype.html`).
> **Supersedes:** the current click-to-split mechanic in `city-of-tokens/the-gate.html`.
> **Must pass:** `design/design-constraints.md` (review gate) and `design/pillars.md`.

This spec is the source of truth for the production rebuild. The prototype is
reference only — production code is written from scratch to studio standards.

---

## 1. Overview

The player breaks a word into pieces by **slashing** across it (press-drag on
desktop, touch-slide on mobile). Each piece is checked against a fixed list —
the **Ledger** (vocabulary). Pieces in the Ledger pass through the Gate; pieces
that aren't are held back, red, and must be slashed smaller. When every piece
passes, the Gate reveals the **one true split** the model actually uses. There
is no score: the lesson is carried by the *effort* of cutting and by the *reveal*,
never by a graded count.

This teaches tokenization: a word arriving at a transformer is broken into
registered fragments before any processing happens.

---

## 2. Player Fantasy

**Target aesthetics (in priority order):** Discovery (primary), Challenge
(secondary), Fantasy (supporting) — per `design/pillars.md`.

The player should feel like they are **cleaving** something physical — a clean
chop with an immediate verdict. A common word passes almost untouched; a rare or
invented word resists, shattering into pieces they must keep hacking at. The
*hand* learns "common = easy, rare = work" before the *head* does.

**The aha (the Discovery payoff):** at the reveal, the player sees the cut lands
at `believ|able`, not `believe|able`, and thinks **"wait — why is the cut
*there*? That's not where the word splits."** The frequency explanation (the
*why*) is delivered only after that "where?!" moment lands.

**One-sentence aha for this level:** *"The cuts don't follow what words mean —
they follow what appeared most often in training data, which is why 'believ' is
a fragment but 'believe' isn't."*

---

## 3. Detailed Rules

### 3.1 The concept being taught (in priority order)
1. **The action (core):** break a string into pieces that exist in a fixed Ledger.
2. **The outcome:** common text → few big pieces; rare/weird text → many small pieces.
3. **The aha (after play):** frequency, not meaning, decides what's in the Ledger.

Frequency is the *why* — delivered at the reveal, never as the entry point.

### 3.2 Core loop
1. A word arrives **whole**, and its validity is shown live.
   - If the whole word is in the Ledger (e.g. `hello`), it is already valid and
     passes the Gate with **zero slashes**.
   - Otherwise it sits **held-back** (red) on the entry side and must be slashed.
2. The player **slashes** a held-back piece to cut it. The cut lands at the gap
   nearest where the blade crossed that piece.
3. Each resulting piece is validated immediately against the Ledger:
   - **In the Ledger →** passes through to the *through* side (valid).
   - **Not in the Ledger →** stays held-back (red) on the *entry* side.
4. The player keeps slashing held-back pieces. They may **Undo** the last cut or
   **Reset** the whole word at any time.
5. When **all** pieces are valid, a **Pass through the Gate** action appears.
6. On pass, the Gate **reveals the model's single true split** alongside the
   player's split, with a short "why here?" insight. Then: next word.

### 3.3 The slash interaction
- **One unified pointer model** (Pointer Events) handles mouse, touch, and stylus.
- The **whole play area is the slash surface** (not the individual pieces), with
  static `touch-action: none` so a slash is never stolen as a page scroll on mobile.
  `setPointerCapture` on the surface keeps the stroke alive if the pointer leaves it.
- **One slash = one cut**, placed at the gap **nearest** to where the blade
  travels across the first held-back piece it crosses (left to right).
- A stroke shorter than `MIN_SWIPE` (~16px) is ignored — a click/tap does **not**
  place a cut (this removed the "cut before I swipe" problem from an earlier build).
- A **slash trail** is drawn on an overlay and lingers briefly, then fades, so
  the gesture reads as having landed.

### 3.4 Rendering rules
- **Keyed reconcile, no teardown:** each piece has a stable identity
  (`start-end` in word coordinates). On each cut, only the piece that changed is
  replaced; unchanged pieces are never re-rendered (no flicker). New pieces from
  a cut **pop in** (subtle scale/fade).
- **Spatial Gate metaphor as the primary signal:** valid pieces move to the
  *through* side, held-back pieces stay on the *entry* side. Color (green/red) is
  a reinforcing layer, never the sole cue. **No flashing** — the held-back state
  is persistent/static (accessibility + `design-constraints.md`).
- `prefers-reduced-motion`: animations become instant state changes; the spatial
  position remains the cue.

### 3.5 No scoring (deliberate)
There is **no score, no stars, no token counter, no "optimal" readout** during
play. The only verdict is binary per-piece: passes the Gate, or held back.
Rationale: grading on count teaches that tokenization is a search the player
optimizes — but real tokenization is **deterministic** (one input → exactly one
split). The "common = fewer pieces" lesson is carried by *effort* (a common word
needs no slashing; a rare one is a mess) plus the *reveal contrast*.

---

## 4. Formulas

There is intentionally **no scoring formula**. The only computed relation is
validity:

```
valid(segment) ⟺ segment ∈ vocab(word)        // vocab(word) = the per-word Ledger
wordCleared    ⟺ every segment is valid
```

Segments are derived from the word and the set of cut positions (word
coordinates), in order; each segment is `word.slice(prevCut, cut)`.

The model's "true split" shown at the reveal is authored per word (`correct`),
not computed at runtime — see §6 on conceptual-accuracy sourcing.

---

## 5. Edge Cases

- **Whole word already valid** (`hello`) → zero-slash pass; hint reflects "nothing to cut."
- **Valid-but-non-model split:** the player can clear a word with a split the
  model wouldn't use (e.g. all single characters — each letter is in the Ledger).
  This is allowed; the reveal contrast teaches it isn't how the model does it.
  *Open question / tuning:* whether to nudge against over-cutting, or let the
  reveal carry it. Default: let the reveal carry it (no penalty — penalties
  reintroduce scoring).
- **Slash crosses no held-back piece** → no-op.
- **Slash crosses multiple held-back pieces** → cut only the first (one cut per
  slash). Revisit if multi-cut feels better in playtests.
- **Undo with empty history** → control disabled.
- **Reset** → clears all cuts, restores the whole word (distinct from Undo).
- **Reduced motion** → no animation; instant state.
- **Mobile** → arena `touch-action: none`; the rest of the page scrolls normally.
- **Accessibility (REQUIRED for production):** the slash is a drag gesture. The
  prototype removed tap-to-cut because it caused premature cuts, which leaves no
  non-drag path. Production **must** provide an accessible alternative (e.g.
  tappable gap targets in an explicit mode, or keyboard navigation of gaps), per
  `design-constraints.md`. This is a known gap in the prototype, not the design.

---

## 6. Dependencies

- **`design/pillars.md`** and **`design/design-constraints.md`** — the build must
  pass the constraints review gate before shipping.
- **Thread 1 — information redesign (separate, in progress):** the pre-play
  framing, in-play hints, and the reveal's insight copy + visual components are
  being designed in the text→visual redesign effort. This mechanic spec assumes
  **minimal pre-play text** (Play-First). The reveal insight text is owned there.
- **Per-word data (`ROUNDS`):** each word needs `word`, `correct` (the model's
  true split, for the reveal), `vocab` (the Ledger), and `insight` (reveal copy).
- **Conceptual-accuracy sourcing (IMPORTANT, Pillar 1/2):** the prototype's
  `vocab` and `correct` values are **hand-authored and illustrative**. For
  production, the splits and Ledger entries should be verified against a real
  tokenizer (or clearly curated as representative) so the game does not build a
  wrong intuition. Whoever owns conceptual accuracy must sign off on the word data.

---

## 7. Tuning Knobs

| Knob | Category | Notes |
|---|---|---|
| `MIN_SWIPE` distance (~16px) | Feel | Below this, a stroke is ignored (no accidental cut). |
| Hit-test forgiveness (`padY`) | Feel | Vertical tolerance for which piece a slash "crossed." |
| Slash trail style + fade duration | Feel | Tunes how much the gesture "lands." |
| Pop-in animation duration | Feel | How a fresh cut reads as an event. |
| Word set + sequence | Gate / pacing | Must open common → escalate to rare for the contrast. |

All gameplay values live as named constants (per coding standards), not inline.

---

## 8. Acceptance Criteria

**Functional**
- Slash places a cut at the intended gap reliably (target: feels accurate in
  playtest; debug overlay confirms gap resolution).
- Works with mouse and touch via one code path; no page scroll on mobile mid-slash.
- Undo removes only the last cut; Reset restores the whole word.
- Reveal shows the authored model split and the player's split; no score anywhere.
- Zero console errors on load and through a full play session.
- `prefers-reduced-motion` respected; layout holds at 390×844 and 412×915.
- An accessible non-slash path exists (see §5).

**Experiential (validated by playtest)**
- The player feels the **effort contrast** (common vs rare) unprompted.
- At the reveal, the player reacts to **WHERE** the cut is ("why there?"), not how many.
- The player does **not** ask for the "best" or "fewest" split.
- The slash feels like **cutting**, not clicking.

**Gate**
- Violates **none** of `design/design-constraints.md`.

---

## Appendix — Validated in the prototype (2026-06-15)

- Slash-to-tokenize feels good on desktop and mobile in **vanilla DOM** — no
  framework, no canvas, no libraries needed. The browser was never the
  constraint; the earlier jank was a full-DOM-rebuild implementation bug, fixed
  by keyed reconcile.
- The no-scoring, reveal-the-true-split loop holds up as a teaching structure.
- Word set used in the prototype: `hello`, `unhappy`, `ChatGPT`, `unbelievable`,
  `preprocessing`.
