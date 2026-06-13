# S2928-S2947: Optimizer Timeline Reassessment And Static Mock Implementation Decision Gate

**Status:** Complete 2026-06-13.

**Correction:** S2948-S2967 supersedes the no-material-change estimate in this package. The project now tracks remaining sprint estimates after every 20-sprint package.

## Goal

Perform the next 100-sprint material timeline reassessment and decide whether a future tester-only hand-written static mock surface implementation package may proceed.

The timeline estimate has no material change from the S2628 baseline:

- Internal tester optimizer prototype: 80-120 sprints from S2628.
- Feature-complete app optimizer beta: 180-260 sprints from S2628.
- Public-ready optimizer for real planning use: 300-450 sprints from S2628.

The implementation decision is yes, but only for a later package. This package adds the decision gate and keeps implementation, rendered rows, calculations, generated account order, tax-bracket targets, saved sequencing, CSV output, reports, production UI, final instructions, tax-bracket instructions, schema changes, and `.plan.json` generation blocked.

## Non-Scope

- Saved plan schema changes.
- Engine output schema changes.
- Persisted optimizer output.
- Printable report output changes.
- CSV output changes.
- `.plan.json` files.
- Production UI promotion.
- Final advice-like copy.
- Tax-bracket instructions.
- Exportable sequencing output.
- Final annual instructions.
- New optimizer behavior.
- In-app feedback collection or scoring.
- Approval or unlock logic for generated rows.
- Issue creation, cleanup task creation, or model repair automation.
- Annual instruction calculations.
- Annual instruction prototype implementation.
- Mapping functions or generated instruction rows.
- Static row mock implementation in this package.
- Rendered static mock rows in this package.
- Rendered fixture rows.
- Fixture calculations or fixture export.
- Copy generation.
- Changed public-readiness estimates.

## Completed Path

### S2928-S2932: Timeline Reassessment Batch

Rechecked the S2628 baseline and found no material change to the internal tester, beta, or public-ready estimates.

### S2933-S2937: Implementation Decision Batch

Added a decision gate that allows a future tester-only hand-written static mock surface implementation package.

### S2938-S2942: Blocked-Output Batch

Kept implementation in this package, calculated values, generated account order, tax-bracket targets, saved sequencing, CSV output, reports, production UI, and schema changes blocked.

### S2943-S2947: Verification And Closeout

Ran UI structure checks, focused optimizer tests, plan-file tests, production build, file guards, and browser verification.

## Definition Of Done

- Tiny tester surface remains Details-only and tester-only.
- Third optimizer timeline checkpoint is visible.
- Material estimate change is recorded as no.
- Next material checkpoint is updated to S3028-S3047.
- Static mock implementation decision gate is visible.
- Gate allows a future implementation package only.
- No implementation or rendered static mock rows are added in this package.
- Calculated annual withdrawal amounts, generated account order, and tax-bracket targets remain blocked.
- Saved sequencing, CSV output, report output, production UI, final instructions, tax-bracket instructions, and schema changes remain blocked.
- Saved plan schema remains unchanged.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, UI structure tests, plan-file tests, browser checks, and production build pass.

## Next Recommended Package

S2948-S2967: Tester-Only Static Mock Surface Implementation Slice.

Goal: implement a small hand-written static mock surface inside Results Details for made-up scenario comprehension testing only, while keeping calculations, generated account order, tax-bracket targets, saved sequencing, CSV output, report output, production UI, final instructions, schema changes, and `.plan.json` generation blocked.
