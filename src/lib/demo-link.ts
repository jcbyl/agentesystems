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