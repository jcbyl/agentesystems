import { test, expect } from "@playwright/test";

/**
 * Cross-browser favicon + touch-icon verification with fingerprinted assets.
 *
 * Icon hrefs are now Vite-fingerprinted (e.g. `/assets/favicon-32-abc123.png`),
 * so this spec:
 *   1. Reads the actual hrefs from the SSR HTML rather than hardcoding paths.
 *   2. Asserts each href looks fingerprinted (contains `/assets/` + a hash).
 *   3. Fetches every discovered icon with `Cache-Control: no-cache` and checks
 *      200 + correct MIME + non-trivial body.
 *   4. Loads /manifest.webmanifest (a server route) and asserts it declares
 *      both `purpose=any` and `purpose=maskable` icons, and that every icon
 *      `src` is itself fingerprinted.
 *
 * One-time install: `npx playwright install chromium firefox webkit`
 * Run: `npx playwright test tests/visual/favicon.spec.ts`
 */

// A Vite-emitted asset URL looks like `/assets/name-<8+ hex chars>.png`.
// Accept a slightly looser shape so a future build hash format does not break
// the test — the important thing is "not a plain unhashed filename".
const FINGERPRINT_RE = /\/assets\/[^/]+-[A-Za-z0-9_-]{6,}\.[a-z0-9]+$/;

test.describe("favicon & touch icon (cross-browser, hard reload)", () => {
  test.beforeEach(async ({ context }) => {
    // Simulate a hard reload: bypass HTTP cache for every request.
    await context.setExtraHTTPHeaders({
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    });
  });

  test("emits expected favicon/manifest <link> tags with fingerprinted hrefs", async ({
    page,
  }) => {
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(response?.status(), "GET / should be 200").toBe(200);

    // Required link tags by selector (existence only — href is hashed).
    const required = [
      'link[rel="icon"][type="image/svg+xml"]',
      'link[rel="icon"][type="image/png"][sizes="32x32"]',
      'link[rel="icon"][type="image/png"][sizes="16x16"]',
      'link[rel="apple-touch-icon"]',
      'link[rel="manifest"]',
    ];
    for (const selector of required) {
      await expect(
        page.locator(selector),
        `missing head tag: ${selector}`,
      ).toHaveCount(1);
    }

    // PNG favicons + apple-touch-icon hrefs must be fingerprinted.
    const pngHrefs = await page
      .locator(
        'link[rel="icon"][type="image/png"], link[rel="apple-touch-icon"]',
      )
      .evaluateAll((els) =>
        els.map((el) => el.getAttribute("href")).filter((h): h is string => !!h),
      );
    expect(pngHrefs.length).toBeGreaterThanOrEqual(3);
    for (const href of pngHrefs) {
      expect(href, `expected fingerprinted href, got: ${href}`).toMatch(
        FINGERPRINT_RE,
      );
    }

    // Manifest stays at its canonical path (it's a server route).
    const manifestHref = await page
      .locator('link[rel="manifest"]')
      .first()
      .getAttribute("href");
    expect(manifestHref).toBe("/manifest.webmanifest");
  });

  test("fetches every linked icon asset with 200 + correct MIME after hard reload", async ({
    page,
    baseURL,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const hrefs = await page
      .locator(
        'link[rel="icon"][type="image/png"], link[rel="apple-touch-icon"]',
      )
      .evaluateAll((els) =>
        els.map((el) => el.getAttribute("href")).filter((h): h is string => !!h),
      );
    expect(hrefs.length).toBeGreaterThan(0);

    for (const href of hrefs) {
      const url = href.startsWith("http") ? href : `${baseURL}${href}`;
      const resp = await page.request.get(url, {
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      });
      expect(resp.status(), `${href} status`).toBe(200);
      expect(resp.headers()["content-type"] ?? "", `${href} content-type`).toMatch(
        /image\/png/,
      );
      const body = await resp.body();
      expect(body.byteLength, `${href} body size`).toBeGreaterThan(300);
    }
  });

  test("manifest is served, declares any+maskable icons, and uses fingerprinted srcs", async ({
    page,
    baseURL,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const resp = await page.request.get(`${baseURL}/manifest.webmanifest`, {
      headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
    });
    expect(resp.status()).toBe(200);
    expect(resp.headers()["content-type"] ?? "").toMatch(
      /application\/(manifest\+json|json)/,
    );

    const manifest = (await resp.json()) as {
      icons: { src: string; sizes: string; purpose?: string }[];
    };
    const purposes = new Set(
      manifest.icons.flatMap((i) => (i.purpose ?? "any").split(/\s+/)),
    );
    expect(purposes.has("any"), "manifest has a purpose=any icon").toBe(true);
    expect(purposes.has("maskable"), "manifest has a purpose=maskable icon").toBe(
      true,
    );

    for (const icon of manifest.icons) {
      expect(icon.src, `manifest icon ${icon.sizes} not fingerprinted`).toMatch(
        FINGERPRINT_RE,
      );
    }
  });

  test("at least one PNG favicon is actually requested by the browser on load", async ({
    page,
  }) => {
    const iconRequests: string[] = [];
    page.on("request", (req) => {
      const url = req.url();
      if (/\.png(\?|$)/i.test(url) && /\/assets\//.test(url)) {
        iconRequests.push(new URL(url).pathname);
      }
    });
    await page.goto("/", { waitUntil: "networkidle" });
    expect(
      iconRequests.length,
      `expected at least one /assets/*.png request, saw: ${JSON.stringify(
        iconRequests,
      )}`,
    ).toBeGreaterThan(0);
  });
});