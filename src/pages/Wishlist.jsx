import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCartWishlistStore } from "../store/cartWishlistStore.js";
import { useCartWishlistStore as useStore } from "../store/cartWishlistStore.js";
import { products } from "../utils/products.js";
import { useContentStore } from "../store/contentStore.js";

const fade = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

export default function Wishlist() {
  const navigate = useNavigate();
  const getText = useContentStore((s) => s.getText);
  const wishlist = useCartWishlistStore((s) => s.wishlist);
  const removeFromWishlist = useCartWishlistStore((s) => s.removeFromWishlist);
  const addToCart = useCartWishlistStore((s) => s.addToCart);

  const wishedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-lighter to-primary text-white">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 px-4 lg:px-12 pt-8 lg:pt-14 pb-4 lg:pb-8 flex items-center gap-3 lg:gap-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/50 hover:text-white text-sm transition-all duration-300 group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">{getText("wishlist_back")}</span>
        </button>
        <div className="h-4 w-px bg-white/20" />
        <h1 className="text-lg lg:text-3xl font-heading font-black text-white flex items-center gap-2 lg:gap-3">
          <svg className="w-5 h-5 lg:w-7 lg:h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {getText("wishlist_title")}
          {wishedProducts.length > 0 && (
            <span className="text-xs lg:text-sm font-bold px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30">
              {wishedProducts.length}
            </span>
          )}
        </h1>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 lg:px-12 pb-16">
        <AnimatePresence mode="wait">
          {wishedProducts.length === 0 ? (
            <motion.div
              key="empty"
              {...fade}
              className="flex flex-col items-center justify-center py-20 lg:py-32 text-center"
            >
              <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center mb-4 lg:mb-6">
                <svg className="w-8 h-8 lg:w-12 lg:h-12 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-xl lg:text-3xl font-heading font-black mb-2 lg:mb-3 text-white">{getText("wishlist_empty_title")}</h2>
              <p className="text-sm lg:text-base text-white/50 mb-6 lg:mb-8 max-w-sm">{getText("wishlist_empty_desc")}</p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 lg:px-8 lg:py-4 bg-gradient-to-r from-accent to-accent-light text-white font-bold text-sm lg:text-base rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-accent/25"
              >
                {getText("wishlist_browse")}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          ) : (
            <motion.div key="list" {...fade}>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-6">
                <AnimatePresence>
                  {wishedProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="glass rounded-2xl overflow-hidden border border-white/10 hover:border-accent/30 transition-all duration-300 flex flex-col"
                    >
                      {/* Image */}
                      <Link to={`/product/${product.id}`} className="relative aspect-[3/4] block overflow-hidden">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">{product.name}</div>
                        )}
                        {/* Remove from wishlist */}
                        <button
                          onClick={(e) => { e.preventDefault(); removeFromWishlist(product.id); }}
                          className="absolute top-2 right-2 w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-accent/80 transition-all duration-300 group"
                        >
                          <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white/70 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        </button>
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-accent text-white text-[10px] font-bold">
                          {product.category}
                        </span>
                      </Link>

                      {/* Info */}
                      <div className="p-2.5 lg:p-4 flex flex-col gap-2 flex-1">
                        <div className="flex items-start justify-between gap-1">
                          <Link to={`/product/${product.id}`} className="text-xs lg:text-base font-bold text-white hover:text-accent-light transition-colors line-clamp-2 leading-snug">
                            {product.name}
                          </Link>
                          <span className="text-sm lg:text-lg font-black gradient-text whitespace-nowrap">${product.price}</span>
                        </div>

                        {/* Color swatches */}
                        <div className="flex items-center gap-1">
                          {product.colors.slice(0, 4).map((c, i) => (
                            <div key={i} className="w-3.5 h-3.5 lg:w-4 lg:h-4 rounded-full border border-white/30" style={{ backgroundColor: c }} />
                          ))}
                        </div>

                        <div className="flex flex-col gap-1.5 mt-auto">
                          <button
                            onClick={() => { addToCart(product.id, product.colors[0], product.sizes[0]); }}
                            className="w-full py-1.5 lg:py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-light text-white text-[11px] lg:text-sm font-bold hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-accent/20"
                          >
                            {getText("wishlist_add_to_cart")}
                          </button>
                          <Link
                            to={`/editor/${product.id}`}
                            className="w-full py-1.5 lg:py-2.5 rounded-xl glass border border-white/20 text-white text-[11px] lg:text-sm font-semibold text-center hover:bg-white/10 transition-all duration-300"
                          >
                            {getText("wishlist_customize")}
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Clear all */}
              <div className="mt-6 lg:mt-10 text-center">
                <button
                  onClick={() => wishedProducts.forEach((p) => removeFromWishlist(p.id))}
                  className="text-xs lg:text-sm text-white/40 hover:text-white/70 transition-colors underline underline-offset-4"
                >
                  {getText("wishlist_clear")}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
