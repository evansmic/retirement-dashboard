# TASKS.md

The 2026-04-30 product reset made the planner consumer-first, local-first, and recommended-plan-first. Sprint 0 through Sprint 6 established the local-first app, React guided intake, and first React results workspace. The product direction is now the **Canadian retirement decision engine**: more Canada-specific, more explainable, and more decision-oriented than broad modelling labs like ProjectionLab.

Product direction doc: [`docs/canadian_retirement_decision_engine.md`](docs/canadian_retirement_decision_engine.md).

## Latest Package — S2428-S2447: Limited Tester Packet Payload Dry Run

**Status:** Complete 2026-06-08.

Goal: build a runtime-only dry-run payload from the limited synthetic tester packet contract. The readiness matrix now includes one dry-run payload item per synthetic example with candidate display rows, review prompt ids, readiness status, and runtime boundary metadata.

Non-scope: saved plan schema changes, unplanned engine output changes outside the runtime-only limited tester packet payload dry run, persisted optimizer output, printable report output changes, CSV output changes, `.plan.json` files, production UI promotion, final advice-like copy, tax-bracket instructions, exportable sequencing output, tester-facing UI implementation, or final annual instructions.

Package doc: [`docs/sprint_2428_2447_limited_tester_packet_payload_dry_run.md`](docs/sprint_2428_2447_limited_tester_packet_payload_dry_run.md).

### S2428-S2447 Completed Path

- **S2428-S2432 — Payload item batch.** Added runtime dry-run payload items with example id, example label, readiness status, candidate display rows, review prompt ids, and runtime boundary.
- **S2433-S2437 — Payload check batch.** Added dry-run rows for payload items, contract fields, review metadata, and output boundary.
- **S2438-S2442 — Example matrix batch.** Verified bundled and clean synthetic examples produce payload items with display rows and review metadata.
- **S2443-S2447 — Verification and closeout.** Ran focused optimizer tests, example readiness tests, plan-file tests, production build, file guards, and closed the package.

### S2428-S2447 Definition Of Done

- Dry-run payload includes one runtime item per synthetic example.
- Payload items use only contract-approved fields.
- Payload items include candidate display rows and review prompt ids.
- Payload rows cover payload items, contract fields, review metadata, and output boundary.
- Saved output, CSV output, report output, and production UI remain deferred.
- Saved plan schema remains unchanged.
- Runtime-only limited tester packet payload dry run is the scoped optimizer shape change for this package.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, plan-file tests, example readiness tests, and production build pass.

## Previous Package — S2408-S2427: Limited Synthetic Tester Packet Contract

**Status:** Complete 2026-06-08.

Goal: define the exact runtime contract a future limited synthetic tester packet may consume before any tester-facing implementation. The readiness matrix now includes allowed fields, excluded fields, calm tester prompts, contract rows, and runtime-only boundaries.

Non-scope: saved plan schema changes, unplanned engine output changes outside the runtime-only limited synthetic tester packet contract, persisted optimizer output, printable report output changes, CSV output changes, `.plan.json` files, production UI promotion, final advice-like copy, tax-bracket instructions, exportable sequencing output, or tester-facing UI implementation.

Package doc: [`docs/sprint_2408_2427_limited_synthetic_tester_packet_contract.md`](docs/sprint_2408_2427_limited_synthetic_tester_packet_contract.md).

### S2408-S2427 Completed Path

- **S2408-S2412 — Contract field batch.** Added allowed runtime fields for future tester packet consumption.
- **S2413-S2417 — Exclusion batch.** Added excluded fields and outputs for saved sequencing, CSV, reports, production UI, tax-bracket instructions, final annual instructions, personal data, and saved schema fields.
- **S2418-S2422 — Review prompt batch.** Added calm tester prompts for clarity, plausibility, missing context, and boundary understanding.
- **S2423-S2427 — Verification and closeout.** Ran focused optimizer tests, example readiness tests, plan-file tests, production build, file guards, and closed the package.

### S2408-S2427 Definition Of Done

- Contract lists allowed runtime fields for a future limited tester packet.
- Contract lists excluded fields and outputs.
- Review prompts stay scoped to made-up scenarios and feature testing.
- Contract rows cover allowed fields, excluded fields, copy boundary, and implementation boundary.
- Saved output, CSV output, report output, and production UI remain deferred.
- Saved plan schema remains unchanged.
- Runtime-only limited tester packet contract is the scoped optimizer shape change for this package.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, plan-file tests, example readiness tests, and production build pass.

## Previous Package — S2388-S2407: Synthetic Tester Packet Readiness Matrix

**Status:** Complete 2026-06-08.

Goal: add a runtime-only readiness matrix that decides whether synthetic examples are ready for limited tester packet review. The matrix now combines draft readiness, tester packet boundary status, export guard status, tester purpose, and output-boundary checks before any tester-facing implementation.

Non-scope: saved plan schema changes, unplanned engine output changes outside the runtime-only synthetic tester packet readiness matrix, persisted optimizer output, printable report output changes, CSV output changes, `.plan.json` files, production UI promotion, final advice-like copy, tax-bracket instructions, or exportable sequencing output.

Package doc: [`docs/sprint_2388_2407_synthetic_tester_packet_readiness_matrix.md`](docs/sprint_2388_2407_synthetic_tester_packet_readiness_matrix.md).

### S2388-S2407 Completed Path

- **S2388-S2392 — Readiness matrix shape batch.** Added runtime tester packet readiness matrix with ready, review-first, and blocked example buckets.
- **S2393-S2397 — Gate evidence batch.** Combined draft readiness, tester packet boundary, export guard, tester purpose, and output-boundary rows.
- **S2398-S2402 — Release-scope batch.** Added visible tester sections and hidden output scope for limited synthetic tester packet review.
- **S2403-S2407 — Verification and closeout.** Ran focused optimizer tests, example readiness tests, plan-file tests, production build, file guards, and closed the package.

### S2388-S2407 Definition Of Done

- Tester packet readiness matrix groups examples into ready, review-first, and blocked buckets.
- Matrix rows evaluate draft readiness, packet boundary, export guard, tester purpose, and output boundary.
- Release scope identifies visible runtime sections and hidden outputs.
- Readiness copy stays scoped to feature testing with made-up scenarios, not personal decisions.
- Saved output, CSV output, report output, and production UI remain deferred.
- Saved plan schema remains unchanged.
- Runtime-only tester packet readiness matrix is the scoped optimizer shape change for this package.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, plan-file tests, example readiness tests, and production build pass.

## Previous Package — S2368-S2387: Tester Packet Export Guard Review

**Status:** Complete 2026-06-08.

Goal: add a runtime-only tester packet export guard before tester-facing UI, saved sequencing output, CSV sequencing output, report output, or production UI. Experimental annual draft output now confirms tester packet content is blocked from saved plan files, CSV output, reports, production UI, final annual instructions, and tax-bracket instructions.

Non-scope: saved plan schema changes, unplanned engine output changes outside the runtime-only tester packet export guard, persisted optimizer output, printable report output changes, CSV output changes, `.plan.json` files, production UI promotion, final advice-like copy, tax-bracket instructions, or exportable sequencing output.

Package doc: [`docs/sprint_2368_2387_tester_packet_export_guard_review.md`](docs/sprint_2368_2387_tester_packet_export_guard_review.md).

### S2368-S2387 Completed Path

- **S2368-S2372 — Export guard shape batch.** Added runtime tester packet export guard rows for saved plan files, CSV output, reports, production UI, final annual instructions, and tax-bracket instructions.
- **S2373-S2377 — Forbidden saved-key batch.** Added explicit forbidden saved keys for tester packet boundary, tester packet export guard, annual instruction candidates, presentation readiness, experimental annual draft output, and annual account instructions.
- **S2378-S2382 — Saved boundary batch.** Strengthened saved-plan tests so nested tester packet boundary and export guard strings cannot appear in serialized saved files.
- **S2383-S2387 — Verification and closeout.** Ran focused optimizer tests, example readiness tests, plan-file tests, production build, file guards, and closed the package.

### S2368-S2387 Definition Of Done

- Tester packet export guard identifies blocked saved, CSV, report, production UI, final instruction, and tax-bracket outputs.
- Forbidden saved keys include tester packet boundary and tester packet export guard.
- Saved plan serialization excludes nested tester packet guard fields even if runtime output is accidentally attached before save.
- Tester packet copy remains for synthetic feature testing with made-up scenarios, not personal decisions.
- Saved output, CSV output, report output, and production UI remain deferred.
- Saved plan schema remains unchanged.
- Runtime-only tester packet export guard is the scoped optimizer shape change for this package.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, plan-file tests, example readiness tests, and production build pass.

## Previous Package — S2348-S2367: Synthetic Tester Packet Boundary Review

**Status:** Complete 2026-06-08.

Goal: define the runtime-only synthetic tester packet boundary before tester-facing UI, saved sequencing output, CSV sequencing output, report output, or production UI. Experimental annual draft output now identifies visible tester material, hidden material, tester-purpose copy, blocked outputs, and packet-boundary checks.

Non-scope: saved plan schema changes, unplanned engine output changes outside the runtime-only tester packet boundary, persisted optimizer output, printable report output changes, CSV output changes, `.plan.json` files, production UI promotion, final advice-like copy, tax-bracket instructions, or exportable sequencing output.

Package doc: [`docs/sprint_2348_2367_synthetic_tester_packet_boundary_review.md`](docs/sprint_2348_2367_synthetic_tester_packet_boundary_review.md).

### S2348-S2367 Completed Path

- **S2348-S2352 — Packet boundary shape batch.** Added runtime tester packet boundary with visible sections, hidden sections, rows, tester copy, and blocked outputs.
- **S2353-S2357 — Visibility batch.** Marked candidate display rows, quality labels, repair themes, and runtime boundary as visible tester material.
- **S2358-S2362 — Hidden-output batch.** Kept final annual instructions, saved sequencing, CSV sequencing, reports, production UI, and tax-bracket instructions hidden.
- **S2363-S2367 — Verification and closeout.** Ran focused optimizer tests, example readiness tests, plan-file tests, production build, file guards, and closed the package.

### S2348-S2367 Definition Of Done

- Tester packet boundary defines visible runtime sections.
- Tester packet boundary defines hidden/final output sections.
- Tester copy explains feature testing with made-up scenarios and not personal decisions.
- Blocked outputs include final annual instructions, saved sequencing, CSV sequencing, report output, production UI, and tax-bracket instructions.
- Saved output, CSV output, report output, and production UI remain deferred.
- Saved plan schema remains unchanged.
- Runtime-only tester packet boundary is the scoped optimizer shape change for this package.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, plan-file tests, example readiness tests, and production build pass.

## Previous Package — S2328-S2347: Annual Candidate Presentation Readiness

**Status:** Complete 2026-06-08.

Goal: prepare runtime-only annual candidate display/readiness fields for synthetic tester review before saved sequencing output, CSV sequencing output, report output, or production UI. Experimental annual draft output now includes display rows, status labels, quality labels, repair preview copy, and presentation readiness checks.

Non-scope: saved plan schema changes, unplanned engine output changes outside the runtime-only experimental draft presentation readiness packet, persisted optimizer output, printable report output changes, CSV output changes, `.plan.json` files, production UI promotion, final advice-like copy, tax-bracket instructions, or exportable sequencing output.

Package doc: [`docs/sprint_2328_2347_annual_candidate_presentation_readiness.md`](docs/sprint_2328_2347_annual_candidate_presentation_readiness.md).

### S2328-S2347 Completed Path

- **S2328-S2332 — Display row batch.** Added runtime candidate display rows with year labels, status labels, quality labels, repair preview copy, and total amount.
- **S2333-S2337 — Presentation check batch.** Added presentation readiness checks for candidate labels, quality labels, repair previews, and output boundary.
- **S2338-S2342 — Tester-boundary batch.** Added review-only summary, boundary, and next-step copy for synthetic tester presentation.
- **S2343-S2347 — Verification and closeout.** Ran focused optimizer tests, example readiness tests, plan-file tests, production build, file guards, and closed the package.

### S2328-S2347 Definition Of Done

- Presentation readiness includes candidate display rows.
- Display rows include status labels, quality labels, repair previews, and total amount.
- Presentation readiness checks labels, quality copy, repair previews, and output boundary.
- Presentation copy is suitable for synthetic tester review while remaining non-final.
- Saved output, CSV output, report output, and production UI remain deferred.
- Saved plan schema remains unchanged.
- Runtime-only experimental draft presentation readiness is the scoped optimizer shape change for this package.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, plan-file tests, example readiness tests, and production build pass.

## Previous Package — S2308-S2327: Annual Candidate Selection Summary

**Status:** Complete 2026-06-08.

Goal: add a runtime-only annual candidate selection summary before saved sequencing output, CSV sequencing output, report output, or production UI. Experimental annual draft output now identifies strongest candidate years, quality-count rollups, common repair themes, and next-step copy for synthetic tester review.

Non-scope: saved plan schema changes, unplanned engine output changes outside the runtime-only experimental draft candidate selection summary, persisted optimizer output, printable report output changes, CSV output changes, `.plan.json` files, production UI promotion, final advice-like copy, tax-bracket instructions, or exportable sequencing output.

Package doc: [`docs/sprint_2308_2327_annual_candidate_selection_summary.md`](docs/sprint_2308_2327_annual_candidate_selection_summary.md).

### S2308-S2327 Completed Path

- **S2308-S2312 — Selection rollup batch.** Added runtime candidate selection summary with strongest candidate years and quality-count rollups.
- **S2313-S2317 — Repair theme batch.** Added repair-theme rollups across annual candidates.
- **S2318-S2322 — Boundary batch.** Added summary, boundary, and next-step copy for review-only use.
- **S2323-S2327 — Verification and closeout.** Ran focused optimizer tests, example readiness tests, plan-file tests, production build, file guards, and closed the package.

### S2308-S2327 Definition Of Done

- Candidate selection summary identifies strongest candidate years by runtime quality score.
- Summary rolls up higher, medium, low, and blocked candidate counts.
- Summary rolls up repair themes and affected candidate years.
- Summary remains comparison/repair context, not final instructions.
- Saved output, CSV output, report output, and production UI remain deferred.
- Saved plan schema remains unchanged.
- Runtime-only experimental draft candidate selection summary is the scoped optimizer shape change for this package.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, plan-file tests, example readiness tests, and production build pass.

## Previous Package — S2288-S2307: Runtime Annual Candidate Quality Scoring

**Status:** Complete 2026-06-08.

Goal: add runtime-only quality scoring and repair targets to annual instruction candidates before saved sequencing output, CSV sequencing output, report output, or production UI. Annual instruction candidates now include quality levels, scores, quality rows, and repair targets for annual totals, account order, tax context, and output boundaries.

Non-scope: saved plan schema changes, unplanned engine output changes outside the runtime-only experimental draft candidate quality packet, persisted optimizer output, printable report output changes, CSV output changes, `.plan.json` files, production UI promotion, final advice-like copy, tax-bracket instructions, or exportable sequencing output.

Package doc: [`docs/sprint_2288_2307_runtime_annual_candidate_quality_scoring.md`](docs/sprint_2288_2307_runtime_annual_candidate_quality_scoring.md).

### S2288-S2307 Completed Path

- **S2288-S2292 — Quality score batch.** Added candidate quality level, score, and quality rows.
- **S2293-S2297 — Repair target batch.** Added repair targets for missing annual totals, account-order gaps, partial account order, and limited tax context.
- **S2298-S2302 — Example coverage batch.** Added focused optimizer and example readiness coverage for candidate quality.
- **S2303-S2307 — Verification and closeout.** Ran focused optimizer tests, example readiness tests, plan-file tests, production build, file guards, and closed the package.

### S2288-S2307 Definition Of Done

- Annual instruction candidates include runtime quality levels and scores.
- Candidate quality rows cover annual total, account order, tax context, and output boundary.
- Candidate repair targets identify account-order gaps, partial account order, limited tax context, and missing annual totals.
- Quality scoring remains runtime-only repair/comparison context.
- Saved output, CSV output, report output, and production UI remain deferred.
- Saved plan schema remains unchanged.
- Runtime-only experimental draft candidate quality is the scoped optimizer shape change for this package.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, plan-file tests, example readiness tests, and production build pass.

## Previous Package — S2268-S2287: Runtime Annual Instruction Candidate Shape

**Status:** Complete 2026-06-08.

Goal: prepare a runtime-only annual instruction candidate shape before saved sequencing output, CSV sequencing output, report output, or production UI. Experimental annual draft output now packages annual totals into reviewable per-year candidates with status, display order, review flags, summaries, and runtime-only boundaries.

Non-scope: saved plan schema changes, unplanned engine output changes outside the runtime-only experimental draft readiness packet, persisted optimizer output, printable report output changes, CSV output changes, `.plan.json` files, production UI promotion, final advice-like copy, tax-bracket instructions, or exportable sequencing output.

Package doc: [`docs/sprint_2268_2287_runtime_annual_instruction_candidate_shape.md`](docs/sprint_2268_2287_runtime_annual_instruction_candidate_shape.md).

### S2268-S2287 Completed Path

- **S2268-S2272 — Candidate shape batch.** Added runtime annual instruction candidates built from annual account totals.
- **S2273-S2277 — Candidate account batch.** Added candidate account display order and retained account-order position evidence.
- **S2278-S2282 — Review flag batch.** Added review flags for account-order gaps, partial order evidence, and limited tax context.
- **S2283-S2287 — Verification and closeout.** Ran focused optimizer tests, example readiness tests, plan-file tests, production build, file guards, and closed the package.

### S2268-S2287 Definition Of Done

- Runtime annual instruction candidates are available by modelled year.
- Candidates include status, total amount, account count, account display order, and review flags.
- Account-order gap evidence carries into candidate review flags.
- Candidate summaries remain modelled, review-oriented, and non-directive.
- Candidate boundaries explicitly block saved, CSV, report, production UI, and tax-bracket instruction output.
- Saved plan schema remains unchanged.
- Runtime-only experimental draft candidate shape is the scoped optimizer shape change for this package.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, plan-file tests, example readiness tests, and production build pass.

## Previous Package — S2248-S2267: Account Order Consistency Repair

**Status:** Complete 2026-06-08.

Goal: repair runtime account-order consistency evidence before saved sequencing output, CSV sequencing output, report output, or production UI. Annual account totals now distinguish active annual account order from skipped inactive draft-order positions and surface account-order gaps as review-first evidence.

Non-scope: saved plan schema changes, unplanned engine output changes outside the runtime-only experimental draft readiness packet, persisted optimizer output, printable report output changes, CSV output changes, `.plan.json` files, production UI promotion, final advice-like copy, tax-bracket instructions, or exportable sequencing output.

Package doc: [`docs/sprint_2248_2267_account_order_consistency_repair.md`](docs/sprint_2248_2267_account_order_consistency_repair.md).

### S2248-S2267 Completed Path

- **S2248-S2252 — Order evidence batch.** Added active, skipped, and partial order-position evidence to annual account totals.
- **S2253-S2257 — Gap detection batch.** Added contiguous, gapped, and partial annual account-order status.
- **S2258-S2262 — Readiness repair batch.** Added account-order gap readiness row and review-first handling for skipped inactive positions.
- **S2263-S2267 — Verification and closeout.** Ran focused optimizer tests, example readiness tests, plan-file tests, production build, file guards, and closed the package.

### S2248-S2267 Definition Of Done

- Annual account totals expose active draft-order positions.
- Annual account totals expose skipped inactive draft-order positions.
- Annual account totals distinguish contiguous, gapped, and partial account-order evidence.
- Instruction readiness includes a dedicated account-order gap row.
- Account-order gaps produce review-first evidence without creating final instructions.
- Saved output, CSV output, report output, and production UI remain deferred.
- Saved plan schema remains unchanged.
- Runtime-only experimental draft readiness is the scoped optimizer shape change for this package.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, plan-file tests, example readiness tests, and production build pass.

## Previous Package — S2228-S2247: Annual Account Instruction Readiness

**Status:** Complete 2026-06-08.

Goal: prepare runtime annual account instruction readiness before saved sequencing output, CSV sequencing output, report output, or production UI. Experimental annual draft output now includes per-year account totals and an instruction-readiness packet with account-order consistency, tax-context, and blocked-output guards.

Non-scope: saved plan schema changes, unplanned engine output changes outside the runtime-only experimental draft readiness packet, persisted optimizer output, printable report output changes, CSV output changes, `.plan.json` files, production UI promotion, final advice-like copy, tax-bracket instructions, or exportable sequencing output.

Package doc: [`docs/sprint_2228_2247_annual_account_instruction_readiness.md`](docs/sprint_2228_2247_annual_account_instruction_readiness.md).

### S2228-S2247 Completed Path

- **S2228-S2232 — Annual totals batch.** Added runtime per-year account totals from experimental draft rows.
- **S2233-S2237 — Consistency batch.** Added account-order consistency, tax-context, and output-boundary readiness checks.
- **S2238-S2242 — Guard batch.** Added explicit annual account instruction, saved output, CSV output, report output, production UI, and tax-bracket blocked-output guards.
- **S2243-S2247 — Verification and closeout.** Ran focused optimizer tests, example readiness tests, plan-file tests, production build, file guards, and closed the package.

### S2228-S2247 Definition Of Done

- Runtime annual account totals are available by modelled year.
- Annual totals include account count, account amounts, account-order positions, annual tax, after-tax spending, and OAS recovery context.
- Instruction-readiness rows cover annual totals, account-order consistency, tax context, and output boundary.
- Annual account instructions remain blocked as saved/exported/final output.
- Saved output, CSV output, report output, and production UI remain deferred.
- Saved plan schema remains unchanged.
- Runtime-only experimental draft readiness is the scoped optimizer shape change for this package.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, plan-file tests, example readiness tests, and production build pass.

## Previous Package — S2208-S2227: Annual Draft Row Quality And Rationale

**Status:** Complete 2026-06-08.

Goal: improve runtime annual draft row quality before saved sequencing output, CSV sequencing output, report output, or production UI. Experimental annual draft rows now include source-field evidence, year-level grouping, account-order position, and clearer account-level rationale for synthetic tester review.

Non-scope: saved plan schema changes, unplanned engine output changes outside the runtime-only experimental draft rows, persisted optimizer output, printable report output changes, CSV output changes, `.plan.json` files, production UI promotion, final advice-like copy, tax-bracket instructions, or exportable sequencing output.

Package doc: [`docs/sprint_2208_2227_annual_draft_row_quality_rationale.md`](docs/sprint_2208_2227_annual_draft_row_quality_rationale.md).

### S2208-S2227 Completed Path

- **S2208-S2212 — Source evidence batch.** Added selected-candidate withdrawal source fields and source labels to experimental annual draft rows.
- **S2213-S2217 — Grouping batch.** Added year-level grouping, row index, year withdrawal count, and account-order position to runtime draft rows.
- **S2218-S2222 — Rationale batch.** Replaced generic draft rationale with account-specific modelled-source and tax-context rationale.
- **S2223-S2227 — Verification and closeout.** Ran focused optimizer tests, example readiness tests, plan-file tests, production build, file guards, and closed the package.

### S2208-S2227 Definition Of Done

- Annual draft rows expose runtime source-field evidence.
- Annual draft rows expose grouping within each modelled year.
- Annual draft rows expose account-order position when available.
- Annual draft rationale is account-specific and modelled-source based.
- Rationale remains calm, consumer-facing, and non-directive.
- Saved output, CSV output, report output, and production UI remain deferred.
- Saved plan schema remains unchanged.
- Runtime-only experimental draft row evidence is the scoped optimizer shape change for this package.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, plan-file tests, example readiness tests, and production build pass.

## Previous Package — S2188-S2207: Clean Example Draft Repair

**Status:** Complete 2026-06-08.

Goal: improve clean-example annual draft readiness without changing clean reset files, saved schema, engine output schema, CSV output, report output, or production UI. Clean synthetic examples now receive runtime-only planning seeds so the experimental optimizer can test annual draft rows against plausible account, benefit, mortgage, estate, and survivor evidence.

Non-scope: saved plan schema changes, engine output schema changes, persisted optimizer output, printable report output changes, CSV output changes, `.plan.json` files, production UI promotion, final advice-like copy, tax-bracket instructions, or exportable sequencing output.

Package doc: [`docs/sprint_2188_2207_clean_example_draft_repair.md`](docs/sprint_2188_2207_clean_example_draft_repair.md).

### S2188-S2207 Completed Path

- **S2188-S2192 — Clean runtime seed batch.** Added runtime-only planning evidence for clean examples while preserving clean file payloads.
- **S2193-S2197 — Scenario constraint batch.** Added scenario-specific mortgage, survivor, estate, account, and benefit evidence for synthetic clean examples.
- **S2198-S2202 — Matrix readiness batch.** Added coverage proving clean examples now produce annual draft rows and non-blocked confidence.
- **S2203-S2207 — Verification and closeout.** Ran focused clean-example tests, matrix tests, optimizer tests, production build, file guards, and closed the package.

### S2188-S2207 Definition Of Done

- Clean example plan files remain clean reset files.
- Clean example runtime plans include synthetic planning seeds for optimizer testing.
- Each clean example can produce at least three experimental annual draft rows.
- Clean example draft confidence is not blocked.
- Runtime seeds remain synthetic-tester-only and do not create saved sequencing output.
- Saved output, CSV output, report output, and production UI remain deferred.
- Saved plan schema and engine output schema remain unchanged.
- No `.plan.json` files are created or persisted.
- Focused clean-example tests, optimizer tests, plan-file tests, matrix tests, and production build pass.

## Previous Package — S2168-S2187: Experimental Draft Repair Implementation

**Status:** Complete 2026-06-08.

Goal: use repair-target signals to improve experimental draft quality before UI, CSV, saved output, or report output. The draft now scans a wider ten-year modelled window and each matrix repair target includes a concrete runtime repair action.

Non-scope: saved plan schema changes, engine output schema changes, persisted optimizer output, printable report output changes, CSV output changes, `.plan.json` files, production UI promotion, final advice-like copy, tax-bracket instructions, or exportable sequencing output.

Package doc: [`docs/sprint_2168_2187_experimental_draft_repair_implementation.md`](docs/sprint_2168_2187_experimental_draft_repair_implementation.md).

### S2168-S2187 Completed Path

- **S2168-S2172 — Coverage repair batch.** Expanded draft scanning to the first ten modelled years while preserving selected-candidate annual-row derivation.
- **S2173-S2177 — Repair action batch.** Added repair actions for row coverage, blockers, watch items, tax context, and confidence.
- **S2178-S2182 — Example coverage batch.** Updated focused selector, bundled-example, and clean-example matrix coverage.
- **S2183-S2187 — Verification and closeout.** Ran focused optimizer tests, plan-file tests, example matrix tests, production build, file guards, and closed the package.

### S2168-S2187 Definition Of Done

- Experimental annual draft scans a wider modelled draft window.
- Matrix repair targets include concrete repair actions.
- Row coverage, blocker, watch-item, tax-context, and confidence targets remain visible.
- Repair implementation remains runtime-only and synthetic-tester-only.
- Saved output, CSV output, report output, and production UI remain deferred.
- Saved plan schema and engine output schema remain unchanged.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, plan-file tests, example matrix tests, and production build pass.

## Previous Package — S2148-S2167: Experimental Draft Readiness Repair Targeting

**Status:** Complete 2026-06-08.

