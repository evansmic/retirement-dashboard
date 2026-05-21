# Sprint 74: One Mocked Execution Scorecard

## Summary

Sprint 74 adds a test-only scorecard that compares supplied baseline and candidate rows. It proves the scoring shape can be reviewed before any real annual-override execution exists.

## What Changed

- Added mocked scorecard rows for funding, tax, OAS recovery, and estate posture.
- Blocked mocked results that harm funding or entered estate goals.
- Kept the scorecard out of product execution and saved plan files.

## Boundary

The mocked scorecard is not reachable from the product UI as a real calculation. It compares supplied rows in tests only.

## Verification Focus

- Accepted adapter validation is required before mocked scoring.
- Harmful supplied rows are blocked.
- No scorecard output is saved.
