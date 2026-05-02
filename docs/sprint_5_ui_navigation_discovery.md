# Sprint 5 UI / Navigation Redesign Discovery

Date: 2026-05-01  
Status: Navigation model selected; route/state shell started  
Runtime schema: `SCHEMA_VERSION = 2` remains the shipping/persisted dashboard schema.

## Purpose

Sprint 5 should turn the planner from a static-form prototype into a clearer local-first planning workspace without losing the trust, privacy, and calculation coverage already earned.

The React migration gate is now open for UI discovery: the preview app has v2 `.plan.json` adapters and an extracted simulation module behind parity probes. The stable `index.html` intake and `retirement_dashboard.html` dashboard remain the release fallback until the new guided intake reaches replacement parity.

This document explores product shape before implementation. It is not a mandate to ship accounts, cloud sync, full optimizer, schema v3 persistence, advisor workspace, AI reports, or multi-province support.

## User Jobs

- Start a new plan without creating an account.
- Reopen a local `.plan.json` file and understand what loaded.
- Enter household data with less decision fatigue than the current long form.
- Add assets, debts, real estate, income, spending, assumptions, and one-time events.
- Review inputs before generating results.
- Edit assumptions and rerun the plan without losing context.
- Review the recommended plan first.
- Inspect annual cash flow, funding sources, taxes, balances, and stress diagnostics.
- Compare built-in scenarios as diagnostics, not as five equal competing plans.
- Save/export a `.plan.json`, print/PDF, and return later.
- Avoid accidentally sharing private financial details in screenshots, URLs, PDFs, or plan files.

## Product Workspaces

### Intake Workspace

The intake workspace is for building and editing the plan input. It should feel guided, forgiving, and transparent.

Core responsibilities:

- Open/new/example plan entry.
- Step-by-step household and financial data capture.
- Inline validation and missing-field status.
- Local file save/load.
- Review screen before results.
- Clear handling of single-person vs couple plans.
- Explicit primary residence/downsize capture using current v2 fields.

### Results Workspace

The results workspace is for interpreting calculations. It should keep the recommended plan first and use scenarios/stress views as supporting evidence.

Core responsibilities:

- Recommended plan summary.
- Source reconciliation: spending must be funded by income, withdrawals, cash wedge, or other sources.
- Annual detail table.
- Charts for income, balances, taxes, estate, and stress.
- Scenario diagnostics.
- Export/print/reporting.
- Assumptions and validation visibility.

## Candidate Navigation Models

### Model A — Wizard Intake + Results Tabs

Flow:

1. Start / Open
2. Guided intake wizard
3. Review
4. Results tabs

Strengths:

- Best first implementation path.
- Easy for first-time users.
- Natural place for validation and review.
- Matches current migration goal: guided intake first, dashboard later.

Risks:

- Can feel rigid for power users editing many fields.
- Returning to a specific field may be slower unless steps have a sidebar.

### Model B — Persistent Sidebar Workspace

Flow:

1. Plan opens into a full workspace.
2. Sidebar sections: Household, Income, Accounts, Real Estate, Spending, Assumptions, Results, Export.
3. Users jump freely between sections.

Strengths:

- Better for repeat editing.
- Scales well as more modules are added.
- Feels more like a serious planning app.

Risks:

- Heavier to design now.
- Easier to overwhelm first-time users.
- Requires more navigation state and completion/status rules.

### Model C — Hybrid Guided Setup + Sidebar After Review

Flow:

1. New users start in a guided wizard.
2. After review/generate, the plan becomes a workspace with sidebar navigation.
3. Returning users open directly into the workspace with the last active area restored locally.

Recommendation:

Selected direction:

Use Model C as the product direction. The first implementation slice uses a guided setup with a simple step rail inside a persistent workspace shell: Start, Guided Intake, Review, and Results Handoff. Returning users should eventually open into the workspace, while new users get the guided path first.

Implementation note:

The React preview now has this hybrid shell scaffold. It is intentionally quiet and utilitarian: stable navigation, restrained colours, no heavy motion/effects, and no replacement of the static release path yet.

## Screen Map

### Home / Start

Purpose: start safely without an account.

Primary actions:

