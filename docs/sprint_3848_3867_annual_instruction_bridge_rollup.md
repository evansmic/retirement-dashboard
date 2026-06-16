# Sprint S3848-S3867: Annual Instruction Bridge Rollup

Status: Complete 2026-06-15.

## Goal

Close the account-level annual instruction bridge with a final internal-readiness rollup: what is available for review, what remains blocked, and what evidence is required before real final instructions or sequencing outputs can open.

## Completed

- Extended `MasterDetailScheduleContract` with `readinessRollup`.
- The rollup identifies what is available for review:
  - public master-detail CSV
  - schedule contract
  - report placement contract
  - internal sequencing evidence when present
- The rollup keeps these blocked:
  - final annual instructions
  - account-level withdrawal commands
  - tax-bracket wording
  - saved sequencing output
  - CSV sequencing output
  - report sequencing output
- Added required-before-open gates:
  - row quality
  - wording safety
  - public output gate
  - saved schema decision
  - pilot evidence
- Rendered the annual instruction bridge rollup in Save & print.
- Added selector and UI structure guards.

## Boundary

This package closes the internal-review bridge only. It does not:

- create final annual instructions
- create account-level withdrawal commands
- add tax-bracket wording
- save sequencing output
- open CSV sequencing output
- open report sequencing output
- change `.plan.json`
- open public optimizer release

## Estimate Update

- Retirement answer layer: 0-10 sprints remaining, unchanged.
- Live assumption lab: 0 sprints remaining, unchanged.
- Public-ready optimizer planning: 0 sprints remaining; public release remains closed pending pilot evidence.
- Account-level annual instruction bridge: 0 sprints remaining for internal-review readiness; final instructions and sequencing outputs remain blocked behind future gates.
- Graphical UI redesign: 20-60 sprints remaining, unchanged and still deferred.
- Launch hardening/private pilot prep: 5-15 sprints remaining, unchanged.

## Verification

- Focused result selector and UI structure tests.
- Whitespace diff check.
- Isolated transpilation check for edited TS/TSX/JS files.

## Next Package

Return to product readiness choices: either start private pilot prep/launch hardening, or begin shaping the future graphical UI around the now-stable answer and schedule evidence contracts. Keep public optimizer release, final annual instructions, tax-bracket wording, saved sequencing, CSV sequencing, and report sequencing closed until their own gates open.
