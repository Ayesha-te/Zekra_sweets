import type { Product } from "@/lib/api";
import { apiFetch } from "@/lib/api";

import almond from "@/assets/almond-cookies.jpg";
import baklawa from "@/assets/baklawa.jpg";
import banana from "@/assets/banana.jpg";
import butter from "@/assets/butter.jpg";
import choc from "@/assets/chocolate.jpg";
import jeera from "@/assets/jeera.jpg";
import khaari from "@/assets/khaari.jpg";
import rusk from "@/assets/rusk.jpg";
import tuti from "@/assets/tuti-fruity.jpg";

export const fallbackProducts: Product[] = [
  {
    id: "tuti-fruity",
    name: "Premium Tuti Fruity Butter Cookies | Fruity Biscuits",
    imageUrl: tuti,
    price: 8,
    originalPrice: 10,
    category: "Cookies",
  },
  {
    id: "chocolate",
    name: "Premium Chocolate Cookies | Rich & Crispy Choco Biscuits",
    imageUrl: choc,
    price: 6,
    originalPrice: 8,
    category: "Cookies",
  },
  {
    id: "almond",
    name: "Premium Almond Cookies | Crispy Almond Butter Biscuits",
    imageUrl: almond,
    price: 8,
    originalPrice: 10,
    category: "Cookies",
  },
  {
    id: "baklawa",
    name: "Peanut Baklawa | Premium Middle Eastern Sweet Delight",
    imageUrl: baklawa,
    price: 8,
    originalPrice: 10,
    category: "Sweets",
  },
  {
    id: "banana",
    name: "Premium Banana Cookies | Rich Banana Butter Biscuits",
    imageUrl: banana,
    price: 6,
    originalPrice: 8,
    category: "Cookies",
  },
  {
    id: "jeera",
    name: "Premium Jeera Cookies | Crispy Cumin Butter Biscuits",
    imageUrl: jeera,
    price: 6,
    originalPrice: 8,
    category: "Cookies",
  },
  {
    id: "khaari",
    name: "Khaari Puff Packet | Crispy Butter Puff",
    imageUrl: khaari,
    price: 8,
    originalPrice: 10,
    tag: "Offer",
    category: "Puff",
  },
  {
    id: "butter",
    name: "Plain Butter Cookies | Classic Crispy Butter Biscuits",
    imageUrl: butter,
    price: 6,
    originalPrice: 8,
    tag: "Offer",
    category: "Cookies",
  },
  {
    id: "rusk",
    name: "Fresh Rusk Packet | Tea Time Toast",
    imageUrl: rusk,
    price: 8,
    originalPrice: 10,
    tag: "Fresh",
    category: "Rusk",
  },
];

export const productCategories = ["All products", "Cookies", "Sweets", "Rusk", "Puff"] as const;

export type ProductCategoryFilter = (typeof productCategories)[number];

const productFallbackEnabled =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_PRODUCT_FALLBACK === "true";

export async function loadProducts() {
  try {
    const products = await apiFetch<Product[]>("/api/products");
    return products.length > 0 || !productFallbackEnabled ? products : fallbackProducts;
  } catch {
    return productFallbackEnabled ? fallbackProducts : [];
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
