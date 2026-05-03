import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useContentStore } from "../../store/contentStore.js";
import { useProductConfigStore } from "../../store/productConfigStore.js";

export default function ProductCard({ product }) {
  const getText = useContentStore((s) => s.getText);
  
  // Initialize Firebase product configs
  const initFirebase = useProductConfigStore((s) => s.initFirebase);
  const getAvailableColors = useProductConfigStore((s) => s.getAvailableColors);

  useEffect(() => {
    initFirebase();
  }, [initFirebase]);

  // Get available colors from Firebase, fallback to product.colors
  const availableColors = getAvailableColors(product.id);
  const displayColors = availableColors.length > 0 
    ? availableColors.map(c => c.hex)
    : product.colors;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      <div className="card-modern overflow-hidden h-full flex flex-col">
        {/* Image container */}
        <div className="relative aspect-[4/5] bg-gradient-to-br from-primary-lighter to-primary overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-white/30 text-lg font-heading">{product.name}</div>
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-60" />
          
          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <span className="badge">{product.category}</span>
          </div>

          {/* Quick actions */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="w-10 h-10 rounded-xl glass glass-hover grid place-items-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-heading font-bold group-hover:text-accent-light transition-colors">
              {product.name}
            </h3>
            <span className="text-xl font-bold gradient-text">${product.price}</span>
          </div>

          {/* Colors preview */}
          <div className="flex gap-2 mb-4">
            {displayColors.slice(0, 4).map((color, i) => {
              // Find color object for tooltip
              const colorObj = availableColors.find(c => c.hex === color);
              return (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border-2 border-white/20"
                  style={{ backgroundColor: color }}
                  title={colorObj?.name || color}
                />
              );
            })}
            {displayColors.length > 4 && (
              <div className="w-6 h-6 rounded-full border-2 border-white/20 bg-primary-lighter flex items-center justify-center text-[10px] text-white/50">
                +{displayColors.length - 4}
              </div>
            )}
            {displayColors.length === 0 && (
              <div className="text-xs text-white/40">Loading colors...</div>
            )}
          </div>

          {/* Sizes */}
          <div className="flex gap-1 mb-6 text-xs text-white/40">
            {product.sizes.map((size, i) => (
              <span key={size}>
                {size}{i < product.sizes.length - 1 && " · "}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-auto flex gap-2">
            <Link
              to={`/product/${product.id}`}
              className="flex-1 text-center text-sm py-2.5 rounded-lg glass glass-hover font-medium"
            >
              {getText("product_details")}
            </Link>
            <Link
              to={`/editor/${product.id}`}
              className="flex-1 text-center text-sm py-2.5 rounded-lg bg-gradient-to-r from-accent to-accent-light hover:from-accent-hover hover:to-accent text-white font-semibold shadow-lg shadow-accent/20 hover:shadow-glow transition-all duration-300"
            >
              {getText("product_customize")}
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
