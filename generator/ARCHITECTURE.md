# Concept Forge — Architecture (1 page)

A learning-game **generator**. Thesis: *the mechanic IS the concept.* Type a concept →
get a playable game that teaches it + a before/after learning check + a live dashboard.

## The split that makes it work

```
TRUSTED CORE (hand-written, deterministic, never the LLM)
  • Mechanic SDKs  — one per interaction: Slash, (later) Weigh, Balance.
                     The mechanic always behaves correctly. LLM may CALL it, never rewrite it.
  • Resolvers      — produce VERIFIED correct answers where a source exists (tokenizer → tokenization).
  • Router         — mechanics → which SDK.

LLM-GENERATED SHELL (creative code we lean on)
  • skin + narrative + LAYOUT — a themed page that MOUNTS an SDK with answers we inject.

CORRECTNESS = HYBRID
  • resolver-verified when possible; else LLM-proposed answers, shown "AI-suggested · unverified".

FALLBACK FLOOR (demo can't faceplant)
  • validate generated page mounts the SDK → run sandboxed (iframe) → if broken,
    fall back to the trusted split_match template + a curated card.
```

## One SDK per *mechanic*, not per concept
`slash` → tokenization, syllables, compound words, fruit-ninja-tokens…
SDKs grow slowly; games grow fast (SDKs × concepts × LLM shells).

## The pipeline (two LLM touchpoints, both with fallbacks)
```
type concept (+ audience)
 → [LLM #1] concept → ConceptCard JSON (mechanics, tests, framing)   ── validated, curated fallback
 → router picks mechanic/SDK                                         (deterministic)
 → resolver: verified rounds if a source exists, else LLM rounds (badged)   (deterministic gate)
 → [LLM #2] ConceptCard + rounds → themed page that mounts the SDK   ── validated, sandboxed, fallback
 → pre-test → play → post-test → result → dashboard
```

## SDK contract (what the LLM-shell relies on)
```js
Slash.mount(containerEl, {
  rounds: [{ item, correct:[...], accept:(piece)=>bool, insight?:{whatHappened,takeaway} }],
  onComplete: () => {},
  options?: { showReveal: true }
});
```
The SDK owns the *mechanic* (slash gesture, cut, validate via `accept`, the your-split-vs-correct
reveal). It does NOT own theme, narrative, or outer layout — the shell does, via CSS over the
SDK's class hooks (`.slash-arena`, `.slash-piece`, `.slash-reveal`, …).

## Files
```
generator/
  index.html app.js schema.js cards.js store.js dashboard.html ARCHITECTURE.md
  sdk/        slash.js                 # B1 — trusted mechanic
  resolvers/  tokenization.js          # B2 — verified answers
  api/        generate-card.js, generate-shell.js   # B3/B5 — the two LLM calls (Vercel fns)
  templates/  split_match.html         # the FALLBACK floor (already works)
              coming_soon.html
```

## Build order (status)
- **Done:** shell, pre/post+delta, dashboard, router, validateAndRepairCard, curated cards,
  split_match fallback. (This is the safety net.)
- **B1** Slash SDK · **B2** tokenizer resolver · **B3** LLM shell generator ·
  **B4** validate+sandbox+fallback · **B5** wire pipeline + hybrid badge ·
  **B6 (stretch)** Supabase + deploy.

Riskiest: **B3** (LLM writing a page that correctly mounts the SDK). Mitigated by tiny SDK
surface + injected data + validate + sandbox + fallback to split_match.
