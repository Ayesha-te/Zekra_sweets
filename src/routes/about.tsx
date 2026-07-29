import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import craftImg from "@/assets/craft.jpg";
import interiorImg from "@/assets/bakery-interior.jpg";
import { SiteLayout } from "@/components/site/SiteLayout";
import { buildSeoHead } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () =>
    buildSeoHead({
      title: "About Zekra Sweets - Our Story",
      description: "Discover the story behind Zekra Sweets in Ajman.",
      path: "/about",
    }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className="glass grid gap-6 overflow-hidden rounded-[2rem] p-7 sm:p-9 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)] lg:items-end lg:p-14"
          data-reveal
        >
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-caramel">About Zekra</span>
            <h1 className="mt-3 max-w-3xl font-display text-4xl leading-[1.02] sm:text-5xl lg:text-6xl">
              Moments of joy, <span className="text-gradient-gold">shared together.</span>
            </h1>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-foreground/80 sm:text-lg lg:justify-self-end">
            Cookies, rusks and sweets can hold memories of home, family tables and time spent
            together. That feeling sits at the heart of Zekra Sweets.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-7xl px-4 sm:mt-20 sm:px-6">
        <div className="grid gap-7 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div className="overflow-hidden rounded-[2rem] shadow-elegant" data-reveal>
            <img
              src={craftImg}
              alt="Preparing bakery dough"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover lg:aspect-[5/4]"
            />
          </div>
          <div data-reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-caramel">Our bakery</span>
            <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              A welcoming counter in <span className="text-gradient-gold">Ajman.</span>
            </h2>
            <p className="mt-5 leading-relaxed text-foreground/80">
              Zekra Sweets grew from a love of sharing cookies, rusks and sweets with the community.
              That spirit still shapes how the bakery welcomes customers today.
            </p>
            <p className="mt-4 leading-relaxed text-foreground/80">
              The online shop is a simple extension of the bakery counter: a place to browse the
              current selection, compare available sizes and prepare an order.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:mt-20 sm:px-6" data-reveal>
        <div className="relative overflow-hidden rounded-[2rem] shadow-elegant">
          <img
            src={interiorImg}
            alt="Zekra Sweets bakery interior"
            loading="lazy"
            className="h-[380px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cocoa/90 via-cocoa/65 to-cocoa/10" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-xl p-7 text-cream sm:p-12">
              <h2 className="font-display text-4xl sm:text-5xl">Browse the current selection</h2>
              <p className="mt-3 text-cream/85">
                See the products and sizes currently available online.
              </p>
              <Link
                to="/products"
                className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-gradient-gold px-6 text-sm font-bold text-primary-foreground shadow-glow"
              >
                View products <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
