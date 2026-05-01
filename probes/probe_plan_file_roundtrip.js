// Sprint 3 S3-01: local .plan.json file round-trip.
//
// Verifies the intake form can wrap the current v2 payload in a local
// .plan.json envelope, recover the payload, and populate/gather it without
// requiring an account or changing the existing hash payload shape.
const fs = require('fs');
const path = require('path');

const fields = {};
function field(id) {
  if (!fields[id]) {
    fields[id] = {
      id,
      type: id === 'a_youngerSpouseRrif' || id === 'a_cppSharing' ? 'checkbox' : 'number',
      value: '',
      checked: false,
      style: {},
      classList: { add(){}, remove(){} },
      textContent: '',
      innerHTML: '',
    };
  }
  return fields[id];
}

const fakeDoc = {
  getElementById(id){ return field(id); },
  querySelectorAll(sel){
    if (sel === 'input[id]') return Object.values(fields);
    if (sel === 'details.card') return [];
    return [];
  },
  addEventListener(){},
  createElement(){ return { href:'', download:'', click(){}, remove(){} }; },
  body: { appendChild(){}, classList: { add(){}, remove(){} } },
};

const fakeStorage = {
  _s: {},
  getItem(k){ return this._s[k] != null ? this._s[k] : null; },
  setItem(k,v){ this._s[k] = String(v); },
  removeItem(k){ delete this._s[k]; },
};

const fakeWin = {
  location: { hash:'', href:'' },
  addEventListener(){},
  scrollTo(){},
  print(){},
};

globalThis.localStorage = fakeStorage;
globalThis.URL = { createObjectURL(){ return 'blob:plan'; }, revokeObjectURL(){} };
globalThis.Blob = function(parts, opts){ this.parts = parts; this.type = opts && opts.type; };
globalThis.FileReader = function(){};

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('Could not find <script> in index.html'); process.exit(2); }

let api;
try {
  const wrapper = `${m[1]}\nreturn { gatherD, populateFromD, migrate, createPlanFile, extractPlanPayload, planTitleFromD, safeFilenamePart, normalizePlanPayload, SCHEMA_VERSION, PLAN_FILE_TYPE, PLAN_FILE_VERSION };`;
  api = new Function('window', 'document', wrapper)(fakeWin, fakeDoc);
} catch(e) {
  console.error('Could not load index.html script:', e);
  process.exit(2);
}

function set(id, val){ field(id).value = String(val); }
function clearFields(){
  Object.values(fields).forEach(f => {
    f.value = '';
    f.checked = false;
  });
}
function check(cond, label){
  if (cond) { passed++; console.log('  ✓ ' + label); }
  else { failed++; console.log('  ✗ ' + label); }
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
function throwsMatch(fn, pattern){
  try {
    fn();
    return false;
  } catch (e) {
    return pattern.test(String(e && e.message || e));
  }
}

// Seed enough fields to produce a recognizable plan; gatherD supplies defaults
// for the rest, matching the real form behaviour.
set('f_name', 'Alex');
set('m_name', 'Sam');
set('f_dob', 1968);
set('m_dob', 1971);
set('f_dobMonth', 5);
set('m_dobMonth', 9);
set('f_retireYear', 2030);
set('m_retireYear', 2034);
set('f_rrsp', 480000);
set('m_rrsp', 360000);
set('f_cpp70_monthly', 1810);
set('f_cpp65_monthly', 1275);
set('m_cpp70_monthly', 1490);
set('m_cpp65_monthly', 1050);
set('sp_gogo', 88000);
set('sp_slowgo', 72000);
set('sp_nogo', 56000);
set('a_planStart', 2026);
set('a_planEnd', 2070);
set('a_withdrawalOrder', 'meltdown');
field('a_youngerSpouseRrif').checked = true;

const original = api.gatherD();
const file = api.createPlanFile(original, '2026-05-01T00:00:00.000Z');
const extracted = api.extractPlanPayload(file);
api.populateFromD(extracted);
const regathered = api.gatherD();

let passed = 0, failed = 0;

console.log('\n═══ Local .plan.json round-trip (Sprint 3 S3-01) ═══');

check(file.fileType === api.PLAN_FILE_TYPE, `fileType = ${file.fileType}`);
check(file.fileVersion === api.PLAN_FILE_VERSION, `fileVersion = ${file.fileVersion}`);
check(file.app && file.app.schemaVersion === api.SCHEMA_VERSION,
      `app.schemaVersion = ${file.app && file.app.schemaVersion}`);
check(file.title === 'Alex and Sam retirement plan', `title = '${file.title}'`);
check(api.safeFilenamePart(file.title) === 'alex-and-sam-retirement-plan',
      `safe filename = '${api.safeFilenamePart(file.title)}'`);
check(extracted.schemaVersion === api.SCHEMA_VERSION,
      `extracted.schemaVersion = ${extracted.schemaVersion}`);
check(eq(extracted, original), `extractPlanPayload(createPlanFile(D)) === D`);
check(eq(regathered, original), `gatherD(populateFromD(extracted)) === D`);

const rawExtracted = api.extractPlanPayload(original);
check(eq(rawExtracted, original), `raw v2 payload import remains supported`);

const annualPayload = JSON.parse(JSON.stringify(original));
annualPayload.p1.cpp70 = annualPayload.p1.cpp70_monthly * 12;
annualPayload.p1.cpp65 = annualPayload.p1.cpp65_monthly * 12;
annualPayload.p1.oasBase = annualPayload.p1.oas_monthly * 12;
delete annualPayload.p1.cpp70_monthly;
delete annualPayload.p1.cpp65_monthly;
delete annualPayload.p1.oas_monthly;
api.populateFromD(annualPayload);
const fromAnnual = api.gatherD();
check(fromAnnual.p1.cpp70_monthly === original.p1.cpp70_monthly &&
      fromAnnual.p1.cpp65_monthly === original.p1.cpp65_monthly,
      `dashboard-style annual CPP/OAS values import back to monthly form fields`);

check(throwsMatch(() => api.extractPlanPayload({ hello: 'world' }), /missing required household fields/),
      `unsupported JSON is rejected with a clear household-fields error`);
check(throwsMatch(() => api.extractPlanPayload({ fileType: api.PLAN_FILE_TYPE, fileVersion: api.PLAN_FILE_VERSION }), /missing its plan payload/),
      `malformed plan wrapper is rejected with a missing-payload error`);

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
  cashWedge: { balance: 0, returnRate: 0.03, targetYears: 2 },
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

const repaired = api.extractPlanPayload({
  fileType: api.PLAN_FILE_TYPE,
  fileVersion: api.PLAN_FILE_VERSION,
  plan: badSinglePayload
});
check(repaired.p2.name === '', `placeholder Person 2 is normalized to blank`);
check(repaired.assumptions.retireYear === 2028, `zero household retireYear is repaired from Person 1`);
check(api.planTitleFromD(repaired) === 'Larry retirement plan', `single-person plan title excludes Person 2 placeholder`);

clearFields();
api.populateFromD(repaired);
const repairedRegathered = api.gatherD();
check(repairedRegathered.p2.name === '', `populate/gather keeps blank Person 2 blank`);
check(repairedRegathered.assumptions.retireYear === 2028, `populate/gather keeps single-person retireYear finite`);

console.log(`\n═══ SUMMARY ═══\nPassed: ${passed}\nFailed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
