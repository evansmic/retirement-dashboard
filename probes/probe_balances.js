const fs = require("fs");
const html = fs.readFileSync(require("path").join(__dirname, "..", "retirement_dashboard.html") + "", "utf8");
const m = html.match(/<script>([\s\S]*?)<\/script>/);
let body = m[1].replace(/window\.location\.hash\.slice\(1\)/g, '""');
const wrapper = `${body}\n  return { SCENARIOS, RESULTS, D };`;
const f = new Function("window", "document", wrapper);
const out = f({location:{hash:""}, addEventListener:()=>{}}, {getElementById:()=>null, addEventListener:()=>{}});
console.log("Baseline: portfolio depletion trajectory (2027-2045)");
console.log("Year  AgeF  RRSP_F   RRSP_M   TFSA     NonReg   LIF      Total");
for (const y of out.RESULTS.base.years.filter(x => x.ageF >= 61 && x.ageF <= 80)) {
  const t = Math.round;
  console.log(`${y.year}  ${y.ageF.toString().padStart(3)}   $${t(y.bal_rrsp_f||0).toString().padStart(7)} $${t(y.bal_rrsp_m||0).toString().padStart(7)} $${t(y.bal_tfsa||0).toString().padStart(7)} $${t(y.bal_nonreg||0).toString().padStart(7)} $${t(y.bal_lif||0).toString().padStart(7)} $${t(y.bal_total||0).toString().padStart(8)}`);
}
// max spend multiplier
console.log("\nMax Spend scenario multiplier:", out.RESULTS.maxs.spendMultiplier);
