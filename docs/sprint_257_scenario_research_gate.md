# Sprint 257: Scenario Research Gate

## Summary

Sprint 257 moves scenario assumption and comparison tables behind a disabled Details research gate.

## Outcome

- Added `SHOW_SCENARIO_RESEARCH_PANELS = false`.
- Normal Details keeps benefit timing and spending stress visible.
- Scenario assumption and comparison tables remain available for later research review without rendering by default.

## Boundary

This is a UI placement gate only. Scenario outputs remain runtime-only and unsaved.
