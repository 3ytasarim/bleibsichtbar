import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useT, LangOption } from "@/i18n";

const FlagDE = () => (
  <svg viewBox="0 0 5 3" className="w-5 rounded-sm shrink-0" style={{ height: 14 }}>
    <rect width="5" height="1" fill="#000"/>
    <rect y="1" width="5" height="1" fill="#DD0000"/>
    <rect y="2" width="5" height="1" fill="#FFCE00"/>
  </svg>
);

const FlagGB = () => (
  <svg viewBox="0 0 60 30" className="w-5 rounded-sm shrink-0" style={{ height: 14 }}>
    <rect width="60" height="30" fill="#012169"/>
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4"/>
    <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10"/>
    <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6"/>
  </svg>
);

const FlagBE = () => (
  <svg viewBox="0 0 3 2" className="w-5 rounded-sm shrink-0" style={{ height: 14 }}>
    <rect width="1" height="2" fill="#000"/>
    <rect x="1" width="1" height="2" fill="#FAE042"/>
    <rect x="2" width="1" height="2" fill="#EF3340"/>
  </svg>
);

const FlagFR = () => (
  <svg viewBox="0 0 3 2" className="w-5 rounded-sm shrink-0" style={{ height: 14 }}>
    <rect width="1" height="2" fill="#002395"/>
    <rect x="1" width="1" height="2" fill="#fff"/>
    <rect x="2" width="1" height="2" fill="#ED2939"/>
  </svg>
);

const FlagNL = () => (
  <svg viewBox="0 0 3 2" className="w-5 rounded-sm shrink-0" style={{ height: 14 }}>
    <rect width="3" height="0.667" fill="#AE1C28"/>
    <rect y="0.667" width="3" height="0.667" fill="#fff"/>
    <rect y="1.333" width="3" height="0.667" fill="#21468B"/>
  </svg>
);

interface LangDef {
  code: LangOption;
  Flag: () => React.ReactElement;
  short: string;
  badge?: string;
}

const LANGS: LangDef[] = [
  { code: "de",    Flag: FlagDE, short: "DE" },
  { code: "en",    Flag: FlagGB, short: "EN" },
  { code: "nl-be", Flag: FlagBE, short: "NL", badge: "BE" },
  { code: "fr",    Flag: FlagFR, short: "FR" },
  { code: "nl-nl", Flag: FlagNL, short: "NL", badge: "NL" },
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
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-foreground/70 hover:text-foreground hover:bg-gray-100 transition-all duration-200 select-none border border-transparent hover:border-gray-200"
        aria-label="Select language"
      >
        <current.Flag />
        <span className="text-xs font-bold tracking-wide">{current.short}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-2 z-[200] overflow-hidden rounded-2xl shadow-2xl"
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
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-150"
                    style={{ background: isActive ? "rgba(255,107,53,0.15)" : "transparent" }}
                    onMouseEnter={e => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                    }}
                    onMouseLeave={e => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent";
                    }}
                  >
                    <l.Flag />
                    <span
                      className="text-xs font-black tracking-widest uppercase"
                      style={{ color: isActive ? "#ff6b35" : "rgba(255,255,255,0.8)" }}
                    >
                      {l.short}
                    </span>
                    {l.badge && (
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
                        style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}
                      >
                        {l.badge}
                      </span>
                    )}
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#ff6b35" }} />
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
