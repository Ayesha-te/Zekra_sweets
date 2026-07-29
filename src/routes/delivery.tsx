import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, ShoppingBag, Store } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/delivery")({
  head: () =>
    buildSeoHead({
      title: "Delivery and Pickup | Zekra Sweets",
      description:
        "Learn how delivery locations, charges and pickup options are presented when ordering from Zekra Sweets.",
      path: "/delivery",
    }),
  component: DeliveryPage,
});

function DeliveryPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <header className="glass rounded-[2rem] p-7 sm:p-10" data-reveal>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-caramel">
            Order information
          </p>
          <h1 className="mt-3 font-display text-5xl sm:text-6xl">Delivery &amp; pickup</h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-foreground/75">
            Choose how you would like to receive your order during checkout. The website shows the
            applicable details before you place the order.
          </p>
        </header>
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-gold-soft/50 bg-cream/70 p-6 shadow-glass">
            <MapPin className="h-6 w-6 text-caramel" aria-hidden />
            <h2 className="mt-4 font-display text-2xl">Delivery</h2>
            <p className="mt-2 text-sm leading-7 text-foreground/70">
              Select an available delivery location at checkout. Its delivery charge is shown in AED
              and included in the total before the order is placed.
            </p>
          </article>
          <article className="rounded-2xl border border-gold-soft/50 bg-cream/70 p-6 shadow-glass">
            <Store className="h-6 w-6 text-caramel" aria-hidden />
            <h2 className="mt-4 font-display text-2xl">Pickup</h2>
            <p className="mt-2 text-sm leading-7 text-foreground/70">
              Pickup is available as a checkout option. Contact the bakery if you need to confirm
              collection details for an order.
            </p>
          </article>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/products"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-cocoa px-5 text-sm font-bold text-cream"
          >
            <ShoppingBag className="h-4 w-4" />
            Browse products
          </Link>
          <Link
            to="/contact"
            className="inline-flex min-h-11 items-center rounded-xl border border-gold-soft/60 px-5 text-sm font-bold"
          >
            Contact us
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
