// Sprint 0 S0-07: validation baseline export shape.
//
// Locks down the audit/export fields used for external comparisons. This probe
// validates the generated artifacts; regenerate them with
// `node validation/export_preset_baselines.js` after changing the exporter.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const jsonPath = path.join(root, 'validation', 'preset_baselines.json');
const summaryCsvPath = path.join(root, 'validation', 'preset_baselines.csv');
const yearlyCsvPath = path.join(root, 'validation', 'preset_baselines_yearly.csv');

const baselines = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const summaryCsv = fs.readFileSync(summaryCsvPath, 'utf8').trim().split(/\r?\n/);
const yearlyCsv = fs.readFileSync(yearlyCsvPath, 'utf8').trim().split(/\r?\n/);

let passed = 0, failed = 0;
function check(cond, label){
  if(cond){ passed++; console.log("  ✓ " + label); }
  else    { failed++; console.log("  ✗ " + label); }
}

function csvHeader(line){
  return line.split(',').map(v => v.replace(/^"|"$/g, ''));
}

console.log("\n=== (a) Top-level baseline metadata ===");
check(baselines.methodology === 'validation/tax_methodology_2026.md', 'methodology note linked');
check(baselines.dollarMode === 'nominal', 'top-level dollarMode is nominal');
check(Object.keys(baselines.presets || {}).length === 5, 'five preset baselines exported');

console.log("\n=== (b) Scenario config + annual JSON rows ===");
const requiredAnnualFields = [
  'year', 'ageP1', 'ageP2', 'dollarMode', 'realBaseYear',
  'taxableIncomeP1', 'taxableIncomeP2', 'taxableIncomeTotal',
  'totalTax', 'oasClawbackTotal',
  'dbPensionP1', 'dbPensionP2', 'dbSurvivor', 'cppP1', 'cppP2', 'oasP1Net', 'oasP2Net',
  'registeredDrawP1', 'registeredDrawP2', 'registeredDrawTotal',
  'tfsaDrawTotal', 'nonRegDrawTotal', 'cashDraw',
  'rrspRrifBalanceTotal', 'tfsaBalanceTotal', 'lifBalanceTotal', 'nonRegBalanceTotal', 'cashBalance', 'totalPortfolio'
];

let totalAnnualRows = 0;
for(const [slug, preset] of Object.entries(baselines.presets)){
  check(!!(preset.household && preset.household.assumptions), `${slug}: assumption metadata present`);
  let checkedShape = false;
  for(const [scenarioKey, scenario] of Object.entries(preset.scenarios)){
    totalAnnualRows += Array.isArray(scenario.annual) ? scenario.annual.length : 0;
    if(checkedShape) continue;
    check(!!scenario.config, `${slug}/${scenarioKey}: scenario config present`);
    check(Array.isArray(scenario.annual) && scenario.annual.length === scenario.years,
          `${slug}/${scenarioKey}: annual rows match scenario years`);
    const first = scenario.annual[0] || {};
    for(const field of requiredAnnualFields){
      check(Object.prototype.hasOwnProperty.call(first, field), `${slug}/${scenarioKey}: annual field ${field}`);
    }
    check(first.dollarMode === 'nominal', `${slug}/${scenarioKey}: annual dollarMode is nominal`);
    check(first.taxableIncomeTotal === first.taxableIncomeP1 + first.taxableIncomeP2,
      `${slug}/${scenarioKey}: taxableIncomeTotal reconciles`);
    checkedShape = true; // Field-shape checks are identical for all scenarios in the preset.
  }
}

console.log("\n=== (c) CSV artifacts ===");
const summaryHeader = csvHeader(summaryCsv[0]);
const yearlyHeader = csvHeader(yearlyCsv[0]);
check(summaryHeader.includes('sustainableSpendMultiplier'), 'summary CSV retains sustainableSpendMultiplier');
check(yearlyHeader.includes('taxableIncomeTotal'), 'yearly CSV includes taxableIncomeTotal');
check(yearlyHeader.includes('registeredDrawTotal'), 'yearly CSV includes registeredDrawTotal');
check(yearlyHeader.includes('totalPortfolio'), 'yearly CSV includes totalPortfolio');
check(yearlyCsv.length - 1 === totalAnnualRows, `yearly CSV data rows (${yearlyCsv.length - 1}) match annual JSON rows (${totalAnnualRows})`);

console.log(`\n=== SUMMARY ===\nPassed: ${passed}\nFailed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
