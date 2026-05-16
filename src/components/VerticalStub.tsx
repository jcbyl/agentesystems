import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useI18n } from "@/lib/i18n";
import type { Vertical } from "@/lib/verticals";

/**
 * Shared hero scaffolding for vertical pages without a full hand-built
 * layout yet (medical / beauty / solar). Mirrors the hero language of
 * `/real-estate` and `/construction`: sticky nav, live-pilot badge,
 * accent headline, persona-specific sub-copy, dual CTAs, trust strip,
 * and the shared footer. Copy is driven by `vertical.hero` in
 * `src/lib/verticals.ts` — when present it renders real content; when
 * absent it falls back to a generic "coming soon" line.
 */
export function VerticalStub({ vertical }: { vertical: Vertical }) {
  const { t } = useI18n();
  const hero = vertical.hero;
  const headline = hero ? t(hero.headlineEn, hero.headlineEs) : null;
  return (
    <div className="min-h-screen bg-[var(--navy)]">
      <SiteNav />
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--navy)", padding: "84px 28px 72px" }}
      >
        <div className="max-w-[1080px] mx-auto text-center">
          {hero && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[.1em] uppercase mb-7 px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(232,65,24,.12)",
                color: "var(--coral)",
                border: "1px solid rgba(232,65,24,.25)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--coral)] animate-pulse" />
              {t(hero.liveBadgeEn, hero.liveBadgeEs)}
            </motion.div>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-extrabold text-[var(--cream)] mb-5"
            style={{ fontSize: "clamp(40px,6.5vw,82px)", lineHeight: 0.98, letterSpacing: "-.03em" }}
          >
            {headline ? (
              <>
                {headline.lead}
                <em className="italic text-[var(--coral)]">{headline.accent}</em>
                {headline.tail ?? ""}
              </>
            ) : (
              t(vertical.taglineEn, vertical.taglineEs)
            )}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-[68ch] text-[18px] leading-[1.6] mb-9"
            style={{ color: "rgba(244,237,227,.72)" }}
          >
            {hero
              ? t(hero.subEn, hero.subEs)
              : t(
                  `Meet ${vertical.persona} — your bilingual AI agent for ${vertical.suffix.toLowerCase()}. Detailed pricing, lifecycle, and feature pages are coming soon.`,
                  `Conoce a ${vertical.persona} — tu agente IA bilingüe para ${vertical.suffix.toLowerCase()}. Próximamente: precios, ciclo de vida y características.`,
                )}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-3 justify-center mb-8"
          >
            <a
              href="https://wa.me/17878100749"
              className="inline-flex items-center gap-2 px-7 py-[15px] rounded-[12px] font-bold text-white text-[17px] transition-transform hover:-translate-y-px"
              style={{ background: "var(--coral)", boxShadow: "0 6px 24px rgba(232,65,24,.35)" }}
            >
              {t(
                `Talk to ${vertical.persona} on WhatsApp →`,
                `Habla con ${vertical.persona} por WhatsApp →`,
              )}
            </a>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-[15px] rounded-[12px] font-bold text-[17px] transition-colors"
              style={{
                background: "rgba(244,237,227,.06)",
                color: "var(--cream)",
                border: "1.5px solid rgba(244,237,227,.14)",
              }}
            >
              {t("← All verticals", "← Todas las industrias")}
            </Link>
          </motion.div>
          {hero && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-5 justify-center font-mono text-[11px] tracking-[.06em]"
              style={{ color: "rgba(244,237,227,.5)" }}
            >
              {(t(hero.trustEn, hero.trustEs) as readonly string[]).map((s, i) => (
                <span key={i} className="inline-flex items-center gap-1.5">
                  <span className="text-[var(--coral)]">●</span> {s}
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
