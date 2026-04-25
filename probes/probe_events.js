// Phase 3.6/3.7 verification.
const fs = require("fs");
const html = fs.readFileSync(require("path").join(__dirname, "..", "retirement_dashboard.html") + "", "utf8");
const m = html.match(/<script>([\s\S]*?)<\/script>/);
let body = m[1].replace(/window\.location\.hash\.slice\(1\)/g, '""');
// Downsize $400K in 2035; $25K wedding in 2030; $50K charitable bequest in 2060.
body = body.replace('const D = loadClientData();',
  'const D = loadClientData(); D.downsize = { year: 2035, netProceeds: 400000 }; D.oneOffs = [ {year:2030, amount:25000, label:"wedding"}, {year:2060, amount:50000, label:"charitable bequest"} ];');
const wrapper = `${body}\n  return { runSimulation, _cfgMelt };`;
const f = new Function("window", "document", wrapper);
const out = f({location:{hash:""}, addEventListener:()=>{}}, {getElementById:()=>null, addEventListener:()=>{}});

const r = out.runSimulation(out._cfgMelt);
console.log(`Meltdown with downsize ($400K in 2035) + wedding ($25K in 2030) + bequest ($50K in 2060):`);
console.log(`End portfolio: $${Math.round(r.years[r.years.length-1].bal_total).toLocaleString()}`);
console.log(`Shortfalls:    ${r.years.filter(y=>y.shortfall>500).length}\n`);
for(const y of r.years){
  if(y.downsize_proceeds > 0 || y.oneOff_outflow > 0){
    console.log(`  ${y.year} F:${y.ageF} downsize:$${Math.round(y.downsize_proceeds||0).toLocaleString()} oneOff:$${Math.round(y.oneOff_outflow||0).toLocaleString()} portfolio:$${Math.round(y.bal_total).toLocaleString()}`);
  }
}
