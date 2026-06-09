# S2688-S2707: Annual Instruction Prototype Shape Boundary

## Status

Complete 2026-06-08.

## Goal

Define the internal-only prototype shape for annual instruction rows without implementing calculations, final instructions, saved output, CSV output, reports, production UI, tax-bracket instructions, saved schema changes, or `.plan.json` generation.

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

## S2688-S2692 — Prototype Field Batch

Added static row-shape fields inside the tester-only surface:

- Year.
- Account label.
- Amount label.
- Review reason.
- Quality flag.
- Boundary note.

## S2693-S2697 — Exclusion Batch

Added explicit prototype shape exclusions:

- No exact tax-bracket commands.
- No final annual account instructions.
- No saved sequencing output.
- No CSV sequencing output.
- No report output.
- No production UI promotion.
- No saved schema changes.

## S2698-S2702 — Contract Guard Batch

Added source checks that block generated prototype rows, annual instruction calculations, persistence, downloads, print output, publishing, and schema paths inside the tester surface.

## S2703-S2707 — Verification And Closeout

Verification covered UI structure checks, focused optimizer checks, plan-file save boundaries, production build, whitespace checks, `.plan.json` guards, and browser inspection of the annual instruction prototype shape boundary.

## Definition Of Done

- Tiny tester surface remains Details-only and tester-only.
- Prototype row shape fields are visible.
- Prototype shape exclusions are visible.
- Shape remains a static contract, not generated rows.
- Shape does not calculate annual instructions, persist output, download output, print output, publish output, or change schemas.
- Saved output, CSV output, report output, and production UI promotion remain deferred.
- Saved plan schema remains unchanged.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, UI structure tests, plan-file tests, browser checks, and production build pass.

## Next Recommended Package

S2708-S2727: Annual Instruction Prototype Row Source Mapping.

Recommended goal: define where each internal-only prototype row field would be sourced from in existing runtime candidate data, still without implementing calculations, generating annual instruction rows, saving output, exporting CSV, changing reports, promoting production UI, creating tax-bracket instructions, changing schemas, or generating `.plan.json` files.
