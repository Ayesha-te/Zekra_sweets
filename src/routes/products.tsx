import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ShoppingBag, Search } from "lucide-react";
import { useState } from "react";

import tuti from "@/assets/tuti-fruity.jpg";
import choc from "@/assets/chocolate.jpg";
import almond from "@/assets/almond-cookies.jpg";
import baklawa from "@/assets/baklawa.jpg";
import banana from "@/assets/banana.jpg";
import jeera from "@/assets/jeera.jpg";
import khaari from "@/assets/khaari.jpg";
import butter from "@/assets/butter.jpg";
import rusk from "@/assets/rusk.jpg";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Zekra Sweets | Cookies, Baklawa, Rusk & Puffs" },
      { name: "description", content: "Browse our handcrafted cookies, rusks, baklawa and khaari puffs. Small-batch bakery treats from Ajman, UAE." },
      { property: "og:title", content: "Products — Zekra Sweets" },
      { property: "og:description", content: "Handcrafted cookies, rusks, baklawa and puffs." },
    ],
  }),
  component: Products,
});

type Product = {
  name: string;
  img: string;
  price: number;
  original?: number;
  tag?: "Offer" | "Fresh" | "New";
  category: "Cookies" | "Sweets" | "Rusk" | "Puff";
};

const products: Product[] = [
  { name: "Premium Tuti Fruity Butter Cookies", img: tuti, price: 6.5, original: 8.5, category: "Cookies" },
  { name: "Premium Chocolate Cookies", img: choc, price: 5.0, original: 7.0, category: "Cookies" },
  { name: "Premium Almond Cookies", img: almond, price: 6.5, original: 8.5, category: "Cookies" },
  { name: "Peanut Baklawa | Middle Eastern Delight", img: baklawa, price: 6.5, original: 8.5, category: "Sweets" },
  { name: "Premium Banana Butter Cookies", img: banana, price: 5.0, original: 7.0, category: "Cookies" },
  { name: "Premium Jeera Cookies | Crispy Cumin", img: jeera, price: 5.0, original: 7.0, category: "Cookies" },
  { name: "Khaari Puff Packet | Crispy Butter Puff", img: khaari, price: 6.5, original: 8.5, tag: "Offer", category: "Puff" },
  { name: "Plain Butter Cookies | Classic Crispy", img: butter, price: 5.0, original: 7.0, tag: "Offer", category: "Cookies" },
  { name: "Fresh Rusk Packet | Tea Time Toast", img: rusk, price: 6.5, original: 8.5, tag: "Fresh", category: "Rusk" },
];

const categories = ["All products", "Cookies", "Sweets", "Rusk", "Puff"] as const;

function Products() {
  const [cat, setCat] = useState<(typeof categories)[number]>("All products");
  const [q, setQ] = useState("");

  const filtered = products.filter(
    (p) =>
      (cat === "All products" || p.category === cat) &&
      p.name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="glass rounded-[2.5rem] p-8 md:p-12" data-reveal>
          <span className="text-xs uppercase tracking-[0.3em] text-caramel">Browse by</span>
          <h1 className="mt-3 font-display text-5xl sm:text-6xl">All <span className="text-gradient-gold">products.</span></h1>
          <p className="mt-3 text-foreground/75">{filtered.length} handcrafted treats — baked fresh, delivered warm.</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products…"
                className="w-full rounded-full border border-border bg-cream/60 px-11 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                    cat === c
                      ? "bg-gradient-gold text-primary-foreground shadow-glow"
                      : "glass text-foreground/80 hover:text-primary"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-7xl px-4 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <article
              key={p.name}
              data-reveal
              style={{ transitionDelay: `${(i % 6) * 70}ms` }}
              className="group glass overflow-hidden rounded-3xl hover-lift"
            >
              <div className="relative aspect-square overflow-hidden">
                <img src={p.img} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" />
                {p.tag && (
                  <span className="absolute left-4 top-4 rounded-full bg-gradient-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary-foreground shadow-glow">
                    {p.tag}
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="text-[10px] uppercase tracking-widest text-caramel">{p.category}</div>
                <h3 className="mt-2 font-display text-lg leading-tight text-foreground">{p.name}</h3>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    {p.original && (
                      <div className="text-xs text-muted-foreground line-through">AED {p.original.toFixed(2)}</div>
                    )}
                    <div className="font-display text-2xl text-gradient-gold">AED {p.price.toFixed(2)}</div>
                  </div>
                  <button className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-4 py-2.5 text-xs font-medium text-primary-foreground shadow-glow transition-transform hover:scale-105">
                    <ShoppingBag className="h-3.5 w-3.5" /> Add to bag
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="glass mt-10 rounded-3xl p-12 text-center text-muted-foreground">
            No products match your search.
          </div>
        )}
      </section>
    </SiteLayout>
  );
}