# Sprint 326: Benefit Timing Top-Three Evidence

Sprint 326 adds a compact comparison row for the leading CPP/OAS milestone pairs.

## What Changed

- Added an "Other milestone pairs to compare" evidence row.
- The row lists the top three bounded milestone pairs from the existing grid.
- Preserved the first milestone pair, funded-year, lifetime-tax, money-left, and bridge-year evidence.
- Kept the output in Details research output, not Overview.

## Boundaries

- No new candidates.
- No saved optimizer output.
- No saved plan schema change.
- No engine output schema change.
- No annual account-level withdrawal instructions.
- No full exhaustive CPP/OAS search.
- No Monte Carlo-in-loop search.

## Verification

- `npm test -- app/src/engine/boundedOptimizer.test.ts app/src/ui/App.structure.test.js`

## Next Step

Sprint 327 should run and document a benefit-timing example matrix before changing guardrails.
