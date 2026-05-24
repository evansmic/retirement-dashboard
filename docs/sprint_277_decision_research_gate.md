# Sprint 277: Decision Research Gate

## Summary

Sprint 277 moves decision-detail diagnostics behind a disabled research gate.

## Outcome

- Added `SHOW_DECISION_RESEARCH_PANELS = false`.
- Normal Details keeps the decision checklist visible.
- Decision detail and projection path remain preserved for later research review without rendering by default.

## Boundary

This is a UI placement gate only. Runtime selector output remains unchanged and unsaved.
