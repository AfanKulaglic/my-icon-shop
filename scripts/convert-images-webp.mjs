import sharp from 'sharp';
import { readFileSync, unlinkSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const base = join(dirname(fileURLToPath(import.meta.url)), '../public');

const files = [
  'images/logo.png',
  'images/featured-couple.png',
  'models/man-polo-shirt/main.jpg',
  'models/women-polo-shirt/main.jpg',
  'models/man-hoodie/main.jpg',
  'models/man-tshirt/main.jpg',
  'models/women-tshirt/main.jpg',
  'models/baseball-cap/main.jpg',
  'models/bag/main.jpg',
];

for (const f of files) {
  const src = join(base, f);
  const dest = src.replace(/\.(jpg|png)$/i, '.webp');
  if (!existsSync(src)) { console.log('SKIP (not found):', f); continue; }
  const before = (readFileSync(src).length / 1024).toFixed(0);
  await sharp(src).webp({ quality: 82 }).toFile(dest);
  const after = (readFileSync(dest).length / 1024).toFixed(0);
  console.log(`✓ ${f}: ${before} KB → ${after} KB`);
  unlinkSync(src);
}
console.log('\nDone. Update code references from .jpg/.png → .webp');
