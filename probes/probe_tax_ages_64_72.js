// Sprint 0 S0-02: focused tax/benefit fixtures for ages 64-72.
// This locks down the collision zone where CPP/OAS starts, age credits,
// RRIF/LIF minimums, OAS clawback, Ontario surtax/Health Premium, and
// pension splitting all start interacting.
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "..", "retirement_dashboard.html"), "utf8");
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const body = m[1].replace(/window\.location\.hash\.slice\(1\)/g, '""');
const helper = fs.readFileSync(require("path").join(__dirname, "..", "engine", "tax_benefit_helpers.js"), "utf8");
const wrapper = `${helper}
${body}
return {
  D,
  calcTax,
  ontarioHealthPremium,
  oasClawback,
  calcCPP_P1,
  calcOAS_P1,
  netAfterTaxSplit,
  rrif_min,
  runSimulation
};
`;
const f = new Function("window", "document", wrapper);
const h = f({location:{hash:""}, addEventListener:()=>{}}, {getElementById:()=>null, addEventListener:()=>{}});

let passed = 0, failed = 0;
function check(cond, label){
  if(cond){ passed++; console.log("  OK " + label); }
  else   { failed++; console.log("  FAIL " + label); }
}
function close(actual, expected, tolerance, label){
  check(Math.abs(actual - expected) <= tolerance,
        `${label}: ${actual.toFixed ? actual.toFixed(2) : actual} ~= ${expected}`);
}
function row(result, year){
  return result.years.find(y => y.year === year);
}

console.log("\n=== (a) Age credit and 2026 Ontario tax fixtures ===");
close(h.calcTax(30000, 64, 2026, false), 3333.03, 0.01, "age 64, $30k taxable, no pension");
close(h.calcTax(30000, 65, 2026, false), 1725.42, 0.01, "age 65, $30k taxable, no pension");
check(h.calcTax(30000, 65, 2026, false) < h.calcTax(30000, 64, 2026, false),
      "age credit starts at 65 for modest income");
close(h.calcTax(145000, 60, 2026, false), h.calcTax(145000, 65, 2026, false), 0.01,
      "age credit is fully phased out by high income");
close(h.calcTax(155000, 60, 2026, false), 43810.82, 0.01, "Ontario surtax fixture at $155k");
close(h.calcTax(225000, 60, 2026, false), 75870.48, 0.01, "BPA phase-out / top-bracket fixture at $225k");

console.log("\n=== (b) Ontario Health Premium thresholds ===");
close(h.ontarioHealthPremium(19999), 0, 0.01, "Health Premium below $20k");
close(h.ontarioHealthPremium(22500), 150, 0.01, "Health Premium ramp in $20k-$25k band");
close(h.ontarioHealthPremium(25000), 300, 0.01, "Health Premium first plateau");
close(h.ontarioHealthPremium(37000), 360, 0.01, "Health Premium second ramp");
close(h.ontarioHealthPremium(48600), 550, 0.01, "Health Premium $48k-$48.6k ramp cap");
close(h.ontarioHealthPremium(200300), 825, 0.01, "Health Premium high-income ramp");

console.log("\n=== (c) OAS clawback threshold and tax-year indexing ===");
close(h.oasClawback(95323, 2026), 0, 0.01, "2026 OAS clawback threshold");
close(h.oasClawback(100000, 2026), 701.55, 0.01, "2026 OAS clawback above threshold");
close(h.oasClawback(100000, 2027), 344.09, 0.01, "OAS clawback threshold indexes in 2027");

console.log("\n=== (d) CPP/OAS start ages, deferral, and age-75 OAS boost ===");
const D = h.D;
Object.assign(D.p1, {
  name: "Fixture",
  dob: 1960,
  dobMonth: 1,
  retireYear: 2024,
  cpp65: 12000,
  cpp70: 17040,
  oasBase: 8908
});
Object.assign(D.assumptions, {
  cppIndex: 0,
  oasIndex: 0,
  cpiIndex: 0,
  fedTaxIndex: 0,
  onTaxIndex: 0
});
close(h.calcCPP_P1(2024, 65), 0, 0.01, "CPP not paid before selected start age");
close(h.calcCPP_P1(2025, 65), 12000, 0.01, "CPP starts at age 65");
close(h.calcCPP_P1(2030, 70), 17040, 0.01, "CPP at 70 applies 42% deferral uplift");
close(h.calcOAS_P1(2024, 65, true), 0, 0.01, "OAS not paid before selected start age");
close(h.calcOAS_P1(2025, 65, true), 8908, 0.01, "OAS starts at age 65");
close(h.calcOAS_P1(2030, 70, true), 12114.88, 0.01, "OAS at 70 applies 36% deferral uplift");
close(h.calcOAS_P1(2035, 65, true), 9798.8, 0.01, "OAS 10% age-75 boost applies");

