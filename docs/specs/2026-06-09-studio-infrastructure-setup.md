# Studio Infrastructure Setup

**Date:** 2026-06-09  
**Status:** Approved

## Context

`makerchamber` is being reframed from a single-game repo (City of Tokens) into a
general-purpose browser game studio. The transformer learning game is the first
title. This spec covers the infrastructure changes needed to support a multi-game
studio.

## Goals

- Set up `.claude/` agent coordination infrastructure from the Claude Code Game Studios template
- Reframe `CLAUDE.md` and supporting docs for a studio context
- Reorganize existing files into a studio directory layout
- Establish studio-level creative pillars
- Support mobile browser play (iOS Safari, Android Chrome) as a first-class target

## Directory Structure

```
/
├── CLAUDE.md                               ← studio-level rewrite
├── .claude/
│   ├── agents/                             ← adapted agent roster (see below)
│   ├── docs/
│   │   ├── coordination-rules.md           ← from template, as-is
│   │   ├── context-management.md           ← from template, as-is
│   │   ├── coding-standards.md             ← adapted for browser/JS
│   │   ├── technical-preferences.md        ← pre-filled for browser stack
│   │   ├── directory-structure.md          ← studio layout
│   │   ├── agent-coordination-map.md       ← from template, engine refs removed
│   │   ├── agent-roster.md                 ← from template, adapted
│   │   ├── director-gates.md               ← from template, as-is
│   │   ├── review-workflow.md              ← from template, as-is
│   │   ├── quick-start.md                  ← from template, as-is
│   │   └── templates/                      ← from template, as-is
│   └── agent-memory/
│       └── lead-programmer/
│           └── MEMORY.md
├── city-of-tokens/                         ← all 8 HTML levels moved here
│   ├── the-gate.html
│   ├── the-map-room.html
│   ├── the-census-bureau.html
│   ├── the-town-square.html
│   ├── the-thread.html
│   ├── the-library.html
│   ├── the-tower.html
│   ├── the-oracle.html
│   ├── game-design-docs/                   ← moved from root
│   └── transformer-game-design.md          ← moved from root
├── design/
│   ├── pillars.md                          ← studio pillars (new)
│   └── engine-research/                    ← empty, for future learnings
├── shared/                                 ← empty, for future shared utilities
├── production/
│   └── session-state/
│       └── .gitkeep
└── docs/
    └── specs/                              ← this file lives here
```

## Agent Roster

### Keep + adapt for browser/JS context
Remove engine-specific API references. Replace with HTML/CSS/JS/Web API equivalents.

`creative-director`, `game-designer`, `ux-designer`, `level-designer`, `writer`,
`qa-tester`, `ui-programmer`, `audio-director`, `lead-programmer`,
`technical-director`, `producer`, `narrative-director`, `art-director`,
`systems-designer`, `qa-lead`, `prototyper`, `economy-designer`,
`performance-analyst`, `tools-programmer`, `release-manager`, `localization-lead`,
`accessibility-specialist`, `security-engineer`, `community-manager`,
`live-ops-designer`, `ai-programmer`, `analytics-engineer`, `sound-designer`,
`technical-artist`, `world-builder`

### Drop (engine-specific or server-infra)
`godot-specialist`, `godot-gdscript-specialist`, `godot-csharp-specialist`,
`godot-shader-specialist`, `godot-gdextension-specialist`,
`unity-specialist`, `unity-dots-specialist`, `unity-shader-specialist`,
`unity-addressables-specialist`, `unity-ui-specialist`,
`unreal-specialist`, `ue-gas-specialist`, `ue-blueprint-specialist`,
`ue-replication-specialist`, `ue-umg-specialist`,
`network-programmer`, `devops-engineer`, `engine-programmer`, `gameplay-programmer`

### Create new
`browser-game-specialist` — owns all HTML/CSS/JS implementation for browser games.

**Scope:**
- Rendering: Canvas 2D, CSS animations, DOM-based game rendering
- State management: localStorage, sessionStorage, in-memory game loops
- Input: keyboard, mouse, touch (mobile), gamepad API
- Audio: Web Audio API
- Performance: requestAnimationFrame, paint budgets, mobile CPU constraints
- Architecture: both small self-contained HTML files AND multi-file game structures

**Platform targets:**
- Desktop: Chrome primary, Firefox/Safari secondary
- Mobile browser: iOS Safari and Android Chrome
  - Responsive layout (viewport units, flexible grids)
  - Touch input (tap, swipe, pinch)
  - Mobile gotchas: 100vh bug, tap delay (300ms), safe area insets, no hover states,
    virtual keyboard behavior, reduced memory budget

**Creative influences:**
The agent is aware of and draws from the work of browser game creators who have
demonstrated what the medium can accomplish:
- **Nicky Case** — explorable explanations, systems thinking through play, games-as-essays
- **Zach Gage** — clean mobile-first design, clarity of rules through UI
- **Bennett Foddy** — authorial voice, browser as a legitimate artistic medium
- **Molleindustria (Paolo Pedercini)** — educational/political games in browser
- **Neal Agarwal (neal.fun)** — delight-first, single-mechanic browser toys
- **Bret Victor lineage / Explorable Explanations** — interactive learning as medium
- The itch.io browser game ecosystem broadly

