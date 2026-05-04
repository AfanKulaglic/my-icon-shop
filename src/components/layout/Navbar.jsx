import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, User, Search } from "../ui/Icons.jsx";
import { useContentStore } from "../../store/contentStore.js";
import EditableText from "../admin/EditableText.jsx";
import EditableIcon from "../admin/EditableIcon.jsx";
import { products } from "../../utils/products.js";
import { useCartWishlistStore } from "../../store/cartWishlistStore.js";

const navItem =
  "relative text-sm font-medium text-white/80 hover:text-white transition-all duration-300 uppercase tracking-wider";
const activeItem = "text-white";

export default function Navbar() {
  const currentLanguage = useContentStore((s) => s.currentLanguage);
  const setLanguage = useContentStore((s) => s.setLanguage);
  const getText = useContentStore((s) => s.getText);
  const navigate = useNavigate();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchHighlight, setSearchHighlight] = useState(-1);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef(null);

  // Translated page links
  const pageLinks = useMemo(() => [
    { label: getText("nav_home"),     url: "/",       hint: getText("nav_search_hint_home")     || "Home" },
    { label: getText("nav_shop"),     url: "/shop",   hint: getText("nav_search_hint_shop")     || "Shop" },
    { label: getText("nav_about"),    url: "/about",  hint: getText("nav_search_hint_about")    || "About" },
    { label: getText("nav_contact"),  url: "/contact",hint: getText("nav_search_hint_contact")  || "Contact" },
  ], [getText]);

  // Translated category names for matching
  const catMap = useMemo(() => ({
    Polos:       getText("shop_cat_polos"),
    Hoodies:     getText("shop_cat_hoodies"),
    "T-Shirts":  getText("shop_cat_tshirts"),
    Accessories: getText("shop_cat_accessories"),
  }), [getText]);

  // Build search index from products
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const results = [];

    // Products
    products.forEach((p) => {
      const translatedCat = catMap[p.category] || p.category;
      const haystack = [p.name, p.description, p.category, translatedCat]
        .join(" ").toLowerCase();
      if (haystack.includes(q)) {
        results.push({
          type: "product",
          label: p.name,
          hint: `${translatedCat} · $${p.price}`,
          url: `/product/${p.id}`,
          image: p.image,
        });
      }
    });

    // Category shortcuts
    Object.entries(catMap).forEach(([key, translated]) => {
      if (translated.toLowerCase().includes(q) || key.toLowerCase().includes(q)) {
        results.push({
          type: "category",
          label: translated,
          hint: getText("shop_filter_category"),
          url: `/shop?category=${key.toLowerCase()}`,
          image: null,
        });
      }
    });

    // Pages
    pageLinks.forEach((pg) => {
      if (pg.label.toLowerCase().includes(q)) {
        results.push({ type: "page", label: pg.label, hint: pg.hint, url: pg.url, image: null });
      }
    });

    return results.slice(0, 8);
  }, [searchQuery, catMap, pageLinks, getText]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchHighlight >= 0 && searchResults[searchHighlight]) {
      navigate(searchResults[searchHighlight].url);
    } else if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
    setSearchQuery("");
    setSearchOpen(false);
  };

  const handleSearchKeyDown = (e) => {
    if (!searchOpen) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setSearchHighlight(h => Math.min(h + 1, searchResults.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSearchHighlight(h => Math.max(h - 1, -1)); }
    else if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); }
  };

  // Close search on outside click
  useEffect(() => {
    const handler = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const root = document.getElementById("root");
      const scrollTop = root ? root.scrollTop : window.scrollY;
      setIsScrolled((scrollTop || window.scrollY) > 50);
    };

    const root = document.getElementById("root");
    if (root) root.addEventListener("scroll", handleScroll);
    window.addEventListener("scroll", handleScroll);
    return () => {
      const root = document.getElementById("root");
      if (root) root.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const languages = [
    { code: "en", name: "English", countryCode: "gb", nativeName: "English" },
    { code: "de", name: "Deutsch", countryCode: "de", nativeName: "Deutsch" },
    { code: "bs", name: "Bosanski", countryCode: "ba", nativeName: "Bosanski" },
  ];

  const categories = [
    { 
      name: "nav_category_man", 
      icon: "nav_category_man_icon", 
      items: ["nav_category_man_item1", "nav_category_man_item2", "nav_category_man_item3"] 
    },
    { 
      name: "nav_category_woman", 
      icon: "nav_category_woman_icon", 
      items: ["nav_category_woman_item1", "nav_category_woman_item2"] 
    },
    { 
      name: "nav_category_others", 
      icon: "nav_category_others_icon", 
      items: ["nav_category_others_item1", "nav_category_others_item2"] 
    },
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];
  const cartCount = useCartWishlistStore((s) => s.cart.reduce((sum, i) => sum + i.quantity, 0));
  const wishlistCount = useCartWishlistStore((s) => s.wishlist.length);
  
  return (
    <header className="w-full backdrop-blur-2xl bg-primary/95 border-b border-white/10 shadow-lg">
      {/* Top Bar - Animated out when scrolled */}
      <AnimatePresence initial={false}>
        {!isScrolled && (
          <motion.div
            key="top-bar"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="border-b border-white/5"
            style={{ overflow: searchOpen && searchResults.length > 0 ? "visible" : "hidden" }}
          >
            <div className="container-x h-32 flex items-center justify-between">
              {/* Left - Search */}
              <div className="flex items-center gap-4 flex-1 pt-16">
                <div className="relative w-64" ref={searchRef}>
                  <form onSubmit={handleSearchSubmit}>
                    <input
                      type="text"
                      placeholder={getText("nav_search_placeholder")}
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); setSearchHighlight(-1); }}
                      onFocus={() => setSearchOpen(true)}
                      onKeyDown={handleSearchKeyDown}
                      className="w-full bg-transparent border-b border-white/20 focus:border-accent/50 outline-none py-2 pr-8 text-sm text-white placeholder-white/40 transition-all duration-300 uppercase tracking-wider font-bold"
                    />
                    <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-white/60 hover:text-accent transition-colors duration-300">
                      <Search className="w-4 h-4" />
                    </button>
                  </form>

                  {/* Results dropdown */}
                  <AnimatePresence>
                    {searchOpen && searchResults.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-80 rounded-xl border border-white/20 bg-[#0f1631] shadow-2xl overflow-hidden z-[9999]"
                      >
                        {searchResults.map((r, i) => (
                          <Link
                            key={i}
                            to={r.url}
                            onClick={() => { setSearchQuery(""); setSearchOpen(false); }}
                            className={`flex items-center gap-3 px-4 py-2.5 transition-all duration-150 ${i === searchHighlight ? "bg-accent/20 text-accent" : "text-white/80 hover:bg-white/8 hover:text-white"}`}
                          >
                            {r.image ? (
                              <img src={r.image} alt={r.label} className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-white/10" />
                            ) : (
                              <div className={`w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center border border-white/10 ${r.type === "category" ? "bg-accent/15" : "bg-white/8"}`}>
                                {r.type === "category" && <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>}
                                {r.type === "page" && <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold truncate">{r.label}</div>
                              <div className="text-xs text-white/40 truncate">{r.hint}</div>
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Center - Logo */}
              <Link
                to="/"
                className="flex items-center gap-4 group absolute left-1/2 -translate-x-1/2"
              >
                <img 
                  src="/images/logo.webp" 
                  alt="my-icon.shop" 
                  className="h-16 w-auto transition-transform duration-300 group-hover:scale-110"
                />
                <span className="font-heading text-3xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-white via-accent-light to-white bg-clip-text text-transparent group-hover:from-accent-light group-hover:via-secondary group-hover:to-accent-light transition-all duration-500">
                    my-icon
                  </span>
                  <span className="text-accent group-hover:text-secondary transition-colors duration-300">.</span>
                  <span className="bg-gradient-to-r from-white via-accent-light to-white bg-clip-text text-transparent group-hover:from-accent-light group-hover:via-secondary group-hover:to-accent-light transition-all duration-500">
                    shop
                  </span>
                </span>
              </Link>

              {/* Right - Wishlist & Bag */}
              <div className="flex items-center gap-6 flex-1 justify-end pt-16">
                <Link 
                  to="/wishlist"
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-all duration-300 text-sm uppercase tracking-wider relative" 
                  aria-label="Wishlist"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <EditableText id="nav_wishlist" as="span" className="text-xs font-medium" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 text-[10px] font-bold bg-gradient-to-r from-accent to-secondary rounded-full w-4 h-4 flex items-center justify-center text-white">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                
                <Link
                  to="/cart"
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-all duration-300 text-sm uppercase tracking-wider relative"
                  aria-label="Cart"
                >
                  <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                  <EditableText id="nav_bag" as="span" className="text-xs font-medium" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 text-[10px] font-bold bg-gradient-to-r from-accent to-secondary rounded-full w-4 h-4 flex items-center justify-center text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mega Menu Dropdown */}
      {isMegaMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-primary backdrop-blur-2xl border-b border-white/10 shadow-2xl z-40">
          <div className="container-x py-8">
            <div className="grid grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <div key={category.name} className="group">
                  <Link
                    to={`/shop?category=${getText(category.name).toLowerCase()}`}
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent/30 transition-all duration-300"
                  >
                    <div className="text-4xl">
                      <EditableIcon id={category.icon} className="w-10 h-10 text-accent" />
                    </div>
                    <div className="flex-1">
                      <EditableText 
                        id={category.name} 
                        as="h3" 
                        className="text-xl font-bold text-white mb-2 uppercase tracking-wider" 
                      />
                      <div className="flex flex-wrap gap-2">
                        {category.items.map((item) => (
                          <EditableText
                            key={item}
                            id={item}
                            as="span"
                            className="text-xs text-white/60 group-hover:text-white/80 transition-colors duration-300"
                          />
                        ))}
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Bar - Navigation */}
      <motion.div
        className="w-full border-b border-white/5"
        animate={{ height: isScrolled ? 64 : 80 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      >
        <nav className="container-x h-full flex items-center gap-12 relative">
          {/* Hamburger Menu - Aligned with Search */}
          <button
            onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
            className="flex flex-col gap-1.5 w-6 h-6 group"
            aria-label="Menu"
          >
            <span className={`w-full h-0.5 bg-accent transition-all duration-300 ${isMegaMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-full h-0.5 bg-accent transition-all duration-300 ${isMegaMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-full h-0.5 bg-accent transition-all duration-300 ${isMegaMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>

          {/* Navigation Links - Centered */}
          <div className="flex-1 flex items-center justify-center gap-12">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${navItem} ${isActive ? activeItem : ""}`
              }
            >
              <EditableText id="nav_home" as="span" />
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `${navItem} ${isActive ? activeItem : ""}`
              }
            >
              <EditableText id="nav_shop" as="span" />
            </NavLink>
            <NavLink 
              to="/editor" 
              className={navItem}
            >
              <span className="flex items-center gap-2">
                <EditableText id="nav_studio" as="span" />
                <EditableText 
                  id="nav_studio_badge" 
                  as="span" 
                  className="text-[9px] px-1.5 py-0.5 rounded bg-accent/20 text-accent border border-accent/30" 
                />
              </span>
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `${navItem} ${isActive ? activeItem : ""}`
              }
            >
              <EditableText id="nav_about" as="span" />
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `${navItem} ${isActive ? activeItem : ""}`
              }
            >
              <EditableText id="nav_contact" as="span" />
            </NavLink>
          </div>

          {/* Right - Language Switcher */}
          <div className="flex items-center gap-6">
            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 text-accent hover:text-accent-light transition-all duration-300 text-sm uppercase tracking-wider"
              >
                <span className="font-bold">{currentLang.code}</span>
                <svg className={`w-3 h-3 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isLangOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 py-2 rounded-xl bg-primary/95 backdrop-blur-xl border border-white/20 shadow-2xl z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-white/10 transition-all duration-300 ${
                        currentLanguage === lang.code ? 'bg-accent/20 text-accent' : 'text-white/80'
                      }`}
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
          </div>
        </nav>
      </motion.div>
    </header>
  );
}
