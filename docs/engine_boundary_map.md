# Engine Boundary Map

Sprint 0 S0-10 documented the current boundaries inside `retirement_dashboard.html` before extraction work began. S0-11 then moved the first tax/benefit helper layer into `engine/tax_benefit_helpers.js`. The near-term goal is not to redesign the prototype. It is to make the next extraction steps obvious, especially for the future recommended-plan-first optimizer.

Current reference files: `retirement_dashboard.html` plus `engine/tax_benefit_helpers.js` as of S0-11.

## Boundary Summary

| Area | Current location | Ownership | Extraction posture |
|---|---:|---|---|
| Static UI shell, styles, visible labels | lines 1-545 | UI rendering and copy | Keep in app shell. Do not move into engine. |
| Plan schema, migrations, presets, hash/example loading | dashboard lines 548-1199 | persistence/hash loading plus scenario fixture setup | Split: schema/migrations/presets can become shared product data; browser hash parsing stays UI shell. |
| Extracted tax/benefit helpers | `engine/tax_benefit_helpers.js` | tax/benefit helper | Extracted in S0-11; still uses an explicit plan getter bridge for dashboard compatibility. |
| Tax/benefit bridge | dashboard lines 1202-1211 | engine bridge | Thin compatibility layer exposing old helper names to existing simulation/probes. |
| Pension splitting and draw-for-gap helpers | dashboard lines 1214-1319 | engine strategy helper | Next extraction candidate after deciding whether to keep them in tax helpers or strategy helpers. |
| Main deterministic simulation | dashboard lines 1323-1899 | pure engine core | Extract after remaining helper dependencies are parameterized. |
| Stress severity, Monte Carlo, sequence stress | dashboard lines 1901-2192 | engine stress layer | Engine-adjacent; keep separate from UI rendering. |
| Scenario configurations and sustainable-spend solver | dashboard lines 2195-2314 | scenario configuration plus optimizer seed | Keep out of low-level engine; evolve into recommendation/optimizer layer. |
| Display state, formatting, real/nominal toggle | dashboard lines 2319-2374 | UI rendering | Keep in app shell, except pure format helpers can be duplicated or small shared utils. |
| Scenario tabs, print/PDF, form back-link | dashboard lines 2376-2470 | UI rendering, validation/export surface, persistence navigation | Browser/app shell. |
| Full-spending-funded cache and MC button handlers | dashboard lines 2472-2730 | UI surface over stress engine | Keep UI wrappers separate; engine stress functions move. |
| Sequence stress UI handler | dashboard lines 2733-2848 | charting/UI rendering | Keep out of engine. |
| KPI, charts, comparison table, snapshot, detail table, header, blank landing, init | dashboard lines 2850-3326 | UI rendering, charting, copy/interpretation | Keep in app shell. |
| Validation baseline exporter | `validation/export_preset_baselines.js` | validation/export surface | Prepends the extracted helper module until the full engine can be imported directly. |

## Classification Notes

### Pure Engine

These functions compute results without intended browser side effects, even though many currently close over the global `D` payload:

- `runSimulation(cfg)` at dashboard lines 1323-1899.
- `summarizeStressRun(r)` at dashboard lines 1901-1931.
- `_mcNormalSampler()`, `mcBegin()`, `mcStep()`, `mcFinish()`, `monteCarlo()` at dashboard lines 1956-2099.
- `sequenceOfReturnsStress(baseCfg)` at dashboard lines 2178-2192.
- `solveSustainable()`, `firstShortfallYearAt()`, and `prepareScenario()` at dashboard lines 2242-2283 are computational, but they belong above the base engine because they choose scenario/recommendation settings.

Extraction issue: `runSimulation()` still reads `D` directly. S0-11 reduced the helper dependency by moving tax/benefit helpers behind an explicit plan getter, but the extracted simulation should still eventually look more like `runSimulation(plan, cfg, engineOptions)` so a future optimizer can run thousands of candidate plans without mutating globals.

### Tax And Benefit Helpers

Extracted in S0-11:

- `RRIF_RATES`, `rrif_min()`, `lif_max()`.
- `calcBracketTax()`, `idxRate()`, `cpiIndex()`, `oasIndex()`, `fedTaxIndex()`, `onTaxIndex()`, `calcTax()`, `ontarioHealthPremium()`, `oasClawback()`.
- `cppAdjFactor()`, `cppMaxAtAge()`, `calcCPP_P1()`, `calcCPP_P2()`, `calcOAS_P1()`, `calcOAS_P2()`.
- `calcDBPension()`, `calcDBPension_P2()`, `calcDBSurvivor()`.
- `calcSpending()`, `calcMortgage()`, `calcLOC()`.

Still in dashboard strategy layer:

- `optimalSplit()` and `netAfterTaxSplit()` at dashboard lines 1217-1265.

