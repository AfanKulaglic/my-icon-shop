// Find UV islands in an OBJ and report their bounding boxes (in 0..1 UV space).
// Usage: node scripts/analyze-uvs.js public/models/man-polo-shirt/base.obj
import fs from "node:fs";

const path = process.argv[2];
const text = fs.readFileSync(path, "utf8");

const uvs = []; // 1-based array
uvs.push(null);
const faces = []; // each face = [uvIdx, uvIdx, uvIdx, ...]

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
    if (verts.length >= 3) faces.push(verts);
  }
}

console.error(`uvs=${uvs.length - 1} faces=${faces.length}`);

// Union-Find over UV indices, joining indices that share a face.
const parent = new Array(uvs.length);
for (let i = 0; i < parent.length; i++) parent[i] = i;
const find = (x) => {
  while (parent[x] !== x) {
    parent[x] = parent[parent[x]];
    x = parent[x];
  }
  return x;
};
const union = (a, b) => {
  const ra = find(a),
    rb = find(b);
  if (ra !== rb) parent[ra] = rb;
};

for (const f of faces) {
  for (let i = 1; i < f.length; i++) union(f[0], f[i]);
}

// Group UV indices by root
const islands = new Map();
for (let i = 1; i < uvs.length; i++) {
  const r = find(i);
  let g = islands.get(r);
  if (!g) {
    g = { count: 0, minU: 1, maxU: 0, minV: 1, maxV: 0 };
    islands.set(r, g);
  }
  const [u, v] = uvs[i];
  g.count++;
  if (u < g.minU) g.minU = u;
  if (u > g.maxU) g.maxU = u;
  if (v < g.minV) g.minV = v;
  if (v > g.maxV) g.maxV = v;
}

const arr = [...islands.values()]
  .filter((i) => i.count >= 50)
  .sort((a, b) => b.count - a.count);

console.log("Top UV islands (by vertex count):");
for (const i of arr.slice(0, 12)) {
  const w = i.maxU - i.minU;
  const h = i.maxV - i.minV;
  console.log(
    `  count=${i.count.toString().padStart(6)}  u=[${i.minU.toFixed(3)}..${i.maxU.toFixed(3)}] v=[${i.minV.toFixed(3)}..${i.maxV.toFixed(3)}]  w=${w.toFixed(3)} h=${h.toFixed(3)}  cx=${((i.minU + i.maxU) / 2).toFixed(3)} cy=${((i.minV + i.maxV) / 2).toFixed(3)}`
  );
}
