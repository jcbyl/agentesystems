/**
 * Single source of truth for the Agente vertical brands.
 *
 * Each entry drives:
 *   - the route path (`/real-estate`, `/construction`, …)
 *   - the wordmark suffix shown in the site header on that route
 *     (e.g. `Agente.RealEstate` on `/real-estate`)
 *   - nav + footer link order
 *   - the persona name surfaced on the vertical page
 *
 * `Systems` is the fallback suffix on the home route and any non-vertical
 * page (privacy, contact, etc.).
 */

export type Vertical = {
  /** Route path, e.g. "/real-estate" */
  path: string;
  /** Suffix shown after "Agente." in the wordmark, e.g. "RealEstate" */
  suffix: string;
  /** Persona / agent name for this vertical */
  persona: string;
  /** EN tagline used on stub pages + nav */
  taglineEn: string;
  /** ES tagline used on stub pages + nav */
  taglineEs: string;
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
  },
  {
    path: "/beauty",
    suffix: "Beauty",
    persona: "Bella",
    taglineEn: "AI Agent for Beauty & Wellness",
    taglineEs: "Agente IA para belleza y bienestar",
  },
  {
    path: "/solar",
    suffix: "Solar",
    persona: "Sol",
    taglineEn: "AI Agent for Solar Installers",
    taglineEs: "Agente IA para instaladores solares",
  },
];

/** Returns the vertical matching a pathname, or null for non-vertical routes. */
export function verticalForPath(pathname: string): Vertical | null {
  // Strip trailing slash and any query/hash so it doesn't break matching.
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
