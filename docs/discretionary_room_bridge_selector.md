# Discretionary Room Bridge Selector

## Purpose

This bridge selector estimates whether there may be reviewable room above a temporary spending floor. It supports the future flow where the app first checks minimum expenses, then explains any possible discretionary room.

## Current Bridge Rule

The selector compares:

- temporary minimum-expense coverage,
- estimated after-tax spending capacity,
- annual and monthly room above the temporary floor.

It classifies room as:

- cannot tell,
- none,
- limited,
- review.

## Boundary

This selector does not:

- add a saved field,
- change engine output,
- create an optimizer action,
- tell the household to spend more,
- replace tax, survivor, estate, or spending-path review.

## Future Migration

Once minimum monthly expenses become a first-class saved input, this selector can read the true floor and become part of the final monthly-capacity answer.
