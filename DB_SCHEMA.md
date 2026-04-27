# DB_SCHEMA.md

## Preamble

This project has **no database**. All state lives in-memory within the browser for a session. The "schema" below describes the **intake payload** (`D`) that flows from `index.html` into `retirement_dashboard.html` via the URL hash, and the **year-row shape** produced by the simulation engine. Treat this file as the data contract.

## Current known entities

### `D` — intake payload (serialized to URL hash)

```
D = {
  schemaVersion: number,    // current = 2; bumped on breaking shape changes
  p1:          Person,
  p2:          Person,
  spending:    Spending,
  assumptions: Assumptions,
  mortgage?:   Mortgage,
  loc?:        LOC,
  cashWedge?:  CashWedge,
  inheritance: number,      // $ target at plan end (today's dollars)
  ...           // misc Phase 3 additions
}
```

### Schema version + migration (Sprint 1 #46, #47–#49)

Every payload carries a `schemaVersion`. The dashboard's `migrate(D)` function
(in `retirement_dashboard.html`) walks an incoming payload forward through
registered upgrade steps until it matches the current `SCHEMA_VERSION`. A
payload without a `schemaVersion` field is treated as v1 (every saved hash
from before this field was added is structurally v1).

**Version history:**
- **v1** — initial schema-versioned payload (Sprint 1 #46).
- **v2** — Sprint 1 #47–#49: renamed `frank` → `p1`, `moon` → `p2`, and
  `assumptions.frankDiesInSurvivor` → `assumptions.p1DiesInSurvivor`.
  `MIGRATIONS[1]` performs the rename for any legacy hash.

Adding a future migration: define `MIGRATIONS[N] = function(d) { ...; d.schemaVersion = N+1; return d; }`
and bump `SCHEMA_VERSION`.

### `Person` (used for both `p1` and `p2`)

Required:
- `name: string`
- `dob: number` — year
- `dobMonth: number` — 1–12
- `retireYear: number` — per-spouse
- `rrsp: number`, `tfsa: number`, `lif: number`, `nonreg: number`
- `nonregAcb: number` — adjusted cost base (capital gains tracking)
- `cpp70_monthly: number` (and `cpp65_monthly` if split)
- `oas_monthly: number`

Optional — Phase 5 pre-retirement:
- `salary: number`
- `salaryRefYear: number` — base year (default 2026)
- `salaryRaise: number` — annual, default 0.03
- `annualRrspContrib, annualTfsaContrib, annualNonregContrib: number`

Optional — DB pension:
- `db_before65, db_after65: number`
- `db_index: number` — default 0.022
- `db_startYear: number` — defaults to retireYear

Optional — TFSA room tracking:
- `tfsaRoom: number`
- `tfsaAnnual: number` — prior-year contribution

Optional — survivor fields (P2 only):
- `cppSurvivor_under65, cppSurvivor_over65: number`

### `Spending`

- `gogo: number`, `gogoEnd: number` (age)
- `slowgo: number`, `slowgoEnd: number`
- `nogo: number`
- Figures in today's dollars (at plan start year), indexed by inflation forward.

### `Assumptions`

- `retireYear: number` — derived = `Math.min(p1.retireYear, p2.retireYear)` (advisory).
- `planStart: number | null` — optional earlier plan-start year (enables working-years modelling).
- `planEnd: number`
- `p1DiesInSurvivor: number` — survivor-scenario death year.
- `returnRate: number`, `inflation: number`, `returnStdDev: number`
- `horizon: number` — max age to project.
- `youngerSpouseRrif: boolean` — RRIF factor based on younger spouse's age.
- `cppSharing: boolean`
- `withdrawalOrder: 'default' | 'meltdown'` — CFM N→T→R or meltdown.
- `spousalRrsp: { contributor: 'f'|'m', contribs: { [year]: amount } } | null`
- `monteCarloPaths: number` — default 1000.

### Year-row shape (dashboard engine output)

Each simulated year emits an object with:
- Core: `year, ageF, ageM, p1Alive`
- Phase 5: `salary_f, salary_m, working_f, working_m, rrspContrib_f/m, tfsaContrib_f/m, nregContrib_f/m`
- Income: `dbPension, dbPension_m, dbSurvivor, cpp_f, cpp_m, oas_f, oas_m` (OAS net of clawback)
- Draws: `rrif_draw_f, rrif_draw_m, lif_min_f/m, lif_draw, tfsa_draw_f/m, tfsa_draw, nonreg_draw_f/m, nonreg_draw, splitAmt, cash_draw`
- Tax/net: `grossIncome, totalTaxYear, clawF, clawM, totalOasClawY, afterTaxReg, totalAftaxYear, spending, mortgage, cashFlow, surplus, shortfall`
- Balances: `bal_rrsp_f/m, bal_rrsp, bal_tfsa, bal_lif, bal_nonreg, bal_cash, bal_total`
- Events: `downsize_proceeds, oneOff_outflow`

## Relationships

None — the schema is a flat household document. Everything is nested under `D`. There are no foreign keys because there is no database.

## Required fields (minimum viable payload)

- `p1.dob, p1.retireYear`
- At least one of `p1.rrsp/tfsa/nonreg` (non-zero, else plan can't meaningfully run)
- `spending.gogo` (non-zero)
- `assumptions.planEnd, returnRate, inflation`

All other fields default to 0 or a sensible value.

## Suggested improvements

- **Introduce a `Household` wrapper** instead of hard-coded `p1` / `p2` keys. Today those are engine-internal; intake labels are user-provided (`Person 1` / `Person 2`). A `household.people[]` array would support single-person plans and could extend to >2 (e.g. adult-dependent scenarios) without further schema changes.
- **Field-level units.** Today callers must know that `cpp70_monthly` is monthly while `db_after65` is annual. A shared convention (always annual, documented) or explicit unit suffixes would prevent mistakes.
- **Validation layer.** A `validate(D)` function that returns `{ errors, warnings }` before encoding. Missing required fields should surface in the UI, not silently default to zero.
- **Save/load roundtrip.** A `.plan.json` export of `D` plus top-level metadata (last-saved date, schema version, plan name).

## Unknowns needing decisions

- Do we formalise the `D` schema into a TypeScript/JSDoc interface, or keep it duck-typed? *(Sprint 1 #56 picks the JSDoc `@typedef` route.)*
- Should we ever persist outside the browser? (Local-file export is cheap; cloud sync is a product decision.)
