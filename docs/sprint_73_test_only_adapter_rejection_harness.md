# Sprint 73: Test-Only Adapter Rejection Harness

## Summary

Sprint 73 adds validation for draft annual-override adapter rows before any real execution work is considered.

## What Changed

- Added validation rows for boundary status, projection year, account bucket, amount, direction, and saved-plan cleanliness.
- Rejected drafts with negative amounts, unavailable buckets, years outside the projection, unsupported directions, or dirty saved-plan boundaries.
- Kept validation in the review/checkpoint layer.

## Boundary

Validation does not simulate overrides. It only says whether a draft shape would be acceptable for later review work.

## Verification Focus

- Unsafe draft shapes are blocked with visible reasons.
- Accepted shapes remain draft-only.
- Current withdrawal order and empty annual overrides remain unchanged.
