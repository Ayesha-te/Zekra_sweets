import { API_BASE, assetUrl, type Product } from "@/lib/api";
import { productDisplayPrice } from "@/lib/products";
import { BUSINESS_PHONE_TEL } from "@/lib/contact";

export const SITE_NAME = "Zekra Sweets";
export const DEFAULT_SITE_URL = "https://zekrasweets.com";
export const SITE_URL = (import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");
export const DEFAULT_OG_IMAGE = absoluteUrl("/favicon.png");

type SeoHeadInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "product";
  robots?: string;
};

export function cleanText(value: unknown) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function slugify(value: unknown) {
  return cleanText(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path.replace(/^http:\/\//i, "https://");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}

export function absoluteImageUrl(path = "") {
  if (!path) return DEFAULT_OG_IMAGE;
  if (/^https?:\/\//i.test(path)) return path.replace(/^http:\/\//i, "https://");
  if (path.startsWith("/uploads/")) return `${API_BASE.replace(/\/+$/, "")}${path}`;
  return absoluteUrl(assetUrl(path));
}

export function productImageUrls(product: Pick<Product, "imageUrl" | "imageUrls">) {
  return [
    ...new Set(
      [product.imageUrl, ...(product.imageUrls || [])]
        .map((url) => cleanText(url))
        .filter(Boolean),
    ),
  ];
}

export function productDisplayName(product: Pick<Product, "name">) {
  return cleanText(product.name).replace(/\s*\|\s*/g, " - ");
}

export function productSlug(product: Product) {
  return slugify(product.urlSlug || product.name || product.id);
}

export function productPath(product: Product) {
  return `/products/${productSlug(product)}`;
}

export function productPrimaryKeyword(product: Product) {
  return productDisplayName(product).toLowerCase();
}

export function productSecondaryKeywords(product: Product) {
  const name = productDisplayName(product).toLowerCase();
  const category = cleanText(product.category).toLowerCase();
  const keywords = [
    name,
    category ? `${category} online` : "",
    category ? `buy ${category} online` : "",
    `${SITE_NAME} ${name}`.toLowerCase(),
  ];

  return [...new Set(keywords.filter(Boolean))].slice(0, 5);
}

export function productGeneratedTitle(product: Product) {
  const name = productDisplayName(product);
  const category = cleanText(product.category);

  if (category && !name.toLowerCase().includes(category.toLowerCase())) {
    return `${name} - ${category} | ${SITE_NAME}`;
  }

  return `Buy ${name} Online | ${SITE_NAME}`;
}

export function productGeneratedDescription(product: Product) {
  const name = productDisplayName(product);
  const description = cleanText(product.description);
  const category = cleanText(product.category).toLowerCase() || "bakery treat";
  const factual = description || `Fresh handmade ${category} baked by ${SITE_NAME}.`;

  return `Shop ${name} from ${SITE_NAME}. ${factual} Contact the bakery for today's availability.`;
}

export function productGeneratedImageAlt(product: Product) {
  const name = productDisplayName(product);
  const category = cleanText(product.category).toLowerCase();
  if (!category || name.toLowerCase().includes(category)) return name;
  return `${name} - ${category}`;
}

export function effectiveProductSeo(product: Product) {
  const slug = productSlug(product);
  const title = cleanText(product.metaTitle) || productGeneratedTitle(product);
  const description = cleanText(product.metaDescription) || productGeneratedDescription(product);
  const canonicalUrl = cleanText(product.canonicalUrl) || absoluteUrl(`/products/${slug}`);
  const image = cleanText(product.ogImage) || cleanText(product.imageUrl);

  return {
    slug,
    title,
    description,
    canonicalUrl,
    imageAlt: cleanText(product.imageAlt) || productGeneratedImageAlt(product),
    primaryKeyword: cleanText(product.primaryKeyword) || productPrimaryKeyword(product),
    secondaryKeywords:
      Array.isArray(product.secondaryKeywords) && product.secondaryKeywords.length > 0
        ? product.secondaryKeywords.map(cleanText).filter(Boolean)
        : productSecondaryKeywords(product),
    ogTitle: cleanText(product.ogTitle) || title,
    ogDescription: cleanText(product.ogDescription) || description,
    ogImage: absoluteImageUrl(image),
    robots: `${product.robotsIndex === false ? "noindex" : "index"}, ${
      product.robotsFollow === false ? "nofollow" : "follow"
    }`,
  };
}

export function buildSeoHead({
  title,
  description,
  path,
  image,
  type = "website",
  robots = "index, follow",
}: SeoHeadInput) {
  const url = absoluteUrl(path);
  const socialImage = absoluteImageUrl(image);

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: robots },
      { property: "og:type", content: type },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: socialImage },
      { property: "og:site_name", content: SITE_NAME },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: socialImage },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

export function productSeoHead(product: Product) {
  const seo = effectiveProductSeo(product);

  return buildSeoHead({
    title: seo.title,
    description: seo.description,
    path: productPath(product),
    image: seo.ogImage,
    type: "product",
    robots: seo.robots,
  });
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: absoluteUrl("/favicon.png"),
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: BUSINESS_PHONE_TEL,
            contactType: "customer service",
            areaServed: "AE",
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function productJsonLd(product: Product) {
  const seo = effectiveProductSeo(product);
  const images = productImageUrls(product).map(absoluteImageUrl);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productDisplayName(product),
    description: seo.description,
    image: images.length > 0 ? images : [absoluteImageUrl(product.imageUrl)],
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    url: absoluteUrl(productPath(product)),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(productPath(product)),
      price: productDisplayPrice(product).toFixed(2),
      priceCurrency: "AED",
    },
  };
}

export function itemListJsonLd(products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: productDisplayName(product),
      url: absoluteUrl(productPath(product)),
    })),
  };
}
