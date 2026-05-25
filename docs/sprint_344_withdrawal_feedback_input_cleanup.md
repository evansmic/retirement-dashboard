# Sprint 344: Input-Cleanup Question Path

Sprint 344 adds a separate question path when broad withdrawal-family feedback is blocked by missing inputs.

## Change

- Blocked states ask which input made the comparison unavailable.
- Blocked states ask whether the user understands why account balances matter.
- Blocked states still confirm that annual sequencing has not started.

## Boundary

This does not imply optimizer failure or add new required saved fields.
