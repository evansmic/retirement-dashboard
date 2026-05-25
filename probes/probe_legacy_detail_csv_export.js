// Regression coverage for the legacy dashboard Year-by-Year Detail CSV export.
// The export belongs to the detail table under Sequence-of-Returns and must
// follow the selected dashboard scenario plus nominal/real display mode.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'retirement_dashboard.html'), 'utf8');
const match = html.match(/<script>([\s\S]*?)<\/script>/);
const helper = fs.readFileSync(path.join(root, 'engine', 'tax_benefit_helpers.js'), 'utf8');
if (!match) { console.error('Could not find dashboard script'); process.exit(2); }

const fakeDocument = {
  body: { appendChild(){} },
  getElementById(){ return null; },
  addEventListener(){},
  createElement(){
    return {
      click(){ this.clicked = true; },
      remove(){ this.removed = true; }
    };
  }
};
const fakeWindow = {
  location: { hash: '', search: '' },
  addEventListener(){},
  URL: {
    createObjectURL(){ return 'blob:legacy-detail-csv'; },
    revokeObjectURL(){}
  }
};

let out;
try {
  const wrapper = `${helper}\n${match[1]}
activeScenario = 'melt';
displayUnit = 'nominal';
const meltRows = scenarioDetailCsvRows();
activeScenario = 'base';
displayUnit = 'nominal';
const baseNominalRows = scenarioDetailCsvRows();
displayUnit = 'real';
const baseRealRows = scenarioDetailCsvRows();
let stopped = false;
downloadActiveScenarioDetailCsv({ stopPropagation(){ stopped = true; } });
return { SCENARIOS, RESULTS, meltRows, baseNominalRows, baseRealRows, stopped };`;
  out = new Function('window', 'document', 'Blob', 'URL', wrapper)(
    fakeWindow,
    fakeDocument,
    function Blob(){},
    fakeWindow.URL
  );
} catch (e) {
  console.error('Could not run dashboard script:', e);
  process.exit(2);
}

let passed = 0, failed = 0;
function check(cond, label){
  if (cond) { passed++; console.log('  ✓ ' + label); }
  else { failed++; console.log('  ✗ ' + label); }
}

console.log('\n═══ Legacy detail CSV export ═══');

const headers = out.meltRows[0];
const firstMelt = out.meltRows[1];

check(html.includes('id="detCsvBtn"'), 'CSV button is attached to legacy detail card');
check(html.includes('downloadActiveScenarioDetailCsv(event)'), 'button invokes legacy detail CSV download');
check(/#mcRunBtn, #seqRunBtn, #cmpPosBtn, #detCsvBtn/.test(html), 'print stylesheet hides the detail CSV button');
check(headers.includes('Scenario') && headers.includes('Display dollars'), 'CSV includes scenario and display-dollar headers');
check(out.meltRows.length === out.RESULTS.melt.years.length + 1, 'melt scenario export includes one row per selected scenario year');
check(firstMelt[0] === out.SCENARIOS.melt.label, 'CSV scenario label follows active scenario');
check(firstMelt[1] === 'nominal', 'nominal display mode is exported');
check(out.baseRealRows[1][1] === 'real', 'real display mode is exported');
check(html.includes("displayUnit === 'real' ? rawYears.map(inflateRow) : rawYears"), 'CSV export uses the same real-dollar row path as the detail table');
check(out.stopped === true, 'download click does not toggle the collapsed detail card');

console.log(`\n═══ SUMMARY ═══\nPassed: ${passed}\nFailed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
