# Sprint 43: Optimizer Guardrails & Timing Integrity

Completed: 2026-05-18

## Goal

Harden bounded optimizer candidate eligibility before adding broader optimizer behavior. The optimizer should only compare options that fit the household data and supported Canadian timing rules.

## Implemented

- CPP/OAS delay is skipped unless each active person has CPP and OAS estimates, is still before age 70 in the projection, and reaches age 70 within the projection.
- Work-later candidates are checked per option so the one-year and two-year tests do not move retirement past age 70.
- Pension-splitting remains limited to two-person plans with meaningful pension or registered income and a supported age/income structure.
- Withdrawal-order checks remain limited to plans with meaningful registered and flexible account buckets.
- Details now includes guardrail notes explaining why option families were tested, not tested, or need review first.
- Regression tests cover age-70 work-timing boundaries, skipped CPP/OAS delay, guardrail notes, and consumer-facing copy.

## Non-Scope

- No new candidate families.
- No broad search expansion.
- No strategy application.
- No persisted optimizer output.
- No year-by-year tax-bracket optimizer.
- No schema/output change.

## Verification

- Focused optimizer and UI structure tests pass.
- Full suite and probe verification should remain the release gate before commit.
