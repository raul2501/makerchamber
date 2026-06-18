# The Map Room (Level 2 — Embedding) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Level 2 ("The Map Room") — a drag-a-token-onto-a-map-of-meaning level that teaches token embedding, ending on the polysemy "stuck at one point" aha.

**Architecture:** A single self-contained HTML file (`city-of-tokens/the-map-room.html`), same shape as the validated Level 1 (`the-gate.html`): a screen system (intro → game → reveal → problem → done), a `TUNING` constants block, authored `ROUNDS` + `MAP_DOTS` data, Pointer-Events drag, an SVG overlay for neighbor lines, and keyed/minimal DOM updates. No framework, no build step, no libraries beyond the Google Fonts already used by L1. Verification is **manual + headless browser** (this project has no automated test suite — see Global Constraints).

**Tech Stack:** Vanilla JavaScript (ES2020+), inline CSS, Pointer Events, SVG overlay, Google Fonts CDN (Fraunces + JetBrains Mono, matching L1). Local serving via `python3 -m http.server`.

## Global Constraints

Copied verbatim from the spec (`city-of-tokens/game-design-docs/the-map-room-embedding-spec.md`) and studio standards. **Every task implicitly includes these.**

- **No automated tests.** Verification is browser-based: zero console errors on load and through play; functional play-through; layout holds with **no horizontal overflow at 390×844 and 412×915**; `prefers-reduced-motion` respected. (coding-standards.md)
- **No score, no stars, no "accuracy" readout** anywhere. The verdict is always the reveal. (spec §3.7)
- **No cluster labels on the map** — the player reads individual word-dots to infer regions. (spec §3.2)
- **Stylized, hand-placed map — not real embeddings.** Coordinates are illustrative; **neighbor relationships must be defensible** (real synonyms / co-occurrence). (spec §3.6, §7)
- **Minimal pre-play text; play-first.** Reuse L1's orientation-screen → wordless-cue → play → reveal scaffolding and visual language. (spec §7, design-constraints.md)
- **Mobile-first:** viewport meta `width=device-width, initial-scale=1, viewport-fit=cover`; `100dvh` never `100vh`; `touch-action: none` on the drag surface; 44×44px min touch targets; safe-area insets on fixed elements. (technical-preferences.md)
- **Naming:** files kebab-case; vars camelCase; constants SCREAMING_SNAKE_CASE; functions verb-first; CSS classes kebab-case. (technical-preferences.md)
- **Forbidden:** `document.write()`, inline event handlers (`onclick=`), `var`, `100vh`, `setInterval` for visual updates. All gameplay values as named constants, no inline magic numbers. No `console.log` in committed code (use the `?debug` bar pattern from L1). (technical-preferences.md, coding-standards.md)
- **Commit messages:** Conventional Commits, reference the spec in the body.
- **No commits without explicit user instruction.** Each task's commit step is staged but only run when the user says so.

---

## File Structure

- `city-of-tokens/the-map-room.html` — **the entire level** (created; overwrites the old-gen file). One file, sectioned exactly like `the-gate.html`: `<style>` (reset → screens → intro → map → token-card → reveal → problem → done → reduced-motion → mobile), then `<script>` (`TUNING` → `ROUNDS`/`MAP_DOTS` → state → screen system → map render → drag input → snap+neighbors → reveal → round-4 polysemy → problem screen → wiring → boot).
- `city-of-tokens/index.html` — **modified** (Task 7): relabel Level 02 and unlock the card.

Reference file to port boilerplate from: `city-of-tokens/the-gate.html` (cited by line range per task).

---

## Verification Setup (used by every task)

- [ ] **Serve locally:** from repo root run `python3 -m http.server 8771` (background). Open `http://localhost:8771/city-of-tokens/the-map-room.html`.
- **Headless console check:** use the available headless browser (e.g. the gstack `browse` skill) to load the URL and report console errors; OR DevTools → Console manually. Expected: **zero errors, zero warnings** from our code.
- **Layout check:** DevTools device toolbar at **390×844** and **412×915** — confirm no horizontal scrollbar, nothing clipped, touch targets ≥44px.
- **Debug overlay:** append `?debug` to surface the debug bar (drop coordinates, resolved round) — same gate as L1.

