# S3188-S3207 Runtime Annual Account Sequencing Quality Summary

**Status:** Complete 2026-06-13.

## Goal

Roll row-level annual account sequencing quality scoring into a compact summary. Results Details now shows ready/review/blocked row counts, average score, next repair target, and blocked-output status for runtime annual account sequence review rows.

## Remaining Sprint Estimate

- Internal tester optimizer prototype: 0 sprints remaining.
- Feature-complete app optimizer beta: 0-60 sprints remaining.
- Public-ready optimizer for real planning use: 60-180 sprints remaining.

Material change: no. The estimates tightened by one package because row-level quality now rolls up into a visible sequence quality summary.

## Summary Fields

- Ready rows.
- Review rows.
- Blocked rows.
- Average score.
- Next repair target.
- Blocked-output status.

## Non-Scope

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
- Approval or unlock logic for generated rows.
- New account-order algorithms.
- Annual withdrawal calculation changes.
- Tax-bracket targets.
- Public release.
- Broad tester distribution.
- Real-data tester scenarios.
- Saved sequence adapters.
- Exported sequence adapters.
- Report sequence adapters.

## Completed Path

- **S3188-S3192 — Summary helper batch.** Added quality summary rollup for ready, review, and blocked rows plus average score.
- **S3193-S3197 — Repair target batch.** Added next repair target detection from row-level quality reasons.
- **S3198-S3202 — Display batch.** Rendered quality summary metrics and blocked-output status above sequence review rows.
- **S3203-S3207 — Verification and closeout.** Ran UI structure checks, focused optimizer tests, plan-file tests, production build, file guards, and browser verification.

## Definition Of Done

- Runtime annual account sequence review rows roll up into a visible quality summary.
- The summary shows ready, review, and blocked row counts.
- The summary shows average score.
- The summary shows the next repair target.
- The summary does not unlock saved sequencing, CSV output, report output, production UI, final instructions, tax-bracket wording, saved schema changes, or engine output schema changes.
- Saved sequencing, CSV output, report output, production UI, final instructions, tax-bracket instructions, and `.plan.json` generation remain blocked.
- Remaining sprint estimate is updated after the package.
- Focused optimizer tests, UI structure tests, plan-file tests, browser checks, and production build pass.

## Next Recommended Package

S3208-S3227: Runtime Annual Account Sequencing Repair Targeting.

Purpose: identify concrete repair targets from the quality summary before saved or exported sequencing outputs, especially missing account-order evidence, missing tax context, weak constraint context, and unclear boundary status.
