"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { strings, type Lang } from "./strings";

type LanguageCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: typeof strings[Lang];
};

const LanguageContext = createContext<LanguageCtx>({
  lang: "en",
  setLang: () => {},
  t: strings.en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("hl-lang") as Lang | null;
    if (saved === "en" || saved === "am") setLangState(saved);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("hl-lang", l);
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: strings[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
