# Sprint 267: Annual Detail CSV Builder

## Summary

Sprint 267 adds a local CSV builder for year-by-year projection rows.

## Outcome

- Added CSV columns for spending, income, withdrawals, tax, balances, and money-flow checks.
- Escaped CSV cells so spreadsheet imports handle commas and quoted text.
- Kept values sourced from `selectAnnualDetailRows`.

## Boundary

The CSV is a derived local export. It is not saved into editable plan files.
