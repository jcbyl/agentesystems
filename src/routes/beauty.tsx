import { createFileRoute, Link } from "@tanstack/react-router";
import { hreflangLinks } from "@/lib/hreflang";
import { motion } from "framer-motion";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useI18n } from "@/lib/i18n";
import { demoUrl } from "@/lib/demo-link";
import ogImageUrl from "@/assets/og-beauty.jpg";

const ORIGIN = "https://agentesystems.lovable.app";
const PAGE_URL = `${ORIGIN}/beauty`;
const OG_IMAGE = `${ORIGIN}${ogImageUrl}`;
const PINK = "#EC4899";

export const Route = createFileRoute("/beauty")({
  head: () => ({
    meta: [
      { title: "Agente.Beauty — Bella · AI Booking Agent for Salons & Studios" },
      { name: "description", content: "Bella answers every Instagram DM and WhatsApp in under a second — bilingual EN/ES. Books the service, captures the deposit, and sends reminders that cut no-shows in half." },
      { property: "og:title", content: "Agente.Beauty — Bella · AI Booking for Salons" },
      { property: "og:description", content: "Bella books every DM while you work — bilingual EN/ES, deposit capture, no-show reminders, live in 24 hours." },
      { property: "og:url", content: PAGE_URL },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:secure_url", content: OG_IMAGE },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:description", content: "Bella books every DM while you work — bilingual EN/ES, deposit capture, no-show reminders, live in 24 hours." },
      { name: "twitter:title", content: "Agente.Beauty — Bella" },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }, ...hreflangLinks(PAGE_URL)],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Agente.Beauty — Bella",
          serviceType: "AI booking agent for beauty salons and wellness studios",
          provider: { "@type": "Organization", name: "Agente.Systems", url: ORIGIN },
          areaServed: "United States",
          availableLanguage: ["en", "es"],
          url: PAGE_URL,
        }),
      },
    ],
  }),
  component: BeautyPage,
});

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
};

