import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";

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
        content: "Contact Zekra Sweets by phone, email or the website form.",
      },
      { name: "twitter:image", content: "https://zekrasweets.com/favicon.png" },
      { title: "Contact — Zekra Sweets | Ajman Bakery" },
      {
        name: "description",
        content:
          "Get in touch with Zekra Sweets. Questions, orders, or a warm hello — we'd love to hear from you.",
      },
      { property: "og:title", content: "Contact Zekra Sweets" },
      { property: "og:description", content: "Reach us by phone, email, or our contact form." },
    ],
    links: [{ rel: "canonical", href: "https://zekrasweets.com/contact" }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="glass rounded-[2.5rem] p-8 md:p-14 text-center" data-reveal>
          <span className="text-xs uppercase tracking-[0.3em] text-caramel">Contact us</span>
          <h1 className="mt-3 font-display text-5xl sm:text-6xl">
            Say <span className="text-gradient-gold">hello.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-foreground/75">
            Feel free to contact us with any questions or concerns. Use the form below or email us
            directly — we look forward to hearing from you.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-7xl px-4 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="glass rounded-3xl p-8" data-reveal>
            <h2 className="font-display text-2xl">Reach us</h2>
            <div className="mt-6 space-y-5">
              {[
                { i: Phone, l: "Phone", v: "+971 55 608 6529" },
                { i: Mail, l: "Email", v: "zekrasweetsllc@gmail.com" },
                { i: MapPin, l: "Visit", v: "Al Zaher Street, Rumaila 2, Ajman, UAE" },
              ].map((c) => (
                <div key={c.l} className="flex items-start gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-gold text-primary-foreground shadow-glow">
                    <c.i className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-caramel">{c.l}</div>
                    <div className="mt-1 text-sm text-foreground/85">{c.v}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-gradient-warm p-5">
              <div className="text-xs uppercase tracking-widest text-caramel">Opening hours</div>
              <div className="mt-2 text-sm text-foreground/80">
                Saturday — Thursday · 8 AM to 10 PM
              </div>
              <div className="text-sm text-foreground/80">Friday · 2 PM to 10 PM</div>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thanks! We'll be in touch.");
            }}
            className="glass grid gap-4 rounded-3xl p-8 sm:grid-cols-2"
            data-reveal
            style={{ transitionDelay: "80ms" }}
          >
            <Field label="Name" name="firstName" />
            <Field label="Last name" name="lastName" />
            <Field label="Email" name="email" type="email" className="sm:col-span-2" />
            <div className="sm:col-span-2">
              <label className="text-xs uppercase tracking-widest text-caramel">Message</label>
              <textarea
                required
                rows={6}
                placeholder="Share your thoughts or ideas about Zekra Sweets…"
                className="mt-2 w-full rounded-2xl border border-border bg-cream/60 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              type="submit"
              className="sm:col-span-2 mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-glow hover:scale-[1.02] transition-transform"
            >
              Submit <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({
  label,
  name,
  type = "text",
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="text-xs uppercase tracking-widest text-caramel">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        className="mt-2 w-full rounded-full border border-border bg-cream/60 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
