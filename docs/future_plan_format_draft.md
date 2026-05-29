# Future Plan Format Draft

## Purpose

Define the next saved-plan shape before implementing a schema reset.

## Reset Position

The future format is a clean reset. It should block older preview files instead of migrating old desired-spending fields into minimum expenses.

Future block copy:

> This plan was created with an earlier preview format. Please start a new plan.

## New Format Fields To Review

### Minimum Expenses

- `minimumMonthlyExpensesExMortgage`: minimum monthly expenses, excluding mortgage payments already entered in Debts.

This should be a household floor input, not a repurposed desired-spending value.

### Spending Path

- `earlySpendingChangeAge`: optional age when early retirement spending assumptions change.
- `laterSpendingChangeAge`: optional age when later retirement spending assumptions change.

Default spending-path rates should stay derived until reviewed.

### Runtime Answers

- `confidentMonthlyAfterTaxSpend`: calculated result answer.
- `discretionaryRoomAboveFloor`: calculated review evidence.

These should not be user-entered saved inputs.

### Deferred Outputs

- `annualAccountFundingTrace`: deferred until account sequencing readiness is complete.

## Boundaries

- Do not implement this schema reset yet.
- Do not migrate old desired-spending fields into minimum expenses.
- Do not add account optimizer outputs to saved files.
- Do not start the broad UI overhaul in this package.

## Fresh Example Requirements

Future examples should be rebuilt directly in the new format:

- Single person with a covered floor.
- Couple with a tight or uncovered floor.
- DB pension couple with survivor sensitivity.
- Estate-heavy plan with room above the floor.

Each example should test the capacity-first answer and avoid migrated desired-spending values.

## Future Import Acceptance Rules

- Accept files created with the future clean saved format.
- Block older preview files from the phased-spending schema.
- Block unsupported future formats so fields are not silently dropped.
- Decide later whether raw unwrapped JSON payloads should remain accepted.

The old-preview-file message should stay:

> This plan was created with an earlier preview format. Please start a new plan.

