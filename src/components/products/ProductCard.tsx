import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { assetUrl, productImageError, type Product } from "@/lib/api";
import { formatMoney, useCart } from "@/lib/cart";
import {
  productDisplayOriginalPrice,
  productDisplayPrice,
  productSizeOptions,
} from "@/lib/products";
import { effectiveProductSeo, productSlug } from "@/lib/seo";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const sizes = useMemo(() => productSizeOptions(product), [product]);
  const [sizeKey, setSizeKey] = useState(sizes[0]?.id || sizes[0]?.label || "");
  const [action, setAction] = useState<"add" | "buy" | null>(null);
  const [added, setAdded] = useState(false);
  const cart = useCart();
  const navigate = useNavigate();
  const seo = effectiveProductSeo(product);
  const selectedSize = sizes.find((size) => (size.id || size.label) === sizeKey) || sizes[0];
  const price = selectedSize?.price ?? productDisplayPrice(product);
  const originalPrice = selectedSize?.originalPrice ?? productDisplayOriginalPrice(product);
  const isSale = originalPrice != null && originalPrice > price;
  const bagProduct = selectedSize
    ? {
        ...product,
        price: selectedSize.price,
        originalPrice: selectedSize.originalPrice,
        sizeId: selectedSize.id,
        sizeLabel: selectedSize.label,
      }
    : product;

  useEffect(() => {
    if (!added) return;
    const timeout = window.setTimeout(() => setAdded(false), 1400);
    return () => window.clearTimeout(timeout);
  }, [added]);

  const add = () => {
    if (action) return;
    setAction("add");
    cart.addItem(bagProduct);
    setAdded(true);
    window.setTimeout(() => setAction(null), 300);
  };

  const buy = async () => {
    if (action) return;
    setAction("buy");
    cart.addItem(bagProduct);
    await navigate({ to: "/checkout" });
  };

  return (
    <article
      data-reveal
      style={{ transitionDelay: `${(index % 8) * 45}ms` }}
      className="group overflow-hidden rounded-[1.4rem] border border-gold-soft/45 bg-cream/70 shadow-glass transition duration-300 hover:-translate-y-1 hover:shadow-elegant motion-reduce:transform-none"
    >
      <Link
        to="/products/$slug"
        params={{ slug: productSlug(product) }}
        preload="intent"
        className="relative block aspect-[4/3] overflow-hidden bg-secondary/50"
      >
        <img
          src={assetUrl(product.imageUrl)}
          onError={productImageError}
          alt={seo.imageAlt}
          loading="lazy"
          width={640}
          height={480}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035] motion-reduce:transform-none"
        />
        {product.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-cocoa px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-gold-soft">
            {product.tag}
          </span>
        )}
      </Link>
      <div className="p-3.5 sm:p-4">
        <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-caramel">
          {product.category}
        </div>
        <Link
          to="/products/$slug"
          params={{ slug: productSlug(product) }}
          preload="intent"
          className="mt-1.5 block rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
        >
          <h2 className="line-clamp-2 min-h-[2.6rem] font-display text-base leading-[1.3] sm:text-lg">
            {product.name}
          </h2>
        </Link>

        {sizes.length > 0 && (
          <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1" aria-label="Choose size">
            {sizes.map((size) => {
              const key = size.id || size.label;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSizeKey(key)}
                  aria-pressed={sizeKey === key}
                  className={`min-h-9 shrink-0 rounded-xl border px-2.5 text-[11px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 ${sizeKey === key ? "border-cocoa bg-cocoa text-cream" : "border-gold-soft/60 bg-cream text-foreground/75 hover:border-primary"}`}
                >
                  {size.label}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-3 flex min-h-10 items-end justify-between gap-2">
          <div>
            {product.isComboPack && (
              <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
                {product.name} · {product.comboSize || product.comboProductIds?.length || 0} items
              </div>
            )}
            {isSale && (
              <div className="text-[11px] text-muted-foreground line-through">
                {formatMoney(originalPrice)}
              </div>
            )}
            <div className="whitespace-nowrap font-display text-lg text-gradient-gold sm:text-xl">
              {formatMoney(price)}
            </div>
          </div>
          <Link
            to="/products/$slug"
            params={{ slug: productSlug(product) }}
            preload="intent"
            className="inline-flex min-h-10 items-center gap-1 rounded-xl border border-gold-soft/60 px-3 text-[11px] font-bold hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
          >
            Details <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={add}
            disabled={Boolean(action)}
            aria-label={`Add ${product.name}${selectedSize ? `, ${selectedSize.label}` : ""} to bag`}
            className="inline-flex min-h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-gradient-gold px-1.5 text-[11px] font-bold text-primary-foreground shadow-glow disabled:cursor-wait disabled:opacity-65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:px-2 sm:text-xs"
          >
            {added ? <Check className="h-3.5 w-3.5" /> : <ShoppingBag className="h-3.5 w-3.5" />}{" "}
            {action === "add" ? "Adding..." : added ? "Added" : "Add to bag"}
          </button>
          <button
            type="button"
            onClick={() => void buy()}
            disabled={Boolean(action)}
            className="min-h-11 whitespace-nowrap rounded-xl bg-cocoa px-1.5 text-[11px] font-bold text-cream transition hover:bg-cocoa/90 disabled:cursor-wait disabled:opacity-65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:px-2 sm:text-xs"
          >
            {action === "buy" ? "Opening..." : "Buy now"}
          </button>
        </div>
        <span className="sr-only" aria-live="polite">
          {added ? `${product.name} added to bag` : ""}
        </span>
      </div>
    </article>
  );
}
