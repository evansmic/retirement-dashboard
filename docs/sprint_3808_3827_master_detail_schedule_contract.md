# Sprint S3808-S3827: Master-Detail Schedule Contract

Status: Complete 2026-06-15.

## Goal

Convert internal annual sequencing review evidence into an explicit master-detail schedule contract while keeping public downloads and reports closed to sequencing output.

## Completed

- Added `MasterDetailScheduleContract`.
- Added `selectMasterDetailScheduleContract`.
- The contract separates:
  - public master-detail CSV ledger fields
  - internal sequencing review evidence
- Added status states for internal review ready, hold for repair, public export only, and blocked.
- Added schedule rows that summarize spending, income/inflows, portfolio withdrawals, tax, net worth, and internal sequencing review evidence.
- Rendered the contract in Save & print.
- Kept `Download master-detail CSV` wired to public-clean rows.
- Added selector and UI structure guards for the public-clean/internal-review split.

## Boundary

This package does not:

- open CSV sequencing output
- open report sequencing output
- create final annual instructions
- create account-level withdrawal commands
- add tax-bracket wording
- save optimizer sequencing output
- change `.plan.json`
- promote public optimizer UI

## Estimate Update

- Retirement answer layer: 0-10 sprints remaining, unchanged.
- Live assumption lab: 0 sprints remaining, unchanged.
- Public-ready optimizer planning: 0 sprints remaining; public release remains closed pending pilot evidence.
- Account-level annual instruction bridge: 5-20 sprints remaining, tightened from 10-30 because the master-detail schedule contract is now explicit.
- Graphical UI redesign: 20-60 sprints remaining, unchanged and still deferred.
- Launch hardening/private pilot prep: 5-15 sprints remaining, unchanged.

## Verification

- Focused result selector and UI structure tests.
- Whitespace diff check.
- Isolated transpilation check for edited TS/TSX/JS files.

## Next Package

Continue the account-level annual instruction bridge by adding a review-only printable/report placement contract for the master-detail schedule. Keep actual report sequencing rows, CSV sequencing output, final instructions, saved sequencing, tax-bracket wording, and account-level commands closed.
