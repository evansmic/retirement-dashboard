// Sprint 1 #58: example presets + blank-state preset loader.
// Verifies:
//   1. PRESETS registry exports 5 slugs and matches PRESET_META.
//   2. Each preset returns a fully-populated, schema-v2-stamped D that
//      passes through migrate() unchanged.
//   3. With no hash and no ?example, loadClientData() returns a blank D
//      (`_isBlank: true`) and the engine still computes scenarios cleanly.
//   4. With ?example=<slug>, loadClientData() returns the preset payload
//      (no _isBlank) and the engine produces non-degenerate output
//      (positive total income across the year array).
//   5. Single-household preset (`single-late-career`) wires P2 to blank-name
//      with zeroed benefits — engine's hasP2 check should treat it as solo.
//   6. Unknown slug (?example=does-not-exist) falls through to the blank
//      state rather than silently picking a different preset.
//   7. PRESET_META slugs and PRESETS keys are in lock-step.

const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "..", "retirement_dashboard.html"), "utf8");
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const body = m[1];
const wrapper = `${body}\n  return { migrate, SCHEMA_VERSION, getDefaultD, getBlankD, loadClientData, D, PRESETS, PRESET_META, RESULTS, SCENARIOS };`;

function loadWithUrl({ hash = '', search = '' } = {}) {
  const fakeWin = { location: { hash, search }, addEventListener: () => {} };
  const fakeDoc = { getElementById: () => null, addEventListener: () => {} };
  const f = new Function("window", "document", wrapper);
  return f(fakeWin, fakeDoc);
}

let passed = 0, failed = 0;
function check(cond, label) {
  if (cond) { passed++; console.log("  ✓ " + label); }
  else      { failed++; console.log("  ✗ " + label); }
}

console.log("\n=== Sprint 1 #58: example presets + blank-state loader ===");

// ── 1. Registry shape ──
const probe0 = loadWithUrl();   // no hash, no search → blank
check(probe0.PRESETS && typeof probe0.PRESETS === 'object',
      `PRESETS registry is exported as an object`);
const slugs = Object.keys(probe0.PRESETS);
check(slugs.length === 5,
      `PRESETS contains exactly 5 archetypes (got ${slugs.length}: ${slugs.join(', ')})`);
const expectedSlugs = ['diy-couple','db-pension-couple','single-late-career','retired-traditional','fire-couple'];
check(expectedSlugs.every(s => slugs.includes(s)),
      `PRESETS contains every expected slug`);

// ── 2. PRESET_META alignment ──
check(Array.isArray(probe0.PRESET_META) && probe0.PRESET_META.length === 5,
      `PRESET_META is an array of 5 entries`);
const metaSlugs = probe0.PRESET_META.map(p => p.slug);
check(metaSlugs.every(s => probe0.PRESETS[s]),
      `every PRESET_META.slug points at a real preset`);
check(slugs.every(s => metaSlugs.includes(s)),
      `every PRESETS key has a PRESET_META entry`);
check(probe0.PRESET_META.every(p => p.label && p.sub),
      `every PRESET_META entry has a label and sub-label`);

// ── 3. Each preset is schema-v2 and passes migrate() idempotently ──
for (const slug of expectedSlugs) {
  const built = probe0.PRESETS[slug]();
  check(built.schemaVersion === 2,
        `${slug}: schemaVersion === 2`);
  check(!!(built.p1 && built.p2 && built.assumptions && built.spending),
        `${slug}: has p1 / p2 / assumptions / spending`);
  const migrated = probe0.migrate(JSON.parse(JSON.stringify(built)));
  check(migrated.schemaVersion === 2 && migrated.p1.name === built.p1.name,
        `${slug}: migrate() leaves it at v2 untouched`);
}

// ── 4. Blank-state default ──
check(probe0.D._isBlank === true,
      `no hash + no ?example → D._isBlank is true`);
check(probe0.D.schemaVersion === 2,
      `blank D still carries schemaVersion 2`);
check(probe0.D.p1.name === '' && probe0.D.p2.name === '',
      `blank D has empty p1 and p2 names`);
