# Sprint 14 Stress Tests Preview Expansion

This bounded slice expands the React `Stress Tests` tab from the baseline stress read into a fuller preview panel while keeping the stable dashboard as the complete fallback.

## Goal

Give users one React place to review:

- Baseline stress summary and evidence rows.
- The five baseline stress indicator metrics.
- Bounded scenario comparison reruns for retirement timing, go-go spending, and CPP/OAS timing.
- Household survivor-resilience detail when a couple plan has enough inputs.

## Scope

- Reuse existing runtime selectors for scenario comparison and survivor resilience.
- Keep all new Stress Tests content derived from in-memory simulation results.
- Keep `.plan.json` schema and simulation output unchanged.
- Preserve the stable dashboard handoff for Monte Carlo, historical sequence stress, legacy charts, full audit schedules, and print/PDF.

## Non-Scope

- New stress engine logic.
- Optimizer changes.
- Persisted scenario or survivor output.
- Schema v3 output migration.
- Report, PDF, or export migration.

## Verification

- `npm test`
- `npm run build`
- `node probes/probe_simulation_engine_parity.js && node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- Confirm no `.plan.json` files were created in the repo.
