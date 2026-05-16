import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Accessibility checks for the marketing pages.
 *
 * Uses axe-core (same engine as Lighthouse's a11y category) with WCAG 2.1
 * A + AA rule sets. We fail the build on any violation in these tags so
 * regressions in headings, contrast, ARIA labels, and landmarks block CI.
 */

const MARKETING_PAGES = [
  { path: "/", name: "home" },
  { path: "/real-estate", name: "real-estate" },
];

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

for (const { path, name } of MARKETING_PAGES) {
  test(`a11y: ${name} (${path}) has no WCAG A/AA violations`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("pageerror", (e) => consoleErrors.push(String(e)));

    await page.goto(path, { waitUntil: "networkidle" });
    // Wait for hydration / hero animation to settle so axe sees final DOM.
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(500);

    // Exactly one <main> landmark and one <h1>.
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);

    const results = await new AxeBuilder({ page })
      .withTags(WCAG_TAGS)
      // Disable rules that are noisy on animated marketing pages and
      // already covered by visual review:
      //   - "region": every node in <body> must live inside a landmark.
      //     We already assert <main> exists; full-bleed decorative
      //     wrappers outside <main> are intentional.
      .disableRules([])
      .analyze();

    if (results.violations.length) {
      const summary = results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.slice(0, 3).map((n) => n.target),
      }));
      console.log("axe violations:\n" + JSON.stringify(summary, null, 2));
    }

    expect(results.violations, "axe-core WCAG violations").toEqual([]);
    expect(consoleErrors, "uncaught page errors").toEqual([]);
  });
}
