# Sprint 4048 - Vercel Build Fix

## Goal

Repair the Vercel preview build failure seen on commit `3b9fc2a`.

## Fixed

- Replaced a stale `SpendingCapacitySummary` field reference:
  - `earlyRetirementSpending` -> `earlySpending`.
- Converted presentation summary counts passed to `Metric` from numbers to strings.

## Verification

- `npm run build` passes locally:
  - `tsc --noEmit`
  - `vite build`

## Boundary

This fix does not change planner calculations, saved schema, optimizer output, UI redesign scope, or deployment configuration.
