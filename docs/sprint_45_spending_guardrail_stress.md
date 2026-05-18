# Sprint 45: Spending Guardrail Stress

Completed: 2026-05-18

## Goal

Add a narrow spending-stress layer that helps users understand whether the plan is fragile, balanced, or has room to review without calling it a guaranteed spending level or creating a full spending optimizer.

## Implemented

- Added runtime-only spending stress runs for current spending, 5% lower early-retirement spending, 10% lower early-retirement spending, and 5% higher early-retirement spending when the current plan has no visible shortfall.
- Added a spending stress selector with fragile, balanced, room-to-review, and cannot-tell states.
- Added a Details-only “Spending stress check” table with Current spending, A little less, Meaningfully less, and A little more labels.
- Framed higher spending as room to review, not a recommendation to spend more.
- Kept stress output out of `.plan.json` and out of optimizer strategy application.

## Non-Scope

- No tax-aware withdrawal optimizer.
- No new persisted result schema.
- No saved optimizer or stress output.
- No automatic strategy application.
- No broad search expansion.

## Verification

- Selector tests cover repair, room-to-review, fragile, and empty-result cases.
- Preview runner tests cover runtime stress generation and the conditional higher-spending check.
- UI structure tests keep consumer copy review-oriented.
