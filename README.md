# my-icon.shop

Custom apparel storefront with a 3D shirt editor.

## Stack
React (Vite) · Tailwind · Zustand · Fabric.js · Three.js / React Three Fiber · Firebase (optional)

## Run
```bash
npm install
npm run dev
```

## Project map
```
src/
  components/
    layout/    Navbar, Footer, Layout
    ui/        Button, Icons
    product/   ProductCard
    editor/    ShirtCanvas (3D), FabricEditor (2D), EditorSidebar, RightPanel
  pages/       Home, Shop, Product, Editor
  store/       editorStore.js (Zustand)
  utils/       products.js (mock data)
  firebase/    config.js (env-driven)
```

## Editor architecture
1. `FabricEditor` owns a Fabric.js canvas. Every render emits a PNG data URL into the Zustand store.
2. `ShirtCanvas` (R3F) reads that data URL and applies it as a texture on the chest decal mesh.
3. `EditorSidebar` adds elements (text, image upload, shapes) to the Fabric canvas.
4. `RightPanel` drives the active object's scale/position/rotation/color and switches sides.

## Drop in a real shirt model
Place `shirt.obj` in `/public` then replace the procedural geometry inside `ShirtCanvas.jsx` with:
```js
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
const obj = useLoader(OBJLoader, "/shirt.obj");
```

## Firebase (optional)
Create `.env`:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```
The app boots without it; `getFirebaseApp()` returns null until credentials exist.
