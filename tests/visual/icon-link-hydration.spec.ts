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
 *   2. content-type matches the URL's file extension
 *   3. Cache-Control matches the SSR icons' Cache-Control byte-for-byte
 *      (so a hashed asset doesn't suddenly become `no-store`, and a
 *      no-store endpoint doesn't suddenly become `immutable`)
 *   4. Resolves to a Vite-managed asset URL (fingerprinted in prod)
 *
 * Strategy: snapshot icon hrefs from the raw SSR HTML, then load the page
 * with full JS, wait for hydration + a settle window, and diff. Any URL
 * present after hydration but not in the SSR snapshot is "hydration-
 * injected" and validated.
 */

const ICON_LINK_SELECTORS = [
  'link[rel="icon"]',
  'link[rel="apple-touch-icon"]',
  'link[rel="apple-touch-icon-precomposed"]',
  'link[rel="shortcut icon"]',
  'link[rel="mask-icon"]',
];

const VITE_ASSET_RE =
  /^\/(?:assets\/[^/]+-[A-Za-z0-9_-]{6,}\.[a-z0-9]+|src\/assets\/[^?]+\.[a-z0-9]+)(?:\?.*)?$/;

const EXT_TO_MIME: Record<string, RegExp> = {
  png: /image\/png/,
  ico: /image\/(x-icon|vnd\.microsoft\.icon)/,
  svg: /image\/svg\+xml/,
  webp: /image\/webp/,
  jpg: /image\/jpe?g/,
  jpeg: /image\/jpe?g/,
  gif: /image\/gif/,
};

function extOf(url: string): string {
  const path = url.split("?")[0]!.split("#")[0]!;
  const dot = path.lastIndexOf(".");
  return dot >= 0 ? path.slice(dot + 1).toLowerCase() : "";
}

function parseIconHrefsFromHtml(html: string): string[] {
  const out = new Set<string>();
  // Cheap, framework-free <link> extraction from raw SSR HTML.
  const linkRe = /<link\b[^>]*>/gi;
  for (const tag of html.match(linkRe) ?? []) {
    const rel = /\brel\s*=\s*"([^"]+)"|\brel\s*=\s*'([^']+)'/i.exec(tag);
    const relVal = (rel?.[1] ?? rel?.[2] ?? "").toLowerCase();
    if (
      ![
        "icon",
        "apple-touch-icon",
        "apple-touch-icon-precomposed",
        "shortcut icon",
        "mask-icon",
      ].includes(relVal)
    ) {
      continue;
    }
    const href = /\bhref\s*=\s*"([^"]+)"|\bhref\s*=\s*'([^']+)'/i.exec(tag);
    const hrefVal = href?.[1] ?? href?.[2];
    if (hrefVal) out.add(hrefVal);
  }
  return Array.from(out);
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
  test("any icon link injected after hydration matches SSR status/content-type/Cache-Control", async ({
    page,
    playwright,
    baseURL,
  }) => {
    expect(baseURL).toBeTruthy();

    // -----------------------------------------------------------------
    // 1. SSR snapshot — fetch raw HTML (no JS) and extract icon hrefs.
    // -----------------------------------------------------------------
    const ssrCtx = await playwright.request.newContext({ baseURL });
    const ssrResp = await ssrCtx.get("/", {
      headers: { "Cache-Control": "no-cache" },
    });
    expect(ssrResp.status(), "SSR GET / status").toBe(200);
    const ssrHtml = await ssrResp.text();
    const ssrHrefs = parseIconHrefsFromHtml(ssrHtml)
      .map((h) => normalizeUrl(h, baseURL!))
      .filter((u): u is string => !!u);
    expect(ssrHrefs.length, "SSR HTML should declare icon links").toBeGreaterThan(0);

    // Capture SSR Cache-Control baseline. We expect every SSR icon URL
    // to share the same Cache-Control (e.g. `public, max-age=31536000,
    // immutable` for hashed assets); if SSR itself disagrees, that's a
    // separate problem and we surface it.
    const ssrHeaders = new Map<string, { contentType: string; cacheControl: string }>();
    for (const url of ssrHrefs) {
      const h = await fetchIcon(ssrCtx, url);
      expect(h.status, `SSR icon ${url} status`).toBe(200);
      ssrHeaders.set(url, { contentType: h.contentType, cacheControl: h.cacheControl });
    }
    await ssrCtx.dispose();

    const ssrCacheControls = new Set(
      Array.from(ssrHeaders.values()).map((h) => h.cacheControl),
    );
    expect(
      ssrCacheControls.size,
      `SSR icons disagree on Cache-Control: ${JSON.stringify([...ssrCacheControls])}`,
    ).toBe(1);
    const expectedCacheControl = [...ssrCacheControls][0]!;

    // -----------------------------------------------------------------
    // 2. Hydrated snapshot — load the page with JS, wait for hydration
    //    and an extra settle window, then read the live <head>.
    // -----------------------------------------------------------------
    await page.goto("/", { waitUntil: "networkidle" });
    // Extra settle: post-hydration effects (theme/locale icon swap,
    // SW registration mutating <head>) typically run in the first tick.
    await page.waitForTimeout(750);

    const hydratedHrefs = await page.evaluate((selectors) => {
      const out = new Set<string>();
      for (const sel of selectors) {
        document.querySelectorAll<HTMLLinkElement>(sel).forEach((el) => {
          const href = el.getAttribute("href");
          if (href) out.add(href);
        });
      }
      return Array.from(out);
    }, ICON_LINK_SELECTORS);

    const hydratedUrls = hydratedHrefs
      .map((h) => normalizeUrl(h, baseURL!))
      .filter((u): u is string => !!u);

    // -----------------------------------------------------------------
    // 3. Diff: anything in hydrated but not SSR is hydration-injected.
    // -----------------------------------------------------------------
    const ssrSet = new Set(ssrHrefs);
    const injected = hydratedUrls.filter((u) => !ssrSet.has(u));

    console.log(
      `[icon-hydration] SSR: ${ssrHrefs.length}, hydrated: ${hydratedUrls.length}, injected: ${injected.length}`,
    );
    if (injected.length) {
      console.log("[icon-hydration] injected URLs:\n  " + injected.join("\n  "));
    }

    // No injected links → spec passes trivially. We still want the test
    // to exist so a future hydration-side icon swap can't slip past
    // without re-running these contracts.
    if (injected.length === 0) {
      test.info().annotations.push({
        type: "note",
        description: "No hydration-injected icon links detected — assertions vacuous but contract enforced.",
      });
      return;
    }

    // -----------------------------------------------------------------
    // 4. Validate each injected icon against the SSR contract.
    // -----------------------------------------------------------------
    const failures: string[] = [];
    const ctx = await playwright.request.newContext({ baseURL });
    try {
      for (const url of injected) {
        // (a) URL shape: Vite-managed asset.
        const relPath = new URL(url).pathname + (new URL(url).search || "");
        if (!VITE_ASSET_RE.test(relPath)) {
          failures.push(`${url}: not a Vite-managed asset path`);
          continue;
        }

        // (b) Fetch and check status + content-type + Cache-Control.
        const h = await fetchIcon(ctx, url);

        if (h.status !== 200) {
          failures.push(`${url}: status ${h.status}, expected 200`);
          continue;
        }

        const ext = extOf(url);
        const mimeRe = EXT_TO_MIME[ext];
        if (!mimeRe) {
          failures.push(`${url}: unknown icon extension ".${ext}"`);
        } else if (!mimeRe.test(h.contentType)) {
          failures.push(
            `${url}: content-type "${h.contentType}" does not match extension .${ext}`,
          );
        }

        if (h.cacheControl !== expectedCacheControl) {
          failures.push(
            `${url}: Cache-Control "${h.cacheControl}" ≠ SSR baseline "${expectedCacheControl}"`,
          );
        }
      }
    } finally {
      await ctx.dispose();
    }

    expect(failures, "hydration-injected icon validation failures").toEqual([]);
  });
});
