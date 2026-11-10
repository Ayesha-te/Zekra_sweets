import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";

import { FreeDeliveryProgress } from "@/components/site/FreeDeliveryProgress";
import { SiteLayout } from "@/components/site/SiteLayout";
import { assetUrl, fetchOffersStatus, productImageError, verifyLoyaltyOrder, type Product, type ProductSizeOption } from "@/lib/api";
import {
  FREE_DELIVERY_MINIMUM,
  cartItemKey,
  cartKeyForProduct,
  formatMoney,
  getLoyaltyOffer,
  setLoyaltyOffer,
  useCart,
  type CartItem,
} from "@/lib/cart";
import { loadProducts, productDisplayName, productDisplayPrice, productSizeOptions } from "@/lib/products";
import { buildSeoHead } from "@/lib/seo";

const MAX_QUANTITY = 20;

export const Route = createFileRoute("/welcome-back")({
  loader: () => loadProducts(),
  head: () =>
    buildSeoHead({
      title: "Welcome Back - Buy 1 Get 1 Free for Returning Customers | Zekra Sweets",
      description:
        "Returning Zekra Sweets customers: verify your previous order and get Buy 1, Get 1 Free on every product for a limited time.",
      path: "/welcome-back",
      robots: "index, follow",
    }),
  component: WelcomeBackPage,
});

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

function WelcomeBackPage() {
  const products = Route.useLoaderData();
  const cart = useCart();
  const [loyalty, setLoyalty] = useState<{ token: string; endsAt: number } | null>(null);
  const [windowOpen, setWindowOpen] = useState<boolean | null>(null);
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const offerActive = Boolean(loyalty);

  useEffect(() => {
    setLoyalty(getLoyaltyOffer());
    fetchOffersStatus().then((status) => setWindowOpen(status.loyaltyOpen)).catch(() => setWindowOpen(null));
  }, []);

  const endLabel = loyalty
    ? new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeZone: "Asia/Dubai" }).format(new Date(loyalty.endsAt))
    : "";

  const verify = async (event: FormEvent) => {
    event.preventDefault();
    setVerifyError(null);
    if (!orderId.trim() || !email.trim()) {
      setVerifyError("Enter your previous order number and the email you used.");
      return;
    }
    setChecking(true);
    try {
      const result = await verifyLoyaltyOrder(orderId.trim(), email.trim());
      setLoyaltyOffer(result.token, result.endsAt);
      setLoyalty(getLoyaltyOffer());
    } catch (caught) {
      setVerifyError(caught instanceof Error ? caught.message : "We could not verify your order. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  const available = useMemo(
    () => products.filter((product) => product.isActive !== false && productDisplayPrice(product) > 0),
    [products],
  );

  // Paid lines in the cart (free lines are added automatically and shown next to them).
  const picks = cart.items.filter((item) => !item.product.isFreeGift);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-[2rem] bg-cocoa px-6 py-7 text-center text-cream shadow-elegant sm:px-10 sm:py-9" data-reveal>
          <div className="text-xs font-bold uppercase tracking-[0.28em] text-gold-soft">For our returning customers</div>
          <h1 className="mt-2 font-display text-3xl leading-tight text-gold-soft sm:text-5xl">
            Welcome Back!
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl">Buy 1, Get 1 Free on every product.</p>
          <p className="mt-2 text-sm font-semibold text-cream/80 sm:text-base">
            {offerActive ? `Unlocked for you - valid till ${endLabel}.` : "Our thank-you to the customers who ordered before."}
          </p>
        </div>

        {!offerActive && (
          <div className="mx-auto mt-6 max-w-xl rounded-3xl border border-gold-soft/55 bg-cream p-6">
            {windowOpen === false ? (
              <div className="text-center">
                <h2 className="font-display text-2xl">This offer is not running right now</h2>
                <p className="mt-2 text-sm text-muted-foreground">Keep an eye on your inbox - we email our returning customers whenever it opens.</p>
                <Link
                  to="/products"
                  className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-gold px-6 text-sm font-bold text-primary-foreground shadow-glow"
                >
                  View products
                </Link>
              </div>
            ) : (
              <form onSubmit={verify} className="space-y-3">
                <h2 className="font-display text-2xl">Unlock your offer</h2>
                <p className="text-sm text-muted-foreground">
                  Enter the order number from your previous order (it is in your order email, for example ZK-...) and the email you ordered with. This offer is for returning customers only.
                </p>
                <input
                  value={orderId}
                  onChange={(event) => setOrderId(event.target.value)}
                  placeholder="Previous order number"
                  aria-label="Previous order number"
                  className="w-full rounded-2xl border border-border bg-cream/70 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email used for that order"
                  aria-label="Email used for that order"
                  className="w-full rounded-2xl border border-border bg-cream/70 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                {verifyError && <p className="text-sm font-semibold text-destructive">{verifyError}</p>}
                <button
                  type="submit"
                  disabled={checking}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-gradient-gold px-6 text-sm font-extrabold text-primary-foreground shadow-glow disabled:opacity-60"
                >
                  {checking ? "Checking..." : "Unlock Buy 1 Get 1 Free"}
                </button>
                <p className="text-center text-xs text-muted-foreground">New to Zekra Sweets? Your first order gets 50% off automatically (up to AED 100) - no code needed.</p>
              </form>
            )}
          </div>
        )}

        <div className={`mt-6 grid gap-6 ${!offerActive ? "hidden" : ""} ${picks.length > 0 ? "lg:grid-cols-[minmax(0,1fr)_360px]" : ""}`}>
          <div>
            {available.length === 0 ? (
              <p className="rounded-2xl bg-secondary p-4 text-sm">Products are loading. Please refresh in a moment.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {available.map((product) => (
                  <OfferProductCard key={product.id} product={product} cartItems={cart.items} offerActive={offerActive} onSave={cart.setItemQuantity} />
                ))}
              </div>
            )}
          </div>

          {picks.length > 0 && (
            <aside className="h-fit rounded-[2rem] border border-gold-soft/55 bg-cream/90 p-5 shadow-glass lg:sticky lg:top-28">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-2xl">Your picks</h2>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-cocoa text-cream">
                  <ShoppingBag className="h-4 w-4" />
                </span>
              </div>

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
                            Qty {item.quantity}
                            {offerActive ? <span className="ml-2 text-primary">+{item.quantity} FREE</span> : null}
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
              <div className="mt-4 flex items-start gap-2 rounded-2xl bg-secondary px-3 py-2.5 text-xs font-semibold text-secondary-foreground">
                <Truck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Free delivery in Dubai, Sharjah and Ajman on orders of AED {FREE_DELIVERY_MINIMUM}+.
              </div>
            </aside>
          )}
        </div>
      </section>

      {picks.length > 0 && (
        <Link
          to="/checkout"
          className="fixed bottom-20 left-4 right-4 z-40 flex min-h-12 items-center justify-between rounded-2xl bg-gradient-gold px-4 text-sm font-extrabold text-primary-foreground shadow-glow lg:hidden"
        >
          <span>Go to checkout</span>
          <span>{formatMoney(cart.subtotal)}</span>
        </Link>
      )}
    </SiteLayout>
  );
}

