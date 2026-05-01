# Schema v3 Output Contract

Sprint 0 S0-12 drafts the minimum contract the next planner UI and optimizer can rely on. It is a product/engine contract, not an implemented migration yet.

The current dashboard payload is `schemaVersion = 2` and is still documented inline in `retirement_dashboard.html`. Schema v3 should be the first shape designed for the consumer-first, recommended-plan-first product.

## Goals

- Keep planning local-first: a complete plan can live in a local `.plan.json` file with no account.
- Separate user inputs from engine outputs.
- Present one recommended household plan by default, with advanced scenarios as diagnostics.
- Make annual rows stable enough for charts, validation exports, detailed tables, and future reports.
- Preserve enough metadata to explain why the engine chose a recommendation.
- Avoid embedding UI prose in engine outputs; return structured reasons and facts the UI can render.

## Non-Goals

- This does not define the final database schema for optional sync.
- This does not replace the current v2 hash format yet.
- This does not define every future province, Quebec/QPP, GIS, RDSP, estate, or advisor workflow field.
- This does not require the current prototype to stop producing five detailed scenario tabs immediately.

## Conventions

- Money values are CAD.
- Stored user input money values are in `baseYear` dollars unless the field explicitly says otherwise.
- Annual engine output rows are nominal by default and carry `dollarMode: "nominal"`.
- Rates are decimals: `0.05` means 5%.
- Dates use calendar years unless a month is explicitly needed.
- Person IDs are stable strings such as `p1`, `p2`, not display names.
- Account IDs are stable strings such as `p1_rrsp`, `joint_nonreg`, not UI labels.
- Unknown or unsupported optional fields should be ignored by older readers, not treated as fatal.

## Top-Level Plan File

```json
{
  "schemaVersion": 3,
  "app": {
    "name": "Canadian Retirement Planner",
    "createdAt": "2026-05-01T00:00:00.000Z",
    "updatedAt": "2026-05-01T00:00:00.000Z",
    "engineVersion": "0.3.0",
    "taxYear": 2026
  },
  "plan": {},
  "results": {}
}
```

`plan` is portable user input. `results` is disposable engine output and may be omitted from saved files if the app wants to recompute on load.

## Plan Input

```json
{
  "id": "local-plan-uuid",
  "title": "Household retirement plan",
  "baseYear": 2026,
  "province": "ON",
  "currency": "CAD",
  "household": {},
  "accounts": [],
  "incomeSources": [],
  "expenses": [],
  "events": [],
  "assumptions": {},
  "preferences": {}
}
```

### Household

```json
{
  "people": [
    {
      "id": "p1",
      "displayName": "Person 1",
      "birthYear": 1969,
      "birthMonth": 6,
      "retirementYear": 2031,
      "isPrimary": true
    }
  ],
  "relationship": {
    "status": "single|couple",
    "survivorOrder": ["p1", "p2"]
  }
}
```

Minimum person fields:

| Field | Required | Notes |
|---|---|---|
| `id` | yes | Stable engine key. |
| `displayName` | no | UI label only. Empty is allowed. |
| `birthYear` | yes | Used for age-based benefits, credits, RRIF/LIF rules. |
| `birthMonth` | no | Needed for future partial-year benefit precision. |
| `retirementYear` | yes | First full non-working year unless income sources say otherwise. |
| `isPrimary` | no | UI/order hint, not a tax concept. |

### Accounts

```json
{
  "id": "p1_rrsp",
  "ownerIds": ["p1"],
  "type": "rrsp|rrif|tfsa|nonreg|lira|lif|cash|home|debt",
  "balance": 250000,
  "adjustedCostBase": null,
  "contributionRoom": null,
  "annualContribution": 0,
  "returnProfileId": "balanced",
  "taxTreatment": "registered|taxFree|taxable|principalResidence|debt",
  "metadata": {}
}
```

Minimum account fields:

