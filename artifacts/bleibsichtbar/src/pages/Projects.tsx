import React, { useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useGetProjects } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedHeroBackground, heroFadeUp } from "@/components/shared/AnimatedHero";
import { CtaBanner } from "@/components/shared/CtaBanner";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Globe, Folder } from "lucide-react";

const SOCIAL_RE = /social.?media|instagram|tiktok|linkedin|content|reels?|stories/i;
const WEB_RE    = /websei?ten?|web.?design|e.?commerce|webseite|online.?shop|app|landing/i;

type ProjectType = "social" | "web" | "standard";
function getType(cat: string): ProjectType {
  if (SOCIAL_RE.test(cat)) return "social";
  if (WEB_RE.test(cat))    return "web";
  return "standard";
}

const PALETTES = [
  "#1a56db",
  "#f97316",
  "#7c3aed",
  "#0891b2",
  "#16a34a",
  "#dc2626",
  "#0a1628",
  "#b45309",
];

function PhoneMockup({ src, alt }: { src?: string; alt: string }) {
  return (
    <div className="relative" style={{ width: 148 }}>
      <div
        className="relative rounded-[2.6rem] bg-[#111] border border-white/10"
        style={{ padding: 5, boxShadow: "0 32px 64px rgba(0,0,0,0.55)" }}
      >
        {/* Volume buttons */}
        <div className="absolute -left-[3px] top-20 w-[3px] h-6 bg-[#333] rounded-l-full" />
        <div className="absolute -left-[3px] top-28 w-[3px] h-9 bg-[#333] rounded-l-full" />
        <div className="absolute -left-[3px] top-40 w-[3px] h-9 bg-[#333] rounded-l-full" />
        <div className="absolute -right-[3px] top-32 w-[3px] h-12 bg-[#333] rounded-r-full" />
        {/* Screen */}
        <div
          className="rounded-[2.1rem] overflow-hidden bg-black relative"
          style={{ width: 138, height: 290 }}
        >
          {/* Dynamic Island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-14 h-5 bg-black rounded-full z-30" />
          {src ? (
            <img src={src} alt={alt} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <Globe className="w-8 h-8 text-gray-600" />
            </div>
          )}
          {/* Screen glare */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent pointer-events-none" />
        </div>
        {/* Home bar */}
        <div className="flex justify-center pt-1.5 pb-0.5">
          <div className="w-11 h-[3px] bg-[#444] rounded-full" />
        </div>
      </div>
    </div>
  );
}

function BrowserMockup({ src, alt }: { src?: string; alt: string }) {
  const slug = alt.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div className="relative" style={{ width: 190 }}>
      <div
        className="rounded-xl bg-[#1a1a1a] border border-white/10 overflow-hidden"
        style={{ boxShadow: "0 32px 64px rgba(0,0,0,0.5)" }}
      >
        <div className="flex items-center gap-1.5 px-3 py-2 bg-[#111]">
          {["#ff5f57", "#ffbd2e", "#28c840"].map(c => (
            <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
          ))}
          <div className="flex-1 mx-2 h-3.5 bg-[#2a2a2a] rounded-full text-[7px] text-gray-500 flex items-center justify-center px-2 overflow-hidden truncate">
            {slug}.de
          </div>
        </div>
        <div className="overflow-hidden" style={{ aspectRatio: "4/3" }}>
          {src ? (
            <img src={src} alt={alt} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
              <Globe className="w-8 h-8 text-gray-600" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: any; index: number }) {
  const type = getType(project.category ?? "");
  const accent = PALETTES[index % PALETTES.length];
  const isWeb = type === "web";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay: index * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
      style={{ paddingTop: 72 }} /* room for device to extend above */
    >
      {/* Device mockup — absolute, sticks up above the colored card */}
      <div
        className="absolute z-20"
        style={{
          top: 0,
          left: isWeb ? 14 : 22,
          transform: `rotate(${isWeb ? -5 : -8}deg)`,
          filter: "drop-shadow(0 28px 56px rgba(0,0,0,0.38))",
        }}
      >
        {isWeb ? (
          <BrowserMockup src={project.imageUrl} alt={project.title} />
        ) : (
          <PhoneMockup src={project.imageUrl} alt={project.title} />
        )}
      </div>

      {/* Colored pill card */}
      <motion.div
        whileHover={{ scale: 1.015, transition: { type: "spring", stiffness: 280, damping: 22 } }}
        className="relative rounded-[28px] overflow-hidden"
        style={{
          marginLeft: isWeb ? 92 : 100,
          minHeight: 248,
          background: accent,
        }}
      >
        {/* Subtle inner glow top-right */}
        <div
          className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: "rgba(255,255,255,0.08)", filter: "blur(40px)", transform: "translate(30%, -30%)" }}
        />

        {/* Category badge — top right */}
        <div className="absolute top-4 right-4 bg-black/25 backdrop-blur-sm text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/15">
          {project.category}
        </div>

        {/* Content — left padding to clear the phone overlap */}
        <div
          className="flex flex-col justify-center items-center text-center px-6 py-9"
          style={{ paddingLeft: isWeb ? 124 : 96, minHeight: 248 }}
        >
          <h3 className="text-xl md:text-2xl font-display font-black text-white leading-tight mb-1">
            {project.title}
          </h3>
          {project.clientName && (
            <p className="text-white/60 text-sm mb-5">{project.clientName}</p>
          )}
          {!project.clientName && <div className="mb-5" />}

          <Link href={`/projekte/${project.id}`}>
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block bg-black text-white text-xs font-black px-7 py-2.5 rounded-full uppercase tracking-widest shadow-lg hover:bg-gray-900 transition-colors cursor-pointer"
            >
              Ansehen →
            </motion.span>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

const FILTERS = ["Alle", "Social Media", "Webseiten", "Content", "Fotografie", "Sonstiges"] as const;
type Filter = (typeof FILTERS)[number];

function matchesFilter(project: any, filter: Filter): boolean {
  if (filter === "Alle") return true;
  const cat = project.category ?? "";
  if (filter === "Social Media") return /social.?media|instagram|tiktok|linkedin/i.test(cat);
  if (filter === "Webseiten")    return WEB_RE.test(cat);
  if (filter === "Content")      return /content/i.test(cat);
  if (filter === "Fotografie")   return /fotografie|photo|food|report/i.test(cat);
  return !/social.?media|instagram|tiktok|linkedin|content|websei?ten?|web.?design|e.?commerce|fotografie|food|report/i.test(cat);
}

export default function Projects() {
  const { data: projects = [], isLoading } = useGetProjects({ published: true });
  const [activeFilter, setActiveFilter] = useState<Filter>("Alle");

  const filtered = projects.filter(p => matchesFilter(p, activeFilter));

  return (
    <PublicLayout>
      {/* HERO */}
      <section className="relative bg-primary text-white overflow-hidden pt-36 pb-24">
        <AnimatedHeroBackground />
        <div className="absolute top-1/3 left-16 w-72 h-72 rounded-full bg-accent/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-24 w-64 h-64 rounded-full bg-blue-500/10 blur-[80px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div custom={0} variants={heroFadeUp} initial="hidden" animate="visible">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-semibold px-5 py-2 rounded-full mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Unsere Arbeit
            </span>
          </motion.div>
          <motion.h1 custom={1} variants={heroFadeUp} initial="hidden" animate="visible"
            className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
            Unsere <span className="text-accent">Projekte</span>
          </motion.h1>
          <motion.p custom={2} variants={heroFadeUp} initial="hidden" animate="visible"
            className="text-xl text-white/65 max-w-xl mx-auto mb-12">
            Einblicke in erfolgreiche Kundenprojekte — von Social Media bis Webdesign.
          </motion.p>
          <motion.div custom={3} variants={heroFadeUp} initial="hidden" animate="visible"
            className="flex flex-wrap justify-center gap-10 md:gap-16">
            {[{ value: "50+", label: "Projekte" }, { value: "4.9★", label: "Kundenbewertung" }, { value: "3+", label: "Jahre Erfahrung" }].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-black text-accent">{s.value}</div>
                <div className="text-white/50 text-sm mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FILTER TABS */}
      <section className="sticky top-16 z-30 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-wrap gap-2 justify-center">
            {FILTERS.map(filter => (
              <button key={filter} onClick={() => setActiveFilter(filter)}
                className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-250 ${
                  activeFilter === filter ? "text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-primary"
                }`}>
                {activeFilter === filter && (
                  <motion.div layoutId="filter-pill" className="absolute inset-0 bg-primary rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS GRID */}
      <section className="py-20 min-h-[50vh] bg-white">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-14">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16 pt-10">
              {[1,2,3,4].map(i => (
                <div key={i} className="animate-pulse rounded-3xl bg-gray-100 h-60" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-center py-28">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Folder className="w-9 h-9 text-gray-400" />
              </div>
              <h3 className="text-xl font-display font-bold text-gray-500 mb-2">Keine Projekte gefunden</h3>
              <p className="text-gray-400 text-sm">In dieser Kategorie sind aktuell keine Projekte vorhanden.</p>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16 pt-8">
              <AnimatePresence mode="popLayout">
                {filtered.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      <CtaBanner
        label="Ihr Projekt als nächstes?"
        heading="Lassen Sie uns etwas"
        headingAccent="Großartiges schaffen."
        subtext="Kontaktieren Sie uns und wir zeigen Ihnen, wie wir Ihr Projekt zum Erfolg führen können."
        buttonText="Jetzt Kontakt aufnehmen"
        buttonHref="/kontakt"
      />
    </PublicLayout>
  );
}
