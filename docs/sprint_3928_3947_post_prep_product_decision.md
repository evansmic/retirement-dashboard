# Sprint S3928-S3947: Post-Prep Product Decision

Status: Complete 2026-06-15.

## Goal

Make the post-prep fork explicit now that private pilot prep artifacts and verification expectations are complete.

## Completed

- Added `OptimizerPostPrepProductDecision`.
- Added `selectOptimizerPostPrepProductDecision`.
- Added the decision checkpoint to bounded optimizer summaries.
- Kept the decision checkpoint forbidden from saved plan files.
- Added next-option rows for:
  - manual private pilot
  - graphical UI planning
  - holding public output closed
- Recommended graphical UI planning when the owner is not immediately running the manual pilot.
- Rendered the checkpoint in Results Details.
- Added focused selector and UI structure guards.

## Boundary

This package does not:

- run the private pilot
- collect pilot evidence
- redesign the UI
- open public optimizer release
- promote production UI
- save optimizer output
- create final annual instructions
- add tax-bracket wording
- open CSV/report sequencing

## Estimate Update

- Retirement answer layer: 0-10 sprints remaining, unchanged.
- Live assumption lab: 0 sprints remaining, unchanged.
- Public-ready optimizer planning: 0 sprints remaining; public release remains closed pending pilot evidence.
- Account-level annual instruction bridge: 0 sprints remaining for internal-review readiness; final instructions and sequencing outputs remain blocked behind future gates.
- Launch hardening/private pilot prep: 0 sprints remaining for prep artifacts; actual pilot execution remains an external/manual step.
- Graphical UI redesign: 20-60 sprints remaining, unchanged but now allowed as the next app-owned planning track if no pilot runs immediately.

## Verification

- Focused bounded optimizer and UI structure tests.
- Whitespace diff check.
- Isolated transpilation check for edited TS/TSX/JS files.

## Next Package

If no manual pilot is being run immediately, begin graphical UI planning around the stable answer layer, master-detail schedule contract, assumption comparison deltas, and blocked-output boundaries. Keep public release, production UI promotion, saved optimizer output, final annual instructions, tax-bracket wording, CSV sequencing, and report sequencing closed.
