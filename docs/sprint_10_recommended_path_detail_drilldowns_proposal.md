# Sprint 10 Recommended Path Detail Drilldowns

Sprint 10 deepens the Sprint 8 and Sprint 9 recommended-path experience without becoming a full optimizer, changing persistence, or moving detail ownership away from the stable dashboard too quickly.

## Goal

Let users inspect why the selected recommended path is robust or fragile by drilling from high-level Overview risks into focused, selected-path evidence.

The user should be able to answer:

- Which years create the pressure?
- Which cash-flow, tax, account, spending, or survivor rows explain it?
- Which candidate is being inspected?
- When should I use the stable dashboard for complete detail?

## Current Baseline

Sprint 8 selects the strongest preview candidate from:

- Current plan
- Retire two years later
- Spend 10% less in go-go
- Delay CPP/OAS to 70

Sprint 9 adds:

- Runtime-only confidence selector
- Selected-path stress context
- “What could break this plan?” Overview panel
- Stable dashboard handoff copy

The Sprint 7 decision surface remains:

- Plan Health
- Money Flow
- Decision Checks
- Scenario Tests
- Household Resilience

## Scope

Sprint 10 should add selected-path detail drilldowns inside the React results workspace.

Candidate scope:

- Click or select a break-risk item from “What could break this plan?”
- Show a focused detail panel for the selected risk.
- Use the selected recommended candidate’s result rows when available, not only baseline rows.
- Show the most relevant evidence rows, capped and readable.
- Preserve stable dashboard handoff for full annual schedules and charts.

## Non-Scope

Do not add:

- Full optimizer
- Monte Carlo confidence interval
- Schema v3 persistence
- Persisted recommendation output
- Cloud sync
- Accounts
- Advisor workspace
- AI reports
- Multi-province support
- Custom scenario authoring
- Paid feature gating

## Proposed UX

### Overview Interaction

The existing “What could break this plan?” panel becomes selectable.

Each item should show:

- Risk label
- Status: ok, review, watch, blocked
- One-line explanation
- Detail target or stable dashboard handoff

Selecting an item updates a nearby detail panel. Avoid modal-only UX; this is review work, not an interruption.

### Detail Panel

Panel title pattern:

`Selected path detail: {Risk label}`

Panel body should include:

- Selected candidate name
- Confidence status
- Why this risk matters
- Key rows or metrics
- “Inspect in stable dashboard” handoff copy

### Default Selection

Default to the highest-severity break risk:

1. blocked
2. watch
3. review
4. ok

If there are ties, preserve the break-risk order from Sprint 9.

## Risk Detail Types

### Source Reconciliation

Show:

- First warning year, if any
- Rows checked
- Max reconciliation gap
- Max cash-flow delta
- First-year source story when relevant

Handoff:

Stable dashboard annual cash-flow rows.

### Go-Go Spending

Show:

- Current plan go-go spending
- 10% lower go-go scenario spending
- End portfolio delta
- First shortfall year delta, if available
- First-year spending delta

Handoff:

Stable dashboard spending and withdrawal schedules.

### Retirement Date

Show:

- Current retirement year
- Retire-later year
- End portfolio delta
- Lifetime tax delta
- Funded-through year comparison

Handoff:

Stable dashboard employment, tax, and withdrawal timing.

### CPP/OAS Timing

Show:

- Current public-benefit timing assumption
- Delay-to-70 candidate result
- End portfolio delta
- Lifetime tax delta
- OAS clawback pressure count

Handoff:

Stable dashboard benefit and taxable-income schedules.

### Projection Shortfall

Show:

- First shortfall year
- Worst shortfall year and amount
- Funded years out of total years
- Portfolio balance around first shortfall

Handoff:

Stable dashboard stress tests and annual shortfall rows.

### Terminal Cushion

Show:

- Terminal portfolio
- Lowest portfolio year and value
- Approximate cushion in first-year spending years
- Estate target context when available

Handoff:

Stable dashboard balance charts and ending estate trade-offs.

### Tax Pressure

Show:

- First pressure year
- Peak tax year
- Taxable income
- Total tax
- OAS clawback
- Registered withdrawals

