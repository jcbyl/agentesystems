import { type APIRequestContext } from "@playwright/test";
import { test, expect } from "./_helpers/icon-diagnostics";

/**
 * Icon-link redirect stability.
 *
 * Some icon URLs (e.g. legacy `/favicon.ico`, `/apple-touch-icon.png`,
 * locale-aliased manifest icons) are served as 3xx redirects to the
 * actual fingerprinted asset emitted by Vite. If the redirect target
 * ever flips between reloads — because of a non-deterministic build,
 * a stale CDN edge, or a server route that picks an icon at random —
 * browsers will redownload icons on every page load and any service
 * worker cache will thrash.
 *
 * This spec:
 *   1. Loads `/` and collects every icon-ish URL from <link rel="icon">,
 *      <link rel="apple-touch-icon*">, and the parsed /manifest.webmanifest
 *      `icons[].src`.
 *   2. Also probes a few well-known legacy icon paths that are commonly
 *      redirected: /favicon.ico, /apple-touch-icon.png,
 *      /apple-touch-icon-precomposed.png.
 *   3. For each URL: issues an un-followed HEAD/GET to detect a redirect,
 *      then follows it with `maxRedirects > 0` to capture the final
 *      resolved URL.
 *   4. Repeats the resolve 3× with cache-busting headers and a fresh
 *      request context, then asserts every resolution produced the *same*
 *      final URL — i.e. the hashed asset is stable across reloads.
 *
 * URLs that don't redirect (already 200) are skipped — the contract here
 * is specifically "if it redirects, it must redirect to the same place".
 */

const ICON_LINK_SELECTORS = [
  'link[rel="icon"]',
  'link[rel="apple-touch-icon"]',
  'link[rel="apple-touch-icon-precomposed"]',
  'link[rel="shortcut icon"]',
  'link[rel="mask-icon"]',
];

const LEGACY_PROBES = [
  "/favicon.ico",
  "/apple-touch-icon.png",
  "/apple-touch-icon-precomposed.png",
];

const RELOAD_COUNT = 3;

/**
 * Issue a single un-redirected request and, if the response is a 3xx,
 * issue a follow-up that does follow redirects to capture the final URL.
 * Returns `null` when the URL doesn't redirect (so we skip stability
 * checks for non-redirected assets).
 */
async function resolveIfRedirected(
  request: APIRequestContext,
  url: string,
): Promise<{ status: number; finalUrl: string } | null> {
  // First: do NOT follow — see whether the server actually issues a redirect.
  const noFollow = await request.fetch(url, {
    method: "GET",
    maxRedirects: 0,
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      // Cache-bust at the URL layer too so intermediaries can't memoise.
      "X-Cache-Bust": String(Date.now()) + Math.random(),
    },
    failOnStatusCode: false,
  });

  const status = noFollow.status();
  if (status < 300 || status >= 400) {
    // 2xx (no redirect) or 4xx/5xx — not a redirect, skip stability check.
    return null;
  }

  // Second: follow redirects to capture the resolved asset URL.
  const followed = await request.fetch(url, {
    method: "GET",
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      "X-Cache-Bust": String(Date.now()) + Math.random(),
    },
    failOnStatusCode: false,
  });

  expect(
    followed.status(),
    `redirected icon ${url} should resolve to 200 after following`,
  ).toBe(200);

  return { status, finalUrl: followed.url() };
}

