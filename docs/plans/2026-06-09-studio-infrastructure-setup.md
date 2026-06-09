# Studio Infrastructure Setup — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the makerchamber repo from a single-game project into a multi-game browser studio with full Claude Code Game Studios agent coordination infrastructure.

**Architecture:** Migrate existing HTML game files into a `city-of-tokens/` subdirectory, scaffold the studio directory layout, populate `.claude/` with agents and docs from the template repo (adapted for browser/JS, engine agents dropped), write new studio-specific files (CLAUDE.md, pillars, browser-game-specialist).

**Tech Stack:** Vanilla HTML/JS/CSS, no build step. Template source: `Donchitos/Claude-Code-Game-Studios` on GitHub (accessed via `gh api`).

**Spec:** `docs/specs/2026-06-09-studio-infrastructure-setup.md`

---

### Task 1: Scaffold directories and move existing game files

**Files:**
- Create: `city-of-tokens/` (move target)
- Create: `design/engine-research/.gitkeep`
- Create: `shared/.gitkeep`
- Create: `production/session-state/.gitkeep`
- Move: all `*.html` → `city-of-tokens/`
- Move: `game-design-docs/` → `city-of-tokens/game-design-docs/`
- Move: `transformer-game-design.md` → `city-of-tokens/transformer-game-design.md`

- [ ] **Step 1: Create scaffold directories**

```bash
mkdir -p city-of-tokens
mkdir -p design/engine-research
mkdir -p shared
mkdir -p production/session-state
mkdir -p .claude/agents
mkdir -p .claude/docs/templates/collaborative-protocols
mkdir -p .claude/docs/hooks-reference
mkdir -p .claude/agent-memory/lead-programmer
```

