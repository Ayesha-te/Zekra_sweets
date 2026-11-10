import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

const PROMO_SEEN_KEY = "zekra_promo_seen_welcome";

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
      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-cream p-7 text-center shadow-elegant sm:p-9">
        <button
          type="button"
          onClick={close}
          aria-label="Close promotion"
          className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-cocoa/85 text-cream shadow-glass transition hover:bg-cocoa focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
        >
          <X className="h-5 w-5" />
        </button>
        <span className="text-xs font-bold uppercase tracking-[0.24em] text-caramel">New here? 100% Eggless</span>
        <h2 id="welcome-promo-title" className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
          50% off your first order
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-foreground/75">
          Up to AED 100 off. No code needed - the discount is applied automatically at checkout when you order with your mobile number.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            to="/products"
            onClick={close}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-gradient-gold px-6 text-sm font-bold text-primary-foreground shadow-glow"
          >
            Shop now
          </Link>
          <Link
            to="/welcome-back"
            onClick={close}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-gold-soft/70 px-6 text-sm font-bold text-foreground hover:bg-secondary"
          >
            Ordered before? Unlock your offer
          </Link>
        </div>
      </div>
    </div>
  );
}
