# Sprint 174: Drawdown Review Overview And Persistence Guardrails

## Summary

Added guardrails so the recommended-plan drawdown review stays in Details and does not become saved plan output.

## What Changed

- Extended structure tests for the new Details-only labels.
- Confirmed Overview does not render the drawdown execution boundary panel or recommended-plan drawdown review copy.
- Preserved saved-plan boundaries from the existing selector tests.

## Non-Scope

- No `.plan.json` schema changes.
- No hidden saved review output.
- No Overview density increase.
- No strategy application.
