# Sprint 337: Withdrawal Feedback Readiness Contract

Sprint 337 adds a runtime-only checkpoint for broad withdrawal-family feedback.

## Change

- Added withdrawal feedback rows to the bounded optimizer summary.
- Checks cover broad-family presence, household guardrails, and saved-output boundaries.
- The checkpoint is derived from runtime candidates and readiness rows only.

## Boundaries

- No saved optimizer output.
- No saved plan schema change.
- No engine output schema change.
- No annual account-level withdrawal instructions.
