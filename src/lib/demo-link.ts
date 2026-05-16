/**
 * Centralized "Book a demo" target.
 *
 * No calendar (Cal.com / Calendly / Google) is wired up yet, so the demo
 * CTA falls back to a WhatsApp deep link with a prefilled message in the
 * user's current language. When a real scheduler is added, swap
 * `DEMO_URL` for the calendar link and keep the same import sites.
 */
export const DEMO_PHONE = "17878100749";

const PREFILL_EN =
  "Hi Agente! I'd like to book a demo to see how your bilingual EN/ES AI agent would work for my business.";
const PREFILL_ES =
  "¡Hola Agente! Me gustaría agendar una demo para ver cómo funcionaría su agente IA bilingüe EN/ES en mi negocio.";

export function demoUrl(lang: "en" | "es"): string {
  const text = lang === "es" ? PREFILL_ES : PREFILL_EN;
  return `https://wa.me/${DEMO_PHONE}?text=${encodeURIComponent(text)}`;
}

export type DemoFormPayload = {
  name: string;
  company?: string;
  vertical?: string;
  email?: string;
  message?: string;
};

/**
 * Build a richer WhatsApp deep link from /demo form fields. Same target
 * number as `demoUrl()`, but the prefilled body includes whatever the
 * user typed so the first reply can be a real scheduling question, not a
 * back-and-forth to collect basics.
 */
export function demoUrlFromForm(lang: "en" | "es", payload: DemoFormPayload): string {
  const lines: string[] = [];
  if (lang === "es") {
    lines.push("¡Hola Agente! Me gustaría agendar una demo.");
    if (payload.name) lines.push(`Nombre: ${payload.name}`);
    if (payload.company) lines.push(`Empresa: ${payload.company}`);
    if (payload.vertical) lines.push(`Industria: ${payload.vertical}`);
    if (payload.email) lines.push(`Correo: ${payload.email}`);
    if (payload.message) lines.push(`Mensaje: ${payload.message}`);
  } else {
    lines.push("Hi Agente! I'd like to book a demo.");
    if (payload.name) lines.push(`Name: ${payload.name}`);
    if (payload.company) lines.push(`Company: ${payload.company}`);
    if (payload.vertical) lines.push(`Industry: ${payload.vertical}`);
    if (payload.email) lines.push(`Email: ${payload.email}`);
    if (payload.message) lines.push(`Note: ${payload.message}`);
  }
  return `https://wa.me/${DEMO_PHONE}?text=${encodeURIComponent(lines.join("\n"))}`;
}