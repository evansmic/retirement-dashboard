# S2788-S2807: Annual Instruction Static Mock Row Fixture Boundary

**Status:** Complete 2026-06-13.

## Goal

Define the fixture boundary for a future hand-written annual instruction static mock row before any fixture rows are implemented.

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
- Static mock rows.
- Rendered fixture rows.
- Fixture calculations.
- Fixture export.
- Copy generation.
- Timeline approval logic.

## Completed Path

### S2788-S2792 — Fixture Field Batch

Added static fixture field boundaries for year, account label, amount label, review reason, and boundary note. Each field describes what future hand-written fixture data may say and what it must not infer or calculate.

### S2793-S2797 — Fixture Rule Batch

Added rules requiring future fixture data to be hand-written, synthetic, removable before production UI work, non-saved, non-exported, non-printed, and neutral to saved plan schema and engine output schema.

### S2798-S2802 — Source Guard Batch

Added structure checks that block rendered fixture rows, fixture row creation, fixture generation, fixture calculations, saved fixture output, CSV export, and promotion paths.

### S2803-S2807 — Verification And Closeout

Closed the package with source-structure tests, focused optimizer tests, plan-file tests, production build, file guards, and browser verification.

## Definition Of Done

- Tiny tester surface remains Details-only and tester-only.
- Static mock fixture boundary is visible.
- Fixture fields and fixture rules are visible.
- Fixture boundary remains static and non-rendering.
- No static mock rows or fixture rows are implemented.
- Calculated annual withdrawal amounts remain blocked.
- Generated account order and tax-bracket targets remain blocked.
- Saved sequencing, CSV output, report output, production UI, final instructions, tax-bracket instructions, and schema changes remain blocked.
- Saved plan schema remains unchanged.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, UI structure tests, plan-file tests, browser checks, and production build pass.

## Next Recommended Package

S2808-S2827: Annual Instruction Static Mock Fixture Approval Gate.

Goal: decide whether the boundary, copy contract, and fixture contract are sufficient to allow a future hand-written static mock row surface, while still not rendering mock rows, calculating values, generating account order, creating tax-bracket targets, saving sequencing, exporting CSV, changing reports, promoting production UI, changing schemas, or generating `.plan.json` files.
