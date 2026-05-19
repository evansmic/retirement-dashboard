# Sprint 48: CPP Sharing Review Candidate

Sprint 48 adds one narrow bounded optimizer behavior: CPP sharing for eligible two-person plans. It uses the existing `assumptions.cppSharing` field only inside a candidate working copy, so saved plans and engine output stay unchanged.

## What Changed

- Added a `cppSharing` bounded optimizer candidate labeled "Test CPP sharing".
- Limited the candidate to two-person plans where CPP sharing is currently off, both people have CPP estimates, and both reach CPP start age within the projection.
- Added optimizer notes that explain when CPP sharing is included, skipped, or already reflected in the current plan.
- Added CPP sharing evidence rows for lifetime tax, first-year tax, peak tax, OAS recovery tax, and projected money left.
- Renamed the Details evidence surface to "Income-sharing evidence" so pension splitting and CPP sharing can share the same review area.

## Boundaries

- No tax-aware drawdown execution was added.
- No annual withdrawal overrides are applied.
- No optimizer output is saved into `.plan.json`.
- No saved plan schema or engine output schema changed.
- CPP sharing remains a review check, not a recommendation or filing instruction.

## Copy Posture

The new copy uses "CPP sharing", "Test CPP sharing", "review", "current plan", and "eligibility" language. It avoids guaranteed, safe-spending, optimal-drawdown, automatic filing, and advice-like phrasing.

## Verification Intent

Sprint 48 adds tests for eligible couples, ineligible households, already-on CPP sharing, candidate working-copy isolation, CPP sharing evidence rows, saved-plan persistence, and example-plan copy posture.
