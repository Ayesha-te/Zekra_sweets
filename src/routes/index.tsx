import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock3,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import heroVideo from "@/assets/bg-hero.mp4";
import heroPoster from "@/assets/bg-hero-poster.jpg";
import interiorImg from "@/assets/bakery-interior.jpg";
import craftImg from "@/assets/craft.jpg";
import ruskImg from "@/assets/rusk.jpg";
import { ProductCard } from "@/components/products/ProductCard";
import { SiteLayout } from "@/components/site/SiteLayout";
import { assetUrl, productImageError } from "@/lib/api";
import { WHATSAPP_LINK } from "@/lib/contact";
import { loadProducts } from "@/lib/products";
import { buildSeoHead, productSlug } from "@/lib/seo";

export const Route = createFileRoute("/")({
  loader: () => loadProducts(),
  head: () =>
    buildSeoHead({
      title: "Zekra Sweets - Artisan Bakery in Ajman, UAE",
      description:
        "Explore the current selection of cookies, rusks and pastries from Zekra Sweets in Ajman.",
      path: "/",
      image: heroPoster,
    }),
  component: Home,
});

function Home() {
  const products = Route.useLoaderData();
  const featured = products.filter((product) => product.tag).slice(0, 4);
  const selection = (featured.length ? featured : products).slice(0, 4);
  const categories = Array.from(new Set(products.map((product) => product.category)))
    .map((category) => ({
      category,
      product: products.find((item) => item.category === category)!,
    }))
    .slice(0, 4);

  return (
    <SiteLayout>
      <section className="relative mx-auto max-w-[1600px] px-3 sm:px-5">
        <div className="relative flex min-h-[clamp(540px,calc(100svh-8rem),780px)] overflow-hidden rounded-[2rem] bg-cocoa shadow-elegant sm:rounded-[2.5rem]">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={heroPoster}
            aria-hidden
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,oklch(0.16_0.018_70_/_0.94)_0%,oklch(0.16_0.018_70_/_0.62)_48%,oklch(0.16_0.018_70_/_0.12)_85%)]" />
          <div className="relative z-10 flex items-end p-6 pb-10 text-cream sm:p-10 lg:p-14">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cocoa/35 px-4 py-2 text-xs font-medium text-gold-soft backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" /> Artisan bakery in Ajman, UAE
              </span>
              <h1 className="mt-5 font-display text-6xl font-extrabold leading-[0.9] sm:text-7xl lg:text-8xl">
                Zekra <span className="text-gradient-gold">Sweets</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-cream/85 sm:text-lg">
                Browse our current online selection and choose the size that suits your table.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-gradient-gold px-6 text-sm font-bold text-primary-foreground shadow-glow"
                >
                  Shop current selection <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border border-cream/25 bg-cream/10 px-6 text-sm font-bold backdrop-blur-sm"
                >
                  <MessageCircle className="h-4 w-4" /> Ask us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-7xl px-4 sm:px-6" data-reveal>
        <div className="grid overflow-hidden rounded-3xl border border-gold-soft/45 bg-cream/65 sm:grid-cols-3">
          {[
            [ShoppingBag, "Real selection", "Products and sizes come directly from the live shop."],
            [
              Clock3,
              "Choose your size",
              "Review available size options before adding to your bag.",
            ],
            [
              ShieldCheck,
              "Clear checkout",
              "Review your order and delivery details before payment.",
            ],
          ].map(([Icon, title, text], index) => (
            <div
              key={String(title)}
              className="border-b border-gold-soft/35 p-5 last:border-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
            >
              <Icon className="h-5 w-5 text-primary" />
              <h2 className="mt-3 font-display text-xl">{title as string}</h2>
              <p className="mt-1 text-sm text-foreground/65">{text as string}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6" data-reveal>
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.28em] text-caramel">
              {featured.length ? "Featured" : "Fresh selection"}
            </span>
            <h2 className="mt-2 font-display text-4xl">
              From the <span className="text-gradient-gold">counter.</span>
            </h2>
          </div>
          <Link to="/products" className="text-sm font-bold text-primary">
            View all →
          </Link>
        </div>
        {selection.length ? (
          <div className="mt-7 grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {selection.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="glass mt-7 rounded-3xl p-10 text-center">
            <h3 className="font-display text-2xl">The online counter is being updated.</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Please check back soon for the current selection.
            </p>
          </div>
        )}
      </section>

      {categories.length > 0 && (
        <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6" data-reveal>
          <span className="text-xs uppercase tracking-[0.28em] text-caramel">Browse naturally</span>
          <h2 className="mt-2 font-display text-4xl">
            Shop by <span className="text-gradient-gold">category.</span>
          </h2>
          <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4">
            {categories.map(({ category, product }) => (
              <Link
                key={category}
                to="/products"
                search={{ category }}
                className="group relative aspect-[4/3] overflow-hidden rounded-3xl"
              >
                <img
                  src={assetUrl(product.imageUrl)}
                  onError={productImageError}
                  alt={product.imageAlt || product.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-cocoa/85 to-transparent" />
                <span className="absolute inset-x-4 bottom-4 font-display text-xl text-cream">
                  {category}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
        <div className="glass grid overflow-hidden rounded-[2rem] lg:grid-cols-2" data-reveal>
          <img
            src={interiorImg}
            alt="Zekra Sweets bakery interior"
            loading="lazy"
            className="h-full min-h-72 w-full object-cover"
          />
          <div className="p-7 sm:p-10">
            <span className="text-xs uppercase tracking-[0.28em] text-caramel">Our story</span>
            <h2 className="mt-3 font-display text-4xl">
              A warm Ajman <span className="text-gradient-gold">bakery counter.</span>
            </h2>
            <p className="mt-4 leading-relaxed text-foreground/75">
              Zekra Sweets brings its bakery selection online so you can browse available products,
              compare sizes and build your order with ease.
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                to="/about"
                className="rounded-xl bg-cocoa px-5 py-3 text-sm font-bold text-cream"
              >
                Read our story
              </Link>
              <Link
                to="/gallery"
                className="rounded-xl border border-gold-soft/60 px-5 py-3 text-sm font-bold"
              >
                View gallery
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6" data-reveal>
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.28em] text-caramel">
              Gallery preview
            </span>
            <h2 className="mt-2 font-display text-4xl">
              Inside <span className="text-gradient-gold">Zekra.</span>
            </h2>
          </div>
          <Link to="/gallery" className="text-sm font-bold text-primary">
            View gallery →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
          <img
            src={interiorImg}
            alt="Zekra Sweets bakery interior"
            loading="lazy"
            className="aspect-[4/3] w-full rounded-2xl object-cover sm:rounded-3xl"
          />
          <img
            src={craftImg}
            alt="Bakery preparation"
            loading="lazy"
            className="aspect-[4/3] w-full rounded-2xl object-cover sm:rounded-3xl"
          />
          <img
            src={ruskImg}
            alt="Rusk from the bakery selection"
            loading="lazy"
            className="aspect-[4/3] w-full rounded-2xl object-cover sm:rounded-3xl"
          />
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6" data-reveal>
        <div className="glass rounded-[2rem] p-6 sm:p-9">
          <span className="text-xs uppercase tracking-[0.28em] text-caramel">Quick answers</span>
          <h2 className="mt-2 font-display text-4xl">
            Before you <span className="text-gradient-gold">order.</span>
          </h2>
          <div className="mt-6 divide-y divide-gold-soft/40">
            {[
              [
                "Where can I see available sizes?",
                "Each current product page lists its available size options and prices.",
              ],
              [
                "Can I review my order first?",
                "Your cart and checkout show your selected products, quantities and totals before you place the order.",
              ],
              [
                "How can I ask about a product?",
                "Use the product page WhatsApp button or contact the bakery directly.",
              ],
            ].map(([question, answer]) => (
              <details key={question} className="py-4">
                <summary className="cursor-pointer list-none pr-6 font-bold marker:hidden">
                  {question}
                </summary>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground/70">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6" data-reveal>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-gold-soft/45 bg-cream/65 p-6">
            <span className="text-xs uppercase tracking-[0.25em] text-caramel">Customer notes</span>
            <h2 className="mt-3 font-display text-3xl">Reviews coming soon.</h2>
            <p className="mt-3 text-sm text-foreground/70">
              We will show verified customer feedback here when it is available.
            </p>
          </div>
          <div className="rounded-3xl bg-cocoa p-6 text-cream">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-soft">
              Quick answers
            </span>
            <h2 className="mt-3 font-display text-3xl">Need help choosing?</h2>
            <p className="mt-3 text-sm text-cream/75">
              Product pages show current sizes and prices. For anything else, contact the bakery
              directly.
            </p>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-gold px-4 text-sm font-bold text-primary-foreground"
            >
              Ask on WhatsApp <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
