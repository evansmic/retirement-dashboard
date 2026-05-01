# License And Privacy Threat Model

Sprint 0 S0-15 records the first privacy and licensing threat model for a local-first commercial planner.

This is not a security design spec. It defines product promises, data boundaries, and risks the implementation must preserve.

## Assets To Protect

Sensitive user data includes:

- Names, birth years, retirement years, and household structure.
- Account balances, account types, ACB, debts, home equity, pensions, CPP/OAS estimates, salary, and spending.
- Scenario events such as death, care costs, inheritance, gifts, downsizing, and bequest goals.
- Engine results, including taxes, withdrawals, depletion years, shortfalls, estate values, and advisor notes.
- Local plan files and report exports.
- Support/debug exports if they include plan data or result rows.

## Local License Check: May Store

A local license mechanism may store the minimum needed to unlock paid features:

- License key or signed activation token.
- Product tier, feature flags, and expiry/maintenance date if applicable.
- Purchase or receipt identifier.
- Last successful verification timestamp.
- Non-sensitive device/install identifier or activation counter, if needed for fraud control.
- User email only if the user chose an email-based purchase or recovery flow.
- Cached public keys or signatures needed to verify the license offline.

Where possible, store license state separately from plan files. A `.plan.json` file should remain portable even if no license is present on the device.

## Local License Check: Must Not Upload

A license check must never upload plan content by default, including:

- Full `.plan.json` files.
- URL hashes or decoded household payloads.
- Account balances, income, spending, debt, pension, CPP/OAS, tax, or result rows.
- Scenario names or event descriptions if they can reveal private circumstances.
- Generated report contents.
- Debug logs containing household inputs or outputs.
- Browser localStorage contents beyond license-specific keys.

If abuse prevention requires a server call, the request should be limited to license metadata such as license key hash, product version, feature tier, coarse platform, and activation timestamp. Do not attach planning data.

## Continuing Use Of Local Plan Files

Users should be able to continue using their local files:

- Existing `.plan.json` files open without an account.
- Existing `.plan.json` files open even if a license expires, is offline, or cannot be recovered.
- Free/core calculations remain available for local files.
- Paid-only views may be hidden, watermarked, or read-only when no valid license is present, but the raw plan file remains exportable.
- If a plan was created with paid fields, unsupported fields should be preserved on save where possible rather than silently deleted.
- A cloud account deletion must not invalidate local files.

This keeps ownership clear: the user's plan file belongs to the user, not the license server.

## Optional Sync Risks

Risks:

- Cloud copies may expose household financial data if not encrypted correctly.
- Account takeover could reveal synced plans.
- Metadata such as filenames, update times, province, or household labels may still leak sensitive facts.
- Conflict resolution could overwrite a newer local plan.

Controls:

- Make sync opt-in.
- Prefer end-to-end encryption for plan contents.
- Explain what metadata remains visible to the service.
- Keep local export/import independent of sync.
- Provide local backup/export before destructive sync operations.
- Do not use synced plan data for analytics, training, or support unless the user explicitly sends it.

## Sharing And Collaboration Risks

Risks:

- Users may accidentally share more detail than intended.
- Shared links can be forwarded.
- Advisors or family members may retain exports outside the app.
- Revoking access may not retract already-downloaded files.

Controls:

- Sharing is opt-in per plan or report.
- Default to read-only sharing.
- Show exactly which plan/version is being shared.
- Provide expiry and revocation controls for account-backed links.
- Prefer share packages that omit unnecessary diagnostics when the user chooses a summary report.
- Warn users before sharing raw `.plan.json` files.

## AI-Assisted Reports Risks

Risks:

- AI report generation may require uploading plan data to a third-party service.
- Generated text may sound like regulated advice.
- Prompts, outputs, or logs may retain sensitive financial details.
- Users may not understand the difference between local calculations and remote drafting.

Controls:

- AI assistance must be opt-in and disabled by default.
- Before upload, show what categories of data will be sent.
- Offer a local/report-template alternative where feasible.
- Do not send plan data for AI drafting under the label of ordinary report export.
- Avoid advice-like directives; frame outputs as explanations of the calculated plan and questions to review with a professional.
- Do not use plan data for model training unless the user gives separate explicit consent.

## Analytics Risks

Risks:

- Product analytics can accidentally capture form fields, URL hashes, report text, or event names.
- A/B tests can create dark patterns around account creation or paid unlocks.
- Aggregated metrics may still expose rare scenarios.

Controls:

- No analytics on household input fields or result values by default.
- Never collect URL hashes.
- Keep analytics to coarse product events such as feature opened, export clicked, or probe suite version, where needed.
- Provide a visible analytics opt-out if analytics exists.
- Do not use analytics to infer household wealth, age, health, marital status, or retirement readiness.

## Support And Debug Export Risks

Risks:

- Support bundles may include private plans or result tables.
- Users may not realize a screenshot contains names, balances, or death/care scenarios.
- Debug logs may retain decoded hashes.

Controls:

- Support/debug export must be user-initiated.
- Provide a redacted export option that removes names and rounds or blanks financial values.
- Clearly label any full-detail support export.
- Avoid automatic crash uploads that include plan state.
- Strip URL hashes from diagnostic URLs.
- Give users a preview of support package contents before export where practical.

## Threats Out Of Scope For Sprint 0

- Full cryptographic design for sync.
- Payment processor compliance.
- Enterprise advisor access-control implementation.
- Local device compromise or malware.
- Browser extension access to page content.

These are real risks, but Sprint 0 only sets the product boundary. Later implementation work must add concrete security design before shipping sync, collaboration, or payment infrastructure.
