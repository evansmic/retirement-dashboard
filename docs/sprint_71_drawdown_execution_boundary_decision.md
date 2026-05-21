# Sprint 71: Drawdown Execution Boundary Decision

## Summary

Sprint 71 adds a review-only boundary decision for the tax-aware drawdown work. It decides whether the current plan should stay with preview-only evidence, harden more guardrails, or prepare one tightly scoped future execution prototype.

## What Changed

- Added a drawdown execution boundary selector using the existing phase review, visible preview, plan, and saved-plan guardrails.
- Kept the checkpoint in Details only.
- Preserved the current withdrawal order and empty annual overrides.
- Kept the result outside saved plan files and optimizer strategy output.

## Boundary

This sprint does not run annual withdrawal overrides, change the withdrawal order, create account instructions, or save drawdown output.

## Verification Focus

- Boundary states are finite and review-only.
- Overview remains unchanged.
- Saved `.plan.json` files do not include boundary output.
