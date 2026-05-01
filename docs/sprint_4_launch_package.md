# Sprint 4 Launch Package

Sprint 4 packages the current local-first Canadian retirement planner for a credible public launch. It is a productization and release-readiness sprint, not a new modelling sprint.

## Goal

Ship a public/free, local-first launch package that a Canadian DIY household can understand and trust enough to try:

- clear public positioning
- honest limits
- privacy and disclaimer copy
- launch screenshots and demo flow
- manual browser smoke tests
- validation/comparator checklist
- GitHub/CI/release checklist
- launch-post drafts and feedback triage loop

The launch should be useful even before the full optimizer exists. The product can say it is moving toward recommended-plan-first, and the dashboard can keep the recommended-plan framing added in Sprint 3, but Sprint 4 must not claim that a true optimizer is shipping.

## Product Boundary

### Ship In Sprint 4

- Public/free positioning for a local-first Ontario 2026 retirement planner.
- README and site copy finalization.
- Privacy copy that explains local browser execution, URL hashes, local `.plan.json` files, and no required account.
- Educational-use disclaimer and professional-advice boundary.
- Screenshot/demo assets using bundled presets or synthetic data only.
- Manual browser smoke-test checklist and launch execution record.
- Validation/comparator checklist tied to existing baseline exports and public comparator notes.
- GitHub/CI/release checklist.
- Launch-post drafts for r/PersonalFinanceCanada, Hacker News, LinkedIn, and a short personal/site post.
- Feedback triage guidance that warns users not to send private plan data in public issues.

### Do Not Ship In Sprint 4

- Full optimizer for CPP/OAS timing, withdrawal order, pension splitting, CPP sharing, guardrails, or estate trade-offs.
- Cloud sync.
- Account system.
- Payment, license activation, or paid-feature enforcement.
- Advisor workspace, multi-household workspace, white-labeling, or collaboration.
- Schema v3 runtime migration or dashboard `SCHEMA_VERSION` bump.
- Multi-province tax support.
- AI report drafting or any opt-in upload flow.
- Mobile redesign beyond smoke-testing and documenting known limits.
- Personal plan files, private screenshots, credentials, or `.DS_Store`.

## Launch Positioning

### One-Sentence Promise

A private, browser-based Canadian retirement planner for Ontario households that models taxes, benefits, accounts, spending, and stress cases without requiring an account or uploading plan data.

### Public/Free Position

Free/core should be described as a real planning tool, not a teaser:

- guided local intake for singles and couples
- Ontario 2026 federal/provincial tax and benefit modelling
- CPP/OAS timing fields and current deterministic scenario engine
- registered, TFSA, non-registered, LIF, DB pension, mortgage, one-offs, survivor, and downsize modelling
- recommended-plan-first dashboard framing with stress diagnostics
- Monte Carlo and historical sequence stress context
- local browser draft plus local `.plan.json` save/load
- print/PDF export
- validation methodology and public comparator notes
- no account required for core use

Avoid saying Free includes a full optimized recommendation until the optimizer exists. Acceptable wording: "the dashboard is framed around a recommended plan and supporting diagnostics." Avoid: "the engine searches every strategy and chooses the best plan."

### Local-First Paid/Free Packaging

Sprint 4 should not implement pricing, payments, or licenses. It should prepare public-safe language that matches `docs/local_monetization_sketch.md`:

- Free/core remains generous and useful.
- Paid capability, if added later, monetizes depth and workflow rather than data capture.
- Plus candidates include richer scenarios, polished reports, implementation packages, advanced stress tests, expanded validation exports, guardrails, and additional provinces.
- Pro/advisor candidates include client-ready reports, multi-household workflow, branding, collaboration, and optional encrypted sync.
- Accounts remain optional infrastructure for sync, recovery, sharing, advisor/adult-child collaboration, or multi-device continuity.
- Local `.plan.json` files remain user-owned and openable without an account.

## Copy Checklist

### README / Site Copy

- [x] Opening paragraph states the product, audience, and local-first privacy promise.
- [x] Supported scope is explicit: Canada, Ontario, 2026 tax year, non-Quebec.
- [x] The product is described as educational planning software, not financial advice.
- [x] Current recommended-plan framing is accurate and does not imply a full optimizer.
- [x] Local `.plan.json` save/load is explained as on-device file use.
- [x] URL-hash behaviour is explained in plain language.
- [x] Chart.js CDN request is disclosed in privacy copy.
- [x] Known limitations are visible without requiring roadmap archaeology.
- [x] Probe count and validation links are current.
- [x] Screenshot is real launch imagery, not a placeholder.
- [x] Run instructions are clear for non-technical users and reviewers.

### Privacy Copy

Required claims:

- Calculations run in the browser.
- Plan inputs are not uploaded by the app.
- URL hashes are not sent to the web server as normal HTTP requests.
- Local `.plan.json` save/load reads and writes files the user chooses.
- No account is required for core planning.
- No analytics should collect household financial inputs or URL hashes.
- The only current runtime network dependency is Chart.js from a CDN.

Avoid overclaiming:

