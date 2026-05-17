# Sprint 35: Results Trust & Readiness

Sprint 35 makes the React Results experience more consumer-ready before optimizer work. It uses existing simulation, selector, readiness, risk, tax, survivor, and example-plan data. It does not add optimizer execution, strategy application, or saved-output changes.

## What Changed

- Strengthened the Overview hero so it answers "Can I retire?" with a plain verdict, confidence level, plan-through year and age, a today's-dollar annual spending estimate, and a calm insight sentence.
- Reframed spending capacity as a planning estimate for review. Today's dollars stay visible, and the copy avoids implying guaranteed safe spending or personalized financial advice.
- Added a short "Review these first" section with up to five prioritized items from existing readiness rows and retirement-answer actions.
- Reduced Overview density by moving scenario/recommendation-heavy content out of the first Results screen while keeping deeper diagnostics available in Details and Risks.
- Kept estate, tax, and survivor highlights visible in Overview without turning it into an audit page.
- Confirmed the React start screen exposes built-in synthetic examples from `app/src/data/examplePlans.ts`.
- Preserved distinct local-first actions: Save editable plan and Open printable report.

## Boundaries

- No optimizer execution.
- No strategy application.
- No engine schema or output contract changes.
- No persisted Results state.
- Detailed diagnostics remain available in Details, Risks, Taxes, Accounts, and the printable report.

## Follow-Up

- Run a planner/design feedback gate on the new first Results flow.
- If the first Results experience is clear enough, resume optimizer contract extraction as the next implementation sprint.
