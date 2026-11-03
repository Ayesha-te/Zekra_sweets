import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { DIWALI_OFFER_END_LABEL, FREE_DELIVERY_MINIMUM, isDiwaliOfferActive } from "@/lib/cart";

import promoImage from "@/assets/diwali-offer-poster.jpg";

const PROMO_SEEN_KEY = "zekra_promo_seen_diwali";

export function PromoPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isDiwaliOfferActive()) return;
    let alreadySeen = false;
    try {
      alreadySeen = window.sessionStorage.getItem(PROMO_SEEN_KEY) === "1";
    } catch {
      alreadySeen = false;
    }

    if (alreadySeen) return;

    const timeout = window.setTimeout(() => {
      setOpen(true);
      try {
        window.sessionStorage.setItem(PROMO_SEEN_KEY, "1");
      } catch {
        // sessionStorage unavailable (private browsing) - popup may reappear on next page, which is acceptable.
      }
    }, 350);
    return () => window.clearTimeout(timeout);
  }, []);

  const close = () => {
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] grid place-items-center bg-cocoa/55 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delivery-promo-title"
    >
      <div className="relative grid max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-[2rem] bg-cream shadow-elegant md:grid-cols-[0.95fr_1.05fr]">
        <button
          type="button"
          onClick={close}
          aria-label="Close promotion"
          className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-cocoa/85 text-cream shadow-glass transition hover:bg-cocoa focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="bg-cocoa p-3">
          <img
            src={promoImage}
            alt="Zekra Sweets Diwali offer: Buy 1, Get 1 Free on every product, valid till Monday 9th November"
            className="h-full max-h-[74vh] w-full rounded-[1.4rem] object-contain"
          />
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-8">
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-caramel">
            Limited-time Diwali offer
          </span>
          <h2 id="delivery-promo-title" className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
            Buy 1, Get 1 Free on every product.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-foreground/75">
            Valid till {DIWALI_OFFER_END_LABEL}. Pick any product, choose the quantity, and the same
            quantity comes free. Free delivery on orders of AED {FREE_DELIVERY_MINIMUM}+ in Ajman,
            Dubai and Sharjah.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/diwali-offer"
              onClick={close}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-gold px-6 text-sm font-bold text-primary-foreground shadow-glow"
            >
              Shop the Diwali offer
            </Link>
            <button
              type="button"
              onClick={close}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-gold-soft/70 px-6 text-sm font-bold text-foreground hover:bg-secondary"
            >
              Continue browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
