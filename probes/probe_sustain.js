// Verifies sustainable-spending scenario metadata remains present and finite in the extracted engine.
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
const results = engine.RESULTS;

console.log('\n=== Sustainable spending scenarios ===');
check(Object.keys(results).includes('maxs'), 'max-spending scenario exists');
check(Number.isFinite(results.base.sustMult) && results.base.sustMult > 0, 'base sustainable multiplier is finite');
check(Number.isFinite(results.maxs.sustMult) && results.maxs.sustMult > 0, 'max-spending multiplier is finite');
check(results.maxs.feasible === true, 'max-spending scenario is marked feasible at its solved multiplier');
check(results.base.years.length === results.maxs.years.length, 'base and max-spending scenarios share the same horizon');
check(results.maxs.years.every((row) => Number.isFinite(row.totalAftaxYear)), 'max-spending annual rows stay finite');

console.log(`\n=== SUMMARY ===\nPassed: ${passed}\nFailed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
