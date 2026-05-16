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

test.describe("/real-estate smoke", () => {
  test("renders #features, #lifecycle, #pricing with no runtime errors", async ({
    page,
  }) => {
    const { pageErrors, consoleErrors } = attachErrorCollectors(page);

    const response = await page.goto("/real-estate", { waitUntil: "networkidle" });
    expect(response?.status(), "GET /real-estate").toBe(200);

    // Force EN so any locale-conditional copy lookups don't throw.
    await page.evaluate(() => {
      try { localStorage.setItem("agente-lang", "en"); } catch {}
    });
    await page.reload({ waitUntil: "networkidle" });

    for (const id of ["features", "lifecycle", "pricing"] as const) {
      const section = page.locator(`section#${id}`);
      await expect(section, `section#${id} should exist`).toHaveCount(1);
      await section.scrollIntoViewIfNeeded();
      await expect(section, `section#${id} should be visible`).toBeVisible();
      // Sanity-check non-empty rendered text so an empty shell doesn't pass.
      const text = (await section.innerText()).trim();
      expect(text.length, `section#${id} text length`).toBeGreaterThan(20);
    }

    assertNoRuntimeErrors(pageErrors, consoleErrors, "/real-estate");
  });
});

test.describe("/ home smoke — VS Lindy table, How it works, Verticals grid", () => {
  test("renders #compare, #how, #verticals with no runtime errors", async ({
    page,
  }) => {
    const { pageErrors, consoleErrors } = attachErrorCollectors(page);

    const response = await page.goto("/", { waitUntil: "networkidle" });
    expect(response?.status(), "GET /").toBe(200);

    await page.evaluate(() => {
      try { localStorage.setItem("agente-lang", "en"); } catch {}
      try { localStorage.setItem("agente-compare-view", "lindy"); } catch {}
    });
    await page.reload({ waitUntil: "networkidle" });

    for (const id of ["compare", "how", "verticals"] as const) {
      const section = page.locator(`section#${id}`);
      await expect(section, `section#${id} should exist`).toHaveCount(1);
      await section.scrollIntoViewIfNeeded();
      await expect(section, `section#${id} should be visible`).toBeVisible();
      const text = (await section.innerText()).trim();
      expect(text.length, `section#${id} text length`).toBeGreaterThan(20);
    }

    // VS Lindy table specifically should render a comparison row labeled "Lindy".
    await expect(
      page.locator("section#compare").getByText(/Lindy/).first(),
      "VS Lindy table should mention Lindy",
    ).toBeVisible();

    // Verticals grid should expose multiple vertical cards (Real Estate, etc.).
    const verticalsCards = page
      .locator("section#verticals a, section#verticals article, section#verticals [role='article']");
    expect(
      await verticalsCards.count(),
      "verticals grid should render at least 3 cards",
    ).toBeGreaterThanOrEqual(3);

    assertNoRuntimeErrors(pageErrors, consoleErrors, "/");
  });
});