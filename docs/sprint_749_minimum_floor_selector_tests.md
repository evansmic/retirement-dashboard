# Sprint 749 - Minimum Floor Selector Tests

## Goal

Cover the bridge selector without changing plan files.

## Completed

- Added tests for tight coverage when current capacity equals the temporary floor.
- Added tests for gap-review options when a lower-spending repair test implies the floor is not covered.
- Confirmed the fixture plan is not given a `minimumExpenseCoverage` field.

## Boundary

Tests cover selector behaviour only.
