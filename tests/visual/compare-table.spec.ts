import { test, expect } from "@playwright/test";

/**
 * Visual regression for the comparison table.
 * Validates the 3-col (>=640) and 2-col (<640) layouts plus the
 * spacing-tightened range (<=900) defined in src/styles.css.
 */
test.describe("Comparison table layout", () => {
  test("matches baseline at this viewport width", async ({ page }, testInfo) => {
    await page.goto("/");

    // Disable transitions/animations so screenshots are deterministic.
    await page.addStyleTag({
      content: `
        *,*::before,*::after{
          animation-duration:0s !important;
          animation-delay:0s !important;
          transition-duration:0s !important;
          transition-delay:0s !important;
        }
      `,
    });

    // Force EN locale so baselines are stable across machines/timezones.
    await page.evaluate(() => {
      try { localStorage.setItem("agente-lang", "en"); } catch {}
      try { localStorage.setItem("agente-compare-view", "lindy"); } catch {}
    });
    await page.reload();

    const compare = page.locator("#compare");
    await compare.scrollIntoViewIfNeeded();
    await expect(compare).toBeVisible();

    // Give framer-motion whileInView a tick to settle (animations disabled, so instant).
    await page.waitForTimeout(150);

    await expect(compare).toHaveScreenshot(`compare-${testInfo.project.name}.png`, {
      // Mask any element that might change between runs (none today, but future-proof).
      maxDiffPixelRatio: 0.005,
    });
  });
});