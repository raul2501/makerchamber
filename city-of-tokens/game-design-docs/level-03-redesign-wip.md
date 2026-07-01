# Level 3 (The Census Bureau) — Redesign WIP

**Status (updated 2026-07-01): DIRECTION CHANGED.** The "infuse position" mechanic
below was prototyped and **rejected on playtest**. Current direction is the user's
**arcade / position-tagging mechanic** (see "CURRENT DIRECTION" block). The infuse
material below is kept as record, not the plan.

> **Resume here:** the arcade mechanic is the user's to author (per CLAUDE.md
> "AI's Role in Creative Work" — AI does not originate mechanics). AI role = critique
> the user's evolved version against `design/design-constraints.md` + `design/pillars.md`.

---

## CURRENT DIRECTION (2026-07-01) — arcade / position-tagging mechanic

**User's mechanic:** a sentence's words move together up the screen toward "the model"
(the top edge). Before they cross into the model, the player tags each word with its
position number. The user owns this design and will evolve it.

**Why the infuse mechanic was dropped (playtest verdict, user):**
1. The identical→different verdict wasn't self-evident — required reading the copy.
2. The "stamp" act was agency-less: position is predetermined by word order, so
   triggering it is busywork. (Deeper point: no mechanic that has the player *assign*
   position has real agency, because position isn't a choice — engagement must come
   from elsewhere, e.g. the kinetic/stakeful act, which is why the arcade route pulls.)
3. The payoff screen was still text-dependent.

**Open concerns to solve within the arcade frame** (raised earlier; the user will
address — recorded here as constraints, not as an AI-authored solution):
- Position-as-tag reads as a *removable sticker* → must feel *baked into* the word
  (consistency with L5, which teaches addition preserves/never erases).
- One-at-a-time under a clock teaches *sequential* processing → contradicts takeaway #1
  (the model reads all words at once).
- "Tag all in time = win" skips the problem, so there's no discovery / aha.
- A clock/fail-state makes *Challenge* the dominant aesthetic; the stack is
  Discovery-primary (challenge belongs in post-level checkpoints per project rule).

The 3 concept takeaways (below) are unchanged; only the mechanic changed.
The 4-agent panel notes (CD / systems / UX / browser) below still apply as *concept
+ accuracy + accessibility + feasibility constraints*, even though their mechanic
assumption (infuse) is superseded.

---

## SUPERSEDED — infuse-position mechanic (record only, not the plan)

## Why we're redesigning

The shipped L3 (`the-census-bureau.html`, a Jun-12 v1 build) failed the L1/L2 bar
on a play-assess pass (2026-06-29):
- Too text-heavy (walls of prose; violates 3-Second Patience).
- Round 1 was a **confirm** mechanic — player is *told* "dog bites man" and just
  sorts to the stated answer. No discovery.
- Round 3 was a pure non-interactive **lecture** that also smuggled in a second
  concept (parallel processing).
- Also: R1 drag is **mouse-only** (broken on mobile touch); `100vh` (forbidden);
  missing `viewport-fit=cover`; 19px overflow at 390w; index card still mislabeled
  "Attention Scores." These are shared/polish bugs, not the redesign driver.

R2 (the "only" / same-word-different-position divergence) was the one sound beat —
keepable raw material.

User verdict: **heavy redesign** (not polish).

## The bar this must clear

Near-wordless, play-first, **one embodied gesture, one clear aha** — like L1's slash
and L2's drag-onto-the-map. Text only *confirms* what the player already felt.
Scoring is a per-level call (not mandatory; L1 has none, L2 has a light instinct read).
Gate: `design/design-constraints.md`. Pillars: `design/pillars.md`
(Discovery primary, Challenge secondary, Fantasy supporting).

## The concept — causal spine (confirmed with user)

**The transformer processes all tokens in parallel (the only thing that scales) →
processing them all at once erases word order ("dog bites man" = "man bites dog"
become the same unordered bag) → so each token must carry its position baked INTO
its own identity (added to its vector, not a removable tag) before processing.**

The deeper "why parallel": old models (RNNs) read one word at a time — order was
free but slow and unscalable on parallel hardware. Transformers read everything at
once for speed; the price is losing order; positional encoding buys it back cheaply.
("Old way vs new way" is a strong motivating hook to keep in pocket.)

### The three things L3 must hand to L4 (The Town Square / attention), in priority
1. The model processes everyone **simultaneously** (parallel) — L4's whole premise.
2. That simultaneity **erases word order**.
3. So each token carries its **position mixed into who it is**, before the square.

The "same word, different slot → different thing" idea is the *demonstration* of #3,
not a fourth requirement.

