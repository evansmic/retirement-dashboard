# Sprint 347: Feedback-To-Decision Contract

Sprint 347 converts withdrawal feedback readiness into a runtime-only decision gate.

## Change

- Added decision states for collect feedback, clean up inputs, and hold annual sequencing.
- Kept the decision tied to the existing withdrawal feedback checkpoint.
- Preserved the no-instructions boundary.

## Boundary

This does not start annual sequencing architecture or save optimizer output.
