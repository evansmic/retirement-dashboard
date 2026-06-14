# Sprint S3508-S3527: Release-Control Validation

Status: Complete 2026-06-13.

## Goal

Define the final release-control checks needed before any public optimizer output can be reconsidered. This package keeps public release closed and does not open real-data tester distribution, production UI, CSV sequencing output, report sequencing output, final annual instructions, tax-bracket wording, schema changes, or `.plan.json` sequencing output.

## Completed

- Added `releaseControlValidation` to bounded optimizer summaries.
- Added `selectOptimizerReleaseControlValidation`.
- Marked verified synthetic fixture coverage as ready evidence.
- Kept real-data opt-in, production UI flagging, export/report output, final wording, schema migration, and full-suite recovery blocked.
- Surfaced release controls in Results Details.
- Extended plan-file tests so release-control validation cannot be serialized into `.plan.json`.

## Release Controls

- Fixture coverage: ready
- Real-data opt-in: blocked
- Production UI flag: blocked
- Export/report lock: blocked
- Final wording lock: blocked
- Schema migration lock: blocked
- Full-suite recovery: blocked

## Verification

- `npm run test:focused`
- `npm test -- app/src/data/planFile.test.ts`
- `npm run build`

The full `npm test` command remains deferred because the current machine has limited free disk space and the full suite previously hung after early passing suites.

## Next Package

Final public-readiness decision. Use the completed beta, fixture coverage, and release-control evidence to decide whether the public optimizer remains closed, moves to a narrow private real-data pilot, or needs additional validation first.