---

## Task 1: Scaffold — file, screens, shared styles, data stubs

**Files:**
- Create: `city-of-tokens/the-map-room.html`
- Reference: `city-of-tokens/the-gate.html:1-48` (head + reset + screen system + intro styles), `:462-475` (reduced-motion + mobile), `:445-460` (debug bar), `:666-672` (showScreen), `:1087-1094` (escapeHtml), `:657-664` (debugLog).

**Interfaces:**
- Produces: `showScreen(id)`, `debugLog(msg)`, `escapeHtml(str)`, the screen DOM (`#intro`, `#game`, `#reveal`, `#problem`, `#done`), `TUNING`, `ROUNDS`, `MAP_DOTS`.

- [ ] **Step 1: Create the file skeleton.** Copy the `<head>` (meta, viewport, title "The Map Room — City of Tokens", the two Google Fonts links) and the `<style>` blocks for RESET, `.screen`/`.screen.active`, INTRO, buttons (`.intro-btn`), REDUCED MOTION, MOBILE `@media`, and DEBUG BAR **verbatim from `the-gate.html`** (cited lines). Body background `#1a1a1a`, accent gold `#FFC107`, font `Fraunces`/`JetBrains Mono` — identical palette to L1 for demo consistency.

- [ ] **Step 2: Add the screen DOM.** Five screens, `#intro` active by default:
  - `#intro`: eyebrow "City of Tokens", title "The Map Room", **two** orientation lines max (play-first, ≤2 sentences each), button `#begin-btn` "Enter the Map Room →". Draft copy: *"Every word that clears the Gate gets a place on a vast map of meaning."* / *"Drag each traveler to where you think it belongs — then see where it really lives."*
  - `#game`: a `.stage-wrap` containing `#token-card` (the draggable) and `#map` (the drop surface). Empty for now.
  - `#reveal`, `#problem`, `#done`: empty containers (filled in later tasks).

- [ ] **Step 3: Port the screen/util JS.** Inside `<script>'use strict';`: copy `showScreen(id)` (without the `hideSlashHint()` call — replace with a no-op `hideDragCue()` to be defined Task 3), `debugLog`, `escapeHtml`, and the `?debug` gate, verbatim-adapted from L1.

- [ ] **Step 4: Add data stubs.** Add `TUNING`, `ROUNDS`, `MAP_DOTS` as defined in Task 2/Task 4 (paste the real authored data from those tasks — do not leave empty). Add `loadRound(0)` boot + button wiring for `#begin-btn` → `showScreen('game')` (no inline handlers — `addEventListener`).

- [ ] **Step 5: Verify.** Serve + open. **Expected:** intro screen shows; clicking "Enter the Map Room" switches to the (empty) game screen; console clean; no horizontal overflow at 390/412. Confirm `prefers-reduced-motion` emulation disables transitions.

- [ ] **Step 6: Commit (only on user instruction).**
```bash
git add city-of-tokens/the-map-room.html
git commit -m "feat(map-room): scaffold Level 2 (screens + shared styles)

Mirrors the-gate.html structure. Per spec the-map-room-embedding-spec.md §7."
```

---

## Task 2: Render the map — clustered, unlabeled word-dots

**Files:**
- Modify: `city-of-tokens/the-map-room.html` (style: MAP block; script: `MAP_DOTS`, `renderMap()`).

**Interfaces:**
- Consumes: `escapeHtml` (Task 1).
- Produces: `MAP_DOTS` (array), `renderMap()`, `#map` populated with `.map-dot` elements carrying `data-word`, positioned by percentage.