Handoff:

Stable dashboard tax schedules and OAS clawback rows.

### Survivor Resilience

Show:

- Single/couple status
- Survivor year status
- Baseline versus survivor end portfolio delta
- Survivor first shortfall year
- Survivor funded-through year

Handoff:

Stable dashboard survivor and household resilience detail.

## Data/Selector Shape

Prefer selector-first implementation.

Potential additions:

- `RecommendedRiskDetail`
- `selectRecommendedRiskDetails(...)`
- `selectDefaultRecommendedRiskDetail(...)`

The selector should receive the same runtime inputs already used by `selectRecommendedPath`:

- Baseline result
- Scenario results
- Survivor result
- Plan payload
- Validation result

The selector should not mutate plans or simulation output.

## React Components

Potential components:

- `BreakRiskPanel`
- `BreakRiskDetailPanel`
- `RiskMetricGrid`
- `RiskEvidenceTable`

Keep cards shallow. Do not nest cards inside cards. The detail panel can be a normal section within the recommended-path area.

## Copy Principles

- Use review language, not advice language.
- Say “selected path” or “preview candidate,” not “final plan.”
- Keep stable dashboard handoffs specific.
- Avoid implying statistical confidence.
- Avoid using test-person names in product copy.

## Persistence Boundary

Sprint 10 must remain runtime-only.

Do not write any of the following to `.plan.json`:

- Recommended candidate
- Confidence level
- Risk status
- Detail selection state
- Scenario output
- Derived evidence rows

Runtime dashboard schema remains v2.

## Test Plan

Add selector tests for:

- Default risk selection chooses blocked/watch/review/ok priority.
- Each risk id can produce a detail object.
- Detail rows use selected recommended candidate output where applicable.
- Missing scenario results degrade gracefully.
- Survivor detail distinguishes single, needs input, ready, and not available.
- No selector mutates the plan payload.

Add smoke coverage for:

- Overview renders break-risk detail for at least one selected risk.
- React results still render with no scenario output.
- Stable dashboard handoff remains available.

Verification:

- `npm test`
- `npm run build`
- `node probes/probe_simulation_engine_parity.js && node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- Confirm no `.plan.json` files were created in the repo.

## Implementation Tickets

- [x] **S10-01 — Risk detail selector contract.** Added typed runtime detail rows, metrics, evidence rows, and default selected risk.
- [x] **S10-02 — Source, shortfall, and terminal cushion details.** Added focused evidence for reconciliation, funding pressure, and portfolio cushion.
- [x] **S10-03 — Spending, retirement date, and benefit timing details.** Added candidate-comparison evidence for the three local reruns.
- [x] **S10-04 — Tax and survivor details.** Added Canadian tax pressure and household resilience drilldowns.
- [x] **S10-05 — Overview interaction.** Made break risks selectable and rendered the selected detail panel.
- [x] **S10-06 — Tests and documentation.** Added selector coverage and updated sprint docs.

## Implementation Notes

- Break-risk details live on the runtime `RecommendedPathSummary`.
- The default selected detail uses severity priority: blocked, watch, review, ok. Ties preserve Sprint 9 break-risk order.
- The UI uses local component state only; selected detail state is not persisted.
- Risk details degrade gracefully when a scenario result is unavailable.
- Product copy uses “selected path” and “preview candidate,” not “final plan.”

## Definition Of Done

- Users can select a break risk and see focused selected-path evidence.
- Selected-path details are runtime-only and not persisted.
- Detail copy clearly points users to the stable dashboard for complete schedules.
- The React Overview remains readable and does not turn into a dense spreadsheet.
- Stable dashboard remains the full fallback.
- Runtime dashboard schema remains v2.
- Verification passes and no private `.plan.json` files are created.

## Review Questions

- Should Sprint 10 include all eight break-risk details, or only the first four most important ones?
- Should the detail panel live inside the Recommended Path panel, or directly below it as its own Overview section?
- Should clicking a risk switch detail in place, or should each risk expand inline?
- Is “detail drilldowns” the right sprint theme, or should Sprint 10 focus on replacing more stable-dashboard tabs first?
