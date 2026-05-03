import { useEditorStore } from "../../store/editorStore.js";
import { useContentStore } from "../../store/contentStore.js";
import FabricEditor from "./FabricEditor.jsx";

const sideKeys = { front: "editor_front", back: "editor_back", sleeves: "editor_sleeves" };

export default function RightPanel({ fabricApi, onFabricReady, model }) {
  const sides = Object.keys(model?.printDecals || { front: 1, back: 1, sleeves: 1 });
  const selectedSide = useEditorStore((s) => s.selectedSide);
  const setSide = useEditorStore((s) => s.setSide);
  const selectedObjectId = useEditorStore((s) => s.selectedObjectId);
  const getText = useContentStore((s) => s.getText);

  const active = fabricApi?.canvas?.getActiveObject();

  const update = (props) => {
    if (!active || !fabricApi) return;
    active.set(props);
    active.setCoords();
    fabricApi.canvas.requestRenderAll();
    fabricApi.canvas.fire("object:modified", { target: active });
  };

  return (
    <aside className="border-l border-white/10 bg-gradient-to-b from-primary-light/60 to-primary-light/40 backdrop-blur-sm overflow-y-auto relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-bl from-secondary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <div className="relative z-10">
        {/* TABS */}
        <div className="flex border-b border-white/10 bg-white/5 backdrop-blur-sm">
          {sides.map((s) => (
            <button
              key={s}
              onClick={() => setSide(s)}
              className={`flex-1 py-4 text-sm font-semibold uppercase tracking-wider transition-all duration-300 relative ${
                selectedSide === s
                  ? "text-accent"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {selectedSide === s && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent to-accent-light" />
              )}
              <div className={`transition-all duration-300 ${selectedSide === s ? 'transform scale-110' : ''}`}>
                {getText(sideKeys[s] || s)}
              </div>
            </button>
          ))}
        </div>

        {/* PRINT AREA */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-heading font-bold text-lg gradient-text">{getText("editor_print_area")}</h4>
              <p className="text-xs text-white/50 capitalize">{getText(sideKeys[selectedSide] || selectedSide)} side</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-medium text-accent">{getText("editor_live_sync")}</span>
            </div>
          </div>
          
          <div className="relative">
            <FabricEditor
              onReady={onFabricReady}
              printDecals={model?.printDecals}
            />
            {/* Overlay gradient for depth */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* CONTROLS */}
        <div className="p-6 border-t border-white/10 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h4 className="font-heading font-bold text-white">{getText("editor_element_controls")}</h4>
              <p className="text-xs text-white/50">{getText("editor_element_hint")}</p>
            </div>
          </div>

          {!active && (
            <div className="glass rounded-xl p-6 text-center border border-white/10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.121 2.122" />
                </svg>
              </div>
              <p className="text-sm text-white/60 mb-2">{getText("editor_no_selection")}</p>
              <p className="text-xs text-white/40">{getText("editor_no_selection_hint")}</p>
            </div>
          )}

          {active && (
            <div className="space-y-5">
              <ModernRange
                label={getText("editor_scale")}
                icon="⚡"
                min={0.2}
                max={3}
                step={0.05}
                value={active.scaleX || 1}
                onChange={(v) => update({ scaleX: v, scaleY: v })}
              />
              <ModernRange
                label={getText("editor_position_x")}
                icon="↔"
                min={0}
                max={512}
                step={1}
                value={active.left || 0}
                onChange={(v) => update({ left: v })}
              />
              <ModernRange
                label={getText("editor_position_y")}
                icon="↕"
                min={0}
                max={512}
                step={1}
                value={active.top || 0}
                onChange={(v) => update({ top: v })}
              />
              <ModernRange
                label={getText("editor_rotation")}
                icon="🔄"
                min={-180}
                max={180}
                step={1}
                value={active.angle || 0}
                onChange={(v) => update({ angle: v })}
              />

              {(active.type === "i-text" || active.type === "text") && (
                <div className="glass rounded-xl p-4 border border-white/10">
                  <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-3">
                    <span className="text-lg">🎨</span>
                    {getText("editor_text_color")}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={active.fill || "#000000"}
                      onChange={(e) => update({ fill: e.target.value })}
                      className="w-12 h-12 rounded-lg border-2 border-white/20 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="text-xs text-white/50 mb-1">{getText("editor_current_color")}</div>
                      <div className="text-sm font-mono text-white/80">{active.fill || "#000000"}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* invisible spy: re-render when selection changes */}
      <span className="hidden" data-id={selectedObjectId} />
    </aside>
  );
}

function ModernRange({ label, icon, value, onChange, ...rest }) {
  return (
    <div className="glass rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <label className="flex items-center gap-2 text-sm font-medium text-white/80">
          <span className="text-lg">{icon}</span>
          {label}
        </label>
        <div className="px-3 py-1 rounded-lg bg-accent/10 border border-accent/20">
          <span className="text-sm font-mono text-accent">{Number(value).toFixed(2)}</span>
        </div>
      </div>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
        {...rest}
      />
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent), var(--accent-light));
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(var(--accent-rgb), 0.3);
          transition: all 0.2s ease;
        }
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(var(--accent-rgb), 0.4);
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent), var(--accent-light));
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 12px rgba(var(--accent-rgb), 0.3);
        }
      `}</style>
    </div>
  );
}
