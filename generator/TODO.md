# Concept Forge — running TODOs / known issues

Accumulated during the hackathon build. Not blocking the POC; revisit after the core pipeline.

## Generation quality / UX (P1 — flagged 2026-06-20)
- The LLM-generated shell's **UX is poor and often inappropriate** for the stated audience
  (e.g. an adult-styled dark editorial page even when the audience is young learners). The
  *frame* gets themed but the **game internals (arena, Ledger, hints) keep the SDK's default
  look**, so the result feels bolted-together.
- Directions to explore: a stronger/more prescriptive design brief in the prompt; pass the
  audience more forcefully; have the LLM also set the SDK's CSS variables/hooks so the theme
  reaches *inside* the game; few-shot examples of good vs. bad; or a small design-token step
  (LLM picks palette/type/tone as JSON) feeding a more constrained template.

## Latency (P1 — flagged 2026-06-20)
- Live GPT-5.5 generation takes **~42s** — too slow for a live demo spinner.
- Options: faster model variant; lower `max_output_tokens` / reasoning effort; **pre-generate
  + cache** a few concepts so the demo is instant, and reserve live-gen for one "watch it build"
  moment.

## Determinism / accuracy sign-off (P2)
- Map/round *groupings* still want a human/agent accuracy pass (token-singularity already verified).
- Resolver library is currently tokenization-only; add syllabifier etc. as we go.
