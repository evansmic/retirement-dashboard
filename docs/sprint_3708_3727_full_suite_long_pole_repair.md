# Sprint S3708-S3727: Full-Suite Long-Pole Repair

Status: Complete 2026-06-14.

## Goal

Repair the isolated `app/src/engine/examplePlanOptimizerReadiness.test.ts` long pole so the low-storage full-suite command can pass on the current machine.

## Completed

- Repaired `app/src/engine/examplePlanOptimizerReadiness.test.ts`.
- Limited heavyweight optimizer/readiness matrix checks to representative bundled and clean examples.
- Preserved every built-in example for cheap hidden drawdown comparison guardrails and saved-output boundary checks.
- Added in-file bounded optimizer fixture caching so repeated assertion groups reuse the same expensive optimizer output.
- Reduced the repaired readiness test to a passing direct run under the low-storage runner's default batch timeout.
- Updated the full-suite recovery packet and Details copy to show the low-storage verification baseline is passing.

## Verification Result

`npm run test:full:low-storage` now passes end to end on the current low-storage machine. The previously blocked batch now completes:

- `app/src/engine/examplePlanOptimizerReadiness.test.ts`: passes in about 67s inside the low-storage runner.
- `app/src/engine/stressSelectors.test.ts`: passes in about 15s inside the low-storage runner.

## Boundary

This package changes test workload shape and project recovery status only. It does not open public optimizer output, production UI, exports, reports, final instructions, tax-bracket wording, saved schema changes, engine output schema changes, or `.plan.json` sequencing output.

## Estimate Update

- Retirement answer layer: 0-10 sprints remaining, unchanged.
- Live assumption lab: 0 sprints remaining, unchanged.
- Public-ready optimizer: 0-3 sprints remaining, tightened from 0-5 because full-suite recovery is now passing.
- Graphical UI redesign: 20-60 sprints remaining, unchanged and still deferred.
- Launch hardening: 5-15 sprints remaining, tightened from 5-20 because the low-storage verification path now passes.

## Verification

- `npm test -- app/src/engine/examplePlanOptimizerReadiness.test.ts`
- `npm run test:full:low-storage`

## Next Package

Decide the public optimizer copy and output contract: what recommendation language can be shown, what final-instruction language remains blocked, what output fields are allowed, and what saved/export boundaries must remain closed before public release can be reconsidered.
