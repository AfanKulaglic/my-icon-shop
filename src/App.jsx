import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import Product from "./pages/Product.jsx";
import Editor from "./pages/Editor.jsx";
import Mash from "./pages/Mash.jsx";
import Admin from "./pages/Admin.jsx";
import HowToUseAdmin from "./pages/HowToUseAdmin.jsx";
import Documentation from "./pages/Documentation.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Cart from "./pages/Cart.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Checkout from "./pages/Checkout.jsx";
import { useContentStore } from "./store/contentStore.js";

export default function App() {
  const initFirebase = useContentStore((s) => s.initFirebase);

  // Initialize Firebase on app mount
  useEffect(() => {
    initFirebase();
  }, [initFirebase]);

  return (
    <Routes>
      {/* Editor + Mash + Shop use their own full-screen chrome */}
      <Route path="/editor/:id?" element={<Editor />} />
      <Route path="/mash/:modelId?" element={<Mash />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/checkout" element={<Checkout />} />
      
      {/* Admin panel */}
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
  );
}
