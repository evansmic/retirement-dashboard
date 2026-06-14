#!/usr/bin/env node
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const batchSizeArg = Number(process.env.TEST_BATCH_SIZE || process.argv.find((arg) => arg.startsWith('--batch-size='))?.split('=')[1]);
const batchSize = Number.isFinite(batchSizeArg) && batchSizeArg > 0 ? Math.floor(batchSizeArg) : 1;
const timeoutArg = Number(
  process.env.TEST_BATCH_TIMEOUT_MS || process.argv.find((arg) => arg.startsWith('--batch-timeout-ms='))?.split('=')[1]
);
const batchTimeoutMs = Number.isFinite(timeoutArg) && timeoutArg > 0 ? Math.floor(timeoutArg) : 120000;
const testFilePattern = /\.(test|spec)\.(ts|tsx|js|jsx)$/;
const ignoredDirs = new Set(['.git', 'dist', 'node_modules']);

function collectTestFiles(dir) {
  const entries = readdirSync(dir).sort((a, b) => a.localeCompare(b));
  const files = [];
  for (const entry of entries) {
    if (ignoredDirs.has(entry)) continue;
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      files.push(...collectTestFiles(path));
    } else if (testFilePattern.test(entry)) {
      files.push(relative(root, path));
    }
  }
  return files;
}

function chunk(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

const vitestBin = join(root, 'node_modules', '.bin', process.platform === 'win32' ? 'vitest.cmd' : 'vitest');
const testFiles = collectTestFiles(root);
const batches = chunk(testFiles, batchSize);
const failures = [];

console.log(
  `Low-storage full-suite runner: ${testFiles.length} files in ${batches.length} batch(es), batch size ${batchSize}, timeout ${batchTimeoutMs}ms.`
);

for (let index = 0; index < batches.length; index += 1) {
  const batch = batches[index];
  console.log(`\n[${index + 1}/${batches.length}] vitest run ${batch.join(' ')}`);
  const result = spawnSync(vitestBin, ['run', ...batch], {
    cwd: root,
    stdio: 'inherit',
    timeout: batchTimeoutMs,
    env: {
      ...process.env,
      CI: process.env.CI || '1',
      VITEST_POOL_ID: process.env.VITEST_POOL_ID || '1'
    }
  });
  if (result.error || result.status !== 0) {
    failures.push({
      batch: index + 1,
      files: batch,
      status: result.status,
      error: result.error?.message || ''
    });
  }
}

if (failures.length) {
  console.error('\nLow-storage full-suite runner failed.');
  for (const failure of failures) {
    const reason = failure.error ? ` (${failure.error})` : '';
    console.error(`Batch ${failure.batch} exited with ${failure.status}${reason}: ${failure.files.join(', ')}`);
  }
  process.exit(1);
}

console.log('\nLow-storage full-suite runner passed.');
