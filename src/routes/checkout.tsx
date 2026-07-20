import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  Store,
  Truck,
  User,
} from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";

import { SiteLayout } from "@/components/site/SiteLayout";
import {
  assetUrl,
  createOrder,
  type CreateOrderPayload,
  type CreateOrderResponse,
  type FulfillmentMode,
} from "@/lib/api";
import { formatMoney, getCartTotals, useCart } from "@/lib/cart";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout - Zekra Sweets" },
      {
        name: "description",
        content: "Send your Zekra Sweets order details for delivery or pickup in Ajman.",
      },
    ],
  }),
  component: Checkout,
});

type CheckoutForm = {
  name: string;
  phone: string;
  email: string;
  mode: FulfillmentMode;
  address: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
};

type Confirmation = {
  reference: string;
  total: number;
  mode: FulfillmentMode;
};

const initialForm: CheckoutForm = {
  name: "",
  phone: "",
  email: "",
  mode: "delivery",
  address: "",
  preferredDate: "",
  preferredTime: "",
  notes: "",
};

const fieldClass =
  "w-full rounded-2xl border border-border bg-cream/70 px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";

function Checkout() {
  const cart = useCart();
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const totals = getCartTotals(cart.items, form.mode === "delivery");

  const updateField = (field: keyof CheckoutForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateMode = (mode: FulfillmentMode) => {
    setForm((current) => ({ ...current, mode }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (cart.items.length === 0) {
      setError("Your bag is empty. Add treats before sending an order.");
      return;
    }

    if (!form.name.trim() || !form.phone.trim()) {
      setError("Please add your name and phone number.");
      return;
    }

    if (form.mode === "delivery" && !form.address.trim()) {
      setError("Please add a delivery address or switch to pickup.");
      return;
    }

    const payload: CreateOrderPayload = {
      customer: {
        name: form.name.trim(),
        phone: form.phone.trim(),
        ...(form.email.trim() ? { email: form.email.trim() } : {}),
      },
      fulfillment: {
        mode: form.mode,
        ...(form.mode === "delivery" ? { address: form.address.trim() } : {}),
        ...(form.preferredDate ? { preferredDate: form.preferredDate } : {}),
        ...(form.preferredTime ? { preferredTime: form.preferredTime } : {}),
      },
      ...(form.notes.trim() ? { notes: form.notes.trim() } : {}),
      items: cart.items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        category: item.product.category,
        quantity: item.quantity,
        unitPrice: item.product.price,
      })),
      totals: {
        currency: "AED",
        subtotal: roundMoney(totals.subtotal),
        delivery: roundMoney(totals.deliveryEstimate),
        total: roundMoney(totals.total),
      },
    };

    setSubmitting(true);
    try {
      const response = await createOrder(payload);
      setConfirmation({
        reference: orderReference(response),
        total: totals.total,
        mode: form.mode,
      });
      cart.clear();
      setForm(initialForm);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "We could not send your order. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmation) {
    return <CheckoutConfirmation confirmation={confirmation} />;
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          data-reveal
        >
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-caramel">Checkout</span>
            <h1 className="mt-3 font-display text-4xl leading-tight sm:text-6xl">
              Send your <span className="text-gradient-gold">order.</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/70">
              Share your contact and fulfillment details. We will keep your cart intact if the order
              cannot be submitted.
            </p>
          </div>
          <Link
            to="/cart"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-gold-soft/60 bg-cream/70 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to cart
          </Link>
        </div>

        {cart.items.length === 0 ? (
          <EmptyCheckout />
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <form className="glass rounded-[2rem] p-5 sm:p-7" onSubmit={handleSubmit} data-reveal>
              <div>
                <h2 className="font-display text-2xl">Customer details</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Name and phone are required so the bakery can confirm your order.
                </p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Full name" icon={User}>
                  <input
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    className={fieldClass}
                    autoComplete="name"
                    required
                    placeholder="Your name"
                  />
                </Field>
                <Field label="Phone" icon={Phone}>
                  <input
                    value={form.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                    className={fieldClass}
                    autoComplete="tel"
                    inputMode="tel"
                    required
                    placeholder="+971 55 000 0000"
                  />
                </Field>
                <Field label="Email optional" icon={Mail}>
                  <input
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    className={fieldClass}
                    autoComplete="email"
                    type="email"
                    placeholder="you@example.com"
                  />
                </Field>
                <Field label="Preferred date" icon={Clock}>
                  <input
                    value={form.preferredDate}
                    onChange={(event) => updateField("preferredDate", event.target.value)}
                    className={fieldClass}
                    min={minDate}
                    type="date"
                  />
                </Field>
              </div>

              <div className="mt-7">
                <h3 className="font-display text-xl">Fulfillment</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <ModeButton
                    active={form.mode === "delivery"}
                    icon={Truck}
                    title="Delivery"
                    detail="Ajman delivery estimate included"
                    onClick={() => updateMode("delivery")}
                  />
                  <ModeButton
                    active={form.mode === "pickup"}
                    icon={Store}
                    title="Pickup"
                    detail="Collect from Zekra Sweets"
                    onClick={() => updateMode("pickup")}
                  />
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {form.mode === "delivery" && (
                  <Field label="Delivery address" icon={MapPin} wide>
                    <textarea
                      value={form.address}
                      onChange={(event) => updateField("address", event.target.value)}
                      className={`${fieldClass} min-h-28 resize-y`}
                      required
                      placeholder="Building, street, area, city"
                    />
                  </Field>
                )}
                <Field label="Preferred time" icon={Clock}>
                  <input
                    value={form.preferredTime}
                    onChange={(event) => updateField("preferredTime", event.target.value)}
                    className={fieldClass}
                    type="time"
                  />
                </Field>
                <Field label="Notes" icon={ShoppingBag} wide>
                  <textarea
                    value={form.notes}
                    onChange={(event) => updateField("notes", event.target.value)}
                    className={`${fieldClass} min-h-28 resize-y`}
                    placeholder="Packaging requests, allergies, delivery guidance"
                  />
                </Field>
              </div>

              {error && (
                <div className="mt-6 flex gap-3 rounded-3xl border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 disabled:pointer-events-none disabled:opacity-60"
              >
                {submitting ? "Sending order..." : `Submit order - ${formatMoney(totals.total)}`}
              </button>
            </form>

            <CheckoutSummary mode={form.mode} />
          </div>
        )}
      </section>
    </SiteLayout>
  );
}

function Field({
  label,
  icon: Icon,
  wide = false,
  children,
}: {
  label: string;
  icon: typeof User;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <label className={wide ? "sm:col-span-2" : undefined}>
      <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-caramel">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      {children}
    </label>
  );
}

function ModeButton({
  active,
  icon: Icon,
  title,
  detail,
  onClick,
}: {
  active: boolean;
  icon: typeof Truck;
  title: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-24 items-start gap-3 rounded-3xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
        active
          ? "border-primary bg-secondary text-foreground shadow-glass"
          : "border-gold-soft/55 bg-cream/60 text-foreground/75 hover:border-primary/50"
      }`}
    >
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${
          active ? "bg-gradient-gold text-primary-foreground shadow-glow" : "bg-cream text-primary"
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className="block font-display text-lg">{title}</span>
        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{detail}</span>
      </span>
    </button>
  );
}

function CheckoutSummary({ mode }: { mode: FulfillmentMode }) {
  const cart = useCart();
  const totals = getCartTotals(cart.items, mode === "delivery");

  return (
    <aside className="glass h-fit rounded-[2rem] p-5 lg:sticky lg:top-28" data-reveal>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.26em] text-caramel">Order summary</div>
          <h2 className="mt-1 font-display text-2xl">
            {cart.count} {cart.count === 1 ? "item" : "items"}
          </h2>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-full bg-cocoa text-cream">
          <ShoppingBag className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-5 max-h-[360px] space-y-3 overflow-auto pr-1">
        {cart.items.map((item) => (
          <div key={item.product.id} className="grid grid-cols-[52px_minmax(0,1fr)_auto] gap-3">
            <img
              src={assetUrl(item.product.imageUrl)}
              alt=""
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
      </div>

      <div className="mt-6 space-y-3 border-t border-gold-soft/45 pt-5 text-sm">
        <SummaryRow label="Subtotal" value={formatMoney(totals.subtotal)} />
        <SummaryRow
          label={mode === "delivery" ? "Delivery estimate" : "Pickup"}
          value={mode === "delivery" ? formatMoney(totals.deliveryEstimate) : "AED 0.00"}
        />
        <SummaryRow label="Total" value={formatMoney(totals.total)} strong />
      </div>
    </aside>
  );
}

function EmptyCheckout() {
  return (
    <div className="glass mt-8 rounded-[2rem] p-8 text-center sm:p-12" data-reveal>
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-gold text-primary-foreground shadow-glow">
        <ShoppingBag className="h-7 w-7" />
      </div>
      <h2 className="mt-5 font-display text-3xl">Your bag is empty</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        Add a few bakery favorites before checkout.
      </p>
      <Link
        to="/order"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
      >
        Start ordering
      </Link>
    </div>
  );
}

function CheckoutConfirmation({ confirmation }: { confirmation: Confirmation }) {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="glass rounded-[2rem] p-8 text-center sm:p-12" data-reveal>
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-secondary text-secondary-foreground shadow-glass">
            <CheckCircle2 className="h-9 w-9 text-primary" />
          </div>
          <span className="mt-6 inline-flex rounded-full bg-cream/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-caramel">
            Order received
          </span>
          <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
            Thank you for ordering.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Your order reference is{" "}
            <span className="font-bold text-foreground">{confirmation.reference}</span>. The bakery
            team will confirm your {confirmation.mode} details shortly.
          </p>
          <div className="mx-auto mt-7 max-w-sm rounded-3xl border border-gold-soft/55 bg-cream/65 p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-caramel">Submitted total</div>
            <div className="mt-2 font-display text-3xl text-gradient-gold">
              {formatMoney(confirmation.total)}
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/order"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
            >
              Order more treats
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full border border-gold-soft/60 bg-cream/70 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Browse products
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
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

function orderReference(response: CreateOrderResponse) {
  return (
    response.orderNumber ||
    response.orderId ||
    response.id ||
    response._id ||
    response.number ||
    "Pending confirmation"
  );
}

function roundMoney(value: number) {
  return Number(value.toFixed(2));
}
