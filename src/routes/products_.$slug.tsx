import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { ArrowLeft, Check, ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { StructuredData } from "@/components/seo/StructuredData";
import { SiteLayout } from "@/components/site/SiteLayout";
import { assetUrl, type Product } from "@/lib/api";
import { formatMoney, useCart } from "@/lib/cart";
import { loadProducts } from "@/lib/products";
import {
  breadcrumbJsonLd,
  cleanText,
  effectiveProductSeo,
  productJsonLd,
  productImageUrls,
  productPath,
  productSeoHead,
  productSlug,
  slugify,
} from "@/lib/seo";

export const Route = createFileRoute("/products_/$slug")({
  loader: async ({ params }) => {
    const products = await loadProducts();
    const requestedSlug = slugify(params.slug);
    const product = products.find((candidate) => productMatchesSlug(candidate, requestedSlug));

    if (!product) throw notFound();

    const canonicalSlug = productSlug(product);
    if (requestedSlug !== canonicalSlug) {
      throw redirect({
        to: "/products/$slug",
        params: { slug: canonicalSlug },
        statusCode: 301,
      });
    }

    return { product, products };
  },
  head: ({ loaderData }) => productSeoHead(loaderData.product),
  component: ProductPage,
});

function ProductPage() {
  const { product, products } = Route.useLoaderData();
  const galleryImages = useMemo(() => productImageUrls(product), [product]);
  const [selectedImage, setSelectedImage] = useState(galleryImages[0] || product.imageUrl);
  const [added, setAdded] = useState(false);
  const cart = useCart();
  const seo = effectiveProductSeo(product);
  const relatedProducts = products
    .filter((candidate) => candidate.id !== product.id && candidate.category === product.category)
    .slice(0, 3);

  useEffect(() => {
    if (!added) return;
    const timeout = window.setTimeout(() => setAdded(false), 1400);

    return () => window.clearTimeout(timeout);
  }, [added]);

  useEffect(() => {
    setSelectedImage(galleryImages[0] || product.imageUrl);
  }, [galleryImages, product.imageUrl]);

  const addToBag = () => {
    cart.addItem(product);
    setAdded(true);
  };

  return (
    <SiteLayout>
      <StructuredData data={productJsonLd(product)} />
      <StructuredData
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: product.name, path: productPath(product) },
        ])}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav
          className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <Link to="/" className="story-link text-foreground/75">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="story-link text-foreground/75">
            Products
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="glass grid gap-8 rounded-[2rem] p-5 sm:p-7 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)]">
          <div>
            <div className="overflow-hidden rounded-[1.5rem]">
              <img
                src={assetUrl(selectedImage)}
                alt={seo.imageAlt}
                width={900}
                height={900}
                className="aspect-square w-full object-cover"
              />
            </div>

            {galleryImages.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
                {galleryImages.map((imageUrl, index) => {
                  const active = imageUrl === selectedImage;

                  return (
                    <button
                      key={imageUrl}
                      type="button"
                      onClick={() => setSelectedImage(imageUrl)}
                      aria-label={`View ${product.name} image ${index + 1}`}
                      className={`overflow-hidden rounded-2xl border bg-cream/70 transition ${
                        active ? "border-primary shadow-glow" : "border-gold-soft/50 hover:border-primary/60"
                      }`}
                    >
                      <img
                        src={assetUrl(imageUrl)}
                        alt=""
                        loading="lazy"
                        width={160}
                        height={160}
                        className="aspect-square w-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-col justify-center">
            <Link
              to="/products"
              className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-gold-soft/60 bg-cream/70 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to products
            </Link>

            <span className="text-xs uppercase tracking-[0.3em] text-caramel">
              {product.category}
            </span>
            <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">{product.name}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground/75 sm:text-base">
              {cleanText(product.description) ||
                `Fresh handmade ${cleanText(product.category).toLowerCase()} from Zekra Sweets.`}
            </p>

            <div className="mt-7 flex flex-wrap items-end gap-3">
              <span className="font-display text-4xl text-gradient-gold">
                {formatMoney(product.price)}
              </span>
              {product.originalPrice && (
                <span className="pb-1 text-sm text-muted-foreground line-through">
                  {formatMoney(product.originalPrice)}
                </span>
              )}
            </div>

            <button
              onClick={addToBag}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 sm:w-fit"
            >
              {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
              {added ? "Added to bag" : "Add to bag"}
            </button>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="mx-auto mt-12 max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-caramel">More from</span>
              <h2 className="mt-2 font-display text-3xl">{product.category}</h2>
            </div>
            <Link to="/products" className="text-sm font-medium text-primary story-link">
              View all products
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((related) => {
              const relatedSeo = effectiveProductSeo(related);

              return (
                <Link
                  key={related.id}
                  to="/products/$slug"
                  params={{ slug: productSlug(related) }}
                  className="group glass overflow-hidden rounded-3xl hover-lift"
                >
                  <img
                    src={assetUrl(related.imageUrl)}
                    alt={relatedSeo.imageAlt}
                    loading="lazy"
                    width={520}
                    height={520}
                    className="aspect-square w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                  />
                  <div className="p-5">
                    <div className="text-[10px] uppercase tracking-widest text-caramel">
                      {related.category}
                    </div>
                    <h3 className="mt-2 font-display text-lg leading-tight">{related.name}</h3>
                    <p className="mt-3 font-semibold text-primary">{formatMoney(related.price)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </SiteLayout>
  );
}

function productMatchesSlug(product: Product, requestedSlug: string) {
  const redirects = Array.isArray(product.redirectSlugs) ? product.redirectSlugs : [];

  return (
    requestedSlug === productSlug(product) ||
    requestedSlug === slugify(product.id) ||
    redirects.map(slugify).includes(requestedSlug)
  );
}
