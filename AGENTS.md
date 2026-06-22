# Game Generator Branch Context

This branch contains Concept Forge, the learning-game generator prototype.
It explores how to generate playable learning games while keeping concept
correctness inside trusted, deterministic code.

## Start Here

- `generator/ARCHITECTURE.md` — system boundaries and pipeline
- `generator/TODO.md` — known issues and next work
- `_devserver.cjs` — local static/API dev server
- `api/generate-shell.js` — GPT-5.5 shell-generation API
- `generator/app.js` — generator flow and launch path
- `generator/sandbox.js` — generated-shell validation and iframe sandbox
- `generator/sdk/slash.js` — trusted Slash mechanic
- `experiments/three-token-courier.html` — first Three.js world-loop experiment

## Current Design Lesson

Prompt-generated shell decoration was not enough. It made the wrapper richer,
but the play experience still felt like the same Slash game.

The more promising direction is a world loop: a playable scene where the
trusted mechanic is embedded inside a world interaction and creates visible
world consequences.

## Local Run

Create `.env.local` with `OPENAI_API_KEY=...` for live shell generation.
Do not commit secrets.

```bash
node _devserver.cjs
```

Then open:

```txt
http://localhost:8790/generator/index.html
```

To play the Three.js experiment, use any static server from the repo root and
open:

```txt
/experiments/three-token-courier.html
```

## Guardrails

- Keep answer data, scoring, validation, and core mechanics deterministic.
- LLMs may generate themes, copy, world framing, and shell layout.
- LLMs must not own correctness, answer keys, or mechanic implementation.
- Player-facing changes must pass `design/pillars.md` and
  `design/design-constraints.md`.
