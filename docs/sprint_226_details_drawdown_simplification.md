# Sprint 226: Details Drawdown Simplification

## Summary

Sprint 226 reduces the normal consumer Details surface by gating the internal drawdown research panels behind a disabled flag.

## Outcome

- Added `SHOW_DRAWDOWN_RESEARCH_PANELS = false`.
- Kept the existing runtime selectors, tests, and guardrails intact.
- Kept Overview unchanged.
- Preserved saved-plan and engine-output boundaries.

## Boundary

This sprint does not remove drawdown evidence or change calculation behavior. It only prevents internal research panels from crowding the normal consumer Details path.
