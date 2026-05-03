import { useParams, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { findProduct, products } from "../utils/products.js";
import { useProductConfigStore } from "../store/productConfigStore.js";
import { useCartWishlistStore } from "../store/cartWishlistStore.js";
import ProductCard from "../components/product/ProductCard.jsx";

const fade = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function Product() {
  const { id } = useParams();
  const product = findProduct(id);
  
  // Initialize Firebase product configs
  const initFirebase = useProductConfigStore((s) => s.initFirebase);
  const getAvailableColors = useProductConfigStore((s) => s.getAvailableColors);
  const getAvailableSizes = useProductConfigStore((s) => s.getAvailableSizes);

  useEffect(() => {
    initFirebase();
  }, [initFirebase]);

  // Get available colors and sizes from Firebase
  const availableColors = getAvailableColors(product?.id || '');
  const firstColor = availableColors[0];
  
  const [selectedColor, setSelectedColor] = useState(null);
  const [size, setSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const toggleWishlist = useCartWishlistStore((s) => s.toggleWishlist);
  const isWishlisted = useCartWishlistStore((s) => s.isWishlisted);

  // Set initial color when available colors load
  useEffect(() => {
    if (firstColor && !selectedColor) {
      setSelectedColor(firstColor);
    }
  }, [firstColor, selectedColor]);

  // Get available sizes for selected color
  const availableSizes = selectedColor ? getAvailableSizes(product?.id || '', selectedColor.hex) : [];

  // Set initial size when available sizes change
  useEffect(() => {
    if (availableSizes.length > 0 && !size) {
      // Prefer M or L, fallback to first available
      const preferredSize = availableSizes.find(s => s === 'M' || s === 'L') || availableSizes[0];
      setSize(preferredSize);
    }
  }, [availableSizes, size]);

  if (!product) return <Navigate to="/shop" replace />;

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* BREADCRUMB */}
      <div className="border-b border-white/10">
        <motion.nav {...fade} className="container-x py-6">
          <div className="flex items-center gap-3 text-sm">
            <Link to="/" className="text-white/50 hover:text-white transition-colors">Home</Link>
            <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link to="/shop" className="text-white/50 hover:text-white transition-colors">Shop</Link>
            <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white font-medium">{product.name}</span>
          </div>
        </motion.nav>
      </div>

      <div className="container-x py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* IMAGE */}
          <motion.div {...fade} transition={{ delay: 0.1 }}>
            <div className="sticky top-24">
              <div className="relative aspect-square rounded-3xl glass border-2 border-white/10 overflow-hidden group">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-secondary/10" />
                
                {/* Product image */}
                <div className="relative w-full h-full flex items-center justify-center">
                  {product.image ? (
                    <motion.img
                      key={selectedColor?.hex}
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div
                      className="w-3/4 h-3/4 rounded-2xl shadow-2xl"
                      style={{ backgroundColor: selectedColor?.hex || '#ffffff' }}
                    />
                  )}
                </div>

                {/* Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  <span className="badge">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    4.8 Rating
                  </span>
                  <span className="badge bg-success/10 text-success border-success/20">
                    In Stock
                  </span>
                </div>

                <div className="absolute bottom-6 right-6 glass rounded-xl px-4 py-2 border border-white/20">
                  <div className="text-xs text-white/60 mb-1">3D Preview</div>
                  <div className="text-sm font-semibold gradient-text">Available</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* INFO */}
          <motion.div {...fade} transition={{ delay: 0.2 }} className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="badge">{product.category}</span>
                <div className="flex items-center gap-1 text-sm">
                  <svg className="w-5 h-5 text-warning" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-white/70">4.8</span>
                  <span className="text-white/40">(127 reviews)</span>
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl font-heading font-bold mb-4">{product.name}</h1>
              
              <div className="flex items-baseline gap-4">
                <p className="text-4xl font-bold gradient-text">${product.price}</p>
                <span className="text-white/40 line-through text-xl">${(product.price * 1.3).toFixed(0)}</span>
                <span className="badge bg-secondary/10 text-secondary border-secondary/20">30% OFF</span>
              </div>
            </div>

            <p className="text-lg text-white/70 leading-relaxed">
              {product.description}
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {[
                { icon: "✓", text: "Premium Quality" },
                { icon: "✓", text: "3D Customization" },
                { icon: "✓", text: "Fast Shipping" },
                { icon: "✓", text: "Easy Returns" },
              ].map((feature) => (
                <div key={feature.text} className="flex items-center gap-3 glass rounded-xl p-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-sm font-bold">
                    {feature.icon}
                  </div>
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Color Selection */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">
                  Color
                </h3>
                <span className="text-sm font-medium">{selectedColor?.name || 'Loading...'}</span>
              </div>
              {availableColors.length > 0 ? (
                <div className="flex gap-3 flex-wrap">
                  {availableColors.map((colorObj) => (
                    <button
                      key={colorObj.hex}
                      onClick={() => setSelectedColor(colorObj)}
                      className={`relative w-14 h-14 rounded-xl border-2 transition-all ${
                        selectedColor?.hex === colorObj.hex 
                          ? "border-accent scale-110 shadow-glow" 
                          : "border-white/20 hover:border-white/40 hover:scale-105"
                      }`}
                      style={{ backgroundColor: colorObj.hex }}
                      title={colorObj.name}
                    >
                      {selectedColor?.hex === colorObj.hex && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-white/50 text-sm">Loading colors...</div>
              )}
            </div>

            {/* Size Selection */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">
                  Size
                </h3>
                <button className="text-sm text-accent hover:text-accent-light flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Size Guide
                </button>
              </div>
              {availableSizes.length > 0 ? (
                <div className="grid grid-cols-5 gap-2">
                  {availableSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`h-12 rounded-xl border-2 font-semibold transition-all ${
                        size === s
                          ? "bg-gradient-to-br from-accent to-accent-light border-accent text-white shadow-lg shadow-accent/20"
                          : "border-white/20 hover:border-accent/50 hover:bg-white/5"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-white/50 text-sm">
                  {selectedColor ? 'No sizes available for this color' : 'Select a color to see available sizes'}
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70 mb-4">
                Quantity
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-xl glass glass-hover flex items-center justify-center text-xl font-bold"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 h-12 text-center text-xl font-bold bg-primary-lighter border-2 border-white/10 rounded-xl focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 rounded-xl glass glass-hover flex items-center justify-center text-xl font-bold"
                >
                  +
                </button>
                <div className="ml-auto text-right">
                  <div className="text-sm text-white/50">Total</div>
                  <div className="text-2xl font-bold gradient-text">${(product.price * quantity).toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <Link to={`/editor/${product.id}`} className="btn-accent flex-1 text-center text-lg py-4">
                <svg className="w-5 h-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Customize in 3D
              </Link>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`btn-secondary flex-1 text-lg py-4 flex items-center justify-center gap-2 transition-all duration-300 ${
                  isWishlisted(product.id) ? 'bg-accent/20 border-accent text-accent' : ''
                }`}
              >
                <svg className={`w-5 h-5 transition-colors ${isWishlisted(product.id) ? 'fill-accent text-accent' : ''}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill={isWishlisted(product.id) ? 'currentColor' : 'none'}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {isWishlisted(product.id) ? 'Wishlisted' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Accordion Details */}
            <div className="space-y-2">
              {[
                {
                  title: "Product Details",
                  content: ["100% premium cotton blend", "Pre-shrunk for perfect fit", "Reinforced stitching", "Machine washable"],
                },
                {
                  title: "Shipping & Returns",
                  content: ["Free shipping on orders over $50", "3-5 business days delivery", "30-day return policy", "Full refund or exchange"],
                },
                {
                  title: "Care Instructions",
                  content: ["Machine wash cold", "Tumble dry low", "Do not bleach", "Iron on low heat if needed"],
                },
              ].map((section) => (
                <details key={section.title} className="group glass rounded-xl overflow-hidden">
                  <summary className="cursor-pointer p-6 flex items-center justify-between font-semibold hover:bg-white/5 transition-colors">
                    {section.title}
                    <svg className="w-5 h-5 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6 space-y-2 text-white/60">
                    {section.content.map((item, i) => (
                      <p key={i}>• {item}</p>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="container-x py-20 border-t border-white/10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-accent/30 mb-4">
                  <span className="text-sm font-medium text-accent-light">Related Products</span>
                </div>
                <h2 className="text-4xl font-heading font-bold">You May Also Like</h2>
              </div>
              <Link to="/shop" className="btn-outline hidden md:inline-flex">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {relatedProducts.map((p, i, array) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className={`${array.length % 2 !== 0 && i === array.length - 1 ? 'col-span-2 lg:col-span-1' : ''}`}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}
    </div>
  );
}
