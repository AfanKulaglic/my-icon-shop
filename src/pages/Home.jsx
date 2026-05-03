import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { products } from "../utils/products.js";
import ProductCard from "../components/product/ProductCard.jsx";
import { useContentStore } from "../store/contentStore.js";
import { useProductConfigStore } from "../store/productConfigStore.js";
import { useCartWishlistStore } from "../store/cartWishlistStore.js";
import MobileHero from "../components/home/MobileHero.jsx";
import EditableContent from "../components/admin/EditableContent.jsx";
import EditableText from "../components/admin/EditableText.jsx";
import EditableIcon from "../components/admin/EditableIcon.jsx";

const fade = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
};

// Featured Products Content Component with Category Filtering
function FeaturedProductsContent({ getText, products }) {
  const [activeCategory, setActiveCategory] = useState('man');
  const configs = useProductConfigStore((s) => s.configs);
  const initFirebase = useProductConfigStore((s) => s.initFirebase);
  const getAvailableColors = useProductConfigStore((s) => s.getAvailableColors);
  const getTextFromStore = useContentStore((s) => s.getText);
  const toggleWishlist = useCartWishlistStore((s) => s.toggleWishlist);
  const isWishlisted = useCartWishlistStore((s) => s.isWishlisted);

  // Initialize Firebase on mount
  useEffect(() => {
    initFirebase();
  }, [initFirebase]);

  const categories = [
    { 
      id: 'man', 
      labelKey: 'category_tab_man',
      iconKey: 'category_tab_man_icon',
      fallbackLabel: 'MAN',
      fallbackIcon: 'mdi:tshirt-crew'
    },
    { 
      id: 'woman', 
      labelKey: 'category_tab_woman',
      iconKey: 'category_tab_woman_icon',
      fallbackLabel: 'WOMAN',
      fallbackIcon: 'mdi:dress'
    },
    { 
      id: 'others', 
      labelKey: 'category_tab_others',
      iconKey: 'category_tab_others_icon',
      fallbackLabel: 'OTHERS',
      fallbackIcon: 'mdi:star'
    }
  ];

  // Filter products based on active category from Firebase configs
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const productConfig = configs[product.id];
      const productCategory = productConfig?.category || 'man'; // Default to 'man' if not set
      return productCategory === activeCategory;
    }).slice(0, 3); // Show up to 3 products
  }, [products, configs, activeCategory]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 lg:p-12 flex flex-col justify-center"
    >
      {/* Badge */}
      <EditableText 
        id="categories_badge" 
        as={motion.div}
        fallback="Exclusive Categories"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6 self-start"
      >
        <span className="text-xs font-bold text-accent uppercase tracking-wider">
          {getText("categories_badge") || "Exclusive Categories"}
        </span>
      </EditableText>

      {/* Title */}
      <EditableText
        id="featured_title"
        as={motion.h2}
        fallback="CUSTOM APPAREL"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-4xl lg:text-5xl font-heading font-black mb-6 text-gray-900 dark:text-white"
      >
        {getText("featured_title") || "CUSTOM APPAREL"}
      </EditableText>

      {/* Decorative line */}
      <div className="w-20 h-1 bg-gradient-to-r from-accent to-secondary mb-6" />

      {/* Category Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none -mx-6 px-6 lg:mx-0 lg:px-0"
      >
        {categories.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`flex-shrink-0 px-4 py-2.5 lg:px-6 lg:py-3 rounded-xl font-bold text-xs lg:text-sm uppercase tracking-wider transition-all duration-300 ${
              activeCategory === tab.id
                ? 'bg-accent text-white shadow-lg shadow-accent/25' 
                : 'bg-white/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800'
            }`}
          >
            <span className="flex items-center gap-2">
              <EditableIcon 
                id={tab.iconKey} 
                className="w-5 h-5"
                fallback={tab.fallbackIcon}
              />
              <EditableText 
                id={tab.labelKey} 
                as="span"
                fallback={tab.fallbackLabel}
              />
            </span>
          </button>
        ))}
      </motion.div>

      {/* Product Grid */}
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5 mb-6"
      >
        {filteredProducts.map((p, i) => {
          const availableColors = getAvailableColors(p.id);
          const displayColors = availableColors.length > 0
            ? availableColors.map(c => c.hex)
            : p.colors;

          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative card-modern overflow-hidden flex flex-col"
            >
              {/* Product image */}
              <div className="relative aspect-[4/5] bg-gradient-to-br from-primary-lighter to-primary overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-60" />
                <div className="absolute top-2 left-2">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-semibold bg-black/50 text-white/80 border border-white/10 backdrop-blur-sm">{p.category}</span>
                </div>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(p.id); }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-all duration-300"
                >
                  <svg className={`w-3.5 h-3.5 transition-colors duration-300 ${isWishlisted(p.id) ? 'text-accent fill-accent' : 'text-white/70'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill={isWishlisted(p.id) ? 'currentColor' : 'none'}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="p-1 lg:p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-1.5">
                  <h3 className="font-heading font-bold text-sm lg:text-base group-hover:text-accent-light transition-colors leading-tight">
                    {p.name}
                  </h3>
                  <span className="text-sm lg:text-base font-bold gradient-text ml-2 flex-shrink-0">${p.price}</span>
                </div>

                {/* Color swatches from Firebase */}
                <div className="flex gap-1.5 mb-2">
                  {displayColors.slice(0, 4).map((color, ci) => {
                    const colorObj = availableColors.find(c => c.hex === color);
                    return (
                      <div
                        key={ci}
                        className="w-4 h-4 lg:w-5 lg:h-5 rounded-full border-2 border-white/20"
                        style={{ backgroundColor: color }}
                        title={colorObj?.name || color}
                      />
                    );
                  })}
                  {displayColors.length > 4 && (
                    <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full border-2 border-white/20 bg-primary-lighter flex items-center justify-center text-[8px] lg:text-[10px] text-white/50">
                      +{displayColors.length - 4}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-auto flex flex-col gap-1.5 lg:flex-row lg:gap-2">
                  <Link
                    to={`/product/${p.id}`}
                    className="w-full text-center text-xs lg:text-sm py-2 rounded-lg glass glass-hover font-medium"
                  >
                    {getTextFromStore("product_details")}
                  </Link>
                  <Link
                    to={`/editor/${p.id}`}
                    className="w-full text-center text-xs lg:text-sm py-2 rounded-lg bg-gradient-to-r from-accent to-accent-light hover:from-accent-hover hover:to-accent text-white font-semibold shadow-lg shadow-accent/20 transition-all duration-300"
                  >
                    {getTextFromStore("product_customize")}
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* View All Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Link 
          to="/shop" 
          className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-accent hover:text-white transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <EditableText id="view_all_button" fallback="VIEW ALL" as="span" />
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute top-8 right-8 w-32 h-32 bg-accent/5 rounded-full blur-2xl" />
      <div className="absolute bottom-8 left-8 w-32 h-32 bg-secondary/5 rounded-full blur-2xl" />
    </motion.div>
  );
}

// Hero Slider Component - Modern Clean Design
function HeroSlider({ getText }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  const getAvailableColors = useProductConfigStore((s) => s.getAvailableColors);
  const initFirebase = useProductConfigStore((s) => s.initFirebase);

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
    <div className="relative w-full min-h-[85vh] bg-gradient-to-br from-primary via-primary-lighter to-primary overflow-hidden">
      {/* Animated Background Orbs - Matching Shop page */}
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

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full py-20">
          
          {/* Left Side - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <EditableContent id="hero_subtitle" as="span">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-accent/30 text-sm font-semibold text-accent uppercase tracking-wider backdrop-blur-xl">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  {getText("hero_subtitle") || "New Collection"}
                </span>
              </EditableContent>
            </motion.div>

            {/* Title */}
            <EditableContent id="hero_title" as="motion.h1">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl lg:text-7xl font-heading font-black leading-tight"
              >
                <span className="block text-white mb-2">
                  {(getText("hero_title") || "CUSTOM APPAREL").split(' ')[0]}
                </span>
                <span className="block gradient-text">
                  {(getText("hero_title") || "CUSTOM APPAREL").split(' ').slice(1).join(' ')}
                </span>
              </motion.h1>
            </EditableContent>

            {/* Description */}
            <EditableContent id="hero_description" as="motion.p">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-white/70 max-w-xl leading-relaxed"
              >
                {getText("hero_description") || "Design your perfect custom apparel with our advanced 3D editor. High quality materials, unlimited creativity."}
              </motion.p>
            </EditableContent>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <EditableContent id="hero_button_primary" as={Link}>
                <Link
                  to="/shop"
                  className="px-8 py-4 bg-gradient-to-r from-accent to-accent-light text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-accent/50 transition-all duration-300 hover:scale-105"
                >
                  {getText("hero_button_primary") || "SHOP NOW"}
                </Link>
              </EditableContent>
              <EditableContent id="hero_button_design" as={Link}>
                <Link
                  to={`/editor/${currentProduct.id}`}
                  className="px-8 py-4 glass border border-white/20 text-white font-bold rounded-xl hover:border-accent/50 transition-all duration-300 hover:scale-105 backdrop-blur-xl"
                >
                  {getText("hero_button_design") || "Start Designing"}
                </Link>
              </EditableContent>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-8 pt-8 border-t border-white/10"
            >
              <div>
                <EditableText 
                  id="hero_stat1_number" 
                  as="div"
                  fallback="6+"
                  className="text-3xl font-black gradient-text"
                />
                <EditableText 
                  id="hero_stat1_label" 
                  as="div"
                  fallback="Products"
                  className="text-sm text-white/60"
                />
              </div>
              <div>
                <EditableText 
                  id="hero_stat2_number" 
                  as="div"
                  fallback="100%"
                  className="text-3xl font-black gradient-text"
                />
                <EditableText 
                  id="hero_stat2_label" 
                  as="div"
                  fallback="Customizable"
                  className="text-sm text-white/60"
                />
              </div>
              <div>
                <EditableText 
                  id="hero_stat3_number" 
                  as="div"
                  fallback="3D"
                  className="text-3xl font-black gradient-text"
                />
                <EditableText 
                  id="hero_stat3_label" 
                  as="div"
                  fallback="Preview"
                  className="text-sm text-white/60"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Product Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <AnimatePresence mode="wait">
              {/* Product Card */}
              <motion.div
                key={currentSlide}
                initial={{ 
                  opacity: 0, 
                  scale: 0.8,
                  rotateY: -30,
                  x: 100,
                  filter: "blur(10px)"
                }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  rotateY: 0,
                  x: 0,
                  filter: "blur(0px)"
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.8,
                  rotateY: 30,
                  x: -100,
                  filter: "blur(10px)"
                }}
                transition={{ 
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="relative glass rounded-3xl p-8 border border-white/10 overflow-hidden backdrop-blur-xl bg-white/5"
                style={{ transformStyle: "preserve-3d", backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
              >
                {/* Animated Glow Effect */}
                <motion.div 
                  key={`glow-${currentSlide}`}
                  initial={{ opacity: 0, scale: 0.8 }}
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

                {/* Product Image with staggered animation */}
                <motion.div 
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="relative aspect-square mb-6"
                >
                  <motion.img
                    initial={{ scale: 1.2, rotate: -5 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    src={currentProduct.image}
                    alt={currentProduct.name}
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Shine effect on image */}
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    style={{ transform: "skewX(-20deg)" }}
                  />
                </motion.div>

                {/* Product Info with staggered animations */}
                <div className="relative space-y-4">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="flex items-center justify-between"
                  >
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                      className="px-3 py-1 rounded-full bg-secondary/20 border border-secondary/30 text-secondary text-xs font-bold uppercase"
                    >
                      {currentProduct.category}
                    </motion.span>
                    <motion.span 
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 150 }}
                      className="text-2xl font-black gradient-text"
                    >
                      ${currentProduct.price}
                    </motion.span>
                  </motion.div>

                  <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-2xl font-heading font-black text-white"
                  >
                    {currentProduct.name}
                  </motion.h3>

                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-white/60 text-sm line-clamp-2"
                  >
                    {currentProduct.description}
                  </motion.p>

                  {/* Colors with staggered animation */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-xs text-white/50 uppercase tracking-wider">Colors:</span>
                    <div className="flex gap-2">
                      {getAvailableColors(currentProduct.id).slice(0, 5).map((color, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ 
                            delay: 0.7 + i * 0.1, 
                            type: "spring", 
                            stiffness: 200,
                            damping: 15
                          }}
                          whileHover={{ scale: 1.3, y: -3 }}
                          className="w-6 h-6 rounded-full border-2 border-white/30 hover:border-accent transition-all cursor-pointer shadow-lg"
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </motion.div>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    <Link
                      to={`/editor/${currentProduct.id}`}
                      className="group relative block w-full py-3 bg-gradient-to-r from-accent to-accent-light text-white font-bold text-center rounded-xl overflow-hidden hover:shadow-xl hover:shadow-accent/50 transition-all duration-300 hover:scale-105"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Design Now
                        <motion.svg 
                          className="w-5 h-5"
                          initial={{ x: 0 }}
                          whileHover={{ x: 5 }}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </motion.svg>
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-accent-light to-secondary"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows with better animations */}
            <motion.button
              onClick={prevSlide}
              whileHover={{ scale: 1.1, x: -3 }}
              whileTap={{ scale: 0.95 }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass border border-white/20 flex items-center justify-center hover:border-accent/50 hover:bg-accent/10 transition-all z-10 group backdrop-blur-xl bg-white/5"
            >
              <motion.svg 
                className="w-6 h-6 text-white group-hover:text-accent transition-colors"
                whileHover={{ x: -2 }}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </motion.svg>
            </motion.button>
            
            <motion.button
              onClick={nextSlide}
              whileHover={{ scale: 1.1, x: 3 }}
              whileTap={{ scale: 0.95 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass border border-white/20 flex items-center justify-center hover:border-accent/50 hover:bg-accent/10 transition-all z-10 group backdrop-blur-xl bg-white/5"
            >
              <motion.svg 
                className="w-6 h-6 text-white group-hover:text-accent transition-colors"
                whileHover={{ x: 2 }}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </motion.svg>
            </motion.button>

            {/* Slide Indicators with better animations */}
            <div className="flex justify-center gap-2 mt-6">
              {products.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`transition-all duration-300 ${
                    index === currentSlide
                      ? 'w-8 h-2 bg-gradient-to-r from-accent to-accent-light rounded-full shadow-lg shadow-accent/50'
                      : 'w-2 h-2 bg-white/30 rounded-full hover:bg-white/50'
                  }`}
                  aria-label={`Go to product ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const getText = useContentStore((s) => s.getText);
  const isLoading = useContentStore((s) => s.isLoading);
  const initFirebase = useContentStore((s) => s.initFirebase);
  
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  // Initialize Firebase on mount
  useEffect(() => {
    initFirebase();
  }, [initFirebase]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        </div>
        <div className="text-center relative z-10">
          <div className="w-20 h-20 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-6" />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl text-white/60 font-medium"
          >
            Loading experience...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* HERO - Slider Design */}
      <section className="relative overflow-hidden min-h-screen lg:min-h-[70vh] flex items-center">
        {/* Mobile Hero */}
        <div className="lg:hidden w-full">
          <MobileHero getText={getText} />
        </div>
        
        {/* Desktop Hero */}
        <div className="hidden lg:block w-full">
          <HeroSlider getText={getText} />
        </div>
      </section>

      {/* HOW IT WORKS - Compact & Modern */}
      <section className="w-full py-10 lg:py-20 relative overflow-hidden">
        {/* Subtle background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.08, 0.15, 0.08],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 5 }}
            className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px]"
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 lg:mb-12"
          >
            <EditableContent id="process_badge" as="motion.span">
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-accent/30 text-sm font-semibold text-accent uppercase tracking-wider mb-4 backdrop-blur-xl"
              >
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                {getText("process_badge") || "Simple Process"}
              </motion.span>
            </EditableContent>
            
            <EditableContent id="process_title" as="h2">
              <h2 className="text-4xl lg:text-5xl font-heading font-black mb-4 text-white">
                {getText("process_title") || "How It Works"}
              </h2>
            </EditableContent>
            
            <EditableContent id="process_description" as="p">
              <p className="text-lg text-white/60 max-w-2xl mx-auto">
                {getText("process_description") || "From concept to creation in three seamless steps"}
              </p>
            </EditableContent>
          </motion.div>

          {/* Steps Grid - Horizontal on all screens */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                step: "01",
                iconId: "step1_icon",
                titleId: "step1_title",
                descId: "step1_desc",
                color: "accent",
              },
              {
                step: "02",
                iconId: "step2_icon",
                titleId: "step2_title",
                descId: "step2_desc",
                color: "secondary",
              },
              {
                step: "03",
                iconId: "step3_icon",
                titleId: "step3_title",
                descId: "step3_desc",
                color: "accent-light",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative group"
              >
                <div className="relative p-6 glass rounded-2xl border border-white/10 hover:border-accent/30 transition-all duration-300 backdrop-blur-xl bg-white/5 h-full">
                  {/* Step number badge */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-${item.color} to-${item.color} flex items-center justify-center font-black text-lg shadow-lg`}>
                      {item.step}
                    </div>
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      <EditableIcon 
                        id={item.iconId} 
                        className="w-10 h-10 text-accent"
                        fallback="mdi:star"
                      />
                    </div>
                  </div>
                  
                  <EditableText 
                    id={item.titleId} 
                    as="h3"
                    fallback="Step Title"
                    className="text-xl font-heading font-bold mb-2 text-white group-hover:text-accent transition-colors duration-300"
                  />
                  
                  <EditableText 
                    id={item.descId} 
                    as="p"
                    fallback="Step description"
                    className="text-white/60 text-sm leading-relaxed"
                  />

                  {/* Hover glow */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-${item.color}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
                </div>

                {/* Connection arrow (desktop only) */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                    <svg className="w-6 h-6 text-accent/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-10"
          >
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent to-accent-light rounded-xl font-bold text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-accent/50"
            >
              <span>Start Creating Now</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FEATURES SHOWCASE - Compact & Modern */}
      <section className="w-full py-10 lg:py-20 relative">
        {/* Subtle background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.08, 0.15, 0.08],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 5 }}
            className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px]"
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <EditableContent id="features_badge" as="motion.span">
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-accent/30 text-sm font-semibold text-accent uppercase tracking-wider mb-4 backdrop-blur-xl"
              >
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                {getText("features_badge") || "Why Choose Us"}
              </motion.span>
            </EditableContent>
            
            <h2 className="text-4xl lg:text-5xl font-heading font-black mb-4 text-white">
              <EditableContent id="features_title" as="span">
                {getText("features_title") || "Cutting-Edge"}
              </EditableContent>
              {" "}
              <EditableContent id="features_subtitle" as="span" className="gradient-text">
                <span className="gradient-text">{getText("features_subtitle") || "Technology"}</span>
              </EditableContent>
            </h2>
            
            <EditableContent id="features_description" as="p">
              <p className="text-lg text-white/60 max-w-2xl mx-auto">
                {getText("features_description") || "Industry-leading features that set us apart from the competition"}
              </p>
            </EditableContent>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-6xl mx-auto">
            {[
              { 
                iconId: "feature1_icon",
                titleId: "feature1_title",
                descId: "feature1_desc",
              },
              { 
                iconId: "feature2_icon",
                titleId: "feature2_title",
                descId: "feature2_desc",
              },
              { 
                iconId: "feature3_icon",
                titleId: "feature3_title",
                descId: "feature3_desc",
              },
              { 
                iconId: "feature4_icon",
                titleId: "feature4_title",
                descId: "feature4_desc",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.titleId}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group"
              >
                <div className="relative p-6 text-center glass rounded-2xl border border-white/10 hover:border-accent/30 transition-all duration-300 backdrop-blur-xl bg-white/5 h-full">
                  {/* Icon */}
                  <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <EditableIcon 
                      id={feature.iconId} 
                      className="w-12 h-12 text-accent"
                      fallback="mdi:star"
                    />
                  </div>
                  
                  <EditableText 
                    id={feature.titleId} 
                    as="h3"
                    fallback="Feature"
                    className="text-lg font-heading font-bold mb-2 text-white group-hover:text-accent transition-colors duration-300"
                  />
                  
                  <EditableText 
                    id={feature.descId} 
                    as="p"
                    fallback="Description"
                    className="text-white/60 text-sm leading-relaxed"
                  />

                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS - Split Layout */}
      <section className="py-8 lg:py-16 relative overflow-hidden">
        {/* Full width container */}
        <div className="grid lg:grid-cols-[35%_65%] lg:min-h-[600px]">
          {/* Left - Large Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden"
          >
            {/* Featured image - Full bleed, no card */}
            <img 
              src="/images/featured-couple.png" 
              alt="Featured Products" 
              className="w-full h-[280px] lg:h-full object-cover object-top"
            />
          </motion.div>

          {/* Right - Content */}
          <FeaturedProductsContent getText={getText} products={products} />
        </div>
      </section>

      {/* TESTIMONIALS - Ultra Modern */}
      <section className="w-full py-14 lg:py-32 relative">
        {/* Advanced background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-accent/10 to-secondary/10 rounded-full blur-[100px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-secondary/15 to-accent-light/15 rounded-full blur-[80px] animate-float" />
        </div>

        <motion.div {...fade} className="text-center mb-8 lg:mb-20 relative z-10 px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative z-40 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-accent/80 to-secondary/80 border-2 border-white/30 mb-8 group hover:from-accent hover:to-secondary transition-all duration-300 shadow-xl"
          >
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                  className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            <EditableContent id="testimonials_badge" as="span">
              <span className="text-sm font-bold text-white drop-shadow-lg">{getText("testimonials_badge") || "Testimonials"}</span>
            </EditableContent>
            <svg className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl lg:text-6xl xl:text-7xl font-heading font-black mb-4 lg:mb-8 leading-tight"
          >
            <EditableContent id="testimonials_title" as="span">
              <span className="bg-gradient-to-r from-white via-accent-light to-white bg-clip-text text-transparent">
                {getText("testimonials_title") || "Loved by"}
              </span>
            </EditableContent>
            <br />
            <EditableContent id="testimonials_subtitle" as="span">
              <span className="bg-gradient-to-r from-accent via-secondary to-accent-light bg-clip-text text-transparent">
                {getText("testimonials_subtitle") || "Creators"}
              </span>
            </EditableContent>
          </motion.h2>
          
          <EditableContent id="testimonials_description" as="motion.p">
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm lg:text-2xl text-white/60 max-w-3xl mx-auto leading-relaxed font-light"
            >
              {getText("testimonials_description") || "Join thousands of satisfied customers who trust us with their custom designs"}
            </motion.p>
          </EditableContent>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10 px-6 lg:px-12 max-w-7xl mx-auto">
          {[
            {
              name: getText("testimonial1_name") || "Sarah Chen",
              role: getText("testimonial1_role") || "Small Business Owner",
              avatar: "SC",
              text: getText("testimonial1_text") || "The 3D editor is a game-changer! I designed custom polos for my team in minutes. The quality is outstanding and the process was seamless.",
              rating: 5,
              color: "from-accent to-accent-light",
              delay: 0.2
            },
            {
              name: getText("testimonial2_name") || "Marcus Johnson",
              role: getText("testimonial2_role") || "Graphic Designer",
              avatar: "MJ",
              text: getText("testimonial2_text") || "Finally, a platform that lets me see exactly how my designs will look before printing. The real-time 3D preview is incredibly accurate.",
              rating: 5,
              color: "from-secondary to-secondary-light",
              delay: 0.4
            },
            {
              name: getText("testimonial3_name") || "Emily Rodriguez",
              role: getText("testimonial3_role") || "Event Coordinator",
              avatar: "ER",
              text: getText("testimonial3_text") || "Ordered 50 custom hoodies for our conference. Fast delivery, perfect prints, and the team absolutely loved them. Will definitely order again!",
              rating: 5,
              color: "from-accent-light to-secondary",
              delay: 0.6
            },
          ].map((testimonial, i, array) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 50, rotateY: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ delay: testimonial.delay, duration: 0.8, type: "spring", bounce: 0.3 }}
              className="group relative"
            >
              <div className="relative p-5 lg:p-10 glass rounded-2xl lg:rounded-3xl border border-white/10 hover:border-accent/30 transition-all duration-500 group-hover:scale-105 overflow-hidden">
                {/* Background gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Enhanced quote icon */}
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: testimonial.delay + 0.2, type: "spring", bounce: 0.4 }}
                  className={`absolute -top-6 -left-6 w-16 h-16 rounded-2xl bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-3xl font-black shadow-2xl group-hover:scale-110 transition-transform duration-300`}
                >
                  "
                </motion.div>

                {/* Enhanced rating with animation */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: testimonial.delay + 0.4, duration: 0.6 }}
                  className="flex gap-1 mb-4 mt-3"
                >
                  {[...Array(testimonial.rating)].map((_, starIndex) => (
                    <motion.svg 
                      key={starIndex}
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: testimonial.delay + 0.5 + starIndex * 0.1, duration: 0.4 }}
                      className="w-4 h-4 lg:w-6 lg:h-6 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </motion.svg>
                  ))}
                </motion.div>

                <EditableContent id={`testimonial${i + 1}_text`} as="motion.p">
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: testimonial.delay + 0.6, duration: 0.6 }}
                    className="text-white/70 group-hover:text-white/90 leading-relaxed mb-4 lg:mb-8 text-xs lg:text-lg relative z-10 transition-colors duration-300"
                  >
                    {testimonial.text}
                  </motion.p>
                </EditableContent>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: testimonial.delay + 0.8, duration: 0.6 }}
                  className="flex items-center gap-4 relative z-10"
                >
                  <div className={`w-10 h-10 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br ${testimonial.color} flex items-center justify-center font-black text-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <EditableContent id={`testimonial${i + 1}_name`} as="div">
                      <div className="font-bold text-sm lg:text-lg group-hover:text-accent transition-colors duration-300">{testimonial.name}</div>
                    </EditableContent>
                    <EditableContent id={`testimonial${i + 1}_role`} as="div">
                      <div className="text-sm text-white/50 group-hover:text-white/70 transition-colors duration-300">{testimonial.role}</div>
                    </EditableContent>
                  </div>
                </motion.div>

                {/* Floating elements */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-accent/30 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500" />
                <div className="absolute bottom-4 right-4 w-2 h-2 bg-secondary/30 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-500" />
                
                {/* Interactive hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              </div>

              {/* External glow effect */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${testimonial.color} blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10`} />
            </motion.div>
          ))}
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 lg:mt-20 text-center relative z-10"
        >
          <div className="grid grid-cols-3 lg:inline-flex lg:items-center lg:gap-8 gap-3 px-4 py-4 lg:px-8 lg:py-6 glass rounded-2xl border border-white/10 w-full max-w-xs lg:w-auto lg:max-w-none mx-auto">
            <div className="flex flex-col lg:flex-row items-center lg:gap-3 gap-1.5 text-center lg:text-left">
              <div className="w-9 h-9 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 mx-auto lg:mx-0">
                <EditableIcon 
                  id="trust_customers_icon" 
                  className="w-5 h-5 lg:w-6 lg:h-6 text-white"
                  fallback="mdi:check-circle"
                />
              </div>
              <div>
                <EditableText 
                  id="trust_customers_number" 
                  as="div"
                  fallback="15,000+"
                  className="text-base lg:text-2xl font-black text-green-400 leading-tight"
                />
                <EditableText 
                  id="trust_customers" 
                  as="div"
                  fallback="Happy Customers"
                  className="text-[10px] lg:text-sm text-white/60 leading-tight"
                />
              </div>
            </div>
            
            <div className="hidden lg:block w-px h-12 bg-white/10" />
            
            <div className="flex flex-col lg:flex-row items-center lg:gap-3 gap-1.5 text-center lg:text-left">
              <div className="w-9 h-9 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center flex-shrink-0 mx-auto lg:mx-0">
                <EditableIcon 
                  id="trust_rating_icon"
                  className="w-5 h-5 lg:w-6 lg:h-6 text-white"
                  fallback="mdi:star"
                />
              </div>
              <div>
                <EditableText 
                  id="trust_rating_number" 
                  as="div"
                  fallback="4.9/5"
                  className="text-base lg:text-2xl font-black text-yellow-400 leading-tight"
                />
                <EditableText 
                  id="trust_rating" 
                  as="div"
                  fallback="Average Rating"
                  className="text-[10px] lg:text-sm text-white/60 leading-tight"
                />
              </div>
            </div>
            
            <div className="hidden lg:block w-px h-12 bg-white/10" />
            
            <div className="flex flex-col lg:flex-row items-center lg:gap-3 gap-1.5 text-center lg:text-left">
              <div className="w-9 h-9 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 mx-auto lg:mx-0">
                <EditableIcon 
                  id="trust_delivery_icon"
                  className="w-5 h-5 lg:w-6 lg:h-6 text-white"
                  fallback="mdi:clock-fast"
                />
              </div>
              <div>
                <EditableText 
                  id="trust_delivery_number" 
                  as="div"
                  fallback="24h"
                  className="text-base lg:text-2xl font-black text-blue-400 leading-tight"
                />
                <EditableText 
                  id="trust_delivery" 
                  as="div"
                  fallback="Fast Delivery"
                  className="text-[10px] lg:text-sm text-white/60 leading-tight"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA - Ultra Modern Full Width */}
      <section className="py-10 lg:py-32 relative">
        {/* Advanced background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-gradient-to-r from-accent/15 via-secondary/15 to-accent-light/15 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] animate-float" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-[80px] animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-[2rem] lg:rounded-[3rem] overflow-hidden group mx-auto"
            style={{ width: 'calc(100vw - 3rem)', marginLeft: 'calc(-50vw + 50% + 1.5rem)', marginRight: 'calc(-50vw + 50% + 1.5rem)' }}
          >
            {/* Enhanced background gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-secondary/20 to-accent-light/30" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
            <div className="absolute inset-0 glass backdrop-blur-2xl" />
            
            {/* Animated mesh pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '30px 30px',
                animation: 'grid-move 15s linear infinite'
              }} />
            </div>
            
            {/* Content */}
            <div className="relative z-10 p-6 md:p-16 lg:p-24 text-center max-w-6xl mx-auto">
              {/* Enhanced badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative z-40 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-accent/80 to-secondary/80 border-2 border-white/30 mb-8 group hover:from-accent hover:to-secondary transition-all duration-300 shadow-xl"
              >
                <div className="relative">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-3 h-3 bg-white rounded-full animate-ping opacity-50" />
                </div>
                <EditableText id="cta_badge" fallback="Ready to Start?" as="span" className="text-sm font-bold text-white drop-shadow-lg" />
                <svg className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.div>

              {/* Enhanced title with text reveal */}
              <EditableContent id="cta_title" as="motion.h2">
                <motion.h2 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-3xl lg:text-6xl xl:text-7xl font-heading font-black mb-5 lg:mb-8 leading-tight"
                >
                  <motion.span
                    initial={{ y: 100, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="block bg-gradient-to-r from-white via-accent-light to-white bg-clip-text text-transparent"
                  >
                    {getText("cta_title")?.split(' ').slice(0, 3).join(' ') || "Your next favorite"}
                  </motion.span>
                  <motion.span
                    initial={{ y: 100, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="block bg-gradient-to-r from-accent via-secondary to-accent-light bg-clip-text text-transparent"
                  >
                    {getText("cta_title")?.split(' ').slice(3).join(' ') || "piece awaits"}
                  </motion.span>
                </motion.h2>
              </EditableContent>

              {/* Enhanced description */}
              <EditableText
                id="cta_description"
                as={motion.p}
                fallback="Open the editor, drop your idea on a 3D shirt, and watch it come to life."
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1 }}
                className="text-sm lg:text-2xl text-white/70 mb-6 lg:mb-12 max-w-3xl mx-auto leading-relaxed font-light"
              />

              {/* Enhanced CTA buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="flex flex-wrap gap-6 justify-center mb-12"
              >
                <Link to="/editor" className="group relative overflow-hidden px-6 py-3 lg:px-10 lg:py-5 bg-gradient-to-r from-accent to-accent-light rounded-xl lg:rounded-2xl font-bold text-sm lg:text-xl shadow-2xl shadow-accent/25 hover:shadow-accent/40 transition-all duration-300 hover:scale-105">
                  <span className="relative z-10 flex items-center gap-3">
                    <EditableText id="cta_button" fallback="Open Editor" as="span" />
                    <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-light to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
                <Link to="/shop" className="group px-6 py-3 lg:px-10 lg:py-5 border-2 border-white/20 hover:border-accent/50 rounded-xl lg:rounded-2xl font-bold text-sm lg:text-xl backdrop-blur-sm hover:bg-white/5 transition-all duration-300 hover:scale-105">
                  <span className="flex items-center gap-3">
                    <EditableText id="cta_button_secondary" fallback="Browse Shop" as="span" />
                    <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </Link>
              </motion.div>

              {/* Enhanced feature highlights */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 pt-6 lg:pt-12 border-t border-white/10"
              >
                {[
                  {
                    iconId: "cta_feature1_icon",
                    titleId: "cta_feature1_title",
                    descId: "cta_feature1_desc",
                    color: "from-accent to-accent-light"
                  },
                  {
                    iconId: "cta_feature2_icon",
                    titleId: "cta_feature2_title",
                    descId: "cta_feature2_desc",
                    color: "from-secondary to-secondary-light"
                  },
                  {
                    iconId: "cta_feature3_icon",
                    titleId: "cta_feature3_title",
                    descId: "cta_feature3_desc",
                    color: "from-accent-light to-secondary"
                  }
                ].map((feature, i) => (
                  <motion.div
                    key={feature.titleId}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 1.6 + i * 0.1 }}
                    className={`text-center group${i === 2 ? ' col-span-2 md:col-span-1' : ''}`}
                  >
                    <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <EditableIcon 
                        id={feature.iconId} 
                        className="w-10 h-10 text-accent"
                        fallback="mdi:star"
                      />
                    </div>
                    <EditableText
                      id={feature.titleId}
                      as="h3"
                      fallback="Feature"
                      className={`text-lg font-bold mb-2 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}
                    />
                    <EditableText
                      id={feature.descId}
                      as="p"
                      fallback="Description"
                      className="text-sm text-white/60 group-hover:text-white/80 transition-colors duration-300"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Enhanced decorative elements */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-8 right-8 w-32 h-32 bg-accent/30 rounded-full blur-3xl"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.5, 0.2],
                rotate: [360, 180, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-8 left-8 w-40 h-40 bg-secondary/30 rounded-full blur-3xl"
            />

            {/* Interactive particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: Math.random() * 100 + "%",
                    y: Math.random() * 100 + "%",
                    scale: 0
                  }}
                  animate={{
                    y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
                    scale: [0, 1, 0],
                    opacity: [0, 0.6, 0]
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "easeInOut"
                  }}
                  className="absolute w-2 h-2 bg-accent/50 rounded-full"
                />
              ))}
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
        </div>
      </section>
    </>
  );
}
