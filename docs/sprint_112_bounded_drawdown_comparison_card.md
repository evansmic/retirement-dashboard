# Sprint 112: Bounded Drawdown Comparison Card

Completed 2026-05-21.

## Summary

Added a compact Details-only card that compares the current plan with the bounded drawdown check across funding, tax, OAS recovery, and estate evidence.

## Boundaries

- The card summarizes existing execution evidence.
- It does not create account-by-account instructions.
- It does not save comparison output.

## Verification Focus

- Rows remain finite and review-oriented across bundled examples.
- The card can hold or block when the bounded execution result is not ready.
- Saved `.plan.json` files do not include comparison-card output.
