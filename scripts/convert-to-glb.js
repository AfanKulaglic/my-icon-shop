// Converts all OBJ models in /public/models/<slug>/base.obj
// to /public/models/<slug>/base.glb with Draco compression.
// Run once: node scripts/convert-to-glb.js

import { createRequire } from "module";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const obj2gltf = require("obj2gltf");
const gltfPipeline = require("gltf-pipeline");

const __dirname = dirname(fileURLToPath(import.meta.url));
const modelsDir = join(__dirname, "../public/models");

const slugs = [
  "man-polo-shirt",
  "women-polo-shirt",
  "man-hoodie",
  "man-tshirt",
  "women-tshirt",
  "baseball-cap",
  "bag",
];

async function convert(slug) {
  const objPath = join(modelsDir, slug, "base.obj");
  const glbPath = join(modelsDir, slug, "base.glb");

  if (!existsSync(objPath)) {
    console.warn(`  SKIP — ${objPath} not found`);
    return;
  }

  console.log(`  Converting ${slug}...`);
  const startMs = Date.now();

  // Step 1: OBJ → GLTF (as Buffer)
  const glbBuffer = await obj2gltf(objPath, {
    binary: true,
    unlit: false,
  });

  // Step 2: GLTF → compressed GLB with Draco
  const result = await gltfPipeline.processGlb(glbBuffer, {
    dracoOptions: { compressionLevel: 7 },
  });

  writeFileSync(glbPath, result.glb);

  const origMB = (readFileSync(objPath).length / 1024 / 1024).toFixed(1);
  const newMB = (result.glb.length / 1024 / 1024).toFixed(1);
  console.log(`  ✓ ${slug}: ${origMB} MB OBJ → ${newMB} MB GLB (${Math.round((1 - result.glb.length / readFileSync(objPath).length) * 100)}% smaller) [${Date.now() - startMs}ms]`);
}

console.log("Converting OBJ → GLB+Draco...\n");
for (const slug of slugs) {
  await convert(slug);
}
console.log("\nDone.");
