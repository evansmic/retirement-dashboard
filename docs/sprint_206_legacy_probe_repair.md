# Sprint 206: Legacy Probe Repair

Status: Complete 2026-05-23.

## Goal

Repair checkpoint feedback that several older Canadian-rule probes no longer ran after the dashboard moved helper code out of the inline script.

## Scope

- Rewrote spousal RRSP, CPP sharing, OAS recovery, balance, withdrawal-order, and sustainable-spending probes.
- Removed brittle HTML script scraping from those probes.
- Used extracted engine/helper modules directly, with the legacy bridge only for bundled preset data.

## Boundary

No engine math, saved plan schema, or UI behavior changed.
