import fs from 'node:fs';
import path from 'node:path';

function parseEnvValue(rawValue) {
  const trimmed = rawValue.trim();
  if (!trimmed) return '';

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const equalsIndex = line.indexOf('=');
    if (equalsIndex <= 0) continue;

    const key = line.slice(0, equalsIndex).trim();
    const rawValue = line.slice(equalsIndex + 1);
    if (!key) continue;

    if (typeof process.env[key] === 'undefined') {
      process.env[key] = parseEnvValue(rawValue);
    }
  }
}

export function loadProjectEnv(rootDir) {
  loadEnvFile(path.join(rootDir, '.env'));
  loadEnvFile(path.join(rootDir, '.env.local'));
}
