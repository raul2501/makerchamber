# Technical Preferences

## Platform & Language

- **Platform**: Browser — Chrome desktop primary, iOS Safari + Android Chrome mobile
- **Language**: JavaScript (ES2020+)
- **No TypeScript**: Simplicity is intentional
- **No bundler**: Files served directly, no build step
- **No framework**: Vanilla JS only

## Input & Platform

- **Desktop input**: Keyboard + Mouse
- **Mobile input**: Touch (tap, swipe) — no hover states, no right-click assumptions
- **Gamepad**: Not supported (current games)
- **Primary input**: Keyboard/Mouse on desktop, Touch on mobile

## Naming Conventions

- **Files**: kebab-case (`the-gate.html`, `attention-utils.js`)
- **Variables**: camelCase (`tokenList`, `attentionScore`)
- **Constants**: SCREAMING_SNAKE_CASE (`MAX_TOKENS`, `GRID_SIZE`)
- **Functions**: camelCase, verb-first (`renderTokens`, `calculateAttention`, `handleTap`)
- **CSS classes**: kebab-case (`token-cell`, `attention-bar`)

## Performance Budgets

- **Target framerate**: 60fps on mid-range mobile
- **Frame budget**: 16ms
- **Page weight**: Under 500KB uncompressed (no heavy libraries)
- **Animation**: `requestAnimationFrame` only — no `setInterval` for visual updates

## Mobile Constraints

- Safe area insets: `env(safe-area-inset-top/bottom/left/right)` for fixed/absolute elements near screen edges
- Viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`
- Full-screen height: `100dvh` or `window.innerHeight` — never `100vh` (iOS Safari bug)
- Touch targets: minimum 44×44px interactive area
- Tap delay: `touch-action: manipulation` on all interactive elements

## Forbidden Patterns

- `document.write()`
- Inline event handlers in HTML (`onclick="..."`, `onkeydown="..."`)
- `var` declarations (use `const`/`let`)
- Synchronous localStorage writes in animation loops (debounce writes)
- `100vh` for full-screen layouts (use `100dvh`)

## Allowed Libraries

- Google Fonts CDN (Press Start 2P for City of Tokens)
- Web Audio API (built-in browser API)
- No third-party game libraries without explicit approval

## Architecture Decisions

- Per-level state: each level manages its own `localStorage` key
- No shared runtime between levels: levels are standalone HTML files
- Shared utilities: extract to `shared/` only when the same logic appears in 3+ places
