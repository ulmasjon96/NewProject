import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { handleContactRequest } from './contact-core.mjs';
import { loadProjectEnv } from './load-env.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

loadProjectEnv(projectRoot);

const port = Number.parseInt(process.env.PORT || '8787', 10);
const corsRaw = String(process.env.CORS_ORIGIN || '*')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

const allowAnyOrigin = corsRaw.length === 0 || corsRaw.includes('*');
const allowedOrigins = new Set(corsRaw);

function getRequestOrigin(req) {
  const origin = req.headers.origin;
  return typeof origin === 'string' ? origin : '';
}

function applyCors(req, res) {
  const origin = getRequestOrigin(req);
  if (allowAnyOrigin) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (origin && allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400');
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function resolveIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].split(',')[0].trim();
  }
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

function writeJson(res, statusCode, body, headers = {}) {
  res.statusCode = statusCode;
  for (const [key, value] of Object.entries(headers)) {
    res.setHeader(key, value);
  }
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

const server = http.createServer(async (req, res) => {
  applyCors(req, res);

  if (req.url === '/health') {
    return writeJson(res, 200, { ok: true });
  }

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  if (req.url !== '/api/contact') {
    return writeJson(res, 404, {
      ok: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Not found',
      },
    });
  }

  try {
    const rawBody = await readBody(req);
    const result = await handleContactRequest({
      method: req.method || 'GET',
      headers: req.headers,
      body: rawBody,
      env: process.env,
      ip: resolveIp(req),
      logger: console,
    });

    return writeJson(res, result.status, result.body, result.headers);
  } catch (error) {
    console.error('[contact-api-server] unexpected error', error);
    return writeJson(res, 500, {
      ok: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: "Serverda noma'lum xatolik",
      },
    });
  }
});

server.listen(port, () => {
  console.log(`[contact-api-server] listening on http://localhost:${port}`);
});
