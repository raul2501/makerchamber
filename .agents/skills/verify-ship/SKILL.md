---
name: verify-ship
description: Pre-push verification gate for any game in the studio. Usage:
  /verify-ship <game-slug> (slug optional — inferred from git diff). Pass 1
  (technical) runs every level in the game's manifest and hard-blocks on failure.
  Pass 2 (experiential) assesses changed levels against the design constraints
  and hands the call to the user.
allowed-tools:
  - Bash
  - Read
  - Glob
  - Grep
---

# /verify-ship — Pre-Push Verification Gate (studio-wide)

Operationalizes two gates that otherwise sit unread: the Browser Verification
Checklist in `.Codex/docs/coding-standards.md` and the constraints in
`design/design-constraints.md`. Convert interventions into observable outcomes:
nothing ships until it's been *seen* to work, not assumed to.

Works for any game, current or future. Nothing about a specific game, level, or
mechanic is hardcoded here — game-specific facts live in that game's manifest, and
the design constraints are read from disk at run time. If levels are scrapped or
redesigned, only the manifest changes; this skill does not.

## Scope (one game per run)

The argument is a game slug, e.g. `/verify-ship <game-slug>`. If omitted, infer
the game from `git diff --name-only` (the top-level directory of the changed
files). If the diff spans multiple games or is ambiguous, ask which game before
proceeding. Never assume a default game.

## Manifest (per game)

Read `<game-slug>/verify-manifest.json`. Schema:

```json
{
  "game": "<game-slug>",
  "levels": [
    {
      "id": "<level-id>",
      "file": "<game-slug>/<level-file>.html",
      "name": "<Human-readable level name>",
      "coreInteraction": "Plain-English: the one key action + what state should visibly change.",
      "storageKey": "<localStorage key>"
    }
  ]
}
```

- `coreInteraction` may be `"TODO"` while a level is unbuilt or mid-redesign —
  the skill still runs the universal checks and reports the rest as unspecified.
- `storageKey` may be `null` for a level with no persistence — check 4 is skipped
  and reported "n/a" rather than failed.

If no manifest exists, do not invent one. Glob the game directory for level HTML,
run only the universal checks (1, 2, 5 below), and tell the user a manifest is
needed to enable checks 3 & 4.

## Pass 1 — Does it work? (technical)

Run on **every level in the manifest, every time** (regression safety — editing
one level can break another). Drive the gstack browse tool against each level:

| # | Check | Pass condition | Needs manifest? |
|---|-------|----------------|-----------------|
| 1 | Loads | No thrown exception during load | no |
| 2 | Console clean | Zero console errors on load + after interaction | no |
| 3 | Core interaction | `coreInteraction` fires and updates state | yes |
| 4 | Persistence | `storageKey` writes and survives reload | yes (skip if null) |
| 5 | No overflow | At the studio mobile baseline (390×844, per `.Codex/docs/technical-preferences.md`), `scrollWidth <= clientWidth` | no |

Output a pass/fail table for the whole game. **A red cell blocks the push — no
judgment, no override.** Technical breakage is not a design call. A level whose
`coreInteraction` is `"TODO"` runs checks 1, 2, 5 and reports 3/4 as
"unspecified — verify manually."

## Pass 2 — Does it land? (experiential)

Run only on **levels changed since the last push** (`git diff --name-only`,
filtered to this game). Read `design/design-constraints.md` and assess the level
against **every constraint listed there** — do not assume a fixed count; the file
is the source of truth. Mark each **met / partial / unmet** with a one-line
reason.

Give the constraint covering the aha moment (currently titled "Clear Aha Moment")
extra care: name the exact beat where the concept clicks, or state plainly that
you can't find one. This is the constraint most tied to whether the level produced
its intended outcome.

**Do not gate on Pass 2.** Present the full assessment. The user decides:
**proceed / iterate on design / scrap.** Never auto-block, never auto-approve.

## Output

1. Pass 1 table (all levels in the game). Any red → "Do not push," stop.
2. Pass 2 assessment per changed level (each constraint in the constraints file).
3. Hand the Pass 2 call to the user explicitly.

## Collaborative protocol

This skill reads and reports. It writes nothing and pushes nothing. The verdict is
the deliverable; the user owns every decision that follows.
