import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { ctaKindFromHref, decorateHref, trackCtaClick } from "@/lib/cta-tracking";

/**
 * Mount-once delegated click listener that instruments every
 * outbound CTA on the site (tel:, mailto:, wa.me) without requiring
 * each anchor to opt in. Two effects:
 *
 *   - Fire `trackCtaClick` so analytics layers (dataLayer / GTM /
 *     custom listeners) receive a structured event.
 *   - Rewrite wa.me hrefs at click time to include UTM params
 *     reflecting the current language and the nearest contextual
 *     location label (data-cta-location attr, fallback: route path).
 *
 * Mounted once in __root.tsx so it covers SiteNav, SiteFooter,
 * VerticalStub, and every per-route inline link with zero
 * per-anchor wiring. To tag a section, drop
 * data-cta-location="hero" on the nearest enclosing element.
 */
export function CtaAnalytics() {
  const { lang } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onClick = (ev: MouseEvent) => {
      const target = ev.target as Element | null;
      if (!target) return;
      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;
      const rawHref = anchor.getAttribute("href") ?? "";
      const kind = ctaKindFromHref(rawHref);
      if (kind === "other") return;

      // Resolve a human-readable location label. Walks up to the
      // nearest [data-cta-location] ancestor; falls back to the
      // route path so unlabeled CTAs still get a meaningful bucket.
      const locEl = anchor.closest<HTMLElement>("[data-cta-location]");
      const location = locEl?.dataset.ctaLocation ?? pathname;

      // For wa.me, rewrite href in-place so the actual navigation
      // carries UTMs. tel:/mailto: are untouched (schemes ignore
      // query strings). We avoid re-decorating on every click by
      // checking for our marker UTM.
      let destination = rawHref;
      if (kind === "whatsapp" && !rawHref.includes("utm_source=website")) {
        destination = decorateHref(rawHref, lang, location);
        anchor.setAttribute("href", destination);
      } else if (kind === "whatsapp") {
        destination = anchor.getAttribute("href") ?? rawHref;
      }

      trackCtaClick({
        cta_kind: kind,
        cta_location: location,
        cta_lang: lang,
        cta_href: rawHref,
        cta_destination: destination,
        page_path: pathname,
      });
    };

    // Capture phase so we rewrite href BEFORE the browser starts
    // navigation on mousedown/click.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [lang, pathname]);

  return null;
}
