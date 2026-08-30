import { Check, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { assetUrl, productImageError, type Product, type ProductSizeOption } from "@/lib/api";
import { cartItemKey, formatMoney, useCart } from "@/lib/cart";
import { productDisplayName, productDisplayPrice, productSizeOptions } from "@/lib/products";

export function ProductRecommendations({
  products,
  title = "You may also like this",
  subtitle = "Popular picks customers often add before checkout.",
}: {
  products: Product[];
  title?: string;
  subtitle?: string;
}) {
  const cart = useCart();
  const cartIds = new Set(cart.items.map((item) => item.product.id.replace(/-combo-gift$/, "")));
  const recommended = products
    .filter((product) => product.isActive !== false && !cartIds.has(product.id))
    .sort((a, b) => scoreProduct(b) - scoreProduct(a))
    .slice(0, 4);

  if (recommended.length === 0) return null;

  return (
    <section className="mt-6 rounded-[2rem] border border-gold-soft/45 bg-cream/65 p-5 shadow-glass" data-reveal>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <span className="text-xs uppercase tracking-[0.24em] text-caramel">Add this to your order</span>
          <h2 className="mt-1 font-display text-2xl">{title}</h2>
        </div>
        <p className="max-w-sm text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {recommended.map((product) => (
          <RecommendationCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function RecommendationCard({ product }: { product: Product }) {
  const cart = useCart();
  const sizes = useMemo(() => sizeOptionsFor(product), [product]);
  const [sizeKey, setSizeKey] = useState(optionKey(sizes[0]));
  const [added, setAdded] = useState(false);
  const size = sizes.find((option) => optionKey(option) === sizeKey) || sizes[0];

  const add = () => {
    cart.addItem({
      ...product,
      price: size.price,
      originalPrice: size.originalPrice,
      sizeId: size.id,
      sizeLabel: size.label,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1300);
  };

  return (
    <article className="grid grid-cols-[72px_minmax(0,1fr)] gap-3 rounded-2xl border border-gold-soft/45 bg-cream p-3">
      <img
        src={assetUrl(product.imageUrl)}
        onError={productImageError}
        alt={product.imageAlt || product.name}
        className="h-[72px] w-[72px] rounded-xl object-cover"
      />
      <div className="min-w-0">
        <div className="truncate font-display text-base leading-tight">{productDisplayName(product)}</div>
        <div className="mt-1 text-xs font-semibold text-caramel">Popular product</div>
        {sizes.length > 1 && (
          <select
            value={sizeKey}
            onChange={(event) => setSizeKey(event.target.value)}
            className="mt-2 min-h-9 w-full rounded-xl border border-border bg-cream px-2 text-xs font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {sizes.map((option) => (
              <option key={optionKey(option)} value={optionKey(option)}>
                {option.label} - {formatMoney(option.price)}
              </option>
            ))}
          </select>
        )}
        <button
          type="button"
          onClick={add}
          className="mt-2 inline-flex min-h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-cocoa px-3 text-xs font-bold text-cream hover:bg-cocoa/90"
        >
          {added ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          {added ? "Added" : formatMoney(size.price)}
        </button>
      </div>
      <span className="sr-only" aria-live="polite">
        {added ? `${product.name} added to bag as ${cartItemKey({ ...product, sizeId: size.id, sizeLabel: size.label })}` : ""}
      </span>
    </article>
  );
}

function sizeOptionsFor(product: Product): ProductSizeOption[] {
  const sizes = productSizeOptions(product);
  if (sizes.length > 0) return sizes;
  return [{ label: "Regular", price: productDisplayPrice(product), originalPrice: product.originalPrice }];
}

function optionKey(size: ProductSizeOption) {
  return size.id || `${size.label}-${size.price}`;
}

function scoreProduct(product: Product) {
  const text = `${product.tag || ""} ${product.name} ${product.category}`.toLowerCase();
  return Number(text.includes("popular")) * 5 + Number(text.includes("cookie")) * 3 + Number(text.includes("puff")) * 2;
}
