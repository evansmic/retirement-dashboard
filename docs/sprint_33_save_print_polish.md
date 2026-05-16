# Sprint 33: Save & Print Polish

Status: complete 2026-05-16

## Summary

Sprint 33 clarifies the two end-of-results actions. A household can save the editable plan file to keep working later, or open the printable report to read and inspect complete schedules.

This is a copy and flow polish sprint. It does not change the saved plan format, report route, simulation math, or persistence model.

## What Changed

- Reframed the local save action as **Save editable plan**.
- Reframed the report action as **Open printable report**.
- Updated the Start, Review, Results footer, Save & print panel, and readiness copy to keep those actions distinct.
- Changed the status strip from export language to saved editable-plan language.
- Kept `.plan.json` as the underlying local file format without making the extension the main consumer label.
- Added structure coverage so the UI keeps both action labels and does not regress to file-extension-first labels.

## Non-Scope

- No saved plan format changes.
- No cloud/account storage.
- No print/PDF migration.
- No simulation changes.
- No optimizer execution.
- No DB survivor pension modelling yet.

## Follow-Up

Sprint 34 should add DB survivor pension continuation inputs before optimizer execution.

## Verification

Run:

- `npm test`
- `npm run build`
- `node probes/probe_simulation_engine_parity.js && node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- `find . -name '*.plan.json' -print`

The final file search should return no private plan files created by the sprint.
