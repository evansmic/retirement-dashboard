// Verifies CPP sharing equalizes CPP income once both spouses are receiving CPP.
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
plan.assumptions.cppSharing = true;
const engine = SimulationEngine.createSimulationEngine(plan);
const result = engine.runSimulation(engine.SCENARIOS.base.cfg);
const receivingRows = result.years.filter((row) => row.cpp_f > 0 && row.cpp_m > 0);

console.log('\n=== CPP sharing ===');
check(receivingRows.length > 0, 'projection includes years where both spouses receive CPP');
check(receivingRows.every((row) => Math.abs(row.cpp_f - row.cpp_m) <= 1), 'CPP sharing equalizes CPP income between spouses');
check(receivingRows.every((row) => row.cpp_f + row.cpp_m > 0), 'shared CPP remains positive after split');
check(Number.isFinite(result.totalTax), 'simulation returns finite lifetime tax with CPP sharing enabled');

console.log(`\n=== SUMMARY ===\nPassed: ${passed}\nFailed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
