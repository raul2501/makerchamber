# The Transformer — Game Design Document

## The World

A transformer takes a sequence of tokens and produces a prediction: what comes next? That's the only question this city exists to answer. Every traveler (token) who passes through is transformed — from a flat, context-free symbol into a rich, meaning-laden representation. The city reads the sequence of who has passed, and names who comes next.

The rhythm of the city is two alternating modes:
- **Communal work** (attention): tokens interact, trade context, update each other
- **Private work** (FFN): each token retreats alone and consults what it already knows

This alternation repeats across every floor of the tower. That's the world.

---

## Level 1 — The Gate (Tokenization)

### What actually happens
Raw text arrives as a stream of characters. Before anything can be processed, it must be broken into tokens — discrete units from a fixed vocabulary (typically ~50,000 entries). The algorithm (BPE — Byte Pair Encoding) works by frequency: common character sequences get their own token slot. "unbelievable" might split into ["un", "believ", "able"]. The split is statistical, not semantic — "ing" is a token not because the suffix is meaningful but because it appears everywhere. Words outside the vocabulary get approximated by splitting into subword pieces until all parts are recognized.

The key property: the vocabulary is **fixed**. You can only represent what exists in the book. Everything else gets approximated.

### The game level
You are a traveler arriving at the city gate. To enter, you must be registered. The gatekeeper has a fixed ledger of recognized identities. You arrive as "unbelievable" — one whole thing — but the gatekeeper has no entry for you. She checks her ledger and splits you: "un" is registered, "believ" is registered, "able" is registered. You enter as three travelers now, not one.

The splits feel arbitrary. That's the point. You don't get split by meaning; you get split by what the ledger happens to contain. A different ledger (a different tokenizer) would split you differently.

### Player mechanics
A word or phrase arrives. The player has a vocabulary ledger (a subset shown on screen). They must split the input into valid tokens — the game accepts splits where every piece is in the ledger. Challenge: there are multiple valid splits, but only the most common/efficient one matches the "correct" tokenization. Edge cases: numbers, punctuation, code, non-English text all tokenize unexpectedly. 

Levels escalate from clean English words → compound words → code snippets → a sentence in another language where the model has far fewer tokens per word, showing how some languages are "cheaper" to represent than others.

### What it teaches
The model doesn't see words. It sees tokens. The vocabulary is the window onto language — anything outside it gets approximated. Different splits can change meaning. Tokenization is lossy and arbitrary, and that arbitrariness propagates through everything downstream.

---

## Level 2 — The Map Room (Token Embedding)

### What actually happens
Each token ID (just an integer — "bank" = 4, "river" = 7, etc.) gets looked up in an embedding matrix and mapped to a dense vector — a point in a high-dimensional space (typically 512–4096 dimensions). These embeddings are **learned during training**. The model adjusts them billions of times until similar-use tokens cluster nearby. "king" and "queen" end up close together. "Paris" and "France" are related by a consistent directional offset.

The critical thing: at this stage, "bank" maps to **one vector** regardless of whether it means a riverbank or a financial institution. It's context-free. The sole purpose of every subsequent layer is to fix this — to make the representation context-sensitive.

### The game level
You've been registered at the gate. Now you're brought to the Map Room — a vast territory drawn by someone who read everything ever written. Your starting position on this map is assigned based purely on your token identity. You're placed near your neighbors: tokens that tend to appear in similar situations cluster together. "doctor" is near "nurse" and "hospital". "run" is near "sprint" and "jog" but also near "run" (the noun, a different meaning — but the map puts them at one averaged point).

You look at your position on the map. It's your starting identity — real, but incomplete. You could mean several things. The map doesn't know which yet.

### Player mechanics
Given a token, the player places it on a 2D semantic map (a simplified embedding space visualization). They see clusters: animals here, verbs there, places in another corner. The puzzle: place the token where it "belongs" based on what they know about it. Then reveal the actual embedding position — and show its nearest neighbors.

The interesting moment: polysemous words like "bank", "bat", "crane", "light" all land at a single point that's a compromise between their meanings. The player sees this is a problem. The map is good but it's not enough. This motivates everything that comes next.

### What it teaches
Meaning starts as position in a learned space. That space has real structure — analogies, clusters, directional relationships. But a single position can't capture multiple meanings. The embedding is the starting point of a token's identity, not the ending point.

---

## Level 3 — The Census Bureau (Positional Encoding)

### What actually happens
A transformer processes all tokens **simultaneously** — in parallel, not sequentially. This means it has no built-in sense of order. "Dog bites man" and "man bites dog" are identical to the model before positional encoding: just a set of three tokens. Position must be explicitly injected.

