import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useI18n } from "@/lib/i18n";
import { demoUrl, demoUrlFromForm, type DemoFormPayload } from "@/lib/demo-link";
import { ogFallbackPair } from "@/lib/og-fallback";

const ORIGIN = "https://agentesystems.lovable.app";
const URL = `${ORIGIN}/demo`;
const TITLE_EN = "Book a Demo — Agente.Systems · Bilingual EN/ES AI Agents";
const DESC_EN =
  "See Agente live: bilingual EN/ES AI agents for real estate, construction, solar, and medical teams. WhatsApp-native, live in 24 hours. Pick a time or message us directly.";
const DESC_ES =
  "Mira Agente en vivo: agentes IA bilingües EN/ES para bienes raíces, construcción, solar y consultas médicas. Nativo en WhatsApp, en vivo en 24 horas. Agenda una hora o escríbenos.";
// Seeded 1200×630 fallback rendered at build time by
// scripts/gen-og-fallbacks.mjs (public/og-fallback/demo.png). Used so
// /demo gets a unique share preview instead of inheriting the
// sitewide og-default card.
const OG = ogFallbackPair("demo");

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: TITLE_EN },
      { name: "description", content: `${DESC_EN} | ${DESC_ES}` },
      { property: "og:title", content: TITLE_EN },
      { property: "og:description", content: DESC_EN },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { property: "og:locale", content: "en_US" },
      { property: "og:locale:alternate", content: "es_US" },
      { property: "og:image", content: OG.url },
      { property: "og:image:secure_url", content: OG.secureUrl },
      { property: "og:image:type", content: OG.type },
      { property: "og:image:width", content: OG.width },
      { property: "og:image:height", content: OG.height },
      { property: "og:image:alt", content: "Book a demo of Agente.Systems — bilingual EN/ES AI agents" },
      { name: "twitter:title", content: TITLE_EN },
      { name: "twitter:description", content: DESC_EN },
      { name: "twitter:image", content: OG.url },
      { name: "twitter:image:alt", content: "Book a demo of Agente.Systems — bilingual EN/ES AI agents" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: DemoPage,
});

const VERTICALS = [
  { value: "real-estate", en: "Real estate", es: "Bienes raíces" },
  { value: "construction", en: "Construction", es: "Construcción" },
  { value: "solar", en: "Solar", es: "Solar" },
  { value: "medical", en: "Medical", es: "Médica" },
  { value: "beauty", en: "Beauty & wellness", es: "Belleza y bienestar" },
  { value: "other", en: "Other", es: "Otro" },
];

