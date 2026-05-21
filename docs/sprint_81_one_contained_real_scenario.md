# Sprint 81: One Contained Real Scenario

## Summary

Sprint 81 adds one contained drawdown scenario comparison using existing engine plumbing.

## What Changed

- Added a contained prototype runner that compares the current plan with one bounded draft shape.
- Used existing scenario configuration only.
- Preserved current withdrawal order and empty annual overrides.

## Boundary

This is not custom annual override execution. It does not apply a strategy, create detailed account instructions, or save output.

## Verification Focus

- The contained prototype returns review evidence only.
- Missing adapter or containment checks hold/block the prototype.
- Saved plan files stay clean.
