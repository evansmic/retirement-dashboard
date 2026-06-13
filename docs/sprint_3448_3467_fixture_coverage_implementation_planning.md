# Sprint S3448-S3467: Fixture Coverage Implementation Planning

Status: Complete 2026-06-13.

## Goal

Turn the unsupported-case coverage matrix into concrete synthetic fixture and stop-condition assertion requirements. This package authorizes only synthetic fixture builders and focused assertions; it does not open public optimizer release, real-data tester distribution, production UI, CSV sequencing output, report sequencing output, final annual instructions, tax-bracket wording, schema changes, or `.plan.json` sequencing output.

## Completed

- Added `fixtureCoverageImplementationPlan` to bounded optimizer summaries.
- Defined five fixture rows: staggered couple retirement, registered-heavy assets, taxable-heavy assets, survivor/estate constraint, and thin-data plan.
- Defined shared assertions for each fixture: stop on missing context, review-only wording, no saved output, no CSV output, no report output, no final instructions, and no tax-bracket wording.
- Added stop-condition assertion rows for missing context, ambiguous evidence, unsupported household shape, tester confusion, and export/report expectations.
- Added implementation batches for fixture builders, stop assertions, matrix rollup, and docs/verification.
- Surfaced the plan in Results Details.
- Extended plan-file tests so the implementation plan cannot be serialized into `.plan.json`.

## Fixture Rows

- Couple, staggered retirement
- Registered-heavy assets
- Taxable-heavy assets
- Survivor and estate constraint
- Thin-data plan

## Assertion Rows

- Missing context stop
- Ambiguous evidence stop
- Unsupported household stop
- Tester confusion stop
- Export expectation stop

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

Fixture builders and stop assertions. Implement the synthetic fixture builders and focused assertions named by this plan while public output remains closed.
