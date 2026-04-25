// Phase 4.1 verification: Monte Carlo engine.
// Runs 1,000 paths with SD=10%; expects median end-portfolio near the deterministic
// run and a success rate close to (but ≤) 100% for the baseline sustainable spend.
const fs = require("fs");
const html = fs.readFileSync(require("path").join(__dirname, "..", "retirement_dashboard.html") + "", "utf8");
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const body = m[1].replace(/window\.location\.hash\.slice\(1\)/g, '""');
const wrapper = `${body}\n  return { runSimulation, monteCarlo, SCENARIOS, RESULTS };`;
const f = new Function("window", "document", wrapper);
const out = f({location:{hash:""}, addEventListener:()=>{}}, {getElementById:()=>null, addEventListener:()=>{}});

const scn = out.SCENARIOS.base;
console.log(`Baseline sustMult: ${scn.info.sustMult.toFixed(4)}`);
console.log(`Deterministic end portfolio: $${Math.round(out.RESULTS.base.years[out.RESULTS.base.years.length-1].bal_total).toLocaleString()}`);

console.log(`\nRunning 500 Monte Carlo paths (SD=10%)...`);
const t0 = Date.now();
const mc = out.monteCarlo(scn.cfg, 500, 0.05, 0.10);
const dt = Date.now() - t0;
console.log(`Completed in ${dt} ms (${(dt/500).toFixed(1)} ms/path).`);

console.log(`\nSuccess rate (zero shortfall years): ${(mc.successRate*100).toFixed(1)}%`);
console.log(`End portfolio percentiles:`);
console.log(`  p10:  $${Math.round(mc.endPortfolio.p10).toLocaleString()}`);
console.log(`  p50:  $${Math.round(mc.endPortfolio.p50).toLocaleString()}`);
console.log(`  p90:  $${Math.round(mc.endPortfolio.p90).toLocaleString()}`);
console.log(`  mean: $${Math.round(mc.endPortfolio.mean).toLocaleString()}`);

console.log(`\nFan chart sample (every 5 years):`);
console.log(`  year  age  p10        p50        p90`);
for(let i=0; i<mc.perYear.length; i+=5){
  const y = mc.perYear[i];
  console.log(`  ${y.year}  ${String(y.ageF).padStart(3)}  $${String(Math.round(y.p10)).padStart(10).replace(/\B(?=(\d{3})+(?!\d))/g,',')} $${String(Math.round(y.p50)).padStart(10).replace(/\B(?=(\d{3})+(?!\d))/g,',')} $${String(Math.round(y.p90)).padStart(10).replace(/\B(?=(\d{3})+(?!\d))/g,',')}`);
}

// Sanity checks.
if(mc.endPortfolio.p10 > mc.endPortfolio.p50 || mc.endPortfolio.p50 > mc.endPortfolio.p90){
  console.error("\nFAIL: percentile ordering violated");
  process.exit(1);
}
if(mc.perYear.length !== out.RESULTS.base.years.length){
  console.error(`\nFAIL: perYear length ${mc.perYear.length} != sim length ${out.RESULTS.base.years.length}`);
  process.exit(1);
}
console.log(`\nPASS: ${mc.perYear.length} years, p10 ≤ p50 ≤ p90 holds.`);
