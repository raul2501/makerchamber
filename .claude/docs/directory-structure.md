# Directory Structure

## Studio Layout

```
/
├── CLAUDE.md                    — Studio-level agent instructions
├── .claude/
│   ├── agents/                  — Agent definitions (one file per agent)
│   ├── docs/                    — Studio documentation and standards
│   │   └── templates/           — Document templates for design docs, ADRs, etc.
│   └── agent-memory/            — Persistent agent memory across sessions
├── city-of-tokens/              — Game: transformer architecture (8 levels)
│   ├── the-gate.html            — Level 1: Tokenization / Embedding
│   ├── the-map-room.html        — Level 2: Positional Encoding
│   ├── the-census-bureau.html   — Level 3: Attention Scores
│   ├── the-town-square.html     — Level 4: Self-Attention
│   ├── the-thread.html          — Level 5: Residual Connections
│   ├── the-library.html         — Level 6: Feed-Forward Network
│   ├── the-tower.html           — Level 7: Layer Stacking
│   ├── the-oracle.html          — Level 8: Output / Prediction
│   ├── game-design-docs/        — Level design documents
│   └── transformer-game-design.md
├── design/
│   ├── pillars.md               — Studio design pillars and MDA methodology
│   └── engine-research/         — Cross-game learnings (populated after each shipped game)
├── shared/                      — Shared JS utilities across games (extract here when 3+ games share logic)
├── production/
│   └── session-state/           — Active session state files (active.md written by agents mid-session)
└── docs/
    ├── specs/                   — Design specs (brainstorming outputs)
    └── plans/                   — Implementation plans
```

## Adding a New Game

1. Create `/<game-slug>/` at the repo root
2. Suggested internal structure:

```
/<game-slug>/
├── index.html               — Entry point (or level-01.html for multi-level games)
├── game-design-docs/        — Level and mechanic design documents
└── <game-slug>-design.md    — Overall game design document
```

3. Register the game in `CLAUDE.md` under "Games in Development"

## Shared Utilities

Nothing lives in `shared/` yet. Wait for genuine repetition across 3+ games before abstracting. Premature abstraction across game files creates coupling that isn't worth it at this scale.

## Engine Research

After shipping each game, write a post-mortem entry in `design/engine-research/`. Cover:
- Which M→D→A chain worked as intended
- Where the chain broke and why
- Generalizable principle that could apply to future games
