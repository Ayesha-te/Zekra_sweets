import type { Product } from "@/lib/api";

export type MakingTimeSummary = {
  hours: number;
  notes: string[];
  preOrderDays: number;
  preOrderNotes: string[];
};

export function formatPreOrderDays(days: number) {
  return pluralize(days, "day");
}

export function formatMakingTime(hours: number) {
  if (hours > 0 && hours < 1) return pluralize(Math.round(hours * 60), "minute");
  if (hours >= 24 && hours % 24 === 0) return pluralize(hours / 24, "day");
  return pluralize(Number(hours.toFixed(2)), "hour");
}

function pluralize(value: number, unit: string) {
  return `${value} ${unit}${value === 1 ? "" : "s"}`;
}

// The longest making time wins; notes from every product are kept (deduplicated).
export function summarizeMakingTime(products: Array<Product | undefined>): MakingTimeSummary {
  const found = products.filter((product): product is Product => Boolean(product));
  const hours = Math.max(0, ...found.map((product) => Number(product.preparationHours) || 0));
  const notes = [...new Set(found.map((product) => product.makingInfo?.trim() || "").filter(Boolean))];
  const preOrderProducts = found.filter((product) => Number(product.preOrderDays) > 0);
  const preOrderDays = Math.max(0, ...preOrderProducts.map((product) => Number(product.preOrderDays)));
  const preOrderNotes = [...new Set(preOrderProducts.map((product) => product.preOrderInfo?.trim() || "").filter(Boolean))];
  return { hours, notes, preOrderDays, preOrderNotes };
}

export function formatReadyBy(hours: number, from = new Date()) {
  const readyAt = new Date(from.getTime() + hours * 60 * 60 * 1000);
  return new Intl.DateTimeFormat("en-AE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Dubai",
  }).format(readyAt);
}
