import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  ChefHat,
  CheckCircle2,
  Clock3,
  Mail,
  PackageCheck,
  Phone,
  ReceiptText,
  RefreshCw,
  Search,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { SiteLayout } from "@/components/site/SiteLayout";
import {
  assetUrl,
  productImageError,
  fetchOrderHistory,
  type CustomerOrderHistoryItem,
  type Product,
} from "@/lib/api";
import { formatMoney, useCart } from "@/lib/cart";
import { loadProducts } from "@/lib/products";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, follow" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://zekrasweets.com/history" },
      { property: "og:image", content: "https://zekrasweets.com/favicon.png" },
      { property: "og:site_name", content: "Zekra Sweets" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Track Order - Zekra Sweets" },
      {
        name: "twitter:description",
        content: "Track recent Zekra Sweets orders by phone number or email.",
      },
      { name: "twitter:image", content: "https://zekrasweets.com/favicon.png" },
      { title: "Track Order - Zekra Sweets" },
      {
        name: "description",
        content: "Track recent Zekra Sweets orders by phone number or email.",
      },
    ],
    links: [{ rel: "canonical", href: "https://zekrasweets.com/history" }],
  }),
  component: OrderHistory,
});

const fieldClass =
  "h-14 w-full rounded-full border border-border bg-cream/70 pl-12 pr-4 text-base outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm";

