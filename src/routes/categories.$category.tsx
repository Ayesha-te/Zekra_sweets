import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { ProductCard } from "@/components/products/ProductCard";
import { StructuredData } from "@/components/seo/StructuredData";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CATEGORY_CONTENT, type CategorySlug } from "@/lib/content";
import { loadProducts } from "@/lib/products";
import { breadcrumbJsonLd, buildSeoHead, itemListJsonLd } from "@/lib/seo";

export const Route = createFileRoute("/categories/$category")({
  loader: async ({ params }) => {
    const category = CATEGORY_CONTENT[params.category as CategorySlug];
    if (!category) throw notFound();
    const products = (await loadProducts()).filter(
      (product) => product.isActive !== false && product.category === category.productCategory,
    );
    return { category, products, slug: params.category };
  },
  head: ({ loaderData }) =>
    loaderData
      ? buildSeoHead({
          title: `${loaderData.category.label} in Ajman | Zekra Sweets`,
          description: loaderData.category.description,
          path: `/categories/${loaderData.slug}`,
        })
      : {},
  component: CategoryPage,
});

function CategoryPage() {
  const { category, products, slug } = Route.useLoaderData();
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: category.label, path: `/categories/${slug}` },
  ];

  return (
    <SiteLayout>
      <StructuredData data={[breadcrumbJsonLd(crumbs), itemListJsonLd(products)]} />
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex flex-wrap items-center gap-2 text-sm text-foreground/65"
        >
          <Link to="/">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <Link to="/products">Products</Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <span aria-current="page">{category.label}</span>
        </nav>
        <header
          className="glass rounded-[2rem] border-t border-gold-soft/60 p-7 sm:p-10"
          data-reveal
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-caramel">
            Zekra Sweets collection
          </p>
          <h1 className="mt-3 font-display text-5xl sm:text-6xl">{category.label}</h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-foreground/75">
            {category.description}
          </p>
        </header>
      </section>
      <section
        className="mx-auto mt-8 max-w-7xl px-4 sm:px-6"
        aria-label={`${category.label} products`}
      >
        {products.length ? (
          <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-[2rem] px-6 py-14 text-center">
            <h2 className="font-display text-3xl">
              No {category.label.toLowerCase()} are listed right now.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              View the full catalog for other available products.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-cocoa px-5 text-sm font-bold text-cream"
            >
              View all products
            </Link>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
