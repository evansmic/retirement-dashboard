# Sprint 77: Adapter Audit Trail

## Summary

Sprint 77 adds a plain audit trail for the draft adapter shape so the team can see where it came from without turning it into household guidance.

## What Changed

- Added rows for evidence source, year, account area, amount band, direction, and guardrails.
- Used broad account-area labels.
- Kept the draft framed as review evidence.

## Boundary

The audit trail explains a draft shape only. It does not create instructions, apply a strategy, run annual overrides, or save output.

## Verification Focus

- Accepted adapter drafts produce audit rows.
- Rejected adapter drafts return a safe missing-draft summary.
- Copy remains review-oriented.