These are precedents, not style references — proof that small HTML files can carry
meaningful educational and artistic weight.

## Key File Changes

### CLAUDE.md
Full rewrite. Studio framing: this repo is a studio containing multiple games.
@-includes updated to point to new doc paths. Current game listed under "Games in
Development". Collaboration protocol and `/start` reference preserved.

### .claude/docs/coding-standards.md
- Remove: engine-specific test runners (GDUnit4, game-ci, `-nullrhi`)
- Remove: engine CI commands
- Replace testing section with browser-first verification:
  - Chrome DevTools console (no errors on load, no uncaught exceptions)
  - Manual playtesting as primary QA method
  - localStorage state inspection via DevTools Application tab
  - Mobile testing: Chrome DevTools device emulation + real device spot checks
- Keep: Conventional Commits, design doc standards, verification-driven development

### .claude/docs/technical-preferences.md
Pre-filled for the browser stack (not left as [TO BE CONFIGURED]):
- Engine: None (vanilla browser)
- Language: JavaScript (ES2020+)
- Platform: Browser — Chrome desktop primary, iOS Safari + Android Chrome mobile
- Input: Keyboard/Mouse (desktop), Touch (mobile)
- No TypeScript, no bundler, no framework

### .claude/docs/directory-structure.md
Describes the studio layout above. Notes per-game structure under each game folder.

### design/pillars.md
Opens with a Design Methodology section, followed by five pillars with design tests, anti-patterns, and conflict resolution. Referenced by all agents when building, designing, or reviewing games.

**Design Methodology**
Use MDA (Mechanics → Dynamics → Aesthetics) for all design decisions. Design runs in reverse: start with target Aesthetics, derive Dynamics, then design Mechanics.
Primary aesthetic target: Discovery. Secondary: Challenge. Supporting: Fantasy.
The 8 aesthetics: Sensation, Fantasy, Narrative, Challenge, Fellowship, Discovery, Expression, Submission.

**Pillar 1 — Mechanics encode the concept. Dynamics enact it.**
Players build intuition from dynamics, not mechanics. Correct dynamics matter more than elegant mechanics.
- Design test: Could a player describe the game's dynamics in plain English and have that also be a roughly accurate description of how the real concept works?
- Anti-pattern: A mechanic that feels like the concept but produces dynamics that diverge from how it actually behaves.

**Pillar 2 — Fantasy enables Discovery — never the other way around.**
The story world creates the container for Discovery. When story metaphor and conceptual accuracy conflict, accuracy wins. No domain jargon in gameplay.
- Design test: If a player translated their in-world mental model to the real domain, would they be approximately right?
- Anti-pattern: A vivid story that produces strong Fantasy but builds wrong intuitions.

**Pillar 3 — Name the target aesthetics before designing anything.**
"Fun" is not a design goal. "Discovery primary, Challenge secondary, Fantasy supporting" is. Every mechanic is evaluated against the aesthetic it's meant to produce. The core loop should deliver those aesthetics without educational framing.
- Design test: What are the target aesthetics in priority order? Does the core loop produce them stripped of educational context?
- Anti-pattern: Designing mechanics to efficiently deliver information, then adding game-feel on top.

**Pillar 4 — Design backwards from the aha moment.**
Name the target insight before designing anything. Trace it: what dynamic produces it? What mechanic produces that dynamic? Every other design decision exists to create conditions for that moment.
- Design test: Can you write one sentence describing the exact player experience at the moment of conceptual click?
- Anti-pattern: Completing a polished game before asking what specific intuition the player should leave with.

**Pillar 5 — Every game is a structured experiment.**
After each game, document: Did M→D→A deliver the target aesthetics? Where did the chain break? What reusable principle does this game reveal about teaching this type of concept through mechanics?
- Design test: Can you articulate a generalizable mechanic-to-concept principle from this game?
- Anti-pattern: Treating each game as a one-off. The studio is accumulating structured knowledge.

**Conflict resolution:** When two design options conflict, check which better serves Discovery (primary aesthetic), trace to dynamics, then mechanics. The option producing more accurate Discovery dynamics wins. If unclear, escalate to `creative-director`.

## What Is Kept As-Is from Template
- `.claude/docs/coordination-rules.md` — model tier assignments, delegation rules,
  parallel task protocol
- `.claude/docs/context-management.md` — session state, compaction strategy
- `.claude/docs/templates/` — all document templates
- All agent collaboration protocols and gate verdict formats
- `creative-director` agent content (engine-agnostic already)

## Out of Scope
- Implementing or modifying any City of Tokens game levels
- Setting up Vercel or CI/CD
- Writing the shared engine layer
- Creating future game stubs
