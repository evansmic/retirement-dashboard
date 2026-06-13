# S2708-S2727: Annual Instruction Prototype Row Source Mapping

## Status

Complete 2026-06-09.

## Goal

Map each internal-only prototype row field to existing runtime candidate data while still not generating annual instruction rows.

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

## S2708-S2712 — Source Mapping Batch

Added static source mapping for the internal-only prototype row fields:

- Year.
- Account label.
- Amount label.
- Review reason.
- Quality flag.
- Boundary note.

## S2713-S2717 — Missing-Source Behavior Batch

Added missing-source behavior that requires review instead of inference. Missing year blocks row creation, missing account labels stay in account review, missing amounts stay in amount review, and missing quality stays review-first.

## S2718-S2722 — Blocked Inference Batch

Blocked inference for:

- Exact account order.
- Tax-bracket targets.
- Final withdrawal instructions.
- Saved sequencing fields.
- CSV columns.
- Report rows.

## S2723-S2727 — Verification And Closeout

Verification covered UI structure checks, focused optimizer checks, plan-file save boundaries, production build, whitespace checks, `.plan.json` guards, and browser inspection of the annual instruction prototype source mapping.

## Definition Of Done

- Tiny tester surface remains Details-only and tester-only.
- Prototype row source mapping is visible.
- Missing-source behavior avoids inference.
- Blocked inferences are visible.
- Mapping remains static and non-generative.
- No annual instruction rows are created.
- Saved output, CSV output, report output, and production UI promotion remain deferred.
- Saved plan schema remains unchanged.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, UI structure tests, plan-file tests, browser checks, and production build pass.

## Next Recommended Package

S2728-S2747: Optimizer Timeline Reassessment And Prototype Shape Checkpoint.

Recommended goal: reassess the optimizer timeline estimate after 100 sprints, decide whether the internal prototype, functional beta, and public-ready estimates have changed materially, and checkpoint whether the prototype shape/source mapping is ready for an internal-only non-generative row mock. Keep saved sequencing output, CSV output, reports, final annual instructions, tax-bracket instructions, production UI promotion, saved schema changes, generated rows, and `.plan.json` generation out of scope.
