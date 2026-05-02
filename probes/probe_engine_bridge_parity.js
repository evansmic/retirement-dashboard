// Migration bridge parity check.
//
// The React migration needs a runSimulation(plan, cfg) boundary before the
// dashboard engine is fully browser-safe and module-based. This probe verifies
// the bridge evaluates the same legacy engine and returns the same results for
// both a bundled preset and the Larry single-person regression shape.
const fs = require('fs');
const path = require('path');
const { createLegacyEngine, runSimulation } = require('../engine/legacy_engine_bridge.cjs');

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

console.log('\n═══ Engine bridge parity ═══');

const blankEngine = createLegacyEngine();
const presetPlan = blankEngine.PRESETS['diy-couple']();
const presetEngine = createLegacyEngine(presetPlan);
const presetCfg = presetEngine.SCENARIOS.base.cfg;
const presetDirect = presetEngine.runSimulation(presetCfg);
const presetBridge = runSimulation(presetPlan, presetCfg);

check(presetBridge.years.length === presetDirect.years.length, 'preset bridge returns same horizon length');
close(
  presetBridge.years[presetBridge.years.length - 1].bal_total,
  presetDirect.years[presetDirect.years.length - 1].bal_total,
  1,
  'preset end portfolio'
);
close(presetBridge.totalTax, presetDirect.totalTax, 1, 'preset total tax');

const larryEngine = createLegacyEngine(larryPlan);
const larryCfg = larryEngine.SCENARIOS.base.cfg;
const larryDirect = larryEngine.runSimulation(larryCfg);
const larryBridge = runSimulation(larryPlan, larryCfg);
const first = larryBridge.years[0];

check(larryBridge.years.length === larryDirect.years.length, 'Larry bridge returns same horizon length');
close(
  larryBridge.years[larryBridge.years.length - 1].bal_total,
  larryDirect.years[larryDirect.years.length - 1].bal_total,
  1,
  'Larry end portfolio'
);
check(first.year === 2028, `Larry projection starts in 2028 (${first.year})`);
check(first.cash_draw > 0, `Larry first-year cash wedge draw is retained (${Math.round(first.cash_draw).toLocaleString()})`);
check(Number.isFinite(first.grossIncome) && Number.isFinite(first.totalAftaxYear), 'Larry first row remains finite');

const sources = first.grossIncome + first.tfsa_draw + first.nonreg_draw + first.cash_draw;
check(Math.abs((sources - first.totalTaxYear) - first.totalAftaxYear) < 1,
  'Larry first-year sources minus tax reconcile to after-tax spend');

const bridgeSource = fs.readFileSync(path.join(__dirname, '..', 'engine', 'legacy_engine_bridge.cjs'), 'utf8');
check(/function runSimulation\(plan, cfg\)/.test(bridgeSource), 'bridge exposes runSimulation(plan, cfg) boundary');

console.log(`\n═══ SUMMARY ═══\nPassed: ${passed}\nFailed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
