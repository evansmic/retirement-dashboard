# Sprint 171: Details Drawdown Review Wiring

## Summary

Threaded the v1 drawdown re-entry and recommended-plan review selectors into the React preview state so the prepared review evidence can be shown in Details.

## What Changed

- Added preview state for re-entry review, re-entry closeout, recommended-plan review, Details placement, review copy guard, and closeout.
- Calculated the new review objects from existing v1 drawdown selectors.
- Kept the editable plan unchanged.

## Non-Scope

- No optimizer expansion.
- No new drawdown execution behavior.
- No account instructions.
- No saved plan schema changes.