Goal: use experimental draft example matrix scoring to identify common repair themes before UI, CSV, saved output, or report output. The matrix now exposes repair targets for low row coverage, blockers, watch items, tax context, and low confidence while preserving example ids for targeted improvement.

Non-scope: saved plan schema changes, engine output schema changes, persisted optimizer output, printable report output changes, CSV output changes, `.plan.json` files, production UI promotion, final advice-like copy, tax-bracket instructions, or exportable sequencing output.

Package doc: [`docs/sprint_2148_2167_experimental_draft_readiness_repair_targeting.md`](docs/sprint_2148_2167_experimental_draft_readiness_repair_targeting.md).

### S2148-S2167 Completed Path

- **S2148-S2152 — Repair target shape batch.** Added repair targets to the example matrix for row coverage, blockers, and watch items.
- **S2153-S2157 — Repair theme batch.** Added tax context and confidence repair targets with per-example ids.
- **S2158-S2162 — Example coverage batch.** Added focused selector tests plus bundled and clean example repair target assertions.
- **S2163-S2167 — Verification and closeout.** Ran focused optimizer tests, plan-file tests, example matrix tests, production build, file guards, and closed the package.

### S2148-S2167 Definition Of Done

- Experimental draft example matrix includes repair targets.
- Repair targets cover row coverage, blockers, watch items, tax context, and confidence.
- Repair targets preserve affected example ids.
- Repair targeting remains runtime-only and synthetic-tester-only.
- Saved output, CSV output, report output, and production UI remain deferred.
- Saved plan schema and engine output schema remain unchanged.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, plan-file tests, example matrix tests, and production build pass.

## Previous Package — S2128-S2147: Experimental Draft Example Matrix Scoring

**Status:** Complete 2026-06-08.

Goal: aggregate experimental draft readiness across bundled and clean synthetic examples. The optimizer now provides runtime-only matrix scoring that identifies ready, review-first, and blocked draft examples with confidence, row coverage, blocker, watch, and review-item detail.

Non-scope: saved plan schema changes, engine output schema changes, persisted optimizer output, printable report output changes, CSV output changes, `.plan.json` files, production UI promotion, final advice-like copy, tax-bracket instructions, or exportable sequencing output.

Package doc: [`docs/sprint_2128_2147_experimental_draft_example_matrix_scoring.md`](docs/sprint_2128_2147_experimental_draft_example_matrix_scoring.md).

### S2128-S2147 Completed Path

- **S2128-S2132 — Matrix shape batch.** Added matrix item and summary types with status counts, row coverage, and review item fields.
- **S2133-S2137 — Aggregation batch.** Aggregated readiness statuses, confidence levels, blockers, watch counts, and review items.
- **S2138-S2142 — Example coverage batch.** Added focused selector tests plus bundled and clean example matrix coverage.
- **S2143-S2147 — Verification and closeout.** Ran focused optimizer tests, plan-file tests, example matrix tests, production build, file guards, and closed the package.

### S2128-S2147 Definition Of Done

- Experimental draft example matrix selector exists.
- Matrix reports ready, review-first, and blocked counts.
- Matrix preserves per-example confidence, row coverage, blockers, watch counts, and review items.
- Matrix covers bundled and clean examples.
- Matrix remains runtime-only and synthetic-tester-only.
- Saved output, CSV output, report output, and production UI remain deferred.
- Saved plan schema and engine output schema remain unchanged.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, plan-file tests, example matrix tests, and production build pass.

## Previous Package — S2108-S2127: Experimental Draft Readiness Summary

**Status:** Complete 2026-06-08.

Goal: summarize the runtime experimental annual draft into one readiness packet before UI, CSV, saved output, or report output. The draft now rolls up confidence, blockers, harm checks, watch items, tax context, and row coverage into a clear ready/review/blocked status while preserving synthetic-tester-only scope.

Non-scope: saved plan schema changes, engine output schema changes, persisted optimizer output, printable report output changes, CSV output changes, `.plan.json` files, production UI promotion, final advice-like copy, tax-bracket instructions, or exportable sequencing output.

Package doc: [`docs/sprint_2108_2127_experimental_draft_readiness_summary.md`](docs/sprint_2108_2127_experimental_draft_readiness_summary.md).

### S2108-S2127 Completed Path

- **S2108-S2112 — Readiness shape batch.** Added readiness summary type, status mapping, row coverage, confidence, and blocker fields.
- **S2113-S2117 — Review item batch.** Rolled up blockers and watch items from confidence and harm checks.
- **S2118-S2122 — Boundary batch.** Added tax context readiness, runtime-only boundary, tester-review next step, and deferred output posture.
- **S2123-S2127 — Verification and closeout.** Ran focused optimizer tests, plan-file tests, example capacity matrix tests, production build, file guards, and closed the package.

### S2108-S2127 Definition Of Done

- Experimental annual draft includes readiness summary.
- Readiness summary reports ready, review-first, or blocked.
- Readiness summary includes row coverage, confidence level, blocker count, watch count, tax context status, and review items.
- Readiness summary remains runtime-only and synthetic-tester-only.
- Saved output, CSV output, report output, and production UI remain deferred.
- Saved plan schema and engine output schema remain unchanged.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, plan-file tests, example capacity matrix tests, and production build pass.

## Previous Package — S2088-S2107: Experimental Draft Stress And Harm Checks

**Status:** Complete 2026-06-08.

Goal: add runtime stress and harm checks around experimental annual draft rows before UI, CSV, saved output, or report output. The draft now flags projected shortfall, estate pressure, survivor review, OAS recovery, tax context availability, and output boundary posture while preserving synthetic-tester-only scope.

Non-scope: saved plan schema changes, engine output schema changes, persisted optimizer output, printable report output changes, CSV output changes, `.plan.json` files, production UI promotion, final advice-like copy, tax-bracket instructions, or exportable sequencing output.

Package doc: [`docs/sprint_2088_2107_experimental_draft_stress_harm_checks.md`](docs/sprint_2088_2107_experimental_draft_stress_harm_checks.md).

### S2088-S2107 Completed Path

- **S2088-S2092 — Harm check shape batch.** Added harm check type, draft output field, shortfall check, and output boundary check.
- **S2093-S2097 — Constraint and tax watch batch.** Added estate pressure, survivor review, OAS recovery, and tax context availability checks.
- **S2098-S2102 — Example matrix batch.** Added focused optimizer, bundled-example, and clean-example harm check assertions.
- **S2103-S2107 — Verification and closeout.** Ran focused optimizer tests, plan-file tests, example capacity matrix tests, production build, file guards, and closed the package.

### S2088-S2107 Definition Of Done

- Experimental annual draft includes harm check rows.
- Harm checks cover projected shortfall, estate pressure, survivor review, OAS recovery, tax context availability, and output boundary.
- Harm checks remain runtime-only and synthetic-tester-only.
- Saved output, CSV output, report output, and production UI remain deferred.
- Saved plan schema and engine output schema remain unchanged.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, plan-file tests, example capacity matrix tests, and production build pass.

## Previous Package — S2068-S2087: Experimental Draft Confidence Scoring

**Status:** Complete 2026-06-08.

Goal: add runtime-only confidence scoring to experimental annual draft rows before any UI, CSV, saved output, or report output. The draft now scores row coverage, tax context, account-order source, constraint hooks, survivor review, and output boundaries while collecting blockers and preserving synthetic-tester-only scope.

Non-scope: saved plan schema changes, engine output schema changes, persisted optimizer output, printable report output changes, CSV output changes, `.plan.json` files, production UI promotion, final advice-like copy, tax-bracket instructions, or exportable sequencing output.

Package doc: [`docs/sprint_2068_2087_experimental_draft_confidence_scoring.md`](docs/sprint_2068_2087_experimental_draft_confidence_scoring.md).

### S2068-S2087 Completed Path

- **S2068-S2072 — Confidence shape batch.** Added confidence level, row, and summary types to the experimental annual draft.
- **S2073-S2077 — Quality signal batch.** Scored draft row coverage, tax context, account-order source, constraint hooks, and survivor review.
- **S2078-S2082 — Boundary and blocker batch.** Added output-boundary row, blocker collection, score, and level mapping.
- **S2083-S2087 — Verification and closeout.** Ran focused optimizer tests, plan-file tests, example capacity matrix tests, production build, file guards, and closed the package.

### S2068-S2087 Definition Of Done

- Experimental annual draft includes confidence level.
- Experimental annual draft includes numeric confidence score.
- Confidence rows cover draft rows, tax context, account order, constraints, survivor review, and output boundary.
- Blockers are collected when required evidence is missing.
- Confidence remains runtime-only and synthetic-tester-only.
- Saved output, CSV output, report output, and production UI remain deferred.
- Saved plan schema and engine output schema remain unchanged.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, plan-file tests, example capacity matrix tests, and production build pass.

## Previous Package — S2048-S2067: Experimental Draft Tax Context Hardening

**Status:** Complete 2026-06-08.

Goal: improve runtime-only experimental annual draft rows with clearer tax context for synthetic tester scenarios. Draft rows now include after-tax spending, approximate effective tax rate, OAS recovery status, and draft-level tax context rows while tax-bracket instructions, saved output, CSV output, report output, and production UI remain deferred.

Non-scope: saved plan schema changes, engine output schema changes, persisted optimizer output, printable report output changes, CSV output changes, `.plan.json` files, production UI promotion, final advice-like copy, tax-bracket instructions, or exportable sequencing output.

Package doc: [`docs/sprint_2048_2067_experimental_draft_tax_context_hardening.md`](docs/sprint_2048_2067_experimental_draft_tax_context_hardening.md).

### S2048-S2067 Completed Path

- **S2048-S2052 — Row tax context batch.** Added after-tax spending, effective tax rate, OAS recovery status, and clearer draft row rationale.
- **S2053-S2057 — Draft summary tax context batch.** Added tax range, OAS recovery, after-tax spending, and effective-rate context rows.
- **S2058-S2062 — Boundary batch.** Added tax boundary row and copy guards against tax-bracket instruction language.
- **S2063-S2067 — Verification and closeout.** Ran focused optimizer tests, plan-file tests, example capacity matrix tests, production build, file guards, and closed the package.

### S2048-S2067 Definition Of Done

- Experimental annual draft rows include after-tax spending context.
- Experimental annual draft rows include approximate effective tax rate context.
- Experimental annual draft rows include OAS recovery status.
- Draft-level tax context rows explain tax range, OAS recovery, after-tax spending, and effective tax rate.
- Tax-bracket instructions remain blocked.
- Saved output, CSV output, report output, and production UI remain deferred.
- Saved plan schema and engine output schema remain unchanged.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, plan-file tests, example capacity matrix tests, and production build pass.

## Previous Package — S2028-S2047: Experimental Annual Instruction Draft Rows

**Status:** Complete 2026-06-08.

Goal: produce runtime-only experimental annual account draft rows for synthetic tester scenarios. The bounded optimizer now emits experimental draft rows that mirror selected-candidate annual withdrawal fields and include compact tax context while saved output, CSV output, report output, production UI, and tax-bracket instructions remain deferred.

Non-scope: saved plan schema changes, engine output schema changes, persisted optimizer output, printable report output changes, CSV output changes, `.plan.json` files, production UI promotion, final advice-like copy, tax-bracket instructions, or exportable sequencing output.

Package doc: [`docs/sprint_2028_2047_experimental_annual_instruction_draft_rows.md`](docs/sprint_2028_2047_experimental_annual_instruction_draft_rows.md).

### S2028-S2047 Completed Path

- **S2028-S2032 — Draft row shape batch.** Added annual instruction draft types, synthetic tester marker, and compact tax context fields.
- **S2033-S2037 — Selected candidate mapping batch.** Mapped selected-candidate annual withdrawal fields into draft rows sorted by experimental account order.
- **S2038-S2042 — Boundary batch.** Blocked saved instruction output, CSV instruction output, report instruction output, production UI, and tax-bracket instructions.
- **S2043-S2047 — Verification and closeout.** Ran focused optimizer tests, plan-file tests, example capacity matrix tests, production build, file guards, and closed the package.

### S2028-S2047 Definition Of Done

- Experimental annual instruction draft is available in runtime bounded optimizer output.
- Draft rows are marked synthetic-tester-only.
- Draft rows mirror modelled annual withdrawal fields rather than a new sequencing engine.
- Draft rows include compact tax context.
- Saved output, CSV output, report output, and production UI remain deferred.
- Tax-bracket instructions remain blocked.
- Saved plan schema and engine output schema remain unchanged.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, plan-file tests, example capacity matrix tests, and production build pass.

## Previous Package — S2008-S2027: Experimental Account Order Draft

**Status:** Complete 2026-06-08.

Goal: produce a runtime-only experimental account-order draft for synthetic tester scenarios. The bounded optimizer now emits account-order draft metadata derived from the selected modelled candidate and available account balance fields while annual dollar rows, saved output, CSV output, report output, production UI, and tax-bracket instructions stay deferred.

Non-scope: saved plan schema changes, engine output schema changes, persisted optimizer output, printable report output changes, CSV output changes, `.plan.json` files, production UI promotion, annual dollar instructions, tax-bracket instructions, or exportable account order.

Package doc: [`docs/sprint_2008_2027_experimental_account_order_draft.md`](docs/sprint_2008_2027_experimental_account_order_draft.md).

### S2008-S2027 Completed Path

- **S2008-S2012 — Draft shape batch.** Added experimental account bucket, row, and summary types with a synthetic tester audience marker.
- **S2013-S2017 — Candidate mapping batch.** Derived draft order from registered-first, non-registered-first, or neutral selected-candidate context.
- **S2018-S2022 — Boundary batch.** Blocked annual dollar instructions, saved account order, CSV account order, report account order, and tax-bracket instructions.
- **S2023-S2027 — Verification and closeout.** Ran focused optimizer tests, plan-file tests, example capacity matrix tests, production build, file guards, and closed the package.

### S2008-S2027 Definition Of Done

- Experimental account-order draft is available in runtime bounded optimizer output.
- Draft order is synthetic-tester-only.
- Draft order derives from selected modelled candidate context.
- Annual dollar instructions remain deferred in this package.
- Saved account order, CSV account order, report account order, production UI, and tax-bracket instructions remain blocked.
- Saved plan schema and engine output schema remain unchanged.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, plan-file tests, example capacity matrix tests, and production build pass.

## Previous Package — S1988-S2007: Annual Sequencing Runtime Input Adapter

**Status:** Complete 2026-06-08.

Goal: gather runtime-only annual sequencing inputs for later tester-only modelled plan drafts. The bounded optimizer now emits an annual sequencing input adapter with selected-candidate context, year range, available account balance fields, available tax fields, and constraint hooks while still blocking account order, annual account instructions, tax-bracket instructions, saved sequencing output, CSV sequencing output, report output, and production UI.

Non-scope: saved plan schema changes, engine output schema changes, persisted optimizer output, printable report output changes, CSV output changes, `.plan.json` files, production UI promotion, account-order output, annual account-level withdrawal instructions, tax-bracket instructions, Monte Carlo-in-loop optimization, or final advice-like copy.

Package doc: [`docs/sprint_1988_2007_annual_sequencing_runtime_input_adapter.md`](docs/sprint_1988_2007_annual_sequencing_runtime_input_adapter.md).

### S1988-S2007 Completed Path

- **S1988-S1992 — Adapter shape batch.** Added annual sequencing input adapter types, selector, selected-candidate context, year range, account balance fields, and tax fields.
- **S1993-S1997 — Constraint hook batch.** Added capacity objective, minimum floor, estate, survivor review, and benefit timing comparison hooks as context only.
- **S1998-S2002 — Save and example boundary batch.** Added export guard, save stripping, bundled-example, and clean-example runtime-only coverage.
- **S2003-S2007 — Verification and closeout.** Ran focused optimizer tests, plan-file tests, example capacity matrix tests, production build, file guards, and closed the package.

### S1988-S2007 Definition Of Done

- Annual sequencing input adapter is available in runtime bounded optimizer output.
- Adapter identifies selected modelled candidate and annual row range.
- Adapter identifies available account balance and tax context fields.
- Adapter carries capacity, estate, survivor, floor, and benefit timing context only.
- Account-order output remains blocked.
- Annual account instructions remain blocked.
- Saved sequencing output and CSV sequencing output remain blocked.
- Saved plan schema and engine output schema remain unchanged.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, plan-file tests, example capacity matrix tests, and production build pass.

## Previous Package — S1968-S1987: Annual Account Sequencing Prep Contract

**Status:** Complete 2026-06-08.

Goal: define the runtime-only input contract for a future annual account-level withdrawal sequencing adapter. The bounded optimizer now emits sequencing-prep metadata that lists required future inputs and blocked outputs while keeping account instructions, account order, tax-bracket instructions, saved sequencing output, CSV sequencing output, report output changes, and production UI out of scope.

Non-scope: saved plan schema changes, engine output schema changes, persisted optimizer output, printable report output changes, CSV output changes, `.plan.json` files, production UI promotion, annual account-level withdrawal instructions, account-order output, tax-bracket instructions, Monte Carlo-in-loop optimization, or advice-like copy.

Package doc: [`docs/sprint_1968_1987_annual_account_sequencing_prep_contract.md`](docs/sprint_1968_1987_annual_account_sequencing_prep_contract.md).

### S1968-S1987 Completed Path

- **S1968-S1972 — Contract shape batch.** Added annual sequencing prep types, input requirements, blocked outputs, selector, and bounded optimizer summary output.
- **S1973-S1977 — Guardrail batch.** Blocked account instructions, account order, tax-bracket instructions, saved sequencing output, and CSV sequencing output.
- **S1978-S1982 — Example matrix batch.** Added bundled and clean-example coverage proving sequencing prep remains runtime-only and unsaved.
- **S1983-S1987 — Verification and closeout.** Ran focused optimizer tests, plan-file tests, example capacity matrix tests, production build, file guards, and closed the package.

### S1968-S1987 Definition Of Done

- Annual sequencing prep contract is available in runtime bounded optimizer output.
- Contract lists future sequencing inputs without producing annual rows.
- Account instructions remain blocked.
- Account-order output remains blocked.
- Tax-bracket instructions remain blocked.
- Saved sequencing output and CSV sequencing output remain blocked.
- Saved plan schema and engine output schema remain unchanged.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, plan-file tests, example capacity matrix tests, and production build pass.

## Previous Package — S1948-S1967: Capacity Objective Example Matrix Hardening

**Status:** Complete 2026-06-08.

Goal: harden capacity objective expectations across bundled examples and fresh clean-example runtime adapters. The example optimizer readiness matrix now proves capacity objective, report readiness, and export guard metadata are runtime-only, and accidental runtime-enriched examples are stripped before editable save output.

Non-scope: saved plan schema changes, engine output schema changes, persisted optimizer output, printable report output changes, CSV output changes, `.plan.json` files, production UI promotion, account-level annual withdrawal instructions, tax-bracket instructions, Monte Carlo-in-loop optimization, or advice-like copy.

Package doc: [`docs/sprint_1948_1967_capacity_objective_example_matrix_hardening.md`](docs/sprint_1948_1967_capacity_objective_example_matrix_hardening.md).

### S1948-S1967 Completed Path

- **S1948-S1952 — Example matrix shape batch.** Added bundled-example capacity objective, report readiness, and export guard expectations to the existing optimizer readiness matrix.
- **S1953-S1957 — Save boundary batch.** Added accidental runtime-enriched save checks proving capacity packets, optimizer output, and annual account instructions are stripped.
- **S1958-S1962 — Clean example runtime batch.** Ran fresh clean examples through runtime capacity objective, report readiness, export guard, and save stripping expectations.
- **S1963-S1967 — Verification and closeout.** Ran focused matrix tests, full matrix tests, production build, file guards, and closed the package.

### S1948-S1967 Definition Of Done

- Bundled examples expose runtime capacity objective metadata.
- Fresh clean examples expose runtime capacity objective metadata after runtime adaptation.
- Runtime capacity packets stay out of editable plan files across examples.
- Report output remains unchanged.
- CSV output remains unchanged.
- Annual sequencing remains deferred.
- Saved plan schema and engine output schema remain unchanged.
- No `.plan.json` files are created or persisted.
- Focused matrix tests, full example optimizer readiness tests, and production build pass.

## Previous Package — S1928-S1947: Capacity Objective Export Guardrails

**Status:** Complete 2026-06-08.

Goal: add export/save boundary checks around capacity objective runtime packets. The bounded optimizer now emits runtime export-guard metadata, and the plan-file adapter test proves runtime capacity packets are stripped from editable saved plan files.

Non-scope: saved plan schema changes, engine output schema changes, persisted optimizer output, printable report output changes, CSV output changes, `.plan.json` files, account-level annual withdrawal instructions, tax-bracket instructions, Monte Carlo-in-loop optimization, or advice-like copy.

Package doc: [`docs/sprint_1928_1947_capacity_objective_export_guardrails.md`](docs/sprint_1928_1947_capacity_objective_export_guardrails.md).

### S1928-S1947 Completed Path

- **S1928-S1932 — Export guard shape batch.** Added runtime export guard type, rows, forbidden saved keys, selector, and summary output.
- **S1933-S1937 — Save boundary batch.** Added tests proving capacity objective, report readiness, bounded optimizer output, optimizer output, and annual account instructions do not save.
- **S1938-S1942 — Export boundary batch.** Kept printable report output, CSV output, saved schema, and engine output schema unchanged.
- **S1943-S1947 — Verification and closeout.** Ran focused optimizer tests, plan-file tests, production build, file guards, and closed the package.

### S1928-S1947 Definition Of Done

- Capacity export guard is available in runtime bounded optimizer output.
- Runtime capacity packets stay out of editable plan files.
- Report output remains unchanged.
- CSV output remains unchanged.
- Annual sequencing remains deferred.
- Saved plan schema and engine output schema remain unchanged.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests, plan-file tests, and production build pass.

## Previous Package — S1908-S1927: Capacity Objective Report Readiness

**Status:** Complete 2026-06-08.

Goal: prepare capacity objective evidence for a later printable/report path without changing current printable report output. The bounded optimizer now emits runtime-only report-readiness metadata that identifies reusable capacity fields, defers tax context to annual result rows, and blocks saved output and account instructions.

Non-scope: printable report output changes, production UI promotion, saved plan schema changes, engine output schema changes, persisted optimizer output, `.plan.json` files, account-level annual withdrawal instructions, tax-bracket instructions, Monte Carlo-in-loop optimization, or advice-like copy.

Package doc: [`docs/sprint_1908_1927_capacity_objective_report_readiness.md`](docs/sprint_1908_1927_capacity_objective_report_readiness.md).

### S1908-S1927 Completed Path

- **S1908-S1912 — Report readiness shape batch.** Added runtime report-readiness type, rows, field list, selector, and summary output.
- **S1913-S1917 — Boundary batch.** Deferred tax context, saved output, account instructions, and annual sequencing.
- **S1918-S1922 — Test batch.** Added ready, blocked, field-list, and bounded-summary tests.
- **S1923-S1927 — Verification and closeout.** Ran focused optimizer tests, production build, file guards, and closed the package.

### S1908-S1927 Definition Of Done

- Capacity report readiness is available in runtime bounded optimizer output.
- Current printable report output is unchanged.
- Tax detail remains sourced from annual result rows later.
- Saved output remains deferred.
- Account instructions remain deferred.
- Annual sequencing remains deferred.
- Saved plan schema and engine output schema remain unchanged.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests and production build pass.

## Previous Package — S1888-S1907: Capacity Objective Selector Hardening

**Status:** Complete 2026-06-08.

Goal: normalize capacity-objective selector logic for reuse outside the React panel while keeping output runtime-only. The bounded optimizer now builds capacity objective output through exported selectors with focused tests for status mapping, floor handling, survivor review, annual sequencing deferral, and copy-safe boundaries.

Non-scope: production UI promotion, saved plan schema changes, engine output schema changes, persisted optimizer output, `.plan.json` files, account-level annual withdrawal instructions, tax-bracket instructions, Monte Carlo-in-loop optimization, or advice-like copy.

Package doc: [`docs/sprint_1888_1907_capacity_objective_selector_hardening.md`](docs/sprint_1888_1907_capacity_objective_selector_hardening.md).

### S1888-S1907 Completed Path

- **S1888-S1892 — Selector extraction batch.** Exported capacity objective types and selector helpers, then rewired bounded optimizer output through them.
- **S1893-S1897 — Status mapping batch.** Added deterministic covered, tight, gap, and cannot-tell status tests.
- **S1898-S1902 — Copy safety batch.** Added runtime-only, survivor review, annual sequencing deferral, and prohibited wording coverage.
- **S1903-S1907 — Verification and closeout.** Ran focused optimizer tests, production build, file guards, and closed the package.

### S1888-S1907 Definition Of Done

- Capacity objective status mapping is reusable outside the React panel.
- Minimum expense floor normalization is exported.
- Full capacity objective row generation is exported.
- Bounded optimizer still emits the same runtime `capacityObjective` shape.
- Annual sequencing remains deferred.
- Optimizer output remains runtime-only.
- Saved plan schema and engine output schema remain unchanged.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests and production build pass.

## Previous Package — S1868-S1887: Capacity Objective Evidence Surface And Guardrails

**Status:** Complete 2026-06-08.

Goal: surface the runtime-only capacity objective evidence in Details without promoting production Overview UI. The compact Details optimizer card now shows monthly capacity, expense floor, and optional room, while full constraint evidence stays behind the option research gate.

Non-scope: production Overview UI, saved plan schema changes, engine output schema changes, persisted optimizer output, `.plan.json` files, account-level annual withdrawal instructions, tax-bracket instructions, Monte Carlo-in-loop optimization, or advice-like copy.

Package doc: [`docs/sprint_1868_1887_capacity_objective_evidence_surface_and_guardrails.md`](docs/sprint_1868_1887_capacity_objective_evidence_surface_and_guardrails.md).

### S1868-S1887 Completed Path

- **S1868-S1872 — Compact evidence batch.** Added monthly capacity, expense floor, optional room, and floor-first language to the compact Details optimizer card.
- **S1873-S1877 — Research surface batch.** Added full capacity constraint rows inside the gated optimizer research panel.
- **S1878-S1882 — Copy guard batch.** Preserved review language and blocked spending instructions, account instructions, production promotion, and annual sequencing.
- **S1883-S1887 — Verification and closeout.** Updated structure guards, ran focused tests, ran production build, and closed the package.

### S1868-S1887 Definition Of Done

- Compact capacity evidence appears in Details optimizer review.
- Full capacity constraint evidence remains gated behind option research.
- Overview remains free of optimizer capacity constraint evidence.
- Minimum floor appears before optional room.
- Annual sequencing remains deferred.
- Optimizer output remains runtime-only.
- Saved plan schema and engine output schema remain unchanged.
- No `.plan.json` files are created or persisted.
- Focused UI and optimizer tests plus production build pass.

## Previous Package — S1848-S1867: Runtime-Only Optimizer Objective Adapter

**Status:** Complete 2026-06-08.

Goal: implement the first bounded runtime layer behind the planner-grade objective. The optimizer now emits a runtime-only capacity objective packet with sustainable after-tax monthly capacity, minimum-floor protection, estate and survivor constraint states, bounded CPP/OAS timing state, and annual sequencing deferral.

Non-scope: production UI, saved plan schema changes, engine output schema changes, persisted optimizer output, `.plan.json` files, account-level annual withdrawal instructions, tax-bracket instructions, Monte Carlo-in-loop optimization, or advice-like copy.