- [ ] **Step 1: Author `MAP_DOTS`.** Coordinates are **percentages** of the map box (`x`,`y` in 0–100) so the layout scales on mobile. Clusters sit in distinct regions, **no labels rendered**. Defensible neighbor words per spec §7 — **flag for conceptual-accuracy sign-off before ship.**
```js
// Stylized layout (illustrative positions; word groupings are real co-occurrence sets).
// Every word here is a SINGLE o200k token (verified 2026-06-18 via tiktoken) — required
// so each dot is an honest embedding point. FLAG: groupings still need conceptual-accuracy
// sign-off (spec §7), but token-singularity is already verified (spec §4.1).
const MAP_DOTS = [
  // Emotions cluster (top-left)
  { word: 'joy',     x: 16, y: 18, cluster: 'emotion' },
  { word: 'sad',     x: 24, y: 27, cluster: 'emotion' },
  { word: 'anger',   x: 12, y: 30, cluster: 'emotion' },
  { word: 'fear',    x: 22, y: 14, cluster: 'emotion' },
  { word: 'love',    x: 30, y: 22, cluster: 'emotion' },  // was 'calm' (multi-token)
  // Language/Tech boundary (center)
  { word: 'word',    x: 46, y: 44, cluster: 'language' },
  { word: 'text',    x: 52, y: 38, cluster: 'language' },
  { word: 'sentence',x: 44, y: 52, cluster: 'language' },
  { word: 'code',    x: 60, y: 46, cluster: 'tech' },
  { word: 'data',    x: 66, y: 40, cluster: 'tech' },
  { word: 'model',   x: 64, y: 54, cluster: 'tech' },
  // Nature cluster (bottom-left)
  { word: 'river',   x: 20, y: 76, cluster: 'nature' },
  { word: 'rain',    x: 28, y: 82, cluster: 'nature' },   // was 'flood' (multi-token)
  { word: 'stream',  x: 14, y: 84, cluster: 'nature' },
  { word: 'shore',   x: 26, y: 70, cluster: 'nature' },
  // Finance cluster (bottom-right)
  { word: 'deposit', x: 74, y: 74, cluster: 'finance' },
  { word: 'money',   x: 82, y: 80, cluster: 'finance' },  // was 'savings' (multi-token)
  { word: 'invest',  x: 70, y: 82, cluster: 'finance' },
  { word: 'account', x: 84, y: 68, cluster: 'finance' },
  // Fragment/prefix region (top-right) — where split-off pieces like 'un' land,
  // away from any meaning cluster (used by Round 3). Single tokens, verified.
  { word: 'un',      x: 72, y: 18, cluster: 'fragment' },
  { word: 're',      x: 80, y: 24, cluster: 'fragment' },
  { word: 'pre',     x: 74, y: 30, cluster: 'fragment' },
  { word: 'ing',     x: 84, y: 16, cluster: 'fragment' },
];
```

- [ ] **Step 2: Add the MAP styles.** `#map` is `position: relative`, square-ish (`aspect-ratio: 1` or fixed `max-width`/`height` that holds at 390w), bordered, subtle grid/parchment background, `touch-action: none`, `user-select: none`. `.map-dot` is `position: absolute; transform: translate(-50%,-50%)`, a small dot + the word in `JetBrains Mono` ~11px, muted color `#9a9a9a`. Clusters are **not** color-coded yet (color is reserved for the Round-4 reveal). Ensure dots never push horizontal overflow (`overflow: hidden` on `#map`).

- [ ] **Step 3: Implement `renderMap()`.** Clear `#map`, then for each `MAP_DOTS` entry create a `.map-dot` at `left:{x}% top:{y}%` with `data-word`. Call it from `loadRound`.

- [ ] **Step 4: Verify.** Open game screen. **Expected:** map shows ~19 word-dots in four visually distinct regions, no labels; reads at a glance as "groups of related words"; no overflow at 390/412; console clean.

- [ ] **Step 5: Commit (only on user instruction).**
```bash
git add city-of-tokens/the-map-room.html
git commit -m "feat(map-room): render stylized unlabeled word-dot map

Positions illustrative, word groupings real. Per spec §3.2/§3.6."
```

---

## Task 3: The token card + drag-to-place interaction

**Files:**
- Modify: `city-of-tokens/the-map-room.html` (style: token-card + drag-cue; script: drag input, `ROUNDS` word display).

