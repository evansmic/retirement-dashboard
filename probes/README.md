# probes/

Node-based regression probes for the dashboard engine. Each probe loads `retirement_dashboard.html`, extracts its `<script>` block, executes it inside a `new Function()` with a stubbed DOM, and asserts on the simulation output.

## Canonical regression suite (always run these before merging)

| Probe | Scope | Checks |
|---|---|---|
| `probe_phase4_final.js` | Scenarios + Monte Carlo + sequence stress + full-spending-funded metric + stress severity + `cfg.returnRates` override | 25 |
| `probe_phase5.js` | Pre-retirement engine, staggered retirement, dual DB pensions | 14 |
| `probe_phase5_e2e.js` | End-to-end with working years, MC, lifetime totals, transition continuity | 12 |
| `probe_phase5_intake.js` | Intake-form payload → dashboard round-trip | 12 |
| `probe_schema_migrate.js` | `schemaVersion` + `migrate(D)` + v1→v2 rename migration (Sprint 1 #46/#47–#49) | 19 |
| `probe_presets.js` | Example-preset registry + blank-state loader + `?example=<slug>` routing (Sprint 1 #58) | 53 |
| `probe_intake_roundtrip.js` | `gatherD(populateFromD(D)) === D` deep-equality across the form's full payload (Sprint 2 #59) | 22 |
| `probe_mc_progressive.js` | `mcBegin`/`mcStep`/`mcFinish` decomposition + `monteCarloProgressive` lifecycle, batching, cancellation, and stress-severity shape (Sprint 2 #52, Sprint 0 S0-05) | 35 |
| `probe_pension_credit.js` | Pension-income-credit eligibility for ordinary taxable income, DB, RRIF/LIF-style income, P2 eligibility, and split pension (Sprint 0 S0-01) | 8 |
| `probe_tax_ages_64_72.js` | Age 64-72 tax/benefit fixtures for CPP/OAS starts, age credit, Health Premium, OAS clawback, RRIF/LIF minimums, and pension splitting (Sprint 0 S0-02) | 36 |
| `probe_validation_exports.js` | Validation baseline export shape: annual rows, taxable income, balances, withdrawals, tax, benefits, dollar-mode metadata (Sprint 0 S0-07) | 178 |

**Total: 414 checks. All must pass — also enforced in CI (Sprint 1 #57) via `.github/workflows/probes.yml`.**

## Run them

```bash
cd "Retirement Plan Dashboard/probes"
./run_all.sh
```

Or individually:

```bash
node probe_phase5.js
```

## Legacy probes

The remaining `probe_*.js` files (probe_balances, probe_clawback, probe_cppshare, probe_events, probe_mc, probe_order, probe_seq, probe_spousal, probe_sustain, probe_wedge) are single-purpose probes from earlier phases. They may rely on assumptions that have shifted as the engine evolved. Useful for diagnosing a specific subsystem; not part of the canonical suite.

## How they work

Each probe:

1. Reads `../retirement_dashboard.html`.
2. Pulls out the first `<script>...</script>` block.
3. Strips the `window.location.hash` reference so the script doesn't try to rehydrate from a real URL.
4. Wraps the script body in `new Function("window", "document", body + "; return { ... };")`.
5. Calls it with stubbed `window` / `document` objects, capturing the engine functions and SCENARIOS/RESULTS objects.
6. Asserts on the returned data.

This means the engine must remain pure: any new global window/document touch outside the existing stubs will need a probe-side stub added.

## When to add a new probe

- Anytime you change `runSimulation`, `monteCarlo`, `sequenceOfReturnsStress`, `drawForGap`, or any tax / income calculator.
- Anytime you add a new field to `D` that the engine reads.
- Anytime you add a new scenario.

Convention: name probes `probe_<phase>_<short_label>.js` and put them here.
