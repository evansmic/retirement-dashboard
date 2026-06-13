# Sprint S3408-S3427: Public Safety Validation

Status: Complete 2026-06-13.

## Goal

Define the minimum public safety validation boundary before any public optimizer output opens. This package keeps the optimizer closed for public use while making review-only wording, stop conditions, unsupported-case gaps, scenario coverage gaps, real-data tester limits, and release controls explicit.

## Completed

- Added `publicSafetyValidation` to bounded optimizer summaries.
- Marked public optimizer release as closed with `keepPublicOptimizerClosed`.
- Added safety rows for review-only wording, stop conditions, unsupported-case handling, scenario coverage, real-data tester distribution, and release controls.
- Added explicit stop conditions for missing tax context, missing constraint context, ambiguous account evidence, unsupported household shapes, tester confusion, and export/report expectations.
- Surfaced the validation packet in Results Details.
- Extended plan-file tests so the public safety packet cannot be serialized into `.plan.json`.

## Ready Evidence

- Review-only wording is framed.
- Stop conditions are named.

## Still Blocked

- Unsupported-case handling.
- Broader scenario coverage.
- Real-data tester distribution.
- Public release controls.

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

Unsupported-case and scenario coverage package. Define the concrete unsupported-case matrix and broader fixture coverage needed before a public optimizer release decision can be revisited.
