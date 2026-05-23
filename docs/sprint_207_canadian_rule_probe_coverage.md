# Sprint 207: Canadian Rule Probe Coverage

Status: Complete 2026-05-23.

## Goal

Restore standalone coverage for Canadian-specific behaviours reviewers flagged as under-verified.

## Scope

- Spousal RRSP attribution now asserts taxable-income movement during and after the attribution window.
- CPP sharing now asserts equalized CPP once both spouses receive CPP.
- OAS recovery now asserts pension splitting reduces recovery tax through the extracted engine.

## Boundary

The probes verify current engine behavior; they do not add new modelling.
