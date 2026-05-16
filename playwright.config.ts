import { defineConfig, devices } from "@playwright/test";

/**
 * Visual regression config for the comparison table.
 * Run: `npx playwright test` (first run records baselines; later runs diff).
 * Update baselines: `npx playwright test --update-snapshots`.
 * Requires browsers: `npx playwright install chromium` (one-time).
 */
export default defineConfig({
  testDir: "./tests/visual",
  fullyParallel: true,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  expect: {
    // Allow tiny anti-aliasing drift without flakes.
    toHaveScreenshot: { maxDiffPixelRatio: 0.005, animations: "disabled" },
  },
  use: {
    baseURL: "http://localhost:8080",
    deviceScaleFactor: 1,
    colorScheme: "dark",
  },
  webServer: {
    command: "bun run dev",
    url: "http://localhost:8080",
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    // Per-viewport visual-regression projects. Smoke + favicon specs run
    // under dedicated projects below so they don't snapshot 4×.
    { name: "w900", testIgnore: [/favicon\.spec\.ts/, /real-estate-smoke\.spec\.ts/, /lang-autodetect\.spec\.ts/, /a11y\.spec\.ts/, /icon-link-redirects\.spec\.ts/, /icon-link-hydration\.spec\.ts/], use: { ...devices["Desktop Chrome"], viewport: { width: 900, height: 1200 } } },
    { name: "w768", testIgnore: [/favicon\.spec\.ts/, /real-estate-smoke\.spec\.ts/, /lang-autodetect\.spec\.ts/, /a11y\.spec\.ts/, /icon-link-redirects\.spec\.ts/, /icon-link-hydration\.spec\.ts/], use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1200 } } },
    { name: "w640", testIgnore: [/favicon\.spec\.ts/, /real-estate-smoke\.spec\.ts/, /lang-autodetect\.spec\.ts/, /a11y\.spec\.ts/, /icon-link-redirects\.spec\.ts/, /icon-link-hydration\.spec\.ts/], use: { ...devices["Desktop Chrome"], viewport: { width: 640, height: 1200 } } },
    { name: "w375", testIgnore: [/favicon\.spec\.ts/, /real-estate-smoke\.spec\.ts/, /lang-autodetect\.spec\.ts/, /a11y\.spec\.ts/, /icon-link-redirects\.spec\.ts/, /icon-link-hydration\.spec\.ts/], use: { ...devices["Desktop Chrome"], viewport: { width: 375, height: 1200 } } },
    // Fast runtime-error smoke. Runs once at a desktop viewport.
    {
      name: "smoke",
      testMatch: /(real-estate-smoke|lang-autodetect)\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } },
    },
    // Accessibility audit (axe-core, WCAG 2.1 A + AA). Runs once at desktop.
    {
      name: "a11y",
      testMatch: /a11y\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } },
    },
    // Icon-link redirect stability: every redirecting icon URL must
    // resolve to the same hashed asset on every reload.
    {
      name: "icon-redirects",
      testMatch: /icon-link-redirects\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } },
    },
    // Hydration-injected icon links must match SSR icons' status,
    // content-type, and Cache-Control.
    {
      name: "icon-hydration",
      testMatch: /icon-link-hydration\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } },
    },
    // Cross-browser favicon/touch-icon checks (see tests/visual/favicon.spec.ts).
    // Requires: `npx playwright install chromium firefox webkit`.
    {
      name: "chromium-favicon",
      testMatch: /favicon\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox-favicon",
      testMatch: /favicon\.spec\.ts/,
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit-favicon",
      testMatch: /favicon\.spec\.ts/,
      use: { ...devices["Desktop Safari"] },
    },
  ],
});