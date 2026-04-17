import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useT, LangOption } from "@/i18n";

interface LangDef {
  code: LangOption;
  flag: string;
  label: string;
  short: string;
}

const LANGS: LangDef[] = [
  { code: "de",    flag: "🇩🇪", label: "Deutsch",    short: "DE" },
  { code: "en",    flag: "🇬🇧", label: "English",    short: "EN" },
  { code: "nl-be", flag: "🇧🇪", label: "Nederlands", short: "NL" },
  { code: "fr",    flag: "🇫🇷", label: "Français",   short: "FR" },
  { code: "nl-nl", flag: "🇳🇱", label: "Nederlands", short: "NL" },
];

export function LanguageSwitcher() {
  const { lang, setLang } = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGS.find(l => l.code === lang) ?? LANGS[0];

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold text-foreground/70 hover:text-foreground hover:bg-gray-100 transition-all duration-200 select-none border border-transparent hover:border-gray-200"
        aria-label="Select language"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="text-xs font-bold tracking-wide">{current.short}</span>
        <ChevronDown
          className="w-3 h-3 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-2 z-[200] min-w-[160px] overflow-hidden rounded-2xl shadow-2xl"
            style={{
              background: "linear-gradient(145deg, #0c1a36 0%, #0e2050 100%)",
              border: "1px solid rgba(255,255,255,0.10)",
              boxShadow: "0 20px 48px rgba(0,0,0,0.5)",
            }}
          >
            <div className="p-1.5">
              {LANGS.map(l => {
                const isActive = l.code === lang;
                return (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group"
                    style={{
                      background: isActive ? "rgba(255,107,53,0.15)" : "transparent",
                    }}
                    onMouseEnter={e => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                    }}
                    onMouseLeave={e => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent";
                    }}
                  >
                    <span className="text-lg leading-none">{l.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs font-black tracking-widest uppercase"
                          style={{ color: isActive ? "#ff6b35" : "rgba(255,255,255,0.8)" }}
                        >
                          {l.short}
                        </span>
                        {l.code === "nl-be" && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
                            style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}>
                            BE
                          </span>
                        )}
                        {l.code === "nl-nl" && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
                            style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}>
                            NL
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>
                        {l.label}
                      </div>
                    </div>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#ff6b35" }} />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
