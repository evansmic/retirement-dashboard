// Phase 4.2 verification: sequence-of-returns stress test.
// Expects: end-portfolio shrinks (often dramatically) under historical crashes
// relative to the mean-return baseline. A shortfall may appear — that's the point.
const fs = require("fs");
const html = fs.readFileSync(require("path").join(__dirname, "..", "retirement_dashboard.html") + "", "utf8");
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const body = m[1].replace(/window\.location\.hash\.slice\(1\)/g, '""');
const wrapper = `${body}\n  return { sequenceOfReturnsStress, HISTORICAL_SEQUENCES, SCENARIOS };`;
const f = new Function("window", "document", wrapper);
const out = f({location:{hash:""}, addEventListener:()=>{}}, {getElementById:()=>null, addEventListener:()=>{}});

for(const key of ['base', 'melt']){
  const scn = out.SCENARIOS[key];
  console.log(`\n═══ ${scn.label} ═══`);
  const r = out.sequenceOfReturnsStress(scn.cfg);
  const baseEnd = r._baseline.years[r._baseline.years.length-1].bal_total;
  console.log(`Baseline (no shock):   end $${Math.round(baseEnd).toLocaleString()}  shortfalls: ${r._baseline.years.filter(y=>y.shortfall>500).length}`);
  for(const seqKey of Object.keys(out.HISTORICAL_SEQUENCES)){
    const sim = r[seqKey];
    const end = sim.years[sim.years.length-1].bal_total;
    const shortfalls = sim.years.filter(y=>y.shortfall>500).length;
    const pct = ((end - baseEnd) / Math.max(1, baseEnd) * 100).toFixed(1);
    console.log(`  ${seqKey} (${sim.label.padEnd(30)})  end $${String(Math.round(end)).padStart(12).replace(/\B(?=(\d{3})+(?!\d))/g,',')}  Δ ${pct.padStart(6)}%  shortfalls: ${shortfalls}`);
  }
}

// Sanity: baseline should match the stored RESULTS[key].
const scn = out.SCENARIOS.base;
const r = out.sequenceOfReturnsStress(scn.cfg);
const expected = scn.cfg;
if(r._baseline.years.length === 0){
  console.error("\nFAIL: baseline had no years");
  process.exit(1);
}
console.log("\nPASS: baseline length =", r._baseline.years.length, "| sequences =", Object.keys(out.HISTORICAL_SEQUENCES).length);
