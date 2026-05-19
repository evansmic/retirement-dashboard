# Sprint 46: Tax-Aware Drawdown Contract Readiness

Sprint 46 prepares the planner for future tax-aware drawdown work without building or applying that optimizer.

## What Changed

- Added a Details-only Drawdown readiness panel.
- Summarized existing evidence for registered withdrawal pressure, OAS recovery exposure, peak tax years, possible low-tax review windows, and account mix.
- Kept the optimizer contract in current withdrawal-order mode.
- Kept annual withdrawal overrides empty as a future contract placeholder.
- Added tests confirming drawdown readiness and optimizer strategy output are not saved into plan files.

## Boundaries

- No tax-aware drawdown optimizer was added.
- No annual withdrawal overrides are generated, simulated, applied, or persisted.
- No engine output or saved plan schema changed.
- No new bounded optimizer candidate family was added.
- Overview stays focused on the retirement answer; drawdown readiness belongs in Details.

## Consumer Copy Posture

The new copy treats drawdown readiness as evidence for a later review. It avoids optimal-drawdown, guarantee, safe-spending, and advice-like language. The panel says the current withdrawal order does not change.

## Verification

- Selector tests cover empty results, registered withdrawal pressure, OAS recovery exposure, peak tax evidence, low-tax review windows, and review-only disposition.
- Optimizer contract tests confirm `currentOrder` mode and empty annual overrides.
- UI structure tests confirm Drawdown readiness is in Details, not Overview.
