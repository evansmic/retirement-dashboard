# Clean Schema Reset Plan

## Decision

The next saved-plan model should be a clean reset, not a migration from older preview files.

Old tester files can be treated as disposable. When the new saved format is implemented, older preview files should be blocked with calm copy:

> This plan was created with an earlier preview format. Please start a new plan.

## Rationale

- There are no production users with durable local files to protect.
- Testers can be told to start fresh.
- Migrating old phased spending fields into minimum expenses could make the app look more certain than it is.
- Fresh example plans are easier to review than migrated examples with hidden assumptions.

## Future Accepted Shape

The future format should be designed around:

- minimum monthly expenses, excluding mortgage payments already entered in Debts,
- capacity-first results in after-tax monthly dollars,
- default age-based spending path assumptions,
- optional breakpoint ages for reruns,
- later account optimizer outputs only after sequencing readiness is complete.

## Current Boundary

This is a planning decision only.

- Current schema v2 remains the active saved format.
- Current imports are not changed in this package.
- No saved minimum-expense field is added here.
- No engine output schema is changed here.
- No old-file migration rules should be added unless the decision is explicitly reopened.

