import { createFileRoute } from "@tanstack/react-router";
import { VerticalStub } from "@/components/VerticalStub";
import { verticalForPath } from "@/lib/verticals";
import ogImageUrl from "@/assets/og-medical.jpg";

const vertical = verticalForPath("/medical")!;
const URL = "https://agentesystems.lovable.app/medical";
// Absolute URL for crawlers — relative paths are rejected by social scrapers.
const ORIGIN = "https://agentesystems.lovable.app";
const OG_IMAGE = `${ORIGIN}${ogImageUrl}`;
const TITLE_EN = "Agente.Medical — Grace · Bilingual Clinic AI Agent";
const TITLE_ES = "Agente.Medical — Grace · Agente IA bilingüe para clínicas";
const DESC_EN =
  "Grace answers every call, text, and web inquiry in under a second — bilingual EN/ES. HIPAA-aware intake, insurance verification, and appointment booking for US clinics.";
const DESC_ES =
  "Grace responde cada llamada y mensaje en menos de un segundo — bilingüe EN/ES. Intake HIPAA, verificación de seguro y agenda de citas para clínicas en EE.UU.";

export const Route = createFileRoute("/medical")({
  head: () => ({
    meta: [
      { title: TITLE_EN },
      { name: "description", content: DESC_EN },
      { name: "keywords", content: "bilingual medical AI, Spanish speaking medical receptionist, HIPAA AI agent, clinic intake automation, appointment booking, EN/ES, Spanglish, agente IA médico, recepcionista virtual bilingüe" },
      { property: "og:site_name", content: "Agente.Systems" },
      { property: "og:title", content: TITLE_EN },
      { property: "og:description", content: DESC_EN },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { property: "og:locale", content: "en_US" },
      { property: "og:locale:alternate", content: "es_US" },
      { property: "og:image:alt", content: "Grace — bilingual AI agent for medical practices" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:secure_url", content: OG_IMAGE },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE_EN },
      { name: "twitter:description", content: DESC_EN },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "twitter:image:alt", content: "Grace — bilingual AI agent for medical practices" },
    ],
    links: [
      { rel: "canonical", href: URL },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Agente.Medical — Grace",
          serviceType: "Bilingual AI agent for medical practices",
          provider: {
            "@type": "Organization",
            name: "Agente.Systems",
            url: "https://agentesystems.lovable.app",
          },
          areaServed: "United States",
          availableLanguage: ["en", "es"],
          description: DESC_EN,
          url: URL,
        }),
      },
    ],
  }),
  component: () => <VerticalStub vertical={vertical} />,
});

// Surface ES metadata so it's discoverable in source even though OG locale
// alternates carry the bilingual signal for crawlers.
export const _ES_META = { title: TITLE_ES, description: DESC_ES };
