import { createFileRoute, Link, notFound, redirect, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, MessageCircle, Minus, Plus, ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { StructuredData } from "@/components/seo/StructuredData";
import { ProductCard } from "@/components/products/ProductCard";
import { SiteLayout } from "@/components/site/SiteLayout";
import { assetUrl, productImageError, type Product } from "@/lib/api";
import { formatMoney, useCart } from "@/lib/cart";
import { WHATSAPP_NUMBER } from "@/lib/contact";
import {
  loadProducts,
  productDisplayName,
  productDisplayOriginalPrice,
  productDisplayPrice,
  productSizeOptions,
} from "@/lib/products";
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
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const cart = useCart();
  const navigate = useNavigate();
  const seo = effectiveProductSeo(product);
  const sizes = productSizeOptions(product);
  const displayPrice = productDisplayPrice(product);
  const displayOriginalPrice = productDisplayOriginalPrice(product);
  const visibleProductName = productDisplayName(product);
  const sizeOptions =
    sizes.length > 0
      ? sizes
      : [{ label: "Regular", price: displayPrice, originalPrice: displayOriginalPrice }];
  const selectedSize = sizeOptions[selectedSizeIndex] ?? sizeOptions[0];
  const relatedProducts = products
    .filter((candidate) => candidate.id !== product.id && candidate.category === product.category)
    .slice(0, 3);
  const details = product as Product & {
    ingredients?: string;
    allergens?: string;
    storage?: string;
    delivery?: string;
  };

  useEffect(() => {
    setSelectedImage(galleryImages[0] || product.imageUrl);
  }, [galleryImages, product.imageUrl]);

  useEffect(() => {
    setSelectedSizeIndex(0);
    setQuantity(1);
  }, [product.id]);

  useEffect(() => {
    if (!added) return;
    const timeout = window.setTimeout(() => setAdded(false), 1400);

    return () => window.clearTimeout(timeout);
  }, [added]);

  const productForBag = () => {
    if (sizes.length === 0) return product;

    return {
      ...product,
      price: selectedSize.price,
      originalPrice: selectedSize.originalPrice,
      sizeId: selectedSize.id,
      sizeLabel: selectedSize.label,
    };
  };

  const addToBag = () => {
    cart.addItem(productForBag(), quantity);
    setAdded(true);
  };

  const buyNow = () => {
    cart.addItem(productForBag(), quantity);
    void navigate({ to: "/checkout" });
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Zekra Sweets, I would like to order ${quantity} × ${product.name}${selectedSize?.label ? ` (${selectedSize.label})` : ""} at ${formatMoney(selectedSize.price)} each. ${typeof window !== "undefined" ? window.location.href : `https://zekrasweets.com${productPath(product)}`}`,
  );

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

      <section className="mx-auto max-w-[1380px] px-4 sm:px-6">
        <nav
          className="mb-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
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

        <div className="glass grid gap-7 rounded-[2rem] p-5 sm:p-7 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-8 lg:p-5">
          <div className="min-w-0">
            <div className="flex max-h-[660px] items-center justify-center overflow-hidden rounded-[1.5rem] bg-cream/35">
              <img
                src={assetUrl(selectedImage)}
                onError={productImageError}
                alt={seo.imageAlt}
                width={900}
                height={900}
                className="aspect-square max-h-[660px] w-full object-cover"
              />
            </div>

            {galleryImages.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {galleryImages.map((imageUrl, index) => {
                  const active = imageUrl === selectedImage;

                  return (
                    <button
                      key={imageUrl}
                      type="button"
                      onClick={() => setSelectedImage(imageUrl)}
                      aria-label={`View ${product.name} image ${index + 1}`}
                      className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-cream/70 transition sm:h-[4.5rem] sm:w-[4.5rem] ${
                        active
                          ? "border-primary shadow-glow"
                          : "border-gold-soft/50 hover:border-primary/60"
                      }`}
                    >
                      <img
                        src={assetUrl(imageUrl)}
                        onError={productImageError}
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
              className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-gold-soft/60 bg-cream/70 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to products
            </Link>

            <span className="text-xs uppercase tracking-[0.3em] text-caramel">
              {product.category}
            </span>
            <h1 className="mt-3 max-w-[680px] break-words font-display text-[clamp(1.875rem,8vw,2.125rem)] leading-[1.08] tracking-[-0.03em] [overflow-wrap:anywhere] md:text-[43px] md:leading-[1.06] lg:text-[clamp(2rem,3.2vw,3.5rem)] lg:leading-[1.05]">
              {visibleProductName}
            </h1>
            <p className="mt-5 max-w-[620px] text-base leading-[1.55] text-foreground/75 lg:mt-6 lg:text-[17px]">
              {cleanText(product.description)}
            </p>

            <div className="mt-6 flex flex-wrap items-end gap-3">
              <span className="font-display text-4xl text-gradient-gold">
                {formatMoney(selectedSize.price)}
              </span>
              {selectedSize.originalPrice && (
                <span className="pb-1 text-sm text-muted-foreground line-through">
                  {formatMoney(selectedSize.originalPrice)}
                </span>
              )}
            </div>

            <fieldset className="mt-6 min-w-0">
              <legend className="text-xs font-semibold uppercase tracking-[0.2em] text-caramel">
                Select size
              </legend>
              <div
                className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:gap-3 sm:overflow-x-auto sm:pb-1"
                role="radiogroup"
              >
                {sizeOptions.map((size, index) => {
                  const selected = index === selectedSizeIndex;

                  return (
                    <button
                      key={`${size.label}-${size.price}`}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setSelectedSizeIndex(index)}
                      className={`relative flex min-h-11 min-w-0 flex-col justify-center overflow-hidden rounded-xl border px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 sm:w-auto sm:min-w-[7.25rem] sm:shrink-0 sm:px-3.5 ${
                        selected
                          ? "border-primary bg-secondary shadow-sm"
                          : "border-gold-soft/55 bg-cream/65 hover:border-primary/60 hover:bg-secondary/60"
                      }`}
                    >
                      <span className="flex min-w-0 items-center justify-between gap-2 text-sm font-bold leading-tight text-foreground">
                        <span className="min-w-0 break-words">{size.label}</span>
                        <span
                          aria-hidden="true"
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                            selected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-gold-soft"
                          }`}
                        >
                          {selected && <Check className="h-3 w-3" />}
                        </span>
                      </span>
                      <span className="mt-0.5 flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0">
                        <span className="font-display text-[17px] text-primary">
                          {formatMoney(size.price)}
                        </span>
                        {size.originalPrice && (
                          <span className="text-[11px] text-muted-foreground line-through">
                            {formatMoney(size.originalPrice)}
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-5">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-caramel">
                Quantity
              </div>
              <div className="mt-3 inline-flex min-h-11 items-center overflow-hidden rounded-xl border border-gold-soft/60 bg-cream/70">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  disabled={quantity === 1}
                  aria-label={`Decrease quantity of ${product.name}`}
                  className="grid h-11 w-11 place-items-center disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-10 text-center text-sm font-bold" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((value) => value + 1)}
                  aria-label={`Increase quantity of ${product.name}`}
                  className="grid h-11 w-11 place-items-center"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={addToBag}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-gold-soft/60 bg-cream/70 px-6 py-3.5 text-sm font-bold text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 sm:w-auto"
              >
                {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
                {added ? "Added to bag" : "Add to bag"}
              </button>
              <button
                type="button"
                onClick={buyNow}
                className="inline-flex w-full items-center justify-center rounded-full bg-cocoa px-6 py-3.5 text-sm font-bold text-cream shadow-glow transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 sm:w-auto"
              >
                Buy now
              </button>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 sm:w-auto"
              >
                <MessageCircle className="h-4 w-4" />
                Order on WhatsApp
              </a>
            </div>
            <span className="sr-only" aria-live="polite">
              {added ? `${product.name} added to bag` : ""}
            </span>
          </div>
        </div>
      </section>

      {[details.ingredients, details.allergens, details.storage, details.delivery].some(
        Boolean,
      ) && (
        <section className="mx-auto mt-8 max-w-7xl px-4 sm:px-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(
              [
                ["Ingredients", details.ingredients],
                ["Allergens", details.allergens],
                ["Storage", details.storage],
                ["Delivery", details.delivery],
              ] as const
            )
              .filter(([, value]) => cleanText(value))
              .map(([label, value]) => (
                <section
                  key={label}
                  className="rounded-2xl border border-gold-soft/45 bg-cream/65 p-5"
                >
                  <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-caramel">
                    {label}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/75">
                    {cleanText(value)}
                  </p>
                </section>
              ))}
          </div>
        </section>
      )}

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
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
            {relatedProducts.map((related, index) => (
              <ProductCard key={related.id} product={related} index={index} />
            ))}
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
