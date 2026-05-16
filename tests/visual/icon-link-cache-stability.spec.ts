import { type APIRequestContext } from "@playwright/test";
import { test, expect } from "./_helpers/icon-diagnostics";

/**
 * Icon-link Cache-Control stability.
 *
 * Each icon URL discovered from /'s SSR HTML (plus the manifest's
 * icons[].src) is re-fetched twice in two different cache postures:
 *
 *   posture A: a plain GET (no special request headers)
 *   posture B: a GET that sends `Cache-Control: no-cache` + `Pragma: no-cache`
 *
 * Contract:
 *   1. Within a posture, the two back-to-back fetches return the SAME
 *      Cache-Control header (so the server isn't randomly degrading
 *      cacheability between requests).
 *   2. The Cache-Control returned in posture B equals posture A's —
 *      i.e. a client asking for fresh content does NOT cause the
 *      origin to flip its caching policy. Same goes for Content-Type,
 *      ETag, and Vary.
 *   3. Every fetch returns 200.
 *
 * Each fetch uses a fresh `APIRequestContext` and a per-request
 * `X-Cache-Bust` value so connection-level or CDN edge memoisation
 * can't paper over a real header drift.
 */

const ICON_LINK_SELECTORS = [
  'link[rel="icon"]',
  'link[rel="apple-touch-icon"]',
  'link[rel="apple-touch-icon-precomposed"]',
  'link[rel="shortcut icon"]',
  'link[rel="mask-icon"]',
];

// Headers whose drift between fetches would change browser caching behaviour.
const SENSITIVE_HEADERS = ["cache-control", "content-type", "etag", "vary"] as const;
type SensitiveHeader = (typeof SENSITIVE_HEADERS)[number];

type Snapshot = Record<SensitiveHeader, string>;

async function fetchSnapshot(
  request: APIRequestContext,
  url: string,
  posture: "plain" | "no-cache",
): Promise<{ status: number; snapshot: Snapshot }> {
  const headers: Record<string, string> = {
    "X-Cache-Bust": `${Date.now()}-${Math.random()}`,
  };
  if (posture === "no-cache") {
    headers["Cache-Control"] = "no-cache";
    headers["Pragma"] = "no-cache";
  }
  const resp = await request.fetch(url, {
    method: "GET",
    headers,
    failOnStatusCode: false,
  });
  const h = resp.headers();
  const snapshot = Object.fromEntries(
    SENSITIVE_HEADERS.map((k) => [k, h[k] ?? ""]),
  ) as Snapshot;
  return { status: resp.status(), snapshot };
}

function diff(a: Snapshot, b: Snapshot): string[] {
  const out: string[] = [];
  for (const k of SENSITIVE_HEADERS) {
    if (a[k] !== b[k]) out.push(`${k}: "${a[k]}" ≠ "${b[k]}"`);
  }
  return out;
}

test.describe("icon links: Cache-Control stability across reloads & no-cache", () => {
  test("each icon URL returns identical sensitive headers on repeated fetches and under no-cache", async ({
    page,
    playwright,
    baseURL,
    diag,
  }) => {
    expect(baseURL).toBeTruthy();

    // -----------------------------------------------------------------
    // 1. Collect icon URLs from SSR HTML + parsed manifest.
    // -----------------------------------------------------------------
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(response?.status(), "GET / status").toBe(200);

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
        const m = await manifestRes.json();
        if (Array.isArray(m?.icons)) {
          for (const icon of m.icons) {
            if (icon?.src) manifestIconSrcs.push(String(icon.src));
          }
        }
      } catch {
        // not JSON — ignore; manifest shape covered elsewhere
      }
    }

    const candidates = Array.from(
      new Set(
        [...linkHrefs, ...manifestIconSrcs]
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
    // 2. For each URL, take 4 snapshots: plain×2, no-cache×2, each in
    //    a fresh request context. Then assert:
    //      (a) all 4 are 200
    //      (b) plain1 === plain2     (intra-posture stability)
    //      (c) noCache1 === noCache2 (intra-posture stability)
    //      (d) plain1 === noCache1   (no-cache doesn't change headers)
    // -----------------------------------------------------------------
    const failures: string[] = [];

    for (const url of candidates) {
      const snapshots: { posture: "plain" | "no-cache"; status: number; snapshot: Snapshot }[] = [];

      for (const posture of ["plain", "plain", "no-cache", "no-cache"] as const) {
        const ctx = await playwright.request.newContext({ baseURL });
        try {
          const { status, snapshot } = await fetchSnapshot(ctx, url, posture);
          snapshots.push({ posture, status, snapshot });
        } finally {
          await ctx.dispose();
        }
      }

      // (a) status
      for (const s of snapshots) {
        if (s.status !== 200) {
          failures.push(`${url} [${s.posture}]: status ${s.status}, expected 200`);
        }
      }

      const [plain1, plain2, noCache1, noCache2] = snapshots;

      // One row per posture so the table shows whether drift was
      // intra-posture, cross-posture, or both.
      diag.record({
        href: url,
        status: plain1.status,
        contentType: plain1.snapshot["content-type"],
        cacheControl: plain1.snapshot["cache-control"],
        note: "plain #1",
      });
      diag.record({
        href: url,
        status: plain2.status,
        contentType: plain2.snapshot["content-type"],
        cacheControl: plain2.snapshot["cache-control"],
        note: "plain #2",
      });
      diag.record({
        href: url,
        status: noCache1.status,
        contentType: noCache1.snapshot["content-type"],
        cacheControl: noCache1.snapshot["cache-control"],
        note: "no-cache #1",
      });
      diag.record({
        href: url,
        status: noCache2.status,
        contentType: noCache2.snapshot["content-type"],
        cacheControl: noCache2.snapshot["cache-control"],
        note: "no-cache #2",
      });

      // (b) intra-posture: plain
      const d1 = diff(plain1.snapshot, plain2.snapshot);
      if (d1.length) {
        failures.push(
          `${url}: plain fetches returned different headers across reloads:\n  - ` +
            d1.join("\n  - "),
        );
      }
      // (c) intra-posture: no-cache
      const d2 = diff(noCache1.snapshot, noCache2.snapshot);
      if (d2.length) {
        failures.push(
          `${url}: no-cache fetches returned different headers across reloads:\n  - ` +
            d2.join("\n  - "),
        );
      }
      // (d) cross-posture: no-cache must not change the response
      const d3 = diff(plain1.snapshot, noCache1.snapshot);
      if (d3.length) {
        failures.push(
          `${url}: no-cache request changed response headers vs plain:\n  - ` +
            d3.join("\n  - "),
        );
      }
    }

    if (failures.length === 0) {
      console.log(
        `[icon-cache] verified ${candidates.length} URL(s) — Cache-Control stable across reloads and no-cache`,
      );
    }

    expect(failures, "icon Cache-Control stability failures").toEqual([]);
  });
});
