# Sprint 23: Consumer Results Simplification

## Summary

Sprint 23 simplifies the Results journey after the retirement-answer layer. The top-level Results navigation now behaves like a consumer product: answer first, then risks, taxes, survivor impact, details, and save/print. Advanced diagnostic views remain available, but they no longer compete with the household's first answer.

This sprint preserves all existing result detail and does not change simulation output, saved plans, or schema v2.

## What Changed

- Reduced the primary Results navigation to:
  - Overview
  - Risks
  - Taxes
  - Survivor Impact
  - Details
  - Save & print
- Added a Details hub for advanced views:
  - Year-by-year projection
  - Money-in / money-out check
  - Income sources
  - Account balances
  - Plan assumptions
- Kept advanced views accessible and implemented for deeper review and future advisor or paid-license use.
- Made the Details tab active when a user drills into one of the advanced pages.
- Updated roadmap sequencing around the remaining planner/design feedback:
  - spending capacity
  - estate intent and tax efficiency
  - intake UX/help text
  - scenario choice redesign
  - optimizer prep

## Product Lens

The consumer should not have to start with every diagnostic surface. The first journey should answer:

- Can I retire?
- What could change that answer?
- What taxes or survivor issues matter?
- Where can I see deeper detail if I need it?
- How do I save or print the plan?

The detailed rows remain useful, but they are secondary to the household decision story.

## Verification

Sprint 23 should pass:

- `npm test`
- `npm run build`
- `node probes/probe_simulation_engine_parity.js && node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- `find . -name '*.plan.json' -print`

No `.plan.json` files should be created in the repository.
