// Verifies OAS recovery tax is computed after pension splitting in the extracted engine.
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

const plan = createLegacyEngine().PRESETS['db-pension-couple']();
const engine = SimulationEngine.createSimulationEngine(plan);
const config = engine.SCENARIOS.base.cfg;
const noSplit = engine.runSimulation({ ...config, pensionSplit: false });
const split = engine.runSimulation({ ...config, pensionSplit: true });
const noSplitRecovery = noSplit.years.reduce((total, row) => total + row.totalOasClawY, 0);
const splitRecovery = split.years.reduce((total, row) => total + row.totalOasClawY, 0);
const splitRows = split.years.filter((row) => row.splitAmt > 0);

console.log('\n=== OAS recovery after pension splitting ===');
check(splitRows.length > 0, 'pension splitting is selected in at least one projection year');
check(split.totalTax < noSplit.totalTax, `combined tax/recovery improves (${Math.round(noSplit.totalTax)} → ${Math.round(split.totalTax)})`);
check(splitRecovery < noSplitRecovery, `lifetime OAS recovery tax falls after split (${Math.round(noSplitRecovery)} → ${Math.round(splitRecovery)})`);
check(split.years.every((row) => row.clawF >= 0 && row.clawM >= 0), 'post-split recovery tax stays non-negative for both spouses');
check(split.years.length === noSplit.years.length, 'split comparison keeps the same projection horizon');

console.log(`\n=== SUMMARY ===\nPassed: ${passed}\nFailed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
