# Account Boundary Decision

Sprint 0 S0-14 records the account boundary for the consumer-first local-first product.

## Decision

Accounts are optional infrastructure only. They may support:

- Encrypted sync.
- License recovery.
- Purchase history.
- Sharing.
- Advisor or adult-child collaboration.
- Multi-device continuity.
- Team or firm administration for Pro/advisor workflows.

Accounts must not be required for:

- Core planner use.
- Recommended-plan-first results.
- Anonymous trial.
- Local save/load.
- `.plan.json` import/export.
- Opening an existing local plan file.
- Basic validation/methodology visibility.
- Local paid unlock where technically and commercially feasible.

## Product Rule

The default user journey should remain:

1. Open the planner.
2. Enter or import a plan locally.
3. See a recommended plan and basic stress context locally.
4. Save or export locally.
5. Pay locally if the value is clear.
6. Create an account only if the user wants infrastructure that needs one.

Account prompts should explain the specific benefit they unlock. They should not imply that planning requires cloud storage.

## Allowed Account Use

Allowed account-backed features:

- Syncing encrypted plan files across devices.
- Recovering a license after reinstall or device replacement.
- Sharing a plan with a spouse, adult child, accountant, or advisor.
- Advisor-client collaboration with permission controls.
- Managing Pro seats, team access, and branded report settings.
- Storing non-sensitive preferences such as default province or display settings, if useful.

For plan sync or sharing, the preferred design is end-to-end encrypted content where the service cannot read plan details. If that is not implemented, the product must describe exactly what is stored server-side before the user opts in.

## Disallowed Account Use

Do not use accounts to:

- Force plan-data upload before showing results.
- Gate the recommended plan.
- Gate basic local file import/export.
- Gate a user's ability to open their own local plan files.
- Collect household financial inputs for analytics by default.
- Make "cloud save" the silent default.
- Treat account identity as consent to use plan data for model training, support, analytics, or marketing.

## Implementation Notes

- Schema v3 `.plan.json` files should be portable and complete without an account.
- Local plan files should not embed account identifiers unless the user chooses sync/sharing.
- If a cloud copy exists, the local file remains the user's source of truth when opened locally.
- If an account is deleted, local plan files should continue to open.
- If a license cannot be verified temporarily, local files should continue to open; paid-only actions may degrade gracefully.

## UX Copy Boundary

Account prompts should say what the account does, for example "Sync this encrypted plan across devices" or "Recover your Plus license later." Avoid vague prompts like "Create an account to continue."
