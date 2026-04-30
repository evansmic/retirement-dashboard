# Validation Plan

This project needs two kinds of confidence:

1. **Engine regression confidence** — the dashboard keeps producing the same results for known scenarios after code changes.
2. **External benchmark confidence** — the same household assumptions produce broadly similar results in reputable retirement planners.

The regression probes in `probes/` cover the first category. The `validation/` folder is for the second category.

For the consumer-first product direction, validation is part of the product surface, not just an internal QA activity. Users should eventually be able to export enough assumptions and yearly outputs to understand what the engine did, compare against public calculators, and see known limitations.

## Baseline Principle

Because this is a free public-use project, the first benchmark set should use public or free-tier tools wherever possible. Paid tools such as Optiml, Adviice, Snap Projections, NaviPlan, or Conquest are useful secondary benchmarks, but they should not be the only evidence that the model is reasonable.

External planners rarely match exactly. A useful comparison explains the variance:

- tax year and province
- nominal vs today's dollars
- CPP and OAS start ages
- CPP/OAS indexation assumptions
- investment return and inflation assumptions
- RRSP/RRIF conversion age and minimum withdrawal treatment
- withdrawal order
- household vs separate-spouse modelling
- whether non-registered ACB and capital gains are modelled
- whether pensions are indexed
- whether survivor events are modelled

## Included Baselines

Run:

```bash
node validation/export_preset_baselines.js
```

This regenerates:

- `validation/preset_baselines.json` — detailed deterministic outputs for every bundled preset.
- `validation/preset_baselines.csv` — flat comparison table for spreadsheets.

The export uses the dashboard's `PRESETS` registry in `retirement_dashboard.html`, so the validation cases stay aligned with the public examples:

- `diy-couple`
- `db-pension-couple`
- `single-late-career`
- `retired-traditional`
- `fire-couple`

All figures are nominal CAD unless noted otherwise.

## Recommended Free/Public Comparators

| Tool | Fit | Notes |
|---|---|---|
| Government of Canada Canadian Retirement Income Calculator | Public CPP/OAS and simple income baseline | Best for simple single-person checks. It recommends married/common-law users run each spouse separately, so it is not a full household decumulation comparator. |
| ProjectionLab Basic / free ad-hoc planning | Public/free-tier directional planning baseline | Good for net-worth, spending, Monte Carlo, and historical backtesting. Canadian tax estimation may require Premium, so record whether taxes are enabled. |
| Canada Retire Calc | Public Canadian retirement calculator | Useful directional check for after-tax income, CPP/OAS timing, and portfolio timeline where supported. |
| Loonie Nest Scenario Lab+ | Public Canadian retirement planner | Useful if the free tier allows full scenario entry and result capture. |
| Institution calculators, such as bank or fund-company RRSP/TFSA calculators | Component checks | Better for isolated RRSP/TFSA growth checks than full household validation. |

## Paid / Account-Gated Comparators

| Tool | Fit | Access Constraint |
|---|---|---|
| Optiml | Strong Canadian tax/decumulation benchmark | Requires account or trial. |
| Adviice | Strong Canadian household planning benchmark | Requires paid/direct access. |
| Snap Projections | Strong advisor-grade Canadian benchmark | Advisor-oriented account/trial/demo. |
| NaviPlan / Conquest / RazorPlan | Professional planning benchmark | Usually advisor or enterprise access. |

For paid platforms, preserve exported reports or screenshots in `validation/external-results/` if licensing permits. If exports are not allowed, record only user-entered assumptions and high-level output numbers.

## Comparison Metrics

Capture these where each external tool supports them:

- starting year and ending year
- annual retirement spending target
- first shortfall year
- portfolio depletion year
- ending portfolio / estate
- lifetime taxes
- lifetime OAS clawback
- lifetime CPP + OAS
- lifetime DB pension
- lifetime registered withdrawals
- lifetime TFSA withdrawals
- lifetime non-registered withdrawals
- probability of success / success score
- year-by-year taxable income around ages 65 to 72

## Sprint 0 Validation Checklist

Before rebuilding the UI or adding broader product packaging, validation work should close the current trust gaps:

- Fix or verify pension-income-credit eligibility exposed by the CA Tax Tools comparison.
- Add per-year export fields for account balances, withdrawals, taxable income, tax, OAS clawback, CPP/OAS/DB income, and real/nominal mode.
- Add a simple public-comparator fixture that avoids tax optimization, non-registered complexity, and unusual benefit timing.
- Re-run the Government of Canada Canadian Retirement Income Calculator manually in a normal browser.
- Record which outputs are exact comparisons, directional comparisons, or unsupported by the external tool.
- Keep paid-tool comparisons secondary until free/public benchmarks are stable and reproducible.
- Preserve methodology notes beside every exported baseline so a future tax-year update can be audited.

## Suggested Workflow

1. Regenerate `validation/preset_baselines.json`.
2. Pick the simplest preset first: `single-late-career`.
3. Enter the same assumptions into one free/public comparator.
4. Record output in a new file under `validation/external-results/`.
5. Compare only the metrics the external tool actually exposes.
6. Explain differences before changing engine logic.
7. Repeat with `diy-couple`, then `retired-traditional`, then the more complex DB/FIRE cases.

## Variance Tolerance

Use this as a rough triage guide:

- **0-3% variance** on ending portfolio or lifetime income: excellent, likely just rounding/timing.
- **3-10% variance**: acceptable if assumptions differ and the variance can be explained.
- **10-20% variance**: investigate; usually tax, indexing, withdrawal order, or CPP/OAS timing differs.
- **20%+ variance**: likely model mismatch, input mismatch, or a bug in one tool.

Tax and OAS-clawback comparisons should be tighter in simple cases and looser in complex household cases, especially when the other planner does not expose its tax calculation details.

## Handling Credentials

Do not commit credentials, screenshots with private profile details, exported personal plans, or paid-tool session data.

If a paid tool is used, prefer an interactive login in the browser and a synthetic household based on the presets, not real personal data. Store only benchmark outputs that are allowed by the platform's terms.
