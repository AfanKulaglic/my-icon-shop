import { create } from "zustand";

// --- localStorage helpers ---
function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveState(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// Cart item shape: { productId, color, size, quantity }
// Wishlist item shape: productId string

export const useCartWishlistStore = create((set, get) => ({
  cart: loadState("cart", []),
  wishlist: loadState("wishlist", []),

  // ── CART ──────────────────────────────────────────────────────────────────
  addToCart: (productId, color, size, quantity = 1) => {
    const cart = get().cart;
    const idx = cart.findIndex(
      (i) => i.productId === productId && i.color === color && i.size === size
    );
    let updated;
    if (idx >= 0) {
      updated = cart.map((i, n) =>
        n === idx ? { ...i, quantity: i.quantity + quantity } : i
      );
    } else {
      updated = [...cart, { productId, color, size, quantity }];
    }
    saveState("cart", updated);
    set({ cart: updated });
  },

  removeFromCart: (productId, color, size) => {
    const updated = get().cart.filter(
      (i) => !(i.productId === productId && i.color === color && i.size === size)
    );
    saveState("cart", updated);
    set({ cart: updated });
  },

  updateCartQuantity: (productId, color, size, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId, color, size);
      return;
    }
    const updated = get().cart.map((i) =>
      i.productId === productId && i.color === color && i.size === size
        ? { ...i, quantity }
        : i
    );
    saveState("cart", updated);
    set({ cart: updated });
  },

  clearCart: () => {
    saveState("cart", []);
    set({ cart: [] });
  },

  cartCount: () => get().cart.reduce((sum, i) => sum + i.quantity, 0),

  cartTotal: (products) => {
    const cart = get().cart;
    return cart.reduce((sum, item) => {
      const p = products.find((p) => p.id === item.productId);
      return sum + (p ? p.price * item.quantity : 0);
    }, 0);
  },

  // ── WISHLIST ──────────────────────────────────────────────────────────────
  addToWishlist: (productId) => {
    if (get().wishlist.includes(productId)) return;
    const updated = [...get().wishlist, productId];
    saveState("wishlist", updated);
    set({ wishlist: updated });
  },

  removeFromWishlist: (productId) => {
    const updated = get().wishlist.filter((id) => id !== productId);
    saveState("wishlist", updated);
    set({ wishlist: updated });
  },

  toggleWishlist: (productId) => {
    if (get().wishlist.includes(productId)) {
      get().removeFromWishlist(productId);
    } else {
      get().addToWishlist(productId);
    }
  },

  isWishlisted: (productId) => get().wishlist.includes(productId),
}));
