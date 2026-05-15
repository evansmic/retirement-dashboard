// React preview scenario runner extraction probe.
//
// Keeps Sprint 21 honest: React should call the engine-owned preview runner,
// while the extracted scenario/survivor boundary still mirrors the direct
// simulation reruns used before this sprint.
const fs = require('fs');
const path = require('path');
const { createLegacyEngine, runSimulation } = require('../engine/legacy_engine_bridge.cjs');

let passed = 0, failed = 0;
function check(cond, label) {
  if (cond) { passed++; console.log('  ✓ ' + label); }
  else { failed++; console.log('  ✗ ' + label); }
}
function close(a, b, tolerance, label) {
  check(Math.abs(a - b) <= tolerance, `${label}: ${Math.round(a).toLocaleString()} ≈ ${Math.round(b).toLocaleString()}`);
}
function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
function p2LooksBlank(p2) {
  if (!p2 || typeof p2 !== 'object') return true;
  const name = String(p2.name || '').trim();
  const placeholderName = !name || name === '—' || name.toLowerCase() === 'person 2';
  const fields = [
    'dob', 'dobMonth', 'retireYear', 'salary', 'annualRrspContrib', 'annualTfsaContrib',
    'annualNonregContrib', 'db_before65', 'db_after65', 'rrsp', 'rrspRoom', 'tfsa',
    'tfsaRoom', 'tfsaAnnual', 'lira', 'lif', 'nonreg', 'nonregAcb', 'nonregAnnual',
    'cpp70_monthly', 'cpp65_monthly', 'oas_monthly', 'cppSurv_u65_mo', 'cppSurv_o65_mo'
  ];
  return placeholderName && !fields.some((key) => Number(p2[key] || 0) > 0);
}
function endPortfolio(result) {
  return result.years[result.years.length - 1].bal_total;
}

console.log('\n═══ Preview scenario runner extraction ═══');

const repoRoot = path.join(__dirname, '..');
const helperPath = path.join(repoRoot, 'app', 'src', 'engine', 'previewScenarios.ts');
const appPath = path.join(repoRoot, 'app', 'src', 'ui', 'App.tsx');
const helperSource = fs.readFileSync(helperPath, 'utf8');
const appSource = fs.readFileSync(appPath, 'utf8');

check(/export type PreviewScenarioId = 'retireLater' \| 'spendLessGogo' \| 'delayBenefits'/.test(helperSource),
  'helper exports the bounded scenario id contract');
check(/export function runResultsPreviewBundle/.test(helperSource), 'helper exports runResultsPreviewBundle');
check(/export function shouldRunSurvivorPreview/.test(helperSource), 'helper owns survivor preview gating');
check(/import\('\.\.\/engine\/previewScenarios'\)/.test(appSource), 'React dynamically imports previewScenarios');
check(!/import\('\.\.\/engine\/runSimulation'\)/.test(appSource), 'React no longer dynamically imports runSimulation directly');
check(!/const retireLaterPlan = extractPlanPayload\(plan\)/.test(appSource), 'React no longer constructs retire-later scenarios inline');

const registry = createLegacyEngine();
const plan = registry.PRESETS['diy-couple']();
plan.assumptions.p1DiesInSurvivor = 2032;
const baselineConfig = {
  cppAgeF: 65,
  cppAgeM: 65,
  oasAgeF: 65,
  oasAgeM: 65,
  meltdown: false,
  returnRate: 0.05,
  pensionSplit: false,
  p1Dies: null,
  withdrawalOrder: plan.assumptions.withdrawalOrder || 'default'
};

const baseline = runSimulation(plan, baselineConfig);
const retireLaterPlan = clone(plan);
const retireLaterYear = (retireLaterPlan.assumptions.retireYear || retireLaterPlan.p1.retireYear || 0) + 2;
if (retireLaterYear > 2) retireLaterPlan.assumptions.retireYear = retireLaterYear;
if (retireLaterPlan.p1.retireYear) retireLaterPlan.p1.retireYear += 2;
if (!p2LooksBlank(retireLaterPlan.p2) && retireLaterPlan.p2.retireYear) retireLaterPlan.p2.retireYear += 2;

const spendLessPlan = clone(plan);
spendLessPlan.spending.gogo = Math.round((spendLessPlan.spending.gogo || 0) * 0.9);

const retireLater = runSimulation(retireLaterPlan, baselineConfig);
const spendLess = runSimulation(spendLessPlan, baselineConfig);
const delayBenefits = runSimulation(plan, { ...baselineConfig, cppAgeF: 70, cppAgeM: 70, oasAgeF: 70, oasAgeM: 70 });
const survivor = runSimulation(plan, { ...baselineConfig, p1Dies: plan.assumptions.p1DiesInSurvivor });

check(baseline.years.length > 10, 'baseline preview returns a projection horizon');
check(retireLater.years.length === baseline.years.length, 'retire-later preview keeps the baseline horizon');
check(spendLess.years.length === baseline.years.length, 'spend-less preview keeps the baseline horizon');
check(delayBenefits.years.length === baseline.years.length, 'delay-benefits preview keeps the baseline horizon');
check(survivor.years.length === baseline.years.length, 'survivor preview keeps the baseline horizon');
close(retireLaterPlan.assumptions.retireYear, plan.assumptions.retireYear + 2, 0, 'retire-later assumption year shifts by two');
close(spendLessPlan.spending.gogo, Math.round(plan.spending.gogo * 0.9), 0, 'spend-less go-go spending shifts by 10 percent');
check(endPortfolio(retireLater) !== endPortfolio(baseline), 'retire-later scenario differs from baseline');
check(endPortfolio(spendLess) !== endPortfolio(baseline), 'spend-less scenario differs from baseline');
check(Number.isFinite(endPortfolio(delayBenefits)), 'delay-benefits scenario produces finite end portfolio');
check(Number.isFinite(endPortfolio(survivor)), 'survivor scenario produces finite end portfolio');

console.log(`\n═══ SUMMARY ═══\nPassed: ${passed}\nFailed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