**Interfaces:**
- Consumes: `#map`, `MAP_DOTS`, `loadRound` (Task 1/2).
- Produces: `initDrag()`, `hideDragCue()`, `maybeShowDragCue()`, and a drop callback `onTokenDropped(dropXpct, dropYpct)` (stub that logs in this task; Task 4 fills it). `currentRound` state.

- [ ] **Step 1: Add token-card + drag-cue styles.** `#token-card`: a chip showing the current word (large `JetBrains Mono`, gold border), `cursor: grab`, `touch-action: none`, min 44×44px. `.dragging` state: `cursor: grabbing`, slight scale, raised z-index. A **wordless drag cue** (`#drag-cue`): a faint animated ghost/arrow from the card toward the map, shown until the player's first successful drop (mirrors L1's `#slash-hint` retire-after-first-use logic). Respect reduced-motion.

- [ ] **Step 2: Render the current word on the card.** In `loadRound`, set `#token-card` text to `ROUNDS[idx].word` (ROUNDS authored in Task 4 — for this task a minimal `ROUNDS=[{word:'happy'},...]` placeholder list of the four words is acceptable *only within this task*; Task 4 replaces it with full data, so do not commit a placeholder beyond word strings).

- [ ] **Step 3: Implement Pointer-Events drag.** Port L1's single-pointer pattern (`the-gate.html:824-890`): on `pointerdown` on `#token-card`, `setPointerCapture`, mark `.dragging`, record offset; on `pointermove`, position the card under the pointer (fixed/absolute follow); on `pointerup`, compute the drop point **as a percentage of `#map`'s bounding rect** and call `onTokenDropped(xPct, yPct)`. A drop **anywhere** is valid (no bounds rejection — clamp to 0–100). Ignore secondary pointers. `pointercancel` resets the card to start.
```js
function getMapPct(clientX, clientY) {
  const r = document.getElementById('map').getBoundingClientRect();
  const x = ((clientX - r.left) / r.width) * 100;
  const y = ((clientY - r.top) / r.height) * 100;
  return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
}
```

- [ ] **Step 4: Wire the drag cue.** Show `maybeShowDragCue()` after the card renders; `hideDragCue()` + retire it on the first successful drop (`hasEverDropped` flag). `showScreen` calls `hideDragCue()`.

- [ ] **Step 5: Verify (desktop pointer path).** Drag the card onto the map; on release `?debug` shows the drop percentage; card follows the pointer smoothly; cue retires after first drop; no page scroll while dragging; console clean; layout holds at 390/412. (Touch is exercised by the same Pointer-Events code path; spot-check on a real device is in Task 7.)

- [ ] **Step 6: Commit (only on user instruction).**
```bash
git add city-of-tokens/the-map-room.html
git commit -m "feat(map-room): drag-to-place token via Pointer Events + wordless cue

Single-pointer model ported from the-gate.html. Per spec §3.3."
```

---

## Task 4: Snap-to-true + neighbor lines + reveal panel (Rounds 1–3)

**Files:**
- Modify: `city-of-tokens/the-map-room.html` (style: snap/neighbor/reveal; script: full `ROUNDS`, `onTokenDropped`, `snapToTrue`, `drawNeighbors`, `showReveal`).

**Interfaces:**
- Consumes: `getMapPct`, `MAP_DOTS`, `showScreen`, `onTokenDropped` stub (Task 3).
- Produces: full `ROUNDS` data, `snapToTrue(round)`, `drawNeighbors(round)`, `showReveal(round)`, `nextRound()`.

