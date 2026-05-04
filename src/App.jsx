import { Routes, Route, useParams } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import Layout from "./components/layout/Layout.jsx";
import { useContentStore } from "./store/contentStore.js";
import { useGLTF } from "@react-three/drei";
import { findProduct, products } from "./utils/products.js";
import { models } from "./utils/models.js";

// Set the Draco decoder path once at module scope.
useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');

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

/**
 * Thin wrapper rendered before the lazy Editor chunk.
 * Calling useGLTF.preload() here starts the GLB download in parallel
 * with the JS chunk so both resolve at roughly the same time → one spinner.
 */
function EditorRoute() {
  const { id } = useParams();
  const product = findProduct(id) || products[0];
  const glbPath = models[product.modelId]?.glb || `/models/${product.modelId}/base.glb`;
  // Idempotent — safe to call during render; just kicks off the fetch.
  useGLTF.preload(glbPath);
  return <Editor />;
}

// Minimal full-screen spinner shown while a lazy chunk loads
function PageLoader() {
  return (
    <div className="fixed inset-0 bg-primary grid place-items-center z-50">
      <div className="w-9 h-9 border-2 border-accent border-t-transparent rounded-full animate-spin" />
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
        <Route path="/editor/:id?" element={<EditorRoute />} />
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
