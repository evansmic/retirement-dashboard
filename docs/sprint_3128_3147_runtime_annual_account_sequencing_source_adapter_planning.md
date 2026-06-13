# S3128-S3147 Runtime Annual Account Sequencing Source Adapter Planning

**Status:** Complete 2026-06-13.

## Goal

Map the runtime annual account sequence shape fields to existing runtime draft sources before implementation. The tester-only Results Details surface now includes a source adapter plan that maps each field to current runtime draft data and defines missing-source fallback wording.

## Remaining Sprint Estimate

- Internal tester optimizer prototype: 0 sprints remaining.
- Feature-complete app optimizer beta: 10-90 sprints remaining.
- Public-ready optimizer for real planning use: 90-210 sprints remaining.

Material change: no. The estimates tightened by one package because the runtime annual account sequencing source adapter plan is now explicit.

## Source Adapter Map

- `year`: `experimentalAnnualInstructionDraft.rows.year`.
- `accountLabel`: `experimentalAnnualInstructionDraft.rows.label` and `account`.
- `reviewAmount`: `experimentalAnnualInstructionDraft.rows.amount`.
- `sourceEvidence`: `source.withdrawalFieldLabel`, `source.withdrawalField`, and `annualAccountTotals`.
- `readinessCue`: `runtimeDraftRowStatus`, `source.accountOrderPosition`, and `taxContext.effectiveTaxRatePct`.
- `taxContext`: `taxContext.effectiveTaxRatePct`, `taxContext.oasRecoveryStatus`, and `taxContextRows`.
- `constraintContext`: `readinessSummary`, `harmChecks`, confidence rows, survivor checks, and estate checks.
- `boundaryStatus`: `runtimeDraftGeneratorScope.blockedOutputs` and annual account sequencing output gates.

## Non-Scope

- Annual account sequencing adapter implementation.
- Saved plan schema changes.
- Engine output schema changes.
- Persisted optimizer output.
- Printable report output changes.
- CSV output changes.
- `.plan.json` files or `.plan.json` generation.
- Production UI promotion.
- Final annual instructions.
- Tax-bracket instructions.
- Exportable sequencing output.
- In-app feedback collection.
- Feedback scoring.
- Approval or unlock logic for generated rows.
- Issue creation or cleanup task automation.
- New account-order algorithms.
- Annual withdrawal calculation changes.
- Tax-bracket targets.
- Public release.
- Broad tester distribution.
- Real-data tester scenarios.

## Completed Path

- **S3128-S3132 — Source mapping batch.** Mapped each sequence row field to existing runtime draft fields, annual account totals, tax context, readiness evidence, and output boundaries.
- **S3133-S3137 — Missing-source batch.** Added fallback wording for missing year, account, amount, source evidence, readiness cue, tax context, constraint context, and boundary status.
- **S3138-S3142 — Adapter rule batch.** Added adapter rules that require read-only use of current runtime draft data, explicit source fields, missing-source preservation, and no new calculations or account order.
- **S3143-S3147 — Verification and closeout.** Ran UI structure checks, focused optimizer tests, plan-file tests, production build, file guards, and browser verification.

## Definition Of Done

- Results Details shows the runtime annual account sequencing source adapter plan.
- The plan maps each shape field to existing runtime draft sources.
- The plan defines missing-source fallback wording.
- No annual account sequencing adapter implementation is added.
- No saved row shape, CSV columns, report rows, production UI, final instructions, tax-bracket wording, saved schema changes, or engine output schema changes are added.
- Saved sequencing, CSV output, report output, production UI, final instructions, tax-bracket instructions, and `.plan.json` generation remain blocked.
- Remaining sprint estimate is updated after the package.
- Focused optimizer tests, UI structure tests, plan-file tests, browser checks, and production build pass.

## Next Recommended Package

S3148-S3167: Runtime Annual Account Sequencing Adapter Implementation Slice.

Purpose: implement the first runtime-only annual account sequence adapter from existing experimental draft rows, preserving review-only boundaries and avoiding saved schema, CSV, report, and production output changes.