function BeautyPage() {
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
        <motion.div {...fadeUp} className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[.1em] uppercase mb-7 px-3 py-1.5 rounded-full" style={{ background: "rgba(236,72,153,.12)", color: PINK, border: `1px solid rgba(236,72,153,.25)` }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: PINK }} />
          {t("Bella is live for Glow Studio · San Juan", "Bella está activa para Glow Studio · San Juan")}
        </motion.div>
        <motion.h1 {...fadeUp} className="font-extrabold text-[var(--cream)] mb-5" style={{ fontSize: "clamp(40px,6.5vw,82px)", lineHeight: 0.98, letterSpacing: "-.03em" }}>
          {t(
            <>You post the work. <em className="italic" style={{ color: PINK }}>Bella books the clients.</em></>,
            <>Tú publicas el trabajo. <em className="italic" style={{ color: PINK }}>Bella agenda los clientes.</em></>
          )}
        </motion.h1>
        <motion.p {...fadeUp} className="mx-auto max-w-[68ch] text-[18px] leading-[1.6] mb-9" style={{ color: "rgba(244,237,227,.72)" }}>
          {t(
            "Bella answers every Instagram DM, WhatsApp message, and missed call in under a second — bilingual EN/ES. She picks the right service and stylist, books the slot, takes the deposit, and sends reminders that cut no-shows in half. You focus on the client in front of you.",
            "Bella responde cada DM de Instagram, WhatsApp y llamada perdida en menos de un segundo — bilingüe EN/ES. Elige el servicio y estilista correctos, agenda el turno, cobra el depósito y envía recordatorios que reducen los no-shows a la mitad. Tú te concentras en la clienta que tienes enfrente."
          )}
        </motion.p>
        <motion.div {...fadeUp} className="flex flex-wrap gap-3 justify-center mb-8">
          <a href={demoUrl(lang)} className="inline-flex items-center gap-2 px-7 py-[15px] rounded-[12px] font-bold text-white text-[17px] transition-transform hover:-translate-y-px" style={{ background: PINK, boxShadow: "0 6px 24px rgba(236,72,153,.35)" }}>
            {t("Start free trial →", "Prueba gratis →")}
          </a>
          <a href="#features" className="inline-flex items-center px-6 py-[15px] rounded-[12px] font-bold text-[17px]" style={{ background: "rgba(244,237,227,.06)", color: "var(--cream)", border: "1.5px solid rgba(244,237,227,.14)" }}>
            {t("How Bella works", "Cómo funciona Bella")}
          </a>
        </motion.div>
        <motion.div {...fadeUp} className="flex flex-wrap gap-5 justify-center font-mono text-[11px] tracking-[.06em]" style={{ color: "rgba(244,237,227,.5)" }}>
          {[
            t("Instagram DM + WhatsApp", "Instagram DM + WhatsApp"),
            t("Deposits captured at booking", "Depósitos cobrados al agendar"),
            t("Live in 24 hours", "En vivo en 24 horas"),
            t("Cancel anytime", "Cancela cuando quieras"),
          ].map((s, i) => (
            <span key={i} className="inline-flex items-center gap-1.5">
              <span style={{ color: PINK }}>●</span> {s}
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
    [<>20<em className="not-italic" style={{ color: PINK }}>–30%</em></>, t("of bookings are no-shows — the industry average", "de las citas son no-shows — el promedio de la industria")],
    [<>$375</>, t("lost per day to no-shows at 10 appointments", "perdidos al día por no-shows en 10 citas")],
    [<><em className="not-italic" style={{ color: PINK }}>&lt;</em>1<span className="text-[.45em] opacity-40">s</span></>, t("Bella responds to every DM, 24/7", "Bella responde cada DM, 24/7")],
    [<>3<em className="not-italic" style={{ color: PINK }}>–5</em></>, t("messages from 'hi' to confirmed booking", "mensajes de 'hola' a cita confirmada")],
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 border-y border-[rgba(244,237,227,.08)]" style={{ background: "var(--navy)" }}>
      {stats.map(([n, l], i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }} className="text-center px-5 py-9 border-r border-[rgba(244,237,227,.06)] last:border-r-0">
          <div className="font-extrabold text-[var(--cream)] mb-2" style={{ fontSize: "clamp(34px,5vw,62px)", letterSpacing: "-.04em", lineHeight: 0.95 }}>{n}</div>
          <div className="font-mono text-[10px] uppercase tracking-[.1em] leading-[1.5]" style={{ color: "rgba(244,237,227,.45)" }}>{l}</div>
        </motion.div>
      ))}
    </div>
  );
}

type Msg = { kind: "in" | "out" | "note"; text: React.ReactNode; italic?: boolean };

