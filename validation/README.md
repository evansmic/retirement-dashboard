# validation/

This folder contains external-benchmark material for projection accuracy.

## Files

- `export_preset_baselines.js` regenerates deterministic outputs from the dashboard presets.
- `preset_baselines.json` is the detailed generated baseline, including scenario summaries, scenario config metadata, and annual rows for each preset/scenario.
- `preset_baselines.csv` is a spreadsheet-friendly scenario summary.
- `preset_baselines_yearly.csv` is a long-form annual export with per-year balances, withdrawals, taxable income, tax, OAS clawback, CPP/OAS/DB income, spending, shortfall, and nominal/real metadata.
- `tax_methodology_2026.md` documents the 2026 federal/Ontario tax, benefit, RRIF/LIF, pension-credit, OAS clawback, and update assumptions used by the engine.
- `external-results/` is reserved for manually captured outputs from other planners.

S0-10's engine boundary note lives at `../docs/engine_boundary_map.md`. It maps the current dashboard result surface used by this exporter, including the annual row fields that feed `preset_baselines_yearly.csv`.

S0-11 moved the first tax/benefit helpers into `../engine/tax_benefit_helpers.js`. Until the full engine is extracted, this exporter prepends that helper module before executing the dashboard script in its Node harness.

## Regenerate

```bash
node validation/export_preset_baselines.js
```

Then compare the generated baseline against free/public retirement planners first. Start with `public-comparator-single` in the Baseline scenario: it is a single age-65 retiree with flat $33K spending, RRSP/TFSA only, no spouse, no non-registered account, no DB pension, ordinary CPP/OAS at 65, and no tax-optimization scenario toggles. Use `preset_baselines.csv` for high-level scenario checks and `preset_baselines_yearly.csv` when a comparator exposes year-by-year income, tax, withdrawal, or balance values. Paid tools can be added later if account access is available and their terms permit recording benchmark outputs.

When recording a comparator run, link back to `tax_methodology_2026.md` and note any mismatch in tax year, province, indexation, CPP/OAS timing, RRIF/LIF treatment, or withdrawal order.

The current free/public comparison note is `external-results/free_public_comparison_2026-04-28.md`. S0-09 refreshed it with a Government of Canada Canadian Retirement Income Calculator run for `public-comparator-single`.
