// Rasterize an OBJ's UV layout to a PNG mask (white = mesh exists at that UV).
// Then suggest a maximal "safe" axis-aligned rectangle inside each big island.
//
// Usage: node scripts/uv-coverage.js public/models/man-polo-shirt/base.obj public/models/man-polo-shirt/uv-coverage.png
import fs from "node:fs";
import { PNG } from "pngjs";

const inObj = process.argv[2];
const outPng = process.argv[3];

const SIZE = 1024;
const text = fs.readFileSync(inObj, "utf8");

const uvs = [null];
const faces = [];
for (const line of text.split(/\r?\n/)) {
  if (line.startsWith("vt ")) {
    const p = line.split(/\s+/);
    uvs.push([+p[1], +p[2]]);
  } else if (line.startsWith("f ")) {
    const verts = line
      .slice(2)
      .trim()
      .split(/\s+/)
      .map((v) => {
        const parts = v.split("/");
        return parts[1] ? +parts[1] : 0;
      })
      .filter(Boolean);
    if (verts.length >= 3) {
      // Triangulate fan
      for (let i = 1; i < verts.length - 1; i++) {
        faces.push([verts[0], verts[i], verts[i + 1]]);
      }
    }
  }
}

console.error(`uvs=${uvs.length - 1} triangles=${faces.length}`);

const png = new PNG({ width: SIZE, height: SIZE });
// Fill black (no coverage)
png.data.fill(0);
for (let i = 3; i < png.data.length; i += 4) png.data[i] = 255; // alpha

// Rasterise each triangle in canvas coords (flipY: canvas_y = 1 - uv_v)
function setPixel(x, y) {
  if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) return;
  const idx = (y * SIZE + x) << 2;
  png.data[idx] = 255;
  png.data[idx + 1] = 255;
  png.data[idx + 2] = 255;
}

function rasterTri(x0, y0, x1, y1, x2, y2) {
  const minX = Math.max(0, Math.floor(Math.min(x0, x1, x2)));
  const maxX = Math.min(SIZE - 1, Math.ceil(Math.max(x0, x1, x2)));
  const minY = Math.max(0, Math.floor(Math.min(y0, y1, y2)));
  const maxY = Math.min(SIZE - 1, Math.ceil(Math.max(y0, y1, y2)));
  const denom = (y1 - y2) * (x0 - x2) + (x2 - x1) * (y0 - y2);
  if (denom === 0) return;
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const a = ((y1 - y2) * (x - x2) + (x2 - x1) * (y - y2)) / denom;
      const b = ((y2 - y0) * (x - x2) + (x0 - x2) * (y - y2)) / denom;
      const c = 1 - a - b;
      if (a >= 0 && b >= 0 && c >= 0) setPixel(x, y);
    }
  }
}

for (const [a, b, c] of faces) {
  const ua = uvs[a],
    ub = uvs[b],
    uc = uvs[c];
  if (!ua || !ub || !uc) continue;
  rasterTri(
    ua[0] * SIZE,
    (1 - ua[1]) * SIZE,
    ub[0] * SIZE,
    (1 - ub[1]) * SIZE,
    uc[0] * SIZE,
    (1 - uc[1]) * SIZE
  );
}

png.pack().pipe(fs.createWriteStream(outPng));
console.error(`wrote ${outPng}`);

// Find largest axis-aligned all-white rect using a 2D row-histogram method.
// We do this for the top-N largest connected white components first, but
// for our simple use-case we just compute it globally per quadrant of
// the canvas (front/back/sleeves typically split that way).
// Build a binary mask first.
const mask = new Uint8Array(SIZE * SIZE);
for (let i = 0; i < SIZE * SIZE; i++) mask[i] = png.data[i << 2] > 0 ? 1 : 0;

function maxRectInRegion(x0, y0, x1, y1) {
  // Largest all-1 rectangle inside [x0..x1) × [y0..y1) using histogram-stack.
  const w = x1 - x0;
  const heights = new Int32Array(w);
  let best = { area: 0 };
  for (let y = y0; y < y1; y++) {
    for (let x = 0; x < w; x++) {
      heights[x] = mask[y * SIZE + (x0 + x)] ? heights[x] + 1 : 0;
    }
    // Largest rect in histogram
    const stack = [];
    for (let x = 0; x <= w; x++) {
      const h = x === w ? 0 : heights[x];
      while (stack.length && heights[stack[stack.length - 1]] > h) {
        const top = stack.pop();
        const left = stack.length ? stack[stack.length - 1] + 1 : 0;
        const right = x - 1;
        const height = heights[top];
        const width = right - left + 1;
        const area = height * width;
        if (area > best.area) {
          best = {
            area,
            x: x0 + left,
            y: y - height + 1,
            w: width,
            h: height,
          };
        }
      }
      stack.push(x);
    }
  }
  return best;
}

// Heuristic regions matching our printArea convention
// (left half = back, right half = front, sleeve area = left-bottom).
const regions = {
  // u in [0..0.378], canvas y in [0.495..1] (back torso)
  back: maxRectInRegion(0, Math.floor(0.495 * SIZE), Math.ceil(0.378 * SIZE), SIZE),
  // u in [0.378..0.694], canvas y in [0.495..1] (front torso)
  front: maxRectInRegion(
    Math.floor(0.378 * SIZE),
    Math.floor(0.495 * SIZE),
    Math.ceil(0.694 * SIZE),
    SIZE
  ),
  // sleeves area
  sleeves: maxRectInRegion(
    Math.floor(0.45 * SIZE),
    Math.floor(0.22 * SIZE),
    Math.ceil(0.69 * SIZE),
    Math.floor(0.51 * SIZE)
  ),
};

console.log("\nLargest mesh-covered rectangles (in 0..1 canvas coords):");
for (const [name, r] of Object.entries(regions)) {
  if (!r.area) {
    console.log(`  ${name}: <none found>`);
    continue;
  }
  const x = (r.x / SIZE).toFixed(3);
  const y = (r.y / SIZE).toFixed(3);
  const w = (r.w / SIZE).toFixed(3);
  const h = (r.h / SIZE).toFixed(3);
  console.log(`  ${name}: { x: ${x}, y: ${y}, w: ${w}, h: ${h} }`);
}
