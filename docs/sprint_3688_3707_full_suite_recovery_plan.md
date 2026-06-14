# Sprint S3688-S3707: Full-Suite Recovery Plan

Status: Complete 2026-06-14.

## Goal

Recover or replace the deferred full `npm test` path on the current low-storage machine so the final public-output decision is not blocked by unreliable verification.

## Completed

- Added `scripts/run_full_suite_low_storage.mjs`.
- Added `npm run test:full:low-storage`.
- Added `TEST_BATCH_SIZE` support for grouped batches.
- Added `TEST_BATCH_TIMEOUT_MS` support for per-batch timeout diagnostics.
- Added `OptimizerFullSuiteRecoveryPlan` and recovery rows.
- Rendered full-suite recovery in Results Details.
- Added structure guards for the npm script, runner script, and recovery panel.
- Confirmed the low-storage runner advances through most batches and reports timeout batches instead of hanging indefinitely.

## Diagnostic Result

`TEST_BATCH_TIMEOUT_MS=15000 npm run test:full:low-storage` completed the remaining batches and reported timeout failures instead of hanging. The unresolved long pole is:

- `app/src/engine/examplePlanOptimizerReadiness.test.ts`

The same diagnostic also timed out `app/src/engine/stressSelectors.test.ts` with a 15s limit, but `npm test -- app/src/engine/stressSelectors.test.ts` passes directly in about 13s. That file needs timeout headroom, not immediate repair.

## Boundary

This package adds a verification runner and recovery packet only. It does not open public optimizer release, production UI, exports, reports, final annual instructions, tax-bracket wording, saved schema changes, engine output schema changes, or `.plan.json` sequencing output.

## Estimate Update

- Retirement answer layer: 0-10 sprints remaining, unchanged.
- Live assumption lab: 0 sprints remaining, unchanged.
- Public-ready optimizer: 0-5 sprints remaining, unchanged because the long-pole test still needs repair or splitting.
- Graphical UI redesign: 20-60 sprints remaining, unchanged and still deferred.
- Launch hardening: 5-20 sprints remaining, tightened from 10-30 because full-suite recovery now has a concrete low-storage runner and isolated long pole.

## Verification

- `node --check scripts/run_full_suite_low_storage.mjs`
- `npm run test:focused`
- `npm test -- app/src/engine/boundedOptimizer.test.ts`
- `npm test -- app/src/engine/stressSelectors.test.ts`
- `TEST_BATCH_TIMEOUT_MS=15000 npm run test:full:low-storage` failed as expected with timeout diagnostics for the long-pole batch.
- `npm run build`

## Next Package

Repair or split `app/src/engine/examplePlanOptimizerReadiness.test.ts` so `npm run test:full:low-storage` can pass on the current low-storage machine.
