# Sprint S3568-S3587: Assumption Lab Contract

Status: Complete 2026-06-13.

## Goal

Start the assumption-adjustment experience from the answer layer. Details should expose slider-ready controls for changing key assumptions, compare the current plan against alternatives, and identify the optimal review path from the current compared set.

## Completed

- Added `AssumptionLabSummary`, `AssumptionLabControl`, and `AssumptionLabComparisonSlot`.
- Added `selectAssumptionLabSummary`.
- Defined slider-ready controls for:
  - Retirement age
  - CPP/OAS timing
  - Investment return
  - Early spending
  - Residence sale date
  - Survivor year
- Added side-by-side comparison slots:
  - Current plan
  - Optimal review path
  - Comparison A
  - Comparison B
- Surfaced the assumption lab in Details above existing scenario evidence.
- Kept existing detailed scenario tables behind the research flag.
- Preserved the boundary that this package does not yet mutate plan inputs from Results, persist scenario output, create account instructions, or turn the optimal review path into personal financial advice.

## Boundary

This package defines and displays the assumption lab contract. The controls are slider-ready but not yet wired to mutate plan inputs or rerun simulations from Details. The next package should add the rerun queue and progress feedback.

## Verification

- `npm run test:focused`
- `npm test -- app/src/engine/resultSelectors.test.ts`
- `npm run build`

The full `npm test` command remains deferred because the current machine has limited free disk space and the full suite previously hung after early passing suites.

## Next Package

Wire Details assumption controls to a local rerun queue with progress feedback. Adjusted assumptions should rerun the projection, refresh the optimal review path, and update the two comparison slots without saving scenario output into `.plan.json`.
