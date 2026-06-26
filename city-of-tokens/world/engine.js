// engine.js — reusable, game-agnostic top-down grid engine (Canvas 2D).
//
// Everything here is generic: the rAF loop, keyboard/d-pad input, grid-based
// tile movement with tween + input buffering, AABB tile collision, a fit-to-screen
// camera, and DPR-aware sizing. ALL drawing happens through the `draw(ctx, frame)`
// seam the game passes in — this module never knows about City of Tokens. Swapping
// to a different renderer (PixiJS/WebGL) later means replacing only `draw`.
//
// World state is an ENTITY LIST (`state.entities`) so networked remote players can
// later be added as more entities without touching this loop or the renderer.

const STEP_MS = 170;            // ms per one-tile step (grid-move tween)
const ease = t => t;            // linear feels right for retro grid movement

const KEYMAP = {
  ArrowUp: 'up', KeyW: 'up',
  ArrowDown: 'down', KeyS: 'down',
  ArrowLeft: 'left', KeyA: 'left',
  ArrowRight: 'right', KeyD: 'right',
};
const DELTA = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

// descriptor: { cols, rows, tileSize, start:{x,y}, blocked(tx,ty), doorAt(tx,ty) }
// draw(ctx, { state, view, descriptor })
// onEnterDoor(doorId) — fired once when a step completes onto a door tile
export function createEngine({ canvas, descriptor, draw, onEnterDoor }) {
  const ctx = canvas.getContext('2d');
  const { cols, rows, tileSize } = descriptor;

  const player = {
    tx: descriptor.start.x, ty: descriptor.start.y,
    fromX: descriptor.start.x, fromY: descriptor.start.y,
    px: descriptor.start.x, py: descriptor.start.y,
    dir: 'down', moving: false, t: 0,
  };
  const state = { entities: [player] };

  // ── camera / sizing (fit whole map, centered) ──
  let view = { ox: 0, oy: 0, scale: 1, dpr: 1, tileSize };
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const cssW = canvas.clientWidth, cssH = canvas.clientHeight;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    // v1 uses flat placeholder rects, so a fractional fit-scale is fine and fills
    // the screen. When real sprite-sheets land, switch to an INTEGER scale (+ a
    // camera that follows the player) so scaled pixels stay crisp / shimmer-free.
    const scale = Math.min(cssW / (cols * tileSize), cssH / (rows * tileSize));
    const mapW = cols * tileSize * scale, mapH = rows * tileSize * scale;
    view = { ox: (cssW - mapW) / 2, oy: (cssH - mapH) / 2, scale, dpr, tileSize };
    requestRender();
  }

  // ── input: held directions (keyboard + external d-pad), most-recent wins ──
  const held = [];
  let inputSuspended = false;

  function pressDir(dir) {
    if (inputSuspended || !DELTA[dir]) return;
    if (!held.includes(dir)) held.push(dir);
    player.dir = dir;
    ensureRunning();
  }
  function releaseDir(dir) {
    const i = held.indexOf(dir);
    if (i >= 0) held.splice(i, 1);
  }
  function onKeyDown(e) {
    const d = KEYMAP[e.code];
    if (!d) return;
    e.preventDefault();
    pressDir(d);
  }
  function onKeyUp(e) {
    const d = KEYMAP[e.code];
    if (d) releaseDir(d);
  }

  function tryStep(dir) {
    if (player.moving) return;
    player.dir = dir;
    const [dx, dy] = DELTA[dir];
    const nx = player.tx + dx, ny = player.ty + dy;
    if (nx < 0 || ny < 0 || nx >= cols || ny >= rows || descriptor.blocked(nx, ny)) {
      requestRender();           // face the obstacle, but don't move
      return;
    }
    player.fromX = player.tx; player.fromY = player.ty;
    player.tx = nx; player.ty = ny;
    player.t = 0; player.moving = true;
  }

  // ── loop (runs only while moving or input held; idles otherwise) ──
  let running = false, last = 0, needsRender = true;
  function requestRender() { needsRender = true; ensureRunning(); }
  function ensureRunning() {
    if (running) return;
    running = true; last = performance.now();
    requestAnimationFrame(tick);
  }
  function tick(now) {
    const dt = now - last; last = now;
    update(dt);
    if (needsRender || player.moving) { render(); needsRender = false; }
    if (player.moving || held.length) {
      requestAnimationFrame(tick);
    } else {
      running = false;           // nothing to animate — stop burning frames
    }
  }
  function update(dt) {
    if (player.moving) {
      player.t += dt / STEP_MS;
      if (player.t >= 1) {
        player.t = 1; player.moving = false;
        player.fromX = player.tx; player.fromY = player.ty;
        const id = descriptor.doorAt(player.tx, player.ty);
        if (id && onEnterDoor) onEnterDoor(id);
      }
    }
    if (!player.moving && !inputSuspended && held.length) {
      tryStep(held[held.length - 1]);
    }
  }
  function render() {
    const { dpr } = view;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
    const lerp = (a, b, t) => a + (b - a) * t;
    player.px = lerp(player.fromX, player.tx, ease(player.t));
    player.py = lerp(player.fromY, player.ty, ease(player.t));
    draw(ctx, { state, view, descriptor });
  }

  function suspendInput(v) {
    inputSuspended = v;
    if (v) held.length = 0;      // drop held keys so movement doesn't resume on close
  }

  function start() {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', resize);
    resize();
    ensureRunning();
  }

  return {
    start, resize, pressDir, releaseDir, suspendInput,
    redraw: requestRender,
    getState: () => state,
    getView: () => view,
  };
}
