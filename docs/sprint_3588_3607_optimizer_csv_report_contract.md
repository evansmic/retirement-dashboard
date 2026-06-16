# Sprint 3588-3607 Optimizer CSV/Report Contract

## Goal

Move back from answer-layer presentation work into optimizer annual sequencing readiness, without opening public CSV/report sequencing output yet.

## Implemented

- Extended `OptimizerCsvReportGate` with explicit future output contracts:
  - CSV column contract
  - printable report row contract
  - master-detail mapping hints
- The contract maps internal beta sequencing review rows into future master-detail fields:
  - year
  - account label
  - review amount
  - source evidence
  - tax context
  - constraint context
  - quality status
- The gate still keeps CSV sequencing output, report sequencing output, final annual instructions, tax-bracket wording, production UI, and saved schema changes blocked.
- Extended the master-detail selector with optional internal beta sequencing review fields.
- Public master-detail CSV output does not include those internal beta sequencing fields yet.
- Wired the app to pass optimizer beta sequencing rows into internal master-detail evidence while keeping `Download master-detail CSV` on the public-clean row set.
- Added a compact Sequencing Evidence Check in Details to show row count, quality mix, source years, and closed public-output status.
- Added a capped internal review table for the first five sequencing evidence rows.
- Added stop-condition copy for blocked adapters, review-before-use rows, closed CSV output, closed report output, and closed final annual instructions.
- Added a capped quality-repair summary from review-row quality reasons.

## Boundary

This package plans output shape only. It does not:

- add CSV sequencing columns
- add printable report sequencing rows
- change saved `.plan.json`
- change engine output schema
- expose production UI
- create final annual instructions
- create tax-bracket wording

## Next Package

Use this contract to enrich the runtime master-detail selector with internal beta sequencing review fields when the optimizer evidence is available, while keeping those fields out of public exports until the CSV/report gate is explicitly opened.

The app now passes optimizer beta sequencing review rows into internal review-only master-detail rows and shows a compact evidence check with a capped table, stop-condition copy, and quality-repair summary. The next package should either commit this coherent set or run the longer focused tests if local process stability allows.
