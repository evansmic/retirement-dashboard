# Sprint 11 Recommended Path Implementation Checklist

Sprint 11 turns the recommended-path stress and drilldown evidence into a bounded implementation checklist. It remains runtime-only and does not persist recommendation, confidence, drilldown, or checklist output.

## Goal

Help users understand what to review before relying on the selected preview path:

- Clear blockers.
- Review watch risks.
- Confirm spending comfort.
- Confirm retirement and CPP/OAS timing levers.
- Inspect tax pressure.
- Check household resilience.
- Open the stable dashboard for complete detail.
- Save the local v2 plan file after review.

## Scope

- Add typed runtime checklist items to the recommended-path selector.
- Render a React Overview checklist below the break-risk drilldowns.
- Keep checklist status grounded in existing evidence: validation blockers, break risks, confidence, selected-path stress context, and survivor comparison.
- Keep stable dashboard handoff copy explicit.

## Non-Scope

- Full optimizer
- AI report
- Persisted recommendation/checklist output
- Schema v3
- Cloud sync
- Accounts
- Advisor workspace
- Paid gating
- Multi-province support

## Checklist Rules

- Validation blockers or blocked break risks block “Clear blockers” and “Save local plan file.”
- Low confidence or watch risks make “Review watch risks” a now-priority review item.
- Watch-level spending sensitivity makes spending confirmation a now-priority review item.
- Retirement date and CPP/OAS timing remain review levers, not instructions.
- Tax pressure creates a review item when selected-path tax pressure years exist.
- Survivor resilience is later for single plans and next-priority for two-person plans.
- Stable dashboard detail remains a required review handoff.

## Guardrails

- Runtime dashboard schema remains v2.
- `.plan.json` files do not include checklist output.
- Stable dashboard remains the complete detail surface.
- Product copy uses review language, not advice language.

## Verification

- `npm test`
- `npm run build`
- `node probes/probe_simulation_engine_parity.js && node probes/probe_engine_bridge_parity.js`
- `./probes/run_all.sh`
- Confirm no `.plan.json` files were created in the repo.
