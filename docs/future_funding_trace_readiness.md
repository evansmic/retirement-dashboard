# Future Funding Trace Readiness

## Purpose

Plan funding trace labels, caveats, reconciliation, and copy before implementing account optimizer behavior.

## Account Groups

- Income sources: CPP, OAS, DB pension, salary or work income.
- Registered withdrawals: RRSP, RRIF, LIRA, LIF.
- TFSA withdrawals: TFSA principal and growth.
- Non-registered withdrawals: non-registered assets and capital gains context.
- Cash and reserve draw: cash wedge and cash savings.
- Other inflows: downsizing proceeds, inheritance, one-time inflows.
- Estimated tax: income tax, OAS recovery tax, and Ontario Health Premium when applicable.

## Guardrails

- Funding trace must explain where money appears to come from, not what to withdraw.
- Funding trace must not become annual account-level sequencing.
- Funding trace must stay runtime-only in this planning package.
- Funding trace must keep tax caveats visible.

## Tax Caveats

- OAS recovery tax can change after-tax capacity.
- Registered withdrawals are taxable.
- Non-registered withdrawals can include capital gains.
- Ontario Health Premium may apply.

These caveats must not become tax advice, OAS optimization advice, capital gains strategy, or false precision.

## Reconciliation Rules

- Income sources plus withdrawals plus other inflows minus estimated tax should reconcile to after-tax spending and surplus or shortfall.
- Funding trace labels should clarify when amounts are shown in today dollars.
- If sources minus tax do not cover the minimum floor, the gap should remain visible.

## First-Year Trace Copy Boundaries

- "Where the first-year spending appears to come from"
- "This is a first-year trace for review, not a withdrawal plan."
- "Tax can change as income sources and withdrawals change."
- "If the trace does not cover the minimum floor, compare practical options before treating the plan as ready."

Avoid:

- where-to-withdraw-from wording,
- personalized advice,
- annual account-level sequencing,
- guaranteed tax results,
- failure language,
- single-option pressure.

## Boundary

No account-level sequencing, optimizer output, saved schema, or UI behavior changes in this package.
