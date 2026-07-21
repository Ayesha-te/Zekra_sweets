import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useReveal } from "@/hooks/use-reveal";

export function SiteLayout({ children }: { children: ReactNode }) {
  useReveal();
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-hero opacity-70" />
      </div>
      <Header />
      <main className="pt-32 sm:pt-36">{children}</main>
      <Footer />
    </div>
  );
}
