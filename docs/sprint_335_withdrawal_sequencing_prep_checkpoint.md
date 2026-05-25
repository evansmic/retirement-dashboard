# Sprint 335: Withdrawal Sequencing Prep Checkpoint

Sprint 335 closes the withdrawal sequencing prep batch.

## Current Capability

- Broad withdrawal-family candidates remain bounded:
  - current order
  - default
  - registered-first
  - non-registered-first
- Candidate evidence appears only when a broad withdrawal family leads the review.
- Evidence compares:
  - funded years
  - lifetime tax
  - first-year tax
  - peak annual tax
  - OAS recovery
  - projected money left
- Account-bucket guardrails require meaningful registered and TFSA/non-registered balances.
- Example tests guard against account-instruction and tax-bracket-optimization wording.

## Decision

Broad withdrawal-family comparison is ready for feedback as high-level plan-to-review evidence.

Do not move into annual withdrawal sequencing yet. The product still needs feedback on whether users understand broad families before exact annual instructions are planned.

## Deferred

- Annual account-level withdrawal overrides.
- Exact tax-bracket optimization.
- Account-by-account action plans.
- Saved optimizer output.
- Monte Carlo validation inside the optimizer loop.

## Recommended Next Batch

Run feedback/review against:

- benefit timing evidence
- broad withdrawal-family evidence
- Details density
- non-advisory copy
- whether users expect account-level action steps

After feedback, decide whether to plan annual override architecture or continue broad-family explanation work.

## Verification

Use the standard verification suite before committing this batch.
