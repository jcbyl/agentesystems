import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useI18n } from "@/lib/i18n";
import { demoUrl } from "@/lib/demo-link";
import ogImageUrl from "@/assets/og-construction.jpg";

const ORIGIN = "https://agentesystems.lovable.app";
const URL = `${ORIGIN}/construction`;
const OG_IMAGE = `${ORIGIN}${ogImageUrl}`;

export const Route = createFileRoute("/construction")({
  head: () => ({
    meta: [
      { title: "Agente.Construction — Marco · AI Agent for Contractors" },
      {
        name: "description",
        content:
          "Marco qualifies leads, books estimates, follows up on proposals, and manages the client lifecycle. Bilingual EN/ES for DC, MD, and VA contractors.",
      },
      { property: "og:title", content: "Agente.Construction — Marco" },
      {
        property: "og:description",
        content:
          "Instant lead qualification, free estimate booking, and full client lifecycle management for DC/MD/VA contractors. Bilingual EN/ES.",
      },
      { property: "og:url", content: URL },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:secure_url", content: OG_IMAGE },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Marco — bilingual EN/ES AI agent qualifying renovation leads, booking free estimates, and managing the full client lifecycle for DC, Maryland, and Virginia contractors" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Agente.Construction — Marco" },
      { name: "twitter:description", content: "Instant lead qualification, free estimate booking, and full client lifecycle management for DC/MD/VA contractors." },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "twitter:image:alt", content: "Marco — bilingual EN/ES AI agent qualifying renovation leads, booking free estimates, and managing the full client lifecycle for DC, Maryland, and Virginia contractors" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Agente.Construction — Marco",
          serviceType: "Bilingual AI agent for contractors",
          provider: { "@type": "Organization", name: "Agente.Systems", url: ORIGIN },
          areaServed: ["District of Columbia", "Maryland", "Virginia"],
          availableLanguage: ["en", "es"],
          description:
            "Instant lead qualification, free estimate booking, and full client lifecycle management for DC/MD/VA contractors. Bilingual EN/ES.",
          url: URL,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Does Marco know DC, Maryland, and Virginia codes?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Marco covers the 2021 VUSBC, DC Department of Buildings permit fees, Maryland MHIC licensing, Montgomery and Prince George's County specifics, and county-by-county permit timelines across the DMV.",
              },
            },
            {
              "@type": "Question",
              name: "Will Marco quote prices to leads?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Never. Marco gives general ranges to qualify leads but never commits to a number. Estimates are always done in person.",
              },
            },
            {
              "@type": "Question",
              name: "What if the lead asks about permits?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Marco confirms the company pulls permits and flags whether the project requires them, but defers specifics to the estimator without giving legal advice.",
              },
            },
            {
              "@type": "Question",
              name: "How does Marco handle after-hours leads?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Instantly. Marco responds within a second whenever the lead arrives. Quiet hours (10pm–7am ET) are configurable so he queues messages instead of texting at 2am.",
              },
            },
            {
              "@type": "Question",
              name: "How long does setup take?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "48 hours once we have your company info — services list, service area, VA/DC/MD license numbers, estimate availability, and Google Review link.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: ConstructionPage,
});

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
};

