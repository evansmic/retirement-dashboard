# Sprint 53: Bounded Drawdown Execution Readiness

Sprint 53 moves one small step beyond evidence rows. It adds runtime-only future drawdown draft checks, validation statuses, and a synthetic comparison harness so the app can prove the shape of a later annual override review without executing it.

## What Changed

- Added draft checks derived from existing low-tax-window, registered-pressure, OAS recovery, peak-tax, and estate-pressure evidence.
- Each draft check carries a year, account bucket, direction, amount band, evidence source, and safety notes.
- Added validation statuses: usable for future review, needs input, and blocked.
- Added a compact Details readiness review for account balances, account mix, OAS recovery exposure, estate intent, survivor scenario, and locked-in accounts.
- Added a test-only synthetic comparison harness for mocked annual override payloads.

## Boundaries

- Draft checks are not passed into the simulation engine.
- The current withdrawal order remains the source of truth.
- `withdrawalStrategy.mode` remains `currentOrder`.
- `annualOverrides` remains `[]`.
- No draft, comparison, optimizer, or drawdown readiness output is written to saved plan files.
- No saved plan schema or engine output schema changed.

## Copy Posture

The UI labels the section "Future drawdown draft checks" and keeps it in Details. The language says these are review drafts, not instructions. It avoids certainty, automatic execution, and advice-like phrasing.

## Next Step

The next phase can consider one narrow execution candidate only after the draft checks, validation statuses, example matrix, and persistence guardrails remain stable.