| Field | Required | Notes |
|---|---|---|
| `id` | yes | Stable row/account key. |
| `ownerIds` | yes | One or more person IDs. Joint non-reg uses both. |
| `type` | yes | Engine-recognized account category. |
| `balance` | yes | Opening balance in `baseYear` dollars. |
| `adjustedCostBase` | when taxable | Required for non-registered capital gain modelling. |
| `contributionRoom` | when relevant | TFSA/RRSP room if tracked. |
| `annualContribution` | no | Simple recurring contribution. More complex schedules belong in events. |
| `taxTreatment` | yes | Keeps UI labels separate from tax behaviour. |

### Income Sources

```json
{
  "id": "p1_cpp",
  "personId": "p1",
  "type": "salary|cpp|oas|dbPension|cppSurvivor|otherTaxable|otherTaxFree",
  "annualAmount": 12000,
  "amountYear": 2026,
  "startYear": 2026,
  "endYear": null,
  "startAge": 65,
  "indexed": true,
  "indexRateId": "cpp",
  "eligibleForPensionCredit": false,
  "splittable": false,
  "metadata": {}
}
```

Minimum income fields:

| Field | Required | Notes |
|---|---|---|
| `id` | yes | Stable source key. |
| `personId` | when person-specific | Omit only for household-level income. |
| `type` | yes | Drives tax/benefit treatment. |
| `annualAmount` | yes | Amount in `amountYear` dollars. |
| `startYear` or `startAge` | yes | At least one timing field required. |
| `indexed` | yes | Whether annual amount grows. |
| `eligibleForPensionCredit` | yes | Must be explicit; never infer from taxable income alone. |
| `splittable` | yes | Tax election eligibility, distinct from CPP sharing. |

### Expenses

```json
{
  "id": "base_lifestyle",
  "type": "lifestyle|core|housingDebt|healthCare|tax|other",
  "annualAmount": 80000,
  "amountYear": 2026,
  "startYear": 2026,
  "endYear": 2044,
  "phase": "goGo|slowGo|noGo|custom",
  "indexed": true,
  "priority": "core|discretionary",
  "metadata": {}
}
```

Minimum expense fields:

| Field | Required | Notes |
|---|---|---|
| `id` | yes | Stable expense key. |
| `type` | yes | Used for reporting and future core/discretionary stress tests. |
| `annualAmount` | yes | Amount in `amountYear` dollars. |
| `startYear` | yes | First applicable year. |
| `endYear` | no | Null means ongoing. |
| `indexed` | yes | Whether amount grows. |
| `priority` | yes | Needed for guardrails and core-spending coverage. |

### Events

```json
{
  "id": "downsize_home",
  "type": "oneOffExpense|downsize|inheritance|gift|death|sale|accountTransfer",
  "year": 2035,
  "amount": 250000,
  "amountYear": 2026,
  "personId": null,
  "accountId": null,
  "taxTreatment": "taxFree|taxable|capitalGain|registeredWithdrawal|none",
  "metadata": {}
}
```

Events should cover one-time changes that do not fit recurring income, expense, or account fields.

### Assumptions

```json
{
  "planStartYear": 2026,
  "planEndYear": 2064,
  "inflationRate": 0.025,
  "returnProfiles": [
    {
      "id": "balanced",
      "nominalReturn": 0.05,
      "standardDeviation": 0.10
    }
  ],
  "indexation": {
    "cpi": null,
    "cpp": null,
    "oas": null,
    "federalTax": null,
    "ontarioTax": null
  },
  "tax": {
    "taxYear": 2026,
    "province": "ON"
  },
  "benefits": {
    "cppSharing": false,
    "oasClawback": true
  },
  "registeredAccounts": {
    "youngerSpouseRrifElection": false
  },
  "risk": {
    "monteCarloPaths": 1000,
    "materialShortfallThreshold": 500
  }
}
```

### Preferences

```json
{
  "objective": "fundLifestyle|maximizeEstate|balanced",
  "bequestTarget": 0,
  "defaultDollarMode": "nominal|real",
  "allowedStrategies": {
    "cppStartAges": [65, 70],
    "oasStartAges": [65, 70],
    "withdrawalOrders": ["default", "meltdown"],
    "pensionSplitting": true,
    "cppSharing": true,
    "guardrails": false
  },
  "privacy": {
    "localOnly": true,
    "cloudSyncEnabled": false
  }
}
```

Preferences are not promises that the engine must optimize every dimension immediately. They define the search space and product intent.

