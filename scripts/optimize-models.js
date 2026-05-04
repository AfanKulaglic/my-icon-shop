// Optimizes all GLB models:
//   1. dedup  — remove duplicate accessors/meshes
//   2. weld   — merge nearby vertices (improves simplification quality)
//   3. simplify — reduce to ~10% of triangles using meshoptimizer
//   4. re-compress with Draco at level 10 via gltf-pipeline
//
// Run: node scripts/optimize-models.js
// Expects base.glb files to already exist (run convert-to-glb.js first).

import { NodeIO } from "@gltf-transform/core";
import { KHRDracoMeshCompression } from "@gltf-transform/extensions";
import { dedup, weld, simplify } from "@gltf-transform/functions";
import { MeshoptSimplifier } from "meshoptimizer";
import { createRequire } from "module";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const gltfPipeline = require("gltf-pipeline");
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

await MeshoptSimplifier.ready;

// NodeIO with Draco READ support (to decode the existing compressed GLBs)
const decoderModule = await draco3d.createDecoderModule({});
const encoderModule = await draco3d.createEncoderModule({});
const ioWithDraco = new NodeIO()
  .registerExtensions([KHRDracoMeshCompression])
  .registerDependencies({
    "draco3d.decoder": decoderModule,
    "draco3d.encoder": encoderModule,
  });
// Plain IO used for writing — no Draco, so gltf-pipeline can add it fresh
const ioPlain = new NodeIO();

for (const slug of slugs) {
  const glbPath = join(modelsDir, slug, "base.glb");
  if (!existsSync(glbPath)) { console.warn(`  SKIP — ${glbPath} not found`); continue; }

  const beforeKB = (readFileSync(glbPath).length / 1024).toFixed(0);
  console.log(`  Optimizing ${slug} (${beforeKB} KB)...`);
  const t = Date.now();

  // Load (Draco-decode on read)
  const document = await ioWithDraco.readBinary(new Uint8Array(readFileSync(glbPath)));

  // Count triangles before
  let trisBefore = 0;
  document.getRoot().listMeshes().forEach(mesh =>
    mesh.listPrimitives().forEach(prim => {
      const idx = prim.getIndices();
      trisBefore += idx ? idx.getCount() / 3 : (prim.getAttribute("POSITION")?.getCount() || 0) / 3;
    })
  );

  // Transform: dedup → weld → simplify to 10%
  await document.transform(
    dedup(),
    weld({ tolerance: 1e-4 }),
    simplify({ simplifier: MeshoptSimplifier, ratio: 0.10, error: 0.005 }),
  );

  // Count triangles after
  let trisAfter = 0;
  document.getRoot().listMeshes().forEach(mesh =>
    mesh.listPrimitives().forEach(prim => {
      const idx = prim.getIndices();
      trisAfter += idx ? idx.getCount() / 3 : (prim.getAttribute("POSITION")?.getCount() || 0) / 3;
    })
  );

  // Strip the Draco extension so the plain writer doesn't try to re-encode it
  document.getRoot().listExtensionsUsed().forEach(ext => {
    if (ext.extensionName === 'KHR_draco_mesh_compression') ext.dispose();
  });

  // Write plain (uncompressed) GLB, then gltf-pipeline adds fresh Draco
  const simplified = await ioPlain.writeBinary(document);

  // Re-compress with Draco level 10
  const { glb } = await gltfPipeline.processGlb(Buffer.from(simplified), {
    dracoOptions: { compressionLevel: 10 },
  });

  writeFileSync(glbPath, glb);

  const afterKB = (glb.length / 1024).toFixed(0);
  console.log(`  ✓ ${slug}: ${beforeKB} KB → ${afterKB} KB | triangles: ${Math.round(trisBefore/1000)}k → ${Math.round(trisAfter/1000)}k (${Math.round((1-trisAfter/trisBefore)*100)}% fewer) [${Date.now()-t}ms]`);
}

console.log("\nDone. Commit public/models/*/base.glb");
