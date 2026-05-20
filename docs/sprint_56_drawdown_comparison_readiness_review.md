# Sprint 56: Drawdown Comparison Readiness Review

Sprint 56 adds a compact Details review that answers whether the current plan is ready for a later tax-aware drawdown comparison. It still does not run a comparison, execute annual overrides, or change the current withdrawal order.

## What Changed

- Added a comparison-readiness selector under the drawdown draft summary.
- The readiness review combines draft checks, the sandbox gate, account evidence, and household guardrails.
- Added a Details-only panel labelled "Future comparison readiness."
- Extended selector, UI, example-matrix, and persistence tests.

## Boundaries

- No product comparison is run.
- The mocked comparison harness remains test-only.
- No annual withdrawal changes are executed.
- The current withdrawal order remains unchanged.
- No saved plan schema or engine output schema changed.
- No prototype, draft, sandbox, readiness, mocked payload, comparison, optimizer, or strategy output is saved into `.plan.json`.

## Copy Posture

The copy uses "readiness", "review", "later comparison", and "does not run a comparison." It avoids recommendation, certainty, automatic execution, and account-instruction language.

## Next Step

Sprint 57 can consider one narrowly gated execution candidate only if the readiness review remains stable across examples and the product still clearly separates review evidence from account instructions.
