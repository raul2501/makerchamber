# Studio Infra Ideas

A running document for ideas to improve the studio's infrastructure — agents,
skills, process, and tooling. Add a dated entry per session that surfaces
something worth changing. These are proposals to refine, not decisions.

---

## 2026-06-15 — Session: The Gate slash prototype

**Context:** We reimagined Level 1's core mechanic. The flow was: clarify the
concept's fundamentals + aha → brainstorm 22 mechanics → narrow against
`design-constraints.md` → get parallel direction from creative-director, ux-designer,
ui-programmer → build a prototype → iterate on feel. Output: a validated
slash-to-tokenize mechanic and a spec.

### Q1 — Agent roster changes

**Candidate new agents**

1. **Concept-accuracy reviewer (domain expert)** — *strongest candidate.*
   Owns Pillars 1 & 2: does the mechanic *and the data* teach the real concept
   correctly? Today, three accuracy calls were made ad hoc by the user + main
   thread: (a) correcting "minimize tokens is the goal" → tokenization is
   deterministic, not a search; (b) the BPE/frequency framing; (c) flagging that
   the prototype's `vocab`/`correct` values are hand-authored and may not match a
   real tokenizer. For a studio teaching *many* domains, conceptual fidelity needs
   a dedicated gate, not an ad hoc catch. *Tradeoff:* overlaps with game-designer/
   creative-director — scope it narrowly to factual/conceptual correctness (not
   fun or feel) to avoid muddying ownership.

2. **Learning-experience / pedagogy designer** — owns *how* a concept is taught
   through play: aha-moment design, scaffolding, 80/20 concept distillation,
   information timing. Today this was split across creative-director +
   game-designer + ux-designer. The studio's identity *is* teaching-through-play,
   so pedagogy is arguably a first-class discipline. *Tradeoff:* heavy overlap with
   game-designer — could instead be a **modification** to game-designer's remit
   rather than a new agent. Decide based on whether we want a distinct owner.

**Candidate modifications to existing agents**

1. **All consulting agents: "read current decisions first."** The ux-designer
   reintroduced the scoring/optimization framing we'd deliberately removed, because
   its brief didn't include that pivot. Add to the collaboration protocol: *before
   proposing, read the latest spec / decision log for the feature, and surface
   conflicts with a recent decision rather than silently reverting them.*
2. **prototyper: output handoff.** It builds in an isolated git worktree, so the
   `prototype.html` had to be manually copied into the main tree before it could be
   served/reviewed. Document the extraction step, or adjust how prototype outputs
   are surfaced.
3. **creative-director / game-designer: encode the "teaching-gain" filter.** The CD's
   most valuable move was reframing the mechanic narrowing by *teaching gain*
   ("does this make a dynamic felt so we can delete explanatory text?") rather than
   mere constraint-survival, and splitting concepts into "Family A reskins" vs
   "Family B new-dynamic." Worth encoding as a standard evaluation lens.

### Q2 — Skills to build

Extrapolated from the process we ran (the user's seed: (a) step back to assess
what to convey, (b) the core mechanic that conveys it, (c) minimize copy / use
visual elements instead):

1. **`/concept-distill`** (seed *a*) — given a topic, produce the 3-4 fundamentals
   that explain ~80-90% of it, name the single aha moment, and flag where
   conceptual accuracy is load-bearing. Reusable for every level and game.
2. **`/mechanic-brainstorm`** (seed *b*) — generate mechanic concepts, then rank by
   **teaching gain** against `design-constraints.md` (the discriminator: does the
   mechanic make a dynamic *felt* so text can shrink?), using the Family A (reskin)
   vs Family B (new-dynamic) split.
3. **`/text-to-visual`** (seed *c*, upcoming next session) — audit player-facing
   copy; classify each piece **essential-now / useful-later / removable** across
   *before / during / after* play; propose visual components (diagrams,
   infographics) to replace prose; run against design-constraints. The UX audit
   from this session is a working template.
4. **`/concept-to-prototype`** (the meta-skill) — orchestrates the full pipeline we
   ran: distill concept → brainstorm mechanics → constraint-filter narrow →
   parallel direction (CD/UX/UI) → prototype → feel-test loop. This is the studio's
   core repeatable production process; codifying it is the highest-leverage skill.
5. **`/constraints-gate`** — run a player-facing change against
   `design-constraints.md` as a pass/fail review. The doc is already built as an
   evaluative gate; a skill operationalizes it (e.g. invoke before committing any
   player-facing change).
6. **`/feel-test`** — spin up a local server, output desktop + mobile (local-IP)
   URLs, list the specific "feel for" questions, and structure the iteration loop.
   We did this ad hoc each round.

### Process frictions observed (where real fixes hide)

1. **Cross-branch artifact invisibility** — a dispatched agent (creative-director)
   couldn't read the brainstorm doc because it lived on a feature branch while the
   agent ran on `main`. *Fix:* keep shared design artifacts on `main`, or have the
   orchestrator hand needed files to agents.
2. **Decision-context propagation gap** — the ux-designer reverted a settled
   decision (no scoring) it wasn't briefed on. *Fix:* a lightweight per-feature
   **decision log** (or a "Decisions" section in the spec/GDD) that every agent
   reads first.
3. **Prototype output extraction** — worktree isolation required a manual copy of
   the prototype into the main tree before review (see prototyper modification).
4. **Agent brief drift** — sub-agents act on their original task, not the *current*
   state; the orchestrator must explicitly pass recent pivots.

### What worked — preserve these

- **Parallel multi-agent direction → single synthesis.** Running CD/UX/UI
  concurrently on non-overlapping slices, then synthesizing, was fast and high-signal.
- **Constraint-filtered narrowing.** `design-constraints.md` paid off immediately
  as a sharp filter the first time it was used.
- **Prototype before spec.** Validating feel first caught real bugs and the
  substrate question (DOM vs canvas) before we invested in a full spec.
- **The feel-test iteration loop.** Fast cycles against a live local server.
- **Conceptual rigor up front.** Stepping back to the 80/20 fundamentals + the aha
  before designing mechanics (Pillar 4 — design backwards from the aha).
- **Diagnosing root cause before switching tools.** Holding the vanilla stack
  (no Flutter) by proving the jank was an implementation bug, not a platform limit.
