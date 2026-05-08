// React preview / stable-surface route probe.
//
// The Vite React app is rooted in app/, while the stable intake/dashboard live
// at the repo root. This probe prevents the dev/preview server from falling
// back to the React create-plan shell when users click stable-dashboard links.
const path = require('path');

let passed = 0;
let failed = 0;

function check(cond, label) {
  if (cond) {
    passed++;
    console.log('  ✓ ' + label);
  } else {
    failed++;
    console.log('  ✗ ' + label);
  }
}

async function text(url) {
  const response = await fetch(url);
  return {
    status: response.status,
    body: await response.text()
  };
}

(async () => {
  console.log('\n═══ React legacy route handoff ═══');

  let server;
  try {
    const { createServer } = await import('vite');
    server = await createServer({
      configFile: path.join(__dirname, '..', 'vite.config.mjs'),
      logLevel: 'silent',
      server: {
        host: '127.0.0.1',
        port: 0
      }
    });
    await server.listen();
    const base = server.resolvedUrls.local[0].replace(/\/$/, '');

    const dashboard = await text(`${base}/retirement_dashboard.html`);
    check(dashboard.status === 200, 'serves /retirement_dashboard.html');
    check(dashboard.body.includes('<title>Retirement Planning Dashboard</title>'), 'dashboard route returns stable dashboard HTML');
    check(!dashboard.body.includes('/src/main.tsx'), 'dashboard route does not return React app shell');

    const dashboardAlias = await text(`${base}/retirement_dashboard`);
    check(dashboardAlias.status === 200, 'serves extensionless /retirement_dashboard alias');
    check(dashboardAlias.body.includes('<title>Retirement Planning Dashboard</title>'), 'extensionless dashboard alias returns stable dashboard');

    const intake = await text(`${base}/stable-intake.html`);
    check(intake.status === 200, 'serves /stable-intake.html');
    check(intake.body.includes("retirement_dashboard.html#' + encoded"), 'stable intake submits to retirement_dashboard.html hash');
    check(!intake.body.includes('retirement_dashboard#'), 'stable intake has no extensionless dashboard hash handoff');

    const helper = await text(`${base}/engine/tax_benefit_helpers.js`);
    check(helper.status === 200, 'serves legacy engine helper');
    check(helper.body.includes('function') || helper.body.includes('export'), 'engine helper returns JavaScript content');

    // Give Vite's dependency scanner a moment to settle before closing the
    // ephemeral server, otherwise esbuild may report a harmless cancellation.
    await new Promise((resolve) => setTimeout(resolve, 100));
  } catch (err) {
    failed++;
    console.error('  ✗ route probe crashed:', err instanceof Error ? err.message : err);
  } finally {
    if (server) await server.close();
  }

  console.log(`\n═══ SUMMARY ═══\nPassed: ${passed}\nFailed: ${failed}`);
  if (failed) process.exit(1);
})();
