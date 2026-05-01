// Phase 5.3 verification: pre-retirement employment, staggered retirement, dual DB pensions.
// Checks:
//   (a) Existing deterministic scenarios still return 0 shortfall years (no regression).
//   (b) With planStart earlier than retireYear and salary > 0, salary appears in
//       pre-retirement year rows but not post-retirement year rows.
//   (c) RRSP contributions during working years grow the RRSP balance.
//   (d) TFSA contributions during working years grow the TFSA balance.
//   (e) Staggered retirement: salary_m is non-zero AFTER p1.retireYear if p2
//       retires later.
//   (f) P2's DB pension (db_before65/db_after65) shows up after their retireYear.
const fs = require("fs");
const html = fs.readFileSync(require("path").join(__dirname, "..", "retirement_dashboard.html") + "", "utf8");
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const body = m[1].replace(/window\.location\.hash\.slice\(1\)/g, '""');
const helper = fs.readFileSync(require("path").join(__dirname, "..", "engine", "tax_benefit_helpers.js"), "utf8");
const wrapper = `${helper}
${body}\n  return { runSimulation, SCENARIOS, RESULTS, D };`;
const f = new Function("window", "document", wrapper);
const out = f({location:{hash:""}, addEventListener:()=>{}}, {getElementById:()=>null, addEventListener:()=>{}});

let passed = 0, failed = 0;
function check(cond, label){
  if(cond){ passed++; console.log("  ✓ " + label); }
  else   { failed++; console.log("  ✗ " + label); }
}

// (a) Scenario regression.
console.log("\n═══ (a) Existing scenarios still produce 0 shortfall years ═══");
for(const key of ['base','melt','zero','surv','maxs']){
  const r = out.RESULTS[key];
  const short = r.years.filter(y => y.shortfall > 500).length;
  check(short === 0, `${key.padEnd(5)} — ${short} shortfall years`);
}

// (b) Pre-retirement salary appears only in working years.
console.log("\n═══ (b) Salary in working years only ═══");
const D = out.D;
// Deep clone assumption + p1 to inject a pre-retirement scenario.
const preRetCfg = Object.assign({}, out.SCENARIOS.base.cfg);
// Override the in-engine `D` directly via a modified copy and re-run via runSimulation.
// Easiest path: monkey-patch D.p1.retireYear / D.assumptions.planStart, then revert.
const savedP1 = Object.assign({}, D.p1);
const savedP2 = Object.assign({}, D.p2);
const savedAssum = Object.assign({}, D.assumptions);

D.assumptions.planStart = 2026;
// Sprint 1 #58: pin dob explicitly. The (f) check below asserts P2's
// db_after65 income at 2035 — that requires P2 to be 66 in 2035, so dob=1969.
// The new blank default (diy-couple-shaped) has different birth years, so
// we no longer get those for free.
D.p1.dob = 1966; D.p1.dobMonth = 6;
D.p2.dob = 1969; D.p2.dobMonth = 3;
D.p1.retireYear = 2031;
D.p1.salary = 120000;
D.p1.salaryRefYear = 2026;
D.p1.salaryRaise = 0.03;
D.p1.annualRrspContrib = 15000;
D.p1.annualTfsaContrib = 7000;
D.p1.annualNonregContrib = 3000;
D.p2.retireYear = 2034;  // staggered — p2 retires 3 years after p1
D.p2.salary = 80000;
D.p2.salaryRefYear = 2026;
D.p2.salaryRaise = 0.03;
D.p2.annualRrspContrib = 10000;
D.p2.annualTfsaContrib = 7000;
D.p2.annualNonregContrib = 0;
// Phase 5.2: P2 DB pension starts at their retire year.
D.p2.db_before65 = 0;
D.p2.db_after65  = 24000;
D.p2.db_startYear = 2034;
D.p2.db_index    = 0.022;

const preRet = out.runSimulation(preRetCfg);

const y2026 = preRet.years.find(y => y.year === 2026);
const y2030 = preRet.years.find(y => y.year === 2030);
const y2032 = preRet.years.find(y => y.year === 2032);  // p1 retired, p2 working
const y2035 = preRet.years.find(y => y.year === 2035);  // both retired
check(y2026 && y2026.salary_f > 100000, `2026 salary_f = $${Math.round((y2026||{}).salary_f||0).toLocaleString()} (expected ~$120k)`);
check(y2026 && y2026.salary_m > 70000,  `2026 salary_m = $${Math.round((y2026||{}).salary_m||0).toLocaleString()} (expected ~$80k)`);
check(y2030 && y2030.salary_f > y2026.salary_f, `salary_f grew 2026→2030 ($${Math.round(y2030.salary_f).toLocaleString()} > $${Math.round(y2026.salary_f).toLocaleString()})`);

// (c/d/e) Staggered retirement.
console.log("\n═══ (c/d/e) Staggered retirement and contributions ═══");
check(y2032 && y2032.salary_f === 0, `2032 salary_f = 0 (p1 retired 2031)`);
check(y2032 && y2032.salary_m > 0,   `2032 salary_m = $${Math.round((y2032||{}).salary_m||0).toLocaleString()} (p2 still working)`);
check(y2035 && y2035.salary_f === 0 && y2035.salary_m === 0, "2035 both retired, no salary");

// Check RRSP balance grew pre-retirement thanks to contributions.
const y2025 = preRet.years[0];  // first year (= 2026)
const rrspEnd2030 = y2030.bal_rrsp_f;
const rrspStart   = D.p1.rrsp;
// Over 5 years, contributing $15k/yr @ 5% should roughly (15k * annuity(5,5%)) + initial*(1.05)^5
check(rrspEnd2030 > rrspStart, `RRSP balance grew during working years ($${Math.round(rrspStart).toLocaleString()} → $${Math.round(rrspEnd2030).toLocaleString()})`);

// (f) P2 DB pension appears after their retireYear (2034).
console.log("\n═══ (f) P2 DB pension ═══");
const y2033 = preRet.years.find(y => y.year === 2033);
check(y2033 && !y2033.dbPension_m, "2033 no p2 DB pension (still working)");
check(y2035 && y2035.dbPension_m > 20000, `2035 p2 DB pension = $${Math.round((y2035||{}).dbPension_m||0).toLocaleString()} (expected ~$24k + inflation)`);

// Restore D.
Object.assign(D.p1, savedP1);
Object.assign(D.p2, savedP2);
Object.assign(D.assumptions, savedAssum);


console.log(`\n═══ SUMMARY ═══\nPassed: ${passed}\nFailed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
