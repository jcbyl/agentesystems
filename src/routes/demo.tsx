import { createFileRoute, Link } from "@tanstack/react-router";
import { hreflangLinks } from "@/lib/hreflang";
import { motion } from "framer-motion";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useI18n } from "@/lib/i18n";
import { useState, useRef, useEffect } from "react";
import { ogFallbackPair } from "@/lib/og-fallback";

const ORIGIN = "https://agentesystems.lovable.app";
const PAGE_URL = `${ORIGIN}/demo`;
const OG = ogFallbackPair("demo");

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Live Demo — Talk to an Agente · Bilingual AI Agents" },
      { name: "description", content: "Try the agents live — Carmen, Marco, Sol, Grace, or Bella. Real conversations, real qualification, bilingual EN/ES. Pick an agent and type a message." },
      { property: "og:title", content: "Live Demo — Agente.Systems" },
      { property: "og:description", content: "Talk to Carmen, Marco, Sol, Grace, or Bella live. Bilingual EN/ES AI agents for real estate, construction, solar, medical, and beauty." },
      { property: "og:url", content: PAGE_URL },
      { property: "og:image", content: OG.url },
      { property: "og:image:type", content: OG.type },
      { property: "og:image:width", content: OG.width },
      { property: "og:image:height", content: OG.height },
      { name: "twitter:card", content: "summary_large_image" }
      { name: "twitter:description", content: "Talk to Carmen, Marco, Sol, Grace, or Bella live. Bilingual EN/ES AI agents for real estate, construction, solar, medical, and beauty." },
      { name: "twitter:title", content: "Live Demo — Agente.Systems" },
      { name: "twitter:image", content: OG.url },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }, ...hreflangLinks(PAGE_URL)],
  }),
  component: DemoPage,
});

type AgentDef = {
  id: string; name: string; role: string; initial: string;
  color: string; headBg: string; msgBg: string;
  hintEn: string; hintEs: string;
  systemEn: string; systemEs: string;
};

