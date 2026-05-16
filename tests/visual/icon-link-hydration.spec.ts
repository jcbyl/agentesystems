import { test, expect, type APIRequestContext } from "@playwright/test";

/**
 * Hydration-injected icon-link validation.
 *
 * The SSR HTML ships a baseline set of <link rel="icon|apple-touch-icon|...">
 * tags. Client-side code (locale switcher, theme-aware favicon, A/B tests,
 * service-worker installers, etc.) may inject or swap additional icon links
 * after hydration. Those late-arriving links bypass our SSR-only checks
 * (favicon.spec.ts, icon-link-redirects.spec.ts), so we re-run the same
 * contract against them here:
 *
 *   1. HTTP 200
 *   2. Base MIME type (charset/parameters stripped) belongs to the family
 *      allowed for the link's `rel` AND matches the URL's file extension.
 *      `image/svg+xml; charset=utf-8` is treated as `image/svg+xml`.
 *   3. Cache-Control matches the SSR icons' Cache-Control byte-for-byte
 *      (so a hashed asset doesn't suddenly become `no-store`, and a
 *      no-store endpoint doesn't suddenly become `immutable`)
 *   4. Resolves to a Vite-managed asset URL (fingerprinted in prod)
 */

type IconLink = { rel: IconRel; href: string };
type IconRel =
  | "icon"
  | "shortcut icon"
  | "apple-touch-icon"
  | "apple-touch-icon-precomposed"
  | "mask-icon";

const ICON_RELS: readonly IconRel[] = [
  "icon",
  "shortcut icon",
  "apple-touch-icon",
  "apple-touch-icon-precomposed",
  "mask-icon",
];

const ICON_LINK_SELECTORS = ICON_RELS.map((r) => `link[rel="${r}"]`);

const VITE_ASSET_RE =
  /^\/(?:assets\/[^/]+-[A-Za-z0-9_-]{6,}\.[a-z0-9]+|src\/assets\/[^?]+\.[a-z0-9]+)(?:\?.*)?$/;

// Canonical (lower-cased, parameter-free) base MIME types per format.
const MIME_PNG = ["image/png"];
const MIME_ICO = ["image/x-icon", "image/vnd.microsoft.icon"];
const MIME_SVG = ["image/svg+xml"];
const MIME_WEBP = ["image/webp"];
const MIME_JPEG = ["image/jpeg"];
const MIME_GIF = ["image/gif"];

// Allowed MIME families per file extension.
const EXT_TO_MIME_FAMILY: Record<string, string[]> = {
  png: MIME_PNG,
  ico: MIME_ICO,
  svg: MIME_SVG,
  webp: MIME_WEBP,
  jpg: MIME_JPEG,
  jpeg: MIME_JPEG,
  gif: MIME_GIF,
};

// Allowed MIME families per `rel`. Sources:
//   - HTML spec / Microsoft: `icon` and `shortcut icon` accept any image
//   - Apple HIG: `apple-touch-icon[-precomposed]` must be PNG
//   - Safari pinned-tab: `mask-icon` must be a monochrome SVG
const REL_TO_ALLOWED_MIMES: Record<IconRel, string[]> = {
  icon: [...MIME_PNG, ...MIME_ICO, ...MIME_SVG, ...MIME_WEBP],
  "shortcut icon": [...MIME_PNG, ...MIME_ICO],
  "apple-touch-icon": [...MIME_PNG],
  "apple-touch-icon-precomposed": [...MIME_PNG],
  "mask-icon": [...MIME_SVG],
};

/**
 * Parse a Content-Type header into its base MIME type (lowercase, params
 * stripped). `Image/SVG+XML; charset=utf-8` → `image/svg+xml`. Returns
 * empty string when the header is missing/blank.
 */
function parseBaseMime(contentType: string): string {
  const first = (contentType ?? "").split(",")[0] ?? "";
  const base = first.split(";")[0] ?? "";
  return base.trim().toLowerCase();
}

