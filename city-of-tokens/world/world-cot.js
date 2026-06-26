// world-cot.js — City of Tokens-specific glue around the generic engine:
// the content descriptor (tile map + level manifest), the placeholder renderer,
// the iframe-overlay level entry + completion handshake, and localStorage progression.
//
// Scaling seams (see plan): the manifest is data (add levels/games by adding rows);
// all persistence goes through the save provider; unlock = prereqs && hasAccess.

import { createEngine } from './engine.js';

// ── tile types ──
const GRASS = 0, PATH = 1, TREE = 2, BUILD = 3, DOOR = 4;
const TILE_SIZE = 16;
const TILE_COLORS = {
  [GRASS]: '#3c5a34',
  [PATH]:  '#9b7e4e',
  [TREE]:  '#22381e',
  [BUILD]: '#6b4a2f',
  [DOOR]:  '#2a1d10',
};

// ── the slice map (13 × 11). Two buildings with doors, paths to a start tile. ──
const LEGEND = { 'T': TREE, '.': GRASS, '#': PATH, 'B': BUILD, 'g': DOOR, 'm': DOOR, 'P': PATH };
const MAP_ROWS = [
  'TTTTTTTTTTTTT',
  'T.BBB..BBB..T',
  'T.BBB..BBB..T',
  'T..g....m...T',
  'T..#....#...T',
  'T..######...T',
  'T....#......T',
  'T....#......T',
  'T....P......T',
  'T...........T',
  'TTTTTTTTTTTTT',
];
const DOOR_IDS = { 'g': 'the-gate', 'm': 'the-map-room' };

// parse the ascii map into a tile grid + door lookup + start position
const tiles = [];
const doors = {};            // "x,y" -> levelId
let start = { x: 1, y: 1 };
MAP_ROWS.forEach((row, y) => {
  const line = [];
  [...row].forEach((ch, x) => {
    line.push(LEGEND[ch]);
    if (DOOR_IDS[ch]) doors[`${x},${y}`] = DOOR_IDS[ch];
    if (ch === 'P') start = { x, y };
  });
  tiles.push(line);
});

const COLS = tiles[0].length, ROWS = tiles.length;

const descriptor = {
  cols: COLS, rows: ROWS, tileSize: TILE_SIZE, start,
  blocked: (x, y) => tiles[y][x] === TREE || tiles[y][x] === BUILD,
  doorAt: (x, y) => doors[`${x},${y}`] || null,
};

// building footprints (for labels / lock markers), derived by hand from the map
const BUILDINGS = [
  { id: 'the-gate',     label: 'THE GATE', doorX: 3, topRow: 1 },
  { id: 'the-map-room', label: 'MAP ROOM', doorX: 8, topRow: 1 },
];

// ── level manifest (data; carries gameId + access for future scaling) ──
const MANIFEST = [
  { id: 'the-gate',     gameId: 'cot', url: 'the-gate.html',     requires: [],            access: 'free' },
  { id: 'the-map-room', gameId: 'cot', url: 'the-map-room.html', requires: ['the-gate'],  access: 'free' },
];
const LABEL = Object.fromEntries(MANIFEST.map(m => [m.id, BUILDINGS.find(b => b.id === m.id)?.label || m.id]));

// ── save provider (the ONLY code that touches storage; swap for a server later) ──
const STORE_KEY = 'cot-overworld';
function loadProgress() {
  try {
    const o = JSON.parse(localStorage.getItem(STORE_KEY));
    if (o && o.v === 1 && Array.isArray(o.completed)) return new Set(o.completed);
  } catch { /* ignore corrupt state */ }
  return new Set();
}
const completed = loadProgress();
function persist() { localStorage.setItem(STORE_KEY, JSON.stringify({ v: 1, completed: [...completed] })); }
function markComplete(id) { completed.add(id); persist(); }
function hasAccess(_id) { return true; }   // v1: everything free. Future: ask entitlements backend.
function isUnlocked(id) {
  const e = MANIFEST.find(m => m.id === id);
  return !!e && e.requires.every(r => completed.has(r)) && hasAccess(id);
}

// ── renderer (the draw seam) ──
function draw(ctx, { state, view, descriptor }) {
  const { ox, oy, scale } = view;
  const S = descriptor.tileSize * scale;

  for (let y = 0; y < descriptor.rows; y++) {
    for (let x = 0; x < descriptor.cols; x++) {
      ctx.fillStyle = TILE_COLORS[tiles[y][x]];
      ctx.fillRect(ox + x * S, oy + y * S, Math.ceil(S), Math.ceil(S));
    }
  }

  // building labels + lock / cleared markers
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `${Math.max(6, Math.round(S * 0.3))}px 'Press Start 2P', monospace`;
  for (const b of BUILDINGS) {
    const cx = ox + (b.doorX + 0.5) * S;
    ctx.fillStyle = '#f4e7c1';
    ctx.fillText(b.label, cx, oy + b.topRow * S - S * 0.35);
    const doorPx = ox + b.doorX * S, doorPy = oy + (b.topRow + 2) * S;
    if (completed.has(b.id)) {
      ctx.fillStyle = '#8fd46a';
      ctx.fillText('✓', cx, doorPy + S * 0.72);   // ✓
    } else if (!isUnlocked(b.id)) {
      drawLock(ctx, cx, doorPy + S * 0.5, S * 0.42);
    }
  }

  // player (placeholder sprite: body + facing nub)
  const p = state.entities[0];
  drawPlayer(ctx, ox + p.px * S, oy + p.py * S, S, p.dir);
}

