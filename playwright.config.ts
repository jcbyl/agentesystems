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
    { name: "w900", use: { ...devices["Desktop Chrome"], viewport: { width: 900, height: 1200 } } },
    { name: "w768", use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1200 } } },
    { name: "w640", use: { ...devices["Desktop Chrome"], viewport: { width: 640, height: 1200 } } },
    { name: "w375", use: { ...devices["Desktop Chrome"], viewport: { width: 375, height: 1200 } } },
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