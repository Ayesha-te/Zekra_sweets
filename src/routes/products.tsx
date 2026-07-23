import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Search } from "lucide-react";
import { useEffect, useState } from "react";

import { StructuredData } from "@/components/seo/StructuredData";
import { SiteLayout } from "@/components/site/SiteLayout";
import { assetUrl, type Product } from "@/lib/api";
import { formatMoney } from "@/lib/cart";
import {
  filterProducts,
  loadProducts,
  productDisplayOriginalPrice,
  productDisplayPrice,
  productCategories,
  productSizeOptions,
  type ProductCategoryFilter,
} from "@/lib/products";
import { buildSeoHead, effectiveProductSeo, itemListJsonLd, productSlug } from "@/lib/seo";

export const Route = createFileRoute("/products")({
  loader: () => loadProducts(),
  head: () =>
    buildSeoHead({
      title: "Shop Cookies, Baklawa, Rusk and Puffs | Zekra Sweets",
      description:
        "Browse Zekra Sweets cookies, rusks, baklawa and khaari puffs. Explore handmade bakery treats and order online.",
      path: "/products",
    }),
  component: Products,
});

function Products() {
  const initialProducts = Route.useLoaderData();
  const [cat, setCat] = useState<ProductCategoryFilter>("All products");
  const [q, setQ] = useState("");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filterProducts(products, cat, q);

  return (
    <SiteLayout>
      <StructuredData data={itemListJsonLd(products)} />
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="glass rounded-[1.75rem] p-5 sm:p-6 md:p-7" data-reveal>
          <span className="text-[11px] uppercase tracking-[0.24em] text-caramel">Browse by</span>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">
            All <span className="text-gradient-gold">products.</span>
          </h1>
          <p className="mt-2 text-sm text-foreground/75 sm:text-base">
            {loading
              ? "Loading fresh availability..."
              : `${filtered.length} handcrafted treats - baked fresh, delivered warm.`}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-[220px] flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(event) => setQ(event.target.value)}
                placeholder="Search products..."
                className="w-full rounded-full border border-border bg-cream/60 px-11 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {productCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setCat(category)}
                  className={`rounded-full px-3.5 py-2 text-xs font-medium transition-all ${
                    cat === category
                      ? "bg-gradient-gold text-primary-foreground shadow-glow"
                      : "glass text-foreground/80 hover:text-primary"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-7xl px-4 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product, index) => {
            const seo = effectiveProductSeo(product);
            const sizes = productSizeOptions(product);
            const displayPrice = productDisplayPrice(product);
            const displayOriginalPrice = productDisplayOriginalPrice(product);

            return (
              <article
                key={product.id}
                data-reveal
                style={{ transitionDelay: `${(index % 6) * 70}ms` }}
                className="group glass overflow-hidden rounded-3xl hover-lift"
              >
                <Link
                  to="/products/$slug"
                  params={{ slug: productSlug(product) }}
                  className="relative block aspect-square overflow-hidden"
                >
                  <img
                    src={assetUrl(product.imageUrl)}
                    alt={seo.imageAlt}
                    loading="lazy"
                    width={640}
                    height={640}
                    className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                  />
                  {product.tag && (
                    <span className="absolute left-4 top-4 rounded-full bg-gradient-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary-foreground shadow-glow">
                      {product.tag}
                    </span>
                  )}
                </Link>
                <div className="p-5">
                  <div className="text-[10px] uppercase tracking-widest text-caramel">
                    {product.category}
                  </div>
                  <Link
                    to="/products/$slug"
                    params={{ slug: productSlug(product) }}
                    className="story-link mt-2 block"
                  >
                    <h3 className="font-display text-lg leading-tight text-foreground">
                      {product.name}
                    </h3>
                  </Link>
                  {sizes.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {sizes.slice(0, 4).map((size) => (
                        <span key={`${product.id}-${size.id || size.label}`} className="rounded-full border border-gold-soft/60 bg-cream/70 px-3 py-1 text-xs text-foreground/75">
                          {size.label}: {formatMoney(size.price)}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex items-end justify-between gap-4">
                    <div>
                      {displayOriginalPrice && (
                        <div className="text-xs text-muted-foreground line-through">
                          {formatMoney(displayOriginalPrice)}
                        </div>
                      )}
                      <div className="font-display text-2xl text-gradient-gold">
                        {sizes.length > 0 ? `From ${formatMoney(displayPrice)}` : formatMoney(displayPrice)}
                      </div>
                    </div>
                    <Link
                      to="/products/$slug"
                      params={{ slug: productSlug(product) }}
                      className="inline-flex min-w-[116px] items-center justify-center gap-2 rounded-full bg-gradient-gold px-4 py-2.5 text-xs font-medium text-primary-foreground shadow-glow transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
                    >
                      Details <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="glass mt-10 rounded-3xl p-12 text-center text-muted-foreground">
            No products match your search.
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
