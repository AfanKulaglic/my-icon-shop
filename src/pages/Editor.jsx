import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import * as fabric from "fabric";
import { motion, AnimatePresence } from "framer-motion";
import EditorSidebar from "../components/editor/EditorSidebar.jsx";
import ShirtCanvas from "../components/editor/ShirtCanvas.jsx";
import RightPanel from "../components/editor/RightPanel.jsx";
import { findProduct, products } from "../utils/products.js";
import { useEditorStore } from "../store/editorStore.js";
import { useProductConfigStore } from "../store/productConfigStore.js";
import { useContentStore } from "../store/contentStore.js";
import { getModelWithOverrides, loadCameraOverride } from "../utils/models.js";
import { usePrintAreasOverride } from "../hooks/usePrintAreasOverride.js";
import FabricEditor from "../components/editor/FabricEditor.jsx";
import { useCartWishlistStore } from "../store/cartWishlistStore.js";

// Zone labels (display only; prices come from Firebase via productConfigStore)
const ZONE_LABELS = { front: "Front", back: "Back", sleeves: "Sleeves" };

export default function Editor() {
  const { id } = useParams();
  const product = findProduct(id) || products[0];
  // eslint-disable-next-line no-unused-vars
  const [overrides, _v] = usePrintAreasOverride();
  const model = getModelWithOverrides(product.modelId, overrides);
  const [fabricApi, setFabricApi] = useState(null);
  const [initialCamera, setInitialCamera] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');

  // Load saved camera default for this model
  useEffect(() => {
    loadCameraOverride(product.modelId).then((cam) => {
      if (cam) setInitialCamera(cam);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.modelId]);
  const shirtColor = useEditorStore((s) => s.shirtColor);
  const setShirtColor = useEditorStore((s) => s.setShirtColor);
  const setSide = useEditorStore((s) => s.setSide);
  const resetEditor = useEditorStore((s) => s.reset);
  const getComposedDiffuse = useEditorStore((s) => s.getComposedDiffuse);
  const textureURLs = useEditorStore((s) => s.textureURLs);
  const designs = useEditorStore((s) => s.designs);
  const debugZones = useEditorStore((s) => s.debugZones);
  const toggleDebugZones = useEditorStore((s) => s.toggleDebugZones);

  // Reset all editor state when switching to a different product.
  // NOTE: we intentionally do NOT call setFabricApi(null) here.
  // Clearing fabricApi would prevent handleAddToCart from reading the canvas
  // directly (synchronously) at save time, forcing a race against the
  // rAF-deferred textureURLs sync in FabricEditor. Instead we add
  // key={product.id} to RightPanel/MobileEditor below so FabricEditor
  // remounts (and calls onFabricReady again) when the product changes.
  useEffect(() => {
    resetEditor();
    setInitialCamera(null);
    setSelectedSize('M');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  // Initialize Firebase product configs
  const initFirebase = useProductConfigStore((s) => s.initFirebase);
  const getAvailableColors = useProductConfigStore((s) => s.getAvailableColors);
  const getText = useContentStore((s) => s.getText);
  const currentLanguage = useContentStore((s) => s.currentLanguage);
  const setLanguage = useContentStore((s) => s.setLanguage);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const addToCart = useCartWishlistStore((s) => s.addToCart);
  const cartCount = useCartWishlistStore((s) => s.cart.reduce((sum, i) => sum + i.quantity, 0));
  const navigate = useNavigate();

  const handleAddToCart = () => {
    try {
      const state = useEditorStore.getState();
      const allDesigns = { ...state.designs };
      const allTextureURLs = { ...state.textureURLs };
      if (fabricApi?.canvas) {
        allDesigns[state.selectedSide] = fabricApi.canvas.toJSON();
        allTextureURLs[state.selectedSide] = fabricApi.canvas.toDataURL({ format: 'png', multiplier: 1 });
      }
      localStorage.setItem(`cart_edit:${product.id}`, JSON.stringify({ designs: allDesigns, shirtColor, textureURLs: allTextureURLs, selectedSize }));
    } catch (e) {}
    addToCart(product.id, shirtColor, selectedSize);
  };

  const handleCheckout = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  // Restore saved editor state SYNCHRONOUSLY before FabricEditor's init effect runs,
  // so the canvas sees the correct designs on first mount (not just after a re-render).
  // eslint-disable-next-line no-unused-vars
  const [_restored] = useState(() => {
    try {
      const saved = localStorage.getItem(`cart_edit:${product.id}`);
      if (saved) {
        const { designs: savedDesigns, shirtColor: savedColor, textureURLs: savedTextureURLs } = JSON.parse(saved);
        const patch = {};
        if (savedColor) patch.shirtColor = savedColor;
        if (savedDesigns) {
          patch.designs = { front: null, back: null, sleeves: null, ...savedDesigns };
        }
        if (savedTextureURLs) {
          // Restore rendered PNG data-URLs directly → 3D model shows textures on first frame
          patch.textureURLs = { front: null, back: null, sleeves: null, ...savedTextureURLs };
          patch.textureVersion = (useEditorStore.getState().textureVersion || 0) + 1;
        }
        if (Object.keys(patch).length) useEditorStore.setState(patch);
      }
    } catch (e) {
      // ignore corrupt saved state
    }
  });

  useEffect(() => {
    initFirebase();
  }, [initFirebase]);

  // Get available colors for this product from Firebase
  const availableColors = getAvailableColors(product.id);

  // Reset to front view when editor opens
  useEffect(() => {
    setSide("front");
  }, [setSide]);

  // Shift+P toggles the print-area debug overlay on the 3D model.
  useEffect(() => {
    const onKey = (e) => {
      if (e.shiftKey && (e.key === "P" || e.key === "p")) {
        e.preventDefault();
        toggleDebugZones();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleDebugZones]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-primary via-primary-light to-primary text-white">
      {/* TOP BAR */}
      <header className="h-16 lg:h-16 border-b border-white/10 backdrop-blur-xl bg-gradient-to-r from-primary/90 via-primary-light/90 to-primary/90 flex items-center px-4 lg:px-6 gap-3 lg:gap-6 relative z-[9999]">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-secondary/5" />
        
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-all duration-300 group relative z-10"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">{getText("editor_back_btn")}</span>
        </button>
        
        <div className="h-4 lg:h-6 w-px bg-white/20 relative z-10" />
        
        <Link to="/" className="flex items-center gap-2 lg:gap-3 group relative z-10">
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center shadow-lg shadow-accent/20 group-hover:shadow-glow transition-all duration-300">
            <img 
              src="/images/logo.webp" 
              alt="my-icon.shop" 
              className="w-5 h-5 lg:w-6 lg:h-6 transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <span className="font-heading text-base lg:text-lg font-bold hidden sm:block">
            <span className="bg-gradient-to-r from-white via-accent-light to-white bg-clip-text text-transparent group-hover:from-accent-light group-hover:via-secondary group-hover:to-accent-light transition-all duration-500">
              my-icon
            </span>
            <span className="text-accent group-hover:text-secondary transition-colors duration-300">.</span>
            <span className="bg-gradient-to-r from-white via-accent-light to-white bg-clip-text text-transparent group-hover:from-accent-light group-hover:via-secondary group-hover:to-accent-light transition-all duration-500">
              shop
            </span>
          </span>
        </Link>
        
        <div className="h-4 lg:h-6 w-px bg-white/20 hidden sm:block" />
        
        <div className="flex items-center gap-1 lg:gap-2 relative z-10 hidden sm:flex">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs lg:text-sm font-medium text-white/80">{getText("editor_studio_label")}</span>
          <span className="text-white/40 hidden lg:inline">—</span>
          <span className="text-xs lg:text-sm font-semibold gradient-text truncate max-w-[120px] lg:max-w-none">{product.name}</span>
        </div>

        <div className="ml-auto flex items-center gap-2 lg:gap-3 relative z-10">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1 text-accent hover:text-accent-light transition-all duration-300 text-xs uppercase tracking-wider font-bold"
            >
              {currentLanguage.toUpperCase()}
              <svg className={`w-3 h-3 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isLangOpen && (
              <div className="absolute top-full right-0 mt-2 w-36 py-2 rounded-xl bg-primary/95 backdrop-blur-xl border border-white/20 shadow-2xl z-[9999]">
                {[
                  { code: "en", name: "English", countryCode: "gb" },
                  { code: "de", name: "Deutsch", countryCode: "de" },
                  { code: "bs", name: "Bosanski", countryCode: "ba" },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setIsLangOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-white/10 transition-all duration-300 ${currentLanguage === lang.code ? 'bg-accent/20 text-accent' : 'text-white/80'}`}
                  >
                    <img src={`https://flagcdn.com/w20/${lang.countryCode}.png`} alt={lang.name} className="w-5 h-auto rounded-sm" />
                    <span className="text-sm font-medium uppercase tracking-wider">{lang.code}</span>
                    {currentLanguage === lang.code && (
                      <svg className="w-3 h-3 text-accent ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-4 lg:h-6 w-px bg-white/20" />
          {/* Mobile: Compact color swatches */}
          <div className="lg:hidden">
            <MobileColorSwatches 
              value={shirtColor} 
              onChange={setShirtColor} 
              availableColors={availableColors}
            />
          </div>
          
          {/* Desktop: Full color swatches */}
          <div className="hidden lg:block">
            <ColorSwatches 
              value={shirtColor} 
              onChange={setShirtColor} 
              availableColors={availableColors}
            />
          </div>
          
          <div className="h-6 lg:h-8 w-px bg-white/20 hidden lg:block" />

          {/* Desktop: Size picker */}
          <SizePicker value={selectedSize} onChange={setSelectedSize} />

          <div className="h-6 lg:h-8 w-px bg-white/20 hidden lg:block" />
          
          {/* Mobile: price chip */}
          <div className="lg:hidden">
            <MobileZonePrice product={product} />
          </div>

          {/* Mobile: Hamburger menu for actions */}
          <div className="lg:hidden">
            <MobileActionsMenu 
              debugZones={debugZones}
              onToggleDebugZones={toggleDebugZones}
              onAddToCart={handleAddToCart}
              onCheckout={handleCheckout}
              cartCount={cartCount}
              selectedSize={selectedSize}
              onSizeChange={setSelectedSize}
            />
          </div>
          
          {/* Desktop: Full action buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <ZonePriceDisplay product={product} />
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-secondary/80 to-secondary hover:from-secondary hover:to-secondary-light text-white text-sm font-semibold transition-all shadow-lg relative"
              title="Add current design to cart"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {getText("cart_add") || "Add to Cart"}
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 text-[9px] font-black bg-accent rounded-full w-4 h-4 flex items-center justify-center text-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={handleCheckout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-light hover:from-accent-light hover:to-accent text-white text-sm font-bold transition-all shadow-lg shadow-accent/30"
              title="Buy now — goes straight to checkout"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {getText("checkout_pay_paypal") || "Pay Now"}
            </button>
            <button
              onClick={toggleDebugZones}
              className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-300 ${
                debugZones
                  ? "border-accent text-accent bg-accent/10 shadow-lg shadow-accent/20"
                  : "border-white/20 hover:border-accent/50 text-white/70 hover:text-white hover:bg-white/5"
              }`}
              title="Toggle print-area overlay (Shift+P)"
            >
              <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {getText("editor_zones")}
            </button>
            

          </div>
        </div>
      </header>

      {/* WORKSPACE */}
      <div className="flex-1 overflow-hidden relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '3s' }} />
        </div>
        
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-[280px_1fr_360px] h-full">
          <EditorSidebar fabricApi={fabricApi} />
          <div className="relative bg-gradient-to-br from-[#1E2447] via-[#0F1629] to-[#0A0E27] flex items-center justify-center">
            <ShirtCanvas modelId={product.modelId} initialCamera={initialCamera} />
          </div>
          <RightPanel
            key={product.id}
            fabricApi={fabricApi}
            onFabricReady={setFabricApi}
            model={model}
          />
        </div>
        
        {/* Mobile Layout */}
        <div className="lg:hidden h-full">
          <MobileEditor 
            key={product.id}
            fabricApi={fabricApi}
            onFabricReady={setFabricApi}
            model={model}
            product={product}
            initialCamera={initialCamera}
          />
        </div>
      </div>
    </div>
  );
}

// Desktop Color Swatches
function ColorSwatches({ value, onChange, availableColors = [] }) {
  // Fallback to default colors if no Firebase colors available
  const defaultColors = ["#ffffff", "#000000", "#0A1A17", "#FF6A00", "#A0AEC0"];
  const colors = availableColors.length > 0 
    ? availableColors.map(color => color.hex)
    : defaultColors;

  return (
    <div className="flex items-center gap-2">
      <div className="text-sm font-medium text-white/60 hidden sm:block">Color:</div>
      <div className="flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
        {colors.map((colorHex) => {
          // Find the color object to get the name for tooltip
          const colorObj = availableColors.find(c => c.hex === colorHex);
          const colorName = colorObj?.name || colorHex;
          
          return (
            <button
              key={colorHex}
              onClick={() => onChange(colorHex)}
              className={`w-8 h-8 rounded-lg border-2 transition-all duration-300 hover:scale-110 ${
                value === colorHex 
                  ? "border-accent shadow-lg shadow-accent/30 scale-110" 
                  : "border-white/30 hover:border-white/50"
              }`}
              style={{ backgroundColor: colorHex }}
              title={colorName}
              aria-label={`Select ${colorName} color`}
            />
          );
        })}
      </div>
      {availableColors.length === 0 && (
        <div className="text-xs text-white/40 ml-2 animate-pulse">
          Loading colors...
        </div>
      )}
    </div>
  );
}

// Mobile Color Swatches - Compact version
function MobileColorSwatches({ value, onChange, availableColors = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const defaultColors = ["#ffffff", "#000000", "#0A1A17", "#FF6A00", "#A0AEC0"];
  const colors = availableColors.length > 0 
    ? availableColors.map(color => color.hex)
    : defaultColors;

  // Get button position for fixed positioning
  const [buttonRect, setButtonRect] = useState(null);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonRect(rect);
    }
  }, [isOpen]);

  const dropdown = isOpen && buttonRect && (
    <>
      {/* Backdrop to close dropdown */}
      <div 
        className="fixed inset-0 z-[9998] bg-black/20" 
        onClick={() => setIsOpen(false)}
      />
      
      {/* Dropdown - Fixed positioning */}
      <div 
        className="fixed p-3 rounded-xl bg-primary border border-white/20 shadow-2xl z-[9999]"
        style={{
          top: `${buttonRect.bottom + 8}px`,
          left: `${buttonRect.left}px`,
        }}
      >
        <div className="grid grid-cols-3 gap-2">
          {colors.map((colorHex) => {
            const colorObj = availableColors.find(c => c.hex === colorHex);
            const colorName = colorObj?.name || colorHex;
            
            return (
              <button
                key={colorHex}
                onClick={() => {
                  onChange(colorHex);
                  setIsOpen(false);
                }}
                className={`w-10 h-10 rounded-lg border-2 transition-all ${
                  value === colorHex 
                    ? "border-accent shadow-lg shadow-accent/30" 
                    : "border-white/30 hover:border-white/50"
                }`}
                style={{ backgroundColor: colorHex }}
                title={colorName}
              />
            );
          })}
        </div>
      </div>
    </>
  );

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
      >
        <div
          className="w-6 h-6 rounded-lg border-2 border-white/30"
          style={{ backgroundColor: value }}
        />
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {dropdown && createPortal(dropdown, document.body)}
    </div>
  );
}

// Size picker for the desktop top bar
function SizePicker({ value, onChange }) {
  const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL'];
  return (
    <div className="hidden lg:flex items-center gap-2">
      <span className="text-sm font-medium text-white/60">Size:</span>
      <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
        {sizes.map((s) => (
          <button
            key={s}
            onClick={() => onChange(s)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${
              value === s
                ? 'bg-accent text-white shadow-sm shadow-accent/40'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

// Desktop zone-price breakdown shown in the top bar
function ZonePriceDisplay({ product }) {
  const designs = useEditorStore((s) => s.designs);
  const getZonePrices = useProductConfigStore((s) => s.getZonePrices);
  const zonePrices = getZonePrices(product.id);
  const hasDesign = (side) => (designs[side]?.objects?.length ?? 0) > 0;
  const zoneCost = ["front", "back", "sleeves"].reduce(
    (sum, side) => (hasDesign(side) ? sum + (zonePrices[side] ?? 0) : sum),
    0
  );
  const total = product.price + zoneCost;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
      <span className="text-[10px] text-white/40 font-medium uppercase tracking-widest hidden xl:block">Print</span>
      <div className="flex items-center gap-1">
        {["front", "back", "sleeves"].map((side) => {
          const active = hasDesign(side);
          return (
            <div
              key={side}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all duration-300 ${
                active
                  ? "bg-accent/20 text-accent border border-accent/30"
                  : "text-white/25 border border-white/10"
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${active ? "bg-accent" : "bg-white/20"}`} />
              {ZONE_LABELS[side]}
              {active && <span className="font-black">+${zonePrices[side]}</span>}
            </div>
          );
        })}
      </div>
      <div className="h-3 w-px bg-white/20" />
      <span className="text-sm font-black gradient-text">${total}</span>
    </div>
  );
}

// Compact price chip for the mobile top bar
function MobileZonePrice({ product }) {
  const designs = useEditorStore((s) => s.designs);
  const getZonePrices = useProductConfigStore((s) => s.getZonePrices);
  const zonePrices = getZonePrices(product.id);
  const hasDesign = (side) => (designs[side]?.objects?.length ?? 0) > 0;
  const zoneCost = ["front", "back", "sleeves"].reduce(
    (sum, side) => (hasDesign(side) ? sum + (zonePrices[side] ?? 0) : sum),
    0
  );
  const total = product.price + zoneCost;
  const activeCount = ["front", "back", "sleeves"].filter(hasDesign).length;

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
      {activeCount > 0 && (
        <span className="text-[9px] text-accent font-bold">{activeCount} zone{activeCount > 1 ? "s" : ""}</span>
      )}
      <span className="text-sm font-black gradient-text">${total}</span>
    </div>
  );
}

// Mobile Actions Menu
function MobileActionsMenu({ debugZones, onToggleDebugZones, onAddToCart, onCheckout, cartCount, selectedSize = 'M', onSizeChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const [buttonRect, setButtonRect] = useState(null);
  const getText = useContentStore((s) => s.getText);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonRect(rect);
    }
  }, [isOpen]);

  const dropdown = isOpen && buttonRect && (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[9998] bg-black/20" 
        onClick={() => setIsOpen(false)}
      />
      
      {/* Dropdown - Fixed positioning */}
      <div 
        className="fixed w-48 p-3 rounded-xl bg-primary border border-white/20 shadow-2xl z-[9999]"
        style={{
          top: `${buttonRect.bottom + 8}px`,
          right: `${window.innerWidth - buttonRect.right}px`,
        }}
      >
        <div className="space-y-2">
        {/* Size selector */}
        <div className="pb-1">
          <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 px-1">Size</p>
          <div className="flex gap-1">
            {['XS','S','M','L','XL','2XL'].map((s) => (
              <button
                key={s}
                onClick={() => onSizeChange?.(s)}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  selectedSize === s
                    ? 'bg-accent text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => {
            onToggleDebugZones();
            setIsOpen(false);
          }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
            debugZones
              ? "bg-accent/20 text-accent border border-accent/30"
              : "hover:bg-white/10 text-white/80"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Toggle Zones
        </button>
        
        <button
          onClick={() => { onAddToCart(); setIsOpen(false); }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-secondary/80 to-secondary text-white text-sm font-semibold relative"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Add to Cart
          {cartCount > 0 && (
            <span className="ml-auto text-[10px] font-black bg-accent/30 text-accent px-1.5 rounded-full">{cartCount}</span>
          )}
        </button>

        <button
          onClick={() => { onCheckout(); setIsOpen(false); }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-accent to-accent-light text-white text-sm font-bold"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Pay Now
        </button>
      </div>
    </div>
    </>
  );

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>
      
      {dropdown && createPortal(dropdown, document.body)}
    </div>
  );
}

// Mobile Editor Layout - Single Bottom Drawer with Combined View
function MobileEditor({ fabricApi, onFabricReady, model, product, initialCamera = null }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const selectedSide = useEditorStore((s) => s.selectedSide);
  const setDesign = useEditorStore((s) => s.setDesign);
  const getText = useContentStore((s) => s.getText);
  const dragStartY = useRef(null);
  const longPressTimer = useRef(null);

  // Save current design when panel closes
  const handlePanelToggle = () => {
    if (isPanelOpen && fabricApi?.canvas) {
      setDesign(selectedSide, fabricApi.canvas.toJSON());
    }
    setIsPanelOpen(!isPanelOpen);
  };

  const closePanel = () => {
    if (fabricApi?.canvas) setDesign(selectedSide, fabricApi.canvas.toJSON());
    setIsPanelOpen(false);
  };

  // Handle drag on the handle bar to close
  const onHandleTouchStart = (e) => {
    dragStartY.current = e.touches[0].clientY;
  };
  const onHandleTouchEnd = (e) => {
    if (dragStartY.current === null) return;
    const delta = e.changedTouches[0].clientY - dragStartY.current;
    dragStartY.current = null;
    if (delta > 40) closePanel();
  };

  // Long press on canvas to close panel
  const onCanvasTouchStart = () => {
    if (!isPanelOpen) return;
    longPressTimer.current = setTimeout(() => closePanel(), 500);
  };
  const onCanvasTouchEnd = () => {
    clearTimeout(longPressTimer.current);
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* 3D Canvas - Scales down when panel is open */}
      <motion.div
        animate={{
          height: isPanelOpen ? '45%' : '100%',
        }}
        transition={{
          type: 'spring',
          damping: 25,
          stiffness: 200,
          mass: 0.8
        }}
        className="w-full bg-gradient-to-br from-[#1E2447] via-[#0F1629] to-[#0A0E27] flex items-center justify-center relative overflow-hidden"
        onTouchStart={onCanvasTouchStart}
        onTouchEnd={onCanvasTouchEnd}
        onTouchMove={onCanvasTouchEnd}
      >
        <ShirtCanvas modelId={product.modelId} initialCamera={initialCamera} />
      </motion.div>

      {/* Bottom Open Button - Always Visible - Raised Higher for Mobile */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        <div className="flex flex-col items-center justify-center gap-2 pb-6 pointer-events-auto">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            animate={{ y: isPanelOpen ? -10 : 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            onClick={handlePanelToggle}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-xl transition-all duration-500 ${
              isPanelOpen
                ? 'bg-gradient-to-r from-accent to-accent-light text-white shadow-accent/40'
                : 'glass border border-white/20 text-white hover:border-accent/50'
            }`}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>{isPanelOpen ? getText("editor_close_editor") : getText("editor_open_editor")}</span>
            <motion.svg
              animate={{ rotate: isPanelOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-3.5 h-3.5"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </motion.button>

          {!isPanelOpen && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="text-white/30 text-[10px] font-medium tracking-widest uppercase"
            >
              {getText("editor_drag_hint")}
            </motion.p>
          )}
        </div>
      </div>

      {/* Bottom Drawer Panel - Compact with Semi-Transparency */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 200,
              mass: 0.8,
              opacity: { duration: 0.3 }
            }}
            className="absolute bottom-0 left-0 right-0 z-30 backdrop-blur-2xl bg-gradient-to-b from-primary/95 via-primary-lighter/95 to-primary/95 rounded-t-3xl shadow-2xl border-t-2 border-white/20 flex flex-col"
            style={{ height: '55%', maxHeight: '55vh' }}
          >
            {/* Drag Handle - swipe down to close */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              onTouchStart={onHandleTouchStart}
              onTouchEnd={onHandleTouchEnd}
              className="flex items-center justify-center py-4 border-b border-white/10 flex-shrink-0 cursor-grab active:cursor-grabbing touch-none"
            >
              <div className="w-12 h-1.5 bg-white/40 rounded-full" />
            </motion.div>

            {/* Single Scrollable Content - No Tabs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="flex-1 overflow-y-auto min-h-0"
            >
              <MobileCombinedPanel
                fabricApi={fabricApi}
                onFabricReady={onFabricReady}
                model={model}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Mobile Combined Panel - Tools + Canvas + Controls in Single Scrollable View
function MobileCombinedPanel({ fabricApi, onFabricReady, model }) {
  const fileRef = useRef(null);
  const selectedSide = useEditorStore((s) => s.selectedSide);
  const setSide = useEditorStore((s) => s.setSide);
  const selectedObjectId = useEditorStore((s) => s.selectedObjectId);
  const getText = useContentStore((s) => s.getText);
  const sideKeys = { front: "editor_front", back: "editor_back", sleeves: "editor_sleeves" };
  const sides = Object.keys(model?.printDecals || { front: 1, back: 1, sleeves: 1 });
  const active = fabricApi?.canvas?.getActiveObject();

  // Tool functions
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

  const update = (props) => {
    if (!active || !fabricApi) return;
    active.set(props);
    active.setCoords();
    fabricApi.canvas.requestRenderAll();
    fabricApi.canvas.fire("object:modified", { target: active });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Quick Start Guide - More Compact */}
      <div className="glass rounded-xl p-4 border border-accent/30 bg-gradient-to-br from-accent/10 to-accent/5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent-light flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-white text-base mb-2">{getText("editor_quick_guide")}</h4>
            <p className="text-xs text-white/70 leading-relaxed">{getText("editor_quick_guide_text")}</p>
          </div>
        </div>
      </div>

      {/* SECTION 1: Add Elements Tools - More Compact */}
      <div>
        <h3 className="font-heading font-bold text-lg gradient-text mb-3">{getText("editor_add_elements")}</h3>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={addText}
            className="flex flex-col items-center gap-2 p-3 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-accent/30 transition-all active:scale-95"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
              <span className="text-lg font-bold text-accent">T</span>
            </div>
            <span className="text-xs font-medium">{getText("editor_add_text")}</span>
          </button>

          <button
            onClick={() => fileRef.current?.click()}
            className="flex flex-col items-center gap-2 p-3 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-secondary/30 transition-all active:scale-95"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xs font-medium">{getText("editor_upload_image")}</span>
          </button>

          <button
            onClick={addRect}
            className="flex flex-col items-center gap-2 p-3 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-accent-light/30 transition-all active:scale-95"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-light/20 to-accent-light/10 flex items-center justify-center">
              <div className="w-5 h-5 bg-accent-light rounded-sm" />
            </div>
            <span className="text-xs font-medium">{getText("editor_rectangle")}</span>
          </button>

          <button
            onClick={addCircle}
            className="flex flex-col items-center gap-2 p-3 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-secondary-light/30 transition-all active:scale-95"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary-light/20 to-secondary-light/10 flex items-center justify-center">
              <div className="w-5 h-5 bg-secondary-light rounded-full" />
            </div>
            <span className="text-xs font-medium">{getText("editor_circle")}</span>
          </button>
        </div>

        <button
          onClick={deleteSelected}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-gradient-to-br from-red-500/20 to-red-500/10 border border-red-500/30 text-red-300 active:scale-95 transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span className="text-sm font-medium">{getText("editor_delete")}</span>
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onUpload}
        />
      </div>

      {/* SECTION 2: Design Area Selection - More Compact */}
      <div>
        <h3 className="font-heading font-bold text-lg gradient-text mb-3">{getText("editor_design_area")}</h3>
        <div className="flex rounded-lg bg-white/5 p-1 border border-white/10">
          {sides.map((s) => (
            <button
              key={s}
              onClick={() => setSide(s)}
              className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all ${
                selectedSide === s
                  ? "bg-gradient-to-r from-accent to-accent-light text-white shadow-lg"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {getText(sideKeys[s] || s)}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 3: Design Canvas - Compact but Visible */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-heading font-bold text-lg gradient-text">{getText("editor_canvas")}</h4>
            <p className="text-xs text-white/50 capitalize">{getText(sideKeys[selectedSide] || selectedSide)}</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-accent/10 border border-accent/20">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-medium text-accent">{getText("editor_live_sync")}</span>
          </div>
        </div>

        {/* Canvas Container - Compact */}
        <div className="relative rounded-xl overflow-hidden border-2 border-white/20 bg-gradient-to-br from-[#1E2447] via-[#0F1629] to-[#0A0E27] shadow-xl">
          <FabricEditor
            onReady={onFabricReady}
            printDecals={model?.printDecals}
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Helper Text - Compact */}
        <div className="mt-2 flex items-start gap-2 px-3 py-2 rounded-lg bg-secondary/5 border border-secondary/10">
          <svg className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-white/70 leading-relaxed">
            {getText("editor_canvas_hint")}
          </p>
        </div>
      </div>

      {/* SECTION 4: Element Controls - Compact */}
      <div>
        <h4 className="font-heading font-bold text-lg gradient-text mb-3">{getText("editor_edit_element")}</h4>

        {!active && (
          <div className="glass rounded-lg p-4 text-center border border-white/10">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.121 2.122" />
              </svg>
            </div>
            <p className="text-sm font-medium text-white/70 mb-1">{getText("editor_no_selection")}</p>
            <p className="text-xs text-white/50">{getText("editor_no_selection_tap")}</p>
          </div>
        )}

        {active && (
          <div className="space-y-3">
            <MobileRange label={getText("editor_scale")} icon="⚡" min={0.2} max={3} step={0.05} value={active.scaleX || 1} onChange={(v) => update({ scaleX: v, scaleY: v })} />
            <MobileRange label={getText("editor_position_x")} icon="↔" min={0} max={512} step={1} value={active.left || 0} onChange={(v) => update({ left: v })} />
            <MobileRange label={getText("editor_position_y")} icon="↕" min={0} max={512} step={1} value={active.top || 0} onChange={(v) => update({ top: v })} />
            <MobileRange label={getText("editor_rotation")} icon="🔄" min={-180} max={180} step={1} value={active.angle || 0} onChange={(v) => update({ angle: v })} />

            {(active.type === "i-text" || active.type === "text") && (
              <div className="glass rounded-lg p-3 border border-white/10">
                <label className="flex items-center gap-2 text-xs font-medium text-white/80 mb-2">
                  <span className="text-base">🎨</span>
                  {getText("editor_text_color")}
                </label>
                <div className="flex items-center gap-3">
                  <input type="color" value={active.fill || "#000000"} onChange={(e) => update({ fill: e.target.value })} className="w-10 h-10 rounded-lg border-2 border-white/20 cursor-pointer" />
                  <div className="flex-1">
                    <div className="text-xs text-white/50 mb-0.5">{getText("editor_current_color")}</div>
                    <div className="text-xs font-mono text-white/80">{active.fill || "#000000"}</div>
                  </div>
                </div>
              </div>
            )}

            {(active.type === "rect" || active.type === "circle") && (
              <div className="glass rounded-lg p-3 border border-white/10">
                <label className="flex items-center gap-2 text-xs font-medium text-white/80 mb-2">
                  <span className="text-base">🎨</span>
                  {getText("editor_shape_color")}
                </label>
                <div className="flex items-center gap-3">
                  <input type="color" value={active.fill || "#FF6A00"} onChange={(e) => update({ fill: e.target.value })} className="w-10 h-10 rounded-lg border-2 border-white/20 cursor-pointer" />
                  <div className="flex-1">
                    <div className="text-xs text-white/50 mb-0.5">{getText("editor_current_color")}</div>
                    <div className="text-xs font-mono text-white/80">{active.fill || "#FF6A00"}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* invisible spy: re-render when selection changes */}
      <span className="hidden" data-id={selectedObjectId} />
    </div>
  );
}

// Mobile Range Component
function MobileRange({ label, icon, value, onChange, ...rest }) {
  return (
    <div className="glass rounded-lg p-3 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center gap-1.5 text-xs font-medium text-white/80">
          <span className="text-base">{icon}</span>
          {label}
        </label>
        <div className="px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20">
          <span className="text-xs font-mono text-accent">{Number(value).toFixed(2)}</span>
        </div>
      </div>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
        {...rest}
      />
    </div>
  );
}

