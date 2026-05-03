import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCartWishlistStore } from "../store/cartWishlistStore.js";
import { useContentStore } from "../store/contentStore.js";
import { products } from "../utils/products.js";

const fade = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

const allSizes = ["XS", "S", "M", "L", "XL", "XXL"];

export default function Cart() {
  const navigate = useNavigate();
  const getText = useContentStore((s) => s.getText);
  const cart = useCartWishlistStore((s) => s.cart);
  const removeFromCart = useCartWishlistStore((s) => s.removeFromCart);
  const updateCartQuantity = useCartWishlistStore((s) => s.updateCartQuantity);
  const clearCart = useCartWishlistStore((s) => s.clearCart);
  const addToWishlist = useCartWishlistStore((s) => s.addToWishlist);

  const cartItems = cart.map((item) => ({
    ...item,
    product: products.find((p) => p.id === item.productId),
  })).filter((item) => item.product);

  const subtotal = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const shipping = cartItems.length > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

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
          <span className="hidden sm:inline">{getText("cart_back")}</span>
        </button>
        <div className="h-4 w-px bg-white/20" />
        <h1 className="text-lg lg:text-3xl font-heading font-black text-white flex items-center gap-2 lg:gap-3">
          <svg className="w-5 h-5 lg:w-7 lg:h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {getText("cart_title")}
          {cartItems.length > 0 && (
            <span className="text-xs lg:text-sm font-bold px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30">
              {cartItems.reduce((s, i) => s + i.quantity, 0)}
            </span>
          )}
        </h1>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 lg:px-12 pb-16">
        <AnimatePresence mode="wait">
          {cartItems.length === 0 ? (
            <motion.div
              key="empty"
              {...fade}
              className="flex flex-col items-center justify-center py-20 lg:py-32 text-center"
            >
              <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center mb-4 lg:mb-6">
                <svg className="w-8 h-8 lg:w-12 lg:h-12 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-xl lg:text-3xl font-heading font-black mb-2 lg:mb-3 text-white">{getText("cart_empty_title")}</h2>
              <p className="text-sm lg:text-base text-white/50 mb-6 lg:mb-8 max-w-sm">{getText("cart_empty_desc")}</p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 lg:px-8 lg:py-4 bg-gradient-to-r from-accent to-accent-light text-white font-bold text-sm lg:text-base rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-accent/25"
              >
                {getText("cart_browse")}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          ) : (
            <motion.div key="list" {...fade} className="lg:grid lg:grid-cols-3 lg:gap-8">
              {/* Items */}
              <div className="lg:col-span-2 space-y-3 lg:space-y-4">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={`${item.productId}-${item.color}-${item.size}`}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="glass rounded-2xl border border-white/10 p-3 lg:p-5 flex gap-3 lg:gap-5"
                    >
                      {/* Thumbnail */}
                      <Link to={`/product/${item.productId}`} className="flex-shrink-0">
                        <div className="w-16 h-20 lg:w-24 lg:h-32 rounded-xl overflow-hidden bg-white/5">
                          {item.product.image ? (
                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20 text-[10px] text-center p-1">{item.product.name}</div>
                          )}
                        </div>
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col gap-1.5 lg:gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <Link to={`/product/${item.productId}`} className="text-sm lg:text-base font-bold text-white hover:text-accent-light transition-colors line-clamp-2 leading-snug">
                            {item.product.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.productId, item.color, item.size)}
                            className="flex-shrink-0 w-6 h-6 lg:w-7 lg:h-7 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center transition-all duration-300"
                          >
                            <svg className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-white/50 hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Color */}
                          <div className="flex items-center gap-1.5 text-[11px] lg:text-xs text-white/50">
                            <div className="w-3 h-3 lg:w-3.5 lg:h-3.5 rounded-full border border-white/30" style={{ backgroundColor: item.color }} />
                            <span>{item.color}</span>
                          </div>
                          <span className="text-white/20">·</span>
                          {/* Size selector */}
                          <select
                            value={item.size}
                            onChange={(e) => {
                              removeFromCart(item.productId, item.color, item.size);
                              updateCartQuantity(item.productId, item.color, e.target.value, item.quantity);
                            }}
                            className="bg-white/5 border border-white/20 text-white text-[11px] lg:text-xs rounded-lg px-1.5 py-0.5 focus:outline-none focus:border-accent/50"
                          >
                            {item.product.sizes.map((s) => (
                              <option key={s} value={s} className="bg-primary">{s}</option>
                            ))}
                          </select>
                        </div>

                        <Link
                          to={`/editor/${item.productId}`}
                          className="text-[11px] text-accent/70 hover:text-accent transition-colors flex items-center gap-1 w-fit"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          {getText("cart_continue_editing")}
                        </Link>

                        <div className="flex items-center justify-between mt-auto">
                          {/* Qty */}
                          <div className="flex items-center gap-1.5 lg:gap-2">
                            <button
                              onClick={() => updateCartQuantity(item.productId, item.color, item.size, item.quantity - 1)}
                              className="w-6 h-6 lg:w-7 lg:h-7 rounded-lg glass border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-accent/50 transition-all text-sm font-bold"
                            >−</button>
                            <span className="text-sm lg:text-base font-bold text-white w-5 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.productId, item.color, item.size, item.quantity + 1)}
                              className="w-6 h-6 lg:w-7 lg:h-7 rounded-lg glass border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-accent/50 transition-all text-sm font-bold"
                            >+</button>
                          </div>
                          <span className="text-sm lg:text-lg font-black gradient-text">${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Wishlist shortcut */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => clearCart()}
                    className="text-xs text-white/40 hover:text-white/70 transition-colors underline underline-offset-4"
                  >
                    {getText("cart_clear")}
                  </button>
                  <Link to="/wishlist" className="text-xs text-accent hover:text-accent-light transition-colors flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {getText("cart_view_wishlist")}
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div className="mt-6 lg:mt-0">
                <div className="glass rounded-2xl border border-white/10 p-4 lg:p-6 sticky top-4">
                  <h2 className="text-base lg:text-xl font-heading font-black text-white mb-4 lg:mb-6">{getText("cart_order_summary")}</h2>

                  <div className="space-y-2.5 lg:space-y-3 mb-4 lg:mb-6">
                    <div className="flex items-center justify-between text-sm lg:text-base text-white/60">
                      <span>{getText("cart_subtotal")}</span>
                      <span className="text-white font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm lg:text-base text-white/60">
                      <span>{getText("cart_shipping")}</span>
                      <span className="text-white font-semibold">${shipping.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-white/10" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm lg:text-base font-bold text-white">{getText("cart_total")}</span>
                      <span className="text-lg lg:text-2xl font-black gradient-text">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Link
                    to="/checkout"
                    className="w-full py-3 lg:py-4 bg-gradient-to-r from-accent to-accent-light text-white font-bold text-sm lg:text-base rounded-xl hover:scale-[1.02] hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 text-center flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    {getText("cart_checkout")} · ${total.toFixed(2)}
                  </Link>

                  <Link
                    to="/shop"
                    className="mt-3 w-full py-2.5 lg:py-3 rounded-xl glass border border-white/20 text-white/60 hover:text-white text-sm font-medium text-center flex items-center justify-center transition-all duration-300 hover:bg-white/5"
                  >
                    {getText("cart_continue_shopping")}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
