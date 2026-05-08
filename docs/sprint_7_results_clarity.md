# Sprint 7 Results Clarity And Decision Readiness

Sprint 7 moves the React results workspace from migrated tables toward a decision engine surface. The stable dashboard remains the complete fallback, and the runtime/persisted dashboard schema remains v2.

## First Slice

The first Sprint 7 slice adds selector-driven decision readiness to the React Overview:

1. Plan Health Explainer
   - Funded-through year.
   - First pressure point.
   - Largest review item.
   - Stable dashboard detail fallback.

2. Source Reconciliation Story
   - Taxable income and registered withdrawals.
   - TFSA and non-registered withdrawals.
   - Cash wedge funding.
   - Other inflows.
   - Tax.
   - After-tax spending funded.
   - Reconciliation gap.

3. Decision Checklist
   - Source reconciliation.
   - CPP/OAS timing.
   - Cash wedge.
   - OAS clawback.
   - Registered tax spike.
   - Survivor risk.
   - Estate target.
   - Detail rows explain evidence, affected years, and the fallback result area.

4. Canadian Tax Pressure Timeline
   - High-signal years where taxable income, tax, OAS clawback, or registered withdrawals deserve review.
   - Plain-language explanations identify whether the pressure is OAS clawback, registered withdrawals, or peak taxable income.

5. First Scenario Cards
   - Retire two years later.
   - Spend 10% less in go-go.
   - Delay CPP/OAS to 70.
   - Cards compute simple local reruns and show end-portfolio delta plus funded-through year.
   - This is intentionally not a full optimizer.
   - The comparison detail table shows end portfolio delta, first-year spending delta, lifetime tax delta, funded-through year, and first shortfall.
   - The assumptions table shows exactly what changes from baseline.

6. Survivor View First Slice
   - Single plans are marked not applicable.
   - Couple plans show whether a survivor year is available.
   - The first summary estimates visible Person 1 income at risk from extracted rows.
   - Couple plans with a survivor year compare baseline versus survivor end portfolio, lifetime tax, spending funded, and first shortfall.

7. Results UX Checkpoint
   - Overview sections are grouped as Plan Health, Money Flow, Decision Checks, Scenario Tests, and Household Resilience.

## Checkpoint

Sprint 7 is checkpoint-ready when tests and probes pass. The React results Overview now behaves as the first Canadian retirement decision-engine surface while the stable dashboard remains the full detail fallback.

## Guardrails

- Do not change simulation engine output.
- Do not change persisted schema.
- Do not add cloud sync, accounts, advisor workspace, AI reports, multi-province support, or full optimizer behavior.
- Keep source reconciliation central because every result should trace spending to funding sources and tax.
- Use the stable dashboard for complete schedules, chart parity, stress tests, and print/PDF until React parity is explicitly completed.
