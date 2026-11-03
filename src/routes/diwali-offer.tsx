import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { FreeDeliveryProgress } from "@/components/site/FreeDeliveryProgress";
import { SiteLayout } from "@/components/site/SiteLayout";
import { assetUrl, productImageError, type Product, type ProductSizeOption } from "@/lib/api";
import {
  DIWALI_OFFER_END_LABEL,
  FREE_DELIVERY_MINIMUM,
  cartItemKey,
  cartKeyForProduct,
  formatMoney,
  isDiwaliOfferActive,
  useCart,
} from "@/lib/cart";
import { loadProducts, productDisplayName, productDisplayPrice, productSizeOptions } from "@/lib/products";
import { buildSeoHead } from "@/lib/seo";

const MAX_QUANTITY = 20;

export const Route = createFileRoute("/diwali-offer")({
  loader: () => loadProducts(),
  head: () =>
    buildSeoHead({
      title: "Diwali Offer - Buy 1 Get 1 Free | Zekra Sweets",
      description:
        "Limited-time Diwali offer from Zekra Sweets: Buy 1, Get 1 Free on every product. Valid till Monday, 9th November.",
      path: "/diwali-offer",
      robots: "index, follow",
    }),
  component: DiwaliOfferPage,
});

function sizeOptionsFor(product: Product): ProductSizeOption[] {
  return productSizeOptions(product);
}

function optionKey(size: ProductSizeOption) {
  return size.id || `${size.label}-${size.price}`;
}

// The cart product for a chosen product + size (same shape the product page uses).
function productForCart(product: Product, size?: ProductSizeOption): Product {
  if (!size) return product;
  return {
    ...product,
    price: size.price,
    originalPrice: size.originalPrice,
    sizeId: size.id,
    sizeLabel: size.label,
  } as Product;
}

function trackMeta(event: string, params: Record<string, unknown>) {
  const fbq = (window as typeof window & { fbq?: (...args: unknown[]) => void }).fbq;
  if (fbq) fbq("track", event, params);
}

