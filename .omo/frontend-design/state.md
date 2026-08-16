# Frontend Design State

## Current Objective

Build and publicly deploy a React/Vite Storybook that teaches the full Source -> Moodboard -> Rule -> Component workflow.

## Locked Decisions

- Cream paper surfaces, functional cobalt accents, soft rectangular double-bezel panels.
- Node LTS and npm.
- External assets must be CC0/Public Domain; original project SVG is preferred for deterministic licensing.
- Public GitHub repository and a new Netlify site are authorized using local login state.
- Secrets, billing changes, and unrelated external operations are prohibited.

## Source Inputs

- `DESIGN.md`
- `docs/references/taste-archive-concept.png`
- Embedded references: `soft-skill.md`, `coinbase.md`
- UI/UX DB query recorded in `DESIGN.md`

## Design Brief

The interface is a quiet curator's worktable. It must explain provenance, not merely display attractive images. The primary journey is selecting one reference and tracing it to a moodboard, rules, and component decisions.

## Inclusive Personas

- Visual maker: needs a clear, learnable evidence chain and tangible examples.
- Keyboard/screen-reader maker: needs all selection and provenance relations exposed semantically without relying on connectors, hover, or color.
- Motion-sensitive maker: needs identical understanding with reduced motion enabled.

## Adaptive Preferences

- Keyboard, screen reader, 200% zoom, 375px width, and reduced motion are required.
- Korean and English text must wrap naturally without orphaned short phrases.

## Verification Matrix

- Typecheck, unit/integration tests, app build, Storybook build.
- Real-browser Storybook Canvas/Controls/Docs at 375px, 768px, and 1280px.
- Keyboard focus and source-selection provenance scenario.
- Visual QA dual reviewer on fresh screenshots.
- Deployed URL smoke test, GitHub repository visibility, and Netlify main-branch deployment link.

## Design Debt Register

None accepted.

## Evidence Index

Evidence will be recorded under `.omo/evidence/storybook-taste-archive/`.
