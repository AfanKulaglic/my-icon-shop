// Registry of 3D models that ship in /public/models.
// To add a new model: drop a folder in /public/models/<slug>/ with
// base.obj + texture_diffuse|normal|roughness|metallic.png, then
// register it here.
//
// PRINT ZONES — DECAL MODEL
// -------------------------
// Print zones are stored as 3D **decal anchors** that live on the mesh
// surface (NOT as UV-rectangles). This means each side's design is a
// THREE.DecalGeometry projected onto the mesh, so it works regardless
// of how the OBJ is unwrapped — including chaotic AI-generated meshes.
//
// Each side has a **seed** specifying where the decal should default to:
//   { axis: '+x'|'-x'|'+y'|'-y'|'+z'|'-z',
//     uv:   [0..1, 0..1],   // position on the chosen bbox face
//     size: [0..1, 0..1],   // fraction of bbox extents
//     rotation: number }    // radians around the surface normal
//
// At load time, ShirtCanvas raycasts from the bbox face into the mesh
// to resolve a concrete `{ point, normal }` for each side. The user
// can then click anywhere on the 3D shirt in /mash to override the
// resolved point/normal directly. Saved overrides are stored in
// localStorage and applied on top of the seeds.

export const models = {
  "man-polo-shirt": {
    id: "man-polo-shirt",
    label: "Men's Polo",
    obj: "/models/man-polo-shirt/base.obj",
    maps: {
      // No textures - using default cotton material (same as women's polo)
    },
    printDecals: {
      front:   { axis: "+z", uv: [0.5, 0.45], size: [0.35, 0.45], rotation: 0 },
      back:    { axis: "-z", uv: [0.5, 0.45], size: [0.35, 0.45], rotation: 0 },
      sleeves: { axis: "+x", uv: [0.55, 0.78], size: [0.18, 0.22], rotation: 0 },
    },
    cameraZ: 2.6,
  },
  "women-polo-shirt": {
    id: "women-polo-shirt",
    label: "Women's Polo",
    obj: "/models/women-polo-shirt/base.obj",
    maps: {
      // No textures - using default cotton material
    },
    printDecals: {
      front:   { axis: "+z", uv: [0.5, 0.45], size: [0.30, 0.40], rotation: 0 },
      back:    { axis: "-z", uv: [0.5, 0.45], size: [0.30, 0.40], rotation: 0 },
      sleeves: { axis: "+x", uv: [0.55, 0.78], size: [0.16, 0.22], rotation: 0 },
    },
    cameraZ: 2.6,
  },
  "man-hoodie": {
    id: "man-hoodie",
    label: "Men's Hoodie",
    obj: "/models/man-hoodie/base.obj",
    maps: {
      // No textures - using default cotton material
    },
    printDecals: {
      front:   { axis: "+z", uv: [0.5, 0.50], size: [0.35, 0.45], rotation: 0 },
      back:    { axis: "-z", uv: [0.5, 0.50], size: [0.35, 0.45], rotation: 0 },
      sleeves: { axis: "+x", uv: [0.55, 0.75], size: [0.18, 0.22], rotation: 0 },
    },
    cameraZ: 2.8,
  },
  "man-tshirt": {
    id: "man-tshirt",
    label: "Men's T-Shirt",
    obj: "/models/man-tshirt/base.obj",
    maps: {
      // No textures - using default cotton material
    },
    printDecals: {
      front:   { axis: "+z", uv: [0.5, 0.45], size: [0.35, 0.45], rotation: 0 },
      back:    { axis: "-z", uv: [0.5, 0.45], size: [0.35, 0.45], rotation: 0 },
      sleeves: { axis: "+x", uv: [0.55, 0.78], size: [0.18, 0.22], rotation: 0 },
    },
    cameraZ: 2.6,
  },
  "women-tshirt": {
    id: "women-tshirt",
    label: "Women's T-Shirt",
    obj: "/models/women-tshirt/base.obj",
    maps: {
      // No textures - using default cotton material
    },
    printDecals: {
      front:   { axis: "+z", uv: [0.5, 0.45], size: [0.30, 0.40], rotation: 0 },
      back:    { axis: "-z", uv: [0.5, 0.45], size: [0.30, 0.40], rotation: 0 },
      sleeves: { axis: "+x", uv: [0.55, 0.78], size: [0.16, 0.20], rotation: 0 },
    },
    cameraZ: 2.6,
  },
  "baseball-cap": {
    id: "baseball-cap",
    label: "Baseball Cap",
    obj: "/models/baseball-cap/base.obj",
    maps: {
      // No textures - using default cotton material
    },
    printDecals: {
      front:   { axis: "+z", uv: [0.5, 0.50], size: [0.40, 0.30], rotation: 0 },
    },
    cameraZ: 2.2,
  },
  "bag": {
    id: "bag",
    label: "Tote Bag",
    obj: "/models/bag/base.obj",
    maps: {
      diffuse: "/models/bag/texture_diffuse.jpg",
    },
    printDecals: {
      front:   { axis: "+z", uv: [0.5, 0.50], size: [0.45, 0.50], rotation: 0 },
      back:    { axis: "-z", uv: [0.5, 0.50], size: [0.45, 0.50], rotation: 0 },
    },
    cameraZ: 2.6,
  },
};