function DiwaliOfferPage() {
  const products = Route.useLoaderData();
  const cart = useCart();
  const offerActive = isDiwaliOfferActive();

  const available = useMemo(
    () => products.filter((product) => product.isActive !== false && productDisplayPrice(product) > 0),
    [products],
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sizeKey, setSizeKey] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [savedMessage, setSavedMessage] = useState("");

  const selected = available.find((product) => product.id === selectedId) || null;
  const sizes = selected ? sizeOptionsFor(selected) : [];
  const selectedSize = sizes.length > 0 ? sizes.find((size) => optionKey(size) === sizeKey) || sizes[0] : undefined;
  const unitPrice = selected ? selectedSize?.price ?? productDisplayPrice(selected) : 0;

  // Paid lines in the cart (free lines are added automatically and shown next to them).
  const picks = cart.items.filter((item) => !item.product.isFreeGift);

  useEffect(() => {
    trackMeta("ViewContent", { content_name: "Diwali Offer", content_type: "product_group", currency: "AED" });
  }, []);

  const choose = (product: Product) => {
    const productSizes = sizeOptionsFor(product);
    const firstSize = productSizes[0];
    const target = productForCart(product, firstSize);
    const saved = cart.items.find((item) => !item.product.isFreeGift && cartItemKey(item.product) === cartKeyForProduct(target));
    setSelectedId(product.id);
    setSizeKey(firstSize ? optionKey(firstSize) : "");
    setQuantity(saved ? saved.quantity : 1);
    setSavedMessage("");
  };

  const chooseSize = (product: Product, size: ProductSizeOption) => {
    const target = productForCart(product, size);
    const saved = cart.items.find((item) => !item.product.isFreeGift && cartItemKey(item.product) === cartKeyForProduct(target));
    setSizeKey(optionKey(size));
    setQuantity(saved ? saved.quantity : 1);
    setSavedMessage("");
  };

  const save = () => {
    if (!selected) return;
    cart.setItemQuantity(productForCart(selected, selectedSize), quantity);
    setSavedMessage(`Saved! ${quantity} + ${quantity} FREE`);
    trackMeta("AddToCart", {
      content_name: productDisplayName(selected),
      content_ids: [selected.id],
      content_type: "product",
      value: Number((unitPrice * quantity).toFixed(2)),
      currency: "AED",
    });
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-[2rem] bg-cocoa px-6 py-7 text-center text-cream shadow-elegant sm:px-10 sm:py-9" data-reveal>
          <div className="text-xs font-bold uppercase tracking-[0.28em] text-gold-soft">Diwali</div>
          <h1 className="mt-2 font-display text-3xl leading-tight text-gold-soft sm:text-5xl">
            Limited-Time Diwali Offer!
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl">Buy 1, Get 1 Free on every product.</p>
          <p className="mt-2 text-sm font-semibold text-cream/80 sm:text-base">Valid till {DIWALI_OFFER_END_LABEL}.</p>
        </div>

        {!offerActive && (
          <div className="mt-6 rounded-3xl border border-gold-soft/55 bg-cream p-6 text-center">
            <h2 className="font-display text-2xl">This offer has ended</h2>
            <p className="mt-2 text-sm text-muted-foreground">Thank you for celebrating with us. Our full menu is still open.</p>
            <Link
              to="/products"
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-gold px-6 text-sm font-bold text-primary-foreground shadow-glow"
            >
              View products
            </Link>
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl">1. Choose a product</h2>
            {available.length === 0 ? (
              <p className="mt-4 rounded-2xl bg-secondary p-4 text-sm">Products are loading. Please refresh in a moment.</p>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {available.map((product) => {
                  const isSelected = product.id === selectedId;
                  return (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => choose(product)}
                      aria-pressed={isSelected}
                      className={`overflow-hidden rounded-2xl border text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 ${
                        isSelected ? "border-primary bg-secondary shadow-glass" : "border-gold-soft/45 bg-cream/75 hover:border-primary/60"
                      }`}
                    >
                      <img
                        src={assetUrl(product.imageUrl)}
                        onError={productImageError}
                        alt={product.imageAlt || product.name}
                        className="aspect-square w-full object-cover"
                      />
                      <div className="p-3">
                        <div className="font-display text-base leading-tight">{productDisplayName(product)}</div>
                        <div className="mt-1 text-xs font-semibold text-caramel">
                          From {formatMoney(productDisplayPrice(product))}
                        </div>
                        <div className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary">
                          {isSelected ? <Check className="h-3.5 w-3.5" /> : null}
                          {isSelected ? "Selected" : "Tap to select"}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {selected && (
              <div className="mt-6 rounded-[1.5rem] border border-gold-soft/55 bg-cream/85 p-5 shadow-glass">
                <h2 className="font-display text-2xl sm:text-3xl">2. Choose quantity</h2>
                <p className="mt-1 text-sm font-semibold text-foreground/80">{productDisplayName(selected)}</p>

                {sizes.length > 1 && (
                  <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Size">
                    {sizes.map((size) => {
                      const active = optionKey(size) === optionKey(selectedSize as ProductSizeOption);
                      return (
                        <button
                          key={optionKey(size)}
                          type="button"
                          onClick={() => chooseSize(selected, size)}
                          aria-pressed={active}
                          className={`min-h-11 rounded-xl border px-4 text-sm font-bold ${
                            active ? "border-cocoa bg-cocoa text-cream" : "border-gold-soft/55 bg-cream hover:bg-secondary"
                          }`}
                        >
                          {size.label} - {formatMoney(size.price)}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <div className="inline-flex h-12 items-center overflow-hidden rounded-full border border-gold-soft/60 bg-cream">
                    <button
                      type="button"
                      onClick={() => {
                        setQuantity((current) => Math.max(1, current - 1));
                        setSavedMessage("");
                      }}
                      aria-label="Decrease quantity"
                      className="grid h-12 w-12 place-items-center hover:bg-secondary"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-10 text-center text-base font-bold">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setQuantity((current) => Math.min(MAX_QUANTITY, current + 1));
                        setSavedMessage("");
                      }}
                      aria-label="Increase quantity"
                      className="grid h-12 w-12 place-items-center hover:bg-secondary"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-sm font-bold">
                    {quantity} paid{" "}
                    <span className="text-primary">+ {offerActive ? quantity : 0} FREE</span>
                    <span className="ml-2 text-foreground/70">= {formatMoney(unitPrice * quantity)}</span>
                  </div>
                </div>

                <h2 className="mt-6 font-display text-2xl sm:text-3xl">3. Save</h2>
                <button
                  type="button"
                  onClick={save}
                  className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-gradient-gold px-6 text-sm font-extrabold text-primary-foreground shadow-glow sm:w-auto"
                >
                  Save
                </button>
                {savedMessage && (
                  <p className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-primary" role="status">
                    <Check className="h-4 w-4" /> {savedMessage}. See it on the right.
                  </p>
                )}
              </div>
            )}
          </div>

          <aside className="h-fit rounded-[2rem] border border-gold-soft/55 bg-cream/90 p-5 shadow-glass lg:sticky lg:top-28" data-reveal>
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-2xl">Your Diwali picks</h2>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-cocoa text-cream">
                <ShoppingBag className="h-4 w-4" />
              </span>
            </div>

            {picks.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                Nothing saved yet. Choose a product, pick the quantity and press Save. The free quantity appears here.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-gold-soft/40">
                {picks.map((item) => {
                  const key = cartItemKey(item.product);
                  return (
                    <li key={key} className="py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-display text-base leading-tight">{item.product.name.split("|", 1)[0].trim()}</div>
                          {item.product.sizeLabel && <div className="text-xs text-muted-foreground">{item.product.sizeLabel}</div>}
                          <div className="mt-1 text-sm font-bold">
                            {item.quantity} paid{offerActive ? <span className="text-primary"> + {item.quantity} FREE</span> : null}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-display text-lg">{formatMoney(item.product.price * item.quantity)}</div>
                          <button
                            type="button"
                            onClick={() => cart.removeItem(key)}
                            aria-label={`Remove ${item.product.name}`}
                            className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {picks.length > 0 && (
              <>
                <div className="mt-3 flex items-center justify-between border-t border-gold-soft/45 pt-3 font-display text-xl">
                  <span>Items total</span>
                  <span>{formatMoney(cart.subtotal)}</span>
                </div>
                <FreeDeliveryProgress subtotal={cart.subtotal} className="mt-4" />
                <Link
                  to="/checkout"
                  className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-gradient-gold px-6 text-sm font-extrabold text-primary-foreground shadow-glow"
                >
                  Go to checkout
                </Link>
              </>
            )}

            <div className="mt-4 flex items-start gap-2 rounded-2xl bg-secondary px-3 py-2.5 text-xs font-semibold text-secondary-foreground">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Free delivery in Dubai, Sharjah and Ajman on orders of AED {FREE_DELIVERY_MINIMUM}+.
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}
