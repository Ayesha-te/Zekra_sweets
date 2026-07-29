type AnalyticsEvent =
  "add_to_cart" | "begin_checkout" | "contact_call" | "contact_email" | "contact_whatsapp";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackEvent(event: AnalyticsEvent, details: Record<string, string | number> = {}) {
  if (typeof window === "undefined" || !import.meta.env.VITE_ANALYTICS_ID) return;
  window.dataLayer ||= [];
  window.dataLayer.push({ event, ...details });
}
