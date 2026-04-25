// Phase 3.1 verification: confirm that setting withdrawalOrder changes which
// account funds the early-year gap without breaking feasibility.
const fs = require("fs");
const html = fs.readFileSync(require("path").join(__dirname, "..", "retirement_dashboard.html") + "", "utf8");
const m = html.match(/<script>([\s\S]*?)<\/script>/);
let body = m[1].replace(/window\.location\.hash\.slice\(1\)/g, '""');
const wrapper = `${body}\n  return { runSimulation, D, _cfgBase };`;
const f = new Function("window", "document", wrapper);
const out = f({location:{hash:""}, addEventListener:()=>{}}, {getElementById:()=>null, addEventListener:()=>{}});

function summarize(cfg, label){
  const r = out.runSimulation(cfg);
  console.log(`\n── ${label} (withdrawalOrder=${cfg.withdrawalOrder}) ──`);
  console.log(`Shortfall years: ${r.years.filter(y=>y.shortfall>500).length}`);
  console.log(`End portfolio:   $${Math.round(r.years[r.years.length-1].bal_total).toLocaleString()}`);
  console.log(`Lifetime tax:    $${Math.round(r.totalTax).toLocaleString()}`);
  console.log(`First 6 years:`);
  for(const y of r.years.slice(0, 6)){
    const rrsp = Math.round(y.rrif_draw_f + y.rrif_draw_m);
    const tfsa = Math.round(y.tfsa_draw);
    const nr   = Math.round(y.nonreg_draw);
    console.log(`  ${y.year} RRSP:$${String(rrsp).padStart(6)}  NR:$${String(nr).padStart(6)}  TFSA:$${String(tfsa).padStart(6)}  Spend:$${Math.round(y.spending)}`);
  }
}

const base = out._cfgBase;
// Clone and flip the withdrawal order to compare side by side.
summarize(Object.assign({}, base, { withdrawalOrder: 'default' }), 'Default (CFM N→T→R)');
summarize(Object.assign({}, base, { withdrawalOrder: 'meltdown' }), 'Meltdown (R→N→T)');
