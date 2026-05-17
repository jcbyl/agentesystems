import { createFileRoute, Link } from "@tanstack/react-router";
import { hreflangLinks } from "@/lib/hreflang";
import { motion } from "framer-motion";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useI18n } from "@/lib/i18n";
import { demoUrl } from "@/lib/demo-link";
import ogImageUrl from "@/assets/og-solar.jpg";

const ORIGIN = "https://agentesystems.lovable.app";
const PAGE_URL = `${ORIGIN}/solar`;
const OG_IMAGE = `${ORIGIN}${ogImageUrl}`;

export const Route = createFileRoute("/solar")({
  head: () => ({
    meta: [
      { title: "Agente.Solar — Sol · AI Agent for Solar Installers" },
      { name: "description", content: "Sol qualifies solar leads in under a second. Bilingual EN/ES. Books site surveys, keeps deals warm through PTO." },
      { name: "keywords", content: "bilingual solar AI, solar lead qualification, LUMA Puerto Rico solar, net metering 2030, ITC bilingual, agente solar bilingüe, site survey booking" },
      { property: "og:title", content: "Agente.Solar — Sol · AI Agent for Solar Installers" },
      { property: "og:description", content: "Sol qualifies every solar lead in under a second — bilingual EN/ES. Books site surveys and keeps deals warm through permit, install, and PTO." },
      { property: "og:url", content: PAGE_URL },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:secure_url", content: OG_IMAGE },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:description", content: "Sol qualifies every solar lead in under a second — bilingual EN/ES. Books site surveys and keeps deals warm through permit, install, and PTO." },
      { name: "twitter:title", content: "Agente.Solar — Sol" },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }, ...hreflangLinks(PAGE_URL)],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Agente.Solar — Sol",
          serviceType: "Bilingual AI agent for solar installers",
          provider: { "@type": "Organization", name: "Agente.Systems", url: ORIGIN },
          areaServed: ["Puerto Rico", "United States"],
          availableLanguage: ["en", "es"],
          url: PAGE_URL,
        }),
      },
    ],
  }),
  component: SolarPage,
});

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
};

function SolarPage() {
  return (
    <div className="min-h-screen bg-[var(--navy)]">
      <SiteNav />
      <Hero />
      <Stats />
      <Features />
      <Lifecycle />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <SiteFooter />
    </div>
  );
}

