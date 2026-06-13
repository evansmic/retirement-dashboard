# S2848-S2867: Annual Instruction Static Mock Surface Placement Boundary

**Status:** Complete 2026-06-13.

## Goal

Define where a future hand-written static mock surface could appear inside Results Details before any rows are rendered.

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

### S2848-S2852 — Allowed Placement Batch

Added static placement boundaries that limit future mock surface planning to the existing tester-only Details surface, near the boundary evidence and before tester questions.

### S2853-S2857 — Placement Exclusion Batch

Blocked placement in Overview, Save and print, printable reports, CSV output, saved plan files, and production UI.

### S2858-S2862 — Source Guard Batch

Added structure checks that block placement rendering, overview rows, report rows, CSV rows, saved rows, and promotion paths.

### S2863-S2867 — Verification And Closeout

Closed the package with source-structure tests, focused optimizer tests, plan-file tests, production build, file guards, and browser verification.

## Definition Of Done

- Tiny tester surface remains Details-only and tester-only.
- Static mock surface placement boundary is visible.
- Future placement is limited to the tester-only Details surface.
- Placement in Overview, Save and print, printable reports, CSV output, saved plan files, and production UI remains blocked.
- No static mock rows or fixture rows are rendered.
- Calculated annual withdrawal amounts remain blocked.
- Generated account order and tax-bracket targets remain blocked.
- Saved sequencing, CSV output, report output, production UI, final instructions, tax-bracket instructions, and schema changes remain blocked.
- Saved plan schema remains unchanged.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, UI structure tests, plan-file tests, browser checks, and production build pass.

## Next Recommended Package

S2868-S2887: Annual Instruction Static Mock Surface Layout Contract.

Goal: define the static layout contract for a future hand-written mock surface inside Results Details while still not rendering mock rows, calculating values, generating account order, creating tax-bracket targets, saving sequencing, exporting CSV, changing reports, promoting production UI, changing schemas, or generating `.plan.json` files.
