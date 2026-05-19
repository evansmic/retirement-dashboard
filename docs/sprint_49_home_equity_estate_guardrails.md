# Sprint 49: Home Equity Reliance & Estate Guardrails

Sprint 49 adds a conservative readiness layer around home-sale cash and estate intent. It does not recommend a home sale, invent downsizing proceeds, or apply optimizer output.

## What Changed

- Added a `withoutDownsize` bounded optimizer candidate labeled "Check without home-sale cash".
- Limited the candidate to plans where both downsize year and net proceeds are already entered.
- Removed downsize year and proceeds only in the candidate working copy.
- Added evidence rows comparing the current plan with the without-home-sale-cash check.
- Added estate-goal guardrails so candidates that weaken an entered estate goal stay review-only unless they repair a visible shortfall without worsening the estate gap.

## Boundaries

- No home-sale recommendation was added.
- No estimated home-sale cash is created by the optimizer.
- No tax-aware drawdown execution was added.
- No annual withdrawal overrides are applied.
- No optimizer output is saved into `.plan.json`.
- No saved plan schema or engine output schema changed.

## Copy Posture

The new copy treats home equity as reliance evidence. It uses "home-sale cash", "reliance check", "current plan", "without home-sale cash", and "estate goal" language. It avoids advice-like home-sale instructions and keeps explicit estate goals framed as household preferences.

## Verification Intent

Sprint 49 adds tests for complete and partial downsize inputs, candidate working-copy isolation, review-only reliance checks, estate-goal suggestion guardrails, evidence rows, saved-plan persistence, and example-plan copy posture.
