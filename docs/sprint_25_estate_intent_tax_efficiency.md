# Sprint 25: Estate Intent And Tax Efficiency

## Summary

Sprint 25 makes estate wishes and tax efficiency part of the consumer Results story. The goal is not to create a legal estate plan or a tax optimizer. It is to help a household notice when projected money left, estate goals, registered assets, OAS recovery tax, and survivor outcomes deserve review before treating a plan as "best."

## What Changed

- Added `selectEstateIntentSummary` as a runtime-only selector.
- Added an Overview panel for "Estate wishes and tax efficiency."
- Shows projected estate, estate goal, estate gap, lifetime tax, OAS recovery tax, and registered assets at plan end.
- Flags large projected estates without an estate goal as an intent question, not automatically a better outcome.
- Flags tax-efficiency review when OAS recovery tax, tax-pressure years, or large final registered balances may shape the estate outcome.
- Keeps output runtime-only and does not change simulation math, saved plan files, or schema v2.

## Product Lens

The product should help retirees decide how intentionally they want to balance:

- enjoying more during retirement
- preserving wealth
- supporting family during life
- protecting the survivor
- reducing avoidable tax drag

A larger projected estate is only "better" if that is what the household wants.

## Verification

Sprint 25 should pass:

- `npm test`
- `npm run build`
- `node probes/probe_simulation_engine_parity.js && node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- `find . -name '*.plan.json' -print`

No `.plan.json` files should be created in the repository.
