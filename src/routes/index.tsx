import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion, MotionConfig } from "framer-motion";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useI18n } from "@/lib/i18n";
import { demoUrl } from "@/lib/demo-link";
import { hreflangLinks } from "@/lib/hreflang";
import ogImageUrl from "@/assets/og-home.jpg";

const ORIGIN = "https://agentesystems.lovable.app";
const OG_IMAGE = `${ORIGIN}${ogImageUrl}`;
const TITLE = "Agente — Bilingual EN/ES AI Agents for SMBs";
const DESC =
  "Industry-expert bilingual EN/ES AI agents for Latino-owned SMBs. WhatsApp-native. Flat pricing. Live in 24 hours. The alternative to Lindy.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:url", content: `${ORIGIN}/` },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:secure_url", content: OG_IMAGE },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Agente.Systems — Bilingual EN/ES AI agents for real estate, construction, solar, and medical teams. WhatsApp-native, live in 24 hours." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "twitter:image:alt", content: "Agente.Systems — Bilingual EN/ES AI agents for real estate, construction, solar, and medical teams. WhatsApp-native, live in 24 hours." },
    ],
    links: [
      { rel: "canonical", href: `${ORIGIN}/` },
      ...hreflangLinks(`${ORIGIN}/`),
    ],
  }),
  component: Home,
});

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
};

