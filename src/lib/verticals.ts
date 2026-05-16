/**
 * Single source of truth for the Agente vertical brands.
 *
 * Drives the route path, the wordmark suffix in the site header
 * (e.g. `Agente.RealEstate` on `/real-estate`), nav + footer link
 * order, the persona name, and the hero copy for stub pages that
 * don't yet have a full hand-built layout (medical / beauty / solar).
 *
 * `Systems` is the fallback suffix on the home route and any
 * non-vertical page (privacy, contact, etc.).
 */

export type HeroCopy = {
  /** Live-pilot badge, e.g. "Grace is live for Bayamón Family Clinic" */
  liveBadgeEn: string;
  liveBadgeEs: string;
  /** Hero H1 — accent span is rendered in coral italics */
  headlineEn: { lead: string; accent: string; tail?: string };
  headlineEs: { lead: string; accent: string; tail?: string };
  /** Hero sub-paragraph */
  subEn: string;
  subEs: string;
  /** Four trust-strip chips */
  trustEn: [string, string, string, string];
  trustEs: [string, string, string, string];
  /** WhatsApp CTA button label, e.g. "Book Grace for your clinic →" */
  waLabelEn: string;
  waLabelEs: string;
  /** Pre-filled WhatsApp message body (plain text, not URL-encoded) */
  waMessageEn: string;
  waMessageEs: string;
};

export type Vertical = {
  /** Route path, e.g. "/real-estate" */
  path: string;
  /** Suffix shown after "Agente." in the wordmark, e.g. "RealEstate" */
  suffix: string;
  /** Persona / agent name for this vertical */
  persona: string;
  /** EN tagline used in nav + meta */
  taglineEn: string;
  /** ES tagline used in nav + meta */
  taglineEs: string;
  /** Optional rich hero copy for the stub page */
  hero?: HeroCopy;
};

export const VERTICALS: readonly Vertical[] = [
  {
    path: "/real-estate",
    suffix: "RealEstate",
    persona: "Carmen",
    taglineEn: "AI Agent for Real Estate Teams",
    taglineEs: "Agente IA para equipos inmobiliarios",
  },
  {
    path: "/construction",
    suffix: "Construction",
    persona: "Marco",
    taglineEn: "AI Agent for Contractors",
    taglineEs: "Agente IA para contratistas",
  },
  {
    path: "/medical",
    suffix: "Medical",
    persona: "Grace",
    taglineEn: "AI Agent for Medical Practices",
    taglineEs: "Agente IA para consultas médicas",
    hero: {
      liveBadgeEn: "Grace is live for Bayamón Family Clinic",
      liveBadgeEs: "Grace está activa para Bayamón Family Clinic",
      headlineEn: {
        lead: "Stop losing patients to ",
        accent: "voicemail.",
      },
      headlineEs: {
        lead: "Deja de perder pacientes con ",
        accent: "el buzón de voz.",
      },
      subEn:
        "Grace answers every call, text, and web inquiry in under a second — bilingual EN/ES/Spanglish. She screens intake, confirms insurance, books the appointment, and sends pre-visit instructions, so your front desk stops drowning and your no-show rate drops.",
      subEs:
        "Grace responde cada llamada, mensaje y consulta web en menos de un segundo — bilingüe EN/ES/Spanglish. Filtra la información del paciente, confirma seguro, agenda la cita y envía instrucciones previas, para que tu recepción deje de saturarse y bajen los no-shows.",
      trustEn: [
        "HIPAA-aware intake",
        "Bilingual EN · ES · Spanglish",
        "Live in 48 hours",
        "Cancel anytime",
      ],
      trustEs: [
        "Intake con conciencia HIPAA",
        "Bilingüe EN · ES · Spanglish",
        "En vivo en 48 horas",
        "Cancela cuando quieras",
      ],
    },
  },
  {
    path: "/beauty",
    suffix: "Beauty",
    persona: "Bella",
    taglineEn: "AI Agent for Beauty & Wellness",
    taglineEs: "Agente IA para belleza y bienestar",
    hero: {
      liveBadgeEn: "Bella is live for Glow Studio · San Juan",
      liveBadgeEs: "Bella está activa para Glow Studio · San Juan",
      headlineEn: {
        lead: "Every DM, ",
        accent: "booked while you blow-dry.",
      },
      headlineEs: {
        lead: "Cada DM, ",
        accent: "agendado mientras secas.",
      },
      subEn:
        "Bella replies to every Instagram DM, WhatsApp, and missed call in under a second — bilingual EN/ES/Spanglish. She picks the right service and stylist, books the slot, takes the deposit, and sends confirmations and reminders that cut no-shows in half.",
      subEs:
        "Bella responde cada DM de Instagram, WhatsApp y llamada perdida en menos de un segundo — bilingüe EN/ES/Spanglish. Elige el servicio y el estilista correctos, agenda el turno, cobra el depósito y envía confirmaciones y recordatorios que reducen los no-shows a la mitad.",
      trustEn: [
        "Deposits captured at booking",
        "Bilingual EN · ES · Spanglish",
        "Live in 24 hours",
        "Cancel anytime",
      ],
      trustEs: [
        "Depósitos cobrados al agendar",
        "Bilingüe EN · ES · Spanglish",
        "En vivo en 24 horas",
        "Cancela cuando quieras",
      ],
    },
  },
  {
    path: "/solar",
    suffix: "Solar",
    persona: "Sol",
    taglineEn: "AI Agent for Solar Installers",
    taglineEs: "Agente IA para instaladores solares",
    hero: {
      liveBadgeEn: "Sol is live for Caribe Solar · PR",
      liveBadgeEs: "Sol está activo para Caribe Solar · PR",
      headlineEn: {
        lead: "Every solar lead, ",
        accent: "qualified before sunset.",
      },
      headlineEs: {
        lead: "Cada lead solar, ",
        accent: "calificado antes del atardecer.",
      },
      subEn:
        "Sol replies to every form fill, ad click, and referral in under a second — bilingual EN/ES/Spanglish. He confirms the home is a fit (roof, bill, ownership), books the site survey, and keeps the homeowner warm through permit, install, and PTO so deals don't stall.",
      subEs:
        "Sol responde cada formulario, clic en anuncio y referido en menos de un segundo — bilingüe EN/ES/Spanglish. Confirma que la casa califica (techo, factura, propiedad), agenda la visita técnica y mantiene al dueño informado durante permisos, instalación y PTO para que los cierres no se estanquen.",
      trustEn: [
        "Site survey booked same week",
        "Bilingual EN · ES · Spanglish",
        "Live in 48 hours",
        "Cancel anytime",
      ],
      trustEs: [
        "Visita técnica en la misma semana",
        "Bilingüe EN · ES · Spanglish",
        "En vivo en 48 horas",
        "Cancela cuando quieras",
      ],
    },
  },
];

/** Returns the vertical matching a pathname, or null for non-vertical routes. */
export function verticalForPath(pathname: string): Vertical | null {
  const clean = pathname.replace(/[?#].*$/, "").replace(/\/$/, "") || "/";
  return VERTICALS.find((v) => v.path === clean) ?? null;
}

/**
 * Suffix to render after "Agente." in the wordmark for the current path.
 * Falls back to "Systems" on the home page and any non-vertical route.
 */
export function suffixForPath(pathname: string): string {
  return verticalForPath(pathname)?.suffix ?? "Systems";
}
