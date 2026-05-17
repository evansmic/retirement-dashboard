# Sprint 37: Bounded Optimizer Execution

Sprint 37 adds the first real optimizer execution slice. It is deliberately limited: the app compares a small set of planning options, explains what changed, and keeps the result separate from the saved plan file.

## What Changed

- Added `app/src/engine/boundedOptimizer.ts`.
- Generated a limited candidate set from the Sprint 36 optimizer contract:
  - current plan,
  - spend 5% less,
  - spend 10% less,
  - work 1 year longer,
  - work 2 years longer,
  - delay CPP/OAS to 70,
  - alternate withdrawal-order checks.
- Ran each candidate through the existing safe simulation boundary.
- Scored candidates using funded years, first shortfall, projected money left, lifetime tax, and a penalty for household-disruption choices.
- Added a compact Overview surface and a fuller Details table using consumer-facing "plan options to review" language.
- Added tests proving optimizer results are not persisted into `.plan.json`.

## Boundaries

- No personalized financial advice.
- No guaranteed safe-spending language.
- No automatic strategy application.
- No saved optimizer output.
- No year-by-year tax-bracket drawdown optimizer.
- No engine schema or saved plan schema change.

## Next Step

Sprint 38 should deepen optimizer explanations and eligibility rules before expanding search space. The likely next slice is "Why this option?" with clearer household trade-offs, then tax-aware drawdown work after the explanation layer can support it.