function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen">
        <SiteNav />
        <Hero />
        <Stats />
        <Compare />
        <Latino />
        <Verticals />
        <WhyAgente />
        <HowItWorks />
        <Contact />
        <FinalCTA />
        <SiteFooter />
        <StickyMobile />
      </div>
    </MotionConfig>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  const { t, lang } = useI18n();
  const [count, setCount] = useState(1247);

  useEffect(() => {
    setCount(1247 + Math.floor(Math.random() * 50));
    const id = setInterval(() => {
      setCount((n) => n + Math.floor(Math.random() * 3) + 1);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden text-center" style={{ padding: "100px 28px 80px" }}>
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-80px", left: "50%", transform: "translateX(-50%)",
          width: "1200px", height: "700px",
          background:
            "radial-gradient(ellipse at 30% 40%, rgba(232,65,24,.10), transparent 50%), radial-gradient(ellipse at 70% 20%, rgba(232,65,24,.08), transparent 45%), radial-gradient(ellipse at 50% 80%, rgba(232,65,24,.05), transparent 40%)",
        }}
      />
      <div className="relative max-w-[1100px] mx-auto">
        <motion.div {...fadeUp} className="flex flex-col items-center gap-3 mb-7">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[12px] font-semibold"
            style={{ background: "rgba(232,65,24,.12)", border: "1px solid rgba(232,65,24,.25)", color: "var(--coral)" }}
          >
            <span className="w-[7px] h-[7px] bg-[#4ADE80] rounded-full" style={{ animation: "pulse-dot 1.4s ease-in-out infinite" }} />
            <span>
              {count.toLocaleString()} {t("leads answered today", "leads respondidos hoy")}
            </span>
          </div>
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-[11px] font-semibold tracking-[.1em] uppercase"
            style={{ background: "rgba(244,237,227,.07)", border: "1px solid var(--rule)", color: "rgba(244,237,227,.6)" }}
          >
            {t(
              <>The bilingual alternative to <span className="text-[var(--coral)]">Lindy</span> — built for your industry</>,
              <>La alternativa bilingüe a <span className="text-[var(--coral)]">Lindy</span> — construida para tu industria</>
            )}
          </div>
        </motion.div>

        <motion.h1
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.05 }}
          className="font-extrabold text-[var(--cream)] mx-auto mb-5"
          style={{ fontSize: "clamp(44px,7vw,96px)", lineHeight: 0.93, letterSpacing: "-.035em", maxWidth: "17ch" }}
        >
          {t(
            <>The AI agent that <em className="italic text-[var(--coral)]">speaks your industry.</em></>,
            <>El agente de IA que <em className="italic text-[var(--coral)]">habla tu industria.</em></>
          )}
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
          className="mx-auto mb-9 text-[18px] leading-[1.55]"
          style={{ color: "rgba(244,237,227,.7)", maxWidth: "56ch" }}
        >
          {t(
            "Agente deploys AI agents that know your industry cold — codes, regulations, incentives, market rates. WhatsApp-native. EN/ES bilingual from day one. Flat monthly pricing. No credits, no builds, no bullshit. Live in 24 hours.",
            "Agente despliega agentes de IA que conocen tu industria a fondo — códigos, regulaciones, incentivos, tarifas de mercado. Nativo en WhatsApp. Bilingüe EN/ES desde el primer día. Precio mensual fijo. Sin créditos, sin configuraciones, en vivo en 24 horas."
          )}
        </motion.p>

        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }} className="flex gap-3 justify-center flex-wrap mb-4">
          <a
            href={demoUrl(lang)}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-[17px] font-bold text-white transition-transform hover:-translate-y-px"
            style={{ background: "var(--coral)", boxShadow: "0 4px 20px rgba(232,65,24,.3)" }}
          >
            <WhatsAppIcon /> {t("Start free trial →", "Prueba gratis →")}
          </a>
          <a
            href="#compare"
            className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-[17px] font-bold text-[var(--cream)] border border-[var(--rule)] transition-transform hover:-translate-y-px"
            style={{ background: "rgba(244,237,227,.08)" }}
          >
            {t("How we compare", "Cómo nos comparamos")}
          </a>
          <Link
            to="/demo"
            className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-[17px] font-bold text-[var(--cream)] border border-[var(--rule)] transition-transform hover:-translate-y-px"
            style={{ background: "rgba(244,237,227,.08)" }}
          >
            {t("Book a demo", "Reservar demo")}
          </Link>
        </motion.div>

        <div className="flex gap-5 justify-center flex-wrap text-[13px]" style={{ color: "var(--softer)" }}>
          {[
            t("7-day free trial", "7 días gratis"),
            t("No credit card required", "Sin tarjeta de crédito"),
            t("Live in 24 hours", "En vivo en 24 horas"),
            t("Cancel anytime", "Cancela cuando quieras"),
          ].map((s, i) => (
            <span key={i} className="inline-flex gap-1.5 items-center">
              <span className="text-[var(--coral)]">●</span> {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- STATS ---------- */
function Stats() {
  const { t } = useI18n();
  const items = [
    { n: <>4</>, l: t("industries — RE, construction, solar, medical", "industrias — bienes raíces, construcción, solar, médica") },
    { n: <>2<em className="italic text-[var(--coral)]">×</em></>, l: t("languages — EN/ES, every agent, auto-detect", "idiomas — EN/ES, cada agente, detección automática") },
    { n: <>24<em className="italic text-[var(--coral)]">/</em>7</>, l: t("every lead answered, every channel", "cada lead respondido, cada canal") },
    { n: <em className="italic text-[var(--coral)]">∞</em>, l: t("leads per month — flat fee, no credits, no cap", "leads por mes — precio fijo, sin créditos, sin límite") },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 border-y border-[var(--rule)]">
      {items.map((it, i) => (
        <motion.div
          key={i}
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: i * 0.05 }}
          className="p-10 border-r border-[var(--rule)] last:border-r-0"
        >
          <div className="font-extrabold text-[var(--cream)] mb-2" style={{ fontSize: "clamp(36px,5vw,64px)", letterSpacing: "-.04em", lineHeight: 0.95 }}>
            {it.n}
          </div>
          <div className="font-mono text-[10px] tracking-[.1em] uppercase leading-[1.5]" style={{ color: "var(--softer)" }}>
            {it.l}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ---------- COMPARE TABLE ---------- */
function Compare() {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();

  type Cell = { icon: "ok" | "x" | "warn"; text: string };
  type Competitor = { name: string; rows: Cell[] };

  // View toggle: "lindy" = 3-col (Feature · Lindy · Agente)
  //              "all"   = expanded multi-competitor view
  const [view, setView] = useState<"lindy" | "all">("lindy");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("agente-compare-view");
      if (saved === "lindy" || saved === "all") setView(saved);
    } catch {}
  }, []);

  const switchView = (v: "lindy" | "all") => {
    setView(v);
    try { localStorage.setItem("agente-compare-view", v); } catch {}
  };

  const rows: Array<[string, Cell, Cell]> = [
    [t("Language", "Idioma"), { icon: "x", text: t("English only", "Solo inglés") }, { icon: "ok", text: t("EN + ES bilingual, auto-detect", "EN + ES bilingüe, detección automática") }],
    [t("Primary channel", "Canal principal"), { icon: "warn", text: t("iMessage (iOS-first)", "iMessage (solo iOS)") }, { icon: "ok", text: t("WhatsApp + SMS — any device, global", "WhatsApp + SMS — cualquier dispositivo") }],
    [t("Industry knowledge", "Conocimiento de industria"), { icon: "x", text: t("Generic — no industry expertise", "Genérico — sin expertise en tu industria") }, { icon: "ok", text: t("Codes, law, incentives, rates per vertical", "Códigos, leyes, incentivos por industria") }],
    [t("Pricing model", "Modelo de precios"), { icon: "warn", text: t("Credit-based — 18 leads = entire $49/mo plan", "Por créditos — 18 leads agota el plan de $49/mes") }, { icon: "ok", text: t("Flat monthly — unlimited leads", "Precio fijo mensual — leads ilimitados") }],
    [t("Setup", "Configuración"), { icon: "warn", text: t("DIY — you build your own agents", "Lo haces tú — construyes tus propios agentes") }, { icon: "ok", text: t("Done for you — live in 24 hours", "Lo hacemos nosotros — en vivo en 24 horas") }],
    [t("Sales lifecycle", "Ciclo de ventas"), { icon: "x", text: t("Email + calendar only", "Solo correo y calendario") }, { icon: "ok", text: t("Qualify → book → follow-up → review → referral", "Califica → agenda → seguimiento → reseña → referido") }],
    [t("Latino/Hispanic market", "Mercado latino/hispano"), { icon: "x", text: t("Not designed for it", "No está diseñado para esto") }, { icon: "ok", text: t("Native bilingual — the whole point", "Bilingüe nativo — ese es el punto") }],
    [t("Integrations", "Integraciones"), { icon: "warn", text: t("Email, calendar, basic webhooks", "Correo, calendario, webhooks básicos") }, { icon: "ok", text: t("WhatsApp · SMS · CRM · webhooks · portals", "WhatsApp · SMS · CRM · webhooks · portales") }],
    [t("Compliance & privacy", "Cumplimiento y privacidad"), { icon: "x", text: t("No HIPAA, no BAA, generic privacy", "Sin HIPAA, sin BAA, privacidad genérica") }, { icon: "ok", text: t("HIPAA-ready (Grace), BAA available, data stays in-region", "Listo para HIPAA (Grace), BAA disponible, datos en tu región") }],
    [t("Response-time SLA", "SLA de respuesta"), { icon: "warn", text: t("Best-effort — minutes to hours, no guarantee", "Mejor esfuerzo — minutos a horas, sin garantía") }, { icon: "ok", text: t("Under 60s response, 24/7 — guaranteed in writing", "Respuesta en menos de 60s, 24/7 — garantizado por escrito") }],
  ];

  // Stable slugs (EN-derived) for deep-linking — one per row, same order.
  const slugs = [
    "language", "channel", "industry", "pricing", "setup",
    "lifecycle", "latino-market", "integrations", "compliance", "sla",
  ] as const;

  const chipLabels: string[] = [
    t("Language", "Idioma"),
    t("Channel", "Canal"),
    t("Industry", "Industria"),
    t("Pricing", "Precios"),
    t("Setup", "Setup"),
    t("Lifecycle", "Ciclo"),
    t("Latino market", "Mercado latino"),
    t("Integrations", "Integraciones"),
    t("Compliance", "Cumplimiento"),
    t("SLA", "SLA"),
  ];

  const [flashSlug, setFlashSlug] = useState<string | null>(null);
  // Remember the chip that initiated the jump so Escape / Shift+Tab can
  // return focus to the chip group instead of stranding the user mid-table.
  const [lastChipSlug, setLastChipSlug] = useState<string | null>(null);

  const focusChip = (slug: string) => {
    const chip = document.querySelector<HTMLAnchorElement>(
      `a[aria-controls="row-${slug}"]`
    );
    chip?.focus();
  };

  const jumpTo = (slug: string, opts: { fromChip?: boolean } = {}) => {
    const el = document.getElementById(`row-${slug}`);
    if (!el) return;
    // Measure the sticky nav so the highlighted row never slips behind it.
    const nav = document.querySelector("nav");
    const navH = nav ? Math.round(nav.getBoundingClientRect().height) : 0;
    const gap = 24; // breathing room under the header
    const rect = el.getBoundingClientRect();
    const rowTopAbs = window.scrollY + rect.top;
    // Prefer centering, but clamp so the row top stays >= navH + gap from viewport top.
    const visibleH = Math.max(0, window.innerHeight - navH - gap);
    const centered = rowTopAbs - navH - gap - Math.max(0, (visibleH - rect.height) / 2);
    const minTop = rowTopAbs - navH - gap;
    const target = Math.max(0, Math.min(minTop, centered));
    window.scrollTo({ top: target, behavior: reduceMotion ? "auto" : "smooth" });
    try { history.replaceState(null, "", `#row-${slug}`); } catch {}
    setFlashSlug(slug);
    window.setTimeout(() => setFlashSlug((s) => (s === slug ? null : s)), 1600);
    if (opts.fromChip) setLastChipSlug(slug);
    // Move focus to the row so screen readers announce it and keyboard users
    // are placed inside the table. preventScroll keeps our computed offset.
    const focusDelay = reduceMotion ? 0 : 320;
    window.setTimeout(() => {
      el.focus({ preventScroll: true });
    }, focusDelay);
  };

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash.startsWith("row-")) return;
    const slug = hash.slice(4);
    if (!(slugs as readonly string[]).includes(slug)) return;
    const id = window.setTimeout(() => jumpTo(slug), 60);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Competitor data for expanded view. Each rows[] aligns 1:1 with the rows above.
  const lindyCompetitor: Competitor = {
    name: "Lindy",
    rows: rows.map(([, l]) => l),
  };
  const intercomFin: Competitor = {
    name: "Intercom Fin",
    rows: [
      { icon: "warn", text: t("EN + 40 langs (translation)", "EN + 40 idiomas (traducción)") },
      { icon: "warn", text: t("Web chat + email", "Chat web + correo") },
      { icon: "x",    text: t("Generic CS bot", "Bot genérico de soporte") },
      { icon: "warn", text: t("$0.99 per resolution", "$0.99 por resolución") },
      { icon: "warn", text: t("DIY workflows in Fin AI", "Flujos por tu cuenta en Fin AI") },
      { icon: "x",    text: t("Support inbox only", "Solo bandeja de soporte") },
      { icon: "x",    text: t("EN-first, ES limited", "EN primero, ES limitado") },
      { icon: "ok",   text: t("Zendesk, Salesforce, HubSpot", "Zendesk, Salesforce, HubSpot") },
      { icon: "warn", text: t("SOC 2; HIPAA add-on", "SOC 2; HIPAA con costo extra") },
      { icon: "warn", text: t("Best-effort, no SLA", "Mejor esfuerzo, sin SLA") },
    ],
  };
  const chatgptAgents: Competitor = {
    name: "ChatGPT Agents",
    rows: [
      { icon: "ok",   text: t("EN + ES, but generic", "EN + ES, pero genérico") },
      { icon: "x",    text: t("Web only — no WhatsApp", "Solo web — sin WhatsApp") },
      { icon: "x",    text: t("General-purpose LLM", "LLM de propósito general") },
      { icon: "warn", text: t("$20–$200/mo per seat", "$20–$200/mes por usuario") },
      { icon: "warn", text: t("Prompt-engineer it yourself", "Tú lo configuras") },
      { icon: "x",    text: t("Chat only — no pipeline", "Solo chat — sin pipeline") },
      { icon: "x",    text: t("Not market-specific", "No específico al mercado") },
      { icon: "warn", text: t("API access, custom GPTs", "API y GPTs personalizados") },
      { icon: "x",    text: t("No HIPAA on consumer plans", "Sin HIPAA en planes de consumo") },
      { icon: "x",    text: t("None — interactive only", "Ninguno — solo interactivo") },
    ],
  };

  const competitors: Competitor[] = view === "all"
    ? [lindyCompetitor, intercomFin, chatgptAgents]
    : [lindyCompetitor];

  // Build a CSS grid template based on competitor count.
  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: `1.1fr ${competitors.map(() => "1fr").join(" ")} 1.2fr`,
  };

  return (
    <section id="compare" className="py-20 border-b border-[var(--rule)]">
      <div className="max-w-[1080px] mx-auto px-7">
        <motion.div {...fadeUp} className="font-mono text-[11px] font-semibold tracking-[.16em] uppercase text-[var(--coral)] mb-3.5">
          {view === "all" ? t("Agente vs everyone", "Agente vs todos") : "Agente vs Lindy"}
        </motion.div>
        <motion.h2 {...fadeUp} className="font-extrabold text-[var(--cream)] mb-4" style={{ fontSize: "clamp(28px,4vw,52px)", lineHeight: 0.98, letterSpacing: "-.028em" }}>
          {t(
            <>They built a great personal assistant. <em className="italic text-[var(--coral)]">We built the one that closes deals.</em></>,
            <>Ellos construyeron un gran asistente personal. <em className="italic text-[var(--coral)]">Nosotros construimos el que cierra negocios.</em></>
          )}
        </motion.h2>
        <motion.p {...fadeUp} className="text-[18px] leading-[1.55] mt-2" style={{ color: "rgba(244,237,227,.7)", maxWidth: "58ch" }}>
          {t(
            "Lindy is for individual professionals managing their inbox and calendar. Agente is for service businesses that run on leads, appointments, and follow-through — bilingual, WhatsApp-native, industry-expert, flat pricing.",
            "Lindy es para profesionales individuales que gestionan su bandeja de entrada y calendario. Agente es para negocios de servicio que viven de leads, citas y seguimiento — bilingüe, nativo en WhatsApp, experto en tu industria, precio fijo."
          )}
        </motion.p>

        {/* View toggle */}
        <motion.div {...fadeUp} className="mt-8 inline-flex p-1 rounded-full border border-[var(--rule)]" style={{ background: "rgba(244,237,227,.04)" }} role="tablist" aria-label={t("Comparison view", "Vista de comparación")}>
          {([
            { id: "lindy", label: t("vs Lindy", "vs Lindy") },
            { id: "all",   label: t("vs all competitors", "vs todos") },
          ] as const).map((opt) => {
            const active = view === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => switchView(opt.id)}
                className="px-4 py-2 rounded-full font-mono text-[11px] font-semibold tracking-[.1em] uppercase transition-colors"
                style={{
                  background: active ? "var(--coral)" : "transparent",
                  color: active ? "#FFF" : "rgba(244,237,227,.55)",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </motion.div>

        {/* Deep-link chip nav — jump to any comparison row */}
        <motion.nav
          {...fadeUp}
          aria-labelledby="cmp-chip-heading"
          className="mt-6"
        >
          <h3 id="cmp-chip-heading" className="sr-only">
            {t(
              "Jump to comparison row — use arrow keys to navigate, Enter to activate",
              "Saltar a fila de comparación — usa las flechas para navegar, Enter para activar"
            )}
          </h3>
          <ul role="list" className="flex flex-wrap gap-2 list-none p-0 m-0">
          {slugs.map((slug, i) => {
            const label = chipLabels[i];
            const aria = t(`Jump to ${label} row`, `Saltar a la fila ${label}`);
            const isActive = flashSlug === slug;
            return (
              <li key={slug} role="listitem">
              <a
                href={`#row-${slug}`}
                aria-label={aria}
                aria-controls={`row-${slug}`}
                aria-current={isActive ? "location" : undefined}
                data-chip-index={i}
                onClick={(e) => { e.preventDefault(); jumpTo(slug, { fromChip: true }); }}
                onKeyDown={(e) => {
                  // Space activates (anchors only handle Enter natively)
                  if (e.key === " " || e.key === "Spacebar") {
                    e.preventDefault();
                    jumpTo(slug, { fromChip: true });
                    return;
                  }
                  if (e.key === "Enter") {
                    e.preventDefault();
                    jumpTo(slug, { fromChip: true });
                    return;
                  }
                  // Arrow / Home / End navigation across chips
                  const max = slugs.length - 1;
                  let next: number | null = null;
                  if (e.key === "ArrowRight" || e.key === "ArrowDown") next = i === max ? 0 : i + 1;
                  else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = i === 0 ? max : i - 1;
                  else if (e.key === "Home") next = 0;
                  else if (e.key === "End") next = max;
                  if (next !== null) {
                    e.preventDefault();
                    const target = e.currentTarget.closest("nav")?.querySelector<HTMLAnchorElement>(
                      `a[data-chip-index="${next}"]`
                    );
                    target?.focus();
                  }
                }}
                className="px-3 py-1.5 rounded-full border text-[12px] font-mono font-semibold tracking-[.08em] uppercase transition-colors hover:text-[var(--coral)] hover:border-[var(--coral)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--coral)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--navy)] focus-visible:text-[var(--coral)] focus-visible:border-[var(--coral)] aria-[current=location]:text-[var(--coral)] aria-[current=location]:border-[var(--coral)]"
                style={{
                  borderColor: isActive ? "var(--coral)" : "var(--rule)",
                  color: isActive ? "var(--coral)" : "rgba(244,237,227,.6)",
                  background: isActive ? "rgba(232,65,24,.08)" : "rgba(244,237,227,.02)",
                }}
              >
                {label}
              </a>
              </li>
            );
          })}
          </ul>
        </motion.nav>

        <motion.div
          key={view}
          {...fadeUp}
          className="ct-shell mt-12 rounded-[20px] overflow-hidden border border-[var(--rule)]"
          role="table"
          aria-label={t("Agente vs competitors comparison", "Comparación de Agente vs competidores")}
        >
          {/* Header */}
          <div className="ct-grid" role="row" style={{ background: "#111D24", ...gridStyle }}>
            <div role="columnheader" className="ct-hcell font-mono font-semibold tracking-[.1em] uppercase" style={{ color: "var(--softer)" }}>
              {t("Feature", "Característica")}
            </div>
            {competitors.map((c) => (
              <div key={c.name} role="columnheader" className="ct-hcell ct-lindy font-mono font-semibold tracking-[.1em] uppercase" style={{ color: "rgba(244,237,227,.3)" }}>
                {c.name}
              </div>
            ))}
            <div role="columnheader" className="ct-hcell font-mono font-semibold tracking-[.1em] uppercase text-[var(--coral)]">
              Agente
            </div>
          </div>
          {rows.map(([label, , agente], i) => (
            <motion.div
              key={i}
              id={`row-${slugs[i]}`}
              role="row"
              tabIndex={0}
              aria-label={label}
              onKeyDown={(e) => {
                // Escape returns focus to the chip that brought us here.
                if (e.key === "Escape" && lastChipSlug) {
                  e.preventDefault();
                  focusChip(lastChipSlug);
                }
              }}
              initial={reduceMotion ? false : { opacity: 0, y: 16, filter: "blur(4px)" }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.05 * i }
              }
              whileHover={
                reduceMotion
                  ? { backgroundColor: "rgba(232,65,24,.06)" }
                  : {
                      backgroundColor: "rgba(232,65,24,.06)",
                      x: 2,
                      transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
                    }
              }
              className="ct-grid ct-row border-t border-[var(--rule)] scroll-mt-24"
              style={{
                background: flashSlug === slugs[i]
                  ? "rgba(232,65,24,.10)"
                  : i % 2 ? "rgba(244,237,227,.02)" : "transparent",
                transition: reduceMotion ? "none" : "background-color .6s ease",
                ...gridStyle,
              }}
            >
              <div role="rowheader" className="ct-cell font-semibold flex items-center" style={{ color: "rgba(244,237,227,.75)" }}>{label}</div>
              {competitors.map((c) => (
                <div key={c.name} role="cell" className="ct-cell ct-lindy items-start" style={{ color: "rgba(244,237,227,.45)" }}>
                  <CellIcon kind={c.rows[i]?.icon ?? "x"} /> <span className="min-w-0 break-words">{c.rows[i]?.text ?? "—"}</span>
                </div>
              ))}
              <div role="cell" className="ct-cell flex items-start text-[var(--cream)]">
                <CellIcon kind={agente.icon} /> <span className="min-w-0 break-words">{agente.text}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Compliance / privacy disclaimer */}
        <motion.p
          {...fadeUp}
          className="mt-5 text-[12px] leading-[1.55] font-mono"
          style={{ color: "rgba(244,237,227,.45)", maxWidth: "72ch" }}
          role="note"
        >
          <span className="text-[var(--coral)] font-semibold tracking-[.08em] uppercase">
            {t("Compliance note", "Nota de cumplimiento")} —{" "}
          </span>
          {t(
            "HIPAA-ready deployments (Grace / medical vertical) require a signed Business Associate Agreement (BAA) before go-live. PHI is encrypted in transit and at rest, data stays in-region (US or your chosen region), and we never train shared models on your conversations. Standard SOC 2-aligned controls apply to all other verticals. Competitor capabilities listed above reflect publicly documented plans as of 2026 and may change.",
            "Las implementaciones listas para HIPAA (Grace / vertical médico) requieren un Acuerdo de Asociado Comercial (BAA) firmado antes del lanzamiento. La PHI se cifra en tránsito y en reposo, los datos permanecen en tu región (EE. UU. o la región que elijas), y nunca entrenamos modelos compartidos con tus conversaciones. Para los demás verticales aplican controles alineados con SOC 2. Las capacidades de competidores mostradas arriba reflejan planes públicamente documentados al 2026 y pueden cambiar."
          )}
        </motion.p>

        {/* Response-time measurement footnote */}
        <motion.p
          {...fadeUp}
          className="mt-3 text-[12px] leading-[1.55] font-mono"
          style={{ color: "rgba(244,237,227,.45)", maxWidth: "72ch" }}
          role="note"
        >
          <span className="text-[var(--coral)] font-semibold tracking-[.08em] uppercase">
            {t("Response-time note", "Nota sobre tiempo de respuesta")} —{" "}
          </span>
          {t(
            'Response-time SLA measures first agent response (the lead receives a personalized, on-brand reply), not full resolution. Measured from message receipt at our gateway to outbound delivery, 24/7, including weekends and holidays. Resolution time (booking, qualification, hand-off) depends on the conversation and is reported separately in your dashboard.',
            'El SLA de tiempo de respuesta mide la primera respuesta del agente (el lead recibe una contestación personalizada y con tu marca), no la resolución total. Se mide desde la recepción del mensaje en nuestra pasarela hasta la entrega saliente, 24/7, incluidos fines de semana y feriados. El tiempo de resolución (agendar, calificar, transferir) depende de la conversación y se reporta por separado en tu panel.'
          )}
        </motion.p>
      </div>
    </section>
  );
}

function CellIcon({ kind }: { kind: "ok" | "x" | "warn" }) {
  if (kind === "ok") return <span className="text-[#4ADE80] text-[15px] shrink-0 mt-px">✓</span>;
  if (kind === "warn") return <span className="text-[#FCD34D] text-[13px] shrink-0 mt-px">⚠</span>;
  return <span className="shrink-0 mt-px text-[15px]" style={{ color: "rgba(232,65,24,.7)" }}>✗</span>;
}

/* ---------- LATINO / LEVEL THE FIELD ---------- */
function Latino() {
  const { t } = useI18n();
  const stats = [
    { n: <>78<em className="italic text-[var(--coral)]">%</em></>, l: t("of buyers go with whoever responds first — not whoever does the best work", "de los clientes van con quien responde primero — no con quien hace el mejor trabajo") },
    { n: <>9<em className="italic text-[var(--coral)]">pm</em></>, l: t("is when most service leads come in — when you're least able to respond professionally", "es cuando llega la mayoría de leads — cuando menos puedes responder profesionalmente") },
    { n: <>$0</>, l: t("cost to Agente per message — flat monthly fee, unlimited leads, always professional", "costo por mensaje de Agente — precio fijo mensual, leads ilimitados, siempre profesional") },
    { n: <>24<em className="italic text-[var(--coral)]">/7</em></>, l: t("your agent responds — nights, weekends, job sites, holidays, no exceptions", "tu agente responde — noches, fines de semana, obras, feriados, sin excepciones") },
  ];
  return (
    <section id="latino" className="py-20 border-y border-[var(--rule)]" style={{ background: "#18303C" }}>
      <div className="max-w-[1080px] mx-auto px-7">
        <motion.div {...fadeUp} className="font-mono text-[11px] font-semibold tracking-[.16em] uppercase text-[var(--coral)] mb-3.5">
          {t("Level the playing field", "Nivela el campo de juego")}
        </motion.div>
        <motion.h2 {...fadeUp} className="font-extrabold text-[var(--cream)] mb-4" style={{ fontSize: "clamp(28px,4vw,52px)", lineHeight: 0.98, letterSpacing: "-.028em" }}>
          {t(
            <>Big competitors have teams. <em className="italic text-[var(--coral)]">Now so do you.</em></>,
            <>Tus competidores grandes tienen equipos. <em className="italic text-[var(--coral)]">Ahora tú también.</em></>
          )}
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-16 items-center mt-12">
          <div className="space-y-5 text-[17px] leading-[1.7]" style={{ color: "rgba(244,237,227,.75)" }}>
            <p>{t(
              "The large operators respond to every lead instantly because they have staff for it. They never miss a proposal follow-up because they have a CRM. They capture every review because they have a system. You've been competing against that infrastructure with just your phone.",
              "Los operadores grandes responden cada lead al instante porque tienen personal para eso. Nunca pierden el seguimiento de una propuesta porque tienen un CRM. Capturan cada reseña porque tienen un sistema. Tú has estado compitiendo contra esa infraestructura solo con tu teléfono."
            )}</p>
            <p>{t(
              "And when you're on a job site at 9pm, exhausted, and a lead texts asking for a quote — the response that goes back might not sound like your best work. You lose the bid not because of your skill. Because of how the text read at 9pm.",
              "Y cuando estás en la obra a las 9pm, agotado, y un lead te escribe pidiendo un presupuesto — la respuesta que mandas quizás no suena como tu mejor trabajo. Pierdes el contrato no por tu habilidad. Sino por cómo quedó el mensaje a las 9pm."
            )}</p>
            <p>{t(
              "Agente gives a three-person operation the same communication infrastructure as a 30-person company. Your agent responds first, sounds professional, follows up consistently, and captures the review. You show up to do the work you're actually good at.",
              "Agente le da a una operación de tres personas la misma infraestructura de comunicación que una empresa de 30. Tu agente responde primero, suena profesional, da seguimiento consistente y captura la reseña. Tú llegas a hacer el trabajo en el que eres realmente bueno."
            )}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.05 }}
                className="rounded-2xl p-6 border border-[var(--rule)]"
                style={{ background: "var(--navy)" }}
              >
                <div className="font-extrabold text-[var(--cream)] mb-1.5" style={{ fontSize: "clamp(32px,4vw,52px)", letterSpacing: "-.04em", lineHeight: 0.95 }}>
                  {s.n}
                </div>
                <div className="text-[13px] leading-[1.5]" style={{ color: "var(--soft)" }}>{s.l}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- VERTICALS ---------- */
function Verticals() {
  const { t } = useI18n();

  const verticals = [
    {
      letter: "C", name: "Carmen", role: t("Real Estate Agent", "Agente de Bienes Raíces"),
      title: t("Agente.RealEstate", "Agente.RealEstate"),
      body: t(
        "Qualifies buyers instantly, books showings, sends hot-lead digests. Bilingual EN/ES/Spanglish auto-detect. Knows local market dynamics and buyer profiles. First responder wins — Carmen makes sure that's you.",
        "Califica compradores al instante, agenda visitas, envía resúmenes de leads calientes. Bilingüe EN/ES/Spanglish. Conoce la dinámica del mercado local y los perfiles de compradores. El primero en responder gana — Carmen se asegura de que seas tú."
      ),
      meta: [[t("Market:", "Mercado:"), t("US real estate teams", "Equipos de bienes raíces EE.UU.")], [t("Pilot:", "Piloto:"), "Fitzpatrick Team RE/MAX"]],
      status: { label: t("Live", "Activa"), kind: "live" as const },
      href: "/real-estate",
      ctaText: t("Agente.RealEstate →", "Agente.RealEstate →"),
      color: "coral" as const,
    },
    {
      letter: "M", name: "Marco", role: t("Construction Agent", "Agente de Construcción"),
      title: t("Agente.Construction", "Agente.Construction"),
      body: t(
        "Qualifies renovation leads, books estimates, runs proposal follow-up, sends job milestone updates, captures reviews and referrals. Knows DC, Maryland, and Virginia building codes and permit fees.",
        "Califica leads de renovación, agenda evaluaciones, da seguimiento a propuestas, envía actualizaciones del proyecto, captura reseñas y referidos. Conoce los códigos de construcción y permisos de DC, Maryland y Virginia."
      ),
      meta: [[t("Market:", "Mercado:"), "DC · MD · VA"], [t("Pilot:", "Piloto:"), "Reston Restoration LLC"]],
      status: { label: t("Deploying", "Desplegando"), kind: "deploy" as const },
      href: "/construction", ctaText: t("Agente.Construction →", "Agente.Construction →"),
      color: "coral" as const,
    },
    {
      letter: "S", name: "Sol", role: t("Solar Agent", "Agente Solar"),
      title: t("Agente.Solar", "Agente.Solar"),
      body: t(
        "Bilingual EN/ES solar qualification for Puerto Rico. Knows net metering (Act 10-2024), LUMA interconnection, and the ITC nuance most mainland companies get wrong. 163K+ installs, 3,200 new per month.",
        "Calificación solar bilingüe EN/ES para Puerto Rico. Conoce la medición neta (Ley 10-2024), la interconexión de LUMA y el detalle del crédito fiscal que la mayoría de empresas del continente malinterpretan. 163K+ instalaciones."
      ),
      meta: [[t("Market:", "Mercado:"), "Puerto Rico"]],
      status: { label: t("Ready", "Listo"), kind: "deploy" as const },
      href: "#", ctaText: t("Agente.Solar →", "Agente.Solar →"),
      color: "sol" as const,
    },
    {
      letter: "G", name: "Grace", role: t("Medical Agent", "Agente Médica"),
      title: t("Agente.Medical", "Agente.Medical"),
      body: t(
        "Books appointments, sends reminders, routes clinical questions to the patient portal. HIPAA-compliant on the base plan. Recovers $7K–$10K/month in no-show revenue for the average family practice.",
        "Agenda citas, envía recordatorios, redirige preguntas clínicas al portal del paciente. Cumple con HIPAA en el plan base. Recupera $7K–$10K/mes en ingresos por citas perdidas."
      ),
      meta: [[t("Market:", "Mercado:"), t("US medical practices", "Consultorios médicos EE.UU.")]],
      status: { label: t("In development", "En desarrollo"), kind: "dev" as const },
      href: "#", ctaText: t("Agente.Medical →", "Agente.Medical →"),
      color: "med" as const,
    },
  ];

  return (
    <section id="verticals" className="py-20">
      <div className="max-w-[1080px] mx-auto px-7">
        <motion.div {...fadeUp} className="font-mono text-[11px] font-semibold tracking-[.16em] uppercase text-[var(--coral)] mb-3.5">
          {t("Four Verticals", "Cuatro Industrias")}
        </motion.div>
        <motion.h2 {...fadeUp} className="font-extrabold text-[var(--cream)] mb-4" style={{ fontSize: "clamp(28px,4vw,52px)", lineHeight: 0.98, letterSpacing: "-.028em" }}>
          {t(
            <>Four industries. <em className="italic text-[var(--coral)]">Four domain experts.</em></>,
            <>Cuatro industrias. <em className="italic text-[var(--coral)]">Cuatro expertos.</em></>
          )}
        </motion.h2>
        <motion.p {...fadeUp} className="text-[18px] leading-[1.55] mt-2" style={{ color: "rgba(244,237,227,.7)", maxWidth: "54ch" }}>
          {t(
            "Every agent knows its industry — regulations, incentives, qualification criteria, market rates. Not a chatbot with a persona. A domain expert that speaks your language.",
            "Cada agente conoce su industria — regulaciones, incentivos, criterios de calificación, tarifas del mercado. No un chatbot con personalidad. Un experto que habla tu idioma."
          )}
        </motion.p>

        <div className="grid md:grid-cols-2 gap-[18px] mt-12">
          {verticals.map((v, i) => (
            <VerticalCard key={v.name} v={v} delay={i * 0.05} />
          ))}
        </div>

        {/* Coming soon */}
        <motion.div
          {...fadeUp}
          className="mt-4 rounded-[20px] p-6 md:px-10 flex justify-between items-center flex-wrap gap-5 border border-[var(--rule)]"
          style={{ background: "var(--card)" }}
        >
          <div className="flex items-center gap-4">
            <AvatarLetter letter="B" color="pink" />
            <div>
              <div className="font-bold text-[17px] text-[var(--cream)]">
                Bella · {t("Beauty & Nail Salons", "Salones de Belleza y Uñas")}
              </div>
              <div className="text-[14px] mt-1" style={{ color: "var(--soft)" }}>
                {t(
                  "Books appointments, sends reminders, captures reviews, reactivates lapsed clients. EN/ES. Instagram DM + WhatsApp. $197/mo.",
                  "Agenda citas, envía recordatorios, captura reseñas, reactiva clientes perdidos. EN/ES. Instagram DM + WhatsApp. $197/mes."
                )}
              </div>
            </div>
          </div>
          <StatusBadge kind="dev" label={t("Brief complete — in build", "Brief completo — en desarrollo")} />
        </motion.div>
      </div>
    </section>
  );
}

const avColors: Record<string, { color: string; bg: string; border: string }> = {
  coral: { color: "var(--coral)", bg: "rgba(232,65,24,.12)", border: "rgba(232,65,24,.18)" },
  sol: { color: "#F59E0B", bg: "rgba(245,158,11,.1)", border: "rgba(245,158,11,.2)" },
  med: { color: "#60A5FA", bg: "rgba(96,165,250,.1)", border: "rgba(96,165,250,.2)" },
  pink: { color: "#EC4899", bg: "rgba(236,72,153,.1)", border: "rgba(236,72,153,.2)" },
};

function AvatarLetter({ letter, color = "coral" }: { letter: string; color?: keyof typeof avColors }) {
  const c = avColors[color];
  return (
    <div
      className="w-12 h-12 rounded-[14px] grid place-items-center font-extrabold text-[20px] shrink-0 border"
      style={{ color: c.color, background: c.bg, borderColor: c.border }}
    >
      {letter}
    </div>
  );
}

function StatusBadge({ kind, label }: { kind: "live" | "deploy" | "dev"; label: string }) {
  const styles =
    kind === "live"
      ? { bg: "rgba(74,222,128,.1)", fg: "#4ADE80" }
      : kind === "deploy"
      ? { bg: "rgba(252,211,77,.08)", fg: "#FCD34D" }
      : { bg: "rgba(244,237,227,.06)", fg: "rgba(244,237,227,.5)" };
  return (
    <span
      className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold tracking-[.1em] uppercase px-2.5 py-1.5 rounded-md"
      style={{ background: styles.bg, color: styles.fg }}
    >
      {kind === "live" && <span className="w-[7px] h-[7px] rounded-full bg-[#4ADE80]" style={{ animation: "pulse-dot 1.4s ease-in-out infinite" }} />}
      {kind === "deploy" && <span>◑</span>}
      {kind === "dev" && <span>◌</span>}
      {label}
    </span>
  );
}

function VerticalCard({ v, delay }: { v: any; delay: number }) {
  return (
    <motion.a
      {...fadeUp}
      transition={{ ...fadeUp.transition, delay }}
      href={v.href}
      className="relative block rounded-[24px] p-9 border border-[var(--rule)] overflow-hidden transition-all hover:-translate-y-0.5 hover:border-[rgba(232,65,24,.35)]"
      style={{ background: "var(--card)" }}
    >
      <span className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--coral)] opacity-60" />
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-3">
          <AvatarLetter letter={v.letter} color={v.color} />
          <div>
            <div className="font-bold text-[17px] text-[var(--cream)]">{v.name}</div>
            <div className="font-mono text-[10px] tracking-[.08em] uppercase" style={{ color: "var(--softer)" }}>{v.role}</div>
          </div>
        </div>
        <StatusBadge kind={v.status.kind} label={v.status.label} />
      </div>
      <h3 className="font-extrabold text-[20px] text-[var(--cream)] mb-2.5" style={{ letterSpacing: "-.015em" }}>{v.title}</h3>
      <p className="text-[14px] leading-[1.6]" style={{ color: "var(--soft)" }}>{v.body}</p>
      <div className="flex gap-3.5 flex-wrap mt-5 pt-4 border-t border-[var(--rule)]">
        {v.meta.map(([k, val]: [string, string], i: number) => (
          <span key={i} className="font-mono text-[10px]" style={{ color: "var(--softer)" }}>
            {k} <span style={{ color: "rgba(232,65,24,.85)" }}>{val}</span>
          </span>
        ))}
      </div>
      <span className="inline-flex items-center gap-1 mt-4 text-[14px] font-bold text-[var(--coral)]">{v.ctaText}</span>
    </motion.a>
  );
}

/* ---------- WHY AGENTE ---------- */
function WhyAgente() {
  const { t } = useI18n();
  const items = [
    { icon: "🧠", h: t("Industry knowledge no one else has", "Conocimiento que nadie más tiene"), p: t(
      "Sol knows the ITC doesn't apply to most PR residents. Marco knows pre-1978 homes need EPA-certified contractors. Grace never sends clinical info over SMS. Lindy gets all of this wrong — and that costs your clients customers.",
      "Sol sabe que el crédito ITC no aplica para la mayoría de los residentes de PR. Marco sabe que las casas previas a 1978 necesitan contratistas certificados por la EPA. Grace nunca envía información clínica por SMS. Lindy se equivoca en todo esto."
    )},
    { icon: "🌎", h: t("Bilingual is the whole product", "El bilingüismo es el producto"), p: t(
      "62M+ US Hispanics. All of Latin America. WhatsApp is the dominant channel for Spanish speakers worldwide — not iMessage. Every Agente agent is native bilingual from day one. Auto-detects. Switches instantly. Never mixes.",
      "62M+ hispanos en EE.UU. Toda Latinoamérica. WhatsApp es el canal dominante para hispanohablantes — no iMessage. Cada agente de Agente es nativo bilingüe desde el primer día. Detecta automáticamente. Cambia al instante."
    )},
    { icon: "🔄", h: t("Full lifecycle, not just first touch", "Ciclo completo, no solo el primer contacto"), p: t(
      "Lindy manages your inbox. Agente runs your pipeline — qualify, book, remind, proposal follow-up, job updates, review capture, referral, reactivation. The leads you have are worth more than the ones you're chasing.",
      "Lindy gestiona tu bandeja de entrada. Agente maneja tu pipeline — califica, agenda, recuerda, da seguimiento, actualiza, captura reseñas, referidos, reactivación. Los leads que ya tienes valen más que los que estás persiguiendo."
    )},
    { icon: "💰", h: t("Flat pricing. No credit math.", "Precio fijo. Sin cuentas de créditos."), p: t(
      "Lindy's $49/mo Pro plan burns through 275 credits per lead cycle — 18 leads and you're out. Agente is a flat monthly fee. 5 leads or 500, same price. Stop rationing AI credits like a scarce resource.",
      "El plan Pro de Lindy a $49/mes consume 275 créditos por ciclo de lead — 18 leads y se acabó. Agente es precio fijo mensual. 5 leads o 500, mismo precio. Deja de racionar créditos de IA como si fueran escasos."
    )},
    { icon: "⚡", h: t("Done for you in 24 hours", "Listo para ti en 24 horas"), p: t(
      "Lindy requires you to build your own agents from templates. Agente deploys them fully configured with your company data and knowledge base. Live on WhatsApp and SMS in 24–48 hours. No builder. No learning curve.",
      "Lindy requiere que construyas tus propios agentes desde plantillas. Agente los despliega completamente configurados con los datos de tu empresa. En vivo en WhatsApp y SMS en 24–48 horas. Sin constructor. Sin curva de aprendizaje."
    )},
    { icon: "📍", h: t("Built in Puerto Rico for the Americas", "Construido en Puerto Rico para las Américas"), p: t(
      "Bilingual-first, WhatsApp-native architecture isn't a bolt-on — it's the foundation. Built by someone who spent three years navigating service businesses that didn't speak their customers' language. LATAM expansion is Phase 3.",
      "La arquitectura bilingüe y nativa en WhatsApp no es un extra — es la base. Construido por alguien que pasó tres años navegando negocios de servicio que no hablaban el idioma de sus clientes. Expansión a LATAM es la Fase 3."
    )},
  ];
  return (
    <section className="pb-20">
      <div className="max-w-[1080px] mx-auto px-7">
        <motion.div {...fadeUp} className="font-mono text-[11px] font-semibold tracking-[.16em] uppercase text-[var(--coral)] mb-3.5">
          {t("Why Agente wins", "Por qué Agente gana")}
        </motion.div>
        <motion.h2 {...fadeUp} className="font-extrabold text-[var(--cream)] mb-10" style={{ fontSize: "clamp(28px,4vw,52px)", lineHeight: 0.98, letterSpacing: "-.028em" }}>
          {t(
            <>Six things <em className="italic text-[var(--coral)]">Lindy can't do.</em></>,
            <>Seis cosas que <em className="italic text-[var(--coral)]">Lindy no puede hacer.</em></>
          )}
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-4">
          {items.map((it, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.05 }}
              className="rounded-[18px] p-7 border border-[var(--rule)]"
              style={{ background: "var(--card)" }}
            >
              <div className="text-[26px] mb-3.5">{it.icon}</div>
              <h4 className="font-bold text-[16px] text-[var(--cream)] mb-1.5">{it.h}</h4>
              <p className="text-[13px] leading-[1.6]" style={{ color: "var(--soft)" }}>{it.p}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- HOW IT WORKS / CUSTOM BUILD ---------- */
function HowItWorks() {
  const { t, lang } = useI18n();
  const steps = [
    { n: "01", h: t("Tell us your industry", "Cuéntanos tu industria"), p: t("One WhatsApp conversation. We ask the right questions.", "Una conversación en WhatsApp. Nosotros hacemos las preguntas correctas.") },
    { n: "02", h: t("We build your agent", "Construimos tu agente"), p: t("Industry knowledge, qualification flows, full lifecycle scripts. Built for your specific business.", "Conocimiento de industria, flujos de calificación, scripts del ciclo completo. Construido para tu negocio específico.") },
    { n: "03", h: t("Live in under a week", "En vivo en menos de una semana"), p: t("WhatsApp + SMS, bilingual, answering leads before you finish reading this.", "WhatsApp + SMS, bilingüe, respondiendo leads antes de que termines de leer esto.") },
  ];
  return (
    <section id="how" className="py-20 border-b border-[var(--rule)]">
      <div className="max-w-[1080px] mx-auto px-7">
        <div
          className="rounded-[28px] p-8 md:p-14 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg,rgba(232,65,24,.1) 0%,rgba(232,65,24,.04) 100%)",
            border: "1px solid rgba(232,65,24,.2)",
          }}
        >
          <div
            className="absolute pointer-events-none"
            style={{ top: "-60px", right: "-60px", width: 280, height: 280, background: "radial-gradient(ellipse,rgba(232,65,24,.12),transparent 70%)" }}
          />
          <div className="grid md:grid-cols-2 gap-14 items-center relative">
            <motion.div {...fadeUp}>
              <div className="font-mono text-[11px] font-semibold tracking-[.16em] uppercase text-[var(--coral)] mb-3.5">
                {t("Don't see your industry?", "¿No ves tu industria?")}
              </div>
              <h2 className="font-extrabold text-[var(--cream)] mb-5" style={{ fontSize: "clamp(28px,3.5vw,46px)", lineHeight: 1.02, letterSpacing: "-.025em" }}>
                {t(
                  <>We'll build your <em className="italic text-[var(--coral)]">custom agent.</em></>,
                  <>Construimos tu <em className="italic text-[var(--coral)]">agente personalizado.</em></>
                )}
              </h2>
              <p className="text-[16px] leading-[1.7] mb-6" style={{ color: "rgba(244,237,227,.7)" }}>
                {t(
                  "Every vertical we've built started the same way — a brief, a knowledge base, and 48 hours. HVAC. Roofing. Auto repair. Veterinary. Immigration law intake. Cleaning services. If your business runs on leads and appointments, we can build the agent for it.",
                  "Cada industria que hemos construido empezó igual — un brief, una base de conocimiento y 48 horas. HVAC. Techado. Reparación de autos. Veterinaria. Intake legal. Limpieza. Si tu negocio vive de leads y citas, podemos construir el agente para eso."
                )}
              </p>
              <a
                href={demoUrl(lang)}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-[16px] font-bold text-white transition-transform hover:-translate-y-px"
                style={{ background: "var(--coral)", boxShadow: "0 4px 20px rgba(232,65,24,.3)" }}
              >
                <WhatsAppIcon /> {t("Tell us your industry →", "Cuéntanos tu industria →")}
              </a>
            </motion.div>
            <div className="flex flex-col gap-3.5">
              {steps.map((s, i) => (
                <motion.div
                  key={i}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.1 + i * 0.05 }}
                  className="rounded-2xl px-6 py-5 flex gap-4 items-start"
                  style={{ background: "rgba(244,237,227,.06)", border: "1px solid rgba(244,237,227,.08)" }}
                >
                  <div className="font-mono font-bold text-[20px] text-[var(--coral)] shrink-0 leading-none">{s.n}</div>
                  <div>
                    <div className="font-bold text-[15px] text-[var(--cream)] mb-1">{s.h}</div>
                    <div className="text-[13px]" style={{ color: "var(--soft)" }}>{s.p}</div>
                  </div>
                </motion.div>
              ))}
              <div
                className="rounded-xl px-5 py-4 font-mono text-[11px] tracking-[.06em]"
                style={{ background: "rgba(232,65,24,.08)", border: "1px solid rgba(232,65,24,.15)", color: "rgba(244,237,227,.6)" }}
              >
                {t(
                  "CUSTOM BUILD: $997 SETUP · FROM $397/MO · INCLUDES INDUSTRY RESEARCH + FULL KNOWLEDGE BASE",
                  "BUILD PERSONALIZADO: $997 CONFIGURACIÓN · DESDE $397/MES · INCLUYE INVESTIGACIÓN DE INDUSTRIA + BASE DE CONOCIMIENTO COMPLETA"
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- CONTACT ---------- */
function Contact() {
  const { t, lang } = useI18n();
  const items = [
    {
      key: "phone",
      label: t("Call us", "Llámanos"),
      value: "+1 787 810 0749",
      href: "tel:+17878100749",
      hint: t("Mon–Fri · 9am–7pm AST", "Lun–Vie · 9am–7pm AST"),
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
        </svg>
      ),
    },
    {
      key: "email",
      label: t("Email us", "Escríbenos"),
      value: "hello@agentesystems.com",
      href: "mailto:hello@agentesystems.com?subject=Agente%20inquiry",
      hint: t("Replies within 1 business day", "Respondemos en 1 día hábil"),
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      ),
    },
    {
      key: "whatsapp",
      label: t("WhatsApp", "WhatsApp"),
      value: t("Start free trial", "Prueba gratis"),
      href: demoUrl(lang),
      hint: t("Fastest — usually <2 min", "Lo más rápido — normalmente <2 min"),
      isPrimary: true,
      icon: <WhatsAppIcon />,
    },
  ];

  return (
    <section id="contact" className="px-7 py-[100px]" style={{ background: "rgba(244,237,227,.02)" }}>
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center mb-12">
          <div className="font-mono text-[11px] font-semibold tracking-[.16em] uppercase text-[var(--coral)] mb-3.5">
            {t("Contact", "Contacto")}
          </div>
          <h2 className="font-extrabold text-[var(--cream)] mx-auto" style={{ fontSize: "clamp(28px,4vw,44px)", lineHeight: 1.05, letterSpacing: "-.028em", maxWidth: "22ch" }}>
            {t("Talk to a human, in any language", "Habla con una persona, en cualquier idioma")}
          </h2>
          <p className="text-[16px] leading-[1.55] mx-auto mt-4" style={{ color: "rgba(244,237,227,.7)", maxWidth: "54ch" }}>
            {t(
              "Questions, demos, integrations — pick the channel you like best. We answer in EN/ES/Spanglish.",
              "Preguntas, demos, integraciones — escoge el canal que prefieras. Respondemos en EN/ES/Spanglish."
            )}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {items.map((it) => (
            <a
              key={it.key}
              href={it.href}
              target={it.href.startsWith("http") ? "_blank" : undefined}
              rel={it.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex flex-col gap-3 p-6 rounded-2xl border transition-all hover:-translate-y-px"
              style={{
                background: it.isPrimary ? "var(--coral)" : "rgba(244,237,227,.04)",
                borderColor: it.isPrimary ? "transparent" : "var(--rule)",
                color: it.isPrimary ? "white" : "var(--cream)",
                boxShadow: it.isPrimary ? "0 4px 20px rgba(232,65,24,.3)" : undefined,
              }}
            >
              <div className="flex items-center gap-2.5 text-[12px] font-mono font-semibold tracking-[.14em] uppercase" style={{ opacity: it.isPrimary ? 0.9 : 0.55 }}>
                {it.icon}
                {it.label}
              </div>
              <div className="text-[20px] font-extrabold leading-tight" style={{ letterSpacing: "-.02em" }}>
                {it.value}
              </div>
              <div className="text-[13px]" style={{ opacity: it.isPrimary ? 0.85 : 0.55 }}>
                {it.hint}
              </div>
            </a>
          ))}
        </div>
        <p className="text-center text-[12px] mt-8" style={{ color: "var(--softer)" }}>
          {t(
            <>No forms — your demo happens in the same WhatsApp chat your customers use. <Link to="/demo" className="underline hover:text-[var(--cream)]">More about the demo</Link>.</>,
            <>Sin formularios — tu demo ocurre en el mismo chat de WhatsApp que usan tus clientes. <Link to="/demo" className="underline hover:text-[var(--cream)]">Más sobre la demo</Link>.</>
          )}
        </p>
      </div>
    </section>
  );
}

/* ---------- FINAL CTA ---------- */
function FinalCTA() {
  const { t, lang } = useI18n();
  return (
    <section className="relative overflow-hidden text-center" style={{ padding: "100px 28px" }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%,rgba(232,65,24,.1),transparent 65%)" }}
      />
      <div className="relative">
        <div className="font-mono text-[11px] font-semibold tracking-[.16em] uppercase text-[var(--coral)] mb-3.5">
          {t("Start for free", "Empieza gratis")}
        </div>
        <h2 className="font-extrabold text-[var(--cream)] mb-4 mx-auto" style={{ fontSize: "clamp(28px,4vw,52px)", lineHeight: 0.98, letterSpacing: "-.028em", maxWidth: "24ch" }}>
          {t(
            <>Ready to stop losing leads to <em className="italic text-[var(--coral)]">whoever responds first?</em></>,
            <>¿Listo para dejar de perder leads con <em className="italic text-[var(--coral)]">el que responde primero?</em></>
          )}
        </h2>
        <p className="text-[18px] leading-[1.55] mx-auto mb-9" style={{ color: "rgba(244,237,227,.7)", maxWidth: "52ch" }}>
          {t(
            "7-day free trial. No credit card. Live in 24 hours. Real estate, construction, solar, or medical — your agent is ready.",
            "7 días gratis. Sin tarjeta de crédito. En vivo en 24 horas. Bienes raíces, construcción, solar o médica — tu agente está listo."
          )}
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a
            href={demoUrl(lang)}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-[17px] font-bold text-white transition-transform hover:-translate-y-px"
            style={{ background: "var(--coral)", boxShadow: "0 4px 20px rgba(232,65,24,.3)" }}
          >
            <WhatsAppIcon /> {t("Start free trial →", "Prueba gratis →")}
          </a>
          <a
            href="https://agentepr.com"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-[17px] font-bold text-[var(--cream)] border border-[var(--rule)] transition-transform hover:-translate-y-px"
            style={{ background: "rgba(244,237,227,.08)" }}
          >
            {t("See AgentePR live", "Ver AgentePR en vivo")}
          </a>
        </div>
        <div className="font-mono text-[11px] mt-4 tracking-[.06em]" style={{ color: "var(--softer)" }}>
          {t(
            "7 DAYS FREE  ·  NO CREDIT CARD  ·  LIVE IN 24 HOURS  ·  CANCEL ANYTIME",
            "7 DÍAS GRATIS  ·  SIN TARJETA  ·  EN VIVO EN 24 HORAS  ·  CANCELA CUANDO QUIERAS"
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- STICKY MOBILE ---------- */
function StickyMobile() {
  const { t, lang } = useI18n();
  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-[9999] flex gap-3 items-center justify-center px-5 py-3 border-t"
      style={{ background: "rgba(13,27,34,.97)", backdropFilter: "blur(12px)", borderColor: "rgba(244,237,227,.1)" }}
    >
      <span className="font-mono text-[11px] tracking-[.08em] whitespace-nowrap" style={{ color: "rgba(244,237,227,.5)" }}>
        {t("7 DAYS FREE", "7 DÍAS GRATIS")}
      </span>
      <a
        href={demoUrl(lang)}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-[14px] font-bold text-white"
        style={{ background: "var(--coral)" }}
      >
        {t("Start free trial →", "Prueba gratis →")}
      </a>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.6 6.32A7.85 7.85 0 0 0 12.04 4C7.71 4 4.18 7.53 4.18 11.87c0 1.39.36 2.74 1.05 3.94L4.1 20l4.31-1.13a7.85 7.85 0 0 0 3.63.93h.01c4.33 0 7.86-3.53 7.86-7.87 0-2.1-.82-4.07-2.31-5.55z" />
    </svg>
  );
}