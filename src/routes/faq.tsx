import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { StructuredData } from "@/components/seo/StructuredData";
import { SiteLayout } from "@/components/site/SiteLayout";
import { FAQ_ITEMS } from "@/lib/content";
import { buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/faq")({
  head: () =>
    buildSeoHead({
      title: "Frequently Asked Questions | Zekra Sweets",
      description:
        "Answers about contacting Zekra Sweets, browsing available products, sizes, delivery and pickup.",
      path: "/faq",
    }),
  component: FaqPage,
});

function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  return (
    <SiteLayout>
      <StructuredData data={jsonLd} />
      <section className="mx-auto max-w-4xl px-4 sm:px-6">
        <header className="border-b border-gold-soft/60 pb-8" data-reveal>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-caramel">
            Helpful details
          </p>
          <h1 className="mt-3 font-display text-5xl sm:text-6xl">Frequently asked questions</h1>
          <p className="mt-4 max-w-2xl text-foreground/70">
            Clear answers based on the ordering options currently available on this website.
          </p>
        </header>
        <div className="mt-8 space-y-3">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-gold-soft/50 bg-cream/70 p-5 shadow-glass"
            >
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-display text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35">
                {item.question}
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-caramel transition-transform group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <p className="max-w-2xl pt-3 text-sm leading-7 text-foreground/75">{item.answer}</p>
            </details>
          ))}
        </div>
        <p className="mt-8 text-sm text-foreground/70">
          Need help with something else?{" "}
          <Link to="/contact" className="font-bold text-primary underline underline-offset-4">
            Contact the bakery
          </Link>
          .
        </p>
      </section>
    </SiteLayout>
  );
}