The solution: add a position vector to each token's embedding. Position 1 gets one signal, position 5 gets another. These signals are either hand-crafted (sinusoidal — different frequencies for different positions) or learned. The critical property: the position signal is **added** to the embedding, not concatenated. Position and meaning are blended into the same vector. The model has to learn to disentangle them.

Modern variants (RoPE, ALiBi) encode position differently, but the core need is the same: without this, word order doesn't exist.

### The game level
The Map Room assigned your position in meaning-space. But the city has a second problem: everyone arrived at the same moment — the transformer processes the whole sentence at once. No one knows who came first.

The Census Bureau assigns each traveler a **rank signal** based on their position in the sequence. This signal gets blended into your existing identity — you're no longer just "bank", you're "bank at position 5." Same word, different position in a sentence, different behavior. "Only I love her" vs "I only love her" vs "I love only her" — the word "only" is identical but its position changes the meaning of the entire sentence.

The blending is the strange part: the census signal doesn't tag you from the outside, it's mixed into your identity. You carry your position as part of who you are.

### Player mechanics
A sentence appears with one word's position scrambled. The player has to inject the correct position signal to restore meaning. Show two identical sentences where word order changes meaning — "the cat chased the dog" vs "the dog chased the cat." Without position encoding, the model sees the same three content words both times. The player adds position signals and watches the meaning differentiate.

Advanced level: show a sentence where the same word at different positions has different grammatical roles. "Time flies like an arrow" — "flies" at position 2 is a verb; at position 3 in "fruit flies like a banana" it's a noun. Same token, different position, different identity.

### What it teaches
Sequence matters and it's not free — it has to be built in explicitly. The transformer's parallel processing is its power (it can attend to everything at once) but also a gap (it's naturally orderless). Position encoding is the patch. The blending of position and meaning into the same vector is a design tradeoff with real consequences.

---

## Level 4 — The Town Square (Self-Attention)

### What actually happens
Every token computes three things from itself: a **Query** (what am I looking for?), a **Key** (what do I advertise to others?), and a **Value** (what do I actually send if attended to?). These are linear projections — the same input token, multiplied by three different learned weight matrices.

Each token then computes a compatibility score with every other token: Query · Key (dot product), scaled by √d. Softmax turns these scores into weights that sum to 1. The token's new representation is the weighted sum of all Values, where high-attention tokens contribute more.

This runs **H times in parallel** (multi-head attention) with different projection matrices. Each head learns to specialize: one might track subject-verb agreement, one co-reference ("it" → what it refers to), one semantic similarity. The heads' outputs are concatenated and projected back down.

This is the **only place tokens interact**. Everything else is per-token. Attention is the mixing mechanism — the only way information flows between positions.

### The game level
The town square. Every traveler gathers here simultaneously. This is the only place in the city where travelers can actually speak to each other.

Each traveler carries three things into the square: a **question** (what do I need to know to understand my own role?), a **sign** (what they broadcast about themselves to others who might need them), and a **gift** (what they actually hand over if someone chooses to listen).

The sign and the gift are different. "went" has a prominent sign — it's a common, frequent word — but its gift is thin for meaning-relevant tasks. "deposit" hangs back but carries a dense gift about financial transactions. You have a limited attention budget. You choose who to listen to. What you receive — weighted by how much you listened — becomes your updated identity.

Multi-head: you're not alone in the square. You have five advisors, each with different eyes. One advisor notices grammatical structure (who is the subject?). Another notices semantic relationships (what domain are we in?). Another notices co-reference (what does "it" point to?). All five attend simultaneously. You synthesize their reports.

### Player mechanics
The "bank" game we already designed lives here, now with the fuller picture:

- You see the sentence, you're the `???` token
- Each surrounding word shows its **sign** (a visible Key signal)
- You have chips to distribute (attention budget)
- On commit: you see what each word's **gift** actually was (Value revealed proportional to attention)
- Your identity updates as a weighted blend

Multi-head layer: you have 3 advisor windows running in parallel, each with their own chip set. Advisor 1 is tracking syntax, Advisor 2 is tracking semantics, Advisor 3 is tracking domain. Each makes different allocations. Your final update combines all three.

Key mechanic tension: signs can mislead (K ≠ V). A word that looks relevant might carry little. The skill being developed: reading signs skeptically and predicting which gifts are worth pursuing.

### What it teaches
Context is computed, not stored. The same word in different contexts attends to different things and becomes something different. Attention is zero-sum — budget constraints force prioritization. The Q/K/V separation means "being findable" and "being useful" are independent. Multiple heads let the same token simultaneously hold multiple kinds of relationship with its context.

---

## Level 5 — The Thread (Residual Connection + Layer Norm)

### What actually happens
After attention, the output is **not a replacement** — it's added back to what the token was before: `output = x + Attention(x)`. This is the residual connection. The original embedding is preserved; the attention result is a delta layered on top.

Then Layer Normalization re-centers the result: zero mean, unit variance across the feature dimension. This prevents any single update from dominating, and keeps gradients stable across many layers.

The "residual stream" view (from mechanistic interpretability research): the token has a core vector that flows through every layer unchanged except for the additions each layer writes to it. Attention heads read from this stream, compute a small update, and write it back. FFN layers do the same. The token is the sum of all these accumulated writes. Nothing is ever truly erased.

### The game level
After the town square, you're changed. You heard things. But you're still you.

The Thread is the rule of this city: every transformation is an addition, never a replacement. When attention gave you new context, it didn't rewrite your identity — it layered onto it. You carry your original self, your post-attention self, and everything in between, all summed together.

The Normalizer follows you out of every district. Whatever you accumulated — however loud a single update was — the Normalizer re-centers you. No single voice can overwhelm everything else you are. You're scaled back to a stable range before entering the next district.

Mechanically, this means: if you watched what a token "is" at each layer, you'd see a vector that starts as a word embedding and accumulates annotations — syntactic role, semantic context, positional relationships, world knowledge — layer by layer. By layer 12, the original word embedding is a small fraction of the total.

### Player mechanics
After each town square round, the player sees their identity as a **stack of layers**: the original embedding at the bottom, each attention update as a visible stripe added on top. They can toggle individual layers on/off and watch their identity shift. The point: every previous state is preserved in the sum.

The Normalizer is shown as a "stabilizer bar" after each addition. If one update is very loud (very high magnitude), the normalizer compresses it into proportion. Players can see a version without normalization to understand what goes wrong — runaway activations, identity collapse.

### What it teaches
The transformer never forgets. Everything added to a token's representation is preserved in the residual sum. Depth isn't about replacing — it's about accumulating. Layer norm is what makes stacking stable: without it, errors compound. This also explains why very deep networks don't "lose" the original input — the highway carries it all the way through.

---

## Level 6 — The Library (Feed-Forward Network)

### What actually happens
After attention, each token is processed by a two-layer neural network — independently, with no interaction with other tokens: `FFN(x) = max(0, xW₁ + b₁)W₂ + b₂`. The intermediate dimension is typically 4× the model dimension (a GPT-4 layer might expand from 4096 → 16384 → 4096). ReLU or GELU provides non-linearity.

Research suggests FFN layers function as **key-value memories**: the first weight matrix matches input patterns against learned "keys", ReLU gates which neurons fire, and the second matrix reads out the corresponding "values". This is where world knowledge appears to be stored — factual associations like "Paris is in France", "water is liquid", "Einstein was a physicist." Attention handles *relationships between tokens*; FFN handles *facts about tokens*.

### The game level
You leave the town square. You've gathered context from others. Now you go alone to the Library.

The Library doesn't interact with other travelers. It's your private consultation. Based on who you are right now — your current representation, post-attention — certain books pull themselves off the shelves. "bank" (post-attention, near "deposit" and "savings"): the financial books activate. "bank" (post-attention, near "river" and "muddy"): the geography books activate.

The Library matches your current state against its catalog. High-match entries light up and contribute to your representation. The Library doesn't know context (that was the town square's job) — it knows facts. What you need from it depends on where attention left you.

