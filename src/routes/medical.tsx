import { createFileRoute } from "@tanstack/react-router";
import { VerticalStub } from "@/components/VerticalStub";
import { verticalForPath } from "@/lib/verticals";

const vertical = verticalForPath("/medical")!;

export const Route = createFileRoute("/medical")({
  head: () => ({
    meta: [
      { title: "Agente.Medical — Grace · AI Agent for Medical Practices" },
      {
        name: "description",
        content:
          "Grace is your bilingual AI agent for medical practices. Built for US clinics. EN / ES / Spanglish.",
      },
      { property: "og:title", content: "Agente.Medical — Grace" },
      {
        property: "og:description",
        content: "Bilingual AI agent for medical practices. Talk to Grace today.",
      },
    ],
  }),
  component: () => <VerticalStub vertical={vertical} />,
});