function extOf(url: string): string {
  const path = url.split("?")[0]!.split("#")[0]!;
  const dot = path.lastIndexOf(".");
  return dot >= 0 ? path.slice(dot + 1).toLowerCase() : "";
}

function parseIconLinksFromHtml(html: string): IconLink[] {
  const out: IconLink[] = [];
  const seen = new Set<string>();
  const linkRe = /<link\b[^>]*>/gi;
  for (const tag of html.match(linkRe) ?? []) {
    const relMatch = /\brel\s*=\s*"([^"]+)"|\brel\s*=\s*'([^']+)'/i.exec(tag);
    const relVal = (relMatch?.[1] ?? relMatch?.[2] ?? "")
      .toLowerCase()
      .trim() as IconRel;
    if (!ICON_RELS.includes(relVal)) continue;
    const hrefMatch = /\bhref\s*=\s*"([^"]+)"|\bhref\s*=\s*'([^']+)'/i.exec(tag);
    const href = hrefMatch?.[1] ?? hrefMatch?.[2];
    if (!href) continue;
    const key = `${relVal}|${href}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ rel: relVal, href });
  }
  return out;
}

function normalizeUrl(href: string, baseURL: string): string | null {
  try {
    const u = new URL(href, baseURL).toString();
    return u.startsWith(baseURL) ? u : null;
  } catch {
    return null;
  }
}

async function fetchIcon(
  request: APIRequestContext,
  url: string,
): Promise<{ status: number; contentType: string; cacheControl: string }> {
  const resp = await request.fetch(url, {
    method: "GET",
    headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
    failOnStatusCode: false,
  });
  const h = resp.headers();
  return {
    status: resp.status(),
    contentType: h["content-type"] ?? "",
    cacheControl: h["cache-control"] ?? "",
  };
}

test.describe("icon links: hydration-injected validation", () => {
  test("any icon link injected after hydration matches SSR contract (rel-aware MIME, charset-tolerant)", async ({
    page,
    playwright,
    baseURL,
  }) => {
    expect(baseURL).toBeTruthy();

    // -----------------------------------------------------------------
    // 1. SSR snapshot — fetch raw HTML (no JS) and extract {rel, href}.
    // -----------------------------------------------------------------
    const ssrCtx = await playwright.request.newContext({ baseURL });
    const ssrResp = await ssrCtx.get("/", {
      headers: { "Cache-Control": "no-cache" },
    });
    expect(ssrResp.status(), "SSR GET / status").toBe(200);
    const ssrHtml = await ssrResp.text();

    const ssrLinks: IconLink[] = parseIconLinksFromHtml(ssrHtml)
      .map((l) => {
        const u = normalizeUrl(l.href, baseURL!);
        return u ? { rel: l.rel, href: u } : null;
      })
      .filter((l): l is IconLink => !!l);
    expect(ssrLinks.length, "SSR HTML should declare icon links").toBeGreaterThan(0);

    // Cache-Control baseline (assert SSR icons agree).
    const ssrCacheByUrl = new Map<string, string>();
    for (const { href } of ssrLinks) {
      if (ssrCacheByUrl.has(href)) continue;
      const h = await fetchIcon(ssrCtx, href);
      expect(h.status, `SSR icon ${href} status`).toBe(200);
      ssrCacheByUrl.set(href, h.cacheControl);
    }
    await ssrCtx.dispose();

    const ssrCacheControls = new Set(ssrCacheByUrl.values());
    expect(
      ssrCacheControls.size,
      `SSR icons disagree on Cache-Control: ${JSON.stringify([...ssrCacheControls])}`,
    ).toBe(1);
    const expectedCacheControl = [...ssrCacheControls][0]!;

    // -----------------------------------------------------------------
    // 2. Hydrated snapshot — read live <head> with rel attached.
    // -----------------------------------------------------------------
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(750);

    const hydratedRaw = await page.evaluate((selectors) => {
      const seen = new Set<string>();
      const out: { rel: string; href: string }[] = [];
      for (const sel of selectors) {
        document.querySelectorAll<HTMLLinkElement>(sel).forEach((el) => {
          const rel = (el.getAttribute("rel") ?? "").toLowerCase().trim();
          const href = el.getAttribute("href");
          if (!href) return;
          const key = `${rel}|${href}`;
          if (seen.has(key)) return;
          seen.add(key);
          out.push({ rel, href });
        });
      }
      return out;
    }, ICON_LINK_SELECTORS);

    const hydratedLinks: IconLink[] = hydratedRaw
      .map((l) => {
        if (!ICON_RELS.includes(l.rel as IconRel)) return null;
        const u = normalizeUrl(l.href, baseURL!);
        return u ? { rel: l.rel as IconRel, href: u } : null;
      })
      .filter((l): l is IconLink => !!l);

    // -----------------------------------------------------------------
    // 3. Diff: anything in hydrated but not SSR is hydration-injected.
    // -----------------------------------------------------------------
    const ssrKeys = new Set(ssrLinks.map((l) => `${l.rel}|${l.href}`));
    const injected = hydratedLinks.filter(
      (l) => !ssrKeys.has(`${l.rel}|${l.href}`),
    );

    console.log(
      `[icon-hydration] SSR: ${ssrLinks.length}, hydrated: ${hydratedLinks.length}, injected: ${injected.length}`,
    );
    if (injected.length) {
      console.log(
        "[icon-hydration] injected:\n  " +
          injected.map((l) => `[${l.rel}] ${l.href}`).join("\n  "),
      );
    }

    if (injected.length === 0) {
      test.info().annotations.push({
        type: "note",
        description:
          "No hydration-injected icon links detected — assertions vacuous but contract enforced.",
      });
      return;
    }

    // -----------------------------------------------------------------
    // 4. Validate each injected icon against the contract.
    // -----------------------------------------------------------------
    const failures: string[] = [];
    const ctx = await playwright.request.newContext({ baseURL });
    try {
      for (const { rel, href } of injected) {
        const label = `[${rel}] ${href}`;

        // (a) Vite-managed asset path.
        const u = new URL(href);
        if (!VITE_ASSET_RE.test(u.pathname + (u.search || ""))) {
          failures.push(`${label}: not a Vite-managed asset path`);
          continue;
        }

        // (b) Fetch headers.
        const h = await fetchIcon(ctx, href);
        if (h.status !== 200) {
          failures.push(`${label}: status ${h.status}, expected 200`);
          continue;
        }

        // (c) MIME — strip parameters (e.g. `; charset=utf-8`) and
        //     compare base MIME against:
        //       (i) the family allowed for this rel, AND
        //      (ii) the family implied by the URL extension.
        const baseMime = parseBaseMime(h.contentType);
        if (!baseMime) {
          failures.push(`${label}: missing Content-Type header`);
        } else {
          const relAllowed = REL_TO_ALLOWED_MIMES[rel];
          if (!relAllowed.includes(baseMime)) {
            failures.push(
              `${label}: served as "${h.contentType}" (base "${baseMime}"), ` +
                `not in allowed MIMEs for rel="${rel}" [${relAllowed.join(", ")}]`,
            );
          }
          const ext = extOf(href);
          const extAllowed = EXT_TO_MIME_FAMILY[ext];
          if (!extAllowed) {
            failures.push(`${label}: unknown icon extension ".${ext}"`);
          } else if (!extAllowed.includes(baseMime)) {
            failures.push(
              `${label}: served as "${h.contentType}" (base "${baseMime}"), ` +
                `does not match extension .${ext} [${extAllowed.join(", ")}]`,
            );
          }
        }

        // (d) Cache-Control byte-for-byte equal to SSR baseline.
        if (h.cacheControl !== expectedCacheControl) {
          failures.push(
            `${label}: Cache-Control "${h.cacheControl}" ≠ SSR baseline "${expectedCacheControl}"`,
          );
        }
      }
    } finally {
      await ctx.dispose();
    }

    expect(failures, "hydration-injected icon validation failures").toEqual([]);
  });
});
