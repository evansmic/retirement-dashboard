# S2828-S2847: Optimizer Timeline Reassessment And Static Mock Surface Planning Checkpoint

**Status:** Complete 2026-06-13.

## Goal

Reassess the optimizer timeline at the next 100-sprint checkpoint and decide whether future static mock surface planning can proceed.

## Timeline Reassessment

The S2628 baseline remains the working estimate:

- Internal tester optimizer prototype: 80-120 sprints from S2628.
- Feature-complete app optimizer beta: 180-260 sprints from S2628.
- Public-ready optimizer for real planning use: 300-450 sprints from S2628.

Material change at this checkpoint: no.

Next material checkpoint: S2928-S2947.

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
- In-app feedback collection.
- Feedback scoring.
- Approval or unlock logic for rendered rows.
- Issue creation.
- Cleanup task creation.
- Model repair automation.
- Annual instruction calculations.
- Annual instruction prototype implementation.
- Mapping functions.
- Generated instruction rows.
- Static row mock implementation.
- Static mock rows.
- Rendered fixture rows.
- Fixture calculations.
- Fixture export.
- Copy generation.
- Timeline approval logic.
- Changed public-readiness estimates.

## Completed Path

### S2828-S2832 — Timeline Reassessment Batch

Rechecked the S2628 baseline against current progress. Static mock planning boundaries are clearer, but rendered rows, generated sequencing, saved output, CSV output, reports, production UI, broader tester evidence, and public-use validation are still missing. No estimate changed materially.

### S2833-S2837 — Static Mock Surface Planning Checkpoint Batch

Recorded that the static mock boundary, copy contract, fixture boundary, and approval gate are ready for future static surface planning only.

### S2838-S2842 — Blocked Output Batch

Kept rendered rows, calculated values, generated account order, tax-bracket targets, saved output, CSV output, reports, production UI, final instructions, tax-bracket instructions, and schema changes blocked in visible tester-surface checkpoint copy and source checks.

### S2843-S2847 — Verification And Closeout

Closed the package with source-structure tests, focused optimizer tests, plan-file tests, production build, file guards, and browser verification.

## Definition Of Done

- Tiny tester surface remains Details-only and tester-only.
- Second optimizer timeline checkpoint is visible.
- Material estimate change is recorded as no.
- Next material checkpoint is updated to S2928-S2947.
- Static mock surface planning checkpoint is visible.
- Future work is limited to static surface planning only.
- Rendered mock rows, calculated values, generated account order, saved output, CSV output, reports, production UI, final instructions, tax-bracket instructions, and schema changes remain blocked.
- Saved plan schema remains unchanged.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, UI structure tests, plan-file tests, browser checks, and production build pass.

## Next Recommended Package

S2848-S2867: Annual Instruction Static Mock Surface Placement Boundary.

Goal: define where a future hand-written static mock surface could appear inside Results Details while still not rendering mock rows, calculating values, generating account order, creating tax-bracket targets, saving sequencing, exporting CSV, changing reports, promoting production UI, changing schemas, or generating `.plan.json` files.
