# Sprint 272: Optimizer Prep Research Gate

## Summary

Sprint 272 moves optimizer-prep diagnostics behind the option research gate.

## Outcome

- `OptimizerBoundaryPanel` and `OptimizerInputReviewPanel` now render only inside `SHOW_OPTION_RESEARCH_PANELS`.
- Normal Details keeps only compact plan options visible.
- Full option diagnostics remain preserved for later research review.

## Boundary

This is a UI placement gate only. Optimizer output remains runtime-only and unsaved.