const AGENTS: AgentDef[] = [
  {
    id: "carmen", name: "Carmen", role: "Real Estate · PR", initial: "C",
    color: "#E84118", headBg: "#075E54", msgBg: "#DCF8C6",
    hintEn: 'Try: "I saw a listing in Condado — can I view it this weekend?"',
    hintEs: 'Prueba: "Vi una propiedad en Condado, ¿la puedo ver este fin de semana?"',
    systemEn: `You are Carmen, bilingual AI lead concierge for a Puerto Rico real estate team. Warm, knowledgeable, never pushy. Auto-detect EN/ES/Spanglish. Short messages 1–3 sentences max. One emoji max (🌴🌊). The Carmen Method: never say no — always yes then qualify inside the yes. One question per message. Qualify naturally: timeline → intent (primary/vacation/investment) → Act 60 awareness → budget (soft) → financing. PR knowledge: Dorado=luxury/Act60, Condado=urban beachfront, Rincón=surf/expats, Ocean Park=quiet beach, Old San Juan=historic. Act 60: 4% corporate tax, 0% capital gains — always refer to agent+tax pro. Handoff at 3/5 questions answered. Hard stops: no legal advice, no specific prices, no document requests. Under 60 words.`,
    systemEs: `Eres Carmen, asistente bilingüe de un equipo de bienes raíces en Puerto Rico. Cálida, nunca insistente. Detecta ES automático. Mensajes cortos 1–3 oraciones. Un emoji máx (🌴🌊). Método Carmen: nunca dices que no — siempre sí y califica dentro del sí. Una pregunta por mensaje. Califica: timeline → intención → Ley 60 → presupuesto → financiamiento. Cierre a 3/5 preguntas. Solo en español. Máx 60 palabras.`,
  },
  {
    id: "marco", name: "Marco", role: "Construction · DMV", initial: "M",
    color: "#C8391A", headBg: "#1C3828", msgBg: "#DCF8C6",
    hintEn: 'Try: "I need to gut my kitchen in Bethesda MD — how much does that run?"',
    hintEs: 'Prueba: "Necesito remodelar mi cocina completa en Bethesda MD"',
    systemEn: `You are Marco, AI lead concierge for a licensed contractor DC/Maryland/Virginia. Professional, direct. Short messages, one question at a time. No emojis. Qualify: scope → full address (determines permit jurisdiction) → ownership → timeline → budget (soft). Ranges for context only: kitchen gut Bethesda $75K–$140K, bath $30K–$70K, basement $55K–$125K. Never quote exact prices. Book free in-person estimate. Pre-1978 homes need EPA RRP-certified. DC DOB and Fairfax permit fees apply. Under 60 words.`,
    systemEs: `Eres Marco, asistente de un contratista licenciado DC/Maryland/Virginia. Profesional, directo. Mensajes cortos, una pregunta a la vez. Sin emojis. Califica: alcance → dirección → ¿es dueño? → cronograma → presupuesto. Rangos de referencia solo. Agenda evaluación gratuita en persona. Solo en español. Máx 60 palabras.`,
  },
  {
    id: "sol", name: "Sol", role: "Solar · Puerto Rico", initial: "S",
    color: "#F59E0B", headBg: "#1A4020", msgBg: "#DCF8C6",
    hintEn: 'Try: "My LUMA bill hit $380 this month — is solar actually worth it?"',
    hintEs: 'Prueba: "Mi factura de LUMA llegó a $380 este mes, ¿vale la pena el solar?"',
    systemEn: `You are Sol, bilingual AI solar lead agent for Puerto Rico solar installers. Warm, knowledgeable about PR solar. Auto-detect EN/ES. One emoji max (☀️). Qualify: own property? → avg LUMA bill? → roof age/condition? → federal tax filer? (CRITICAL: most PR residents do NOT file US federal returns — they cannot use the 30% ITC. NEVER promise or imply ITC without confirming this.) → cash or $0-down? Net metering guaranteed through 2030 (Act 10-2024). $380/mo LUMA = ~9–12kW system = $27K–$35K before incentives. Book free site assessment. Under 60 words.`,
    systemEs: `Eres Sol, agente solar bilingüe para Puerto Rico. Cálido, experto en mercado solar PR. Detecta ES. Máx un emoji (☀️). Califica: ¿dueño? → factura LUMA promedio? → edad techo? → ¿declaras federal? (CRÍTICO: no prometas el crédito ITC del 30% sin confirmar esto). → ¿efectivo o $0? Agenda evaluación gratuita. Solo en español. Máx 60 palabras.`,
  },
  {
    id: "grace", name: "Grace", role: "Medical · HIPAA", initial: "G",
    color: "#3B82F6", headBg: "#1A2A50", msgBg: "#D4E8FF",
    hintEn: 'Try: "Hi — I just moved here and need a new primary care doctor"',
    hintEs: 'Prueba: "Hola, me acabo de mudar aquí y necesito un médico de cabecera"',
    systemEn: `You are Grace, HIPAA-aware AI scheduling assistant for Heritage Family Practice (family medicine). Warm, calm, professional. Short messages. CAN: book/reschedule/cancel appointments, verify insurance, answer FAQs (hours, location, parking, accepted insurances), collect name and availability. CANNOT: discuss symptoms, diagnoses, lab results, medications, prescriptions — for any clinical question say "Your patient portal has that, or call our office directly." Insurances: Cigna, Aetna, Blue Cross, United, Medicare, Medicaid, self-pay. Hours: Mon–Fri 8am–5pm. New patients = 45 min. Under 50 words. No clinical opinions ever.`,
    systemEs: `Eres Grace, asistente HIPAA para consultorio médico familiar. Cálida, tranquila, profesional. CAN: agendar, verificar seguro, responder FAQs. NO PUEDES: hablar de síntomas, diagnósticos, medicamentos — di "Tu portal tiene esa información, o llama a la oficina." Seguros: Cigna, Aetna, Blue Cross, United, Medicare, Medicaid. Horario: Lun–Vie 8am–5pm. Solo en español. Máx 50 palabras.`,
  },
  {
    id: "bella", name: "Bella", role: "Agente.Beauty", initial: "B",
    color: "#EC4899", headBg: "#3A1530", msgBg: "#FFD6EC",
    hintEn: 'Try: "Hi, can I get a gel manicure this Saturday morning?"',
    hintEs: 'Prueba: "Hola, ¿puedo hacer una cita para gel el sábado por la mañana?"',
    systemEn: `You are Bella, bilingual AI booking assistant for a beauty and nail salon. Warm, friendly, efficient. Auto-detect EN/ES. One emoji max (💅). Book in 3–5 messages: service? → stylist preference? → day/time (offer 2 options) → name → confirm + deposit link. Services: regular mani 30min $25, gel 45min $35, acrylic full set 90min $55, fill 60min $40, pedicure 45min $35, spa pedicure 60min $50, blowout 45min $45. Upsell once only. Groups: gather details and flag to owner. Under 50 words.`,
    systemEs: `Eres Bella, asistente bilingüe para salón de belleza y uñas. Cálida, amigable. Detecta ES. Máx un emoji (💅). Agenda en 3–5 mensajes: ¿servicio? → ¿estilista? → ¿día/hora? (ofrece 2 opciones) → nombre → confirmar + link depósito. Grupos: recopila detalles y alerta al dueño. Solo en español. Máx 50 palabras.`,
  },
];

