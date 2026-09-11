import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, Clock3 } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/return-policy")({
  head: () =>
    buildSeoHead({
      title: "Return & Refund Policy | Zekra Sweets",
      description:
        "Read Zekra Sweets' return and refund policy for food products, damaged orders, incorrect items and quality concerns.",
      path: "/return-policy",
    }),
  component: ReturnPolicyPage,
});

function ReturnPolicyPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <header className="border-b border-gold-soft/60 pb-8" data-reveal>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-caramel">Customer care</p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl leading-tight sm:text-6xl">
            Return &amp; refund policy
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/70">
            We want every Zekra Sweets order to arrive fresh, correct and ready to enjoy.
          </p>
        </header>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            [AlertCircle, "Food products", "Because our products are perishable, they cannot be returned or exchanged."],
            [Clock3, "Contact us promptly", "Tell us about an issue as soon as possible after your order arrives."],
            [CheckCircle2, "Fair resolution", "We will review the details and provide an appropriate replacement or refund when applicable."],
          ].map(([Icon, title, text]) => (
            <div key={title as string} className="rounded-2xl border border-gold-soft/50 bg-cream/70 p-5 shadow-glass" data-reveal>
              <Icon className="h-6 w-6 text-caramel" aria-hidden />
              <h2 className="mt-4 font-display text-xl">{title as string}</h2>
              <p className="mt-2 text-sm leading-6 text-foreground/70">{text as string}</p>
            </div>
          ))}
        </div>

        <article className="mt-8 rounded-[2rem] border border-gold-soft/50 bg-cream/70 p-6 shadow-glass sm:p-9" data-reveal>
          <h2 className="font-display text-3xl">When can an order be reviewed?</h2>
          <p className="mt-4 leading-7 text-foreground/80">
            Food products are not eligible for return or exchange due to their perishable nature. If your order arrives damaged, defective, incorrect, or has a quality issue, please contact Zekra Sweets promptly with your order details and clear photos of the issue.
          </p>
          <p className="mt-4 leading-7 text-foreground/80">
            We will review the information and, where appropriate, arrange a replacement or issue a refund for the affected item. Resolution may depend on the nature of the issue and the information provided.
          </p>

          <h2 className="mt-8 font-display text-3xl">How to contact us</h2>
          <p className="mt-4 leading-7 text-foreground/80">
            Please include your order number, the name used for the order, a short description of the issue, and photos where relevant.
          </p>
          <Link to="/contact" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-gradient-gold px-5 text-sm font-bold text-primary-foreground shadow-glow">
            Contact Zekra Sweets
          </Link>
        </article>
      </section>
    </SiteLayout>
  );
}
