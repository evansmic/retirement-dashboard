# Sprint 40: Bounded Optimizer Search Expansion

Sprint 40 adds the first cautious expansion after the bounded optimizer, explanation layer, and eligibility gates. The expansion is deliberately narrow: one pension-splitting review candidate.

## What Changed

- Added a `Test pension splitting` optimizer candidate.
- Uses the existing `pensionSplit` simulation config.
- Includes the candidate only for two-person plans with meaningful pension or registered income.
- Adds pension-splitting eligibility copy to Results.
- Adds explanation trade-off copy that frames pension-splitting as a tax review option.

## Boundaries

- No broad optimizer search expansion.
- No automatic application of optimizer results.
- No saved optimizer output.
- No personalized financial advice.
- No guaranteed safe-spending language.
- No year-by-year tax-bracket optimization.
- No engine schema or saved plan schema change.

## Next Step

Sprint 41 should stay small. Good next candidates are pension-splitting evidence rows, clearer tax-driver explanations, or one modest guardrail-spending stress. Full tax-aware drawdown optimization should wait until those explanations remain clear in example-plan testing.
