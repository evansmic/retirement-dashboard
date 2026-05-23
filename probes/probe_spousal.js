// Verifies spousal RRSP attribution affects taxable income during the attribution window.
const { createLegacyEngine } = require('../engine/legacy_engine_bridge.cjs');
const SimulationEngine = require('../engine/simulation_engine.js');

let passed = 0;
let failed = 0;

function check(condition, label) {
  if (condition) {
    passed += 1;
    console.log(`  OK ${label}`);
  } else {
    failed += 1;
    console.log(`  FAIL ${label}`);
  }
}

function run(withSpousalAttribution) {
  const plan = createLegacyEngine().PRESETS['diy-couple']();
  if (withSpousalAttribution) {
    plan.assumptions.spousalRrsp = {
      contributor: 'f',
      contribs: { 2032: 20000, 2033: 20000, 2034: 20000 }
    };
  }
  const engine = SimulationEngine.createSimulationEngine(plan);
  return engine.runSimulation(engine.SCENARIOS.melt.cfg);
}

const noAttribution = run(false);
const withAttribution = run(true);
const rowNo = noAttribution.years.find((row) => row.year === 2034);
const rowYes = withAttribution.years.find((row) => row.year === 2034);
const rowAfterWindow = withAttribution.years.find((row) => row.year === 2037);

console.log('\n=== Spousal RRSP attribution ===');
check(Boolean(rowNo && rowYes), 'comparison rows are available');
check(rowYes.rrif_draw_m > 0, 'annuitant spouse has registered draw during attribution window');
check(rowYes.taxableIncomeF > rowNo.taxableIncomeF + 10000, 'contributor taxable income rises during attribution window');
check(rowYes.taxableIncomeM < rowNo.taxableIncomeM - 10000, 'annuitant taxable income falls during attribution window');
check(rowAfterWindow.taxableIncomeM > rowAfterWindow.taxableIncomeF, 'attribution fades after the window and annuitant income carries the draw');
check(Number.isFinite(withAttribution.totalTax), 'simulation remains finite with attribution enabled');

console.log(`\n=== SUMMARY ===\nPassed: ${passed}\nFailed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
