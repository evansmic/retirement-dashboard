# Future Optimizer Contract Readiness

## Purpose

Draft the future optimizer contract before implementing floor-first capacity or funding traces.

## Contract Parts

### Minimum Expense Floor Inputs

Must include:

- minimum monthly expenses excluding mortgage,
- mortgage payment from Debts,
- household tax assumptions.

Must exclude:

- old desired-spending fields as floor,
- calculated capacity as input.

### Confident Monthly After-Tax Capacity Output

Must include:

- monthly after-tax amount,
- today-dollar framing,
- confidence or review status.

Must exclude:

- guaranteed safe-spend language,
- saved output field.

### Funding Trace Output

Must include:

- income sources,
- account groups,
- tax,
- cash wedge or other inflows when present.

Must exclude:

- annual account-by-account instructions,
- personalized withdrawal advice.

### Review Boundary

Must include:

- plain review actions,
- estate and survivor caveats,
- tax caveats.

Must exclude:

- automatic saved changes,
- advisor workflow,
- cloud account requirement.

## Boundary

No optimizer behavior, engine output schema, saved schema, or UI is changed in this package.

