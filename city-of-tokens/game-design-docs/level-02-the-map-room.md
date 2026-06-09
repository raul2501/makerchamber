# Level 2 — The Map Room
### Concept & Game Design Document

---

## 1. Overview

**Level name:** The Map Room  
**Concept it teaches:** Token Embedding  
**Position:** Second — runs immediately after tokenization, before positional encoding  
**Prototype:** `the-map-room.html`

Tokens arrive from the Gate as integer IDs. The Map Room converts each one into a vector — a point in a high-dimensional semantic space learned from training data. The player places tokens on a stylized 2D map, discovers where they actually land, and observes their neighborhoods. The level's central moment is placing "bank" and watching it land between two completely different clusters, stranded between its two meanings.

---

## 2. Learning Objective

Three ideas, in order of importance:

1. **Tokens become vectors.** The model never processes text directly — only arrays of numbers. The embedding is the translation from symbol to geometry.
2. **Position reflects usage, not definition.** Similar-context words cluster together. The space has directional structure — relationships have geometry.
3. **Polysemous words are stranded.** Every token gets one fixed position regardless of sentence. "bank" near "river" and "bank" near "deposit" produce the same starting vector. This is the unresolved problem Level 2 ends on.

---

## 3. Narrative

Tokens registered at the Gate now enter the Map Room — a vast territory drawn by someone who read everything ever written. Each traveler is assigned a starting position based on where words like them tend to appear. The map has structure. But it was drawn once and frozen: every traveler gets one spot, even if they have two lives.

Level 2 ends with a question, not an answer. The resolution comes in Level 4 (The Town Square / attention).

---

## 4. Mechanic

The player is given a token card and a 2D map populated with unlabeled word-dots in clustered regions. They drag the token onto the map and drop it where they think it belongs. On release, the token snaps to its actual position with a pulse animation, then neighbor connections draw out as lines to the nearest words.

**No cluster labels are shown.** The player has to read the individual word-dots to reason about where regions are. Labels would short-circuit the reasoning — the player would place the token by reading the heading rather than by reading the map.

After the reveal, an explanation panel shows the neighbor list, a note about the neighborhood, and the rule the round teaches.

---

## 5. The Four Rounds

**Round 1 — "happy"**  
Lands cleanly in the emotions cluster. Tutorial round. Establishes the mechanic with an unambiguous example. Teaches: single-meaning words occupy tight, clean neighborhoods.

**Round 2 — "token"**  
Carried over from Level 1 (the player split "tokenize" → [token, ize] at the Gate). Lands at the Language/Technology boundary — word, text, sentence on one side; code, data, model on the other. Teaches: a word's position reflects the full range of its usage, not just its most obvious meaning.

**Round 3 — "unhappy"**  
Also carried over from Level 1. Lands near "happy" but shifted toward the negative emotions (sad, anger, fear). The "happy" dot is highlighted as a reference point when this round starts. Teaches: prefixes create directional shifts in the embedding space. Relationships have geometry.

**Round 4 — "bank"**  
The level's main event. Lands between the Finance cluster (deposit, savings, invest, account) and the Nature cluster (river, flood, stream, shore). After the snap, two colored halos expand — amber for Finance, teal for Nature — and neighbor chips appear in both colors. Teaches: polysemous words are assigned one position that belongs fully to neither meaning.

---

## 6. The Problem Statement

After Round 4, the player moves to a separate problem screen showing two sentences:

> "The bank was completely flooded."  
> "The bank was suddenly closed."

The player clicks "look up bank" on each sentence. Both return the same map coordinates, the same nearest neighbors. A callout appears only after both have been revealed: *"Two sentences with completely different meanings produce the exact same embedding."*

This is the level's payoff. The player doesn't just hear that polysemy is a problem — they see it directly. Both sentences are indistinguishable at this stage.

---

## 7. Closing Screen

The closing screen does three things:

1. **Summarizes what happened** — the map has real structure, but it's frozen and context-free.
2. **Names the limitation clearly** — at this stage, "bank" in two different sentences looks identical to the model.
3. **Sets up what comes next without spoiling it** — the Town Square (attention) will eventually pull "bank" toward the right meaning based on its neighbors. But first, Level 3 handles something else: the city doesn't yet know what order the travelers arrived in.

The framing is "to be continued" — the problem is real, the resolution is coming, and the player knows there's more.

---

## 8. Design Decisions

**Stylized map, not real embeddings.** Word positions are hand-crafted to clearly demonstrate clustering, directional structure, and polysemy. Real PCA/t-SNE projections are messier and would require loading external data. The concept is accurate; the positions are illustrative.

**No cluster labels.** See section 4. The player should reason from the word-dots, not the headings. This is a deliberate increase in difficulty that produces more genuine engagement with the map.

**Continuity from Level 1.** "happy," "unhappy," and "token" are tokens the player encountered in Level 1. Seeing them arrive at the Map Room makes the two levels feel like one continuous journey rather than independent puzzles.

**Polysemy reveal uses visual language.** The two-halo reveal (amber Finance, teal Nature) communicates the split neighborhood visually before the player reads any text. The color coding carries through to the neighbor chips in the panel below.

**Problem screen is gated.** The callout explaining the problem only appears after the player has actively looked up "bank" in both sentences. This ensures the player makes the connection themselves rather than being told.

---

## 9. What This Level Teaches vs. Doesn't Teach

Teaches: tokens become vectors, semantic space has geometric structure, directional relationships (prefixes), polysemy as a structural limitation, why context-free embeddings aren't enough.

Doesn't teach: how the embedding matrix is trained (backpropagation), dimensionality and its tradeoffs, subword embeddings vs. word embeddings, how position is added to the embedding (that's Level 3).
