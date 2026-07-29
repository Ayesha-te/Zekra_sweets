import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
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
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://zekrasweets.com/gallery" },
      { property: "og:image", content: "https://zekrasweets.com/favicon.png" },
      { property: "og:site_name", content: "Zekra Sweets" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Gallery - Zekra Sweets" },
      {
        name: "twitter:description",
        content: "View Zekra Sweets products and behind-the-scenes bakery moments.",
      },
      { name: "twitter:image", content: "https://zekrasweets.com/favicon.png" },
      { title: "Gallery — Zekra Sweets | Behind the Scenes" },
      {
        name: "description",
        content:
          "Discover our products and what goes on behind the scenes at Zekra Sweets. Updated monthly.",
      },
      { property: "og:title", content: "Gallery — Zekra Sweets" },
      {
        property: "og:description",
        content: "Handmade cookies, sweets and behind-the-scenes moments.",
      },
    ],
    links: [{ rel: "canonical", href: "https://zekrasweets.com/gallery" }],
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft")
        setActiveIndex((value) =>
          value === null ? null : (value - 1 + images.length) % images.length,
        );
      if (event.key === "ArrowRight")
        setActiveIndex((value) => (value === null ? null : (value + 1) % images.length));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex]);
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="glass rounded-[2.5rem] p-8 md:p-14 text-center" data-reveal>
          <span className="text-xs uppercase tracking-[0.3em] text-caramel">Gallery</span>
          <h1 className="mt-3 font-display text-5xl sm:text-6xl">
            Behind the <span className="text-gradient-gold">scenes.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-foreground/75">
            Discover our products and the moments that shape them. The gallery is updated monthly —
            check back often.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-7xl px-4 sm:px-6">
        <div className="grid auto-rows-[180px] grid-cols-2 gap-4 md:auto-rows-[220px] md:grid-cols-4">
          {images.map((img, i) => (
            <button
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Open gallery image ${i + 1}`}
              key={i}
              data-reveal
              style={{ transitionDelay: `${(i % 6) * 60}ms` }}
              className={`group relative overflow-hidden rounded-3xl shadow-elegant ${img.span}`}
            >
              <img
                src={img.src}
                alt="Zekra bakery"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cocoa/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          ))}
        </div>
      </section>
      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-cocoa/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Gallery image ${activeIndex + 1} of ${images.length}`}
        >
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            aria-label="Close gallery"
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-cream text-cocoa"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex((activeIndex - 1 + images.length) % images.length)}
            aria-label="Previous image"
            className="absolute left-3 grid h-11 w-11 place-items-center rounded-full bg-cream text-cocoa sm:left-6"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <img
            src={images[activeIndex].src}
            alt={`Zekra Sweets gallery view ${activeIndex + 1}`}
            className="max-h-[85vh] max-w-[calc(100vw-7rem)] rounded-2xl object-contain shadow-elegant"
          />
          <button
            type="button"
            onClick={() => setActiveIndex((activeIndex + 1) % images.length)}
            aria-label="Next image"
            className="absolute right-3 grid h-11 w-11 place-items-center rounded-full bg-cream text-cocoa sm:right-6"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 text-sm font-bold text-cream">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
