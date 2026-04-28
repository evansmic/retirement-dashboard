// Sprint 2 #52: Monte Carlo progressive runner.
//
// Verifies the begin/step/finish refactor and the chunked progressive runner
// used by the dashboard's auto-MC. The synchronous `monteCarlo()` is now a
// thin wrapper around `mcBegin → mcStep(state, nPaths) → mcFinish(state)`, so
// any divergence in the per-path math would surface as a regression in the
// existing phase4_final probe. This probe fills the gap with checks specific
// to the chunked path: state shape, batch accumulation, cancellation, and
// equivalence-of-shape between progressive output and the synchronous wrapper.
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'retirement_dashboard.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const body = m[1].replace(/window\.location\.hash\.slice\(1\)/g, '""');
const wrapper = `${body}\n  return { runSimulation, monteCarlo, monteCarloProgressive, mcBegin, mcStep, mcFinish, SCENARIOS };`;
const f = new Function("window", "document", wrapper);
// Stub a minimal localStorage on window since the auto-MC reads/writes to it.
const fakeStorage = { _s:{}, getItem(k){ return this._s[k]||null; }, setItem(k,v){ this._s[k]=String(v); }, removeItem(k){ delete this._s[k]; } };

// Override setTimeout in the script's lookup chain so the progressive runner's
// `setTimeout(tick, 0)` chain executes synchronously inside this probe. This
// lets us assert immediately after monteCarloProgressive() returns, instead of
// fighting the real event loop. Native setTimeout is restored after each test.
const realSetTimeout = global.setTimeout;
function syncSetTimeout(fn){ fn(); return 0; }
const out = f(
  { location:{hash:""}, addEventListener:()=>{}, localStorage: fakeStorage },
  { getElementById:()=>null, addEventListener:()=>{}, querySelectorAll:()=>[], body:{classList:{add(){},remove(){}}} }
);

let passed = 0, failed = 0;
function check(cond, label){
  if(cond){ passed++; console.log("  ✓ " + label); }
  else    { failed++; console.log("  ✗ " + label); }
}

const baseCfg = out.SCENARIOS.base.cfg;

// ─── (a) mcBegin returns a well-shaped state ─────────────────────────────
console.log("\n═══ (a) mcBegin / mcStep / mcFinish ═══");
const state = out.mcBegin(baseCfg, 50, 0.05, 0.10);
check(typeof state === 'object', 'mcBegin returns an object');
check(state.nPaths === 50, `state.nPaths = ${state.nPaths}`);
check(state.pathsRun === 0, `state.pathsRun starts at 0`);
check(state.refRun && state.refRun.years && state.refRun.years.length > 30, 'refRun has full horizon');
check(state.balances.length === state.nYears, `balances col count (${state.balances.length}) === nYears (${state.nYears})`);
check(state.endPort.length === state.nPaths, `endPort length === nPaths`);

// ─── (b) mcStep accumulates and clamps ────────────────────────────────────
out.mcStep(state, 20);
check(state.pathsRun === 20, `after step(20): pathsRun = ${state.pathsRun}`);
out.mcStep(state, 20);
check(state.pathsRun === 40, `after step(20) again: pathsRun = ${state.pathsRun}`);
// Batch larger than remaining → clamps to nPaths.
out.mcStep(state, 100);
check(state.pathsRun === 50, `step beyond nPaths clamps: pathsRun = ${state.pathsRun}`);
// Subsequent step is a no-op (no advance, no error).
out.mcStep(state, 50);
check(state.pathsRun === 50, `step on exhausted state is a no-op`);

// ─── (c) mcFinish produces the documented shape ──────────────────────────
const finished = out.mcFinish(state);
check(typeof finished.successRate === 'number' && finished.successRate >= 0 && finished.successRate <= 1,
      `successRate ∈ [0,1] (got ${finished.successRate.toFixed(3)})`);
check(finished.endPortfolio.p10 <= finished.endPortfolio.p50 && finished.endPortfolio.p50 <= finished.endPortfolio.p90,
      `endPortfolio percentiles ordered`);
check(finished.perYear.length === state.nYears, `perYear length matches nYears`);
check(finished.perYear.every(y => y.p10 <= y.p50 && y.p50 <= y.p90),
      `every per-year row has p10 ≤ p50 ≤ p90`);
