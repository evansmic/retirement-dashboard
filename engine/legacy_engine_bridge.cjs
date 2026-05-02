const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DASHBOARD_HTML = path.join(ROOT, 'retirement_dashboard.html');
const TAX_HELPERS = path.join(__dirname, 'tax_benefit_helpers.js');

function encodePlanHash(plan) {
  return '#' + Buffer.from(encodeURIComponent(JSON.stringify(plan))).toString('base64');
}

function createFakeDocument() {
  return {
    getElementById() { return null; },
    querySelectorAll() { return []; },
    addEventListener() {},
    body: { classList: { add() {}, remove() {} } }
  };
}

function loadDashboardScript() {
  const html = fs.readFileSync(DASHBOARD_HTML, 'utf8');
  const match = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!match) throw new Error('Could not find dashboard inline script.');
  return {
    helper: fs.readFileSync(TAX_HELPERS, 'utf8'),
    body: match[1]
  };
}

function createLegacyEngine(plan) {
  const hash = plan ? encodePlanHash(plan) : '';
  const { helper, body } = loadDashboardScript();
  const fakeWindow = {
    location: { hash, search: '' },
    addEventListener() {},
    print() {}
  };
  const fakeDocument = createFakeDocument();
  const wrapper = `${helper}
${body}
return {
  D,
  runSimulation,
  summarizeStressRun,
  monteCarlo,
  sequenceOfReturnsStress,
  fullSpendingFundedRate,
  probabilityOfSuccess,
  PRESETS,
  SCENARIOS,
  RESULTS
};`;
  return new Function('window', 'document', wrapper)(fakeWindow, fakeDocument);
}

function runSimulation(plan, cfg) {
  const engine = createLegacyEngine(plan);
  return engine.runSimulation(Object.assign({}, cfg));
}

module.exports = {
  createLegacyEngine,
  runSimulation
};