## The chosen mechanic — "infuse position" (slot-and-absorb)

Tokens arrive from L2 as **colored chips** (color = meaning/embedding identity).

- **Beat 1 — discover by play (no text):** one chip (e.g. `bank`) + three numbered
  slots. Drop it in slot 1 → the slot adds a **position skin** to the chip. Drop in
  slot 3 → a different skin. Same word, different slot, visibly different thing.
  Player just notices "where I put it changes what it becomes."
- **Beat 2 — the problem, felt:** two rows, `dog bites man` and `man bites dog`
  (same three meaning-colors, reordered). A **READ** button fires all chips
  *simultaneously* into a funnel; they settle as an unordered **bag**. The two bags
  are **identical** → model can't tell the sentences apart. Felt problem: read
  all-at-once → order gone.
- **Beat 3 — apply the act:** player runs each sentence's chips through the numbered
  slots; each absorbs its position skin. **READ** again → chips fly in simultaneously
  but now carry their skins → the two bags are now **visibly different** → model
  distinguishes them. Resolved, earned, visual.
- **Beat 4 — name + bridge:** "You just did positional encoding." → why (read-all-at-
  once for speed loses order; you put it back by giving each word its position) →
  bridge to L4 ("now every word knows what it means AND where it stood; next they
  finally talk to each other"). **Must name ONLY "positional encoding," never
  "parallel"** (that's L4's term).

## Creative-director critique (2026-06-29) — verdict: PROCEED WITH CHANGES

1. **REQUIRED FIX — color-mix breaks cross-level consistency with L5.** Positional
   encoding is vector addition (`embedding + position`) — the *same operation* as the
   **residual connection** in **L5 (The Thread)**, whose whole job is to teach that
   addition **preserves** everything ("never a replacement… nothing is ever truly
   erased"; player toggles layers to see all prior states in the sum). Embedding +
   position is the first write to that residual stream. A color-mix (`green+blue=teal`,
   can't un-mix) teaches the **opposite** story (irreversible fusion, originals gone) —
   a mental model L5 would have to demolish. Fails Pillar 1 & 2.
   - **Fix (keeps the gesture, changes only the encoding):** meaning color stays
     **constant**; the slot adds a **position skin** (ring / band / texture) that
     **travels with the chip**. → position added into identity (not a tag) ✓, meaning
     preserved & L5-consistent ✓, position visibly distinct so the two bags still
     differ ✓. **Drop the "can't un-mix" beat.** (Also more accurate: PE doesn't change
     a word's meaning.)
2. **One Thing at a Time — passes IF** parallelism stays *purely felt* and is **never
   named** at L3. Beat 4 copy must name only PE. (else No Jargon Tax + One Thing fail)
3. **Ordering (Beat 1→2→3) — OK but a close call; let the build decide.** Keep
   play-first only if Beat 1 is an intrinsically curious toy. Playtest: if the player
   asks "why am I dropping this in a slot?", flip to **problem-first** (2→1→3).
4. **Gesture is right** — no stronger one exists; the improvement is the *encoding*,
   not the gesture. Reuse L2's already-fixed touch-drag handler (don't write a fresh
   one — that's the source of the old L3 mobile bug).

**CD design test for success:** *A player who finishes L3 and later reaches L5 sees
position-addition and residual-addition as the **same move** (layering that preserves
the original, nothing erased), and can explain why reading every word at once forces
each word to carry its own position — without using the words "parallel" or "encoding."*

## OPEN DECISION (user returning to this)

**Encoding visual: position-skin (CD-recommended, L5-safe) vs keep color-mix vs a
different "infuse" visual the user has in mind.** Everything above assumes
**position-skin**. Resolve this first next session.

## Rejected / superseded
- Old 3-round build (confirm R1, lecture R3) — replaced wholesale.
- Three whole-loop framings pitched & rejected by user: "two bags," "build-it-model-
  loses-it," and the first "read all at once" pitch. The infuse mechanic emerged after.
- Color-mix encoding — at risk per CD (L5 contradiction); pending user's final call.

## Next steps (brainstorming flow)
1. User resolves the OPEN DECISION (encoding visual).
2. Present full design in sections, approve per section.
3. Write spec to `docs/superpowers/specs/` (or `game-design-docs/`), commit.
4. **Multi-agent review before finalizing** — add `game-designer` + `writer` to the
   `creative-director` pass already done ([[feedback-multi-agent-review]]).
5. Transition to writing-plans for the implementation plan.

## Verification artifacts from the assess pass
- Headless playthrough confirmed console-clean across all 4 screens; 19px overflow at
  390w; R1 drag mouse-only by code inspection. Screenshots in scratchpad (session-local).
