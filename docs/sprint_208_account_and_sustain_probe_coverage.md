# Sprint 208: Account And Sustain Probe Coverage

Status: Complete 2026-05-23.

## Goal

Restore standalone coverage for balance trajectories, withdrawal-order behaviour, and sustainable-spending metadata.

## Scope

- Account-balance probe verifies finite rows and bucket-to-total reconciliation.
- Withdrawal-order probe verifies default and registered-drawdown paths change early funding sources without breaking output.
- Sustainable-spending probe verifies max-spending metadata and finite annual rows.

## Boundary

This is verification work only, not a Results UI or optimizer change.
