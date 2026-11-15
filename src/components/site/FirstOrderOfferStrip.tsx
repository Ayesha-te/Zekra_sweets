import { Sparkles } from "lucide-react";

// Always-visible reminder of the new-customer offer, so shoppers arriving from ads
// know the 50% discount is real even though product prices show the full amount.
export function FirstOrderOfferStrip({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border border-gold-soft/70 bg-gradient-gold px-4 py-3 text-primary-foreground shadow-glow sm:items-center sm:px-5 ${className}`}
      role="note"
    >
      <Sparkles className="mt-0.5 h-5 w-5 shrink-0 sm:mt-0" aria-hidden />
      <p className="text-sm leading-snug">
        <span className="font-bold">New customer? 50% off your first order</span> (up to AED 100).
        <span className="block sm:inline"> No code needed - applied automatically at checkout.</span>
      </p>
    </div>
  );
}