- New plan.
- Open `.plan.json`.
- Open example plan.
- Continue browser draft, if available.

Content:

- Privacy note: local-first, no account, no upload.
- Current scope: Ontario, 2026 tax assumptions, educational only.
- Safe sharing reminder for plan files and screenshots.

### Guided Intake

Recommended step sequence:

1. Household
2. Income
3. Accounts
4. Real Estate
5. Debts
6. Spending
7. Assumptions
8. Review

Step behavior:

- Each step has a completion state: Not started, Needs review, Complete.
- Required fields are minimal and plain-language.
- Advanced fields are collapsible.
- Single-person plans keep Person 2 fields visually inactive instead of writing placeholder values.
- Users can save a `.plan.json` at any point.

### Household

Capture:

- Plan name.
- Single or couple.
- Person names.
- Birth year/month.
- Retirement year.
- Optional survivor modelling hint.

Key UX requirement:

- Person 2 must remain a true inactive/blank person when not used. Do not auto-fill visible values that look like real data.

### Income

Capture:

- Salary and working years.
- DB pension before/after 65.
- CPP at 65/70 monthly inputs.
- OAS monthly inputs.
- Survivor CPP where relevant.

UX goal:

- Use compact cards per person.
- Keep advanced income fields expandable.
- Explain monthly vs annual inputs clearly.

### Accounts

Capture:

- RRSP/RRIF.
- LIRA/LIF.
- TFSA and contribution room.
- Non-registered balance and ACB.
- Cash wedge.
- Annual contributions while working.

UX goal:

- Show account ownership clearly.
- Separate investment accounts from real estate and debt.

### Real Estate

Capture:

- Primary residence.
- Estimated current value.
- Related mortgage or debt linkage.
- Keep / sell / downsize intent.
- Sale/downsize year.
- Net proceeds estimate.

Schema v2 handling:

- Persist only fields that currently map safely to v2: current mortgage fields and existing `downsize.year` / `downsize.netProceeds`.
- Defer second/vacation property, richer property records, and future asset classes until a scoped schema update can handle them together.
- Do not silently write unsupported second-property data into v2 plan files.

Decision:

- Second/vacation property is deferred entirely until a scoped schema update. Sprint 5 should not collect it as a note-only field because more asset/property needs may arrive and should be handled together.

### Debts

Capture:

- Mortgage balance, rate, payment.
- LOC balance and rate.
- Future linkage to property records.

UX goal:

- Make it clear which debts affect annual cash flow.

### Spending

Capture:

- Go-go, slow-go, no-go spending.
- Phase ending ages.
- One-time expenses/events.
- Inheritance/bequest target.

UX goal:

- Separate desired lifestyle spending from one-time events and estate goals.

### Assumptions

Capture:

- Plan start/end.
- Return rate.
- Inflation.
- Return volatility.
- Withdrawal order.
- CPP sharing.
- Younger-spouse RRIF election.
- Spousal RRSP attribution.

UX goal:

- Defaults should be visible and editable.
- Advanced tax strategy controls should not dominate first-time setup.

### Review

Purpose:

- Summarize key inputs before results.
- Flag missing/likely wrong values.
- Let users save a `.plan.json`.
- Generate results through the extracted engine.

Required review checks:

- Household shape: single/couple.
- Retirement years.
- Spending target.
- Income sources.
- Accounts and cash wedge.
- Debts.
- Real estate/downsize.
- Assumptions.

### Plan Dashboard

Purpose:

- Show the recommended plan first.

Initial result hierarchy:

1. Recommended plan summary.
2. Funding sources and spending reconciliation.
3. Annual detail.
4. Balances.
5. Taxes and OAS clawback.
6. Estate/inheritance.
7. Assumptions and validation notes.

Do not redesign the full results dashboard in the first guided-intake slice unless needed for handoff.

### Scenarios

Built-in diagnostics:

- Recommended plan / base.
- RRSP meltdown.
- Max spend.
- Survivor.
- Net 0% return.

UX goal:

- Present scenarios as diagnostics. Avoid making users choose among equal-looking plans.

### Stress Tests

Content:

- Monte Carlo full-spending-funded rate.
- Shortfall severity.
- Core coverage.
- Historical sequence replay.

UX goal:

