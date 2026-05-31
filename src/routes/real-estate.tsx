import { createFileRoute, Link } from "@tanstack/react-router";
import { hreflangLinks } from "@/lib/hreflang";
import { motion } from "framer-motion";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useI18n } from "@/lib/i18n";
import { demoUrl } from "@/lib/demo-link";
import ogImageUrl from "@/assets/og-real-estate.jpg";

const ORIGIN = "https://agente.systems";
const URL = `${ORIGIN}/real-estate`;
const OG_IMAGE = `${ORIGIN}${ogImageUrl}`;

export const Route = createFileRoute("/real-estate")({
  head: () => ({
    meta: [
      { title: "Agente.RealEstate — Carmen · AI Agent for Real Estate Teams" },
      {
        name: "description",
        content:
          "Carmen qualifies buyers, books showings, sends hot-lead digests, and follows up on every listing. Bilingual EN/ES/Spanglish for US real estate teams.",
      },
      { property: "og:title", content: "Agente.RealEstate — Carmen" },
      {
        property: "og:description",
        content:
          "Instant buyer qualification, showing bookings, and hot-lead digests for US real estate teams. Bilingual EN/ES/Spanglish.",
      },
      { property: "og:url", content: URL },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:secure_url", content: OG_IMAGE },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Carmen — bilingual EN/ES/Spanglish AI agent qualifying buyers, booking showings, and sending hot-lead digests for US real estate teams" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Agente.RealEstate — Carmen" },
      { name: "twitter:description", content: "Instant buyer qualification, showing bookings, and hot-lead digests for US real estate teams. Bilingual EN/ES/Spanglish." },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "twitter:image:alt", content: "Carmen — bilingual EN/ES/Spanglish AI agent qualifying buyers, booking showings, and sending hot-lead digests for US real estate teams" },
    ],
    links: [{ rel: "canonical", href: URL }, ...hreflangLinks(URL)],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Agente.RealEstate — Carmen",
          serviceType: "Bilingual AI agent for real estate teams",
          provider: { "@type": "Organization", name: "Agente.Systems", url: ORIGIN },
          areaServed: "United States",
          availableLanguage: ["en", "es"],
          description:
            "Instant buyer qualification, showing bookings, and hot-lead digests for US real estate teams. Bilingual EN/ES/Spanglish.",
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
              name: "Can Carmen really handle Spanglish?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Carmen auto-detects language on every message and matches the lead — English, Spanish, or code-switching mid-sentence. She replies natively in whichever register the buyer is using.",
              },
            },
            {
              "@type": "Question",
              name: "Which lead sources does Carmen plug into?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Zillow Premier Agent, Realtor.com, Facebook Lead Ads, Instagram DMs, website forms, WhatsApp Business, and inbound SMS — all in one inbox.",
              },
            },
            {
              "@type": "Question",
              name: "Will Carmen quote prices or commit to terms?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Never. Carmen surfaces listing facts and recent comps but never negotiates, commits to a price reduction, or discusses commission splits. All deal terms stay with you.",
              },
            },
            {
              "@type": "Question",
              name: "What about after-hours leads?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Instant. Carmen responds within a second regardless of when the lead arrives. Quiet hours (10pm–7am local) are configurable so she queues messages instead of texting at 2am.",
              },
            },
            {
              "@type": "Question",
              name: "How long does setup take?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "24 hours once we have your team info — service area, agent roster, lead-source credentials, calendar access, and Google Review link.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: RealEstatePage,
});

const fadeUp = {
  initial: false,
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
};

