import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type Lang = "en" | "es";
type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: <T,>(en: T, es: T) => T };

const STORAGE_KEY = "agente-lang";
const COOKIE_KEY = "agente-lang";
const SYNC_EVENT = "agente-lang-change";

const I18nCtx = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (en) => en });

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : null;
}

function detectInitialLang(): Lang {
  if (typeof window === "undefined") return "en"; // SSR — hydration will reconcile
  try {
    const stored = localStorage.getItem(STORAGE_KEY) ?? readCookie(COOKIE_KEY);
    if (stored === "en" || stored === "es") return stored;
  } catch {}
  const nav = (typeof navigator !== "undefined" ? navigator.language : "en").toLowerCase();
  return nav.startsWith("es") ? "es" : "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  // SSR-safe: server renders "en"; client immediately reconciles in the first effect
  // without a hydration mismatch because state changes after mount.
  const [lang, setLangState] = useState<Lang>("en");

  // Hydrate from storage/cookie/navigator on mount
  useEffect(() => {
    const detected = detectInitialLang();
    setLangState((prev) => (prev === detected ? prev : detected));
  }, []);

  // Keep <html lang="…"> attribute AND OpenGraph locale meta in sync.
  // Social crawlers (Facebook, LinkedIn, Slack) read og:locale to pick
  // which translation to render; flipping it on language change keeps
  // shares from a Spanish-speaking visitor advertising as en_US.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    const ogLocale = lang === "es" ? "es_US" : "en_US";
    const ogAlternate = lang === "es" ? "en_US" : "es_US";
    const setMeta = (property: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(
        `meta[property="${property}"]`,
      );
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setMeta("og:locale", ogLocale);
    setMeta("og:locale:alternate", ogAlternate);
  }, [lang]);

  // Cross-tab + same-tab sync. Other tabs fire `storage`; same-tab consumers
  // (e.g., multiple providers) get a custom event so they update without reload.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === "en" || e.newValue === "es")) {
        setLangState(e.newValue);
      }
    };
    const onCustom = (e: Event) => {
      const next = (e as CustomEvent<Lang>).detail;
      if (next === "en" || next === "es") setLangState(next);
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(SYNC_EVENT, onCustom as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(SYNC_EVENT, onCustom as EventListener);
    };
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
      // 1-year cookie so future SSR/middleware can read it if needed
      document.cookie = `${COOKIE_KEY}=${l}; Path=/; Max-Age=31536000; SameSite=Lax`;
      window.dispatchEvent(new CustomEvent<Lang>(SYNC_EVENT, { detail: l }));
    } catch {}
  }, []);

  const t = <T,>(en: T, es: T): T => (lang === "es" ? es : en);

  return <I18nCtx.Provider value={{ lang, setLang, t }}>{children}</I18nCtx.Provider>;
}

export const useI18n = () => useContext(I18nCtx);