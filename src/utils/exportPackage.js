import JSZip from "jszip";

const dataURLToBlob = async (dataURL) => (await fetch(dataURL)).blob();
const fetchBlob = async (url) => (await fetch(url)).blob();

/**
 * Build a downloadable ZIP that captures the user's edits.
 *
 * Decal model — Phase 1 export:
 *  - base.obj                    geometry (untouched)
 *  - texture_diffuse.{png|jpg}   original mesh texture (untouched)
 *  - texture_normal/roughness/metallic.png  (only those that exist)
 *  - decals/<side>.png           each side's design as a transparent PNG
 *  - decals.json                 manifest with each decal's anchor in
 *                                mesh-local space (point, normal, size,
 *                                rotation) so a downstream baker / printer
 *                                can reproduce the decal projection.
 *  - design.png + design.json    the active Fabric canvas + its JSON
 *  - shirt.mtl                   minimal MTL pointing at the diffuse
 *  - metadata.json               product / model / color
 *
 * Phase 2 (TODO): pre-bake the decals into a single texture_diffuse.png
 * via an offscreen UV-space render pass, so the print shop only needs
 * to look at one PNG.
 */
export async function buildExportPackage({
  product,
  model,
  shirtColor,
  fabricCanvas,
  // composedDiffuseDataURL is kept for API compatibility but ignored in
  // the decal pipeline — it always returns null until the Phase 2 baker
  // is implemented.
  // eslint-disable-next-line no-unused-vars
  composedDiffuseDataURL,
  textureURLs, // { front, back, sleeves } as PNG data URLs
}) {
  const zip = new JSZip();
  const slug = product.id;

  // 1) Geometry
  const objBlob = await fetchBlob(model.obj);
  zip.file(`${slug}/base.obj`, objBlob);

  const hasNormal = !!model.maps?.normal;
  const hasRoughness = !!model.maps?.roughness;
  const hasMetallic = !!model.maps?.metallic;
  const hasDiffuse = !!model.maps?.diffuse;

  // 2) Diffuse + PBR maps copied as-is
  const diffuseExt = hasDiffuse
    ? (model.maps.diffuse.match(/\.([a-z0-9]+)$/i)?.[1] || "png").toLowerCase()
    : "png";
  if (hasDiffuse) {
    zip.file(
      `${slug}/texture_diffuse.${diffuseExt}`,
      await fetchBlob(model.maps.diffuse)
    );
  }
  if (hasNormal) zip.file(`${slug}/texture_normal.png`, await fetchBlob(model.maps.normal));
  if (hasRoughness) zip.file(`${slug}/texture_roughness.png`, await fetchBlob(model.maps.roughness));
  if (hasMetallic) zip.file(`${slug}/texture_metallic.png`, await fetchBlob(model.maps.metallic));

  // 3) Minimal MTL
  const mtl = [
    "newmtl shirt",
    "Ka 1.000 1.000 1.000",
    `Kd ${hexToRGB(shirtColor)}`,
    "Ks 0.000 0.000 0.000",
    "d 1.0",
    "illum 2",
    hasDiffuse ? `map_Kd texture_diffuse.${diffuseExt}` : null,
    hasNormal ? "map_Bump texture_normal.png" : null,
    hasRoughness ? "map_Ns texture_roughness.png" : null,
    "",
  ]
    .filter((l) => l !== null)
    .join("\n");
  zip.file(`${slug}/shirt.mtl`, mtl);

  // 4) Per-side decal PNGs
  const decalsManifest = { sides: {} };
  for (const side of ["front", "back", "sleeves"]) {
    const url = textureURLs?.[side];
    if (url) {
      zip.file(`${slug}/decals/${side}.png`, await dataURLToBlob(url));
    }
    const d = model.printDecals?.[side];
    if (d) {
      decalsManifest.sides[side] = {
        // serialized values only (no THREE.* objects)
        point: Array.isArray(d.point) ? d.point : null,
        normal: Array.isArray(d.normal) ? d.normal : null,
        size: d.size || null,
        rotation: typeof d.rotation === "number" ? d.rotation : 0,
        // seed is kept for fallback if the user never overrode placement
        seed: d.axis ? { axis: d.axis, uv: d.uv } : null,
      };
    }
  }
  zip.file(`${slug}/decals.json`, JSON.stringify(decalsManifest, null, 2));

  // 5) Active Fabric canvas (high-res copy + JSON for re-edit)
  if (fabricCanvas) {
    const designPNG = fabricCanvas.toDataURL({
      format: "png",
      multiplier: 2,
    });
    zip.file(`${slug}/design.png`, await dataURLToBlob(designPNG));
    zip.file(
      `${slug}/design.json`,
      JSON.stringify(fabricCanvas.toJSON(), null, 2)
    );
  }

  // 6) Metadata
  const meta = {
    productId: product.id,
    productName: product.name,
    modelId: model.id,
    shirtColor,
    printDecals: decalsManifest.sides,
    exportedAt: new Date().toISOString(),
    note:
      "Decals are projected onto the mesh surface. To bake into a single texture, run the Phase-2 UV-space render pass over decals/<side>.png + the per-side anchors above.",
  };
  zip.file(`${slug}/metadata.json`, JSON.stringify(meta, null, 2));

  return zip.generateAsync({ type: "blob" });
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function hexToRGB(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return "1.000 1.000 1.000";
  const r = parseInt(m[1], 16) / 255;
  const g = parseInt(m[2], 16) / 255;
  const b = parseInt(m[3], 16) / 255;
  return `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)}`;
}
