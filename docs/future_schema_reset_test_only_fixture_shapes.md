# Future Schema Reset Test-Only Fixture Shapes

## Purpose

Draft fixture shapes for future tests without writing saved `.plan.json` files.

## Shapes

### Future Minimum Floor Plan

Intent: accepted new format.

Required keys:

- `schemaVersion`
- `minimumMonthlyExpensesExMortgage`
- `earlySpendingChangeAge`
- `laterSpendingChangeAge`

Forbidden keys:

- `gogo`
- `slowgo`
- `nogo`
- `confidentMonthlyAfterTaxSpend`

Expected result: accept.

### Legacy Preview Desired-Spend Payload

Intent: blocked old preview.

Required keys:

- `schemaVersion`
- `spending.gogo`
- `spending.slowgo`
- `spending.nogo`

Forbidden keys:

- `minimumMonthlyExpensesExMortgage`

Expected result: block.

### Unsupported Future Plan File

Intent: blocked future format.

Required keys:

- `schemaVersion`
- `futureOnlyField`

Forbidden keys:

- `silentlyDroppedFieldsAccepted`

Expected result: block.

## Boundary

These are TypeScript planning shapes only. They are not `.plan.json` files, current examples, or loader fixtures.

