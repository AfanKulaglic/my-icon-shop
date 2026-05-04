import { Routes, Route } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import Layout from "./components/layout/Layout.jsx";
import { useContentStore } from "./store/contentStore.js";
import { useGLTF } from "@react-three/drei";

// Start Draco decoder + model preloads immediately so GLBs are cached
// before the user ever opens the editor.
useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
[
  '/models/man-polo-shirt/base.glb',
  '/models/women-polo-shirt/base.glb',
  '/models/man-hoodie/base.glb',
  '/models/man-tshirt/base.glb',
  '/models/women-tshirt/base.glb',
  '/models/baseball-cap/base.glb',
  '/models/bag/base.glb',
].forEach((p) => useGLTF.preload(p));

// Eagerly load the home page (most common first hit)
import Home from "./pages/Home.jsx";

// Lazy-load everything else so Three.js, Fabric, Admin code, etc.
// are only downloaded when the user actually navigates there
const Shop        = lazy(() => import("./pages/Shop.jsx"));
const Product     = lazy(() => import("./pages/Product.jsx"));
const Editor      = lazy(() => import("./pages/Editor.jsx"));
const Mash        = lazy(() => import("./pages/Mash.jsx"));
const Admin       = lazy(() => import("./pages/Admin.jsx"));
const HowToUseAdmin  = lazy(() => import("./pages/HowToUseAdmin.jsx"));
const Documentation  = lazy(() => import("./pages/Documentation.jsx"));
const About       = lazy(() => import("./pages/About.jsx"));
const Contact     = lazy(() => import("./pages/Contact.jsx"));
const Cart        = lazy(() => import("./pages/Cart.jsx"));
const Wishlist    = lazy(() => import("./pages/Wishlist.jsx"));
const Checkout    = lazy(() => import("./pages/Checkout.jsx"));

// Minimal full-screen spinner shown while a lazy chunk loads
function PageLoader() {
  return (
    <div className="fixed inset-0 bg-primary grid place-items-center z-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-9 h-9 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-white/40 text-sm">Loading 3D model…</p>
      </div>
    </div>
  );
}

export default function App() {
  const initFirebase = useContentStore((s) => s.initFirebase);

  // Initialize Firebase on app mount
  useEffect(() => {
    initFirebase();
  }, [initFirebase]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/editor/:id?" element={<Editor />} />
        <Route path="/mash/:modelId?" element={<Mash />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/howtouseadmin" element={<HowToUseAdmin />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
