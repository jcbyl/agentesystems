/**
 * Vendor-neutral analytics for outbound CTA clicks (phone, email,
 * WhatsApp). Two responsibilities:
 *
 *   1. Emit a structured event on every click so any analytics layer
 *      can pick it up. We push to `window.dataLayer` (GTM/GA4 standard)
 *      AND dispatch a `CustomEvent("agente:cta-click")` on `window`
 *      for in-app listeners. Both fire even if no analytics tag is
 *      installed yet — wiring GTM/GA4/Plausible later requires zero
 *      code changes.
 *
 *   2. Decorate wa.me URLs with UTM parameters reflecting the
 *      visitor's detected language (EN vs ES) and the page/location
 *      the click came from. tel: and mailto: schemes do not support
 *      URL params, so UTMs are no-ops there — but we still track the
 *      click so attribution surfaces in analytics.
 */
export type CtaKind = "phone" | "email" | "whatsapp" | "other";
export type CtaLang = "en" | "es";

export type CtaEvent = {
  event: "cta_click";
  cta_kind: CtaKind;
  cta_location: string; // e.g. "site-nav", "hero", "footer"
  cta_lang: CtaLang;
  cta_href: string;
  cta_destination: string; // "tel:+1...", "mailto:...", "wa.me/..."
  page_path: string;
};

const CAMPAIGN_BY_LANG: Record<CtaLang, string> = {
  en: "agente_en",
  es: "agente_es",
};

export function ctaKindFromHref(href: string): CtaKind {
  if (href.startsWith("tel:")) return "phone";
  if (href.startsWith("mailto:")) return "email";
  if (/^https?:\/\/(?:[a-z0-9-]+\.)?wa\.me\//i.test(href)) return "whatsapp";
  return "other";
}

/**
 * UTM tuple keyed off detected language. `source=website` because
 * these clicks originate on agentesystems own pages; `medium=cta`
 * separates them from organic clicks elsewhere; `campaign` flips on
 * lang so EN vs ES traffic is segmentable downstream.
 */
export function utmFor(lang: CtaLang, location: string): Record<string, string> {
  return {
    utm_source: "website",
    utm_medium: "cta",
    utm_campaign: CAMPAIGN_BY_LANG[lang],
    utm_content: location,
  };
}

/**
 * Returns a new href with UTM params appended. Only meaningful for
 * https:// URLs (wa.me, etc.) — tel:/mailto: are returned unchanged
 * because their schemes ignore query strings.
 */
export function decorateHref(href: string, lang: CtaLang, location: string): string {
  if (!/^https?:\/\//i.test(href)) return href;
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return href;
  }
  const utm = utmFor(lang, location);
  for (const [k, v] of Object.entries(utm)) {
    // Don't clobber UTMs that were intentionally set upstream (e.g.
    // someone hand-coded a campaign-specific link for an ad).
    if (!url.searchParams.has(k)) url.searchParams.set(k, v);
  }
  return url.toString();
}

/**
 * Fire the click event. Safe to call from SSR (no-ops when window is
 * undefined). Idempotent against double-listeners — every call is one
 * dataLayer push.
 */
export function trackCtaClick(payload: Omit<CtaEvent, "event">): void {
  if (typeof window === "undefined") return;
  const event: CtaEvent = { event: "cta_click", ...payload };
  // GTM / GA4 standard channel.
  const w = window as unknown as { dataLayer?: unknown[] };
  if (!Array.isArray(w.dataLayer)) w.dataLayer = [];
  w.dataLayer.push(event);
  // In-app channel: lets tests / debug pages observe without GTM.
  window.dispatchEvent(new CustomEvent<CtaEvent>("agente:cta-click", { detail: event }));
}
