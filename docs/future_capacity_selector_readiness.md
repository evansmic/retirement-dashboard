# Future Capacity Selector Readiness

## Purpose

Define the future capacity selector before schema, engine, or UI changes.

## Inputs

- Minimum monthly expenses excluding mortgage.
- Mortgage payment already entered in Debts.
- Spending path breakpoint ages.
- Projected after-tax capacity.
- First-year funding trace preview.

## Runtime Outputs

- Confident monthly after-tax spend.
- Capacity status.
- Review factors.

## Status Mapping

- `covered`: floor is covered, capacity is above floor, and no near-term shortfall is visible.
- `tight`: floor is barely covered, room above floor is limited, or small assumption changes can affect the answer.
- `gap`: floor is not covered, capacity is below minimum expenses, or shortfall appears before plan end.
- `cannotTell`: minimum expenses or core projection inputs are missing.

Prompts should stay review-oriented and avoid advice-like commands.

## Review Factors

- Tax and benefit timing.
- Survivor resilience.
- Estate intent.
- Funding trace.
- Spending path.

These must stay review factors. They must not become tax advice, estate recommendations, account instructions, permission to spend more, or required user expertise.

## Guardrails

- The selector must not write to saved plans.
- The selector must not add engine output fields in this package.
- The selector must not call capacity safe or guaranteed.
- The selector must keep funding trace language review-oriented.

## Boundary

This is readiness planning only. No selector is wired into the app in this package.
