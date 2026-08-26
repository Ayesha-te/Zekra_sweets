import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ProductCard } from "@/components/products/ProductCard";
import { StructuredData } from "@/components/seo/StructuredData";
import { SiteLayout } from "@/components/site/SiteLayout";
import type { Product } from "@/lib/api";
import {
  filterProducts,
  loadProducts,
  productCategoryFilters,
  type ProductCategoryFilter,
} from "@/lib/products";
import { buildSeoHead, itemListJsonLd } from "@/lib/seo";

type ProductSearch = { q?: string; category?: string };

export const Route = createFileRoute("/products")({
  validateSearch: (search: Record<string, unknown>): ProductSearch => ({
    q: typeof search.q === "string" && search.q.trim() ? search.q : undefined,
    category:
      typeof search.category === "string" && search.category.trim() ? search.category : undefined,
  }),
  loader: () => loadProducts(),
  head: ({ match }) =>
    buildSeoHead({
      title: "Shop Cookies, Baklawa, Rusk and Puffs | Zekra Sweets",
      description:
        "Browse Zekra Sweets cookies, rusks, baklawa and khaari puffs. Explore handmade bakery treats and order online.",
      path: "/products",
      robots: match.search.q || match.search.category ? "noindex, follow" : "index, follow",
    }),
  component: Products,
});

function Products() {
  const initialProducts = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/products" });
  const products = initialProducts;
  const categories = useMemo(() => productCategoryFilters(products), [products]);
  const initialCategory = categories.includes(search.category as ProductCategoryFilter)
    ? (search.category as ProductCategoryFilter)
    : "All products";
  const [category, setCategory] = useState<ProductCategoryFilter>(initialCategory);
  const [query, setQuery] = useState(search.q || "");
  const [debouncedQuery, setDebouncedQuery] = useState(search.q || "");
  const loading = false;

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => window.clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    void navigate({
      search: {
        q: debouncedQuery || undefined,
        category: category === "All products" ? undefined : category,
      },
      replace: true,
      resetScroll: false,
    });
  }, [category, debouncedQuery, navigate]);

  const filtered = useMemo(
    () => filterProducts(products, category, debouncedQuery),
    [products, category, debouncedQuery],
  );
  const filteredOut = category !== "All products" || Boolean(debouncedQuery);
  const clearFilters = () => {
    setQuery("");
    setDebouncedQuery("");
    setCategory("All products");
  };

  return (
    <SiteLayout>
      <StructuredData data={itemListJsonLd(products)} />
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="glass rounded-[1.75rem] p-5 sm:p-7" data-reveal>
          <span className="text-[11px] uppercase tracking-[0.24em] text-caramel">
            The bakery counter
          </span>
          <div className="mt-2 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h1 className="font-display text-4xl sm:text-5xl">
                Fresh <span className="text-gradient-gold">selection.</span>
              </h1>
              <p className="mt-2 text-sm text-foreground/70">
                {loading
                  ? "Loading current products..."
                  : `${filtered.length} of ${products.length} products`}
              </p>
            </div>
            {filteredOut && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex min-h-11 items-center gap-2 self-start rounded-xl border border-gold-soft/60 px-4 text-sm font-bold hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
              >
                <X className="h-4 w-4" /> Clear filters
              </button>
            )}
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(240px,1fr)_auto] lg:items-center">
            <label className="relative block">
              <span className="sr-only">Search products</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, category or description"
                className="min-h-11 w-full rounded-xl border border-border bg-cream/70 px-11 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filter by category">
              <SlidersHorizontal className="mt-3 h-4 w-4 shrink-0 text-caramel" aria-hidden />
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  aria-pressed={category === item}
                  className={`min-h-11 shrink-0 rounded-xl border px-3 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 ${category === item ? "border-cocoa bg-cocoa text-cream" : "border-gold-soft/55 bg-cream/60 hover:bg-secondary"}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6">
        {loading && products.length === 0 ? (
          <div
            className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4"
            aria-label="Loading products"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] animate-pulse rounded-[1.4rem] bg-secondary/70 motion-reduce:animate-none"
              />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-[2rem] px-6 py-14 text-center">
            <h2 className="font-display text-3xl">
              {products.length === 0 ? "The counter is being updated." : "No matching treats."}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              {products.length === 0
                ? "There are no products available online right now. Please check back soon."
                : "Try another search or clear the current filters."}
            </p>
            {filteredOut && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 min-h-11 rounded-xl bg-cocoa px-5 text-sm font-bold text-cream"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
