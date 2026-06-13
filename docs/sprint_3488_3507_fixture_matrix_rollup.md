# Sprint S3488-S3507: Fixture Matrix Rollup

Status: Complete 2026-06-13.

## Goal

Connect synthetic fixture assertion results back into the unsupported-case coverage matrix. This moves coverage gaps from planned to verified synthetic coverage without opening public optimizer release, real-data tester distribution, production UI, CSV sequencing output, report sequencing output, final annual instructions, tax-bracket wording, schema changes, or `.plan.json` sequencing output.

## Completed

- Added `fixtureMatrixRollup` to bounded optimizer summaries.
- Added `selectOptimizerFixtureMatrixRollup`.
- Connected fixture assertion rows to unsupported-case fixture coverage rows.
- Marked staggered-couple, registered-heavy, taxable-heavy, survivor/estate, and thin-data coverage as verified synthetic when fixture assertions pass.
- Kept single-retired and DB-pension households as prior synthetic beta coverage rather than public-ready coverage.
- Added failure-path coverage proving a failed fixture assertion keeps the related row planned only.
- Extended plan-file tests so the rollup cannot be serialized into `.plan.json`.

## Rollup States

- `verifiedSynthetic`: fixture builder and no-output assertions pass.
- `coveredByPriorSyntheticBeta`: existing synthetic beta coverage exists, but not public-ready coverage.
- `plannedOnly`: fixture evidence is missing or failing.

## Verification

- `npm run test:focused`
- `npm test -- app/src/data/planFile.test.ts`
- `npm run build`

The full `npm test` command remains deferred because the current machine has limited free disk space and the full suite previously hung after early passing suites.

## Next Package

Release-control validation. Define the final release-control checks needed before any public optimizer output can be reconsidered.
