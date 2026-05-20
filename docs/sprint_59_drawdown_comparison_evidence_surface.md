# Sprint 59: Drawdown Comparison Evidence Surface

Sprint 59 exposes the hidden drawdown comparison as a compact Details-only evidence panel. It stays review-only and does not turn the comparison into account instructions.

## What Changed

- Added a "Drawdown comparison evidence" panel in Details.
- Shows funding, tax, OAS recovery, and projected-money-left evidence rows when the hidden comparison is available.
- Shows a plain not-ready reason when the comparison is blocked or not ready.
- Keeps the panel out of Overview.

## Boundaries

- No annual withdrawal override execution was added.
- No account instructions are created.
- No saved plan schema or engine output schema changed.
- No prototype, draft, sandbox, readiness, comparison, mocked payload, optimizer, or strategy output is saved into `.plan.json`.

## Copy Posture

The panel says the comparison does not change the plan, create account instructions, or save output. The rows remain evidence for review, not a recommendation.

## Next Step

Sprint 60 should add a decision gate before any drawdown comparison can be highlighted: material improvement, no funding harm, no estate harm, survivor guardrails, and locked-in-account review.
