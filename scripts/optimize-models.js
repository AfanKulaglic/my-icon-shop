// Re-encodes all GLB models from Draco → EXT_meshopt_compression.
// Meshopt decoder is ~20KB pure JS (bundled in three.js) vs Draco's 500KB WASM
// from a CDN — much faster to initialize on mobile CPUs.
//
// Models are already simplified (10% triangles from a previous run).
// This pass only re-encodes: dedup + reorder (cache locality) + quantize + meshopt.
//
// Run: node scripts/optimize-models.js

import { NodeIO } from "@gltf-transform/core";
import { KHRDracoMeshCompression, EXTMeshoptCompression } from "@gltf-transform/extensions";
import { dedup, reorder, quantize } from "@gltf-transform/functions";
import { MeshoptEncoder, MeshoptDecoder } from "meshoptimizer";
import { createRequire } from "module";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const draco3d = require("draco3d");

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

await MeshoptEncoder.ready;
await MeshoptDecoder.ready;

const decoderModule = await draco3d.createDecoderModule({});
const encoderModule = await draco3d.createEncoderModule({});

// IO that can READ existing Draco-compressed GLBs
const ioRead = new NodeIO()
  .registerExtensions([KHRDracoMeshCompression])
  .registerDependencies({
    "draco3d.decoder": decoderModule,
    "draco3d.encoder": encoderModule,
  });

// IO that WRITES meshopt-compressed GLBs
const ioWrite = new NodeIO()
  .registerExtensions([EXTMeshoptCompression])
  .registerDependencies({
    "meshopt.encoder": MeshoptEncoder,
    "meshopt.decoder": MeshoptDecoder,
  });

for (const slug of slugs) {
  const glbPath = join(modelsDir, slug, "base.glb");
  if (!existsSync(glbPath)) { console.warn(`  SKIP — ${glbPath} not found`); continue; }

  const beforeKB = (readFileSync(glbPath).length / 1024).toFixed(0);
  console.log(`  Re-encoding ${slug} (${beforeKB} KB Draco → meshopt)...`);
  const t = Date.now();

  // Read and Draco-decode
  const document = await ioRead.readBinary(new Uint8Array(readFileSync(glbPath)));

  // Optimize for meshopt: dedup, reorder vertices for cache locality, quantize positions/normals
  await document.transform(
    dedup(),
    reorder({ encoder: MeshoptEncoder }),
    quantize(),
  );

  // Enable meshopt compression on write
  document.createExtension(EXTMeshoptCompression).setRequired(true);

  // Write meshopt-compressed GLB
  const glb = await ioWrite.writeBinary(document);
  writeFileSync(glbPath, Buffer.from(glb));

  const afterKB = (glb.length / 1024).toFixed(0);
  console.log(`  ✓ ${slug}: ${beforeKB} KB (Draco) → ${afterKB} KB (meshopt) [${Date.now()-t}ms]`);
}

console.log("\nDone. Commit public/models/*/base.glb");
