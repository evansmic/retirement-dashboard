// Phase 5.5: intake form → dashboard payload round-trip.
// Simulates the index.html `submitForm` gather logic (key fields only) and confirms
// the dashboard's hash-loader consumes the payload correctly, producing a sim with
// salary/contrib/db fields populated as expected.
const fs = require("fs");

// Fake DOM: every getElementById returns an object whose `.value`/`.checked` reads from FIXTURE.
const FIXTURE = {
  f_name:'Alice', f_dob:1970, f_dobMonth:3, f_retireYear:2033,
  f_salary:150000, f_salaryRefYear:2026, f_salaryRaise:0.03,
  f_annualRrspContrib:20000, f_annualTfsaContrib:7000, f_annualNonregContrib:4000,
  f_db_before65:0, f_db_after65:0, f_db_index:0.022, f_db_startYear:2033,
  f_rrsp:400000, f_tfsa:120000, f_tfsaRoom:8000, f_tfsaAnnual:0,
  f_lif:0, f_nonreg:200000, f_nonregAcb:150000, f_nonregAnnual:0,
  f_cpp70_monthly:1800, f_cpp65_monthly:1270, f_oas_monthly:742.31,
  m_name:'Bob', m_dob:1972, m_dobMonth:7, m_retireYear:2037,
  m_salary:110000, m_salaryRefYear:2026, m_salaryRaise:0.025,
  m_annualRrspContrib:15000, m_annualTfsaContrib:7000, m_annualNonregContrib:0,
  m_db_before65:0, m_db_after65:32000, m_db_index:0.022, m_db_startYear:2037,
  m_rrsp:350000, m_tfsa:90000, m_tfsaRoom:8000,
  m_lif:0, m_lira:0, m_nonreg:100000, m_nonregAcb:75000, m_nonregAnnual:0,
  m_cpp70_monthly:1500, m_cpp65_monthly:1060, m_oas_monthly:742.31,
  m_cppSurvivor_under65:0, m_cppSurvivor_over65:0,
  a_planStart:2026, a_planEnd:2070, a_p1Dies:0, a_returnRate:0.05,
  a_inflation:0.025, a_returnStdDev:0.10, a_horizon:95, a_youngerSpouseRrif:false,
  a_cppSharing:false, a_withdrawalOrder:'default',
  a_spousalContributor:'', a_spousalContribY1:0, a_spousalContribY2:0,
  gogo:85000, gogoEnd:75, slowgo:70000, slowgoEnd:85, nogo:55000,
  inheritance:0,
};
function mkFakeInput(k){
  return { value: FIXTURE[k] != null ? String(FIXTURE[k]) : '',
           checked: !!FIXTURE[k] };
}
const fakeDoc = {
  getElementById(id){ return FIXTURE.hasOwnProperty(id) ? mkFakeInput(id) : null; },
  addEventListener(){},
};
const fakeWin = { location:{ hash:'' }, addEventListener(){} };

// Helper functions lifted from index.html. We don't execute index.html, but inline the
// payload construction with the same field-reading helpers it uses.
function n(id, def){ const el = fakeDoc.getElementById(id); if(!el || el.value === '' || el.value == null) return def !== undefined ? def : 0; const v = parseFloat(el.value); return isNaN(v) ? (def !== undefined ? def : 0) : v; }
function s(id, def){ const el = fakeDoc.getElementById(id); if(!el || el.value === '') return def; return el.value; }

