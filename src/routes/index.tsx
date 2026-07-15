import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Flame, Leaf, Star, Quote } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import heroImg from "@/assets/hero-cookies.jpg";
import baklawaImg from "@/assets/baklawa.jpg";
import almondImg from "@/assets/almond-cookies.jpg";
import ruskImg from "@/assets/rusk.jpg";
import khaariImg from "@/assets/khaari.jpg";
import interiorImg from "@/assets/bakery-interior.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-hero">
          <div className="grid gap-6 p-6 lg:grid-cols-12 lg:p-10">
            {/* Left: copy */}
            <div className="relative z-10 flex flex-col justify-center lg:col-span-6 lg:pr-6">
              <span className="inline-flex w-fit items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-caramel">
                <Sparkles className="h-3.5 w-3.5" /> Artisan bakery · Ajman, UAE
              </span>
              <h1 className="mt-5 font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                Fresh &amp; Tasty <br />
                <span className="text-gradient-gold">Cookies, Daily.</span>
              </h1>
              <p className="mt-5 max-w-lg text-base text-foreground/75 sm:text-lg">
                Small batches, baked from dawn — buttery, golden, and made from
                scratch with recipes perfected over years. Available until sold out.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
                >
                  Order now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 text-sm font-medium text-foreground hover-lift"
                >
                  Explore availability
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-3">
                {[
                  { k: "9+", v: "Signature recipes" },
                  { k: "100%", v: "Handmade" },
                  { k: "5★", v: "Loved locally" },
                ].map((s) => (
                  <div key={s.v} className="glass rounded-2xl p-4 text-center">
                    <div className="font-display text-2xl text-gradient-gold">{s.k}</div>
                    <div className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: image collage */}
            <div className="relative lg:col-span-6">
              <div className="relative aspect-[4/5] w-full">
                <div className="absolute inset-0 overflow-hidden rounded-[2rem] shadow-elegant">
                  <img
                    src={heroImg}
                    alt="Assorted golden cookies, baklava and pastries on marble"
                    className="h-full w-full object-cover"
                    width={1600}
                    height={1200}
                  />
                </div>
                <div className="absolute -left-4 bottom-8 hidden w-56 rotate-[-6deg] overflow-hidden rounded-2xl shadow-elegant animate-float sm:block">
                  <img src={baklawaImg} alt="Peanut cashew baklawa" loading="lazy" className="h-40 w-full object-cover" width={1200} height={1400} />
                </div>
                <div className="absolute -right-2 -top-4 hidden glass rounded-2xl px-4 py-3 sm:flex items-center gap-3 animate-float" style={{ animationDelay: "-3s" }}>
                  <Flame className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Fresh from oven</div>
                    <div className="font-display text-sm">Baked at dawn today</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Marquee */}
          <div className="border-t border-border/50 bg-cream/40 py-4">
            <div className="flex overflow-hidden">
              <div className="flex shrink-0 animate-marquee gap-12 whitespace-nowrap px-6 font-display text-lg text-caramel/70">
                {Array.from({ length: 2 }).map((_, i) => (
                  <span key={i} className="flex items-center gap-12">
                    <span>Almond Cookies</span><span>·</span>
                    <span>Peanut Baklawa</span><span>·</span>
                    <span>Khaari Puff</span><span>·</span>
                    <span>Fresh Rusk</span><span>·</span>
                    <span>Tutti Frutti</span><span>·</span>
                    <span>Chocolate</span><span>·</span>
                    <span>Jeera Cookies</span><span>·</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FRESHLY BAKED */}
      <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6" data-reveal>
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-caramel">Freshly baked</span>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">Small batches, <span className="text-gradient-gold">baked from dawn</span></h2>
          </div>
          <Link to="/products" className="text-sm font-medium text-primary story-link">Explore availability →</Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { img: almondImg, name: "Almond Cookies", tag: "Buttery · Crisp" },
            { img: ruskImg, name: "Rusk (Toast)", tag: "Tea-time classic" },
            { img: khaariImg, name: "Khaari (Puff)", tag: "Flaky · Golden" },
          ].map((p, i) => (
            <article
              key={p.name}
              data-reveal
              style={{ transitionDelay: `${i * 90}ms` }}
              className="group relative overflow-hidden rounded-3xl glass hover-lift"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-x-4 bottom-4 glass rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-caramel">{p.tag}</div>
                    <div className="mt-1 font-display text-xl">{p.name}</div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="mx-auto mt-28 max-w-7xl px-4 sm:px-6">
        <div className="glass grid gap-10 rounded-3xl p-8 md:p-14 lg:grid-cols-2" data-reveal>
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-caramel">Our story</span>
            <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              It's not about walls. <br /> <span className="text-gradient-gold">It's about people.</span>
            </h2>
          </div>
          <div className="text-foreground/80">
            <p>
              At Zekra Sweets, we believe great desserts start with great
              ingredients and genuine care. Each treat is made fresh, from
              scratch, with recipes perfected over years.
            </p>
            <p className="mt-4">
              Whether it's a delicate pastry, a rich chocolate creation, or a
              custom cake for your special day — every bite tells a story of
              passion and precision.
            </p>
            <Link to="/about" className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow">
              Join our Community <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* MONTH'S FAVORITE */}
      <section className="mx-auto mt-28 max-w-7xl px-4 sm:px-6" data-reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] grain-overlay">
          <img src={baklawaImg} alt="Peanut cashew baklawa" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-cocoa/85 via-cocoa/60 to-transparent" />
          <div className="relative grid gap-8 p-8 md:p-16 lg:grid-cols-2">
            <div className="text-cream">
              <span className="text-xs uppercase tracking-[0.3em] text-gold-soft">This month's favorite</span>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl">Peanut Cashew <span className="text-gradient-gold">Baklawa</span></h2>
              <p className="mt-5 max-w-xl text-cream/85">
                Crispy, golden layers of phyllo dough filled with roasted peanuts
                and cashews, drizzled with honey and warm spices. A perfect
                balance of crunch, sweetness, and richness in every bite.
              </p>
              <div className="mt-6 inline-flex items-center gap-3 rounded-full glass-dark px-4 py-2 text-sm text-cream">
                <Flame className="h-4 w-4 text-gold" /> Calories: ~280–320 kcal
              </div>
              <div className="mt-8">
                <Link to="/products" className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-glow hover:scale-105 transition-transform">
                  Order Yours <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto mt-28 max-w-7xl px-4 sm:px-6">
        <div className="text-center" data-reveal>
          <span className="text-xs uppercase tracking-[0.3em] text-caramel">Testimonials</span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">Loved by the people <br /> we <span className="text-gradient-gold">bake for.</span></h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            "Absolutely loved the freshness and taste! The cookies were perfectly baked, the rusk was super crunchy, and the puffs were delicious. Will definitely order again!",
            "Everything we ordered was fresh and full of flavor. The sweets were just the right amount of sweet, and the cookies were a big hit with my family.",
            "From ordering to delivery, the experience was smooth and professional. The cookies were melt-in-the-mouth. This is now my go-to bakery!",
          ].map((t, i) => (
            <div key={i} data-reveal style={{ transitionDelay: `${i * 90}ms` }} className="glass rounded-3xl p-7 hover-lift">
              <Quote className="h-8 w-8 text-primary/50" />
              <p className="mt-4 text-foreground/85">{t}</p>
              <div className="mt-5 flex items-center gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY CTA */}
      <section className="mx-auto mt-28 max-w-7xl px-4 sm:px-6" data-reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] shadow-elegant">
          <img src={interiorImg} alt="Warm bakery interior" loading="lazy" className="h-[520px] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-cocoa/85 via-cocoa/30 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="p-8 md:p-16 text-cream max-w-2xl">
              <span className="text-xs uppercase tracking-[0.3em] text-gold-soft">Bring Freshness Home</span>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl">From our oven <br /> to <span className="text-gradient-gold">your table.</span></h2>
              <p className="mt-4 text-cream/85">Enjoy fresh, handmade pastries that make every morning a little sweeter.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/products" className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-glow hover:scale-105 transition-transform">
                  Order Now <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/gallery" className="inline-flex items-center gap-2 rounded-full glass-dark px-6 py-3.5 text-sm font-medium text-cream">
                  See the Gallery
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="mx-auto mt-28 max-w-7xl px-4 sm:px-6" data-reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { i: Leaf, t: "Locally sourced", d: "Ingredients from within 50 km of our kitchen." },
            { i: Flame, t: "Natural process", d: "No preservatives — just flour, water, salt and skill." },
            { i: Sparkles, t: "Zero waste", d: "Unsold items go to shelters at closing time." },
            { i: Star, t: "Sustainable", d: "Compostable bags, recyclable containers." },
          ].map((p, i) => (
            <div key={p.t} data-reveal style={{ transitionDelay: `${i * 80}ms` }} className="glass rounded-3xl p-6 hover-lift">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-gold text-primary-foreground shadow-glow">
                <p.i className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-xl">{p.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
