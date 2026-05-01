const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "retirement_dashboard.html"), "utf8");
const match = html.match(/<script>([\s\S]*?)<\/script>/);
const helper = fs.readFileSync(path.join(root, "engine", "tax_benefit_helpers.js"), "utf8");

if (!match) {
  throw new Error("Could not find dashboard script block.");
}

const wrapper = `${helper}
${match[1]}
  return { D, PRESETS, PRESET_META, RESULTS, SCENARIOS, sequenceOfReturnsStress };
`;

const SUMMARY_CSV = "preset_baselines.csv";
const YEARLY_CSV = "preset_baselines_yearly.csv";

function loadPreset(slug) {
  const fakeWindow = {
    location: { hash: "", search: `?example=${slug}` },
    addEventListener: () => {}
  };
  const fakeDocument = {
    getElementById: () => null,
    addEventListener: () => {}
  };
  const run = new Function("window", "document", wrapper);
  return run(fakeWindow, fakeDocument);
}

function money(value) {
  return Math.round(Number(value || 0));
}

function firstYear(rows, predicate) {
  const row = rows.find(predicate);
  return row ? row.year : "Never";
}

function summarizeScenario(result) {
  const years = result.years;
  const first = years[0];
  const last = years[years.length - 1];
  return {
    startYear: first.year,
    endYear: last.year,
    years: years.length,
    firstShortfallYear: result.shortfallYear || firstYear(years, y => y.shortfall > 500),
    portfolioDepletionYear: result.depletionYear || firstYear(years, y => y.bal_total < 10000),
    endingPortfolio: money(last.bal_total),
    lifetimeAfterTaxSpend: money(result.totalAftax),
    lifetimeTax: money(result.totalTax),
    lifetimeOasClawback: money(result.totalOasClawback),
    maxAnnualShortfall: money(Math.max(...years.map(y => y.shortfall || 0))),
    totalCppOas: money(years.reduce((sum, y) => sum + y.cpp_f + y.cpp_m + y.oas_f + y.oas_m, 0)),
    totalDbPension: money(years.reduce((sum, y) => sum + (y.dbPension || 0) + (y.dbPension_m || 0) + (y.dbSurvivor || 0), 0)),
    totalRegisteredDraws: money(years.reduce((sum, y) => sum + y.rrif_draw_f + y.rrif_draw_m + y.lif_draw, 0)),
    totalTfsaDraws: money(years.reduce((sum, y) => sum + y.tfsa_draw, 0)),
    totalNonRegDraws: money(years.reduce((sum, y) => sum + y.nonreg_draw, 0))
  };
}

function scenarioConfigSnapshot(scenario) {
  const cfg = scenario.cfg || {};
  return {
    label: scenario.label,
    cppAgeF: cfg.cppAgeF,
    cppAgeM: cfg.cppAgeM,
    oasAgeF: cfg.oasAgeF,
    oasAgeM: cfg.oasAgeM,
    returnRate: cfg.returnRate,
    pensionSplit: !!cfg.pensionSplit,
    p1Dies: cfg.p1Dies || null,
    withdrawalOrder: cfg.withdrawalOrder,
    spendMultiplier: Number((cfg.spendMultiplier || 1).toFixed(4)),
    meltdown: !!cfg.meltdown
  };
}

function annualRows(result, scenarioKey) {
  return result.years.map(y => ({
    scenario: scenarioKey,
    year: y.year,
    ageP1: y.ageF,
    ageP2: y.ageM,
    p1Alive: !!y.p1Alive,
    dollarMode: "nominal",
    realBaseYear: result.years[0].year,
    taxableIncomeP1: money(y.taxableIncomeF),
    taxableIncomeP2: money(y.taxableIncomeM),
    taxableIncomeTotal: money(y.taxableIncome),
    totalTax: money(y.totalTaxYear),
    oasClawbackP1: money(y.clawF),
    oasClawbackP2: money(y.clawM),
    oasClawbackTotal: money(y.totalOasClawY),
    salaryP1: money(y.salary_f),
    salaryP2: money(y.salary_m),
    dbPensionP1: money(y.dbPension),
    dbPensionP2: money(y.dbPension_m),
    dbSurvivor: money(y.dbSurvivor),
    cppP1: money(y.cpp_f),
    cppP2: money(y.cpp_m),
    oasP1Net: money(y.oas_f),
    oasP2Net: money(y.oas_m),
    registeredDrawP1: money(y.rrif_draw_f + y.lif_min_f),
    registeredDrawP2: money(y.rrif_draw_m + y.lif_min_m),
    registeredDrawTotal: money(y.rrif_draw_f + y.rrif_draw_m + y.lif_draw),
    tfsaDrawP1: money(y.tfsa_draw_f),
    tfsaDrawP2: money(y.tfsa_draw_m),
    tfsaDrawTotal: money(y.tfsa_draw),
    nonRegDrawP1: money(y.nonreg_draw_f),
    nonRegDrawP2: money(y.nonreg_draw_m),
    nonRegDrawTotal: money(y.nonreg_draw),
    cashDraw: money(y.cash_draw),
    spendingTarget: money(y.spending),
    mortgagePayment: money(y.mortgage),
    actualSpend: money(y.totalAftaxYear),
    shortfall: money(y.shortfall),
    rrspRrifBalanceP1: money(y.bal_rrsp_f),
    rrspRrifBalanceP2: money(y.bal_rrsp_m),
    rrspRrifBalanceTotal: money(y.bal_rrsp),
    tfsaBalanceTotal: money(y.bal_tfsa),
    lifBalanceTotal: money(y.bal_lif),
    nonRegBalanceTotal: money(y.bal_nonreg),
    cashBalance: money(y.bal_cash),
    totalPortfolio: money(y.bal_total)
  }));
}

