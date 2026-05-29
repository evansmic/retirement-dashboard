# Sprint 822 - Schema Reset Schema Checkpoint

## Goal

Confirm the schema boundary after the reset decision.

## Checkpoint

- Current saved plan schema remains v2.
- Current current-format plan files remain accepted.
- Future old-preview-file blocking is planned for the new saved format, not implemented here.
- No minimum monthly expense field is persisted in this package.

## Future Rule

When the new saved format is implemented, do not infer minimum expenses from old desired-spending fields. Block older preview files instead.

