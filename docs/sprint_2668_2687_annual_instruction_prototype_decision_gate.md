# S2668-S2687: Annual Instruction Prototype Decision Gate

## Status

Complete 2026-06-08.

## Goal

Decide whether the tester surface and feedback cleanup boundaries are strong enough to define an internal-only annual instruction prototype shape in a future package.

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
- Annual instruction prototype implementation.

## S2668-S2672 — Decision Row Batch

Added static decision rows inside the tester-only surface for:

- Boundary evidence.
- Cleanup evidence.
- Missing evidence.
- Allowed next step.
- Still blocked.

## S2673-S2677 — Allowed Next-Step Batch

Limited the next step to defining an internal-only annual instruction prototype shape in a future package. The gate does not implement annual instruction rows or produce final instructions.

## S2678-S2682 — Blocked Output Batch

Kept saved sequencing, CSV output, reports, production UI, final instructions, tax-bracket instructions, and schema changes explicitly blocked.

## S2683-S2687 — Verification And Closeout

Verification covered UI structure checks, focused optimizer checks, plan-file save boundaries, production build, whitespace checks, `.plan.json` guards, and browser inspection of the prototype decision gate.

## Definition Of Done

- Tiny tester surface remains Details-only and tester-only.
- Prototype decision gate is visible.
- Decision gate allows only a future internal-only prototype shape definition.
- Missing evidence remains explicit.
- Saved sequencing, CSV output, reports, production UI, final instructions, tax-bracket instructions, and schema changes remain blocked.
- Gate does not create annual instruction rows, apply a prototype, save sequencing, export CSV, or promote production UI.
- Saved output, CSV output, report output, and production UI promotion remain deferred.
- Saved plan schema remains unchanged.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, UI structure tests, plan-file tests, browser checks, and production build pass.

## Next Recommended Package

S2688-S2707: Annual Instruction Prototype Shape Boundary.

Recommended goal: define the internal-only prototype shape for annual instruction rows without implementing calculations, final instructions, saved output, CSV output, reports, production UI, tax-bracket instructions, saved schema changes, or `.plan.json` generation.