function RealEstatePage() {
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
            "Carmen is live for Fitzpatrick Team RE/MAX",
            "Carmen está activa para Fitzpatrick Team RE/MAX"
          )}
        </motion.div>
        <motion.h1
          {...fadeUp}
          className="font-extrabold text-[var(--cream)] mb-5"
          style={{ fontSize: "clamp(40px,6.5vw,82px)", lineHeight: 0.98, letterSpacing: "-.03em" }}
        >
          {t(
            <>Stop losing buyers to <em className="italic text-[var(--coral)]">faster agents.</em></>,
            <>Deja de perder compradores con <em className="italic text-[var(--coral)]">agentes más rápidos.</em></>
          )}
        </motion.h1>
        <motion.p
          {...fadeUp}
          className="mx-auto max-w-[68ch] text-[18px] leading-[1.6] mb-9"
          style={{ color: "rgba(244,237,227,.72)" }}
        >
          {t(
            "Carmen replies to every Zillow, Realtor.com, and Facebook lead in under a second — bilingual EN/ES/Spanglish. She qualifies buyers (pre-approval, timeline, must-haves), books the showing, and sends you a hot-lead digest with everything you need before you walk in the door.",
            "Carmen responde a cada lead de Zillow, Realtor.com y Facebook en menos de un segundo — bilingüe EN/ES/Spanglish. Califica compradores (pre-aprobación, cronograma, requisitos), agenda la visita y te envía un resumen de lead caliente con todo lo necesario antes de llegar."
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
            t("Showings booked same day", "Visitas agendadas el mismo día"),
            t("Bilingual EN · ES · Spanglish", "Bilingüe EN · ES · Spanglish"),
            t("Live in 24 hours", "En vivo en 24 horas"),
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
    [<>78<em className="not-italic text-[var(--coral)]">%</em></>, t("of online buyers choose the first agent who replies", "de los compradores online eligen al primer agente que responde")],
    [<><em className="not-italic text-[var(--coral)]">&lt;</em>1<span className="text-[.45em] opacity-40">s</span></>, t("response time on every lead, every channel", "tiempo de respuesta en cada lead y cada canal")],
    [<>24<em className="not-italic text-[var(--coral)]">/</em>7</>, t("evenings, weekends, open-house hours", "noches, fines de semana, horas de open house")],
    [<>2<em className="not-italic text-[var(--coral)]">×</em></>, t("languages — English & Spanish, with Spanglish detection", "idiomas — inglés y español, con detección de Spanglish")],
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
            <>You're at a closing. <em className="italic text-[var(--coral)]">Three new leads just messaged.</em></>,
            <>Estás en un cierre. <em className="italic text-[var(--coral)]">Tres leads nuevos te acaban de escribir.</em></>
          )}
          body={t(
            "Real-estate leads don't wait. The Zillow inquiry that comes in at 8pm Saturday goes to whichever agent texts back fastest — typically within five minutes. By the time you check your phone after dinner, they've already toured a comp with someone else.",
            "Los leads de bienes raíces no esperan. La consulta de Zillow que llega un sábado a las 8pm va al agente que responda más rápido — usualmente en cinco minutos. Para cuando revisas el teléfono después de la cena, ya recorrieron una propiedad comparable con otro."
          )}
          extra={t(
            "Carmen is the reason that never happens again.",
            "Carmen es la razón por la que eso no vuelve a pasar."
          )}
          card={
            <ChatCard
              tone="warn"
              messages={[
                { kind: "in", text: t("Hi! Saw the 4BR on Maple. Can we see it this weekend?", "Hola! Vi la casa de 4 cuartos en Maple. ¿Podemos verla este fin?") },
                { kind: "note", text: t("No reply until Monday morning", "Sin respuesta hasta el lunes en la mañana") },
                { kind: "in", italic: true, text: t("\"Already saw it with another agent — putting in an offer\"", "\"Ya la vimos con otro agente — vamos a hacer oferta\"") },
                { kind: "note", text: t("$8,400 commission · lost.", "Comisión de $8,400 · perdida.") },
              ]}
            />
          }
        />
        <FeatureRow
          reverse
          eyebrow={t("The Solution", "La Solución")}
          title={t(
            <>Carmen qualifies. <em className="italic text-[var(--coral)]">You show the right house.</em></>,
            <>Carmen califica. <em className="italic text-[var(--coral)]">Tú muestras la casa correcta.</em></>
          )}
          body={t(
            "Carmen responds in under a second, in whichever language the lead used. She confirms timeline, pre-approval status, must-haves, and dealbreakers — then puts the showing on your calendar with directions, gate code, and lockbox details already arranged.",
            "Carmen responde en menos de un segundo, en el idioma que usó el lead. Confirma cronograma, estado de pre-aprobación, requisitos y dealbreakers — luego pone la visita en tu calendario con direcciones, código de portón y datos del lockbox ya coordinados."
          )}
          card={
            <ChatCard
              tone="ok"
              messages={[
                { kind: "in", text: "Hi! Saw the 4BR on Maple. Can we see it this weekend?" },
                { kind: "out", text: "Hi! Carmen with Fitzpatrick Team. Love that listing — quick check, are you pre-approved or working with a lender yet?" },
                { kind: "in", text: "Pre-approved up to $675K with Wells Fargo." },
                { kind: "out", text: "Perfect — that one's $649K, you're in great shape. Anyone else viewing? Want to lock Saturday at 11am?" },
                { kind: "in", text: "Yes please. Just me and my wife." },
                { kind: "out", text: "Booked. Sending the listing sheet + comps now — Mike (your agent) will meet you at the door." },
              ]}
            />
          }
        />
        <FeatureRow
          eyebrow={t("The Digest", "El Resumen")}
          title={t(
            <>Walk into the showing <em className="italic text-[var(--coral)]">already knowing.</em></>,
            <>Llega a la visita <em className="italic text-[var(--coral)]">ya sabiendo todo.</em></>
          )}
          body={t(
            "Before you arrive, Carmen sends you a hot-lead digest: buyer profile, pre-approval status, timeline, must-haves, dealbreakers, and the conversation summary. You walk in prepared — not asking the same questions Carmen already asked.",
            "Antes de llegar, Carmen te envía un resumen de lead caliente: perfil del comprador, estado de pre-aprobación, cronograma, requisitos, dealbreakers y resumen de la conversación. Llegas preparado — sin repetir las preguntas que Carmen ya hizo."
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
    [t("Pre-approval", "Pre-aprobación"), t("$675K · Wells Fargo", "$675K · Wells Fargo")],
    [t("Timeline", "Cronograma"), t("Closing in 60 days", "Cierre en 60 días")],
    [t("Must-haves", "Requisitos"), t("4BR · fenced yard · top schools", "4 cuartos · patio · escuelas top")],
    [t("Dealbreakers", "Dealbreakers"), t("HOA over $400/mo · busy road", "HOA sobre $400/mes · vía rápida")],
  ];
  return (
    <div
      className="rounded-[18px] p-6"
      style={{ background: "rgba(255,253,249,.85)", border: "1px solid rgba(24,48,60,.08)", boxShadow: "0 8px 30px rgba(24,48,60,.06)" }}
    >
      <div className="font-mono text-[10px] font-semibold uppercase tracking-[.1em] text-[var(--coral)] mb-2">
        {t("SHOWING BOOKED — SAT 11AM", "VISITA AGENDADA — SAB 11AM")}
      </div>
      <div className="font-bold text-[15px] text-[var(--navy)] mb-3">
        David & Lisa M. · 412 Maple Ave
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
    [t("INBOUND", "ENTRADA"), t("Qualify + book", "Califica + agenda"), t("Pre-approval, timeline, must-haves, dealbreakers. Showing on the calendar.", "Pre-aprobación, cronograma, requisitos, dealbreakers. Visita en el calendario.")],
    [t("PRE-SHOWING", "PRE-VISITA"), t("Confirmations + comps", "Confirmaciones + comps"), t("24h reminder + day-of ping with directions and three recent comps. Kills no-shows.", "Recordatorio 24h + ping del día con direcciones y tres comps recientes. Elimina los no-shows.")],
    [t("POST-SHOWING", "POST-VISITA"), t("Day 1 · 3 · 7 follow-up", "Seguimiento Día 1 · 3 · 7"), t("Three-touch nudge sequence — feedback, new listings, market update. Carmen handles objections.", "Tres toques — feedback, listings nuevos, update del mercado. Carmen maneja objeciones.")],
    [t("UNDER CONTRACT", "BAJO CONTRATO"), t("Milestone updates", "Actualizaciones de hitos"), t("Inspection, appraisal, financing, closing date — buyer always knows where things stand.", "Inspección, tasación, financiamiento, fecha de cierre — el comprador siempre sabe dónde está.")],
    [t("CLOSED", "CERRADO"), t("Review + referral", "Reseña + referido"), t("Google review link 48h after closing. Referral ask two weeks later. Automatic.", "Link de reseña de Google 48h después del cierre. Pedido de referido dos semanas después. Automático.")],
    [t("LONG-TERM", "LARGO PLAZO"), t("Home anniversary + reactivation", "Aniversario + reactivación"), t("1-year home anniversary message. Cold buyer leads get seasonal pings at 90 days.", "Mensaje en el aniversario de la casa. Leads fríos reciben pings estacionales a los 90 días.")],
  ];
  return (
    <section id="lifecycle" className="py-20" style={{ background: "var(--cream-soft, #EDE5D6)" }}>
      <div className="max-w-[1080px] mx-auto px-7">
        <motion.div {...fadeUp} className="font-mono text-[11px] font-medium tracking-[.16em] uppercase text-[var(--coral)] mb-3.5">
          {t("Beyond the showing", "Más allá de la visita")}
        </motion.div>
        <motion.h2 {...fadeUp} className="font-extrabold text-[var(--navy)] mb-4" style={{ fontSize: "clamp(28px,4vw,50px)", lineHeight: 1.02, letterSpacing: "-.025em" }}>
          {t(
            <>Carmen owns the full <em className="italic text-[var(--coral)]">buyer lifecycle.</em></>,
            <>Carmen maneja todo el <em className="italic text-[var(--coral)]">ciclo del comprador.</em></>
          )}
        </motion.h2>
        <motion.p {...fadeUp} className="max-w-[58ch] text-[var(--soft)] leading-[1.65] mb-10">
          {t(
            "Most real-estate CRMs stop at the showing. Carmen runs the entire relationship — from first text to one-year home anniversary.",
            "La mayoría de CRMs paran en la visita. Carmen maneja toda la relación — desde el primer texto hasta el aniversario de la casa."
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
    t("Bilingual EN/ES/Spanglish auto-detect on every conversation", "Detección automática EN/ES/Spanglish en cada conversación"),
    t("Lead qualification — pre-approval, timeline, must-haves, dealbreakers", "Calificación de leads — pre-aprobación, cronograma, requisitos, dealbreakers"),
    t("Showings booked same day on your calendar (Google / Outlook)", "Visitas agendadas el mismo día en tu calendario (Google / Outlook)"),
    t("Hot-lead digest delivered before every showing", "Resumen de lead caliente antes de cada visita"),
    t("24h + day-of showing reminders with directions and comps", "Recordatorios 24h + día de la visita con direcciones y comps"),
    t("Post-showing follow-up — Day 1, Day 3, Day 7 nudge sequence", "Seguimiento post-visita — secuencia Día 1, 3, 7"),
    t("Under-contract milestone updates sent to your client", "Actualizaciones de hitos bajo contrato enviadas a tu cliente"),
    t("Google review request + referral capture after closing", "Pedido de reseña de Google + captura de referido al cerrar"),
    t("Home anniversary check-ins + dead-lead reactivation", "Chequeos en el aniversario de la casa + reactivación de leads dormidos"),
    t("Zillow, Realtor.com, Facebook, WhatsApp, SMS — all in one inbox", "Zillow, Realtor.com, Facebook, WhatsApp, SMS — todo en un solo inbox"),
    t("Live in 24 hours · Cancel anytime", "En vivo en 24 horas · Cancela cuando quieras"),
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
            "Carmen qualifies, books, follows up, updates, reviews, and reactivates. Every lead. Every stage. Without you picking up the phone.",
            "Carmen califica, agenda, da seguimiento, actualiza, captura reseñas y reactiva. Cada lead. Cada etapa. Sin que toques el teléfono."
          )}
        </motion.p>
        <motion.div
          {...fadeUp}
          className="max-w-[520px] mx-auto rounded-[20px] overflow-hidden text-left"
          style={{ background: "var(--white, #FFFDF9)", border: "1px solid rgba(24,48,60,.08)", boxShadow: "0 20px 60px rgba(24,48,60,.08)" }}
        >
          <div className="px-8 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[.12em] text-white" style={{ background: "var(--coral)" }}>
            {t("PILOT PRICING · US REAL ESTATE TEAMS", "PRECIO PILOTO · EQUIPOS DE BIENES RAÍCES EE.UU.")}
          </div>
          <div className="p-8">
            <div className="font-mono text-[12px] font-medium uppercase tracking-[.14em] text-[var(--coral)] mb-2.5">
              Agente.RealEstate · Carmen
            </div>
            <div className="font-extrabold text-[var(--navy)] leading-[.9] mb-1" style={{ fontSize: 72, letterSpacing: "-.045em" }}>
              $400<span className="text-[.4em] text-[var(--soft)] font-bold">/mo</span>
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
          {t("Brokerage or team pricing · ", "Precio de brokerage o equipo · ")}
          <a href={demoUrl(lang)} className="text-[var(--coral)] font-semibold">
            {t("Message for a quote", "Escríbenos para una cotización")}
          </a>
        </p>
        <p className="mt-2 text-[12px]" style={{ color: "rgba(24,48,60,.45)" }}>
          {t(
            "Based in Puerto Rico? Carmen has a dedicated PR-tuned version at ",
            "¿Estás en Puerto Rico? Carmen tiene una versión específica para PR en "
          )}
          <a href="https://agentepr.com" className="text-[var(--coral)] font-semibold">agentepr.com</a>.
        </p>
      </div>
    </section>
  );
}

