import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import craftImg from "@/assets/craft.jpg";
import interiorImg from "@/assets/bakery-interior.jpg";
import { Leaf, Flame, Sparkles, Star, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Zekra Sweets — Our Story, Craft & Values" },
      { name: "description", content: "From a small kitchen window in Ajman to a beloved artisan bakery. Discover the story, the craft and the values behind Zekra Sweets." },
      { property: "og:title", content: "About Zekra Sweets — Our Story" },
      { property: "og:description", content: "Locally sourced. Naturally made. Handmade with love." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="glass grid gap-8 rounded-[2.5rem] p-8 md:p-14 lg:grid-cols-2" data-reveal>
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-caramel">About Zekra</span>
            <h1 className="mt-3 font-display text-5xl leading-[0.95] sm:text-6xl">Moments of joy, <span className="text-gradient-gold">baked with love.</span></h1>
          </div>
          <p className="self-end text-lg text-foreground/80">
            We believe that our cookies, rusks, and sweets aren't just treats —
            they're moments of joy, comfort, and the taste of home. Every bite
            carries that story forward.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative overflow-hidden rounded-[2rem] shadow-elegant" data-reveal>
            <img src={craftImg} alt="Baker kneading dough" loading="lazy" className="h-[520px] w-full object-cover" />
          </div>
          <div data-reveal>
            <h2 className="font-display text-4xl sm:text-5xl">It all began with <span className="text-gradient-gold">homemade sweets.</span></h2>
            <p className="mt-5 text-foreground/80">
              Years ago, our founder started crafting delicious cookies, rusks
              and sweets from a small kitchen window. Neighbors were drawn in by
              the irresistible aroma, then kept coming back for the authentic
              taste — and before long, that humble window became Zekra Sweets.
            </p>
            <p className="mt-4 text-foreground/80">
              Today, Zekra Sweets carries forward that same passion:
              locally-sourced ingredients, warm hospitality, and every cookie,
              rusk, and sweet handmade with love and care — not machines.
            </p>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="mx-auto mt-28 max-w-7xl px-4 sm:px-6" data-reveal>
        <div className="text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-caramel">The beauty of patience</span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">Our craft <span className="text-gradient-gold">is slow.</span></h2>
          <p className="mx-auto mt-4 max-w-xl text-foreground/75">It honors time, tradition, and care.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { n: "01", t: "Mix", d: "Flour, water, salt, and patience." },
            { n: "02", t: "Fold", d: "Countless layers built by hand." },
            { n: "03", t: "Bake", d: "Golden perfection, one tray at a time." },
          ].map((s, i) => (
            <div key={s.n} data-reveal style={{ transitionDelay: `${i * 100}ms` }} className="glass relative overflow-hidden rounded-3xl p-8 hover-lift">
              <div className="absolute -right-4 -top-6 font-display text-[7rem] leading-none text-gold-soft/40">{s.n}</div>
              <div className="relative">
                <h3 className="font-display text-3xl text-primary">{s.t}</h3>
                <p className="mt-3 text-foreground/75">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto mt-28 max-w-7xl px-4 sm:px-6" data-reveal>
        <div className="text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-caramel">What we stand for</span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">Four pillars <span className="text-gradient-gold">that guide us.</span></h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { i: Leaf, t: "Locally sourced", d: "Every ingredient starts within 50 kilometers of our kitchen." },
            { i: Flame, t: "Natural process", d: "No preservatives — just flour, water, salt and skill." },
            { i: Sparkles, t: "Zero waste", d: "Unsold items go to shelters. Nothing should be wasted." },
            { i: Star, t: "Sustainable packaging", d: "Compostable wrappers, recyclable containers." },
          ].map((p, i) => (
            <div key={p.t} data-reveal style={{ transitionDelay: `${i * 90}ms` }} className="glass rounded-3xl p-6 hover-lift">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-gold text-primary-foreground shadow-glow">
                <p.i className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-xl">{p.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-28 max-w-7xl px-4 sm:px-6" data-reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] shadow-elegant">
          <img src={interiorImg} alt="Zekra bakery interior" loading="lazy" className="h-[420px] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-cocoa/85 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-xl p-8 md:p-14 text-cream">
              <h2 className="font-display text-4xl sm:text-5xl">Bring Freshness Home</h2>
              <p className="mt-3 text-cream/85">From our oven to your table — every morning, a little sweeter.</p>
              <Link to="/products" className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-glow">
                Pre-Order Now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}