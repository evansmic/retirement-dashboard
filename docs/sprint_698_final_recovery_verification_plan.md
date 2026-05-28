# Sprint 698: Final Recovery Verification Plan

## Purpose
Set final verification for the deploy-recovery package.

## Plan
- Run focused UI structure tests.
- Run the full unit test suite.
- Run the production build.
- Run simulation and bridge parity probes.
- Run the canonical probe suite and record the known route-probe caveat if it appears.
- Check that no `.plan.json` files were created.

## Boundary
This sprint does not relax verification expectations or modify probes.
