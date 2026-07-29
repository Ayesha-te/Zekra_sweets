import type { ReactNode } from "react";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useReveal } from "@/hooks/use-reveal";
import { BUSINESS_PHONE_DISPLAY, WHATSAPP_LINK } from "@/lib/contact";
import { formatMoney, useCart } from "@/lib/cart";
import { trackEvent } from "@/lib/analytics";

export function SiteLayout({ children }: { children: ReactNode }) {
  useReveal();
  const cart = useCart();
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-cocoa px-4 py-3 font-bold text-cream transition-transform focus:translate-y-0"
      >
        Skip to main content
      </a>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-hero opacity-70" />
      </div>
      <Header />
      <main id="main-content" tabIndex={-1} className="pb-24 pt-32 outline-none sm:pb-0 sm:pt-36">
        {children}
      </main>
      <Footer />
      {cart.count > 0 && (
        <Link
          to="/cart"
          aria-label={`Open bag with ${cart.count} ${cart.count === 1 ? "item" : "items"}, subtotal ${formatMoney(cart.subtotal)}`}
          className="fixed bottom-4 left-4 right-20 z-40 flex min-h-12 items-center justify-between rounded-2xl bg-cocoa px-4 text-sm font-bold text-cream shadow-elegant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:hidden"
        >
          <span className="inline-flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-gold-soft" /> Bag ({cart.count})
          </span>
          <span>{formatMoney(cart.subtotal)}</span>
        </Link>
      )}
      <a
        href={WHATSAPP_LINK}
        onClick={() => trackEvent("contact_whatsapp", { location: "floating_button" })}
        target="_blank"
        rel="noreferrer"
        aria-label={`Chat with Zekra Sweets on WhatsApp at ${BUSINESS_PHONE_DISPLAY}`}
        className={`fixed right-5 z-50 inline-flex h-14 w-14 items-center justify-center gap-2 rounded-full bg-[#25D366] text-white shadow-[0_16px_36px_oklch(0.45_0.16_145_/_0.38)] transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366] sm:bottom-6 sm:right-6 sm:w-auto sm:px-5 ${cart.count > 0 ? "bottom-20" : "bottom-5"}`}
      >
        <MessageCircle className="h-5 w-5" />
        <span className="hidden text-sm font-semibold sm:inline">WhatsApp</span>
      </a>
    </div>
  );
}