The expansion-contraction structure matters: the library is four times bigger on the inside than on the outside. You enter your 4096-dimensional self. Inside, you briefly exist in 16384 dimensions — the full catalog, every possible pattern — and then collapse back down, having selected and absorbed what was relevant.

### Player mechanics
The player arrives with a current token representation (visualized as a pattern or descriptor set). The Library presents a set of "fact cards" — each corresponding to a neuron cluster that has a pattern and a payload. The player sees which cards activate (match their current state) and which don't. High activation → that card's payload gets added to their representation.

The interesting level: show the same token arriving at the Library twice — once post-attention to a financial context, once post-attention to a river context. Different cards light up. Same Library, same token identity, but attention changed what the Library retrieves. This shows how attention and FFN work together: attention routes you to the right part of the Library.

### What it teaches
FFN is the model's memory of the world. Attention is dynamic (computed from context every time); FFN is parametric (baked in during training). Together they form a two-stage process: first, figure out what's relevant in this context (attention); then, look up what you know about things in that context (FFN). The 4× expansion is the "thinking space" — briefly considering many possible patterns before collapsing to an answer.

---

## Level 7 — The Tower (Layer Stacking)

### What actually happens
The full block (attention + residual + FFN + residual) repeats N times. GPT-2 small: 12 layers. Large production models: 32–96+ layers. The representations change substantially across depth:

- **Early layers** (1–4): Surface patterns. Grammar, syntax, punctuation, basic part-of-speech.
- **Middle layers** (5–8): Semantic roles, word sense disambiguation, entity types.
- **Late layers** (9+): Task-specific patterns, abstract reasoning, long-range dependencies.

