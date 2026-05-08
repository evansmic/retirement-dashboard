import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { createReadStream, existsSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const legacyMime = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json'
};

function legacyStaticMiddleware() {
  const repoRoot = dirname(fileURLToPath(import.meta.url));
  return (req, res, next) => {
    const pathname = (req.url || '').split('?')[0];
    const legacyPath =
      pathname === '/retirement_dashboard.html' || pathname === '/retirement_dashboard'
        ? join(repoRoot, 'retirement_dashboard.html')
        : pathname === '/stable-intake.html'
          ? join(repoRoot, 'index.html')
          : pathname.startsWith('/engine/')
            ? join(repoRoot, pathname.slice(1))
            : '';

    if (!legacyPath || !existsSync(legacyPath)) {
      next();
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', legacyMime[extname(legacyPath)] || 'application/octet-stream');
    createReadStream(legacyPath).pipe(res);
  };
}

export default defineConfig({
  root: 'app',
  plugins: [
    react(),
    {
      name: 'legacy-static-fallback',
      configureServer(server) {
        server.middlewares.use(legacyStaticMiddleware());
      },
      configurePreviewServer(server) {
        server.middlewares.use(legacyStaticMiddleware());
      }
    }
  ],
  preview: {
    host: '127.0.0.1'
  },
  build: {
    outDir: '../dist/react-app',
    emptyOutDir: true
  },
  test: {
    environment: 'node',
    globals: true,
    pool: 'vmForks',
    poolOptions: {
      vmForks: {
        singleFork: true
      }
    }
  }
});
