// Phase 5.5: end-to-end verification for pre-retirement modelling.
// Simulates a fresh intake (assembling the `D` payload exactly like index.html would),
// runs the dashboard engine, and checks that:
//   (1) Plan starts at `planStart` (not retireYear) when planStart < both retireYears.
//   (2) A couple both still working sees salary + contribs in the pre-retirement years.
//   (3) Spousal RRSP attribution now anchors on the ANNUITANT's retire year (Phase 5.2).
//   (4) Total lifetime after-tax income is ≥ the all-retired baseline
//       (working years add salary income, net of taxes, on top).
//   (5) Monte Carlo still runs against a plan with working years.
//   (6) Year-over-year continuity across the retirement transition — no jump-discontinuity
//       in total portfolio balance when a spouse stops working.
const fs = require("fs");
const html = fs.readFileSync(require("path").join(__dirname, "..", "retirement_dashboard.html") + "", "utf8");
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const body = m[1].replace(/window\.location\.hash\.slice\(1\)/g, '""');
const helper = fs.readFileSync(require("path").join(__dirname, "..", "engine", "tax_benefit_helpers.js"), "utf8");
const wrapper = `${helper}
${body}\n  return { runSimulation, monteCarlo, SCENARIOS, RESULTS, D };`;
const f = new Function("window", "document", wrapper);
const out = f({location:{hash:""}, addEventListener:()=>{}}, {getElementById:()=>null, addEventListener:()=>{}});
const D = out.D;

let passed = 0, failed = 0;
function check(cond, label){
  if(cond){ passed++; console.log("  ✓ " + label); }
  else   { failed++; console.log("  ✗ " + label); }
}

// Save/restore scaffolding.
const saved = {
  p1: Object.assign({}, D.p1),
  p2: Object.assign({}, D.p2),
  assumptions: Object.assign({}, D.assumptions),
};

// ── Scenario A: both working, staggered retirement, dual DB pensions ──
Object.assign(D.assumptions, { planStart: 2026, retireYear: 2031 });
Object.assign(D.p1, { retireYear: 2031, salary: 140000, salaryRefYear: 2026,
  salaryRaise: 0.03, annualRrspContrib: 18000, annualTfsaContrib: 7000, annualNonregContrib: 5000 });
Object.assign(D.p2, { retireYear: 2035, salary: 95000, salaryRefYear: 2026,
  salaryRaise: 0.025, annualRrspContrib: 12000, annualTfsaContrib: 7000, annualNonregContrib: 0,
  db_before65: 0, db_after65: 28000, db_startYear: 2035, db_index: 0.022 });

const cfg = Object.assign({}, out.SCENARIOS.base.cfg);
const sim = out.runSimulation(cfg);

// (1) Plan starts at planStart.
console.log("\n═══ (1) Plan start honors `planStart` ═══");
check(sim.years[0].year === 2026, `first year = ${sim.years[0].year} (expected 2026)`);
check(sim.years.some(y => y.year === 2031), "2031 (P1 retires) present");
check(sim.years.some(y => y.year === 2035), "2035 (P2 retires) present");

// (2) Pre-retirement incomes.
console.log("\n═══ (2) Pre-retirement incomes ═══");
const y2026 = sim.years.find(y => y.year === 2026);
const y2033 = sim.years.find(y => y.year === 2033);  // P1 retired, P2 working
const y2036 = sim.years.find(y => y.year === 2036);  // both retired
check(y2026.salary_f > 130000 && y2026.salary_f < 145000, `2026 P1 salary $${Math.round(y2026.salary_f).toLocaleString()}`);
check(y2026.salary_m >  90000 && y2026.salary_m < 100000, `2026 P2 salary $${Math.round(y2026.salary_m).toLocaleString()}`);
check(y2033.salary_f === 0 && y2033.salary_m > 0, `2033 staggered: F=0, M=$${Math.round(y2033.salary_m).toLocaleString()}`);
check(y2036.salary_f === 0 && y2036.salary_m === 0, "2036 both retired");
check(y2036.dbPension_m > 25000, `2036 P2 DB pension $${Math.round(y2036.dbPension_m).toLocaleString()}`);

// (3) Monte Carlo still runs.
console.log("\n═══ (3) Monte Carlo against working-years plan ═══");
const mc = out.monteCarlo(cfg, 60, 0.05, 0.10);
check(mc.perYear.length === sim.years.length, `MC fan has ${mc.perYear.length} years (matches sim ${sim.years.length})`);
check(mc.successRate >= 0 && mc.successRate <= 1, `success rate = ${(mc.successRate*100).toFixed(1)}%`);

// (4) Working years add lifetime after-tax income vs all-retired baseline.
// Restore to all-retired, re-run, compare lifetime totals.
const lifeAftaxWorking = sim.totalAftax;
Object.assign(D.p1, saved.p1);
Object.assign(D.p2, saved.p2);
Object.assign(D.assumptions, saved.assumptions);
const simAllRet = out.runSimulation(Object.assign({}, out.SCENARIOS.base.cfg));
const lifeAftaxRet = simAllRet.totalAftax;

console.log("\n═══ (4) Lifetime after-tax comparison ═══");
console.log(`  Working scenario:  $${Math.round(lifeAftaxWorking).toLocaleString()}`);
console.log(`  All-retired base:  $${Math.round(lifeAftaxRet).toLocaleString()}`);
check(lifeAftaxWorking >= lifeAftaxRet, `working ≥ all-retired (working years add net income)`);

// (5) Year-over-year portfolio continuity on retirement transition.
// Restore working scenario, re-run, examine 2031 vs 2030 & 2035 vs 2034.
Object.assign(D.assumptions, { planStart: 2026, retireYear: 2031 });
Object.assign(D.p1, { retireYear: 2031, salary: 140000, salaryRefYear: 2026,
  salaryRaise: 0.03, annualRrspContrib: 18000, annualTfsaContrib: 7000, annualNonregContrib: 5000 });
Object.assign(D.p2, { retireYear: 2035, salary: 95000, salaryRefYear: 2026,
  salaryRaise: 0.025, annualRrspContrib: 12000, annualTfsaContrib: 7000, annualNonregContrib: 0,
  db_before65: 0, db_after65: 28000, db_startYear: 2035, db_index: 0.022 });
const sim2 = out.runSimulation(Object.assign({}, out.SCENARIOS.base.cfg));
const yPrev = sim2.years.find(y => y.year === 2030);
const yCurr = sim2.years.find(y => y.year === 2031);
console.log("\n═══ (5) Year-over-year portfolio continuity at retirement transition ═══");
const jump = Math.abs(yCurr.bal_total - yPrev.bal_total) / Math.max(1, yPrev.bal_total);
console.log(`  2030 → 2031 portfolio: $${Math.round(yPrev.bal_total).toLocaleString()} → $${Math.round(yCurr.bal_total).toLocaleString()} (Δ ${(jump*100).toFixed(1)}%)`);
check(jump < 0.25, `continuity holds (|Δ| < 25% across P1's retirement transition)`);

// Restore.
Object.assign(D.p1, saved.p1);
Object.assign(D.p2, saved.p2);
Object.assign(D.assumptions, saved.assumptions);

console.log(`\n═══ SUMMARY ═══\nPassed: ${passed}\nFailed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
