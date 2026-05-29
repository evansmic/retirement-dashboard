# Minimum Expense And Spending Capacity Direction

## End State

The app should answer the household question first:

> Given what I have, what can I confidently spend after tax each month, and where does that money come from?

Users should not need to guess a sustainable retirement lifestyle number before seeing the result.

## Product Direction

- Ask for assets, income, pensions, debts, mortgage payments, retirement timing, survivor setup, and tax-relevant assumptions.
- Ask for the household's minimum monthly expenses, excluding mortgage payments already entered in Debts.
- Use the engine to estimate after-tax monthly spending capacity in today's dollars.
- Compare that capacity with the minimum expense floor.
- If the floor appears covered, show estimated discretionary room and the funding trace.
- If the floor does not appear covered, show practical options to compare: lower expenses, work longer, downsize, save more, adjust benefit timing, revisit debt timing, or revisit estate intent.
- Once account-level sequencing is ready, explain where the money appears to come from by account and year.

## Current Bridge

The saved plan schema and engine output schema still use phased annual spending fields. Until a planned migration changes that contract, these fields should be framed as spending assumptions for modelling, not as a desired lifestyle target that the user is expected to know.

Near-term UI copy should:

- Prefer after-tax monthly spending capacity over annual desired spend.
- Avoid repeating "desired spend" or "spending target" as the primary answer.
- Make shortfall states point to options to compare, not a single spending cut.
- Keep all wording consumer-facing, calm, and non-advisory.

## Deferred Work

- Add a first-class minimum monthly expense input.
- Define whether minimum expenses are stored as a new schema field or derived from existing spending assumptions during migration.
- Update optimizer contracts so the floor is tested before discretionary capacity.
- Add account-level withdrawal sourcing only after annual sequencing readiness is complete.
- Save broad UI redesign until this planning model and optimizer path are stable.