- Keep risk language plain. Avoid binary success/failure verdicts.

### Export / Save

Actions:

- Save `.plan.json`.
- Load `.plan.json`.
- Print/PDF.
- Feedback-safe sharing guidance.

UX goal:

- Plan files are user-owned and local.
- Export flows must warn that files, PDFs, screenshots, and URLs may contain sensitive data.

## File Model

The UI should make the local file model explicit:

- Current plan name.
- Loaded file title, if known.
- Unsaved changes indicator.
- Last local export timestamp.
- Import success/error state.
- Save normalized `.plan.json`.
- Open stable dashboard fallback.

Do not imply cloud autosave. Browser drafts may exist as convenience, but durable save remains user-controlled `.plan.json`.

## Result Hierarchy

The results workspace should answer these questions in order:

1. Is the plan funding the desired spending?
2. What sources fund that spending each year?
3. Which accounts are drawn down and when?
4. What taxes and clawbacks are created?
5. What happens under stress?
6. What assumptions drive the answer?
7. What should the user verify before acting?

Source reconciliation is a must-have because it caught real defects in Larry’s plan. After-tax spend must reconcile to income, withdrawals, cash wedge, and other sources minus tax.

## Mobile vs Desktop

Default:

- Desktop and tablet are primary for full planning.
- Mobile should support opening a plan, reviewing summary results, and sanity-checking layout.
- Mobile does not need to be the primary dense table-editing experience in Sprint 5.

Design implication:

- Intake steps should be mobile-readable.
- Large result tables can remain desktop-first until the results redesign sprint.

## What Not To Build In Sprint 5

- No account system.
- No cloud sync.
- No schema v3 persisted plan files.
- No full optimizer.
- No advisor workspace.
- No AI report generation.
- No multi-province support.
- No ProjectionLab account inspection or paid upgrade unless separately scoped.
- No replacement of the stable dashboard until parity is proven.

## Candidate Sprint 5 Implementation Tickets

- **S5-01 — Discovery doc and screen map.** Finalize this document, choose initial navigation model, and identify open product decisions.
- **S5-02 — Guided intake route shell.** Add Start, Intake, Review, and Results handoff routes inside the React preview. Initial shell complete.
- **S5-03 — Intake state model.** Add local reducer/store for v2 payload editing, dirty state, import state, and export state. Initial state model complete.
- **S5-04 — Household step.** Build single/couple handling with true inactive Person 2 behavior.
- **S5-05 — Income step.** Capture salary, DB, CPP, OAS, and survivor fields from v2.
- **S5-06 — Accounts step.** Capture RRSP/LIRA/LIF/TFSA/non-reg/cash wedge fields from v2.
- **S5-07 — Real estate and debts step.** Add primary residence/downsize mapping and debt entry; defer second/vacation property and richer asset records until a scoped schema update.
- **S5-08 — Spending and events step.** Capture spending phases, one-offs, and inheritance goal.
- **S5-09 — Assumptions step.** Capture plan years, rates, withdrawal order, CPP sharing, RRIF election, and spousal RRSP fields.
- **S5-10 — Review and handoff.** Show summary, validation issues, save `.plan.json`, run extracted engine preview, and open stable dashboard.
- **S5-11 — Browser smoke pass.** Test new guided intake with Larry, a couple preset, malformed file import, and single-person blank Person 2 behavior.

## Open Decisions

- Should the first React intake include examples, or continue linking examples through the stable dashboard until the intake matures?
- Should the review screen require users to resolve warnings, or allow generation with clearly labelled warnings?
- Should browser draft autosave be enabled by default in the React preview, or deferred until the file model UI is clearer?
- How much ProjectionLab-inspired visual density should the first pass adopt versus matching the current quieter launch look?

## Decisions Made

- Hybrid navigation is selected: guided setup first, then a persistent workspace shell.
- Second/vacation property is deferred until a scoped schema update.
- Guided-intake validation blocks only incoherent or unsafe-to-run values. Advisory completeness issues appear as warnings and do not block result generation.

## Recommended Next Step

Proceed with Model A as the implementation starting point: a guided wizard with a simple step rail and stable dashboard handoff. Keep Model C as the long-term direction once the intake can round-trip and rerun plans reliably.
