import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Minus, Plus, Search, ShoppingBag, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { assetUrl, type Product } from "@/lib/api";
import { formatMoney, useCart } from "@/lib/cart";
import {
  filterProducts,
  loadProducts,
  productCategories,
  type ProductCategoryFilter,
} from "@/lib/products";

export const Route = createFileRoute("/order")({
  head: () => ({
    meta: [
      { title: "Order Online - Zekra Sweets" },
      {
        name: "description",
        content:
          "Order Zekra Sweets cookies, baklawa, rusk and khaari puffs online for delivery or pickup.",
      },
    ],
  }),
  component: Order,
});

function Order() {
  const [cat, setCat] = useState<ProductCategoryFilter>("All products");
  const [q, setQ] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<string | null>(null);
  const cart = useCart();

  useEffect(() => {
    loadProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!addedId) return;
    const timeout = window.setTimeout(() => setAddedId(null), 1200);

    return () => window.clearTimeout(timeout);
  }, [addedId]);

  const filtered = filterProducts(products, cat, q);

  const addProduct = (product: Product) => {
    cart.addItem(product);
    setAddedId(product.id);
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0">
            <div className="glass rounded-[2rem] p-6 md:p-8" data-reveal>
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-caramel">
                    <Sparkles className="h-3.5 w-3.5" /> Fresh ordering
                  </span>
                  <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
                    Build your <span className="text-gradient-gold">bakery bag.</span>
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/70">
                    Choose today&apos;s cookies, sweets, rusk and puffs. Your bag stays saved while
                    you browse.
                  </p>
                </div>
                <Link
                  to="/cart"
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-gold-soft/60 bg-cream/70 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  <ShoppingBag className="h-4 w-4 text-primary" />
                  {cart.count} in bag
                </Link>
              </div>

              <div className="mt-7 grid gap-3 lg:grid-cols-[minmax(220px,1fr)_auto]">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={q}
                    onChange={(event) => setQ(event.target.value)}
                    placeholder="Search almond, baklawa, rusk..."
                    className="w-full rounded-2xl border border-border bg-cream/70 px-11 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {productCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setCat(category)}
                      className={`rounded-2xl px-3.5 py-2 text-xs font-semibold transition-all ${
                        cat === category
                          ? "bg-gradient-gold text-primary-foreground shadow-glow"
                          : "border border-gold-soft/45 bg-cream/60 text-foreground/75 hover:text-primary"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {loading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="glass h-44 animate-pulse rounded-3xl bg-cream/55"
                      data-reveal
                    />
                  ))
                : filtered.map((product, index) => (
                    <OrderProductCard
                      key={product.id}
                      product={product}
                      quantity={cart.getItemQuantity(product.id)}
                      recentlyAdded={addedId === product.id}
                      onAdd={() => addProduct(product)}
                      onDecrease={() =>
                        cart.updateQuantity(product.id, cart.getItemQuantity(product.id) - 1)
                      }
                      revealDelay={(index % 6) * 60}
                    />
                  ))}
            </div>

            {!loading && filtered.length === 0 && (
              <div className="glass mt-6 rounded-3xl p-10 text-center">
                <h2 className="font-display text-2xl">No treats found</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try another search or switch back to all products.
                </p>
              </div>
            )}
          </div>

          <CartSummaryPanel />
        </div>
      </section>
    </SiteLayout>
  );
}

function OrderProductCard({
  product,
  quantity,
  recentlyAdded,
  revealDelay,
  onAdd,
  onDecrease,
}: {
  product: Product;
  quantity: number;
  recentlyAdded: boolean;
  revealDelay: number;
  onAdd: () => void;
  onDecrease: () => void;
}) {
  return (
    <article
      className="group glass grid min-h-44 grid-cols-[112px_minmax(0,1fr)] overflow-hidden rounded-3xl transition-transform hover:-translate-y-1 sm:grid-cols-[128px_minmax(0,1fr)]"
      data-reveal
      style={{ transitionDelay: `${revealDelay}ms` }}
    >
      <div className="relative h-full min-h-44 overflow-hidden">
        <img
          src={assetUrl(product.imageUrl)}
          alt={product.imageAlt || product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1000ms] group-hover:scale-110"
        />
        {product.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-cocoa/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-cream backdrop-blur-sm">
            {product.tag}
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-col p-4">
        <div className="text-[10px] uppercase tracking-widest text-caramel">{product.category}</div>
        <h2 className="mt-1 line-clamp-2 font-display text-lg leading-tight text-foreground">
          {product.name}
        </h2>
        <div className="mt-3 flex items-end gap-2">
          <span className="font-display text-2xl text-gradient-gold">
            {formatMoney(product.price)}
          </span>
          {product.originalPrice && (
            <span className="pb-1 text-xs text-muted-foreground line-through">
              {formatMoney(product.originalPrice)}
            </span>
          )}
        </div>
        <div className="mt-auto pt-4">
          {quantity > 0 ? (
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex h-10 items-center overflow-hidden rounded-full border border-gold-soft/60 bg-cream/70">
                <button
                  onClick={onDecrease}
                  aria-label={`Decrease ${product.name}`}
                  className="grid h-10 w-10 place-items-center text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-8 text-center text-sm font-bold">{quantity}</span>
                <button
                  onClick={onAdd}
                  aria-label={`Increase ${product.name}`}
                  className="grid h-10 w-10 place-items-center text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                <Check className="h-3.5 w-3.5" /> Added
              </span>
            </div>
          ) : (
            <button
              onClick={onAdd}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
            >
              <ShoppingBag className="h-4 w-4" />
              {recentlyAdded ? "Added" : "Add to bag"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function CartSummaryPanel() {
  const cart = useCart();
  const previewItems = cart.items.slice(0, 4);

  return (
    <aside className="glass h-fit rounded-[2rem] p-5 lg:sticky lg:top-28" data-reveal>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.26em] text-caramel">Your bag</div>
          <h2 className="mt-1 font-display text-2xl">Order summary</h2>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-full bg-cocoa text-cream">
          <ShoppingBag className="h-5 w-5" />
        </span>
      </div>

      {cart.items.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-gold-soft/70 bg-cream/55 p-6 text-center">
          <p className="font-display text-xl">Your bag is ready.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Add treats from the list and checkout when everything looks right.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {previewItems.map((item) => (
            <div key={item.product.id} className="grid grid-cols-[48px_minmax(0,1fr)_auto] gap-3">
              <img
                src={assetUrl(item.product.imageUrl)}
                alt={item.product.imageAlt || item.product.name}
                className="h-12 w-12 rounded-2xl object-cover"
              />
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{item.product.name}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {item.quantity} x {formatMoney(item.product.price)}
                </div>
              </div>
              <div className="text-sm font-bold">
                {formatMoney(item.product.price * item.quantity)}
              </div>
            </div>
          ))}
          {cart.items.length > previewItems.length && (
            <div className="rounded-2xl bg-secondary px-3 py-2 text-center text-xs font-semibold text-secondary-foreground">
              +{cart.items.length - previewItems.length} more in cart
            </div>
          )}
        </div>
      )}

      <div className="mt-6 space-y-3 border-t border-gold-soft/50 pt-5 text-sm">
        <SummaryRow label="Subtotal" value={formatMoney(cart.subtotal)} />
        <SummaryRow label="Delivery" value="Calculated at checkout" />
        <SummaryRow label="Items total" value={formatMoney(cart.subtotal)} strong />
      </div>

      <div className="mt-6 grid gap-2">
        <Link
          to="/checkout"
          aria-disabled={cart.count === 0}
          className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold shadow-glow transition-transform ${
            cart.count === 0
              ? "pointer-events-none bg-muted text-muted-foreground shadow-none"
              : "bg-gradient-gold text-primary-foreground hover:scale-[1.02]"
          }`}
        >
          Checkout
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to="/cart"
          className="inline-flex items-center justify-center rounded-full border border-gold-soft/60 bg-cream/60 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
        >
          Edit cart
        </Link>
      </div>
    </aside>
  );
}

function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 ${
        strong ? "font-display text-xl text-foreground" : "text-foreground/70"
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
