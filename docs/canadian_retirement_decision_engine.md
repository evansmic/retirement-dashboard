# Canadian Retirement Decision Engine

Created 2026-05-07 to preserve product direction across future chats.

## Positioning

The product should become the Canadian retirement decision engine.

ProjectionLab is a broad, polished modelling lab. This product should win by being narrower, more Canada-specific, more explainable, and more decision-oriented.

The product should answer:

1. Can I retire?
2. What funds my spending each year?
3. Where does tax hurt me?
4. Which decision should I revisit first?
5. What should I do next?

## Course Corrections

- Move from tabs of data toward a recommended-plan narrative.
- Make source reconciliation a product pillar: every dollar of after-tax spending should be traced.
- Avoid feature sprawl until the Canadian plan story is excellent.
- Use charts only when they clarify a decision.
- Keep the stable dashboard as fallback until React results reach replacement parity.
- Do not add cloud sync, accounts, advisor workspace, AI reports, full optimizer, multi-province support, or schema v3 persistence unless separately scoped.

## Standout Features

### Plan Health Explainer

Summarize the plan in plain language:

- Spending is fully funded through year X.
- First pressure point is tax, depletion, cash wedge, registered drawdown, survivor risk, or spending.
- Largest review item is Y.
- Stable dashboard has the complete detail.

### Source Reconciliation Story

Make the Larry-style invariant visible:

- Income
- Registered withdrawals
- TFSA/non-registered withdrawals
- Cash wedge
- One-offs, downsizing, or other inflows
- Tax
- Spending funded

The product should flag impossible rows before asking users to trust charts or recommendations.

### Decision Checklist

Show review candidates without giving regulated advice:

- CPP/OAS timing worth testing.
- Cash wedge may be high or low.
- OAS clawback appears in specific years.
- RRSP/RRIF drawdown creates a tax spike.
- Survivor plan needs review.
- Estate target appears funded or unfunded.

### Scenario Cards Before Full Optimizer

Start with a few understandable what-ifs:

- Retire two years later.
- Spend 10% less in go-go years.
- Delay CPP/OAS to 70.

Compare these to the base plan before building a broad optimizer.

### Canadian Tax Timeline

Create a tax-pressure view with:

- Taxable income
- Tax
- OAS clawback
- Pension credit years
- RRIF/LIF minimum years

### Household Survivor View

Model the first-death year as a decision surface:

- Survivor income
- Tax change
- Portfolio path
- Spending funded

This is a major Canada-specific differentiator.

## Sprint 7 Recommendation

Sprint 7 should be **Results Clarity And Decision Readiness**.

Scope:

- Plan Health Explainer
- Source Reconciliation Story panel
- Decision Checklist
- Tax Pressure Timeline
- First simple Scenario Cards
- Survivor View discovery/first slice

Non-scope:

- Full optimizer
- Cloud sync/accounts
- Advisor workspace
- AI reports
- Multi-province
- Schema v3 persistence
