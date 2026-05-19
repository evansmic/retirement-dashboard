# Sprint 50: Plan Options Clarity & Candidate Discipline

Sprint 50 keeps the bounded optimizer readable before adding another behavior. It groups the growing set of plan checks by the kind of household choice they represent.

## What Changed

- Added runtime option groups for current plan, lifestyle choices, timing choices, income-sharing checks, drawdown review, and home/estate checks.
- Added a Details-only option map explaining what kind of choices were checked.
- Clarified that the first option to review has cleared highlight checks, while review-only options remain useful evidence.
- Extended example readiness coverage so option groups stay runtime-only and unsaved.

## Boundaries

- No new optimizer candidate family was added.
- No tax-aware drawdown execution was added.
- No annual withdrawal overrides are applied.
- No optimizer output is saved into `.plan.json`.
- No saved plan schema or engine output schema changed.

## Copy Posture

The new copy separates lifestyle, timing, tax, drawdown, and home or estate assumptions without turning any option into advice. It keeps the review-first posture and avoids safe-spending, guaranteed, optimal, apply, or recommendation-heavy language.

## Verification Intent

Sprint 50 adds tests for option grouping, UI copy, example-plan matrix coverage, and persistence guardrails.
