# Sprint 4 Launch Execution Record

This file records Sprint 4 execution. It turns the package in `docs/sprint_4_launch_package.md` into launch-ready artifacts and a release gate.

## Status

- Started: 2026-05-01
- Current phase: release-readiness checks
- Runtime schema: dashboard `SCHEMA_VERSION = 2`
- Probe result: canonical suite **500 passed, 0 failed** on 2026-05-01
- Launch scope: public/free, local-first, Ontario 2026, educational only

## Copy And Positioning

- [x] Public/free positioning finalized for launch.
- [x] README opening copy states product, audience, supported scope, and local-first privacy promise.
- [x] README describes educational/not-advice boundary.
- [x] README says the current dashboard is recommended-plan-framed, not a full optimizer.
- [x] README explains local `.plan.json` save/load as user-chosen local files.
- [x] README explains URL-hash privacy in plain language.
- [x] README discloses Chart.js CDN as the only current runtime network dependency.
- [x] README includes visible known limitations.
- [x] README includes free/paid local-first direction without implementing payment or license flow.
- [x] README links methodology and comparator notes.

## Screenshot And Demo Assets

- [x] Replace `docs/screenshot.png` with a real launch screenshot using synthetic/preset data.
- [x] Capture or document the guided intake view: `docs/screenshot_intake.png`.
- [x] Capture or document the recommended-plan dashboard view: `docs/screenshot.png`.
- [x] Capture or document stress/validation surface: `docs/screenshot_stress.png` and `docs/screenshot_validation.png`.
- [x] Capture or document local `.plan.json` save/load flow: intake screenshot shows the local save/load controls and privacy copy; automated round-trip remains covered by `probe_plan_file_roundtrip.js`.
- [x] Demo script drafted below.

### Demo Script

Target length: 3-5 minutes.

1. Open `index.html` and point out that the planner runs locally, needs no account, and supports local `.plan.json` files.
2. Load the `db-pension-couple` or `diy-couple` preset so the demo uses synthetic data.
3. Name the plan "Launch demo household".
4. Show the section navigation and status pills.
5. Trigger one critical blank-field validation example, then restore the valid preset value.
6. Save a local `.plan.json`, noting that it stays on the user's device.
7. Generate the dashboard.
8. Show the recommended-plan framing and explain that a full optimizer is not yet built.
9. Open stress diagnostics and Monte Carlo/historical context.
10. Open the year-by-year detail table to show tax, benefits, withdrawals, and balances.
11. Show print/PDF and dashboard-side `.plan.json` export.
12. Close with limitations: Ontario 2026, educational only, no full optimizer, no cloud sync/accounts.

## Manual Browser Smoke Test

Run before launch in at least one Chromium-based browser. Record browser/version and date.

- Date: 2026-05-01
- Browser: Codex in-app Chromium browser against `http://127.0.0.1:8765`
- Tester: Codex

### First-Open And Presets

- [x] Open `index.html` from a local file path.
- [x] Open `index.html` from local static hosting.
- [x] Confirm first-open copy is understandable and not advice-like.
- [x] Load each bundled preset.
- [x] Confirm preset labels and values do not contain private or bespoke names.

### Intake

- [x] Create a single-person plan by leaving Person 2 blank. Covered by `probe_intake_validation.js`.
- [x] Create a couple plan with both people populated. Covered by bundled preset sweep and `probe_intake_roundtrip.js`.
- [x] Confirm plan name affects browser draft label and local filename. Covered by `probe_plan_file_roundtrip.js`.
- [x] Confirm guided section navigation works on desktop. Verified in current browser smoke through visible section rail/status controls.
- [x] Confirm section status pills move between Empty/Review/Complete as expected. Verified in current browser smoke through visible status pills and covered by intake validation state.
- [x] Confirm save-and-continue actions do not lose data. Covered by `probe_intake_roundtrip.js` for form preservation and round-trip integrity.
- [x] Confirm critical blank validation blocks dashboard generation.
- [x] Confirm validation messages are understandable and field-specific.
- [x] Confirm obviously valid plans generate the dashboard.

### Local Files And Round Trip

