import type { Product } from "@/lib/api";
import { apiFetch } from "@/lib/api";

export const fallbackProducts: Product[] = [];

export const productCategories = ["All products", "Combo Packs", "Cookies", "Sweets", "Rusk", "Puff"] as const;

export type ProductCategoryFilter = (typeof productCategories)[number];

export function productDisplayName(product: Product) {
  const explicitDisplayName = product.displayName?.trim();
  if (explicitDisplayName) return explicitDisplayName;

  const shortenedName = product.name.split("|", 1)[0]?.trim();
  return shortenedName || product.name;
}

const PRODUCT_CACHE_TTL_MS = 0;
let cachedProducts: Product[] | null = null;
let productsCacheExpiresAt = 0;
let pendingProducts: Promise<Product[]> | null = null;

export function productSizeOptions(product: Product) {
  return (product.sizes || [])
    .filter((size) => size.label && Number.isFinite(Number(size.price)))
    .map((size) => ({
      ...size,
      price: Number(size.price),
      originalPrice:
        size.originalPrice === null || size.originalPrice === undefined
          ? null
          : Number(size.originalPrice),
    }));
}

export function productDisplayPrice(product: Product) {
  const sizes = productSizeOptions(product);
  if (sizes.length === 0) return Number(product.price) || 0;
  return Math.min(...sizes.map((size) => size.price));
}

export function productDisplayOriginalPrice(product: Product) {
  const sizes = productSizeOptions(product);
  if (sizes.length === 0) return product.originalPrice ?? null;
  const lowestSize = sizes.reduce(
    (lowest, size) => (size.price < lowest.price ? size : lowest),
    sizes[0],
  );
  return lowestSize.originalPrice ?? null;
}

export async function loadProducts() {
  if (cachedProducts && Date.now() < productsCacheExpiresAt) return cachedProducts;
  if (pendingProducts) return pendingProducts;

  pendingProducts = apiFetch<Product[]>("/api/products", { cache: "no-store" })
    .then((products) => {
      if (products.length === 0) return fallbackProducts;
      cachedProducts = products;
      productsCacheExpiresAt = Date.now() + PRODUCT_CACHE_TTL_MS;
      return products;
    })
    .catch(() => cachedProducts || fallbackProducts)
    .finally(() => {
      pendingProducts = null;
    });

  return pendingProducts;
}

export function filterProducts(
  products: Product[],
  category: ProductCategoryFilter,
  query: string,
) {
  const needle = query.trim().toLowerCase();

  return products.filter((product) => {
    const matchesCategory =
      category === "All products" ||
      (category === "Combo Packs" ? product.isComboPack === true : product.category === category);
    const searchable = [
      product.name,
      product.category,
      product.primaryKeyword,
      ...(product.secondaryKeywords || []),
      product.description,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const matchesQuery = !needle || searchable.includes(needle);

    return matchesCategory && matchesQuery;
  });
}
