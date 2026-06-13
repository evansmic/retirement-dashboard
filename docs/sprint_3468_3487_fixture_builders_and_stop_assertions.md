# Sprint S3468-S3487: Fixture Builders And Stop Assertions

Status: Complete 2026-06-13.

## Goal

Implement the synthetic fixture builders and focused stop-condition assertions named by the fixture coverage implementation plan. This package keeps all public optimizer output closed: no public release, real-data tester distribution, production UI, CSV sequencing output, report sequencing output, final annual instructions, tax-bracket wording, schema changes, or `.plan.json` sequencing output.

## Completed

- Added `createOptimizerFixtureCoveragePlans`.
- Added `selectOptimizerFixtureStopAssertionRows`.
- Built five in-memory synthetic fixtures:
  - Couple, staggered retirement
  - Registered-heavy assets
  - Taxable-heavy assets
  - Survivor and estate constraint
  - Thin-data plan
- Added focused assertions that prove fixture count, fixture shape, thin-data stop evidence, and blocked public outputs.
- Added save-file assertions proving fixture planning metadata is stripped from `.plan.json`.

## Stop Assertions

Every fixture carries these required assertions:

- Optimizer stops when context is missing
- Review-only wording is visible
- No saved output
- No CSV output
- No report output
- No final instructions
- No tax-bracket wording

## Verification

- `npm run test:focused`
- `npm test -- app/src/data/planFile.test.ts`
- `npm run build`

The full `npm test` command remains deferred because the current machine has limited free disk space and the full suite previously hung after early passing suites.

## Next Package

Fixture matrix rollup. Connect fixture assertion results back into the unsupported-case coverage matrix so coverage can move from planned gaps to verified synthetic coverage without opening public output.
