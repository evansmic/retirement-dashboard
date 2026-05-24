# Future Income Expansion Notes

Status: Planning note from Sprint 225.

## Why This Exists

Human testing surfaced real household cases that the current v1 intake cannot model cleanly without expanding plan structure:

- Multiple defined-benefit pensions for the same person.
- Rental income.
- Expected one-time additions such as inheritances, business sale proceeds, or large gifts.
- More explicit bridge pension presentation.

## Current V1 Boundary

The current plan schema supports one DB pension profile per person, one downsize event, and generic one-time events. That is enough for the current engine checkpoint, but it is not enough for every household.

Do not add these cases as ad hoc fields in the current intake. They should be modelled as a deliberate income/event expansion so validation, examples, report output, saved-plan migration, and optimizer boundaries stay coherent.

## Candidate Future Shape

- `incomeStreams[]` for rental income, annuities, secondary pensions, and other recurring taxable or partially taxable income.
- `pensions[]` per person for multiple DB pensions, each with start year, before-65 amount, 65+ amount, indexing, and survivor rules.
- Expanded `oneOffs[]` labelling for expected inflows and outflows, with clearer taxable/non-taxable treatment.

## V1 Decision

Defer schema/model expansion until after the bounded drawdown checkpoint and v1 UI/UX review. Keep the current intake copy honest about the limitation rather than forcing edge cases into misleading fields.
