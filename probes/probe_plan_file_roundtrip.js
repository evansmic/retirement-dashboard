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
  const wrapper = `${m[1]}\nreturn { gatherD, populateFromD, migrate, createPlanFile, extractPlanPayload, planTitleFromD, safeFilenamePart, SCHEMA_VERSION, PLAN_FILE_TYPE, PLAN_FILE_VERSION };`;
  api = new Function('window', 'document', wrapper)(fakeWin, fakeDoc);
} catch(e) {
  console.error('Could not load index.html script:', e);
  process.exit(2);
}

function set(id, val){ field(id).value = String(val); }
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

console.log(`\n═══ SUMMARY ═══\nPassed: ${passed}\nFailed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
