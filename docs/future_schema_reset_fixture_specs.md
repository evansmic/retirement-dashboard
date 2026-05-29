# Future Schema Reset Fixture Specs

## Purpose

Define future fixture coverage before any schema reset is implemented.

Do not create or persist `.plan.json` files in this package.

## Fixtures To Create Later

### Accepted New Format With Minimum Floor

Purpose: prove the future loader accepts a clean-format plan with explicit minimum expenses.

Expected outcome: plan opens and keeps minimum expenses separate from calculated capacity.

Must prove:

- minimum monthly expenses are present,
- capacity answer is not saved as an input,
- spending path breakpoints are explicit.

### Blocked Old Preview Desired-Spend File

Purpose: prove old phased-spending preview files are blocked instead of migrated.

Expected outcome: import stops with the old-preview block message.

Must prove:

- old desired-spending fields are not mapped,
- block copy is calm,
- no partial plan state is loaded.

### Blocked Unsupported Future Format

Purpose: prove unsupported future files are blocked to avoid silent field loss.

Expected outcome: import stops with the newer-format message.

Must prove:

- future fields are not dropped,
- user sees newer-version copy,
- current plan state is preserved.

### Raw Payload Policy Fixture

Purpose: prove raw payload behavior is deliberate after the reset decision.

Expected outcome: raw payload behavior follows the final accepted policy.

Must prove:

- raw payload support is either explicitly accepted or explicitly blocked,
- unsupported raw files do not load partially.

## Boundary

These are fixture specifications only. No current fixtures or example plans are changed.

