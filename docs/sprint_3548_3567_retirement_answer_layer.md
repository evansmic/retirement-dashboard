# Sprint S3548-S3567: Retirement Answer Layer

Status: Complete 2026-06-13.

## Goal

Prioritize the retirement answers the planner needs before choosing the final graphical redesign. This package turns existing results evidence into an answer-layer contract for retirement timing, spending capacity, income direction, next moves, and risk review.

## Completed

- Added `RetirementAnswerLayer`, `RetirementAnswerLayerRow`, and `selectRetirementAnswerLayer`.
- Reused existing retirement answer, spending capacity, recommended path, stress, tax, account, and income-source evidence.
- Added five answer rows:
  - Can I retire, and through what horizon?
  - How much spending does the plan appear to support?
  - Where does retirement income appear to come from?
  - What should be reviewed next?
  - What could make the answer fragile?
- Added visualization hints without starting the UI redesign:
  - Verdict card
  - Spending band
  - Funding flow
  - Action stack
  - Risk timeline
- Rendered the answer layer in Overview below the existing answer and spending panels.
- Kept public optimizer output, saved recommendations, final advice language, and the full UI redesign deferred.

## Boundary

This package defines the answer contract before visual design. It does not implement the final graphical dashboard, does not add public optimizer output, does not save recommendations, and does not introduce final advice language.

## Verification

- `npm run test:focused`
- `npm test -- app/src/engine/resultSelectors.test.ts`
- `npm run build`

The full `npm test` command remains deferred because the current machine has limited free disk space and the full suite previously hung after early passing suites.

## Next Package

Deepen the retirement answer layer by adding explicit answer evidence for benefit timing, withdrawal-family direction, estate/survivor sensitivity, and tax-pressure tradeoffs before returning to graphical UI implementation.