function DemoPage() {
  const { t, lang } = useI18n();
  const [form, setForm] = useState<DemoFormPayload>({
    name: "",
    company: "",
    vertical: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof DemoFormPayload>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name?.trim()) return;
    const url = demoUrlFromForm(lang, form);
    setSubmitted(true);
    // Open in a new tab so the user keeps the confirmation state on /demo.
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const labelCls = "block text-[12px] font-mono font-semibold tracking-[.14em] uppercase mb-2";
  const inputCls =
    "w-full px-4 py-3 rounded-lg bg-[rgba(244,237,227,.04)] border border-[var(--rule)] text-[var(--cream)] text-[15px] placeholder:text-[rgba(244,237,227,.35)] focus:outline-none focus:border-[var(--coral)] transition-colors";

  return (
    <div className="min-h-screen">
      <SiteNav />
      <section className="px-7 py-[80px]">
        <div className="max-w-[920px] mx-auto">
          <div className="text-center mb-12">
            <div className="font-mono text-[11px] font-semibold tracking-[.16em] uppercase text-[var(--coral)] mb-3.5">
              {t("Book a demo", "Reservar demo")}
            </div>
            <h1
              className="font-extrabold text-[var(--cream)] mx-auto mb-4"
              style={{ fontSize: "clamp(32px,5vw,56px)", lineHeight: 0.98, letterSpacing: "-.028em", maxWidth: "20ch" }}
            >
              {t("See your bilingual agent in action.", "Mira a tu agente bilingüe en acción.")}
            </h1>
            <p className="text-[17px] leading-[1.55] mx-auto" style={{ color: "rgba(244,237,227,.7)", maxWidth: "56ch" }}>
              {t(
                "Tell us a bit about your business and we'll show you exactly how Agente would handle your leads — in English, Spanish, or Spanglish.",
                "Cuéntanos un poco sobre tu negocio y te mostramos exactamente cómo Agente manejaría tus leads — en inglés, español o Spanglish."
              )}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
            <form
              onSubmit={handleSubmit}
              className="p-7 rounded-2xl border border-[var(--rule)]"
              style={{ background: "rgba(244,237,227,.03)" }}
            >
              <div className="grid gap-5">
                <div>
                  <label htmlFor="demo-name" className={labelCls} style={{ color: "var(--soft)" }}>
                    {t("Your name", "Tu nombre")} *
                  </label>
                  <input
                    id="demo-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className={inputCls}
                    placeholder={t("Maria Rodriguez", "María Rodríguez")}
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="demo-company" className={labelCls} style={{ color: "var(--soft)" }}>
                      {t("Company", "Empresa")}
                    </label>
                    <input
                      id="demo-company"
                      type="text"
                      autoComplete="organization"
                      value={form.company}
                      onChange={(e) => update("company", e.target.value)}
                      className={inputCls}
                      placeholder={t("Acme Realty", "Acme Realty")}
                    />
                  </div>
                  <div>
                    <label htmlFor="demo-email" className={labelCls} style={{ color: "var(--soft)" }}>
                      {t("Email", "Correo")}
                    </label>
                    <input
                      id="demo-email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className={inputCls}
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="demo-vertical" className={labelCls} style={{ color: "var(--soft)" }}>
                    {t("Industry", "Industria")}
                  </label>
                  <select
                    id="demo-vertical"
                    value={form.vertical}
                    onChange={(e) => update("vertical", e.target.value)}
                    className={inputCls}
                  >
                    <option value="">{t("Choose one…", "Selecciona…")}</option>
                    {VERTICALS.map((v) => (
                      <option key={v.value} value={lang === "es" ? v.es : v.en}>
                        {lang === "es" ? v.es : v.en}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="demo-message" className={labelCls} style={{ color: "var(--soft)" }}>
                    {t("What would you like to see?", "¿Qué te gustaría ver?")}
                  </label>
                  <textarea
                    id="demo-message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    className={`${inputCls} resize-y`}
                    placeholder={t(
                      "e.g. bilingual lead qualification, after-hours coverage, WhatsApp follow-ups…",
                      "ej. calificación de leads bilingüe, cobertura fuera de horario, seguimientos por WhatsApp…"
                    )}
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-[16px] font-bold text-white transition-transform hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "var(--coral)", boxShadow: "0 4px 20px rgba(232,65,24,.3)" }}
                  disabled={!form.name?.trim()}
                >
                  {t("Open chat to schedule →", "Abrir chat para agendar →")}
                </button>

                {submitted && (
                  <p className="text-[13px] text-center" style={{ color: "var(--softer)" }}>
                    {t(
                      "Chat opened in a new tab. If it didn't, ",
                      "Chat abierto en una nueva pestaña. Si no se abrió, "
                    )}
                    <a
                      href={demoUrlFromForm(lang, form)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-[var(--cream)]"
                    >
                      {t("tap here", "toca aquí")}
                    </a>
                    .
                  </p>
                )}
                <p className="text-[12px] text-center" style={{ color: "var(--softer)" }}>
                  {t(
                    "No spam. We use what you share only to prep your demo.",
                    "Sin spam. Solo usamos lo que compartes para preparar tu demo."
                  )}
                </p>
              </div>
            </form>

            <aside className="flex flex-col gap-4">
              <div className="p-6 rounded-2xl border border-[var(--rule)]" style={{ background: "rgba(244,237,227,.03)" }}>
                <div className="font-mono text-[11px] font-semibold tracking-[.14em] uppercase mb-3" style={{ color: "var(--coral)" }}>
                  {t("Skip the form", "Salta el formulario")}
                </div>
                <p className="text-[14px] leading-[1.55] mb-4" style={{ color: "rgba(244,237,227,.75)" }}>
                  {t(
                    "Prefer to just message us? Open WhatsApp with a prefilled intro and pick a time live.",
                    "¿Prefieres escribirnos directo? Abre WhatsApp con un mensaje listo y agenda una hora en vivo."
                  )}
                </p>
                <a
                  href={demoUrl(lang)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl text-[15px] font-bold text-[var(--cream)] border border-[var(--rule)] transition-colors hover:bg-[rgba(244,237,227,.08)]"
                >
                  {t("Open WhatsApp", "Abrir WhatsApp")}
                </a>
              </div>

              <div className="p-6 rounded-2xl border border-[var(--rule)]" style={{ background: "rgba(244,237,227,.03)" }}>
                <div className="font-mono text-[11px] font-semibold tracking-[.14em] uppercase mb-3" style={{ color: "var(--coral)" }}>
                  {t("Or call", "O llama")}
                </div>
                <a
                  href="tel:+17878100749"
                  className="block text-[20px] font-extrabold text-[var(--cream)] hover:text-[var(--coral)] transition-colors"
                  style={{ letterSpacing: "-.02em" }}
                >
                  +1 787 810 0749
                </a>
                <p className="text-[12px] mt-2" style={{ color: "var(--softer)" }}>
                  {t("Mon–Fri · 9am–7pm AST", "Lun–Vie · 9am–7pm AST")}
                </p>
              </div>

              <ul className="text-[13px] leading-[1.6] px-2" style={{ color: "rgba(244,237,227,.65)" }}>
                <li>· {t("30-minute live walkthrough", "Recorrido en vivo de 30 minutos")}</li>
                <li>· {t("Built on your real lead flow", "Basado en tu flujo de leads real")}</li>
                <li>· {t("EN / ES / Spanglish demoed", "Demo en EN / ES / Spanglish")}</li>
                <li>· {t("No commitment, no slides", "Sin compromiso, sin slides")}</li>
              </ul>
            </aside>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}