import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useReveal } from "@/hooks/use-reveal";

export function SiteLayout({ children }: { children: ReactNode }) {
  useReveal();
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      {/* Ambient background blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-40 top-24 h-[420px] w-[420px] rounded-full bg-gold-soft/50 blur-3xl animate-blob" />
        <div className="absolute right-[-10%] top-[40%] h-[520px] w-[520px] rounded-full bg-caramel/25 blur-3xl animate-blob" style={{ animationDelay: "-4s" }} />
        <div className="absolute bottom-0 left-1/3 h-[380px] w-[380px] rounded-full bg-gold/30 blur-3xl animate-blob" style={{ animationDelay: "-8s" }} />
      </div>
      <Header />
      <main className="pt-24">{children}</main>
      <Footer />
    </div>
  );
}