Package doc: [`docs/sprint_1848_1867_runtime_only_optimizer_objective_adapter.md`](docs/sprint_1848_1867_runtime_only_optimizer_objective_adapter.md).

### S1848-S1867 Completed Path

- **S1848-S1852 — Capacity metric batch.** Added runtime capacity objective type, after-tax monthly capacity, expense-floor comparison, optional room, and runtime-only boundary.
- **S1853-S1857 — Constraint batch.** Added minimum-floor, estate, survivor, missing-survivor, and review-first states.
- **S1858-S1862 — Timing batch.** Connected capacity objective to bounded CPP/OAS timing family state while keeping timing evidence non-advisory.
- **S1863-S1867 — Boundary and verification.** Added tests, confirmed no saved optimizer output, ran focused optimizer tests, ran production build, and closed the package.

### S1848-S1867 Definition Of Done

- Optimizer summary includes `capacityObjective`.
- Monthly after-tax capacity is derived at runtime from the selected bounded candidate.
- Minimum expense floor is checked before optional room.
- Estate and survivor constraints are represented in runtime output.
- CPP/OAS timing comparison is evidence-only.
- Annual account-level withdrawal sequencing remains deferred.
- Optimizer output remains runtime-only.
- Saved plan schema and engine output schema remain unchanged.
- No `.plan.json` files are created or persisted.
- Focused optimizer tests and production build pass.

## Previous Package — S1828-S1847: Planner-Grade Optimizer Objective Decision Gate

**Status:** Planned/documented 2026-06-08.

Goal: define the planner-grade optimizer objective and boundaries before implementation. The product answer remains sustainable after-tax monthly household capacity, not user-entered desired spend.

Non-scope: production UI, saved plan schema changes, engine output schema changes, persisted optimizer output, `.plan.json` files, account-level annual withdrawal instructions, tax-bracket instructions, Monte Carlo-in-loop optimization, or advice-like copy.

Package doc: [`docs/sprint_1828_1847_planner_grade_optimizer_objective_decision_gate.md`](docs/sprint_1828_1847_planner_grade_optimizer_objective_decision_gate.md).

### S1828-S1847 Planned Path

- **S1828-S1832 — Objective batch.** Define sustainable after-tax monthly capacity, today's-dollar framing, expense-floor separation, hard constraints, and checkpoint.
- **S1833-S1837 — Constraint batch.** Define minimum floor, estate, survivor, missing-input, blocked, and caution states.
- **S1838-S1842 — Timing and sequencing prep.** Define CPP/OAS timing comparison boundaries, evidence rows, and future annual sequencing prerequisites.
- **S1843-S1847 — Runtime boundary and closeout.** Reconfirm runtime-only treatment, schema boundaries, copy guardrails, verification expectations, and implementation readiness gate.

### S1828-S1847 Definition Of Done

- Optimizer objective is documented as maximizing sustainable after-tax monthly household capacity.
- Minimum expense floor is a hard protection boundary.
- Estate and survivor constraints are hard boundaries before candidate ranking.
- CPP/OAS timing comparison is allowed as bounded evidence, not advice.
- Annual account-level withdrawal sequencing remains deferred.
- Optimizer output remains runtime-only.
- Saved plan schema and engine output schema remain unchanged.
- No `.plan.json` files are created or persisted.
- Consumer copy remains calm, review-oriented, and non-advisory.

## Previous Latest Sprint — Sprint 701: Reload Recovery Closeout

**Status:** Complete 2026-05-28.

Goal: make stale deploy chunk recovery clearer and easier to use while outside-app feedback is pending.

Non-scope: annual withdrawal overrides, account-by-account instructions, exact tax-bracket optimization, Monte Carlo-in-loop search, saved optimizer output, saved plan schema changes, engine output schema changes, cloud accounts, advisor tooling, broad visual redesign, or report migration.

Sprint 701 checkpoint doc: [`docs/sprint_701_reload_recovery_closeout.md`](docs/sprint_701_reload_recovery_closeout.md).

### Sprint 682-701 Planned Path

- **S682-S686 — Refresh action.** Add stale-version refresh affordance, notice styling, guard coverage, and first checkpoint.
- **S687-S691 — Alert and boundaries.** Add alert semantics, keep generic errors separate, reconfirm no infrastructure expansion, and second checkpoint.
- **S692-S696 — Reviewer guidance.** Add reviewer refresh guidance, manual QA, copy boundaries, no-persistence posture, and third checkpoint.
- **S697-S701 — Closeout.** Review boundaries, set verification, keep feedback handoff clear, recommend next package, and close.

### Sprint 682-701 Candidate Implementation Tickets

- [x] **S683-01 — Refresh action.** Add a Refresh page button for stale deployed chunks.
- [x] **S684-01 — Notice style.** Use existing validation-panel styling with a restrained error variant.
- [x] **S687-01 — Alert notice.** Add alert semantics to the bridge error notice.
- [x] **S688-01 — Guard coverage.** Update structure coverage for reload notice behavior.
- [x] **S701-01 — Closeout docs.** Confirm recovery remains local, small, and non-persistent.

### Sprint 682-701 Definition Of Done

- Stale chunk errors use calm reload copy and a refresh button.
- Generic preview errors do not show the refresh action.
- Bridge error notice uses alert semantics.
- Recovery does not add persistence, telemetry, service workers, accounts, or cloud services.
- Annual account-level sequencing remains deferred.
- In-app feedback capture and UI overhaul remain deferred.
- Saved plan schema and engine output schema remain unchanged.
- No `.plan.json` files are created or persisted.
- Existing tests and probes are preserved.

### Historical Definition Of Done Coverage

- Baseline stress indicators, stress rows, and stress summary are owned by `stressSelectors`.
- Nearby spending-stress reruns and spending-stress summary interpretation are owned by `stressSelectors`.
- Monte Carlo, progressive Monte Carlo, and historical sequence stress remain in the detailed-report path.
- Boundary review identifies probe coverage and saved-plan guardrails before any later migration.
- Thin adapter contract accepts explicit plan/config inputs only.
- Thin adapter contract allows injected runner ownership only; React does not directly run Monte Carlo or historical replay.
- Adapter validation requires existing detailed stress output shapes and clean saved-plan boundaries.
- Contained prototype creates copied explicit requests only after validation passes.
- Contained prototype calls only a supplied injected runner.
- Contained prototype blocks missing runners, failed validation, and malformed output shapes.
- Probe coverage summary records Monte Carlo, progressive Monte Carlo, historical replay, engine parity, and route-probe caveat state.
- Probe-backed bridge runs only when prototype closeout, probe coverage, runner injection, and saved-plan guardrails are clean.
- Bridge run calls only the supplied injected runner and accepts only existing detailed stress shape metadata.
- Manual comparison uses runtime-only detailed-report reference metadata.
- Manual comparison checks bridge completion, output shape, full-spending-funded rate, Monte Carlo run count, historical sequence count, and saved-plan boundary.
- Manual comparison marks metric drift for review and blocked bridge/persistence paths as blocked.
- V1 decision defaults to keeping detailed stress in the detailed report when comparison is clean and v1 consumer value is low.
- V1 decision marks review paths when product value or migration risk argues against default deferral.
- Decision closeout returns next work to recommended-plan and bounded drawdown execution.
- V1 drawdown re-entry checks detailed stress deferral, execution phase, UX readiness, saved-plan boundary, and v1 scope.
- Next sprint plan prioritizes recommended-plan framing and bounded drawdown review polish.
- Re-entry closeout marks the path ready for the next bounded drawdown sprint.
- Recommended-plan drawdown review frames bounded execution as review evidence inside Details.
- Details placement keeps comparison rows, limits, and review actions out of Overview.
- Copy guard blocks advice-like, instruction-like, saved-output, or Overview-heavy framing.
- Closeout marks recommended-plan drawdown review polish ready for implementation.
- React Results Details renders v1 drawdown re-entry review, re-entry closeout, recommended-plan review, Details placement, review copy guard, and recommended-plan closeout.
- Overview remains free of the drawdown review implementation panels.
- UI structure tests protect the Details-only placement and consumer copy boundaries.
- Visible React Details labels use consumer-facing drawdown review language instead of implementation labels.
- Selector copy that flows into the recommended-plan drawdown review avoids `V1`, `bounded`, and instruction-style phrasing.
- Recommended-plan drawdown copy has explicit test coverage for plain-language guardrails.
- Release readiness checkpoint summarizes inputs, first answer, spending estimate, drawdown review, examples, local save, verification, and feedback scope.
- Release readiness checkpoint appears in Details, not Overview.
- Release readiness checkpoint output remains runtime-only and unsaved.
- Feedback review package organizes example runs, first-screen clarity, spending language, drawdown review, local trust, verification, and UI/UX scope.
- Feedback review package appears in Details, not Overview.
- Feedback review package output remains runtime-only and unsaved.
- Checkpoint review board organizes examples, first-answer clarity, spending language, drawdown boundaries, save/report trust, verification, and visual UX feedback.
- Checkpoint review board separates fix-first, review-now, and later-UX-pass items.
- Checkpoint review board is gated out of the normal consumer Details path by default.
- Checkpoint review board output remains runtime-only and unsaved.
- Save editable plan includes a local backup reminder.
- Moving from Review to Results offers to save unsaved local changes first.
- Opening the printable report offers to save unsaved local changes first.
- Overview omits compact optimizer options and compact results-readiness diagnostics.
- Results, Taxes, and Assumptions show Ontario 2026 tax-assumption scope.
- Consumer intake no longer exposes the Meltdown diagnostic option.
- Older diagnostic withdrawal-order values map to Default in the consumer preview and bounded optimizer paths.
- Two-person DB pension plans include eligible pension splitting in the current-plan baseline.
- Two-person DB pension plans do not surface pension splitting as a found optimizer option.
- Registered-income pension-splitting review candidates remain available for eligible non-DB cases.
- Taxes, Assumptions, and Overview explain when eligible DB pension splitting is included in the baseline.
- Hidden drawdown comparison and drawdown readiness baseline configs use the same DB pension-splitting baseline rule.
- Spousal RRSP attribution, CPP sharing, OAS recovery, account balance, withdrawal-order, and sustainable-spending probes use extracted engine or helper entry points instead of brittle inline-script scraping.
- Repaired Canadian-rule probes pass individually.
- Repaired Canadian-rule probes are included in the canonical probe runner.
- Probe documentation identifies the extracted-engine probes and the remaining legacy single-purpose probes.
- Probe repair does not change engine math, UI behavior, saved plan schema, or optimizer behavior.
- Recommended-plan drawdown implementation gate combines closeout, plain summary, safety checks, visible limits, copy boundary, and saved-plan boundary.
- Recommended-plan drawdown narrative stays review-oriented and avoids account instructions.
- Recommended-plan example gate records clear and needs-review states without running example matrices in product UI.
- Implementation closeout combines gate, narrative, examples, and saved-plan boundary before the next v1 checkpoint.
- New drawdown implementation gate, narrative, example gate, and closeout output remain runtime-only and unsaved.
- V1 checkpoint review combines implementation closeout, recommended-plan narrative, example evidence, and saved-plan boundary.
- Built-in example matrix covers the checkpoint review layer.
- Checkpoint review can mark ready for feedback, hold for cleanup, or simplify before v1.
- Checkpoint review copy remains review-oriented and non-instructional.
- Checkpoint review output remains runtime-only and unsaved.
- Intake moves to the top of the next step after Continue or step navigation.
- Local save behavior is visible during intake.
- Income and spending fields with validation issues can be visually highlighted.
- DB pension and bridge pension copy uses today's-dollar language.
- Spending phase copy uses go / slow / no-go language while keeping today’s-dollar framing.
- CPP/OAS copy explains that CPP at 65 is the main Service Canada estimate and CPP at 60 is calculated in timing tests.
- Multiple DB pensions, rental income, and expected one-time additions are documented as future modelling scope without changing schema.
- No checkpoint review board, detailed stress boundary, migration closeout, stress readiness, row, summary, or spending-stress output is persisted.
- No custom annual override payload is saved.
- No drawdown draft, sandbox, comparison readiness, hidden comparison, decision gate, runtime payload, internal dry-run, readiness review, visible gate, preview, phase review, boundary decision, adapter validation, mocked scorecard, go/no-go, preflight, audit trail, containment guard, example checkpoint, closeout, contained prototype, contained prototype summary, materiality, explanation, limitations, usefulness closeout, density, checklist, example gate, copy guard, product go/no-go, promotion readiness, next-step guide, blocker register, example promotion gate, phase milestone, v1 execution intent, v1 execution candidate, v1 execution result, v1 execution review, v1 execution example gate, v1 execution phase closeout, v1 consumer summary, v1 safety checklist, v1 consumer limits, v1 consumer example gate, v1 consumer closeout, v1 UX headline, v1 UX comparison card, v1 UX review actions, v1 UX copy guard, v1 UX readiness closeout, v1 drawdown re-entry review, v1 drawdown next sprint plan, v1 drawdown re-entry closeout, v1 recommended-plan drawdown review, v1 drawdown details placement, v1 drawdown review copy guard, v1 recommended-plan drawdown closeout, v1 drawdown implementation gate, v1 recommended-plan drawdown narrative, v1 recommended-plan drawdown example gate, v1 drawdown implementation closeout, v1 drawdown checkpoint review, engine extraction readiness, engine extraction next steps, engine extraction example gate, engine extraction phase closeout, stress extraction readiness, stress extraction boundary, detailed stress boundary review, detailed stress migration closeout, detailed stress adapter contract, detailed stress adapter validation, detailed stress adapter batch closeout, detailed stress adapter request, detailed stress injected runner prototype, detailed stress prototype batch closeout, detailed stress probe coverage, detailed stress probe-backed runner bridge, detailed stress probe-backed bridge run, detailed stress bridge batch closeout, detailed stress manual report reference, detailed stress manual report comparison, detailed stress manual comparison closeout, detailed stress v1 migration decision, detailed stress v1 decision closeout, stress test summary, stress test rows, mocked payload, or prototype output is persisted.
- No optimizer output is persisted.
- No engine output or saved plan schema change is introduced.
- Verification passes and no private `.plan.json` files are created.

## Completed Sprints

### Sprint 701: Reload Recovery Closeout

**Complete 2026-05-28.** Closed the deploy-recovery package with a stale-version refresh button, alert notice semantics, focused structure coverage, and no persistence or infrastructure expansion.

Sprint 701 checkpoint doc: [`docs/sprint_701_reload_recovery_closeout.md`](docs/sprint_701_reload_recovery_closeout.md).

### Sprint 696: Third Recovery Batch Checkpoint

**Complete 2026-05-28.** Added reviewer refresh guidance, manual QA notes, recovery copy boundaries, and no-persistence posture.

Sprint 696 checkpoint doc: [`docs/sprint_696_third_recovery_batch_checkpoint.md`](docs/sprint_696_third_recovery_batch_checkpoint.md).

### Sprint 691: Second Recovery Batch Checkpoint

**Complete 2026-05-28.** Added alert semantics to the bridge error notice and preserved the stale-version-only refresh path.

Sprint 691 checkpoint doc: [`docs/sprint_691_second_recovery_batch_checkpoint.md`](docs/sprint_691_second_recovery_batch_checkpoint.md).

### Sprint 686: First Recovery Batch Checkpoint

**Complete 2026-05-28.** Added the stale-version refresh affordance, restrained notice styling, and focused structure coverage.

Sprint 686 checkpoint doc: [`docs/sprint_686_first_recovery_batch_checkpoint.md`](docs/sprint_686_first_recovery_batch_checkpoint.md).

### Sprint 681: Readiness Slimming Closeout

**Complete 2026-05-28.** Closed the readiness-slimming package with summary-first hidden research rendering, stale chunk reload copy, preserved runtime packet data, and deferred annual sequencing.

Sprint 681 checkpoint doc: [`docs/sprint_681_readiness_slimming_closeout.md`](docs/sprint_681_readiness_slimming_closeout.md).

### Sprint 676: Third Batch Checkpoint

**Complete 2026-05-28.** Added stale dynamic chunk reload copy and kept deploy resilience small.

Sprint 676 checkpoint doc: [`docs/sprint_676_third_batch_checkpoint.md`](docs/sprint_676_third_batch_checkpoint.md).

### Sprint 671: Second Slimming Batch Checkpoint

**Complete 2026-05-28.** Documented visible readiness inventory, held duplicated subsections, blocker policy, and feedback-waiting state.

Sprint 671 checkpoint doc: [`docs/sprint_671_second_slimming_batch_checkpoint.md`](docs/sprint_671_second_slimming_batch_checkpoint.md).

### Sprint 666: First Slimming Batch Checkpoint

**Complete 2026-05-28.** Slimmed the hidden annual sequencing readiness research panel while preserving runtime readiness data.

Sprint 666 checkpoint doc: [`docs/sprint_666_first_slimming_batch_checkpoint.md`](docs/sprint_666_first_slimming_batch_checkpoint.md).

### Sprint 661: Outside Feedback Package Closeout

**Complete 2026-05-27.** Closed the outside-app feedback prep package with manual review materials, privacy boundaries, synthesis criteria, fallback slimming guidance, and annual sequencing still deferred.

Sprint 661 checkpoint doc: [`docs/sprint_661_outside_feedback_package_closeout.md`](docs/sprint_661_outside_feedback_package_closeout.md).

### Sprint 656: Third Feedback Batch Checkpoint

**Complete 2026-05-27.** Closed the synthesis and stop-rule batch before any feedback capture or annual sequencing work.

Sprint 656 checkpoint doc: [`docs/sprint_656_third_feedback_batch_checkpoint.md`](docs/sprint_656_third_feedback_batch_checkpoint.md).

### Sprint 651: Second Feedback Batch Checkpoint

**Complete 2026-05-27.** Closed the evidence-capture batch with worksheet, triage, Results checklist, and moderator guard materials.

Sprint 651 checkpoint doc: [`docs/sprint_651_second_feedback_batch_checkpoint.md`](docs/sprint_651_second_feedback_batch_checkpoint.md).

### Sprint 646: First Feedback Batch Checkpoint

**Complete 2026-05-27.** Closed the first outside-feedback setup batch with package plan, cohort boundaries, anonymization checklist, and session script.

Sprint 646 checkpoint doc: [`docs/sprint_646_first_feedback_batch_checkpoint.md`](docs/sprint_646_first_feedback_batch_checkpoint.md).

### Sprint 361: Feedback Outcome Closeout

**Complete 2026-05-25.** Closed the feedback outcome batch and kept annual sequencing deferred.

Sprint 361 checkpoint doc: [`docs/sprint_361_feedback_outcome_closeout.md`](docs/sprint_361_feedback_outcome_closeout.md).

### Sprint 360: Details Outcome Surface

**Complete 2026-05-25.** Rendered feedback outcome guidance in the full Details optimizer research surface only.

Sprint 360 checkpoint doc: [`docs/sprint_360_details_outcome_surface.md`](docs/sprint_360_details_outcome_surface.md).

### Sprint 359: Blocked Outcome Guard

**Complete 2026-05-25.** Kept blocked broad-family feedback states routed to input repair.

Sprint 359 checkpoint doc: [`docs/sprint_359_blocked_outcome_guard.md`](docs/sprint_359_blocked_outcome_guard.md).

### Sprint 358: Outcome Next Steps

**Complete 2026-05-25.** Added next-step lists for each withdrawal feedback outcome.

Sprint 358 checkpoint doc: [`docs/sprint_358_outcome_next_steps.md`](docs/sprint_358_outcome_next_steps.md).

### Sprint 357: Outcome Contract

**Complete 2026-05-25.** Added runtime-only outcome states to the withdrawal feedback checkpoint.

Sprint 357 checkpoint doc: [`docs/sprint_357_outcome_contract.md`](docs/sprint_357_outcome_contract.md).

### Sprint 356: Withdrawal Feedback Worksheet Closeout

**Complete 2026-05-25.** Closed the worksheet batch and kept annual sequencing deferred until feedback is reviewed.

Sprint 356 checkpoint doc: [`docs/sprint_356_withdrawal_feedback_worksheet_closeout.md`](docs/sprint_356_withdrawal_feedback_worksheet_closeout.md).

### Sprint 355: Details Worksheet Surface

**Complete 2026-05-25.** Rendered the worksheet in the full Details optimizer research surface only.

Sprint 355 checkpoint doc: [`docs/sprint_355_details_worksheet_surface.md`](docs/sprint_355_details_worksheet_surface.md).

### Sprint 354: Blocked-State Worksheet

**Complete 2026-05-25.** Added input-cleanup worksheet prompts for blocked broad-family feedback states.

Sprint 354 checkpoint doc: [`docs/sprint_354_blocked_state_worksheet.md`](docs/sprint_354_blocked_state_worksheet.md).

### Sprint 353: Pass Signals

**Complete 2026-05-25.** Added pass signals for each withdrawal feedback worksheet section.

Sprint 353 checkpoint doc: [`docs/sprint_353_feedback_worksheet_pass_signals.md`](docs/sprint_353_feedback_worksheet_pass_signals.md).

### Sprint 352: Worksheet Sections

**Complete 2026-05-25.** Added understanding, evidence, boundary, and decision worksheet sections.

Sprint 352 checkpoint doc: [`docs/sprint_352_feedback_worksheet_sections.md`](docs/sprint_352_feedback_worksheet_sections.md).

### Sprint 351: Annual Sequencing Decision Gate Closeout

**Complete 2026-05-25.** Closed the decision-gate batch and kept annual sequencing architecture deferred.

Sprint 351 checkpoint doc: [`docs/sprint_351_annual_sequencing_decision_gate_closeout.md`](docs/sprint_351_annual_sequencing_decision_gate_closeout.md).

### Sprint 350: Details Decision Surface

**Complete 2026-05-25.** Rendered the annual sequencing decision gate in Details research only.

Sprint 350 checkpoint doc: [`docs/sprint_350_details_decision_surface.md`](docs/sprint_350_details_decision_surface.md).

### Sprint 349: Blocked Input Decision

**Complete 2026-05-25.** Routed blocked broad-family states to input cleanup before feedback or sequencing planning.

Sprint 349 checkpoint doc: [`docs/sprint_349_blocked_input_decision.md`](docs/sprint_349_blocked_input_decision.md).

### Sprint 348: Required Evidence List

**Complete 2026-05-25.** Added required evidence before any annual sequencing architecture decision.

Sprint 348 checkpoint doc: [`docs/sprint_348_required_evidence_list.md`](docs/sprint_348_required_evidence_list.md).

### Sprint 347: Feedback-To-Decision Contract

**Complete 2026-05-25.** Converted withdrawal feedback readiness into a runtime-only decision gate.

Sprint 347 checkpoint doc: [`docs/sprint_347_feedback_to_decision_contract.md`](docs/sprint_347_feedback_to_decision_contract.md).

### Sprint 346: Withdrawal Feedback Hardening Closeout

**Complete 2026-05-25.** Closed the feedback-hardening batch and kept annual sequencing deferred until feedback is reviewed.

Sprint 346 checkpoint doc: [`docs/sprint_346_withdrawal_feedback_hardening_closeout.md`](docs/sprint_346_withdrawal_feedback_hardening_closeout.md).

### Sprint 345: Details Research Copy Guard

**Complete 2026-05-25.** Rendered feedback questions and confusion signals in the full Details optimizer research surface only.

Sprint 345 checkpoint doc: [`docs/sprint_345_withdrawal_feedback_details_copy_guard.md`](docs/sprint_345_withdrawal_feedback_details_copy_guard.md).

### Sprint 344: Input-Cleanup Question Path

**Complete 2026-05-25.** Added cleanup-oriented questions when broad withdrawal-family feedback is blocked by missing inputs.

Sprint 344 checkpoint doc: [`docs/sprint_344_withdrawal_feedback_input_cleanup.md`](docs/sprint_344_withdrawal_feedback_input_cleanup.md).

### Sprint 343: Confusion Signal Guard

**Complete 2026-05-25.** Added confusion signals that should block annual sequencing planning if users read broad families as instructions.

Sprint 343 checkpoint doc: [`docs/sprint_343_withdrawal_feedback_confusion_signals.md`](docs/sprint_343_withdrawal_feedback_confusion_signals.md).

### Sprint 342: Feedback Question Set

**Complete 2026-05-25.** Added tester questions for broad withdrawal-family evidence.

Sprint 342 checkpoint doc: [`docs/sprint_342_withdrawal_feedback_questions.md`](docs/sprint_342_withdrawal_feedback_questions.md).

### Sprint 341: Withdrawal Feedback Checkpoint

**Complete 2026-05-25.** Closed the feedback-readiness batch and kept annual account-level sequencing deferred.

Sprint 341 checkpoint doc: [`docs/sprint_341_withdrawal_feedback_checkpoint.md`](docs/sprint_341_withdrawal_feedback_checkpoint.md).

### Sprint 340: Details Research Surface

**Complete 2026-05-25.** Added the withdrawal feedback checkpoint to the full Details optimizer research surface without changing Overview.

Sprint 340 checkpoint doc: [`docs/sprint_340_withdrawal_feedback_details_surface.md`](docs/sprint_340_withdrawal_feedback_details_surface.md).

### Sprint 339: Feedback Evidence Clarity

**Complete 2026-05-25.** Added evidence-readiness status for broad withdrawal families when a family leads the review.

Sprint 339 checkpoint doc: [`docs/sprint_339_withdrawal_feedback_evidence_clarity.md`](docs/sprint_339_withdrawal_feedback_evidence_clarity.md).

### Sprint 338: Annual Instruction Boundary

**Complete 2026-05-25.** Added a checkpoint row that keeps year-by-year withdrawal actions deferred.

Sprint 338 checkpoint doc: [`docs/sprint_338_annual_instruction_boundary.md`](docs/sprint_338_annual_instruction_boundary.md).

### Sprint 337: Withdrawal Feedback Readiness Contract

**Complete 2026-05-25.** Added runtime-only feedback-readiness rows for broad withdrawal-family evidence.

Sprint 337 checkpoint doc: [`docs/sprint_337_withdrawal_feedback_readiness_contract.md`](docs/sprint_337_withdrawal_feedback_readiness_contract.md).

### Sprint 336: Legacy Scenario CSV Export Correction

**Complete 2026-05-25.** Added a local CSV download to the legacy dashboard Year-by-Year Detail card that follows the selected scenario and display-dollar mode.

Sprint 336 checkpoint doc: [`docs/sprint_336_legacy_scenario_csv_export.md`](docs/sprint_336_legacy_scenario_csv_export.md).

### Sprint 335: Withdrawal Sequencing Prep Checkpoint

**Complete 2026-05-24.** Closed the withdrawal sequencing prep batch and kept annual override planning deferred.

Sprint 335 checkpoint doc: [`docs/sprint_335_withdrawal_sequencing_prep_checkpoint.md`](docs/sprint_335_withdrawal_sequencing_prep_checkpoint.md).

### Sprint 334: Withdrawal Copy And Example Guard

**Complete 2026-05-24.** Added example-matrix guardrails for broad withdrawal-family evidence and instruction-free copy.

Sprint 334 checkpoint doc: [`docs/sprint_334_withdrawal_copy_example_guard.md`](docs/sprint_334_withdrawal_copy_example_guard.md).

### Sprint 333: Tax/OAS Recovery Evidence

**Complete 2026-05-24.** Added first-year and peak-tax evidence for leading broad withdrawal-family comparisons.

Sprint 333 checkpoint doc: [`docs/sprint_333_withdrawal_tax_oas_evidence.md`](docs/sprint_333_withdrawal_tax_oas_evidence.md).

