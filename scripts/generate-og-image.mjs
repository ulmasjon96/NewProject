import sharp from 'sharp';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '../public/preview.png');

const W = 1200;
const H = 630;

// Grid lines
const hLines = Array.from({ length: 10 }, (_, i) =>
  `<line x1="0" y1="${(i + 1) * 57}" x2="${W}" y2="${(i + 1) * 57}" stroke="#0ea5e9" stroke-width="0.6" stroke-opacity="0.07"/>`
).join('');
const vLines = Array.from({ length: 19 }, (_, i) =>
  `<line x1="${(i + 1) * 60}" y1="0" x2="${(i + 1) * 60}" y2="${H}" stroke="#0ea5e9" stroke-width="0.6" stroke-opacity="0.07"/>`
).join('');

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g1" cx="72%" cy="18%" r="55%">
      <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="28%" cy="82%" r="50%">
      <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="sep" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#0ea5e9" stop-opacity="0"/>
      <stop offset="25%"  stop-color="#0ea5e9" stop-opacity="1"/>
      <stop offset="75%"  stop-color="#7c3aed" stop-opacity="1"/>
      <stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="border" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#0ea5e9" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#7c3aed" stop-opacity="0.5"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="softglow" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="#080810"/>
  <rect width="${W}" height="${H}" fill="url(#g1)"/>
  <rect width="${W}" height="${H}" fill="url(#g2)"/>

  <!-- Grid -->
  ${hLines}
  ${vLines}

  <!-- Outer border -->
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}"
        fill="none" stroke="url(#border)" stroke-width="1.5" stroke-opacity="0.5"/>

  <!-- Corner brackets — top-left -->
  <path d="M 4 40 L 4 4 L 40 4" fill="none" stroke="#0ea5e9" stroke-width="2.5" stroke-opacity="0.9"/>
  <!-- top-right -->
  <path d="M ${W - 40} 4 L ${W - 4} 4 L ${W - 4} 40" fill="none" stroke="#0ea5e9" stroke-width="2.5" stroke-opacity="0.9"/>
  <!-- bottom-left -->
  <path d="M 4 ${H - 40} L 4 ${H - 4} L 40 ${H - 4}" fill="none" stroke="#7c3aed" stroke-width="2.5" stroke-opacity="0.9"/>
  <!-- bottom-right -->
  <path d="M ${W - 40} ${H - 4} L ${W - 4} ${H - 4} L ${W - 4} ${H - 40}" fill="none" stroke="#7c3aed" stroke-width="2.5" stroke-opacity="0.9"/>

  <!-- Top accent line -->
  <rect x="120" y="4" width="${W - 240}" height="2" fill="url(#sep)" opacity="0.6"/>
  <!-- Bottom accent line -->
  <rect x="120" y="${H - 6}" width="${W - 240}" height="2" fill="url(#sep)" opacity="0.6"/>

  <!-- Decorative dots top -->
  <circle cx="${W / 2}" cy="50" r="3.5" fill="#0ea5e9" opacity="0.7" filter="url(#softglow)"/>
  <circle cx="${W / 2 - 24}" cy="50" r="2"   fill="#0ea5e9" opacity="0.35"/>
  <circle cx="${W / 2 + 24}" cy="50" r="2"   fill="#0ea5e9" opacity="0.35"/>

  <!-- "PORTFOLIO" label -->
  <text x="${W / 2}" y="105"
        text-anchor="middle"
        font-family="'Courier New', Courier, monospace"
        font-size="16" font-weight="bold"
        fill="#0ea5e9" letter-spacing="8" opacity="0.85">PORTFOLIO</text>

  <!-- Name -->
  <text x="${W / 2}" y="255"
        text-anchor="middle"
        font-family="Arial, Helvetica, sans-serif"
        font-size="74" font-weight="bold"
        fill="#f1f5f9"
        filter="url(#softglow)">Ismatov O&#x2018;lmasjon</text>

  <!-- Role -->
  <text x="${W / 2}" y="342"
        text-anchor="middle"
        font-family="Arial, Helvetica, sans-serif"
        font-size="46" font-weight="600"
        fill="#0ea5e9"
        filter="url(#softglow)">Frontend Developer</text>

  <!-- Separator -->
  <rect x="340" y="375" width="520" height="2" fill="url(#sep)"/>

  <!-- Tech stack -->
  <text x="${W / 2}" y="450"
        text-anchor="middle"
        font-family="Arial, Helvetica, sans-serif"
        font-size="30"
        fill="#94a3b8" letter-spacing="1">React  &#x2022;  TypeScript  &#x2022;  TailwindCSS</text>

  <!-- URL label -->
  <text x="${W / 2}" y="540"
        text-anchor="middle"
        font-family="'Courier New', Courier, monospace"
        font-size="15"
        fill="#475569" letter-spacing="2">ulmasjon96.github.io/MyPortfolio</text>

  <!-- Decorative dots bottom -->
  <circle cx="${W / 2}" cy="588" r="3"   fill="#7c3aed" opacity="0.6" filter="url(#softglow)"/>
  <circle cx="${W / 2 - 22}" cy="588" r="2" fill="#7c3aed" opacity="0.3"/>
  <circle cx="${W / 2 + 22}" cy="588" r="2" fill="#7c3aed" opacity="0.3"/>

  <!-- Side accent lines -->
  <line x1="80" y1="200" x2="80" y2="430" stroke="#0ea5e9" stroke-width="1" stroke-opacity="0.25"/>
  <line x1="${W - 80}" y1="200" x2="${W - 80}" y2="430" stroke="#7c3aed" stroke-width="1" stroke-opacity="0.25"/>
  <circle cx="80" cy="200" r="3" fill="#0ea5e9" opacity="0.5"/>
  <circle cx="80" cy="430" r="3" fill="#0ea5e9" opacity="0.5"/>
  <circle cx="${W - 80}" cy="200" r="3" fill="#7c3aed" opacity="0.5"/>
  <circle cx="${W - 80}" cy="430" r="3" fill="#7c3aed" opacity="0.5"/>
</svg>`;

await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9 })
  .toFile(OUT);

console.log('preview.png created →', OUT);
