import { createFileRoute } from "@tanstack/react-router";

import { ICON_URLS } from "@/lib/icon-urls";

const {
  favicon16: favicon16Url,
  favicon32: favicon32Url,
  icon192: icon192Url,
  icon512: icon512Url,
  iconMaskable192: iconMaskable192Url,
  iconMaskable512: iconMaskable512Url,
} = ICON_URLS;

/**
 * Web app manifest served at /manifest.webmanifest.
 *
 * Icon URLs are Vite-fingerprinted (e.g. `/assets/icon-512-abc123.png`), so
 * any change to a source PNG produces a new manifest payload pointing at a
 * new asset URL. Browsers re-fetch the manifest on the next page load and
 * pick up the new icon without manual cache-busting.
 *
 * Note: iOS/Android pin manifest fields at install time, so already-installed
 * PWAs keep their old icons until reinstalled — fingerprinting helps fresh
 * installs and tab/home-screen icons in browsers that re-read it.
 */
/**
 * Localized name/short_name/description shown in install prompts and the
 * Add-to-Home-Screen UI. Icon URLs are intentionally NOT keyed by locale —
 * the canonical hashed assets are language-agnostic and must stay byte-stable
 * across locales so browsers can dedupe and cache them.
 */
const MANIFEST_I18N = {
  en: {
    lang: "en",
    name: "Agente — Bilingual AI Agents",
    short_name: "Agente",
    description:
      "Bilingual AI agents for Real Estate, Construction, Solar & Medical. WhatsApp-native. EN/ES.",
  },
  es: {
    lang: "es",
    name: "Agente — Agentes de IA Bilingües",
    short_name: "Agente",
    description:
      "Agentes de IA bilingües para Inmobiliaria, Construcción, Solar y Medicina. Nativo de WhatsApp. EN/ES.",
  },
} as const;

type Locale = keyof typeof MANIFEST_I18N;

/**
 * Pick a supported locale from an Accept-Language header. Parses q-values,
 * sorts by preference, and falls back to English. Kept tiny and dependency-
 * free so it runs cheaply in the Worker.
 */
function pickLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return "en";
  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const q = qParam ? Number(qParam.split("=")[1]) : 1;
      return { tag: tag.toLowerCase(), q: Number.isFinite(q) ? q : 0 };
    })
    .filter((r) => r.tag && r.q > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const primary = tag.split("-")[0];
    if (primary === "es") return "es";
    if (primary === "en") return "en";
  }
  return "en";
}

export const Route = createFileRoute("/manifest.webmanifest")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const locale = pickLocale(request.headers.get("accept-language"));
        const i18n = MANIFEST_I18N[locale];

        const manifest = {
          lang: i18n.lang,
          dir: "ltr",
          name: i18n.name,
          short_name: i18n.short_name,
          description: i18n.description,
          start_url: "/",
          scope: "/",
          display: "standalone",
          orientation: "portrait",
          background_color: "#18303C",
          theme_color: "#E84118",
          icons: [
            { src: favicon16Url, sizes: "16x16", type: "image/png", purpose: "any" },
            { src: favicon32Url, sizes: "32x32", type: "image/png", purpose: "any" },
            { src: icon192Url, sizes: "192x192", type: "image/png", purpose: "any" },
            { src: icon512Url, sizes: "512x512", type: "image/png", purpose: "any" },
            {
              src: iconMaskable192Url,
              sizes: "192x192",
              type: "image/png",
              purpose: "maskable",
            },
            {
              src: iconMaskable512Url,
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        };

        return new Response(JSON.stringify(manifest), {
          status: 200,
          headers: {
            "Content-Type": "application/manifest+json",
            // Manifest body varies by Accept-Language (localized name/desc),
            // but the hashed icon URLs inside are immutable. Tell caches to
            // key per-language so EN and ES callers don't poison each other.
            "Cache-Control": "public, max-age=300, must-revalidate",
            Vary: "Accept-Language",
            "Content-Language": i18n.lang,
          },
        });
      },
    },
  },
});