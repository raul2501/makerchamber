# Concept Stub — "Checkpoint" Challenge Beats (recall + emotion layer)

> **Status:** Concept stub — **post-hackathon roadmap.** Not specced, not scheduled.
> **Depends on:** Level 2 (The Map Room / Embedding) shipping — currently PR #3.
> **Origin:** Rishi Ch playtest of Level 1 (`docs/feedback/level-1/Ch-feedback/`) +
> brainstorm session 2026-06-18.

## The problem this addresses

Playtest signal: the per-level mini-games teach the concept (validated by Tavishi/Ashiya),
but the experience is **light on Challenge** (a named secondary aesthetic) and can feel
passive — "mindless, you can go through it without it invoking emotion" (Rishi). We
explicitly decided **not** to fix this by changing a level's core teaching mechanic, and
**not** by adding a graded school-style quiz (contradicts no-score; risks making
non-technical learners "feel stupid" — see `design/design-constraints.md`).

## The idea

A recurring **"Checkpoint"** beat that appears **after a couple of levels** and makes the
player *use the concepts they've learned* — called back together — to crack a **real,
recognizable AI mystery.** Challenge-as-mastery (apply it), not challenge-as-evaluation
(test it). This is the synthesis/recall layer; it realizes Rishi's "challenge run that
calls back the concepts through the game mechanics."

Design rules it must honor:
- **Deterministic:** one right answer, reasoned — never "optimize," never a search.
- **No score / no grading.** Framed socially/curiously ("most people miss this — your guess?").
- **Recall through doing**, not multiple-choice recognition.

## First Checkpoint — "Why AI can't count letters" (after Level 2)

The canonical, lived AI failure: *"How many R's in `strawberry`?"* (models have famously
gotten this wrong). The payoff synthesizes L1 + L2: the AI turned the word into **chunks**
(the Gate), then into **meaning-points** (the Map Room) — and the **letters fell out at
every step**.

**Aha:** *"The AI can't count the letters because it never gets letters — it gets the chunks
I made at the Gate. To it, 'berry' is one lump, not b-e-r-r-y."*

**Mechanic sketch — "Be the AI":** put the player in the model's seat — show only what the
model has to work with, ask the letter-question, let them feel the blindness, they guess
(like the model does), then reveal the chunks with the letters buried inside. One
prediction, one right answer, big recognition payoff.

**Verified facts (o200k via tiktoken, 2026-06-18):**
- `strawberry` → `st` · `raw` · `berry`  (ids `302 · 1618 · 19772`). **3 r's, scattered:**
  0 in "st", 1 in "raw", 2 in "berry" — no single chunk holds the answer. Ideal.
- Alternates: `mississippi` → `miss` · `issippi` (4 s's, scattered); `raspberry` →
  `ras` · `p` · `berry`; `banana` → single token (even less to go on).

**Accuracy framing:** present as the *structural/historical* reason AI "has famously
struggled" with letter/spelling tasks — NOT "go try it now, it'll fail" (newer models are
patched; the structural reason persists).

## Open questions (resolve when we pick this up)
- **Cadence:** every 2 levels? after specific milestones? How many checkpoints total?
- **Form:** standalone interstitial screen, or a short mini-level between chapters?
- **Token IDs:** now that it's post-embedding, is showing the numeric token codes helpful
  (visceral "no letters") or redundant with L2? (Was the reason this moved past L1.)
- **Other mysteries** for later checkpoints: spelling/reversing words; why other languages
  "cost more" tokens; rhyming; arithmetic quirks.
- Does this stay City-of-Tokens-specific, or generalize into a studio pattern for any
  concept-teaching game?

## Why it's parked
Post-hackathon: the hackathon build is the *clean validation instrument* (does the aha land
first-pass), and this depends on L2. It also does **not** add Challenge to Level 1 itself —
if that's ever wanted for L1, the lightweight "predict-the-split" beat is the candidate
(see brainstorm 2026-06-18).
