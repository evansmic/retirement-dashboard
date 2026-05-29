# Spending Path Model Reset Plan

## Purpose

This plan describes a future clean saved-format reset from user-entered phased spending targets to a simpler consumer model:

1. User enters minimum monthly expenses, excluding mortgage payments already entered in Debts.
2. App estimates a confident after-tax monthly spending capacity.
3. Engine models a default spending path over time.
4. User may adjust breakpoint ages and rerun.

## Default Spending Path

The future default should be understandable without requiring users to know retirement-planning jargon.

Planning defaults to evaluate:

- Early retirement: full monthly capacity.
- Later retirement: modest reduction after a default breakpoint age.
- Late-life: further reduction after a second breakpoint age, while preserving the ability to model care costs separately.

The exact default reduction rates should be tested before implementation. They should not be presented as universal truth.

## Breakpoint Controls

Breakpoint controls should be secondary and optional.

Recommended copy posture:

- "Spending often changes with age."
- "These ages only control when the model changes spending assumptions."
- "Adjust and rerun if the timing does not fit."

Avoid:

- go-go / slow-go / no-go terminology,
- implying the user should know the correct spending path,
- presenting defaults as advice.

## Schema Boundary

Do not change saved plan schema until the reset is explicitly planned.

Reset decisions:

- Minimum monthly expenses should become a first-class saved field only in the new format.
- Spending-path defaults should be designed for the new format, then tested before becoming user-facing.
- Old preview files should not be migrated into the new model.
- If an old preview file is opened after the reset, block the import with calm copy and ask the tester to start a new plan.
- New example plans should be created fresh in the new format.

## Engine Boundary

Before changing engine outputs, define:

- floor-covered status,
- estimated monthly capacity,
- discretionary room above the floor,
- spending path rows or metadata,
- funding trace handoff into account-level sequencing.

## UI Boundary

Do not start the broad UI overhaul yet. The future UI should be designed around this model only after the account optimizer and schema choices are stable.
