import type { Product } from "@/lib/api";
import { apiFetch } from "@/lib/api";

export const fallbackProducts: Product[] = [];

export const productCategories = ["All products", "Cookies", "Sweets", "Rusk", "Puff"] as const;

export type ProductCategoryFilter = (typeof productCategories)[number];

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
  const lowestSize = sizes.reduce((lowest, size) => (size.price < lowest.price ? size : lowest), sizes[0]);
  return lowestSize.originalPrice ?? null;
}

export async function loadProducts() {
  try {
    const products = await apiFetch<Product[]>("/api/products");
    return products;
  } catch {
    return fallbackProducts;
  }
}

export function filterProducts(
  products: Product[],
  category: ProductCategoryFilter,
  query: string,
) {
  const needle = query.trim().toLowerCase();

  return products.filter((product) => {
    const matchesCategory = category === "All products" || product.category === category;
    const matchesQuery = !needle || product.name.toLowerCase().includes(needle);

    return matchesCategory && matchesQuery;
  });
}