export const getModel = (id) => models[id] || models["man-polo-shirt"];

export const SIDES = ["front", "back", "sleeves"];

// ---------------------------------------------------------------------------
// Decal overrides (persisted to Firebase by the /mash editor).
// `getModel(id)` always returns the *base* model with seed defaults.
// Components that want the user's tweaks should call
// `getModelWithOverrides(id)`.
//
// An override entry can store either:
//   - a fully-resolved decal: { point:[x,y,z], normal:[x,y,z], size:[w,h], rotation }
//   - or a partial: any subset of those fields, merged on top of the seed
// ---------------------------------------------------------------------------
import { getFirebaseDatabase } from "../firebase/config.js";
import { ref, set, get, remove } from "firebase/database";

const OVERRIDE_KEY = "myicon:printDecals";
// Legacy key from the UV-rect era — auto-cleared on first load so old
// `printAreas` rectangles don't leak into the new decal pipeline.
const LEGACY_KEY = "myicon:printAreas";

if (typeof localStorage !== "undefined") {
  try {
    if (localStorage.getItem(LEGACY_KEY)) localStorage.removeItem(LEGACY_KEY);
  } catch {
    /* noop */
  }
}

// Load overrides from Firebase
export async function loadOverrides() {
  try {
    const db = getFirebaseDatabase();
    const overridesRef = ref(db, 'printDecals');
    const snapshot = await get(overridesRef);
    
    if (snapshot.exists()) {
      return snapshot.val() || {};
    }
    
    // Fallback to localStorage for migration
    const localData = localStorage.getItem(OVERRIDE_KEY);
    if (localData) {
      const parsed = JSON.parse(localData);
      // Migrate to Firebase
      await saveOverrides(parsed);
      // Clear localStorage after migration
      localStorage.removeItem(OVERRIDE_KEY);
      return parsed;
    }
    
    return {};
  } catch (error) {
    console.error("Error loading overrides from Firebase:", error);
    // Fallback to localStorage
    try {
      return JSON.parse(localStorage.getItem(OVERRIDE_KEY) || "{}") || {};
    } catch {
      return {};
    }
  }
}

// Save overrides to Firebase
export async function saveOverrides(map) {
  try {
    const db = getFirebaseDatabase();
    const overridesRef = ref(db, 'printDecals');
    await set(overridesRef, map);
    
    // Also save to localStorage as backup
    localStorage.setItem(OVERRIDE_KEY, JSON.stringify(map));
    
    // Notify listeners
    window.dispatchEvent(new Event("printdecals:changed"));
    window.dispatchEvent(new Event("printareas:changed"));
  } catch (error) {
    console.error("Error saving overrides to Firebase:", error);
    // Fallback to localStorage only
    localStorage.setItem(OVERRIDE_KEY, JSON.stringify(map));
    window.dispatchEvent(new Event("printdecals:changed"));
    window.dispatchEvent(new Event("printareas:changed"));
  }
}

export async function setModelOverride(id, printDecals) {
  const all = await loadOverrides();
  all[id] = printDecals;
  await saveOverrides(all);
}

export async function setSideOverride(id, side, patch) {
  const all = await loadOverrides();
  all[id] = { ...(all[id] || {}), [side]: { ...(all[id]?.[side] || {}), ...patch } };
  await saveOverrides(all);
}

export async function clearModelOverride(id) {
  const all = await loadOverrides();
  delete all[id];
  await saveOverrides(all);
}

export function getModelWithOverrides(id, overrides = {}) {
  const base = getModel(id);
  const override = overrides[base.id];
  if (!override) return base;
  const merged = { ...base.printDecals };
  for (const side of SIDES) {
    if (override[side]) merged[side] = { ...(merged[side] || {}), ...override[side] };
  }
  return { ...base, printDecals: merged };
}

export const listModels = () => Object.values(models);

// ---------------------------------------------------------------------------
// Camera defaults — persisted per-model to Firebase at `cameraDefaults/<id>`.
// Stored as { position: [x,y,z], target: [x,y,z] } (target is usually [0,0,0]).
// ---------------------------------------------------------------------------
const CAMERA_DEFAULTS_PATH = "cameraDefaults";

export async function loadCameraOverride(id) {
  try {
    const db = getFirebaseDatabase();
    const snap = await get(ref(db, `${CAMERA_DEFAULTS_PATH}/${id}`));
    return snap.exists() ? snap.val() : null;
  } catch {
    return null;
  }
}

export async function saveCameraOverride(id, position, target = [0, 0, 0]) {
  try {
    const db = getFirebaseDatabase();
    await set(ref(db, `${CAMERA_DEFAULTS_PATH}/${id}`), { position, target });
  } catch (err) {
    console.error("saveCameraOverride:", err);
  }
}

export async function clearCameraOverride(id) {
  try {
    const db = getFirebaseDatabase();
    await remove(ref(db, `${CAMERA_DEFAULTS_PATH}/${id}`));
  } catch (err) {
    console.error("clearCameraOverride:", err);
  }
}