- [ ] **Step 1: Author full `ROUNDS` (Rounds 1–3 here; Round 4 in Task 5).** `truePosition` in map %; `neighbors` reference real `MAP_DOTS` words; `insight` copy is plain-English, jargon-last.
```js
const ROUNDS = [
  { word: 'happy',  truePosition: { x: 20, y: 22 },
    neighbors: ['joy', 'love', 'fear', 'sad'],
    whatHappened: 'happy landed deep inside one tight group.',
    takeaway: 'Words used in similar ways end up near each other — meaning becomes a place.' },
  { word: 'token',  truePosition: { x: 55, y: 45 },
    neighbors: ['word', 'text', 'code', 'data'],
    whatHappened: 'token landed on the border between everyday-language words and computer words.',
    takeaway: 'A word\'s place reflects every way it gets used, not just its most obvious meaning.' },
  // Round 3 — the two tokens L1 split `unhappy` into arrive as SEPARATE travelers.
  // happy stays where Round 1 left it (pairReference); the player places `un`.
  { word: 'un', truePosition: { x: 72, y: 18 }, isPair: true,
    pairReference: { word: 'happy', x: 20, y: 22 },
    connectorTo: { x: 20, y: 22 },           // draw the offset line un <-> happy
    neighbors: ['re', 'pre', 'ing'],
    whatHappened: 'un landed far from happy — over with the bare word-fragments, near no meaning.',
    takeaway: 'At the Gate, unhappy was cut into un + happy. Here they arrive as two separate travelers in two unrelated places — nothing has joined their meaning back yet.' },
  // Round 4 (bank) appended in Task 5.
];
```

- [ ] **Step 2: Add snap + neighbor + reveal styles.** `.placed-token` (the snapped word, gold, pulsing once on arrival). An SVG overlay (`#map-svg`, absolutely positioned over `#map`, `pointer-events:none`) for neighbor lines. `.reveal` panel: reuse L1's `.rx-row`/`.rx-tag`/`.rx-text`/`.rx-sowhat` "What happened / So what?" components (`the-gate.html:356-407`) and `.next-btn`. **Round 3 (pair):** render the `pairReference` ("happy") as an already-placed `.placed-token.reference` at its Round-1 position, and a distinct `.connector` SVG line (dashed) from the placed `un` to `connectorTo` — the visible offset between the two split tokens.

- [ ] **Step 3: Implement `onTokenDropped`.** Add a `.placed-token` at the drop %; call `snapToTrue(round)` which animates `left/top` from drop% to `round.truePosition` (CSS transition; instant under reduced-motion) with a one-shot pulse; on transition end, `drawNeighbors(round)`.

- [ ] **Step 4: Implement `drawNeighbors`.** For each word in `round.neighbors`, find its `MAP_DOTS` position and draw an SVG line from `truePosition` to it; light up those dots. **If `round.isPair`:** also place the `pairReference` token and draw the dashed `.connector` to `connectorTo` (the offset). Then reveal a "see why" affordance / auto-advance to `showReveal` after a short beat (tunable).

- [ ] **Step 5: Implement `showReveal` + `nextRound`.** `showReveal(round)` fills `#reveal` (word + neighbor list + What/So-what rows) and shows it; `next-btn` → `nextRound()` (load next round on `#game`, or `showScreen('done')` after the last). Port the L1 pattern (`the-gate.html:1042-1085`), minus the player-vs-model split (not applicable here).

- [ ] **Step 6: Verify (Rounds 1–3).** Play happy → token → un. **Expected:** each snaps from the drop point to its true spot, neighbor lines draw to the right dots, reveal copy shows; **Round 3** shows "happy" already placed (reference) and draws the dashed connector from "un" to it — reading as "one word, now two separate points"; no score anywhere; console clean; 390/412 hold; reduced-motion makes snaps instant.

- [ ] **Step 7: Commit (only on user instruction).**
```bash
git add city-of-tokens/the-map-room.html
git commit -m "feat(map-room): snap-to-true + neighbor reveal for rounds 1-3

Guess-then-reveal models learned embeddings. Per spec §3.2/§4."
```

---

## Task 5: Round 4 — "bank" polysemy reveal (two halos)

**Files:**
- Modify: `city-of-tokens/the-map-room.html` (style: dual halos + two-color chips; script: append Round 4, polysemy branch).

**Interfaces:**
- Consumes: `onTokenDropped`, `snapToTrue`, `drawNeighbors`, `showReveal` (Task 4).
- Produces: Round-4 data + `revealPolysemy(round)`; `round.isPolysemy` branch.

