import { test, expect } from "@playwright/test";

/**
 * Head-tag language/locale reconciliation.
 *
 * Asserts that after the i18n provider hydrates and picks a language
 * (see src/lib/i18n.tsx → detectInitialLang), the rendered <head>
 * carries the matching:
 *
 *   - <html lang="…">                          (en | es)
 *   - <meta property="og:locale">              (en_US | es_US)
 *   - <meta property="og:locale:alternate">    (the other one)
 *
 * Covers the three input paths into detectInitialLang:
 *
 *   1. browser locale only (no storage, no cookie)
 *   2. localStorage["agente-lang"]   (explicit user choice — must win)
 *   3. runtime toggle via useI18n().setLang
 *
 * Social crawlers read og:locale to choose a translation; a stale
 * locale here means a Spanish visitor shares a card that advertises
 * en_US, so this is a regression-critical invariant.
 */

type Expected = { lang: "en" | "es"; ogLocale: string; ogAlternate: string };

const EN: Expected = { lang: "en", ogLocale: "en_US", ogAlternate: "es_US" };
const ES: Expected = { lang: "es", ogLocale: "es_US", ogAlternate: "en_US" };

async function readHead(page: import("@playwright/test").Page) {
  return page.evaluate(() => ({
    htmlLang: document.documentElement.lang,
    ogLocale:
      document.head
        .querySelector('meta[property="og:locale"]')
        ?.getAttribute("content") ?? null,
    ogAlternate:
      document.head
        .querySelector('meta[property="og:locale:alternate"]')
        ?.getAttribute("content") ?? null,
  }));
}

async function expectHead(
  page: import("@playwright/test").Page,
  exp: Expected,
) {
  await expect
    .poll(async () => (await readHead(page)).htmlLang.toLowerCase(), {
      timeout: 5000,
    })
    .toMatch(new RegExp(`^${exp.lang}\\b`, "i"));
  await expect
    .poll(async () => (await readHead(page)).ogLocale, { timeout: 5000 })
    .toBe(exp.ogLocale);
  await expect
    .poll(async () => (await readHead(page)).ogAlternate, { timeout: 5000 })
    .toBe(exp.ogAlternate);
}

// ---------------------------------------------------------------------------
// 1. Browser-locale-driven detection on a fresh context.
// ---------------------------------------------------------------------------
for (const { label, locale, expected } of [
  { label: "EN browser → en_US head", locale: "en-US", expected: EN },
  { label: "ES browser → es_US head", locale: "es-MX", expected: ES },
] as const) {
  test.describe(label, () => {
    test.use({ locale });

    test(`/, /demo, /real-estate all expose ${expected.ogLocale}`, async ({
      page,
      context,
    }) => {
      await context.clearCookies();
      await page.addInitScript(() => {
        try { localStorage.clear(); } catch {}
        try { sessionStorage.clear(); } catch {}
      });

      for (const path of ["/", "/demo", "/real-estate"] as const) {
        const res = await page.goto(path, { waitUntil: "networkidle" });
        expect(res?.status(), `GET ${path}`).toBe(200);
        await expectHead(page, expected);
      }
    });
  });
}

// ---------------------------------------------------------------------------
// 2. Stored preference wins over browser locale.
// ---------------------------------------------------------------------------
test.describe("stored preference overrides browser locale in head", () => {
  test.use({ locale: "es-MX" });

  test("ES browser + stored EN → head reports en_US / es_US alternate", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      try { localStorage.setItem("agente-lang", "en"); } catch {}
    });
    const res = await page.goto("/", { waitUntil: "networkidle" });
    expect(res?.status()).toBe(200);
    await expectHead(page, EN);
  });
});

test.describe("stored ES on EN browser flips head to es_US", () => {
  test.use({ locale: "en-US" });

  test("EN browser + stored ES → head reports es_US / en_US alternate", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      try { localStorage.setItem("agente-lang", "es"); } catch {}
    });
    const res = await page.goto("/", { waitUntil: "networkidle" });
    expect(res?.status()).toBe(200);
    await expectHead(page, ES);
  });
});

// ---------------------------------------------------------------------------
// 3. Runtime toggle — flipping language at runtime must rewrite the head
// tags without a page reload (social crawlers cache the first paint, but
// SPA navigations and in-app share buttons read live DOM).
// ---------------------------------------------------------------------------
test.describe("runtime toggle rewrites head tags in place", () => {
  test.use({ locale: "en-US" });

  test("EN → ES toggle updates html[lang] + og:locale + alternate", async ({
    page,
  }) => {
    const res = await page.goto("/", { waitUntil: "networkidle" });
    expect(res?.status()).toBe(200);
    await expectHead(page, EN);

    // Flip via the same storage path the in-app toggle uses, then fire
    // the custom event so listeners pick it up without a reload.
    await page.evaluate(() => {
      localStorage.setItem("agente-lang", "es");
      window.dispatchEvent(
        new CustomEvent("agente-lang-change", { detail: "es" }),
      );
    });
    await expectHead(page, ES);

    await page.evaluate(() => {
      localStorage.setItem("agente-lang", "en");
      window.dispatchEvent(
        new CustomEvent("agente-lang-change", { detail: "en" }),
      );
    });
    await expectHead(page, EN);
  });
});