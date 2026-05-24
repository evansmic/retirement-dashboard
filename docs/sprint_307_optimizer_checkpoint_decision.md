# Sprint 307: Optimizer Checkpoint Decision

## Summary

Sprint 307 stops the cleanup batch and makes the optimizer checkpoint decision.

## Decision

Proceed to optimizer prep next, not broad optimizer implementation.

## Rationale

- The remaining cleanup items are now bounded and guarded by structure tests.
- Normal consumer Details is compact enough to carry optimizer-prep evidence without reopening the full research stack.
- Save/report/CSV boundaries are clear and local-first.
- Intake review items are calmer and do not make non-blocking gaps feel like errors.
- Review-first wording is strong enough to keep the next optimizer-prep work non-advisory.

## Next Sprint

Sprint 308 should be **Optimizer Input Readiness Review**.

Sprint 308 should check whether current inputs are sufficient for bounded optimizer tests across spending, CPP/OAS estimates, DB pensions, survivor setup, estate intent, home-sale reliance, and Ontario 2026 tax assumptions.

## Do Not Start Yet

- Do not add optimizer execution expansion in Sprint 308.
- Do not save optimizer output.
- Do not add account-level drawdown instructions.
- Do not change saved plan schema or engine output schema.

## Boundary

No engine math, optimizer behavior, drawdown behavior, saved plan schema, or engine output schema changed in this checkpoint.
