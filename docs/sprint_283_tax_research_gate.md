# Sprint 283: Tax Research Gate

## Summary

Sprint 283 moves the full tax-pressure table behind a disabled research gate.

## Outcome

- Added `SHOW_TAX_RESEARCH_PANELS = false`.
- Normal Details renders the compact tax summary.
- The full tax-pressure table remains preserved for later research review without rendering by default.

## Boundary

This is a UI placement gate only. Runtime selector output remains unchanged and unsaved.
