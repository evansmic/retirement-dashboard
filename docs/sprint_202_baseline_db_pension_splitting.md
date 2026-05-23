# Sprint 202: Baseline DB Pension Splitting

Status: Complete 2026-05-23.

## Goal

Apply the pension-splitting baseline decision consistently in the React preview and comparison paths.

## Scope

- Added a shared helper for two-person DB pension baseline splitting.
- Updated the Results preview baseline config.
- Updated bounded optimizer, hidden drawdown comparison, and drawdown execution readiness baseline configs.

## Boundary

No saved plan schema or engine output schema changed. The underlying simulation engine already supported `pensionSplit`; this sprint only changed when baseline configs request it.