function householdSnapshot(D) {
  const people = [D.p1, D.p2].filter(p => p && p.name);
  return {
    people: people.map(p => ({
      name: p.name,
      birthYear: p.dob,
      retireYear: p.retireYear,
      salary: money(p.salary),
      rrsp: money(p.rrsp),
      tfsa: money(p.tfsa),
      lif: money((p.lif || 0) + (p.lira || 0)),
      nonreg: money(p.nonreg),
      cpp65Annual: money(p.cpp65),
      cpp70Annual: money(p.cpp70),
      oasAnnual: money(p.oasBase),
      dbBefore65: money(p.db_before65),
      dbAfter65: money(p.db_after65)
    })),
    spending: {
      goGo: money(D.spending.gogo),
      goGoEndAge: D.spending.gogoEnd,
      slowGo: money(D.spending.slowgo),
      slowGoEndAge: D.spending.slowgoEnd,
      noGo: money(D.spending.nogo)
    },
    assumptions: {
      planStart: D.assumptions.planStart,
      planEnd: D.assumptions.planEnd,
      returnRate: D.assumptions.returnRate,
      inflation: D.assumptions.inflation,
      cpiIndex: D.assumptions.cpiIndex,
      fedTaxIndex: D.assumptions.fedTaxIndex,
      onTaxIndex: D.assumptions.onTaxIndex,
      cppIndex: D.assumptions.cppIndex,
      oasIndex: D.assumptions.oasIndex,
      returnStdDev: D.assumptions.returnStdDev,
      monteCarloPaths: D.assumptions.monteCarloPaths,
      withdrawalOrder: D.assumptions.withdrawalOrder,
      cppSharing: D.assumptions.cppSharing,
      youngerSpouseRrif: D.assumptions.youngerSpouseRrif,
      pensionSplit: D.assumptions.pensionSplit
    }
  };
}

const firstLoad = loadPreset("diy-couple");
const slugs = firstLoad.PRESET_META.map(p => p.slug);
const generatedAt = new Date().toISOString();

const baselines = {
  generatedAt,
  source: "retirement_dashboard.html PRESETS registry",
  methodology: "validation/tax_methodology_2026.md",
  dollarMode: "nominal",
  note: "Nominal CAD. These are deterministic engine outputs for external-tool validation, not financial advice.",
  presets: {}
};

const csvRows = [
  [
    "preset",
    "scenario",
    "startYear",
    "endYear",
    "years",
    "firstShortfallYear",
    "portfolioDepletionYear",
    "endingPortfolio",
    "lifetimeAfterTaxSpend",
    "lifetimeTax",
    "lifetimeOasClawback",
    "maxAnnualShortfall",
    "totalCppOas",
    "totalDbPension",
    "totalRegisteredDraws",
    "totalTfsaDraws",
    "totalNonRegDraws",
    "sustainableSpendMultiplier"
  ]
];

const yearlyCsvRows = [
  [
    "preset",
    "scenario",
    "year",
    "ageP1",
    "ageP2",
    "p1Alive",
    "dollarMode",
    "realBaseYear",
    "taxableIncomeP1",
    "taxableIncomeP2",
    "taxableIncomeTotal",
    "totalTax",
    "oasClawbackP1",
    "oasClawbackP2",
    "oasClawbackTotal",
    "salaryP1",
    "salaryP2",
    "dbPensionP1",
    "dbPensionP2",
    "dbSurvivor",
    "cppP1",
    "cppP2",
    "oasP1Net",
    "oasP2Net",
    "registeredDrawP1",
    "registeredDrawP2",
    "registeredDrawTotal",
    "tfsaDrawP1",
    "tfsaDrawP2",
    "tfsaDrawTotal",
    "nonRegDrawP1",
    "nonRegDrawP2",
    "nonRegDrawTotal",
    "cashDraw",
    "spendingTarget",
    "mortgagePayment",
    "actualSpend",
    "shortfall",
    "rrspRrifBalanceP1",
    "rrspRrifBalanceP2",
    "rrspRrifBalanceTotal",
    "tfsaBalanceTotal",
    "lifBalanceTotal",
    "nonRegBalanceTotal",
    "cashBalance",
    "totalPortfolio"
  ]
];

