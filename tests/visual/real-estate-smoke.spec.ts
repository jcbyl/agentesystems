import { test, expect, type ConsoleMessage } from "@playwright/test";

/**
 * Smoke tests for the real-estate vertical page + the home-page sections
 * that feed it (VS Lindy comparison, How it works, Verticals grid).
 *
 * Goal: catch runtime regressions fast — broken imports, thrown errors in
 * render, missing sections — without the cost of a full pixel-diff suite.
 *
 * For every test we:
 *   1. Subscribe to `pageerror` (uncaught exceptions) and `console` (errors)
 *      BEFORE navigating, so we capture errors thrown during initial render.
 *   2. Navigate and wait for `networkidle`.
 *   3. Assert HTTP 200 and that every required section root exists + is
 *      visible (proves the component tree mounted, didn't crash to an
 *      error boundary, and isn't display:none).
 *   4. Assert zero page errors and zero `console.error` calls — a thrown
 *      error inside a section component will surface here even if React's
 *      error boundary swallows the visual fallout.
 *
 * Filters out known-noisy console errors:
 *   • Favicon/asset 404s during dev (harmless, covered by other suites).
 *   • React DevTools / hydration suggestion logs.
 */

const IGNORED_CONSOLE_PATTERNS = [
  /Download the React DevTools/i,
  /\/favicon\.ico/i,
  /\/apple-touch-icon/i,
];

function attachErrorCollectors(page: import("@playwright/test").Page) {
  const pageErrors: Error[] = [];
  const consoleErrors: string[] = [];

  page.on("pageerror", (err) => pageErrors.push(err));
  page.on("console", (msg: ConsoleMessage) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (IGNORED_CONSOLE_PATTERNS.some((re) => re.test(text))) return;
    consoleErrors.push(text);
  });

  return { pageErrors, consoleErrors };
}

function assertNoRuntimeErrors(
  pageErrors: Error[],
  consoleErrors: string[],
  label: string,
) {
  expect(
    pageErrors,
    `${label}: uncaught page errors\n${pageErrors.map((e) => e.stack ?? e.message).join("\n---\n")}`,
  ).toEqual([]);
  expect(
    consoleErrors,
    `${label}: console.error calls\n${consoleErrors.join("\n---\n")}`,
  ).toEqual([]);
}

/**
 * Locale fixtures.
 *
 *   • `storageLang` is the value the app's i18n layer reads from localStorage
 *     (`agente-lang`). Both routes use this key, so flipping it switches the
 *     entire UI between English and Spanish copy.
 *
 *   • `acceptLanguage` is sent on every request so the server-rendered HTML
 *     and any Accept-Language-keyed responses (e.g. the localized
 *     /manifest.webmanifest) match the client locale on first paint —
 *     otherwise the post-reload locale wouldn't be applied during SSR and
 *     hydration could log warnings.
 *
 *   • `marker` is a copy fragment guaranteed to appear in the rendered DOM
 *     for that locale. Asserting it proves the smoke test really exercised
 *     the localized render path instead of silently falling back to English.
 */
const LOCALES = [
  {
    code: "en",
    storageLang: "en",
    acceptLanguage: "en-US,en;q=0.9",
    home: { marker: /How it works/i },
    realEstate: { marker: /How it works/i },
  },
  {
    code: "es",
    storageLang: "es",
    acceptLanguage: "es-MX,es;q=0.9,en;q=0.5",
    home: { marker: /Cómo funciona/i },
    realEstate: { marker: /Cómo funciona/i },
  },
] as const;

for (const locale of LOCALES) {
  test.describe(`/real-estate smoke [${locale.code}]`, () => {
    test.use({ extraHTTPHeaders: { "Accept-Language": locale.acceptLanguage } });

    test(`renders #features, #lifecycle, #pricing with no runtime errors (${locale.code})`, async ({
      page,
    }) => {
      const { pageErrors, consoleErrors } = attachErrorCollectors(page);

      const response = await page.goto("/real-estate", { waitUntil: "networkidle" });
      expect(response?.status(), "GET /real-estate").toBe(200);

      await page.evaluate((lang) => {
        try { localStorage.setItem("agente-lang", lang); } catch {}
      }, locale.storageLang);
      await page.reload({ waitUntil: "networkidle" });

      for (const id of ["features", "lifecycle", "pricing"] as const) {
        const section = page.locator(`section#${id}`);
        await expect(section, `section#${id} should exist`).toHaveCount(1);
        await section.scrollIntoViewIfNeeded();
        await expect(section, `section#${id} should be visible`).toBeVisible();
        const text = (await section.innerText()).trim();
        expect(text.length, `section#${id} text length`).toBeGreaterThan(20);
      }

      // Prove the localized render path actually ran.
      await expect(
        page.locator("body").getByText(locale.realEstate.marker).first(),
        `${locale.code} marker on /real-estate`,
      ).toBeVisible();

      // Document language attr should match the active locale.
      const htmlLang = await page.locator("html").getAttribute("lang");
      expect(htmlLang ?? "", `<html lang> on /real-estate`).toMatch(
        new RegExp(`^${locale.storageLang}(\\b|-)`, "i"),
      );

      assertNoRuntimeErrors(pageErrors, consoleErrors, `/real-estate [${locale.code}]`);
    });
  });

  test.describe(`/ home smoke — VS Lindy + How it works + Verticals [${locale.code}]`, () => {
    test.use({ extraHTTPHeaders: { "Accept-Language": locale.acceptLanguage } });

    test(`renders #compare, #how, #verticals with no runtime errors (${locale.code})`, async ({
      page,
    }) => {
      const { pageErrors, consoleErrors } = attachErrorCollectors(page);

      const response = await page.goto("/", { waitUntil: "networkidle" });
      expect(response?.status(), "GET /").toBe(200);

      await page.evaluate((lang) => {
        try { localStorage.setItem("agente-lang", lang); } catch {}
        try { localStorage.setItem("agente-compare-view", "lindy"); } catch {}
      }, locale.storageLang);
      await page.reload({ waitUntil: "networkidle" });

      for (const id of ["compare", "how", "verticals"] as const) {
        const section = page.locator(`section#${id}`);
        await expect(section, `section#${id} should exist`).toHaveCount(1);
        await section.scrollIntoViewIfNeeded();
        await expect(section, `section#${id} should be visible`).toBeVisible();
        const text = (await section.innerText()).trim();
        expect(text.length, `section#${id} text length`).toBeGreaterThan(20);
      }

      // "Lindy" is a proper noun and stays untranslated across locales.
      await expect(
        page.locator("section#compare").getByText(/Lindy/).first(),
        "VS Lindy table should mention Lindy",
      ).toBeVisible();

      // Verticals grid should expose multiple vertical cards.
      const verticalsCards = page.locator(
        "section#verticals a, section#verticals article, section#verticals [role='article']",
      );
      expect(
        await verticalsCards.count(),
        "verticals grid should render at least 3 cards",
      ).toBeGreaterThanOrEqual(3);

      // Locale marker — confirms the home page actually rendered in this language.
      await expect(
        page.locator("body").getByText(locale.home.marker).first(),
        `${locale.code} marker on /`,
      ).toBeVisible();

      const htmlLang = await page.locator("html").getAttribute("lang");
      expect(htmlLang ?? "", `<html lang> on /`).toMatch(
        new RegExp(`^${locale.storageLang}(\\b|-)`, "i"),
      );

      assertNoRuntimeErrors(pageErrors, consoleErrors, `/ [${locale.code}]`);
    });
  });
}