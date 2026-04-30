const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "retirement_dashboard.html"), "utf8");
const match = html.match(/<script>([\s\S]*?)<\/script>/);

if (!match) {
  throw new Error("Could not find dashboard script block.");
}

const wrapper = `${match[1]}
  return { D, PRESETS, PRESET_META, RESULTS, SCENARIOS, sequenceOfReturnsStress };
`;

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
      returnStdDev: D.assumptions.returnStdDev,
      withdrawalOrder: D.assumptions.withdrawalOrder,
      cppSharing: D.assumptions.cppSharing,
      youngerSpouseRrif: D.assumptions.youngerSpouseRrif
    }
  };
}

const firstLoad = loadPreset("diy-couple");
const slugs = firstLoad.PRESET_META.map(p => p.slug);
const generatedAt = new Date().toISOString();

const baselines = {
  generatedAt,
  source: "retirement_dashboard.html PRESETS registry",
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

for (const slug of slugs) {
  const loaded = loadPreset(slug);
  const meta = loaded.PRESET_META.find(p => p.slug === slug);
  const scenarios = {};

  for (const [key, scenario] of Object.entries(loaded.SCENARIOS)) {
    const summary = summarizeScenario(loaded.RESULTS[key]);
    summary.label = scenario.label;
    summary.sustainableSpendMultiplier = Number((scenario.info && scenario.info.sustMult || 1).toFixed(4));
    scenarios[key] = summary;

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
  path.join(__dirname, "preset_baselines.csv"),
  csvRows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\n") + "\n"
);

console.log(`Exported ${slugs.length} preset baselines to validation/preset_baselines.json and .csv`);
