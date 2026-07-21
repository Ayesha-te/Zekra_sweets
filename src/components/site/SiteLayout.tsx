import type { ReactNode } from "react";
import { MessageCircle } from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useReveal } from "@/hooks/use-reveal";
import { BUSINESS_PHONE_DISPLAY, WHATSAPP_LINK } from "@/lib/contact";

export function SiteLayout({ children }: { children: ReactNode }) {
  useReveal();
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-hero opacity-70" />
      </div>
      <Header />
      <main className="pt-32 sm:pt-36">{children}</main>
      <Footer />
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noreferrer"
        aria-label={`Chat with Zekra Sweets on WhatsApp at ${BUSINESS_PHONE_DISPLAY}`}
        className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center gap-2 rounded-full bg-[#25D366] text-white shadow-[0_16px_36px_oklch(0.45_0.16_145_/_0.38)] transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366] sm:bottom-6 sm:right-6 sm:w-auto sm:px-5"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="hidden text-sm font-semibold sm:inline">WhatsApp</span>
      </a>
    </div>
  );
}
