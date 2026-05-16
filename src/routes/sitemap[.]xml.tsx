import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://agentesystems.lovable.app";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
  /** When true, emit xhtml:link hreflang alternates (en, es, x-default) for this single-URL bilingual page. */
  bilingual?: boolean;
}

const entries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0", bilingual: true },
  { path: "/medical", changefreq: "weekly", priority: "0.9", bilingual: true },
  { path: "/beauty", changefreq: "weekly", priority: "0.9", bilingual: true },
  { path: "/solar", changefreq: "weekly", priority: "0.9", bilingual: true },
  { path: "/real-estate", changefreq: "weekly", priority: "0.8", bilingual: true },
  { path: "/construction", changefreq: "weekly", priority: "0.8", bilingual: true },
  { path: "/demo", changefreq: "monthly", priority: "0.7", bilingual: true },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = entries.map((e) => {
          const loc = `${BASE_URL}${e.path}`;
          const lines = [
            `  <url>`,
            `    <loc>${loc}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
          ];
          if (e.bilingual) {
            // Single-URL bilingual: same href for en, es, and x-default.
            // The client toggle (?lang= / localStorage) selects rendering.
            lines.push(
              `    <xhtml:link rel="alternate" hreflang="en" href="${loc}"/>`,
              `    <xhtml:link rel="alternate" hreflang="es" href="${loc}"/>`,
              `    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}"/>`,
            );
          }
          lines.push(`  </url>`);
          return lines.filter(Boolean).join("\n");
        });

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