const D = {
  schemaVersion: 2,
  p1: {
    name: s('f_name'), dob: n('f_dob'), dobMonth: n('f_dobMonth',9),
    retireYear: n('f_retireYear', 2027),
    salary: n('f_salary',0), salaryRefYear: n('f_salaryRefYear',2026),
    salaryRaise: n('f_salaryRaise',0.03),
    annualRrspContrib: n('f_annualRrspContrib',0),
    annualTfsaContrib: n('f_annualTfsaContrib',0),
    annualNonregContrib: n('f_annualNonregContrib',0),
    db_before65: n('f_db_before65',0), db_after65: n('f_db_after65',0),
    db_index: n('f_db_index',0.022), db_startYear: n('f_db_startYear', n('f_retireYear',2027)),
    rrsp: n('f_rrsp'), tfsa: n('f_tfsa'), tfsaRoom: n('f_tfsaRoom',7000),
    tfsaAnnual: n('f_tfsaAnnual'), lif: n('f_lif'), nonreg: n('f_nonreg'),
    nonregAcb: n('f_nonregAcb'), nonregAnnual: n('f_nonregAnnual'),
    cpp70_monthly: n('f_cpp70_monthly',0),
    cpp65_monthly: n('f_cpp65_monthly',0) > 0 ? n('f_cpp65_monthly',0) : Math.round(n('f_cpp70_monthly',0)/1.42),
    oas_monthly: n('f_oas_monthly',742.31),
  },
  p2: {
    name: s('m_name'), dob: n('m_dob'), dobMonth: n('m_dobMonth',12),
    retireYear: n('m_retireYear', 2027),
    salary: n('m_salary',0), salaryRefYear: n('m_salaryRefYear',2026),
    salaryRaise: n('m_salaryRaise',0.03),
    annualRrspContrib: n('m_annualRrspContrib',0),
    annualTfsaContrib: n('m_annualTfsaContrib',0),
    annualNonregContrib: n('m_annualNonregContrib',0),
    db_before65: n('m_db_before65',0), db_after65: n('m_db_after65',0),
    db_index: n('m_db_index',0.022), db_startYear: n('m_db_startYear', n('m_retireYear',2027)),
    rrsp: n('m_rrsp'), tfsa: n('m_tfsa'), tfsaRoom: n('m_tfsaRoom',7000),
    lif: n('m_lif'), lira: n('m_lira',0), nonreg: n('m_nonreg'),
    nonregAcb: n('m_nonregAcb'), nonregAnnual: n('m_nonregAnnual'),
    cpp70_monthly: n('m_cpp70_monthly',0),
    cpp65_monthly: n('m_cpp65_monthly',0) > 0 ? n('m_cpp65_monthly',0) : Math.round(n('m_cpp70_monthly',0)/1.42),
    oas_monthly: n('m_oas_monthly',742.31),
    cppSurvivor_under65: n('m_cppSurvivor_under65',0),
    cppSurvivor_over65: n('m_cppSurvivor_over65',0),
  },
  spending: { gogo:n('gogo',85000), gogoEnd:n('gogoEnd',75), slowgo:n('slowgo',70000),
              slowgoEnd:n('slowgoEnd',85), nogo:n('nogo',55000) },
  inheritance: n('inheritance',0),
  assumptions: {
    retireYear: Math.min(n('f_retireYear',2027), n('m_retireYear',2027)),
    planStart: (function(){ const v = n('a_planStart',0); return v > 0 ? v : null; })(),
    planEnd: n('a_planEnd',2070), p1DiesInSurvivor: n('a_p1Dies',0),
    returnRate: n('a_returnRate',0.05), inflation: n('a_inflation',0.025),
    returnStdDev: n('a_returnStdDev',0.10), horizon: n('a_horizon',95),
    youngerSpouseRrif: false, cppSharing: false, withdrawalOrder: 'default',
    spousalRrsp: null,
  },
};

// Encode as index.html would, then feed via window.location.hash.
const encoded = Buffer.from(encodeURIComponent(JSON.stringify(D))).toString('base64');

// Re-load dashboard with our payload on the hash.
const html = fs.readFileSync(require("path").join(__dirname, "..", "retirement_dashboard.html") + "", "utf8");
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const body = m[1];
const wrapper = `${body}\n  return { runSimulation, RESULTS, D };`;
const f = new Function("window", "document", wrapper);
const out = f({location:{hash:'#'+encoded}, addEventListener:()=>{}}, fakeDoc);

let passed = 0, failed = 0;
function check(cond, label){
  if(cond){ passed++; console.log("  ✓ " + label); }
  else   { failed++; console.log("  ✗ " + label); }
}

console.log("\n═══ Intake-form → Dashboard payload round-trip ═══");
check(out.D.p1.name === 'Alice', `P1 name = '${out.D.p1.name}'`);
check(out.D.p2.name === 'Bob', `P2 name = '${out.D.p2.name}'`);
check(out.D.p1.retireYear === 2033, `P1 retireYear = ${out.D.p1.retireYear}`);
check(out.D.p2.retireYear === 2037, `P2 retireYear = ${out.D.p2.retireYear}`);
check(out.D.p1.salary === 150000, `P1 salary = $${out.D.p1.salary.toLocaleString()}`);
check(out.D.p2.salary === 110000, `P2 salary = $${out.D.p2.salary.toLocaleString()}`);
check(out.D.assumptions.planStart === 2026, `planStart = ${out.D.assumptions.planStart}`);
check(out.D.p2.db_after65 === 32000, `P2 DB_after65 = $${out.D.p2.db_after65.toLocaleString()}`);

// Run the baseline simulation, check first year = 2026.
const sim = out.RESULTS.base;
check(sim.years[0].year === 2026, `first sim year = ${sim.years[0].year}`);
const y2030 = sim.years.find(y => y.year === 2030);
check(y2030 && y2030.salary_f > 150000, `2030 P1 salary (grown from $150K) = $${Math.round((y2030||{}).salary_f||0).toLocaleString()}`);
check(y2030 && y2030.salary_m > 110000, `2030 P2 salary (grown from $110K) = $${Math.round((y2030||{}).salary_m||0).toLocaleString()}`);
const y2035 = sim.years.find(y => y.year === 2035);
check(y2035 && y2035.salary_f === 0 && y2035.salary_m > 0, `2035 staggered: F retired, M still working`);

console.log(`\n═══ SUMMARY ═══\nPassed: ${passed}\nFailed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
