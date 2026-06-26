"use client";
import React, { createContext, useContext, useState } from "react";

export type Lang = "th" | "en";

interface LangContextType {
  lang: Lang;
  toggle: () => void;
  t: (en: string, th: string) => string;
}

const LangContext = createContext<LangContextType>({
  lang: "th",
  toggle: () => {},
  t: (_en, th) => th,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("th");
  const toggle = () => setLang((l) => (l === "th" ? "en" : "th"));
  const t = (en: string, th: string) => (lang === "en" ? en : th);
  return (
    <LangContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
