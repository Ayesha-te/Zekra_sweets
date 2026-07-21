import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Phone, Mail, ArrowRight } from "lucide-react";
import craftImg from "@/assets/craft.jpg";
import { useState } from "react";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://zekrasweets.com/careers" },
      { property: "og:image", content: "https://zekrasweets.com/favicon.png" },
      { property: "og:site_name", content: "Zekra Sweets" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Careers - Zekra Sweets" },
      {
        name: "twitter:description",
        content: "Apply to join the Zekra Sweets bakery team in Ajman.",
      },
      { name: "twitter:image", content: "https://zekrasweets.com/favicon.png" },
      { title: "Careers — Join the Zekra Sweets Team" },
      {
        name: "description",
        content:
          "Grow with Zekra Sweets. We're recruiting driven, reliable people who believe in delivering the best to our customers.",
      },
      { property: "og:title", content: "Careers — Zekra Sweets" },
      { property: "og:description", content: "Apply to join our bakery team in Ajman, UAE." },
    ],
    links: [{ rel: "canonical", href: "https://zekrasweets.com/careers" }],
  }),
  component: Careers,
});

function Careers() {
  const [position, setPosition] = useState<"Salesman" | "Driver">("Salesman");
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="glass grid gap-8 rounded-[2.5rem] p-8 md:p-14 lg:grid-cols-2" data-reveal>
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-caramel">Careers</span>
            <h1 className="mt-3 font-display text-5xl sm:text-6xl leading-[0.95]">
              Join the <span className="text-gradient-gold">Zekra team.</span>
            </h1>
            <p className="mt-5 text-foreground/80">
              We're building our dream team at Zekra Sweets, and we need people like you. If you're
              driven, reliable, and believe in delivering the best to our customers — this is your
              opportunity. Don't just work here. Grow here.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-elegant">
            <img
              src={craftImg}
              alt="Baker at work"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              t: "Life at Zekra Sweets",
              d: "Our bakery is a place where creativity meets craftsmanship — every day brings the comforting aroma of fresh bakes and the satisfaction of making people smile.",
            },
            {
              t: "Grow With Us",
              d: "Looking for a role where your efforts truly matter? We're actively recruiting talented individuals who align with our values. Submit your application and let's talk.",
            },
          ].map((c, i) => (
            <div
              key={c.t}
              data-reveal
              style={{ transitionDelay: `${i * 100}ms` }}
              className="glass rounded-3xl p-8 hover-lift"
            >
              <h3 className="font-display text-2xl text-primary">{c.t}</h3>
              <p className="mt-3 text-foreground/80">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6" data-reveal>
        <div className="glass rounded-[2.5rem] p-8 md:p-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl">Join our team</h2>
              <p className="mt-3 text-foreground/75 text-sm">
                Tell us a bit about yourself and the role you're interested in. We'll review and get
                back to you soon.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-gold text-primary-foreground shadow-glow">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-caramel">Phone</div>
                    <div className="text-sm">+971 55 608 6529</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-gold text-primary-foreground shadow-glow">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-caramel">Email</div>
                    <div className="text-sm">zekrasweetsllc@gmail.com</div>
                  </div>
                </div>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thanks! We'll be in touch.");
              }}
              className="grid gap-4 sm:grid-cols-2"
            >
              <Field label="Name" name="firstName" />
              <Field label="Last name" name="lastName" />
              <Field label="Email" name="email" type="email" className="sm:col-span-2" />
              <div className="sm:col-span-2">
                <label className="text-xs uppercase tracking-widest text-caramel">Message</label>
                <textarea
                  required
                  rows={4}
                  className="mt-2 w-full rounded-2xl border border-border bg-cream/60 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs uppercase tracking-widest text-caramel">
                  Position you're applying for
                </label>
                <div className="mt-3 flex gap-3">
                  {(["Salesman", "Driver"] as const).map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPosition(p)}
                      className={`rounded-full px-5 py-2.5 text-sm transition-all ${position === p ? "bg-gradient-gold text-primary-foreground shadow-glow" : "glass text-foreground/80"}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="sm:col-span-2 mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-glow hover:scale-[1.02] transition-transform"
              >
                Submit application <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
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
