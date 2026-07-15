import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Send, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-warm" />
      <div className="absolute -top-32 left-1/2 -z-10 h-64 w-[80%] -translate-x-1/2 rounded-full bg-gradient-gold opacity-30 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="glass grid gap-10 rounded-3xl p-8 md:p-12 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-gold text-primary-foreground font-display text-lg">Z</span>
              <span className="font-display text-xl">Zekra <span className="text-gradient-gold">Sweets</span></span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Artisan bakery in the heart of the UAE. Handmade cookies, rusks and sweets — baked with patience and care.
            </p>
            <div className="mt-5 flex gap-2">
              {[Instagram, Facebook, Send].map((Icon, i) => (
                <a key={i} href="#" aria-label="Social" className="grid h-10 w-10 place-items-center rounded-full glass hover:bg-gradient-gold hover:text-primary-foreground transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-caramel">Address</h4>
            <p className="mt-3 flex gap-2 text-sm text-foreground/80">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Al Zaher Street,<br />Rumaila 2,<br />Ajman, UAE
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-caramel">Contact</h4>
            <p className="mt-3 flex items-center gap-2 text-sm text-foreground/80"><Phone className="h-4 w-4 text-primary" /> +971 55 608 6529</p>
            <p className="mt-2 flex items-center gap-2 text-sm text-foreground/80"><Mail className="h-4 w-4 text-primary" /> zekrasweetsllc@gmail.com</p>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-caramel">Sitemap</h4>
            <ul className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
              {[
                ["Home", "/"],
                ["About", "/about"],
                ["Gallery", "/gallery"],
                ["Products", "/products"],
                ["Careers", "/careers"],
                ["Contact", "/contact"],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-foreground/75 hover:text-primary story-link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Zekra Sweets LLC. Baked fresh in Ajman, UAE.
        </p>
      </div>
    </footer>
  );
}