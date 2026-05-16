import { Link, useRouterState } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { RobotLogo } from "./RobotLogo";
import { VERTICALS, suffixForPath } from "@/lib/verticals";

/**
 * Site-wide sticky nav.
 *
 * The wordmark renders `Agente.<suffix>`, where `<suffix>` is derived from
 * the current pathname via `suffixForPath`: e.g. `RealEstate` on
 * `/real-estate`, `Construction` on `/construction`, and the fallback
 * `Systems` on `/` and any non-vertical route. This makes each vertical
 * page visually self-identify in the header instead of always showing
 * `Agente.Systems`.
 */
export function SiteNav() {
  const { lang, setLang, t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const suffix = suffixForPath(pathname);

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-md border-b border-[var(--rule)] px-5 md:px-7 py-[13px] md:py-[15px]"
      style={{ background: "rgba(13,27,34,.94)" }}
    >
      <div className="max-w-[1100px] mx-auto flex items-center justify-between gap-4 leading-none">
        <Link
          to="/"
          className="flex items-center gap-2 font-extrabold text-[19px] leading-none text-[var(--cream)]"
          style={{ letterSpacing: "-0.035em" }}
        >
          <RobotLogo />
          <span className="inline-flex items-baseline">
            Agente<span className="text-[var(--coral)] mx-[-0.5px]">.</span>
            {suffix}
          </span>
        </Link>
        <div
          className="hidden md:flex gap-5 text-[14px] font-semibold leading-none text-[color:var(--soft)]"
          style={{ letterSpacing: "-0.025em" }}
        >
          {VERTICALS.map((v) => {
            const isActive = pathname === v.path;
            return (
              <Link
                key={v.path}
                to={v.path}
                className="transition-colors"
                style={{ color: isActive ? "var(--cream)" : undefined }}
                activeProps={{ style: { color: "var(--cream)" } }}
              >
                Agente
                <span className="text-[var(--coral)] mx-[-0.5px]">.</span>
                {v.suffix}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-2 md:gap-2.5">
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
            className="inline-flex items-center gap-2 px-3.5 md:px-5 py-2 md:py-2.5 rounded-[10px] text-[13px] md:text-[14px] font-bold text-white transition-transform hover:-translate-y-px whitespace-nowrap"
            style={{ background: "var(--coral)", boxShadow: "0 4px 20px rgba(232,65,24,.3)" }}
          >
            <span className="hidden sm:inline">{t("Start free trial →", "Prueba gratis →")}</span>
            <span className="sm:hidden">{t("Try free →", "Prueba →")}</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
