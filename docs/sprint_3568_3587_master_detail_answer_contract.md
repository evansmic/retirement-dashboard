# Sprint 3568-3587 Master Detail Answer Contract

## Goal

Create a first implementation package for the retirement answer layer that follows the example master-detail spreadsheet as the evidence standard before the graphical UI redesign begins.

## Implemented

- Added `MasterDetailRow` and `selectMasterDetailRows` in the result selector layer.
- The master-detail rows trace annual spending, additional expenses, income, portfolio withdrawals, tax, balances, mortgage/debt movement, net worth, estate-before-tax evidence, and money-flow reconciliation.
- Added a local `Download master-detail CSV` result export beside the existing year-by-year CSV.
- Added card-level master-detail evidence references so answer cards can identify the supporting year and fields.
- Added annual and monthly after-tax spending deltas to scenario comparisons.
- Added `selectScenarioDecisionSummary` to summarize which available alternate is best for spending room, tax efficiency, estate/cushion, and funded horizon.
- Added a compact Scenario Decision Summary panel in Details so the trade-off explanation is visible before graphical redesign.
- Answer cards now rank scenario deltas by the card question: spending cards prefer after-tax spending support, tax cards prefer lower lifetime tax, estate/account cards prefer ending portfolio, and verdict/risk cards prefer funded horizon.
- Focused scenario deltas now carry plain-language explanation and trade-off caveat text, so each answer card can say why the comparison matters before graphical redesign.
- Expanded the retirement answer layer from five broad cards to nine answer cards:
  - retirement verdict
  - spending supported
  - funding path
  - account path
  - tax drag
  - net worth and estate
  - goals and outflows
  - risk review
  - next moves

## Boundaries

- This sprint does not add final graphical UI redesign work.
- This sprint does not create custom year-by-year withdrawal instructions.
- The master-detail export uses current simulator evidence. Per-account sequencing can become deeper as the full optimizer emits account-level annual instructions.

## Next Package

The answer layer now has enough structure to pause broad presentation work. The next meaningful workstream is the optimizer path for account-level annual instructions, so the master-detail sheet can move from grouped withdrawals to exact account-by-account funding instructions.
