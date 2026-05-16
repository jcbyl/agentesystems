import { createFileRoute } from "@tanstack/react-router";
import { hreflangLinks } from "@/lib/hreflang";
import { VerticalStub } from "@/components/VerticalStub";
import { verticalForPath } from "@/lib/verticals";
import ogImageUrl from "@/assets/og-beauty.jpg";

const vertical = verticalForPath("/beauty")!;
const URL = "https://agentesystems.lovable.app/beauty";
const ORIGIN = "https://agentesystems.lovable.app";
const OG_IMAGE = `${ORIGIN}${ogImageUrl}`;
const TITLE_EN = "Agente.Beauty — Bella · Bilingual Salon AI Agent";
const TITLE_ES = "Agente.Beauty — Bella · Agente IA bilingüe para salones";
const DESC_EN =
  "Bella replies to every DM, WhatsApp, and missed call in under a second — bilingual EN/ES. Books slots, takes deposits, cuts no-shows for US salons.";
const DESC_ES =
  "Bella responde cada DM, WhatsApp y llamada en menos de un segundo — bilingüe EN/ES. Agenda citas, cobra depósitos y reduce no-shows para salones y spas en EE.UU.";

export const Route = createFileRoute("/beauty")({
  head: () => ({
    meta: [
      { title: TITLE_EN },
      { name: "description", content: DESC_EN },
      { name: "keywords", content: "bilingual salon AI, Spanish speaking booking assistant, Instagram DM auto-reply, spa booking automation, deposit capture, beauty no-show prevention, agente IA salón, recepción virtual bilingüe" },
      { property: "og:site_name", content: "Agente.Systems" },
      { property: "og:title", content: TITLE_EN },
      { property: "og:description", content: DESC_EN },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { property: "og:locale", content: "en_US" },
      { property: "og:locale:alternate", content: "es_US" },
      { property: "og:image:alt", content: "Bella — bilingual AI agent for beauty & wellness" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:secure_url", content: OG_IMAGE },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE_EN },
      { name: "twitter:description", content: DESC_EN },
      { name: "twitter:image", content: OG_IMAGE },
      { name: "twitter:image:alt", content: "Bella — bilingual AI agent for beauty & wellness" },
    ],
    links: [
      { rel: "canonical", href: URL },
      ...hreflangLinks(URL),
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