function ConstructionPage() {
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
          style={{ background: "rgba(232,65,24,.12)", color: "var(--coral)", border: "1px solid rgba(232,65,24,.25)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--coral)] animate-pulse" />
          {t(
            "Marco is live for Reston Restoration LLC · DC / MD / VA",
            "Marco está activo para Reston Restoration LLC · DC / MD / VA"
          )}
        </motion.div>
        <motion.h1
          {...fadeUp}
          className="font-extrabold text-[var(--cream)] mb-5"
          style={{ fontSize: "clamp(40px,6.5vw,82px)", lineHeight: 0.98, letterSpacing: "-.03em" }}
        >
          {t(
            <>Stop losing renovation leads. <em className="italic text-[var(--coral)]">Let Marco handle it.</em></>,
            <>Deja de perder leads de renovación. <em className="italic text-[var(--coral)]">Que Marco lo maneje.</em></>
          )}
        </motion.h1>
        <motion.p
          {...fadeUp}
          className="mx-auto max-w-[68ch] text-[18px] leading-[1.6] mb-9"
          style={{ color: "rgba(244,237,227,.72)" }}
        >
          {t(
            "Marco qualifies every inbound lead instantly — project type, location, budget, timeline — and books your free estimate before you finish your current job. Then he follows up on the proposal, updates the client during the job, and captures the Google review when it's done. All without you touching your phone.",
            "Marco califica cada lead al instante — tipo de proyecto, ubicación, presupuesto, cronograma — y agenda tu evaluación gratuita antes de que termines tu trabajo actual. Luego da seguimiento a la propuesta, actualiza al cliente durante el trabajo y captura la reseña de Google al terminar. Todo sin que toques tu teléfono."
          )}
        </motion.p>
        <motion.div {...fadeUp} className="flex flex-wrap gap-3 justify-center mb-8">
          <a
            href={demoUrl(lang)}
            className="inline-flex items-center gap-2 px-7 py-[15px] rounded-[12px] font-bold text-white text-[17px] transition-transform hover:-translate-y-px"
            style={{ background: "var(--coral)", boxShadow: "0 6px 24px rgba(232,65,24,.35)" }}
          >
            {t("Start free trial →", "Prueba gratis →")}
          </a>
          <a
            href="#features"
            className="inline-flex items-center px-6 py-[15px] rounded-[12px] font-bold text-[17px] transition-colors"
            style={{
              background: "rgba(244,237,227,.06)",
              color: "var(--cream)",
              border: "1.5px solid rgba(244,237,227,.14)",
            }}
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
            t("Free estimate booked same day", "Evaluación gratuita el mismo día"),
            t("DC · Maryland · Virginia", "DC · Maryland · Virginia"),
            t("Live in 48 hours", "En vivo en 48 horas"),
            t("Cancel anytime", "Cancela cuando quieras"),
          ].map((s, i) => (
            <span key={i} className="inline-flex items-center gap-1.5">
              <span className="text-[var(--coral)]">●</span> {s}
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
    [<>$75<em className="not-italic text-[var(--coral)]">K+</em></>, t("average renovation project value in DC/MD/VA", "valor promedio de proyecto de renovación en DC/MD/VA")],
    [<><em className="not-italic text-[var(--coral)]">&lt;</em>1<span className="text-[.45em] opacity-40">s</span></>, t("response time, every lead, every channel", "tiempo de respuesta, cada lead, cada canal")],
    [<>24<em className="not-italic text-[var(--coral)]">/</em>7</>, t("evenings, weekends, job sites", "noches, fines de semana, obras")],
    [<>3<em className="not-italic text-[var(--coral)]">×</em></>, t("jurisdictions — DC, Maryland, Virginia", "jurisdicciones — DC, Maryland, Virginia")],
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

function Features() {
  const { t } = useI18n();
  return (
    <section id="features" className="py-20" style={{ background: "var(--cream)" }}>
      <div className="max-w-[1080px] mx-auto px-7 space-y-20">
        <FeatureRow
          eyebrow={t("The Problem", "El Problema")}
          title={t(
            <>You're on the job site. <em className="italic text-[var(--coral)]">The lead just left.</em></>,
            <>Estás en la obra. <em className="italic text-[var(--coral)]">El lead se fue.</em></>
          )}
          body={t(
            "The best renovation leads come in at 7pm on a Tuesday when you're finishing a punch list. They text three contractors simultaneously. Whoever responds first gets the estimate. You find out the next morning.",
            "Los mejores leads llegan a las 7pm de un martes mientras terminas otra obra. Le escriben a tres contratistas a la vez. El primero en responder gana la evaluación. Tú te enteras al día siguiente."
          )}
          extra={t(
            "Marco is the reason that never happens again.",
            "Marco es la razón por la que eso no vuelve a pasar."
          )}
          card={
            <ChatCard
              tone="warn"
              messages={[
                { kind: "in", text: t("Hi — interested in a full bathroom remodel. Can someone come take a look?", "Hola — me interesa una remodelación completa de baño. ¿Alguien puede pasar?") },
                { kind: "note", text: t("No reply until 9am next day", "Sin respuesta hasta las 9am del día siguiente") },
                { kind: "in", italic: true, text: t("\"Already went with someone else, thanks\"", "\"Ya contraté a otro, gracias\"") },
                { kind: "note", text: t("$25,000 estimate · lost.", "Evaluación de $25,000 · perdida.") },
              ]}
            />
          }
        />
        <FeatureRow
          reverse
          eyebrow={t("The Solution", "La Solución")}
          title={t(
            <>Marco qualifies. <em className="italic text-[var(--coral)]">You show up to the right job.</em></>,
            <>Marco califica. <em className="italic text-[var(--coral)]">Tú llegas al trabajo correcto.</em></>
          )}
          body={t(
            "Marco responds in under a second. He collects project type, location, timeline, and budget — and gets the estimate on the calendar before you even know the lead came in. You walk onto an estimate where the homeowner is already expecting you.",
            "Marco responde en menos de un segundo. Captura tipo de proyecto, ubicación, cronograma y presupuesto — y agenda la evaluación antes de que sepas que llegó el lead. Llegas a una evaluación donde el cliente ya te espera."
          )}
          card={
            <ChatCard
              tone="ok"
              messages={[
                { kind: "in", text: "Hi — interested in a full bathroom remodel." },
                { kind: "out", text: "Hi! Marco with Reston Restoration. Love it — what's the address? Want to make sure we cover your area." },
                { kind: "in", text: "4520 Drummond Ave, Chevy Chase MD" },
                { kind: "out", text: "Perfect — right in our wheelhouse. Full gut or cosmetic refresh?" },
                { kind: "in", text: "Full gut, I want to move the shower." },
                { kind: "out", text: "Got it — layout change, so permits will be involved. Free estimate works for Thursday or Friday?" },
              ]}
            />
          }
        />
        <FeatureRow
          eyebrow={t("The Digest", "El Resumen")}
          title={t(
            <>Walk onto the estimate <em className="italic text-[var(--coral)]">already knowing.</em></>,
            <>Llega a la evaluación <em className="italic text-[var(--coral)]">ya sabiendo todo.</em></>
          )}
          body={t(
            "Before you arrive, Marco sends a summary to your phone: project type, scope, property address, homeowner name, what they told him, and any flags (structural, pre-1978, DC historic district). You walk in prepared, not cold.",
            "Antes de llegar, Marco te envía un resumen al teléfono: tipo de proyecto, alcance, dirección, nombre del cliente, lo que dijo y cualquier alerta (estructural, pre-1978, distrito histórico de DC). Llegas preparado."
          )}
          card={<DigestCard />}
        />
      </div>
    </section>
  );
}

function FeatureRow({
  eyebrow,
  title,
  body,
  extra,
  card,
  reverse,
}: {
  eyebrow: string;
  title: React.ReactNode;
  body: string;
  extra?: string;
  card: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <motion.div
      {...fadeUp}
      className={`grid md:grid-cols-2 gap-10 items-center ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}
    >
      <div>
        <div className="font-mono text-[11px] font-medium tracking-[.16em] uppercase text-[var(--coral)] mb-3.5">
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

type Msg = { kind: "in" | "out" | "note"; text: React.ReactNode; italic?: boolean };

function ChatCard({ messages, tone }: { messages: Msg[]; tone: "ok" | "warn" }) {
  const accent = tone === "ok" ? "rgba(56,142,255,.08)" : "rgba(232,65,24,.06)";
  return (
    <div
      className="rounded-[18px] p-5"
      style={{ background: accent, border: "1px solid rgba(24,48,60,.08)" }}
    >
      <div className="flex flex-col gap-2">
        {messages.map((m, i) => {
          if (m.kind === "note") {
            return (
              <div
                key={i}
                className="font-mono text-[11px] text-center my-1 py-[7px] px-2 rounded-md"
                style={{ background: "rgba(24,48,60,.04)", color: "var(--soft)" }}
              >
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
                background: isIn ? "#FFF" : "var(--coral)",
                color: isIn ? (m.italic ? "var(--coral)" : "var(--navy)") : "#FFF",
                fontStyle: m.italic ? "italic" : "normal",
                borderBottomLeftRadius: isIn ? 4 : 14,
                borderBottomRightRadius: isIn ? 14 : 4,
                boxShadow: isIn ? "0 1px 4px rgba(24,48,60,.08)" : "0 4px 14px rgba(232,65,24,.2)",
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

function DigestCard() {
  const { t } = useI18n();
  const rows: [string, string][] = [
    [t("Scope", "Alcance"), t("Full bath gut · shower relocation", "Baño completo · reubicar ducha")],
    [t("Timeline", "Cronograma"), t("Spring — before summer", "Primavera — antes del verano")],
    [t("Budget", "Presupuesto"), t("Open — \"do it right\"", "Abierto — \"hacerlo bien\"")],
    [t("Flags", "Alertas"), t("Permits required · MoCo", "Permisos requeridos · MoCo")],
  ];
  return (
    <div
      className="rounded-[18px] p-6"
      style={{ background: "rgba(255,253,249,.85)", border: "1px solid rgba(24,48,60,.08)", boxShadow: "0 8px 30px rgba(24,48,60,.06)" }}
    >
      <div className="font-mono text-[10px] font-semibold uppercase tracking-[.1em] text-[var(--coral)] mb-2">
        {t("ESTIMATE BOOKED — THU 10AM", "EVALUACIÓN AGENDADA — JUE 10AM")}
      </div>
      <div className="font-bold text-[15px] text-[var(--navy)] mb-3">
        Jennifer K. · 4520 Drummond Ave, Chevy Chase MD
      </div>
      <div className="grid grid-cols-[110px_1fr] gap-y-2 gap-x-4 text-[14px]">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <strong className="font-mono text-[9px] font-semibold uppercase tracking-[.08em] mt-1" style={{ color: "rgba(24,48,60,.4)" }}>
              {k}
            </strong>
            <span className="text-[var(--navy)]">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Lifecycle() {
  const { t } = useI18n();
  const steps: [string, string, string][] = [
    [t("INBOUND", "ENTRADA"), t("Qualify + book", "Califica + agenda"), t("Scope, location, budget, timeline, pre-1978 flag. Estimate on the calendar.", "Alcance, ubicación, presupuesto, cronograma, alerta pre-1978. Evaluación en el calendario.")],
    [t("PRE-ESTIMATE", "PRE-EVALUACIÓN"), t("Appointment reminders", "Recordatorios de cita"), t("24h reminder + day-of ping. Kills no-shows before they happen.", "Recordatorio 24h + ping del día. Elimina los no-shows.")],
    [t("PROPOSAL", "PROPUESTA"), t("Day 3 · 5 · 7 follow-up", "Seguimiento Día 3 · 5 · 7"), t("Three-touch nudge sequence if no response. Includes price objection handling.", "Tres toques si no responde. Incluye manejo de objeciones de precio.")],
    [t("ACTIVE JOB", "OBRA ACTIVA"), t("Milestone updates", "Actualizaciones de hitos"), t("Kickoff message, mid-project check-in, punch list notice. Client always knows where things stand.", "Mensaje de arranque, chequeo a mitad, aviso de punch list. El cliente siempre sabe dónde está.")],
    [t("COMPLETE", "COMPLETADO"), t("Review + referral", "Reseña + referido"), t("Google review link 48h after job. Referral ask 2 days later. Automatic.", "Link de reseña de Google 48h después. Pedido de referido 2 días después. Automático.")],
    [t("LONG-TERM", "LARGO PLAZO"), t("Warranty + reactivation", "Garantía + reactivación"), t("6-month and 12-month check-ins. Dead leads get seasonal pings at 90 days.", "Chequeos a los 6 y 12 meses. Leads dormidos reciben pings estacionales a los 90 días.")],
  ];
  return (
    <section id="lifecycle" className="py-20" style={{ background: "var(--cream-soft, #EDE5D6)" }}>
      <div className="max-w-[1080px] mx-auto px-7">
        <motion.div {...fadeUp} className="font-mono text-[11px] font-medium tracking-[.16em] uppercase text-[var(--coral)] mb-3.5">
          {t("Beyond the estimate", "Más allá de la evaluación")}
        </motion.div>
        <motion.h2 {...fadeUp} className="font-extrabold text-[var(--navy)] mb-4" style={{ fontSize: "clamp(28px,4vw,50px)", lineHeight: 1.02, letterSpacing: "-.025em" }}>
          {t(
            <>Marco owns the full <em className="italic text-[var(--coral)]">client lifecycle.</em></>,
            <>Marco maneja todo el <em className="italic text-[var(--coral)]">ciclo del cliente.</em></>
          )}
        </motion.h2>
        <motion.p {...fadeUp} className="max-w-[58ch] text-[var(--soft)] leading-[1.65] mb-10">
          {t(
            "Most contractor CRMs stop at booking. Marco runs the entire relationship — from first text to one-year warranty check-in.",
            "La mayoría de CRMs para contratistas paran en el booking. Marco maneja toda la relación — desde el primer texto hasta el chequeo de garantía al año."
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
              <div className="font-mono text-[10px] font-semibold tracking-[.1em] text-[var(--coral)] mb-2">{n}</div>
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
    t("Lead qualification — scope, location, budget, timeline, pre-1978 flag", "Calificación de leads — alcance, ubicación, presupuesto, cronograma, alerta pre-1978"),
    t("Free estimate booked same day, every time", "Evaluación gratuita agendada el mismo día, siempre"),
    t("24h + day-of appointment reminders (reduce no-shows)", "Recordatorios 24h + día de la cita (reduce no-shows)"),
    t("Proposal follow-up — Day 3, Day 5, Day 7 nudge sequence", "Seguimiento de propuesta — secuencia Día 3, 5, 7"),
    t("Active job milestone updates sent to your client", "Actualizaciones de hitos enviadas a tu cliente"),
    t("Google review request + referral capture after job complete", "Pedido de reseña de Google + captura de referido al completar"),
    t("6-month and 12-month warranty check-ins", "Chequeos de garantía a los 6 y 12 meses"),
    t("Dead lead reactivation — seasonal pings at 90 days", "Reactivación de leads dormidos — pings estacionales a los 90 días"),
    t("DC, Maryland, and Virginia permit + code knowledge built in", "Conocimiento de permisos y códigos de DC, MD y VA integrado"),
    t("Live in 48 hours · Cancel anytime", "En vivo en 48 horas · Cancela cuando quieras"),
  ];
  return (
    <section id="pricing" className="py-20" style={{ background: "var(--cream)" }}>
      <div className="max-w-[1080px] mx-auto px-7 text-center">
        <motion.div {...fadeUp} className="font-mono text-[11px] font-medium tracking-[.16em] uppercase text-[var(--coral)] mb-3.5">
          {t("Pricing", "Precios")}
        </motion.div>
        <motion.h2 {...fadeUp} className="font-extrabold text-[var(--navy)] mb-4" style={{ fontSize: "clamp(28px,4vw,50px)", lineHeight: 1.02, letterSpacing: "-.025em" }}>
          {t(
            <>One plan. <em className="italic text-[var(--coral)]">Everything included.</em></>,
            <>Un solo plan. <em className="italic text-[var(--coral)]">Todo incluido.</em></>
          )}
        </motion.h2>
        <motion.p {...fadeUp} className="max-w-[50ch] mx-auto text-[18px] text-[var(--mid)] leading-[1.55] mb-10">
          {t(
            "Marco qualifies, books, follows up, updates, reviews, and reactivates. Every lead. Every stage. Without you picking up the phone.",
            "Marco califica, agenda, da seguimiento, actualiza, captura reseñas y reactiva. Cada lead. Cada etapa. Sin que toques el teléfono."
          )}
        </motion.p>
        <motion.div
          {...fadeUp}
          className="max-w-[520px] mx-auto rounded-[20px] overflow-hidden text-left"
          style={{ background: "var(--white, #FFFDF9)", border: "1px solid rgba(24,48,60,.08)", boxShadow: "0 20px 60px rgba(24,48,60,.08)" }}
        >
          <div className="px-8 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[.12em] text-white" style={{ background: "var(--coral)" }}>
            {t("PILOT PRICING · DC / MD / VA CONTRACTORS", "PRECIO PILOTO · CONTRATISTAS DC / MD / VA")}
          </div>
          <div className="p-8">
            <div className="font-mono text-[12px] font-medium uppercase tracking-[.14em] text-[var(--coral)] mb-2.5">
              Agente.Construction · Marco
            </div>
            <div className="font-extrabold text-[var(--navy)] leading-[.9] mb-1" style={{ fontSize: 72, letterSpacing: "-.045em" }}>
              $397<span className="text-[.4em] text-[var(--soft)] font-bold">/mo</span>
            </div>
            <div className="text-[13px] text-[var(--soft)] mb-6">
              $497 setup — <span className="text-[var(--coral)] font-semibold">{t("waived for first 5 clients", "exonerado para los primeros 5 clientes")}</span>
            </div>
            <ul className="space-y-2.5 mb-7">
              {items.map((it) => (
                <li key={String(it)} className="flex gap-2.5 text-[14px] text-[var(--navy)] leading-[1.5]">
                  <span className="text-[var(--coral)] font-bold mt-px">✓</span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
            <a
              href={demoUrl(lang)}
              className="block w-full text-center px-6 py-3.5 rounded-[12px] font-bold text-white text-[16px] transition-transform hover:-translate-y-px"
              style={{ background: "var(--coral)", boxShadow: "0 6px 24px rgba(232,65,24,.3)" }}
            >
              {t("Start free trial →", "Prueba gratis →")}
            </a>
          </div>
        </motion.div>
        <p className="mt-4 text-[13px] text-[var(--soft)]">
          {t("Multi-location or franchise pricing · ", "Precio multi-sucursal o franquicia · ")}
          <a href={demoUrl(lang)} className="text-[var(--coral)] font-semibold">
            {t("Message for a quote", "Escríbenos para una cotización")}
          </a>
        </p>
      </div>
    </section>
  );
}

function FAQ() {
  const { t } = useI18n();
  const items: [string, string][] = [
    [
      t("Does Marco know DC, Maryland, AND Virginia codes?", "¿Marco conoce los códigos de DC, Maryland Y Virginia?"),
      t(
        "Yes. Marco's knowledge base covers the 2021 VUSBC (Virginia Uniform Statewide Building Code), DC Department of Buildings permit fees and process, Maryland MHIC licensing requirements, Montgomery County and Prince George's County specifics, and county-by-county permit timelines across the DMV. He flags historic district properties in DC automatically.",
        "Sí. La base de conocimiento de Marco cubre el VUSBC 2021 (código de construcción de Virginia), tarifas y proceso del Departamento de Edificaciones de DC, requisitos de licencia MHIC de Maryland, particularidades de Montgomery County y Prince George's County, y plazos de permisos condado por condado en todo el DMV. Marca automáticamente las propiedades en distritos históricos de DC."
      ),
    ],
    [
      t("Will Marco quote prices to leads?", "¿Marco da precios a los leads?"),
      t(
        "Never. Marco provides general ranges to qualify leads (\"a full kitchen in Montgomery County typically runs $75K–$140K depending on scope\") but never commits to a number. Estimates are always done in person. This is a hard rule built into Marco's SOUL.md.",
        "Nunca. Marco da rangos generales para calificar (\"una cocina completa en Montgomery County suele costar $75K–$140K según alcance\") pero nunca compromete un número. Las evaluaciones son siempre en persona. Es una regla dura del SOUL.md de Marco."
      ),
    ],
    [
      t("What if the lead asks about permits?", "¿Y si el lead pregunta sobre permisos?"),
      t(
        "Marco explains that permits are part of every job and confirms the company pulls them — but defers specifics to the estimator. He knows enough to flag whether a project requires permits and which jurisdiction is involved, without overstepping into legal advice.",
        "Marco explica que los permisos son parte del trabajo y confirma que la empresa los gestiona — pero deja los detalles al evaluador. Sabe lo suficiente para señalar si un proyecto requiere permisos y qué jurisdicción aplica, sin meterse en asesoría legal."
      ),
    ],
    [
      t("How does Marco handle after-hours leads?", "¿Cómo maneja Marco los leads fuera de horario?"),
      t(
        "Instantly. Marco responds within a second regardless of when the lead comes in. Quiet hours (10pm–7am ET) are configurable — Marco queues messages and sends first thing in the morning rather than texting at 2am.",
        "Al instante. Marco responde en menos de un segundo sin importar cuándo llegue el lead. Las horas de silencio (10pm–7am ET) son configurables — Marco encola los mensajes y los envía en la mañana en lugar de escribir a las 2am."
      ),
    ],
    [
      t("How long does setup take?", "¿Cuánto toma la configuración?"),
      t(
        "48 hours once we have your company information — services list, service area, VA/DC/MD license numbers, estimate availability, and Google Review link. We configure Marco, provision your Twilio number, and run test conversations before going live.",
        "48 horas una vez tengamos la info de tu empresa — lista de servicios, área de servicio, números de licencia VA/DC/MD, disponibilidad para evaluaciones y link de Google Review. Configuramos a Marco, asignamos tu número Twilio y corremos conversaciones de prueba antes de salir en vivo."
      ),
    ],
  ];
  return (
    <section className="py-20" style={{ background: "var(--cream)" }}>
      <div className="max-w-[1080px] mx-auto px-7">
        <motion.div
          {...fadeUp}
          className="rounded-[24px] p-10"
          style={{ background: "var(--white, #FFFDF9)", border: "1px solid rgba(24,48,60,.08)" }}
        >
          <div className="font-mono text-[11px] font-medium tracking-[.16em] uppercase text-[var(--coral)] mb-3.5">FAQ</div>
          <h2 className="font-extrabold text-[var(--navy)] mb-6" style={{ fontSize: "clamp(28px,4vw,50px)", lineHeight: 1.02, letterSpacing: "-.025em" }}>
            {t(
              <>Questions <em className="italic text-[var(--coral)]">answered.</em></>,
              <>Preguntas <em className="italic text-[var(--coral)]">resueltas.</em></>
            )}
          </h2>
          <div className="mt-8 divide-y divide-[rgba(24,48,60,.08)]">
            {items.map(([q, a]) => (
              <details key={q} className="group py-4">
                <summary className="cursor-pointer list-none flex justify-between items-center font-bold text-[17px] tracking-[-.01em] text-[var(--navy)]">
                  {q}
                  <span className="text-[var(--coral)] text-[22px] leading-none transition-transform group-open:rotate-45">+</span>
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
          <>Stop losing leads to <em className="italic text-[var(--coral)]">faster contractors.</em></>,
          <>Deja de perder leads con <em className="italic text-[var(--coral)]">contratistas más rápidos.</em></>
        )}
      </motion.h2>
      <motion.p {...fadeUp} className="mx-auto max-w-[60ch] text-[17px] leading-[1.6] mb-9" style={{ color: "rgba(244,237,227,.7)" }}>
        {t(
          "The contractor who responds first gets the estimate. The contractor who follows up consistently closes more proposals. Marco does both, around the clock, without you touching your phone.",
          "El contratista que responde primero consigue la evaluación. El que da seguimiento consistente cierra más propuestas. Marco hace ambas cosas, las 24 horas, sin que toques el teléfono."
        )}
      </motion.p>
      <motion.div {...fadeUp} className="flex flex-wrap gap-3 justify-center">
        <a
          href={demoUrl(lang)}
          className="inline-flex items-center px-7 py-[15px] rounded-[12px] font-bold text-white text-[16px] transition-transform hover:-translate-y-px"
          style={{ background: "var(--coral)", boxShadow: "0 6px 24px rgba(232,65,24,.35)" }}
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