### Sprint 332: Account Bucket Guardrails

**Complete 2026-05-24.** Tightened broad withdrawal-family eligibility to require meaningful registered and TFSA/non-registered balances.

Sprint 332 checkpoint doc: [`docs/sprint_332_account_bucket_guardrails.md`](docs/sprint_332_account_bucket_guardrails.md).

### Sprint 331: Withdrawal Family Evidence Prep

**Complete 2026-05-24.** Added compact broad withdrawal-family evidence when a withdrawal-order family leads the review.

Sprint 331 checkpoint doc: [`docs/sprint_331_withdrawal_family_evidence_prep.md`](docs/sprint_331_withdrawal_family_evidence_prep.md).

### Sprint 330: Benefit Timing Hardening Checkpoint

**Complete 2026-05-24.** Closed the benefit-timing hardening batch and set withdrawal sequencing prep as the recommended next optimizer batch.

Sprint 330 checkpoint doc: [`docs/sprint_330_benefit_timing_hardening_checkpoint.md`](docs/sprint_330_benefit_timing_hardening_checkpoint.md).

### Sprint 329: Benefit Timing Copy Readability Guard

**Complete 2026-05-24.** Added structure guards for benefit-timing evidence wording and prohibited CPP/OAS advice-like copy.

Sprint 329 checkpoint doc: [`docs/sprint_329_benefit_timing_copy_readability_guard.md`](docs/sprint_329_benefit_timing_copy_readability_guard.md).

### Sprint 328: Bridge And Survivor Harm Checks

**Complete 2026-05-24.** Kept benefit-timing candidates review-only when two-person plans need survivor setup first.

Sprint 328 checkpoint doc: [`docs/sprint_328_bridge_survivor_harm_checks.md`](docs/sprint_328_bridge_survivor_harm_checks.md).

### Sprint 327: Benefit Timing Example Matrix

**Complete 2026-05-24.** Added example-matrix coverage for benefit-timing evidence and prohibited-copy posture.

Sprint 327 checkpoint doc: [`docs/sprint_327_benefit_timing_example_matrix.md`](docs/sprint_327_benefit_timing_example_matrix.md).

### Sprint 326: Benefit Timing Top-Three Evidence

**Complete 2026-05-24.** Added a compact top-three CPP/OAS milestone-pair evidence row in the Details research path.

Sprint 326 checkpoint doc: [`docs/sprint_326_benefit_timing_top_three_evidence.md`](docs/sprint_326_benefit_timing_top_three_evidence.md).

### Sprint 325: Optimizer Candidate Limit Guard

**Complete 2026-05-24.** Added an explicit bounded-candidate limit helper so future grid expansion preserves non-grid review families.

Sprint 325 checkpoint doc: [`docs/sprint_325_optimizer_candidate_limit_guard.md`](docs/sprint_325_optimizer_candidate_limit_guard.md).

### Sprint 324: Benefit Grid Copy Guard

**Complete 2026-05-24.** Tightened Details evidence copy for benefit-grid output and added structure guards for review-first wording.

Sprint 324 checkpoint doc: [`docs/sprint_324_benefit_grid_copy_guard.md`](docs/sprint_324_benefit_grid_copy_guard.md).

### Sprint 323: Benefit Grid Evidence Summary

**Complete 2026-05-24.** Added compact evidence rows for the best bounded CPP/OAS milestone pair while preserving the age-70 bridge check.

Sprint 323 checkpoint doc: [`docs/sprint_323_benefit_grid_evidence_summary.md`](docs/sprint_323_benefit_grid_evidence_summary.md).

### Sprint 322: Benefit Timing Milestone Grid

**Complete 2026-05-24.** Expanded runtime benefit-timing candidates to a bounded milestone grid while preserving the saved-plan and engine-output boundaries.

Sprint 322 checkpoint doc: [`docs/sprint_322_benefit_timing_milestone_grid.md`](docs/sprint_322_benefit_timing_milestone_grid.md).

### Sprint 321: Optimizer V1 Direction Closeout

**Complete 2026-05-24.** Implemented the first local-first Canadian plan-to-review optimizer direction as runtime-only evidence.

Sprint 321 checkpoint doc: [`docs/sprint_308_321_optimizer_v1_direction.md`](docs/sprint_308_321_optimizer_v1_direction.md).

### Sprint 307: Optimizer Checkpoint Decision

**Complete 2026-05-24.** Decided to proceed to optimizer prep next without starting optimizer implementation.

Sprint 307 checkpoint doc: [`docs/sprint_307_optimizer_checkpoint_decision.md`](docs/sprint_307_optimizer_checkpoint_decision.md).

### Sprint 306: Feedback Readiness Package

**Complete 2026-05-24.** Recorded feedback-ready surfaces and deferred scope after the cleanup run.

Sprint 306 checkpoint doc: [`docs/sprint_306_feedback_readiness_package.md`](docs/sprint_306_feedback_readiness_package.md).

### Sprint 305: Details Density Final Audit

**Complete 2026-05-24.** Protected the compact normal Details evidence set before optimizer prep.

Sprint 305 checkpoint doc: [`docs/sprint_305_details_density_final_audit.md`](docs/sprint_305_details_density_final_audit.md).

### Sprint 304: Output Boundary Guard

**Complete 2026-05-24.** Reconfirmed editable backup, printable report, and CSV export boundaries.

Sprint 304 checkpoint doc: [`docs/sprint_304_output_boundary_guard.md`](docs/sprint_304_output_boundary_guard.md).

### Sprint 303: Results Copy Consistency Pass

**Complete 2026-05-24.** Tightened visible Results copy around review-first plan options and guardrails.

Sprint 303 checkpoint doc: [`docs/sprint_303_results_copy_consistency.md`](docs/sprint_303_results_copy_consistency.md).

### Sprint 302: Intake Review Item Closeout

**Complete 2026-05-24.** Closed the guided-intake review-item wording pass.

Sprint 302 checkpoint doc: [`docs/sprint_302_intake_review_item_closeout.md`](docs/sprint_302_intake_review_item_closeout.md).

### Sprint 301: Validation Review Copy

**Complete 2026-05-24.** Reframed non-blocking guided-intake validation items as review items instead of warnings.

Sprint 301 checkpoint doc: [`docs/sprint_301_validation_review_copy.md`](docs/sprint_301_validation_review_copy.md).

### Sprint 300: V1 Engine Optimizer Checkpoint

**Complete 2026-05-24.** Closed the v1 feedback readiness run before the next engine/optimizer checkpoint decision.

Sprint 300 checkpoint doc: [`docs/sprint_300_v1_engine_optimizer_checkpoint.md`](docs/sprint_300_v1_engine_optimizer_checkpoint.md).

### Sprint 299: V1 Feedback Verification Package

**Complete 2026-05-24.** Recorded the final verification package and known route-probe caveat.

Sprint 299 checkpoint doc: [`docs/sprint_299_v1_feedback_verification_package.md`](docs/sprint_299_v1_feedback_verification_package.md).

### Sprint 298: V1 Feedback Fix List

**Complete 2026-05-24.** Recorded the trust-cleanup posture before the next checkpoint decision.

Sprint 298 checkpoint doc: [`docs/sprint_298_v1_feedback_fix_list.md`](docs/sprint_298_v1_feedback_fix_list.md).

### Sprint 297: Research Gate Checkpoint

**Complete 2026-05-24.** Added UI structure coverage that normal consumer research gates remain disabled.

Sprint 297 checkpoint doc: [`docs/sprint_297_research_gate_checkpoint.md`](docs/sprint_297_research_gate_checkpoint.md).

### Sprint 296: V1 Feedback Readiness Review

**Complete 2026-05-24.** Reviewed v1 feedback readiness across Overview, Details, Save & print, CSV, and review-label copy.

Sprint 296 checkpoint doc: [`docs/sprint_296_v1_feedback_readiness_review.md`](docs/sprint_296_v1_feedback_readiness_review.md).

### Sprint 295: Export Boundary Closeout

**Complete 2026-05-24.** Documented local output boundary polish and preserved engine/schema boundaries.

Sprint 295 checkpoint doc: [`docs/sprint_295_export_boundary_closeout.md`](docs/sprint_295_export_boundary_closeout.md).

### Sprint 294: Local Output Trust

**Complete 2026-05-24.** Preserved local-first trust across editable backup, report, and CSV output actions.

Sprint 294 checkpoint doc: [`docs/sprint_294_local_output_trust.md`](docs/sprint_294_local_output_trust.md).

### Sprint 293: Export Copy Guard

**Complete 2026-05-24.** Added UI structure coverage for local output labels and reopen boundaries.

Sprint 293 checkpoint doc: [`docs/sprint_293_export_copy_guard.md`](docs/sprint_293_export_copy_guard.md).

### Sprint 292: Export Boundary Note

**Complete 2026-05-24.** Added an upfront Save & print note explaining editable backup, printable report, and CSV results export.

Sprint 292 checkpoint doc: [`docs/sprint_292_export_boundary_note.md`](docs/sprint_292_export_boundary_note.md).

### Sprint 291: Save Export Boundary Review

**Complete 2026-05-24.** Reviewed Save & print after the annual CSV export batch.

Sprint 291 checkpoint doc: [`docs/sprint_291_save_export_boundary_review.md`](docs/sprint_291_save_export_boundary_review.md).

### Sprint 290: Recommended Plan Copy Closeout

**Complete 2026-05-24.** Documented recommended-plan copy discipline and preserved engine/schema boundaries.

Sprint 290 checkpoint doc: [`docs/sprint_290_recommended_plan_copy_closeout.md`](docs/sprint_290_recommended_plan_copy_closeout.md).

### Sprint 289: Recommended Copy Structure Guard

**Complete 2026-05-24.** Added UI structure coverage blocking advice-like recommendation labels from active React source.

Sprint 289 checkpoint doc: [`docs/sprint_289_recommended_copy_structure_guard.md`](docs/sprint_289_recommended_copy_structure_guard.md).

### Sprint 288: Review Label Boundary

**Complete 2026-05-24.** Made plan-review labels explicit as review evidence, not advice.

Sprint 288 checkpoint doc: [`docs/sprint_288_review_label_boundary.md`](docs/sprint_288_review_label_boundary.md).

### Sprint 287: Plan-To-Review Copy Tightening

**Complete 2026-05-24.** Reworded visible plan-selection labels toward plan-to-review language.

Sprint 287 checkpoint doc: [`docs/sprint_287_plan_to_review_copy_tightening.md`](docs/sprint_287_plan_to_review_copy_tightening.md).

### Sprint 286: Recommended Plan Language Review

**Complete 2026-05-24.** Reviewed suggested/recommended labels for advice-like tone.

Sprint 286 checkpoint doc: [`docs/sprint_286_recommended_plan_language_review.md`](docs/sprint_286_recommended_plan_language_review.md).

### Sprint 285: Tax Details Compaction Closeout

**Complete 2026-05-24.** Documented tax Details compaction and preserved engine/schema boundaries.

Sprint 285 checkpoint doc: [`docs/sprint_285_tax_details_compaction_closeout.md`](docs/sprint_285_tax_details_compaction_closeout.md).

### Sprint 284: Tax Scope Structure Guard

**Complete 2026-05-24.** Added UI structure coverage for compact tax placement, Ontario scope, and full-table gating.

Sprint 284 checkpoint doc: [`docs/sprint_284_tax_scope_structure_guard.md`](docs/sprint_284_tax_scope_structure_guard.md).

### Sprint 283: Tax Research Gate

**Complete 2026-05-24.** Preserved the full tax-pressure table behind a disabled internal research gate.

Sprint 283 checkpoint doc: [`docs/sprint_283_tax_research_gate.md`](docs/sprint_283_tax_research_gate.md).

### Sprint 282: Compact Tax Pressure Summary

**Complete 2026-05-24.** Added a compact tax-pressure summary for normal Details.

Sprint 282 checkpoint doc: [`docs/sprint_282_compact_tax_pressure_summary.md`](docs/sprint_282_compact_tax_pressure_summary.md).

### Sprint 281: Tax Details Density Review

**Complete 2026-05-24.** Reviewed tax Details density and kept full tax rows in the Taxes section or research path.

Sprint 281 checkpoint doc: [`docs/sprint_281_tax_details_density_review.md`](docs/sprint_281_tax_details_density_review.md).

### Sprint 280: Decision Details Compaction Closeout

**Complete 2026-05-24.** Documented decision Details compaction and preserved engine/schema boundaries.

Sprint 280 checkpoint doc: [`docs/sprint_280_decision_details_compaction_closeout.md`](docs/sprint_280_decision_details_compaction_closeout.md).

### Sprint 279: Decision Surface Structure Guard

**Complete 2026-05-24.** Added UI structure coverage for checklist placement and decision-detail gating.

Sprint 279 checkpoint doc: [`docs/sprint_279_decision_surface_structure_guard.md`](docs/sprint_279_decision_surface_structure_guard.md).

### Sprint 278: Decision Checklist Preservation

**Complete 2026-05-24.** Kept the decision checklist visible while gating lower-level decision diagnostics.

Sprint 278 checkpoint doc: [`docs/sprint_278_decision_checklist_preservation.md`](docs/sprint_278_decision_checklist_preservation.md).

### Sprint 277: Decision Research Gate

**Complete 2026-05-24.** Preserved decision detail and projection path behind a disabled internal research gate.

Sprint 277 checkpoint doc: [`docs/sprint_277_decision_research_gate.md`](docs/sprint_277_decision_research_gate.md).

### Sprint 276: Decision Details Density Review

**Complete 2026-05-24.** Reviewed decision Details density and kept the checklist as the normal consumer surface.

Sprint 276 checkpoint doc: [`docs/sprint_276_decision_details_density_review.md`](docs/sprint_276_decision_details_density_review.md).

### Sprint 275: Optimizer Prep Compaction Closeout

**Complete 2026-05-24.** Documented optimizer-prep compaction and preserved engine/schema boundaries.

Sprint 275 checkpoint doc: [`docs/sprint_275_optimizer_prep_compaction_closeout.md`](docs/sprint_275_optimizer_prep_compaction_closeout.md).

### Sprint 274: Optimizer Prep Structure Guard

**Complete 2026-05-24.** Added UI structure coverage for compact option placement and optimizer-prep gating.

Sprint 274 checkpoint doc: [`docs/sprint_274_optimizer_prep_structure_guard.md`](docs/sprint_274_optimizer_prep_structure_guard.md).

### Sprint 273: Option Prep Consumer Boundary

**Complete 2026-05-24.** Kept future search-space and optimizer-permission diagnostics out of the normal consumer path.

Sprint 273 checkpoint doc: [`docs/sprint_273_option_prep_consumer_boundary.md`](docs/sprint_273_option_prep_consumer_boundary.md).

### Sprint 272: Optimizer Prep Research Gate

**Complete 2026-05-24.** Moved optimizer boundary and input review panels behind the option research gate.

Sprint 272 checkpoint doc: [`docs/sprint_272_optimizer_prep_research_gate.md`](docs/sprint_272_optimizer_prep_research_gate.md).

### Sprint 271: Optimizer Prep Density Review

**Complete 2026-05-24.** Reviewed optimizer-prep Details density and kept compact plan options as the normal consumer surface.

Sprint 271 checkpoint doc: [`docs/sprint_271_optimizer_prep_density_review.md`](docs/sprint_271_optimizer_prep_density_review.md).

### Sprint 270: Annual CSV Export Closeout

**Complete 2026-05-24.** Documented the annual CSV export batch and preserved engine/schema boundaries.

Sprint 270 checkpoint doc: [`docs/sprint_270_annual_csv_export_closeout.md`](docs/sprint_270_annual_csv_export_closeout.md).

### Sprint 269: Annual CSV Structure Guard

**Complete 2026-05-24.** Added UI structure coverage for CSV export copy, filename, MIME type, and saved-plan boundaries.

Sprint 269 checkpoint doc: [`docs/sprint_269_annual_csv_structure_guard.md`](docs/sprint_269_annual_csv_structure_guard.md).

### Sprint 268: Annual CSV UI

**Complete 2026-05-24.** Added Download year-by-year CSV actions to Year-by-year and Save & print.

Sprint 268 checkpoint doc: [`docs/sprint_268_annual_csv_ui.md`](docs/sprint_268_annual_csv_ui.md).

### Sprint 267: Annual Detail CSV Builder

**Complete 2026-05-24.** Added a local CSV builder for existing annual detail selector rows.

Sprint 267 checkpoint doc: [`docs/sprint_267_annual_detail_csv_builder.md`](docs/sprint_267_annual_detail_csv_builder.md).

### Sprint 266: Annual CSV Feedback Review

**Complete 2026-05-24.** Reviewed tester CSV export feedback as local-first, report-adjacent Results work.

Sprint 266 checkpoint doc: [`docs/sprint_266_annual_csv_feedback_review.md`](docs/sprint_266_annual_csv_feedback_review.md).

### Sprint 265: Money Flow Details Compaction Closeout

**Complete 2026-05-24.** Documented the Money Flow Details compaction batch and preserved engine/schema boundaries.

Sprint 265 checkpoint doc: [`docs/sprint_265_money_flow_details_compaction_closeout.md`](docs/sprint_265_money_flow_details_compaction_closeout.md).

### Sprint 264: Money Flow Structure Guard

**Complete 2026-05-24.** Added UI structure coverage for compact money-flow placement and reconciliation diagnostics gating.

Sprint 264 checkpoint doc: [`docs/sprint_264_money_flow_structure_guard.md`](docs/sprint_264_money_flow_structure_guard.md).

### Sprint 263: Money Flow Consumer Summary Preservation

**Complete 2026-05-24.** Kept Money Flow story and first-year ledger visible while gating technical diagnostics.

Sprint 263 checkpoint doc: [`docs/sprint_263_money_flow_consumer_summary_preservation.md`](docs/sprint_263_money_flow_consumer_summary_preservation.md).

### Sprint 262: Money Flow Research Gate

**Complete 2026-05-24.** Preserved reconciliation diagnostics behind a disabled internal research gate.

Sprint 262 checkpoint doc: [`docs/sprint_262_money_flow_research_gate.md`](docs/sprint_262_money_flow_research_gate.md).

### Sprint 261: Details Money Flow Density Review

**Complete 2026-05-24.** Reviewed Details money-flow density and kept consumer summaries as the normal path.

Sprint 261 checkpoint doc: [`docs/sprint_261_details_money_flow_density_review.md`](docs/sprint_261_details_money_flow_density_review.md).

### Sprint 260: Scenario Details Compaction Closeout

**Complete 2026-05-24.** Documented the scenario Details compaction batch and preserved engine/schema boundaries.

Sprint 260 checkpoint doc: [`docs/sprint_260_scenario_details_compaction_closeout.md`](docs/sprint_260_scenario_details_compaction_closeout.md).

### Sprint 259: Scenario Surface Structure Guard

**Complete 2026-05-24.** Added UI structure coverage for compact scenario placement and raw-table gating.

Sprint 259 checkpoint doc: [`docs/sprint_259_scenario_surface_structure_guard.md`](docs/sprint_259_scenario_surface_structure_guard.md).

### Sprint 258: Scenario Consumer Summary Preservation

**Complete 2026-05-24.** Kept CPP/OAS timing review and spending stress visible while gating raw scenario tables.

Sprint 258 checkpoint doc: [`docs/sprint_258_scenario_consumer_summary_preservation.md`](docs/sprint_258_scenario_consumer_summary_preservation.md).

### Sprint 257: Scenario Research Gate

**Complete 2026-05-24.** Preserved scenario assumption and comparison tables behind a disabled internal research gate.

Sprint 257 checkpoint doc: [`docs/sprint_257_scenario_research_gate.md`](docs/sprint_257_scenario_research_gate.md).

### Sprint 256: Details Scenario Density Review

**Complete 2026-05-24.** Reviewed Details scenario density and kept consumer summaries as the normal path.

Sprint 256 checkpoint doc: [`docs/sprint_256_details_scenario_density_review.md`](docs/sprint_256_details_scenario_density_review.md).

### Sprint 255: Option Details Compaction Closeout

**Complete 2026-05-24.** Documented the option Details compaction batch and preserved engine/schema boundaries.

Sprint 255 checkpoint doc: [`docs/sprint_255_option_details_compaction_closeout.md`](docs/sprint_255_option_details_compaction_closeout.md).

### Sprint 254: Option Surface Structure Guard

**Complete 2026-05-24.** Added UI structure coverage for compact option placement and full-panel gating.

Sprint 254 checkpoint doc: [`docs/sprint_254_option_surface_structure_guard.md`](docs/sprint_254_option_surface_structure_guard.md).

### Sprint 253: Option Research Gate

**Complete 2026-05-24.** Preserved the full plan-options panel behind a disabled internal research gate.

Sprint 253 checkpoint doc: [`docs/sprint_253_option_research_gate.md`](docs/sprint_253_option_research_gate.md).

### Sprint 252: Compact Option Details Surface

**Complete 2026-05-24.** Switched normal Details to the compact plan-options surface.

Sprint 252 checkpoint doc: [`docs/sprint_252_compact_option_details_surface.md`](docs/sprint_252_compact_option_details_surface.md).

### Sprint 251: Details Option Density Review

**Complete 2026-05-24.** Reviewed Details option density and selected the existing compact panel for the normal consumer path.

Sprint 251 checkpoint doc: [`docs/sprint_251_details_option_density_review.md`](docs/sprint_251_details_option_density_review.md).

### Sprint 250: Drawdown Details Compaction Closeout

**Complete 2026-05-24.** Documented the drawdown Details compaction batch and preserved engine/schema boundaries.

Sprint 250 checkpoint doc: [`docs/sprint_250_drawdown_details_compaction_closeout.md`](docs/sprint_250_drawdown_details_compaction_closeout.md).

### Sprint 249: Details Diagnostic Preservation

**Complete 2026-05-24.** Preserved deeper drawdown diagnostics behind the hidden research branch.

Sprint 249 checkpoint doc: [`docs/sprint_249_details_diagnostic_preservation.md`](docs/sprint_249_details_diagnostic_preservation.md).

### Sprint 248: Compact Drawdown Surface Guard

**Complete 2026-05-24.** Added UI structure coverage for the compact drawdown Details surface and hidden research diagnostics.

Sprint 248 checkpoint doc: [`docs/sprint_248_compact_drawdown_surface_guard.md`](docs/sprint_248_compact_drawdown_surface_guard.md).

### Sprint 247: Drawdown Research Gate Tightening

**Complete 2026-05-24.** Moved the older drawdown readiness diagnostic panel behind the existing research-panel gate.

Sprint 247 checkpoint doc: [`docs/sprint_247_drawdown_research_gate_tightening.md`](docs/sprint_247_drawdown_research_gate_tightening.md).

### Sprint 246: Details Drawdown Density Review

**Complete 2026-05-24.** Reviewed Details drawdown density and kept the compact summary as the normal consumer surface.

Sprint 246 checkpoint doc: [`docs/sprint_246_details_drawdown_density_review.md`](docs/sprint_246_details_drawdown_density_review.md).

### Sprint 245: Results First-Screen Reduction Closeout

**Complete 2026-05-24.** Documented the first-screen reduction batch and preserved engine/schema boundaries.

Sprint 245 checkpoint doc: [`docs/sprint_245_results_first_screen_reduction_closeout.md`](docs/sprint_245_results_first_screen_reduction_closeout.md).

### Sprint 244: Details Planning Evidence Preservation

**Complete 2026-05-24.** Kept demoted estate and tax-efficiency detail reachable in Details.

Sprint 244 checkpoint doc: [`docs/sprint_244_details_planning_evidence_preservation.md`](docs/sprint_244_details_planning_evidence_preservation.md).

### Sprint 243: Overview First-Screen Guard

**Complete 2026-05-24.** Added UI structure coverage to keep Overview limited to answer, spending, review actions, and compact highlights.

Sprint 243 checkpoint doc: [`docs/sprint_243_overview_first_screen_guard.md`](docs/sprint_243_overview_first_screen_guard.md).

### Sprint 242: Overview Estate Detail Demotion

**Complete 2026-05-24.** Moved the full estate wishes and tax-efficiency panel from Overview to Details.

Sprint 242 checkpoint doc: [`docs/sprint_242_overview_estate_detail_demotion.md`](docs/sprint_242_overview_estate_detail_demotion.md).

### Sprint 241: Overview Density Review

**Complete 2026-05-24.** Reviewed the Results Overview and identified the full estate detail panel as the remaining first-screen density to demote.

Sprint 241 checkpoint doc: [`docs/sprint_241_overview_density_review.md`](docs/sprint_241_overview_density_review.md).

### Sprint 240: Benefit Timing UX Readiness Closeout

**Complete 2026-05-23.** Documented the benefit timing readiness batch and kept editable start-age schema work deferred.

Sprint 240 checkpoint doc: [`docs/sprint_240_benefit_timing_ux_readiness_closeout.md`](docs/sprint_240_benefit_timing_ux_readiness_closeout.md).

### Sprint 239: Saved Setting Boundary

**Complete 2026-05-23.** Protected copy explaining that CPP/OAS start ages are not saved editable inputs yet.

Sprint 239 checkpoint doc: [`docs/sprint_239_benefit_timing_saved_setting_boundary.md`](docs/sprint_239_benefit_timing_saved_setting_boundary.md).

### Sprint 238: Delay-Test Copy Discipline

**Complete 2026-05-23.** Reworded CPP/OAS delay copy as a review test rather than an instruction or recommendation.

Sprint 238 checkpoint doc: [`docs/sprint_238_benefit_timing_copy_discipline.md`](docs/sprint_238_benefit_timing_copy_discipline.md).

### Sprint 237: Benefit Timing Details Summary

**Complete 2026-05-23.** Added a concise Details panel for CPP/OAS age-65 baseline and age-70 review-test readiness.

Sprint 237 checkpoint doc: [`docs/sprint_237_benefit_timing_details_summary.md`](docs/sprint_237_benefit_timing_details_summary.md).

### Sprint 236: Benefit Baseline Language

**Complete 2026-05-23.** Made current CPP/OAS baseline timing explicit as age 65 in Results and Assumptions copy.

Sprint 236 checkpoint doc: [`docs/sprint_236_benefit_baseline_language.md`](docs/sprint_236_benefit_baseline_language.md).

### Sprint 235: Tester Friction Closeout

**Complete 2026-05-23.** Documented the tester-friction copy batch and kept broader income schema work deferred.

Sprint 235 checkpoint doc: [`docs/sprint_235_tester_friction_closeout.md`](docs/sprint_235_tester_friction_closeout.md).

### Sprint 234: Benefit Timing Scope Note

**Complete 2026-05-23.** Clarified that current baseline CPP/OAS starts at 65 and timing changes are reviewed in Results rather than saved as editable inputs.

Sprint 234 checkpoint doc: [`docs/sprint_234_benefit_timing_scope_note.md`](docs/sprint_234_benefit_timing_scope_note.md).

### Sprint 233: Income Scope Note

**Complete 2026-05-23.** Added a plain intake note for multiple DB pensions, rental income, separate pension records, and recurring other income.

Sprint 233 checkpoint doc: [`docs/sprint_233_income_scope_note.md`](docs/sprint_233_income_scope_note.md).

### Sprint 232: First Issue Guidance

**Complete 2026-05-23.** Added a first-item prompt to section validation summaries so testers know what to fix or review first.

Sprint 232 checkpoint doc: [`docs/sprint_232_first_issue_guidance.md`](docs/sprint_232_first_issue_guidance.md).

