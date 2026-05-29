# Minimum Expense Bridge Selector

## Purpose

This bridge selector gives the product a runtime-only way to reason about minimum-expense coverage before a saved schema migration exists.

## Current Bridge Rule

Until a first-class minimum monthly expense field is planned, the selector uses the current early annual spending assumption as a temporary minimum-expense fixture.

It compares:

- temporary minimum annual expense,
- estimated annual after-tax spending capacity,
- gap or room between the two,
- review options when the floor appears strained.

## Boundary

This selector does not:

- add a saved plan field,
- change engine output,
- persist optimizer or readiness output,
- create account-level withdrawal instructions,
- replace future schema migration work.

## Future Migration

Once minimum monthly expenses become a first-class input, this selector can be migrated to read that field directly and preserve old-file compatibility through an explicit import strategy.
