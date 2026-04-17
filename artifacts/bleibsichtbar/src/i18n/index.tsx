import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { translations, LangKey, Translations } from "./translations";

export type LangOption = "de" | "en" | "nl-be" | "fr" | "nl-nl";

const LANG_MAP: Record<LangOption, LangKey> = {
  de: "de",
  en: "en",
  "nl-be": "nl",
  fr: "fr",
  "nl-nl": "nl",
};

interface LangContextValue {
  lang: LangOption;
  setLang: (l: LangOption) => void;
  t: Translations;
}

const LangContext = createContext<LangContextValue>({
  lang: "de",
  setLang: () => {},
  t: translations.de,
});

function getInitialLang(): LangOption {
  try {
    const stored = localStorage.getItem("bs-lang") as LangOption | null;
    if (stored && LANG_MAP[stored]) return stored;
  } catch {}
  return "de";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangOption>(getInitialLang);

  const setLang = useCallback((l: LangOption) => {
    setLangState(l);
    try { localStorage.setItem("bs-lang", l); } catch {}
  }, []);

  const t = translations[LANG_MAP[lang]];

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useT() {
  return useContext(LangContext);
}
