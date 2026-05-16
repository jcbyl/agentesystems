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

// Asset URLs are processed by Vite:
//   • production build → `/assets/<name>-<hash>.<ext>` (truly fingerprinted)
//   • dev server       → `/src/assets/icons/<name>.<ext>` (Vite handles
//     invalidation via HMR, no hash needed)
// Both forms confirm the URL is owned by Vite (not a raw `/public/` path that
// would never bust a stale cache). The hashed prod form is what ships.
const VITE_ASSET_RE =
  /^\/(?:assets\/[^/]+-[A-Za-z0-9_-]{6,}\.[a-z0-9]+|src\/assets\/[^?]+\.[a-z0-9]+)(?:\?.*)?$/;

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
      expect(
        href,
        `expected Vite-managed (fingerprinted in prod) href, got: ${href}`,
      ).toMatch(VITE_ASSET_RE);
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
      expect(
        icon.src,
        `manifest icon ${icon.sizes} src is not Vite-managed: ${icon.src}`,
      ).toMatch(VITE_ASSET_RE);
    }
  });

  test("at least one PNG favicon is actually requested by the browser on load", async ({
    page,
  }) => {
    const iconRequests: string[] = [];
    page.on("request", (req) => {
      const url = req.url();
      // Match both prod (`/assets/*.png`) and dev (`/src/assets/icons/*.png`).
      if (/\.png(\?|$)/i.test(url) && /\/(?:src\/)?assets\//.test(url)) {
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

  test("favicon and apple-touch-icon render correctly after hard reload (screenshot)", async ({
    page,
    baseURL,
    browserName,
  }) => {
    // 1. Load the page so the SSR HTML resolves the fingerprinted hrefs.
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // 2. Force a hard reload (bypassing HTTP cache via beforeEach headers).
    await page.reload({ waitUntil: "domcontentloaded" });

    // 3. Collect the actual hrefs for the 32x32 favicon and apple-touch-icon.
    const targets = await page.evaluate(() => {
      const pick = (sel: string) =>
        (document.querySelector(sel) as HTMLLinkElement | null)?.href ?? null;
      return {
        favicon32: pick(
          'link[rel="icon"][type="image/png"][sizes="32x32"]',
        ),
        appleTouch: pick('link[rel="apple-touch-icon"]'),
      };
    });
    expect(targets.favicon32, "32x32 favicon href").toBeTruthy();
    expect(targets.appleTouch, "apple-touch-icon href").toBeTruthy();

    // 4. For each icon, render it standalone in a deterministic page and
    //    snapshot the rendered pixels. This proves the bytes the browser
    //    actually receives decode to the expected logo image after a hard
    //    reload — not just that the URL returns 200.
    const renderAndSnapshot = async (
      label: string,
      href: string,
      sizePx: number,
    ) => {
      const url = href.startsWith("http") ? href : `${baseURL}${href}`;
      await page.setViewportSize({ width: sizePx, height: sizePx });
      await page.setContent(
        `<!doctype html><html><head><style>
           html,body{margin:0;padding:0;background:#fff;}
           img{display:block;width:${sizePx}px;height:${sizePx}px;
               image-rendering:pixelated;}
         </style></head><body>
           <img id="icon" src="${url}" />
         </body></html>`,
        { waitUntil: "domcontentloaded" },
      );
      // Wait for decode so the screenshot captures the actual pixels.
      await page.evaluate(async () => {
        const img = document.getElementById("icon") as HTMLImageElement;
        if (!img.complete) {
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error("icon failed to load"));
          });
        }
        await img.decode().catch(() => undefined);
      });
      const img = page.locator("#icon");
      await expect(img).toHaveJSProperty("naturalWidth", sizePx);
      await expect(img, `${label} (${browserName}) visual snapshot`).
        toHaveScreenshot(`${label}-${browserName}.png`, {
          maxDiffPixelRatio: 0.02,
          animations: "disabled",
        });
    };

    await renderAndSnapshot("favicon-32", targets.favicon32!, 32);
    await renderAndSnapshot("apple-touch-icon", targets.appleTouch!, 180);
  });
});