function Hero() {
  const { t, lang } = useI18n();
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--navy)", padding: "84px 28px 72px" }}>
      <div className="max-w-[1080px] mx-auto text-center">
        <motion.div
          {...fadeUp}
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[.1em] uppercase mb-7 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(245,158,11,.12)", color: "#F59E0B", border: "1px solid rgba(245,158,11,.25)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
          {t("Sol is live for Puerto Rico solar teams", "Sol está activo para equipos solares en Puerto Rico")}
        </motion.div>
        <motion.h1
          {...fadeUp}
          className="font-extrabold text-[var(--cream)] mb-5"
          style={{ fontSize: "clamp(40px,6.5vw,82px)", lineHeight: 0.98, letterSpacing: "-.03em" }}
        >
          {t(
            <>Every solar lead, <em className="italic text-[#F59E0B]">qualified before sunset.</em></>,
            <>Cada lead solar, <em className="italic text-[#F59E0B]">calificado antes del atardecer.</em></>
          )}
        </motion.h1>
        <motion.p
          {...fadeUp}
          className="mx-auto max-w-[68ch] text-[18px] leading-[1.6] mb-9"
          style={{ color: "rgba(244,237,227,.72)" }}
        >
          {t(
            "Sol replies to every form fill, ad click, and referral in under a second — bilingual EN/ES/Spanglish. He confirms the home is a fit, books the site survey, and keeps homeowners warm through permit, install, and PTO so deals don't stall between steps.",
            "Sol responde cada formulario, clic en anuncio y referido en menos de un segundo — bilingüe EN/ES/Spanglish. Confirma que la casa califica, agenda la visita técnica y mantiene al dueño informado durante permisos, instalación y PTO para que los cierres no se estanquen."
          )}
        </motion.p>
        <motion.div {...fadeUp} className="flex flex-wrap gap-3 justify-center mb-8">
          <a
            href={demoUrl(lang)}
            className="inline-flex items-center gap-2 px-7 py-[15px] rounded-[12px] font-bold text-white text-[17px] transition-transform hover:-translate-y-px"
            style={{ background: "#F59E0B", boxShadow: "0 6px 24px rgba(245,158,11,.35)" }}
          >
            {t("Start free trial →", "Prueba gratis →")}
          </a>
          <a
            href="#features"
            className="inline-flex items-center px-6 py-[15px] rounded-[12px] font-bold text-[17px] transition-colors"
            style={{ background: "rgba(244,237,227,.06)", color: "var(--cream)", border: "1.5px solid rgba(244,237,227,.14)" }}
          >
            {t("How it works", "Cómo funciona")}
          </a>
        </motion.div>
        <motion.div
          {...fadeUp}
          className="flex flex-wrap gap-5 justify-center font-mono text-[11px] tracking-[.06em]"
          style={{ color: "rgba(244,237,227,.5)" }}
        >
          {[
            t("Site survey booked same week", "Visita técnica en la misma semana"),
            t("Puerto Rico net metering expert", "Experto en medición neta PR"),
            t("Live in 48 hours", "En vivo en 48 horas"),
            t("Cancel anytime", "Cancela cuando quieras"),
          ].map((s, i) => (
            <span key={i} className="inline-flex items-center gap-1.5">
              <span style={{ color: "#F59E0B" }}>●</span> {s}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Stats() {
  const { t } = useI18n();
  const stats: [React.ReactNode, string][] = [
    [<>$380<em className="not-italic" style={{ color: "#F59E0B" }}>/mo</em></>, t("average LUMA bill that triggers a solar inquiry", "factura LUMA promedio que genera una consulta solar")],
    [<><em className="not-italic" style={{ color: "#F59E0B" }}>&lt;</em>1<span className="text-[.45em] opacity-40">s</span></>, t("response time, every lead, every channel", "tiempo de respuesta, cada lead, cada canal")],
    [<>83<em className="not-italic" style={{ color: "#F59E0B" }}>%</em></>, t("of PR installs include battery storage", "de las instalaciones en PR incluyen batería")],
    [<>2030</>, t("net metering guaranteed — Act 10-2024", "medición neta garantizada — Ley 10-2024")],
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 border-y border-[rgba(244,237,227,.08)]" style={{ background: "var(--navy)" }}>
      {stats.map(([n, l], i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.5 }}
          className="text-center px-5 py-9 border-r border-[rgba(244,237,227,.06)] last:border-r-0"
        >
          <div className="font-extrabold text-[var(--cream)] mb-2" style={{ fontSize: "clamp(34px,5vw,62px)", letterSpacing: "-.04em", lineHeight: 0.95 }}>
            {n}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[.1em] leading-[1.5]" style={{ color: "rgba(244,237,227,.45)" }}>
            {l}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

type Msg = { kind: "in" | "out" | "note"; text: React.ReactNode; italic?: boolean };

function ChatCard({ messages, tone }: { messages: Msg[]; tone: "ok" | "warn" }) {
  const accent = tone === "ok" ? "rgba(245,158,11,.08)" : "rgba(232,65,24,.06)";
  return (
    <div className="rounded-[18px] p-5" style={{ background: accent, border: "1px solid rgba(24,48,60,.08)" }}>
      <div className="flex flex-col gap-2">
        {messages.map((m, i) => {
          if (m.kind === "note") {
            return (
              <div key={i} className="font-mono text-[11px] text-center my-1 py-[7px] px-2 rounded-md" style={{ background: "rgba(24,48,60,.04)", color: "var(--soft)" }}>
                {m.text}
              </div>
            );
          }
          const isIn = m.kind === "in";
          return (
            <div
              key={i}
              className="text-[14px] leading-[1.45] rounded-[14px] px-3.5 py-2.5 max-w-[80%]"
              style={{
                alignSelf: isIn ? "flex-start" : "flex-end",
                background: isIn ? "#FFF" : "#F59E0B",
                color: isIn ? (m.italic ? "#F59E0B" : "var(--navy)") : "#FFF",
                fontStyle: m.italic ? "italic" : "normal",
                borderBottomLeftRadius: isIn ? 4 : 14,
                borderBottomRightRadius: isIn ? 14 : 4,
                boxShadow: isIn ? "0 1px 4px rgba(24,48,60,.08)" : "0 4px 14px rgba(245,158,11,.2)",
              }}
            >
              {m.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FeatureRow({ eyebrow, title, body, extra, card, reverse }: {
  eyebrow: string; title: React.ReactNode; body: string; extra?: string;
  card: React.ReactNode; reverse?: boolean;
}) {
  return (
    <motion.div
      {...fadeUp}
      className={`grid md:grid-cols-2 gap-10 items-center ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}
    >
      <div>
        <div className="font-mono text-[11px] font-medium tracking-[.16em] uppercase mb-3.5" style={{ color: "#F59E0B" }}>
          {eyebrow}
        </div>
        <h2 className="font-extrabold text-[var(--navy)] mb-4" style={{ fontSize: "clamp(26px,3.6vw,44px)", lineHeight: 1.02, letterSpacing: "-.025em" }}>
          {title}
        </h2>
        <p className="text-[var(--soft)] leading-[1.65]">{body}</p>
        {extra && <p className="mt-3 text-[var(--mid)] font-semibold">{extra}</p>}
      </div>
      <div>{card}</div>
    </motion.div>
  );
}

function SurveyCard() {
  const { t } = useI18n();
  const rows: [string, string][] = [
    [t("Roof", "Techo"), t("Hip · 8 years old · Composite shingle", "A cuatro aguas · 8 años · Teja compuesta")],
    [t("LUMA avg", "Prom. LUMA"), "$340–$380/mo"],
    [t("Ownership", "Propiedad"), t("Owner — purchased 2019", "Dueño — comprado 2019")],
    [t("ITC status", "Estado ITC"), t("Files federal ✓ — 30% credit eligible", "Declara federal ✓ — elegible al crédito 30%")],
    [t("Financing", "Financiamiento"), t("$0-down preferred", "Prefiere $0 de entrada")],
  ];
  return (
    <div className="rounded-[18px] p-6" style={{ background: "rgba(255,253,249,.85)", border: "1px solid rgba(24,48,60,.08)", boxShadow: "0 8px 30px rgba(24,48,60,.06)" }}>
      <div className="font-mono text-[10px] font-semibold uppercase tracking-[.1em] mb-2" style={{ color: "#F59E0B" }}>
        {t("SITE SURVEY BOOKED — SAT 9AM", "VISITA TÉCNICA AGENDADA — SÁB 9AM")}
      </div>
      <div className="font-bold text-[15px] text-[var(--navy)] mb-3">
        Carlos M. · Urb. Santa Juanita, Bayamón PR
      </div>
      <div className="grid grid-cols-[110px_1fr] gap-y-2 gap-x-4 text-[14px]">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <strong className="font-mono text-[9px] font-semibold uppercase tracking-[.08em] mt-1" style={{ color: "rgba(24,48,60,.4)" }}>{k}</strong>
            <span className="text-[var(--navy)]">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Features() {
  const { t } = useI18n();
  return (
    <section id="features" className="py-20" style={{ background: "var(--cream)" }}>
      <div className="max-w-[1080px] mx-auto px-7 space-y-20">
        <FeatureRow
          eyebrow={t("The Problem", "El Problema")}
          title={t(
            <>The LUMA bill arrives Friday night. <em className="italic" style={{ color: "#F59E0B" }}>The lead goes to whoever responds first.</em></>,
            <>La factura de LUMA llega el viernes por la noche. <em className="italic" style={{ color: "#F59E0B" }}>El lead va al primero en responder.</em></>
          )}
          body={t(
            "Homeowners open a $380 LUMA bill at 9pm and text three solar companies. By Saturday morning, whoever responded first already has the site survey scheduled. You find out Monday.",
            "Los dueños abren una factura de LUMA de $380 a las 9pm y le escriben a tres empresas solares. Para el sábado por la mañana, el que respondió primero ya tiene la visita agendada. Tú te enteras el lunes."
          )}
          extra={t("Sol is the reason that never happens again.", "Sol es la razón por la que eso no vuelve a pasar.")}
          card={
            <ChatCard
              tone="warn"
              messages={[
                { kind: "in", text: t("Hi — just got my LUMA bill, $380 this month. Interested in solar.", "Hola — acabo de recibir mi factura de LUMA, $380 este mes. Me interesa el solar.") },
                { kind: "note", text: t("No reply for 14 hours", "Sin respuesta por 14 horas") },
                { kind: "in", italic: true, text: t('"Already scheduled with SunPower, thanks"', '"Ya agendé con otra empresa, gracias"') },
                { kind: "note", text: t("$27,000 install · lost.", "Instalación de $27,000 · perdida.") },
              ]}
            />
          }
        />
        <FeatureRow
          reverse
          eyebrow={t("The Solution", "La Solución")}
          title={t(
            <>Sol qualifies. <em className="italic" style={{ color: "#F59E0B" }}>You show up to the right home.</em></>,
            <>Sol califica. <em className="italic" style={{ color: "#F59E0B" }}>Tú llegas a la casa correcta.</em></>
          )}
          body={t(
            "Sol responds in under a second. He walks through ownership, roof condition, LUMA bill, federal tax filing status (the ITC question most mainland companies get wrong), and financing preference — then books the site survey before you finish your current job.",
            "Sol responde en menos de un segundo. Recorre propiedad, estado del techo, factura LUMA, estado de declaración federal de impuestos (la pregunta del ITC que la mayoría de empresas del continente malinterpretan) y preferencia de financiamiento — y agenda la visita técnica antes de que termines tu trabajo actual."
          )}
          card={
            <ChatCard
              tone="ok"
              messages={[
                { kind: "in", text: "My LUMA bill was $380 this month, really interested in solar." },
                { kind: "out", text: "That's a big bill — good news, that size usually means a solid ROI on solar. Do you own the property?" },
                { kind: "in", text: "Yes, bought it in 2019." },
                { kind: "out", text: "Perfect. Do you file a US federal tax return? That determines whether the 30% federal credit applies — it's a big number, so I want to be straight with you." },
                { kind: "in", text: "Yes I file federal." },
                { kind: "out", text: "Great — you're eligible. Our certified installer does a free site assessment. Saturday or Monday work?" },
              ]}
            />
          }
        />
        <FeatureRow
          eyebrow={t("The Brief", "El Resumen")}
          title={t(
            <>Show up to the survey <em className="italic" style={{ color: "#F59E0B" }}>already knowing.</em></>,
            <>Llega a la visita <em className="italic" style={{ color: "#F59E0B" }}>ya sabiendo todo.</em></>
          )}
          body={t(
            "Before your team arrives, Sol sends a pre-survey brief: roof type and age, LUMA bill range, federal filing status (ITC eligibility confirmed), financing preference, and any flags. Your installer walks in prepared, not cold.",
            "Antes de que llegue tu equipo, Sol envía un resumen previo: tipo y edad del techo, rango de factura LUMA, estado de declaración federal (elegibilidad al ITC confirmada), preferencia de financiamiento y cualquier alerta. Tu instalador llega preparado."
          )}
          card={<SurveyCard />}
        />
      </div>
    </section>
  );
}

function Lifecycle() {
  const { t } = useI18n();
  const steps: [string, string, string][] = [
    [t("INBOUND", "ENTRADA"), t("Qualify + book", "Califica + agenda"), t("Ownership, roof, LUMA bill, ITC eligibility, cash vs $0-down. Site survey on the calendar.", "Propiedad, techo, LUMA, elegibilidad ITC, efectivo vs $0. Visita técnica en el calendario.")],
    [t("PRE-SURVEY", "PRE-VISITA"), t("Reminder + brief", "Recordatorio + resumen"), t("24h reminder to homeowner + pre-survey brief to your installer. Kills cancellations.", "Recordatorio 24h al dueño + resumen previo al instalador. Elimina cancelaciones.")],
    [t("PROPOSAL", "PROPUESTA"), t("Day 3 · 5 · 7 follow-up", "Seguimiento Día 3 · 5 · 7"), t("Three-touch nudge if no response. Handles price and financing objections professionally.", "Tres toques si no responde. Maneja objeciones de precio y financiamiento.")],
    [t("PERMIT", "PERMISO"), t("Milestone update", "Actualización de hito"), t("Homeowner gets a message when permit is filed and when it's approved. No more wondering.", "El dueño recibe un mensaje cuando se radica el permiso y cuando se aprueba.")],
    [t("INSTALL", "INSTALACIÓN"), t("Day-of update", "Actualización del día"), t("Morning message when your team is heading over. Keeps the homeowner available and ready.", "Mensaje matutino cuando tu equipo va en camino. El dueño está disponible y listo.")],
    [t("PTO & BEYOND", "PTO Y MÁS"), t("Review + referral", "Reseña + referido"), t("Google review request after PTO. Referral ask 3 days later. Reactivation at 12 months.", "Solicitud de reseña después del PTO. Referido 3 días después. Reactivación a los 12 meses.")],
  ];
  return (
    <section id="lifecycle" className="py-20" style={{ background: "#EDE5D6" }}>
      <div className="max-w-[1080px] mx-auto px-7">
        <motion.div {...fadeUp} className="font-mono text-[11px] font-medium tracking-[.16em] uppercase mb-3.5" style={{ color: "#F59E0B" }}>
          {t("Beyond the survey", "Más allá de la visita")}
        </motion.div>
        <motion.h2 {...fadeUp} className="font-extrabold text-[var(--navy)] mb-4" style={{ fontSize: "clamp(28px,4vw,50px)", lineHeight: 1.02, letterSpacing: "-.025em" }}>
          {t(
            <>Sol owns the full <em className="italic" style={{ color: "#F59E0B" }}>install lifecycle.</em></>,
            <>Sol maneja todo el <em className="italic" style={{ color: "#F59E0B" }}>ciclo de la instalación.</em></>
          )}
        </motion.h2>
        <motion.p {...fadeUp} className="max-w-[58ch] text-[var(--soft)] leading-[1.65] mb-10">
          {t(
            "Most solar leads stall between qualification and PTO. Sol keeps the deal warm at every step — so you don't lose a signed contract to silence.",
            "La mayoría de los leads solares se estancan entre la calificación y el PTO. Sol mantiene el cierre activo en cada paso — para que no pierdas un contrato firmado por silencio."
          )}
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map(([n, h, p], i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="rounded-[14px] p-5"
              style={{ background: "var(--cream)", border: "1px solid rgba(24,48,60,.08)" }}
            >
              <div className="font-mono text-[10px] font-semibold tracking-[.1em] mb-2" style={{ color: "#F59E0B" }}>{n}</div>
              <h4 className="font-bold text-[15px] text-[var(--navy)] mb-1.5">{h}</h4>
              <p className="text-[14px] text-[var(--soft)] leading-[1.55]">{p}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const { t, lang } = useI18n();
  const items = [
    t("Instant response on every channel, 24/7", "Respuesta instantánea en cada canal, 24/7"),
    t("Lead qualification — ownership, roof, LUMA bill, ITC status, financing", "Calificación — propiedad, techo, LUMA, ITC, financiamiento"),
    t("Site survey booked same week, every time", "Visita técnica en la misma semana, siempre"),
    t("24h + day-of homeowner reminders", "Recordatorios al dueño 24h + día de la visita"),
    t("ITC nuance handled correctly — never promises the 30% without confirming federal filing", "ITC manejado correctamente — nunca promete el 30% sin confirmar la declaración federal"),
    t("Net metering education built in — Act 10-2024, annual true-up, LUMA interconnection", "Educación sobre medición neta integrada — Ley 10-2024, true-up anual, interconexión LUMA"),
    t("Proposal follow-up — Day 3, Day 5, Day 7", "Seguimiento de propuesta — Día 3, 5, 7"),
    t("Permit filed + approved milestone updates", "Actualizaciones de hito: permiso radicado y aprobado"),
    t("Install day-of homeowner message", "Mensaje al dueño el día de la instalación"),
    t("Google review request after PTO", "Solicitud de reseña de Google después del PTO"),
    t("Referral capture + 12-month reactivation", "Captura de referido + reactivación a los 12 meses"),
    t("Live in 48 hours · Cancel anytime", "En vivo en 48 horas · Cancela cuando quieras"),
  ];
  return (
    <section id="pricing" className="py-20" style={{ background: "var(--cream)" }}>
      <div className="max-w-[1080px] mx-auto px-7 text-center">
        <motion.div {...fadeUp} className="font-mono text-[11px] font-medium tracking-[.16em] uppercase mb-3.5" style={{ color: "#F59E0B" }}>
          {t("Pricing", "Precios")}
        </motion.div>
        <motion.h2 {...fadeUp} className="font-extrabold text-[var(--navy)] mb-4" style={{ fontSize: "clamp(28px,4vw,50px)", lineHeight: 1.02, letterSpacing: "-.025em" }}>
          {t(<>One plan. <em className="italic" style={{ color: "#F59E0B" }}>Every stage covered.</em></>, <>Un plan. <em className="italic" style={{ color: "#F59E0B" }}>Cada etapa cubierta.</em></>)}
        </motion.h2>
        <motion.div
          {...fadeUp}
          className="max-w-[520px] mx-auto rounded-[20px] overflow-hidden text-left mt-10"
          style={{ background: "#FFFDF9", border: "1px solid rgba(24,48,60,.08)", boxShadow: "0 20px 60px rgba(24,48,60,.08)" }}
        >
          <div className="px-8 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[.12em] text-white" style={{ background: "#F59E0B" }}>
            {t("PILOT PRICING · PUERTO RICO SOLAR TEAMS", "PRECIO PILOTO · EQUIPOS SOLARES PR")}
          </div>
          <div className="p-8">
            <div className="font-mono text-[12px] font-medium uppercase tracking-[.14em] mb-2.5" style={{ color: "#F59E0B" }}>
              Agente.Solar · Sol
            </div>
            <div className="font-extrabold text-[var(--navy)] leading-[.9] mb-1" style={{ fontSize: 72, letterSpacing: "-.045em" }}>
              $497<span className="text-[.4em] text-[var(--soft)] font-bold">/mo</span>
            </div>
            <div className="text-[13px] text-[var(--soft)] mb-6">
              $597 setup — <span className="font-semibold" style={{ color: "#F59E0B" }}>{t("waived for first 5 clients", "exonerado para los primeros 5 clientes")}</span>
            </div>
            <ul className="space-y-2.5 mb-7">
              {items.map((it) => (
                <li key={String(it)} className="flex gap-2.5 text-[14px] text-[var(--navy)] leading-[1.5]">
                  <span className="font-bold mt-px" style={{ color: "#F59E0B" }}>✓</span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
            <a
              href={demoUrl(lang)}
              className="block w-full text-center px-6 py-3.5 rounded-[12px] font-bold text-white text-[16px] transition-transform hover:-translate-y-px"
              style={{ background: "#F59E0B", boxShadow: "0 6px 24px rgba(245,158,11,.3)" }}
            >
              {t("Start free trial →", "Prueba gratis →")}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FAQ() {
  const { t } = useI18n();
  const items: [string, string][] = [
    [
      t("Does Sol know the ITC applies differently in Puerto Rico?", "¿Sol sabe que el ITC aplica diferente en Puerto Rico?"),
      t("Yes — and this is where most mainland solar AI gets it wrong. The 30% federal Investment Tax Credit only applies to taxpayers who file a US federal return. Most Puerto Rico residents do not file federal returns. Sol always asks this question before mentioning the ITC. He never promises the credit without confirming federal filing status.", "Sí — y aquí es donde la mayoría de IA solar del continente se equivoca. El crédito federal del 30% solo aplica a contribuyentes que declaran impuestos federales. La mayoría de los residentes de PR no declaran federal. Sol siempre hace esta pregunta antes de mencionar el ITC. Nunca promete el crédito sin confirmar el estado de declaración federal."),
    ],
    [
      t("Can Sol explain net metering to homeowners?", "¿Sol puede explicar la medición neta a los dueños?"),
      t("Yes. Sol knows that Act 10-2024 guarantees net metering in Puerto Rico through January 2030. He explains the annual true-up at 75% of the $0.10/kWh rate, LUMA's 30-business-day interconnection requirement, and the LUMA Battery Dispatch Program for battery owners. He educates without over-promising.", "Sí. Sol sabe que la Ley 10-2024 garantiza la medición neta en Puerto Rico hasta enero de 2030. Explica el true-up anual al 75% de $0.10/kWh, el requisito de interconexión de LUMA de 30 días hábiles y el Programa de Despacho de Baterías de LUMA. Educa sin prometer de más."),
    ],
    [
      t("Will Sol quote system sizes or prices?", "¿Sol cotizará tamaños de sistema o precios?"),
      t("Sol gives general context — a $380/mo LUMA bill usually points to a 9–12kW system — but never quotes a final price or commits to a system size. That happens during the site survey. He books it, you close it.", "Sol da contexto general — una factura LUMA de $380/mes generalmente apunta a un sistema de 9–12kW — pero nunca cotiza un precio final ni compromete un tamaño de sistema. Eso pasa durante la visita técnica. Él la agenda, tú la cierras."),
    ],
    [
      t("What channels does Sol cover?", "¿Qué canales cubre Sol?"),
      t("WhatsApp Business, SMS, Facebook Lead Ads, website forms, and referral text chains. Sol handles all inbound simultaneously — you never miss a lead because you were busy on another one.", "WhatsApp Business, SMS, Facebook Lead Ads, formularios web y cadenas de referidos por texto. Sol maneja todos los entrantes simultáneamente — nunca pierdes un lead porque estabas ocupado con otro."),
    ],
    [
      t("How long does setup take?", "¿Cuánto toma la configuración?"),
      t("48 hours once we have your team's information — service area, installer certifications, financing partners, and any current promotional offers. Sol is configured with your specific knowledge base, not a generic solar script.", "48 horas una vez tengamos la información de tu equipo — área de servicio, certificaciones del instalador, socios de financiamiento y cualquier oferta promocional actual. Sol se configura con tu base de conocimiento específica, no un guión solar genérico."),
    ],
  ];
  return (
    <section className="py-20" style={{ background: "var(--cream)" }}>
      <div className="max-w-[1080px] mx-auto px-7">
        <motion.div {...fadeUp} className="rounded-[24px] p-10" style={{ background: "#FFFDF9", border: "1px solid rgba(24,48,60,.08)" }}>
          <div className="font-mono text-[11px] font-medium tracking-[.16em] uppercase mb-3.5" style={{ color: "#F59E0B" }}>FAQ</div>
          <h2 className="font-extrabold text-[var(--navy)] mb-6" style={{ fontSize: "clamp(28px,4vw,50px)", lineHeight: 1.02, letterSpacing: "-.025em" }}>
            {t(<>Questions <em className="italic" style={{ color: "#F59E0B" }}>answered.</em></>, <>Preguntas <em className="italic" style={{ color: "#F59E0B" }}>resueltas.</em></>)}
          </h2>
          <div className="mt-8 divide-y divide-[rgba(24,48,60,.08)]">
            {items.map(([q, a]) => (
              <details key={q} className="group py-4">
                <summary className="cursor-pointer list-none flex justify-between items-center font-bold text-[17px] tracking-[-.01em] text-[var(--navy)]">
                  {q}
                  <span className="text-[22px] leading-none transition-transform group-open:rotate-45" style={{ color: "#F59E0B" }}>+</span>
                </summary>
                <div className="mt-3 text-[var(--soft)] leading-[1.65] text-[15px]">{a}</div>
              </details>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FinalCTA() {
  const { t, lang } = useI18n();
  return (
    <section className="text-center px-7 py-24" style={{ background: "var(--navy)" }}>
      <motion.h2
        {...fadeUp}
        className="font-extrabold text-[var(--cream)] mb-5 mx-auto max-w-[18ch]"
        style={{ fontSize: "clamp(32px,5vw,60px)", lineHeight: 1, letterSpacing: "-.028em" }}
      >
        {t(
          <>Stop losing solar leads to <em className="italic" style={{ color: "#F59E0B" }}>faster teams.</em></>,
          <>Deja de perder leads solares con <em className="italic" style={{ color: "#F59E0B" }}>equipos más rápidos.</em></>
        )}
      </motion.h2>
      <motion.p {...fadeUp} className="mx-auto max-w-[60ch] text-[17px] leading-[1.6] mb-9" style={{ color: "rgba(244,237,227,.7)" }}>
        {t(
          "The solar company that responds first gets the site survey. Sol makes sure that's you — every time, every channel, every hour.",
          "La empresa solar que responde primero consigue la visita técnica. Sol se asegura de que seas tú — siempre, en cada canal, a toda hora."
        )}
      </motion.p>
      <motion.div {...fadeUp} className="flex flex-wrap gap-3 justify-center">
        <a
          href={demoUrl(lang)}
          className="inline-flex items-center px-7 py-[15px] rounded-[12px] font-bold text-white text-[16px] transition-transform hover:-translate-y-px"
          style={{ background: "#F59E0B", boxShadow: "0 6px 24px rgba(245,158,11,.35)" }}
        >
          {t("Start free trial →", "Prueba gratis →")}
        </a>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-[15px] rounded-[12px] font-bold text-[16px] transition-colors"
          style={{ color: "var(--cream)", border: "1.5px solid rgba(244,237,227,.18)" }}
        >
          {t("← All Agente verticals", "← Todas las industrias")}
        </Link>
      </motion.div>
    </section>
  );
}