### Sprint 231: Immediate Draft Clarity

**Complete 2026-05-23.** Clarified that typed inputs update the working draft immediately and Save downloads the editable backup file.

Sprint 231 checkpoint doc: [`docs/sprint_231_immediate_draft_clarity.md`](docs/sprint_231_immediate_draft_clarity.md).

### Sprint 230: Checkpoint Cleanup Closeout

**Complete 2026-05-23.** Documented the checkpoint cleanup batch and preserved the next path toward bounded drawdown and recommended-plan work.

Sprint 230 checkpoint doc: [`docs/sprint_230_checkpoint_cleanup_closeout.md`](docs/sprint_230_checkpoint_cleanup_closeout.md).

### Sprint 229: Scope And Backup Copy Guard

**Complete 2026-05-23.** Kept Ontario 2026 tax-scope copy and local editable-backup reminders protected in UI structure coverage.

Sprint 229 checkpoint doc: [`docs/sprint_229_scope_backup_copy_guard.md`](docs/sprint_229_scope_backup_copy_guard.md).

### Sprint 228: Save/Report Trust Guard

**Complete 2026-05-23.** Preserved save-before-results and save-before-print behavior so users are prompted to download an editable copy before major handoffs.

Sprint 228 checkpoint doc: [`docs/sprint_228_save_report_trust_guard.md`](docs/sprint_228_save_report_trust_guard.md).

### Sprint 227: Compact Drawdown Review Summary

**Complete 2026-05-23.** Added one compact Details summary for the drawdown review so useful evidence remains visible without showing the internal research stack.

Sprint 227 checkpoint doc: [`docs/sprint_227_compact_drawdown_review_summary.md`](docs/sprint_227_compact_drawdown_review_summary.md).

### Sprint 226: Details Drawdown Simplification

**Complete 2026-05-23.** Gated internal drawdown research panels out of the normal consumer Details path by default.

Sprint 226 checkpoint doc: [`docs/sprint_226_details_drawdown_simplification.md`](docs/sprint_226_details_drawdown_simplification.md).

### Sprint 225: Future Income Expansion Notes

**Complete 2026-05-23.** Captured multiple pensions, rental income, and one-time additions as future modelling work.

Sprint 225 checkpoint doc: [`docs/sprint_225_future_income_expansion_notes.md`](docs/sprint_225_future_income_expansion_notes.md).

### Sprint 224: CPP/OAS Input Clarity

**Complete 2026-05-23.** Clarified CPP at 65 input, CPP timing tests, and OAS estimate copy.

Sprint 224 checkpoint doc: [`docs/sprint_224_cpp_oas_input_clarity.md`](docs/sprint_224_cpp_oas_input_clarity.md).

### Sprint 223: Today’s Dollars Label Audit

**Complete 2026-05-23.** Clarified today’s-dollar framing for DB pension, bridge pension, and spending labels.

Sprint 223 checkpoint doc: [`docs/sprint_223_today_dollars_label_audit.md`](docs/sprint_223_today_dollars_label_audit.md).

### Sprint 222: Required Field Guidance

**Complete 2026-05-23.** Added field-level attention styling and validation warnings for income/spending friction points.

Sprint 222 checkpoint doc: [`docs/sprint_222_required_field_guidance.md`](docs/sprint_222_required_field_guidance.md).

### Sprint 221: Intake Navigation And Save Clarity

**Complete 2026-05-23.** Added top-of-step navigation behavior and clearer local-save copy.

Sprint 221 checkpoint doc: [`docs/sprint_221_intake_navigation_save_clarity.md`](docs/sprint_221_intake_navigation_save_clarity.md).

### Sprint 220: Drawdown Checkpoint Closeout

**Complete 2026-05-23.** Closed the bounded drawdown checkpoint batch before the next development pass.

Sprint 220 checkpoint doc: [`docs/sprint_220_drawdown_checkpoint_closeout.md`](docs/sprint_220_drawdown_checkpoint_closeout.md).

### Sprint 219: Drawdown Checkpoint Persistence

**Complete 2026-05-23.** Locked the checkpoint review output out of saved editable plan files.

Sprint 219 checkpoint doc: [`docs/sprint_219_drawdown_checkpoint_persistence.md`](docs/sprint_219_drawdown_checkpoint_persistence.md).

### Sprint 218: Drawdown Checkpoint Copy Guard

**Complete 2026-05-23.** Protected the checkpoint layer from recommendation, certainty, and instruction language.

Sprint 218 checkpoint doc: [`docs/sprint_218_drawdown_checkpoint_copy_guard.md`](docs/sprint_218_drawdown_checkpoint_copy_guard.md).

### Sprint 217: Drawdown Checkpoint Example Matrix

**Complete 2026-05-23.** Extended built-in example coverage through the drawdown checkpoint review.

Sprint 217 checkpoint doc: [`docs/sprint_217_drawdown_checkpoint_example_matrix.md`](docs/sprint_217_drawdown_checkpoint_example_matrix.md).

### Sprint 216: Drawdown V1 Checkpoint Review

**Complete 2026-05-23.** Added a runtime-only checkpoint review for the bounded drawdown implementation layer.

Sprint 216 checkpoint doc: [`docs/sprint_216_drawdown_v1_checkpoint_review.md`](docs/sprint_216_drawdown_v1_checkpoint_review.md).

### Sprint 215: Drawdown Implementation Closeout

**Complete 2026-05-23.** Closed the recommended-plan drawdown implementation gate batch before the next v1 checkpoint.

Sprint 215 checkpoint doc: [`docs/sprint_215_drawdown_implementation_closeout.md`](docs/sprint_215_drawdown_implementation_closeout.md).

### Sprint 214: Drawdown Implementation Copy And Persistence

**Complete 2026-05-23.** Added copy and persistence guardrails for the new implementation gate.

Sprint 214 checkpoint doc: [`docs/sprint_214_drawdown_implementation_copy_persistence.md`](docs/sprint_214_drawdown_implementation_copy_persistence.md).

### Sprint 213: Drawdown Recommended-Plan Example Gate

**Complete 2026-05-23.** Added a built-in example coverage gate for recommended-plan drawdown readiness.

Sprint 213 checkpoint doc: [`docs/sprint_213_drawdown_recommended_plan_example_gate.md`](docs/sprint_213_drawdown_recommended_plan_example_gate.md).

### Sprint 212: Drawdown Recommended-Plan Narrative

**Complete 2026-05-23.** Added a runtime-only narrative selector for the bounded drawdown check inside the recommended-plan story.

Sprint 212 checkpoint doc: [`docs/sprint_212_drawdown_recommended_plan_narrative.md`](docs/sprint_212_drawdown_recommended_plan_narrative.md).

### Sprint 211: Drawdown Implementation Gate

**Complete 2026-05-23.** Added a runtime-only implementation gate before bounded drawdown evidence can be treated as recommended-plan evidence.

Sprint 211 checkpoint doc: [`docs/sprint_211_drawdown_implementation_gate.md`](docs/sprint_211_drawdown_implementation_gate.md).

### Sprint 210: Probe Repair Closeout

**Complete 2026-05-23.** Closed the legacy probe repair batch and marked the next path back to optimizer/drawdown work.

Sprint 210 checkpoint doc: [`docs/sprint_210_probe_repair_closeout.md`](docs/sprint_210_probe_repair_closeout.md).

### Sprint 209: Probe Suite Promotion

**Complete 2026-05-23.** Promoted the repaired Canadian-rule probes into the canonical runner.

Sprint 209 checkpoint doc: [`docs/sprint_209_probe_suite_promotion.md`](docs/sprint_209_probe_suite_promotion.md).

### Sprint 208: Account And Sustain Probe Coverage

**Complete 2026-05-23.** Repaired account-balance, withdrawal-order, and sustainable-spending probes against the extracted engine.

Sprint 208 checkpoint doc: [`docs/sprint_208_account_and_sustain_probe_coverage.md`](docs/sprint_208_account_and_sustain_probe_coverage.md).

### Sprint 207: Canadian Rule Probe Coverage

**Complete 2026-05-23.** Repaired spousal RRSP, CPP sharing, and OAS recovery probes against the extracted engine.

Sprint 207 checkpoint doc: [`docs/sprint_207_canadian_rule_probe_coverage.md`](docs/sprint_207_canadian_rule_probe_coverage.md).

### Sprint 206: Legacy Probe Repair

**Complete 2026-05-23.** Started the probe repair batch by moving broken legacy probes off brittle HTML inline-script extraction.

Sprint 206 checkpoint doc: [`docs/sprint_206_legacy_probe_repair.md`](docs/sprint_206_legacy_probe_repair.md).

### Sprint 205: Pension Baseline Guardrails

**Complete 2026-05-23.** Added guardrail tests for DB pension baseline splitting and candidate discipline.

Sprint 205 checkpoint doc: [`docs/sprint_205_pension_baseline_guardrails.md`](docs/sprint_205_pension_baseline_guardrails.md).

### Sprint 204: Pension Baseline Copy

**Complete 2026-05-23.** Explained DB pension-splitting baseline inclusion in Results.

Sprint 204 checkpoint doc: [`docs/sprint_204_pension_baseline_copy.md`](docs/sprint_204_pension_baseline_copy.md).

### Sprint 203: Pension Candidate Discipline

**Complete 2026-05-23.** Prevented DB pension splitting from appearing as a found optimizer option when already included in baseline.

Sprint 203 checkpoint doc: [`docs/sprint_203_pension_candidate_discipline.md`](docs/sprint_203_pension_candidate_discipline.md).

### Sprint 202: Baseline DB Pension Splitting

**Complete 2026-05-23.** Included DB pension splitting in current-plan baseline configs for eligible two-person plans.

Sprint 202 checkpoint doc: [`docs/sprint_202_baseline_db_pension_splitting.md`](docs/sprint_202_baseline_db_pension_splitting.md).

### Sprint 201: Pension-Splitting Baseline Investigation

**Complete 2026-05-23.** Investigated checkpoint feedback and decided DB pension splitting belongs in the baseline for eligible couples.

Sprint 201 checkpoint doc: [`docs/sprint_201_pension_splitting_baseline_investigation.md`](docs/sprint_201_pension_splitting_baseline_investigation.md).

### Sprint 200: Checkpoint Panels Gate

**Complete 2026-05-23.** Gated checkpoint-only panels out of the normal consumer Details path.

Sprint 200 checkpoint doc: [`docs/sprint_200_checkpoint_panels_gate.md`](docs/sprint_200_checkpoint_panels_gate.md).

### Sprint 199: Scope And Diagnostic Copy

**Complete 2026-05-23.** Made Ontario 2026 scope visible in Results and removed diagnostic withdrawal wording from consumer intake.

Sprint 199 checkpoint doc: [`docs/sprint_199_scope_and_diagnostic_copy.md`](docs/sprint_199_scope_and_diagnostic_copy.md).

### Sprint 198: Overview Density Trim

**Complete 2026-05-23.** Trimmed compact optimizer and readiness diagnostics from Overview.

Sprint 198 checkpoint doc: [`docs/sprint_198_overview_density_trim.md`](docs/sprint_198_overview_density_trim.md).

### Sprint 197: Save Backup Trust

**Complete 2026-05-23.** Added backup reminders and save-before-results/report prompts.

Sprint 197 checkpoint doc: [`docs/sprint_197_save_backup_trust.md`](docs/sprint_197_save_backup_trust.md).

### Sprint 196: Checkpoint Trust Response

**Complete 2026-05-23.** Started the checkpoint response batch with narrow trust fixes instead of visual redesign.

Sprint 196 checkpoint doc: [`docs/sprint_196_checkpoint_trust_response.md`](docs/sprint_196_checkpoint_trust_response.md).

### Sprint 195: Checkpoint Review Board Closeout

**Complete 2026-05-22.** Closed the checkpoint review board batch before the broader user/model feedback checkpoint.

Sprint 195 checkpoint doc: [`docs/sprint_195_checkpoint_review_board_closeout.md`](docs/sprint_195_checkpoint_review_board_closeout.md).

### Sprint 194: Checkpoint Review Guardrails

**Complete 2026-05-22.** Added selector and UI structure guardrails for the checkpoint review board.

Sprint 194 checkpoint doc: [`docs/sprint_194_checkpoint_review_guardrails.md`](docs/sprint_194_checkpoint_review_guardrails.md).

### Sprint 193: Checkpoint Review Details Surface

**Complete 2026-05-22.** Surfaced the checkpoint review board in Details.

Sprint 193 checkpoint doc: [`docs/sprint_193_checkpoint_review_details_surface.md`](docs/sprint_193_checkpoint_review_details_surface.md).

### Sprint 192: Checkpoint Feedback Buckets

**Complete 2026-05-22.** Grouped checkpoint items into fix-first, review-now, and later-UX-pass lanes.

Sprint 192 checkpoint doc: [`docs/sprint_192_checkpoint_feedback_buckets.md`](docs/sprint_192_checkpoint_feedback_buckets.md).

### Sprint 191: Checkpoint Review Board Selector

**Complete 2026-05-22.** Added a runtime-only checkpoint review board selector.

Sprint 191 checkpoint doc: [`docs/sprint_191_checkpoint_review_board_selector.md`](docs/sprint_191_checkpoint_review_board_selector.md).

### Sprint 190: Feedback Review Package Closeout

**Complete 2026-05-22.** Closed the feedback review package batch before the broader v1 feedback pass.

Sprint 190 checkpoint doc: [`docs/sprint_190_feedback_review_package_closeout.md`](docs/sprint_190_feedback_review_package_closeout.md).

### Sprint 189: Feedback Review Overview Boundary

**Complete 2026-05-22.** Confirmed the feedback review package remains in Details and out of Overview.

Sprint 189 checkpoint doc: [`docs/sprint_189_feedback_review_overview_boundary.md`](docs/sprint_189_feedback_review_overview_boundary.md).

### Sprint 188: Feedback Review Package Guardrail Tests

**Complete 2026-05-22.** Added tests for ready and blocked feedback review package states without persisted output.

Sprint 188 checkpoint doc: [`docs/sprint_188_feedback_review_package_guardrails.md`](docs/sprint_188_feedback_review_package_guardrails.md).

### Sprint 187: Feedback Review Details Surface

**Complete 2026-05-22.** Surfaced the feedback review package in Details.

Sprint 187 checkpoint doc: [`docs/sprint_187_feedback_review_details_surface.md`](docs/sprint_187_feedback_review_details_surface.md).

### Sprint 186: Feedback Review Package Selector

**Complete 2026-05-22.** Added a runtime-only feedback review package selector.

Sprint 186 checkpoint doc: [`docs/sprint_186_feedback_review_package_selector.md`](docs/sprint_186_feedback_review_package_selector.md).

### Sprint 185: Release Readiness Checkpoint Closeout

**Complete 2026-05-22.** Closed the release-readiness checkpoint batch before the broader v1 feedback pass.

Sprint 185 checkpoint doc: [`docs/sprint_185_release_readiness_checkpoint_closeout.md`](docs/sprint_185_release_readiness_checkpoint_closeout.md).

### Sprint 184: Release Readiness Overview Boundary

**Complete 2026-05-22.** Confirmed the release-readiness checkpoint remains in Details and out of Overview.

Sprint 184 checkpoint doc: [`docs/sprint_184_release_readiness_overview_boundary.md`](docs/sprint_184_release_readiness_overview_boundary.md).

### Sprint 183: Release Readiness Guardrail Tests

**Complete 2026-05-22.** Added selector tests for ready and blocked release-readiness states without persisted output.

Sprint 183 checkpoint doc: [`docs/sprint_183_release_readiness_guardrail_tests.md`](docs/sprint_183_release_readiness_guardrail_tests.md).

### Sprint 182: Release Readiness Details Surface

**Complete 2026-05-22.** Surfaced release-readiness rows in Details.

Sprint 182 checkpoint doc: [`docs/sprint_182_release_readiness_details_surface.md`](docs/sprint_182_release_readiness_details_surface.md).

### Sprint 181: Release Readiness Selector

**Complete 2026-05-22.** Added runtime-only release-readiness checkpoint selector.

Sprint 181 checkpoint doc: [`docs/sprint_181_release_readiness_selector.md`](docs/sprint_181_release_readiness_selector.md).

### Sprint 180: Drawdown Review Copy Polish Closeout

**Complete 2026-05-22.** Closed the drawdown review copy polish batch before v1 checkpoint preparation.

Sprint 180 checkpoint doc: [`docs/sprint_180_drawdown_review_copy_polish_closeout.md`](docs/sprint_180_drawdown_review_copy_polish_closeout.md).

### Sprint 179: Drawdown Review Overview Boundary Retest

**Complete 2026-05-22.** Retested that the polished drawdown review labels remain in Details and out of Overview.

Sprint 179 checkpoint doc: [`docs/sprint_179_drawdown_review_overview_boundary_retest.md`](docs/sprint_179_drawdown_review_overview_boundary_retest.md).

### Sprint 178: Drawdown Review Plain-Language Guardrail

**Complete 2026-05-22.** Added selector coverage to keep recommended-plan drawdown copy free of implementation labels.

Sprint 178 checkpoint doc: [`docs/sprint_178_drawdown_review_plain_language_guardrail.md`](docs/sprint_178_drawdown_review_plain_language_guardrail.md).

### Sprint 177: Drawdown Review Selector Copy Polish

**Complete 2026-05-22.** Polished selector headlines, details, and notes that flow into the visible drawdown review.

Sprint 177 checkpoint doc: [`docs/sprint_177_drawdown_review_selector_copy_polish.md`](docs/sprint_177_drawdown_review_selector_copy_polish.md).

### Sprint 176: Drawdown Review Visible Label Scrub

**Complete 2026-05-22.** Replaced implementation-style drawdown labels in React Details with consumer-facing review labels.

Sprint 176 checkpoint doc: [`docs/sprint_176_drawdown_review_visible_label_scrub.md`](docs/sprint_176_drawdown_review_visible_label_scrub.md).

### Sprint 175: Details Drawdown Review Closeout

**Complete 2026-05-22.** Closed the Details-facing implementation batch for recommended-plan drawdown review.

Sprint 175 checkpoint doc: [`docs/sprint_175_details_drawdown_review_closeout.md`](docs/sprint_175_details_drawdown_review_closeout.md).

### Sprint 174: Drawdown Review Overview And Persistence Guardrails

**Complete 2026-05-22.** Added structure coverage to keep recommended-plan drawdown review in Details and out of Overview.

Sprint 174 checkpoint doc: [`docs/sprint_174_drawdown_review_overview_persistence_guardrails.md`](docs/sprint_174_drawdown_review_overview_persistence_guardrails.md).

### Sprint 173: Drawdown Review Copy Guard UI

**Complete 2026-05-22.** Surfaced review copy guard checks in Details.

Sprint 173 checkpoint doc: [`docs/sprint_173_drawdown_review_copy_guard_ui.md`](docs/sprint_173_drawdown_review_copy_guard_ui.md).

### Sprint 172: Recommended-Plan Drawdown Details UI

**Complete 2026-05-22.** Added Details cards for recommended-plan drawdown review, placement, and closeout evidence.

Sprint 172 checkpoint doc: [`docs/sprint_172_recommended_plan_drawdown_details_ui.md`](docs/sprint_172_recommended_plan_drawdown_details_ui.md).

### Sprint 171: Details Drawdown Review Wiring

**Complete 2026-05-22.** Wired v1 drawdown re-entry and recommended-plan review selectors into the React preview state.

Sprint 171 checkpoint doc: [`docs/sprint_171_details_drawdown_review_wiring.md`](docs/sprint_171_details_drawdown_review_wiring.md).

### Sprint 170: Recommended-Plan Drawdown Review Closeout

**Complete 2026-05-22.** Marked recommended-plan drawdown review polish ready for implementation while keeping it review-only and Details-scoped.

Sprint 170 checkpoint doc: [`docs/sprint_170_recommended_plan_drawdown_closeout.md`](docs/sprint_170_recommended_plan_drawdown_closeout.md).

### Sprint 169: Recommended-Plan Drawdown Persistence Guardrails

**Complete 2026-05-22.** Kept recommended-plan drawdown review, placement, copy, and closeout output runtime-only.

Sprint 169 checkpoint doc: [`docs/sprint_169_recommended_plan_drawdown_persistence.md`](docs/sprint_169_recommended_plan_drawdown_persistence.md).

### Sprint 168: V1 Drawdown Review Copy Guard

**Complete 2026-05-22.** Added copy guardrails for advice-like, instruction-like, saved-output, and Overview-heavy framing.

Sprint 168 checkpoint doc: [`docs/sprint_168_v1_drawdown_review_copy_guard.md`](docs/sprint_168_v1_drawdown_review_copy_guard.md).

### Sprint 167: V1 Drawdown Details Placement

**Complete 2026-05-22.** Kept bounded drawdown comparison rows, limits, and review actions in Details.

Sprint 167 checkpoint doc: [`docs/sprint_167_v1_drawdown_details_placement.md`](docs/sprint_167_v1_drawdown_details_placement.md).

### Sprint 166: Recommended-Plan Drawdown Review

**Complete 2026-05-22.** Framed bounded drawdown execution as a recommended-plan Details review item.

Sprint 166 checkpoint doc: [`docs/sprint_166_recommended_plan_drawdown_review.md`](docs/sprint_166_recommended_plan_drawdown_review.md).

### Sprint 165: V1 Drawdown Re-Entry Closeout

**Complete 2026-05-22.** Closed the session as ready for the next bounded drawdown sprint after detailed stress deferral.

Sprint 165 checkpoint doc: [`docs/sprint_165_v1_drawdown_reentry_closeout.md`](docs/sprint_165_v1_drawdown_reentry_closeout.md).

### Sprint 164: V1 Drawdown Re-Entry Persistence Guardrails

**Complete 2026-05-22.** Kept v1 drawdown re-entry, next-sprint, and closeout output runtime-only.

Sprint 164 checkpoint doc: [`docs/sprint_164_v1_drawdown_reentry_persistence.md`](docs/sprint_164_v1_drawdown_reentry_persistence.md).

### Sprint 163: V1 Drawdown Re-Entry Hold And Block Paths

**Complete 2026-05-22.** Added hold and blocked paths for detailed-stress review, examples, phase, and saved-plan boundaries.

Sprint 163 checkpoint doc: [`docs/sprint_163_v1_drawdown_reentry_guardrails.md`](docs/sprint_163_v1_drawdown_reentry_guardrails.md).

### Sprint 162: V1 Drawdown Next Sprint Plan

**Complete 2026-05-22.** Marked recommended-plan framing and bounded drawdown review polish as the next sprint focus.

Sprint 162 checkpoint doc: [`docs/sprint_162_v1_drawdown_next_sprint_plan.md`](docs/sprint_162_v1_drawdown_next_sprint_plan.md).

### Sprint 161: V1 Drawdown Re-Entry Review

**Complete 2026-05-22.** Added runtime-only re-entry review after detailed stress deferral.

Sprint 161 checkpoint doc: [`docs/sprint_161_v1_drawdown_reentry_review.md`](docs/sprint_161_v1_drawdown_reentry_review.md).

### Sprint 160: Detailed Stress V1 Decision Closeout

**Complete 2026-05-22.** Closed the detailed-stress decision batch by deferring migration for v1 and returning focus to recommended-plan and bounded drawdown execution.

Sprint 160 checkpoint doc: [`docs/sprint_160_detailed_stress_v1_decision_closeout.md`](docs/sprint_160_detailed_stress_v1_decision_closeout.md).

### Sprint 159: Detailed Stress Decision Persistence Guardrails

**Complete 2026-05-22.** Kept detailed-stress v1 decision and closeout output runtime-only.

Sprint 159 checkpoint doc: [`docs/sprint_159_detailed_stress_decision_persistence.md`](docs/sprint_159_detailed_stress_decision_persistence.md).

### Sprint 158: Detailed Stress Decision Review Paths

**Complete 2026-05-22.** Added review and blocked paths for product value, migration risk, comparison, and saved-plan boundaries.

Sprint 158 checkpoint doc: [`docs/sprint_158_detailed_stress_decision_review_paths.md`](docs/sprint_158_detailed_stress_decision_review_paths.md).

### Sprint 157: Detailed Stress V1 Deferral Decision

**Complete 2026-05-22.** Defaulted clean detailed-stress comparison to keeping detailed stress in the detailed report for v1.

Sprint 157 checkpoint doc: [`docs/sprint_157_detailed_stress_v1_deferral.md`](docs/sprint_157_detailed_stress_v1_deferral.md).

### Sprint 156: Detailed Stress V1 Decision Selector

**Complete 2026-05-22.** Added runtime-only decision rows for the detailed-stress v1 migrate-or-defer checkpoint.

Sprint 156 checkpoint doc: [`docs/sprint_156_detailed_stress_v1_decision_selector.md`](docs/sprint_156_detailed_stress_v1_decision_selector.md).

### Sprint 155: Detailed Stress Manual Comparison Closeout

**Complete 2026-05-22.** Closed the manual comparison batch as ready for a migrate-or-defer decision checkpoint while keeping detailed stress execution in the detailed-report path.

Sprint 155 checkpoint doc: [`docs/sprint_155_detailed_stress_manual_comparison_closeout.md`](docs/sprint_155_detailed_stress_manual_comparison_closeout.md).

### Sprint 154: Detailed Stress Comparison Persistence Guardrails

**Complete 2026-05-22.** Kept detailed-report reference, manual comparison, and closeout output runtime-only.

Sprint 154 checkpoint doc: [`docs/sprint_154_detailed_stress_comparison_persistence.md`](docs/sprint_154_detailed_stress_comparison_persistence.md).

### Sprint 153: Detailed Stress Review And Block Thresholds

**Complete 2026-05-22.** Marked metric differences for review and blocked incomplete bridge or saved-plan failures.

Sprint 153 checkpoint doc: [`docs/sprint_153_detailed_stress_review_block_thresholds.md`](docs/sprint_153_detailed_stress_review_block_thresholds.md).

### Sprint 152: Detailed Stress Manual Comparison Rows

**Complete 2026-05-22.** Compared bridge output to detailed-report reference metadata across shape, funded rate, Monte Carlo runs, and historical sequences.

Sprint 152 checkpoint doc: [`docs/sprint_152_detailed_stress_manual_comparison_rows.md`](docs/sprint_152_detailed_stress_manual_comparison_rows.md).

### Sprint 151: Detailed Stress Report Reference Metadata

**Complete 2026-05-22.** Added runtime-only detailed-report reference metadata for manual comparison.

Sprint 151 checkpoint doc: [`docs/sprint_151_detailed_stress_report_reference.md`](docs/sprint_151_detailed_stress_report_reference.md).

### Sprint 150: Detailed Stress Probe-Backed Bridge Closeout

**Complete 2026-05-22.** Closed the bridge batch as ready for manual detailed-report comparison while keeping detailed stress execution in the detailed-report path.

Sprint 150 checkpoint doc: [`docs/sprint_150_detailed_stress_bridge_closeout.md`](docs/sprint_150_detailed_stress_bridge_closeout.md).

### Sprint 149: Detailed Stress Bridge Persistence Guardrails

**Complete 2026-05-22.** Kept detailed-stress coverage, bridge, bridge run, and closeout output runtime-only.

Sprint 149 checkpoint doc: [`docs/sprint_149_detailed_stress_bridge_persistence.md`](docs/sprint_149_detailed_stress_bridge_persistence.md).

### Sprint 148: Detailed Stress Guarded Bridge Run

