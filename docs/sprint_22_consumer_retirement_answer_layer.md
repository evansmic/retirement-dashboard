# Sprint 22: Consumer Retirement Answer Layer

## Summary

Sprint 22 starts shifting Results from an engineering-style diagnostic surface toward a consumer retirement-planning experience. The new Overview lead answers the household question first: whether retirement appears supportable, how spending fits, whether a projected estate looks intentional, and what to review next.

This sprint does not add a true optimizer. It uses existing simulation output and scenario reruns to improve interpretation, language, and recommendation framing.

## What Changed

- Added `selectRetirementAnswerSummary` as a runtime-only selector for the consumer-facing retirement answer.
- Added a new Overview panel for:
  - "Can I retire?"
  - spending fit
  - estate intent
  - prioritized review actions
- Reframed strongly funded plans with no estate target as lifestyle/estate-intent reviews instead of automatically rewarding larger ending balances.
- Adjusted the suggested-plan selection so "spend less early" does not overtake the current plan solely because it leaves more money in an already estate-heavy projection.
- Simplified Results navigation labels for consumers:
  - Annual Detail → Year-by-year
  - Cash Flow → Money Flow
  - Income Sources → Income
  - Stress Tests → Risks
  - Household Resilience → Survivor Impact
  - Export/Save → Save & print
- Removed top-level schema language from Overview metrics and replaced "stable dashboard" actions with "detailed report" language in the primary Results surface.

## Product Lens

The dashboard should feel like a calm retirement planner sitting beside the household:

- reassure first, then diagnose
- lifestyle fit before terminal portfolio maximization
- estate intent before assuming more estate is always better
- tax efficiency as a way to preserve choice and reduce waste
- advanced audit/detail available, but not forced into the main consumer story

## Verification

Sprint 22 should pass:

- `npm test`
- `npm run build`
- `node probes/probe_simulation_engine_parity.js && node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- `find . -name '*.plan.json' -print`

No `.plan.json` files should be created in the repository.