function OrderHistory() {
  const cart = useCart();
  const [contact, setContact] = useState("");
  const [orders, setOrders] = useState<CustomerOrderHistoryItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [count, setCount] = useState(0);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reorderNotice, setReorderNotice] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    loadProducts().then((loadedProducts) => {
      if (mounted) setProducts(loadedProducts);
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const lookup = new URLSearchParams(window.location.search).get("contact")?.trim();
    if (!lookup) return;
    setContact(lookup);
    setLoading(true);
    fetchOrderHistory(lookup)
      .then((response) => { setOrders(response.orders); setCount(response.count); setSearched(true); })
      .catch((caught) => { setSearched(true); setError(caught instanceof Error ? caught.message : "We could not load your order history."); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!searched || !contact.trim()) return;

    const refresh = window.setInterval(() => {
      fetchOrderHistory(contact.trim())
        .then((response) => {
          setOrders(response.orders);
          setCount(response.count);
        })
        .catch(() => {
          // Keep the current tracking view if a background refresh fails.
        });
    }, 60_000);

    return () => window.clearInterval(refresh);
  }, [contact, searched]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setReorderNotice(null);

    const lookup = contact.trim();
    if (!lookup) {
      setError("Enter the phone number or email used on your order.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetchOrderHistory(lookup);
      setOrders(response.orders);
      setCount(response.count);
      setSearched(true);
    } catch (caught) {
      setOrders([]);
      setCount(0);
      setSearched(true);
      setError(caught instanceof Error ? caught.message : "We could not load your order history.");
    } finally {
      setLoading(false);
    }
  };

  const rebuildBag = (order: CustomerOrderHistoryItem) => {
    const productById = new Map(products.map((product) => [product.id, product]));
    let addedCount = 0;
    let skippedCount = 0;

    order.items.forEach((item) => {
      const product = item.productId ? productById.get(item.productId) : undefined;
      const quantity = Math.max(1, Math.floor(Number(item.quantity || 1)));

      if (!product) {
        skippedCount += quantity;
        return;
      }

      cart.addItem(product, quantity);
      addedCount += quantity;
    });

    if (addedCount === 0) {
      setReorderNotice("Those items are not available for online ordering right now.");
      return;
    }

    setReorderNotice(
      `${addedCount} ${addedCount === 1 ? "item" : "items"} added to your bag${
        skippedCount > 0 ? `; ${skippedCount} unavailable` : ""
      }.`,
    );
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="glass h-fit rounded-[2rem] p-5 sm:p-6 lg:sticky lg:top-28" data-reveal>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-caramel">
              <ReceiptText className="h-3.5 w-3.5" />
              Order tracking
            </span>
            <h1 className="mt-3 font-display text-4xl leading-tight">
              Track your <span className="text-gradient-gold">order.</span>
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-foreground/70">
              Use the same phone number or email from checkout to see products, progress, and estimated completion.
            </p>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
              <label>
                <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-caramel">
                  <Search className="h-3.5 w-3.5" />
                  Phone or email
                </span>
                <span className="relative block">
                  {contact.includes("@") ? (
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  ) : (
                    <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  )}
                  <input
                    value={contact}
                    onChange={(event) => setContact(event.target.value)}
                    className={fieldClass}
                    autoComplete="email tel"
                    placeholder="Phone or email"
                  />
                </span>
              </label>

              {error && (
                <div className="flex gap-3 rounded-3xl border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {reorderNotice && (
                <div className="flex gap-3 rounded-3xl border border-primary/20 bg-secondary p-4 text-sm text-secondary-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{reorderNotice}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-gold px-5 text-base font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 disabled:pointer-events-none disabled:opacity-60 sm:text-sm"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                {loading ? "Checking orders..." : "Track order"}
              </button>
            </form>

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-gold-soft/45 pt-4 text-sm">
              <HistoryStat label="Matches" value={String(count)} />
              <HistoryStat label="In bag" value={String(cart.count)} />
            </div>
          </aside>

          <div className="min-w-0">
            {!searched ? (
              <HistoryEmptyState
                icon={Clock3}
                title="Your tracking starts here."
                text="Orders appear with products, live status, progress, and estimated completion."
              />
            ) : orders.length === 0 && !loading ? (
              <HistoryEmptyState
                icon={PackageCheck}
                title="No matching orders yet."
                text="Try the phone number or email used during checkout."
              />
            ) : (
              <div className="space-y-4">
                {count > orders.length && (
                  <div className="rounded-3xl border border-gold-soft/55 bg-cream/70 px-4 py-3 text-sm text-muted-foreground">
                    Showing the latest {orders.length} of {count} matching orders.
                  </div>
                )}
                {orders.map((order) => (
                  <OrderHistoryCard
                    key={order.id}
                    order={order}
                    onRebuildBag={() => rebuildBag(order)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function HistoryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gold-soft/45 bg-cream/55 px-4 py-3">
      <div className="text-xs font-bold uppercase tracking-[0.18em] text-caramel">{label}</div>
      <div className="mt-1 font-display text-2xl text-foreground">{value}</div>
    </div>
  );
}

function HistoryEmptyState({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Clock3;
  title: string;
  text: string;
}) {
  return (
    <div className="glass rounded-[2rem] p-6 text-center sm:p-8" data-reveal>
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-secondary text-primary shadow-glass">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="mt-4 font-display text-2xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{text}</p>
      <Link
        to="/products"
        className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl border border-gold-soft/60 bg-cream/70 px-5 text-sm font-bold text-foreground transition-colors hover:bg-secondary"
      >
        View products
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function OrderHistoryCard({
  order,
  onRebuildBag,
}: {
  order: CustomerOrderHistoryItem;
  onRebuildBag: () => void;
}) {
  const fulfillment = order.fulfillment.type === "pickup" ? "Pickup" : "Delivery";

  return (
    <article className="glass rounded-[2rem] p-5 sm:p-6" data-reveal>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-cocoa px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-cream">
              {statusLabel(order.status)}
            </span>
            <span className="rounded-full border border-gold-soft/55 bg-cream/65 px-3 py-1 text-xs font-semibold text-foreground/75">
              {paymentLabel(order.payment?.status)}
            </span>
          </div>
          <h2 className="mt-3 break-words font-display text-2xl leading-tight">{order.id}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatOrderDate(order.createdAt)} - {fulfillment}
            {order.fulfillment.locationName ? `, ${order.fulfillment.locationName}` : ""}
          </p>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-xs uppercase tracking-[0.22em] text-caramel">Total</div>
          <div className="mt-1 font-display text-3xl text-gradient-gold">
            {formatHistoryMoney(order.totals.total, order.totals.currency)}
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {order.items.map((item, index) => (
          <div
            key={`${order.id}-${item.productId || item.name}-${index}`}
            className="grid grid-cols-[56px_minmax(0,1fr)_auto] gap-3 rounded-3xl border border-gold-soft/35 bg-cream/45 p-2.5"
          >
            {item.imageUrl ? (
              <img
                src={assetUrl(item.imageUrl)}
                onError={productImageError}
                alt={item.name}
                className="h-14 w-14 rounded-2xl object-cover"
              />
            ) : (
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-primary">
                <ShoppingBag className="h-5 w-5" />
              </span>
            )}
            <div className="min-w-0 py-1">
              <div className="line-clamp-2 text-sm font-semibold leading-snug">{item.name}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {item.quantity} x {formatMoney(Number(item.unitPrice || 0))}
                {item.category ? ` - ${item.category}` : ""}
              </div>
            </div>
            <div className="py-1 text-sm font-bold">{formatMoney(Number(item.lineTotal || 0))}</div>
          </div>
        ))}
      </div>

      <OrderProgressTracker order={order} />

      <div className="mt-5 grid gap-3 border-t border-gold-soft/45 pt-5 text-sm sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-foreground/70">
          <span>Subtotal {formatHistoryMoney(order.totals.subtotal, order.totals.currency)}</span>
          <span>
            Delivery {formatHistoryMoney(order.totals.deliveryFee, order.totals.currency)}
          </span>
        </div>
        <button
          type="button"
          onClick={onRebuildBag}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-gold-soft/60 bg-cream/70 px-5 py-3 text-sm font-bold text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <ShoppingBag className="h-4 w-4 text-primary" />
          Add again
        </button>
      </div>
    </article>
  );
}

const trackingSteps = [
  { status: "new", label: "Order Received", icon: ReceiptText },
  { status: "confirmed", label: "Order Accepted", icon: PackageCheck },
  { status: "preparing", label: "Preparing", icon: ChefHat },
  { status: "out_for_delivery", label: "Out for Delivery", icon: Truck },
  { status: "completed", label: "Delivered", icon: CheckCircle2 },
] as const;

function OrderProgressTracker({ order }: { order: CustomerOrderHistoryItem }) {
  const activeIndex = trackingStepIndex(order.status);
  const progress = Math.max(0, Math.min(100, Number(order.progressPercent || 0)));
  const estimated = order.timeline?.estimatedCompletionAt;

  return (
    <section className="mt-5 rounded-3xl border border-gold-soft/40 bg-cream/45 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-caramel">
            Current progress
          </div>
          <h3 className="mt-1 font-display text-2xl">{statusLabel(order.status)}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Estimated completion: {estimated ? formatOrderDate(estimated) : "Calculating"}
          </p>
        </div>
        <div className="rounded-2xl border border-gold-soft/45 bg-cream/65 px-4 py-3 text-left sm:text-right">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-caramel">Progress</div>
          <div className="mt-1 font-display text-2xl text-gradient-gold">{progress}%</div>
        </div>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-gold-soft/35">
        <div className="h-full rounded-full bg-cocoa transition-[width]" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-5">
        {trackingSteps.map((step, index) => {
          const Icon = step.icon;
          const complete = index <= activeIndex;

          return (
            <div
              key={step.status}
              className={`rounded-2xl border p-3 ${
                complete
                  ? "border-primary/30 bg-secondary text-foreground"
                  : "border-gold-soft/35 bg-cream/50 text-muted-foreground"
              }`}
            >
              <span
                className={`grid h-9 w-9 place-items-center rounded-full ${
                  complete ? "bg-gradient-gold text-primary-foreground" : "bg-cream text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="mt-3 text-sm font-bold leading-tight">{step.label}</div>
              {statusTime(order, step.status) && <div className="mt-1 text-xs opacity-75">{formatOrderDate(statusTime(order, step.status)!)}</div>}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function statusLabel(value: string | null | undefined) {
  const labels: Record<string, string> = {
    new: "New",
    confirmed: "Confirmed",
    preparing: "Preparing",
    ready: "Ready",
    out_for_delivery: "Out for Delivery",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return labels[String(value || "").toLowerCase()] || tokenLabel(value || "Order");
}

function trackingStepIndex(status: string | null | undefined) {
  switch (String(status || "").toLowerCase()) {
    case "completed":
      return 4;
    case "out_for_delivery":
      return 3;
    case "ready":
    case "preparing":
      return 2;
    case "confirmed":
      return 1;
    case "cancelled":
      return -1;
    default:
      return 0;
  }
}

function statusTime(order: CustomerOrderHistoryItem, status: string) {
  const aliases = status === "preparing" ? ["preparing", "ready"] : [status];
  return order.statusHistory?.find((entry) => aliases.includes(entry.status))?.at;
}

function paymentLabel(value: string | null | undefined) {
  const status = String(value || "").trim();
  return status ? tokenLabel(status) : "Payment not set";
}

function tokenLabel(value: string) {
  return String(value)
    .split(/[_-]+/g)
    .filter(Boolean)
    .map((part) => part.replace(/^\w/, (letter) => letter.toUpperCase()))
    .join(" ");
}

function formatOrderDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date pending";

  return new Intl.DateTimeFormat("en-AE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatHistoryMoney(value: number, currency = "AED") {
  const normalizedCurrency = String(currency || "AED").toUpperCase();
  if (normalizedCurrency === "AED") return formatMoney(Number(value || 0));

  return `${normalizedCurrency} ${Number(value || 0).toFixed(2)}`;
}