function ChatCard({ messages }: { messages: Msg[] }) {
  return (
    <div className="rounded-[18px] p-5" style={{ background: "rgba(236,72,153,.06)", border: "1px solid rgba(236,72,153,.12)" }}>
      <div className="flex flex-col gap-2">
        {messages.map((m, i) => {
          if (m.kind === "note") return (
            <div key={i} className="font-mono text-[11px] text-center my-1 py-[7px] px-2 rounded-md" style={{ background: "rgba(24,48,60,.04)", color: "var(--soft)" }}>{m.text}</div>
          );
          const isIn = m.kind === "in";
          return (
            <div key={i} className="text-[14px] leading-[1.45] rounded-[14px] px-3.5 py-2.5 max-w-[80%]" style={{
              alignSelf: isIn ? "flex-start" : "flex-end",
              background: isIn ? "#FFF" : PINK,
              color: isIn ? "var(--navy)" : "#FFF",
              borderBottomLeftRadius: isIn ? 4 : 14,
              borderBottomRightRadius: isIn ? 14 : 4,
              boxShadow: isIn ? "0 1px 4px rgba(24,48,60,.08)" : "0 4px 14px rgba(236,72,153,.2)",
            }}>
              {m.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BookingCard() {
  const { t } = useI18n();
  const rows: [string, string][] = [
    [t("Service", "Servicio"), t("Gel manicure — 45 min", "Manicure de gel — 45 min")],
    [t("Stylist", "Estilista"), "Mia (requested)"],
    [t("Slot", "Turno"), "Sat Mar 22 · 11:00 AM"],
    [t("Deposit", "Depósito"), "$10 captured via link ✓"],
    [t("Reminder", "Recordatorio"), t("24h + day-of — scheduled", "24h + día de cita — programado")],
  ];
  return (
    <div className="rounded-[18px] p-6" style={{ background: "rgba(255,253,249,.9)", border: "1px solid rgba(24,48,60,.08)", boxShadow: "0 8px 30px rgba(24,48,60,.06)" }}>
      <div className="font-mono text-[10px] font-semibold uppercase tracking-[.1em] mb-2" style={{ color: PINK }}>
        {t("BOOKING CONFIRMED 💅", "CITA CONFIRMADA 💅")}
      </div>
      <div className="font-bold text-[15px] text-[var(--navy)] mb-3">Sofia R. · via Instagram DM</div>
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

function FeatureRow({ eyebrow, title, body, card, reverse }: {
  eyebrow: string; title: React.ReactNode; body: string;
  card: React.ReactNode; reverse?: boolean;
}) {
  return (
    <motion.div {...fadeUp} className={`grid md:grid-cols-2 gap-10 items-center ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}>
      <div>
        <div className="font-mono text-[11px] font-medium tracking-[.16em] uppercase mb-3.5" style={{ color: PINK }}>{eyebrow}</div>
        <h2 className="font-extrabold text-[var(--navy)] mb-4" style={{ fontSize: "clamp(26px,3.6vw,44px)", lineHeight: 1.02, letterSpacing: "-.025em" }}>{title}</h2>
        <p className="text-[var(--soft)] leading-[1.65]">{body}</p>
      </div>
      <div>{card}</div>
    </motion.div>
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
            <>The DM came in mid-set. <em className="italic" style={{ color: PINK }}>She booked somewhere else.</em></>,
            <>El DM llegó en medio del set. <em className="italic" style={{ color: PINK }}>Reservó en otro lugar.</em></>
          )}
          body={t(
            "You're 45 minutes into a full set when someone DMs asking about a Saturday appointment. By the time you're done and check your phone, they've already booked somewhere that responded faster. At 10 appointments a day and a 25% no-show rate, that's $375 in lost revenue — every day.",
            "Estás 45 minutos en un set completo cuando alguien pregunta por una cita el sábado. Para cuando terminas y revisas el teléfono, ya reservaron en otro lugar que respondió más rápido. A 10 citas por día y 25% de no-shows, son $375 en ingresos perdidos — cada día."
          )}
          card={
            <ChatCard messages={[
              { kind: "in", text: t("Hi! Do you have availability for a gel mani this Saturday morning?", "Hola! ¿Tienen disponibilidad para un gel el sábado por la mañana?") },
              { kind: "note", text: t("2h 47min — no reply (stylist in a service)", "2h 47min — sin respuesta (estilista en servicio)") },
              { kind: "in", italic: true, text: t('"Found somewhere else, thanks!"', '"Encontré otro lugar, ¡gracias!"') },
            ]} />
          }
        />
        <FeatureRow
          reverse
          eyebrow={t("The Solution", "La Solución")}
          title={t(
            <>Bella books it. <em className="italic" style={{ color: PINK }}>In 3 messages.</em></>,
            <>Bella lo agenda. <em className="italic" style={{ color: PINK }}>En 3 mensajes.</em></>
          )}
          body={t(
            "Bella responds in under a second. She asks for the service, checks stylist preference, offers two time options, gets the name, and confirms — in 3 to 5 messages. Then she collects the deposit so the slot is protected. You finish the service you're doing and look up to a full Saturday.",
            "Bella responde en menos de un segundo. Pregunta por el servicio, verifica preferencia de estilista, ofrece dos opciones de horario, obtiene el nombre y confirma — en 3 a 5 mensajes. Luego cobra el depósito para proteger el turno. Tú terminas el servicio que estás haciendo y miras una agenda del sábado llena."
          )}
          card={
            <ChatCard messages={[
              { kind: "in", text: "Hi! Do you have gel mani availability Saturday morning?" },
              { kind: "out", text: "Hi! 💅 Saturday works — any stylist preference, or whoever's available is fine?" },
              { kind: "in", text: "Whoever is available is great!" },
              { kind: "out", text: "Perfect. We have 10am or 11am — which works better?" },
              { kind: "in", text: "11am please!" },
              { kind: "out", text: "Done! I'll send a deposit link to hold the spot — just $10. Name for the booking?" },
            ]} />
          }
        />
        <FeatureRow
          eyebrow={t("Groups & Parties", "Grupos y Fiestas")}
          title={t(
            <>Bachelorette party? <em className="italic" style={{ color: PINK }}>Bella handles it.</em></>,
            <>¿Fiesta de despedida? <em className="italic" style={{ color: PINK }}>Bella lo maneja.</em></>
          )}
          body={t(
            "When a group inquiry comes in, Bella gathers the count, occasion, and service preferences — then flags you directly so you can coordinate the block booking. She keeps the conversation warm while you confirm capacity. Groups are the highest-value bookings; Bella makes sure none slip through.",
            "Cuando llega una consulta de grupo, Bella recopila el número, la ocasión y preferencias de servicio — luego te alerta directamente para que coordines la reserva en bloque. Mantiene la conversación activa mientras confirmas capacidad. Los grupos son las reservas de mayor valor; Bella se asegura de que ninguna se escape."
          )}
          card={
            <ChatCard messages={[
              { kind: "in", text: t("Hi! We want to book a bachelorette party — 6 people, gel manis and pedicures. Do you do groups?", "Hola! Queremos reservar para una despedida de soltera — 6 personas, gel y pedicure. ¿Hacen grupos?") },
              { kind: "out", text: t("That sounds so fun! 🎉 Absolutely — let me get the details and flag this for our owner to confirm the block. What date are you thinking?", "¡Qué divertido! 🎉 Por supuesto — déjame tomar los detalles y alertar a nuestra dueña para confirmar el bloque. ¿Qué fecha tienen en mente?") },
            ]} />
          }
        />
      </div>
    </section>
  );
}

function Lifecycle() {
  const { t } = useI18n();
  const steps: [string, string, string][] = [
    [t("INBOUND", "ENTRADA"), t("Book in 3–5 messages", "Agenda en 3–5 mensajes"), t("Service → stylist → time (2 options) → name → deposit link. Done.", "Servicio → estilista → horario (2 opciones) → nombre → link de depósito. Listo.")],
    [t("DEPOSIT", "DEPÓSITO"), t("Slot protected", "Turno protegido"), t("$10 or custom amount collected at booking via payment link. No deposit = no confirmed slot.", "$10 o monto personalizado cobrado al reservar. Sin depósito = sin turno confirmado.")],
    [t("REMINDERS", "RECORDATORIOS"), t("24h + day-of", "24h + día de la cita"), t("Two messages that cut no-shows in half. Rescheduling handled by Bella if the client needs to move.", "Dos mensajes que reducen los no-shows a la mitad. Bella maneja el reagendamiento si el cliente necesita mover.")],
    [t("UPSELL", "UPSELL"), t("Once — naturally", "Una vez — naturalmente"), t("'Want to add a pedicure while you're in?' One offer, never repeated if declined.", "'¿Quieres agregar un pedicure mientras estás aquí?' Una oferta, nunca repetida si rechaza.")],
    [t("POST-VISIT", "POST-VISITA"), t("Review ask", "Solicitud de reseña"), t("24h after the appointment: 'Hope you're loving your [service]! A Google review means the world 💅'", "24h después: '¡Esperamos que estés amando tu [servicio]! Una reseña de Google significa todo 💅'")],
    [t("REACTIVATION", "REACTIVACIÓN"), t("4-week + 8-week", "4 semanas + 8 semanas"), t("Clients who go quiet get a gentle check-in at 4 weeks. Another at 8. Passive revenue, automatic.", "Los clientes en silencio reciben un mensaje amable a las 4 semanas. Otro a las 8. Ingresos pasivos, automático.")],
  ];
  return (
    <section id="lifecycle" className="py-20" style={{ background: "#EDE5D6" }}>
      <div className="max-w-[1080px] mx-auto px-7">
        <motion.div {...fadeUp} className="font-mono text-[11px] font-medium tracking-[.16em] uppercase mb-3.5" style={{ color: PINK }}>
          {t("Beyond the booking", "Más allá de la cita")}
        </motion.div>
        <motion.h2 {...fadeUp} className="font-extrabold text-[var(--navy)] mb-4" style={{ fontSize: "clamp(28px,4vw,50px)", lineHeight: 1.02, letterSpacing: "-.025em" }}>
          {t(<>Bella owns the full <em className="italic" style={{ color: PINK }}>client relationship.</em></>, <>Bella maneja toda la <em className="italic" style={{ color: PINK }}>relación con la clienta.</em></>)}
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {steps.map(([n, h, p], i) => (
            <motion.div key={n} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }} className="rounded-[14px] p-5" style={{ background: "var(--cream)", border: "1px solid rgba(24,48,60,.08)" }}>
              <div className="font-mono text-[10px] font-semibold tracking-[.1em] mb-2" style={{ color: PINK }}>{n}</div>
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
    t("Instagram DM + WhatsApp + SMS — all channels, one Bella", "Instagram DM + WhatsApp + SMS — todos los canales, una Bella"),
    t("Book any service in 3–5 messages — service, stylist, time, confirm", "Agenda cualquier servicio en 3–5 mensajes"),
    t("Deposit collection at booking via payment link", "Cobro de depósito al reservar vía link de pago"),
    t("24h + day-of appointment reminders — cuts no-shows in half", "Recordatorios 24h + día de cita — reduce no-shows a la mitad"),
    t("Group and party inquiry triage — flags to owner", "Manejo de consultas de grupo — alerta al dueño"),
    t("Natural upsell — once per booking, never repeated", "Upsell natural — una vez por reserva, nunca repetido"),
    t("Google review ask 24h post-appointment", "Solicitud de reseña de Google 24h después"),
    t("4-week and 8-week client reactivation", "Reactivación a las 4 y 8 semanas"),
    t("Bilingual EN/ES — auto-detect, never mixes mid-conversation", "Bilingüe EN/ES — detección automática, nunca mezcla a mitad"),
    t("Live in 24 hours · Cancel anytime", "En vivo en 24 horas · Cancela cuando quieras"),
  ];
  return (
    <section id="pricing" className="py-20" style={{ background: "var(--cream)" }}>
      <div className="max-w-[1080px] mx-auto px-7 text-center">
        <motion.div {...fadeUp} className="font-mono text-[11px] font-medium tracking-[.16em] uppercase mb-3.5" style={{ color: PINK }}>
          {t("Pricing", "Precios")}
        </motion.div>
        <motion.h2 {...fadeUp} className="font-extrabold text-[var(--navy)] mb-4" style={{ fontSize: "clamp(28px,4vw,50px)", lineHeight: 1.02, letterSpacing: "-.025em" }}>
          {t(<>One plan. <em className="italic" style={{ color: PINK }}>Full schedule.</em></>, <>Un plan. <em className="italic" style={{ color: PINK }}>Agenda llena.</em></>)}
        </motion.h2>
        <motion.div {...fadeUp} className="max-w-[520px] mx-auto rounded-[20px] overflow-hidden text-left mt-10" style={{ background: "#FFFDF9", border: "1px solid rgba(24,48,60,.08)", boxShadow: "0 20px 60px rgba(24,48,60,.08)" }}>
          <div className="px-8 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[.12em] text-white" style={{ background: PINK }}>
            {t("PILOT PRICING · SALONS & STUDIOS", "PRECIO PILOTO · SALONES Y ESTUDIOS")}
          </div>
          <div className="p-8">
            <div className="font-mono text-[12px] font-medium uppercase tracking-[.14em] mb-2.5" style={{ color: PINK }}>Agente.Beauty · Bella</div>
            <div className="font-extrabold text-[var(--navy)] leading-[.9] mb-1" style={{ fontSize: 72, letterSpacing: "-.045em" }}>
              $197<span className="text-[.4em] text-[var(--soft)] font-bold">/mo</span>
            </div>
            <div className="text-[13px] text-[var(--soft)] mb-6">
              $297 setup — <span className="font-semibold" style={{ color: PINK }}>{t("waived for first 5 salons", "exonerado para los primeros 5 salones")}</span>
            </div>
            <ul className="space-y-2.5 mb-7">
              {items.map((it) => (
                <li key={String(it)} className="flex gap-2.5 text-[14px] text-[var(--navy)] leading-[1.5]">
                  <span className="font-bold mt-px" style={{ color: PINK }}>✓</span><span>{it}</span>
                </li>
              ))}
            </ul>
            <a href={demoUrl(lang)} className="block w-full text-center px-6 py-3.5 rounded-[12px] font-bold text-white text-[16px] transition-transform hover:-translate-y-px" style={{ background: PINK, boxShadow: "0 6px 24px rgba(236,72,153,.3)" }}>
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
    [t("Does Bella actually work on Instagram DMs?", "¿Bella realmente funciona en Instagram DMs?"), t("Yes — Instagram DM is the primary channel for salon inquiries. Bella connects to your Instagram Business account and replies to every DM automatically. Clients get a response in under a second without leaving Instagram.", "Sí — el DM de Instagram es el canal principal para consultas de salón. Bella se conecta a tu cuenta de Instagram Business y responde cada DM automáticamente. Los clientes reciben respuesta en menos de un segundo sin salir de Instagram.")],
    [t("How does the deposit work?", "¿Cómo funciona el depósito?"), t("Bella sends a payment link (Venmo, Zelle, Square, or a custom link you provide) after confirming the booking details. The slot isn't considered confirmed until the deposit is received. This alone cuts no-shows significantly.", "Bella envía un link de pago (Venmo, Zelle, Square o un link personalizado que proporciones) después de confirmar los detalles de la reserva. El turno no se considera confirmado hasta que se recibe el depósito. Esto solo reduce significativamente los no-shows.")],
    [t("What if a client asks for a specific stylist who's not available?", "¿Qué pasa si un cliente pide una estilista que no está disponible?"), t("Bella checks your availability and offers alternative times for the requested stylist, or offers another available stylist for the preferred time. She never double-books and never promises a slot she can't deliver.", "Bella revisa tu disponibilidad y ofrece horarios alternativos para la estilista solicitada, u ofrece otra estilista disponible para el horario preferido. Nunca hace doble reserva y nunca promete un turno que no puede cumplir.")],
    [t("Can Bella handle group bookings?", "¿Puede Bella manejar reservas de grupo?"), t("Bella gathers all the details — headcount, occasion, service mix, preferred date — and immediately flags you directly so you can confirm capacity and coordinate the block. She keeps the conversation warm while you confirm. Groups are never auto-booked without your approval.", "Bella recopila todos los detalles — número de personas, ocasión, mix de servicios, fecha preferida — y te alerta de inmediato para que confirmes capacidad y coordines el bloque. Mantiene la conversación activa mientras confirmas. Los grupos nunca se auto-reservan sin tu aprobación.")],
    [t("How long does setup take?", "¿Cuánto toma la configuración?"), t("24 hours once we have your service menu, stylist roster with specialties, deposit policy, payment link, and availability. Bella goes live on Instagram DM and WhatsApp simultaneously.", "24 horas una vez tengamos tu menú de servicios, lista de estilistas con especialidades, política de depósito, link de pago y disponibilidad. Bella sale en vivo en Instagram DM y WhatsApp simultáneamente.")],
  ];
  return (
    <section className="py-20" style={{ background: "var(--cream)" }}>
      <div className="max-w-[1080px] mx-auto px-7">
        <motion.div {...fadeUp} className="rounded-[24px] p-10" style={{ background: "#FFFDF9", border: "1px solid rgba(24,48,60,.08)" }}>
          <div className="font-mono text-[11px] font-medium tracking-[.16em] uppercase mb-3.5" style={{ color: PINK }}>FAQ</div>
          <h2 className="font-extrabold text-[var(--navy)] mb-6" style={{ fontSize: "clamp(28px,4vw,50px)", lineHeight: 1.02, letterSpacing: "-.025em" }}>
            {t(<>Questions <em className="italic" style={{ color: PINK }}>answered.</em></>, <>Preguntas <em className="italic" style={{ color: PINK }}>resueltas.</em></>)}
          </h2>
          <div className="mt-8 divide-y divide-[rgba(24,48,60,.08)]">
            {items.map(([q, a]) => (
              <details key={q} className="group py-4">
                <summary className="cursor-pointer list-none flex justify-between items-center font-bold text-[17px] tracking-[-.01em] text-[var(--navy)]">
                  {q}<span className="text-[22px] leading-none transition-transform group-open:rotate-45" style={{ color: PINK }}>+</span>
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
      <motion.h2 {...fadeUp} className="font-extrabold text-[var(--cream)] mb-5 mx-auto max-w-[18ch]" style={{ fontSize: "clamp(32px,5vw,60px)", lineHeight: 1, letterSpacing: "-.028em" }}>
        {t(<>Stop losing bookings to <em className="italic" style={{ color: PINK }}>slow replies.</em></>, <>Deja de perder citas por <em className="italic" style={{ color: PINK }}>respuestas lentas.</em></>)}
      </motion.h2>
      <motion.p {...fadeUp} className="mx-auto max-w-[60ch] text-[17px] leading-[1.6] mb-9" style={{ color: "rgba(244,237,227,.7)" }}>
        {t("Every unanswered DM is a booking you didn't get. Bella makes sure you never leave money on the table while you're doing what you're actually good at.", "Cada DM sin respuesta es una cita que no conseguiste. Bella se asegura de que nunca dejes dinero sobre la mesa mientras haces lo que realmente sabes hacer.")}
      </motion.p>
      <motion.div {...fadeUp} className="flex flex-wrap gap-3 justify-center">
        <a href={demoUrl(lang)} className="inline-flex items-center px-7 py-[15px] rounded-[12px] font-bold text-white text-[16px] transition-transform hover:-translate-y-px" style={{ background: PINK, boxShadow: "0 6px 24px rgba(236,72,153,.35)" }}>
          {t("Start free trial →", "Prueba gratis →")}
        </a>
        <Link to="/" className="inline-flex items-center px-6 py-[15px] rounded-[12px] font-bold text-[16px] transition-colors" style={{ color: "var(--cream)", border: "1.5px solid rgba(244,237,227,.18)" }}>
          {t("← All Agente verticals", "← Todas las industrias")}
        </Link>
      </motion.div>
    </section>
  );
}
