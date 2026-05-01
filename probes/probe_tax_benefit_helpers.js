// Sprint 0 S0-11: direct coverage for the extracted tax/benefit helper module.
// These fixtures verify the module can run from explicit plan input without
// depending on the dashboard's global D binding.
const TaxBenefitHelpers = require("../engine/tax_benefit_helpers.js");

let plan = {
  p1: {
    dob: 1960,
    retireYear: 2024,
    db_startYear: 2024,
    db_index: 0,
    db_before65: 0,
    db_after65: 0,
    cpp65: 12000,
    oasBase: 8908
  },
  p2: {
    dob: 1960,
    retireYear: 2024,
    db_startYear: 2024,
    db_index: 0,
    db_before65: 0,
    db_after65: 0,
    cpp65: 0,
    oasBase: 0,
    cppSurvivor_under65: 0,
    cppSurvivor_over65: 0
  },
  assumptions: {
    inflation: 0.025,
    cpiIndex: null,
    cppIndex: 0,
    oasIndex: 0,
    fedTaxIndex: 0,
    onTaxIndex: 0,
    retireYear: 2024,
    planStart: 2024
  },
  spending: { gogo: 50000, gogoEnd: 75, slowgo: 42000, slowgoEnd: 85, nogo: 35000 },
  mortgage: { rate: 0, monthly: 500 },
  loc: { rate: 0.07 }
};

const h = TaxBenefitHelpers.createTaxBenefitHelpers(() => plan);

let passed = 0, failed = 0;
function check(cond, label){
  if(cond){ passed++; console.log("  OK " + label); }
  else   { failed++; console.log("  FAIL " + label); }
}
function close(actual, expected, tolerance, label){
  check(Math.abs(actual - expected) <= tolerance,
        `${label}: ${actual.toFixed ? actual.toFixed(2) : actual} ~= ${expected}`);
}

console.log("\n=== (a) Module exports and registered-account factors ===");
check(typeof TaxBenefitHelpers.createTaxBenefitHelpers === "function", "factory export exists");
close(h.rrif_min(65), 0.04, 0.000001, "RRIF minimum at age 65");
close(h.lif_max(65), 0.052, 0.000001, "LIF max simplification at age 65");

console.log("\n=== (b) Tax and clawback helpers ===");
close(h.calcTax(30000, 64, 2026, false), 3333.03, 0.01, "age 64 tax fixture");
check(h.calcTax(30000, 65, 2026, false) < h.calcTax(30000, 64, 2026, false),
      "age credit lowers modest-income tax at 65");
check(h.calcTax(30000, 67, 2026, true) < h.calcTax(30000, 67, 2026, false),
      "eligible pension income lowers tax");
close(h.ontarioHealthPremium(37000), 360, 0.01, "Ontario Health Premium ramp");
close(h.oasClawback(100000, 2027), 344.09, 0.01, "OAS clawback threshold uses plan CPI");
plan.assumptions.cpiIndex = 0;
close(h.oasClawback(100000, 2027), 701.55, 0.01, "helper reads changed plan assumptions through getter");

console.log("\n=== (c) CPP/OAS and debt helpers ===");
close(h.cppAdjFactor(70), 1.42, 0.000001, "CPP deferral factor at 70");
close(h.calcCPP_P1(2030, 70), 17040, 0.01, "CPP at 70 from explicit plan");
close(h.calcOAS_P1(2035, 65, true), 9798.8, 0.01, "OAS age-75 boost");
const mtg = h.calcMortgage(1000, 2026);
close(mtg.payment, 1000, 0.01, "mortgage payoff payment is capped at balance");
close(mtg.newBalance, 0, 0.01, "mortgage payoff leaves zero balance");
const loc = h.calcLOC(10000);
close(loc.payment, 2700, 0.01, "LOC annual payment includes interest and principal");
close(loc.newBalance, 8000, 0.01, "LOC amortises over five years");

console.log(`\n=== SUMMARY ===\nPassed: ${passed}\nFailed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
