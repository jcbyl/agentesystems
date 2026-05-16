import { test, expect } from "@playwright/test";

/**
 * Cross-browser favicon + touch-icon verification.
 *
 * Each project (chromium-favicon / firefox-favicon / webkit-favicon) runs the
 * same assertions:
 *   1. Hard reload "/" with `Cache-Control: no-cache` (bypasses HTTP cache).
 *   2. Expected <link rel="..."> tags are present in the SSR HTML.
 *   3. Every icon asset returns 200 + correct MIME + non-trivial body, also
 *      requested with `no-cache` to simulate Cmd/Ctrl+Shift+R.
 *   4. The manifest declares both `purpose=any` and `purpose=maskable` icons.
 *
 * One-time install: `npx playwright install chromium firefox webkit`
 * Run: `npx playwright test tests/visual/favicon.spec.ts`
 */

type IconAsset = {
  path: string;
  expectedMime: RegExp;
  minBytes: number;
};

const ICON_ASSETS: IconAsset[] = [
  { path: "/favicon-16.png", expectedMime: /image\/png/, minBytes: 300 },
  { path: "/favicon-32.png", expectedMime: /image\/png/, minBytes: 500 },
  { path: "/apple-touch-icon.png", expectedMime: /image\/png/, minBytes: 5_000 },
  { path: "/icon-192.png", expectedMime: /image\/png/, minBytes: 2_000 },
  { path: "/icon-512.png", expectedMime: /image\/png/, minBytes: 10_000 },
  { path: "/icon-maskable-192.png", expectedMime: /image\/png/, minBytes: 2_000 },
  { path: "/icon-maskable-512.png", expectedMime: /image\/png/, minBytes: 10_000 },
  {
    path: "/manifest.webmanifest",
    expectedMime: /application\/(manifest\+json|json)/,
    minBytes: 100,
  },
];

const EXPECTED_LINK_SELECTORS = [
  'link[rel="icon"][type="image/svg+xml"]',
  'link[rel="icon"][type="image/png"][sizes="32x32"][href="/favicon-32.png"]',
  'link[rel="icon"][type="image/png"][sizes="16x16"][href="/favicon-16.png"]',
  'link[rel="apple-touch-icon"][href="/apple-touch-icon.png"]',
  'link[rel="manifest"][href="/manifest.webmanifest"]',
];

test.describe("favicon & touch icon (cross-browser, hard reload)", () => {
  test.beforeEach(async ({ context }) => {
    // Simulate a hard reload: bypass HTTP cache for every request.
    await context.setExtraHTTPHeaders({
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    });
  });

  test("emits expected favicon/manifest <link> tags in SSR HTML", async ({ page }) => {
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(response?.status(), "GET / should be 200").toBe(200);

    for (const selector of EXPECTED_LINK_SELECTORS) {
      await expect(
        page.locator(selector),
        `missing head tag: ${selector}`,
      ).toHaveCount(1);
    }
  });

  test("serves every icon asset with 200 + correct MIME after hard reload", async ({
    page,
    baseURL,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    for (const asset of ICON_ASSETS) {
      const resp = await page.request.get(`${baseURL}${asset.path}`, {
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      });
      expect(resp.status(), `${asset.path} status`).toBe(200);
      const ct = resp.headers()["content-type"] ?? "";
      expect(ct, `${asset.path} content-type`).toMatch(asset.expectedMime);
      const body = await resp.body();
      expect(
        body.byteLength,
        `${asset.path} body size`,
      ).toBeGreaterThanOrEqual(asset.minBytes);
    }
  });

  test("manifest declares both 'any' and 'maskable' icons", async ({ page, baseURL }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const resp = await page.request.get(`${baseURL}/manifest.webmanifest`);
    expect(resp.status()).toBe(200);
    const manifest = (await resp.json()) as {
      icons: { sizes: string; purpose?: string }[];
    };
    const purposes = new Set(
      manifest.icons.flatMap((i) => (i.purpose ?? "any").split(/\s+/)),
    );
    expect(purposes.has("any"), "manifest has a purpose=any icon").toBe(true);
    expect(purposes.has("maskable"), "manifest has a purpose=maskable icon").toBe(true);
  });

  test("favicon is actually requested by the browser on load", async ({ page }) => {
    const iconRequests: string[] = [];
    page.on("request", (req) => {
      const url = req.url();
      if (/\/(favicon-\d+\.png|apple-touch-icon\.png|manifest\.webmanifest)$/.test(url)) {
        iconRequests.push(new URL(url).pathname);
      }
    });
    await page.goto("/", { waitUntil: "networkidle" });
    // At minimum a PNG favicon OR the SVG data-URI should resolve; PNG fallback
    // is what Safari/Firefox use, so we expect at least one PNG icon request.
    expect(
      iconRequests.some((p) => /favicon-\d+\.png|apple-touch-icon\.png/.test(p)),
      `expected a PNG icon request, saw: ${JSON.stringify(iconRequests)}`,
    ).toBe(true);
  });
});