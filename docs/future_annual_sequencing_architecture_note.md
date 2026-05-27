# Future Annual Sequencing Architecture Note

## Purpose

Describe what a future annual account-level sequencing prototype would need to answer before implementation.

## Current decision

Annual account-level sequencing remains deferred. The first future prototype, if approved later, should be internal/test-only and removable in one commit.

## Possible runtime inputs

- Existing annual projection rows.
- Existing account bucket balances.
- Existing broad withdrawal-family candidate evidence.
- Existing tax, OAS recovery, funded-year, shortfall, and projected-money-left diagnostics.
- Existing household guardrails for survivor setup, locked-in accounts, estate intent, and Ontario 2026 scope.

## Inputs not approved yet

- Saved plan schema additions.
- New per-year account-order user inputs.
- Province selector or multi-province tax inputs.
- GIS or low-income benefit sequencing controls.
- Cash-wedge refill settings or variable-spending rules.

## Possible runtime outputs

- Internal candidate diagnostics.
- Architecture-only pass/fail rows.
- Test-only evidence comparing whether a path preserves funded years, money left, tax/OAS explainability, and instruction boundaries.

## Outputs not approved yet

- Saved sequencing result.
- Engine output schema changes.
- User-facing account-by-account instructions.
- Normal UI sequencing action.
- Advisor, cloud, or sharing workflow.

## Verification checklist for any later prototype

- Existing full test suite passes.
- Canonical probe suite passes except known sandbox route-probe caveat.
- No `.plan.json` files are created.
- Saved plan schema remains unchanged.
- Engine output schema remains unchanged.
- Normal Overview and compact Details do not show sequencing execution.
- Prototype can be removed in one commit.

## Prototype decision point

Do not start the prototype until feedback depth, explainability, performance, province/edge-case scope, schema boundary, UI boundary, and rollback boundary are all explicitly cleared.
