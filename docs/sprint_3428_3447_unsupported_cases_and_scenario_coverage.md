# Sprint S3428-S3447: Unsupported Cases And Scenario Coverage

Status: Complete 2026-06-13.

## Goal

Turn the public safety blockers into a concrete unsupported-case and scenario coverage matrix before any public optimizer release decision is revisited. This remains planning evidence only; it does not open public release, real-data tester distribution, production UI, exports, reports, final annual instructions, tax-bracket wording, schema changes, or `.plan.json` sequencing output.

## Completed

- Added `unsupportedCaseCoverage` to bounded optimizer summaries.
- Added unsupported-case rows for household shape, account evidence, tax context, constraint context, survivor/estate behavior, benefit timing, and cash-flow stress.
- Added fixture coverage rows for single retired, staggered couple retirement, DB pension household, registered-heavy, taxable-heavy, survivor/estate constraint, and thin-data plans.
- Marked basic synthetic beta coverage separately from fixture gaps.
- Surfaced the matrix in Results Details.
- Extended plan-file tests so the coverage matrix cannot be serialized into `.plan.json`.

## Coverage Matrix

Unsupported cases now require rules or fixtures for:

- Household shape
- Account evidence
- Tax context
- Constraint context
- Survivor and estate behavior
- Benefit timing
- Cash-flow stress

Fixture gaps now include:

- Couple, staggered retirement
- Registered-heavy assets
- Taxable-heavy assets
- Survivor and estate constraints
- Thin-data plans

## Blocked Outputs

- Public optimizer release
- Real-data tester distribution
- Production UI
- CSV sequencing output
- Report sequencing output
- Final annual instructions
- Tax-bracket wording
- Saved plan schema changes
- Engine output schema changes
- `.plan.json` sequencing output

## Verification

- `npm run test:focused`
- `npm test -- app/src/data/planFile.test.ts`
- `npm run build`

The full `npm test` command remains deferred because the current machine has limited free disk space and the full suite previously hung after early passing suites.

## Next Package

Fixture coverage implementation planning. Define the concrete synthetic fixtures and stop-condition assertions needed to start closing the coverage gaps without opening public output.
