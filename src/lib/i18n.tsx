import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Lang = "en" | "es";
type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: <T,>(en: T, es: T) => T };

const I18nCtx = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (en) => en });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("agente-lang") : null;
    if (stored === "en" || stored === "es") {
      setLangState(stored);
    } else if (typeof navigator !== "undefined") {
      const nav = (navigator.language || "en").toLowerCase();
      setLangState(nav.startsWith("es") ? "es" : "en");
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("agente-lang", l); } catch {}
  };

  const t = <T,>(en: T, es: T): T => (lang === "es" ? es : en);

  return <I18nCtx.Provider value={{ lang, setLang, t }}>{children}</I18nCtx.Provider>;
}

export const useI18n = () => useContext(I18nCtx);