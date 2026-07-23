import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ShoppingBag, Truck } from "lucide-react";
import { useCart } from "@/lib/cart";
import logo from "@/assets/log.png";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/order", label: "Order" },
  { to: "/history", label: "History" },
  { to: "/gallery", label: "Gallery" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const cart = useCart();
  const cartLabel = cart.count > 99 ? "99+" : String(cart.count);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-2 sm:px-6 sm:pt-3">
      <div className="mx-auto mb-2 flex min-h-8 max-w-7xl items-center justify-center gap-2 rounded-full border border-gold-soft/45 bg-cocoa px-4 py-1.5 text-center text-xs font-semibold leading-tight text-cream shadow-glass backdrop-blur-sm sm:text-sm">
        <Truck className="h-3.5 w-3.5 shrink-0 text-gold-soft" />
        <span>Free delivery on orders above AED 50 across the UAE</span>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-gold-soft/55 bg-cream/82 px-5 py-3.5 shadow-glass backdrop-blur-sm transition-shadow duration-200 sm:px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src={logo}
            alt="Zekra Sweets Logo"
            className="h-11 w-11 rounded-full object-cover border border-gold-soft/50 shadow-glow transition-transform group-hover:rotate-12"
          />
          <span className="font-display text-xl font-extrabold text-foreground sm:text-2xl">
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
              className="rounded-full px-4 py-2.5 text-[15px] font-medium text-foreground/80 transition-colors hover:text-primary story-link"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            aria-label={`Open bag with ${cart.count} ${cart.count === 1 ? "item" : "items"}`}
            className="relative grid h-11 w-11 place-items-center rounded-full border border-gold-soft/45 bg-cream/70 text-foreground backdrop-blur-md transition-colors hover:bg-secondary hover:text-primary"
          >
            <ShoppingBag className="h-4 w-4" />
            {cart.count > 0 && (
              <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-cocoa px-1.5 text-[10px] font-bold text-cream shadow-glass">
                {cartLabel}
              </span>
            )}
          </Link>
          <Link
            to="/order"
            className="hidden items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-[15px] font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105 sm:inline-flex"
          >
            <ShoppingBag className="h-4 w-4" />
            Order now
          </Link>
          <button
            aria-label="Toggle navigation"
            className="grid h-11 w-11 place-items-center rounded-full border border-gold-soft/45 bg-cream/70 backdrop-blur-md md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mx-auto mt-2 max-w-7xl md:hidden">
          <div className="rounded-3xl border border-gold-soft/45 bg-cream/90 p-3 shadow-elegant backdrop-blur-md">
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
              to="/cart"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-2xl border border-gold-soft/50 bg-cream/70 px-4 py-3 text-sm font-semibold text-foreground"
            >
              <ShoppingBag className="h-4 w-4" /> Bag ({cart.count})
            </Link>
            <Link
              to="/order"
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
