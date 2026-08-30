import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Gift } from "lucide-react";
import { useMemo, useState } from "react";

import { assetUrl, productImageError, type Product, type ProductSizeOption } from "@/lib/api";
import { formatMoney, useCart } from "@/lib/cart";
import { productDisplayName, productDisplayPrice, productSizeOptions } from "@/lib/products";

const COMBO_SLOTS = [0, 1, 2] as const;

export function ComboBoxBuilder({ products }: { products: Product[] }) {
  const cart = useCart();
  const navigate = useNavigate();
  const cookies = useMemo(
    () => products.filter((product) => product.category.toLowerCase() === "cookies"),
    [products],
  );
  const khariPuff = useMemo(
    () =>
      products.find((product) => /khari|khaari/i.test(`${product.name} ${product.category}`)) ||
      products.find((product) => product.category.toLowerCase() === "puff"),
    [products],
  );
  const [choices, setChoices] = useState(() =>
    COMBO_SLOTS.map((slot) => ({ productId: cookies[slot]?.id || "", sizeKey: "" })),
  );

  if (cookies.length < 3) return null;

  const resolvedChoices = choices.map((choice, index) => {
    const product = cookies.find((cookie) => cookie.id === choice.productId) || cookies[index] || cookies[0];
    const sizes = sizeOptionsFor(product);
    const size = sizes.find((option) => optionKey(option) === choice.sizeKey) || sizes[0];
    return { product, size };
  });
  const total = resolvedChoices.reduce((sum, choice) => sum + choice.size.price, 0);

  const updateProduct = (index: number, productId: string) => {
    const product = cookies.find((cookie) => cookie.id === productId) || cookies[0];
    const firstSize = sizeOptionsFor(product)[0];
    setChoices((current) =>
      current.map((choice, choiceIndex) =>
        choiceIndex === index ? { productId, sizeKey: optionKey(firstSize) } : choice,
      ),
    );
  };

  const updateSize = (index: number, sizeKey: string) => {
    setChoices((current) =>
      current.map((choice, choiceIndex) =>
        choiceIndex === index ? { ...choice, sizeKey } : choice,
      ),
    );
  };

  const addComboItems = () => {
    resolvedChoices.forEach(({ product, size }) => {
      cart.addItem({
        ...product,
        price: size.price,
        originalPrice: size.originalPrice,
        sizeId: size.id,
        sizeLabel: size.label,
      });
    });

    if (khariPuff) {
      cart.addItem({
        ...khariPuff,
        id: `${khariPuff.id}-combo-gift`,
        name: `${productDisplayName(khariPuff)} - Free with 3 Cookie Combo`,
        price: 0,
        originalPrice: null,
        sizeId: "combo-free",
        sizeLabel: "Free packet",
        isFreeGift: true,
      });
    }
  };

  const checkoutCombo = async () => {
    addComboItems();
    await navigate({ to: "/checkout" });
  };

  return (
    <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6">
      <div className="overflow-hidden rounded-[2rem] border border-primary/40 bg-cocoa text-cream shadow-elegant" data-reveal>
        <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-gold-soft px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cocoa">
              <Gift className="h-3.5 w-3.5" />
              Featured combo
            </span>
            <h2 className="mt-4 font-display text-3xl leading-tight sm:text-5xl">
              3 Cookie Combo Box
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-cream/78">
              Build your dream cookie box with any three flavours you love, choose the perfect size
              for each pack, and get a crispy Khari Puff packet absolutely free. More variety, more
              crunch, and one sweet reason to order today.
            </p>
            <div className="mt-5 rounded-2xl bg-cream/10 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-gold-soft">Combo total</div>
              <div className="mt-1 font-display text-3xl text-gold-soft">{formatMoney(total)}</div>
              <p className="mt-1 text-xs text-cream/70">Khari Puff packet: Free</p>
            </div>
          </div>

          <div className="grid gap-3">
            {COMBO_SLOTS.map((slot) => {
              const choice = resolvedChoices[slot];
              const sizes = sizeOptionsFor(choice.product);
              return (
                <div key={slot} className="grid gap-3 rounded-2xl bg-cream p-3 text-foreground sm:grid-cols-[76px_minmax(0,1fr)]">
                  <img
                    src={assetUrl(choice.product.imageUrl)}
                    onError={productImageError}
                    alt={choice.product.imageAlt || choice.product.name}
                    className="h-20 w-full rounded-xl object-cover sm:h-[76px] sm:w-[76px]"
                  />
                  <div className="grid gap-2 sm:grid-cols-2">
                    <label>
                      <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-caramel">
                        Cookie {slot + 1}
                      </span>
                      <select
                        value={choice.product.id}
                        onChange={(event) => updateProduct(slot, event.target.value)}
                        className="min-h-11 w-full rounded-xl border border-border bg-cream px-3 text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      >
                        {cookies.map((cookie) => (
                          <option key={cookie.id} value={cookie.id}>
                            {productDisplayName(cookie)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-caramel">
                        Size
                      </span>
                      <select
                        value={optionKey(choice.size)}
                        onChange={(event) => updateSize(slot, event.target.value)}
                        className="min-h-11 w-full rounded-xl border border-border bg-cream px-3 text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      >
                        {sizes.map((size) => (
                          <option key={optionKey(size)} value={optionKey(size)}>
                            {size.label} - {formatMoney(size.price)}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => void checkoutCombo()}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-gold px-6 text-sm font-bold text-primary-foreground shadow-glow transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
            >
              Buy combo now
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
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
