# Sprint 262: Money Flow Research Gate

## Summary

Sprint 262 moves reconciliation diagnostics behind a disabled Details research gate.

## Outcome

- Added `SHOW_MONEY_FLOW_RESEARCH_PANELS = false`.
- Normal Details keeps the story and first-year ledger visible.
- Reconciliation diagnostics remain available for later research review without rendering by default.

## Boundary

This is a UI placement gate only. Money-flow output remains runtime-only and unsaved.