console.log("\n=== (e) RRIF/LIF minimums and age 64-72 simulation rows ===");
Object.assign(D.p1, {
  salary: 0,
  rrsp: 100000,
  tfsa: 0,
  lif: 50000,
  lira: 0,
  nonreg: 0,
  nonregAcb: 0,
  db_before65: 0,
  db_after65: 0,
  annualRrspContrib: 0,
  annualTfsaContrib: 0,
  annualNonregContrib: 0
});
Object.assign(D.p2, {
  name: "",
  dob: 1960,
  dobMonth: 1,
  retireYear: 2024,
  salary: 0,
  rrsp: 0,
  tfsa: 0,
  lif: 0,
  lira: 0,
  nonreg: 0,
  nonregAcb: 0,
  cpp65: 0,
  cpp70: 0,
  oasBase: 0,
  db_before65: 0,
  db_after65: 0,
  annualRrspContrib: 0,
  annualTfsaContrib: 0,
  annualNonregContrib: 0
});
Object.assign(D.spending, { gogo: 0, slowgo: 0, nogo: 0, gogoEnd: 75, slowgoEnd: 85 });
Object.assign(D.mortgage, { balance: 0, monthly: 0, rate: 0 });
Object.assign(D.loc, { balance: 0, rate: 0 });
D.oneOffs = [];
D.downsize = { year: null, netProceeds: 0 };
D.cashWedge = { balance: 0, returnRate: 0 };
Object.assign(D.assumptions, {
  planStart: 2024,
  retireYear: 2024,
  planEnd: 2032,
  returnRate: 0,
  inflation: 0,
  withdrawalOrder: "default",
  pensionSplit: false,
  cppSharing: false,
  youngerSpouseRrif: false,
  spousalRrsp: null
});
const sim = h.runSimulation({
  cppAgeF: 65,
  cppAgeM: 65,
  oasAgeF: 65,
  oasAgeM: 65,
  returnRate: 0,
  pensionSplit: false,
  withdrawalOrder: "default"
});
close(h.rrif_min(64), 1/26, 0.000001, "RRIF table factor at age 64");
close(h.rrif_min(65), 0.04, 0.000001, "RRIF table factor at age 65");
close(h.rrif_min(71), 0.0528, 0.000001, "RRIF table factor at age 71");
close(row(sim, 2024).rrif_draw_f, 0, 0.01, "simulation has no RRIF minimum draw at age 64");
close(row(sim, 2025).rrif_draw_f, 4000, 0.01, "simulation starts RRIF-style minimum draw at age 65");
close(row(sim, 2024).lif_min_f, 1923.08, 0.01, "LIF minimum draw exists before 65");
close(row(sim, 2025).cpp_f, 12000, 0.01, "simulation starts CPP in age-65 row");
close(row(sim, 2025).oas_f, 8908, 0.01, "simulation starts OAS in age-65 row");
close(row(sim, 2025).totalTaxYear, 720.37, 0.01, "age-65 row tax fixture with CPP/OAS/RRIF/LIF");
close(row(sim, 2031).rrif_draw_f, 4012.8, 0.01, "age-71 row uses statutory RRIF factor");

console.log("\n=== (f) Pension splitting reduces tax/clawback in 65+ fixture ===");
const split = h.netAfterTaxSplit(120000, 20000, 120000, 67, 67, 2026, true, { pensionSplit: true }, 0);
const noSplit = h.netAfterTaxSplit(120000, 20000, 0, 67, 67, 2026, true, { pensionSplit: false }, 0);
check(split.splitAmt > 0, `split amount selected (${Math.round(split.splitAmt)})`);
check(split.totalTax < noSplit.totalTax, `split total tax/clawback ${Math.round(split.totalTax)} < no split ${Math.round(noSplit.totalTax)}`);
close(split.fInc, 72000, 0.01, "post-split P1 taxable income");
close(split.mInc, 68000, 0.01, "post-split P2 taxable income");

console.log(`\n=== SUMMARY ===\nPassed: ${passed}\nFailed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
