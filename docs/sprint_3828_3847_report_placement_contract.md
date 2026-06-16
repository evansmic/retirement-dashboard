# Sprint S3828-S3847: Report Placement Contract

Status: Complete 2026-06-15.

## Goal

Add a review-only printable/report placement contract for the master-detail schedule without opening report sequencing rows.

## Completed

- Extended `MasterDetailScheduleContract` with `reportPlacement`.
- Added planned report sections for:
  - schedule summary
  - annual master-detail schedule
  - tax and constraint context
  - quality and boundary note
- Kept quality/output boundary blocked until wording safety and output gates explicitly open report sequencing.
- Listed allowed report summary fields.
- Listed excluded report fields:
  - final instruction
  - withdrawal command
  - tax-bracket target
  - saved sequencing field
- Rendered the report placement contract in Save & print.
- Added selector and UI structure guards.

## Boundary

This package does not:

- change the current printable report
- add report sequencing rows
- open CSV sequencing output
- create final annual instructions
- create account-level withdrawal commands
- add tax-bracket wording
- save optimizer sequencing output
- change `.plan.json`

## Estimate Update

- Retirement answer layer: 0-10 sprints remaining, unchanged.
- Live assumption lab: 0 sprints remaining, unchanged.
- Public-ready optimizer planning: 0 sprints remaining; public release remains closed pending pilot evidence.
- Account-level annual instruction bridge: 0-15 sprints remaining, tightened from 5-20 because report placement is now explicitly bounded.
- Graphical UI redesign: 20-60 sprints remaining, unchanged and still deferred.
- Launch hardening/private pilot prep: 5-15 sprints remaining, unchanged.

## Verification

- Focused result selector and UI structure tests.
- Whitespace diff check.
- Isolated transpilation check for edited TS/TSX/JS files.

## Next Package

Close the account-level annual instruction bridge with a final internal-readiness rollup: what is now available for review, what remains blocked, and what evidence would be required before actual final annual instructions or export/report sequencing can open.
