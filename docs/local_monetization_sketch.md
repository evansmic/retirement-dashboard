# Local Monetization Sketch

Sprint 0 S0-13 defines a first product boundary for Free, Plus, and Pro/advisor packaging. This is a capability sketch, not a pricing decision.

The goal is to monetize depth and workflow, not user data. The core planner should remain useful without an account, cloud storage, or plan-data upload.

## Principles

- The recommended-plan-first experience belongs in the free/core product.
- Core planning, local save/load, import/export, examples, and anonymous trial remain accountless.
- Paid unlocks should work locally where feasible through a license file, activation token, purchase receipt, or equivalent accountless mechanism.
- Accounts are optional infrastructure for sync, license recovery, sharing, advisor collaboration, or multi-device continuity.
- Any feature that uploads plan data must be opt-in, clearly labelled, and unnecessary for ordinary local planning.

## Free / Core

Free should be generous enough that a Canadian household can answer the basic retirement question privately.

Included:

- Guided local intake for singles and couples.
- Ontario tax/benefit engine for the supported tax year.
- Bundled Canadian example presets and public-comparator fixture.
- One recommended household plan as the default result.
- Basic CPP/OAS timing, withdrawal-order, pension-splitting, and spending recommendation surface once the optimizer exists.
- Basic deterministic result charts, annual detail table, and plain-language explanation.
- Basic stress summary so the recommendation is not presented as certainty.
- Local browser use with no account.
- Local save/load and `.plan.json` import/export once implemented.
- Validation/methodology visibility, known limitations, and public benchmark notes.
- Anonymous trial of paid surfaces where practical, with locked export or watermark if needed.

Free should not intentionally withhold basic risk context. It can limit depth, polish, or workflow automation, but it should not make the recommended plan look safer than it is.

## Plus

Plus is for households that want deeper DIY planning, richer comparisons, and practical implementation help while still working locally.

Good Plus candidates:

- Named local plans and multiple saved household files.
- Richer scenario builder: retire earlier/later, part-time work, spending phase changes, major one-offs, downsize variants, inheritance/gift timing, and province-change modelling once supported.
- Detailed alternative scenarios behind the recommended plan.
- Lower-return, inflation shock, historical sequence, and early-death cases with richer diagnostics.
- Estate variants, bequest targets, and survivor-specific views.
- Flexible-spending Monte Carlo and guardrail withdrawal modes.
- More detailed tax strategy comparisons, including RRSP/RRIF/LIF drawdown and meltdown variants.
- Polished PDF/report exports for household use.
- Expanded validation exports and audit tables.
- Implementation package: year-by-year withdrawal instructions, CPP/OAS timing, RRIF/LIF checkpoints, tax/benefit notes, and guardrail actions.
- Extra provinces after Ontario, likely BC and Alberta first.

Plus should still not require an account for normal use. A local license unlock should be enough unless the user opts into sync, recovery, or sharing.

## Pro / Advisor

Pro/advisor exists for professional workflows or recurring client work. It should not be the default consumer path.

Good Pro/advisor candidates:

- Multi-household workspace.
- Client-ready report packages and report branding.
- Advisor notes, task lists, review states, and client handoff packages.
- Side-by-side client scenario comparisons.
- White-label or firm-branded exports.
- Optional encrypted client/advisor collaboration.
- Optional shared plan links with explicit consent and expiry controls.
- Bulk validation/export tools for advisors.
- Province coverage and complex household modules that advisors commonly need.

Pro may reasonably depend on an account when collaboration, team access, client sharing, or subscription management is involved. The account should still be tied to workflow infrastructure, not to making the calculation engine usable.

## Not Monetization Gates

Do not put these behind a mandatory account or paid-only wall:

- Opening the planner and entering a household plan.
- Seeing a recommended plan.
- Basic stress context for the recommended plan.
- Local save/load.
- `.plan.json` import/export.
- Exporting the user's own raw plan file.
- Reading methodology, validation notes, and known limitations.
- Continuing to open existing local plan files after a license expires.

## Open Pricing Questions

- Whether Plus should be one-time purchase, annual maintenance, or paid major-version upgrades.
- Whether extra provinces are included in Plus or sold as optional modules.
- Whether polished reports should be Plus for consumers and Pro for advisors with branding.
- Whether AI-assisted report drafting can be offered locally or only through explicit opt-in upload.
- Whether optional sync is first-party encrypted sync, user-owned storage, or deferred.
