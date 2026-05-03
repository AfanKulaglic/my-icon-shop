import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { getFirebaseDatabase } from "../../firebase/config.js";
import { ref, onValue, update, remove } from "firebase/database";
import OrderModelViewer from "./OrderModelViewer.jsx";

const STATUS_STYLES = {
  paid: "bg-green-500/20 text-green-400 border-green-400/30",
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-400/30",
  shipped: "bg-blue-500/20 text-blue-400 border-blue-400/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-400/30",
};

const STATUS_OPTIONS = ["paid", "pending", "shipped", "cancelled"];

function formatDate(ts) {
  return new Date(ts).toLocaleString(undefined, {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function downloadDataURL(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}

// Crops a data-URL image to only the non-transparent bounding box.
// Returns { croppedUrl, hasContent } asynchronously via a state hook.
function useCroppedImage(src) {
  const [result, setResult] = useState({ croppedUrl: null, hasContent: false });

  useEffect(() => {
    if (!src) { setResult({ croppedUrl: null, hasContent: false }); return; }
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const { data } = ctx.getImageData(0, 0, img.width, img.height);
      let minX = img.width, minY = img.height, maxX = 0, maxY = 0;
      for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
          if (data[(y * img.width + x) * 4 + 3] > 8) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      if (maxX < minX || maxY < minY) {
        setResult({ croppedUrl: null, hasContent: false });
        return;
      }

      const pad = Math.round(Math.max(img.width, img.height) * 0.04);
      const cx = Math.max(0, minX - pad);
      const cy = Math.max(0, minY - pad);
      const cw = Math.min(img.width, maxX + pad + 1) - cx;
      const ch = Math.min(img.height, maxY + pad + 1) - cy;

      const out = document.createElement("canvas");
      out.width = cw;
      out.height = ch;
      out.getContext("2d").drawImage(canvas, cx, cy, cw, ch, 0, 0, cw, ch);
      setResult({ croppedUrl: out.toDataURL("image/png"), hasContent: true });
    };
    img.onerror = () => setResult({ croppedUrl: null, hasContent: false });
    img.src = src;
    return () => { cancelled = true; };
  }, [src]);

  return result;
}

// Single zone card — crops + shows only the artwork with download
function ZonePrintCard({ side, src, itemName }) {
  const { croppedUrl, hasContent } = useCroppedImage(src);
  const filename = `print-${side}-${itemName.toLowerCase().replace(/\s+/g, "-")}.png`;

  if (!hasContent) return null;

  return (
    <div className="space-y-2">
      <div
        className="w-full rounded-xl overflow-hidden flex items-center justify-center p-3"
        style={{
          backgroundImage:
            "linear-gradient(45deg,#2a2a2a 25%,transparent 25%),linear-gradient(-45deg,#2a2a2a 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#2a2a2a 75%),linear-gradient(-45deg,transparent 75%,#2a2a2a 75%)",
          backgroundSize: "16px 16px",
          backgroundPosition: "0 0,0 8px,8px -8px,-8px 0",
          backgroundColor: "#1e1e1e",
        }}
      >
        {croppedUrl ? (
          <img
            src={croppedUrl}
            alt={`${side} print`}
            className="max-w-full max-h-64 object-contain"
            draggable={false}
          />
        ) : (
          <div className="w-10 h-10 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">{side}</span>
        <button
          onClick={() => croppedUrl && downloadDataURL(croppedUrl, filename)}
          disabled={!croppedUrl}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/20 hover:bg-accent/30 border border-accent/30 text-accent text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-wait"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </button>
      </div>
    </div>
  );
}

function PrintFullscreenModal({ item, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const zones = ["front", "back", "sleeves"].filter((s) => item.textureURLs?.[s]);

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex flex-col"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Header bar */}
      <div className="flex items-center gap-3 px-5 py-3 bg-white/5 border-b border-white/10 flex-shrink-0">
        <div className="w-3 h-3 rounded-full border border-white/30 flex-shrink-0" style={{ backgroundColor: item.color }} />
        <span className="text-white font-bold text-sm">{item.name}</span>
        <span className="text-white/40 text-xs">· {item.size} · ×{item.quantity}</span>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-white/30 text-xs hidden sm:block">Press ESC to close</span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* 3D Viewer */}
        <div className="flex-1 min-h-0 relative bg-primary">
          <OrderModelViewer
            productId={item.productId}
            shirtColor={item.color}
            textureURLs={item.textureURLs}
          />
          <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white/25 text-[10px] pointer-events-none select-none">
            Drag to rotate · Scroll to zoom
          </p>
        </div>

        {/* Print Files panel */}
        <div className="lg:w-72 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-white/10 bg-white/3 flex flex-col overflow-y-auto">
          <div className="px-5 py-4 border-b border-white/10">
            <p className="text-xs font-bold text-white/70 uppercase tracking-widest">Print Files</p>
            <p className="text-[10px] text-white/30 mt-1">Cropped to artwork only — download to print on the physical product</p>
          </div>

          <div className="p-4 space-y-5 flex-1">
            {zones.map((side) => (
              <ZonePrintCard key={side} side={side} src={item.textureURLs[side]} itemName={item.name} />
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function OrderRow({ fbKey, order, onSelect, selected, onDeleted }) {
  const [fullscreenItem, setFullscreenItem] = useState(null);
  const closeFullscreen = useCallback(() => setFullscreenItem(null), []);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    setDeleting(true);
    try {
      const db = getFirebaseDatabase();
      await remove(ref(db, `orders/${fbKey}`));
      onDeleted?.(fbKey);
    } catch (err) {
      console.warn("Delete failed:", err);
      setDeleting(false);
      setConfirmDelete(false);
    }
  };
  return (
    <div
      onClick={() => onSelect(selected ? null : fbKey)}
      className={`cursor-pointer rounded-xl border transition-all duration-200 ${
        selected
          ? "border-accent/60 bg-accent/5"
          : "border-white/10 hover:border-white/20 bg-white/3 hover:bg-white/5"
      }`}
    >
      {/* Summary row */}
      <div className="flex items-center gap-3 p-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 flex-shrink-0">
          <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs text-accent font-bold truncate">{order.id}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLES[order.status] || STATUS_STYLES.pending}`}>
              {order.status?.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-white/50 mt-0.5 truncate">{order.customer?.name} · {order.customer?.email}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-black text-white">${order.total?.toFixed(2)}</p>
          <p className="text-[10px] text-white/30 mt-0.5">{formatDate(order.timestamp)}</p>
        </div>
        <svg className={`w-4 h-4 text-white/30 flex-shrink-0 transition-transform ${selected ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Expanded details */}
      {selected && (
        <div className="border-t border-white/10 p-4 space-y-4">
          {/* Customer */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2">Customer</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              {[
                ["Name", order.customer?.name],
                ["Email", order.customer?.email],
                ["Phone", order.customer?.phone || "—"],
                ["Address", order.customer?.address],
                ["City", order.customer?.city],
                ["ZIP", order.customer?.zip],
                ["Country", order.customer?.country],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <span className="text-white/30 flex-shrink-0">{k}:</span>
                  <span className="text-white/80 truncate">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2">Items</p>
            <div className="space-y-3">
              {order.items?.map((item, i) => {
                const hasDesign = item.textureURLs && Object.values(item.textureURLs).some(Boolean);
                return (
                  <div key={i} className="bg-white/5 rounded-xl border border-white/8 overflow-hidden">
                    {/* Item header */}
                    <div className="flex items-center justify-between px-3 py-2 text-xs border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full border border-white/30 flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-white/80 font-medium">{item.name}</span>
                        <span className="text-white/30">·</span>
                        <span className="text-white/50">{item.size}</span>
                      </div>
                      <div className="flex items-center gap-3 text-white/50">
                        <span>×{item.quantity}</span>
                        <span className="font-bold text-white">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Two-column: 3D model always visible; print zones only when design exists */}
                    <div className="flex gap-3 p-3">
                      {/* 3D model viewer — always shown as product preview */}
                      <div className="flex-shrink-0 w-52 h-52 rounded-xl overflow-hidden bg-primary border border-white/10 relative group">
                        <OrderModelViewer
                          productId={item.productId}
                          shirtColor={item.color}
                          textureURLs={item.textureURLs}
                        />
                        {/* Fullscreen button — only when there's a design to inspect */}
                        {hasDesign && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setFullscreenItem(item); }}
                            className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/60 hover:bg-black/80 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            title="View fullscreen"
                          >
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Right side: print zones OR no-design notice */}
                      {hasDesign ? (
                        <div className="flex-1 flex flex-col gap-2">
                          <p className="text-[9px] text-white/25 uppercase tracking-widest">Print zones</p>
                          <div className="flex flex-wrap gap-2">
                            {["front","back","sleeves"]
                              .filter((s) => item.textureURLs?.[s])
                              .map((side) => (
                                <div key={side} className="flex flex-col items-center gap-1">
                                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/15 bg-white/5">
                                    <img
                                      src={item.textureURLs[side]}
                                      alt={`${side} print`}
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                  <span className="text-[8px] text-white/30 uppercase tracking-widest">{side}</span>
                                </div>
                              ))
                            }
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); setFullscreenItem(item); }}
                            className="mt-auto flex items-center gap-1.5 text-[10px] text-accent/70 hover:text-accent transition-colors w-fit"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                            Open fullscreen &amp; download prints
                          </button>
                        </div>
                      ) : (
                        <p className="text-[10px] text-white/30 self-center">No custom design on this item</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Totals + payment */}
          <div className="flex items-start justify-between">
            <div className="text-xs space-y-1 flex-1">
              <div className="flex gap-3 text-white/50">
                <span>Subtotal:</span><span className="text-white">${order.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex gap-3 text-white/50">
                <span>Shipping:</span><span className="text-white">${order.shipping?.toFixed(2)}</span>
              </div>
              <div className="flex gap-3 font-bold">
                <span className="text-white/70">Total:</span><span className="text-white">${order.total?.toFixed(2)}</span>
              </div>
              <div className="flex gap-3 text-white/30 mt-2">
                <span>Payment:</span><span className="font-mono text-accent/80 text-[10px]">{order.paymentId}</span>
              </div>
              {order.paymentMethod === "paypal_simulation" && (
                <div className="flex gap-3 text-yellow-400/70 mt-1 items-center">
                  <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-[10px]">Simulated payment — real PayPal not yet integrated</span>
                </div>
              )}
            </div>

            {/* Status changer + Delete */}
            <div className="flex flex-col items-end gap-3 flex-shrink-0 ml-4">
              <StatusChanger fbKey={fbKey} currentStatus={order.status} />
              <div className="flex flex-col items-end gap-1.5">
                {!confirmDelete ? (
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400/70 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/50 text-[10px] font-bold uppercase tracking-wider transition-all"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Order
                  </button>
                ) : (
                  <div className="flex flex-col items-end gap-1.5 bg-red-500/10 border border-red-500/30 rounded-xl p-2.5">
                    <p className="text-[10px] text-red-300 font-bold">Delete this order?</p>
                    <p className="text-[9px] text-red-400/60">This cannot be undone.</p>
                    <div className="flex gap-1.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); setConfirmDelete(false); }}
                        className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white text-[10px] font-bold transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/20 border border-red-400/40 text-red-300 hover:bg-red-500/30 text-[10px] font-bold transition-colors disabled:opacity-50"
                      >
                        {deleting ? (
                          <div className="w-3 h-3 border border-red-300/30 border-t-red-300 rounded-full animate-spin" />
                        ) : (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                        Confirm Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen print modal */
      {fullscreenItem && (
        <PrintFullscreenModal item={fullscreenItem} onClose={closeFullscreen} />
      )}
    </div>
  );
}

function StatusChanger({ fbKey, currentStatus }) {
  const [saving, setSaving] = useState(false);

  const changeStatus = async (status) => {
    setSaving(true);
    try {
      const db = getFirebaseDatabase();
      await update(ref(db, `orders/${fbKey}`), { status });
    } catch (e) {
      console.warn(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2 text-right">Update Status</p>
      <div className="flex flex-wrap gap-1.5 justify-end">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            disabled={saving || s === currentStatus}
            onClick={(e) => { e.stopPropagation(); changeStatus(s); }}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
              s === currentStatus
                ? (STATUS_STYLES[s] || STATUS_STYLES.pending) + " opacity-100"
                : "border-white/10 text-white/30 hover:border-white/30 hover:text-white/60"
            }`}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function OrdersManager() {
  const [orders, setOrders] = useState({});
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const db = getFirebaseDatabase();
    const ordersRef = ref(db, "orders");
    const unsub = onValue(ordersRef, (snap) => {
      setOrders(snap.val() || {});
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const ordersList = Object.entries(orders)
    .map(([fbKey, order]) => ({ fbKey, ...order }))
    .sort((a, b) => b.timestamp - a.timestamp);

  const filtered = ordersList.filter((o) => {
    if (filter !== "all" && o.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        o.id?.toLowerCase().includes(q) ||
        o.customer?.name?.toLowerCase().includes(q) ||
        o.customer?.email?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Stats
  const stats = {
    total: ordersList.length,
    paid: ordersList.filter((o) => o.status === "paid").length,
    shipped: ordersList.filter((o) => o.status === "shipped").length,
    revenue: ordersList
      .filter((o) => o.status === "paid" || o.status === "shipped")
      .reduce((s, o) => s + (o.total || 0), 0),
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* PayPal simulation warning */}
      <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border-b border-yellow-500/20 flex-shrink-0">
        <svg className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span className="text-[11px] text-yellow-300/80">
          <span className="font-bold text-yellow-300">Payment Simulation Active</span> — PayPal integration is not yet live. All payments shown are simulated test transactions only.
        </span>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-3 p-4 border-b border-white/10 flex-shrink-0">
        {[
          { label: "Total Orders", value: stats.total, color: "text-white" },
          { label: "Paid", value: stats.paid, color: "text-green-400" },
          { label: "Shipped", value: stats.shipped, color: "text-blue-400" },
          { label: "Revenue", value: `$${stats.revenue.toFixed(2)}`, color: "gradient-text" },
        ].map(({ label, value, color }) => (
          <div key={label} className="text-center">
            <p className={`text-xl font-black ${color}`}>{value}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-wide mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="p-4 space-y-3 border-b border-white/10 flex-shrink-0">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email or order ID..."
          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-white/30 focus:outline-none focus:border-accent/50"
        />
        <div className="flex gap-2 flex-wrap">
          {["all", ...STATUS_OPTIONS].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-accent text-white"
                  : "bg-white/5 text-white/50 hover:text-white"
              }`}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== "all" && (
                <span className="ml-1 opacity-60">
                  ({ordersList.filter((o) => o.status === f).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {loading && (
          <div className="flex items-center justify-center py-16 text-white/30 text-sm">
            <div className="w-5 h-5 border-2 border-white/10 border-t-accent rounded-full animate-spin mr-3" />
            Loading orders...
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg className="w-12 h-12 text-white/10 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-white/30 text-sm">No orders found.</p>
          </div>
        )}

        {filtered.map(({ fbKey, ...order }) => (
          <OrderRow
            key={fbKey}
            fbKey={fbKey}
            order={order}
            selected={selected === fbKey}
            onSelect={setSelected}
            onDeleted={() => setSelected(null)}
          />
        ))}
      </div>
    </div>
  );
}
