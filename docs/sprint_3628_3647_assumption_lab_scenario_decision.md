# Sprint S3628-S3647: Assumption Lab Scenario Decision

Status: Complete 2026-06-14.

## Goal

Make the assumption-lab scenario-scope decision explicit before the graphical redesign. The app should say whether beta supports named multi-assumption scenarios or stays with a single temporary applied adjustment that informs the optimal plan from a given assumption set.

## Completed

- Added `AssumptionLabScenarioDecision` and decision rows to the selector contract.
- Selected one temporary applied adjustment at a time as the beta assumption-lab scope.
- Deferred named multi-assumption scenario sets until pilot evidence proves users need saved assumption packages.
- Kept scenario results and applied assumption state out of saved plan files.
- Added scenario-scope decision rendering inside the Details assumption lab.
- Added selector and UI structure guards for the decision rows.

## Product Decision

The beta lab stays intentionally narrow: one applied assumption can be tested at a time, with comparison cards showing how the optimal review path and alternatives move. Named multi-assumption scenarios are deferred because they add persistence, scenario management, explanation, and redesign work before pilot evidence proves that users need saved assumption packages.

## Boundary

This package does not create saved scenarios, persist scenario output, save applied assumptions, create account instructions, add final advice language, or promote public optimizer output. The optimal review path remains comparison evidence only.

## Estimate Update

- Retirement answer layer: 0-10 sprints remaining, unchanged.
- Live assumption lab: 0 sprints remaining for beta scope, closed from 0-10.
- Public-ready optimizer: 0-20 sprints remaining, unchanged.
- Graphical UI redesign: 20-60 sprints remaining, unchanged and still deferred.
- Launch hardening: 10-30 sprints remaining, unchanged.

## Verification

- `npm run test:focused`
- `npm test -- app/src/engine/resultSelectors.test.ts`
- `npm test -- app/src/engine/previewScenarios.test.ts`
- `npm run build`

The full `npm test` command remains deferred because the current machine has limited free disk space and the full suite previously hung after early passing suites.

## Next Package

Use the completed beta optimizer, retirement answer layer, and closed assumption lab scope to narrow the remaining public-ready optimizer blockers into a concrete release decision path.
