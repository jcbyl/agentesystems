import { test, expect } from "@playwright/test";

/**
 * Visual regression for the /real-estate vertical landing page.
 *
 * Locks the rendered page against a per-viewport baseline so layout/copy
 * regressions surface as a failing diff in CI. The test:
 *
 *   1. Forces EN locale via localStorage so copy is deterministic across
 *      machines (Accept-Language defaults differ between CI and dev).
 *   2. Kills CSS transitions/animations so framer-motion entrances don't
 *      add timing jitter.
 *   3. Waits for fonts + lazy images to settle before snapshotting.
 *   4. Takes a full-page screenshot per viewport project (w375..w900) and
 *      diffs it against `real-estate-<project>.png`.
 *
 * Recording baselines: `bun run test:visual:update`
 * Running locally:     `bun run test:visual`
 */
test.describe("/real-estate page layout", () => {
  test("matches baseline at this viewport width", async ({ page }, testInfo) => {
    await page.goto("/real-estate", { waitUntil: "domcontentloaded" });

    await page.addStyleTag({
      content: `
        *,*::before,*::after{
          animation-duration:0s !important;
          animation-delay:0s !important;
          transition-duration:0s !important;
          transition-delay:0s !important;
          scroll-behavior:auto !important;
        }
      `,
    });

    // Pin locale + any user-toggled view state so copy/layout is stable.
    await page.evaluate(() => {
      try { localStorage.setItem("agente-lang", "en"); } catch {}
      try { localStorage.setItem("agente-compare-view", "lindy"); } catch {}
    });
    await page.reload({ waitUntil: "domcontentloaded" });

    // Wait for web fonts so glyph metrics are stable.
    await page.evaluate(() => document.fonts?.ready);

    // Force any lazy/below-the-fold imagery to load by scrolling end-to-end,
    // then return to top so the screenshot starts at the page header.
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let y = 0;
        const step = window.innerHeight;
        const tick = () => {
          window.scrollTo(0, y);
          y += step;
          if (y < document.body.scrollHeight) {
            requestAnimationFrame(tick);
          } else {
            window.scrollTo(0, 0);
            resolve();
          }
        };
        tick();
      });
    });

    // Let layout settle after the scroll-prime + any whileInView triggers.
    await page.waitForTimeout(200);

    await expect(page).toHaveScreenshot(`real-estate-${testInfo.project.name}.png`, {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
});