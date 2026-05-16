/**
 * Centralized hreflang generator for bilingual (EN/ES) single-URL pages.
 *
 * The site renders both languages from the same URL (client toggles via
 * I18nProvider). Per Google's hreflang guidance for single-URL bilingual
 * sites, we still need to declare the language variants so search engines
 * surface the right page to en-US and es-US users — they just happen to
 * share the same href.
 *
 * Returns the link-array shape TanStack Router's `head().links` expects.
 *
 * Usage in a route file:
 *
 *   links: [
 *     { rel: "canonical", href: URL },
 *     ...hreflangLinks(URL),
 *   ]
 */
export function hreflangLinks(absoluteUrl: string) {
  return [
    { rel: "alternate", hrefLang: "en", href: absoluteUrl },
    { rel: "alternate", hrefLang: "es", href: absoluteUrl },
    { rel: "alternate", hrefLang: "x-default", href: absoluteUrl },
  ] as const;
}
