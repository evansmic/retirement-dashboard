# Sprint 30: React Start Examples And Light Visual Alignment

Status: complete 2026-05-16

## Summary

Sprint 30 makes the modern React entry feel like the primary consumer product. The sprint adds built-in example plans directly to the React start screen and lightly aligns start/intake styling with the calmer Results dashboard.

This is intentionally a consumer-readiness slice before optimizer execution. It should reduce first-run friction without becoming a full visual redesign.

## Goals

- Let users try examples from the React start screen without going through the classic/static path.
- Present examples as consumer planning stories rather than technical presets.
- Make the start and intake surfaces feel visually connected to Results.
- Keep implementation bounded and reversible while the product shape is still moving.

## Candidate Example Stories

- **Public-sector DB couple:** strongly funded couple with pension income and estate/tax questions to review.
- **Late-career single:** tighter plan where spending cushion and timing matter.
- **Public comparator single:** modest, stable, easy-to-understand baseline.
- **DIY couple:** useful for testing household income, accounts, spending, and survivor review.
- **Already retired / simple retirement:** retired household focused on withdrawals, tax timing, and survivor review.
- **Early-retired couple:** long-horizon household with a large taxable bridge before CPP/OAS.

## Implementation Notes

- Added `app/src/data/examplePlans.ts` as a React-owned schema-v2 example registry matching the existing public preset stories.
- Added six one-click example cards to the React Start screen: DIY couple, DB pension couple, late-career single, public comparator single, already retired, and early retired.
- Example plans open as editable local working copies and do not create saved `.plan.json` files.
- Lightly aligned the Start screen with Results by using the same restrained palette, borders, radius, and card hierarchy.
- Preserved existing engine output, saved plan schema, detailed-report routes, and runtime-only recommendation behavior.

## Tickets

- **S30-01 — Example source audit:** done.
- **S30-02 — React start example cards:** done.
- **S30-03 — Example story copy:** done.
- **S30-04 — Light visual alignment:** done.
- **S30-05 — Tests and docs:** done.

## Non-Scope

- No full redesign.
- No new saved fields.
- No schema changes.
- No optimizer execution.
- No new simulation math.
- No paid/advisor visual separation.
- No pre-launch mobile perfection pass.

## Verification

Run:

- `npm test`
- `npm run build`
- `node probes/probe_simulation_engine_parity.js && node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- `find . -name '*.plan.json' -print`

The final file search should return no private plan files created by the sprint.
