# Sprint S3608-S3627: Assumption Lab Comparison Polish

Status: Complete 2026-06-14.

## Goal

Make the live assumption lab intentional enough for beta review. Details controls should separate pending slider changes from applied preview runs, show the adjusted assumption being tested, and make current/optimal/alternative comparison cards easier to read against the current plan.

## Completed

- Split assumption lab state into pending draft and applied preview assumptions.
- Added explicit Apply and Reset controls so slider movement does not rerun the model on every tick.
- Added pending and applied assumption summary labels.
- Kept progress feedback while an applied preview reruns.
- Added comparison deltas versus the current plan for ending portfolio and lifetime tax.
- Updated assumption lab boundary and next-step copy now that temporary working-copy reruns exist.
- Added structure guards for the apply/reset controls, adjusted-assumption strip, pending status, and comparison deltas.

## Boundary

This package keeps the lab as a temporary local comparison surface. It does not mutate saved plan inputs, persist scenario output, create named scenarios, create account instructions, add final advice language, or promote public optimizer output.

## Estimate Update

- Retirement answer layer: 0-10 sprints remaining, unchanged.
- Live assumption lab: 0-10 sprints remaining, tightened from 5-20 because the lab now has explicit apply/reset behavior, adjusted-assumption summaries, and clearer comparison deltas.
- Public-ready optimizer: 0-20 sprints remaining, unchanged.
- Graphical UI redesign: 20-60 sprints remaining, unchanged and still deferred.
- Launch hardening: 10-30 sprints remaining, unchanged.

## Verification

- `npm run test:focused`
- `npm test -- app/src/engine/resultSelectors.test.ts`
- `npm test -- app/src/engine/previewScenarios.test.ts`
- `npm run build`

The full `npm test` command remains deferred because the current machine has limited free disk space and the full suite previously hung after early passing suites.

## Next Package

Decide whether the assumption lab should support named multi-assumption scenarios before the graphical redesign, or stay as a single temporary adjustment surface that informs the optimal plan from a given assumption set.
