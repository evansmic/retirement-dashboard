// Probe: verify OAS clawback is computed AFTER pension splitting.
// Scenario: Frank 70 with $150K RRIF draw + CPP + OAS (pre-split >$95K → clawback).
// After 50% pension split, Frank's income drops below the threshold; clawback should
// shrink but Moon's may rise.
const fs = require("fs");
const html = fs.readFileSync(require("path").join(__dirname, "..", "retirement_dashboard.html") + "", "utf8");
const m = html.match(/<script>([\s\S]*?)<\/script>/);
let body = m[1].replace(/window\.location\.hash\.slice\(1\)/g, '""');
const wrapper = `${body}
// Expose the helpers
return { optimalSplit, oasClawback, netAfterTaxSplit, calcTax };
`;
const f = new Function("window", "document", wrapper);
const h = f({location:{hash:""}, addEventListener:()=>{}}, {getElementById:()=>null, addEventListener:()=>{}});

// Scenario: year 2036, Frank age 70, Moon age 67
// Frank RRIF draw $150K, DB $0, CPP $16K, OAS $11K → total taxableF = $177K pre-split (over $95K threshold)
// Moon: no draws, CPP $7.6K, OAS $9K → $16.6K pre-split
const year = 2036;
const ageF = 70, ageM = 67;
const taxableF = 150000 + 16000 + 11000;   // 177K
const taxableM = 7600 + 9000;              // 16.6K
// Eligible for split = RRIF portion only (post-65), $150K; plus 65+ OAS portion (not splittable, but OAS is not pension-eligible)
// For split only RRIF ($150K) is eligible.
const eligF = 150000;

console.log("PRE-SPLIT");
console.log("  F income:", taxableF, " clawback(F):", h.oasClawback(taxableF, year).toFixed(0));
console.log("  M income:", taxableM, " clawback(M):", h.oasClawback(taxableM, year).toFixed(0));

const tx = h.netAfterTaxSplit(taxableF, taxableM, eligF, ageF, ageM, year, true, {pensionSplit:true});
console.log("POST-SPLIT (clawback-aware optimizer)");
console.log("  split fraction: ", (tx.splitAmt/eligF).toFixed(2));
console.log("  F post-split income:", Math.round(tx.fInc));
console.log("  M post-split income:", Math.round(tx.mInc));
console.log("  clawF (POST-split):", Math.round(tx.clawF));
console.log("  clawM (POST-split):", Math.round(tx.clawM));
console.log("  taxF + taxM:", Math.round(tx.taxF + tx.taxM));
console.log("  total:", Math.round(tx.totalTax));

// Comparison: what would tax be without optimization?
const txNoSplit = h.netAfterTaxSplit(taxableF, taxableM, 0, ageF, ageM, year, true, {pensionSplit:false});
console.log("NO SPLIT (comparison)");
console.log("  clawF:", Math.round(txNoSplit.clawF), "taxF+taxM:", Math.round(txNoSplit.taxF+txNoSplit.taxM), "total:", Math.round(txNoSplit.totalTax));
