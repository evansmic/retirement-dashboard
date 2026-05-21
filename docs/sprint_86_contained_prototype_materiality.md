# Sprint 86: Contained Prototype Materiality

## Summary

Sprint 86 adds a materiality check for the contained drawdown prototype.

## What Changed

- Added materiality rows for funding, tax, OAS recovery, and estate movement.
- Held small movements instead of treating them as meaningful.
- Preserved blocked status when harm checks fail.

## Boundary

Materiality is a review filter only. It does not recommend a withdrawal change or save output.

## Verification Focus

- Material movements remain reviewable.
- Small movements are held.
- Blocked prototype evidence remains blocked.
