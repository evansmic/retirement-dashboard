# validation/

This folder contains external-benchmark material for projection accuracy.

## Files

- `export_preset_baselines.js` regenerates deterministic outputs from the dashboard presets.
- `preset_baselines.json` is the detailed generated baseline.
- `preset_baselines.csv` is a spreadsheet-friendly summary.
- `external-results/` is reserved for manually captured outputs from other planners.

## Regenerate

```bash
node validation/export_preset_baselines.js
```

Then compare the generated baseline against free/public retirement planners first. Paid tools can be added later if account access is available and their terms permit recording benchmark outputs.

