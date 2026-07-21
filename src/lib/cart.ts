import { useEffect, useSyncExternalStore } from "react";
import type { Product } from "@/lib/api";

export type CartProduct = Pick<
  Product,
  | "id"
  | "name"
  | "imageUrl"
  | "imageAlt"
  | "price"
  | "originalPrice"
  | "tag"
  | "category"
  | "urlSlug"
>;

export type CartItem = {
  product: CartProduct;
  quantity: number;
};

export type CartSnapshot = {
  items: CartItem[];
};

export type CartTotals = {
  count: number;
  subtotal: number;
  deliveryEstimate: number;
  total: number;
};

const STORAGE_KEY = "zekra-sweets-cart-v1";
export const FREE_DELIVERY_MINIMUM = 50;
const serverSnapshot: CartSnapshot = { items: [] };

let cartState: CartSnapshot = { items: [] };
let loadedFromStorage = false;
let storageListenerAttached = false;

const listeners = new Set<() => void>();

function isBrowser() {
  return typeof window !== "undefined";
}

function normalizeQuantity(quantity: number) {
  if (!Number.isFinite(quantity)) return 1;
  return Math.max(1, Math.floor(quantity));
}

function normalizeProduct(product: Product): CartProduct {
  return {
    id: product.id,
    name: product.name,
    imageUrl: product.imageUrl,
    imageAlt: product.imageAlt,
    urlSlug: product.urlSlug,
    price: Number(product.price) || 0,
    originalPrice: product.originalPrice,
    tag: product.tag,
    category: product.category,
  };
}

function normalizeItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item): CartItem | null => {
      if (!item || typeof item !== "object") return null;
      const candidate = item as Partial<CartItem>;
      const product = candidate.product;

      if (!product || typeof product !== "object" || !product.id || !product.name) return null;

      return {
        product: {
          id: String(product.id),
          name: String(product.name),
          imageUrl: String(product.imageUrl || ""),
          imageAlt: typeof product.imageAlt === "string" ? product.imageAlt : undefined,
          urlSlug: typeof product.urlSlug === "string" ? product.urlSlug : undefined,
          price: Number(product.price) || 0,
          originalPrice:
            product.originalPrice === null || product.originalPrice === undefined
              ? product.originalPrice
              : Number(product.originalPrice),
          tag: product.tag,
          category: String(product.category || "Sweets"),
        },
        quantity: normalizeQuantity(Number(candidate.quantity)),
      };
    })
    .filter((item): item is CartItem => Boolean(item));
}

function readStorage(): CartSnapshot {
  if (!isBrowser()) return { items: [] };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw) as Partial<CartSnapshot>;
    return { items: normalizeItems(parsed.items) };
  } catch {
    return { items: [] };
  }
}

function writeStorage(snapshot: CartSnapshot) {
  if (!isBrowser()) return;

  try {
    if (snapshot.items.length === 0) {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    }
  } catch {
    // Cart actions should keep working even when storage is unavailable.
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

function attachStorageListener() {
  if (!isBrowser() || storageListenerAttached) return;

  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    cartState = readStorage();
    emit();
  });
  storageListenerAttached = true;
}

export function initializeCart() {
  if (!isBrowser()) return;
  attachStorageListener();
  if (loadedFromStorage) return;

  cartState = readStorage();
  loadedFromStorage = true;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return cartState;
}

function getServerSnapshot() {
  return serverSnapshot;
}

function commit(items: CartItem[]) {
  cartState = { items: items.filter((item) => item.quantity > 0) };
  loadedFromStorage = true;
  writeStorage(cartState);
  emit();
}

export function addCartItem(product: Product, quantity = 1) {
  initializeCart();

  const amount = normalizeQuantity(quantity);
  const existing = cartState.items.find((item) => item.product.id === product.id);

  if (existing) {
    commit(
      cartState.items.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + amount, product: normalizeProduct(product) }
          : item,
      ),
    );
    return;
  }

  commit([...cartState.items, { product: normalizeProduct(product), quantity: amount }]);
}

export function updateCartQuantity(productId: string, quantity: number) {
  initializeCart();

  if (quantity <= 0) {
    removeCartItem(productId);
    return;
  }

  commit(
    cartState.items.map((item) =>
      item.product.id === productId ? { ...item, quantity: normalizeQuantity(quantity) } : item,
    ),
  );
}

export function removeCartItem(productId: string) {
  initializeCart();
  commit(cartState.items.filter((item) => item.product.id !== productId));
}

export function clearCart() {
  initializeCart();
  commit([]);
}

export function getCartTotals(items: CartItem[], deliveryCharge = 0): CartTotals {
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryEstimate =
    count > 0 && subtotal < FREE_DELIVERY_MINIMUM ? Math.max(0, deliveryCharge) : 0;

  return {
    count,
    subtotal,
    deliveryEstimate,
    total: subtotal + deliveryEstimate,
  };
}

export function formatMoney(value: number) {
  return `AED ${value.toFixed(2)}`;
}

export function useCart() {
  const cart = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    initializeCart();
  }, []);

  const totals = getCartTotals(cart.items);

  return {
    ...cart,
    ...totals,
    addItem: addCartItem,
    updateQuantity: updateCartQuantity,
    removeItem: removeCartItem,
    clear: clearCart,
    getItemQuantity: (productId: string) =>
      cart.items.find((item) => item.product.id === productId)?.quantity ?? 0,
  };
}