for (const slug of slugs) {
  const loaded = loadPreset(slug);
  const meta = loaded.PRESET_META.find(p => p.slug === slug);
  const scenarios = {};

  for (const [key, scenario] of Object.entries(loaded.SCENARIOS)) {
    const summary = summarizeScenario(loaded.RESULTS[key]);
    summary.label = scenario.label;
    summary.sustainableSpendMultiplier = Number((scenario.info && scenario.info.sustMult || 1).toFixed(4));
    summary.config = scenarioConfigSnapshot(scenario);
    summary.annual = annualRows(loaded.RESULTS[key], key);
    scenarios[key] = summary;

    for (const row of summary.annual) {
      yearlyCsvRows.push([
        slug,
        key,
        row.year,
        row.ageP1,
        row.ageP2,
        row.p1Alive,
        row.dollarMode,
        row.realBaseYear,
        row.taxableIncomeP1,
        row.taxableIncomeP2,
        row.taxableIncomeTotal,
        row.totalTax,
        row.oasClawbackP1,
        row.oasClawbackP2,
        row.oasClawbackTotal,
        row.salaryP1,
        row.salaryP2,
        row.dbPensionP1,
        row.dbPensionP2,
        row.dbSurvivor,
        row.cppP1,
        row.cppP2,
        row.oasP1Net,
        row.oasP2Net,
        row.registeredDrawP1,
        row.registeredDrawP2,
        row.registeredDrawTotal,
        row.tfsaDrawP1,
        row.tfsaDrawP2,
        row.tfsaDrawTotal,
        row.nonRegDrawP1,
        row.nonRegDrawP2,
        row.nonRegDrawTotal,
        row.cashDraw,
        row.spendingTarget,
        row.mortgagePayment,
        row.actualSpend,
        row.shortfall,
        row.rrspRrifBalanceP1,
        row.rrspRrifBalanceP2,
        row.rrspRrifBalanceTotal,
        row.tfsaBalanceTotal,
        row.lifBalanceTotal,
        row.nonRegBalanceTotal,
        row.cashBalance,
        row.totalPortfolio
      ]);
    }

    csvRows.push([
      slug,
      key,
      summary.startYear,
      summary.endYear,
      summary.years,
      summary.firstShortfallYear,
      summary.portfolioDepletionYear,
      summary.endingPortfolio,
      summary.lifetimeAfterTaxSpend,
      summary.lifetimeTax,
      summary.lifetimeOasClawback,
      summary.maxAnnualShortfall,
      summary.totalCppOas,
      summary.totalDbPension,
      summary.totalRegisteredDraws,
      summary.totalTfsaDraws,
      summary.totalNonRegDraws,
      summary.sustainableSpendMultiplier
    ]);
  }

  const seq = loaded.sequenceOfReturnsStress(loaded.SCENARIOS.base.cfg);
  const sequenceStress = {};
  for (const key of ["_baseline", "1929", "1973", "2000", "2008"]) {
    const result = seq[key];
    const last = result.years[result.years.length - 1];
    sequenceStress[key] = {
      endingPortfolio: money(last.bal_total),
      firstShortfallYear: firstYear(result.years, y => y.shortfall > 500),
      maxAnnualShortfall: money(Math.max(...result.years.map(y => y.shortfall || 0)))
    };
  }

  baselines.presets[slug] = {
    label: meta ? meta.label : slug,
    subtitle: meta ? meta.sub : "",
    household: householdSnapshot(loaded.D),
    scenarios,
    sequenceStress
  };
}

fs.writeFileSync(
  path.join(__dirname, "preset_baselines.json"),
  JSON.stringify(baselines, null, 2) + "\n"
);

fs.writeFileSync(
  path.join(__dirname, SUMMARY_CSV),
  csvRows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\n") + "\n"
);

fs.writeFileSync(
  path.join(__dirname, YEARLY_CSV),
  yearlyCsvRows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\n") + "\n"
);

console.log(`Exported ${slugs.length} preset baselines to validation/preset_baselines.json, ${SUMMARY_CSV}, and ${YEARLY_CSV}`);
