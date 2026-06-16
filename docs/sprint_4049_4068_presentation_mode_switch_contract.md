# Sprint 4049-4068 - Presentation Mode Switch Contract

## Goal

Define how each retirement answer module can switch between answer card, graphic, and data sheet views without changing saved plan data.

## Completed

- Added a typed `RetirementPresentationModeSwitch` contract.
- Each presentation module now has a runtime-only mode switch with:
  - available modes,
  - default mode,
  - card label,
  - graph label,
  - data-sheet label,
  - status,
  - no-persistence flag,
  - no-rerun flag,
  - and a saved-data boundary.
- Detail-toggle modules default to data-sheet mode; all other modules default to answer-card mode.
- Surfaced the mode-switch contract in the presentation-planning band.
- Added focused selector and UI structure coverage.

## Boundaries

This sprint does not redesign the UI, create production charts, add saved view preferences, save scenarios, rerun the optimizer, open public optimizer output, create account-level annual instructions, change saved schema, or create advice language.

## Verification

- Focused selector test.
- Focused UI structure test.
- `npm run build` must pass before commit because the prior package exposed Vercel TypeScript issues.

## Estimate Update

- Graphical UI redesign: 14-48 sprints remaining.
- Account-level annual instructions: still blocked pending pilot evidence, performance proof, and output-contract decisions.
- Public-ready optimizer: still blocked pending private pilot evidence and release decision.

## Next Package

Define the assumption-rerun progress contract that connects sliders/steppers to optimizer rerun states without saving temporary scenario output.
