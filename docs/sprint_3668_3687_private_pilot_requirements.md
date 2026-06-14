# Sprint S3668-S3687: Private Pilot Requirements

Status: Complete 2026-06-14.

## Goal

Implement the private pilot requirements named by release narrowing: opt-in copy requirements, privacy boundaries, stop conditions, tester limits, and evidence rows for deciding whether public optimizer output can later be reconsidered.

## Completed

- Added `OptimizerPrivatePilotRequirements` and requirement/evidence rows.
- Defined required opt-in copy, privacy boundary, stop conditions, tester limits, and evidence criteria.
- Limited pilot scope to a maximum of five private opt-in households.
- Required explicit opt-in before any real data is used.
- Required evidence for:
  - Review-only comprehension
  - No instruction confusion
  - Answer usefulness
  - Comparison usefulness
  - Missing context logging
- Rendered private pilot requirements in Results Details.
- Kept pilot requirements out of saved plan files.

## Product Decision

Private pilot planning may proceed only as requirements and evidence criteria. This package does not open a pilot workflow, collect tester data, distribute real-data builds, or reconsider public output. It names the evidence that would be needed before public optimizer output can be discussed again.

## Boundary

This package defines pilot requirements only. It does not collect tester data, distribute real-data pilots, open public optimizer release, add production UI, create exports or reports, create final annual instructions, add tax-bracket wording, change saved schema, or write optimizer output to `.plan.json`.

## Estimate Update

- Retirement answer layer: 0-10 sprints remaining, unchanged.
- Live assumption lab: 0 sprints remaining, unchanged.
- Public-ready optimizer: 0-5 sprints remaining, tightened from 0-10 because private pilot requirements are now defined.
- Graphical UI redesign: 20-60 sprints remaining, unchanged and still deferred.
- Launch hardening: 10-30 sprints remaining, unchanged.

## Verification

- `npm run test:focused`
- `npm test -- app/src/engine/boundedOptimizer.test.ts`
- `npm test -- app/src/engine/resultSelectors.test.ts`
- `npm run build`

The full `npm test` command remains deferred because the current machine has limited free disk space and the full suite previously hung after early passing suites.

## Next Package

Recover or replace the deferred full `npm test` path on the current low-storage machine so the final public-output decision is not blocked by unreliable verification.
