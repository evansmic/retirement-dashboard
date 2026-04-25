// Phase 3.4 verification: spousal RRSP attribution reroutes income during the 3yr window.
const fs = require("fs");
const html = fs.readFileSync(require("path").join(__dirname, "..", "retirement_dashboard.html") + "", "utf8");
const m = html.match(/<script>([\s\S]*?)<\/script>/);
let body = m[1].replace(/window\.location\.hash\.slice\(1\)/g, '""');
// Inject: Frank contributed $20K to a spousal RRSP in 2026 and $20K in 2027.
// So in 2027 (year of retirement), attribution window sees $40K; in 2028 = $40K;
// in 2029 = $20K (only 2027 remains in [y-2..y]); in 2030 = $0.
body = body.replace('const D = loadClientData();',
  'const D = loadClientData(); D.assumptions.spousalRrsp = { contributor: "f", contribs: { 2026: 20000, 2027: 20000 } };');
const wrapper = `${body}\n  return { runSimulation, D, _cfgMelt };`;
const f = new Function("window", "document", wrapper);
const out = f({location:{hash:""}, addEventListener:()=>{}}, {getElementById:()=>null, addEventListener:()=>{}});

const r = out.runSimulation(out._cfgMelt);  // use meltdown since Moon has RRSP draws
console.log(`Meltdown with spousal RRSP (Frank contributor, Moon annuitant, $40K contrib 2026+2027):`);
console.log(`End portfolio: $${Math.round(r.years[r.years.length-1].bal_total).toLocaleString()}`);
console.log(`Shortfalls:    ${r.years.filter(y=>y.shortfall>500).length}`);
console.log(`Lifetime tax:  $${Math.round(r.totalTax).toLocaleString()}`);

console.log(`\nEarly years (Moon's draw — partially attributed to Frank in window years):`);
for(const y of r.years.slice(0, 6)){
  console.log(`  ${y.year} F:${y.ageF} M_RRSP_draw:$${String(Math.round(y.rrif_draw_m)).padStart(6)} F_RRSP_draw:$${String(Math.round(y.rrif_draw_f)).padStart(6)} F_tax:$${String(Math.round(y.totalTaxYear)).padStart(6)} Split:$${Math.round(y.splitAmt)}`);
}
