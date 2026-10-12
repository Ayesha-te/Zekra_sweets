import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

import type { Product } from "@/lib/api";
import { formatMakingTime, formatReadyBy, summarizeMakingTime } from "@/lib/making-time";

type Props = {
  products: Array<Product | undefined>;
  className?: string;
};

export function MakingTimeNotice({ products, className = "" }: Props) {
  const { hours, notes } = summarizeMakingTime(products);
  // Computed after mount so server and browser render the same HTML.
  const [readyBy, setReadyBy] = useState("");

  useEffect(() => {
    setReadyBy(hours > 0 ? formatReadyBy(hours) : "");
  }, [hours]);

  if (hours <= 0 && notes.length === 0) return null;

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
