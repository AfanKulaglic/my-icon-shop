import { create } from "zustand";

const SIDES = ["front", "back", "sleeves"];
const emptyMap = () => Object.fromEntries(SIDES.map((s) => [s, null]));

export const useEditorStore = create((set, get) => ({
  // Which side of the shirt we're decorating
  selectedSide: "front", // "front" | "back" | "sleeves"
  setSide: (side) => set({ selectedSide: side }),

  // Shirt color (applied as 3D material color)
  shirtColor: "#ffffff",
  setShirtColor: (shirtColor) => set({ shirtColor }),

  // Per-side rasterized PNG data URLs (the Fabric canvas output).
  // The 3D shader composites all three into the diffuse simultaneously.
  textureURLs: emptyMap(),
  setTextureURL: (side, url) =>
    set((state) => ({
      textureURLs: { ...state.textureURLs, [side]: url },
    })),

  // Per-side Fabric JSON snapshots — used to restore the canvas when
  // the user switches tabs.
  designs: emptyMap(),
  setDesign: (side, json) =>
    set((state) => ({ designs: { ...state.designs, [side]: json } })),

  // Currently selected fabric object (for right panel controls)
  selectedObjectId: null,
  setSelectedObjectId: (id) => set({ selectedObjectId: id }),

  // Bumped whenever any side updates — used to invalidate Three.js texture
  textureVersion: 0,
  bumpTexture: () => set({ textureVersion: get().textureVersion + 1 }),

  // ShirtCanvas registers a function that returns the composed diffuse
  // texture (base PBR diffuse + every side's design baked in) as a
  // PNG data URL. Used by the "Save" / "Export package" flow.
  getComposedDiffuse: null,
  setComposedDiffuseGetter: (fn) => set({ getComposedDiffuse: fn }),

  // Debug overlay (legacy from UV-rect era — kept as no-op so existing
  // hotkeys/buttons don't crash, but it has no visible effect now that
  // print zones are decals on the 3D model).
  debugZones: false,
  toggleDebugZones: () => set((s) => ({ debugZones: !s.debugZones })),

  // /mash registers a callback here so that clicking on the 3D shirt
  // can reposition the active side's decal anchor. Payload is
  // `{ point: [x,y,z], normal: [x,y,z] }` in mesh-local space.
  dropDecal: null,
  setDropDecalHandler: (fn) => set({ dropDecal: fn }),

  // Clears all per-product state when switching to a different product
  reset: () => set({
    selectedSide: "front",
    shirtColor: "#ffffff",
    textureURLs: emptyMap(),
    designs: emptyMap(),
    selectedObjectId: null,
    textureVersion: 0,
    getComposedDiffuse: null,
    dropDecal: null,
  }),
}));