check(finished.nPaths === 50 && finished.meanReturn === 0.05 && finished.stdDev === 0.10,
      `finish echoes nPaths/meanReturn/stdDev`);

// ─── (d) Synchronous monteCarlo() still works (regression after refactor) ─
console.log("\n═══ (d) monteCarlo() wrapper unchanged ═══");
const sync = out.monteCarlo(baseCfg, 50, 0.05, 0.10);
check(sync.perYear.length === state.nYears, `sync perYear length matches`);
check(sync.successRate >= 0 && sync.successRate <= 1, `sync successRate ∈ [0,1]`);
check(sync.endPortfolio.p10 <= sync.endPortfolio.p50 && sync.endPortfolio.p50 <= sync.endPortfolio.p90,
      `sync endPortfolio percentiles ordered`);

// ─── (e) Progressive runner: kicks off, completes, calls callbacks ───────
// Run with sync-setTimeout so we can assert synchronously inside this test.
// The runner's `setTimeout(tick, 0)` chain becomes a sync recursion of ~5
// frames at batchSize=15 / nPaths=60, well under any stack limit.
console.log("\n═══ (e) monteCarloProgressive — async lifecycle ═══");
let progressCalls = 0;
let lastDone = -1, lastTotal = -1;
let completed = null;

global.setTimeout = syncSetTimeout;
const handle = out.monteCarloProgressive(baseCfg, {
  nPaths: 60, batchSize: 15, stdDev: 0.10,
  onProgress: function(done, total){ progressCalls++; lastDone = done; lastTotal = total; },
  onComplete: function(mc){ completed = mc; }
});
global.setTimeout = realSetTimeout;

check(typeof handle.cancel === 'function', `handle.cancel is a function`);
check(completed !== null, `progressive run completes (sync mode)`);
check(progressCalls >= 3, `onProgress fired multiple times (got ${progressCalls})`);
check(lastTotal === 60 && lastDone <= 60, `final progress: ${lastDone}/${lastTotal}`);
check(completed && completed.nPaths === 60, `completed.nPaths === 60`);
check(completed && completed.perYear && completed.perYear.length === state.nYears,
      `completed.perYear length matches deterministic refRun`);
check(completed && completed.successRate >= 0 && completed.successRate <= 1,
      `completed.successRate ∈ [0,1] (${completed && completed.successRate.toFixed(3)})`);
check(completed && completed.perYear.every(y => y.p10 <= y.p50 && y.p50 <= y.p90),
      `completed per-year percentiles ordered`);

// ─── (f) Cancellation: cancelling pre-tick prevents onComplete ────────────
// monteCarloProgressive defers the first tick via setTimeout(0). With a
// schedule-and-store setTimeout (queues callbacks instead of running them
// inline), we can call cancel() before any tick fires and verify nothing
// downstream runs. We swap setTimeout AGAIN here, this time to a no-op
// queuer so the recursive tick chain pauses; cancel() then sets the flag,
// and we drain the queue manually.
console.log("\n═══ (f) Cancellation ═══");
let cancelDone = false, cancelProgress = 0;
const queue = [];
global.setTimeout = function(fn){ queue.push(fn); return queue.length - 1; };
const h2 = out.monteCarloProgressive(baseCfg, {
  nPaths: 100, batchSize: 10,
  onProgress: function(){ cancelProgress++; },
  onComplete: function(){ cancelDone = true; }
});
// Cancel BEFORE we drain the queue — the very first tick should see the flag.
h2.cancel();
// Drain whatever was queued. Each tick may push another setTimeout for the
// next batch; with the cancel flag set, the first tick should bail and not
// re-queue. So one drain pass is enough.
while(queue.length){ const fn = queue.shift(); fn(); }
global.setTimeout = realSetTimeout;

check(h2.isCancelled() === true, `isCancelled() === true after cancel()`);
check(cancelDone === false, `onComplete is NOT fired after cancel`);
check(cancelProgress === 0, `onProgress is NOT fired after pre-tick cancel (got ${cancelProgress})`);

console.log(`\n═══ SUMMARY ═══\nPassed: ${passed}\nFailed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
