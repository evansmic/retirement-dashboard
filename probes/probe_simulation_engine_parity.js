// Extracted simulation engine parity check.
//
// Verifies the standalone engine/simulation_engine.js module matches the
// dashboard-backed legacy bridge for a bundled preset and the Larry single-plan
// regression fixture. This is the migration guardrail before React depends on
// the module directly.
const { createLegacyEngine } = require('../engine/legacy_engine_bridge.cjs');
const SimulationEngine = require('../engine/simulation_engine.js');

let passed = 0, failed = 0;
function check(cond, label) {
  if (cond) { passed++; console.log('  ✓ ' + label); }
  else { failed++; console.log('  ✗ ' + label); }
}
function close(a, b, tolerance, label) {
  check(Math.abs(a - b) <= tolerance, `${label}: ${Math.round(a).toLocaleString()} ≈ ${Math.round(b).toLocaleString()}`);
}

const larryPlan = {
  schemaVersion: 2,
  p1: {
    name: 'Larry', dob: 1962, dobMonth: 12, retireYear: 2028,
    salary: 100000, salaryRefYear: 2026, salaryRaise: 0.03,
    annualRrspContrib: 18000, annualTfsaContrib: 7000, annualNonregContrib: 0,
    db_before65: 20000, db_after65: 18000, db_index: 0.022, db_startYear: 2028,
    rrsp: 300000, tfsa: 100000, tfsaRoom: 22000, tfsaAnnual: 4000,
    lif: 0, nonreg: 0, nonregAcb: 0, nonregAnnual: 0,
    cpp70_monthly: 1800, cpp65_monthly: 1268, oas_monthly: 742
  },
  p2: {
    name: 'Person 2', dob: 0, dobMonth: 0, retireYear: 0,
    salary: 0, salaryRefYear: 0, salaryRaise: 0,
    annualRrspContrib: 0, annualTfsaContrib: 0, annualNonregContrib: 0,
    db_before65: 0, db_after65: 0, db_index: 0, db_startYear: 0,
    rrsp: 0, rrspRoom: 0, tfsa: 0, tfsaRoom: 0, tfsaAnnual: 0,
    lira: 0, lif: 0, nonreg: 0, nonregAcb: 0, nonregAnnual: 0,
    cpp70_monthly: 0, cpp65_monthly: 0, oas_monthly: 0,
    cppSurv_u65_mo: 0, cppSurv_o65_mo: 0
  },
  mortgage: { balance: 0, rate: 0, monthly: 0 },
  loc: { balance: 0, rate: 0 },
  cashWedge: { balance: 145000, returnRate: 0.03, targetYears: 2.5 },
  spending: { gogo: 70000, gogoEnd: 75, slowgo: 45000, slowgoEnd: 85, nogo: 40000 },
  inheritance: 0,
  downsize: { year: 2036, netProceeds: 100000 },
  oneOffs: [{ year: 2028, amount: 20000, label: 'Vacation' }],
  assumptions: {
    retireYear: 0, planStart: null, planEnd: 2060, p1DiesInSurvivor: 0,
    returnRate: 0.0436, inflation: 0.021, returnStdDev: 0.1, horizon: 95,
    youngerSpouseRrif: false, cppSharing: false, withdrawalOrder: 'default',
    spousalRrsp: null
  }
};

function comparePlan(label, plan) {
  const legacy = createLegacyEngine(plan);
  const extracted = SimulationEngine.createSimulationEngine(plan);
  const legacyRun = legacy.runSimulation(legacy.SCENARIOS.base.cfg);
  const extractedRun = extracted.runSimulation(extracted.SCENARIOS.base.cfg);
  const first = extractedRun.years[0];
  const lastLegacy = legacyRun.years[legacyRun.years.length - 1];
  const lastExtracted = extractedRun.years[extractedRun.years.length - 1];

  check(extractedRun.years.length === legacyRun.years.length, `${label}: same horizon length`);
  close(first.grossIncome, legacyRun.years[0].grossIncome, 1, `${label}: first-year gross income`);
  close(first.totalAftaxYear, legacyRun.years[0].totalAftaxYear, 1, `${label}: first-year after-tax spend`);
  close(lastExtracted.bal_total, lastLegacy.bal_total, 1, `${label}: end portfolio`);
  close(extractedRun.totalTax, legacyRun.totalTax, 1, `${label}: total tax`);
}

console.log('\n═══ Extracted simulation engine parity ═══');

const registry = createLegacyEngine();
comparePlan('diy-couple preset', registry.PRESETS['diy-couple']());
comparePlan('Larry single plan', larryPlan);

const prepared = SimulationEngine.prepareEnginePlan(larryPlan);
check(prepared.p2.name === '—', 'prepareEnginePlan normalizes blank Person 2 for engine rows');
check(prepared.assumptions.retireYear === 2028, 'prepareEnginePlan repairs Larry retireYear');

console.log(`\n═══ SUMMARY ═══\nPassed: ${passed}\nFailed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
