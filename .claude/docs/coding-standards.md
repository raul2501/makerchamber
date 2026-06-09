# Coding Standards

## Code Quality

- No commented-out code in committed files
- No `console.log` in committed code (use deliberate debug utilities if needed)
- Keep files focused — a level file handles one level, a utility handles one concern
- Gameplay values defined as named constants at the top of the file, not inline magic numbers
- **Commit messages**: Conventional Commits — `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`. Reference the relevant design doc or task in the commit body.
- **Verification-driven development**: Before marking work complete, verify it in the browser. Every implementation must have a way to prove it works.

## Design Document Standards

- All design docs use Markdown
- Each game has its own directory with its own design docs
- Design documents should include: Overview, Player Fantasy, Detailed Rules, Dynamics, Edge Cases, Dependencies, Tuning Knobs, Acceptance Criteria
- Balance values must link to their source formula or rationale

## Testing Standards

There is no automated test suite. All verification is manual and browser-based.

### Browser Verification Checklist

Before marking any implementation complete:

1. **Console clean**: Open Chrome DevTools → Console. Zero errors, zero uncaught exceptions on page load and during gameplay.
2. **Functional test**: Play through the mechanic manually. Verify it behaves exactly as designed.
3. **localStorage check** (if persistence is involved): DevTools → Application → Local Storage. Verify state is saved correctly and loads correctly on page refresh.
4. **Mobile layout check**: DevTools → Toggle Device Toolbar. Test at 390×844 (iPhone 14) and 412×915 (Pixel 7). Verify layout, touch targets, no horizontal overflow, no clipped content.
5. **Real device spot check** (before shipping to Vercel): Open on an actual iOS or Android device. Touch interactions, safe area behavior, viewport behavior.

### What NOT to Automate

- Visual layout and feel
- Touch interaction quality
- Full gameplay sessions (covered by manual playtesting)

## CI/CD

No automated CI pipeline. Vercel auto-deploys on push to main. Always verify locally in the browser before pushing.
