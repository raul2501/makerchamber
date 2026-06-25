# The Map Room (Level 2) — Embedding Mechanic Spec

> **Status:** Approved for implementation (design locked 2026-06-18).
> **Builds into:** `city-of-tokens/the-map-room.html` (overwrites the old-generation
> file — pre-redesign, unlinked from `index.html`, recoverable in git).
> **Source design:** `city-of-tokens/game-design-docs/level-02-the-map-room.md`
> (06-09) — this spec reconciles that design with studio standards and the
> validated near-wordless style proven on Level 1.
> **Must pass:** `design/design-constraints.md` (review gate) and `design/pillars.md`.

This spec is the source of truth for the production build. It is written to studio
standards (named constants, mobile budgets, region-based instinct scoring, accuracy
sourcing). Where it
is silent, defer to `level-02-the-map-room.md`.

---

## 1. Overview

A token arrives from the Gate. The player **drags it onto a 2D map of meaning** and
drops it where they think it belongs. On release it **snaps to where training
actually placed it**, and a ripple expands so its nearest neighbors light up. After a few clean
words establish that the map sorts itself by meaning, **"bank"** arrives and snaps to
a point **stranded between two clusters** (river and finance) — belonging fully to
neither. A short two-sentence reveal shows both meanings produce the *same* point.

This teaches token embedding: after tokenization, each token becomes a fixed point in
a learned semantic space. Position reflects usage, the space has real structure — but
one token gets exactly one position, even when it means two things.

---

## 2. Player Fantasy

**Target aesthetics (in priority order):** Discovery (primary), Challenge
(secondary), Fantasy (supporting) — per `design/pillars.md`.

The player should feel like a **cartographer placing a traveler on a vast map drawn by
someone who read everything ever written** — guessing where a word lives, then seeing
where it truly landed. The *hand* learns "similar words sit together" before the *head*
names it. The map was drawn once and frozen: every traveler gets one spot, even if they
live two lives.

**The aha (the Discovery payoff):** at the "bank" reveal, the player sees it land
**between** river and finance — not in either — and thinks **"wait, it can't be in two
places, so it's stuck in the middle, fully neither."** The two-sentence reveal confirms
it: two opposite sentences, one identical point.

**One-sentence aha for this level:** *"Words become points on a map of meaning — and a
word that means two things gets stuck at one point, halfway between both."*

---

## 3. Detailed Rules

### 3.1 The concept being taught (in priority order)
1. **The action (core):** place a token on a map; its true position is revealed.
2. **The outcome:** similar-meaning words land near each other — meaning becomes a place.
3. **The aha (after play):** a polysemous word gets one fixed position that belongs to
   neither meaning. This is the unresolved problem the level ends on.

The map is **learned, not reasoned**: the player *guesses*, then the map *reveals* the
truth. The player never computes the model's answer — the reveal models "training put
it here," reinforcing that embeddings are learned, not logic'd. (Pillar 1/2.)

### 3.2 Core loop
1. A token card arrives (continuity: it just passed through the Gate).
2. The map is shown populated with **unlabeled word-dots in clustered regions**. There
   are **no cluster labels** — the player reads the individual word-dots to infer where
   regions are. (Deliberate: labels would short-circuit reading the map. Per source doc §4.)
3. The player **drags** the token card onto the map and **drops** it where they think it
   belongs.
4. On release, the token **snaps** to its authored true position with a pulse, then a
   **proximity ripple** (a ring) expands from the dot; each nearest word-dot **lights as
   the ring's edge reaches it** (closest first). The ripple signifies **nearness (kinship
   of meaning), never connection** — lines would read as "these words are wired / talk to
   each other," which is *attention*, a later mechanism not yet in play. Only the round's
   listed kin light; a non-kin dot the ring sweeps over stays dim.
5. A reveal panel shows the neighbor list + a short plain-English note (jargon last).
6. Next round. **Round 3 ("un" + "happy")** is a two-token variation: "happy" is shown
   already at its Round-1 position (reference) and the player places **"un"**; on snap, a
   connector is drawn between the two points (the offset). The final round ("bank")
   additionally triggers the polysemy reveal (§3.4) and the two-sentence problem screen (§3.5).

