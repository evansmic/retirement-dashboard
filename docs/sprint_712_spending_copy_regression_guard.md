# Sprint 712 - Spending Copy Regression Guard

## Goal

Prevent active app copy from drifting back toward user-guessed desired spending.

## Completed

- Added a structure test that checks active app and engine copy for retired spending-target phrases.
- Guarded the current monthly-capacity and spending-assumption language.

## Boundary

This is a copy and structure guard only. It does not alter calculation behaviour.
