import { createFileRoute } from "@tanstack/react-router";
import { VerticalStub } from "@/components/VerticalStub";
import { verticalForPath } from "@/lib/verticals";

const vertical = verticalForPath("/solar")!;

export const Route = createFileRoute("/solar")({
  head: () => ({
    meta: [
      { title: "Agente.Solar — Sol · AI Agent for Solar Installers" },
      {
        name: "description",
        content:
          "Sol is your bilingual AI agent for solar installers. Built for US solar teams. EN / ES / Spanglish.",
      },
      { property: "og:title", content: "Agente.Solar — Sol" },
      {
        property: "og:description",
        content: "Bilingual AI agent for solar installers. Talk to Sol today.",
      },
    ],
  }),
  component: () => <VerticalStub vertical={vertical} />,
});
