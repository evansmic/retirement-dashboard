# Sprint 128: Preview Spending Stress Compatibility

Completed 2026-05-21.

## Summary

Kept `runResultsPreviewBundle` and existing preview exports stable while delegating spending-stress work to the stress helper.

## Boundaries

- The React preview bundle shape is unchanged.
- Existing callers can still import the compatibility functions.
- No saved plan schema changed.

## Verification Focus

- Preview scenario tests still pass.
- Results smoke tests still read `spendingStress` from the bridge preview.
- The UI does not gain new panels or copy.