**Complete 2026-05-22.** Added a bridge runner that calls the injected runner only when bridge readiness is clean.

Sprint 148 checkpoint doc: [`docs/sprint_148_detailed_stress_guarded_bridge_run.md`](docs/sprint_148_detailed_stress_guarded_bridge_run.md).

### Sprint 147: Detailed Stress Probe-Backed Bridge Readiness

**Complete 2026-05-22.** Required prototype closeout, probe coverage, runner injection, and saved-plan guardrails before bridge checks.

Sprint 147 checkpoint doc: [`docs/sprint_147_detailed_stress_probe_backed_bridge.md`](docs/sprint_147_detailed_stress_probe_backed_bridge.md).

### Sprint 146: Detailed Stress Probe Coverage Summary

**Complete 2026-05-22.** Added runtime-only probe coverage summary for detailed stress bridge work.

Sprint 146 checkpoint doc: [`docs/sprint_146_detailed_stress_probe_coverage.md`](docs/sprint_146_detailed_stress_probe_coverage.md).

### Sprint 145: Detailed Stress Injected Runner Prototype Closeout

**Complete 2026-05-22.** Closed the prototype batch as ready for a future probe-backed runner bridge while keeping detailed stress execution in the detailed-report path.

Sprint 145 checkpoint doc: [`docs/sprint_145_detailed_stress_prototype_closeout.md`](docs/sprint_145_detailed_stress_prototype_closeout.md).

### Sprint 144: Detailed Stress Prototype Persistence Guardrails

**Complete 2026-05-22.** Kept detailed-stress prototype request, result, and closeout output runtime-only.

Sprint 144 checkpoint doc: [`docs/sprint_144_detailed_stress_prototype_persistence.md`](docs/sprint_144_detailed_stress_prototype_persistence.md).

### Sprint 143: Detailed Stress Prototype Output Validation

**Complete 2026-05-22.** Blocked injected-runner results that do not match existing detailed stress shape metadata.

Sprint 143 checkpoint doc: [`docs/sprint_143_detailed_stress_prototype_output_validation.md`](docs/sprint_143_detailed_stress_prototype_output_validation.md).

### Sprint 142: Detailed Stress Injected Runner Harness

**Complete 2026-05-22.** Added a contained prototype harness that calls only a supplied injected runner.

Sprint 142 checkpoint doc: [`docs/sprint_142_detailed_stress_injected_runner_harness.md`](docs/sprint_142_detailed_stress_injected_runner_harness.md).

### Sprint 141: Detailed Stress Explicit Request

**Complete 2026-05-22.** Added a copied explicit plan/config request for future detailed-stress adapter work.

Sprint 141 checkpoint doc: [`docs/sprint_141_detailed_stress_explicit_request.md`](docs/sprint_141_detailed_stress_explicit_request.md).

### Sprint 140: Detailed Stress Adapter Contract Closeout

**Complete 2026-05-21.** Closed the adapter-contract batch as ready for a contained injected-runner prototype while keeping detailed stress execution in the detailed-report path.

Sprint 140 checkpoint doc: [`docs/sprint_140_detailed_stress_adapter_closeout.md`](docs/sprint_140_detailed_stress_adapter_closeout.md).

### Sprint 139: Detailed Stress Adapter Validation

**Complete 2026-05-21.** Added validation that combines boundary review, migration closeout, adapter contract, probe coverage, and saved-plan boundaries.

Sprint 139 checkpoint doc: [`docs/sprint_139_detailed_stress_adapter_validation.md`](docs/sprint_139_detailed_stress_adapter_validation.md).

### Sprint 138: Detailed Stress Output Guardrails

**Complete 2026-05-21.** Required future adapter work to return existing detailed stress shapes and keep adapter output runtime-only.

Sprint 138 checkpoint doc: [`docs/sprint_138_detailed_stress_output_guardrails.md`](docs/sprint_138_detailed_stress_output_guardrails.md).

### Sprint 137: Detailed Stress Injected Runner Boundary

**Complete 2026-05-21.** Kept Monte Carlo and historical replay behind detailed-report runner ownership instead of allowing direct React execution.

Sprint 137 checkpoint doc: [`docs/sprint_137_detailed_stress_injected_runner_boundary.md`](docs/sprint_137_detailed_stress_injected_runner_boundary.md).

### Sprint 136: Thin Detailed Stress Adapter Contract

**Complete 2026-05-21.** Added runtime-only contract metadata for explicit plan/config inputs and a future injected detailed-stress runner.

Sprint 136 checkpoint doc: [`docs/sprint_136_thin_detailed_stress_adapter_contract.md`](docs/sprint_136_thin_detailed_stress_adapter_contract.md).

### Sprint 135: Detailed Stress Boundary Closeout

**Complete 2026-05-21.** Marked a future thin detailed-stress adapter as the next safe step while leaving Monte Carlo and historical sequence execution in the detailed-report path.

Sprint 135 checkpoint doc: [`docs/sprint_135_detailed_stress_boundary_closeout.md`](docs/sprint_135_detailed_stress_boundary_closeout.md).

### Sprint 134: Detailed Stress Adapter Next Step

**Complete 2026-05-21.** Recorded the next safe migration slice as adapter-contract design, not execution migration.

Sprint 134 checkpoint doc: [`docs/sprint_134_detailed_stress_adapter_next_step.md`](docs/sprint_134_detailed_stress_adapter_next_step.md).

### Sprint 133: Detailed Stress No-Migration Closeout

**Complete 2026-05-21.** Kept Monte Carlo, progressive Monte Carlo, and historical sequence execution in the detailed-report path.

Sprint 133 checkpoint doc: [`docs/sprint_133_detailed_stress_no_migration.md`](docs/sprint_133_detailed_stress_no_migration.md).

### Sprint 132: Detailed Stress Probe And Persistence Guardrails

**Complete 2026-05-21.** Added runtime-only rows for detailed stress probe coverage and saved-plan boundaries.

Sprint 132 checkpoint doc: [`docs/sprint_132_detailed_stress_probe_persistence.md`](docs/sprint_132_detailed_stress_probe_persistence.md).

### Sprint 131: Detailed Stress Boundary Map

**Complete 2026-05-21.** Recorded detailed-report ownership for Monte Carlo, progressive Monte Carlo, historical sequence replay, and full-spending-funded metrics.

Sprint 131 checkpoint doc: [`docs/sprint_131_detailed_stress_boundary_map.md`](docs/sprint_131_detailed_stress_boundary_map.md).

### Sprint 130: Spending Stress Ownership Closeout

**Complete 2026-05-21.** Marked nearby spending stress as owned by the stress helper boundary while keeping Monte Carlo and historical sequence migration for later.

Sprint 130 checkpoint doc: [`docs/sprint_130_spending_stress_ownership_closeout.md`](docs/sprint_130_spending_stress_ownership_closeout.md).

### Sprint 129: Spending Stress Guardrail Tests

**Complete 2026-05-21.** Added working-copy, higher-spending skip, example, and saved-plan tests for spending stress helper ownership.

Sprint 129 checkpoint doc: [`docs/sprint_129_spending_stress_guardrail_tests.md`](docs/sprint_129_spending_stress_guardrail_tests.md).

### Sprint 128: Preview Spending Stress Compatibility

**Complete 2026-05-21.** Kept the preview bundle and compatibility exports stable while delegating nearby spending stress work.

Sprint 128 checkpoint doc: [`docs/sprint_128_preview_spending_stress_compatibility.md`](docs/sprint_128_preview_spending_stress_compatibility.md).

### Sprint 127: Spending Stress Summary Helper

**Complete 2026-05-21.** Moved spending stress interpretation into the stress helper module.

Sprint 127 checkpoint doc: [`docs/sprint_127_spending_stress_summary_helper.md`](docs/sprint_127_spending_stress_summary_helper.md).

### Sprint 126: Spending Stress Rerun Helper

**Complete 2026-05-21.** Moved nearby spending stress working-copy rerun orchestration into the stress helper module.

Sprint 126 checkpoint doc: [`docs/sprint_126_spending_stress_rerun_helper.md`](docs/sprint_126_spending_stress_rerun_helper.md).

### Sprint 125: Stress Helper Extraction Closeout

**Complete 2026-05-21.** Added a closeout that keeps scenario stress, Monte Carlo, and historical sequence migration as later slices after baseline stress helper extraction.

Sprint 125 checkpoint doc: [`docs/sprint_125_stress_helper_closeout.md`](docs/sprint_125_stress_helper_closeout.md).

### Sprint 124: Stress Helper Example And Persistence Coverage

**Complete 2026-05-21.** Added bundled-example and saved-plan coverage for the extracted baseline stress helpers.

Sprint 124 checkpoint doc: [`docs/sprint_124_stress_helper_example_coverage.md`](docs/sprint_124_stress_helper_example_coverage.md).

### Sprint 123: Stress Extraction Boundary

**Complete 2026-05-21.** Added runtime-only metadata for baseline stress helper ownership and held/later stress surfaces.

Sprint 123 checkpoint doc: [`docs/sprint_123_stress_extraction_boundary.md`](docs/sprint_123_stress_extraction_boundary.md).

### Sprint 122: Stress Selector Compatibility Exports

**Complete 2026-05-21.** Kept existing `resultSelectors` stress exports stable while moving implementation ownership.

Sprint 122 checkpoint doc: [`docs/sprint_122_stress_selector_compatibility.md`](docs/sprint_122_stress_selector_compatibility.md).

### Sprint 121: Baseline Stress Helper Module

**Complete 2026-05-21.** Moved baseline stress indicator, stress row, and summary logic into an engine-owned stress helper module.

Sprint 121 checkpoint doc: [`docs/sprint_121_baseline_stress_helper_module.md`](docs/sprint_121_baseline_stress_helper_module.md).

### Sprint 120: Engine Extraction Readiness Closeout

**Complete 2026-05-21.** Added a closeout that marks narrow stress-helper extraction as the next logical slice while preserving simulation math and optimizer behavior.

Sprint 120 checkpoint doc: [`docs/sprint_120_engine_extraction_closeout.md`](docs/sprint_120_engine_extraction_closeout.md).

### Sprint 119: Engine Extraction Example And Persistence Gate

**Complete 2026-05-21.** Added example-plan coverage and saved-plan guardrails for extraction readiness output.

Sprint 119 checkpoint doc: [`docs/sprint_119_engine_extraction_example_gate.md`](docs/sprint_119_engine_extraction_example_gate.md).

### Sprint 118: Engine Extraction Readiness Selector

**Complete 2026-05-21.** Added a runtime-only readiness selector for extraction boundaries and remaining held items.

Sprint 118 checkpoint doc: [`docs/sprint_118_engine_extraction_readiness_selector.md`](docs/sprint_118_engine_extraction_readiness_selector.md).

### Sprint 117: Preview Runner Boundary

**Complete 2026-05-21.** Recorded preview runner injection, working-copy scenario, survivor config, and non-persistence boundaries.

Sprint 117 checkpoint doc: [`docs/sprint_117_preview_runner_boundary.md`](docs/sprint_117_preview_runner_boundary.md).

### Sprint 116: Runtime Boundary Metadata

**Complete 2026-05-21.** Recorded the current plan-object simulation boundary and remaining browser-source bridge ownership.

Sprint 116 checkpoint doc: [`docs/sprint_116_runtime_boundary_metadata.md`](docs/sprint_116_runtime_boundary_metadata.md).

### Sprint 115: Bounded Drawdown UX Readiness Closeout

**Complete 2026-05-21.** Added a Details-only closeout for whether the bounded drawdown UX candidate is ready for later design polish.

Sprint 115 checkpoint doc: [`docs/sprint_115_bounded_drawdown_ux_readiness.md`](docs/sprint_115_bounded_drawdown_ux_readiness.md).

### Sprint 114: Bounded Drawdown UX Copy Guard

**Complete 2026-05-21.** Added copy guard checks that keep the UX candidate review-oriented and protect the saved-plan boundary.

Sprint 114 checkpoint doc: [`docs/sprint_114_bounded_drawdown_ux_copy_guard.md`](docs/sprint_114_bounded_drawdown_ux_copy_guard.md).

### Sprint 113: Bounded Drawdown Review Actions

**Complete 2026-05-21.** Added short review actions for reading the bounded drawdown check without creating account instructions.

Sprint 113 checkpoint doc: [`docs/sprint_113_bounded_drawdown_review_actions.md`](docs/sprint_113_bounded_drawdown_review_actions.md).

### Sprint 112: Bounded Drawdown Comparison Card

**Complete 2026-05-21.** Added a compact current-plan comparison card for funding, tax, OAS recovery, and estate evidence.

Sprint 112 checkpoint doc: [`docs/sprint_112_bounded_drawdown_comparison_card.md`](docs/sprint_112_bounded_drawdown_comparison_card.md).

### Sprint 111: Bounded Drawdown UX Headline

**Complete 2026-05-21.** Added a plain Details-only headline for the bounded drawdown check.

Sprint 111 checkpoint doc: [`docs/sprint_111_bounded_drawdown_ux_headline.md`](docs/sprint_111_bounded_drawdown_ux_headline.md).

### Sprint 110: V1 Drawdown Consumer Closeout

**Complete 2026-05-21.** Added a Details-only closeout for whether bounded execution output is clear enough for later consumer UX copy.

Sprint 110 checkpoint doc: [`docs/sprint_110_v1_drawdown_consumer_closeout.md`](docs/sprint_110_v1_drawdown_consumer_closeout.md).

### Sprint 109: V1 Drawdown Consumer Example Gate

**Complete 2026-05-21.** Extended all-example coverage to the consumer-readable bounded execution layer.

Sprint 109 checkpoint doc: [`docs/sprint_109_v1_drawdown_consumer_example_gate.md`](docs/sprint_109_v1_drawdown_consumer_example_gate.md).

### Sprint 108: V1 Drawdown Consumer Limits

**Complete 2026-05-21.** Added visible limits explaining that the bounded execution result is one scenario, not advice, not saved, and not a full drawdown plan.

Sprint 108 checkpoint doc: [`docs/sprint_108_v1_drawdown_consumer_limits.md`](docs/sprint_108_v1_drawdown_consumer_limits.md).

### Sprint 107: V1 Drawdown Safety Checklist

**Complete 2026-05-21.** Added funding, estate, saved-plan, and instruction checks for the bounded execution result.

Sprint 107 checkpoint doc: [`docs/sprint_107_v1_drawdown_safety_checklist.md`](docs/sprint_107_v1_drawdown_safety_checklist.md).

### Sprint 106: V1 Drawdown Plain Summary

**Complete 2026-05-21.** Added a plain summary that explains what ran, what changed, and what did not change in the bounded execution result.

Sprint 106 checkpoint doc: [`docs/sprint_106_v1_drawdown_plain_summary.md`](docs/sprint_106_v1_drawdown_plain_summary.md).

### Sprint 105: V1 Drawdown Execution Phase Closeout

**Complete 2026-05-21.** Added a Details-only closeout for whether the first bounded execution path is ready for later consumer UX.

Sprint 105 checkpoint doc: [`docs/sprint_105_v1_drawdown_execution_phase_closeout.md`](docs/sprint_105_v1_drawdown_execution_phase_closeout.md).

### Sprint 104: V1 Drawdown Execution Review And Example Gate

**Complete 2026-05-21.** Added review and example-gate coverage for the first bounded execution result while keeping it unsaved and non-advisory.

Sprint 104 checkpoint doc: [`docs/sprint_104_v1_drawdown_execution_review.md`](docs/sprint_104_v1_drawdown_execution_review.md).

### Sprint 103: V1 Bounded Execution Result

**Complete 2026-05-21.** Ran one bounded registered-timing scenario through existing engine plumbing and compared funding, tax, OAS recovery, and estate movement.

Sprint 103 checkpoint doc: [`docs/sprint_103_v1_bounded_execution_result.md`](docs/sprint_103_v1_bounded_execution_result.md).

### Sprint 102: V1 Bounded Execution Candidate

**Complete 2026-05-21.** Converted one accepted draft shape into one existing-engine execution candidate without saving annual overrides.

Sprint 102 checkpoint doc: [`docs/sprint_102_v1_bounded_execution_candidate.md`](docs/sprint_102_v1_bounded_execution_candidate.md).

### Sprint 101: V1 Drawdown Execution Intent

**Complete 2026-05-21.** Recorded the product decision that v1 should include bounded drawdown execution, while keeping the first execution path small and review-first.

Sprint 101 checkpoint doc: [`docs/sprint_101_v1_drawdown_execution_intent.md`](docs/sprint_101_v1_drawdown_execution_intent.md).

### Sprint 100: Contained Prototype Phase Milestone

**Complete 2026-05-21.** Added a Details-only phase milestone that combines promotion readiness, next steps, blockers, example promotion coverage, and saved-plan checks before any broader drawdown work.

Sprint 100 checkpoint doc: [`docs/sprint_100_contained_prototype_phase_milestone.md`](docs/sprint_100_contained_prototype_phase_milestone.md).

### Sprint 99: Contained Prototype Example Promotion Gate

**Complete 2026-05-21.** Added an example promotion gate so the new promotion-readiness layer remains covered by built-in example checks without overclaiming in the live product view.

Sprint 99 checkpoint doc: [`docs/sprint_99_contained_prototype_example_promotion_gate.md`](docs/sprint_99_contained_prototype_example_promotion_gate.md).

### Sprint 98: Contained Prototype Blocker Register

**Complete 2026-05-21.** Added a compact register of held and blocked signals before any later drawdown phase.

Sprint 98 checkpoint doc: [`docs/sprint_98_contained_prototype_blocker_register.md`](docs/sprint_98_contained_prototype_blocker_register.md).

### Sprint 97: Contained Prototype Next-Step Guide

**Complete 2026-05-21.** Added a Details-only guide for how to read the contained prototype without treating it as account instructions.

Sprint 97 checkpoint doc: [`docs/sprint_97_contained_prototype_next_step_guide.md`](docs/sprint_97_contained_prototype_next_step_guide.md).

### Sprint 96: Contained Prototype Promotion Readiness

**Complete 2026-05-21.** Added a conservative promotion-readiness selector that can ready, hold, or block later UX consideration without promoting the prototype today.

Sprint 96 checkpoint doc: [`docs/sprint_96_contained_prototype_promotion_readiness.md`](docs/sprint_96_contained_prototype_promotion_readiness.md).

### Sprint 95: Contained Prototype Product Go/No-Go

**Complete 2026-05-21.** Added a Details-only product go/no-go that combines usefulness, density, checklist, example, copy, and saved-plan checks before any broader drawdown work.

Sprint 95 checkpoint doc: [`docs/sprint_95_contained_prototype_product_go_no_go.md`](docs/sprint_95_contained_prototype_product_go_no_go.md).

### Sprint 94: Contained Prototype Copy Guard

**Complete 2026-05-21.** Added copy guard rows that keep the contained prototype review-oriented and protect the saved-plan boundary.

Sprint 94 checkpoint doc: [`docs/sprint_94_contained_prototype_copy_guard.md`](docs/sprint_94_contained_prototype_copy_guard.md).

### Sprint 93: Contained Prototype Example Gate

**Complete 2026-05-21.** Added an example gate for contained prototype readiness while keeping the live product clear that the full matrix is checked in tests.

Sprint 93 checkpoint doc: [`docs/sprint_93_contained_prototype_example_gate.md`](docs/sprint_93_contained_prototype_example_gate.md).

### Sprint 92: Contained Prototype Review Checklist

**Complete 2026-05-21.** Added a Details-only checklist so users read the main answer, materiality, limits, and unchanged-plan boundary before interpreting the prototype.

Sprint 92 checkpoint doc: [`docs/sprint_92_contained_prototype_review_checklist.md`](docs/sprint_92_contained_prototype_review_checklist.md).

### Sprint 91: Contained Prototype Details Density

**Complete 2026-05-21.** Added a density selector that holds the contained prototype if the Details surface becomes too crowded.

Sprint 91 checkpoint doc: [`docs/sprint_91_contained_prototype_density.md`](docs/sprint_91_contained_prototype_density.md).

### Sprint 90: Contained Prototype Usefulness Closeout

**Complete 2026-05-21.** Added a Details-only usefulness closeout that says whether the contained prototype is useful for review, needs clearer evidence, or should not be used.

Sprint 90 checkpoint doc: [`docs/sprint_90_contained_prototype_usefulness_closeout.md`](docs/sprint_90_contained_prototype_usefulness_closeout.md).

### Sprint 89: Contained Prototype Example And Copy Guard

**Complete 2026-05-21.** Extended all-example coverage across contained prototype materiality, explanation, limitations, usefulness, copy posture, and saved-plan boundaries.

Sprint 89 checkpoint doc: [`docs/sprint_89_contained_prototype_example_copy_guard.md`](docs/sprint_89_contained_prototype_example_copy_guard.md).

### Sprint 88: Contained Prototype Limitations

**Complete 2026-05-21.** Added visible limitations explaining that the contained prototype is a scenario, not custom annual override execution, advice, or a filing instruction.

Sprint 88 checkpoint doc: [`docs/sprint_88_contained_prototype_limitations.md`](docs/sprint_88_contained_prototype_limitations.md).

### Sprint 87: Contained Prototype Explanation

**Complete 2026-05-21.** Added plain why-it-moved explanation rows for contained prototype movement and caution.

Sprint 87 checkpoint doc: [`docs/sprint_87_contained_prototype_explanation.md`](docs/sprint_87_contained_prototype_explanation.md).

### Sprint 86: Contained Prototype Materiality

**Complete 2026-05-21.** Added a materiality selector so small contained prototype movement is held rather than overemphasized.

Sprint 86 checkpoint doc: [`docs/sprint_86_contained_prototype_materiality.md`](docs/sprint_86_contained_prototype_materiality.md).

### Sprint 85: Contained Drawdown Prototype Review

**Complete 2026-05-20.** Added a Details-only contained prototype summary that turns one scenario comparison into ready, hold, or blocked review evidence without creating a plan action.

Sprint 85 checkpoint doc: [`docs/sprint_85_contained_drawdown_prototype_review.md`](docs/sprint_85_contained_drawdown_prototype_review.md).

### Sprint 84: Contained Prototype Example Matrix

**Complete 2026-05-20.** Extended all-example coverage across contained prototype status, summary status, copy posture, and persistence boundaries.

Sprint 84 checkpoint doc: [`docs/sprint_84_contained_prototype_example_matrix.md`](docs/sprint_84_contained_prototype_example_matrix.md).

### Sprint 83: Details-Only Prototype Evidence

**Complete 2026-05-20.** Surfaced contained prototype evidence in Details only, with funding, tax, OAS recovery, estate, and calculation-boundary rows.

Sprint 83 checkpoint doc: [`docs/sprint_83_details_only_prototype_evidence.md`](docs/sprint_83_details_only_prototype_evidence.md).

### Sprint 82: Prototype Harm Checks

**Complete 2026-05-20.** Blocked the contained prototype when funding worsens or an entered estate goal may be weakened.

Sprint 82 checkpoint doc: [`docs/sprint_82_prototype_harm_checks.md`](docs/sprint_82_prototype_harm_checks.md).

### Sprint 81: One Contained Real Scenario

**Complete 2026-05-20.** Added one contained scenario comparison using existing engine plumbing while keeping current withdrawal order, empty annual overrides, and saved plans unchanged.

Sprint 81 checkpoint doc: [`docs/sprint_81_one_contained_real_scenario.md`](docs/sprint_81_one_contained_real_scenario.md).

### Sprint 80: Drawdown Execution Phase Closeout

**Complete 2026-05-20.** Added a Details-only closeout that summarizes preflight, adapter audit trail, containment, example coverage, and saved-plan boundaries before the next phase.

Sprint 80 checkpoint doc: [`docs/sprint_80_drawdown_execution_phase_closeout.md`](docs/sprint_80_drawdown_execution_phase_closeout.md).

### Sprint 79: Execution Example Matrix Checkpoint

**Complete 2026-05-20.** Extended all-example coverage across execution preflight, adapter audit trail, containment guard, phase closeout, copy posture, and persistence boundaries.

Sprint 79 checkpoint doc: [`docs/sprint_79_execution_example_matrix_checkpoint.md`](docs/sprint_79_execution_example_matrix_checkpoint.md).

### Sprint 78: Execution Containment Guard

**Complete 2026-05-20.** Added a Details-only containment guard proving the drawdown execution work has no plan action, no override calculation, no saved output, and only one draft shape.

Sprint 78 checkpoint doc: [`docs/sprint_78_execution_containment_guard.md`](docs/sprint_78_execution_containment_guard.md).

### Sprint 77: Adapter Audit Trail

**Complete 2026-05-20.** Added a draft adapter audit trail that explains source, year, account area, amount band, direction, and guardrails without creating household instructions.

Sprint 77 checkpoint doc: [`docs/sprint_77_adapter_audit_trail.md`](docs/sprint_77_adapter_audit_trail.md).

### Sprint 76: Prototype Preflight

**Complete 2026-05-20.** Added a Details-only preflight check for go/no-go, adapter, account mix, locked-in accounts, saved-plan boundary, and closed product path.

Sprint 76 checkpoint doc: [`docs/sprint_76_prototype_preflight.md`](docs/sprint_76_prototype_preflight.md).

### Sprint 75: Execution Prototype Go/No-Go

**Complete 2026-05-20.** Added a Details-only checkpoint that summarizes boundary, adapter, mocked-scorecard, saved-plan, and product-scope posture before any real drawdown execution prototype is attempted.

Sprint 75 checkpoint doc: [`docs/sprint_75_execution_prototype_go_no_go.md`](docs/sprint_75_execution_prototype_go_no_go.md).

### Sprint 74: One Mocked Execution Scorecard

**Complete 2026-05-20.** Added a test-only mocked scorecard that can compare supplied baseline and candidate rows for funding, tax, OAS recovery, and estate posture without product execution.

Sprint 74 checkpoint doc: [`docs/sprint_74_mocked_execution_scorecard.md`](docs/sprint_74_mocked_execution_scorecard.md).

### Sprint 73: Test-Only Adapter Rejection Harness

**Complete 2026-05-20.** Added adapter validation that rejects unsafe annual-override draft shapes while preserving current withdrawal order and empty annual overrides.

Sprint 73 checkpoint doc: [`docs/sprint_73_test_only_adapter_rejection_harness.md`](docs/sprint_73_test_only_adapter_rejection_harness.md).

### Sprint 72: Annual Override Adapter Shape

**Complete 2026-05-20.** Added a draft adapter shape for one eligible runtime contract payload without passing it to the simulation engine or saving it.

Sprint 72 checkpoint doc: [`docs/sprint_72_annual_override_adapter_shape.md`](docs/sprint_72_annual_override_adapter_shape.md).

### Sprint 71: Drawdown Execution Boundary Decision

**Complete 2026-05-20.** Added a Details-only boundary decision that decides whether to keep preview-only evidence, harden guardrails, or prepare a tiny future prototype.

Sprint 71 checkpoint doc: [`docs/sprint_71_drawdown_execution_boundary_decision.md`](docs/sprint_71_drawdown_execution_boundary_decision.md).

### Sprint 70: Drawdown Phase Review & Go/No-Go

**Complete 2026-05-20.** Added a Details-only phase review that summarizes gate, preview, example, stress, copy, and saved-plan posture before any deeper drawdown execution.

Sprint 70 checkpoint doc: [`docs/sprint_70_drawdown_phase_review_go_no_go.md`](docs/sprint_70_drawdown_phase_review_go_no_go.md).

