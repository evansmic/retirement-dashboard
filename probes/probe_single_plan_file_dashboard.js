// Regression for malformed single-person .plan.json exports where blank Person 2
// was saved as the literal name "Person 2" with zero DOB/retirement fields.
// That made the dashboard treat the plan as a couple, inflated spending by
// thousands of years, and poisoned chart data with non-finite values.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'retirement_dashboard.html'), 'utf8');
const match = html.match(/<script>([\s\S]*?)<\/script>/);
const helper = fs.readFileSync(path.join(root, 'engine', 'tax_benefit_helpers.js'), 'utf8');
if (!match) { console.error('Could not find dashboard script'); process.exit(2); }

const badSinglePayload = {
  schemaVersion: 2,
  p1: {
    name: 'Larry', dob: 1962, dobMonth: 12, retireYear: 2028,
    salary: 100000, salaryRefYear: 2026, salaryRaise: 0.03,
    annualRrspContrib: 18000, annualTfsaContrib: 7000, annualNonregContrib: 0,
    db_before65: 20000, db_after65: 18000, db_index: 0.022, db_startYear: 2028,
    rrsp: 300000, tfsa: 100000, tfsaRoom: 22000, tfsaAnnual: 4000,
    lif: 0, nonreg: 0, nonregAcb: 0, nonregAnnual: 0,
    cpp70_monthly: 1800, cpp65_monthly: 1268, oas_monthly: 742
  },
  p2: {
    name: 'Person 2', dob: 0, dobMonth: 0, retireYear: 0,
    salary: 0, salaryRefYear: 0, salaryRaise: 0,
    annualRrspContrib: 0, annualTfsaContrib: 0, annualNonregContrib: 0,
    db_before65: 0, db_after65: 0, db_index: 0, db_startYear: 0,
    rrsp: 0, rrspRoom: 0, tfsa: 0, tfsaRoom: 0, tfsaAnnual: 0,
    lira: 0, lif: 0, nonreg: 0, nonregAcb: 0, nonregAnnual: 0,
    cpp70_monthly: 0, cpp65_monthly: 0, oas_monthly: 0,
    cppSurv_u65_mo: 0, cppSurv_o65_mo: 0
  },
  mortgage: { balance: 0, rate: 0, monthly: 0 },
  loc: { balance: 0, rate: 0 },
  cashWedge: { balance: 145000, returnRate: 0.03, targetYears: 2.5 },
  spending: { gogo: 70000, gogoEnd: 75, slowgo: 45000, slowgoEnd: 85, nogo: 40000 },
  inheritance: 0,
  downsize: { year: 2036, netProceeds: 100000 },
  oneOffs: [],
  assumptions: {
    retireYear: 0, planStart: null, planEnd: 2060, p1DiesInSurvivor: 0,
    returnRate: 0.0436, inflation: 0.021, returnStdDev: 0.1, horizon: 95,
    youngerSpouseRrif: false, cppSharing: false, withdrawalOrder: 'default',
    spousalRrsp: null
  }
};

const encoded = Buffer.from(encodeURIComponent(JSON.stringify(badSinglePayload))).toString('base64');
const fakeWindow = {
  location: { hash: '#' + encoded, search: '' },
  addEventListener(){},
};
const fakeDocument = {
  getElementById(){ return null; },
  addEventListener(){},
};

let out;
try {
  const wrapper = `${helper}\n${match[1]}\nreturn { D, RESULTS, SCENARIOS };`;
  out = new Function('window', 'document', wrapper)(fakeWindow, fakeDocument);
} catch (e) {
  console.error('Could not run dashboard script:', e);
  process.exit(2);
}

let passed = 0, failed = 0;
function check(cond, label){
  if (cond) { passed++; console.log('  ✓ ' + label); }
  else { failed++; console.log('  ✗ ' + label); }
}
function finite(n){ return Number.isFinite(n); }

console.log('\n═══ Single-person bad plan-file dashboard load ═══');

const base = out.RESULTS.base;
const first = base.years[0];
check(out.D.p2.name === '—', 'placeholder Person 2 is treated as absent on dashboard');
check(out.D.assumptions.retireYear === 2028, 'zero retireYear is repaired before spending inflation');
check(first.year === 2028, `projection starts in Person 1 retirement year (${first.year})`);
check(first.ageM === first.ageF, 'hidden Person 2 age is aligned with Person 1 for single-person display rows');
check(first.spending > 0 && first.spending < 100000, `first-year spending is finite and plausible (${Math.round(first.spending)})`);
check(finite(first.bal_total), 'first-year total portfolio is finite');
check(finite(first.totalAftaxYear), 'first-year after-tax cash flow is finite');
check(base.years.every(y => finite(y.spending) && finite(y.bal_total)), 'all base chart rows are finite');
check(first.cash_draw > 0, `first-year cash wedge draw is surfaced as a funding source (${Math.round(first.cash_draw)})`);
const firstSources = first.grossIncome + first.tfsa_draw + first.nonreg_draw + first.cash_draw;
check(Math.abs((firstSources - first.totalTaxYear) - first.totalAftaxYear) < 1,
      'first-year total sources minus tax reconciles to actual spend');

console.log(`\n═══ SUMMARY ═══\nPassed: ${passed}\nFailed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
