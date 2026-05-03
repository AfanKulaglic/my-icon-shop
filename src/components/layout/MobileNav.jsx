import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "../ui/Icons.jsx";
import { useContentStore } from "../../store/contentStore.js";
import EditableText from "../admin/EditableText.jsx";
import EditableIcon from "../admin/EditableIcon.jsx";
import { useCartWishlistStore } from "../../store/cartWishlistStore.js";

const navItem = "text-lg font-bold text-white/80 hover:text-white transition-all duration-300 uppercase tracking-wider";
const activeItem = "text-white";

export default function MobileNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const currentLanguage = useContentStore((s) => s.currentLanguage);
  const setLanguage = useContentStore((s) => s.setLanguage);
  const getText = useContentStore((s) => s.getText);
  const cartCount = useCartWishlistStore((s) => s.cart.reduce((sum, i) => sum + i.quantity, 0));
  const wishlistCount = useCartWishlistStore((s) => s.wishlist.length);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const languages = [
    { code: "en", name: "English" },
    { code: "de", name: "Deutsch" },
    { code: "bs", name: "Bosanski" },
  ];

  const categories = [
    { name: "nav_category_man", icon: "nav_category_man_icon", path: "/shop?category=man" },
    { name: "nav_category_woman", icon: "nav_category_woman_icon", path: "/shop?category=woman" },
    { name: "nav_category_others", icon: "nav_category_others_icon", path: "/shop?category=others" },
  ];

  return (
    <>
      {/* Mobile Header - Matching Desktop Style */}
      <header className={`lg:hidden sticky top-0 z-50 transition-all duration-500 ease-in-out backdrop-blur-2xl bg-primary/95 border-b border-white/10 shadow-lg ${
        isScrolled ? 'border-b-2 border-white/20' : ''
      }`}>
        
        {/* Main Navigation Bar */}
        <div className={`flex items-center justify-between px-4 transition-all duration-500 ${
          isScrolled ? 'h-14' : 'h-16'
        }`}>
          {/* Left - Menu Button (like desktop hamburger) */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            animate={{
              scale: isScrolled ? 0.9 : 1
            }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-1 w-5 h-5 group z-10"
            aria-label="Menu"
          >
            <span className={`w-full h-0.5 bg-accent transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`w-full h-0.5 bg-accent transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-full h-0.5 bg-accent transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </motion.button>

          <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 group z-10">
            <motion.img 
              src="/images/logo.png" 
              alt="my-icon.shop" 
              animate={{
                height: isScrolled ? '28px' : '32px'
              }}
              transition={{ duration: 0.5 }}
              className="w-auto transition-transform duration-300 group-hover:scale-110"
            />
            <motion.span 
              animate={{
                fontSize: isScrolled ? '0.875rem' : '1rem'
              }}
              transition={{ duration: 0.5 }}
              className="font-heading font-bold tracking-tight"
            >
              <span className="bg-gradient-to-r from-white via-accent-light to-white bg-clip-text text-transparent group-hover:from-accent-light group-hover:via-secondary group-hover:to-accent-light transition-all duration-500">
                my-icon
              </span>
              <span className="text-accent group-hover:text-secondary transition-colors duration-300">.</span>
              <span className="bg-gradient-to-r from-white via-accent-light to-white bg-clip-text text-transparent group-hover:from-accent-light group-hover:via-secondary group-hover:to-accent-light transition-all duration-500">
                shop
              </span>
            </motion.span>
          </Link>

          {/* Right - Cart (like desktop bag) */}
          <Link
            to="/cart"
            className="relative z-10 flex items-center gap-1.5 text-white/70 hover:text-white transition-all duration-300"
            aria-label="Cart"
          >
            <ShoppingBag 
              className={`transition-all duration-500 ${isScrolled ? 'w-4 h-4' : 'w-5 h-5'}`} 
              strokeWidth={1.5} 
            />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 text-[9px] font-bold bg-gradient-to-r from-accent to-secondary rounded-full w-3.5 h-3.5 flex items-center justify-center text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-gradient-to-b from-primary via-primary-lighter to-primary border-l border-white/10 z-50 overflow-y-auto"
            >
              {/* Header - Compact */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <EditableText id="nav_menu_title" as="h2" className="text-xl font-heading font-bold text-white" />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-9 h-9 rounded-xl glass flex items-center justify-center text-white/70"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links - Compact */}
              <nav className="p-4 space-y-2">
                <NavLink
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl transition-all text-sm font-bold ${isActive ? 'bg-gradient-to-r from-accent to-accent-light text-white shadow-lg shadow-accent/25' : 'text-white/70 hover:bg-white/5 hover:text-white'}`
                  }
                >
                  <EditableText id="nav_home" as="span" />
                </NavLink>
                <NavLink
                  to="/shop"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl transition-all text-sm font-bold ${isActive ? 'bg-gradient-to-r from-accent to-accent-light text-white shadow-lg shadow-accent/25' : 'text-white/70 hover:bg-white/5 hover:text-white'}`
                  }
                >
                  <EditableText id="nav_shop" as="span" />
                </NavLink>
                <NavLink
                  to="/editor"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-all"
                >
                  <span className="flex items-center gap-2 text-sm font-bold">
                    <EditableText id="nav_studio" as="span" />
                    <EditableText 
                      id="nav_studio_badge" 
                      as="span" 
                      className="text-[10px] px-1.5 py-0.5 rounded bg-accent/20 text-accent border border-accent/30" 
                    />
                  </span>
                </NavLink>
                <NavLink
                  to="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl transition-all text-sm font-bold ${isActive ? 'bg-gradient-to-r from-accent to-accent-light text-white shadow-lg shadow-accent/25' : 'text-white/70 hover:bg-white/5 hover:text-white'}`
                  }
                >
                  <EditableText id="nav_about" as="span" />
                </NavLink>
                <NavLink
                  to="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl transition-all text-sm font-bold ${isActive ? 'bg-gradient-to-r from-accent to-accent-light text-white shadow-lg shadow-accent/25' : 'text-white/70 hover:bg-white/5 hover:text-white'}`
                  }
                >
                  <EditableText id="nav_contact" as="span" />
                </NavLink>
              </nav>

              {/* Categories - Compact - 2 COLUMNS */}
              <div className="px-4 py-3 border-t border-white/10">
                <EditableText id="nav_shop_by_category" as="h3" className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3" />
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      to={cat.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex flex-col items-center gap-2 px-3 py-3 rounded-xl glass glass-hover transition-all"
                    >
                      <EditableIcon id={cat.icon} className="w-6 h-6 text-accent" />
                      <EditableText id={cat.name} as="span" className="text-xs font-bold text-white text-center" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Language Switcher - Compact */}
              <div className="px-4 py-3 border-t border-white/10">
                <EditableText id="nav_language" as="h3" className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3" />
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                        currentLanguage === lang.code
                          ? 'bg-accent/20 text-accent border-2 border-accent/30'
                          : 'text-white/70 hover:bg-white/5'
                      }`}
                    >
                      <span className="text-sm font-medium uppercase">{lang.code}</span>
                      <span className="text-xs text-white/50">{lang.name}</span>
                      {currentLanguage === lang.code && (
                        <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer - Compact */}
              <div className="px-4 py-4 border-t border-white/10 mt-auto flex gap-2">
                <Link
                  to="/wishlist"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 btn-accent py-3 text-sm font-bold text-center flex items-center justify-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <EditableText id="nav_wishlist" as="span" />
                  {wishlistCount > 0 && <span className="text-[10px] font-black bg-white/20 px-1.5 rounded-full">{wishlistCount}</span>}
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 py-3 text-sm font-bold text-center glass border border-white/20 rounded-xl text-white hover:bg-white/10 transition-all flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                  Cart
                  {cartCount > 0 && <span className="text-[10px] font-black bg-accent/30 text-accent px-1.5 rounded-full">{cartCount}</span>}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
