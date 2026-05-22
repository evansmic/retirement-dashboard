# Sprint 153: Detailed Stress Review And Block Thresholds

## Summary

Added review and blocked states for manual detailed-stress comparison.

## Guardrails

- Metric drift is marked for review.
- Incomplete or blocked bridge runs are blocked.
- Output shape mismatch is blocked.
- Saved-plan leakage is blocked.

## Result

Detailed stress migration decisions cannot proceed on incomplete or dirty comparison evidence.
