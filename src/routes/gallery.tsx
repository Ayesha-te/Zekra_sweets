import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

import hero from "@/assets/hero-cookies.jpg";
import baklawa from "@/assets/baklawa.jpg";
import almond from "@/assets/almond-cookies.jpg";
import rusk from "@/assets/rusk.jpg";
import khaari from "@/assets/khaari.jpg";
import craft from "@/assets/craft.jpg";
import tuti from "@/assets/tuti-fruity.jpg";
import choc from "@/assets/chocolate.jpg";
import banana from "@/assets/banana.jpg";
import jeera from "@/assets/jeera.jpg";
import butter from "@/assets/butter.jpg";
import interior from "@/assets/bakery-interior.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Zekra Sweets | Behind the Scenes" },
      { name: "description", content: "Discover our products and what goes on behind the scenes at Zekra Sweets. Updated monthly." },
      { property: "og:title", content: "Gallery — Zekra Sweets" },
      { property: "og:description", content: "Handmade cookies, sweets and behind-the-scenes moments." },
    ],
  }),
  component: Gallery,
});

const images = [
  { src: hero, span: "row-span-2" },
  { src: baklawa, span: "row-span-2" },
  { src: almond, span: "" },
  { src: khaari, span: "" },
  { src: craft, span: "row-span-2 col-span-2" },
  { src: rusk, span: "" },
  { src: tuti, span: "" },
  { src: choc, span: "" },
  { src: banana, span: "" },
  { src: interior, span: "col-span-2" },
  { src: jeera, span: "" },
  { src: butter, span: "" },
];

function Gallery() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="glass rounded-[2.5rem] p-8 md:p-14 text-center" data-reveal>
          <span className="text-xs uppercase tracking-[0.3em] text-caramel">Gallery</span>
          <h1 className="mt-3 font-display text-5xl sm:text-6xl">Behind the <span className="text-gradient-gold">scenes.</span></h1>
          <p className="mx-auto mt-4 max-w-xl text-foreground/75">
            Discover our products and the moments that shape them. The gallery is
            updated monthly — check back often.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-7xl px-4 sm:px-6">
        <div className="grid auto-rows-[180px] grid-cols-2 gap-4 md:auto-rows-[220px] md:grid-cols-4">
          {images.map((img, i) => (
            <div
              key={i}
              data-reveal
              style={{ transitionDelay: `${(i % 6) * 60}ms` }}
              className={`group relative overflow-hidden rounded-3xl shadow-elegant ${img.span}`}
            >
              <img src={img.src} alt="Zekra bakery" loading="lazy" className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-cocoa/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}