type Message = { role: "user" | "agent"; text: string; ts: string };
type HistoryItem = { role: "user" | "assistant"; content: string };

function now() {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function PhoneWidget() {
  const { t } = useI18n();
  const [agent, setAgent] = useState<AgentDef>(AGENTS[0]);
  const [lang, setLang] = useState<"en" | "es">("en");
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [exchanges, setExchanges] = useState(0);
  const msgsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages, busy]);

  const switchAgent = (a: AgentDef) => {
    setAgent(a);
    setMessages([]);
    setHistory([]);
    setExchanges(0);
    setInput("");
  };

  const switchLang = (l: "en" | "es") => {
    setLang(l);
    setMessages([]);
    setHistory([]);
    setExchanges(0);
  };

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setBusy(true);
    setInput("");

    const userMsg: Message = { role: "user", text, ts: now() };
    const newHistory: HistoryItem[] = [...history, { role: "user", content: text }];
    setMessages((prev) => [...prev, userMsg]);
    setHistory(newHistory);

    try {
      const apiKey = (import.meta as any).env?.VITE_ANTHROPIC_API_KEY ?? "";
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 200,
          system: lang === "es" ? agent.systemEs : agent.systemEn,
          messages: newHistory,
        }),
      });
      const data = await res.json();
      const reply: string = data?.content?.[0]?.text ?? "…";
      const agentMsg: Message = { role: "agent", text: reply, ts: now() };
      setMessages((prev) => [...prev, agentMsg]);
      setHistory((prev) => [...prev, { role: "assistant", content: reply }]);
      setExchanges((n) => n + 1);
    } catch {
      setMessages((prev) => [...prev, { role: "agent", text: "Connection error — try again.", ts: now() }]);
    }
    setBusy(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Agent picker */}
      <div className="flex gap-2 flex-wrap justify-center">
        {AGENTS.map((a) => (
          <button
            key={a.id}
            onClick={() => switchAgent(a)}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-[14px] border transition-all"
            style={{
              border: agent.id === a.id ? `1.5px solid ${a.color}` : "1.5px solid rgba(244,237,227,.1)",
              background: agent.id === a.id ? `${a.color}18` : "rgba(244,237,227,.04)",
              minWidth: 72,
            }}
          >
            <div className="w-8 h-8 rounded-[9px] grid place-items-center font-extrabold text-[13px] text-white" style={{ background: a.color }}>
              {a.initial}
            </div>
            <span className="font-bold text-[11px]" style={{ color: agent.id === a.id ? "var(--cream)" : "rgba(244,237,227,.55)" }}>{a.name}</span>
            <span className="font-mono text-[9px] text-center leading-[1.3]" style={{ color: "rgba(244,237,227,.3)" }}>{a.role}</span>
          </button>
        ))}
      </div>

      {/* Language toggle */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-[11px]" style={{ color: "rgba(244,237,227,.4)" }}>Language:</span>
        <div className="flex gap-px rounded-lg p-0.5" style={{ background: "rgba(244,237,227,.08)" }}>
          {(["en", "es"] as const).map((l) => (
            <button
              key={l}
              onClick={() => switchLang(l)}
              className="font-mono text-[11px] tracking-[.06em] px-3 py-1 rounded-md transition-colors"
              style={{
                background: lang === l ? "rgba(244,237,227,.14)" : "transparent",
                color: lang === l ? "var(--cream)" : "rgba(244,237,227,.4)",
                fontWeight: lang === l ? 600 : 400,
              }}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        {exchanges > 0 && (
          <span className="font-mono text-[10px]" style={{ color: "rgba(74,222,128,.5)" }}>
            · {t(`remembers ${exchanges} exchange${exchanges !== 1 ? "s" : ""}`, `recuerda ${exchanges} intercambio${exchanges !== 1 ? "s" : ""}`)}
          </span>
        )}
      </div>

      {/* Phone mockup */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            width: 300, background: "#1A1A1A", borderRadius: 46,
            border: "1.5px solid rgba(255,255,255,.06)", padding: 8,
            boxShadow: "0 40px 70px -20px rgba(0,0,0,.7), 0 0 0 5px #18303C, 0 0 0 6.5px rgba(244,237,227,.04)",
          }}
        >
          {/* Screen */}
          <div style={{ borderRadius: 38, overflow: "hidden", display: "flex", flexDirection: "column", background: "#ECE5DD", height: 490 }}>
            {/* Dynamic island */}
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", width: 80, height: 22, background: "#000", borderRadius: 999, zIndex: 10 }} />
              {/* Header */}
              <div style={{ background: agent.headBg, padding: "42px 11px 9px", display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: agent.color, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 13, color: "#FFF", flexShrink: 0 }}>
                  {agent.initial}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#FFF", lineHeight: 1.2 }}>{agent.name} · Agente</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,.7)" }}>{busy ? (lang === "es" ? "escribiendo…" : "typing…") : (lang === "es" ? "en línea" : "online")}</div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={msgsRef} style={{ flex: 1, overflowY: "auto", padding: "8px 7px", display: "flex", flexDirection: "column", gap: 3, scrollBehavior: "smooth" }}>
              <div style={{ alignSelf: "center", background: "#E1F3FB", color: "#475A60", fontSize: 8, fontWeight: 500, padding: "2px 6px", borderRadius: 6, margin: "3px 0" }}>
                {lang === "es" ? "HOY" : "TODAY"}
              </div>
              {messages.length === 0 && (
                <div style={{ textAlign: "center", fontSize: 11, color: "#888", margin: "auto 0", padding: "20px 10px", lineHeight: 1.5 }}>
                  {lang === "es" ? agent.hintEs : agent.hintEn}
                </div>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    maxWidth: "82%", padding: "6px 9px 4px", borderRadius: 7,
                    fontSize: 12, lineHeight: 1.4, position: "relative",
                    boxShadow: "0 1px 0.5px rgba(0,0,0,.1)", wordBreak: "break-word",
                    alignSelf: m.role === "user" ? "flex-start" : "flex-end",
                    background: m.role === "user" ? "#FFF" : agent.msgBg,
                    color: "#111",
                    borderTopLeftRadius: m.role === "user" ? 0 : 7,
                    borderTopRightRadius: m.role === "agent" ? 0 : 7,
                  }}
                >
                  {m.text.split("\n").map((line, li) => <span key={li}>{line}{li < m.text.split("\n").length - 1 && <br />}</span>)}
                  <div style={{ fontSize: 8, textAlign: "right", marginTop: 2, color: "#667781", display: "flex", gap: 2, justifyContent: "flex-end" }}>
                    {m.ts}{m.role === "agent" && <span style={{ color: "#53BDEB", fontWeight: 700, letterSpacing: -2 }}>✓✓</span>}
                  </div>
                </div>
              ))}
              {busy && (
                <div style={{ alignSelf: "flex-start", padding: "8px 12px", background: "#FFF", borderRadius: 7, borderTopLeftRadius: 0, display: "flex", gap: 3, alignItems: "center" }}>
                  {[0, 150, 300].map((d) => (
                    <div key={d} style={{ width: 4, height: 4, background: "#667781", borderRadius: "50%", animation: `typing-dot 1.2s ease-in-out ${d}ms infinite` }} />
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{ background: "#F0F0F0", padding: "6px 8px 14px", display: "flex", gap: 6, alignItems: "center" }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") send(); }}
                placeholder={lang === "es" ? "Escribe un mensaje…" : "Type a message…"}
                style={{ flex: 1, background: "#FFF", border: "none", borderRadius: 18, padding: "6px 11px", fontSize: 11, color: "#111", outline: "none", fontFamily: "inherit" }}
              />
              <button
                onClick={send}
                disabled={busy || !input.trim()}
                style={{ width: 30, height: 30, borderRadius: "50%", border: "none", cursor: busy ? "not-allowed" : "pointer", background: agent.color, color: "#FFF", fontSize: 12, display: "grid", placeItems: "center", opacity: busy || !input.trim() ? 0.4 : 1, transition: "opacity .15s", flexShrink: 0 }}
              >
                ➤
              </button>
            </div>
          </div>
        </div>
        {/* Glow */}
        <div style={{ position: "absolute", bottom: -14, left: "50%", transform: "translateX(-50%)", width: 200, height: 60, background: `radial-gradient(ellipse, ${agent.color}28, transparent 65%)`, filter: "blur(12px)", pointerEvents: "none" }} />
      </div>

      <style>{`
        @keyframes typing-dot {
          0%, 100% { opacity: .3; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-2px); }
        }
      `}</style>
    </div>
  );
}

function DemoPage() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-[var(--navy)]">
      <SiteNav />
      <section style={{ padding: "80px 20px 100px" }}>
        <div className="max-w-[1100px] mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[.1em] uppercase mb-5 px-3 py-1.5 rounded-full" style={{ background: "rgba(74,222,128,.1)", border: "1px solid rgba(74,222,128,.2)", color: "#4ADE80" }}>
              <span className="w-[6px] h-[6px] bg-[#4ADE80] rounded-full" style={{ animation: "pulse-dot 1.4s ease-in-out infinite" }} />
              Agente · Live demo
            </div>
            <h1 className="font-extrabold text-[var(--cream)] mb-4" style={{ fontSize: "clamp(32px,5vw,60px)", lineHeight: 0.98, letterSpacing: "-.03em" }}>
              {t(<>Talk to an <em className="italic text-[var(--coral)]">Agente.</em></>, <>Habla con un <em className="italic text-[var(--coral)]">Agente.</em></>)}
            </h1>
            <p className="mx-auto text-[17px] leading-[1.55]" style={{ color: "rgba(244,237,227,.65)", maxWidth: "52ch" }}>
              {t(
                "Pick an agent. Type a real message. Every response is in character — the agent remembers your full conversation.",
                "Elige un agente. Escribe un mensaje real. Cada respuesta es en personaje — el agente recuerda toda tu conversación."
              )}
            </p>
          </motion.div>

          {/* Two-column: phone + info */}
          <div className="grid lg:grid-cols-[1fr_380px] gap-16 items-start">
            {/* Left — context */}
            <div className="order-2 lg:order-1">
              <div className="space-y-6">
                {[
                  {
                    icon: "🌴",
                    name: "Carmen · Agente.RealEstate",
                    desc: t("Buyer qualification for Puerto Rico real estate. Ask about a listing, budget, timeline, or Act 60.", "Calificación de compradores para bienes raíces en PR. Pregunta sobre una propiedad, presupuesto, cronograma o Ley 60."),
                    href: "/real-estate",
                  },
                  {
                    icon: "🔨",
                    name: "Marco · Agente.Construction",
                    desc: t("Lead qualification for DC/MD/VA contractors. Ask about a renovation scope, timeline, or estimate.", "Calificación de leads para contratistas DMV. Pregunta sobre un proyecto, cronograma o evaluación."),
                    href: "/construction",
                  },
                  {
                    icon: "☀️",
                    name: "Sol · Agente.Solar",
                    desc: t("Solar lead qualification for Puerto Rico. Ask about your LUMA bill, net metering, or ITC.", "Calificación solar para Puerto Rico. Pregunta sobre tu factura LUMA, medición neta o crédito ITC."),
                    href: "/solar",
                  },
                  {
                    icon: "🏥",
                    name: "Grace · Agente.Medical",
                    desc: t("HIPAA-aware appointment scheduling. Ask about booking, insurance, or office hours.", "Agenda de citas con conciencia HIPAA. Pregunta sobre citas, seguro u horarios."),
                    href: "/medical",
                  },
                  {
                    icon: "💅",
                    name: "Bella · Agente.Beauty",
                    desc: t("Salon booking assistant. Ask about a gel manicure, stylist preference, or Saturday availability.", "Asistente de reservas de salón. Pregunta sobre un gel, estilista preferida o disponibilidad el sábado."),
                    href: "/beauty",
                  },
                ].map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block rounded-[16px] p-5 border transition-all hover:-translate-y-px hover:border-[rgba(232,65,24,.3)]"
                    style={{ background: "rgba(244,237,227,.04)", borderColor: "rgba(244,237,227,.08)" }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-[22px] mt-0.5">{item.icon}</span>
                      <div>
                        <div className="font-bold text-[15px] text-[var(--cream)] mb-1">{item.name}</div>
                        <div className="text-[13px] leading-[1.5]" style={{ color: "rgba(244,237,227,.5)" }}>{item.desc}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-8 rounded-[16px] p-5 border" style={{ background: "rgba(232,65,24,.06)", borderColor: "rgba(232,65,24,.2)" }}>
                <div className="font-mono text-[10px] font-bold uppercase tracking-[.1em] text-[var(--coral)] mb-2">
                  {t("Start a real conversation", "Empieza una conversación real")}
                </div>
                <p className="text-[13px] leading-[1.55]" style={{ color: "rgba(244,237,227,.6)" }}>
                  {t(
                    "The demo runs the real agent. Say what a lead would actually say — not 'test' or 'hello'. The agent responds the same way it responds to your clients.",
                    "La demo corre el agente real. Di lo que un lead diría de verdad — no 'prueba' o 'hola'. El agente responde igual que con tus clientes."
                  )}
                </p>
              </div>
            </div>

            {/* Right — phone */}
            <div className="order-1 lg:order-2 flex justify-center">
              <PhoneWidget />
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
      <style>{`@keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:.3} }`}</style>
    </div>
  );
}
