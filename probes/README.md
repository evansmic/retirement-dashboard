# probes/

Node-based regression probes for the dashboard engine. Each probe loads `retirement_dashboard.html`, extracts its `<script>` block, executes it inside a `new Function()` with a stubbed DOM, and asserts on the simulation output.

## Canonical regression suite (always run these before merging)

| Probe | Scope | Checks |
|---|---|---|
| `probe_phase4_final.js` | Scenarios + Monte Carlo + sequence stress + POS + `cfg.returnRates` override | 17 |
| `probe_phase5.js` | Pre-retirement engine, staggered retirement, dual DB pensions | 14 |
| `probe_phase5_e2e.js` | End-to-end with working years, MC, lifetime totals, transition continuity | 12 |
| `probe_phase5_intake.js` | Intake-form payload → dashboard round-trip | 12 |
| `probe_schema_migrate.js` | `schemaVersion` + `migrate(D)` + v1→v2 rename migration (Sprint 1 #46/#47–#49) | 19 |

**Total: 74 checks. All must pass.**

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
