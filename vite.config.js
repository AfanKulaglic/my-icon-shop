import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
  build: {
    // Split large vendor libraries into separate cacheable chunks
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Three.js + react-three ecosystem (~2 MB) — only needed in Editor/Mash
          if (id.includes("three") || id.includes("@react-three")) {
            return "vendor-three";
          }
          // Fabric.js (~1 MB) — only needed in Editor
          if (id.includes("fabric")) {
            return "vendor-fabric";
          }
          // Firebase (~500 KB) — shared but large
          if (id.includes("firebase")) {
            return "vendor-firebase";
          }
          // Framer-motion (~150 KB) — shared across pages
          if (id.includes("framer-motion")) {
            return "vendor-motion";
          }
          // React core — tiny but bust-cached separately
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
            return "vendor-react";
          }
        },
      },
    },
    // Raise warning threshold to avoid noise from intentionally large chunks
    chunkSizeWarningLimit: 1000,
  },
});
