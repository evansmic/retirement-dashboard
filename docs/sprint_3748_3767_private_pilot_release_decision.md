# Sprint S3748-S3767: Private Pilot Release Decision

Status: Complete 2026-06-14.

## Goal

Define the private pilot copy review and release/no-release decision gate before any public optimizer output is reconsidered.

## Completed

- Added `OptimizerPrivatePilotReleaseDecision`.
- Added `selectOptimizerPrivatePilotReleaseDecision`.
- Added `privatePilotReleaseDecision` to the bounded optimizer summary.
- Kept `privatePilotReleaseDecision` forbidden from saved plan files.
- Rendered the private pilot release decision gate in Results Details.
- Updated the tracker so public-ready optimizer is narrowed to a final 0-1 sprint release/no-release decision.

## Decision Threshold

Before a limited public beta can be considered:

- Review three to five opt-in private households.
- Require at least three clean reviews.
- Allow zero unresolved stop conditions.
- Keep focused tests, production build, and the low-storage full-suite runner as the verification baseline.

## Required Evidence

- Tester understands optimizer output as review-only comparison evidence.
- Tester can explain whether the answer layer helps retirement timing, spending capacity, benefit timing, tax pressure, and risk review.
- Tester can use side-by-side deltas, including after-tax spending capacity, without needing saved scenario packages.
- Missing tax, account, survivor, estate, benefit, cash-flow, or housing context is logged before release is reconsidered.

## Stop Conditions

Stop release if any of these remain unresolved:

- Tester treats review direction, annual rows, or comparison deltas as steps to follow.
- Tester expects a final recommendation, guarantee, or personalized financial advice.
- Tester expects tax-bracket targets, exact withdrawal amounts, or account-by-account annual instructions.
- Tester expects optimizer output, sequencing output, or candidate decisions to be saved, exported, or printed.
- Missing spouse, pension, tax, account, housing, survivor, or estate context materially changes the answer.

## Boundary

This package defines a release-decision gate only. It does not run the pilot, collect tester data, open public optimizer release, promote production UI, save optimizer output, create CSV/report sequencing, create final annual instructions, add tax-bracket wording, add account-level withdrawal instructions, change saved schema, change engine output schema, or write optimizer output to `.plan.json`.

## Estimate Update

- Retirement answer layer: 0-10 sprints remaining, unchanged.
- Live assumption lab: 0 sprints remaining, unchanged.
- Public-ready optimizer: 0-1 sprint remaining, tightened from 0-2 because the final release/no-release gate is now explicit.
- Graphical UI redesign: 20-60 sprints remaining, unchanged and still deferred.
- Launch hardening: 5-15 sprints remaining, unchanged.

## Verification

- `npm run test:focused`
- `npm run build`

## Next Package

Choose the final path: keep public optimizer output closed, or define the smallest limited public beta surface that can ship without saved optimizer output, final instructions, tax-bracket wording, or account-level withdrawal instructions.
