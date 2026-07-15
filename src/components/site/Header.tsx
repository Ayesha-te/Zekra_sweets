import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/gallery", label: "Gallery" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5">
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full border transition-all duration-500 ${
          scrolled
            ? "glass border-transparent px-4 py-2 shadow-glass"
            : "border-transparent bg-transparent px-4 py-3"
        }`}
      >
        <Link to="/" className="flex items-center gap-2 group">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-gold text-primary-foreground font-display text-lg font-semibold shadow-glow transition-transform group-hover:rotate-12">
            Z
          </span>
          <span className="font-display text-lg tracking-tight text-foreground">
            Zekra <span className="text-gradient-gold">Sweets</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              activeProps={{ className: "text-primary" }}
              className="rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary story-link"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/products"
            className="hidden items-center gap-2 rounded-full bg-gradient-gold px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-105 sm:inline-flex"
          >
            <ShoppingBag className="h-4 w-4" />
            Order now
          </Link>
          <button
            aria-label="Toggle navigation"
            className="grid h-10 w-10 place-items-center rounded-full glass md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mx-auto mt-2 max-w-7xl md:hidden">
          <div className="glass rounded-3xl p-3">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-3 text-sm font-medium text-foreground/85 hover:bg-secondary"
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/products"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-gradient-gold px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              <ShoppingBag className="h-4 w-4" /> Order now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}