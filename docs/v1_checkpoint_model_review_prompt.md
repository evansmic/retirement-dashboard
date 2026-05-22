# V1 Checkpoint Model Review Prompt

Use this prompt with models or coding agents that have access to a fresh clone of the repo.

---

You are reviewing a local-first Canadian retirement planner at the v1 checkpoint. The product is intended to be consumer-first, plain-language, and decision-oriented. It should help Canadian households understand retirement readiness, spending capacity, tax/benefit timing, drawdown trade-offs, survivor resilience, estate intent, local save/export trust, and report handoff.

Important boundaries:

- Do not suggest cloud accounts, advisor workflows, province expansion, paid features, or broad redesign unless you clearly mark them as later.
- Do not assume the optimizer should apply saved changes automatically.
- Do not ask for guaranteed/safe-spend language.
- Do not reward options that reduce lifestyle, delay retirement, or delay benefits unless the plan has a visible funding issue and the option materially helps.
- Actual tax-aware drawdown execution is intended for v1, but it must remain conservative, explainable, review-oriented, and never presented as personalized financial advice.
- Saved `.plan.json` files must not include optimizer output, checkpoint output, stress output, drawdown drafts, comparison output, or feedback output.

Review setup:

1. Install and run the project from a clean clone.
2. Run the verification commands if possible:
   - `npm test`
   - `npm run build`
   - `node probes/probe_simulation_engine_parity.js && node probes/probe_engine_bridge_parity.js`
   - `./probes/run_all.sh`
   - `find . -name '*.plan.json' -print`
3. Load several built-in examples, including at least:
   - a single-person case,
   - a comfortable couple,
   - a tighter couple,
   - a DB pension couple,
   - a case with estate intent or home-equity assumptions if available.
4. Spend the first 60 to 90 seconds only in Results Overview.
5. Then inspect Details, Taxes, Household Resilience, and Export/Save.

Please return your review in this exact structure:

## Executive Judgment

- Is the product still on track for a strong v1?
- What is the biggest thing that could still undermine trust?
- Should development continue on bounded tax-aware drawdown execution, or pause for UI/UX fixes first?

## Must Fix Before V1

List only issues that would block a credible v1. Include file paths or UI locations where possible. Explain the user impact.

## Review During V1 Checkpoint

List issues that need discussion or user testing but do not clearly block v1.

## Defer To Later UX Pass

List visual design, layout, color, typography, chart, icon, and information-presentation polish that should be handled after the engine checkpoint unless it directly damages trust.

## Results Overview Review

Answer:

- Can a non-expert quickly understand “Can I retire?”
- Is the confidence/readiness language calm and non-advisory?
- Is “today’s dollars” visible where spending is discussed?
- Are the top review actions useful and limited enough?
- Is Overview too dense?

## Drawdown And Optimizer Review

Answer:

- Does bounded drawdown execution/review remain conservative?
- Does anything sound like account-by-account advice?
- Are disruptive options held back unless they materially repair a visible issue?
- Are estate goals and survivor implications respected?
- Is any optimizer or drawdown output persisted?

## Canadian Planning Review

Answer:

- Any obvious CPP, OAS, RRIF/LIF, DB pension, survivor, estate, home-equity, or tax-framing concerns?
- Any concern that tax or benefit timing is being shown before eligibility?
- Any concern that future precision is overstated?

## Save, Export, And Local-First Trust

Answer:

- Is the difference between “Save editable plan” and “Open printable report” clear?
- Does local-first behavior feel trustworthy?
- Is there enough warning that data is saved locally and should be backed up?

## Verification Notes

State which commands you ran and whether they passed. If `./probes/run_all.sh` fails only because localhost binding is blocked for the route probe, call that out separately.

## Top 10 Recommendations

Rank concrete recommendations by priority. For each one, mark:

- `Fix before v1`
- `Review during checkpoint`
- `Defer to UX pass`

Keep the review practical. Prefer specific findings over broad advice.
