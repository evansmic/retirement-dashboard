# Spending Path Bridge Selector

## Purpose

This bridge selector turns the current phased annual spending fields into a runtime-only spending path summary. It supports the future direction where users see one monthly after-tax answer while the model can still reflect spending changing with age.

## Current Bridge Rule

Until a future spending-path migration exists, the selector reads:

- early retirement spending,
- later retirement spending,
- late-life spending,
- the two breakpoint ages.

It converts each annual spending level into a monthly amount and labels the phases in plain language.

## Boundary

This selector does not:

- add a saved field,
- encode default spending reduction rates,
- change engine output,
- require users to understand go-go / slow-go / no-go terminology,
- create account-level withdrawal instructions.

## Future Migration

When schema work is ready, this selector can move from interpreting legacy fields to reading default spending-path metadata and a first-class minimum-expense floor.
