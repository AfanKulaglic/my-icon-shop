import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { products } from "../../utils/products.js";
import { useProductConfigStore } from "../../store/productConfigStore.js";
import { useContentStore } from "../../store/contentStore.js";
import EditableText from "../admin/EditableText.jsx";

export default function MobileHero({ getText }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  const getAvailableColors = useProductConfigStore((s) => s.getAvailableColors);
  const initFirebase = useProductConfigStore((s) => s.initFirebase);
  const getTextFromStore = useContentStore((s) => s.getText);

  useEffect(() => {
    initFirebase();
  }, [initFirebase]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % products.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % products.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
  const currentProduct = products[currentSlide];

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-primary via-primary-lighter to-primary overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[300px] h-[300px] bg-accent/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px]"
        />
      </div>

      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-10"
      >
        <source src="/videos/Modern 3D Print Shop Promo_720p.mp4" type="video/mp4" />
      </video>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-5 pt-10 pb-8 flex flex-col items-center">
        
        {/* Text Content */}
        <div className="text-center space-y-4 mb-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-accent/30 text-sm font-semibold text-accent uppercase tracking-wider backdrop-blur-xl">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              {getText("hero_subtitle") || "New Collection"}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-heading font-black leading-tight"
          >
            <span className="block text-white mb-2">
              {(getText("hero_title") || "CUSTOM APPAREL").split(' ')[0]}
            </span>
            <span className="block gradient-text">
              {(getText("hero_title") || "CUSTOM APPAREL").split(' ').slice(1).join(' ')}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-white/70 max-w-md mx-auto leading-relaxed"
          >
            {getText("hero_description") || "Design your perfect custom apparel with our advanced 3D editor."}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/shop"
              className="px-6 py-3 text-sm bg-gradient-to-r from-accent to-accent-light text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-accent/50 transition-all duration-300"
            >
              {getText("hero_button_primary") || "SHOP NOW"}
            </Link>
            <Link
              to={`/editor/${currentProduct.id}`}
              className="px-6 py-3 text-sm glass border border-white/20 text-white font-bold rounded-xl hover:border-accent/50 transition-all duration-300 backdrop-blur-xl"
            >
              Start Designing
            </Link>
          </motion.div>
        </div>

        {/* Product Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-md relative"
        >
          {/* Product Card */}
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="relative glass rounded-2xl p-4 border border-white/10 overflow-hidden backdrop-blur-xl bg-white/5"
          >
            {/* Glow Effect */}
            <motion.div 
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                scale: [0.8, 1.1, 0.8]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-gradient-to-br from-accent/20 to-secondary/20 blur-3xl" 
            />

            {/* Product Image */}
            <div className="relative aspect-square mb-4">
              <img
                src={currentProduct.image}
                alt={currentProduct.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Product Info */}
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-secondary/20 border border-secondary/30 text-secondary text-xs font-bold uppercase">
                  {currentProduct.category}
                </span>
                <span className="text-xl font-black gradient-text">
                  ${currentProduct.price}
                </span>
              </div>

              <h3 className="text-lg font-heading font-black text-white">
                {currentProduct.name}
              </h3>

              <p className="text-white/60 text-xs line-clamp-2">
                {currentProduct.description}
              </p>

              {/* Colors */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50 uppercase tracking-wider">Colors:</span>
                <div className="flex gap-2">
                  {getAvailableColors(currentProduct.id).slice(0, 5).map((color, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border-2 border-white/30 hover:border-accent transition-all"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Link
                to={`/editor/${currentProduct.id}`}
                className="block w-full py-3 bg-gradient-to-r from-accent to-accent-light text-white font-bold text-center rounded-xl hover:shadow-xl hover:shadow-accent/50 transition-all duration-300"
              >
                Design Now →
              </Link>
            </div>
          </motion.div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass border border-white/20 flex items-center justify-center hover:border-accent/50 hover:bg-accent/10 transition-all z-10 backdrop-blur-xl bg-white/5"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass border border-white/20 flex items-center justify-center hover:border-accent/50 hover:bg-accent/10 transition-all z-10 backdrop-blur-xl bg-white/5"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 ${
                  index === currentSlide
                    ? 'w-8 h-2 bg-gradient-to-r from-accent to-accent-light rounded-full shadow-lg shadow-accent/50'
                    : 'w-2 h-2 bg-white/30 rounded-full hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex gap-6 mt-8 pt-6 border-t border-white/10"
        >
          <div className="text-center">
            <EditableText 
              id="hero_stat1_number" 
              as="div"
              fallback="6+"
              className="text-2xl font-black gradient-text"
            />
            <EditableText 
              id="hero_stat1_label" 
              as="div"
              fallback="Products"
              className="text-sm text-white/60"
            />
          </div>
          <div className="text-center">
            <EditableText 
              id="hero_stat2_number" 
              as="div"
              fallback="100%"
              className="text-2xl font-black gradient-text"
            />
            <EditableText 
              id="hero_stat2_label" 
              as="div"
              fallback="Customizable"
              className="text-sm text-white/60"
            />
          </div>
          <div className="text-center">
            <EditableText 
              id="hero_stat3_number" 
              as="div"
              fallback="3D"
              className="text-2xl font-black gradient-text"
            />
            <EditableText 
              id="hero_stat3_label" 
              as="div"
              fallback="Preview"
              className="text-sm text-white/60"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
