import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { handleContactRequest } from './contact-core.mjs';
import { loadProjectEnv } from './load-env.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');

loadProjectEnv(path.resolve(__dirname, '..'));

const port = Number.parseInt(process.env.PORT || '5500', 10);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

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

function applyCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
}

function isWithinDist(filePath) {
  const normalizedDist = path.normalize(distDir + path.sep);
  const normalizedPath = path.normalize(filePath);
  return normalizedPath.startsWith(normalizedDist);
}

async function tryServeStatic(req, res) {
  const requestUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(requestUrl.pathname);

  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  const sanitizedPath = pathname.replace(/^\/+/, '');
  let filePath = path.resolve(distDir, sanitizedPath);
  if (!isWithinDist(filePath)) {
    return false;
  }

  try {
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    const content = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    res.statusCode = 200;
    res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
    res.end(content);
    return true;
  } catch {
    // fall through to SPA fallback
  }

  try {
    const html = await fs.readFile(path.join(distDir, 'index.html'));
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(html);
    return true;
  } catch {
    return false;
  }
}

const server = http.createServer(async (req, res) => {
  applyCors(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  if (req.url?.startsWith('/api/contact')) {
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
      console.error('[static-contact-server] unexpected contact error', error);
      return writeJson(res, 500, {
        ok: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: "Serverda noma'lum xatolik",
        },
      });
    }
  }

  const served = await tryServeStatic(req, res);
  if (!served) {
    writeJson(res, 404, {
      ok: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Not found',
      },
    });
  }
});

server.listen(port, () => {
  console.log(`[static-contact-server] listening on http://localhost:${port}`);
});
