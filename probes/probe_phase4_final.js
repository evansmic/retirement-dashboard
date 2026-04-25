// Phase 4 end-to-end verification.
// Checks:
//   (a) All 5 deterministic scenarios still hit 0 shortfall years (Phase 1-3 regression).
//   (b) Monte Carlo runs for each scenario, percentile ordering holds.
//   (c) Sequence-of-returns test runs, each historical crash reduces end portfolio.
//   (d) Probability-of-success helper returns [0,1].
//   (e) Engine `cfg.returnRates` override takes precedence over `returnRate` scalar.
const fs = require("fs");
const html = fs.readFileSync(require("path").join(__dirname, "..", "retirement_dashboard.html") + "", "utf8");
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const body = m[1].replace(/window\.location\.hash\.slice\(1\)/g, '""');
const wrapper = `${body}\n  return { runSimulation, monteCarlo, sequenceOfReturnsStress, probabilityOfSuccess, HISTORICAL_SEQUENCES, SCENARIOS, RESULTS };`;
const f = new Function("window", "document", wrapper);
const out = f({location:{hash:""}, addEventListener:()=>{}}, {getElementById:()=>null, addEventListener:()=>{}});

let passed = 0, failed = 0;
function check(cond, label){
  if(cond){ passed++; console.log("  ✓ " + label); }
  else   { failed++; console.log("  ✗ " + label); }
}

// (a) Scenario regression.
console.log("\n═══ (a) Scenarios: zero shortfall years ═══");
for(const key of ['base','melt','zero','surv','maxs']){
  const r = out.RESULTS[key];
  const short = r.years.filter(y => y.shortfall > 500).length;
  check(short === 0, `${key.padEnd(5)} (${out.SCENARIOS[key].label.padEnd(40)}) — ${short} shortfall years`);
}

// (b) Monte Carlo.
console.log("\n═══ (b) Monte Carlo engine ═══");
const mc = out.monteCarlo(out.SCENARIOS.base.cfg, 200, 0.05, 0.10);
check(mc.perYear.length > 30, `perYear length = ${mc.perYear.length}`);
check(mc.perYear.every(y => y.p10 <= y.p50 && y.p50 <= y.p90), "p10 ≤ p50 ≤ p90 for all years");
check(mc.endPortfolio.p10 <= mc.endPortfolio.p50, "end p10 ≤ p50");
check(mc.endPortfolio.p50 <= mc.endPortfolio.p90, "end p50 ≤ p90");
check(mc.successRate >= 0 && mc.successRate <= 1, `successRate = ${mc.successRate.toFixed(3)} ∈ [0,1]`);

// (c) Sequence-of-returns.
console.log("\n═══ (c) Sequence-of-returns stress ═══");
const sor = out.sequenceOfReturnsStress(out.SCENARIOS.base.cfg);
check(sor._baseline.years.length > 30, "baseline has full horizon");
const baseEnd = sor._baseline.years[sor._baseline.years.length-1].bal_total;
for(const k of ['1929','1973','2000','2008']){
  const end = sor[k].years[sor[k].years.length-1].bal_total;
  check(end <= baseEnd + 1, `${k} end ($${Math.round(end).toLocaleString()}) ≤ baseline ($${Math.round(baseEnd).toLocaleString()})`);
}

// (d) Probability of success helper.
console.log("\n═══ (d) probabilityOfSuccess helper ═══");
const ps = out.probabilityOfSuccess(out.SCENARIOS.base.cfg, 100);
check(ps >= 0 && ps <= 1, `probabilityOfSuccess = ${ps.toFixed(3)} ∈ [0,1]`);

// (e) returnRates override.
console.log("\n═══ (e) cfg.returnRates override ═══");
const flatCfg = Object.assign({}, out.SCENARIOS.base.cfg, { returnRate: 0.05 });
const zeroCfg = Object.assign({}, flatCfg, { returnRates: new Array(50).fill(0.0) });
const flatRes = out.runSimulation(flatCfg);
const zeroRes = out.runSimulation(zeroCfg);
const flatEnd = flatRes.years[flatRes.years.length-1].bal_total;
const zeroEnd = zeroRes.years[zeroRes.years.length-1].bal_total;
check(zeroEnd < flatEnd, `zero-return override (${Math.round(zeroEnd).toLocaleString()}) < 5% baseline (${Math.round(flatEnd).toLocaleString()})`);

// Wrap up.
console.log(`\n═══ SUMMARY ═══\nPassed: ${passed}\nFailed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
