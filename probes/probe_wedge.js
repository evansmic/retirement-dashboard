// Phase 3.2 verification: cash wedge engages and refills from surplus.
const fs = require("fs");
const html = fs.readFileSync(require("path").join(__dirname, "..", "retirement_dashboard.html") + "", "utf8");
const m = html.match(/<script>([\s\S]*?)<\/script>/);
let body = m[1].replace(/window\.location\.hash\.slice\(1\)/g, '""');
// Inject a cash wedge config into D before sim runs.
body = body.replace('const D = loadClientData();',
  'const D = loadClientData(); D.cashWedge = { balance: 150000, returnRate: 0.03, targetYears: 2 };');
const wrapper = `${body}\n  return { runSimulation, D, _cfgBase, _cfgMelt };`;
const f = new Function("window", "document", wrapper);
const out = f({location:{hash:""}, addEventListener:()=>{}}, {getElementById:()=>null, addEventListener:()=>{}});

function summarize(cfg, label){
  const r = out.runSimulation(cfg);
  console.log(`\n── ${label} ──`);
  console.log(`End portfolio: $${Math.round(r.years[r.years.length-1].bal_total).toLocaleString()} (cash: $${Math.round(r.years[r.years.length-1].bal_cash||0).toLocaleString()})`);
  console.log(`Lifetime tax:  $${Math.round(r.totalTax).toLocaleString()}`);
  console.log(`Shortfalls:    ${r.years.filter(y=>y.shortfall>500).length}`);
  console.log(`Early cash draws + refills:`);
  for(const y of r.years.slice(0, 8)){
    console.log(`  ${y.year} F:${y.ageF} cashDraw:$${String(Math.round(y.cash_draw||0)).padStart(6)} cashBal:$${String(Math.round(y.bal_cash||0)).padStart(7)} nrDraw:$${String(Math.round(y.nonreg_draw)).padStart(6)} tfsaDraw:$${String(Math.round(y.tfsa_draw)).padStart(6)} RRSP:$${String(Math.round(y.rrif_draw_f+y.rrif_draw_m)).padStart(6)}`);
  }
}

summarize(out._cfgBase, 'Baseline with $150K cash wedge (2yr target)');
summarize(out._cfgMelt, 'Meltdown with $150K cash wedge (2yr target)');
