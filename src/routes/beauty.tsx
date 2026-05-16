import { createFileRoute } from "@tanstack/react-router";
import { VerticalStub } from "@/components/VerticalStub";
import { verticalForPath } from "@/lib/verticals";

const vertical = verticalForPath("/beauty")!;
const URL = "https://agentesystems.lovable.app/beauty";
const TITLE_EN = "Agente.Beauty — Bella · Bilingual AI Agent for Beauty & Wellness";
const TITLE_ES = "Agente.Beauty — Bella · Agente IA bilingüe para belleza y bienestar";
const DESC_EN =
  "Bella replies to every Instagram DM, WhatsApp, and missed call in under a second — bilingual EN/ES/Spanglish. Picks the right service and stylist, books the slot, captures deposits, and cuts no-shows for US salons, spas, and med-spas.";
const DESC_ES =
  "Bella responde cada DM de Instagram, WhatsApp y llamada perdida en menos de un segundo — bilingüe EN/ES/Spanglish. Elige el servicio y el estilista correctos, agenda, cobra el depósito y reduce los no-shows para salones, spas y med-spas en EE.UU.";

export const Route = createFileRoute("/beauty")({
  head: () => ({
    meta: [
      { title: TITLE_EN },
      { name: "description", content: `${DESC_EN} | ${DESC_ES}` },
      { name: "keywords", content: "bilingual salon AI, Spanish speaking booking assistant, Instagram DM auto-reply, spa booking automation, deposit capture, beauty no-show prevention, agente IA salón, recepción virtual bilingüe" },
      { property: "og:site_name", content: "Agente.Systems" },
      { property: "og:title", content: TITLE_EN },
      { property: "og:description", content: DESC_EN },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { property: "og:locale", content: "en_US" },
      { property: "og:locale:alternate", content: "es_US" },
      { property: "og:image:alt", content: "Bella — bilingual AI agent for beauty & wellness" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE_EN },
      { name: "twitter:description", content: DESC_EN },
      { name: "twitter:image:alt", content: "Bella — bilingual AI agent for beauty & wellness" },
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
          name: "Agente.Beauty — Bella",
          serviceType: "Bilingual AI agent for beauty & wellness studios",
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
