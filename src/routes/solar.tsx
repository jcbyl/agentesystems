import { createFileRoute } from "@tanstack/react-router";
import { VerticalStub } from "@/components/VerticalStub";
import { verticalForPath } from "@/lib/verticals";

const vertical = verticalForPath("/solar")!;
const URL = "https://agentesystems.lovable.app/solar";
const TITLE_EN = "Agente.Solar — Sol · Bilingual AI Agent for Solar Installers";
const TITLE_ES = "Agente.Solar — Sol · Agente IA bilingüe para instaladores solares";
const DESC_EN =
  "Sol replies to every form fill, ad click, and referral in under a second — bilingual EN/ES/Spanglish. Qualifies the home (roof, bill, ownership), books the site survey, and keeps homeowners warm through permit, install, and PTO for US solar teams.";
const DESC_ES =
  "Sol responde cada formulario, clic en anuncio y referido en menos de un segundo — bilingüe EN/ES/Spanglish. Califica la casa (techo, factura, propiedad), agenda la visita técnica y mantiene al dueño informado durante permisos, instalación y PTO para equipos solares en EE.UU.";

export const Route = createFileRoute("/solar")({
  head: () => ({
    meta: [
      { title: TITLE_EN },
      { name: "description", content: `${DESC_EN} | ${DESC_ES}` },
      { name: "keywords", content: "bilingual solar AI, Spanish speaking solar sales assistant, solar lead qualification, site survey booking, PTO follow-up, residential solar automation, agente IA solar, instalador solar bilingüe" },
      { property: "og:site_name", content: "Agente.Systems" },
      { property: "og:title", content: TITLE_EN },
      { property: "og:description", content: DESC_EN },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { property: "og:locale", content: "en_US" },
      { property: "og:locale:alternate", content: "es_US" },
      { property: "og:image:alt", content: "Sol — bilingual AI agent for solar installers" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE_EN },
      { name: "twitter:description", content: DESC_EN },
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
