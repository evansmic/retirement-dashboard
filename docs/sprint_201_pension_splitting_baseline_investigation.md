# Sprint 201: Pension-Splitting Baseline Investigation

Status: Complete 2026-05-23.

## Goal

Investigate checkpoint feedback that DB pension couples could see a misleading baseline if pension splitting is treated only as an optimizer improvement.

## Findings

- The React baseline preview used `pensionSplit: false`.
- The bounded optimizer also used a no-split baseline, then added pension splitting as a candidate.
- For two-person DB pension plans, that can make a standard annual tax election look like a discovered improvement.

## Decision

Include eligible DB pension splitting in the current-plan baseline for two-person plans. Keep non-DB registered-income pension-splitting tests review-oriented until RRIF/LIF conversion timing and eligibility are clearer.
