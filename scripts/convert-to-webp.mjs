import sharp from 'sharp';
import { existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = resolve(__dirname, '../src/assets');

const targets = [
  'project-1.jpg',
  'project-2.jpg',
  'project-3.jpg',
  'project-4.jpg',
  'formBg.jpg',
];

for (const file of targets) {
  const input = resolve(assetsDir, file);
  const output = resolve(assetsDir, file.replace(/\.jpg$/i, '.webp'));

  if (!existsSync(input)) {
    console.warn(`SKIP: ${file} not found`);
    continue;
  }

  const { size: before } = await import('fs').then(fs => fs.promises.stat(input));
  await sharp(input).webp({ quality: 82 }).toFile(output);
  const { size: after } = await import('fs').then(fs => fs.promises.stat(output));

  const saved = (((before - after) / before) * 100).toFixed(1);
  console.log(`✓ ${file} → ${file.replace('.jpg', '.webp')}  ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB  (-${saved}%)`);
}
