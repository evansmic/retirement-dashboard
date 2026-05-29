# Sprint 769 - Spending Path Breakpoint Guard

## Goal

Guard against malformed breakpoint ages in the bridge summary.

## Completed

- Selector returns `cannotTell` if breakpoint ages are missing or out of order.
- Tests cover an out-of-order breakpoint case.

## Boundary

No validation rule or intake blocker was changed.
