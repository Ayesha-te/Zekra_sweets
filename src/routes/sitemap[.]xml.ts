import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { loadProducts } from "@/lib/products";
import { absoluteUrl, productPath } from "@/lib/seo";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const products = await loadProducts();
        const staticEntries = ["/", "/about", "/products", "/gallery", "/contact"];
        const productEntries = products
          .filter((product) => product.isActive !== false && product.robotsIndex !== false)
          .map((product) => ({
            loc: absoluteUrl(productPath(product)),
            lastmod: validDate(product.updatedAt),
          }));

        const entries = [
          ...staticEntries.map((path) => ({ loc: absoluteUrl(path) })),
          ...productEntries,
        ];
        const urls = entries
          .map(
            (entry) =>
              `  <url><loc>${escapeXml(entry.loc)}</loc>${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ""}</url>`,
          )
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});

function validDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
