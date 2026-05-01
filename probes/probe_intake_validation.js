// Sprint 3 S3-04: critical intake validation.
//
// Ensures blank critical inputs are caught before gatherD can silently coerce
// them to zero/defaults, while still allowing a true single-person plan when
// Person 2 is left completely blank.
const fs = require('fs');
const path = require('path');

const fields = {};
function makeParent(){
  return { querySelector(){ return null; }, appendChild(){} };
}
function field(id) {
  if (!fields[id]) {
    const parent = makeParent();
    fields[id] = {
      id,
      type: id === 'a_youngerSpouseRrif' || id === 'a_cppSharing' ? 'checkbox' : 'number',
      value: '',
      checked: false,
      style: {},
      classList: { add(){}, remove(){} },
      closest(){ return parent; },
      textContent: '',
      innerHTML: '',
    };
  }
  return fields[id];
}
function set(id, value){ field(id).value = String(value); }
function clear(){
  Object.keys(fields).forEach(id => {
    fields[id].value = '';
    fields[id].checked = false;
  });
}

const fakeDoc = {
  getElementById(id){ return field(id); },
  querySelectorAll(){ return []; },
  addEventListener(){},
  createElement(){ return { className:'', textContent:'' }; },
  body: { appendChild(){}, classList: { add(){}, remove(){} } },
};
const fakeWin = { location:{ hash:'', href:'' }, addEventListener(){}, scrollTo(){}, print(){} };
globalThis.localStorage = { getItem(){ return null; }, setItem(){}, removeItem(){} };

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('Could not find <script> in index.html'); process.exit(2); }

let api;
try {
  const wrapper = `${m[1]}\nreturn { validateForm, p2IsInUse };`;
  api = new Function('window', 'document', wrapper)(fakeWin, fakeDoc);
} catch(e) {
  console.error('Could not load index.html script:', e);
  process.exit(2);
}

function seedValidSingle(){
  set('f_name', 'Alex');
  set('f_dob', 1968);
  set('f_dobMonth', 5);
  set('f_retireYear', 2030);
  set('f_rrsp', 480000);
  set('f_tfsa', 130000);
  set('f_lif', 0);
  set('f_nonreg', 0);
  set('f_cpp70_monthly', 1810);
  set('f_oas_monthly', 742.31);
  set('mort_balance', 0);
  set('mort_monthly', 0);
  set('loc_balance', 0);
  set('sp_gogo', 88000);
  set('sp_gogoEnd', 75);
  set('sp_slowgo', 72000);
  set('sp_slowgoEnd', 85);
  set('sp_nogo', 56000);
  set('a_planEnd', 2070);
  set('a_horizon', 95);
  set('a_returnRate', 0.05);
  set('a_inflation', 0.025);
  set('a_returnStdDev', 0.10);
}

let passed = 0, failed = 0;
function check(cond, label){
  if (cond) { passed++; console.log('  ✓ ' + label); }
  else { failed++; console.log('  ✗ ' + label); }
}
function hasError(errors, id){ return errors.some(e => e.id === id); }

console.log('\n═══ Intake critical validation (Sprint 3 S3-04) ═══');

clear();
let errors = api.validateForm();
check(hasError(errors, 'f_dob'), 'blank Person 1 birth year is rejected');
check(hasError(errors, 'f_rrsp'), 'blank Person 1 balance is rejected');
check(hasError(errors, 'sp_gogo'), 'blank spending target is rejected');
check(hasError(errors, 'mort_balance'), 'blank liability balance requires explicit 0');

clear();
seedValidSingle();
errors = api.validateForm();
check(errors.length === 0, 'valid single-person plan passes with Person 2 blank');
check(api.p2IsInUse() === false, 'blank Person 2 section is treated as unused');

set('m_name', 'Sam');
errors = api.validateForm();
check(api.p2IsInUse() === true, 'Person 2 name activates Person 2 validation');
check(hasError(errors, 'm_dob'), 'activated Person 2 requires birth year');
check(hasError(errors, 'm_rrsp'), 'activated Person 2 requires explicit RRSP balance');

set('a_returnRate', 0.25);
errors = api.validateForm();
check(hasError(errors, 'a_returnRate'), 'out-of-range return assumption is rejected');

console.log(`\n═══ SUMMARY ═══\nPassed: ${passed}\nFailed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