### 3.3 The drag interaction
- **One unified pointer model** (Pointer Events) handles mouse, touch, and stylus —
  same approach proven on Level 1.
- The token card is the draggable; the **map is the drop surface** with static
  `touch-action: none` so a drag is never stolen as a page scroll on mobile.
  `setPointerCapture` keeps the drag alive if the pointer leaves the card.
- A **drop anywhere on the map is valid** — there is no "wrong" drop. The snap-to-true
  reveal is the teaching; placement also earns a light region-based instinct read (§3.7),
  but the reveal never depends on it.
- A **wordless drag cue** (e.g. the card lifting / a ghosted target) signals the gesture
  so a stranger knows to drag without reading — mirrors L1's wordless blade cue.

### 3.4 The polysemy reveal (Round 4, "bank")
- "bank" snaps to a point **equidistant between the Finance cluster and the Nature
  cluster** — visibly in neither.
- **One ripple** expands from the point and lights **both clusters' dots** as its edge
  passes them (teal Nature, amber Finance live on the dots/chips, not the ring). A single
  ring reaching two distant families *is* the "belongs to neither" picture.
- Color is a **reinforcing** layer, never the sole cue: the *spatial* stranding (a point
  between two groups) is the primary signal. **No flashing** (accessibility +
  `design-constraints.md`).
- **Bank gets the standard reveal panel too** (map visible + "what happened" / "so what"),
  same as every other round — so the player connects the spatial stranding to the words
  before the payoff screen. Its "so what" **plants the seed**: *"One word, one dot — even
  though it means two different things. To tell them apart, the map needs the words around
  it."* (gestures toward the attention levels without naming "attention"/"context").

