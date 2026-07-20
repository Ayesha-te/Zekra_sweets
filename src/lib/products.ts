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
    name: "Premium Tuti Fruity Butter Cookies",
    imageUrl: tuti,
    price: 6.5,
    originalPrice: 8.5,
    category: "Cookies",
  },
  {
    id: "chocolate",
    name: "Premium Chocolate Cookies",
    imageUrl: choc,
    price: 5,
    originalPrice: 7,
    category: "Cookies",
  },
  {
    id: "almond",
    name: "Premium Almond Cookies",
    imageUrl: almond,
    price: 6.5,
    originalPrice: 8.5,
    category: "Cookies",
  },
  {
    id: "baklawa",
    name: "Peanut Baklawa | Middle Eastern Delight",
    imageUrl: baklawa,
    price: 6.5,
    originalPrice: 8.5,
    category: "Sweets",
  },
  {
    id: "banana",
    name: "Premium Banana Butter Cookies",
    imageUrl: banana,
    price: 5,
    originalPrice: 7,
    category: "Cookies",
  },
  {
    id: "jeera",
    name: "Premium Jeera Cookies | Crispy Cumin",
    imageUrl: jeera,
    price: 5,
    originalPrice: 7,
    category: "Cookies",
  },
  {
    id: "khaari",
    name: "Khaari Puff Packet | Crispy Butter Puff",
    imageUrl: khaari,
    price: 6.5,
    originalPrice: 8.5,
    tag: "Offer",
    category: "Puff",
  },
  {
    id: "butter",
    name: "Plain Butter Cookies | Classic Crispy",
    imageUrl: butter,
    price: 5,
    originalPrice: 7,
    tag: "Offer",
    category: "Cookies",
  },
  {
    id: "rusk",
    name: "Fresh Rusk Packet | Tea Time Toast",
    imageUrl: rusk,
    price: 6.5,
    originalPrice: 8.5,
    tag: "Fresh",
    category: "Rusk",
  },
];

export const productCategories = ["All products", "Cookies", "Sweets", "Rusk", "Puff"] as const;

export type ProductCategoryFilter = (typeof productCategories)[number];

export async function loadProducts() {
  try {
    const products = await apiFetch<Product[]>("/api/products");
    return products.length > 0 ? products : fallbackProducts;
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
