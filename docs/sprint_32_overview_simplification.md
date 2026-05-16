# Sprint 32: Overview Simplification

Status: complete 2026-05-16

## Summary

Sprint 32 keeps the Results Overview focused on the household answer. It moves audit-style diagnostics into Details while preserving every existing selector, evidence panel, and detailed-report fallback.

The Overview should now read more like a retirement-planning conversation: can I retire, how much can I spend, what estate/tax choices matter, which path should I review, what choices should I compare, what happens to the survivor, and what should I do next.

## What Changed

- Kept these sections on Overview:
  - retirement answer
  - spending capacity
  - estate intent
  - projection summary
  - suggested plan to review
  - household scenario cards
  - survivor snapshot
  - readiness rows
- Moved these audit-style sections into Details:
  - plan health diagnostic panel
  - first-year money-flow evidence
  - money-in / money-out diagnostics
  - decision checklist and decision detail rows
  - projection path table
  - tax pressure timeline
  - scenario assumption and comparison tables
  - optimizer boundary and input-review prep panels
- Added a small structure test that guards the Overview/Details split.

## Non-Scope

- No simulation changes.
- No selector output changes.
- No saved plan format changes.
- No optimizer execution.
- No DB survivor pension modelling yet.
- No full visual redesign.

## Follow-Up

- Sprint 33 should polish Save & print so “Save editable plan” and “Open printable report” are clearly separate consumer actions.
- Sprint 34 should add DB survivor pension continuation inputs before optimizer execution.

## Verification

Run:

- `npm test`
- `npm run build`
- `node probes/probe_simulation_engine_parity.js && node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- `find . -name '*.plan.json' -print`

The final file search should return no private plan files created by the sprint.
