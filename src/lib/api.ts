export type Product = {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  originalPrice?: number | null;
  tag?: string;
  description?: string;
  urlSlug?: string;
  metaTitle?: string;
  metaDescription?: string;
  imageAlt?: string;
  isActive?: boolean;
  category: "Cookies" | "Sweets" | "Rusk" | "Puff" | string;
};

export type DeliveryLocation = {
  id: string;
  name: string;
  charge: number;
  isActive?: boolean;
};

export const API_BASE = import.meta.env.VITE_API_URL || "https://api.zekrasweets.com";

export function assetUrl(path: string) {
  if (!path) return "";
  if (/^(data|blob):/i.test(path)) return path;
  if (/^https?:\/\//i.test(path)) return path;
  if (
    path.startsWith("/assets/") ||
    path.startsWith("/src/") ||
    path.startsWith("/seed-products/")
  ) {
    return path;
  }
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    throw new Error(body?.message || "Request failed");
  }

  return body as T;
}

export type FulfillmentMode = "delivery" | "pickup";

export type CreateOrderPayload = {
  customer: {
    name: string;
    phone: string;
  };
  fulfillment: {
    mode: FulfillmentMode;
    address?: string;
    locationId?: string;
  };
  notes?: string;
  items: Array<{
    productId: string;
    name: string;
    category?: string;
    quantity: number;
    unitPrice: number;
  }>;
  totals: {
    currency: "AED";
    subtotal: number;
    delivery: number;
    total: number;
  };
};

export const fallbackDeliveryLocations: DeliveryLocation[] = [
  { id: "ajman", name: "Ajman", charge: 10, isActive: true },
  { id: "sharjah", name: "Sharjah", charge: 15, isActive: true },
  { id: "dubai", name: "Dubai", charge: 25, isActive: true },
];

export async function loadDeliveryLocations() {
  try {
    const locations = await apiFetch<DeliveryLocation[]>("/api/delivery-locations");
    return locations
      .filter((location) => location.isActive !== false)
      .map((location) => ({
        ...location,
        charge: Number(location.charge) || 0,
      }));
  } catch {
    return fallbackDeliveryLocations;
  }
}

export type CreateOrderResponse = {
  id?: string;
  _id?: string;
  orderId?: string;
  orderNumber?: string;
  number?: string;
  status?: string;
  message?: string;
};

export function createOrder(payload: CreateOrderPayload) {
  return apiFetch<CreateOrderResponse>("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
