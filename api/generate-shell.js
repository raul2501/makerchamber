'use strict';
// ─────────────────────────────────────────────────────────────────────────────
// api/generate-shell.js — Vercel serverless function (Node, no dependencies).
// B3: the LLM "creative shell" generator. Given a concept + audience + the
// VERIFIED rounds, it asks GPT-5.5 to write a themed HTML page that MOUNTS the
// trusted Slash SDK with data we inject — it never reimplements the mechanic or
// invents the answers (that's the determinism boundary).
//
// The key (OPENAI_API_KEY) stays server-side. Output is a raw HTML string; the
// caller (B4) validates it, runs it sandboxed, and falls back to split_match.
//
// Uses the Responses API. Keep the model + output-token setting isolated here
// so swapping models is a one-line change.
// ─────────────────────────────────────────────────────────────────────────────

const OPENAI = {
  endpoint: 'https://api.openai.com/v1/responses',
  model: 'gpt-5.5',
  maxTokensParam: 'max_output_tokens',
  maxTokens: 9000,
};

const SDK_SRC = '/generator/sdk/slash.js';

// The contract the generated page must satisfy. This is the determinism boundary.
const SYSTEM_PROMPT = `You generate ONE self-contained HTML page: a themed "shell" for a short browser learning game. A trusted game engine and its data are provided to you at runtime — you must NOT reimplement them.

HARD REQUIREMENTS (the page is rejected if any is missing):
1. Include this exact script tag: <script src="${SDK_SRC}"></script>
2. Include a container element: <div id="game"></div>
3. In your own <script> (placed AFTER the SDK script tag), call EXACTLY:
   Slash.mount(document.getElementById('game'), { rounds: window.GAME_ROUNDS, onComplete: window.GAME_DONE });
   window.GAME_ROUNDS (the verified game data) and window.GAME_DONE (call it when the game finishes) ALREADY EXIST in the page. Do NOT define them, modify them, or invent any rounds/answers. Never hardcode game data.
4. Do NOT implement the game mechanic yourself — no slashing, cutting, splitting, validation, or scoring logic. The SDK owns all of that. You provide ONLY theme, layout, and narrative around <div id="game">.
5. Output ONLY raw HTML, starting with <!DOCTYPE html>. No markdown, no code fences, no commentary before or after.

DESIGN BRIEF:
- Make it feel deliberately designed for the AUDIENCE and CONCEPT given by the user: choose colors, typography, tone, a one-line intro, and a frame around the game accordingly. A game for young kids should look and read completely differently from one for adults.
- Keep it lightweight: inline CSS only; Google Fonts via <link> is allowed, no other external libraries.
- The #game container should be visually prominent and centered, with room to breathe.
- Mobile-friendly (viewport meta, no fixed widths that overflow a phone).

WORLD LAYER:
- If a worldStyle is provided, wrap the game in a richer animated world that supports that style.
- You may create CSS-only sprite-like characters, layered backgrounds, parallax motion, ambient props, lighting, scanner pulses, particles, and success/focus effects.
- The world must make the concept metaphor more legible, not merely decorative. The player should understand the main action faster because of the world.
- Keep motion readable and calm enough that the #game area remains the obvious interaction target within 3 seconds.
- Do NOT use external JavaScript, external image assets, canvas engines, or libraries. CSS and semantic HTML only, plus the required Slash SDK script.`;

function buildMessages(input) {
  const concept = input.conceptName || input.concept || 'a concept';
  const oneLine = input.oneLine || '';
  const audience = input.targetLearner || input.audience || 'a curious beginner';
  const mechanic = input.mechanic || 'slash-to-split';
  const worldStyle = input.worldStyle
    ? '\nWorld style: ' + JSON.stringify(input.worldStyle)
    : '';
  const user = `Concept: ${concept}${oneLine ? ' — ' + oneLine : ''}
Audience: ${audience}
Mechanic: ${mechanic} (the player slashes a string into valid pieces; the SDK runs the whole interaction).
${worldStyle}

Theme this freely for the concept and audience above. Remember: you only build the look, layout, and narrative — mount the trusted SDK with window.GAME_ROUNDS / window.GAME_DONE, and output raw HTML only.`;
  return [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: user },
  ];
}

// Pull the HTML out of a model response; strip stray markdown fences defensively.
function extractHtml(content) {
  if (!content || typeof content !== 'string') return '';
  let s = content.trim();
  const fence = s.match(/```(?:html)?\s*([\s\S]*?)```/i);
  if (fence) s = fence[1].trim();
  const idx = s.indexOf('<!DOCTYPE');
  if (idx > 0) s = s.slice(idx);
  return s.trim();
}

// Light structural check (full validation + sandbox + fallback is B4's job).
function looksMountable(html) {
  return /Slash\.mount\s*\(/.test(html)
    && /id\s*=\s*["']game["']/.test(html)
    && html.includes(SDK_SRC);
}

async function callOpenAI(messages) {
  const body = { model: OPENAI.model, input: messages };
  body[OPENAI.maxTokensParam] = OPENAI.maxTokens;
  const resp = await fetch(OPENAI.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + process.env.OPENAI_API_KEY,
    },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const detail = await resp.text().catch(() => '');
    throw new Error('OpenAI ' + resp.status + ': ' + detail.slice(0, 300));
  }
  const data = await resp.json();
  if (data && typeof data.output_text === 'string') return data.output_text;
  if (!data || !Array.isArray(data.output)) return '';

  return data.output
    .flatMap(item => Array.isArray(item.content) ? item.content : [])
    .map(part => typeof part.text === 'string' ? part.text : '')
    .join('');
}

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST only' });
    return;
  }
  if (!process.env.OPENAI_API_KEY) {
    res.status(500).json({ error: 'OPENAI_API_KEY not set on the server' });
    return;
  }
  try {
    const input = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const html = extractHtml(await callOpenAI(buildMessages(input)));
    res.status(200).json({ html, model: OPENAI.model, mountable: looksMountable(html) });
  } catch (e) {
    res.status(502).json({ error: String(e && e.message || e) });
  }
}

module.exports = handler;
module.exports.buildMessages = buildMessages;
module.exports.extractHtml = extractHtml;
module.exports.looksMountable = looksMountable;
module.exports.SDK_SRC = SDK_SRC;
