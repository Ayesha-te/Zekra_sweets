import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  BadgePercent,
  Banknote,
  CreditCard,
  History,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  Store,
  Truck,
  User,
} from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";

import { SiteLayout } from "@/components/site/SiteLayout";
import {
  assetUrl,
  productImageError,
  createStripeCheckoutSession,
  createOrder,
  fetchStripeCheckoutSession,
  loadDeliveryLocations,
  loadPickupLocations,
  validateCoupon,
  type CreateOrderPayload,
  type DeliveryLocation,
  type FulfillmentMode,
  type PickupLocation,
  type StripeCheckoutSessionStatus,
  type ValidatedCoupon,
} from "@/lib/api";
import { FREE_DELIVERY_MINIMUM, cartItemKey, clearCart, formatMoney, getCartTotals, useCart } from "@/lib/cart";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, follow" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://zekrasweets.com/checkout" },
      { property: "og:image", content: "https://zekrasweets.com/favicon.png" },
      { property: "og:site_name", content: "Zekra Sweets" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Checkout - Zekra Sweets" },
      {
        name: "twitter:description",
        content: "Send your Zekra Sweets order details for delivery or pickup.",
      },
      { name: "twitter:image", content: "https://zekrasweets.com/favicon.png" },
      { title: "Checkout - Zekra Sweets" },
      {
        name: "description",
        content: "Send your Zekra Sweets order details for delivery or pickup.",
      },
    ],
    links: [{ rel: "canonical", href: "https://zekrasweets.com/checkout" }],
  }),
  component: Checkout,
});

type CheckoutForm = {
  name: string;
  phone: string;
  email: string;
  mode: FulfillmentMode;
  locationId: string;
  address: string;
  notes: string;
  paymentMethod: "card" | "cash_on_pickup";
};

type Confirmation = {
  reference: string;
  total: number;
  mode: FulfillmentMode;
  paymentStatus?: string | null;
};

const initialForm: CheckoutForm = {
  name: "",
  phone: "",
  email: "",
  mode: "delivery",
  locationId: "",
  address: "",
  notes: "",
  paymentMethod: "card",
};

const fieldClass =
  "w-full rounded-2xl border border-border bg-cream/70 px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";

