# Sprint 60: Drawdown Comparison Decision Gate

## Summary

Sprint 60 adds a conservative gate in front of the hidden drawdown comparison. The gate decides whether the comparison is merely background evidence, held back for review, blocked by a harm check, or eligible for later review. It does not make recommendations, create account instructions, put a strategy into the plan, or save output.

## What Changed

- Added a runtime-only decision gate to the hidden drawdown comparison selector.
- Checked whether the comparison has a material funding, tax, OAS recovery, or projected-money-left movement.
- Blocked comparisons that weaken funding.
- Flagged estate-goal, survivor-scenario, and locked-in account review needs in plain language.
- Kept the saved-plan boundary visible in the gate.
- Added a Details-only “Review gate” section under the drawdown comparison evidence panel.

## Boundaries

- No annual withdrawal override execution.
- No tax-aware drawdown strategy application.
- No account-by-account instructions.
- No highlighted drawdown recommendation.
- No saved optimizer, draft, comparison, gate, or strategy output.
- No saved plan schema or engine output schema change.
- Overview remains unchanged.

## Test Coverage

- Selector coverage confirms the gate can pass as eligible for review when evidence is material and funding is not harmed.
- Selector coverage confirms funding harm blocks the gate.
- Not-ready comparison output returns a safe not-ready gate.
- Example readiness coverage checks every built-in example for a safe gate status.
- UI structure coverage confirms the Review gate lives in Details and that Overview stays free of drawdown comparison evidence.

## Product Posture

The gate is a readiness checkpoint. It is intentionally careful: even when a comparison looks promising, the UI keeps it framed as evidence for review, not advice or a household instruction.
