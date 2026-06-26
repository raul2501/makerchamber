# Makerchamber

MakerChamber is the infrastructure to run a creative and game-generation studio aimed at building learning games.

Each game teaches a concept through interactive play — the mechanic *is* the idea, so
players build intuition by doing, not by reading. Every game is both a product and
research data for a generalized learning-game engine we grow over time.

## Projects in development

- **City of Tokens** (`city-of-tokens/`) — the flagship. An 8-level game teaching how a
  transformer (the architecture behind modern LLMs) works, through the world of "The City
  of Tokens." Levels 1 (The Gate — tokenization) and 2 (The Map Room — embeddings) are
  playable; the remaining levels are in progress.
- **loopworm** (`loopworm/`) — experimental. Tests whether makerchamber's "teach through a
  mechanic" approach also works for real business contexts, not just abstract concepts.

## How it's built

- **Vanilla HTML, CSS, and JavaScript.** No framework, no bundler, no build step. Each
  level is a single self-contained HTML file with inline CSS and JS.
- **Persistence:** `localStorage`, per game.
- **Hosting:** Vercel, auto-deploying on every push to `main`.

The simplicity is deliberate: a level should open in a browser with zero tooling.

## Run it locally

From the repo root:

```bash
python3 -m http.server 8771
```

Then open:

- City of Tokens: <http://localhost:8771/city-of-tokens/>
- A specific level (e.g. The Map Room): <http://localhost:8771/city-of-tokens/the-map-room.html>

## Design approach

Games are designed with MDA (Mechanics → Dynamics → Aesthetics), working backwards from the
target "aha" moment. Two docs govern every player-facing change:

- `design/pillars.md` — the generative principles (what to build).
- `design/design-constraints.md` — the hard pass/fail gate (what to reject).

## Repository layout

- `city-of-tokens/` — the flagship game (one HTML file per level).
- `loopworm/` — experimental business-context artifact.
- `design/` — studio design pillars and constraints.
- `.claude/` — agent definitions, docs, and standards for AI-assisted development.
- `production/` — active session state.

See `.claude/docs/directory-structure.md` for the full map.

## Working in this repo

Development follows a strict collaboration protocol — Question → Options → Decision → Draft
→ Approval — and the coding standards in `.claude/docs/`. Verify every change in the browser
before pushing; Vercel deploys `main` straight to production.