- [x] Save a local `.plan.json` from intake. Covered by `probe_plan_file_roundtrip.js`; OS download prompt not exercised before final release pass.
- [x] Reopen the saved `.plan.json` from intake. Covered by `probe_plan_file_roundtrip.js`; OS file picker not exercised before final release pass.
- [x] Generate dashboard from the loaded plan. Covered by `probe_plan_file_roundtrip.js` and browser preset generation smoke.
- [x] Export `.plan.json` from the dashboard. Covered by dashboard export surface screenshot and plan-file wrapper probe; OS download prompt not exercised before final release pass.
- [x] Reopen dashboard-exported `.plan.json` from intake. Covered by dashboard-style annual CPP/OAS import assertion in `probe_plan_file_roundtrip.js`.
- [x] Confirm existing hash links still load. Covered by `probe_schema_migrate.js`, `probe_intake_roundtrip.js`, and browser example/hash smoke.
- [x] Confirm Edit Plan from dashboard returns to intake with values intact. Covered by `probe_intake_roundtrip.js`; visible Edit Plan button is absent on `?example=` demo dashboards as expected.

Note: browser download/upload flows were not manually exercised in this pass to avoid creating local launch artifacts or interacting with OS file pickers through the in-app browser. The automated plan-file round-trip probe covers the import/export wrapper behaviour, dashboard-style import, and malformed/unsupported JSON rejection. A human OS file-picker pass remains a final release/PR task, not a Sprint 4 package blocker.

### Dashboard

- [x] Recommended plan tab/view is first and clearly framed.
- [x] Alternatives/stress views do not read as equal recommended plans.
- [x] Charts render without blank canvases.
- [x] Monte Carlo/progressive stress output completes or degrades clearly.
- [x] Historical stress views show severity metrics.
- [x] Year-by-year table renders and expands.
- [x] Real/nominal toggle works.
- [x] Print/PDF action is present.

### Privacy And Failure States

- [x] Local-file/privacy copy is visible before save/load.
- [x] Loading a malformed `.plan.json` fails clearly. Covered by `probe_plan_file_roundtrip.js`.
- [x] Loading an unsupported file does not silently corrupt the current form. Covered by `probe_plan_file_roundtrip.js`.
- [x] No account prompt appears in the core flow.
- [x] No personal `.plan.json`, screenshot, or browser artifact is committed.

### Responsive Sanity

- [x] Intake is usable at a narrow viewport.
- [x] Dashboard does not hide critical warnings at a narrow viewport.
- [x] Mobile/desktop-first limitation is documented.

Note: the current Codex in-app browser viewport is narrow enough to catch obvious content loss. It showed the intake header, local-file privacy copy, Generate Dashboard action, dashboard heading, Recommended Plan tab, and disclaimer content. A dedicated device-size browser pass is still recommended before launch.

## Validation And Comparator

- [x] Canonical probes pass before release: **500 passed, 0 failed** on 2026-05-01.
- [x] README probe count matches the current documented suite result: 500 checks.
- [x] README links `validation/tax_methodology_2026.md`.
- [x] README links `validation/external-results/free_public_comparison_2026-04-28.md`.
- [x] Confirm baseline exports are current or explicitly unchanged. Current baseline export files are dated 2026-05-01 and no engine output changed in Sprint 4.
- [x] Confirm `public-comparator-single` remains aligned with `VALIDATION.md`. It is present in `validation/preset_baselines.json` with five deterministic scenarios.
- [x] Re-check comparator note for stale launch wording. It records the S0-01 tax follow-up and remains usable as a launch validation note.
- [x] Record whether comparator results are exact, directional, or unsupported. The comparator note separates exact/component checks, directional comparisons, and tools attempted but not counted.
- [x] Known validation gaps are visible in README: Ontario-only, no GIS, no Quebec/QPP, no full optimizer, annual tax update required.

## GitHub And CI

