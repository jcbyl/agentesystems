import { test, expect } from "@playwright/test";

/**
 * Browser-language auto-detection.
 *
 * Detection chain (see src/lib/i18n.tsx → detectInitialLang):
 *   1. localStorage["agente-lang"]            (explicit user choice — wins)
 *   2. cookie "agente-lang"                   (carried across sessions)
 *   3. navigator.language.startsWith("es") → "es", else "en"
 *
 * This spec exercises (3) by spawning a fresh browser context per locale
 * with no storage state, and asserts the rendered copy + <html lang>
 * reflect the detected locale. It also pins (1) by writing the storage
 * key directly and confirming it overrides the browser locale, so a
 * regression in the precedence order surfaces immediately.
 *
 * Why Playwright's `locale` instead of just `Accept-Language`?
 * `navigator.language` is set from the browser's launch locale, which
 * Playwright exposes via `context.locale`. The `Accept-Language` header
 * piggy-backs on the same setting so SSR sees a matching header.
 */

const CASES = [
  {
    label: "English browser (en-US)",
    locale: "en-US",
    expectedLang: "en",
    expectedHtmlLangPrefix: "en",
    homeMarker: /How it works/i,
    realEstateMarker: /How it works/i,
    oppositeMarker: /Cómo funciona/i,
  },
  {
    label: "Spanish browser (es-MX)",
    locale: "es-MX",
    expectedLang: "es",
    expectedHtmlLangPrefix: "es",
    homeMarker: /Cómo funciona/i,
    realEstateMarker: /Cómo funciona/i,
    oppositeMarker: /How it works/i,
  },
] as const;

for (const c of CASES) {
  test.describe(`auto-detect: ${c.label}`, () => {
    // Fresh browser context per locale — no storage, fresh navigator.language.
    test.use({ locale: c.locale });

    for (const path of ["/", "/real-estate"] as const) {
      test(`renders ${c.expectedLang.toUpperCase()} copy on ${path} with no prior storage`, async ({
        page,
        context,
      }) => {
        // Belt + braces: clear any storage that might have leaked from prior
        // tests sharing the same worker (Playwright contexts are fresh, but
        // localStorage is per-origin so we wipe on the actual origin too).
        await context.clearCookies();
        await page.addInitScript(() => {
          try { localStorage.clear(); } catch {}
          try { sessionStorage.clear(); } catch {}
        });

        const response = await page.goto(path, { waitUntil: "networkidle" });
        expect(response?.status(), `GET ${path}`).toBe(200);

        // navigator.language must reflect the launch locale — sanity check
        // so a failure points at the test rig, not the app.
        const navLang = await page.evaluate(() => navigator.language);
        expect(navLang.toLowerCase()).toMatch(
          new RegExp(`^${c.expectedLang}\\b`, "i"),
        );

        // Persisted lang storage should be absent on first load (auto-detect
        // path only fires when there's nothing stored).
        const stored = await page.evaluate(() =>
          localStorage.getItem("agente-lang"),
        );
        expect(stored, "agente-lang should NOT be pre-seeded").toBeNull();

        // Localized copy is present, opposite-locale copy is not.
        const marker = path === "/" ? c.homeMarker : c.realEstateMarker;
        await expect(
          page.locator("body").getByText(marker).first(),
          `${c.expectedLang} marker on ${path}`,
        ).toBeVisible();
        await expect(
          page.locator("body").getByText(c.oppositeMarker),
          `opposite-locale marker should NOT appear on ${path}`,
        ).toHaveCount(0);

        // <html lang> reflects detected locale after hydration.
        await expect
          .poll(
            async () =>
              (await page.locator("html").getAttribute("lang"))?.toLowerCase() ??
              "",
            { timeout: 5000 },
          )
          .toMatch(new RegExp(`^${c.expectedHtmlLangPrefix}\\b`, "i"));
      });
    }
  });
}

/**
 * localStorage overrides browser language.
 *
 * Pins the cross-cutting invariant: a user who explicitly picked a language
 * (which writes localStorage) keeps that language even when their browser
 * locale would auto-detect to the other one.
 */
test.describe("auto-detect: stored preference overrides browser locale", () => {
  test.use({ locale: "es-MX" });

  test("ES browser + stored EN → renders EN", async ({ page }) => {
    await page.addInitScript(() => {
      try { localStorage.setItem("agente-lang", "en"); } catch {}
    });

    const response = await page.goto("/", { waitUntil: "networkidle" });
    expect(response?.status()).toBe(200);

    await expect(
      page.locator("body").getByText(/How it works/i).first(),
    ).toBeVisible();
    await expect(page.locator("body").getByText(/Cómo funciona/i)).toHaveCount(0);

    await expect
      .poll(
        async () =>
          (await page.locator("html").getAttribute("lang"))?.toLowerCase() ?? "",
        { timeout: 5000 },
      )
      .toMatch(/^en\b/);
  });
});