# S2728-S2747: Optimizer Timeline Reassessment And Prototype Shape Checkpoint

**Status:** Complete 2026-06-12.

## Goal

Reassess the optimizer timeline estimate after the first 100-sprint checkpoint and confirm whether the annual instruction prototype shape/source mapping is ready for a future non-generative static row mock.

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
- Approval or unlock logic.
- Issue creation.
- Cleanup task creation.
- Model repair automation.
- Annual instruction calculations.
- Annual instruction prototype implementation.
- Mapping functions.
- Generated instruction rows.
- Static row mock implementation.
- Timeline approval logic.

## Timeline Reassessment

The S2628 baseline remains the working estimate:

- Internal tester optimizer prototype: 80-120 sprints from S2628.
- Feature-complete app optimizer beta: 180-260 sprints from S2628.
- Public-ready optimizer for real planning use: 300-450 sprints from S2628.

Material change at this checkpoint: no.

Next material checkpoint: S2828-S2847.

## Completed Path

### S2728-S2732 — Timeline Reassessment Batch

Rechecked the S2628 timeline baseline against current progress. Prototype shape and source mapping are clearer, but generated rows, tester evidence, saved output, CSV output, reports, production UI, and broader scenario evidence are still missing. No estimate changed materially.

### S2733-S2737 — Prototype Shape Checkpoint Batch

Recorded that the annual instruction prototype shape and source mapping are ready for a future non-generative static mock only. This does not approve generated rows, annual account instructions, account order instructions, tax-bracket instructions, saved sequencing, CSV output, reports, or production UI.

### S2738-S2742 — Blocked Output Batch

Kept generated rows, saved sequencing, CSV output, reports, production UI, final instructions, tax-bracket instructions, and schema changes blocked in visible tester-surface checkpoint copy and source checks.

### S2743-S2747 — Verification And Closeout

Closed the package with source-structure tests, focused optimizer tests, plan-file tests, production build, file guards, and browser verification.

## Definition Of Done

- Tiny tester surface remains Details-only and tester-only.
- Optimizer timeline estimates remain visible.
- Material estimate change is recorded as no.
- Next material checkpoint is updated to S2828-S2847.
- Prototype shape checkpoint is visible.
- Future work is limited to a non-generative static mock.
- Generated rows, saved sequencing, CSV output, report output, production UI, final instructions, tax-bracket instructions, and schema changes remain blocked.
- Saved plan schema remains unchanged.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, UI structure tests, plan-file tests, browser checks, and production build pass.

## Next Recommended Package

S2748-S2767: Annual Instruction Non-Generative Row Mock Boundary.

Goal: define the boundary for a fixed-label, internal-only static row mock that can appear in the tester surface without calculations, generated rows, saved output, CSV output, reports, production UI, final instructions, tax-bracket instructions, schema changes, or `.plan.json` generation.
