import { useId, useState } from "react";
import { ArrowUpRight, MessageCircle, X } from "lucide-react";
import { WHATSAPP_LINK } from "@/lib/contact";
import { trackEvent } from "@/lib/analytics";

type Reply = {
  label: string;
  message: string;
  linkLabel: string;
  href: string;
  external?: boolean;
};

const replies: Reply[] = [
  {
    label: "Browse products",
    message: "Explore our current collection of handmade sweets, cakes and gift boxes.",
    linkLabel: "View products",
    href: "/products",
  },
  {
    label: "Delivery information",
    message: "See our delivery areas and the latest delivery information before placing your order.",
    linkLabel: "Delivery details",
    href: "/delivery",
  },
  {
    label: "Track an order",
    message: "Open order tracking to check the latest status of your purchase.",
    linkLabel: "Track my order",
    href: "/history",
  },
  {
    label: "Use a coupon",
    message: "Enter your coupon code at checkout. A valid discount will appear in your order summary before payment.",
    linkLabel: "Browse products",
    href: "/products",
  },
  {
    label: "Contact on WhatsApp",
    message: "Our team can help with a specific question or order on WhatsApp.",
    linkLabel: "Open WhatsApp",
    href: WHATSAPP_LINK,
    external: true,
  },
];

export function ChatWidget({ hasCartItems }: { hasCartItems: boolean }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Reply | null>(null);
  const panelId = useId();

  const toggle = () => {
    setOpen((value) => !value);
    trackEvent("chat_widget_toggle", { action: open ? "close" : "open" });
  };

  return (
    <aside
      className={`fixed left-4 z-50 transition-[bottom] duration-300 sm:left-6 ${hasCartItems ? "bottom-20" : "bottom-5"} sm:bottom-6`}
      aria-label="Zekra customer help"
    >
      {open && (
        <section
          id={panelId}
          role="dialog"
          aria-label="Chat with Zekra Assistant"
          className="absolute bottom-[4.5rem] left-0 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-[1.6rem] border border-gold-soft bg-cream shadow-elegant"
        >
          <header className="flex items-center gap-3 border-b border-gold-soft/70 bg-card px-4 py-3.5">
            <div className="relative shrink-0 rounded-full border border-gold-soft bg-white p-1 shadow-sm">
              <img src="/favicon.png" alt="" className="h-10 w-10 rounded-full object-cover" />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#25a866]" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-base font-bold text-cocoa">Zekra Assistant</h2>
              <p className="text-xs font-semibold text-muted-foreground">Here to help you choose</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-cocoa transition-colors hover:bg-gold-soft/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="max-h-[min(30rem,calc(100vh-10rem))] overflow-y-auto p-4">
            <div className="rounded-2xl rounded-tl-md bg-card px-3.5 py-3 text-sm leading-relaxed text-cocoa shadow-sm ring-1 ring-border">
              Welcome to Zekra Sweets. What can I help you with today?
            </div>

            {selected && (
              <div aria-live="polite" className="mt-3 rounded-2xl rounded-tl-md border border-gold-soft bg-gold-soft/25 px-3.5 py-3 text-sm leading-relaxed text-cocoa">
                <p>{selected.message}</p>
                <a
                  href={selected.href}
                  target={selected.external ? "_blank" : undefined}
                  rel={selected.external ? "noreferrer" : undefined}
                  onClick={() => selected.external && trackEvent("contact_whatsapp", { location: "chat_widget" })}
                  className="mt-2 inline-flex items-center gap-1 font-bold text-caramel underline decoration-gold-soft underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {selected.linkLabel} <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            )}

            <p className="mb-2 mt-4 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-muted-foreground">Quick questions</p>
            <div className="flex flex-wrap gap-2">
              {replies.map((reply) => (
                <button
                  key={reply.label}
                  type="button"
                  onClick={() => setSelected(reply)}
                  aria-pressed={selected?.label === reply.label}
                  className="rounded-xl border border-gold-soft bg-card px-3 py-2 text-left text-xs font-bold text-cocoa transition-colors hover:border-primary hover:bg-gold-soft/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {reply.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={toggle}
        aria-label={open ? "Close Zekra Assistant" : "Open Zekra Assistant"}
        aria-expanded={open}
        aria-controls={panelId}
        className="group relative inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold-soft bg-white p-1 shadow-[0_16px_36px_oklch(0.35_0.06_70_/_0.25)] transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <img src="/favicon.png" alt="" className="h-full w-full rounded-full object-cover" />
        <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-cocoa text-cream shadow-sm" aria-hidden>
          {open ? <X className="h-2.5 w-2.5" /> : <MessageCircle className="h-2.5 w-2.5" />}
        </span>
        <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#25a866]" aria-hidden />
      </button>
    </aside>
  );
}
