// Sprint 2 #59: intake form round-trip.
//
// Exercises the form's encode/decode loop end-to-end:
//   D → gatherD-encoded hash → populateFromD (writes inputs) → gatherD again
//   should produce a byte-identical re-encode.
//
// Catches drift between submitForm's payload construction and populateFromD's
// inverse. Whenever a new field gets added to one, the round-trip will fail
// if the matching setter isn't added to the other.
//
// Mechanism: extract index.html's <script> body, wrap it in `new Function()`
// with stubbed `window`/`document`, and capture the engine's helpers
// (`gatherD`, `populateFromD`, `migrate`, `SCHEMA_VERSION`). The fake DOM
// records inputs by id; populateFromD writes through it, gatherD reads back.
const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────────────────────────────────────
// Fixture: a fully-populated D representing what the form would submit. Every
// numeric field is explicit (no nulls) so the round-trip doesn't trip on
// `n(id, default)` fallbacks. CPP-at-65 values are non-zero so the auto-calc
// branch in gatherD doesn't fire (which would otherwise round-trip to a
// different number than originally seeded).
// ─────────────────────────────────────────────────────────────────────────────
const FIXTURE = {
  schemaVersion: 2,
  p1: {
    name: 'Alex', dob: 1968, dobMonth: 5, retireYear: 2030,
    salary: 165000, salaryRefYear: 2026, salaryRaise: 0.03,
    annualRrspContrib: 22000, annualTfsaContrib: 7000, annualNonregContrib: 5000,
    db_before65: 18000, db_after65: 12000, db_index: 0.022, db_startYear: 2030,
    rrsp: 480000, tfsa: 130000, tfsaRoom: 8000, tfsaAnnual: 7000,
    lif: 25000, nonreg: 220000, nonregAcb: 165000, nonregAnnual: 0,
    cpp70_monthly: 1810, cpp65_monthly: 1275, oas_monthly: 742.31,
  },
  p2: {
    name: 'Sam', dob: 1971, dobMonth: 9, retireYear: 2034,
    salary: 118000, salaryRefYear: 2026, salaryRaise: 0.025,
    annualRrspContrib: 16000, annualTfsaContrib: 7000, annualNonregContrib: 0,
    db_before65: 0, db_after65: 34000, db_index: 0.022, db_startYear: 2034,
    rrsp: 360000, rrspRoom: 12000, tfsa: 95000, tfsaRoom: 9000, tfsaAnnual: 0,
    lira: 14000, lif: 0, nonreg: 110000, nonregAcb: 80000, nonregAnnual: 0,
    cpp70_monthly: 1490, cpp65_monthly: 1050, oas_monthly: 742.31,
    cppSurv_u65_mo: 480, cppSurv_o65_mo: 320,
  },
  mortgage: { balance: 145000, rate: 0.054, monthly: 2200 },
  loc: { balance: 18000, rate: 0.07 },
  spending: { gogo: 88000, gogoEnd: 75, slowgo: 72000, slowgoEnd: 85, nogo: 56000 },
  inheritance: 250000,
  downsize: { year: 2042, netProceeds: 350000 },
  oneOffs: [
    { year: 2031, amount: 40000, label: 'wedding' },
    { year: 2038, amount: 80000, label: 'renovation' },
  ],
  cashWedge: { balance: 60000, returnRate: 0.035, targetYears: 2 },
  assumptions: {
    retireYear: 2030,                  // gatherD recomputes as Math.min(p1,p2)
    planStart: 2026,
    planEnd: 2070,
    p1DiesInSurvivor: 2058,
    returnRate: 0.05, inflation: 0.025, returnStdDev: 0.10,
    horizon: 95,
    youngerSpouseRrif: true,
    cppSharing: false,
    withdrawalOrder: 'meltdown',
    spousalRrsp: {
      contributor: 'f',
      // gatherD anchors keys at p1.retireYear-1 and p1.retireYear-2 (preserved
      // bug — annuitantKey always defaults to 'p1' regardless of contributor).
      contribs: { 2029: 4000, 2028: 3500 },
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Fake DOM. Each form field id maps to an object exposing `.value` and
// `.checked`. The form's `addEventListener('DOMContentLoaded', …)` callback
// is captured; we don't need to fire it here because populateFromD is called
// directly, but the listener still gets registered when the script runs.
// ─────────────────────────────────────────────────────────────────────────────
const CHECKBOX_IDS = new Set(['a_youngerSpouseRrif', 'a_cppSharing']);
const SELECT_IDS   = new Set(['a_withdrawalOrder', 'a_spousalContributor', 'a_fpPreset']);
const FIELD_IDS = [
  // P1
  'f_name','f_dob','f_dobMonth','f_retireYear',
  'f_salary','f_salaryRefYear','f_salaryRaise',
  'f_annualRrspContrib','f_annualTfsaContrib','f_annualNonregContrib',
  'f_db_before65','f_db_after65','f_db_index','f_db_startYear',
  'f_rrsp','f_tfsa','f_tfsaRoom','f_tfsaAnnual',
  'f_lif','f_nonreg','f_nonregAcb','f_nonregAnnual',
  'f_cpp70_monthly','f_cpp65_monthly','f_oas_monthly',
  // P2
  'm_name','m_dob','m_dobMonth','m_retireYear',
  'm_salary','m_salaryRefYear','m_salaryRaise',
  'm_annualRrspContrib','m_annualTfsaContrib','m_annualNonregContrib',
  'm_db_before65','m_db_after65','m_db_index','m_db_startYear',
  'm_rrsp','m_rrspRoom','m_tfsa','m_tfsaRoom','m_tfsaAnnual',
  'm_lira','m_lif','m_nonreg','m_nonregAcb','m_nonregAnnual',
  'm_cpp70_monthly','m_cpp65_monthly','m_oas_monthly',
  'm_cppSurv_u65','m_cppSurv_o65',
  // Joint / Spending
  'mort_balance','mort_rate','mort_monthly',
  'loc_balance','loc_rate',
  'sp_gogo','sp_gogoEnd','sp_slowgo','sp_slowgoEnd','sp_nogo',
  // Section 5
  'a_inheritance',
  'a_downsizeYear','a_downsizeProceeds',
  'a_oneOff1Year','a_oneOff1Amt','a_oneOff1Label',
  'a_oneOff2Year','a_oneOff2Amt','a_oneOff2Label',
  'a_cashWedge','a_cashWedgeReturn','a_cashWedgeYears',
  'a_planStart','a_planEnd','a_horizon','a_p1Dies',
  'a_returnRate','a_inflation','a_returnStdDev',
  'a_youngerSpouseRrif','a_cppSharing',
  'a_withdrawalOrder','a_spousalContributor',
  'a_spousalContribY1','a_spousalContribY2',
  'a_fpPreset',
  // UI elements the form's helper code touches (no-op stubs).
  'error-msg','restore-banner','save-indicator','fpAppliedBanner',
];

const fields = {};
for (const id of FIELD_IDS) {
  fields[id] = {
    id,
    type: CHECKBOX_IDS.has(id) ? 'checkbox' : (SELECT_IDS.has(id) ? '' : 'number'),
    value: '',
    checked: false,
    style: {},
    classList: { add(){}, remove(){} },
    textContent: '',
  };
}

const fakeDoc = {
  getElementById(id){ return fields[id] || null; },
  querySelectorAll(){ return []; },          // expandAllCards / save iterators are no-ops
  addEventListener(){},                       // capture not needed for direct invocation
  body: { classList: { add(){}, remove(){} } },
};
const fakeStorage = { _s: {}, getItem(k){ return this._s[k] != null ? this._s[k] : null; },
                       setItem(k,v){ this._s[k] = String(v); }, removeItem(k){ delete this._s[k]; } };
const fakeWin = {
  location: { hash: '', href: '' },
  addEventListener(){},
  scrollTo(){},
  print(){},
};

// Inject globals the script touches outside the explicit window/document
// arguments (localStorage is referenced bare, not via window.localStorage).
globalThis.localStorage = fakeStorage;

// ─────────────────────────────────────────────────────────────────────────────
// Load + execute the form's <script> body, returning the helpers we need.
// ─────────────────────────────────────────────────────────────────────────────
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('Could not find <script> in index.html'); process.exit(2); }
const wrapper = `${m[1]}\n  return { gatherD, populateFromD, migrate, SCHEMA_VERSION };`;
let api;
try {
  const f = new Function('window', 'document', wrapper);
  api = f(fakeWin, fakeDoc);
} catch(e) {
  console.error('Could not load index.html script:', e);
  process.exit(2);
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Encode the fixture exactly as submitForm would.
// 2. Decode through migrate (no-op for v2).
// 3. populateFromD → fake DOM.
// 4. gatherD → re-encoded D'.
// 5. Compare D and D' field by field.
// ─────────────────────────────────────────────────────────────────────────────
const encoded = Buffer.from(encodeURIComponent(JSON.stringify(FIXTURE))).toString('base64');
const decoded = JSON.parse(decodeURIComponent(Buffer.from(encoded, 'base64').toString()));
const migrated = api.migrate(decoded);
api.populateFromD(migrated);
const reEncoded = api.gatherD();

let passed = 0, failed = 0;
function check(cond, label){
  if (cond) { passed++; console.log('  ✓ ' + label); }
  else      { failed++; console.log('  ✗ ' + label); }
}
function eq(a, b){
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (a && b && typeof a === 'object') {
    const ka = Object.keys(a), kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    for (const k of ka) if (!eq(a[k], b[k])) return false;
    return true;
  }
  return false;
}

console.log('\n═══ Intake form round-trip (Sprint 2 #59) ═══');

// Spot checks — each section of D round-trips correctly.
check(reEncoded.schemaVersion === 2, `schemaVersion = ${reEncoded.schemaVersion}`);
check(reEncoded.p1.name === 'Alex', `p1.name = '${reEncoded.p1.name}'`);
check(reEncoded.p1.salary === 165000, `p1.salary = $${reEncoded.p1.salary.toLocaleString()}`);
check(reEncoded.p1.cpp70_monthly === 1810, `p1.cpp70_monthly = $${reEncoded.p1.cpp70_monthly}`);
check(reEncoded.p1.cpp65_monthly === 1275, `p1.cpp65_monthly = $${reEncoded.p1.cpp65_monthly} (preserved, no auto-calc)`);
check(reEncoded.p2.name === 'Sam', `p2.name = '${reEncoded.p2.name}'`);
check(reEncoded.p2.cppSurv_u65_mo === 480, `p2.cppSurv_u65_mo = $${reEncoded.p2.cppSurv_u65_mo}`);
check(reEncoded.mortgage.balance === 145000, `mortgage.balance = $${reEncoded.mortgage.balance.toLocaleString()}`);
check(reEncoded.spending.gogo === 88000, `spending.gogo = $${reEncoded.spending.gogo.toLocaleString()}`);
check(reEncoded.inheritance === 250000, `inheritance = $${reEncoded.inheritance.toLocaleString()}`);
check(reEncoded.downsize.year === 2042 && reEncoded.downsize.netProceeds === 350000,
      `downsize = ${reEncoded.downsize.year}, $${reEncoded.downsize.netProceeds.toLocaleString()}`);
check(reEncoded.oneOffs.length === 2, `oneOffs.length = ${reEncoded.oneOffs.length}`);
check(reEncoded.oneOffs[0].label === 'wedding' && reEncoded.oneOffs[1].label === 'renovation',
      `oneOff labels round-trip`);
check(reEncoded.cashWedge.balance === 60000 && reEncoded.cashWedge.targetYears === 2,
      `cashWedge round-trips`);
check(reEncoded.assumptions.planStart === 2026, `assumptions.planStart = ${reEncoded.assumptions.planStart}`);
check(reEncoded.assumptions.youngerSpouseRrif === true,
      `assumptions.youngerSpouseRrif (checkbox) round-trips`);
check(reEncoded.assumptions.withdrawalOrder === 'meltdown',
      `assumptions.withdrawalOrder = '${reEncoded.assumptions.withdrawalOrder}'`);

// Spousal RRSP — recover contributor + Y1/Y2 amounts via the retYr anchor.
check(reEncoded.assumptions.spousalRrsp != null, `assumptions.spousalRrsp not null`);
check(reEncoded.assumptions.spousalRrsp.contributor === 'f',
      `spousalRrsp.contributor = '${reEncoded.assumptions.spousalRrsp.contributor}'`);
check(reEncoded.assumptions.spousalRrsp.contribs[2029] === 4000 &&
      reEncoded.assumptions.spousalRrsp.contribs[2028] === 3500,
      `spousalRrsp contribs round-trip ({2029:4000, 2028:3500})`);

// Final deep-equal — anything not covered by spot checks should still match.
// retireYear is recomputed by gatherD as min(p1,p2) — fixture sets it to 2030.
check(reEncoded.assumptions.retireYear === Math.min(FIXTURE.p1.retireYear, FIXTURE.p2.retireYear),
      `assumptions.retireYear = min(p1, p2) = ${reEncoded.assumptions.retireYear}`);
check(eq(reEncoded, FIXTURE),
      `full deep-equal: gatherD(populateFromD(D)) === D`);

console.log(`\n═══ SUMMARY ═══\nPassed: ${passed}\nFailed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
