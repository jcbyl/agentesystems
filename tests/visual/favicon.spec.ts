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

  test("manifest declares the full canonical icon set and each src resolves to the hashed asset at the declared pixel size", async ({
    page,
    baseURL,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const resp = await page.request.get(`${baseURL}/manifest.webmanifest`, {
      headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
    });
    expect(resp.status()).toBe(200);

    const manifest = (await resp.json()) as {
      icons: { src: string; sizes: string; type?: string; purpose?: string }[];
    };

    // Canonical set the manifest MUST declare. Keyed by `sizes|purpose`.
    const REQUIRED = [
      { sizes: "16x16", purpose: "any" },
      { sizes: "32x32", purpose: "any" },
      { sizes: "192x192", purpose: "any" },
      { sizes: "512x512", purpose: "any" },
      { sizes: "192x192", purpose: "maskable" },
      { sizes: "512x512", purpose: "maskable" },
    ] as const;

    const have = new Map(
      manifest.icons.map((i) => [`${i.sizes}|${i.purpose ?? "any"}`, i] as const),
    );
    for (const req of REQUIRED) {
      const key = `${req.sizes}|${req.purpose}`;
      expect(have.has(key), `manifest missing icon ${key}`).toBe(true);
      const icon = have.get(key)!;
      expect(icon.type, `manifest icon ${key} type`).toBe("image/png");
      expect(
        icon.src,
        `manifest icon ${key} src not Vite-managed: ${icon.src}`,
      ).toMatch(VITE_ASSET_RE);
    }

    // Resolve every declared icon and assert the browser actually gets a 200
    // image/png whose intrinsic pixel dimensions match the declared sizes
    // attribute — i.e. the hashed URL points at the canonical asset.
    for (const icon of manifest.icons) {
      const [wStr, hStr] = icon.sizes.split("x");
      const w = Number(wStr);
      const h = Number(hStr);
      const url = icon.src.startsWith("http") ? icon.src : `${baseURL}${icon.src}`;

      const assetResp = await page.request.get(url, {
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      });
      expect(assetResp.status(), `${icon.src} status`).toBe(200);
      expect(
        assetResp.headers()["content-type"] ?? "",
        `${icon.src} content-type`,
      ).toMatch(/image\/png/);

      await page.setContent(
        `<!doctype html><html><body><img id="i" src="${url}"></body></html>`,
        { waitUntil: "domcontentloaded" },
      );
      const dims = await page.evaluate(async () => {
        const img = document.getElementById("i") as HTMLImageElement;
        if (!img.complete) {
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error("img load failed"));
          });
        }
        await img.decode().catch(() => undefined);
        return { w: img.naturalWidth, h: img.naturalHeight };
      });
      expect(dims.w, `${icon.src} natural width`).toBe(w);
      expect(dims.h, `${icon.src} natural height`).toBe(h);
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

  /**
   * Cache-Control + content-type contract for every canonical icon URL.
   *
   * Two policy classes live in `src/server.ts`:
   *
   *   • Fingerprinted assets under `/assets/<name>-<hash>.<ext>` (the icons
   *     that ship in production) MUST be served with
   *     `public, max-age=31536000, immutable` so Safari/Chrome stop
   *     revalidating them after the first hit.
   *
   *   • Stable canonical endpoints — `/favicon.ico`, `/manifest.webmanifest`,
   *     and `/api/icon-fallback/*` — MUST be served with
   *     `public, max-age=300, must-revalidate` so an icon swap propagates
   *     within 5 minutes without manual cache-busting.
   *
   * In dev, Vite serves `/src/assets/*` without long-cache headers — that
   * branch is allowed to skip the immutable assertion (the prod build is
   * what ships). The 200 + content-type assertions still apply in both.
   */
  test("canonical icon URLs return 200 with correct content-type + Cache-Control", async ({
    page,
    baseURL,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // Collect every fingerprinted icon href surfaced by the SSR HTML.
    const linkedHrefs = await page
      .locator(
        'link[rel="icon"][type="image/png"], link[rel="apple-touch-icon"]',
      )
      .evaluateAll((els) =>
        els
          .map((el) => el.getAttribute("href"))
          .filter((h): h is string => !!h),
      );
    expect(linkedHrefs.length).toBeGreaterThanOrEqual(3);

    // Pull the manifest's icon srcs too — those are the same canonical URLs
    // the PWA install path consumes.
    const manifestResp = await page.request.get(
      `${baseURL}/manifest.webmanifest`,
      { headers: { "Cache-Control": "no-cache", Pragma: "no-cache" } },
    );
    expect(manifestResp.status()).toBe(200);
    const manifest = (await manifestResp.json()) as {
      icons: { src: string }[];
    };
    const manifestHrefs = manifest.icons.map((i) => i.src);

    // Fingerprinted asset contract: 200 + image/png + immutable long-cache.
    const fingerprinted = [...new Set([...linkedHrefs, ...manifestHrefs])];
    for (const href of fingerprinted) {
      const url = href.startsWith("http") ? href : `${baseURL}${href}`;
      const resp = await page.request.get(url, {
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      });
      expect(resp.status(), `${href} status`).toBe(200);
      const contentType = resp.headers()["content-type"] ?? "";
      expect(contentType, `${href} content-type`).toMatch(
        /image\/(png|svg\+xml)/,
      );

      const cacheControl = resp.headers()["cache-control"] ?? "";
      const isFingerprinted = /\/assets\/[^/]+-[A-Za-z0-9_-]{6,}\./.test(
        new URL(url).pathname,
      );
      if (isFingerprinted) {
        expect(
          cacheControl,
          `${href} should be immutable long-cached`,
        ).toMatch(/max-age=\d{6,}/);
        expect(cacheControl, `${href} should be immutable`).toContain(
          "immutable",
        );
      }
    }

    // Stable canonical endpoints contract: 200/302 + short cache w/ revalidate.
    const shortCached: { url: string; expectContentType: RegExp; expectStatus: number[] }[] = [
      {
        url: `${baseURL}/manifest.webmanifest`,
        expectContentType: /application\/(manifest\+json|json)/,
        expectStatus: [200],
      },
      {
        url: `${baseURL}/favicon.ico`,
        // /favicon.ico in this app redirects to the canonical hashed asset.
        expectContentType: /image\/|text\/html/,
        expectStatus: [200, 301, 302, 307, 308],
      },
      {
        url: `${baseURL}/apple-touch-icon.png`,
        expectContentType: /image\/|text\/html/,
        expectStatus: [200, 301, 302, 307, 308],
      },
      {
        url: `${baseURL}/apple-touch-icon-precomposed.png`,
        expectContentType: /image\/|text\/html/,
        expectStatus: [200, 301, 302, 307, 308],
      },
    ];

    for (const { url, expectContentType, expectStatus } of shortCached) {
      const resp = await page.request.fetch(url, {
        method: "GET",
        maxRedirects: 0,
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      });
      expect(
        expectStatus,
        `${url} status ${resp.status()} not in ${JSON.stringify(expectStatus)}`,
      ).toContain(resp.status());

      const cacheControl = resp.headers()["cache-control"] ?? "";
      expect(cacheControl, `${url} cache-control`).toMatch(/public/);
      expect(cacheControl, `${url} cache-control max-age`).toMatch(
        /max-age=300\b/,
      );
      expect(cacheControl, `${url} cache-control must-revalidate`).toMatch(
        /must-revalidate/,
      );

      if (resp.status() === 200) {
        expect(
          resp.headers()["content-type"] ?? "",
          `${url} content-type`,
        ).toMatch(expectContentType);
      } else {
        // Redirect: assert the Location points at a fingerprinted asset and
        // following it returns 200 + image/* with the immutable long-cache.
        const location = resp.headers()["location"] ?? "";
        expect(location, `${url} redirect location`).toMatch(
          /\/assets\/[^/]+-[A-Za-z0-9_-]{6,}\.[a-z0-9]+|\/src\/assets\//,
        );
        const followed = await page.request.get(
          location.startsWith("http") ? location : `${baseURL}${location}`,
          { headers: { "Cache-Control": "no-cache", Pragma: "no-cache" } },
        );
        expect(followed.status(), `${url} -> ${location} status`).toBe(200);
        expect(
          followed.headers()["content-type"] ?? "",
          `${url} -> ${location} content-type`,
        ).toMatch(/image\//);
      }
    }
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

  /**
   * Per-size assertions for the 16x16 and 32x32 PNG favicons.
   *
   * For each declared size we verify, after a hard reload:
   *   1. Exactly one <link rel="icon" type="image/png" sizes="NxN"> exists.
   *   2. Its href is Vite-managed (fingerprinted in prod, /src/assets/ in dev).
   *   3. The href resolves to 200 + image/png + non-trivial body.
   *   4. The PNG's intrinsic pixel dimensions match the declared sizes attr.
   *   5. After a second hard reload, the link's href is stable (same hash)
   *      AND a fresh fetch with `Cache-Control: no-cache` still returns 200
   *      with byte-identical content — proving the post-reload icon update
   *      path works without 404s or content drift.
   */
  for (const size of [16, 32] as const) {
    test(`favicon-${size} link tag + asset update correctly after hard reload`, async ({
      page,
      baseURL,
    }) => {
      const selector = `link[rel="icon"][type="image/png"][sizes="${size}x${size}"]`;

      // First load.
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await expect(
        page.locator(selector),
        `expected exactly one ${selector}`,
      ).toHaveCount(1);

      const firstHref = await page.locator(selector).getAttribute("href");
      expect(firstHref, `${selector} href`).toBeTruthy();
      expect(firstHref!, `${selector} href is Vite-managed`).toMatch(
        VITE_ASSET_RE,
      );

      const fetchIcon = async (href: string) => {
        const url = href.startsWith("http") ? href : `${baseURL}${href}`;
        const resp = await page.request.get(url, {
          headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
        });
        expect(resp.status(), `${href} status`).toBe(200);
        expect(
          resp.headers()["content-type"] ?? "",
          `${href} content-type`,
        ).toMatch(/image\/png/);
        const body = await resp.body();
        expect(body.byteLength, `${href} body size`).toBeGreaterThan(100);
        return body;
      };

      const firstBody = await fetchIcon(firstHref!);

      // Intrinsic dimensions must match the declared `sizes` attribute.
      const dims = await page.evaluate(
        ({ sel }) =>
          new Promise<{ w: number; h: number }>((resolve, reject) => {
            const link = document.querySelector(sel) as HTMLLinkElement | null;
            if (!link?.href) return reject(new Error("link missing href"));
            const img = new Image();
            img.onload = () =>
              resolve({ w: img.naturalWidth, h: img.naturalHeight });
            img.onerror = () => reject(new Error(`failed to decode ${link.href}`));
            img.src = link.href;
          }),
        { sel: selector },
      );
      expect(dims.w, `${selector} natural width`).toBe(size);
      expect(dims.h, `${selector} natural height`).toBe(size);

      // Hard reload (beforeEach sets no-cache headers) — link must still be
      // present, href must remain Vite-managed, asset must still serve 200,
      // and content must be byte-identical to the pre-reload fetch.
      await page.reload({ waitUntil: "domcontentloaded" });
      await expect(
        page.locator(selector),
        `${selector} after hard reload`,
      ).toHaveCount(1);

      const secondHref = await page.locator(selector).getAttribute("href");
      expect(secondHref, `${selector} href after reload`).toBeTruthy();
      expect(secondHref!, `${selector} href stable across reload`).toBe(
        firstHref!,
      );

      const secondBody = await fetchIcon(secondHref!);
      expect(
        secondBody.equals(firstBody),
        `${selector} bytes stable across hard reload`,
      ).toBe(true);
    });
  }

  /**
   * Legacy icon paths (e.g. /favicon.ico, /apple-touch-icon.png) must redirect
   * to a canonical Vite-managed asset in **exactly one hop**. Regressions to
   * guard against:
   *
   *   1. Legacy path → another legacy path (e.g. /favicon.ico → /favicon.png)
   *      — that double-hops because the second legacy path also redirects.
   *   2. Chains longer than 1 hop (legacy → legacy → asset, or worse).
   *   3. Self-redirect loops.
   *
   * We disable automatic redirect following and assert each response is a
   * 302 whose Location points straight at a non-legacy, Vite-managed URL
   * that itself returns 200 (terminal — no further redirect).
   */
  const LEGACY_ICON_PATHS = [
    "/favicon.ico",
    "/favicon.png",
    "/favicon-16.png",
    "/favicon-32.png",
    "/apple-touch-icon.png",
    "/apple-touch-icon-precomposed.png",
    "/icon-192.png",
    "/icon-512.png",
  ] as const;

  // Anything that LEGACY_ICON_PATHS itself matches is, by definition,
  // another legacy path — redirecting there would create a multi-hop chain.
  const LEGACY_PATH_RE =
    /^\/(?:favicon(?:-[\w-]*)?\.(?:png|ico|svg)|apple-touch-icon(?:-precomposed)?(?:-[\w-]*)?\.png|icon-[\w-]+\.png)$/i;

  for (const legacyPath of LEGACY_ICON_PATHS) {
    test(`legacy ${legacyPath} → single-hop redirect to canonical asset`, async ({
      request,
      baseURL,
    }) => {
      // Hop 1: legacy path. Do NOT follow redirects automatically.
      const first = await request.get(`${baseURL}${legacyPath}`, {
        maxRedirects: 0,
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      });
      expect(
        first.status(),
        `${legacyPath} should 302, got ${first.status()}`,
      ).toBe(302);

      const location = first.headers()["location"];
      expect(location, `${legacyPath} missing Location header`).toBeTruthy();

      // Normalize to a pathname we can pattern-match against.
      const targetUrl = new URL(location!, baseURL!);
      expect(
        targetUrl.pathname,
        `${legacyPath} redirected to itself (loop)`,
      ).not.toBe(legacyPath);
      expect(
        targetUrl.pathname,
        `${legacyPath} redirected to another legacy path: ${targetUrl.pathname}`,
      ).not.toMatch(LEGACY_PATH_RE);
      // Must redirect into the Vite-managed asset namespace
      // (prod `/assets/*-<hash>.*` or dev `/src/assets/icons/*`).
      expect(
        targetUrl.pathname,
        `${legacyPath} redirected outside Vite asset namespace: ${targetUrl.pathname}`,
      ).toMatch(VITE_ASSET_RE);

      // Hop 2 must be terminal: 200 with no further Location.
      const second = await request.get(targetUrl.toString(), {
        maxRedirects: 0,
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      });
      expect(
        second.status(),
        `${legacyPath} → ${targetUrl.pathname} should be terminal 200, got ${second.status()}`,
      ).toBe(200);
      expect(
        second.headers()["location"],
        `${legacyPath} chain longer than 1 hop (second response has Location)`,
      ).toBeFalsy();
    });
  }

  /**
   * Per-path assertions that pin each legacy filename to the *specific*
   * canonical fingerprinted asset it should redirect to (not just "some
   * Vite-managed URL"). The canonical targets are discovered at runtime
   * from the rendered <link> tags and the manifest, so the test stays
   * green across hash changes but fails loudly if a legacy alias starts
   * pointing at the wrong size (e.g. /favicon-16.png → 32x32 asset) or
   * stops resolving to the Apple-style icon for unsized aliases.
   */
  test("each legacy icon path redirects to its expected canonical fingerprinted target", async ({
    page,
    request,
    baseURL,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const linkHref = async (sel: string) => {
      const href = await page.locator(sel).first().getAttribute("href");
      expect(href, `missing href for ${sel}`).toBeTruthy();
      return new URL(href!, baseURL!).pathname;
    };

    const favicon16 = await linkHref(
      'link[rel="icon"][type="image/png"][sizes="16x16"]',
    );
    const favicon32 = await linkHref(
      'link[rel="icon"][type="image/png"][sizes="32x32"]',
    );
    const appleTouch = await linkHref('link[rel="apple-touch-icon"]');

    const manifestResp = await request.get(`${baseURL}/manifest.webmanifest`, {
      headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
    });
    expect(manifestResp.status()).toBe(200);
    const manifest = (await manifestResp.json()) as {
      icons: { src: string; sizes: string; purpose?: string }[];
    };
    const findIcon = (sizes: string) => {
      const icon = manifest.icons.find(
        (i) =>
          i.sizes === sizes &&
          (i.purpose ?? "any").split(/\s+/).includes("any"),
      );
      expect(icon, `manifest missing purpose=any ${sizes} icon`).toBeTruthy();
      return new URL(icon!.src, baseURL!).pathname;
    };
    const icon192 = findIcon("192x192");
    const icon512 = findIcon("512x512");

    const expected: Record<string, string> = {
      "/favicon.ico": appleTouch,
      "/favicon.png": appleTouch,
      "/favicon-16.png": favicon16,
      "/favicon-32.png": favicon32,
      "/apple-touch-icon.png": appleTouch,
      "/apple-touch-icon-precomposed.png": appleTouch,
      "/icon-192.png": icon192,
      "/icon-512.png": icon512,
    };

    for (const [legacyPath, expectedPath] of Object.entries(expected)) {
      const resp = await request.get(`${baseURL}${legacyPath}`, {
        maxRedirects: 0,
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      });
      expect(resp.status(), `${legacyPath} status`).toBe(302);
      const location = resp.headers()["location"];
      expect(location, `${legacyPath} Location header`).toBeTruthy();
      const actualPath = new URL(location!, baseURL!).pathname;
      expect(
        actualPath,
        `${legacyPath} should redirect to ${expectedPath}, got ${actualPath}`,
      ).toBe(expectedPath);

      // Redirect itself must be short-cached with revalidation so legacy
      // aliases can be re-pointed without clients pinning a stale target.
      const cacheControl = resp.headers()["cache-control"] ?? "";
      expect(
        cacheControl.toLowerCase().replace(/\s+/g, ""),
        `${legacyPath} Cache-Control on 302`,
      ).toBe("public,max-age=300,must-revalidate");

      // Follow-up: the canonical target must serve a real PNG (200 + image/png).
      const followUp = await request.get(`${baseURL}${actualPath}`, {
        maxRedirects: 0,
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      });
      expect(
        followUp.status(),
        `${legacyPath} → ${actualPath} follow-up status`,
      ).toBe(200);
      expect(
        followUp.headers()["content-type"] ?? "",
        `${legacyPath} → ${actualPath} content-type`,
      ).toMatch(/image\/png/);
      const followBody = await followUp.body();
      expect(
        followBody.byteLength,
        `${legacyPath} → ${actualPath} body size`,
      ).toBeGreaterThan(100);
    }
  });

  /**
   * Safari/iOS auto-probes legacy apple-touch-icon filenames
   * (`/apple-touch-icon-152x152.png`, `/apple-touch-icon-180x180.png`,
   * `/apple-touch-icon-precomposed.png`, etc.) ONLY when the document
   * doesn't declare an explicit `<link rel="apple-touch-icon">` for the
   * size it wants. We declared explicit entries for 152, 167, 180 and a
   * `apple-touch-icon-precomposed` link in `__root.tsx` precisely so
   * those probes never happen.
   *
   * This test enforces both halves of that contract:
   *
   *   1. **Declaration**: each size Safari probes (152, 167, 180) is
   *      present in the SSR HTML as a fingerprinted, Vite-managed
   *      `<link rel="apple-touch-icon">`, plus a
   *      `<link rel="apple-touch-icon-precomposed">` for pre-iOS 7.
   *      If a future edit drops one of these, Safari will resume
   *      probing the matching legacy filename — fail loudly here.
   *
   *   2. **Observation**: across the full page load (including
   *      `networkidle`), the browser never issues a request whose
   *      pathname looks like a legacy apple-touch-icon probe
   *      (`/apple-touch-icon*.png` or `/apple-touch-icon-precomposed*.png`).
   *      The only acceptable apple-touch-icon requests are for the
   *      canonical Vite-managed asset that our `<link>` tags actually
   *      point at — never an unhashed root-level filename.
   */
  test("no Safari-style legacy apple-touch-icon probes occur on page load", async ({
    page,
  }) => {
    // (2) Record every request before navigation so we don't miss the
    // early head-resolved icon fetches.
    const probeRequests: string[] = [];
    const LEGACY_APPLE_PROBE_RE =
      /^\/apple-touch-icon(?:-precomposed)?(?:-\d+x\d+)?\.png$/i;
    page.on("request", (req) => {
      const { pathname } = new URL(req.url());
      if (LEGACY_APPLE_PROBE_RE.test(pathname)) {
        probeRequests.push(pathname);
      }
    });

    await page.goto("/", { waitUntil: "networkidle" });

    // (1) Declaration contract.
    const declared = await page
      .locator(
        'link[rel="apple-touch-icon"], link[rel="apple-touch-icon-precomposed"]',
      )
      .evaluateAll((els) =>
        els.map((el) => ({
          rel: el.getAttribute("rel"),
          sizes: el.getAttribute("sizes"),
          href: el.getAttribute("href"),
        })),
      );

    const hasRelSize = (rel: string, sizes: string | null) =>
      declared.some(
        (d) =>
          d.rel === rel &&
          (sizes === null ? true : d.sizes === sizes) &&
          !!d.href &&
          VITE_ASSET_RE.test(d.href),
      );

    expect(
      hasRelSize("apple-touch-icon", "152x152"),
      "missing fingerprinted apple-touch-icon 152x152 — Safari will probe /apple-touch-icon-152x152.png",
    ).toBe(true);
    expect(
      hasRelSize("apple-touch-icon", "167x167"),
      "missing fingerprinted apple-touch-icon 167x167 — Safari will probe /apple-touch-icon-167x167.png",
    ).toBe(true);
    expect(
      hasRelSize("apple-touch-icon", "180x180"),
      "missing fingerprinted apple-touch-icon 180x180 — Safari will probe /apple-touch-icon-180x180.png",
    ).toBe(true);
    expect(
      hasRelSize("apple-touch-icon-precomposed", null),
      "missing fingerprinted apple-touch-icon-precomposed — old Safari will probe /apple-touch-icon-precomposed.png",
    ).toBe(true);

    // (2) Observation contract — no legacy probe requests fired.
    expect(
      probeRequests,
      `unexpected legacy apple-touch-icon probe requests: ${JSON.stringify(
        probeRequests,
      )}`,
    ).toEqual([]);
  });
});