function Checkout() {
  const cart = useCart();
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [deliveryLocations, setDeliveryLocations] = useState<DeliveryLocation[]>([]);
  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>([]);
  const [deliveryLocationsLoading, setDeliveryLocationsLoading] = useState(true);
  const [pickupLocationsLoading, setPickupLocationsLoading] = useState(true);
  const [pickupLocationsError, setPickupLocationsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<ValidatedCoupon | null>(null);
  const [couponBusy, setCouponBusy] = useState(false);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    loadDeliveryLocations().then((delivery) => { if (mounted) setDeliveryLocations(delivery); }).finally(() => { if (mounted) setDeliveryLocationsLoading(false); });
    loadPickupLocations().then((pickup) => { if (mounted) setPickupLocations(pickup); }).catch(() => { if (mounted) setPickupLocationsError(true); }).finally(() => { if (mounted) setPickupLocationsLoading(false); });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stripeResult = params.get("stripe");
    if (!stripeResult) return;

    const clearStripeParams = () => {
      window.history.replaceState({}, "", window.location.pathname);
    };

    if (stripeResult === "cancelled") {
      setError("Payment was cancelled. Your bag is still here when you are ready.");
      clearStripeParams();
      return;
    }

    const sessionId = params.get("session_id");
    if (stripeResult !== "success" || !sessionId) return;

    setCheckingPayment(true);
    fetchStripeCheckoutSession(sessionId)
      .then((session) => {
        if (session.paymentStatus !== "paid") {
          setError("Stripe returned without a completed payment. Please try again.");
          return;
        }

        setConfirmation({
          reference: orderReference(session),
          total: Number(session.total || 0),
          mode: normalizeFulfillmentMode(session.mode),
          paymentStatus: session.paymentStatus,
        });
        clearCart();
        setForm(initialForm);
      })
      .catch((caught) => {
        setError(
          caught instanceof Error
            ? caught.message
            : "We could not verify the Stripe payment. Please contact Zekra Sweets.",
        );
      })
      .finally(() => {
        setCheckingPayment(false);
        clearStripeParams();
      });
  }, []);

  const selectedLocation = deliveryLocations.find((location) => location.id === form.locationId);
  const selectedPickupLocation = pickupLocations.find((location) => location.id === form.locationId);
  const locationsLoading = form.mode === "delivery" ? deliveryLocationsLoading : pickupLocationsLoading;
  const deliveryCharge = form.mode === "delivery" && selectedLocation ? selectedLocation.charge : 0;
  const totals = getCartTotals(cart.items, deliveryCharge);
  const discount = appliedCoupon ? roundMoney(totals.subtotal * appliedCoupon.percentageOff / 100) : 0;
  const payableTotal = roundMoney(totals.total - discount);
  const qualifiesForFreeDelivery = totals.subtotal >= FREE_DELIVERY_MINIMUM;
  const submitText = submitting
    ? form.paymentMethod === "cash_on_pickup" ? "Placing order..." : "Opening secure payment..."
    : form.mode === "delivery" && locationsLoading
      ? "Loading delivery locations..."
      : form.mode === "delivery" && !selectedLocation
        ? "Select delivery location"
        : form.mode === "pickup" && !selectedPickupLocation
          ? "Select pickup location"
        : form.paymentMethod === "cash_on_pickup"
          ? `Place order - Pay ${formatMoney(payableTotal)} on pickup`
          : `Pay with card - ${formatMoney(payableTotal)}`;

  async function applyCoupon() {
    if (!couponCode.trim()) { setCouponMessage("Enter a coupon code."); return; }
    setCouponBusy(true); setCouponMessage(null);
    try {
      const coupon = await validateCoupon(couponCode);
      setAppliedCoupon(coupon); setCouponCode(coupon.code); setCouponMessage(`${coupon.percentageOff}% discount applied.`);
    } catch (caught) {
      setAppliedCoupon(null); setCouponMessage(caught instanceof Error ? caught.message : "Coupon could not be applied.");
    } finally { setCouponBusy(false); }
  }

  const updateField = (field: keyof CheckoutForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateMode = (mode: FulfillmentMode) => {
    setForm((current) => ({ ...current, mode, locationId: "", paymentMethod: mode === "delivery" ? "card" : current.paymentMethod }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (cart.items.length === 0) {
      setError("Your bag is empty. Add treats before sending an order.");
      return;
    }

    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      setError("Please add your name, phone number, and email.");
      return;
    }

    const deliveryLocation = form.mode === "delivery" ? selectedLocation : undefined;

    if (form.mode === "delivery" && deliveryLocations.length === 0) {
      setError("No active delivery locations are available. Please switch to pickup.");
      return;
    }

    if (form.mode === "delivery" && !deliveryLocation) {
      setError("Please choose a delivery location.");
      return;
    }

    if (form.mode === "delivery" && !form.address.trim()) {
      setError("Please add a delivery address or switch to pickup.");
      return;
    }
    if (form.mode === "pickup" && !selectedPickupLocation) {
      setError("Please choose a pickup location.");
      return;
    }

    const orderTotals = getCartTotals(cart.items, deliveryLocation ? deliveryLocation.charge : 0);

    const payload: CreateOrderPayload = {
      paymentMethod: form.paymentMethod,
      customer: {
        name: form.name.trim(),
        phone: form.phone.trim(),
        ...(form.email.trim() ? { email: form.email.trim() } : {}),
      },
      fulfillment: {
        mode: form.mode,
        ...(deliveryLocation
          ? { address: form.address.trim(), locationId: deliveryLocation.id }
          : { pickupLocationId: selectedPickupLocation!.id }),
      },
      ...(form.notes.trim() ? { notes: form.notes.trim() } : {}),
      ...(appliedCoupon ? { couponCode: appliedCoupon.code } : {}),
      items: cart.items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        category: item.product.category,
        quantity: item.quantity,
        unitPrice: item.product.price,
        sizeId: item.product.sizeId,
        sizeLabel: item.product.sizeLabel,
      })),
      totals: {
        currency: "AED",
        subtotal: roundMoney(orderTotals.subtotal),
        delivery: roundMoney(orderTotals.deliveryEstimate),
        total: roundMoney(orderTotals.total),
      },
    };

    setSubmitting(true);
    try {
      if (form.mode === "pickup" && form.paymentMethod === "cash_on_pickup") {
        const response = await createOrder(payload);
        const reference = response.id || response.orderId || response.orderNumber || response.number;
        if (!reference) throw new Error("The order was created but no reference was returned.");
        setConfirmation({ reference, total: payableTotal, mode: "pickup", paymentStatus: "cash_on_pickup" });
        clearCart();
        setForm(initialForm);
      } else {
        const response = await createStripeCheckoutSession(payload);
        if (!response.url) throw new Error("Stripe did not return a checkout URL.");
        window.location.assign(response.url);
      }
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

  if (checkingPayment) {
    return <CheckoutPaymentLoading />;
  }

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
          <div className="flex flex-wrap gap-2">
            <Link
              to="/history"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-gold-soft/60 bg-cream/70 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              <History className="h-4 w-4 text-primary" />
              Track order
            </Link>
            <Link
              to="/cart"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-gold-soft/60 bg-cream/70 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to cart
            </Link>
          </div>
        </div>

        {cart.items.length === 0 ? (
          <EmptyCheckout />
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <form className="glass rounded-[2rem] p-5 sm:p-7" onSubmit={handleSubmit} data-reveal>
              <div>
                <h2 className="font-display text-2xl">Customer details</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Name, phone, and email are required. We send tracking updates to your email.
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
                <Field label="Email" icon={Mail} wide>
                  <input
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    className={fieldClass}
                    autoComplete="email"
                    inputMode="email"
                    type="email"
                    required
                    placeholder="name@example.com"
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
                    detail="Included delivery charges"
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

              {form.mode === "delivery" && (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field label="Delivery location" icon={MapPin}>
                    <select
                      value={form.locationId}
                      onChange={(event) => updateField("locationId", event.target.value)}
                      className={fieldClass}
                      required
                      disabled={locationsLoading || deliveryLocations.length === 0}
                    >
                      <option value="">
                        {locationsLoading ? "Loading locations..." : "Select delivery location"}
                      </option>
                      {deliveryLocations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.name} - {formatMoney(location.charge)}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <div className="rounded-2xl border border-gold-soft/55 bg-cream/60 px-4 py-3 text-sm">
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-caramel">
                      Delivery charge
                    </div>
                    <div className="mt-2 font-display text-xl text-foreground">
                      {selectedLocation
                        ? qualifiesForFreeDelivery
                          ? "Free"
                          : formatMoney(selectedLocation.charge)
                        : locationsLoading
                          ? "Loading..."
                          : "Select location"}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Free above {formatMoney(FREE_DELIVERY_MINIMUM)} across the UAE.
                    </p>
                  </div>
                </div>
              )}

              {form.mode === "pickup" && (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <fieldset className="space-y-2"><legend className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-caramel"><Store className="h-3.5 w-3.5" />Pickup location</legend>{pickupLocationsLoading ? <div className="rounded-2xl border border-border bg-cream/70 px-4 py-3 text-sm text-muted-foreground">Loading pickup locations...</div> : pickupLocations.length === 0 ? <div className="rounded-2xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive">{pickupLocationsError ? "Pickup locations could not be loaded. Delivery remains available." : "No pickup locations are currently available."}</div> : pickupLocations.map((location) => <label key={location.id} className={`block cursor-pointer rounded-2xl border p-3 transition ${form.locationId === location.id ? "border-primary bg-gold-soft/25 ring-2 ring-primary/15" : "border-border bg-cream/70 hover:border-gold-soft"}`}><span className="flex items-start gap-3"><input type="radio" name="pickupLocation" value={location.id} checked={form.locationId === location.id} onChange={(event) => updateField("locationId", event.target.value)} required className="mt-1 accent-primary" /><span><span className="block font-display text-base font-bold">{location.name}</span><span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{location.address}<br />{location.contact}</span></span></span></label>)}</fieldset>
                  <div className="rounded-2xl border border-gold-soft/55 bg-cream/60 px-4 py-3 text-sm" aria-live="polite">
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-caramel">Collection point</div>
                    {selectedPickupLocation ? <><div className="mt-2 font-display text-xl text-foreground">{selectedPickupLocation.name}</div><p className="mt-1 text-muted-foreground">{selectedPickupLocation.address}</p><a href={`tel:${selectedPickupLocation.contact}`} className="mt-2 inline-flex font-semibold text-primary">{selectedPickupLocation.contact}</a></> : <p className="mt-2 text-muted-foreground">Choose a location to see its address and contact.</p>}
                  </div>
                </div>
              )}

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
                <Field label="Notes" icon={ShoppingBag} wide>
                  <textarea
                    value={form.notes}
                    onChange={(event) => updateField("notes", event.target.value)}
                    className={`${fieldClass} min-h-28 resize-y`}
                    placeholder="Packaging requests, allergies, delivery guidance"
                  />
                </Field>
              </div>

              <div className="mt-6 rounded-3xl border border-gold-soft/55 bg-cream/60 p-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-caramel">Payment method</h3>
                <div className={`mt-3 grid gap-3 ${form.mode === "pickup" ? "sm:grid-cols-2" : ""}`}>
                  <ModeButton active={form.paymentMethod === "card"} icon={CreditCard} title="Card" detail="Pay securely with Stripe" onClick={() => updateField("paymentMethod", "card")} />
                  {form.mode === "pickup" && <ModeButton active={form.paymentMethod === "cash_on_pickup"} icon={Banknote} title="Cash on Pickup" detail="Pay when collecting your order" onClick={() => updateField("paymentMethod", "cash_on_pickup")} />}
                </div>
                {form.mode === "delivery" && <p className="mt-3 text-xs text-muted-foreground">Delivery orders are paid by card.</p>}
              </div>

              <div className="mt-6 rounded-3xl border border-gold-soft/55 bg-cream/60 p-4">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-caramel"><BadgePercent className="h-4 w-4" />Coupon code</label>
                <div className="mt-3 flex gap-2"><input maxLength={100} value={couponCode} onChange={(event) => { setCouponCode(event.target.value); if (appliedCoupon) { setAppliedCoupon(null); setCouponMessage(null); } }} className={fieldClass} placeholder="Enter coupon code" aria-label="Coupon code" /><button type="button" onClick={applyCoupon} disabled={couponBusy} className="shrink-0 rounded-full bg-cocoa px-5 text-sm font-bold text-cream disabled:opacity-60">{couponBusy ? "Checking..." : "Apply"}</button></div>
                {couponMessage && <p className={`mt-2 text-sm ${appliedCoupon ? "text-primary" : "text-destructive"}`}>{couponMessage}</p>}
              </div>

              {error && (
                <div className="mt-6 flex gap-3 rounded-3xl border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || locationsLoading}
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 disabled:pointer-events-none disabled:opacity-60"
              >
                <CreditCard className="h-4 w-4" />
                {submitText}
              </button>
            </form>

            <CheckoutSummary mode={form.mode} selectedLocation={selectedLocation} coupon={appliedCoupon} />
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

function CheckoutSummary({
  mode,
  selectedLocation,
  coupon,
}: {
  mode: FulfillmentMode;
  selectedLocation?: DeliveryLocation;
  coupon: ValidatedCoupon | null;
}) {
  const cart = useCart();
  const deliveryCharge = mode === "delivery" && selectedLocation ? selectedLocation.charge : 0;
  const totals = getCartTotals(cart.items, deliveryCharge);
  const qualifiesForFreeDelivery = totals.subtotal >= FREE_DELIVERY_MINIMUM;
  const discount = coupon ? roundMoney(totals.subtotal * coupon.percentageOff / 100) : 0;

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
          <div key={cartItemKey(item.product)} className="grid grid-cols-[52px_minmax(0,1fr)_auto] gap-3">
            <img
              src={assetUrl(item.product.imageUrl)}
              onError={productImageError}
              alt={item.product.imageAlt || item.product.name}
              className="h-12 w-12 rounded-2xl object-cover"
            />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{item.product.name}</div>
              {item.product.sizeLabel && <div className="text-xs font-semibold text-caramel">Size: {item.product.sizeLabel}</div>}
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
          label={
            mode === "delivery" && selectedLocation
              ? `Delivery (${selectedLocation.name})`
              : mode === "delivery"
                ? "Delivery"
                : "Pickup"
          }
          value={
            mode === "delivery"
              ? selectedLocation
                ? qualifiesForFreeDelivery
                  ? "Free"
                  : formatMoney(totals.deliveryEstimate)
                : "Select location"
              : "AED 0.00"
          }
        />
        {coupon && <SummaryRow label={`Discount (${coupon.code}, ${coupon.percentageOff}%)`} value={`-${formatMoney(discount)}`} />}
        <SummaryRow label="Total" value={formatMoney(totals.total - discount)} strong />
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
        to="/products"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
      >
        View products
      </Link>
    </div>
  );
}

function CheckoutPaymentLoading() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="glass rounded-[2rem] p-8 text-center sm:p-12" data-reveal>
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-secondary text-secondary-foreground shadow-glass">
            <CreditCard className="h-9 w-9 text-primary" />
          </div>
          <span className="mt-6 inline-flex rounded-full bg-cream/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-caramel">
            Stripe payment
          </span>
          <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
            Verifying your payment.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Please hold on while we confirm your secure payment and prepare your order reference.
          </p>
        </div>
      </section>
    </SiteLayout>
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
            {confirmation.paymentStatus === "paid" ? "Payment received" : confirmation.paymentStatus === "cash_on_pickup" ? "Cash on pickup" : "Order received"}
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
              to="/products"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
            >
              View products
            </Link>
            <Link
              to="/history"
              className="inline-flex items-center gap-2 rounded-full border border-gold-soft/60 bg-cream/70 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Track order
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

function orderReference(response: StripeCheckoutSessionStatus) {
  return response.orderNumber || response.orderId || "Pending confirmation";
}

function normalizeFulfillmentMode(value: string | null | undefined): FulfillmentMode {
  return value === "pickup" ? "pickup" : "delivery";
}

function roundMoney(value: number) {
  return Number(value.toFixed(2));
}
