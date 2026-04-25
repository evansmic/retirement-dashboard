const fs = require("fs");
const html = fs.readFileSync(require("path").join(__dirname, "..", "retirement_dashboard.html") + "", "utf8");
const m = html.match(/<script>([\s\S]*?)<\/script>/);
let body = m[1].replace(/window\.location\.hash\.slice\(1\)/g, '""');
const wrapper = `${body}\n  return { SCENARIOS, RESULTS, D };`;
const f = new Function("window", "document", wrapper);
const out = f({location:{hash:""}, addEventListener:()=>{}}, {getElementById:()=>null, addEventListener:()=>{}});

for(const [k, r] of Object.entries(out.RESULTS)) {
  console.log(`${k}: sustMult=${r.sustMult.toFixed(4)}  feasible=${r.feasible}  depletionAtDesired=${r.depletionYearAtDesired||'—'}  sustainGoGo=$${Math.round(out.D.spending.gogo*r.sustMult).toLocaleString()}`);
}
console.log(`\nD.inheritance = $${(out.D.inheritance||0).toLocaleString()}`);

// Now simulate loading data via URL hash with a $200K inheritance goal
const Dcopy = JSON.parse(JSON.stringify(out.D));
Dcopy.inheritance = 200000;
const encoded = Buffer.from(encodeURIComponent(JSON.stringify(Dcopy))).toString('base64');
console.log(`\nHash sample (inheritance=$200K): ${encoded.slice(0,80)}...`);