- Do not say "impossible to share data" because users can share URLs, screenshots, PDFs, or plan files.
- Do not say "secure against malware/browser extensions."
- Do not promise future sync encryption before it exists.

### Disclaimer Copy

Must include:

- Not financial advice.
- Educational planning tool.
- Verify tax/benefit rules with CRA, Service Canada, and the relevant province.
- Consult a qualified planner, accountant, or tax professional before acting.
- Projections depend on user inputs and simplifying assumptions.
- Tax rules, thresholds, and benefit amounts change.
- Actual outcomes will differ.

## Screenshot And Demo Assets

Use only bundled presets or synthetic data. Do not capture real household data.

### Required Screenshots

- [x] First-open / preset selection or guided intake starting state.
- [x] Guided intake with section status pills and local privacy/save copy visible.
- [x] Critical blank-field validation state.
- [x] Recommended-plan dashboard first screen.
- [x] Stress/Monte Carlo or historical diagnostic surface.
- [x] Year-by-year detail/audit view.
- [x] Local `.plan.json` save/load or dashboard export affordance.

Recommended hero screenshot: `db-pension-couple` or `diy-couple` dashboard at approximately 1600x900, showing the recommended plan summary and income/balance chart. Save as `docs/screenshot.png` unless the README is changed to reference additional images.

### Demo Script

Target length: 3-5 minutes.

1. Open the app and state the local-first promise.
2. Load a bundled preset or enter a small synthetic household.
3. Name the plan.
4. Show section status pills and one validation example.
5. Save a local `.plan.json`.
6. Generate the dashboard.
7. Point to recommended-plan framing and stress diagnostics.
8. Open a year-by-year row to show auditability.
9. Export/print or export the local plan from the dashboard.
10. Close by naming limitations: Ontario 2026, educational only, no full optimizer yet.

## Manual Browser Smoke-Test Checklist

Run in at least one Chromium-based browser before launch. If time allows, repeat core flows in Safari and Firefox.

### First-Open And Presets

- [x] Open `index.html` from a local file path.
- [x] Open `index.html` from local static hosting, if a public/static preview is used.
- [x] Confirm first-open copy is understandable and not advice-like.
- [x] Load each bundled preset.
- [x] Confirm preset labels and values do not contain private or bespoke names.

### Intake

- [x] Create a single-person plan by leaving Person 2 blank.
- [x] Create a couple plan with both people populated.
- [x] Confirm plan name affects browser draft label and local filename.
- [x] Confirm guided section navigation works on desktop.
- [x] Confirm section status pills move between Empty/Review/Complete as expected.
- [x] Confirm save-and-continue actions do not lose data.
- [x] Confirm critical blank validation blocks dashboard generation.
- [x] Confirm validation messages are understandable and field-specific.
- [x] Confirm obviously valid plans generate the dashboard.

### Local Files And Round Trip

- [x] Save a local `.plan.json` from intake.
- [x] Reopen the saved `.plan.json` from intake.
- [x] Generate dashboard from the loaded plan.
- [x] Export `.plan.json` from the dashboard.
- [x] Reopen dashboard-exported `.plan.json` from intake.
- [x] Confirm existing hash links still load.
- [x] Confirm Edit Plan from dashboard returns to intake with values intact.

### Dashboard

- [x] Recommended plan tab/view is first and clearly framed.
- [x] Alternatives/stress views do not read as equal recommended plans.
- [x] Charts render without blank canvases.
- [x] Monte Carlo/progressive stress output completes or degrades clearly.
- [x] Historical stress views show severity metrics.
- [x] Year-by-year table renders and remains readable.
- [x] Real/nominal toggle works.
- [x] Print/PDF action opens the browser print flow.

### Privacy And Failure States

- [x] Local-file/privacy copy is visible before save/load.
- [x] Loading a malformed `.plan.json` fails clearly.
- [x] Loading an unsupported file does not silently corrupt the current form.
- [x] No account prompt appears in the core flow.
- [x] No personal `.plan.json`, screenshot, or browser artifact is committed.

### Responsive Sanity

- [x] Intake is usable at a narrow viewport.
- [x] Dashboard does not hide critical warnings at a narrow viewport.
- [x] README or known limitations note if mobile remains desktop-first.

## Validation And Comparator Checklist

- [x] Confirm canonical probes pass before release.
- [x] Confirm README probe count matches the latest suite result.
- [x] Confirm `validation/tax_methodology_2026.md` is linked from README and validation docs.
- [x] Confirm `validation/preset_baselines.*` are regenerated only if engine outputs changed.
- [x] Confirm `public-comparator-single` still matches its documented assumptions.
- [x] Re-check `validation/external-results/free_public_comparison_2026-04-28.md` for stale launch wording.
- [x] Record whether comparator results are exact, directional, or unsupported by the external tool.
- [x] Keep paid/account-gated comparators out of launch claims unless their terms allow stored notes.
- [x] Document known validation gaps near the launch copy: Ontario-only, no GIS, no Quebec/QPP, no full optimizer, no guarantee of future tax-law updates.

