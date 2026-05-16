import { createFileRoute } from "@tanstack/react-router";
import { VerticalStub } from "@/components/VerticalStub";
import { verticalForPath } from "@/lib/verticals";

const vertical = verticalForPath("/beauty")!;

export const Route = createFileRoute("/beauty")({
  head: () => ({
    meta: [
      { title: "Agente.Beauty — Bella · AI Agent for Beauty & Wellness" },
      {
        name: "description",
        content:
          "Bella is your bilingual AI agent for beauty & wellness studios. Built for US salons, spas, and med-spas. EN / ES / Spanglish.",
      },
      { property: "og:title", content: "Agente.Beauty — Bella" },
      {
        property: "og:description",
        content: "Bilingual AI agent for beauty & wellness studios. Talk to Bella today.",
      },
    ],
  }),
  component: () => <VerticalStub vertical={vertical} />,
});
