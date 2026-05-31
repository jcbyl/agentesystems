/**
 * Per-route og:image fallback resolver.
 *
 * Build-time script scripts/gen-og-fallbacks.mjs renders one
 * deterministic 1200×630 PNG per leaf route into
 * public/og-fallback/<slug>.png. This module exposes a typed helper
 * that resolves a slug → absolute https:// URL suitable for use in a
 * route's head() meta block.
 *
 * Use from a route when the page has no bespoke share image:
 *
 *   import { ogFallback } from "@/lib/og-fallback";
 *   const OG_IMAGE = ogFallback("demo");
 *
 * URLs include a `?v=<contentHash>` query string sourced from
 * src/lib/og-fallback-manifest.ts (regenerated every build by
 * scripts/gen-og-fallbacks.mjs). Social scrapers key their cache on
 * the full URL, so changing the PNG bytes automatically invalidates
 * Facebook/LinkedIn/Slack/X previews without needing a manual
 * re-scrape.
 *
 * Keep the slug list in sync with scripts/gen-og-fallbacks.mjs — the
 * type below enforces this at compile time on the consumer side.
 */
import { OG_FALLBACK_HASHES } from "./og-fallback-manifest";

export type OgFallbackSlug =
  | "home"
  | "demo"
  | "medical"
  | "beauty"
  | "solar"
  | "construction"
  | "real-estate";

// Single source of truth for the canonical origin used in absolute
// og:image URLs. Matches the value used in __root.tsx / per-route
// canonical links so social crawlers always see one host.
const ORIGIN = "https://agente.systems";

export function ogFallback(slug: OgFallbackSlug): string {
  const hash = OG_FALLBACK_HASHES[slug];
  return `${ORIGIN}/og-fallback/${slug}.png?v=${hash}`;
}

// Convenience for routes that want both `og:image` and
// `og:image:secure_url` pointing at the same URL (LinkedIn/Slack
// validate equality across the two).
export function ogFallbackPair(slug: OgFallbackSlug): {
  url: string;
  secureUrl: string;
  type: "image/png";
  width: "1200";
  height: "630";
} {
  const url = ogFallback(slug);
  return { url, secureUrl: url, type: "image/png", width: "1200", height: "630" };
}