test.describe("icon links: redirect stability across reloads", () => {
  test("every redirecting icon URL resolves to the same hashed asset on each reload", async ({
    page,
    playwright,
    baseURL,
    diag,
  }) => {
    expect(baseURL, "playwright baseURL must be set").toBeTruthy();

    // -----------------------------------------------------------------
    // 1. Collect candidate icon URLs from the rendered HTML + manifest.
    // -----------------------------------------------------------------
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(response?.status(), "GET / should be 200").toBe(200);

    const linkHrefs = await page.evaluate((selectors) => {
      const out = new Set<string>();
      for (const sel of selectors) {
        document.querySelectorAll<HTMLLinkElement>(sel).forEach((el) => {
          const href = el.getAttribute("href");
          if (href) out.add(href);
        });
      }
      return Array.from(out);
    }, ICON_LINK_SELECTORS);

    // Read the webmanifest the page declares (fall back to default path).
    const manifestHref =
      (await page.locator('link[rel="manifest"]').first().getAttribute("href")) ??
      "/manifest.webmanifest";

    const manifestUrl = new URL(manifestHref, baseURL!).toString();
    const manifestRes = await page.request.get(manifestUrl, {
      headers: { "Cache-Control": "no-cache" },
      failOnStatusCode: false,
    });

    const manifestIconSrcs: string[] = [];
    if (manifestRes.ok()) {
      try {
        const manifest = await manifestRes.json();
        if (Array.isArray(manifest?.icons)) {
          for (const icon of manifest.icons) {
            if (icon?.src) manifestIconSrcs.push(String(icon.src));
          }
        }
      } catch {
        // Not JSON — skip silently; favicon spec covers manifest shape.
      }
    }

    const candidates = Array.from(
      new Set(
        [...linkHrefs, ...manifestIconSrcs, ...LEGACY_PROBES]
          .map((href) => {
            try {
              return new URL(href, baseURL!).toString();
            } catch {
              return null;
            }
          })
          .filter((u): u is string => !!u && u.startsWith(baseURL!)),
      ),
    );

    expect(candidates.length, "should discover at least one icon URL").toBeGreaterThan(0);

    // -----------------------------------------------------------------
    // 2. For each candidate, classify (redirect vs. direct) and, if it
    //    redirects, resolve it RELOAD_COUNT times in fresh contexts and
    //    assert every resolution matches.
    // -----------------------------------------------------------------
    const redirectingChecked: string[] = [];
    const directSkipped: string[] = [];
    const failures: string[] = [];

    for (const url of candidates) {
      const resolutions: Array<{ status: number; finalUrl: string } | null> = [];

      for (let i = 0; i < RELOAD_COUNT; i++) {
        // Fresh request context per reload so connection-level caches
        // can't paper over a non-deterministic redirect target.
        const ctx = await playwright.request.newContext({ baseURL });
        try {
          resolutions.push(await resolveIfRedirected(ctx, url));
        } finally {
          await ctx.dispose();
        }
      }

      // If the first probe said "not a redirect", all subsequent probes
      // should agree. If they disagree, that itself is a regression.
      const redirectsObserved = resolutions.filter((r) => r !== null);

      // Record one diagnostic row per candidate, capturing whatever we
      // learned. Final URL / status come from the first redirect we
      // observed; "—" means "no redirect" or "no consensus".
      const firstRedirected = redirectsObserved[0];
      diag.record({
        href: url,
        finalUrl: firstRedirected?.finalUrl,
        status: firstRedirected?.status ?? (resolutions.length ? "no-redirect" : ""),
        note:
          redirectsObserved.length === 0
            ? "direct (skipped)"
            : redirectsObserved.length !== RELOAD_COUNT
              ? `flaky: redirected ${redirectsObserved.length}/${RELOAD_COUNT}`
              : Array.from(new Set(redirectsObserved.map((r) => r!.finalUrl))).length === 1
                ? `stable across ${RELOAD_COUNT} reloads`
                : `unstable: ${new Set(redirectsObserved.map((r) => r!.finalUrl)).size} targets`,
      });

      if (redirectsObserved.length === 0) {
        directSkipped.push(url);
        continue;
      }
      if (redirectsObserved.length !== RELOAD_COUNT) {
        failures.push(
          `${url} sometimes redirects and sometimes doesn't ` +
            `(redirected on ${redirectsObserved.length}/${RELOAD_COUNT} reloads)`,
        );
        continue;
      }

      const finals = redirectsObserved.map((r) => r!.finalUrl);
      const unique = Array.from(new Set(finals));
      if (unique.length !== 1) {
        failures.push(
          `${url} resolved to ${unique.length} different targets across ` +
            `${RELOAD_COUNT} reloads:\n  ${unique.join("\n  ")}`,
        );
        continue;
      }

      // Sanity: the resolved URL should look like a fingerprinted asset
      // (contains a hash segment). Lets the test catch a regression where
      // /favicon.ico starts redirecting to itself or to a non-hashed path.
      const final = unique[0]!;
      const fingerprinted = /\/(?:assets|src\/assets)\/[^/?#]+(?:-[A-Za-z0-9_-]{6,})?\.[a-z0-9]+/.test(
        final,
      );
      if (!fingerprinted) {
        failures.push(
          `${url} redirects to a non-Vite-asset URL (${final}); ` +
            `expected /assets/<name>-<hash>.<ext> or /src/assets/...`,
        );
      }

      redirectingChecked.push(`${url} → ${final}`);
    }

    // Helpful breadcrumbs in the test log even on pass.
    console.log(
      `[icon-redirects] direct (skipped): ${directSkipped.length}, ` +
        `redirecting (verified stable): ${redirectingChecked.length}`,
    );
    if (redirectingChecked.length) {
      console.log("[icon-redirects] verified:\n  " + redirectingChecked.join("\n  "));
    }

    expect(failures, "icon redirect stability failures").toEqual([]);
  });
});
