import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { VERTICALS } from "@/lib/verticals";
import { demoUrl } from "@/lib/demo-link";

export function SiteFooter() {
  const { t, lang } = useI18n();
  return (
    <footer className="border-t border-[var(--rule)] pt-12 pb-8" data-cta-location="site-footer">
      <div className="max-w-[1100px] mx-auto px-7 flex flex-wrap justify-between gap-10">
        <div className="max-w-[30ch]">
          <div className="font-extrabold text-[19px] tracking-[-0.02em] text-[var(--cream)] mb-2.5">
            Agente<span className="text-[var(--coral)]">.</span>Systems
          </div>
          <p className="text-[13px] leading-[1.6]" style={{ color: "var(--softer)" }}>
            {t(
              "The bilingual AI agent platform for real estate, construction, medical, beauty, and solar. A JCB Industries product. Built in Puerto Rico.",
              "La plataforma bilingüe de agentes IA para bienes raíces, construcción, medicina, belleza y solar. Un producto de JCB Industries. Hecho en Puerto Rico."
            )}
          </p>
        </div>
        <FCol title={t("Verticals", "Industrias")}>
          {VERTICALS.map((v) => (
            <Link key={v.path} to={v.path}>
              {t(`${v.suffix} · ${v.persona}`, `${v.suffix} · ${v.persona}`)}
            </Link>
          ))}
        </FCol>
        <FCol title={t("Compare", "Comparar")}>
          <a href="#compare">{t("Agente vs Lindy", "Agente vs Lindy")}</a>
          <a href="#how">{t("How it works", "Cómo funciona")}</a>
          <a href="#latino">{t("Level the field", "Nivela el campo")}</a>
        </FCol>
        <FCol title={t("Start free", "Empieza gratis")}>
          <a href={demoUrl(lang)}>WhatsApp · +1 787-810-0749</a>
          <a href="https://agentepr.com">agentepr.com</a>
        </FCol>
      </div>
      <div className="max-w-[1100px] mx-auto mt-7 px-7 pt-4 border-t border-[var(--rule)] flex justify-between flex-wrap gap-2 font-mono text-[11px]" style={{ color: "var(--softer)" }}>
        <span>© 2026 Agente · JCB Industries LLC · 7 Calle 1 Ste 204 · Guaynabo, PR 00968</span>
        <span>🌴 {t("Built in Puerto Rico", "Hecho en Puerto Rico")}</span>
      </div>
    </footer>
  );
}

function FCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-mono text-[11px] tracking-[.1em] uppercase mb-3.5" style={{ color: "var(--softer)" }}>{title}</h4>
      <div className="flex flex-col gap-1 text-[14px]" style={{ color: "rgba(244,237,227,.4)" }}>
        {children}
      </div>
    </div>
  );
}