# Sprint S3768-S3787: Limited Public Beta Decision

Status: Complete 2026-06-14.

## Goal

Make the final current public-ready optimizer decision: choose whether to open a limited public beta or keep public optimizer output closed.

## Decision

Do not open limited public beta yet.

The optimizer beta surface is scoped, the copy and output contracts are defined, and the release gate is explicit. However, no opt-in household pilot evidence has been collected, so public optimizer output remains closed.

## Completed

- Added `OptimizerLimitedPublicBetaDecision`.
- Added `selectOptimizerLimitedPublicBetaDecision`.
- Added `limitedPublicBetaDecision` to the bounded optimizer summary.
- Kept `limitedPublicBetaDecision` forbidden from saved plan files.
- Rendered the limited public beta/no-release decision in Results Details.
- Recorded public-ready optimizer planning as complete while public release remains closed pending pilot evidence.

## Candidate Future Beta Surface

If pilot evidence later clears the gate, the smallest candidate public beta surface is:

- Overview answer rows.
- Details review direction.
- Assumption comparison deltas.
- Private-pilot copy only.

This is a candidate surface only. It is not opened by this package.

## Blocked Public Outputs

These remain blocked:

- Saved optimizer output.
- CSV sequencing output.
- Report sequencing output.
- Production UI promotion.
- Final annual instructions.
- Tax-bracket wording.
- Account-level withdrawal instructions.

## Boundary

This final decision closes public-ready optimizer planning only. It does not open public optimizer release, run pilots, collect tester data, promote production UI, save optimizer output, create CSV/report sequencing, create final annual instructions, add tax-bracket wording, add account-level withdrawal instructions, change saved schema, change engine output schema, or write optimizer output to `.plan.json`.

## Estimate Update

- Retirement answer layer: 0-10 sprints remaining, unchanged.
- Live assumption lab: 0 sprints remaining, unchanged.
- Public-ready optimizer planning: 0 sprints remaining; public release remains closed pending pilot evidence.
- Graphical UI redesign: 20-60 sprints remaining, unchanged and still deferred.
- Launch hardening: 5-15 sprints remaining, unchanged.

## Verification

- `npm run test:focused`

## Next Package

Move to launch hardening and actual private pilot execution prep while keeping public optimizer output closed.