### Sprint 69: Drawdown Preview Stress & Harm Checks

**Complete 2026-05-20.** Added stress and harm checks so the visible preview is held back under fragile spending stress and blocked when funding or entered estate-goal harm appears.

Sprint 69 checkpoint doc: [`docs/sprint_69_drawdown_preview_stress_harm_checks.md`](docs/sprint_69_drawdown_preview_stress_harm_checks.md).

### Sprint 68: Drawdown Preview Example Matrix

**Complete 2026-05-20.** Extended the built-in example matrix to cover final preview gate status, Details preview status, phase review status, copy boundaries, and saved-plan persistence.

Sprint 68 checkpoint doc: [`docs/sprint_68_drawdown_preview_example_matrix.md`](docs/sprint_68_drawdown_preview_example_matrix.md).

### Sprint 67: Visible Drawdown Review Preview

**Complete 2026-05-20.** Added a narrow Details-only drawdown review preview that shows high-level funding, tax, OAS recovery, and projected-money-left evidence when final guardrails allow it.

Sprint 67 checkpoint doc: [`docs/sprint_67_visible_drawdown_review_preview.md`](docs/sprint_67_visible_drawdown_review_preview.md).

### Sprint 66: Drawdown Prototype Decision Gate

**Complete 2026-05-20.** Added a final visible-review gate for the drawdown prototype that requires eligible comparison evidence, a ready runtime contract, a clean saved-plan boundary, and no visible harm.

Sprint 66 checkpoint doc: [`docs/sprint_66_drawdown_prototype_decision_gate.md`](docs/sprint_66_drawdown_prototype_decision_gate.md).

### Sprint 65: Drawdown Prototype Readiness Review

**Complete 2026-05-20.** Added a Details-only readiness review that summarizes the decision gate, runtime contract, saved-plan boundary, and internal dry-run posture before any user-facing drawdown prototype exists.

Sprint 65 checkpoint doc: [`docs/sprint_65_drawdown_prototype_readiness_review.md`](docs/sprint_65_drawdown_prototype_readiness_review.md).

### Sprint 64: Internal Drawdown Dry-Run Harness

**Complete 2026-05-20.** Added a test-only internal dry-run path for one bounded drawdown payload shape. It returns review evidence only and is not reachable from product UI.

Sprint 64 checkpoint doc: [`docs/sprint_64_internal_drawdown_dry_run_harness.md`](docs/sprint_64_internal_drawdown_dry_run_harness.md).

### Sprint 63: Drawdown Execution Contract v1

**Complete 2026-05-20.** Added a runtime-only drawdown execution contract and payload validation layer while preserving current withdrawal order, empty annual overrides, saved plan shape, and engine output.

Sprint 63 checkpoint doc: [`docs/sprint_63_drawdown_execution_contract_v1.md`](docs/sprint_63_drawdown_execution_contract_v1.md).

### Sprint 62: Drawdown Comparison Explainer Polish

**Complete 2026-05-20.** Added plain summary and next-step copy to the drawdown comparison decision gate so held-back, blocked, and eligible states are easier to understand.

Sprint 62 checkpoint doc: [`docs/sprint_62_drawdown_comparison_explainer_polish.md`](docs/sprint_62_drawdown_comparison_explainer_polish.md).

### Sprint 61: Drawdown Gate Example Hardening

**Complete 2026-05-20.** Hardened drawdown decision gate tests across materiality, funding harm, locked-in upstream readiness, and built-in examples before adding execution-contract work.

Sprint 61 checkpoint doc: [`docs/sprint_61_drawdown_gate_example_hardening.md`](docs/sprint_61_drawdown_gate_example_hardening.md).

### Sprint 60: Drawdown Comparison Decision Gate

**Complete 2026-05-20.** Added a Details-only decision gate for hidden drawdown comparisons, with materiality, funding harm, estate, survivor, locked-in account, and saved-plan guardrails before any later highlight path.

Sprint 60 checkpoint doc: [`docs/sprint_60_drawdown_comparison_decision_gate.md`](docs/sprint_60_drawdown_comparison_decision_gate.md).

### Sprint 59: Drawdown Comparison Evidence Surface

**Complete 2026-05-20.** Added a compact Details-only drawdown comparison evidence panel that shows review evidence when available and a plain blocked reason when not ready, without changing the plan or creating account instructions.

Sprint 59 checkpoint doc: [`docs/sprint_59_drawdown_comparison_evidence_surface.md`](docs/sprint_59_drawdown_comparison_evidence_surface.md).

### Sprint 58: Hidden Drawdown Example Matrix

**Complete 2026-05-19.** Added all-example guardrail coverage for the hidden drawdown comparison, confirming it remains hidden, review-only, unsaved, and free of account-instruction language before any Details evidence surface.

Sprint 58 checkpoint doc: [`docs/sprint_58_hidden_drawdown_example_matrix.md`](docs/sprint_58_hidden_drawdown_example_matrix.md).

### Sprint 57: Hidden Drawdown Comparison Candidate

**Complete 2026-05-19.** Added one hidden registered-timing comparison candidate using existing simulation plumbing and gated by comparison readiness. It returns review-only evidence and remains out of UI and saved plans.

Sprint 57 checkpoint doc: [`docs/sprint_57_hidden_drawdown_comparison_candidate.md`](docs/sprint_57_hidden_drawdown_comparison_candidate.md).

### Sprint 56: Drawdown Comparison Readiness Review

**Complete 2026-05-19.** Added a Details-only comparison-readiness review that summarizes draft checks, sandbox gate, account evidence, and household guardrails before any real drawdown comparison exists.

Sprint 56 checkpoint doc: [`docs/sprint_56_drawdown_comparison_readiness_review.md`](docs/sprint_56_drawdown_comparison_readiness_review.md).

### Sprint 55: Mocked Drawdown Sandbox Comparison

**Complete 2026-05-19.** Added a test-only, gate-aware synthetic comparison runner that scores a queued drawdown sandbox draft against mocked output and rejects invalid payloads before scoring. No product execution, UI surface, saved output, or engine schema change was added.

Sprint 55 checkpoint doc: [`docs/sprint_55_mocked_drawdown_sandbox_comparison.md`](docs/sprint_55_mocked_drawdown_sandbox_comparison.md).

### Sprint 54: Drawdown Sandbox Gate

**Complete 2026-05-19.** Added a Details-only future sandbox gate that chooses one validated drawdown draft check to hold for later comparison, or explains what blocks it, without running annual overrides or saving output.

Sprint 54 checkpoint doc: [`docs/sprint_54_drawdown_sandbox_gate.md`](docs/sprint_54_drawdown_sandbox_gate.md).

### Sprint 53: Bounded Drawdown Execution Readiness

**Complete 2026-05-19.** Added Details-only future drawdown draft checks, validation statuses, readiness blockers, and a test-only synthetic comparison harness while keeping current withdrawal order, annual overrides, saved plans, and engine output unchanged.

Sprint 53 checkpoint doc: [`docs/sprint_53_bounded_drawdown_execution_readiness.md`](docs/sprint_53_bounded_drawdown_execution_readiness.md).

### Sprint 52: Tax-Aware Drawdown Prototype Evidence

**Complete 2026-05-19.** Added Details-only tax-aware drawdown prototype evidence rows while keeping current withdrawal order, annual overrides, saved plans, and engine output unchanged.

Sprint 52 checkpoint doc: [`docs/sprint_52_tax_aware_drawdown_prototype_evidence.md`](docs/sprint_52_tax_aware_drawdown_prototype_evidence.md).

### Sprint 51: Benefit Timing Bridge-Year Clarity

**Complete 2026-05-19.** Refined CPP/OAS delay eligibility notes and added bridge-year evidence so benefit timing remains review-oriented before broader optimizer work.

Sprint 51 checkpoint doc: [`docs/sprint_51_benefit_timing_bridge_clarity.md`](docs/sprint_51_benefit_timing_bridge_clarity.md).

### Sprint 50: Plan Options Clarity & Candidate Discipline

**Complete 2026-05-19.** Added option grouping and Details copy that separates lifestyle, timing, income-sharing, drawdown, and home/estate checks while keeping bounded optimizer output review-only and unsaved.

Sprint 50 checkpoint doc: [`docs/sprint_50_plan_options_clarity.md`](docs/sprint_50_plan_options_clarity.md).

### Sprint 49: Home Equity Reliance & Estate Guardrails

**Complete 2026-05-18.** Added a review-only home-sale reliance check and estate-goal suggestion guardrails without adding home-sale recommendations, optimizer strategy application, or saved output.

Sprint 49 checkpoint doc: [`docs/sprint_49_home_equity_estate_guardrails.md`](docs/sprint_49_home_equity_estate_guardrails.md).

### Sprint 48: CPP Sharing Review Candidate

**Complete 2026-05-18.** Added a narrow CPP sharing review candidate for eligible couples, with eligibility notes, tax/evidence rows, and persistence guardrails while keeping saved plans and engine output unchanged.

Sprint 48 checkpoint doc: [`docs/sprint_48_cpp_sharing_review_candidate.md`](docs/sprint_48_cpp_sharing_review_candidate.md).

### Sprint 47: Example-Plan Optimizer Readiness Matrix

**Complete 2026-05-18.** Added an example-plan readiness matrix that runs all bundled examples through Results preview, spending stress, drawdown readiness, and bounded optimizer guardrails without adding new optimizer behavior or saved output.

Sprint 47 checkpoint doc: [`docs/sprint_47_example_plan_optimizer_readiness_matrix.md`](docs/sprint_47_example_plan_optimizer_readiness_matrix.md).

### Sprint 46: Tax-Aware Drawdown Contract Readiness

**Complete 2026-05-18.** Added Details-only drawdown readiness evidence and reinforced the current-order withdrawal strategy contract without adding tax-aware drawdown execution or saved optimizer output.

Sprint 46 checkpoint doc: [`docs/sprint_46_tax_aware_drawdown_contract_readiness.md`](docs/sprint_46_tax_aware_drawdown_contract_readiness.md).

### Sprint 45: Spending Guardrail Stress

**Complete 2026-05-18.** Added runtime-only spending stress checks for nearby early-retirement spending levels, with Details evidence and review-only copy.

Sprint 45 checkpoint doc: [`docs/sprint_45_spending_guardrail_stress.md`](docs/sprint_45_spending_guardrail_stress.md).

### Sprint 44: Optimizer Recommendation Discipline

**Complete 2026-05-18.** Added a suggestion gate so disruptive options stay review-only unless they materially repair a visible funding problem, and added Details copy explaining why some options are not highlighted first.

Sprint 44 checkpoint doc: [`docs/sprint_44_optimizer_recommendation_discipline.md`](docs/sprint_44_optimizer_recommendation_discipline.md).

### Sprint 43: Optimizer Guardrails & Timing Integrity

**Complete 2026-05-18.** Tightened bounded optimizer eligibility for CPP/OAS delay, work timing, pension splitting, and withdrawal-order checks; added Details guardrail notes explaining why option families were tested or skipped.

Sprint 43 checkpoint doc: [`docs/sprint_43_optimizer_guardrails_timing_integrity.md`](docs/sprint_43_optimizer_guardrails_timing_integrity.md).

### Sprint 42: Optimizer Tax-Driver Explanations

**Complete 2026-05-18.** Added selected-option tax and funding driver rows for lifetime tax, peak tax, OAS recovery tax, funded years, and projected money left while keeping optimizer output review-only.

Sprint 42 checkpoint doc: [`docs/sprint_42_optimizer_tax_driver_explanations.md`](docs/sprint_42_optimizer_tax_driver_explanations.md).

### Sprint 41: Pension-Splitting Evidence Rows

**Complete 2026-05-18.** Added pension-splitting evidence rows for tax, OAS recovery tax, and projected money-left movement while keeping the optimizer review-only.

Sprint 41 checkpoint doc: [`docs/sprint_41_pension_splitting_evidence_rows.md`](docs/sprint_41_pension_splitting_evidence_rows.md).

### Sprint 40: Bounded Optimizer Search Expansion

**Complete 2026-05-18.** Added one narrow pension-splitting optimizer candidate with eligibility gating and review-oriented explanation while avoiding broad search expansion.

Sprint 40 checkpoint doc: [`docs/sprint_40_bounded_optimizer_search_expansion.md`](docs/sprint_40_bounded_optimizer_search_expansion.md).

### Sprint 39: Optimizer Eligibility Refinement

**Complete 2026-05-17.** Added eligibility gates and visible included/skipped/review-first notes for bounded optimizer levers before widening optimizer search.

Sprint 39 checkpoint doc: [`docs/sprint_39_optimizer_eligibility_refinement.md`](docs/sprint_39_optimizer_eligibility_refinement.md).

### Sprint 38: Optimizer Explanation Depth

**Complete 2026-05-17.** Added structured bounded-optimizer explanations, Overview and Details explanation surfaces, and tests that keep the first optimizer output review-oriented before widening search.

Sprint 38 checkpoint doc: [`docs/sprint_38_optimizer_explanation_depth.md`](docs/sprint_38_optimizer_explanation_depth.md).

### Sprint 37: Bounded Optimizer Execution

**Complete 2026-05-17.** Added the first limited optimizer runner, candidate scoring, consumer Results surfaces, and persistence guardrails while keeping optimizer output review-only and unsaved.

Sprint 37 checkpoint doc: [`docs/sprint_37_bounded_optimizer_execution.md`](docs/sprint_37_bounded_optimizer_execution.md).

### Sprint 36: Optimizer Contract & Engine Safety

**Complete 2026-05-17.** Added a non-executing optimizer contract, safe simulation wrapper, edge-case validation coverage, clearer example working-copy status, and consumer-facing intake label polish before optimizer extraction.

Sprint 36 checkpoint doc: [`docs/sprint_36_optimizer_contract_engine_safety.md`](docs/sprint_36_optimizer_contract_engine_safety.md).

### Sprint 35.5: Feedback Gate Cleanup

**Complete 2026-05-17.** Addressed tester feedback before optimizer extraction by neutralizing tax copy, replacing internal shortfall wording, clarifying the printable-report bridge, adding example parity coverage, and guarding spending estimate humility.

Sprint 35.5 checkpoint doc: [`docs/sprint_35_5_feedback_gate_cleanup.md`](docs/sprint_35_5_feedback_gate_cleanup.md).

### Sprint 35: Results Trust & Readiness

**Complete 2026-05-16.** Strengthened the React Results Overview hero, reframed spending capacity as a today's-dollar planning estimate, added prioritized review actions, demoted dense scenario/recommendation panels, and scrubbed remaining internal copy from live Results UI.

Sprint 35 checkpoint doc: [`docs/sprint_35_results_trust_readiness.md`](docs/sprint_35_results_trust_readiness.md).

### Sprint 34: DB Survivor Pension Inputs And Survivor Cash-Flow Accuracy

**Complete 2026-05-16.** Added per-person DB survivor continuation assumptions and used them in survivor reruns while preserving the historical 60% fallback for old plans.

Sprint 34 checkpoint doc: [`docs/sprint_34_db_survivor_pension.md`](docs/sprint_34_db_survivor_pension.md).

### Sprint 33: Save & Print Polish

**Complete 2026-05-16.** Split the end-of-results actions into consumer-facing Save editable plan and Open printable report paths while preserving the local plan file and detailed-report route.

Sprint 33 checkpoint doc: [`docs/sprint_33_save_print_polish.md`](docs/sprint_33_save_print_polish.md).

### Sprint 32: Overview Simplification

**Complete 2026-05-16.** Moved audit-style diagnostic panels from Overview into Details so the first Results page stays focused on the retirement answer, spending, estate intent, choices, survivor snapshot, and readiness.

Sprint 32 checkpoint doc: [`docs/sprint_32_overview_simplification.md`](docs/sprint_32_overview_simplification.md).

### Sprint 31: Consumer Copy Scrub

**Complete 2026-05-16.** Replaced remaining internal implementation language in the live React Results copy with consumer-facing detailed-report, money-flow, and review-step language.

Sprint 31 checkpoint doc: [`docs/sprint_31_consumer_copy_scrub.md`](docs/sprint_31_consumer_copy_scrub.md).

### Sprint 30: React Start Examples And Light Visual Alignment

**Complete 2026-05-16.** Added the bundled synthetic example plans to the modern React Start screen and lightly aligned the entry experience with the Results dashboard visual language.

Sprint 30 checkpoint doc: [`docs/sprint_30_react_start_examples_visual_alignment.md`](docs/sprint_30_react_start_examples_visual_alignment.md).

### Sprint 29: Optimizer Input Review And Guardrails

**Complete 2026-05-15.** Added runtime-only optimizer permission rows that separate can-explore levers, must-preserve wishes, and missing household decisions.

Sprint 29 checkpoint doc: [`docs/sprint_29_optimizer_input_review_guardrails.md`](docs/sprint_29_optimizer_input_review_guardrails.md).

### Sprint 28: Optimizer Prep And Decision Boundaries

**Complete 2026-05-15.** Added runtime-only optimizer boundary rows for spending, retirement timing, CPP/OAS timing, withdrawal order, estate target, and downsizing without adding optimizer execution.

Sprint 28 checkpoint doc: [`docs/sprint_28_optimizer_prep_decision_boundaries.md`](docs/sprint_28_optimizer_prep_decision_boundaries.md).

### Sprint 27: Scenario Choice Redesign

**Complete 2026-05-15.** Reframed scenario cards as household choices with best-for and trade-off copy while keeping detailed comparison tables as supporting evidence.

Sprint 27 checkpoint doc: [`docs/sprint_27_scenario_choice_redesign.md`](docs/sprint_27_scenario_choice_redesign.md).

### Sprint 26: Intake UX And Help Text

**Complete 2026-05-15.** Made the guided intake easier for non-expert households by explaining complex Canadian retirement inputs in plain language.

Sprint 26 checkpoint doc: [`docs/sprint_26_intake_ux_help_text.md`](docs/sprint_26_intake_ux_help_text.md).

### Sprint 25: Estate Intent And Tax Efficiency

**Complete 2026-05-15.** Made estate wishes and tax-efficiency review visible in the consumer Results story without adding legal estate planning, new tax rules, or optimizer behaviour.

Sprint 25 checkpoint doc: [`docs/sprint_25_estate_intent_tax_efficiency.md`](docs/sprint_25_estate_intent_tax_efficiency.md).

### Sprint 24: Spending Capacity Layer

**Complete 2026-05-15.** Answered "How much can I spend?" with a bounded consumer-facing spending posture derived from existing projections and scenario output.

Sprint 24 checkpoint doc: [`docs/sprint_24_spending_capacity_layer.md`](docs/sprint_24_spending_capacity_layer.md).

### Sprint 23: Consumer Results Simplification

**Complete 2026-05-14.** Simplified the top-level Results journey so consumers see the retirement answer, risks, taxes, survivor impact, details, and save/print paths without being forced through every advanced diagnostic table.

Sprint 23 checkpoint doc: [`docs/sprint_23_consumer_results_simplification.md`](docs/sprint_23_consumer_results_simplification.md).

### Sprint 22: Consumer Retirement Answer Layer

**Complete 2026-05-14.** Made the Results Overview answer the consumer's real retirement question first: whether the plan appears supportable, how spending fits, whether the estate outcome is intentional, and what to review next.

Sprint 22 checkpoint doc: [`docs/sprint_22_consumer_retirement_answer_layer.md`](docs/sprint_22_consumer_retirement_answer_layer.md).

### Sprint 21: Engine Extraction Scenario And Survivor Runner

**Complete 2026-05-14.** Extracted Results preview baseline, scenario, and survivor rerun orchestration from React into an engine-owned runtime helper so future optimizer work can use explicit plan-object boundaries.

Sprint 21 checkpoint doc: [`docs/sprint_21_engine_extraction_scenario_survivor_runner.md`](docs/sprint_21_engine_extraction_scenario_survivor_runner.md).

### Sprint 20: React Results Readiness And Save Handoff Polish

**Complete 2026-05-14.** Tightened the end-of-results workflow so users can understand blockers, remaining review items, save readiness, and stable-dashboard handoff before keeping a local plan file.

Sprint 20 checkpoint doc: [`docs/sprint_20_react_results_readiness_save_handoff.md`](docs/sprint_20_react_results_readiness_save_handoff.md).

### Sprint 19: React Survivor Detail Parity

**Complete 2026-05-14.** Deepened Household Resilience so two-person plans can understand survivor scenario readiness, funding, tax, and portfolio outcomes without using the stable dashboard for first-pass review.

Sprint 19 checkpoint doc: [`docs/sprint_19_react_survivor_detail_parity.md`](docs/sprint_19_react_survivor_detail_parity.md).

### Sprint 18: React Account Detail / Drawdown Parity

**Complete 2026-05-08.** Deepened the React Accounts tab so users can understand account balance movement, drawdown sources, and terminal portfolio risk without using the stable dashboard for first-pass review.

Sprint 18 checkpoint doc: [`docs/sprint_18_react_account_drawdown_parity.md`](docs/sprint_18_react_account_drawdown_parity.md).

### Sprint 17: React Tax Detail Parity

**Complete 2026-05-08.** Deepened the React Taxes tab so users can understand why tax changes over time, which tax items deserve review, and where the stable dashboard remains the full audit surface.

Sprint 17 checkpoint doc: [`docs/sprint_17_react_tax_detail_parity.md`](docs/sprint_17_react_tax_detail_parity.md).

### Sprint 17 Candidate Implementation Tickets

- [x] **S17-01 — Tax story summary selector.** ✅ *Done 2026-05-08.* Added runtime-only summary for status, peak tax, lifetime tax, OAS clawback, registered-withdrawal years, and planning windows.
- [x] **S17-02 — Tax review rows.** ✅ *Done 2026-05-08.* Added OAS clawback, registered withdrawal pressure, peak tax, and lower-tax planning-window rows.
- [x] **S17-03 — React Taxes panel.** ✅ *Done 2026-05-08.* Added story panel, review rows, metrics, and annual table.
- [x] **S17-04 — Stable dashboard handoff.** ✅ *Done 2026-05-08.* Kept full tax schedules, print/PDF, and legacy audit views in stable dashboard copy.
- [x] **S17-05 — Tests and docs.** ✅ *Done 2026-05-08.* Added selector/smoke coverage and Sprint 17 documentation.

### Sprint 17 Definition Of Done

- Taxes tab explains why tax changes over time and which items deserve review.
- Tax story output is runtime-only and derived from existing simulation rows.
- Copy remains review-oriented, not advice.
- Stable dashboard remains the full tax audit/report fallback.
- Runtime dashboard schema remains v2.
- Verification passes and no private `.plan.json` files are created.

### Sprint 16: React Stress Tests Parity

**Complete 2026-05-08.** Deepened the React Stress Tests tab so users can see what can go wrong, when it first appears, how severe it is, and which React detail area to review next.

Sprint 16 checkpoint doc: [`docs/sprint_16_react_stress_tests_parity.md`](docs/sprint_16_react_stress_tests_parity.md).

### Sprint 16 Candidate Implementation Tickets

- [x] **S16-01 — Stress summary selector.** ✅ *Done 2026-05-08.* Added runtime-only summary for status, funded years, first stress year, and main item.
- [x] **S16-02 — Stress evidence rows.** ✅ *Done 2026-05-08.* Added spending shortfall, depletion, cushion, tax pressure, and source reconciliation stress rows.
- [x] **S16-03 — React Stress Tests panel.** ✅ *Done 2026-05-08.* Added summary, evidence rows, review actions, and existing baseline indicators.
- [x] **S16-04 — Stable dashboard handoff.** ✅ *Done 2026-05-08.* Kept full Monte Carlo, sequence stress, print/PDF, and legacy charts in stable dashboard copy.
- [x] **S16-05 — Tests and docs.** ✅ *Done 2026-05-08.* Added selector/smoke coverage and Sprint 16 documentation.

### Sprint 16 Definition Of Done

- Stress Tests explains what can go wrong, when it first appears, and where to review.
- Stress output is runtime-only and derived from existing simulation rows.
- Language remains review-oriented, not advice.
- Stable dashboard remains the full stress-test fallback.
- Runtime dashboard schema remains v2.
- Verification passes and no private `.plan.json` files are created.

### Sprint 15: Entry Point And Handoff Reliability

**Complete 2026-05-07.** Made the stable intake, stable dashboard, and React preview entry points explicit, reliable, and regression-tested across local dev and Vercel preview deployment.

Sprint 15 checkpoint doc: [`docs/sprint_15_entrypoint_handoff_reliability.md`](docs/sprint_15_entrypoint_handoff_reliability.md).

### Sprint 15 Candidate Implementation Tickets

- [x] **S15-01 — Entry point contract.** ✅ *Done 2026-05-07.* Documented React preview, stable intake, stable dashboard, and engine helper routes.
- [x] **S15-02 — React stable URL helpers.** ✅ *Done 2026-05-07.* Centralized stable intake and stable dashboard links in React.
- [x] **S15-03 — Stable intake link audit.** ✅ *Done 2026-05-07.* Confirmed dashboard hash handoff uses `retirement_dashboard.html#`.
- [x] **S15-04 — Legacy route probe.** ✅ *Done 2026-05-07.* Added Vite route coverage for stable dashboard, stable intake, aliases, and engine helpers.
- [x] **S15-05 — Vercel preview staging.** ✅ *Done 2026-05-07.* Added React preview build staging so stable handoffs work on Vercel preview URLs.
- [x] **S15-06 — Docs and verification.** ✅ *Done 2026-05-07.* Added Sprint 15 docs, README notes, and canonical probe coverage.

### Sprint 15 Definition Of Done

- React preview links open the real stable dashboard and stable intake.
- Vite dev/preview serves stable dashboard, stable intake, and engine helper routes.
- Vercel preview build stages React plus stable fallback files.
- A route probe prevents stable-dashboard links from falling back to React.
- Runtime dashboard schema remains v2.
- Verification passes and no private `.plan.json` files are created.

### Sprint 14: React Results Polish And Handoff Audit

**Complete 2026-05-07.** Tightened the migrated React Results workspace so navigation, charts, tables, and stable-dashboard handoff copy feel consistent before adding more feature surface.

Sprint 14 checkpoint doc: [`docs/sprint_14_react_results_polish_handoff_audit.md`](docs/sprint_14_react_results_polish_handoff_audit.md).

### Sprint 14 Candidate Implementation Tickets

- [x] **S14-01 — Results navigation spacing.** ✅ *Done 2026-05-07.* Increased tab button height, spacing, and responsive wrapping so helper text sits clearly below titles.
- [x] **S14-02 — Handoff copy audit.** ✅ *Done 2026-05-07.* Centralized React tab intro and stable-dashboard handoff copy.
- [x] **S14-03 — Chart readability pass.** ✅ *Done 2026-05-07.* Improved chart panel spacing and responsive chart heights.
- [x] **S14-04 — Table readability pass.** ✅ *Done 2026-05-07.* Tightened table framing, row spacing, and first-column emphasis.
- [x] **S14-05 — Tests and docs.** ✅ *Done 2026-05-07.* Added Sprint 14 documentation and ran the standard verification suite.

### Sprint 14 Definition Of Done

- React Results navigation spacing is consistent across tab title/helper text.
- Handoff copy clearly distinguishes React coverage from stable-dashboard fallback.
- Charts and tables are more readable on desktop and narrow widths.
- No new result output or UI state is persisted.
- Runtime dashboard schema remains v2.
- Verification passes and no private `.plan.json` files are created.

### Sprint 13: React Results Chart Parity

