# Sprint 683: Refresh Action

## Purpose
Add a direct refresh action for stale deployed chunks.

## Outcome
- Stale preview errors now render a small notice with a Refresh page button.
- Generic preview calculation errors keep the existing non-refresh path.
- The notice appears in Review and Results where preview bridge errors are already shown.

## Boundary
This sprint does not add new navigation, recovery state, browser storage, or analytics.
