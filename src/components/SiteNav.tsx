import { useI18n } from "@/lib/i18n";
import { RobotLogo } from "./RobotLogo";

export function SiteNav() {
  const { lang, setLang, t } = useI18n();
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-[var(--rule)]" style={{ background: "rgba(13,27,34,.94)", padding: "16px 28px" }}>
      <div className="max-w-[1100px] mx-auto flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-2 font-extrabold text-[19px] text-[var(--cream)]" style={{ letterSpacing: "-0.035em" }}>
          <RobotLogo />
          <span className="inline-flex items-baseline">
            Agente<span className="text-[var(--coral)] mx-[-0.5px]">.</span>Systems
          </span>
        </a>
        <div className="hidden md:flex gap-6 text-[14px] font-medium text-[color:var(--soft)]">
          <a href="#compare" className="hover:text-[var(--cream)] transition-colors">{t("vs Lindy", "vs Lindy")}</a>
          <a href="#verticals" className="hover:text-[var(--cream)] transition-colors">{t("Verticals", "Industrias")}</a>
          <a href="#how" className="hover:text-[var(--cream)] transition-colors">{t("How it works", "Cómo funciona")}</a>
          <a href="#latino" className="hover:text-[var(--cream)] transition-colors">{t("Level the field", "Nivela el campo")}</a>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex gap-px rounded-lg p-0.5" style={{ background: "var(--rule)" }}>
            {(["en", "es"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className="font-mono text-[11px] tracking-[.06em] px-2.5 py-1 rounded-md transition-colors"
                style={{
                  background: lang === l ? "rgba(244,237,227,.1)" : "transparent",
                  color: lang === l ? "var(--cream)" : "rgba(244,237,227,.45)",
                  fontWeight: lang === l ? 600 : 400,
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <a
            href="https://wa.me/17878100749"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-[14px] font-bold text-white transition-transform hover:-translate-y-px"
            style={{ background: "var(--coral)", boxShadow: "0 4px 20px rgba(232,65,24,.3)" }}
          >
            {t("Start free trial →", "Prueba gratis →")}
          </a>
        </div>
      </div>
    </nav>
  );
}