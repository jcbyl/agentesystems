import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useI18n } from "@/lib/i18n";
import type { Vertical } from "@/lib/verticals";

/**
 * Shared scaffolding for vertical pages that don't yet have full hand-built
 * content (medical / beauty / solar). Mirrors the layout language of
 * `/real-estate` and `/construction` — sticky nav, hero with persona +
 * tagline, "coming soon" CTA, and the shared footer — so the wordmark
 * suffix swap, navigation, and SEO metadata work today and the page can
 * be filled in later without restructuring.
 */
export function VerticalStub({ vertical }: { vertical: Vertical }) {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-[var(--navy)]">
      <SiteNav />
      <section className="px-6 md:px-10 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="max-w-[1100px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[820px]"
          >
            <span
              className="inline-block font-mono text-[11px] tracking-[.18em] uppercase mb-6 px-3 py-1.5 rounded-full"
              style={{
                color: "var(--coral)",
                background: "rgba(232,65,24,.08)",
                border: "1px solid rgba(232,65,24,.25)",
              }}
            >
              Agente<span className="text-[var(--coral)] mx-[-0.5px]">.</span>
              {vertical.suffix}
            </span>
            <h1
              className="text-[44px] md:text-[68px] leading-[1.02] font-extrabold text-[var(--cream)]"
              style={{ letterSpacing: "-0.035em" }}
            >
              {t(vertical.taglineEn, vertical.taglineEs)}
            </h1>
            <p
              className="mt-6 text-[18px] md:text-[20px] leading-[1.55] max-w-[60ch]"
              style={{ color: "var(--soft)" }}
            >
              {t(
                `Meet ${vertical.persona} — your bilingual AI agent for ${vertical.suffix.toLowerCase()}. Detailed pricing, lifecycle, and feature pages are coming soon.`,
                `Conoce a ${vertical.persona} — tu agente IA bilingüe para ${vertical.suffix.toLowerCase()}. Próximamente: precios, ciclo de vida y características.`,
              )}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="https://wa.me/17878100749"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-[10px] text-[14px] font-bold text-white transition-transform hover:-translate-y-px"
                style={{
                  background: "var(--coral)",
                  boxShadow: "0 4px 20px rgba(232,65,24,.3)",
                }}
              >
                {t(
                  `Talk to ${vertical.persona} on WhatsApp →`,
                  `Habla con ${vertical.persona} por WhatsApp →`,
                )}
              </a>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-[10px] text-[14px] font-semibold border transition-colors"
                style={{
                  borderColor: "var(--rule)",
                  color: "var(--soft)",
                }}
              >
                {t("← All Agente verticals", "← Todas las industrias")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
