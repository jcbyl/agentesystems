import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useI18n } from "@/lib/i18n";
import { demoUrl } from "@/lib/demo-link";
import { ogFallbackPair } from "@/lib/og-fallback";

const ORIGIN = "https://agentesystems.lovable.app";
const URL = `${ORIGIN}/demo`;
const TITLE_EN = "Book a Demo — Agente.Systems · Bilingual EN/ES AI Agents";
const DESC_EN =
  "Try Agente live: bilingual EN/ES AI agents for real estate, construction, solar, and medical teams. WhatsApp-native, live in 24 hours. Start the demo in WhatsApp.";
const DESC_ES =
  "Prueba Agente en vivo: agentes IA bilingües EN/ES para bienes raíces, construcción, solar y consultas médicas. Nativo en WhatsApp, en vivo en 24 horas. Empieza la demo por WhatsApp.";
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

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1s-.8.9-1 1.1c-.2.2-.4.2-.7.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.2-.5s0-.4-.1-.5c-.1-.1-.7-1.7-1-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.5 1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.4c1.4.8 3 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
    </svg>
  );
}

function DemoPage() {
  const { t, lang } = useI18n();
  const wa = demoUrl(lang);

  return (
    <div className="min-h-screen">
      <SiteNav />
      <section className="px-7 py-[100px]" data-cta-location="demo-hero">
        <div className="max-w-[820px] mx-auto text-center">
          <div className="font-mono text-[11px] font-semibold tracking-[.16em] uppercase text-[var(--coral)] mb-3.5">
            {t("Book a demo", "Reservar demo")}
          </div>
          <h1
            className="font-extrabold text-[var(--cream)] mx-auto mb-5"
            style={{ fontSize: "clamp(32px,5vw,56px)", lineHeight: 0.98, letterSpacing: "-.028em", maxWidth: "20ch" }}
          >
            {t("See your bilingual agent in action.", "Mira a tu agente bilingüe en acción.")}
          </h1>
          <p className="text-[17px] leading-[1.55] mx-auto mb-9" style={{ color: "rgba(244,237,227,.7)", maxWidth: "58ch" }}>
            {t(
              "The demo lives where your customers already are: WhatsApp. Tap below to start a live conversation with Agente — ask anything, in English, Spanish, or Spanglish.",
              "La demo vive donde tus clientes ya están: WhatsApp. Toca abajo para empezar una conversación en vivo con Agente — pregunta lo que sea, en inglés, español o Spanglish."
            )}
          </p>

          <div className="flex gap-3 justify-center flex-wrap mb-6">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-[17px] font-bold text-white transition-transform hover:-translate-y-px"
              style={{ background: "var(--coral)", boxShadow: "0 4px 20px rgba(232,65,24,.3)" }}
            >
              <WhatsAppIcon /> {t("Start demo on WhatsApp", "Empezar demo en WhatsApp")}
            </a>
            <a
              href="tel:+17878100749"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-[17px] font-bold text-[var(--cream)] border border-[var(--rule)] transition-transform hover:-translate-y-px"
              style={{ background: "rgba(244,237,227,.08)" }}
            >
              {t("Or call +1 787 810 0749", "O llama +1 787 810 0749")}
            </a>
          </div>

          <p className="font-mono text-[11px] tracking-[.06em]" style={{ color: "var(--softer)" }}>
            {t(
              "NO FORMS  ·  NO CALENDAR INVITE  ·  REAL CONVERSATION IN <2 MIN",
              "SIN FORMULARIOS  ·  SIN INVITACIÓN DE CALENDARIO  ·  CONVERSACIÓN REAL EN <2 MIN"
            )}
          </p>

          <div className="grid gap-4 sm:grid-cols-2 mt-14 text-left">
            {[
              {
                k: t("Why no form?", "¿Por qué sin formulario?"),
                v: t(
                  "Because Agente is the form. The same conversation that books your demo is the one your customers will have when they reach you.",
                  "Porque Agente es el formulario. La misma conversación que reserva tu demo es la que tendrán tus clientes cuando te contacten."
                ),
              },
              {
                k: t("What we'll cover", "Qué cubrimos"),
                v: t(
                  "Your real lead flow, EN/ES handoff, after-hours coverage, and how Agente plugs into WhatsApp + your CRM. ~30 minutes, live.",
                  "Tu flujo real de leads, traspaso EN/ES, cobertura fuera de horario, y cómo Agente se conecta a WhatsApp + tu CRM. ~30 minutos, en vivo."
                ),
              },
              {
                k: t("Mon–Fri · 9am–7pm AST", "Lun–Vie · 9am–7pm AST"),
                v: t(
                  "Outside hours, Agente itself replies and books the slot for you. Same number, same chat.",
                  "Fuera de horario, Agente mismo responde y reserva el espacio. Mismo número, mismo chat."
                ),
              },
              {
                k: t("Prefer to read first?", "¿Prefieres leer primero?"),
                v: (
                  <>
                    {t("Browse vertical pages: ", "Mira las páginas por industria: ")}
                    <Link to="/real-estate" className="underline hover:text-[var(--cream)]">{t("Real estate", "Bienes raíces")}</Link>
                    {" · "}
                    <Link to="/construction" className="underline hover:text-[var(--cream)]">{t("Construction", "Construcción")}</Link>
                    {" · "}
                    <Link to="/solar" className="underline hover:text-[var(--cream)]">Solar</Link>
                  </>
                ),
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border border-[var(--rule)]"
                style={{ background: "rgba(244,237,227,.03)" }}
              >
                <div className="font-mono text-[11px] font-semibold tracking-[.14em] uppercase mb-2" style={{ color: "var(--coral)" }}>
                  {item.k}
                </div>
                <div className="text-[14px] leading-[1.55]" style={{ color: "rgba(244,237,227,.75)" }}>
                  {item.v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
