# Sprint 64: Internal Drawdown Dry-Run Harness

## Summary

Sprint 64 adds one internal dry-run harness for a guarded drawdown payload shape. The harness is explicitly test-only and is not reachable from the product UI.

## What Changed

- Added a dry-run function that requires a test-only flag.
- Compared baseline and candidate evidence rows for funding, tax, OAS recovery, and projected money left.
- Blocked dry-run output when funding worsens.
- Kept the result review-only and unsaved.

## Boundaries

- No product path runs the dry-run.
- No annual override payload is saved.
- No account instructions are shown to users.
- Current withdrawal order remains the product calculation source of truth.
