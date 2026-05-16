# Sprint 31: Consumer Copy Scrub

Status: complete 2026-05-16

## Summary

Sprint 31 removed remaining implementation/scaffolding language from the live React Results experience. The goal was not to redesign the dashboard or change modelling behavior; it was to make the product sound more like a calm retirement planner and less like an engineering migration surface.

## Goals

- Replace internal terms in user-facing UI with consumer-friendly planning language.
- Keep detailed-report handoffs consistent.
- Preserve all engine output, saved plan format, routes, and fallback behavior.
- Keep audit detail available while improving the words used to describe it.

## Implementation Notes

- Reframed stable-dashboard wording as **detailed report** in live selectors and panels.
- Replaced **source reconciliation** with **money-in / money-out check** in consumer-facing strings.
- Replaced **cash-flow delta** with **unexplained gap** in visible metrics and tables.
- Replaced implementation/checklist/runtime wording with review-step language that explains what the household should do next.
- Reframed bounded-preview language as **first-pass review** or **first-pass checks**.
- Left historical docs, code identifiers, and internal test names alone where the language describes implementation history rather than the live UI.

## Non-Scope

- No simulation changes.
- No saved plan format changes.
- No optimizer execution.
- No DB survivor pension modelling yet.
- No full Overview layout simplification.
- No print/PDF migration.

## Follow-Up

- Sprint 32 should simplify the Overview content order and move audit-style panels into Details/Risks.
- Sprint 34 should add DB survivor pension continuation inputs before optimizer execution.

## Verification

Run:

- `npm test`
- `npm run build`
- `node probes/probe_simulation_engine_parity.js && node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- `find . -name '*.plan.json' -print`

The final file search should return no private plan files created by the sprint.
