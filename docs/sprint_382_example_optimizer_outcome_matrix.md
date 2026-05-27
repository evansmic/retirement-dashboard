## Sprint 382

Sprint 382 adds example-plan optimizer outcome matrix coverage.

What changed:
- Ran every example plan through the bounded optimizer in test coverage.
- Checked that candidate count remains bounded.
- Checked that annual overrides remain deferred.
- Checked compact evidence row ordering across examples.

Boundary:
- No example plan saves optimizer output.
- No candidate family or search space was widened.
