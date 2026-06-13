# S2948-S2967: Tester-Only Static Mock Surface Implementation Slice

**Status:** Complete 2026-06-13.

## Goal

Correct the stale optimizer timeline estimate and implement a small tester-only hand-written static mock annual review surface inside Results Details.

The previous "from S2628" estimate was no longer useful once the project reached S2947. From this package forward, the estimate is tracked as remaining work and must be updated after every 20-sprint package.

Current remaining sprint estimate:

- Internal tester optimizer prototype: 20-60 sprints remaining.
- Feature-complete app optimizer beta: 100-180 sprints remaining.
- Public-ready optimizer for real planning use: 180-300 sprints remaining.

The static surface implementation is limited to three hand-written synthetic annual review rows for made-up scenario comprehension testing. The rows are not calculated, generated, saved, exported, printed, promoted to production UI, or treated as final instructions.

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
- Generated account order.
- Tax-bracket targets.
- Generated instruction rows.
- Calculated static row amounts.
- Saved static row output.
- CSV static row output.
- Report static row output.
- Public release.

## Completed Path

### S2948-S2952: Timeline Correction Batch

Replaced the stale "from S2628" public-ready estimate with a remaining-work estimate and committed to updating estimates after every package.

### S2953-S2957: Static Surface Implementation Batch

Added a tester-only static annual review surface with three hand-written synthetic rows: RRSP review, TFSA review, and taxable review.

### S2958-S2962: Output Boundary Batch

Kept calculations, generated account order, tax-bracket targets, saved sequencing, CSV output, report output, production UI, final instructions, and schema changes blocked.

### S2963-S2967: Verification And Closeout

Ran UI structure checks, focused optimizer tests, plan-file tests, production build, file guards, and browser verification.

## Definition Of Done

- Tiny tester surface remains Details-only and tester-only.
- Remaining sprint estimate is visible and corrected.
- Static mock annual review rows are visible.
- Static rows are hand-written synthetic examples only.
- Static rows are not calculated, generated, saved, exported, printed, or promoted.
- Calculated annual withdrawal amounts, generated account order, and tax-bracket targets remain blocked.
- Saved sequencing, CSV output, report output, production UI, final instructions, tax-bracket instructions, and schema changes remain blocked.
- Saved plan schema remains unchanged.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, UI structure tests, plan-file tests, browser checks, and production build pass.

## Next Recommended Package

S2968-S2987: Runtime Annual Instruction Draft Generator Decision And Scope Tightening.

Goal: move from hand-written static mock rows toward a runtime-only annual instruction draft generator for synthetic scenarios, with a narrow source map and hard blocks around saved sequencing, CSV output, reports, production UI, final instructions, tax-bracket instructions, schema changes, and `.plan.json` generation.

Remaining sprint estimate after this package:

- Internal tester optimizer prototype: 20-60 sprints remaining.
- Feature-complete app optimizer beta: 100-180 sprints remaining.
- Public-ready optimizer for real planning use: 180-300 sprints remaining.