## Results Output

```json
{
  "schemaVersion": 3,
  "engineVersion": "0.3.0",
  "generatedAt": "2026-05-01T00:00:00.000Z",
  "baseYear": 2026,
  "dollarMode": "nominal",
  "recommendedPlanId": "recommended",
  "plans": [],
  "diagnostics": [],
  "validation": {}
}
```

### Recommended Plan Result

```json
{
  "id": "recommended",
  "label": "Recommended plan",
  "role": "recommended",
  "strategy": {
    "cppStartAges": { "p1": 70, "p2": 70 },
    "oasStartAges": { "p1": 70, "p2": 70 },
    "withdrawalOrder": ["nonreg", "rrsp", "tfsa"],
    "pensionSplitting": true,
    "cppSharing": false,
    "spendingPolicy": "fixedTarget|guardrail|coreProtected",
    "spendMultiplier": 0.96
  },
  "recommendation": {
    "status": "recommended|needsReview|infeasible",
    "objective": "balanced",
    "reasons": [
      {
        "code": "DELAY_CPP_REDUCES_LONGEVITY_RISK",
        "severity": "info",
        "metricRefs": ["lifetimeCppOas", "firstShortfallYear"]
      }
    ],
    "tradeoffs": [
      {
        "code": "LOWER_EARLY_ESTATE_FOR_HIGHER_LATER_INCOME",
        "metricRefs": ["endingPortfolio", "lifetimeAfterTaxSpend"]
      }
    ],
    "limitations": [
      {
        "code": "ONTARIO_2026_TAX_ONLY",
        "source": "validation/tax_methodology_2026.md"
      }
    ]
  },
  "summary": {},
  "annual": []
}
```

Engine output may include multiple `plans`, but the UI should treat `recommendedPlanId` as the default first screen. Other plans are alternatives or stress diagnostics.

### Plan Summary

```json
{
  "startYear": 2026,
  "endYear": 2064,
  "firstShortfallYear": "Never",
  "portfolioDepletionYear": 2064,
  "endingPortfolio": 936,
  "lifetimeAfterTaxSpend": 4330393,
  "lifetimeTax": 407352,
  "lifetimeOasClawback": 0,
  "lifetimeCppOas": 1809627,
  "lifetimeDbPension": 0,
  "lifetimeRegisteredWithdrawals": 1574487,
  "lifetimeTfsaWithdrawals": 337798,
  "lifetimeNonRegWithdrawals": 51051,
  "maxAnnualShortfall": 500,
  "totalShortfall": 0,
  "coreSpendingCoverage": 1.0,
  "fullSpendingFunded": true
}
```

Summary metrics should be derivable from annual rows. They exist for fast UI rendering and validation exports.

### Annual Result Row

```json
{
  "year": 2026,
  "ages": { "p1": 57, "p2": 55 },
  "alive": { "p1": true, "p2": true },
  "dollarMode": "nominal",
  "realBaseYear": 2026,
  "income": {
    "salary": { "p1": 95000, "p2": 75000 },
    "dbPension": { "p1": 0, "p2": 0, "survivor": 0 },
    "cpp": { "p1": 0, "p2": 0 },
    "oasNet": { "p1": 0, "p2": 0 },
    "otherTaxable": 0,
    "taxableIncome": { "p1": 82000, "p2": 64000, "total": 146000 },
    "grossCashInflow": 170000
  },
  "withdrawals": {
    "registered": { "p1": 0, "p2": 0, "total": 0 },
    "tfsa": { "p1": 0, "p2": 0, "total": 0 },
    "nonreg": { "p1": 0, "p2": 0, "total": 0 },
    "cash": 0
  },
  "tax": {
    "incomeTax": 27901,
    "oasClawback": { "p1": 0, "p2": 0, "total": 0 },
    "total": 27901
  },
  "spending": {
    "target": 76648,
    "actual": 76648,
    "coreTarget": 76648,
    "coreActual": 76648,
    "shortfall": 0
  },
  "balances": {
    "accounts": {
      "p1_rrsp": 277200,
      "p2_rrsp": 200550
    },
    "byType": {
      "rrspRrif": 477750,
      "tfsa": 159600,
      "lif": 0,
      "nonreg": 42000,
      "cash": 0,
      "totalPortfolio": 679350
    }
  },
  "events": [],
  "flags": []
}
```

