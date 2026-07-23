import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock3, Mail, MapPin, Phone, Send, ShoppingBag } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import {
  BUSINESS_EMAIL,
  BUSINESS_EMAIL_LINK,
  BUSINESS_PHONE_DISPLAY,
  BUSINESS_PHONE_LINK,
  WHATSAPP_LINK,
} from "@/lib/contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://zekrasweets.com/contact" },
      { property: "og:image", content: "https://zekrasweets.com/favicon.png" },
      { property: "og:site_name", content: "Zekra Sweets" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Contact Zekra Sweets" },
      {
        name: "twitter:description",
        content: "Contact Zekra Sweets by phone, email, WhatsApp, or by visiting our Ajman bakery.",
      },
      { name: "twitter:image", content: "https://zekrasweets.com/favicon.png" },
      { title: "Contact - Zekra Sweets | Ajman Bakery" },
      {
        name: "description",
        content:
          "Get in touch with Zekra Sweets by phone, email, WhatsApp, or by visiting our Ajman bakery.",
      },
      { property: "og:title", content: "Contact Zekra Sweets" },
      { property: "og:description", content: "Reach us by phone, email, WhatsApp, or in Ajman." },
    ],
    links: [{ rel: "canonical", href: "https://zekrasweets.com/contact" }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="glass rounded-[2.5rem] p-8 text-center md:p-14" data-reveal>
          <span className="text-xs uppercase tracking-[0.3em] text-caramel">Contact us</span>
          <h1 className="mt-3 font-display text-5xl sm:text-6xl">
            Say <span className="text-gradient-gold">hello.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-foreground/75">
            Questions, custom boxes, pickup details, or delivery help. Reach the bakery directly and
            we will be happy to help.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-7xl px-4 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="glass rounded-3xl p-8" data-reveal>
            <h2 className="font-display text-2xl">Reach us</h2>
            <div className="mt-6 space-y-5">
              {[
                { i: Phone, l: "Phone", v: BUSINESS_PHONE_DISPLAY, href: BUSINESS_PHONE_LINK },
                { i: Mail, l: "Email", v: BUSINESS_EMAIL, href: BUSINESS_EMAIL_LINK },
                { i: MapPin, l: "Visit", v: "Al Zaher Street, Rumaila 2, Ajman, UAE" },
              ].map((c) => (
                <div key={c.l} className="flex items-start gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-gold text-primary-foreground shadow-glow">
                    <c.i className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-caramel">{c.l}</div>
                    {c.href ? (
                      <a
                        href={c.href}
                        className="mt-1 inline-flex text-sm text-foreground/85 transition-colors hover:text-primary"
                      >
                        {c.v}
                      </a>
                    ) : (
                      <div className="mt-1 text-sm text-foreground/85">{c.v}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-gradient-warm p-5">
              <div className="text-xs uppercase tracking-widest text-caramel">Opening hours</div>
              <div className="mt-2 text-sm text-foreground/80">
                Saturday - Thursday, 8 AM to 10 PM
              </div>
              <div className="text-sm text-foreground/80">Friday, 2 PM to 10 PM</div>
            </div>
          </div>

          <div className="glass rounded-3xl p-8" data-reveal style={{ transitionDelay: "80ms" }}>
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cocoa text-cream shadow-glass">
                <Clock3 className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-caramel">
                  Quick contact
                </div>
                <h2 className="font-display text-2xl">Talk to the bakery team</h2>
              </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-foreground/75">
              For fastest replies, call or message us on WhatsApp during bakery hours. For product
              browsing and checkout, start an online order anytime.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold px-5 py-3 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
              >
                <Send className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href={BUSINESS_PHONE_LINK}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gold-soft/60 bg-cream/70 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                <Phone className="h-4 w-4 text-primary" />
                Call now
              </a>
              <a
                href={BUSINESS_EMAIL_LINK}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gold-soft/60 bg-cream/70 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                <Mail className="h-4 w-4 text-primary" />
                Email us
              </a>
              <Link
                to="/order"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gold-soft/60 bg-cream/70 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                <ShoppingBag className="h-4 w-4 text-primary" />
                Order online
              </Link>
            </div>

            <div className="mt-7 rounded-2xl border border-gold-soft/55 bg-cream/60 p-5">
              <div className="text-xs uppercase tracking-widest text-caramel">Bakery address</div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                Al Zaher Street, Rumaila 2, Ajman, UAE
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
