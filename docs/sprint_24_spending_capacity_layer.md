# Sprint 24: Spending Capacity Layer

## Summary

Sprint 24 adds the first consumer-facing answer to "How much can I spend?" It does not introduce a full optimizer. Instead, it uses the existing baseline projection, the existing 10% lower early-spending scenario, projected money left, estate target, and the retirement-answer posture to classify spending as flexible, balanced, tight, needing repair, or not yet estimable.

## What Changed

- Added `selectSpendingCapacitySummary` as a runtime-only selector.
- Added a Spending Capacity panel directly under the retirement answer on Overview.
- Shows current early, later, and late-life spending targets.
- For estate-heavy plans with no estate target, surfaces a bounded possible annual lifestyle-room estimate instead of implying that preserving more estate is automatically better.
- For shortfall plans, uses the existing lower-spending scenario to show a first repair amount when that scenario resolves the visible shortfall.
- Keeps all output runtime-only and avoids changing simulation results, saved plans, or schema v2.

## Product Lens

The spending answer should help a household understand whether the current lifestyle target is:

- too high and needs repair
- possible but tight
- reasonably supportable
- potentially too conservative if a large estate is not intentional

This is a first-pass planning interpretation, not a custom spending optimizer.

## Verification

Sprint 24 should pass:

- `npm test`
- `npm run build`
- `node probes/probe_simulation_engine_parity.js && node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- `find . -name '*.plan.json' -print`

No `.plan.json` files should be created in the repository.
