# Sprint 297: Research Gate Checkpoint

## Summary

Sprint 297 adds a checkpoint guard for disabled research panels.

## Outcome

- Structure tests require checkpoint, decision, drawdown, money-flow, option, scenario, and tax research gates to stay disabled by default.
- Tests block those gates from being set to `true` in the active React source.
- Normal consumer Details remains compact for feedback.

## Boundary

This is source-structure coverage only. It does not delete diagnostic panels.
