import { createFileRoute } from "@tanstack/react-router";
import { VerticalStub } from "@/components/VerticalStub";
import { verticalForPath } from "@/lib/verticals";
import ogImageUrl from "@/assets/og-solar.jpg";

const vertical = verticalForPath("/solar")!;
const URL = "https://agentesystems.lovable.app/solar";
const ORIGIN = "https://agentesystems.lovable.app";
const OG_IMAGE = `${ORIGIN}${ogImageUrl}`;
const TITLE_EN = "Agente.Solar — Sol · Bilingual Installer AI Agent";
const TITLE_ES = "Agente.Solar — Sol · Agente IA bilingüe para instaladores";
const DESC_EN =
  "Sol qualifies every lead in under a second — bilingual EN/ES. Books site surveys and keeps homeowners warm through permit, install, and PTO for US solar teams.";
const DESC_ES =
  "Sol califica cada lead en menos de un segundo — bilingüe EN/ES. Agenda visitas y mantiene al dueño informado durante permisos, instalación y PTO para equipos solares.";

export const Route = createFileRoute("/solar")({
  head: () => ({
    meta: [
      { title: TITLE_EN },
      { name: "description", content: DESC_EN },
      { name: "keywords", content: "bilingual solar AI, Spanish speaking solar sales assistant, solar lead qualification, site survey booking, PTO follow-up, residential solar automation, agente IA solar, instalador solar bilingüe" },
      { property: "og:site_name", content: "Agente.Systems" },
      { property: "og:title", content: TITLE_EN },
      { property: "og:description", content: DESC_EN },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { property: "og:locale", content: "en_US" },
      { property: "og:locale:alternate", content: "es_US" },
      { property: "og:image:alt", content: "Sol — bilingual AI agent for solar installers" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:secure_url", content: OG_IMAGE },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE_EN },
      { name: "twitter:description", content: DESC_EN },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "twitter:image:alt", content: "Sol — bilingual AI agent for solar installers" },
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
          name: "Agente.Solar — Sol",
          serviceType: "Bilingual AI agent for solar installers",
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

export const _ES_META = { title: TITLE_ES, description: DESC_ES };
