import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Facebook, Instagram, Mail, MapPin, Phone, Send } from "lucide-react";
import logo from "@/assets/log.png";
import {
  BUSINESS_EMAIL,
  BUSINESS_EMAIL_LINK,
  BUSINESS_PHONE_DISPLAY,
  BUSINESS_PHONE_LINK,
  FACEBOOK_LINK,
  INSTAGRAM_LINK,
  WHATSAPP_LINK,
} from "@/lib/contact";

const bannerWords = [
  "ZEKRA SWEETS",
  "FRESH BAKES",
  "HANDMADE COOKIES",
  "AJMAN UAE",
  "RUSKS & SWEETS",
] as const;

const sitemapLinks = [
  ["Home", "/"],
  ["About", "/about"],
  ["Gallery", "/gallery"],
  ["Products", "/products"],
  ["History", "/history"],
  ["Contact", "/contact"],
] as const;

const socialLinks = [
  { label: "Instagram", href: INSTAGRAM_LINK, icon: Instagram },
  { label: "Facebook", href: FACEBOOK_LINK, icon: Facebook },
  { label: "WhatsApp", href: WHATSAPP_LINK, icon: Send },
] as const;

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-cocoa text-cream">
      <div className="relative z-10 overflow-hidden border-y border-cocoa/15 bg-gold py-6 shadow-[0_12px_36px_oklch(0.12_0.01_70_/_0.22)] md:py-9">
        <div className="flex h-14 items-center overflow-hidden md:h-20">
          <div className="flex w-max animate-marquee items-center gap-8 whitespace-nowrap font-display text-3xl font-extrabold uppercase tracking-normal text-cocoa md:gap-12 md:text-5xl">
            {[...bannerWords, ...bannerWords, ...bannerWords, ...bannerWords].map((word, index) => (
              <span key={`${word}-${index}`} className="flex items-center gap-8 md:gap-12">
                {word}
                <span className="h-2.5 w-2.5 rounded-full bg-cocoa/55 md:h-3 md:w-3" />
              </span>
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gold to-transparent md:w-36" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-gold to-transparent md:w-36" />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(145deg,oklch(0.24_0.02_75),var(--cocoa)_48%,oklch(0.16_0.015_70))]" />
      <div className="absolute inset-0 grain-overlay opacity-35" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-14 md:py-16">
        <div className="grid gap-10 border-b border-cream/10 pb-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <img
                src={logo}
                alt="Zekra Sweets Logo"
                className="h-11 w-11 rounded-full object-cover border border-gold-soft/50 shadow-glow"
              />
              <span className="font-display text-2xl font-extrabold text-cream">
                Zekra <span className="text-gradient-gold">Sweets</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/65">
              Artisan bakery in the heart of the UAE. Handmade cookies, rusks and sweets, baked with
              patience and care.
            </p>
            <div className="mt-5 flex gap-2">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-full border border-cream/10 bg-cream/5 text-cream/80 transition-colors hover:bg-gradient-gold hover:text-primary-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-gold">Address</h4>
            <p className="mt-3 flex gap-2 text-sm leading-relaxed text-cream/75">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-soft" />
              <span>
                Al Zaher Street,
                <br />
                Rumaila 2,
                <br />
                Ajman, UAE
              </span>
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-gold">Contact</h4>
            <a
              href={BUSINESS_PHONE_LINK}
              className="mt-3 flex items-center gap-2 text-sm text-cream/75 transition-colors hover:text-gold"
            >
              <Phone className="h-4 w-4 text-gold-soft" /> {BUSINESS_PHONE_DISPLAY}
            </a>
            <a
              href={BUSINESS_EMAIL_LINK}
              className="mt-2 flex items-center gap-2 text-sm text-cream/75 transition-colors hover:text-gold"
            >
              <Mail className="h-4 w-4 text-gold-soft" /> {BUSINESS_EMAIL}
            </a>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-gold">Sitemap</h4>
            <ul className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
              {sitemapLinks.map(([label, to]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="inline-flex items-center gap-1 text-cream/70 transition-colors hover:text-gold story-link"
                  >
                    {label}
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-7 flex flex-col items-center justify-between gap-3 text-center text-xs text-cream/45 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} Zekra Sweets LLC. All rights reserved.</p>
          <p className="font-display italic text-cream/35">Baked fresh in Ajman, UAE.</p>
        </div>
      </div>
    </footer>
  );
}
