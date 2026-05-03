import { useRef } from "react";
import * as fabric from "fabric";
import {
  TextIcon,
  ImageIcon,
  ShapesIcon,
  TemplateIcon,
  Trash,
} from "../ui/Icons.jsx";
import { useContentStore } from "../../store/contentStore.js";

export default function EditorSidebar({ fabricApi }) {
  const getText = useContentStore((s) => s.getText);

  const tools = [
    { id: "text", label: getText("editor_add_text"), icon: TextIcon },
    { id: "image", label: getText("editor_upload_image"), icon: ImageIcon },
    { id: "shapes", label: getText("editor_shapes"), icon: ShapesIcon },
    { id: "templates", label: getText("editor_templates"), icon: TemplateIcon },
  ];
  const fileRef = useRef(null);

  const addText = () => {
    if (!fabricApi) return;
    const t = new fabric.IText("Your text", {
      left: 150,
      top: 150,
      fill: "#000000",
      fontFamily: "Inter",
      fontSize: 36,
    });
    fabricApi.canvas.add(t);
    fabricApi.canvas.setActiveObject(t);
    fabricApi.canvas.requestRenderAll();
  };

  const addRect = () => {
    if (!fabricApi) return;
    const r = new fabric.Rect({
      left: 160,
      top: 160,
      width: 120,
      height: 120,
      fill: "#FF6A00",
    });
    fabricApi.canvas.add(r);
    fabricApi.canvas.setActiveObject(r);
    fabricApi.canvas.requestRenderAll();
  };

  const addCircle = () => {
    if (!fabricApi) return;
    const c = new fabric.Circle({
      left: 160,
      top: 160,
      radius: 60,
      fill: "#0A1A17",
    });
    fabricApi.canvas.add(c);
    fabricApi.canvas.setActiveObject(c);
    fabricApi.canvas.requestRenderAll();
  };

  const onUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !fabricApi) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const img = await fabric.FabricImage.fromURL(ev.target.result);
      const max = 280;
      if (img.width > max) img.scaleToWidth(max);
      img.set({ left: 80, top: 80 });
      fabricApi.canvas.add(img);
      fabricApi.canvas.setActiveObject(img);
      fabricApi.canvas.requestRenderAll();
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const deleteSelected = () => {
    if (!fabricApi) return;
    const obj = fabricApi.canvas.getActiveObject();
    if (obj) {
      fabricApi.canvas.remove(obj);
      fabricApi.canvas.requestRenderAll();
    }
  };

  const handle = (id) => {
    if (id === "text") addText();
    if (id === "shapes") addRect();
    if (id === "image") fileRef.current?.click();
    if (id === "templates") addCircle();
  };

  return (
    <aside className="border-r border-white/10 bg-gradient-to-b from-primary-light/60 to-primary-light/40 backdrop-blur-sm overflow-y-auto relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-secondary/5 pointer-events-none" />
      
      <div className="relative z-10 p-6">
        {/* Main Tools */}
        <div className="space-y-2 mb-8">
          {tools.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handle(id)}
              className="w-full flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-white/10 text-sm font-medium transition-all duration-300 group border border-transparent hover:border-white/20 hover:shadow-lg hover:shadow-accent/10"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center group-hover:from-accent/20 group-hover:to-accent/10 transition-all duration-300">
                <Icon className="w-5 h-5 text-white/70 group-hover:text-accent transition-colors duration-300" />
              </div>
              <span className="group-hover:text-white transition-colors duration-300">{label}</span>
            </button>
          ))}
          
          <button
            onClick={deleteSelected}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-red-500/10 text-sm font-medium transition-all duration-300 group border border-transparent hover:border-red-500/30"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-red-500/10 flex items-center justify-center group-hover:from-red-500/30 group-hover:to-red-500/20 transition-all duration-300">
              <Trash className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors duration-300" />
            </div>
            <span className="text-red-300 group-hover:text-red-200 transition-colors duration-300">{getText("editor_delete")}</span>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="glass rounded-2xl p-6 border border-white/10">
          <h4 className="font-heading font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {getText("editor_quick_add")}
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={addRect}
              className="aspect-square rounded-xl bg-gradient-to-br from-white/10 to-white/5 hover:from-accent/20 hover:to-accent/10 border border-white/10 hover:border-accent/30 flex items-center justify-center transition-all duration-300 group"
              title="Add Rectangle"
            >
              <div className="w-6 h-6 bg-gradient-to-br from-accent to-accent-light rounded-sm group-hover:scale-110 transition-transform duration-300" />
            </button>
            <button
              onClick={addCircle}
              className="aspect-square rounded-xl bg-gradient-to-br from-white/10 to-white/5 hover:from-secondary/20 hover:to-secondary/10 border border-white/10 hover:border-secondary/30 flex items-center justify-center transition-all duration-300 group"
              title="Add Circle"
            >
              <div className="w-6 h-6 bg-gradient-to-br from-secondary to-secondary-light rounded-full group-hover:scale-110 transition-transform duration-300" />
            </button>
            <button
              onClick={addText}
              className="aspect-square rounded-xl bg-gradient-to-br from-white/10 to-white/5 hover:from-accent-light/20 hover:to-accent-light/10 border border-white/10 hover:border-accent-light/30 flex items-center justify-center transition-all duration-300 group"
              title="Add Text"
            >
              <span className="font-heading text-xl font-bold gradient-text group-hover:scale-110 transition-transform duration-300">T</span>
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-accent/10 to-secondary/10 border border-accent/20">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-white/80 mb-1">{getText("editor_pro_tip")}</p>
              <p className="text-xs text-white/60 leading-relaxed">
                {getText("editor_pro_tip_text")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onUpload}
      />
    </aside>
  );
}
