# Sprint 44: Optimizer Recommendation Discipline

Completed: 2026-05-18

## Goal

Keep the bounded optimizer from over-suggesting disruptive household choices. A candidate can still be shown for review, but it should not become the highlighted first option simply because it improves projected money left.

## Implemented

- Added a suggestion gate separate from candidate scoring.
- Spending cuts, work-later tests, and CPP/OAS delay now stay review-only unless they materially repair a visible funding problem.
- CPP/OAS delay stays review-only when bridge years before age 70 show a spending shortfall.
- Non-disruptive options can still be highlighted when they materially improve taxes, funded years, or projected money left.
- Replaced strongest-option copy with first-option-to-review language.
- Added Details copy explaining why options can be highlighted or remain review-only.
- Added regression tests for disruptive improvements, weak benefit bridge years, and suggestion-discipline copy.

## Non-Scope

- No new optimizer candidate families.
- No broad search expansion.
- No strategy application.
- No persisted optimizer output.
- No year-by-year tax-bracket optimizer.
- No schema/output change.

## Verification

- Focused optimizer and UI structure tests pass.
- Full suite and probe verification should remain the release gate before commit.
