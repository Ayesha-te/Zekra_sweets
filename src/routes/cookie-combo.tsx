import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  CreditCard,
  Gift,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { assetUrl, productImageError, type Product, type ProductSizeOption } from "@/lib/api";
import { WHATSAPP_LINK } from "@/lib/contact";
import { cartItemKey, formatMoney, getCartTotals, useCart } from "@/lib/cart";
import {
  loadProducts,
  productDisplayName,
  productDisplayOriginalPrice,
  productDisplayPrice,
  productSizeOptions,
} from "@/lib/products";
import { buildSeoHead, productSlug } from "@/lib/seo";

const COMBO_PRODUCT_ID = "cookie-combo-aed-22";
const COMBO_PRICE = 22;
const COMBO_REQUIRED_SELECTIONS = 3;
const PREMIUM_COMBO_COOKIE_NAMES = [
  "premium almond cookies",
  "premium chocolate cookies",
  "premium tuti fruity butter cookies",
  "premium banana cookies",
  "premium banana butter cookies",
  "premium jeera cookies",
];

export const Route = createFileRoute("/cookie-combo")({
  loader: () => loadProducts(),
  head: () =>
    buildSeoHead({
      title: "3 Cookie Combo - AED 22 | Zekra Sweets",
      description:
        "Build your AED 22 Zekra Sweets cookie combo: choose any 3 cookie flavours, get a Khari Puff packet free, and checkout online.",
      path: "/cookie-combo",
      robots: "index, follow",
    }),
  component: CookieComboLanding,
});

