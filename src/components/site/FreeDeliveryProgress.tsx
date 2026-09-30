import { Link } from "@tanstack/react-router";
import { PartyPopper, Truck } from "lucide-react";

import { FREE_DELIVERY_MINIMUM, formatMoney, getFreeDeliveryProgress } from "@/lib/cart";

type Props = {
  subtotal: number;
  /** Show the "Add more treats" link while the order is below the minimum. */
  showShopLink?: boolean;
  className?: string;
};

export function FreeDeliveryProgress({ subtotal, showShopLink = true, className = "" }: Props) {
  const { remaining, percent, qualifies } = getFreeDeliveryProgress(subtotal);

  return (
    <div
      className={`rounded-2xl border border-gold-soft/55 bg-cream/70 p-4 ${className}`}
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
            qualifies ? "bg-gradient-gold text-primary-foreground" : "bg-cocoa text-cream"
          }`}
        >
          {qualifies ? <PartyPopper className="h-4 w-4" /> : <Truck className="h-4 w-4" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold leading-snug text-foreground">
            {qualifies ? (
              "Yay! Your order gets FREE delivery."
            ) : (
              <>
                You're <span className="text-primary">{formatMoney(remaining)}</span> away from FREE
                delivery
              </>
            )}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Free delivery in Dubai, Sharjah & Ajman on orders of {formatMoney(FREE_DELIVERY_MINIMUM)}
            +
          </p>
        </div>
      </div>

      <div
        className="mt-3 h-2.5 overflow-hidden rounded-full bg-gold-soft/35"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={FREE_DELIVERY_MINIMUM}
        aria-valuenow={Math.min(subtotal, FREE_DELIVERY_MINIMUM)}
        aria-label="Progress towards free delivery"
      >
        <div
          className="h-full rounded-full bg-gradient-gold transition-[width] duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      {!qualifies && showShopLink && (
        <Link
          to="/products"
          className="mt-3 inline-flex text-xs font-bold text-primary underline-offset-4 hover:underline"
        >
          Add more treats →
        </Link>
      )}
    </div>
  );
}