### 3.5 The two-sentence problem screen (Round 4 payoff)
- Reached via the bank reveal panel's **"Continue →"**. Title: *"Same word. Two meanings."*
- Two sentences with opposite meanings (*"The bank was completely flooded."* / *"The bank
  was suddenly closed."*), each tagged with the meaning the player would **expect**
  (by the water / near the money) — this sets the tension the payoff resolves.
- An **echo-map** sits below: a faint water cluster (left), money cluster (right), and one
  shared **`bank` dot** in the middle. Tapping **"look up *bank*"** on each sentence fires
  an arrow from its side to the **same shared dot**. After both: two arrows, **one dot** —
  the collision is *spatial*, not textual. **No coordinates, no neighbor-list** (jargon cut).
- A callout appears **only after both** look-ups (gated so the player makes the connection
  themselves): *"Two meanings, one dot — so the map can't tell them apart. The meaning has
  to come from the words around it."* (≤2 sentences; plants the seed toward attention.)

### 3.6 Rendering rules
- **Stylized, hand-placed map — not real embeddings.** Word positions are authored to
  clearly show clustering and the polysemy stranding. (Source doc §8; matches the
  timebox.) Accurate concept, illustrative coordinates.
- Map dots and the placed token have stable identities; only changed elements
  re-render (no full teardown / flicker) — same discipline as L1's keyed reconcile.
- `prefers-reduced-motion`: snap/pulse/ripple animations become instant state changes; the
  spatial position remains the cue.

### 3.7 The instinct read (scoring — region-based, never pixel-based)
Each placement earns a light **instinct read** (e.g. *Sharp · 8/10*) shown atop the reveal
panel, plus a running total ("Map-reading instinct: X/40" on the done screen). Scoring is
deliberately **region-based, not coordinate-based**: it rewards finding the right
*neighbourhood* (which meaning-cluster the drop is nearest to, then how central), **never**
proximity to the exact authored pixel — because the positions are illustrative and the space
is **learned, not derivable**. Guard-rails that keep it from teaching "reason out the
coordinate":
- **The reveal is always the verdict.** The score rides on top and never gates or replaces
  the snap-to-true teaching; a low score still gets the full reveal.
- **Tiers, not precision:** Spot on (10) / Sharp (8) / Warm (5) / Off (2), thresholds scaled
  by each cluster's own size — so it reads as "right area," not "right pixel."
- **Bank is the twist, and it's scored too.** Most players commit "bank" to the water or
  money family (not the empty middle) — that gap *is* the lesson. Bank scores how well the
  player sensed it's *between* two families; a low score comes with reframing copy
  (*"you put 'bank' with the money words — like most people. But the map can't pick…"*) so
  the likely-low score is the **setup for the aha, not a punishment**.

---

## 4. The Four Rounds

Per source doc §5. Words kept as authored; see the continuity note below.

| # | Word | Lands | Teaches |
|---|------|-------|---------|
| 1 | **happy** | cleanly inside one tight cluster (emotions) | tutorial — single-meaning words occupy tight, clean neighborhoods; establishes the mechanic |
| 2 | **token** | at the Language/Technology boundary (word, text, sentence ↔ code, data, model) | position reflects the *full range* of usage, not the most obvious meaning |
| 3 | **un + happy** (the two tokens L1 split `unhappy` into) | "happy" sits where Round 1 left it (reference), and the player drops "un"; "un" must not appear as a pre-drawn map dot | a word the Gate split now travels as **two separate points**, each with its own place — its meaning is not recombined yet (this sets up the later levels) |
| 4 | **bank** | stranded between Finance (deposit, money, invest, account) and Nature (river, rain, stream, shore) | **main event** — polysemous words get one position belonging fully to neither meaning |

### 4.1 Conceptual-accuracy resolution (verified 2026-06-18, o200k via tiktoken)
Every word that *travels* (gets placed) must be a **single token**, or embedding it as one
point contradicts Level 1. Verified:
- **Round words:** `happy`, `token`, `bank` are single tokens ✓. **`unhappy` is NOT** —
  it tokenizes to `['un','happy']`, exactly as Level 1 shows. So Round 3 was reworked
  (above) to bring **`un` and `happy` as the two separate tokens**, restoring L1→L2
  continuity instead of breaking it. (Both `un` and `happy` are single tokens ✓.)
- **Map-dot fixes:** `calm`/`flood`/`savings` were multi-token; replaced with single-token
  synonyms **`love` / `rain` / `money`** (verified ✓). All embeddable dots are now honestly
  one token each. `un` is a traveler in Round 3, not a pre-rendered reference dot.
- **Accuracy caveat for Round 3 copy:** frame the lesson as "a split word now travels as
  two separate points" — keep any *directional* ("un always points toward negative") claim
  modest. A rigorous negation-direction is a word-embedding analogy property, shaky at the
  raw-token level; it belongs in the sign-off, not asserted as fact in player copy.

**Continuity note:** with Round 3 reworked, `unhappy`'s split now *continues* from L1
(the player watched it cut into `un`+`happy` at the Gate; here those pieces arrive). The
older "token = a piece of `tokenize`" callback no longer applies (L1's current word set is
`hello / unhappy / ChatGPT / unbelievable / preprocessing`); `token` and `happy` stand on
their own as words — drop any explicit "you split this at the Gate" copy for them.

---

## 5. Formulas

There is intentionally **no scoring formula**. The only authored relations are:

```
truePosition(word)  = authored (x, y) on the stylized map        // illustrative, not computed
neighbors(word)     = authored ordered list of nearest word-dots // must be defensible (real synonyms/co-occurrence)
```

The "snap" animates the placed token from the player's drop point to `truePosition`.
A proximity ripple then lights `neighbors(word)` as its edge reaches each one.

---

## 6. Edge Cases

- **Drop outside the map bounds** → snap still proceeds to `truePosition` (drop location
  never gates the reveal).
- **Drop directly on the true spot** → snap is a no-op move; pulse + neighbors still play.
- **Rapid re-drag before snap completes** → ignore input until the snap/reveal settles
  (one placement per round).
- **Round 4 problem screen — only one sentence looked up** → callout withheld until both.
- **Reduced motion** → no animation; instant snap, instant ripple, instant neighbors,
  instant echo-map arrows. The flow sequences on timers (never `transitionend`), so it
  never stalls when motion is off.
- **Mobile** → map `touch-action: none`; the rest of the page scrolls normally.
- **Accessibility (deferred — fast-follow, same call as L1):** the placement is a drag
  gesture with no non-drag path yet. Required before any public Vercel push; OK to skip
  for the local / link-shared hackathon build (decision 2026-06-18, mirrors L1).

---

## 7. Dependencies

- **`design/pillars.md`** and **`design/design-constraints.md`** — must pass the
  constraints review gate before shipping.
- **L1 scaffolding (reuse, don't reinvent):** orientation screen → wordless gesture cue →
  play → reveal. Visual language, fonts, and the InsightCard/reveal pattern should match
  `city-of-tokens/the-gate.html` for demo consistency.
- **Per-round data (`ROUNDS`):** each round needs `word`, `truePosition`, `neighbors`,
  the cluster membership for the reveal, and `insight` (reveal copy). Round 4 also needs
  the two problem sentences.
- **Map data (`MAP_DOTS`):** the authored set of word-dots and their positions/clusters.
- **Conceptual-accuracy sourcing (IMPORTANT, Pillar 1/2):** positions are illustrative,
  but **neighbor relationships must be defensible** — real synonyms / co-occurring words,
  not arbitrary. Whoever owns conceptual accuracy signs off on `MAP_DOTS` + `neighbors`
  before ship, so the game does not build a wrong intuition.

---

## 8. Tuning Knobs

| Knob | Category | Notes |
|---|---|---|
| Snap animation duration | Feel | How the reveal "lands." |
| Ripple expand duration (`RING_MS`) + count | Feel / clarity | How fast the ring sweeps; how many kin light, how fast. |
| Ripple radius/overshoot (Round 4) | Feel / clarity | Tunes the "stranded between two" read. |
| Cluster spacing on the map | Clarity | Far enough apart to read as distinct regions. |
| Drag-cue prominence | Onboarding | How strongly the wordless cue signals "drag me." |
| Round set + sequence | Pacing | Clean → clean → directional → polysemy punch. |

All gameplay values live as named constants (per coding standards), not inline.

---

## 9. Acceptance Criteria

**Functional**
- Drag-and-drop places the token via one code path for mouse and touch; no page scroll
  on mobile mid-drag.
- Snap-to-true + the proximity ripple play on every round (kin light, never lines);
  Round 4's single ripple lights both families, then bank gets the standard reveal panel
  and the gated two-sentence problem screen.
- Region-based instinct read per round + running total; never a pixel-distance grade, and
  the reveal always plays regardless of score (§3.7).
- Zero console errors on load and through a full play session.
- `prefers-reduced-motion` respected; layout holds with no horizontal overflow at
  390×844 and 412×915 (the 390w bug that hit the old levels must not reappear).

**Experiential (validated by playtest)**
- After 2–3 rounds, the player expects similar words to land near each other (clustering
  felt unprompted).
- At "bank," the player reacts to its being **between** two groups ("it's stuck in the
  middle"); the (often low) instinct score reads as "I fell for the trap," not "I aimed badly."
- The two-sentence reveal produces a visible "huh — same point" moment.
- The instinct read feels like a **guess-and-discover**, not a precision test — the player
  never feels they were supposed to compute the exact spot.

**Gate**
- Violates **none** of `design/design-constraints.md`.
- `index.html` Level 02 label corrected from "Positional Encoding" to "Embedding," and
  the Map Room card linked/unlocked once the build passes.

---

## Appendix — Open items carried into the build

- **Continuity of "token"/"happy"** vs Level 1's current word set (see §4 note).
- **Doc inconsistency to fix separately:** `index.html` + `CLAUDE.md` label Level 02 as
  "Positional Encoding," which skips embedding and is architecturally out of order. The
  older `transformer-game-design.md` is correct (Map Room = Embedding, then Census Bureau
  = Positional Encoding). Reconcile the labels across docs as a follow-up.
- **Accessibility non-drag path** — deferred fast-follow, required before public release.