## GitHub And CI Checklist

- [x] Git status reviewed; unrelated Sprint 3 work preserved.
- [x] `.DS_Store` not touched or committed.
- [x] No private `.plan.json` files committed.
- [x] No screenshots with private names, balances, browser profile details, or local paths.
- [x] Probe suite passes locally.
- [x] GitHub Actions probe workflow is green.
- [x] README badge and license link work.
- [x] MIT license present.
- [x] Public repo description and topics are ready.
- [x] Issues are enabled with a note not to paste private financial data.
- [ ] Release tag/version/date are chosen. Deferred to final release/PR pass.
- [ ] Launch branch/PR description includes probes run and manual smoke-test summary. Deferred to final release/PR pass.

## Release Checklist

- [x] README and roadmap identify Sprint 4 launch status.
- [x] Screenshot is updated.
- [x] Disclaimer appears in README and app surface.
- [x] Privacy copy appears in README and app surface.
- [x] Known limitations are visible.
- [x] Runtime dashboard `SCHEMA_VERSION` remains 2 unless a migration/probe exists.
- [x] Static files open locally.
- [x] Static preview/public host works, if used.
- [x] Canonical probe count recorded.
- [x] Manual smoke-test date/browser recorded.
- [x] Validation/comparator status recorded.
- [x] Launch posts drafted.
- [x] Feedback triage labels or issue templates prepared.
- [x] Rollback/fix-forward plan noted: revert launch copy/assets or patch static files; do not introduce accounts/cloud as a hotfix.

## Launch-Post Prep

All launch posts should be transparent, modest, and specific. Ask for calculator/model feedback, confusing-copy feedback, and bug reports. Warn users not to post real financial details publicly.

### r/PersonalFinanceCanada

Tone: practical, transparent, Canada-specific.

Must include:

- Built a free local-first Ontario retirement planner.
- Runs in browser; no account; plan data not uploaded by the app.
- Models CPP/OAS, RRSP/RRIF/LIF/TFSA/non-reg, federal/Ontario 2026 tax, OAS clawback, pension splitting, DB pensions, survivor, downsizing, stress tests.
- Educational only, not financial advice.
- Ontario-only for now; Quebec/QPP not supported.
- Looking for feedback on assumptions, UX confusion, tax/model issues, and missing Canadian edge cases.
- Do not ask users to share personal financial data in comments.

### Hacker News

Tone: technical/product.

Must include:

- Static HTML/vanilla JS, local-first, no backend for core planning.
- Canadian retirement modelling is the hard domain: tax, benefits, couples, registered/non-registered accounts.
- Validation/probe suite count and public comparator notes.
- Privacy boundary and optional-account philosophy.
- What is intentionally not built yet: optimizer, sync, accounts, paid licensing.

### LinkedIn

Tone: product story and public usefulness.

Must include:

- Why Canadian retirement planning is hard for consumers.
- Local-first trust angle.
- Open/free public path.
- Validation and limitations.
- Invitation for planners, DIY retirees, and Canadian tax/benefit experts to critique.

### Short Personal/Site Post

Tone: concise launch note.

Must include:

- What shipped.
- Why local-first matters.
- What is accurate today.
- What remains prototype/roadmap.
- Links to README, methodology, and feedback channel.

## Feedback Triage

### Intake Channels

- GitHub issues for reproducible bugs, copy confusion, browser problems, and modelling questions based on synthetic examples.
- Private email or contact form only if users need to discuss sensitive data; prefer redacted/synthetic examples.
- Launch-thread comments for high-level feedback and missing use cases.

### Issue Labels

- `launch-feedback`
- `bug`
- `validation`
- `tax-benefit`
- `privacy-copy`
- `ux-copy`
- `browser-smoke`
- `docs`
- `defer-optimizer`
- `defer-sync-account`

### Hotfix Criteria

Hotfix quickly:

- wrong tax/benefit result in a supported Ontario 2026 case
- broken plan generation
- broken local save/load
- privacy/disclaimer overclaim
- CI/probe failure
- launch screenshot/copy exposing private data

Defer:

- optimizer requests
- additional provinces
- mobile redesign
- cloud sync
- account/license recovery
- advisor collaboration
- AI report drafting

## Task Execution Order

1. Copy and positioning pass.
2. Screenshot/demo capture.
3. Manual browser smoke test.
4. Validation/comparator review.
5. GitHub/CI/release checklist.
6. Launch-post drafts.
7. Final release gate and launch.

## Sprint 4 Definition Of Done

- Public copy is accurate, modest, and launch-ready.
- Local-first privacy and account boundaries match `docs/account_boundary_decision.md` and `docs/license_privacy_threat_model.md`.
- Free/paid positioning matches `docs/local_monetization_sketch.md`.
- README screenshot and demo assets use synthetic data.
- Manual browser smoke-test checklist is complete or has explicit non-blocking deferrals.
- Validation and comparator status is current enough for public launch.
- Canonical probes pass before release.
- Release and GitHub/CI checklist is complete.
- Launch posts are drafted.
- The non-shipping list remains intact.
