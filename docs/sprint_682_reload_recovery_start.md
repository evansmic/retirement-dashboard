# Sprint 682: Reload Recovery Start

## Purpose
Start a small deploy-recovery package while outside-app reviews are pending.

## Outcome
- Chose stale deployed chunk recovery as the first resilience target.
- Kept the change consumer-facing and local-first.
- Avoided service workers, telemetry, accounts, or deployment infrastructure.

## Boundary
This sprint does not change calculations, schemas, saved plans, annual sequencing, feedback capture, or the UI overhaul.
