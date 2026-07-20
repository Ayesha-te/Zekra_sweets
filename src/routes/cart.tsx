import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { assetUrl } from "@/lib/api";
import { formatMoney, useCart, type CartItem } from "@/lib/cart";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart - Zekra Sweets" },
      {
        name: "description",
        content: "Review your Zekra Sweets cart, update quantities, and continue to checkout.",
      },
    ],
  }),
  component: Cart,
});

function Cart() {
  const cart = useCart();

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          data-reveal
        >
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-caramel">Review order</span>
            <h1 className="mt-3 font-display text-4xl leading-tight sm:text-6xl">
              Your <span className="text-gradient-gold">cart.</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/70">
              Adjust quantities, remove anything you changed your mind about, then checkout for
              delivery or pickup.
            </p>
          </div>
          <Link
            to="/order"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-gold-soft/60 bg-cream/70 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue shopping
          </Link>
        </div>

        {cart.items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="glass overflow-hidden rounded-[2rem]" data-reveal>
              <div className="flex items-center justify-between gap-4 border-b border-gold-soft/45 px-5 py-4 sm:px-6">
                <div>
                  <h2 className="font-display text-2xl">Bag details</h2>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {cart.count} {cart.count === 1 ? "item" : "items"}
                  </p>
                </div>
                <button
                  onClick={cart.clear}
                  className="inline-flex items-center gap-2 rounded-full border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/25"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear cart
                </button>
              </div>

              <div className="divide-y divide-gold-soft/35">
                {cart.items.map((item) => (
                  <CartItemRow key={item.product.id} item={item} />
                ))}
              </div>
            </div>

            <CartTotals />
          </div>
        )}
      </section>
    </SiteLayout>
  );
}

function EmptyCart() {
  return (
    <div className="glass mt-8 rounded-[2rem] p-8 text-center sm:p-12" data-reveal>
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-gold text-primary-foreground shadow-glow">
        <ShoppingBag className="h-7 w-7" />
      </div>
      <h2 className="mt-5 font-display text-3xl">Your bag is empty</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        Add fresh cookies, sweets, rusk or puffs to start an order. We will keep the cart ready as
        you browse.
      </p>
      <Link
        to="/order"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
      >
        Start ordering
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function CartItemRow({ item }: { item: CartItem }) {
  const cart = useCart();
  const lineTotal = item.product.price * item.quantity;

  return (
    <article className="grid gap-4 p-5 sm:grid-cols-[104px_minmax(0,1fr)_auto] sm:p-6">
      <img
        src={assetUrl(item.product.imageUrl)}
        alt={item.product.name}
        className="h-28 w-full rounded-3xl object-cover sm:h-28 sm:w-[104px]"
      />

      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-widest text-caramel">
          {item.product.category}
        </div>
        <h2 className="mt-1 font-display text-xl leading-tight">{item.product.name}</h2>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="font-semibold text-primary">{formatMoney(item.product.price)}</span>
          <span className="text-xs text-muted-foreground">per pack</span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="inline-flex h-11 items-center overflow-hidden rounded-full border border-gold-soft/60 bg-cream/70">
            <button
              onClick={() => cart.updateQuantity(item.product.id, item.quantity - 1)}
              aria-label={`Decrease ${item.product.name}`}
              className="grid h-11 w-11 place-items-center transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-10 text-center text-sm font-bold">{item.quantity}</span>
            <button
              onClick={() => cart.updateQuantity(item.product.id, item.quantity + 1)}
              aria-label={`Increase ${item.product.name}`}
              className="grid h-11 w-11 place-items-center transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={() => cart.removeItem(item.product.id)}
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/25"
          >
            <X className="h-3.5 w-3.5" />
            Remove
          </button>
        </div>
      </div>

      <div className="flex items-end justify-between gap-3 sm:flex-col sm:items-end">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Line total</span>
        <span className="font-display text-2xl text-gradient-gold">{formatMoney(lineTotal)}</span>
      </div>
    </article>
  );
}

function CartTotals() {
  const cart = useCart();

  return (
    <aside className="glass h-fit rounded-[2rem] p-5 lg:sticky lg:top-28" data-reveal>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.26em] text-caramel">Summary</div>
          <h2 className="mt-1 font-display text-2xl">Ready to checkout</h2>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-full bg-cocoa text-cream">
          <ShoppingBag className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-6 space-y-3 text-sm">
        <SummaryRow label="Subtotal" value={formatMoney(cart.subtotal)} />
        <SummaryRow label="Ajman delivery estimate" value={formatMoney(cart.deliveryEstimate)} />
        <SummaryRow label="Total" value={formatMoney(cart.total)} strong />
      </div>

      <p className="mt-4 rounded-2xl bg-secondary px-4 py-3 text-xs leading-relaxed text-secondary-foreground">
        Pickup removes the delivery estimate at checkout. Delivery address is confirmed on the next
        step.
      </p>

      <div className="mt-6 grid gap-2">
        <Link
          to="/checkout"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold px-5 py-3 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
        >
          Checkout
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to="/order"
          className="inline-flex items-center justify-center rounded-full border border-gold-soft/60 bg-cream/60 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
        >
          Add more treats
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
        strong ? "border-t border-gold-soft/45 pt-3 font-display text-xl" : "text-foreground/70"
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
