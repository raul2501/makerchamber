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

## Design Constraints

Hard, non-negotiable boundaries on every player-facing change. Pillars are
generative (what to build); constraints are evaluative (what to reject). Run
these as a pass/fail review gate before shipping any copy, mechanic, or screen.

@design/design-constraints.md

## Context Management

@.claude/docs/context-management.md
