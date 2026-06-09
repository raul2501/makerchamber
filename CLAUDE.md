# Makerchamber — Game Studio Agent Architecture

Browser-based transformer learning game managed through coordinated Claude Code agents.
Each agent owns a specific domain, enforcing separation of concerns and quality.

## What This Is

An 8-level browser game that teaches transformer architecture through interactive
gameplay. Each level is a standalone HTML file with vanilla JS. Players explore
"The City of Tokens" — a world where transformer concepts are the laws of physics.

**Levels:**
1. `the-gate.html` — Tokenization / Embedding
2. `the-map-room.html` — Positional Encoding
3. `the-census-bureau.html` — Attention Scores
4. `the-town-square.html` — Self-Attention
5. `the-thread.html` — Residual Connections
6. `the-library.html` — Feed-Forward Network
7. `the-tower.html` — Layer Stacking
8. `the-oracle.html` — Output / Prediction

## Technology Stack

- **Platform**: Browser (Chrome primary, macOS)
- **Language**: Vanilla JavaScript — no frameworks, no build step
- **Styling**: Inline CSS per file — Minecraft Overworld aesthetic
- **Persistence**: localStorage per level (game state)
- **Fonts**: Press Start 2P (Minecraft feel), loaded via Google Fonts CDN
- **Version Control**: Git with trunk-based development
- **Hosting**: Vercel (auto-deploy on push to main)

No game engine. No bundler. No TypeScript. The simplicity is intentional.

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

## Game Vision

@design/pillars.md

## Context Management

@.claude/docs/context-management.md
