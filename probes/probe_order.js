// Verifies withdrawal-order configs materially change early-year funding sources without breaking feasibility.
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
const base = engine.SCENARIOS.base.cfg;
const defaultRun = engine.runSimulation({ ...base, withdrawalOrder: 'default' });
const meltdownRun = engine.runSimulation({ ...base, withdrawalOrder: 'meltdown' });
const defaultFirstDraw = defaultRun.years.find((row) => row.rrif_draw_f + row.rrif_draw_m + row.nonreg_draw + row.tfsa_draw > 0);
const meltdownFirstDraw = meltdownRun.years.find((row) => row.rrif_draw_f + row.rrif_draw_m + row.nonreg_draw + row.tfsa_draw > 0);

console.log('\n=== Withdrawal order comparison ===');
check(Boolean(defaultFirstDraw && meltdownFirstDraw), 'both withdrawal orders produce draw rows');
check(defaultFirstDraw.nonreg_draw + defaultFirstDraw.tfsa_draw >= defaultFirstDraw.rrif_draw_f + defaultFirstDraw.rrif_draw_m, 'default order favors flexible accounts before registered draws');
check(meltdownFirstDraw.rrif_draw_f + meltdownFirstDraw.rrif_draw_m > 0, 'meltdown order starts registered draws earlier');
check(Number.isFinite(defaultRun.totalTax) && Number.isFinite(meltdownRun.totalTax), 'both order runs return finite lifetime tax');
check(defaultRun.years.length === meltdownRun.years.length, 'withdrawal-order comparison keeps the same projection horizon');

console.log(`\n=== SUMMARY ===\nPassed: ${passed}\nFailed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