// One product: its own size (only if it has sizes), quantity and Save. Any number of products can be saved.
function OfferProductCard({
  product,
  cartItems,
  offerActive,
  onSave,
}: {
  product: Product;
  cartItems: CartItem[];
  offerActive: boolean;
  onSave: (product: Product, quantity: number) => void;
}) {
  const sizes = productSizeOptions(product);
  const [sizeKey, setSizeKey] = useState(sizes[0] ? optionKey(sizes[0]) : "");
  const size = sizes.length > 0 ? sizes.find((option) => optionKey(option) === sizeKey) || sizes[0] : undefined;
  const target = productForCart(product, size);
  const targetKey = cartKeyForProduct(target);
  const saved = cartItems.find((item) => !item.product.isFreeGift && cartItemKey(item.product) === targetKey);
  const [quantity, setQuantity] = useState(saved ? saved.quantity : 1);
  const unitPrice = size ? size.price : productDisplayPrice(product);
  const isSaved = Boolean(saved) && saved?.quantity === quantity;

  const pickSize = (option: ProductSizeOption) => {
    const nextKey = cartKeyForProduct(productForCart(product, option));
    const nextSaved = cartItems.find((item) => !item.product.isFreeGift && cartItemKey(item.product) === nextKey);
    setSizeKey(optionKey(option));
    setQuantity(nextSaved ? nextSaved.quantity : 1);
  };

  const save = () => {
    onSave(target, quantity);
    trackMeta("AddToCart", {
      content_name: productDisplayName(product),
      content_ids: [product.id],
      content_type: "product",
      value: Number((unitPrice * quantity).toFixed(2)),
      currency: "AED",
    });
  };

  return (
    <article className={`flex h-full flex-col overflow-hidden rounded-2xl border bg-cream/80 ${saved ? "border-primary" : "border-gold-soft/45"}`}>
      <img
        src={assetUrl(product.imageUrl)}
        onError={productImageError}
        alt={product.imageAlt || product.name}
        className="aspect-[4/3] w-full shrink-0 object-cover"
      />
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg leading-tight">{productDisplayName(product)}</h3>
        <div className="mt-1 text-sm font-semibold text-caramel">{formatMoney(unitPrice)}</div>

        {sizes.length > 1 && (
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Size">
            {sizes.map((option) => {
              const active = size ? optionKey(option) === optionKey(size) : false;
              return (
                <button
                  key={optionKey(option)}
                  type="button"
                  onClick={() => pickSize(option)}
                  aria-pressed={active}
                  className={`min-h-10 rounded-xl border px-3 text-xs font-bold ${
                    active ? "border-cocoa bg-cocoa text-cream" : "border-gold-soft/55 bg-cream hover:bg-secondary"
                  }`}
                >
                  {option.label} - {formatMoney(option.price)}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <div className="inline-flex h-11 items-center overflow-hidden rounded-full border border-gold-soft/60 bg-cream">
            <button
              type="button"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              aria-label={`Decrease ${productDisplayName(product)} quantity`}
              className="grid h-11 w-11 place-items-center hover:bg-secondary"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-9 text-center text-base font-bold">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((current) => Math.min(MAX_QUANTITY, current + 1))}
              aria-label={`Increase ${productDisplayName(product)} quantity`}
              className="grid h-11 w-11 place-items-center hover:bg-secondary"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {offerActive && <div className="text-right text-sm font-bold text-primary">+{quantity} FREE</div>}
        </div>

        <button
          type="button"
          onClick={save}
          className={`mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-extrabold ${
            isSaved ? "border border-primary bg-secondary text-primary" : "bg-gradient-gold text-primary-foreground shadow-glow"
          }`}
        >
          {isSaved ? (
            <>
              <Check className="h-4 w-4" /> Saved
            </>
          ) : (
            "Save"
          )}
        </button>
      </div>
    </article>
  );
}
