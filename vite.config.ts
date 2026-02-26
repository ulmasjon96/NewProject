import type { IncomingMessage, ServerResponse } from 'node:http';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import reactSWC from '@vitejs/plugin-react-swc';
import path from 'path';

import { handleContactRequest } from './server/contact-core.mjs';

function writeJson(res: ServerResponse, statusCode: number, body: unknown, headers: Record<string, string> = {}) {
  res.statusCode = statusCode;
  for (const [key, value] of Object.entries(headers)) {
    res.setHeader(key, value);
  }
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function readBody(req: IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    req.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function resolveIp(req: IncomingMessage) {
  const forwarded = req.headers['x-forwarded-for'];
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].split(',')[0].trim();
  }
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

function normalizeBasePath(value: string | undefined, mode: string) {
  const trimmed = (value || '').trim();

  if (!trimmed) {
    return mode === 'production' ? './' : '/';
  }

  if (trimmed === '.' || trimmed === './') return './';
  if (trimmed === '/') return '/';
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('//')) {
    return trimmed.endsWith('/') ? trimmed : `${trimmed}/`;
  }

  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
}

function contactDevApiPlugin(mode: string): Plugin {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    name: 'contact-dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/contact', async (req, res) => {
        try {
          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.end();
            return;
          }

          const rawBody = await readBody(req);
          const result = await handleContactRequest({
            method: req.method || 'GET',
            headers: req.headers,
            body: rawBody,
            env: {
              ...env,
              NODE_ENV: mode,
            },
            ip: resolveIp(req),
            logger: console,
          });

          writeJson(res, result.status, result.body, result.headers);
        } catch (error) {
          console.error('[contact-dev-api] unexpected error', error);
          writeJson(res, 500, {
            ok: false,
            error: {
              code: 'INTERNAL_SERVER_ERROR',
              message: "Serverda noma'lum xatolik",
            },
          });
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const basePath = normalizeBasePath(env.VITE_BASE_PATH, mode);

  return {
    base: basePath,
    server: {
      host: '::',
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [
      mode === 'development' ? reactSWC() : react(),
      mode === 'development' && contactDevApiPlugin(mode),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      minify: 'esbuild',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            motion: ['framer-motion'],
            i18n: ['i18next', 'react-i18next'],
            icons: ['lucide-react'],
            forms: ['react-hook-form'],
            radix: [
              '@radix-ui/react-dialog',
              '@radix-ui/react-tooltip',
              '@radix-ui/react-toast',
              '@radix-ui/react-popover',
              '@radix-ui/react-dropdown-menu',
            ],
          },
        },
      },
    },
  };
});
