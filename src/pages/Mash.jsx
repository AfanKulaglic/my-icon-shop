import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import ShirtCanvas from "../components/editor/ShirtCanvas.jsx";
import { useEditorStore } from "../store/editorStore.js";
import {
  listModels,
  getModel,
  setSideOverride,
  clearModelOverride,
  loadOverrides,
  loadCameraOverride,
  saveCameraOverride,
  clearCameraOverride,
  SIDES,
} from "../utils/models.js";

const SIDE_COLORS = {
  front: "#FF6A00",
  back: "#00B4FF",
  sleeves: "#00FF8C",
};

/**
 * /mash — Mesh / print-zone editor.
 *
 * Decal-based placement: the user clicks anywhere on the 3D shirt to
 * pin the active side's print zone, and uses sliders for size +
 * rotation. UV layout is irrelevant — what you see is what prints.
 *
 * /mash             -> grid of all models
 * /mash/:modelId    -> per-model 3D zone editor
 */
export default function Mash() {
  const { modelId } = useParams();
  if (!modelId) return <ModelGrid />;
  return <ZoneEditor modelId={modelId} />;
}

// ---------------------------------------------------------------------------
// Grid: list every registered model with a thumbnail of its diffuse texture.
// ---------------------------------------------------------------------------
function ModelGrid() {
  const [overrides, setOverrides] = useState({});
  const models = listModels();

  useEffect(() => {
    loadOverrides().then(setOverrides);
  }, []);

  return (
    <div className="min-h-screen bg-primary text-white p-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl">
            Mesh<span className="text-accent">.</span> zone editor
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Click on the 3D shirt to place each side's print zone — no
            UV-map wrangling required.
          </p>
        </div>
        <Link
          to="/"
          className="text-sm text-white/60 hover:text-white border border-white/10 hover:border-white/30 px-3 py-2 rounded-lg"
        >
          ← Back to site
        </Link>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {models.map((m) => (
          <Link
            key={m.id}
            to={`/mash/${m.id}`}
            className="group rounded-2xl border border-white/10 hover:border-accent overflow-hidden bg-white/[0.02] transition"
          >
            <div className="aspect-square bg-white/5 flex items-center justify-center overflow-hidden">
              {m.maps?.diffuse ? (
                <img
                  src={m.maps.diffuse}
                  alt={m.label}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition"
                />
              ) : (
                <div className="text-white/30 text-xs uppercase tracking-widest">
                  no texture
                </div>
              )}
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{m.label}</div>
                <div className="text-xs text-white/40 mt-1">{m.id}</div>
              </div>
              {overrides[m.id] && (
                <span className="text-[10px] uppercase tracking-widest text-accent border border-accent/40 rounded px-2 py-1">
                  edited
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Per-model decal zone editor.
// ---------------------------------------------------------------------------
function ZoneEditor({ modelId }) {
  const navigate = useNavigate();
  const base = getModel(modelId);

  const setSide = useEditorStore((s) => s.setSide);
  const setDropDecalHandler = useEditorStore((s) => s.setDropDecalHandler);

  const [active, setActive] = useState("front");
  const [overrides, setOverrides] = useState({});
  const [tab, setTab] = useState("zones"); // "zones" | "camera"
  const [cameraDefault, setCameraDefault] = useState(null); // {position,target} | null
  const [cameraSaving, setCameraSaving] = useState(false);
  const orbitRef = useRef(null);

  // Load overrides from Firebase on mount
  useEffect(() => {
    loadOverrides().then(setOverrides);
    loadCameraOverride(modelId).then(setCameraDefault);
  }, [modelId]);

  // Sync /mash's active tab into the editor store so any sub-components
  // that key off `selectedSide` (e.g. the Fabric editor in /editor)
  // stay in sync after we leave.
  useEffect(() => {
    setSide(active);
  }, [active, setSide]);

  // Wire up "click on shirt → reposition active decal" callback.
  useEffect(() => {
    setDropDecalHandler((side, { point, normal }) => {
      setSideOverride(modelId, side, { point, normal }).then(() => {
        // Reload overrides after save
        loadOverrides().then(setOverrides);
      });
    });
    return () => setDropDecalHandler(null);
  }, [modelId, setDropDecalHandler]);

  // Local mirror of the current active side's tweakable values
  // (size + rotation). We read it from the override map on every
  // render so the sliders track external changes (e.g. clicks).
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const onChange = () => {
      setTick((t) => t + 1);
      loadOverrides().then(setOverrides);
    };
    window.addEventListener("printdecals:changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("printdecals:changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const decal = useMemo(() => {
    const ov = overrides[modelId]?.[active];
    const seed = base.printDecals?.[active] || {};
    return {
      size: ov?.size || seed.size || [0.3, 0.3],
      rotation: typeof ov?.rotation === "number" ? ov.rotation : seed.rotation || 0,
      hasPlacement: !!(ov?.point && ov?.normal),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelId, active, tick, overrides]);

  const updateActive = (patch) => {
    setSideOverride(modelId, active, patch).then(() => {
      loadOverrides().then(setOverrides);
    });
  };

  const saveCamera = async () => {
    const ctrl = orbitRef.current;
    if (!ctrl) return;
    setCameraSaving(true);
    const pos = ctrl.object.position;
    const tgt = ctrl.target;
    const data = {
      position: [pos.x, pos.y, pos.z],
      target: [tgt.x, tgt.y, tgt.z],
    };
    await saveCameraOverride(modelId, data.position, data.target);
    setCameraDefault(data);
    setCameraSaving(false);
  };

  const resetCamera = async () => {
    if (!confirm("Remove the saved camera default for this model?")) return;
    await clearCameraOverride(modelId);
    setCameraDefault(null);
  };

  const reset = () => {
    if (!confirm("Reset all zones for this model to defaults?")) return;
    clearModelOverride(modelId).then(() => {
      loadOverrides().then(setOverrides);
    });
  };

  const copyJson = async () => {
    const all = await loadOverrides();
    const ov = all[modelId] || {};
    const json = JSON.stringify(ov, null, 2);
    try {
      await navigator.clipboard.writeText(json);
      alert(`Copied!\n\nDecal overrides for "${modelId}":\n\n${json}`);
    } catch {
      prompt("Copy this JSON:", json);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-primary text-white">
      {/* TOP BAR */}
      <header className="h-14 border-b border-white/10 backdrop-blur-xl bg-primary/80 flex items-center px-4 gap-4">
        <Link to="/mash" className="text-white/60 hover:text-white text-sm transition-colors">
          ← All models
        </Link>
        <span className="text-white/30">/</span>
        <span className="text-sm font-medium">{base.label}</span>
        <span className="text-white/30 text-xs">({modelId})</span>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={reset}
            className="text-xs px-4 py-2 rounded-lg border-2 border-white/10 hover:border-red-400/40 text-white/70 hover:text-red-300 transition-all"
          >
            Reset to defaults
          </button>
          <button
            onClick={copyJson}
            className="text-xs px-4 py-2 rounded-lg bg-gradient-to-r from-accent to-accent-light hover:from-accent-hover hover:to-accent text-white font-semibold shadow-lg shadow-accent/20 hover:shadow-glow transition-all"
          >
            Copy JSON
          </button>
          <button
            onClick={() => navigate("/mash")}
            className="text-xs px-4 py-2 rounded-lg border-2 border-white/10 hover:border-accent/50 bg-white/5 hover:bg-white/10 text-white transition-all"
          >
            Done
          </button>
        </div>
      </header>

      {/* WORKSPACE */}
      <div className="flex-1 grid grid-cols-[1fr_minmax(360px,420px)] overflow-hidden">
        <div className="relative bg-[radial-gradient(ellipse_at_center,#1E2447,#0A0E27)]">
          <ShirtCanvas modelId={modelId} editable editingSide={active} orbitRef={orbitRef} />
          <div className="absolute top-3 left-3 text-[11px] text-white/60 uppercase tracking-widest bg-black/30 rounded px-2 py-1">
            {tab === "camera"
              ? "Rotate freely — then click \"Set as default\""
              : <>Click on the shirt to place the{" "}<span style={{ color: SIDE_COLORS[active] }}>{active}</span> zone</>
            }
          </div>
        </div>

        <aside className="border-l border-white/10 bg-primary-light flex flex-col">
          {/* Top-level tabs: Zones / Camera */}
          <div className="grid grid-cols-2 border-b border-white/10">
            {["zones", "camera"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`py-3 text-xs uppercase tracking-widest transition ${
                  tab === t
                    ? "text-white border-b-2 border-accent"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {t === "zones" ? "Print zones" : "Camera default"}
              </button>
            ))}
          </div>

          {tab === "zones" && (
            <div className="flex flex-col flex-1">
              {/* Side tabs */}
              <div className="grid grid-cols-3 border-b border-white/10">
                {SIDES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setActive(s)}
                    className={`py-3 text-xs uppercase tracking-widest transition ${
                      active === s
                        ? "text-white border-b-2"
                        : "text-white/40 hover:text-white/70"
                    }`}
                    style={{ borderColor: active === s ? SIDE_COLORS[s] : "transparent" }}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="p-4 space-y-5">
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-white/40 mb-2">
                    Status · {active}
                  </h4>
                  <p className="text-sm text-white/70">
                    {decal.hasPlacement ? (
                      <><span className="text-accent">Placed.</span> Click again to move it.</>
                    ) : (
                      <>Using default location.{" "}<span className="text-white/50">Click on the shirt to override.</span></>
                    )}
                  </p>
                </div>

                <SliderRow
                  label={`Width  (${decal.size[0].toFixed(2)})`}
                  min={0.05} max={2} step={0.01} value={decal.size[0]}
                  onChange={(w) => updateActive({ size: [w, decal.size[1]] })}
                />
                <SliderRow
                  label={`Height  (${decal.size[1].toFixed(2)})`}
                  min={0.05} max={2} step={0.01} value={decal.size[1]}
                  onChange={(h) => updateActive({ size: [decal.size[0], h] })}
                />
                <SliderRow
                  label={`Rotation  (${((decal.rotation * 180) / Math.PI).toFixed(0)}°)`}
                  min={-Math.PI} max={Math.PI} step={0.01} value={decal.rotation}
                  onChange={(r) => updateActive({ rotation: r })}
                />

                <div className="pt-3 border-t border-white/10">
                  <p className="text-[11px] text-white/40 leading-relaxed">
                    Print zones live on the 3D surface as decals. They follow
                    the mesh regardless of how it's UV-unwrapped, and
                    automatically wrap around curves. Tweaks save instantly
                    and update <code className="text-white/60">/editor</code>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {tab === "camera" && (
            <div className="p-4 space-y-5 flex-1 flex flex-col">
              <div>
                <h4 className="text-xs uppercase tracking-widest text-white/40 mb-2">
                  Default camera angle
                </h4>
                <p className="text-sm text-white/60 leading-relaxed">
                  Rotate and zoom the model on the left to the angle you want
                  customers to see when the product first loads, then click{" "}
                  <span className="text-accent font-medium">Set as default</span>.
                  The position is saved to Firebase and applied everywhere the
                  model is shown.
                </p>
              </div>

              <div className={`rounded-xl border p-3 text-xs space-y-1 ${
                cameraDefault ? "border-accent/30 bg-accent/5" : "border-white/10 bg-white/3"
              }`}>
                {cameraDefault ? (
                  <>
                    <p className="text-accent font-semibold flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Custom default saved
                    </p>
                    <p className="text-white/40 font-mono text-[10px]">
                      pos [{cameraDefault.position.map((v) => v.toFixed(2)).join(", ")}]
                    </p>
                  </>
                ) : (
                  <p className="text-white/40">No custom default — using built-in angle.</p>
                )}
              </div>

              <div className="space-y-2 mt-auto">
                <button
                  onClick={saveCamera}
                  disabled={cameraSaving}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-light hover:from-accent-hover hover:to-accent text-white text-xs font-semibold uppercase tracking-widest shadow-lg shadow-accent/20 hover:shadow-glow transition-all disabled:opacity-60 disabled:cursor-wait"
                >
                  {cameraSaving ? "Saving…" : "Set current view as default"}
                </button>
                {cameraDefault && (
                  <button
                    onClick={resetCamera}
                    className="w-full py-2 rounded-xl border border-white/10 hover:border-red-400/40 text-white/50 hover:text-red-300 text-xs transition-all"
                  >
                    Remove saved default
                  </button>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function SliderRow({ label, min, max, step, value, onChange }) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-widest text-white/40 mb-1">
        {label}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-accent"
      />
    </label>
  );
}
