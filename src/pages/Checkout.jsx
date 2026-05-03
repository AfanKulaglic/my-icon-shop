import { useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCartWishlistStore } from "../store/cartWishlistStore.js";
import { useContentStore } from "../store/contentStore.js";
import { products } from "../utils/products.js";
import { getFirebaseDatabase } from "../firebase/config.js";
import { ref, push, set } from "firebase/database";

const fade = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

// Generate a short human-readable order ID
function generateOrderId() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MIS-${ts}-${rand}`;
}

// Simulated PayPal button + modal
function PayPalModal({ total, onSuccess, onCancel, getText }) {
  const [step, setStep] = useState("idle"); // idle | connecting | login | processing

  const handlePayPalClick = () => {
    setStep("connecting");
    setTimeout(() => setStep("login"), 1800);
  };

  const handleConfirm = () => {
    setStep("processing");
    setTimeout(() => {
      onSuccess("PAYPAL-SIM-" + Math.random().toString(36).substring(2, 12).toUpperCase());
    }, 2000);
  };

  return (
    <div className="space-y-3">
      {step === "idle" && (
        <button
          onClick={handlePayPalClick}
          className="w-full flex items-center justify-center gap-2 lg:gap-3 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-bold text-sm lg:text-base transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, #003087 0%, #009cde 100%)" }}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 lg:w-6 lg:h-6 fill-white">
            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z" />
          </svg>
          <span className="text-white text-sm lg:text-lg tracking-wide">
            {getText("checkout_pay_paypal")}
          </span>
          <span className="text-white/80 text-xs lg:text-sm font-normal">${total.toFixed(2)}</span>
        </button>
      )}

      {/* Connecting overlay — rendered in a portal so parent transforms don't break fixed positioning */}
      {createPortal(
        <AnimatePresence>
          {(step === "connecting" || step === "login" || step === "processing") && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            >
            {step === "connecting" && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #003087, #009cde)" }}>
                  <svg viewBox="0 0 24 24" className="w-10 h-10 fill-white">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z" />
                  </svg>
                </div>
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-700 font-semibold text-lg">{getText("checkout_paypal_connecting")}</p>
              </motion.div>
            )}

            {step === "login" && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-3xl overflow-hidden max-w-sm w-full shadow-2xl"
              >
                {/* PayPal header */}
                <div className="px-8 pt-8 pb-6" style={{ background: "linear-gradient(135deg, #003087 0%, #009cde 100%)" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z" />
                    </svg>
                    <span className="text-white text-xl font-bold">{getText("checkout_paypal_login")}</span>
                  </div>
                  <p className="text-white/80 text-sm">{getText("checkout_paypal_login_desc")}</p>
                </div>
                {/* Amount */}
                <div className="px-8 py-5 bg-blue-50 border-b border-blue-100">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">my-icon.shop</span>
                    <span className="text-2xl font-black text-gray-900">${total.toFixed(2)}</span>
                  </div>
                </div>
                {/* Simulated email */}
                <div className="px-8 py-6 space-y-3">
                  <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 text-sm">
                    customer@email.com ••••••••
                  </div>
                  <button
                    onClick={handleConfirm}
                    className="w-full py-3.5 rounded-xl font-bold text-white text-base transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{ background: "linear-gradient(135deg, #003087, #009cde)" }}
                  >
                    {getText("checkout_paypal_confirm")}
                  </button>
                  <button
                    onClick={() => { setStep("idle"); onCancel(); }}
                    className="w-full py-2.5 rounded-xl font-medium text-gray-500 text-sm hover:text-gray-700 transition-colors"
                  >
                    {getText("checkout_paypal_cancel")}
                  </button>
                </div>
              </motion.div>
            )}

            {step === "processing" && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #003087, #009cde)" }}>
                  <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
                <p className="text-gray-700 font-semibold text-lg">{getText("checkout_processing")}</p>
                <p className="text-gray-400 text-sm mt-2">Please do not close this window</p>
              </motion.div>
            )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

// Single input field
function Field({ label, id, type = "text", value, onChange, required, placeholder, optional, getText }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs lg:text-sm font-semibold text-white/70 mb-1 lg:mb-1.5">
        {label}
        {required && <span className="text-accent ml-1">*</span>}
        {optional && <span className="text-white/30 ml-2 text-[10px] lg:text-xs font-normal">({getText("checkout_optional")})</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 lg:px-4 lg:py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/25 text-xs lg:text-sm focus:outline-none focus:border-accent/60 focus:bg-white/8 transition-all duration-200"
        autoComplete={id}
      />
    </div>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const getText = useContentStore((s) => s.getText);
  const cart = useCartWishlistStore((s) => s.cart);
  const clearCart = useCartWishlistStore((s) => s.clearCart);

  const cartItems = cart
    .map((item) => ({ ...item, product: products.find((p) => p.id === item.productId) }))
    .filter((i) => i.product);

  const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const shipping = cartItems.length > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  // Form state
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", city: "", zip: "", country: "",
  });
  const [formError, setFormError] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const setField = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const validateForm = () => {
    const required = ["name", "email", "address", "city", "zip", "country"];
    return required.every((k) => form[k].trim() !== "");
  };

  const handlePayPalSuccess = async (paymentId) => {
    const id = generateOrderId();
    const orderData = {
      id,
      paymentId,
      paymentMethod: "paypal_simulation",
      status: "paid",
      timestamp: Date.now(),
      customer: { ...form },
      items: cartItems.map((i) => {
        // Attach rendered zone textures saved by the editor
        let textureURLs = null;
        try {
          const saved = localStorage.getItem(`cart_edit:${i.productId}`);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.textureURLs) {
              const filtered = {};
              Object.entries(parsed.textureURLs).forEach(([side, url]) => {
                if (url) filtered[side] = url;
              });
              if (Object.keys(filtered).length > 0) textureURLs = filtered;
            }
          }
        } catch (e) { /* ignore corrupt data */ }
        return {
          productId: i.productId,
          name: i.product.name,
          color: i.color,
          size: i.size,
          quantity: i.quantity,
          price: i.product.price,
          ...(textureURLs ? { textureURLs } : {}),
        };
      }),
      subtotal,
      shipping,
      total,
    };

    try {
      const db = getFirebaseDatabase();
      const ordersRef = ref(db, "orders");
      const newOrderRef = push(ordersRef);
      await set(newOrderRef, orderData);
    } catch (e) {
      console.warn("Firebase write failed:", e);
    }

    setOrderId(id);
    clearCart();
    setOrderSuccess(true);
  };

  // Redirect if cart is empty (and not just placed order)
  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-lighter to-primary text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50 mb-4">Your cart is empty.</p>
          <Link to="/shop" className="text-accent hover:text-accent-light transition-colors">Browse Products →</Link>
        </div>
      </div>
    );
  }

  // Success screen
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-lighter to-primary text-white flex items-center justify-center px-4">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]" />
        </div>
        <motion.div {...fade} className="relative z-10 max-w-md w-full text-center">
          {/* Animated checkmark */}
          <div className="w-16 h-16 lg:w-24 lg:h-24 mx-auto mb-5 lg:mb-8 rounded-full bg-gradient-to-br from-green-400/30 to-green-600/20 border border-green-400/40 flex items-center justify-center">
            <motion.svg
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="w-8 h-8 lg:w-12 lg:h-12 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
            </motion.svg>
          </div>

          <h1 className="text-2xl lg:text-4xl font-heading font-black mb-2 lg:mb-3 text-white">
            {getText("checkout_success_title")}
          </h1>
          <p className="text-white/60 mb-4 lg:mb-6 text-sm lg:text-base leading-relaxed">
            {getText("checkout_success_desc")}
          </p>

          <div className="glass rounded-xl lg:rounded-2xl border border-white/10 p-4 lg:p-5 mb-5 lg:mb-8 text-left space-y-2 lg:space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-xs lg:text-sm">{getText("checkout_success_order")}</span>
              <span className="font-mono font-bold text-accent text-xs lg:text-sm">{orderId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-xs lg:text-sm">Email</span>
              <span className="text-white text-xs lg:text-sm">{form.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-xs lg:text-sm">{getText("checkout_total")}</span>
              <span className="text-base lg:text-lg font-black gradient-text">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Confetti-like dots decoration */}
          <div className="flex items-center justify-center gap-1.5 lg:gap-2 mb-5 lg:mb-8">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.1, type: "spring" }}
                className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-accent"
              />
            ))}
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 lg:px-8 lg:py-4 bg-gradient-to-r from-accent to-accent-light text-white font-bold text-sm lg:text-base rounded-xl lg:rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg shadow-accent/25"
          >
            {getText("checkout_continue_shopping")}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-lighter to-primary text-white">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-accent/10 rounded-full blur-[80px] lg:blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] lg:w-[600px] lg:h-[600px] bg-secondary/10 rounded-full blur-[80px] lg:blur-[120px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 px-4 lg:px-12 pt-5 lg:pt-12 pb-3 lg:pb-6 flex items-center gap-3 lg:gap-4">
        <Link
          to="/cart"
          className="flex items-center gap-1.5 lg:gap-2 text-white/50 hover:text-white text-xs lg:text-sm transition-all duration-300 group"
        >
          <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">{getText("checkout_back")}</span>
        </Link>
        <div className="h-4 w-px bg-white/20" />
        <h1 className="text-base lg:text-3xl font-heading font-black text-white flex items-center gap-1.5 lg:gap-2">
          <svg className="w-4 h-4 lg:w-6 lg:h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          {getText("checkout_title")}
        </h1>
        {/* Secure badge */}
        <div className="ml-auto hidden sm:flex items-center gap-1.5 lg:gap-2 text-green-400/80 text-xs font-medium">
          <svg className="w-3 h-3 lg:w-3.5 lg:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          SSL Secured
        </div>
      </div>

      {/* Body */}
      <div className="relative z-10 px-3 lg:px-12 pb-16 lg:pb-20">
        <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-[1fr_420px] lg:gap-10">

          {/* LEFT — Customer info */}
          <motion.div {...fade} className="space-y-4 lg:space-y-6">
            <div className="glass rounded-xl lg:rounded-2xl border border-white/10 p-4 lg:p-8">
              <h2 className="text-sm lg:text-xl font-heading font-black text-white mb-4 lg:mb-6 flex items-center gap-2">
                <span className="w-6 h-6 lg:w-7 lg:h-7 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center text-accent font-black text-[10px] lg:text-xs">1</span>
                {getText("checkout_customer_info")}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                <div className="sm:col-span-2">
                  <Field id="name" label={getText("checkout_name")} value={form.name} onChange={setField("name")} required placeholder="John Doe" getText={getText} />
                </div>
                <Field id="email" type="email" label={getText("checkout_email")} value={form.email} onChange={setField("email")} required placeholder="you@example.com" getText={getText} />
                <Field id="phone" type="tel" label={getText("checkout_phone")} value={form.phone} onChange={setField("phone")} optional placeholder="+1 555 000 0000" getText={getText} />
                <div className="sm:col-span-2">
                  <Field id="address" label={getText("checkout_address")} value={form.address} onChange={setField("address")} required placeholder="123 Main Street" getText={getText} />
                </div>
                <Field id="city" label={getText("checkout_city")} value={form.city} onChange={setField("city")} required placeholder="New York" getText={getText} />
                <Field id="zip" label={getText("checkout_zip")} value={form.zip} onChange={setField("zip")} required placeholder="10001" getText={getText} />
                <div className="sm:col-span-2">
                  <Field id="country" label={getText("checkout_country")} value={form.country} onChange={setField("country")} required placeholder="United States" getText={getText} />
                </div>
              </div>

              {formError && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-sm text-red-400 flex items-center gap-2"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formError}
                </motion.p>
              )}
            </div>

            {/* Payment section */}
            <div className="glass rounded-xl lg:rounded-2xl border border-white/10 p-4 lg:p-8">
              <h2 className="text-sm lg:text-xl font-heading font-black text-white mb-4 lg:mb-6 flex items-center gap-2">
                <span className="w-6 h-6 lg:w-7 lg:h-7 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center text-accent font-black text-[10px] lg:text-xs">2</span>
                Payment
              </h2>

              <div
                onClick={() => {
                  if (!validateForm()) {
                    setFormError(getText("checkout_required"));
                    return;
                  }
                  setFormError("");
                }}
              >
                {validateForm() ? (
                  <PayPalModal
                    total={total}
                    onSuccess={handlePayPalSuccess}
                    onCancel={() => {}}
                    getText={getText}
                  />
                ) : (
                  <button
                    onClick={() => setFormError(getText("checkout_required"))}
                    className="w-full flex items-center justify-center gap-2 lg:gap-3 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-bold text-sm lg:text-base opacity-60 cursor-not-allowed"
                    style={{ background: "linear-gradient(135deg, #003087 0%, #009cde 100%)" }}
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 lg:w-6 lg:h-6 fill-white">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z" />
                    </svg>
                    <span className="text-white text-sm lg:text-lg">{getText("checkout_pay_paypal")}</span>
                  </button>
                )}
              </div>

              {/* Trust badges */}
              <div className="mt-4 lg:mt-5 flex items-center justify-center gap-3 lg:gap-4 flex-wrap">
                {["256-bit SSL", "Secure Checkout", "Buyer Protection"].map((badge) => (
                  <div key={badge} className="flex items-center gap-1 lg:gap-1.5 text-white/30 text-[10px] lg:text-xs">
                    <svg className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-green-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT — Order summary (sticky) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 lg:mt-0"
          >
            <div className="glass rounded-xl lg:rounded-2xl border border-white/10 p-4 lg:p-6 lg:sticky lg:top-6 space-y-4 lg:space-y-5">
              <h2 className="text-sm lg:text-lg font-heading font-black text-white flex items-center gap-2">
                <span className="w-6 h-6 lg:w-7 lg:h-7 rounded-lg bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary font-black text-[10px] lg:text-xs">✓</span>
                {getText("checkout_order_summary")}
              </h2>

              {/* Items */}
              <div className="space-y-2 lg:space-y-3 max-h-48 lg:max-h-72 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={`${item.productId}-${item.color}-${item.size}`}
                    className="flex gap-2 lg:gap-3 p-2.5 lg:p-3 rounded-lg lg:rounded-xl bg-white/5 border border-white/5">
                    <div className="w-10 h-12 lg:w-12 lg:h-14 flex-shrink-0 rounded-lg overflow-hidden bg-white/5">
                      {item.product.image ? (
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20 text-[9px] text-center p-1">{item.product.name}</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white leading-snug line-clamp-1">{item.product.name}</p>
                      <div className="flex items-center gap-1.5 lg:gap-2 mt-0.5 lg:mt-1">
                        <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full border border-white/30 flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-[10px] lg:text-xs text-white/40">{item.size}</span>
                        <span className="text-white/20">·</span>
                        <span className="text-[10px] lg:text-xs text-white/40">×{item.quantity}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-white self-center whitespace-nowrap">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between text-xs lg:text-sm text-white/60">
                  <span>{getText("checkout_subtotal")}</span>
                  <span className="text-white font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-xs lg:text-sm text-white/60">
                  <span>{getText("checkout_shipping")}</span>
                  <span className="text-white font-semibold">${shipping.toFixed(2)}</span>
                </div>
                <div className="h-px bg-white/10" />
                <div className="flex items-center justify-between">
                  <span className="text-sm lg:text-base font-black text-white">{getText("checkout_total")}</span>
                  <span className="text-xl lg:text-2xl font-black gradient-text">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* PayPal logo strip */}
              <div className="flex items-center justify-center gap-2 py-1.5 lg:py-2 px-3 lg:px-4 rounded-lg lg:rounded-xl bg-white/5 border border-white/10">
                <svg viewBox="0 0 24 24" className="w-4 h-4 lg:w-5 lg:h-5" style={{ fill: "#009cde" }}>
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z" />
                </svg>
                <span className="text-white/40 text-[10px] lg:text-xs">Powered by PayPal</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
