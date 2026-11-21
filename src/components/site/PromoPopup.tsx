import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

const PROMO_SEEN_KEY = "zekra_promo_seen_national_day";

export function PromoPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
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
      aria-labelledby="welcome-promo-title"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-cream shadow-elegant">
        <button
          type="button"
          onClick={close}
          aria-label="Close promotion"
          className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-cocoa/85 text-cream shadow-glass transition hover:bg-cocoa focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
        >
          <X className="h-5 w-5" />
        </button>
        <img
          src="/national-day-offer.png"
          alt="UAE National Day Special Offer - Buy 1 Get 1 Free till 6th December"
          className="w-full rounded-t-[2rem] object-cover"
        />
        <div className="p-5 text-center sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-caramel">🗓 Valid till 6th December 2026</p>
          <h2 id="welcome-promo-title" className="mt-2 font-display text-2xl leading-tight">
            No code needed — added automatically
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            <Link
              to="/welcome-back"
              onClick={close}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-gold px-6 text-sm font-bold text-primary-foreground shadow-glow"
            >
              Shop the offer
            </Link>
            <Link
              to="/products"
              onClick={close}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-gold-soft/70 px-6 text-sm font-bold text-foreground hover:bg-secondary"
            >
              View all products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