- [ ] **Step 1: Append Round 4 to `ROUNDS`.** "bank" lands **between** Nature and Finance.
```js
{ word: 'bank', truePosition: { x: 50, y: 76 }, isPolysemy: true,
  clusters: [
    { name: 'nature',  color: '#3fb6a8', neighbors: ['river', 'rain', 'stream', 'shore'] },
    { name: 'finance', color: '#d8a93f', neighbors: ['deposit', 'money', 'invest', 'account'] },
  ],
  sentences: ['The bank was completely flooded.', 'The bank was suddenly closed.'],
  whatHappened: 'bank landed stranded between the water words and the money words — fully in neither.',
  takeaway: 'A word that means two things still gets just one place on the map. It can\'t be in both.' }
```
(`truePosition` is the midpoint between the two clusters from Task 2 — visibly outside both.)

- [ ] **Step 2: Add dual-halo + two-color styles.** Two expanding halos (`.halo`, one per cluster color) centered on the placed token; neighbor chips colored by cluster. Halos are **spatial reinforcement**, never the sole cue; **no flashing**; instant under reduced-motion.

- [ ] **Step 3: Branch the drop handler.** When `round.isPolysemy`, after snap call `revealPolysemy(round)` instead of the single-cluster `drawNeighbors`: draw neighbor lines to **both** clusters in their colors, expand both halos, then advance to the problem screen (Task 6) rather than the standard reveal.

- [ ] **Step 4: Verify.** Play through to Round 4. **Expected:** "bank" snaps to a point clearly between the two bottom clusters; two colored halos expand; neighbor lines/chips appear in both colors; reads as "stuck in the middle, neither"; console clean; 390/412 hold.

- [ ] **Step 5: Commit (only on user instruction).**
```bash
git add city-of-tokens/the-map-room.html
git commit -m "feat(map-room): round 4 'bank' polysemy reveal (dual halos)

The level's aha: one word, one stranded point. Per spec §3.4."
```

---

## Task 6: Two-sentence problem screen + done screen

**Files:**
- Modify: `city-of-tokens/the-map-room.html` (style: problem screen; script: `showProblem`, gated callout; done copy).

**Interfaces:**
- Consumes: Round-4 `sentences`, `showScreen` (Task 1/5).
- Produces: `showProblem(round)`, gated `revealSameEmbedding()`, done-screen content.

- [ ] **Step 1: Build the problem screen DOM/styles.** `#problem` shows the two `round.sentences`, each with a **"look up *bank*"** button (≥44px). Looking up either reveals the **same coordinates + same neighbors** (a compact readout). A callout (`#same-callout`, hidden) reads: *"Two sentences, opposite meanings — the exact same point."* Plus a `Continue →` button to the done screen.

- [ ] **Step 2: Implement the gated callout.** Track `lookedUp = {0:false, 1:false}`. Each button sets its flag and shows that sentence's readout. **Only when both are true** reveal `#same-callout`. (Per spec §3.5 — the player makes the connection.) `Continue →` → `showScreen('done')`.

- [ ] **Step 3: Build the done screen.** Reuse L1's `#done` styles (`the-gate.html:409-443`). Jargon-last close: name the concept **embedding** only here, ≤2 sentences, and set up the next level without spoiling. Draft: *"What you just did is called **embedding** — every word becomes one fixed point on a map of meaning."* / *"But 'bank' proved one point can't hold two meanings. Fixing that is what the rest of the city is for."* `Play again` button → `loadRound(0)` + `showScreen('game')`.

- [ ] **Step 4: Verify (full play-through).** happy → token → unhappy → bank → problem screen → done. **Expected:** callout appears only after **both** look-ups return identical results; done names "embedding" once and teases next level; console clean; 390/412 hold; reduced-motion fine.

- [ ] **Step 5: Commit (only on user instruction).**
```bash
git add city-of-tokens/the-map-room.html
git commit -m "feat(map-room): gated two-sentence problem screen + done

Player sees identical embeddings for opposite meanings. Per spec §3.5."
```

---

## Task 7: Unlock in index.html + final verification pass

**Files:**
- Modify: `city-of-tokens/index.html` (Level 02 card label + link).

