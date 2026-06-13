# S2908-S2927: Annual Instruction Static Mock Surface Final Preflight Gate

**Status:** Complete 2026-06-13.

## Goal

Decide whether the placement, layout, and removal contracts are sufficient to allow future tester-only hand-written static mock surface implementation planning.

The answer is yes, but only for a later implementation package. This package adds the final preflight gate and keeps implementation, rendered rows, calculations, generated account order, saved sequencing, CSV output, reports, production UI, final instructions, tax-bracket instructions, schema changes, and `.plan.json` generation blocked.

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
- Approval or unlock logic for rendered rows.
- Issue creation, cleanup task creation, or model repair automation.
- Annual instruction calculations.
- Annual instruction prototype implementation.
- Mapping functions or generated instruction rows.
- Static row mock implementation.
- Static mock rows or rendered fixture rows.
- Fixture calculations or fixture export.
- Copy generation.
- Timeline approval logic or changed public-readiness estimates.

## Completed Path

### S2908-S2912: Contract Readiness Batch

Added final preflight rows for contract readiness, allowed next step, implementation limit, and output limit.

### S2913-S2917: Blocked Implementation Batch

Kept implementation, rendered rows, calculated values, generated account order, saved sequencing, CSV output, report output, production UI, and schema changes blocked.

### S2918-S2922: Source Guard Batch

Added structure checks that block implementation flags, row maps, render paths, create paths, save paths, export paths, promote paths, and schema dependencies.

### S2923-S2927: Verification And Closeout

Ran UI structure checks, focused optimizer tests, plan-file tests, production build, file guards, and browser verification.

## Definition Of Done

- Tiny tester surface remains Details-only and tester-only.
- Static mock surface final preflight is visible.
- Gate allows future implementation package planning only.
- No implementation or rendered static mock rows are added in this package.
- Calculated annual withdrawal amounts, generated account order, and tax-bracket targets remain blocked.
- Saved sequencing, CSV output, report output, production UI, final instructions, tax-bracket instructions, and schema changes remain blocked.
- Saved plan schema remains unchanged.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, UI structure tests, plan-file tests, browser checks, and production build pass.

## Next Recommended Package

S2928-S2947: Optimizer Timeline Reassessment And Static Mock Implementation Decision Gate.

Goal: perform the next 100-sprint material timeline reassessment and decide whether to implement a tester-only hand-written static mock surface next while keeping saved sequencing, CSV output, report output, production UI, schema changes, generated account order, calculated withdrawal values, final annual instructions, tax-bracket instructions, and `.plan.json` generation blocked unless explicitly planned.
