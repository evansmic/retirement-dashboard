# Sprint 209: Probe Suite Promotion

Status: Complete 2026-05-23.

## Goal

Promote repaired probes into the canonical probe runner so the checkpoint coverage gap stays closed.

## Scope

- Added the repaired probes to `probes/run_all.sh`.
- Updated `probes/README.md` to describe module-first probe ownership.
- Kept the known localhost route-probe caveat documented by the actual probe output.

## Boundary

No route-probe workaround was added. The sandbox bind caveat remains separate from engine verification.
