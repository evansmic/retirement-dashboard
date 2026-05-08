import { cp, mkdir, copyFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const output = join(root, 'dist', 'react-app');

await mkdir(output, { recursive: true });
await copyFile(join(root, 'retirement_dashboard.html'), join(output, 'retirement_dashboard.html'));
await copyFile(join(root, 'index.html'), join(output, 'stable-intake.html'));
await cp(join(root, 'engine'), join(output, 'engine'), { recursive: true });

console.log('Staged stable dashboard, stable intake, and engine helpers for Vercel React preview.');
