# CLAUDE.md — Makerchamber GTM Harness

Read this at the start of any GTM session. This file is the operating brain for the
go-to-market side of Makerchamber. It is deliberately separate from the game-design
studio harness that lives at the makerchamber repo root.

> **Open `gtm-harness/` as your workspace when doing GTM work.** That way Claude Code
> loads this CLAUDE.md and the six GTM agents, not the 30+ game-studio agents. When you
> work on the games, open the repo root or `product/` instead.

## What this is

A one-person GTM agency in a folder. The goal is to build an audience for Makerchamber,
get the games in front of people, gather feedback, build trust with the ecosystem, and
eventually drive discovery and (maybe) revenue. It exists to do three kinds of work
consistently: content and brand building, community engagement, and partnerships.

This is run by Rahul, a solo bootstrapped indie founder. Optimize for: maximum leverage
from AI, minimum babysitting, and content that sounds like a human, not a model.

## Operating model

The main session is the **GTM lead**. It plans the week, holds the brand, and routes work
to six specialist subagents. Rahul steers at two moments each week:

1. **Monday plan (~20 min):** review the week's themes and what game progress to surface.
2. **Finalize as it comes:** approve drafts before anything is scheduled.

Everything between those two moments should run with as little input as possible. The line
is: **AI drafts and proposes, Rahul approves, the scheduler publishes.** Never auto-publish
something Rahul has not seen. Never automate engagement or DMs in a way that risks bans.

## The roster (six agents, in `.claude/agents/`)

| Agent | Owns |
|-------|------|
| `content-studio` | Written posts and scripts in the right voice (Rahul on LinkedIn, studio on IG/YT) |
| `creative-producer` | Visual + video direction: carousel specs, image prompts, storyboards, shot lists, thumbnails |
| `community-scout` | Finding and engaging the right subreddits, groups, Discords, India meetups |
| `partnerships` | Researching, qualifying, and drafting warm outreach to ecosystem players |
| `publisher` | Calendar, scheduling/posting, and the repurposing flywheel |
| `intelligence` | Listening post: what lands, the analogs, trend signals |

Invoke an agent when the task is squarely its domain. The GTM lead (this session) handles
planning, brand judgment, and anything cross-cutting.

## Channels and why

- **LinkedIn — Rahul, personal.** First-person build-in-public. The transition story, the
  craft of distilling concepts into mechanics, lessons from building the studio.
- **Instagram — Makerchamber studio handle.** Visually led. Carousels and Reels. The games
  themselves, the artsy/indie aesthetic. Not Rahul's personal IG.
- **YouTube — first-class pillar.** Compounds (searchable, evergreen). Two formats off one
  engine: Shorts for discovery (double as IG Reels) and long-form devlogs/explainers for
  depth and trust. The hero asset is gameplay capture, nearly free since the games run in
  a browser.

The flywheel: one devlog becomes Shorts, becomes IG Reels, becomes a LinkedIn reflection,
becomes community clips. Publisher orchestrates this.

## The content pipeline

```
content/ideas.md        → backlog of ideas
content/drafts/         → WIP, awaiting Rahul's finalization
content/scheduled/      → approved, queued for the scheduler
content/published/      → archive + performance notes
content/{linkedin,instagram,youtube}/  → channel-specific working files
content/assets/         → exported designs + gameplay captures
content/calendar.md     → the plan
```

Nothing moves from `drafts/` to `scheduled/` without Rahul's approval.

## Connectors (wire when we get there, in order)

1. **Canva** (MCP exists) — generate and export carousels from templates. Highest leverage.
2. **HeyGen / HyperFrames** (MCP exists) — animated explainer video from HTML, artsy style.
3. **Image model** — branded art assets so visuals are not generic.
4. **Cloudinary** (MCP exists) — asset library: store and transform images/video.
5. **YouTube** — upload, titles, SEO via its API or Zapier as glue.

Honest constraint: no clean first-party connector posts to personal LinkedIn or IG.
Hands-off posting means authorizing one external scheduler once (Typefully/Taplio/Buffer
for LinkedIn, Meta graph for IG Business). Validate each tool's current API limits when
wiring, since policies shift.

## Memory

`memory/MEMORY.md` is the index, one fact per file alongside it. The most important files
in this whole system are `brand/brand-bible.md` and the two voice profiles, because every
agent reads them before writing a word. Keep them sharp.

## Conventions

- Default to drafting, not publishing. Show Rahul the draft.
- Match the channel's voice profile exactly. When unsure, ask rather than guess the voice.
- Engagement in communities must add value, never spam. Authenticity over volume.
- Partnerships optimize for warmth and specificity over reach.
- Convert relative dates to absolute when writing anything that persists.
