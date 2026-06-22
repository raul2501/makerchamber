# Experiments

Throwaway-but-informative prototypes for the learning-game generator.

## `three-token-courier.html`

First Three.js world-loop experiment.

It tests whether the trusted Slash mechanic feels more meaningful when embedded
inside a tiny playable world:

1. Walk a courier to a scanner gate.
2. Trigger the Slash tokenization challenge.
3. Complete the challenge.
4. See the gate open and the packet deliver.

The goal is not production quality. The goal is to compare a world-loop format
against a generated shell that merely wraps the mechanic.

## Current Read

The earlier generated-shell experiment proved that GPT-5.5 can produce richer
HTML wrappers, but the result still felt like the same game. The world-loop
prototype is a better test of whether world context can make the concept feel
embodied.

## Open Questions

- Does a world consequence make the concept clearer, or just more entertaining?
- Should future worlds be GPT-generated full prototypes or JSON world specs
  consumed by trusted engines?
- Should the durable architecture use Three.js, PixiJS, Phaser, or a smaller
  custom DOM/canvas layer?
