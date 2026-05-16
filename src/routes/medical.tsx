import { createFileRoute, Link } from "@tanstack/react-router";
import { hreflangLinks } from "@/lib/hreflang";
import { motion } from "framer-motion";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useI18n } from "@/lib/i18n";
import { demoUrl } from "@/lib/demo-link";
import ogImageUrl from "@/assets/og-medical.jpg";

const ORIGIN = "https://agentesystems.lovable.app";
const PAGE_URL = `${ORIGIN}/medical`;
const OG_IMAGE = `${ORIGIN}${ogImageUrl}`;

export const Route = createFileRoute("/medical")({
  head: () => ({
    meta: [
      { title: "Agente.Medical — Grace · HIPAA-Ready AI Agent for Medical Practices" },
      { name: "description", content: "Grace books appointments, sends reminders, and routes clinical questions to the patient portal. HIPAA-aware on the base plan. Bilingual EN/ES for US medical practices." },
      { property: "og:title", content: "Agente.Medical — Grace · AI Scheduling for Medical Practices" },
      { property: "og:description", content: "Grace books, reminds, and routes — bilingual EN/ES, HIPAA-aware, live in 48 hours." },
      { property: "og:url", content: PAGE_URL },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:secure_url", content: OG_IMAGE },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" }
      { name: "twitter:description", content: "Grace books, reminds, and routes — bilingual EN/ES, HIPAA-aware, live in 48 hours." },
      { name: "twitter:title", content: "Agente.Medical — Grace" },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }, ...hreflangLinks(PAGE_URL)],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Agente.Medical — Grace",
          serviceType: "HIPAA-aware AI scheduling agent for medical practices",
          provider: { "@type": "Organization", name: "Agente.Systems", url: ORIGIN },
          areaServed: "United States",
          availableLanguage: ["en", "es"],
          url: PAGE_URL,
        }),
      },
    ],
  }),
  component: MedicalPage,
});

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
};

const BLUE = "#3B82F6";

