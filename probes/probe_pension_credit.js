// Sprint 0 S0-01: pension-income-credit eligibility.
// Verifies that tax credits depend on eligible pension income, not merely on
// having taxable income from CPP/OAS/salary/ordinary RRSP withdrawals.
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "..", "retirement_dashboard.html"), "utf8");
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const body = m[1].replace(/window\.location\.hash\.slice\(1\)/g, '""');
const helper = fs.readFileSync(require("path").join(__dirname, "..", "engine", "tax_benefit_helpers.js"), "utf8");
const wrapper = `${helper}
${body}
return { calcTax, netAfterTaxSplit };
`;
const f = new Function("window", "document", wrapper);
const h = f({location:{hash:""}, addEventListener:()=>{}}, {getElementById:()=>null, addEventListener:()=>{}});

let passed = 0, failed = 0;
function check(cond, label){
  if(cond){ passed++; console.log("  ✓ " + label); }
  else   { failed++; console.log("  ✗ " + label); }
}
function close(a, b, tolerance, label){
  check(Math.abs(a - b) <= tolerance, `${label} (${Math.round(a)} vs ${Math.round(b)})`);
}

const year = 2026;

console.log("\n═══ (a) Ordinary taxable income does not imply pension credit ═══");
const taxNoPension = h.calcTax(30000, 67, year, false);
const taxWithPension = h.calcTax(30000, 67, year, true);
check(taxWithPension < taxNoPension - 350,
      `eligible pension income lowers tax materially (${Math.round(taxNoPension)} → ${Math.round(taxWithPension)})`);

const ordinaryRrsp = h.netAfterTaxSplit(30000, 0, 0, 67, 67, year, true, { pensionSplit:false });
close(ordinaryRrsp.taxF, taxNoPension, 1, "ordinary RRSP-style taxable income receives no pension credit");

console.log("\n═══ (b) DB pension and RRIF/LIF-style eligible income do imply credit ═══");
const dbUnder65 = h.netAfterTaxSplit(30000, 0, 30000, 60, 60, year, true, { pensionSplit:false });
close(dbUnder65.taxF, h.calcTax(30000, 60, year, true), 1, "DB pension income is credit-eligible before 65");

const rrifAt67 = h.netAfterTaxSplit(30000, 0, 30000, 67, 67, year, true, { pensionSplit:false });
close(rrifAt67.taxF, taxWithPension, 1, "RRIF/LIF-style eligible income is credit-eligible at 65+");

console.log("\n═══ (c) Spouse eligibility is explicit, including split pension ═══");
const p2OwnEligible = h.netAfterTaxSplit(0, 30000, 0, 67, 67, year, true, { pensionSplit:false }, 30000);
close(p2OwnEligible.taxM, taxWithPension, 1, "P2's own eligible pension income gets the credit");

const p2NoEligible = h.netAfterTaxSplit(0, 30000, 0, 67, 67, year, true, { pensionSplit:false }, 0);
close(p2NoEligible.taxM, taxNoPension, 1, "P2 taxable income alone gets no pension credit");

const split = h.netAfterTaxSplit(80000, 0, 80000, 67, 67, year, true, { pensionSplit:true }, 0);
check(split.splitAmt > 0, `optimizer split eligible pension income (${Math.round(split.splitAmt)})`);
close(split.taxM, h.calcTax(split.mInc, 67, year, true), 1, "split pension gives receiving spouse pension-credit eligibility");

console.log(`\n═══ SUMMARY ═══\nPassed: ${passed}\nFailed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