- [x] Git status reviewed; unrelated Sprint 3 work exists and must be preserved.
- [x] `.gitignore` excludes `.DS_Store`.
- [x] `.gitignore` excludes private local `*.plan.json` files.
- [x] No private `.plan.json` files are present before commit/release.
- [x] No screenshots with private names, balances, browser profile details, or local paths are committed.
- [x] Probe suite passes locally: **500 passed, 0 failed** on 2026-05-01.
- [x] GitHub Actions probe workflow is green on the latest remote `main` run checked with `gh run list` on 2026-05-01. Note: local Sprint 3/4 changes have not been pushed, so CI has not run on this working tree yet.
- [x] MIT license present.
- [x] README badge/link check complete.
- [x] Public repo description/topics ready for manual GitHub setup.
- [x] Issues include a warning not to paste private financial data via `.github/ISSUE_TEMPLATE/bug_report.md`.
- [x] Release tag/version/date chosen: `local-first-launch-2026-05-01`, dated 2026-05-01.
- [x] Launch branch/PR description includes probes and manual smoke-test summary.

## Final Release/PR Pass

- Date: 2026-05-01
- Commit: `a0281633ee48bb823dd10f5f6bf7a6f13512a7a2` (`Complete local-first launch package`)
- Branch/repository: `origin/main` on `evansmic/retirement-dashboard`
- Release tag to create when publishing: `local-first-launch-2026-05-01`
- GitHub Actions: `probes` push run completed successfully on `main` at 2026-05-01T14:49:38Z.
- Vercel deployment status: success for the same commit.
- Local release hygiene: canonical probes pass 500/500; runtime `SCHEMA_VERSION` remains 2; `.gitignore` excludes `*.plan.json`; no local `.plan.json` files are present.
- Known non-shipping scope remains deferred: full optimizer, cloud sync, account system, advisor workspace, multi-province support, AI reports, and schema v3 runtime migration.

### Release Notes / PR Summary Draft

This release packages the Canadian Retirement Planner for a local-first public launch. It keeps the core accountless workflow intact while adding local `.plan.json` save/load, guided intake navigation, critical blank-field validation, recommended-plan framing, refreshed public README/site copy, privacy/disclaimer language, launch screenshots, launch-post drafts, and public feedback guidance.

Validation and release gates:

- Canonical probes: 500 passed, 0 failed.
- CI: GitHub Actions `probes` completed successfully on pushed `main`.
- Deployment: Vercel status check succeeded on `a028163`.
- Runtime schema: `SCHEMA_VERSION = 2`.

Out of scope for this release: full recommended-plan optimizer, cloud sync, account system, advisor workspace, multi-province support, AI reports, and schema v3 runtime migration.

Suggested GitHub description:

> Local-first Canadian retirement planner for Ontario households, with 2026 tax/benefit modelling, stress tests, and local `.plan.json` files.

Suggested topics:

`retirement-planning`, `canada`, `ontario`, `cpp`, `oas`, `rrsp`, `tfsa`, `tax-planning`, `local-first`, `personal-finance`, `monte-carlo`, `static-site`

## Release Gate

- [x] README identifies Sprint 4 as the active launch/productization package.
- [x] Roadmap identifies Sprint 4 as the active next sprint.
- [x] Screenshot is updated.
- [x] Disclaimer appears in README.
- [x] Disclaimer appears in dashboard app surface.
- [x] Privacy copy appears in README.
- [x] Privacy copy appears in intake app surface.
- [x] Known limitations are visible in README.
- [x] Runtime dashboard `SCHEMA_VERSION` remains 2.
- [x] Static files open locally.
- [x] Static preview/public host works locally via `http://127.0.0.1:8765`.
- [x] Canonical probe count recorded from a fresh run: **500 passed, 0 failed** on 2026-05-01.
- [x] Manual smoke-test date/browser recorded.
- [x] Validation/comparator status recorded.
- [x] Launch posts drafted in `docs/launch_posts.md`.
- [x] Feedback triage guidance drafted in `docs/launch_posts.md`.
- [x] Rollback/fix-forward principle: patch static files or copy/assets; do not introduce accounts/cloud as a hotfix.
- [x] Whitespace check: `git diff --check` completed with no output on 2026-05-01.

## Non-Shipping List

These remain deferred during Sprint 4 unless separately scoped:

- full optimizer
- cloud sync
- account system
- payment/licensing implementation
- advisor workspace
- multi-province support
- schema v3 runtime migration
- AI reports or opt-in upload flow
- mobile redesign
