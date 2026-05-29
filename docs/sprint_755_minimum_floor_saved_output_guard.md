# Sprint 755 - Minimum Floor Saved Output Guard

## Goal

Guard against accidentally treating the bridge summary as persisted output.

## Completed

- Added structure coverage that rejects a `minimumExpenseCoverage:` saved-output shape in app source.
- Existing plan-file probes remain responsible for saved plan round-trip coverage.

## Boundary

No saved `.plan.json` schema change was made.
