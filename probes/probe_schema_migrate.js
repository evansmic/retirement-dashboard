// Sprint 1 #46/#47–#49: schema versioning + migrate(D) scaffold + v1→v2 step.
// Verifies:
//  1. SCHEMA_VERSION constant is exported as 2 (post-rename).
//  2. getDefaultD() stamps schemaVersion = 2.
//  3. migrate() leaves a v2 payload at v2.
//  4. migrate() upgrades a payload with no schemaVersion (legacy hash) to v2,
//     including the v1→v2 frank/moon → p1/p2 rename.
//  5. migrate() upgrades an explicitly-v1 payload (frank/moon keys) to v2.
//  6. Future-version payload is loaded as-is, with a warning. Don't crash.
//  7. The hash-loader pipeline applies migrate() before rehydrating, so a legacy
//     v1 payload with frank/moon keys arrives at the engine as p1/p2.
//  8. migrate() handles non-objects without throwing.
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "..", "retirement_dashboard.html"), "utf8");
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const body = m[1];
const wrapper = `${body}\n  return { migrate, SCHEMA_VERSION, getDefaultD, loadClientData, D };`;

// Build a legacy v1 payload (no schemaVersion, frank/moon keys) and feed it via
// the hash. Confirms the loader runs migrate() and rehydrates p1/p2 correctly.
const legacyV1 = {
  // intentionally NO schemaVersion — pre-versioning hash
  frank: {
    name:'Alice', dob:1970, dobMonth:3, retireYear:2033,
    rrsp:400000, tfsa:120000, lif:0, nonreg:200000, nonregAcb:150000,
    cpp70_monthly:1800, cpp65_monthly:1270, oas_monthly:742.31,
  },
  moon: {
    name:'Bob', dob:1972, dobMonth:7, retireYear:2037,
    rrsp:350000, tfsa:90000, lif:0, lira:0, nonreg:100000, nonregAcb:75000,
    cpp70_monthly:1500, cpp65_monthly:1060, oas_monthly:742.31,
  },
  spending: { gogo:85000, gogoEnd:75, slowgo:70000, slowgoEnd:85, nogo:55000 },
  inheritance: 0,
  assumptions: {
    retireYear:2033, planStart:2026, planEnd:2070,
    returnRate:0.05, inflation:0.025, returnStdDev:0.10, horizon:95,
    youngerSpouseRrif:false, cppSharing:false, withdrawalOrder:'default',
    spousalRrsp:null,
    frankDiesInSurvivor: 2035,   // legacy field name, must migrate to p1DiesInSurvivor
  },
};
const encoded = Buffer.from(encodeURIComponent(JSON.stringify(legacyV1))).toString('base64');

const fakeWin = { location:{ hash:'#'+encoded }, addEventListener:()=>{} };
const fakeDoc = { getElementById:()=>null, addEventListener:()=>{} };

const f = new Function("window", "document", wrapper);
const out = f(fakeWin, fakeDoc);

// Helper that captures console.warn during `fn()` and returns the warnings.
function captureWarnings(fn) {
  const origWarn = console.warn;
  const warnings = [];
  console.warn = (...args) => warnings.push(args.join(' '));
  try { fn(); } finally { console.warn = origWarn; }
  return warnings;
}

let passed = 0, failed = 0;
function check(cond, label) {
  if (cond) { passed++; console.log("  ✓ " + label); }
  else      { failed++; console.log("  ✗ " + label); }
}

console.log("\n=== Schema versioning + migrate(D) scaffold ===");

check(out.SCHEMA_VERSION === 2, `SCHEMA_VERSION === 2 (got ${out.SCHEMA_VERSION})`);

const def = out.getDefaultD();
check(def.schemaVersion === 2, `getDefaultD().schemaVersion === 2 (got ${def.schemaVersion})`);

// migrate is idempotent on a v2 payload
const v2 = { schemaVersion: 2, p1: {}, p2: {} };
const v2After = out.migrate(JSON.parse(JSON.stringify(v2)));
check(v2After.schemaVersion === 2, `migrate(v2) keeps schemaVersion === 2`);
check(v2After.p1 !== undefined && v2After.p2 !== undefined,
      `migrate(v2) preserves p1/p2`);

// Legacy payload (no schemaVersion field, frank/moon keys) lifts to v2 with the rename
const legacy = { frank: { name: 'Old' }, moon: { name: 'Hash' },
                 assumptions: { frankDiesInSurvivor: 2030 } };
const lifted = out.migrate(JSON.parse(JSON.stringify(legacy)));
check(lifted.schemaVersion === 2,
      `migrate(no-version) sets schemaVersion === 2 (got ${lifted.schemaVersion})`);
check(lifted.p1 && lifted.p1.name === 'Old',
      `migrate(no-version) renames frank → p1 with values intact`);
check(lifted.p2 && lifted.p2.name === 'Hash',
      `migrate(no-version) renames moon → p2 with values intact`);
check(lifted.frank === undefined && lifted.moon === undefined,
      `migrate(no-version) removes the old frank/moon keys`);
check(lifted.assumptions && lifted.assumptions.p1DiesInSurvivor === 2030
      && lifted.assumptions.frankDiesInSurvivor === undefined,
      `migrate(no-version) renames frankDiesInSurvivor → p1DiesInSurvivor`);

// Explicit v1 payload (with schemaVersion: 1, frank/moon keys) lifts to v2
const explicitV1 = { schemaVersion: 1, frank: { name: 'F' }, moon: { name: 'M' } };
const v1Lifted = out.migrate(JSON.parse(JSON.stringify(explicitV1)));
check(v1Lifted.schemaVersion === 2,
      `migrate(v1) bumps schemaVersion to 2`);
check(v1Lifted.p1 && v1Lifted.p1.name === 'F' && v1Lifted.p2 && v1Lifted.p2.name === 'M',
      `migrate(v1) performs the frank/moon → p1/p2 rename`);

// Future-version payload: load as-is and emit a warning. Don't crash.
const future = { schemaVersion: 99, p1: {}, p2: {} };
let futureAfter;
const warnings = captureWarnings(() => {
  futureAfter = out.migrate(JSON.parse(JSON.stringify(future)));
});
check(futureAfter.schemaVersion === 99,
      `migrate(v99) leaves schemaVersion at 99 (newer than dashboard)`);
check(warnings.some(w => /newer than this dashboard supports/.test(w)),
      `migrate(v99) warns about newer schema (${warnings.length} warning(s))`);

// End-to-end: the loader chain applied migrate() and the legacy v1 payload arrived
// rehydrated as p1/p2 inside the engine.
check(out.D.schemaVersion === 2,
      `D.schemaVersion === 2 after legacy hash load (got ${out.D.schemaVersion})`);
check(out.D.p1 && out.D.p1.name === 'Alice',
      `D.p1.name === 'Alice' after legacy frank/moon hash load`);
check(out.D.p2 && out.D.p2.name === 'Bob',
      `D.p2.name === 'Bob' after legacy frank/moon hash load`);
check(out.D.assumptions.p1DiesInSurvivor === 2035,
      `D.assumptions.p1DiesInSurvivor === 2035 after migration`);

// Defensive: migrate() handles non-objects without throwing
check(out.migrate(null) === null, `migrate(null) returns null without throwing`);
check(out.migrate(undefined) === undefined, `migrate(undefined) returns undefined`);

console.log(`\n=== SUMMARY ===\nPassed: ${passed}\nFailed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