**Interfaces:**
- Consumes: finished `the-map-room.html`.

- [ ] **Step 1: Relabel + unlock the Level 02 card.** In `index.html`, change `card-eyebrow` "Level 02 · Positional Encoding" → **"Level 02 · Embedding"**; replace the `Coming Soon` div with a `Play →` link to `/city-of-tokens/the-map-room.html`, matching the Level 01 card's markup. Update the "Level 1 is open…" section label to reflect two open levels. (Do **not** rewrite Levels 03–08 labels here — the broader doc reconciliation is a separate follow-up, see spec Appendix.)

- [ ] **Step 2: Verify index.** Open `index.html`: Level 02 reads "Embedding" with a working Play link to the Map Room; Level 01 still works; no overflow at 390/412; console clean.

- [ ] **Step 3: Full regression pass on the Map Room.** Headless + manual: zero console errors across all five screens; full play-through twice (incl. Reset/Play-again); 390×844 and 412×915 no overflow / no clipping; `prefers-reduced-motion` makes all motion instant; `?debug` works. Spot-check the drag on a **real mobile device** if available (touch, no scroll-steal, safe-area) — the one thing not headless-verifiable.

- [ ] **Step 4: Run `/verify-ship`** for city-of-tokens (the studio pre-push gate) and confirm the Map Room passes (especially the 390w overflow check that the old levels failed).

- [ ] **Step 5: Commit (only on user instruction).**
```bash
git add city-of-tokens/index.html
git commit -m "feat(city-of-tokens): unlock Level 2 (The Map Room / Embedding)

Relabels Level 02 from Positional Encoding to Embedding (correct order).
Per spec the-map-room-embedding-spec.md §9."
```

---

## Self-Review (completed by plan author)

**Spec coverage:** §1 overview → Tasks 1–6; §2 fantasy/aha → Tasks 4–6 copy; §3.1–3.2 core loop + no labels → Tasks 2,4; §3.3 drag → Task 3; §3.4 polysemy halos → Task 5; §3.5 problem screen → Task 6; §3.6 stylized map/keyed render → Tasks 2,4; §3.7 no score → Global Constraints (enforced every task); §4 four rounds → Tasks 4,5 (continuity note carried as a flag in Task 4 data + spec §4); §5 no-score formula → data shape Tasks 4,5; §6 edge cases (drop-out-of-bounds clamp, single-lookup gating, reduced-motion) → Tasks 3,6, Global; §7 dependencies (L1 scaffolding reuse, accuracy sign-off) → cited in Tasks 1,2,4; §8 tuning knobs → `TUNING` + per-task feel values; §9 acceptance (no overflow, no score, index relabel) → Task 7. **No gaps.**

**Placeholder scan:** Real authored data provided for `MAP_DOTS` and `ROUNDS`; the only deferred item is **conceptual-accuracy sign-off** on the word/neighbor data (a required human/agent review per spec §7, explicitly flagged in Task 2 Step 1) and the deferred non-drag accessibility path (spec §6) — both intentional, not plan placeholders.

**Type consistency:** `truePosition {x,y}`, `neighbors [string]`, `cluster`/`clusters[].neighbors`, `getMapPct→{x,y}`, `MAP_DOTS[].word/x/y/cluster`, `onTokenDropped(xPct,yPct)` used consistently across Tasks 2–6.

## Open items flagged for the user
- **Token-singularity: RESOLVED + verified** (2026-06-18, o200k via tiktoken). Every word that travels or sits as a map dot is a single token. Round 3 reworked to `un` + `happy` (the two tokens L1 splits `unhappy` into) — fixes the L1 contradiction and *restores* continuity. Map dots `calm/flood/savings` → `love/rain/money`.
- **Remaining accuracy sign-off** is now only about *groupings/positions* being defensible (which words cluster, the modest framing of Round 3's offset) — not singularity. Could be the quick single-agent game-designer pass you deferred, run against the data only.
- **Doc label reconciliation** (Levels 03–08 "Positional Encoding"/order) — separate follow-up (spec Appendix).