function MedicalPage() {
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
          style={{ background: "rgba(59,130,246,.12)", color: BLUE, border: `1px solid rgba(59,130,246,.25)` }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: BLUE }} />
          {t("Grace is live for Heritage Family Practice", "Grace está activa para Heritage Family Practice")}
        </motion.div>
        <motion.h1
          {...fadeUp}
          className="font-extrabold text-[var(--cream)] mb-5"
          style={{ fontSize: "clamp(40px,6.5vw,82px)", lineHeight: 0.98, letterSpacing: "-.03em" }}
        >
          {t(
            <><em className="italic" style={{ color: BLUE }}>Your front desk</em> is one person. Grace never sleeps.</>,
            <><em className="italic" style={{ color: BLUE }}>Tu recepción</em> es una persona. Grace nunca duerme.</>
          )}
        </motion.h1>
        <motion.p {...fadeUp} className="mx-auto max-w-[68ch] text-[18px] leading-[1.6] mb-9" style={{ color: "rgba(244,237,227,.72)" }}>
          {t(
            "Grace books appointments, verifies insurance, sends 48h and day-of reminders, and routes every clinical question to the patient portal. HIPAA-aware on the base plan. Bilingual EN/ES. Your practice never misses a new patient again.",
            "Grace agenda citas, verifica seguro, envía recordatorios 48h y el día de la cita, y redirige cada pregunta clínica al portal del paciente. Lista para HIPAA en el plan base. Bilingüe EN/ES. Tu consultorio nunca vuelve a perder un paciente nuevo."
          )}
        </motion.p>
        <motion.div {...fadeUp} className="flex flex-wrap gap-3 justify-center mb-8">
          <a
            href={demoUrl(lang)}
            className="inline-flex items-center gap-2 px-7 py-[15px] rounded-[12px] font-bold text-white text-[17px] transition-transform hover:-translate-y-px"
            style={{ background: BLUE, boxShadow: "0 6px 24px rgba(59,130,246,.35)" }}
          >
            {t("Start free trial →", "Prueba gratis →")}
          </a>
          <a
            href="#features"
            className="inline-flex items-center px-6 py-[15px] rounded-[12px] font-bold text-[17px]"
            style={{ background: "rgba(244,237,227,.06)", color: "var(--cream)", border: "1.5px solid rgba(244,237,227,.14)" }}
          >
            {t("How Grace works", "Cómo funciona Grace")}
          </a>
        </motion.div>
        <motion.div {...fadeUp} className="flex flex-wrap gap-5 justify-center font-mono text-[11px] tracking-[.06em]" style={{ color: "rgba(244,237,227,.5)" }}>
          {[
            t("HIPAA-aware on base plan", "Lista para HIPAA en plan base"),
            t("No PHI over SMS — ever", "Sin PHI por SMS — nunca"),
            t("Live in 48 hours", "En vivo en 48 horas"),
            t("Cancel anytime", "Cancela cuando quieras"),
          ].map((s, i) => (
            <span key={i} className="inline-flex items-center gap-1.5">
              <span style={{ color: BLUE }}>●</span> {s}
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
    [<>20<em className="not-italic" style={{ color: BLUE }}>%</em></>, t("average no-show rate at US medical practices", "tasa promedio de no-shows en consultorios médicos")],
    [<>$800</>, t("in daily revenue lost to no-shows at 20 appts/day", "perdidos diariamente por no-shows a 20 citas/día")],
    [<><em className="not-italic" style={{ color: BLUE }}>&lt;</em>1<span className="text-[.45em] opacity-40">s</span></>, t("Grace responds to every inquiry, every hour", "Grace responde cada consulta, a toda hora")],
    [<><em className="not-italic" style={{ color: BLUE }}>0</em></>, t("PHI transmitted over SMS or WhatsApp — ever", "PHI transmitida por SMS o WhatsApp — nunca")],
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
    <div className="rounded-[18px] p-5" style={{ background: "rgba(59,130,246,.06)", border: "1px solid rgba(59,130,246,.12)" }}>
      <div className="flex flex-col gap-2">
        {messages.map((m, i) => {
          if (m.kind === "note") return (
            <div key={i} className="font-mono text-[11px] text-center my-1 py-[7px] px-2 rounded-md" style={{ background: "rgba(24,48,60,.04)", color: "var(--soft)" }}>{m.text}</div>
          );
          const isIn = m.kind === "in";
          return (
            <div
              key={i}
              className="text-[14px] leading-[1.45] rounded-[14px] px-3.5 py-2.5 max-w-[80%]"
              style={{
                alignSelf: isIn ? "flex-start" : "flex-end",
                background: isIn ? "#FFF" : BLUE,
                color: isIn ? "var(--navy)" : "#FFF",
                borderBottomLeftRadius: isIn ? 4 : 14,
                borderBottomRightRadius: isIn ? 14 : 4,
                boxShadow: isIn ? "0 1px 4px rgba(24,48,60,.08)" : "0 4px 14px rgba(59,130,246,.2)",
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

function ApptCard() {
  const { t } = useI18n();
  const rows: [string, string][] = [
    [t("Patient", "Paciente"), "Maria G. — New patient"],
    [t("Insurance", "Seguro"), "Cigna PPO — verified ✓"],
    [t("Appt type", "Tipo de cita"), t("New patient — 45 min", "Paciente nuevo — 45 min")],
    [t("Slot", "Turno"), "Tue Mar 18 · 10:15 AM"],
    [t("Reminder sent", "Recordatorio"), t("48h + day-of — done", "48h + día de cita — enviado")],
  ];
  return (
    <div className="rounded-[18px] p-6" style={{ background: "rgba(255,253,249,.9)", border: "1px solid rgba(24,48,60,.08)", boxShadow: "0 8px 30px rgba(24,48,60,.06)" }}>
      <div className="font-mono text-[10px] font-semibold uppercase tracking-[.1em] mb-2" style={{ color: BLUE }}>
        {t("APPOINTMENT CONFIRMED", "CITA CONFIRMADA")}
      </div>
      <div className="font-bold text-[15px] text-[var(--navy)] mb-3">Heritage Family Practice · Dr. Overton</div>
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
        <div className="font-mono text-[11px] font-medium tracking-[.16em] uppercase mb-3.5" style={{ color: BLUE }}>{eyebrow}</div>
        <h2 className="font-extrabold text-[var(--navy)] mb-4" style={{ fontSize: "clamp(26px,3.6vw,44px)", lineHeight: 1.02, letterSpacing: "-.025em" }}>{title}</h2>
        <p className="text-[var(--soft)] leading-[1.65]">{body}</p>
      </div>
      <div>{card}</div>
    </motion.div>
  );
}

function HardStopCard() {
  const { t } = useI18n();
  const can = [
    t("Book, reschedule, cancel appointments", "Agendar, reagendar, cancelar citas"),
    t("Verify insurance (Cigna, Aetna, Blue Cross, United, Medicare, Medicaid)", "Verificar seguro (Cigna, Aetna, Blue Cross, United, Medicare, Medicaid)"),
    t("Answer FAQs — hours, location, parking, insurances", "Responder FAQs — horarios, ubicación, estacionamiento, seguros"),
    t("Send 48h and day-of appointment reminders", "Enviar recordatorios 48h y el día de la cita"),
  ];
  const cannot = [
    t("Discuss symptoms, diagnoses, or test results", "Hablar de síntomas, diagnósticos o resultados de pruebas"),
    t("Provide medication information or advice", "Dar información o consejos sobre medicamentos"),
    t("Transmit any PHI over SMS or WhatsApp", "Transmitir PHI por SMS o WhatsApp"),
    t("Give clinical opinions of any kind", "Dar opiniones clínicas de ningún tipo"),
  ];
  return (
    <div className="rounded-[18px] overflow-hidden" style={{ border: "1px solid rgba(24,48,60,.08)" }}>
      <div className="px-5 py-3 font-mono text-[10px] font-bold uppercase tracking-[.12em]" style={{ background: BLUE, color: "#FFF" }}>
        {t("Grace's hard rules", "Las reglas duras de Grace")}
      </div>
      <div className="p-5" style={{ background: "#FFFDF9" }}>
        <div className="mb-3">
          <div className="font-mono text-[10px] font-semibold uppercase tracking-[.08em] mb-2" style={{ color: "rgba(24,48,60,.4)" }}>{t("Grace CAN", "Grace PUEDE")}</div>
          {can.map((c, i) => <div key={i} className="flex gap-2 text-[13px] text-[var(--navy)] mb-1"><span style={{ color: BLUE }}>✓</span>{c}</div>)}
        </div>
        <div className="mt-4 pt-4 border-t border-[rgba(24,48,60,.08)]">
          <div className="font-mono text-[10px] font-semibold uppercase tracking-[.08em] mb-2" style={{ color: "rgba(24,48,60,.4)" }}>{t("Grace CANNOT", "Grace NO PUEDE")}</div>
          {cannot.map((c, i) => <div key={i} className="flex gap-2 text-[13px] text-[var(--soft)] mb-1"><span style={{ color: "rgba(232,65,24,.6)" }}>✗</span>{c}</div>)}
        </div>
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
            <>The patient called at 5:30pm. <em className="italic" style={{ color: BLUE }}>No one answered.</em></>,
            <>El paciente llamó a las 5:30pm. <em className="italic" style={{ color: BLUE }}>Nadie contestó.</em></>
          )}
          body={t(
            "New patients don't leave voicemails. They call the next practice on the list. Your front desk is one person who goes home at 5pm. Grace covers the remaining 19 hours — and does it in English, Spanish, or Spanglish, whichever the patient uses first.",
            "Los pacientes nuevos no dejan mensajes de voz. Llaman al siguiente consultorio de la lista. Tu recepción es una persona que se va a casa a las 5pm. Grace cubre las 19 horas restantes — y lo hace en inglés, español o Spanglish, el que el paciente use primero."
          )}
          card={
            <ChatCard messages={[
              { kind: "in", text: t("Hi, I'm looking for a new primary care doctor. Do you take Cigna?", "Hola, estoy buscando un médico de cabecera. ¿Aceptan Cigna?") },
              { kind: "note", text: t("5:47pm — after hours. No one available.", "5:47pm — fuera de horario. Nadie disponible.") },
              { kind: "in", italic: true, text: t('"Called three other offices, found one that answered."', '"Llamé a tres consultorios más, encontré uno que contestó."') },
            ]} />
          }
        />
        <FeatureRow
          reverse
          eyebrow={t("The Solution", "La Solución")}
          title={t(
            <>Grace books it. <em className="italic" style={{ color: BLUE }}>You see it in the morning.</em></>,
            <>Grace lo agenda. <em className="italic" style={{ color: BLUE }}>Tú lo ves en la mañana.</em></>
          )}
          body={t(
            "Grace responds in under a second, verifies insurance eligibility, books the correct appointment type (45 minutes for new patients, 20–30 for follow-ups), and sends a reminder. When the patient asks about symptoms or medications, Grace routes them to the patient portal — no PHI ever transmitted over SMS.",
            "Grace responde en menos de un segundo, verifica la elegibilidad del seguro, agenda el tipo de cita correcto (45 minutos para pacientes nuevos, 20–30 para seguimientos) y envía un recordatorio. Cuando el paciente pregunta sobre síntomas o medicamentos, Grace los dirige al portal del paciente — no se transmite PHI por SMS."
          )}
          card={<ApptCard />}
        />
        <FeatureRow
          eyebrow={t("The Guardrails", "Las Protecciones")}
          title={t(
            <>HIPAA isn't a feature. <em className="italic" style={{ color: BLUE }}>It's the foundation.</em></>,
            <>HIPAA no es una función. <em className="italic" style={{ color: BLUE }}>Es la base.</em></>
          )}
          body={t(
            "Grace's hard stops are permanent and non-negotiable. She handles scheduling and administrative communication only. Clinical questions go to the patient portal with a direct link. Zero PHI is transmitted over any messaging channel. These are built into Grace's core, not a setting that can be changed.",
            "Las paradas duras de Grace son permanentes y no negociables. Maneja solo programación y comunicación administrativa. Las preguntas clínicas van al portal del paciente con un link directo. Cero PHI se transmite por ningún canal de mensajería. Esto está integrado en el núcleo de Grace, no es una configuración que se pueda cambiar."
          )}
          card={<HardStopCard />}
        />
      </div>
    </section>
  );
}

function Lifecycle() {
  const { t } = useI18n();
  const steps: [string, string, string][] = [
    [t("INQUIRY", "CONSULTA"), t("Respond + route", "Responde + dirige"), t("Answers in <1s. Scheduling → Grace books. Clinical → patient portal. Every time.", "Responde en <1s. Agenda → Grace programa. Clínico → portal del paciente. Siempre.")],
    [t("INSURANCE", "SEGURO"), t("Eligibility check", "Verificación de elegibilidad"), t("Verifies insurance before booking. Catches coverage gaps before the appointment — not after.", "Verifica el seguro antes de agendar. Detecta problemas de cobertura antes de la cita — no después.")],
    [t("BOOKING", "AGENDA"), t("Right type, right length", "Tipo correcto, duración correcta"), t("New patient = 45 min. Follow-up = 20–30 min. Grace books the correct slot and confirms it.", "Paciente nuevo = 45 min. Seguimiento = 20–30 min. Grace agenda el turno correcto y lo confirma.")],
    [t("REMINDERS", "RECORDATORIOS"), t("48h + day-of", "48h + día de la cita"), t("Two-touch reminder sequence cuts no-shows 40–60%. Rescheduling handled by Grace if needed.", "La secuencia de dos recordatorios reduce no-shows 40–60%. Grace maneja el reagendamiento si es necesario.")],
    [t("POST-VISIT", "POST-VISITA"), t("Satisfaction check-in", "Verificación de satisfacción"), t("24h after the visit, Grace sends a brief check-in. Flags dissatisfied patients to the practice manager.", "24h después de la visita, Grace envía un breve chequeo. Alerta al gerente sobre pacientes insatisfechos.")],
    [t("LONG-TERM", "LARGO PLAZO"), t("Reactivation", "Reactivación"), t("Patients who haven't booked in 6+ months get a gentle outreach. Passive revenue recovery.", "Pacientes sin cita en 6+ meses reciben un contacto amable. Recuperación pasiva de ingresos.")],
  ];
  return (
    <section id="lifecycle" className="py-20" style={{ background: "#EDE5D6" }}>
      <div className="max-w-[1080px] mx-auto px-7">
        <motion.div {...fadeUp} className="font-mono text-[11px] font-medium tracking-[.16em] uppercase mb-3.5" style={{ color: BLUE }}>
          {t("Beyond the booking", "Más allá de la cita")}
        </motion.div>
        <motion.h2 {...fadeUp} className="font-extrabold text-[var(--navy)] mb-4" style={{ fontSize: "clamp(28px,4vw,50px)", lineHeight: 1.02, letterSpacing: "-.025em" }}>
          {t(<>Grace owns the full <em className="italic" style={{ color: BLUE }}>patient lifecycle.</em></>, <>Grace maneja todo el <em className="italic" style={{ color: BLUE }}>ciclo del paciente.</em></>)}
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {steps.map(([n, h, p], i) => (
            <motion.div key={n} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }} className="rounded-[14px] p-5" style={{ background: "var(--cream)", border: "1px solid rgba(24,48,60,.08)" }}>
              <div className="font-mono text-[10px] font-semibold tracking-[.1em] mb-2" style={{ color: BLUE }}>{n}</div>
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
    t("24/7 response to every patient inquiry — SMS, WhatsApp, website", "Respuesta 24/7 a cada consulta — SMS, WhatsApp, sitio web"),
    t("Insurance eligibility verification before booking", "Verificación de elegibilidad de seguro antes de agendar"),
    t("Correct appointment type and length — new patient vs follow-up", "Tipo y duración correcta — paciente nuevo vs seguimiento"),
    t("48h + day-of appointment reminders — reduces no-shows 40–60%", "Recordatorios 48h + día de cita — reduce no-shows 40–60%"),
    t("Clinical question routing to patient portal — hard stop, non-negotiable", "Redirección de preguntas clínicas al portal — parada dura, no negociable"),
    t("Zero PHI transmitted over any messaging channel", "Cero PHI transmitida por ningún canal de mensajería"),
    t("HIPAA-aware configuration + BAA with Twilio available", "Configuración lista para HIPAA + BAA con Twilio disponible"),
    t("Post-visit satisfaction check-in", "Verificación de satisfacción post-visita"),
    t("6-month patient reactivation outreach", "Contacto de reactivación a los 6 meses"),
    t("Bilingual EN/ES/Spanglish — auto-detect", "Bilingüe EN/ES/Spanglish — detección automática"),
    t("Live in 48 hours · Cancel anytime", "En vivo en 48 horas · Cancela cuando quieras"),
  ];
  return (
    <section id="pricing" className="py-20" style={{ background: "var(--cream)" }}>
      <div className="max-w-[1080px] mx-auto px-7 text-center">
        <motion.div {...fadeUp} className="font-mono text-[11px] font-medium tracking-[.16em] uppercase mb-3.5" style={{ color: BLUE }}>
          {t("Pricing", "Precios")}
        </motion.div>
        <motion.h2 {...fadeUp} className="font-extrabold text-[var(--navy)] mb-4" style={{ fontSize: "clamp(28px,4vw,50px)", lineHeight: 1.02, letterSpacing: "-.025em" }}>
          {t(<>One plan. <em className="italic" style={{ color: BLUE }}>HIPAA handled.</em></>, <>Un plan. <em className="italic" style={{ color: BLUE }}>HIPAA incluido.</em></>)}
        </motion.h2>
        <motion.div {...fadeUp} className="max-w-[520px] mx-auto rounded-[20px] overflow-hidden text-left mt-10" style={{ background: "#FFFDF9", border: "1px solid rgba(24,48,60,.08)", boxShadow: "0 20px 60px rgba(24,48,60,.08)" }}>
          <div className="px-8 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[.12em] text-white" style={{ background: BLUE }}>
            {t("PILOT PRICING · US MEDICAL PRACTICES", "PRECIO PILOTO · CONSULTORIOS MÉDICOS")}
          </div>
          <div className="p-8">
            <div className="font-mono text-[12px] font-medium uppercase tracking-[.14em] mb-2.5" style={{ color: BLUE }}>Agente.Medical · Grace</div>
            <div className="font-extrabold text-[var(--navy)] leading-[.9] mb-1" style={{ fontSize: 72, letterSpacing: "-.045em" }}>
              $597<span className="text-[.4em] text-[var(--soft)] font-bold">/mo</span>
            </div>
            <div className="text-[13px] text-[var(--soft)] mb-6">
              $797 setup — <span className="font-semibold" style={{ color: BLUE }}>{t("waived for founding pilot practices", "exonerado para consultorios piloto fundadores")}</span>
            </div>
            <ul className="space-y-2.5 mb-7">
              {items.map((it) => (
                <li key={String(it)} className="flex gap-2.5 text-[14px] text-[var(--navy)] leading-[1.5]">
                  <span className="font-bold mt-px" style={{ color: BLUE }}>✓</span><span>{it}</span>
                </li>
              ))}
            </ul>
            <a href={demoUrl(lang)} className="block w-full text-center px-6 py-3.5 rounded-[12px] font-bold text-white text-[16px] transition-transform hover:-translate-y-px" style={{ background: BLUE, boxShadow: "0 6px 24px rgba(59,130,246,.3)" }}>
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
    [t("Is Grace actually HIPAA compliant?", "¿Grace realmente cumple con HIPAA?"), t("Grace is HIPAA-aware by design — she never transmits protected health information over SMS or WhatsApp. We operate under a Business Associate Agreement (BAA) with Twilio, and Grace's hard stops (no symptoms, diagnoses, medications, or clinical opinions) are built into her core and cannot be changed. For practices requiring full HIPAA documentation, we provide the BAA and can walk through our technical controls.", "Grace está diseñada con conciencia HIPAA — nunca transmite información de salud protegida por SMS o WhatsApp. Operamos bajo un Acuerdo de Asociado Comercial (BAA) con Twilio, y las paradas duras de Grace (sin síntomas, diagnósticos, medicamentos ni opiniones clínicas) están integradas en su núcleo y no se pueden cambiar.")],
    [t("What happens when a patient asks about symptoms?", "¿Qué pasa cuando un paciente pregunta sobre síntomas?"), t("Grace routes them immediately: 'For questions about symptoms or medical concerns, your patient portal at [link] has everything — or call our office directly and a care coordinator can help.' She never attempts to answer clinical questions, even simple ones. This is a hard stop.", "Grace los redirige de inmediato: 'Para preguntas sobre síntomas o preocupaciones médicas, tu portal del paciente en [link] tiene todo — o llama a la oficina directamente.' Nunca intenta responder preguntas clínicas, ni las simples. Es una parada dura.")],
    [t("Which insurances does Grace know?", "¿Qué seguros conoce Grace?"), t("Grace is configured with your practice's specific accepted insurances. By default she covers the most common US plans — Cigna, Aetna, Blue Cross Blue Shield, United Healthcare, Medicare, and Medicaid — plus self-pay. Any additional plans you accept are added during onboarding.", "Grace se configura con los seguros específicos que acepta tu consultorio. Por defecto cubre los planes más comunes — Cigna, Aetna, Blue Cross Blue Shield, United Healthcare, Medicare y Medicaid — más pago privado.")],
    [t("What channels does Grace work on?", "¿En qué canales trabaja Grace?"), t("SMS, WhatsApp, and website forms. Patients interact with Grace through the same channels they already use — no new app, no new portal to log into. Grace works on their phone, in their preferred language, at any hour.", "SMS, WhatsApp y formularios web. Los pacientes interactúan con Grace a través de los canales que ya usan — sin nueva app, sin nuevo portal. Grace funciona en su teléfono, en su idioma preferido, a cualquier hora.")],
    [t("How long does setup take?", "¿Cuánto toma la configuración?"), t("48 hours once we have your practice information — accepted insurances, physician names and specialties, appointment types and lengths, hours, patient portal URL, and phone number. We run test conversations across all scenarios before going live.", "48 horas una vez tengamos la información de tu consultorio — seguros aceptados, nombres y especialidades de los médicos, tipos y duraciones de citas, horarios, URL del portal y número de teléfono. Corremos conversaciones de prueba antes de salir en vivo.")],
  ];
  return (
    <section className="py-20" style={{ background: "var(--cream)" }}>
      <div className="max-w-[1080px] mx-auto px-7">
        <motion.div {...fadeUp} className="rounded-[24px] p-10" style={{ background: "#FFFDF9", border: "1px solid rgba(24,48,60,.08)" }}>
          <div className="font-mono text-[11px] font-medium tracking-[.16em] uppercase mb-3.5" style={{ color: BLUE }}>FAQ</div>
          <h2 className="font-extrabold text-[var(--navy)] mb-6" style={{ fontSize: "clamp(28px,4vw,50px)", lineHeight: 1.02, letterSpacing: "-.025em" }}>
            {t(<>Questions <em className="italic" style={{ color: BLUE }}>answered.</em></>, <>Preguntas <em className="italic" style={{ color: BLUE }}>resueltas.</em></>)}
          </h2>
          <div className="mt-8 divide-y divide-[rgba(24,48,60,.08)]">
            {items.map(([q, a]) => (
              <details key={q} className="group py-4">
                <summary className="cursor-pointer list-none flex justify-between items-center font-bold text-[17px] tracking-[-.01em] text-[var(--navy)]">
                  {q}<span className="text-[22px] leading-none transition-transform group-open:rotate-45" style={{ color: BLUE }}>+</span>
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
        {t(<>Stop losing patients to <em className="italic" style={{ color: BLUE }}>voicemail.</em></>, <>Deja de perder pacientes con <em className="italic" style={{ color: BLUE }}>el buzón de voz.</em></>)}
      </motion.h2>
      <motion.p {...fadeUp} className="mx-auto max-w-[60ch] text-[17px] leading-[1.6] mb-9" style={{ color: "rgba(244,237,227,.7)" }}>
        {t("Grace answers every after-hours inquiry, books every willing new patient, and reduces your no-show rate — starting in 48 hours.", "Grace responde cada consulta fuera de horario, agenda cada paciente nuevo dispuesto y reduce tu tasa de no-shows — en 48 horas.")}
      </motion.p>
      <motion.div {...fadeUp} className="flex flex-wrap gap-3 justify-center">
        <a href={demoUrl(lang)} className="inline-flex items-center px-7 py-[15px] rounded-[12px] font-bold text-white text-[16px] transition-transform hover:-translate-y-px" style={{ background: BLUE, boxShadow: "0 6px 24px rgba(59,130,246,.35)" }}>
          {t("Start free trial →", "Prueba gratis →")}
        </a>
        <Link to="/" className="inline-flex items-center px-6 py-[15px] rounded-[12px] font-bold text-[16px] transition-colors" style={{ color: "var(--cream)", border: "1.5px solid rgba(244,237,227,.18)" }}>
          {t("← All Agente verticals", "← Todas las industrias")}
        </Link>
      </motion.div>
    </section>
  );
}
