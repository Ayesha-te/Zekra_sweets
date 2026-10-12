import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

import type { Product } from "@/lib/api";
import {
  formatMakingTime,
  formatPreOrderDays,
  formatReadyBy,
  summarizeMakingTime,
} from "@/lib/making-time";

type Props = {
  products: Array<Product | undefined>;
  className?: string;
};

export function MakingTimeNotice({ products, className = "" }: Props) {
  const { hours, notes, preOrderDays, preOrderNotes } = summarizeMakingTime(products);
  // Computed after mount so server and browser render the same HTML.
  const [readyBy, setReadyBy] = useState("");

  useEffect(() => {
    // Made-to-order items are scheduled by the pre-order lead time, so no ready-by estimate.
    setReadyBy(hours > 0 && preOrderDays === 0 ? formatReadyBy(hours) : "");
  }, [hours, preOrderDays]);

  if (hours <= 0 && notes.length === 0 && preOrderDays === 0) return null;

  return (
    <div
      className={`rounded-2xl border border-gold-soft/55 bg-cream/70 p-4 ${className}`}
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cocoa text-cream">
          <Clock className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1 text-sm leading-snug">
          {preOrderDays > 0 && (
            <>
              <p className="font-bold text-foreground">
                Pre-order required: order at least {formatPreOrderDays(preOrderDays)} before
              </p>
              <p className="mt-1 text-foreground/75">This item is made fresh to order.</p>
              {preOrderNotes.map((note) => (
                <p key={note} className="mt-1 text-foreground/75">
                  {note}
                </p>
              ))}
            </>
          )}
          {hours > 0 && (
            <>
              <p className="font-bold text-foreground">Making time: {formatMakingTime(hours)}</p>
              {readyBy && (
                <p className="mt-1 text-foreground/75">
                  Estimated ready by {readyBy} (Dubai time), counted from when we confirm your order.
                </p>
              )}
            </>
          )}
          {notes.map((note) => (
            <p key={note} className="mt-1 text-foreground/75">
              {note}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