// Engine still runs on the blank D's stub data — no NaN explosions.
check(probe0.RESULTS && probe0.RESULTS.base && Array.isArray(probe0.RESULTS.base.years),
      `blank D: engine still produces a baseline RESULTS with a years array`);

// ── 5. ?example=<slug> deep-link routing ──
const probeDB = loadWithUrl({ search: '?example=db-pension-couple' });
check(probeDB.D._isBlank !== true,
      `?example=db-pension-couple → D._isBlank is NOT set`);
check(probeDB.D.p1.name === 'Margaret' && probeDB.D.p2.name === 'Robert',
      `?example=db-pension-couple → P1=Margaret, P2=Robert`);
check(probeDB.D.p1.db_before65 === 60000 && probeDB.D.p1.db_after65 === 49300,
      `db-pension-couple P1: HOOPP-style bridge ($60K) and lifetime ($49.3K) DB`);
const dbYears = probeDB.RESULTS.base.years;
check(Array.isArray(dbYears) && dbYears.length > 20,
      `db-pension-couple: simulation produces >20 years of output (got ${dbYears.length})`);
const dbTotalDB = dbYears.reduce((s, y) => s + (y.dbPension || 0) + (y.dbPension_m || 0), 0);
check(dbTotalDB > 1000000,
      `db-pension-couple: lifetime DB pension income > $1M nominal (got $${Math.round(dbTotalDB).toLocaleString()})`);

// FIRE preset → long horizon
const probeFire = loadWithUrl({ search: '?example=fire-couple' });
check(probeFire.D.p1.name === 'Alex' && probeFire.D.p2.name === 'Jordan',
      `?example=fire-couple → P1=Alex, P2=Jordan`);
check(probeFire.D.assumptions.planEnd === 2076,
      `fire-couple: planEnd extended to 2076 for the long horizon`);
const fireYears = probeFire.RESULTS.base.years;
check(fireYears.length >= 45,
      `fire-couple: ≥45 simulated years (got ${fireYears.length})`);

// Retired-traditional preset → already drawing CPP+OAS
const probeRet = loadWithUrl({ search: '?example=retired-traditional' });
check(probeRet.D.p1.name === 'Bill' && probeRet.D.p2.name === 'Linda',
      `?example=retired-traditional → P1=Bill, P2=Linda`);
check(probeRet.D.p1.salary === 0 && probeRet.D.p2.salary === 0,
      `retired-traditional: both salaries are zero`);

// DIY preset → working years modelled
const probeDIY = loadWithUrl({ search: '?example=diy-couple' });
check(probeDIY.D.p1.salary > 0 && probeDIY.D.p2.salary > 0,
      `diy-couple: both spouses have non-zero salary`);
check(probeDIY.D.p1.annualRrspContrib > 0,
      `diy-couple: P1 has non-zero annual RRSP contribution`);

// ── 6. single-late-career: solo household ──
const probeSolo = loadWithUrl({ search: '?example=single-late-career' });
check(probeSolo.D.p1.name === 'Lisa',
      `?example=single-late-career → P1=Lisa`);
check(probeSolo.D.p2.name === '',
      `single-late-career: P2 name is empty (single-household marker)`);
check(probeSolo.D.p2.rrsp === 0 && probeSolo.D.p2.tfsa === 0
      && probeSolo.D.p2.cpp65 === 0 && probeSolo.D.p2.oasBase === 0,
      `single-late-career: P2 balances and benefits are all zero`);
const soloYears = probeSolo.RESULTS.base.years;
check(soloYears.length > 0,
      `single-late-career: simulation runs cleanly (got ${soloYears.length} years)`);

// ── 7. Unknown slug falls through to blank ──
const probeBad = loadWithUrl({ search: '?example=does-not-exist' });
check(probeBad.D._isBlank === true,
      `?example=does-not-exist → falls through to blank state`);

// ── 8. Combined query string (slug not first) ──
const probeMix = loadWithUrl({ search: '?utm_source=test&example=diy-couple' });
check(probeMix.D._isBlank !== true && probeMix.D.p1.name === 'Sarah',
      `?example= still matches when not the first query param`);

console.log(`\n=== SUMMARY ===\nPassed: ${passed}\nFailed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