Minimum annual row groups:

| Group | Purpose |
|---|---|
| `year`, `ages`, `alive` | Timeline, survivor, and age-rule rendering. |
| `income` | Income stack, taxable income, and benefit validation. |
| `withdrawals` | Account-order explanation and implementation reports. |
| `tax` | Tax chart, OAS clawback, validation comparisons. |
| `spending` | Full-target funding, core coverage, shortfalls, guardrails. |
| `balances` | Account charts, estate values, depletion year. |
| `events` | Downsize, one-offs, death, inheritance, transfers. |
| `flags` | Explainable warnings such as capped LIF draw or unmet target. |

### Diagnostics

Diagnostics are supporting evidence, not the default product surface.

```json
{
  "id": "monteCarlo_recommended",
  "type": "monteCarlo|historicalSequence|alternativePlan|validationBaseline",
  "planId": "recommended",
  "label": "Monte Carlo",
  "summary": {
    "fullSpendingFundedRate": 0.42,
    "firstShortfallYear": { "earliest": 2038, "p50": 9999 },
    "maxShortfall": { "p10": 0, "p50": 0, "p90": 18000 },
    "totalShortfall": { "p10": 0, "p50": 0, "p90": 95000 },
    "portfolioDepletionYear": { "earliest": 2048, "p50": 9999 },
    "coreSpendingCoverage": { "p10": 0.92, "p50": 1.0, "p90": 1.0 },
    "endingPortfolio": { "p10": 0, "p50": 350000, "p90": 1200000 }
  },
  "series": []
}
```

Required diagnostic metrics:

- Full spending funded rate for Monte Carlo-style runs.
- First shortfall year.
- Max annual shortfall.
- Total shortfall.
- Portfolio depletion year.
- Core-spending coverage.
- Ending portfolio range.

### Validation Metadata

```json
{
  "methodology": "validation/tax_methodology_2026.md",
  "baselineExportVersion": 3,
  "engineHash": null,
  "knownLimitations": [
    "Ontario-only 2026 tax engine",
    "No GIS modelling",
    "No Quebec/QPP support"
  ],
  "comparators": [
    {
      "name": "Government of Canada Canadian Retirement Income Calculator",
      "status": "directional",
      "source": "validation/external-results/free_public_comparison_2026-04-28.md"
    }
  ]
}
```

## Mapping From Current v2 Dashboard

| v2/current | v3 target |
|---|---|
| `D.p1`, `D.p2` | `plan.household.people[]` plus person-owned accounts/income sources. |
| `D.p1.rrsp`, `D.p1.tfsa`, `D.p1.nonreg`, etc. | `plan.accounts[]`. |
| `D.p1.cpp65`, `D.p1.oasBase`, DB fields | `plan.incomeSources[]`. |
| `D.spending.gogo/slowgo/nogo` | `plan.expenses[]` with phases and priority. |
| `D.oneOffs`, `D.downsize`, survivor year | `plan.events[]`. |
| `D.assumptions` | `plan.assumptions` and `plan.preferences`. |
| `SCENARIOS.base/melt/zero/surv/maxs` | `results.plans[]` and `results.diagnostics[]`. |
| `RESULTS[key].years[]` | `results.plans[].annual[]`. |
| `validation/preset_baselines_yearly.csv` fields | Flattened view of `annual[]`. |

## Implementation Notes

- The v3 contract should be introduced as docs first, then as fixtures, then as code.
- Do not bump `SCHEMA_VERSION` in the dashboard until a migration and round-trip probe exist.
- The first implementation probe should verify that a v2 preset can be converted into a v3 `plan`, simulated, and flattened back into the current validation columns without numeric drift.
- The optimizer can start by producing a `recommended` plan using the current scenario machinery, then widen search over CPP/OAS timing, withdrawal order, pension splitting, CPP sharing, and guardrails.
- `.plan.json` export should be able to omit `results` for privacy/minimal storage, or include it for auditability and offline reports.
