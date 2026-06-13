# S2968-S2987: Runtime Annual Instruction Draft Generator Scope

**Status:** Complete 2026-06-13.

## Goal

Move from hand-written static mock rows toward runtime-only annual instruction draft generation for synthetic scenarios.

The existing experimental annual instruction draft now includes a runtime draft generator scope. This scope declares the allowed runtime sources, readiness rows, blocked outputs, boundary copy, and next step for moving from static examples to runtime annual draft rows.

Results Details also shows this scope inside the tester-only surface.

## Remaining Sprint Estimate

- Internal tester optimizer prototype: 10-50 sprints remaining.
- Feature-complete app optimizer beta: 90-170 sprints remaining.
- Public-ready optimizer for real planning use: 170-290 sprints remaining.

Material estimate change: no. The estimate tightened by one package because runtime draft generator scope is now connected to the existing draft object.

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
- In-app feedback collection or scoring.
- Approval or unlock logic for generated rows.
- Issue creation, cleanup task creation, or model repair automation.
- New account-order algorithms.
- Annual withdrawal calculation changes.
- Tax-bracket targets.
- Saved draft output.
- CSV draft output.
- Report draft output.
- Public release.

## Completed Path

### S2968-S2972: Runtime Source Scope Batch

Added runtime draft generator scope to the existing experimental annual instruction draft object.

### S2973-S2977: Readiness Row Batch

Added source rows, annual totals, account-order evidence, tax context, and output boundary checks.

### S2978-S2982: Tester Surface Batch

Exposed the runtime draft generator scope in Results Details inside the tester-only panel.

### S2983-S2987: Verification And Closeout

Ran UI structure checks, focused optimizer tests, plan-file tests, production build, file guards, and browser verification.

## Definition Of Done

- Runtime annual draft generator scope is attached to existing runtime-only experimental draft output.
- Scope declares allowed sources and blocked outputs.
- Scope is visible in the tester-only Details surface.
- No saved schema or engine output schema changes.
- No saved sequencing, CSV output, report output, production UI, final instructions, tax-bracket instructions, or `.plan.json` generation.
- Remaining sprint estimate is updated after the package.
- Focused optimizer tests, UI structure tests, plan-file tests, browser checks, and production build pass.

## Next Recommended Package

S2988-S3007: Runtime Annual Draft Rows Surface Integration.

Goal: replace the hand-written static annual review rows with runtime-only draft row display for synthetic scenarios, using the existing experimental annual instruction draft rows and the new runtime draft generator scope while keeping saved sequencing, CSV output, report output, production UI, final instructions, tax-bracket instructions, schema changes, and `.plan.json` generation blocked.