function CookieComboLanding() {
  const products = Route.useLoaderData();
  const navigate = useNavigate();
  const cart = useCart();
  const selectorRef = useRef<HTMLElement | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [added, setAdded] = useState(false);

  const cookies = useMemo(() => comboCookies(products), [products]);
  const khariPuff = useMemo(() => findKhariPuff(products), [products]);
  const selections = selectedIds
    .map((id) => cookies.find((cookie) => cookie.id === id))
    .filter((product): product is Product => Boolean(product));
  const selectedNames = selections.map(productDisplayName);
  const heroImages = [...selections, ...cookies].slice(0, 3);
  const recommended = useMemo(() => recommendedProducts(products, new Set([COMBO_PRODUCT_ID, ...selectedIds])), [products, selectedIds]);
  const upsells = useMemo(() => upsellProducts(products, new Set([COMBO_PRODUCT_ID, ...selectedIds])), [products, selectedIds]);
  const comboInCart = cart.items.some((item) => item.product.id === COMBO_PRODUCT_ID);
  const stickyMode = comboInCart || added ? "checkout" : selectedIds.length === COMBO_REQUIRED_SELECTIONS ? "add" : "build";

  useEffect(() => {
    trackMetaOnce("ViewContent", "zekra_cookie_combo_viewed", {
      content_name: "3 Cookie Combo - AED 22",
      content_ids: [COMBO_PRODUCT_ID],
      content_type: "product",
      value: COMBO_PRICE,
      currency: "AED",
    });
  }, []);

  const scrollToSelector = () => {
    selectorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleCookie = (productId: string) => {
    setAdded(false);
    setSelectedIds((current) => {
      if (current.includes(productId)) return current.filter((id) => id !== productId);
      if (current.length >= COMBO_REQUIRED_SELECTIONS) return current;
      return [...current, productId];
    });
  };

  const addCombo = () => {
    if (selectedIds.length !== COMBO_REQUIRED_SELECTIONS || selections.length !== COMBO_REQUIRED_SELECTIONS) {
      scrollToSelector();
      return;
    }

    const imageProduct = selections[0] || cookies[0] || khariPuff;
    cart.addItem({
      id: COMBO_PRODUCT_ID,
      name: `3 Cookie Combo - ${selectedNames.join(", ")}`,
      displayName: "3 Cookie Combo - AED 22",
      imageUrl: imageProduct?.imageUrl || "/favicon.png",
      imageAlt: "Zekra Sweets AED 22 cookie combo",
      price: COMBO_PRICE,
      originalPrice: null,
      category: "Cookies",
      tag: "AED 22 Combo",
      sizeId: "combo-aed-22",
      sizeLabel: "3 flavours + free Khari Puff",
      comboSelections: selectedNames,
    });

    if (khariPuff) {
      cart.addItem({
        ...khariPuff,
        id: `${khariPuff.id}-combo-gift`,
        name: `${productDisplayName(khariPuff)} - Free with AED 22 Cookie Combo`,
        price: 0,
        originalPrice: null,
        sizeId: "combo-free",
        sizeLabel: "Free packet",
        isFreeGift: true,
      });
    }

    setAdded(true);
    trackMeta("AddToCart", {
      content_name: "3 Cookie Combo - AED 22",
      content_ids: [COMBO_PRODUCT_ID, ...selectedIds],
      content_type: "product_group",
      value: COMBO_PRICE,
      currency: "AED",
    });
  };

  const checkoutNow = async () => {
    if (!comboInCart && !added) {
      addCombo();
      return;
    }
    const totals = getCartTotals(cart.items);
    trackMeta("InitiateCheckout", {
      content_name: "Zekra Sweets checkout",
      value: Number(totals.subtotal.toFixed(2)),
      currency: "AED",
      num_items: cart.count,
    });
    await navigate({ to: "/checkout" });
  };

  const whatsappHref = `${WHATSAPP_LINK}?text=${encodeURIComponent(
    selectedNames.length === COMBO_REQUIRED_SELECTIONS
      ? `Hi Zekra Sweets, I'd like to order the AED 22 Cookie Combo with these flavours: ${selectedNames.join(", ")}.`
      : "Hi Zekra Sweets, I'd like to order the AED 22 Cookie Combo.",
  )}`;

  return (
    <main className="min-h-screen bg-background pb-28 text-foreground sm:pb-8">
      <header className="sticky top-0 z-40 border-b border-gold-soft/45 bg-cream/92 px-4 py-3 shadow-glass backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img src="/favicon.png" alt="Zekra Sweets" className="h-11 w-11 rounded-full border border-gold-soft/50 object-cover" />
            <span className="font-display text-xl font-extrabold">Zekra <span className="text-gradient-gold">Sweets</span></span>
          </Link>
          <Link to="/cart" className="relative grid h-11 w-11 place-items-center rounded-full border border-gold-soft/55 bg-cream text-foreground">
            <ShoppingBag className="h-5 w-5" />
            {cart.count > 0 && <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-cocoa px-1 text-[10px] font-bold text-cream">{cart.count}</span>}
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[1fr_0.85fr] md:items-center md:py-10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-cocoa px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-gold-soft">
            <Gift className="h-3.5 w-3.5" />
            Free Khari Puff included
          </div>
          <h1 className="mt-4 font-display text-4xl leading-[1.05] sm:text-6xl">
            3 Cookie Combo - <span className="text-gradient-gold">AED 22</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-foreground/75 sm:text-lg">
            Choose any 3 cookie flavours + get a Khari Puff packet FREE.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-gold-soft/55 bg-secondary px-4 py-3 text-sm font-bold text-secondary-foreground">
            <Truck className="h-4 w-4 text-primary" />
            FREE Delivery in Dubai, Sharjah & Ajman
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={scrollToSelector} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-gold px-6 text-sm font-extrabold text-primary-foreground shadow-glow">
              Build My AED 22 Box <ArrowRight className="h-4 w-4" />
            </button>
            <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-gold-soft/60 bg-cream px-6 text-sm font-bold text-foreground">
              <MessageCircle className="h-4 w-4" /> Order on WhatsApp
            </a>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-gold-soft/45 bg-cream/70 p-3 shadow-elegant">
          <div className="grid grid-cols-3 gap-2">
            {heroImages.map((product, index) => (
              <img
                key={`${product.id}-${index}`}
                src={assetUrl(product.imageUrl)}
                onError={productImageError}
                alt={product.imageAlt || product.name}
                className={`h-40 w-full rounded-2xl object-cover ${index === 1 ? "mt-5" : ""}`}
              />
            ))}
          </div>
          <div className="mt-3 rounded-2xl bg-cocoa px-4 py-3 text-cream">
            <div className="text-xs uppercase tracking-[0.2em] text-gold-soft">Combo total</div>
            <div className="font-display text-3xl">{formatMoney(COMBO_PRICE)}</div>
          </div>
        </div>
      </section>

      <section ref={selectorRef} className="mx-auto max-w-6xl scroll-mt-24 px-4 py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-caramel">Build your box</span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">Choose Any 3 Cookie Flavours</h2>
          </div>
          <div className="rounded-full border border-gold-soft/55 bg-cream px-4 py-2 text-sm font-extrabold">
            {selectedIds.length} / {COMBO_REQUIRED_SELECTIONS} selected
          </div>
        </div>

        {cookies.length < COMBO_REQUIRED_SELECTIONS ? (
          <div className="mt-5 rounded-3xl border border-destructive/25 bg-destructive/5 p-5 text-sm text-destructive">
            The combo needs at least 3 active cookie flavours. Please check the product catalogue.
          </div>
        ) : (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cookies.map((product) => {
              const selected = selectedIds.includes(product.id);
              const disabled = !selected && selectedIds.length >= COMBO_REQUIRED_SELECTIONS;
              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => toggleCookie(product.id)}
                  disabled={disabled}
                  aria-pressed={selected}
                  className={`grid min-h-[132px] grid-cols-[92px_minmax(0,1fr)] gap-3 rounded-2xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 ${
                    selected ? "border-primary bg-secondary shadow-glass" : "border-gold-soft/45 bg-cream/75 hover:border-primary/60"
                  } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  <img src={assetUrl(product.imageUrl)} onError={productImageError} alt={product.imageAlt || product.name} className="h-[108px] w-[92px] rounded-xl object-cover" />
                  <span className="min-w-0">
                    <span className="block font-display text-lg leading-tight">{productDisplayName(product)}</span>
                    <span className="mt-1 block text-xs font-semibold text-caramel">{firstSizeLabel(product)}</span>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                      {selected ? <Check className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                      {selected ? "Selected" : disabled ? "3 already selected" : "Tap to select"}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-5 rounded-[1.5rem] border border-gold-soft/45 bg-cream/80 p-4 shadow-glass">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-bold">{selectedNames.length ? selectedNames.join(", ") : "Choose 3 flavours to continue"}</div>
              <p className="mt-1 text-xs text-muted-foreground">Final combo price includes a free Khari Puff packet.</p>
            </div>
            <button type="button" onClick={addCombo} disabled={selectedIds.length !== COMBO_REQUIRED_SELECTIONS} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-gold px-6 text-sm font-extrabold text-primary-foreground shadow-glow disabled:cursor-not-allowed disabled:opacity-50">
              {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
              {added ? "Combo Added" : "Add Combo to Cart - AED 22"}
            </button>
          </div>
          {added && (
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button type="button" onClick={() => void checkoutNow()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-cocoa px-5 text-sm font-bold text-cream">
                Checkout Now <ArrowRight className="h-4 w-4" />
              </button>
              <Link to="/cart" className="inline-flex min-h-11 items-center justify-center rounded-full border border-gold-soft/55 bg-cream px-5 text-sm font-bold">View Cart</Link>
            </div>
          )}
        </div>
      </section>

      {added && upsells.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-4">
          <h2 className="font-display text-2xl">Add something extra?</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {upsells.map((product) => <UpsellCard key={product.id} product={product} />)}
          </div>
        </section>
      )}

      <section className="mx-auto grid max-w-6xl gap-3 px-4 py-6 sm:grid-cols-4">
        {[
          ["100% Eggless", PackageCheck],
          ["Freshly prepared", Sparkles],
          ["Secure checkout", ShieldCheck],
          ["Free delivery in Dubai, Sharjah & Ajman", Truck],
        ].map(([label, Icon]) => (
          <div key={String(label)} className="rounded-2xl border border-gold-soft/45 bg-cream/75 p-4">
            <Icon className="h-5 w-5 text-primary" />
            <div className="mt-3 font-display text-lg">{String(label)}</div>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 py-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-caramel">Browse more</span>
            <h2 className="mt-2 font-display text-3xl">You May Also Like</h2>
          </div>
          <Link to="/products" className="hidden text-sm font-bold text-primary sm:inline-flex">Explore All Zekra Products -&gt;</Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {recommended.map((product) => <ProductLinkCard key={product.id} product={product} />)}
        </div>
        <Link to="/products" className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full border border-gold-soft/55 bg-cream px-5 text-sm font-bold sm:hidden">Explore All Zekra Products -&gt;</Link>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6">
        <h2 className="font-display text-3xl">FAQ</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {faqItems.map((item) => (
            <details key={item.question} className="rounded-2xl border border-gold-soft/45 bg-cream/75 p-4">
              <summary className="cursor-pointer font-bold">{item.question}</summary>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gold-soft/45 bg-cream/95 p-3 shadow-elegant backdrop-blur-md sm:hidden">
        <button
          type="button"
          onClick={stickyMode === "build" ? scrollToSelector : stickyMode === "add" ? addCombo : () => void checkoutNow()}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-gold px-5 text-sm font-extrabold text-primary-foreground shadow-glow"
        >
          {stickyMode === "checkout" ? "Checkout Now" : stickyMode === "add" ? "Add to Cart - AED 22" : "Build My Box - AED 22"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </main>
  );
}

function UpsellCard({ product }: { product: Product }) {
  const cart = useCart();
  const size = firstSize(product);
  const price = size?.price ?? productDisplayPrice(product);
  const add = () => {
    cart.addItem({ ...product, price, originalPrice: size?.originalPrice ?? product.originalPrice, sizeId: size?.id, sizeLabel: size?.label });
  };

  return (
    <article className="grid grid-cols-[72px_minmax(0,1fr)] gap-3 rounded-2xl border border-gold-soft/45 bg-cream/75 p-3">
      <img src={assetUrl(product.imageUrl)} onError={productImageError} alt={product.imageAlt || product.name} className="h-[72px] w-[72px] rounded-xl object-cover" />
      <div className="min-w-0">
        <div className="truncate font-display text-base">{productDisplayName(product)}</div>
        <button type="button" onClick={add} className="mt-2 inline-flex min-h-9 w-full items-center justify-center gap-1 rounded-xl bg-cocoa px-3 text-xs font-bold text-cream">
          Add - {formatMoney(price)}
        </button>
      </div>
    </article>
  );
}

function ProductLinkCard({ product }: { product: Product }) {
  const price = productDisplayPrice(product);
  const original = productDisplayOriginalPrice(product);
  return (
    <article className="overflow-hidden rounded-2xl border border-gold-soft/45 bg-cream/75">
      <img src={assetUrl(product.imageUrl)} onError={productImageError} alt={product.imageAlt || product.name} className="h-36 w-full object-cover" />
      <div className="p-4">
        <div className="text-xs font-bold uppercase tracking-[0.18em] text-caramel">{product.category}</div>
        <h3 className="mt-1 line-clamp-2 min-h-12 font-display text-lg leading-tight">{productDisplayName(product)}</h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-display text-xl text-gradient-gold">{formatMoney(price)}</span>
          {original != null && original > price && <span className="text-xs text-muted-foreground line-through">{formatMoney(original)}</span>}
        </div>
        <Link to="/products/$slug" params={{ slug: productSlug(product) }} className="mt-3 inline-flex min-h-10 w-full items-center justify-center rounded-xl border border-gold-soft/55 text-sm font-bold">
          View Product
        </Link>
      </div>
    </article>
  );
}

function comboCookies(products: Product[]) {
  const premium = products.filter(
    (product) =>
      product.isActive !== false &&
      product.category.toLowerCase() === "cookies" &&
      PREMIUM_COMBO_COOKIE_NAMES.some((name) => productDisplayName(product).toLowerCase().startsWith(name)),
  );
  return (premium.length >= COMBO_REQUIRED_SELECTIONS ? premium : products.filter((product) => product.isActive !== false && product.category.toLowerCase() === "cookies")).slice(0, 9);
}

function findKhariPuff(products: Product[]) {
  return (
    products.find((product) => product.isActive !== false && /khari|khaari/i.test(`${product.name} ${product.category}`)) ||
    products.find((product) => product.isActive !== false && product.category.toLowerCase() === "puff")
  );
}

function firstSize(product: Product): ProductSizeOption | undefined {
  return productSizeOptions(product)[0];
}

function firstSizeLabel(product: Product) {
  const size = firstSize(product);
  return size ? `${size.label} usually ${formatMoney(size.price)}` : `${formatMoney(productDisplayPrice(product))} separately`;
}

function recommendedProducts(products: Product[], excludedIds: Set<string>) {
  return products
    .filter((product) => product.isActive !== false && !excludedIds.has(product.id))
    .sort((a, b) => productScore(b) - productScore(a))
    .slice(0, 4);
}

function upsellProducts(products: Product[], excludedIds: Set<string>) {
  return products
    .filter((product) => product.isActive !== false && !excludedIds.has(product.id) && productDisplayPrice(product) > 0)
    .sort((a, b) => {
      const priceDiff = productDisplayPrice(a) - productDisplayPrice(b);
      return priceDiff || productScore(b) - productScore(a);
    })
    .slice(0, 3);
}

function productScore(product: Product) {
  const text = `${product.tag || ""} ${product.name} ${product.category}`.toLowerCase();
  return Number(text.includes("popular")) * 6 + Number(text.includes("puff")) * 4 + Number(text.includes("baklawa")) * 3 + Number(text.includes("cookie")) * 2;
}

function trackMeta(event: string, params: Record<string, unknown>) {
  const fbq = (window as typeof window & { fbq?: (...args: unknown[]) => void }).fbq;
  if (fbq) fbq("track", event, params);
}

function trackMetaOnce(event: string, key: string, params: Record<string, unknown>) {
  try {
    if (window.sessionStorage.getItem(key)) return;
    window.sessionStorage.setItem(key, "1");
  } catch {
    // Tracking can still fire when sessionStorage is unavailable.
  }
  trackMeta(event, params);
}

const faqItems = [
  {
    question: "What's included in the AED 22 combo?",
    answer: "You choose 3 cookie flavours and receive one Khari Puff packet free with the combo.",
  },
  {
    question: "How do I choose my 3 flavours?",
    answer: "Tap any 3 cookie flavour cards on this page. You can deselect a flavour and choose another before adding the combo to cart.",
  },
  {
    question: "Do I really get Khari Puff free?",
    answer: "Yes. The Khari Puff packet is added as a free item and is not charged in the order total.",
  },
  {
    question: "Where is delivery free?",
    answer: "The site advertises free delivery in Dubai, Sharjah and Ajman. Other locations keep the existing checkout delivery charge rules.",
  },
  {
    question: "How do I place an order?",
    answer: "Select 3 flavours, add the combo to cart, then continue to the normal Zekra Sweets checkout.",
  },
  {
    question: "What payment methods are available?",
    answer: "Card payment is available through Stripe. Pickup orders can also use cash on pickup.",
  },
];
