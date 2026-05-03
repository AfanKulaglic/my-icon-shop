import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { products } from "../utils/products.js";
import { useProductConfigStore } from "../store/productConfigStore.js";
import { useContentStore } from "../store/contentStore.js";
import { useCartWishlistStore } from "../store/cartWishlistStore.js";

const allCategories = ["All", "Polos", "Hoodies", "T-Shirts", "Accessories"];
const allSizes = ["XS", "S", "M", "L", "XL", "XXL"];

export default function Shop() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const urlCategory = searchParams.get('category');
  
  const configs = useProductConfigStore((s) => s.configs);
  const initFirebase = useProductConfigStore((s) => s.initFirebase);
  const getAvailableColors = useProductConfigStore((s) => s.getAvailableColors);
  const getText = useContentStore((s) => s.getText);
  const currentLanguage = useContentStore((s) => s.currentLanguage);
  const setLanguage = useContentStore((s) => s.setLanguage);
  
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [category, setCategory] = useState("All");
  const [genderCategory, setGenderCategory] = useState(urlCategory || "all");
  const [size, setSize] = useState(null);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(100);
  const [sortBy, setSortBy] = useState("featured");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const toggleWishlist = useCartWishlistStore((s) => s.toggleWishlist);
  const isWishlisted = useCartWishlistStore((s) => s.isWishlisted);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    initFirebase();
  }, [initFirebase]);

  useEffect(() => {
    if (urlCategory) {
      setGenderCategory(urlCategory);
    }
  }, [urlCategory]);

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (genderCategory && genderCategory !== "all") {
        const productConfig = configs[p.id];
        const productCategory = productConfig?.category || 'man';
        if (productCategory !== genderCategory) return false;
      }
      
      if (category !== "All" && p.category !== category) return false;
      if (size && !p.sizes.includes(size)) return false;
      if (p.price < priceMin || p.price > priceMax) return false;
      return true;
    });

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [category, genderCategory, size, priceMin, priceMax, sortBy, configs]);

  const genderCategories = useMemo(() => [
    { id: "all", label: getText("shop_col_all") },
    { id: "man", label: getText("shop_col_men") },
    { id: "woman", label: getText("shop_col_women") },
    { id: "others", label: getText("shop_col_unisex") }
  ], [getText]);

  const categoryLabels = useMemo(() => ({
    "All": getText("shop_cat_all"),
    "Polos": getText("shop_cat_polos"),
    "Hoodies": getText("shop_cat_hoodies"),
    "T-Shirts": getText("shop_cat_tshirts"),
    "Accessories": getText("shop_cat_accessories"),
  }), [getText]);

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row bg-gradient-to-br from-primary via-primary-lighter to-primary">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] bg-accent/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute bottom-0 left-0 w-[500px] h-[500px] lg:w-[700px] lg:h-[700px] bg-secondary/20 rounded-full blur-[120px]"
        />
      </div>

      {/* MOBILE: Top Header */}
      <header className="lg:hidden h-16 border-b border-white/10 backdrop-blur-xl bg-gradient-to-r from-primary/90 via-primary-light/90 to-primary/90 flex items-center px-4 gap-3 relative z-[9999]">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-secondary/5 pointer-events-none" />

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-all duration-300 group relative z-10"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">{getText("shop_back")}</span>
        </button>

        <div className="h-4 lg:h-6 w-px bg-white/20 relative z-10" />

        <Link to="/" className="flex items-center gap-2 lg:gap-3 group relative z-10">
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center shadow-lg shadow-accent/20 group-hover:shadow-glow transition-all duration-300">
            <img src="/images/logo.png" alt="my-icon.shop" className="w-5 h-5 lg:w-6 lg:h-6 transition-transform duration-300 group-hover:scale-110" />
          </div>
          <span className="font-heading text-base lg:text-lg font-bold hidden sm:block">
            <span className="bg-gradient-to-r from-white via-accent-light to-white bg-clip-text text-transparent group-hover:from-accent-light group-hover:via-secondary group-hover:to-accent-light transition-all duration-500">my-icon</span>
            <span className="text-accent group-hover:text-secondary transition-colors duration-300">.</span>
            <span className="bg-gradient-to-r from-white via-accent-light to-white bg-clip-text text-transparent group-hover:from-accent-light group-hover:via-secondary group-hover:to-accent-light transition-all duration-500">shop</span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2 relative z-10">
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

          <div className="h-4 w-px bg-white/20" />

          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {getText("shop_filters")}
          </button>
        </div>
      </header>

      {/* LEFT SIDEBAR - Desktop & Mobile Drawer */}
      <motion.div 
        initial={{ x: -300, opacity: 0 }}
        animate={{ 
          x: showFilters ? 0 : (window.innerWidth < 1024 ? -300 : 0),
          opacity: showFilters || window.innerWidth >= 1024 ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`${showFilters ? 'fixed inset-0 z-50' : 'hidden'} lg:flex lg:relative lg:w-96 border-r border-white/10 flex-col bg-gradient-to-b from-primary via-primary-lighter to-primary`}
      >
        {/* Mobile Overlay */}
        {showFilters && (
          <div 
            className="lg:hidden absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowFilters(false)}
          />
        )}

        {/* Sidebar Content */}
        <div className="relative z-10 w-80 h-full bg-gradient-to-b from-primary via-primary-lighter to-primary flex flex-col lg:w-96">
          {/* Header - Desktop Only */}
          <div className="hidden lg:flex h-[88px] px-6 border-b border-white/10 items-center">
            <div className="flex items-center gap-4 w-full">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-all duration-300 group"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {getText("shop_back")}
              </button>

              <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center shadow-lg shadow-accent/20 group-hover:shadow-glow transition-all duration-300">
                  <img src="/images/logo.png" alt="my-icon.shop" className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="font-heading text-xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-white via-accent-light to-white bg-clip-text text-transparent group-hover:from-accent-light group-hover:via-secondary group-hover:to-accent-light transition-all duration-500">my-icon</span>
                  <span className="text-accent group-hover:text-secondary transition-colors duration-300">.</span>
                  <span className="bg-gradient-to-r from-white via-accent-light to-white bg-clip-text text-transparent group-hover:from-accent-light group-hover:via-secondary group-hover:to-accent-light transition-all duration-500">shop</span>
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile Header - BIGGER */}
          <div className="lg:hidden flex items-center justify-between p-3 lg:p-6 border-b border-white/10">
            <h2 className="text-lg lg:text-2xl font-bold text-white">{getText("shop_filters")}</h2>
            <button
              onClick={() => setShowFilters(false)}
              className="w-9 h-9 lg:w-12 lg:h-12 rounded-xl glass flex items-center justify-center text-white/70"
            >
              <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Filters - BIGGER ON MOBILE */}
          <div className="flex-1 overflow-y-auto p-3 lg:p-8 space-y-5 lg:space-y-8 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
            {/* Gender */}
            <div>
              <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-4">{getText("shop_filter_collection")}</h3>
              <div className="space-y-3">
                {genderCategories.map((g) => (
                  <motion.button
                    key={g.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setGenderCategory(g.id)}
                    className={`w-full text-left px-3 py-2.5 lg:px-4 lg:py-3 rounded-xl transition-all duration-300 text-sm ${
                      genderCategory === g.id
                        ? "bg-gradient-to-r from-accent to-accent-light text-white font-bold shadow-lg shadow-accent/25"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {g.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-4">{getText("shop_filter_category")}</h3>
              <div className="space-y-3">
                {allCategories.map((c) => (
                  <motion.button
                    key={c}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCategory(c)}
                    className={`w-full text-left px-3 py-2.5 lg:px-4 lg:py-3 rounded-xl transition-all duration-300 text-sm ${
                      category === c
                        ? "bg-gradient-to-r from-accent to-accent-light text-white font-bold shadow-lg shadow-accent/25"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {categoryLabels[c] || c}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-4">{getText("shop_filter_size")}</h3>
              <div className="grid grid-cols-3 gap-3">
                {allSizes.map((s) => (
                  <motion.button
                    key={s}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSize(size === s ? null : s)}
                    className={`aspect-square rounded-xl text-sm font-bold transition-all duration-300 ${
                      size === s
                        ? "bg-gradient-to-br from-accent to-accent-light text-white shadow-lg shadow-accent/25"
                        : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                    }`}
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-4">
                {getText("shop_filter_price")}: ${priceMin} - ${priceMax}
              </h3>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priceMin}
                  onChange={(e) => setPriceMin(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-4">{getText("shop_filter_sort_by")}</h3>
              <div className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="w-full flex items-center justify-between px-3 py-2.5 lg:px-4 lg:py-3 rounded-xl border border-white/20 bg-gradient-to-br from-white/8 to-white/4 text-white text-sm hover:border-accent/50 hover:from-white/12 hover:to-white/6 transition-all duration-200 shadow-inner"
                >
                  <span className="font-medium">
                    {sortBy === 'featured' && getText('shop_sort_featured')}
                    {sortBy === 'price-low' && getText('shop_sort_price_low')}
                    {sortBy === 'price-high' && getText('shop_sort_price_high')}
                    {sortBy === 'name' && getText('shop_sort_name')}
                  </span>
                  <svg className={`w-4 h-4 text-white/50 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isSortOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-white/20 bg-[#0d1225]/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50">
                    {[
                      { value: 'featured', label: getText('shop_sort_featured') },
                      { value: 'price-low', label: getText('shop_sort_price_low') },
                      { value: 'price-high', label: getText('shop_sort_price_high') },
                      { value: 'name', label: getText('shop_sort_name') },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value); setIsSortOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 lg:px-4 lg:py-2.5 text-left text-sm transition-all duration-150 ${
                          sortBy === opt.value
                            ? 'bg-accent/20 text-accent font-semibold'
                            : 'text-white/80 hover:bg-white/8 hover:text-white'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {sortBy === opt.value && (
                          <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results count & Apply Button - BIGGER */}
          <div className="p-3 lg:p-8 border-t border-white/10 space-y-3 lg:space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 lg:w-2 lg:h-2 rounded-full bg-accent animate-pulse" />
              <div className="text-base lg:text-sm text-white/40">
                <span className="text-white font-bold">{filtered.length}</span> {getText("shop_filter_category").toLowerCase()}
              </div>
            </div>
            
            {/* Reset Button */}
            <button
              onClick={() => {
                setCategory("All");
                setGenderCategory("all");
                setSize(null);
                setPriceMin(0);
                setPriceMax(100);
              }}
              className="w-full py-2.5 lg:py-2.5 rounded-xl glass glass-hover text-white/60 hover:text-white text-sm font-medium transition-all duration-300 border border-white/10"
            >
              {getText("shop_reset")}
            </button>

            {/* Mobile Apply Button - BIGGER */}
            <button
              onClick={() => setShowFilters(false)}
              className="lg:hidden w-full btn-accent py-3 text-base font-bold"
            >
              {getText("shop_apply_filters")}
            </button>
          </div>
        </div>
      </motion.div>

      {/* RIGHT SIDE - Products Grid */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Top Bar - Desktop Only */}
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="hidden lg:flex h-[88px] border-b border-white/10 px-6 lg:px-12 items-center justify-between backdrop-blur-xl overflow-visible relative z-[9999]"
        >
          <div>
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-white mb-1">{getText("shop_title")}</h1>
            <p className="text-xs lg:text-sm text-white/40">{getText("shop_description")}</p>
          </div>
          
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 text-accent hover:text-accent-light transition-all duration-300 text-sm uppercase tracking-wider font-bold"
            >
              <img src={`https://flagcdn.com/w20/${{en:'gb',de:'de',bs:'ba'}[currentLanguage]}.png`} alt={currentLanguage} className="w-5 h-auto rounded-sm" />
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
        </motion.div>

        {/* Products Grid */}
        <div className="flex-1 lg:overflow-y-auto overflow-x-hidden p-3 lg:p-12">
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div
                key="products"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-8"
              >
                {filtered.map((product, i) => {
                  const availableColors = getAvailableColors(product.id);
                  const displayColors = availableColors.length > 0 
                    ? availableColors.map(c => c.hex)
                    : product.colors;

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03, duration: 0.4 }}
                      onHoverStart={() => setHoveredProduct(product.id)}
                      onHoverEnd={() => setHoveredProduct(null)}
                      className="group h-full"
                    >
                      <Link to={`/product/${product.id}`} className="flex flex-col h-full">
                        {/* Image - ENHANCED FOR MOBILE */}
                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 lg:mb-4 glass border border-white/10 group-hover:border-accent/30 transition-all duration-300 shadow-xl">
                          {/* Gradient overlay for better text contrast on mobile */}
                          <div className="lg:hidden absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent pointer-events-none z-10" />
                          
                          {product.image ? (
                            <motion.img
                              src={product.image}
                              alt={product.name}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover"
                              animate={{
                                scale: hoveredProduct === product.id ? 1.05 : 1
                              }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20 text-base lg:text-xs">
                              {product.name}
                            </div>
                          )}
                          
                          {/* Overlay on hover - Desktop Only */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: hoveredProduct === product.id ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="hidden lg:flex absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent items-end justify-center pb-6"
                          >
                            <motion.div
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ 
                                y: hoveredProduct === product.id ? 0 : 20,
                                opacity: hoveredProduct === product.id ? 1 : 0
                              }}
                              transition={{ duration: 0.3, delay: 0.1 }}
                              className="flex gap-2"
                            >
                              <Link
                                to={`/product/${product.id}`}
                                className="px-4 py-2 rounded-lg glass border border-white/20 text-white text-xs font-medium hover:bg-white/20 transition-all"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {getText("shop_view")}
                              </Link>
                              <Link
                                to={`/editor/${product.id}`}
                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-accent to-accent-light text-white text-xs font-bold hover:from-accent-hover hover:to-accent transition-all shadow-lg shadow-accent/25"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {getText("shop_design")}
                              </Link>
                            </motion.div>
                          </motion.div>

                          {/* Category badge - COMPACT ON MOBILE */}
                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-1 rounded-lg bg-accent text-white text-[10px] font-bold shadow-lg">
                              {product.category}
                            </span>
                          </div>

                          {/* Wishlist button */}
                          <button
                            onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110"
                          >
                            <svg className={`w-3.5 h-3.5 transition-colors duration-300 ${isWishlisted(product.id) ? 'text-accent fill-accent' : 'text-white/70'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill={isWishlisted(product.id) ? 'currentColor' : 'none'}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                        </div>

                        {/* Info - COMPACT ON MOBILE */}
                        <div className="flex-1 flex flex-col space-y-2 lg:space-y-3">
                          <div className="flex items-start justify-between gap-2 min-h-[2.5rem] lg:min-h-[3.5rem]">
                            <h3 className="text-xs lg:text-lg font-bold text-white group-hover:text-accent-light transition-colors line-clamp-2 leading-snug">
                              {product.name}
                            </h3>
                            <span className="text-sm lg:text-lg font-black gradient-text whitespace-nowrap">
                              ${product.price}
                            </span>
                          </div>

                          {/* Colors - COMPACT ON MOBILE */}
                          <div className="flex items-center gap-1.5 lg:gap-2">
                            {displayColors.slice(0, 4).map((color, i) => (
                              <motion.div
                                key={i}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-4 h-4 lg:w-6 lg:h-6 rounded-full border border-white/30 shadow-md"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                            {displayColors.length > 4 && (
                              <span className="text-[10px] lg:text-xs text-white/50 ml-1 font-semibold">
                                +{displayColors.length - 4}
                              </span>
                            )}
                          </div>

                          {/* Mobile Action Buttons */}
                          <div className="mt-auto lg:hidden flex flex-col gap-1.5">
                            <Link
                              to={`/product/${product.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex-1 py-1.5 rounded-lg glass border border-white/20 text-white text-[11px] font-semibold text-center hover:bg-white/10 transition-all duration-300"
                            >
                              {getText("shop_view")}
                            </Link>
                            <Link
                              to={`/editor/${product.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex-1 py-1.5 rounded-lg bg-gradient-to-r from-accent to-accent-light text-white text-[11px] font-bold text-center hover:shadow-xl hover:shadow-accent/50 transition-all duration-300 flex items-center justify-center gap-1.5"
                            >
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                              {getText("shop_design_now")}
                            </Link>
                          </div>

                          {/* Sizes - Desktop Only */}
                          <div className="hidden lg:flex items-center gap-2 text-xs text-white/40">
                            {product.sizes.map((s, i) => (
                              <span key={s}>
                                {s}{i < product.sizes.length - 1 && " · "}
                              </span>
                            ))}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full flex items-center justify-center p-4"
              >
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 lg:w-24 lg:h-24 mx-auto mb-4 lg:mb-6 rounded-full bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center">
                    <svg className="w-8 h-8 lg:w-12 lg:h-12 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-heading font-bold text-white mb-2 lg:mb-3">{getText("shop_no_products_title")}</h3>
                  <p className="text-sm lg:text-base text-white/40 mb-6 lg:mb-8">
                    {getText("shop_no_products_hint")}
                  </p>
                  <button
                    onClick={() => {
                      setCategory("All");
                      setGenderCategory("all");
                      setSize(null);
                      setPriceMin(0);
                      setPriceMax(100);
                    }}
                    className="btn-accent text-sm lg:text-base px-6 py-2.5 lg:px-8 lg:py-3"
                  >
                    Reset Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
