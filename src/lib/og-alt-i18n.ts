/**
 * Per-route EN/ES translations for og:image:alt and twitter:image:alt.
 *
 * Each route file already declares the English alt in its head() so SSR
 * and the initial paint serve the canonical EN string (matching the
 * baked-in default language). On the client, I18nProvider watches the
 * detected/selected language and pathname; when the visitor's language
 * resolves to Spanish, the effect overwrites both alt meta tags with
 * the ES translation from this registry.
 *
 * Keep the EN value in this registry identical to the literal in the
 * route file — the social-head check validates exact strings, and
 * matching values let us "restore" EN cleanly when the user toggles
 * back from ES.
 */
export type AltPair = { en: string; es: string };

export const OG_ALT_I18N: Record<string, AltPair> = {
  "/": {
    en: "Agente.Systems — Bilingual EN/ES AI agents for real estate, construction, solar, and medical teams. WhatsApp-native, live in 24 hours.",
    es: "Agente.Systems — Agentes de IA bilingües EN/ES para equipos de bienes raíces, construcción, energía solar y consultorios médicos. Nativos de WhatsApp, en vivo en 24 horas.",
  },
  "/demo": {
    en: "Book a demo of Agente.Systems — bilingual EN/ES AI agents",
    es: "Agenda una demostración de Agente.Systems — agentes de IA bilingües EN/ES",
  },
  "/medical": {
    en: "Grace — bilingual AI agent for medical practices",
    es: "Grace — agente de IA bilingüe para consultorios médicos",
  },
  "/beauty": {
    en: "Bella — bilingual AI agent for beauty & wellness",
    es: "Bella — agente de IA bilingüe para belleza y bienestar",
  },
  "/solar": {
    en: "Sol — bilingual AI agent for solar installers",
    es: "Sol — agente de IA bilingüe para instaladores solares",
  },
  "/construction": {
    en: "Marco — bilingual EN/ES AI agent qualifying renovation leads, booking free estimates, and managing the full client lifecycle for DC, Maryland, and Virginia contractors",
    es: "Marco — agente de IA bilingüe EN/ES que califica clientes de remodelación, agenda estimados gratis y gestiona todo el ciclo del cliente para contratistas de DC, Maryland y Virginia",
  },
  "/real-estate": {
    en: "Carmen — bilingual EN/ES/Spanglish AI agent qualifying buyers, booking showings, and sending hot-lead digests for US real estate teams",
    es: "Carmen — agente de IA bilingüe EN/ES/Spanglish que califica compradores, agenda visitas y envía resúmenes de leads calientes para equipos de bienes raíces en EE. UU.",
  },
};

// Sitewide fallback used when no route-specific entry matches (e.g. 404,
// or a freshly added route that hasn't been translated yet). Mirrors the
// __root.tsx default alt so EN renders unchanged.
export const OG_ALT_DEFAULT: AltPair = {
  en: "Agente.Systems — Bilingual AI agents · EN/ES · WhatsApp-native",
  es: "Agente.Systems — Agentes de IA bilingües · EN/ES · nativos de WhatsApp",
};

export function resolveAlt(pathname: string, lang: "en" | "es"): string {
  // Normalize trailing slash so "/demo/" and "/demo" hit the same entry.
  const key = pathname !== "/" && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;
  const entry = OG_ALT_I18N[key] ?? OG_ALT_DEFAULT;
  return entry[lang];
}