Each layer's attention heads specialize in different things. Early heads track local syntax; late heads track document-level coherence. A token's representation at layer 12 is almost unrecognizable compared to its embedding at layer 0 — it's been through 12 rounds of communal mixing and private consultation.

### The game level
The Tower has N floors. Every traveler climbs it. Every floor is another round of square and library. But the same conversation looks different from each floor.

On floor 1, "bank" is just a word with a position. The square notices nearby punctuation and grammatical neighbors. The library recognizes it as a noun.

By floor 6, "bank" has absorbed enough context to know it's financial. The square is tracking longer-range dependencies — connecting it to "savings" three positions back. The library is retrieving financial institution facts.

By floor 12, "bank" isn't really "bank" anymore — it's a high-level abstraction representing "the destination where the agent deposits money in this particular story." It's ready to be decoded into a prediction.

The tower is the process of becoming something more abstract. You enter as a word. You exit as a thought.

### Player mechanics
The player watches a token's representation evolve as a "biography" — a visual trail through the tower. At each floor, they can inspect: what did this token attend to? What fired in the library? What did the representation become?

The game shows probing results at each layer — what can be decoded from the representation? At layer 1: the token's part of speech. At layer 6: its semantic category. At layer 10: its role in the current context. The player develops intuition for which layers handle which abstractions.

Challenge levels: given a representation at a random floor, identify which floor it is by what's been encoded into it.

### What it teaches
Depth is the mechanism of abstraction. Each layer adds a layer of interpretation. The same information gets processed from surface (letters, grammar) to deep (semantics, reasoning). This is why scaling (more layers) tends to produce more capable models — not because more is always better, but because more layers enables more levels of abstraction.

---

## Level 8 — The Oracle (Unembedding + Softmax)

### What actually happens
The final token in the sequence — after all layers — has a representation that must be converted into a prediction. The unembedding matrix (often the same matrix as the embedding, transposed) converts this vector into a score for every token in the vocabulary: one number per word in the 50,000-word ledger. These are **logits** — raw, unnormalized scores.

Softmax converts logits into a probability distribution: all values positive, all sum to 1. The highest-probability token is the model's best guess. But the model doesn't just output its top guess — it samples from the distribution. Temperature controls how sharp or flat the distribution is: low temperature → nearly deterministic, high temperature → more random, more creative.

The model is **never certain**. It's always a distribution. That's not a weakness — it's the mechanism that enables coherent generation.

### The game level
The last traveler in the sequence reaches the gate on the far side of the city. They've been through every floor. They've gathered context from every square, consulted every library on every floor. Now they must speak.

The Oracle's question is always the same: what comes next?

The traveler doesn't say a word. They produce a map — a probability distribution over every possible next word. "The probability of 'account' is 0.31. The probability of 'vault' is 0.08. The probability of 'teller' is 0.04. The probability of 'river' is 0.001..."

Then a single word is drawn from this map. That word is the output. That word becomes the next traveler to enter the gate on the other side, beginning its own journey through the city.

Temperature: turn it down, and the Oracle's map collapses to a sharp peak — the most likely word almost always wins, outputs become predictable. Turn it up, and the map flattens — unlikely words occasionally get drawn, outputs become surprising, sometimes creative, sometimes incoherent.

### Player mechanics
The player has processed a sentence. Now they must predict the next token — not by picking one word, but by distributing confidence across a vocabulary. They have 100 confidence points to allocate. Their distribution is compared to the model's actual distribution (cross-entropy). 

Score is highest when the player's distribution is close to the model's — not just when they pick the same top word. This teaches: prediction isn't certainty, it's calibration. Being confident about the right word is good. Being confident about the wrong word is bad. Being appropriately uncertain when the situation is genuinely ambiguous is correct.

The temperature level: the player sees the same distribution at different temperatures. Low temperature — one word dominates. High temperature — the distribution spreads. They control temperature and watch what happens to generated outputs. They learn: temperature doesn't change what the model knows, it changes how much it commits.

### What it teaches
Language models don't know the next word. They estimate a distribution over all possible next words. The output is a sample from that distribution. This explains both why they can be creative (sampling from non-peak positions) and why they hallucinate (confidently assigning probability to wrong answers). The unembedding is the reversal of the embedding — you entered the city as a position on a map, and you exit as a position on the same map, but completely transformed.

---

## The Full Arc

A token enters as a flat ID. It gets mapped to a position in meaning-space (embedding). It gets stamped with its position in the sequence (positional encoding). Then it repeats — gathering context from all other tokens (attention), adding that context to itself without losing its history (residual), consulting its private knowledge store (FFN), and adding that too (residual) — across every floor of the tower. Finally, the last token in the sequence is asked to name what comes next, and it answers with a distribution drawn from everything it has become.

That's the transformer. The game is the journey.