**Complete 2026-05-07.** Added a bounded React chart layer around the migrated results panels so users can inspect the main projection visuals without jumping immediately to the stable dashboard.

Sprint 13 checkpoint doc: [`docs/sprint_13_react_results_chart_parity.md`](docs/sprint_13_react_results_chart_parity.md).

### Sprint 13 Candidate Implementation Tickets

- [x] **S13-01 — Chart selector contract.** ✅ *Done 2026-05-07.* Added runtime-only portfolio, spending/tax/shortfall, and account bucket chart series selectors.
- [x] **S13-02 — Annual Detail charts.** ✅ *Done 2026-05-07.* Added portfolio and spending/tax/shortfall charts above the annual table.
- [x] **S13-03 — Accounts chart.** ✅ *Done 2026-05-07.* Added an account bucket balance chart above the Accounts result tables.
- [x] **S13-04 — Stable dashboard handoff.** ✅ *Done 2026-05-07.* Kept print/PDF, reporting, and legacy audit surfaces anchored in the stable dashboard.
- [x] **S13-05 — Tests and docs.** ✅ *Done 2026-05-07.* Added selector/smoke coverage and Sprint 13 documentation.

### Sprint 13 Definition Of Done

- React renders key chart parity surfaces for annual projection and account buckets.
- Chart series are derived from existing simulation output and selectors.
- Chart output and view state are runtime-only and not persisted.
- Stable dashboard remains available for print/PDF, richer charting, and legacy audit surfaces.
- Runtime dashboard schema remains v2.
- Verification passes and no private `.plan.json` files are created.

### Sprint 12: React Annual Detail Parity

**Complete 2026-05-07.** Added a first-class React Annual Detail tab so users can inspect full year-by-year projection rows without jumping immediately to the stable dashboard.

Sprint 12 checkpoint doc: [`docs/sprint_12_react_annual_detail_parity.md`](docs/sprint_12_react_annual_detail_parity.md).

### Sprint 12 Candidate Implementation Tickets

- [x] **S12-01 — Annual detail navigation.** ✅ *Done 2026-05-07.* Added `Annual Detail` as a first-class Results tab after Overview.
- [x] **S12-02 — Annual detail selectors.** ✅ *Done 2026-05-07.* Added runtime-only annual detail rows and summary metrics derived from existing simulation output.
- [x] **S12-03 — Simple view controls.** ✅ *Done 2026-05-07.* Added Summary, Income, Withdrawals, Tax, and Balances table views without persisted UI state.
- [x] **S12-04 — Full-year React table.** ✅ *Done 2026-05-07.* Rendered all projection years in a scrollable table while preserving stable dashboard handoff for charts and print/PDF.
- [x] **S12-05 — Tests and docs.** ✅ *Done 2026-05-07.* Added selector/smoke coverage and Sprint 12 documentation.

### Sprint 12 Definition Of Done

- Annual Detail shows all available projection years in React.
- Annual Detail values reconcile with existing Cash Flow selectors.
- Annual Detail output and view state are runtime-only and not persisted.
- Stable dashboard remains available for charts, print/PDF, and legacy audit surfaces.
- Runtime dashboard schema remains v2.
- Verification passes and no private `.plan.json` files are created.

### Sprint 11: Recommended Path Implementation Checklist

**Complete 2026-05-07.** Turned selected-path confidence, stress, and drilldown evidence into a runtime-only implementation checklist users can review before relying on a preview path.

Sprint 11 checkpoint doc: [`docs/sprint_11_recommended_path_implementation_checklist.md`](docs/sprint_11_recommended_path_implementation_checklist.md).

### Sprint 11 Candidate Implementation Tickets

- [x] **S11-01 — Checklist selector contract.** ✅ *Done 2026-05-07.* Added typed runtime-only checklist items to the recommended-path summary.
- [x] **S11-02 — Evidence-grounded checklist rules.** ✅ *Done 2026-05-07.* Checklist status uses validation blockers, break risks, confidence, stress context, and survivor comparison.
- [x] **S11-03 — React checklist panel.** ✅ *Done 2026-05-07.* Added an Overview checklist below the break-risk drilldowns.
- [x] **S11-04 — Tests and docs.** ✅ *Done 2026-05-07.* Added selector coverage and Sprint 11 documentation.

### Sprint 11 Definition Of Done

- Checklist output is runtime-only and not persisted.
- Checklist items remain review-oriented and avoid financial-advice language.
- Stable dashboard handoff remains explicit.
- Runtime dashboard schema remains v2.
- Verification passes and no private `.plan.json` files are created.

### Sprint 10: Recommended Path Detail Drilldowns

**Complete 2026-05-07.** Users can drill from high-level recommended-path break risks into focused selected-path evidence without persisting recommendation output or replacing the stable dashboard detail surface.

Sprint 10 checkpoint doc: [`docs/sprint_10_recommended_path_detail_drilldowns_proposal.md`](docs/sprint_10_recommended_path_detail_drilldowns_proposal.md).

### Sprint 10 Candidate Implementation Tickets

- [x] **S10-01 — Risk detail selector contract.** ✅ *Done 2026-05-07.* Added runtime-only risk detail rows, default risk selection, metric rows, and evidence rows to the recommended-path summary.
- [x] **S10-02 — Source, shortfall, and terminal cushion details.** ✅ *Done 2026-05-07.* Added focused selected-path evidence for reconciliation, funding pressure, and portfolio cushion.
- [x] **S10-03 — Spending, retirement date, and benefit timing details.** ✅ *Done 2026-05-07.* Added bounded scenario comparison evidence for the three local reruns.
- [x] **S10-04 — Tax and survivor details.** ✅ *Done 2026-05-07.* Added tax pressure and household resilience detail rows.
- [x] **S10-05 — Overview interaction.** ✅ *Done 2026-05-07.* Made break risks selectable and rendered the selected detail panel.
- [x] **S10-06 — Tests and documentation.** ✅ *Done 2026-05-07.* Added selector coverage and Sprint 10 documentation.

### Sprint 10 Definition Of Done

- Users can select a break risk and see focused selected-path evidence.
- Selected-path details are runtime-only and not persisted.
- Detail copy clearly points users to the stable dashboard for complete schedules.
- The React Overview remains readable and does not turn into a dense spreadsheet.
- Stable dashboard remains the full fallback.
- Runtime dashboard schema remains v2.
- Verification passes and no private `.plan.json` files are created.

### Sprint 9: Recommended Path Stress & Confidence

**Complete 2026-05-07.** Added a bounded confidence and stress layer around the selected recommended path so users can see how robust or fragile the preview choice is.

Sprint 9 checkpoint doc: [`docs/sprint_9_recommended_path_stress_confidence.md`](docs/sprint_9_recommended_path_stress_confidence.md).

### Sprint 9 Candidate Implementation Tickets

- [x] **S9-01 — Recommended path confidence selector.** ✅ *Done 2026-05-07.* Added runtime-only confidence levels based on selected-path blockers, shortfalls, watch risks, tax pressure, and review items.
- [x] **S9-02 — Selected-path stress context.** ✅ *Done 2026-05-07.* Added selected candidate stress context for funded years, first shortfall, lowest portfolio, terminal portfolio, tax pressure, and survivor status.
- [x] **S9-03 — What could break this plan panel.** ✅ *Done 2026-05-07.* Added Overview risks for source reconciliation, spending sensitivity, retirement timing, CPP/OAS timing, shortfall, terminal cushion, tax pressure, and survivor resilience.
- [x] **S9-04 — Stable dashboard detail handoff copy.** ✅ *Done 2026-05-07.* Updated Overview, Stress Tests, and Export/Save copy so detailed inspection stays anchored in the stable dashboard.
- [x] **S9-05 — Stress/confidence tests and docs.** ✅ *Done 2026-05-07.* Added selector tests and Sprint 9 documentation.

### Sprint 9 Definition Of Done

- Confidence and stress output are computed at runtime only and are not persisted into `.plan.json`.
- Selected-path stress context is visible in React Overview.
- Overview shows bounded break risks and stable dashboard handoff copy.
- Stable dashboard remains the full fallback.
- Runtime dashboard schema remains `SCHEMA_VERSION = 2`.
- Canonical probes pass and no private `.plan.json` files are committed.

### Sprint 8: Recommended Plan Pathway v0

**Complete 2026-05-07.** The React Overview selects the strongest preview candidate from the current plan, retire two years later, spend 10% less in go-go, and delay CPP/OAS to 70. The recommendation remains runtime-only and is not persisted.

Sprint 8 checkpoint doc: [`docs/sprint_8_recommended_pathway.md`](docs/sprint_8_recommended_pathway.md).

### Sprint 8 Candidate Implementation Tickets

- [x] **S8-01 — Recommendation selector layer.** ✅ *Done 2026-05-07.* Added typed runtime-only recommended-path selectors for baseline, retire-later, lower-spending, and delayed-benefit candidates.
- [x] **S8-02 — Recommended Path Overview panel.** ✅ *Done 2026-05-07.* Added a React Overview panel showing the strongest preview candidate, reasons, tradeoffs, and trust checks.
- [x] **S8-03 — Candidate ranking table.** ✅ *Done 2026-05-07.* Added candidate rows with funded-through year, first shortfall, end-portfolio delta, lifetime tax delta, spending-funded years, and review status.
- [x] **S8-04 — Why not the others.** ✅ *Done 2026-05-07.* Added transparent explanations for why non-selected candidates did not overtake the recommended path.
- [x] **S8-05 — Recommended pathway tests and docs.** ✅ *Done 2026-05-07.* Added selector/smoke coverage and Sprint 8 continuity documentation.

### Sprint 8 Definition Of Done

- Recommended path is computed at runtime only and is not persisted into `.plan.json`.
- Source reconciliation warnings block a candidate from recommendation.
- Recommendation rules prefer no shortfall, then later funded-through year, then ending portfolio, then lower lifetime tax.
- Survivor issues are review warnings, not automatic disqualifiers.
- Stable dashboard remains the full fallback.
- Runtime dashboard schema remains `SCHEMA_VERSION = 2`.
- Canonical probes pass and no private `.plan.json` files are committed.

### Sprint 7: Results Clarity And Decision Readiness

**Complete 2026-05-07.** The React Overview explains plan health, traces money flow, surfaces decision review candidates, compares simple local scenarios, explains Canadian tax pressure, and starts household survivor resilience while preserving stable dashboard fallback and schema v2.

Sprint 7 checkpoint doc: [`docs/sprint_7_results_clarity.md`](docs/sprint_7_results_clarity.md).

### Sprint 7 Candidate Implementation Tickets

- [x] **S7-01 — Plan Health Explainer.** ✅ *First slice done 2026-05-07.* Added typed plan-health selector and React Overview panel for funded-through year, first pressure point, largest review item, and stable dashboard fallback.
- [x] **S7-02 — Source Reconciliation Story.** ✅ *First slice done 2026-05-07.* Turned first-year reconciliation into a user-facing source-to-tax-to-spending flow while preserving the all-years diagnostics.
- [x] **S7-03 — Decision Checklist.** ✅ *First slice done 2026-05-07.* Added review-candidate checklist for source reconciliation, CPP/OAS timing, cash wedge, OAS clawback, registered tax spikes, survivor risk, and estate target.
- [x] **S7-04 — Tax Pressure Timeline.** ✅ *First slice done 2026-05-07.* Added selector and Overview table for high-signal tax pressure years, including taxable income, tax, OAS clawback, and registered withdrawals.
- [x] **S7-05 — First Scenario Cards.** ✅ *First slice done 2026-05-07.* Added computed local decision cards for retire two years later, spend 10% less in go-go, and delay CPP/OAS to 70. Cards show end-portfolio delta and funded-through year without becoming a full optimizer.
- [x] **S7-06 — Survivor View Discovery/First Slice.** ✅ *First slice done 2026-05-07.* Added typed survivor summary that distinguishes single plans, two-person plans needing a survivor year, and plans ready for survivor comparison.
- [x] **S7-07 — Decision Readiness Smoke.** ✅ *Done 2026-05-07.* Extended results smoke coverage for Larry-style single, couple, blank Person 2, source reconciliation, decision checklist, scenario cards, survivor summary, and dashboard handoff.
- [x] **S7-08 — Scenario Comparison Detail.** ✅ *Done 2026-05-07.* Added a selector and Overview table comparing the three simple local reruns by end portfolio delta, first-year spending delta, lifetime tax delta, funded-through year, and first shortfall.
- [x] **S7-09 — Decision Detail Panel.** ✅ *Done 2026-05-07.* Added evidence, affected years, and fallback result area for each decision checklist item so review candidates are explainable without becoming advice.
- [x] **S7-10 — Scenario Assumption Summary.** ✅ *Done 2026-05-07.* Added a scenario assumptions table showing exactly what changes from baseline for each local rerun.
- [x] **S7-11 — Tax Pressure Explanation.** ✅ *Done 2026-05-07.* Added plain-language tax pressure explanations for OAS clawback, registered withdrawals, and peak taxable-income years.
- [x] **S7-12 — Survivor View Deepening.** ✅ *Done 2026-05-07.* Added baseline-versus-survivor comparison using the existing survivor simulation boundary when a couple plan has a survivor year.
- [x] **S7-13 — Results UX Checkpoint.** ✅ *Done 2026-05-07.* Grouped the Overview into Plan Health, Money Flow, Decision Checks, Scenario Tests, and Household Resilience sections.

### Sprint 7 Definition Of Done

- React results tell a coherent plan story before asking users to inspect charts.
- Source reconciliation remains visible and catches impossible rows.
- Decision checklist is framed as review candidates, not regulated advice.
- Stable dashboard remains the complete fallback.
- Runtime dashboard schema remains `SCHEMA_VERSION = 2`.
- No cloud sync/accounts/advisor/AI/multi-province/schema-v3 persistence creep.
- Canonical probes pass and no private `.plan.json` files are committed.

### Sprint 7 Checkpoint

Sprint 7 is ready for checkpoint review once verification is green: the React Overview now explains plan health, traces money flow, surfaces decision review candidates, compares simple local scenarios, explains Canadian tax pressure, and starts household survivor resilience while preserving stable dashboard fallback and schema v2.

### Sprint 6: Results Workspace Migration

**Complete initial map 2026-05-07.** Started after Sprint 5 guided intake smoke passed locally. The React preview can now open/create v2 `.plan.json` files, edit guided intake, lazy-load the extracted simulation engine, review inputs, hand off to the stable dashboard, and render the initial results workspace map.

Sprint 5 discovery doc: [`docs/sprint_5_ui_navigation_discovery.md`](docs/sprint_5_ui_navigation_discovery.md). Sprint 6 workspace decision: [`docs/sprint_6_results_workspace.md`](docs/sprint_6_results_workspace.md).

### Sprint 6 Candidate Implementation Tickets

- [x] **S6-01 — Results workspace screen map.** ✅ *First slice done 2026-05-06.* Recorded the React results navigation map: Overview, Cash Flow, Income Sources, Accounts, Taxes, Stress Tests, Assumptions, and Export/Save.
- [x] **S6-02 — Result data selectors.** ✅ *First slice done 2026-05-06.* Added typed selectors for overview metrics, funding-source rows, account balance series, chart-ready data, and cash-flow reconciliation without changing engine output or persisted schema.
- [x] **S6-03 — Overview results panel.** ✅ *First slice done 2026-05-06.* React Results now opens on Overview with projection years, end portfolio, first-year source reconciliation, warnings/blockers, and stable dashboard fallback.
- [x] **S6-04 — Cash-flow/source reconciliation panel.** ✅ *First slice done 2026-05-06.* Added a Cash Flow results tab that checks annual source reconciliation and flags gap/cash-flow deltas while keeping full detail in the stable dashboard.
- [x] **S6-05 — Results navigation shell.** ✅ *First slice done 2026-05-06.* Results tab state now lives in the workspace reducer. Overview and Cash Flow render React previews; all remaining mapped tabs are selectable placeholders that point users back to the stable dashboard until parity work is done.
- [x] **S6-06 — Results smoke pass.** ✅ *Done 2026-05-06.* Added automated results smoke coverage for Larry-style single, couple, single-person blank Person 2, Overview selectors, Cash Flow reconciliation rows, navigation map, and v2 dashboard handoff packaging.
- [x] **S6-07 — Income Sources preview panel.** ✅ *Done 2026-05-06.* Added typed income-source selectors and a React Income Sources tab with first-year, lifetime taxable, lifetime flexible, source rows, and stable dashboard fallback preserved.
- [x] **S6-08 — Accounts preview panel.** ✅ *Done 2026-05-07.* Added account summary selectors and a React Accounts tab with start/end balances, peak portfolio, account bucket rows, and stable dashboard fallback preserved.
- [x] **S6-09 — Taxes preview panel.** ✅ *Done 2026-05-07.* Added tax summary/detail selectors and a React Taxes tab with first-year tax, lifetime tax, peak tax year, OAS clawback, effective rates, and stable dashboard fallback preserved.
- [x] **S6-10 — Stress Tests preview panel.** ✅ *Done 2026-05-07.* Added baseline stress indicator selectors and a React Stress Tests tab for shortfall, depletion, minimum portfolio, terminal portfolio, and funded-year indicators while leaving full scenario tests in the stable dashboard.
- [x] **S6-11 — Assumptions preview panel.** ✅ *Done 2026-05-07.* Added a read-only React Assumptions tab summarizing run assumptions and strategy settings from the v2 plan without adding a new persistence surface.
- [x] **S6-12 — Export/Save preview panel.** ✅ *Done 2026-05-07.* Added a local-first Export/Save tab summarizing v2 plan-file context and stable dashboard fallback without adding sync, accounts, or schema changes.
- [x] **S6-13 — Overview projection path.** ✅ *Done 2026-05-07.* Added projection milestone selectors and a React Overview projection path table for first/mid/final year spending, tax, portfolio, and shortfall.
- [x] **S6-14 — Export/Save action parity.** ✅ *Done 2026-05-07.* Added the local `.plan.json` save action directly inside the Export/Save tab while preserving the shared stable dashboard fallback.
- [x] **S6-15 — Reconciliation diagnostics.** ✅ *Done 2026-05-07.* Added all-years source reconciliation diagnostics with rows checked, warning count, first warning year, max funding gap, and max cash-flow delta surfaced in Overview and Cash Flow.
- [x] **S6-16 — Account drawdown summary.** ✅ *Done 2026-05-07.* Added account net-change values and an Accounts tab summary table for start, end, peak, and drawdown/growth by bucket.

### Definition Of Done

- React results workspace has a scoped first slice without replacing the stable dashboard.
- Result selectors are deterministic and covered by tests.
- Source reconciliation is visible and catches impossible cash-flow rows.
- `.plan.json` v2 import/export remains compatible.
- Runtime dashboard schema remains `SCHEMA_VERSION = 2`.
- Static `index.html` and `retirement_dashboard.html` remain available as fallback.
- Canonical probes pass and no private `.plan.json` files are committed.

### Sprint 5: UI / Navigation Redesign Discovery

**Complete 2026-05-06.** Hybrid guided intake implemented and browser smoke passed locally after the simulation engine was moved off the first page load.

Goal: design and then implement the first guided-intake/navigation slice for the React app without changing persisted runtime schema, breaking the static release fallback, or adding accounts/cloud/full optimizer scope.

Discovery doc: [`docs/sprint_5_ui_navigation_discovery.md`](docs/sprint_5_ui_navigation_discovery.md).

#### Discovery And Scope

- [x] **S5-01 — Discovery doc and screen map.** ✅ *Seeded 2026-05-01.* Created the Sprint 5 UI/navigation discovery doc with user jobs, workspace split, candidate navigation models, screen map, file model, real estate/assets model, result hierarchy, mobile/desktop stance, non-shipping list, candidate tickets, and open decisions.
- [x] **S5-02 — Choose initial navigation model.** ✅ *Done 2026-05-01.* Selected the hybrid model: guided setup first, then a persistent workspace shell with Start, Guided Intake, Review, and Results Handoff.
- [x] **S5-03 — Resolve Sprint 5 real estate scope.** ✅ *Done 2026-05-01.* Sprint 5 will capture primary residence/downsize only where it maps to existing v2 fields. Second/vacation property and richer asset records are deferred until a scoped schema update so future asset/property needs can be handled together.
- [x] **S5-04 — Define guided-intake validation rules.** ✅ *Done 2026-05-01.* Blocking issues are limited to incoherent or unsafe-to-run values; advisory completeness issues appear as warnings and do not block result generation.
- [x] **S5-05 — Define local file state UX.** ✅ *Done 2026-05-02.* `.plan.json` is the durable source of truth; browser state is a temporary working copy. Defined current plan title, loaded filename, import success/errors, dirty state, last export timestamp, save/export, and stable-dashboard handoff behavior.

#### Candidate Implementation Tickets

- [x] **S5-06 — Guided intake route shell.** ✅ *Initial shell done 2026-05-01.* Added Start, Intake, Review, and Results Handoff views inside the React preview with a persistent workspace sidebar and guided step rail.
- [x] **S5-07 — Intake state model.** ✅ *Initial model done 2026-05-01.* Added reducer-backed local plan state, import label, dirty state, export timestamp, active view, and active intake step.
- [x] **S5-08 — Household step.** ✅ *Done 2026-05-02.* Added editable plan name, single/couple mode, Person 1 birth/retirement fields, and Person 2 fields that remain disabled/blank for single-person plans without writing placeholder values.
- [x] **S5-09 — Income step.** ✅ *Done 2026-05-02.* Added editable salary, salary year, raise rate, DB pension, CPP, OAS, and Person 2 survivor CPP fields from v2, with Person 2 income disabled while the household is single.
- [x] **S5-10 — Accounts step.** ✅ *Done 2026-05-02.* Added editable RRSP/RRIF, RRSP room, LIRA, LIF, TFSA, TFSA room, annual contributions, non-registered balance/ACB/contributions, and cash wedge fields from v2.
- [x] **S5-11 — Real estate and debts step.** ✅ *Done 2026-05-02.* Added v2 primary-residence downsize year/net proceeds plus mortgage and LOC entry. Second/vacation property remains deferred until scoped schema support exists.
- [x] **S5-12 — Spending and events step.** ✅ *Done 2026-05-02.* Added spending phases, phase ages, one-time expenses, and inheritance/bequest target fields from v2.
- [x] **S5-13 — Assumptions step.** ✅ *Done 2026-05-02.* Added plan years, return/inflation/volatility, withdrawal order, CPP sharing, younger-spouse RRIF election, spousal RRSP attribution toggle/contributor, and survivor year fields.
- [x] **S5-14 — Review and handoff.** ✅ *Done 2026-05-05.* Review now shows a broader input summary across household, income, accounts, real estate/debt, spending/events, and assumptions, keeps validation visible, runs the extracted engine preview, saves normalized `.plan.json`, and hands off to the stable dashboard.
- [x] **S5-15 — Browser smoke pass.** ✅ *Done 2026-05-06.* Local browser run now loads cleanly after lazy-loading the simulation engine. Confirmed the guided intake runs smoothly enough to continue; `.json` plan-file selection accepts Larry-style filenames.

#### Definition Of Done

- Sprint 5 navigation model is chosen and documented.
- Guided intake route/state architecture is implemented in React preview.
- `.plan.json` v2 import/export remains compatible.
- Runtime dashboard schema remains `SCHEMA_VERSION = 2`.
- Static `index.html` and `retirement_dashboard.html` remain available as fallback.
- Real estate fields do not silently persist unsupported second-property data.
- Single-person plans keep Person 2 truly inactive/blank.
- Canonical probes pass and no private `.plan.json` files are committed.

### Sprint 4: Launch/Productization Package

**Complete 2026-05-01.** Final release/PR pass complete. Release package: [`docs/sprint_4_launch_package.md`](docs/sprint_4_launch_package.md). Execution record: [`docs/sprint_4_launch_execution.md`](docs/sprint_4_launch_execution.md).

- [x] Public/free positioning, README/site copy, privacy/disclaimer copy, Free/Plus/Pro local-first packaging notes.
- [x] Launch screenshots and demo script.
- [x] Manual smoke-test checklist, validation/comparator checklist, GitHub/CI/release checklist.
- [x] Launch-post drafts, feedback triage loop, explicit non-shipping list.
- [x] Runtime dashboard `SCHEMA_VERSION = 2`; no optimizer, sync, account system, advisor workspace, or schema v3 migration shipped.

### Sprint 3 — Local-First Planning Workspace

**Complete 2026-05-01.** Canonical suite: **498/498**. Added local `.plan.json` save/load, plan naming, guided form navigation, critical blank-field validation, recommended-plan framing, and local-file privacy copy without adding accounts or changing runtime schema.

### Sprint 0 — Trust And Engine Readiness

**Complete 2026-05-01.** Canonical suite: **478/478**.

- [x] **S0-01 to S0-03 — Tax accuracy.** Fixed pension-income-credit eligibility, added age 64-72 tax/benefit fixtures, and documented 2026 federal/Ontario methodology.
- [x] **S0-04 to S0-06 — Risk language and stress severity.** Reframed success metrics as full-spending-funded, added shortfall/depletion/core-coverage severity metrics, and removed advice-like risk verdicts.
- [x] **S0-07 to S0-09 — Validation exports and public comparator.** Expanded annual baseline exports, added the `public-comparator-single` fixture, and reran the Government of Canada public calculator comparison.
- [x] **S0-10 to S0-12 — Engine readiness.** Added `docs/engine_boundary_map.md`, extracted tax/benefit helpers into `engine/tax_benefit_helpers.js`, and drafted `docs/schema_v3_output_contract.md`.
- [x] **S0-13 to S0-15 — Local-first commercial readiness.** Added `docs/local_monetization_sketch.md`, `docs/account_boundary_decision.md`, and `docs/license_privacy_threat_model.md`.

### Sprint 1 — Foundation

**Complete 2026-04-27.** Made the repo technically publishable: MIT license, disclaimer, schema migration scaffold, `p1`/`p2` rename, blank form with example presets, inline JSDoc schema notes, probe CI, and public README polish.

### Sprint 2 — UX Polish

**Complete 2026-04-28.** Added collapsible form sections, priority-field tooltips, dashboard-to-form round trip, RRSP contribution-room warning, stronger CPP help text, and default-on progressive Monte Carlo.

## Backlog

### Near-Term Candidates After Sprint 4

- **Engine extraction continuation.** Continue moving extracted simulation code toward native TypeScript/ESM and remove the remaining dashboard-source ownership.
- **Recommended-plan optimizer.** Search CPP/OAS timing, withdrawal order, pension split/share settings, RRSP/RRIF/LIF drawdown, guardrails, and estate trade-offs before presenting one recommended household plan.
- **Launch feedback and hotfixes.** Triage public feedback after Sprint 4, fix launch-blocking issues, and avoid broad feature creep while the first public users test the product.

### Product Backlog

- Real-mode header sentence refresh.
- Working-year badge in the year-by-year detail table.
- Salary chart tooltip explaining gross pre-tax salary.
- Print/PDF two-page report polish.
- Drilldown modal on year-click explaining line items.
- Flexible-spending Monte Carlo.
- Guardrail withdrawal mode.
- Implementation package / action plan.
- Plan comparison for two saved local plans.
- Multi-province support: BC and Alberta first; Quebec is larger scope because of QPP and distinct tax.
- French translation for the Quebec market.
- "What if I work N more years?" slider.
- RDSP / DTC support if relevant.
- Tax-loss-harvesting modelling in non-registered accounts.
- Annual 2027 tax-update pass.