- [ ] **Step 2: Move game files into city-of-tokens/**

```bash
git mv the-gate.html city-of-tokens/the-gate.html
git mv the-map-room.html city-of-tokens/the-map-room.html
git mv the-census-bureau.html city-of-tokens/the-census-bureau.html
git mv the-town-square.html city-of-tokens/the-town-square.html
git mv the-thread.html city-of-tokens/the-thread.html
git mv the-library.html city-of-tokens/the-library.html
git mv the-tower.html city-of-tokens/the-tower.html
git mv the-oracle.html city-of-tokens/the-oracle.html
git mv game-design-docs city-of-tokens/game-design-docs
git mv transformer-game-design.md city-of-tokens/transformer-game-design.md
```

- [ ] **Step 3: Create placeholder files for empty directories**

```bash
touch design/engine-research/.gitkeep
touch shared/.gitkeep
touch production/session-state/.gitkeep
```

- [ ] **Step 4: Verify the layout**

```bash
find . -not -path './.git/*' -not -path './node_modules/*' | sort
```

Expected: all 8 HTML files under `city-of-tokens/`, `game-design-docs/` under `city-of-tokens/`, new empty dirs present.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold studio directory layout, move city-of-tokens files"
```

---

### Task 2: Fetch verbatim template docs

These files are copied exactly from the template. No edits needed.

**Files:**
- Create: `.claude/docs/coordination-rules.md`
- Create: `.claude/docs/context-management.md`
- Create: `.claude/docs/director-gates.md`
- Create: `.claude/docs/review-workflow.md`
- Create: `.claude/docs/quick-start.md`
- Create: `.claude/docs/rules-reference.md`
- Create: `.claude/docs/skills-reference.md`
- Create: `.claude/docs/setup-requirements.md`
- Create: `.claude/docs/CLAUDE-local-template.md`
- Create: `.claude/docs/settings-local-template.md`
- Create: `.claude/docs/hooks-reference.md`
- Create: `.claude/docs/hooks-reference/hook-input-schemas.md`
- Create: `.claude/docs/hooks-reference/post-merge-asset-validation.md`
- Create: `.claude/docs/hooks-reference/post-sprint-retrospective.md`
- Create: `.claude/docs/hooks-reference/pre-commit-code-quality.md`
- Create: `.claude/docs/hooks-reference/pre-commit-design-check.md`
- Create: `.claude/docs/hooks-reference/pre-push-test-gate.md`
- Create: `.claude/agent-memory/lead-programmer/MEMORY.md`

- [ ] **Step 1: Fetch all verbatim docs**

Run each command. If a file returns an error (404), skip it — not all template files may exist.

```bash
REPO="repos/Donchitos/Claude-Code-Game-Studios/contents"

fetch() { gh api "$REPO/$1" --jq '.content' | base64 -d > "$2"; }

fetch ".claude/docs/coordination-rules.md"        ".claude/docs/coordination-rules.md"
fetch ".claude/docs/context-management.md"        ".claude/docs/context-management.md"
fetch ".claude/docs/director-gates.md"            ".claude/docs/director-gates.md"
fetch ".claude/docs/review-workflow.md"           ".claude/docs/review-workflow.md"
fetch ".claude/docs/quick-start.md"               ".claude/docs/quick-start.md"
fetch ".claude/docs/rules-reference.md"           ".claude/docs/rules-reference.md"
fetch ".claude/docs/skills-reference.md"          ".claude/docs/skills-reference.md"
fetch ".claude/docs/setup-requirements.md"        ".claude/docs/setup-requirements.md"
fetch ".claude/docs/CLAUDE-local-template.md"     ".claude/docs/CLAUDE-local-template.md"
fetch ".claude/docs/settings-local-template.md"   ".claude/docs/settings-local-template.md"
fetch ".claude/docs/hooks-reference.md"           ".claude/docs/hooks-reference.md"
fetch ".claude/docs/hooks-reference/hook-input-schemas.md"        ".claude/docs/hooks-reference/hook-input-schemas.md"
fetch ".claude/docs/hooks-reference/post-merge-asset-validation.md" ".claude/docs/hooks-reference/post-merge-asset-validation.md"
fetch ".claude/docs/hooks-reference/post-sprint-retrospective.md" ".claude/docs/hooks-reference/post-sprint-retrospective.md"
fetch ".claude/docs/hooks-reference/pre-commit-code-quality.md"   ".claude/docs/hooks-reference/pre-commit-code-quality.md"
fetch ".claude/docs/hooks-reference/pre-commit-design-check.md"   ".claude/docs/hooks-reference/pre-commit-design-check.md"
fetch ".claude/docs/hooks-reference/pre-push-test-gate.md"        ".claude/docs/hooks-reference/pre-push-test-gate.md"
fetch ".claude/agent-memory/lead-programmer/MEMORY.md"            ".claude/agent-memory/lead-programmer/MEMORY.md"
```

- [ ] **Step 2: Verify files are non-empty**

```bash
wc -l .claude/docs/coordination-rules.md .claude/docs/context-management.md .claude/docs/director-gates.md
```

Expected: all show line counts > 0.

- [ ] **Step 3: Commit**

```bash
git add .claude/docs .claude/agent-memory
git commit -m "chore: add verbatim template docs and agent memory"
```

---

### Task 3: Fetch all template document templates

These ~40 files are copied verbatim from the template's `.claude/docs/templates/` directory.

**Files:** All files under `.claude/docs/templates/`

- [ ] **Step 1: Fetch all templates in one script**

```bash
REPO="repos/Donchitos/Claude-Code-Game-Studios/contents"

TEMPLATES=(
  "accessibility-requirements.md"
  "architecture-decision-record.md"
  "architecture-doc-from-code.md"
  "architecture-traceability.md"
  "art-bible.md"
  "changelog-template.md"
  "concept-doc-from-prototype.md"
  "design-doc-from-implementation.md"
  "difficulty-curve.md"
  "economy-model.md"
  "faction-design.md"
  "game-concept.md"
  "game-design-document.md"
  "game-pillars.md"
  "hud-design.md"
  "incident-response.md"
  "interaction-pattern-library.md"
  "level-design-document.md"
  "milestone-definition.md"
  "narrative-character-sheet.md"
  "pitch-document.md"
  "player-journey.md"
  "post-mortem.md"
  "project-stage-report.md"
  "prototype-report.md"
  "release-checklist-template.md"
  "release-notes.md"
  "risk-register-entry.md"
  "skill-test-spec.md"
  "sound-bible.md"
  "sprint-plan.md"
  "systems-index.md"
  "technical-design-document.md"
  "test-evidence.md"
  "test-plan.md"
  "ux-spec.md"
  "vertical-slice-report.md"
)

for f in "${TEMPLATES[@]}"; do
  gh api "$REPO/.claude/docs/templates/$f" --jq '.content' | base64 -d > ".claude/docs/templates/$f"
  echo "✓ $f"
done

# Collaborative protocols (subdirectory)
for f in design-agent-protocol.md implementation-agent-protocol.md leadership-agent-protocol.md; do
  gh api "$REPO/.claude/docs/templates/collaborative-protocols/$f" --jq '.content' | base64 -d > ".claude/docs/templates/collaborative-protocols/$f"
  echo "✓ collaborative-protocols/$f"
done
```

- [ ] **Step 2: Verify count**

```bash
find .claude/docs/templates -name "*.md" | wc -l
```

Expected: 40 or more files.

- [ ] **Step 3: Commit**

```bash
git add .claude/docs/templates
git commit -m "chore: add document templates from template repo"
```

---

### Task 4: Fetch and adapt agent roster from template

Fetch all non-engine agents. After fetching, remove "Engine Version Safety" sections (engine-specific boilerplate that references Godot/Unity/Unreal version files) from any agent that contains it.

**Files:** All files under `.claude/agents/` except engine-specific ones

- [ ] **Step 1: Fetch all non-engine agents**

```bash
REPO="repos/Donchitos/Claude-Code-Game-Studios/contents"

AGENTS=(
  "creative-director.md"
  "game-designer.md"
  "ux-designer.md"
  "level-designer.md"
  "writer.md"
  "qa-tester.md"
  "ui-programmer.md"
  "audio-director.md"
  "lead-programmer.md"
  "technical-director.md"
  "producer.md"
  "narrative-director.md"
  "art-director.md"
  "systems-designer.md"
  "qa-lead.md"
  "prototyper.md"
  "economy-designer.md"
  "performance-analyst.md"
  "tools-programmer.md"
  "release-manager.md"
  "localization-lead.md"
  "accessibility-specialist.md"
  "security-engineer.md"
  "community-manager.md"
  "live-ops-designer.md"
  "ai-programmer.md"
  "analytics-engineer.md"
  "sound-designer.md"
  "technical-artist.md"
  "world-builder.md"
)

for agent in "${AGENTS[@]}"; do
  gh api "$REPO/.claude/agents/$agent" --jq '.content' | base64 -d > ".claude/agents/$agent"
  echo "✓ $agent"
done
```

- [ ] **Step 2: Identify agents with Engine Version Safety sections**

```bash
grep -l "Engine Version Safety" .claude/agents/*.md
```

Note the list — these need the section removed in Step 3.

- [ ] **Step 3: Remove Engine Version Safety sections from each flagged agent**

For each file returned in Step 2, open it and delete the section that looks like:

```
### Engine Version Safety

**Engine Version Safety**: Before suggesting any engine-specific API, class, or node:
1. Check `docs/engine-reference/[engine]/VERSION.md` for the project's pinned engine version
2. If the API was introduced after the LLM knowledge cutoff listed in VERSION.md, flag it explicitly:
   > "This API may have changed in [version] — verify against the reference docs before using."
3. Prefer APIs documented in the engine-reference files over training data when they conflict.
```

Use the Edit tool to remove this section from each flagged file. The section ends before the next `###` heading.

- [ ] **Step 4: Verify no engine references remain**

```bash
grep -r "engine-reference\|godot\|unity\|unreal\|GDScript\|GDExtension\|Blueprint\|Unreal\|MonoBehaviour" .claude/agents/ --include="*.md" -l
```

Expected: zero files. If any appear, open them and remove the engine-specific content.

- [ ] **Step 5: Commit**

```bash
git add .claude/agents/
git commit -m "chore: add agent roster from template, remove engine-specific sections"
```

---

### Task 5: Create browser-game-specialist agent

**Files:**
- Create: `.claude/agents/browser-game-specialist.md`

- [ ] **Step 1: Write the agent file**

Write the following content to `.claude/agents/browser-game-specialist.md`:

```markdown
---
name: browser-game-specialist
description: "The Browser Game Specialist owns all HTML/CSS/JS implementation for browser games. This is the primary implementation agent for any code that runs in the browser: game loops, rendering, state management, input handling, audio, responsive layout, and mobile support. Use this agent for any browser game implementation work across all studio projects."
tools: Read, Glob, Grep, Write, Edit, Bash
model: sonnet
maxTurns: 30
---

You are the Browser Game Specialist for a browser game studio. You are the primary
implementation authority for all code that runs in the browser. Your work must be
performant, mobile-compatible, and maintainable as standalone HTML/JS/CSS files.

### Platform Targets

**Desktop:** Chrome primary, Firefox/Safari secondary. Keyboard + mouse input.

**Mobile browser:** iOS Safari and Android Chrome. Touch input. First-class target — not an afterthought.

Mobile-specific requirements you always apply:
- Use `100dvh` instead of `100vh` for full-screen layouts (iOS Safari 100vh bug)
- Touch targets: minimum 44×44px
- No hover-dependent interactions — all interactions must work with touch only
- Safe area insets: `env(safe-area-inset-top/bottom/left/right)` for fixed/absolute positioned elements near screen edges
- Viewport meta: `width=device-width, initial-scale=1, viewport-fit=cover`
- No 300ms tap delay: use `touch-action: manipulation` on interactive elements
- Test layouts at 390×844 (iPhone 14) and 412×915 (Pixel 7) via Chrome DevTools device emulation

### Technical Scope

**Rendering:**
- DOM-based rendering for UI-heavy games (HTML + CSS transforms, transitions)
- Canvas 2D API for pixel/sprite-based games
- CSS animations and keyframes for lightweight visual effects
- `requestAnimationFrame` for all game loops — never `setInterval` for animation

**State Management:**
- In-memory game state (plain JS objects/arrays) as primary runtime state
- `localStorage` for persistence — debounce writes, never write in hot paths
- `sessionStorage` for per-session temporary state

**Input:**
- Keyboard: `keydown`/`keyup` event listeners with key mapping objects
- Pointer Events API preferred over separate mouse/touch handlers (works for both)
- Touch fallback: `touchstart`/`touchmove`/`touchend` when Pointer Events aren't sufficient
- Gamepad API: available but not a current studio requirement

**Audio:**
- Web Audio API for programmatic sound synthesis and effects
- `<audio>` element for simple looping music
- Always gate audio start on first user gesture (browser autoplay policy)

**Performance:**
- Target 60fps on mid-range mobile (Snapdragon 730 class)
- Frame budget: 16ms
- Avoid layout thrashing: batch DOM reads before writes in the same frame
- Use `will-change: transform` sparingly — only for elements that animate frequently
- Profile with Chrome DevTools Performance panel before optimizing

### Architecture Patterns

**Small self-contained game (current City of Tokens style):**
- Single HTML file per level
- Inline `<style>` and `<script>` blocks
- All state in module-scoped variables
- No imports, no build step

**Multi-file game (when complexity warrants):**
- `index.html` as entry point
- `js/` for game logic (ES modules with `type="module"`)
- `css/` for stylesheets
- `assets/` for images/audio
- Still no bundler — native ES modules in the browser

**Transition trigger:** Move from single-file to multi-file when a single file exceeds ~800 lines or when 3+ levels share meaningful logic.

### Creative Influences

You draw lessons from these creators when making design-adjacent implementation decisions:

- **Nicky Case** — explorable explanations, systems thinking through play, games-as-essays. His code is readable and intentional. Demonstrates that a single HTML file can carry serious conceptual weight.
- **Zach Gage** — clean mobile-first interfaces, clarity of rules through UI, generous touch targets. Rules emerge through play, not instruction.
- **Bennett Foddy** — authorial voice in browser games. The browser is a legitimate artistic medium, not a compromise.
- **Molleindustria (Paolo Pedercini)** — educational/political games with strong conceptual grounding. Mechanics that mean something beyond the game.
- **Neal Agarwal (neal.fun)** — delight-first, single-mechanic browser toys. Every interaction earns its complexity.
- **Bret Victor / Explorable Explanations lineage** — interactive learning as a medium. The reader/player is an active participant, not a passive consumer.
- **itch.io browser game ecosystem** — proof that small HTML files can carry meaningful artistic and educational weight.

Use these as precedents, not style guides. They define what's possible; the studio's own pillars (`design/pillars.md`) define what we build.

### Collaboration Protocol

**You are a collaborative implementer, not an autonomous code generator.** The user approves all architectural decisions and file changes.

#### Implementation Workflow

Before writing any code:

1. **Read the design document** — identify what's specified vs. ambiguous. Flag implementation challenges early.

2. **Ask architecture questions:**
   - "Should this be a single HTML file or multi-file?"
   - "Should game state live in localStorage or memory-only?"
   - "The design doc doesn't specify [edge case] — what should happen when...?"

3. **Propose approach before implementing:**
   - Show structure, data flow, key decisions
   - Highlight trade-offs and why you're recommending this approach
   - Ask: "Does this match your expectations before I write the code?"

4. **Implement with transparency:**
   - If spec ambiguities arise during implementation, STOP and ask
   - If a deviation from the design doc is technically necessary, call it out explicitly

5. **Get approval before writing files:**
   - Show the code or a detailed summary
   - Ask: "May I write this to [filepath(s)]?"
   - List all affected files for multi-file changes

6. **Verify in browser before marking complete:**
   - Zero console errors on load and during play
   - Manual playthrough of the implemented mechanic
   - Mobile layout check via Chrome DevTools device emulation (390×844 and 412×915)
   - localStorage state inspection if persistence is involved

### Key Responsibilities

1. **Game loop** — `requestAnimationFrame` loops, timing, delta time, pause/resume
2. **Rendering** — DOM, Canvas 2D, CSS animations — right tool for the game's visual needs
3. **Input handling** — keyboard, mouse, touch — all interactions work on both desktop and mobile
4. **State management** — runtime state, localStorage persistence, save/load
5. **Audio** — Web Audio API synthesis, playback, autoplay policy compliance
6. **Responsive layout** — games play correctly at all screen sizes, desktop and mobile
7. **Performance** — 60fps on mid-range mobile, no jank, no memory leaks
8. **Accessibility** — keyboard navigation, sufficient color contrast, scalable text where feasible

### What This Agent Must NOT Do

- Design game mechanics or levels (implement specs from `game-designer`/`level-designer`)
- Make creative direction decisions (escalate to `creative-director`)
- Write narrative content (delegate to `writer`)
- Design UI layouts or visual style (implement specs from `ux-designer`/`art-director`)

### Reports to: `lead-programmer`
### Implements specs from: `game-designer`, `level-designer`, `ux-designer`, `art-director`
```

- [ ] **Step 2: Verify the file was written**

```bash
head -5 .claude/agents/browser-game-specialist.md
```

Expected: frontmatter with `name: browser-game-specialist`.

- [ ] **Step 3: Commit**

```bash
git add .claude/agents/browser-game-specialist.md
git commit -m "feat: add browser-game-specialist agent"
```

---

### Task 6: Write adapted .claude/docs/ files

These three files are rewritten for the browser/JS studio context — not copied from the template.

**Files:**
- Create: `.claude/docs/coding-standards.md`
- Create: `.claude/docs/technical-preferences.md`
- Create: `.claude/docs/directory-structure.md`

- [ ] **Step 1: Write coding-standards.md**

```markdown
# Coding Standards

## Code Quality

- No commented-out code in committed files
- No `console.log` in committed code (use deliberate debug utilities if needed)
- Keep files focused — a level file handles one level, a utility handles one concern
- Gameplay values defined as named constants at the top of the file, not inline magic numbers
- **Commit messages**: Conventional Commits — `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`. Reference the relevant design doc or task in the commit body.
- **Verification-driven development**: Before marking work complete, verify it in the browser. Every implementation must have a way to prove it works.

## Design Document Standards

- All design docs use Markdown
- Each game has its own directory with its own design docs
- Design documents should include: Overview, Player Fantasy, Detailed Rules, Dynamics, Edge Cases, Dependencies, Tuning Knobs, Acceptance Criteria
- Balance values must link to their source formula or rationale

## Testing Standards

There is no automated test suite. All verification is manual and browser-based.

### Browser Verification Checklist

Before marking any implementation complete:

1. **Console clean**: Open Chrome DevTools → Console. Zero errors, zero uncaught exceptions on page load and during gameplay.
2. **Functional test**: Play through the mechanic manually. Verify it behaves exactly as designed.
3. **localStorage check** (if persistence is involved): DevTools → Application → Local Storage. Verify state is saved correctly and loads correctly on page refresh.
4. **Mobile layout check**: DevTools → Toggle Device Toolbar. Test at 390×844 (iPhone 14) and 412×915 (Pixel 7). Verify layout, touch targets, no horizontal overflow, no clipped content.
5. **Real device spot check** (before shipping to Vercel): Open on an actual iOS or Android device. Touch interactions, safe area behavior, viewport behavior.

### What NOT to Automate

- Visual layout and feel
- Touch interaction quality
- Full gameplay sessions (covered by manual playtesting)

## CI/CD

No automated CI pipeline. Vercel auto-deploys on push to main. Always verify locally in the browser before pushing.
```

- [ ] **Step 2: Write technical-preferences.md**

```markdown
# Technical Preferences

## Platform & Language

- **Platform**: Browser — Chrome desktop primary, iOS Safari + Android Chrome mobile
- **Language**: JavaScript (ES2020+)
- **No TypeScript**: Simplicity is intentional
- **No bundler**: Files served directly, no build step
- **No framework**: Vanilla JS only

## Input & Platform

- **Desktop input**: Keyboard + Mouse
- **Mobile input**: Touch (tap, swipe) — no hover states, no right-click assumptions
- **Gamepad**: Not supported (current games)
- **Primary input**: Keyboard/Mouse on desktop, Touch on mobile

## Naming Conventions

- **Files**: kebab-case (`the-gate.html`, `attention-utils.js`)
- **Variables**: camelCase (`tokenList`, `attentionScore`)
- **Constants**: SCREAMING_SNAKE_CASE (`MAX_TOKENS`, `GRID_SIZE`)
- **Functions**: camelCase, verb-first (`renderTokens`, `calculateAttention`, `handleTap`)
- **CSS classes**: kebab-case (`token-cell`, `attention-bar`)

## Performance Budgets

- **Target framerate**: 60fps on mid-range mobile
- **Frame budget**: 16ms
- **Page weight**: Under 500KB uncompressed (no heavy libraries)
- **Animation**: `requestAnimationFrame` only — no `setInterval` for visual updates

## Mobile Constraints

- Safe area insets: `env(safe-area-inset-top/bottom/left/right)` for fixed/absolute elements near screen edges
- Viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`
- Full-screen height: `100dvh` or `window.innerHeight` — never `100vh` (iOS Safari bug)
- Touch targets: minimum 44×44px interactive area
- Tap delay: `touch-action: manipulation` on all interactive elements

## Forbidden Patterns

- `document.write()`
- Inline event handlers in HTML (`onclick="..."`, `onkeydown="..."`)
- `var` declarations (use `const`/`let`)
- Synchronous localStorage writes in animation loops (debounce writes)
- `100vh` for full-screen layouts (use `100dvh`)

## Allowed Libraries

- Google Fonts CDN (Press Start 2P for City of Tokens)
- Web Audio API (built-in browser API)
- No third-party game libraries without explicit approval

## Architecture Decisions

- Per-level state: each level manages its own `localStorage` key
- No shared runtime between levels: levels are standalone HTML files
- Shared utilities: extract to `shared/` only when the same logic appears in 3+ places
```

- [ ] **Step 3: Write directory-structure.md**

```markdown
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
```

- [ ] **Step 4: Verify all three files exist and are non-empty**

```bash
wc -l .claude/docs/coding-standards.md .claude/docs/technical-preferences.md .claude/docs/directory-structure.md
```

Expected: all show line counts > 0.

- [ ] **Step 5: Commit**

```bash
git add .claude/docs/coding-standards.md .claude/docs/technical-preferences.md .claude/docs/directory-structure.md
git commit -m "chore: add browser-adapted coding standards and technical preferences"
```

---

### Task 7: Write adapted agent-coordination-map.md and agent-roster.md

The template versions reference engine specialists in the org chart. Fetch them, then replace the engine specialist branches with browser-game-specialist.

**Files:**
- Create: `.claude/docs/agent-coordination-map.md`
- Create: `.claude/docs/agent-roster.md`

- [ ] **Step 1: Fetch both files from template**

```bash
REPO="repos/Donchitos/Claude-Code-Game-Studios/contents"
gh api "$REPO/.claude/docs/agent-coordination-map.md" --jq '.content' | base64 -d > .claude/docs/agent-coordination-map.md
gh api "$REPO/.claude/docs/agent-roster.md" --jq '.content' | base64 -d > .claude/docs/agent-roster.md
```

- [ ] **Step 2: Edit agent-coordination-map.md — replace engine specialist section**

Open `.claude/docs/agent-coordination-map.md`. Find the "Engine Specialists" block in the org chart (the section listing `godot-specialist`, `unity-specialist`, `unreal-specialist` and their sub-specialists). Replace the entire engine specialist section with:

```
  Browser Implementation:
    browser-game-specialist  -- All HTML/CSS/JS: game loops, rendering, input, audio, mobile
      (reports to lead-programmer; no sub-specialists currently)
```

Also remove the Legend entries for `net = network-programmer` and any entries for dropped agents.

- [ ] **Step 3: Edit agent-roster.md — remove engine-specific rows**

Open `.claude/docs/agent-roster.md`. Remove all rows for:
`godot-specialist`, `godot-gdscript-specialist`, `godot-csharp-specialist`, `godot-shader-specialist`, `godot-gdextension-specialist`, `unity-specialist`, `unity-dots-specialist`, `unity-shader-specialist`, `unity-addressables-specialist`, `unity-ui-specialist`, `unreal-specialist`, `ue-gas-specialist`, `ue-blueprint-specialist`, `ue-replication-specialist`, `ue-umg-specialist`, `network-programmer`, `devops-engineer`, `engine-programmer`, `gameplay-programmer`

Add a row for `browser-game-specialist`:
```
| browser-game-specialist | All HTML/CSS/JS implementation — game loops, rendering, input, audio, mobile browser | sonnet |
```

- [ ] **Step 4: Verify no engine references remain**

```bash
grep -i "godot\|unity\|unreal\|gdscript\|blueprint" .claude/docs/agent-coordination-map.md .claude/docs/agent-roster.md
```

Expected: zero matches.

- [ ] **Step 5: Commit**

```bash
git add .claude/docs/agent-coordination-map.md .claude/docs/agent-roster.md
git commit -m "chore: adapt agent coordination map and roster for browser studio"
```

---

### Task 8: Create design/pillars.md

**Files:**
- Create: `design/pillars.md`

- [ ] **Step 1: Write design/pillars.md**

```markdown
# Studio Design Pillars

## Design Methodology

Use MDA (Mechanics → Dynamics → Aesthetics) for all design decisions. Design runs in reverse: start with target Aesthetics, derive Dynamics, then design Mechanics.

**Primary aesthetic target: Discovery. Secondary: Challenge. Supporting: Fantasy.**

The 8 aesthetics: Sensation, Fantasy, Narrative, Challenge, Fellowship, Discovery, Expression, Submission.

---

## Pillar 1 — Mechanics encode the concept. Dynamics enact it.

Players build intuition from dynamics, not mechanics. Correct dynamics matter more than elegant mechanics.

**Design test:** Could a player describe the game's dynamics in plain English and have that description also be a roughly accurate description of how the real concept works?

**Anti-pattern:** A mechanic that feels like the concept but produces dynamics that diverge from how the concept actually behaves.

---

## Pillar 2 — Fantasy enables Discovery — never the other way around.

The story world creates the container for Discovery. When story metaphor and conceptual accuracy conflict, accuracy wins. No domain jargon in gameplay.

**Design test:** If a player translated their in-world mental model to the real domain, would they be approximately right?

**Anti-pattern:** A vivid story that produces strong Fantasy but builds wrong intuitions about the underlying concept.

---

## Pillar 3 — Name the target aesthetics before designing anything.

"Fun" is not a design goal. "Discovery primary, Challenge secondary, Fantasy supporting" is. Every mechanic should be evaluated against the aesthetic it's meant to produce. The core loop should deliver those aesthetics without educational framing.

**Design test:** What are the target aesthetics in priority order? Does the core loop produce them stripped of all educational context?

**Anti-pattern:** Designing mechanics to efficiently deliver information, then adding game-feel on top.

---

## Pillar 4 — Design backwards from the aha moment.

Name the target insight before designing anything. The aha moment is a Discovery aesthetic outcome — trace it: what dynamic produces it? What mechanic produces that dynamic? Every other design decision exists to create conditions for that moment.

**Design test:** Can you write one sentence describing the exact player experience at the moment of conceptual click?

**Anti-pattern:** Completing a polished game before asking what specific intuition the player should leave with.

---

## Pillar 5 — Every game is a structured experiment.

After each game, document: Did M→D→A deliver the target aesthetics? Where did the chain break? What reusable principle does this game reveal about teaching this type of concept through mechanics?

**Design test:** Can you articulate a generalizable mechanic-to-concept principle from this game?

**Anti-pattern:** Treating each game as a one-off. The studio is accumulating structured knowledge about how to teach through play.

---

## Conflict Resolution

When two design options conflict: check which better serves Discovery (primary aesthetic), trace to dynamics, then mechanics. The option producing more accurate Discovery dynamics wins. If unclear, escalate to `creative-director`.
```

- [ ] **Step 2: Verify file**

```bash
wc -l design/pillars.md
```

Expected: 60+ lines.

- [ ] **Step 3: Commit**

```bash
git add design/pillars.md
git commit -m "feat: add studio design pillars with MDA methodology"
```

---

### Task 9: Rewrite CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Overwrite CLAUDE.md with studio framing**

```markdown
# Makerchamber — Browser Game Studio

A multi-game browser studio. Each game teaches a concept through interactive play.
Agents are coordinated through a structured hierarchy — each owns a specific domain.

## What This Is

A studio that builds browser-based games teaching concepts across any domain
(science, history, math, philosophy, etc.). Each game is a standalone project.
Over time, patterns from these games will inform a generalized learning-game engine.
The games being built now are both products AND research data for that engine.

## Games in Development

- **City of Tokens** (`city-of-tokens/`) — 8 levels teaching transformer architecture through "The City of Tokens" world

## Technology Stack

- **Platform**: Browser — Chrome desktop primary, iOS Safari + Android Chrome mobile
- **Language**: Vanilla JavaScript (ES2020+) — no frameworks, no build step
- **Styling**: Inline CSS per file
- **Persistence**: localStorage per game
- **Version Control**: Git with trunk-based development
- **Hosting**: Vercel (auto-deploy on push to main)

No game engine. No bundler. No TypeScript. The simplicity is intentional.
Future games may grow in scope — the stack may evolve.

## Project Structure

@.claude/docs/directory-structure.md

## Technical Preferences

@.claude/docs/technical-preferences.md

## Coordination Rules

@.claude/docs/coordination-rules.md

## Collaboration Protocol

**User-driven collaboration, not autonomous execution.**
Every task follows: **Question → Options → Decision → Draft → Approval**

- Agents MUST ask "May I write this to [filepath]?" before using Write/Edit tools
- Agents MUST show drafts or summaries before requesting approval
- Multi-file changes require explicit approval for the full changeset
- No commits without user instruction

> **First session?** Run `/start` to begin the guided onboarding flow.

## Coding Standards

@.claude/docs/coding-standards.md

## Studio Vision & Design Methodology

@design/pillars.md

## Context Management

@.claude/docs/context-management.md
```

- [ ] **Step 2: Verify the @-includes point to existing files**

```bash
ls .claude/docs/directory-structure.md .claude/docs/technical-preferences.md .claude/docs/coordination-rules.md .claude/docs/coding-standards.md .claude/docs/context-management.md design/pillars.md
```

Expected: all six files exist (no "No such file" errors).

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "feat: rewrite CLAUDE.md for studio context"
```

---

### Task 10: Verify complete setup

- [ ] **Step 1: Check directory structure matches spec**

```bash
find . -not -path './.git/*' -maxdepth 3 | sort
```

Verify:
- `city-of-tokens/` contains all 8 HTML files
- `city-of-tokens/game-design-docs/` exists
- `.claude/agents/` contains 30+ agent files including `browser-game-specialist.md`
- `.claude/docs/` contains all the expected docs
- `design/pillars.md` exists
- `production/session-state/.gitkeep` exists
- `shared/.gitkeep` exists

- [ ] **Step 2: Verify agent count**

```bash
ls .claude/agents/*.md | wc -l
```

Expected: 31 (30 from template + browser-game-specialist).

- [ ] **Step 3: Verify no engine agents were included**

```bash
ls .claude/agents/ | grep -E "godot|unity|unreal|ue-|network-programmer|devops"
```

Expected: zero matches.

- [ ] **Step 4: Verify CLAUDE.md @-includes all resolve**

```bash
ls \
  .claude/docs/directory-structure.md \
  .claude/docs/technical-preferences.md \
  .claude/docs/coordination-rules.md \
  .claude/docs/coding-standards.md \
  .claude/docs/context-management.md \
  design/pillars.md
```

Expected: all 6 files found, no errors.

- [ ] **Step 5: Final commit if any loose files remain**

```bash
git status
```

If any untracked or modified files remain, add and commit them:

```bash
git add -A
git commit -m "chore: studio infrastructure setup complete"
```
