import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { useEditorStore } from "../../store/editorStore.js";

/**
 * 2D design canvas, scoped to the currently-selected side of the shirt.
 * - Aspect ratio of the canvas matches the side's UV print rectangle so
 *   what you draw is what prints on the model.
 * - When the user switches side tabs, the current canvas is serialized
 *   into the store's `designs[side]`, and the target side's snapshot
 *   is loaded back in.
 * - Each side also publishes a rasterized PNG into `textureURLs[side]`,
 *   which `ShirtCanvas` composites all together onto the diffuse map.
 */
export default function FabricEditor({ onReady, printDecals }) {
  const wrapRef = useRef(null);
  const elRef = useRef(null);
  const canvasRef = useRef(null);
  const initedRef = useRef(false);

  const selectedSide = useEditorStore((s) => s.selectedSide);
  const sideRef = useRef(selectedSide);
  const designsRef = useRef(useEditorStore.getState().designs);
  const printDecalsRef = useRef(printDecals);

  const setTextureURL = useEditorStore((s) => s.setTextureURL);
  const setDesign = useEditorStore((s) => s.setDesign);
  const bumpTexture = useEditorStore((s) => s.bumpTexture);
  const setSelectedObjectId = useEditorStore((s) => s.setSelectedObjectId);

  useEffect(() => {
    printDecalsRef.current = printDecals;
  }, [printDecals]);

  useEffect(() => {
    const unsub = useEditorStore.subscribe((s) => {
      designsRef.current = s.designs;
    });
    return unsub;
  }, []);

  // ---- INIT (once) ----
  useEffect(() => {
    if (initedRef.current) return;
    initedRef.current = true;

    const canvas = new fabric.Canvas(elRef.current, {
      width: 512,
      height: 512,
      backgroundColor: null,
      preserveObjectStacking: true,
    });
    canvasRef.current = canvas;

    const applySideAspect = (side) => {
      const decal = printDecalsRef.current?.[side];
      const sw = decal?.size?.[0] || 1;
      const sh = decal?.size?.[1] || 1;
      const aspect = sw / sh;
      const baseH = 512;
      const baseW = Math.round(baseH * aspect);
      canvas.setDimensions({ width: baseW, height: baseH });
    };
    applySideAspect(sideRef.current);

    const fitToWrapper = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const cw = wrap.clientWidth;
      const ch = wrap.clientHeight;
      if (!cw || !ch) return;
      const aspect = canvas.getWidth() / canvas.getHeight();
      let w = cw;
      let h = cw / aspect;
      if (h > ch) {
        h = ch;
        w = ch * aspect;
      }
      canvas.setDimensions(
        { width: `${Math.floor(w)}px`, height: `${Math.floor(h)}px` },
        { cssOnly: true }
      );
    };
    fitToWrapper();
    const ro = new ResizeObserver(fitToWrapper);
    if (wrapRef.current) ro.observe(wrapRef.current);

    let raf = 0;
    const sync = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const url = canvas.toDataURL({ format: "png", multiplier: 1 });
        setTextureURL(sideRef.current, url);
        bumpTexture();
      });
    };

    const onSelect = () => {
      const obj = canvas.getActiveObject();
      setSelectedObjectId(
        obj ? obj.__uid || (obj.__uid = Math.random()) : null
      );
    };

    canvas.on("object:added", sync);
    canvas.on("object:modified", sync);
    canvas.on("object:removed", sync);
    canvas.on("text:changed", sync);
    canvas.on("selection:created", onSelect);
    canvas.on("selection:updated", onSelect);
    canvas.on("selection:cleared", () => setSelectedObjectId(null));

    // Load existing design for the current side if it exists
    const existingDesign = designsRef.current?.[sideRef.current];
    if (existingDesign) {
      canvas.loadFromJSON(existingDesign, () => {
        canvas.requestRenderAll();
        // Sync immediately after render, then once more after a short delay
        // to ensure image-backed objects (photos) are fully decoded.
        sync();
        setTimeout(() => {
          if (canvasRef.current) {
            canvas.requestRenderAll();
            sync();
          }
        }, 150);
      });
    }

    onReady?.({ canvas, fitToWrapper, applySideAspect });
    sync();

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      try {
        canvas.dispose();
      } catch {
        /* noop */
      }
      canvasRef.current = null;
      initedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- TAB SWITCH ----
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const prev = sideRef.current;
    if (prev === selectedSide) return;

    // Save current side's design
    setDesign(prev, canvas.toJSON());

    // Resize internal canvas to the target side's decal aspect ratio
    const decal = printDecalsRef.current?.[selectedSide];
    if (decal) {
      const sw = decal.size?.[0] || 1;
      const sh = decal.size?.[1] || 1;
      const aspect = sw / sh;
      const baseH = 512;
      const baseW = Math.round(baseH * aspect);
      canvas.setDimensions({ width: baseW, height: baseH });
    }

    // Load target side's design (or clear)
    const next = designsRef.current?.[selectedSide];
    canvas.clear();
    canvas.backgroundColor = null;
    if (next) {
      canvas.loadFromJSON(next, () => canvas.requestRenderAll());
    } else {
      canvas.requestRenderAll();
    }

    // Re-fit CSS for the new aspect
    const wrap = wrapRef.current;
    if (wrap && wrap.clientWidth && wrap.clientHeight) {
      const cw = wrap.clientWidth;
      const ch = wrap.clientHeight;
      const aspect = canvas.getWidth() / canvas.getHeight();
      let w = cw;
      let h = cw / aspect;
      if (h > ch) {
        h = ch;
        w = ch * aspect;
      }
      canvas.setDimensions(
        { width: `${Math.floor(w)}px`, height: `${Math.floor(h)}px` },
        { cssOnly: true }
      );
    }

    sideRef.current = selectedSide;

    // Publish the freshly-loaded side as a texture
    const url = canvas.toDataURL({ format: "png", multiplier: 1 });
    setTextureURL(selectedSide, url);
    bumpTexture();
  }, [selectedSide, setDesign, setTextureURL, bumpTexture]);

  return (
    <div
      ref={wrapRef}
      className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white border-2 border-white/20 shadow-2xl shadow-black/20 grid place-items-center group"
      style={{ aspectRatio: "1 / 1" }}
    >
      {/* Canvas container with modern styling */}
      <div className="relative w-full h-full flex items-center justify-center">
        <canvas ref={elRef} className="rounded-xl" />
        
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/5 via-transparent to-white/10 pointer-events-none" />
        
        {/* Corner decorations */}
        <div className="absolute top-3 left-3 w-3 h-3 border-l-2 border-t-2 border-accent/30 rounded-tl-lg" />
        <div className="absolute top-3 right-3 w-3 h-3 border-r-2 border-t-2 border-accent/30 rounded-tr-lg" />
        <div className="absolute bottom-3 left-3 w-3 h-3 border-l-2 border-b-2 border-accent/30 rounded-bl-lg" />
        <div className="absolute bottom-3 right-3 w-3 h-3 border-r-2 border-b-2 border-accent/30 rounded-br-lg" />
        
        {/* Hover effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </div>
  );
}
