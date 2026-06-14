# Sprint S3588-S3607: Live Assumption Rerun Queue

Status: Complete 2026-06-13.

## Goal

Turn the assumption lab from a static contract into a local preview loop. Details controls should adjust a working copy, show progress while rerunning, and refresh the optimal review path and comparison slots without saving scenario output.

## Completed

- Added runtime preview config overrides to `runResultsPreviewBundle`.
- Added local `AssumptionLabPreviewState` in Results.
- Added working-copy adjustment for:
  - Retirement age
  - Early spending
  - Residence sale date
  - Survivor year
- Added config-only overrides for:
  - CPP/OAS timing
  - Investment return
- Enabled assumption lab range controls.
- Added progress feedback while the local preview reruns.
- Refreshed the assumption lab comparison slots from the adjusted preview after rerun.
- Kept the main editable plan unchanged.
- Kept scenario output out of `.plan.json`.

## Boundary

This package reruns local preview assumptions only. It does not save scenario output, create account instructions, add final advice language, or promote public optimizer output. The optimal review path is still a modelled comparison from the current assumption set, not personal financial advice.

## Estimate Update

- Retirement answer layer: 0-10 sprints remaining, unchanged.
- Live assumption lab: 5-20 sprints remaining, tightened from 10-30 because the local rerun loop now exists.
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

Improve the live assumption lab comparison experience: add debouncing or explicit apply controls, show the adjusted assumption summary, and make the two alternatives clearer against the optimal review path.