The extracted module is browser-safe and CommonJS-compatible. It exposes `createTaxBenefitHelpers(getPlan)`, so the current dashboard can keep using a global-plan bridge while future engine code can pass explicit plan state.

### Scenario Configuration

The current prototype builds five equal scenario tabs:

- `_cfgBase`, `_cfgMelt`, `_cfgZero`, `_cfgSurv`, `SCENARIOS` at dashboard lines 2195-2306.
- Sustainable-spend preparation at dashboard lines 2242-2292.
- The eager `RESULTS` run at dashboard lines 2310-2314.

For the recommended-plan-first product, this layer should not remain the user-facing default. It should become an optimizer/recommendation layer that can search CPP/OAS timing, withdrawal order, pension splitting, CPP sharing, spend guardrails, and estate trade-offs, then emit one recommended household plan plus named supporting stress cases.

### Validation And Export Surface

The validation exporter currently executes the dashboard script in a stubbed environment and returns `D`, `PRESETS`, `PRESET_META`, `RESULTS`, `SCENARIOS`, and `sequenceOfReturnsStress` from `retirement_dashboard.html`. It then serializes scenario summaries and annual rows in `validation/export_preset_baselines.js`.

Important export boundary inside the dashboard:

- Annual engine row shape is assembled at dashboard lines 1873-1896.
- Simulation totals are returned at dashboard line 1899.
- Scenario metadata lives in `SCENARIOS` at dashboard lines 2294-2306.
- Eager deterministic scenario outputs live in `RESULTS` at dashboard lines 2310-2314.

Future shape: the exporter should import the extracted engine and preset registry directly, avoiding the current "execute the browser script and stub the DOM" harness. S0-11 only prepends the helper module into that harness. Keep the current export columns stable until schema v3 defines a replacement output contract.

### UI Rendering

The UI shell includes:

- Static HTML and CSS at lines 1-545.
- Display state and formatting helpers at dashboard lines 2319-2374.
- Scenario-tab switching, detail-table toggles, print/PDF, and form navigation at dashboard lines 2376-2470.
- KPI rendering at dashboard lines 2850-2915.
- Comparison/snapshot/detail/header/blank landing rendering at dashboard lines 3047-3326.

This should remain outside the engine. The engine should return typed results; the app shell decides how to label, compare, hide, or emphasize them.

### Persistence And Hash Loading

Current browser persistence/loading surface:

- `SCHEMA_VERSION`, `MIGRATIONS`, and `migrate(D)` at lines 713-771.
- `PRESETS` and `PRESET_META` at lines 776-1108.
- `getBlankD()`, `getDefaultD()`, `_readExampleSlug()`, and `loadClientData()` at lines 1110-1199.
- `goBackToForm()` at dashboard lines 2459-2470.
- Monte Carlo skip preference via `localStorage` at dashboard lines 2617-2730.

Split target:

- Shared: schema version, migrations, preset registry, and default assumptions.
- Browser-only: URL hash parsing, query-string parsing, form round-trip navigation, and `localStorage` stress-test preference.

### Charting

Charting is not engine code:

- Chart.js dependency is loaded at line 7.
- Canvas surfaces are declared at lines 329-462.
- `renderMonteCarloResults()` creates the MC fan chart at dashboard lines 2520-2581.
- `runSequenceStressUI()` creates the sequence chart/table at dashboard lines 2739-2848.
- `getChartData()`, `initCharts()`, `chartRows()`, and `updateCharts()` live at dashboard lines 2917-3042.

The extracted engine should emit chart-ready rows or result arrays, but it should not know about Chart.js, canvas IDs, colors, or DOM updates.

### Copy And Interpretation

Copy currently lives in two places:

- Static labels and explanatory text in the HTML shell at lines 189-542.
- Dynamic interpretation in JavaScript, especially scenario-change messages, stress-test banner text, comparison labels, sustainability banner copy, and blank-state preset links at dashboard lines 2376-3326.

Future recommendation work should separate:

- Engine facts: numbers, selected strategy settings, constraints, shortfalls, depletion, tax/clawback, estate values.
- Interpretation copy: why the plan was recommended, what risks remain, and which alternatives are worth exploring.

This matters because the optimizer should not return prose as its primary output. It should return structured reasons that the UI can render in consumer-friendly language.

## Next Extraction Order

1. Move pension splitting and `netAfterTaxSplit()` once the strategy boundary is clear.
2. Parameterize the remaining simulation flow so it accepts `plan`/`person` inputs instead of reading global `D`.
3. Move `runSimulation(plan, cfg, options)` behind the same output shape currently consumed by probes and validation exports.
4. Move Monte Carlo and sequence stress into a stress module that depends only on `runSimulation()`.
5. Leave scenario tab construction in the app shell until schema v3 and the recommended-plan optimizer are defined.

This order keeps S0-12 and the next extraction pass narrow while protecting the trust work already covered by the 478-check canonical suite.
