// Verifies account balance rows are finite and internally consistent in the extracted engine.
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

const plan = createLegacyEngine().PRESETS['diy-couple']();
const engine = SimulationEngine.createSimulationEngine(plan);
const result = engine.RESULTS.base;
const rows = result.years.filter((row) => row.ageF >= 61 && row.ageF <= 80);

console.log('\n=== Account balance trajectory ===');
check(rows.length >= 10, 'projection includes the expected retirement-window balance rows');
check(rows.every((row) => Number.isFinite(row.bal_total)), 'total balance is finite in each row');
check(rows.every((row) => row.bal_total >= -1), 'total balance does not go materially negative');
check(rows.every((row) => Math.abs(row.bal_total - ((row.bal_rrsp || 0) + (row.bal_tfsa || 0) + (row.bal_nonreg || 0) + (row.bal_lif || 0) + (row.bal_cash || 0))) <= 2), 'account buckets reconcile to total balance');
check(rows.some((row) => row.rrif_draw_f + row.rrif_draw_m > 0), 'registered withdrawals appear in the retirement window');

console.log(`\n=== SUMMARY ===\nPassed: ${passed}\nFailed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