function FAQ() {
  const { t } = useI18n();
  const items: [string, string][] = [
    [
      t("Can Carmen really handle Spanglish?", "¿Carmen realmente maneja Spanglish?"),
      t(
        "Yes. Carmen auto-detects language on every message and matches the lead — English, Spanish, or code-switching mid-sentence. She doesn't translate; she replies natively in whichever register the buyer is using. This is the #1 reason teams with bilingual markets pick Carmen.",
        "Sí. Carmen detecta el idioma en cada mensaje y se adapta — inglés, español, o cambiando a media oración. No traduce; responde nativamente en el registro que el comprador usa. Es la razón #1 por la que equipos en mercados bilingües eligen a Carmen."
      ),
    ],
    [
      t("Which lead sources does Carmen plug into?", "¿Qué fuentes de leads conecta Carmen?"),
      t(
        "Zillow Premier Agent, Realtor.com, Facebook Lead Ads, Instagram DMs, your website forms, WhatsApp Business, and inbound SMS. Every channel lands in one inbox; Carmen replies on the same channel the lead used.",
        "Zillow Premier Agent, Realtor.com, Facebook Lead Ads, DMs de Instagram, formularios de tu web, WhatsApp Business y SMS entrantes. Todos los canales llegan a un solo inbox; Carmen responde en el mismo canal que usó el lead."
      ),
    ],
    [
      t("Will Carmen quote prices or commit to terms?", "¿Carmen da precios o compromete términos?"),
      t(
        "Never. Carmen surfaces listing facts and recent comps but never negotiates, commits to a price reduction, or discusses commission splits. All deal terms stay with you. This is a hard rule built into her SOUL.md.",
        "Nunca. Carmen comparte datos del listing y comps recientes pero nunca negocia, compromete una rebaja, ni discute splits de comisión. Todos los términos quedan contigo. Es una regla dura de su SOUL.md."
      ),
    ],
    [
      t("What about after-hours leads?", "¿Y los leads fuera de horario?"),
      t(
        "Instant. Carmen responds within a second regardless of when the lead comes in. Quiet hours (10pm–7am local) are configurable — Carmen queues messages and sends first thing in the morning rather than texting at 2am.",
        "Instantánea. Carmen responde en menos de un segundo sin importar cuándo llegue el lead. Las horas de silencio (10pm–7am locales) son configurables — Carmen encola mensajes y los envía temprano en la mañana en lugar de escribir a las 2am."
      ),
    ],
    [
      t("How long does setup take?", "¿Cuánto toma la configuración?"),
      t(
        "24 hours once we have your team info — service area, agent roster, lead-source credentials, calendar access, and your Google Review link. We configure Carmen, provision your Twilio number, and run test conversations before going live.",
        "24 horas una vez tengamos la info del equipo — área de servicio, roster de agentes, credenciales de fuentes de leads, acceso al calendario y tu link de Google Review. Configuramos a Carmen, asignamos tu número Twilio y corremos conversaciones de prueba antes de salir en vivo."
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
          <>Stop losing buyers to <em className="italic text-[var(--coral)]">faster agents.</em></>,
          <>Deja de perder compradores con <em className="italic text-[var(--coral)]">agentes más rápidos.</em></>
        )}
      </motion.h2>
      <motion.p {...fadeUp} className="mx-auto max-w-[60ch] text-[17px] leading-[1.6] mb-9" style={{ color: "rgba(244,237,227,.7)" }}>
        {t(
          "The agent who replies first wins the showing. The agent who follows up consistently wins the closing. Carmen does both, in two languages, around the clock — without you touching your phone.",
          "El agente que responde primero gana la visita. El que da seguimiento consistente gana el cierre. Carmen hace ambas cosas, en dos idiomas, las 24 horas — sin que toques el teléfono."
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