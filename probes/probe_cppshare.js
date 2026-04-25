// Phase 3.5 verification: CPP sharing equalizes CPP income between spouses.
const fs = require("fs");
const html = fs.readFileSync(require("path").join(__dirname, "..", "retirement_dashboard.html") + "", "utf8");
const m = html.match(/<script>([\s\S]*?)<\/script>/);
let body = m[1].replace(/window\.location\.hash\.slice\(1\)/g, '""');
body = body.replace('const D = loadClientData();',
  'const D = loadClientData(); D.assumptions.cppSharing = true;');
const wrapper = `${body}\n  return { runSimulation, _cfgBase };`;
const f = new Function("window", "document", wrapper);
const out = f({location:{hash:""}, addEventListener:()=>{}}, {getElementById:()=>null, addEventListener:()=>{}});

const r = out.runSimulation(out._cfgBase);
console.log(`Baseline with CPP sharing on:`);
console.log(`End portfolio: $${Math.round(r.years[r.years.length-1].bal_total).toLocaleString()}`);
console.log(`Shortfalls:    ${r.years.filter(y=>y.shortfall>500).length}`);
console.log(`Lifetime tax:  $${Math.round(r.totalTax).toLocaleString()}\n`);
console.log(`CPP values once both receiving (look for equal cpp_f = cpp_m):`);
for(const y of r.years.filter(x => x.ageF>=65 && x.ageF<=70)){
  console.log(`  ${y.year} F:${y.ageF} cpp_f:$${Math.round(y.cpp_f)}  cpp_m:$${Math.round(y.cpp_m)}  (sum=$${Math.round(y.cpp_f+y.cpp_m)})`);
}
