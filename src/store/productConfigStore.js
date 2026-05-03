import { create } from "zustand";
import { getFirebaseDatabase } from "../firebase/config.js";
import { ref, set as firebaseSet, onValue } from "firebase/database";

// Default product configurations - only white color by default
const DEFAULT_ZONE_PRICES = { front: 5, back: 5, sleeves: 3 };

const defaultConfigs = {
  "man-polo": {
    colors: [
      { name: "White", hex: "#ffffff", enabled: true, availableSizes: ["S", "M", "L", "XL"] }
    ],
    zonePrices: { ...DEFAULT_ZONE_PRICES },
  },
  "women-polo": {
    colors: [
      { name: "White", hex: "#ffffff", enabled: true, availableSizes: ["XS", "S", "M", "L"] }
    ],
    zonePrices: { ...DEFAULT_ZONE_PRICES },
  },
  "man-hoodie": {
    colors: [
      { name: "White", hex: "#ffffff", enabled: true, availableSizes: ["S", "M", "L", "XL", "XXL"] }
    ],
    zonePrices: { ...DEFAULT_ZONE_PRICES },
  },
  "man-tshirt": {
    colors: [
      { name: "White", hex: "#ffffff", enabled: true, availableSizes: ["S", "M", "L", "XL", "XXL"] }
    ],
    zonePrices: { ...DEFAULT_ZONE_PRICES },
  },
  "women-tshirt": {
    colors: [
      { name: "White", hex: "#ffffff", enabled: true, availableSizes: ["XS", "S", "M", "L", "XL"] }
    ],
    zonePrices: { ...DEFAULT_ZONE_PRICES },
  },
};

let firebaseInitialized = false;

export const useProductConfigStore = create((set, get) => ({
  configs: defaultConfigs,
  loading: true,
  error: null,

  // Initialize Firebase listener
  initFirebase: () => {
    if (firebaseInitialized) return;
    firebaseInitialized = true;

    try {
      const db = getFirebaseDatabase();
      const configRef = ref(db, "productConfigs");

      // Listen for changes
      onValue(configRef, (snapshot) => {
        if (snapshot.exists()) {
          const firebaseData = snapshot.val();
          
          // Merge with defaults to ensure all products exist
          const mergedConfigs = { ...defaultConfigs };
          Object.keys(firebaseData).forEach(productId => {
            mergedConfigs[productId] = firebaseData[productId];
          });
          
          set({ configs: mergedConfigs, loading: false });
        } else {
          // Initialize with defaults if nothing exists
          firebaseSet(configRef, defaultConfigs).catch(console.error);
          set({ configs: defaultConfigs, loading: false });
        }
      });
    } catch (error) {
      console.error("Firebase init error:", error);
      set({ error: error.message, loading: false, configs: defaultConfigs });
    }
  },

  // Get config for a product
  getConfig: (productId) => {
    const { configs } = get();
    return configs[productId] || defaultConfigs[productId] || {
      colors: [{ name: "White", hex: "#ffffff", enabled: true, availableSizes: ["S", "M", "L", "XL"] }]
    };
  },

  // Update entire product config
  updateProductConfig: async (productId, config) => {
    try {
      const db = getFirebaseDatabase();
      const configRef = ref(db, `productConfigs/${productId}`);
      await firebaseSet(configRef, config);
      
      // Update local state
      set((state) => ({
        configs: {
          ...state.configs,
          [productId]: config,
        },
      }));
    } catch (error) {
      console.error("Error updating product config:", error);
      set({ error: error.message });
    }
  },

  // Get zone prices for a product
  getZonePrices: (productId) => {
    const config = get().getConfig(productId);
    return { ...DEFAULT_ZONE_PRICES, ...(config.zonePrices || {}) };
  },

  // Get available colors for a product (only enabled ones)
  getAvailableColors: (productId) => {
    const config = get().getConfig(productId);
    return config.colors?.filter(c => c.enabled) || [];
  },

  // Get available sizes for a specific color
  getAvailableSizes: (productId, colorHex) => {
    const config = get().getConfig(productId);
    const color = config.colors?.find(c => c.hex === colorHex);
    return color?.availableSizes || [];
  },

  // Reset to defaults
  resetToDefaults: async () => {
    try {
      const db = getFirebaseDatabase();
      const configRef = ref(db, "productConfigs");
      await firebaseSet(configRef, defaultConfigs);
      set({ configs: defaultConfigs });
    } catch (error) {
      console.error("Error resetting:", error);
      set({ error: error.message });
    }
  },
}));
