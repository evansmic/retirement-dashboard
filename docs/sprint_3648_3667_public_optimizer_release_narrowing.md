# Sprint S3648-S3667: Public Optimizer Release Narrowing

Status: Complete 2026-06-14.

## Goal

Use the completed beta optimizer, retirement answer layer, and closed assumption lab beta scope to narrow the remaining public-ready optimizer blockers into a concrete release decision path.

## Completed

- Added `OptimizerPublicReleaseNarrowing` and release-path rows.
- Connected release narrowing to the final public-readiness decision.
- Marked ready evidence from:
  - Feature-complete beta
  - Synthetic fixture coverage
  - Release controls
  - Retirement answer layer
  - Assumption lab beta scope
- Narrowed blockers to:
  - Private pilot evidence
  - Full-suite recovery
  - Public copy review
  - Output-contract decision
- Rendered release narrowing in Results Details.
- Kept release narrowing out of saved plan files.

## Product Decision

The optimizer is still closed for public release, but the remaining path is now narrow enough to work directly: implement private pilot requirements, recover full-suite reliability, review public-facing wording, and decide output contracts before public optimizer output is reconsidered.

## Boundary

This package narrows the release path only. It does not open public optimizer release, real-data tester distribution, production UI, CSV sequencing output, report sequencing output, final annual instructions, tax-bracket wording, saved schema changes, engine output schema changes, or `.plan.json` sequencing output.

## Estimate Update

- Retirement answer layer: 0-10 sprints remaining, unchanged.
- Live assumption lab: 0 sprints remaining, unchanged.
- Public-ready optimizer: 0-10 sprints remaining, tightened from 0-20 because the remaining path is now private pilot requirements plus full-suite/public-output gates.
- Graphical UI redesign: 20-60 sprints remaining, unchanged and still deferred.
- Launch hardening: 10-30 sprints remaining, unchanged.

## Verification

- `npm run test:focused`
- `npm test -- app/src/engine/boundedOptimizer.test.ts`
- `npm test -- app/src/engine/resultSelectors.test.ts`
- `npm run build`

The full `npm test` command remains deferred because the current machine has limited free disk space and the full suite previously hung after early passing suites.

## Next Package

Implement private pilot requirements: opt-in copy, privacy boundaries, stop conditions, tester limits, and evidence rows for deciding whether public output can later be reconsidered.
