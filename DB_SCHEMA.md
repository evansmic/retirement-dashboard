# DB_SCHEMA.md

## Preamble

This project has **no database**. All state lives in-memory within the browser for a session. The "schema" below describes the **intake payload** (`D`) that flows from `index.html` into `retirement_dashboard.html` via the URL hash, and the **year-row shape** produced by the simulation engine. Treat this file as the data contract.

## Current known entities

### `D` — intake payload (serialized to URL hash)

```
D = {
  frank:       Person,
  moon:        Person,
  spending:    Spending,
  assumptions: Assumptions,
  mortgage?:   Mortgage,
  loc?:        LOC,
  cashWedge?:  CashWedge,
  inheritance: number,      // $ target at plan end (today's dollars)
  ...           // misc Phase 3 additions
}
```

### `Person` (used for both `frank` and `moon`)

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

Optional — survivor fields (Moon only):
- `cppSurvivor_under65, cppSurvivor_over65: number`

### `Spending`

- `gogo: number`, `gogoEnd: number` (age)
- `slowgo: number`, `slowgoEnd: number`
- `nogo: number`
- Figures in today's dollars (at plan start year), indexed by inflation forward.

### `Assumptions`

- `retireYear: number` — derived = `Math.min(frank.retireYear, moon.retireYear)` (advisory).
- `planStart: number | null` — optional earlier plan-start year (enables working-years modelling).
- `planEnd: number`
- `frankDiesInSurvivor: number` — survivor-scenario death year.
- `returnRate: number`, `inflation: number`, `returnStdDev: number`
- `horizon: number` — max age to project.
- `youngerSpouseRrif: boolean` — RRIF factor based on younger spouse's age.
- `cppSharing: boolean`
- `withdrawalOrder: 'default' | 'meltdown'` — CFM N→T→R or meltdown.
- `spousalRrsp: { contributor: 'frank'|'moon', contribs: { [year]: amount } } | null`
- `monteCarloPaths: number` — default 1000.

### Year-row shape (dashboard engine output)

Each simulated year emits an object with:
- Core: `year, ageF, ageM, frankAlive`
- Phase 5: `salary_f, salary_m, working_f, working_m, rrspContrib_f/m, tfsaContrib_f/m, nregContrib_f/m`
- Income: `dbPension, dbPension_m, dbSurvivor, cpp_f, cpp_m, oas_f, oas_m` (OAS net of clawback)
- Draws: `rrif_draw_f, rrif_draw_m, lif_min_f/m, lif_draw, tfsa_draw_f/m, tfsa_draw, nonreg_draw_f/m, nonreg_draw, splitAmt, cash_draw`
- Tax/net: `grossIncome, totalTaxYear, clawF, clawM, totalOasClawY, afterTaxReg, totalAftaxYear, spending, mortgage, cashFlow, surplus, shortfall`
- Balances: `bal_rrsp_f/m, bal_rrsp, bal_tfsa, bal_lif, bal_nonreg, bal_cash, bal_total`
- Events: `downsize_proceeds, oneOff_outflow`

## Relationships

None — the schema is a flat household document. Everything is nested under `D`. There are no foreign keys because there is no database.

## Required fields (minimum viable payload)

- `frank.dob, frank.retireYear`
- At least one of `frank.rrsp/tfsa/nonreg` (non-zero, else plan can't meaningfully run)
- `spending.gogo` (non-zero)
- `assumptions.planEnd, returnRate, inflation`

All other fields default to 0 or a sensible value.

## Suggested improvements

- **Introduce a `Household` wrapper** instead of hard-coded `frank` / `moon` keys. Today those are engine-internal; intake labels are user-provided (`Person 1` / `Person 2`). A `household.people[]` array would support single-person plans and could extend to >2 (e.g. adult-dependent scenarios) without renaming.
- **Schema version field.** Add `D.schemaVersion: number`. When the hash-encoded payload changes shape, the dashboard can migrate or warn.
- **Field-level units.** Today callers must know that `cpp70_monthly` is monthly while `db_after65` is annual. A shared convention (always annual, documented) or explicit unit suffixes would prevent mistakes.
- **Validation layer.** A `validate(D)` function that returns `{ errors, warnings }` before encoding. Missing required fields should surface in the UI, not silently default to zero.
- **Save/load roundtrip.** A `.plan.json` export of `D` plus top-level metadata (last-saved date, schema version, plan name).

## Unknowns needing decisions

- Do we formalise the `D` schema into a TypeScript/JSDoc interface, or keep it duck-typed?
- Is `frank`/`moon` renaming to `person1`/`person2` (or `primary`/`spouse`) worth the breaking change to saved hashes?
- Should we ever persist outside the browser? (Local-file export is cheap; cloud sync is a product decision.)