function drawPlayer(ctx, x, y, S, dir) {
  const inset = S * 0.2;
  ctx.fillStyle = '#e0463b';
  ctx.fillRect(x + inset, y + inset, S - inset * 2, S - inset * 2);
  // facing nub (lighter) toward the direction the player faces
  const nub = S * 0.16, mid = x + S / 2 - nub / 2, midY = y + S / 2 - nub / 2;
  const off = S * 0.26;
  const pos = { up: [mid, y + inset + 1], down: [mid, y + S - inset - nub - 1],
                left: [x + inset + 1, midY], right: [x + S - inset - nub - 1, midY] }[dir] || [mid, midY];
  ctx.fillStyle = '#ffd9a0';
  ctx.fillRect(pos[0], pos[1], nub, nub);
}

function drawLock(ctx, cx, cy, r) {
  ctx.fillStyle = '#f2c14e';
  ctx.fillRect(cx - r * 0.7, cy, r * 1.4, r * 1.1);          // body
  ctx.strokeStyle = '#f2c14e';
  ctx.lineWidth = Math.max(1, r * 0.22);
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.55, Math.PI, 0);                      // shackle
  ctx.stroke();
}

// ── overlay (iframe) level entry + completion handshake ──
const canvas = document.getElementById('world');
const overlay = document.getElementById('overlay');
const frame = document.getElementById('level-frame');
const closeBtn = document.getElementById('overlay-close');
const toastEl = document.getElementById('toast');

let toastTimer = 0;
function showToast(msg, ms = 1700) {
  toastEl.textContent = msg;
  toastEl.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastEl.hidden = true; }, ms);
}

function openOverlay(entry) {
  frame.src = entry.url;
  overlay.hidden = false;
  engine.suspendInput(true);
}
function closeOverlay() {
  if (overlay.hidden) return;
  overlay.hidden = true;
  frame.src = 'about:blank';
  engine.suspendInput(false);
  // TD risk: keyboard goes dead after an iframe closes unless the parent re-focuses.
  window.focus();
  canvas.focus();
}

function onEnterDoor(id) {
  const entry = MANIFEST.find(m => m.id === id);
  if (!entry) return;
  if (isUnlocked(id)) {
    openOverlay(entry);
  } else {
    const need = entry.requires.filter(r => !completed.has(r)).map(r => LABEL[r] || r);
    showToast(need.length ? `Locked — clear ${need.join(' & ')} first.` : 'Locked.');
  }
}

function completeLevel(id) {
  const wasNew = !completed.has(id);
  markComplete(id);
  closeOverlay();
  engine.redraw();
  if (wasNew) showToast(`${LABEL[id] || id} cleared!`);
}

window.addEventListener('message', (e) => {
  if (e.origin !== location.origin) return;
  const d = e.data;
  if (d && d.type === 'cot-level-complete') completeLevel(d.id);
});

closeBtn.addEventListener('click', closeOverlay);
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !overlay.hidden) closeOverlay();
});

// ── boot ──
const engine = createEngine({ canvas, descriptor, draw, onEnterDoor });

// ── floating touch joystick: a ghost stick spawns under the finger; the drag
// vector is quantized to one of the 4 grid directions and fed to the engine. ──
const stickBase = document.getElementById('stick-base');
const stickKnob = document.getElementById('stick-knob');
const STICK_MAX = 46;        // px of finger travel for full knob deflection
const STICK_DEADZONE = 12;   // px before any direction registers
let stickPointer = null, stickDir = null, stickOX = 0, stickOY = 0;

function setStickDir(dir) {
  if (dir === stickDir) return;
  if (stickDir) engine.releaseDir(stickDir);
  if (dir) engine.pressDir(dir);
  stickDir = dir;
}
function placeStick(el, x, y) { el.style.left = `${x}px`; el.style.top = `${y}px`; }
function showStick(x, y) {
  stickOX = x; stickOY = y;
  placeStick(stickBase, x, y);
  placeStick(stickKnob, x, y);
  stickBase.hidden = false; stickKnob.hidden = false;
}
function dragStick(x, y) {
  const dx = x - stickOX, dy = y - stickOY;
  const dist = Math.hypot(dx, dy);
  const k = dist ? Math.min(dist, STICK_MAX) / dist : 0;
  placeStick(stickKnob, stickOX + dx * k, stickOY + dy * k);
  if (dist < STICK_DEADZONE) { setStickDir(null); return; }
  setStickDir(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
}
function endStick() {
  setStickDir(null);
  stickPointer = null;
  stickBase.hidden = true; stickKnob.hidden = true;
}

canvas.addEventListener('pointerdown', (e) => {
  if (e.pointerType === 'mouse') return;     // desktop drives with the keyboard
  if (!overlay.hidden) return;               // not while a level overlay is open
  stickPointer = e.pointerId;
  try { canvas.setPointerCapture(e.pointerId); } catch { /* ignore */ }
  showStick(e.clientX, e.clientY);
});
canvas.addEventListener('pointermove', (e) => {
  if (e.pointerId === stickPointer) dragStick(e.clientX, e.clientY);
});
canvas.addEventListener('pointerup', (e) => { if (e.pointerId === stickPointer) endStick(); });
canvas.addEventListener('pointercancel', (e) => { if (e.pointerId === stickPointer) endStick(); });

canvas.setAttribute('tabindex', '0');
engine.start();
canvas.focus();
