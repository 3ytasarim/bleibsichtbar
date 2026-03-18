import React, { useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useGetProjects } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedHeroBackground, heroFadeUp } from "@/components/shared/AnimatedHero";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, ExternalLink, Globe, Folder } from "lucide-react";

const SOCIAL_RE = /social.?media|instagram|tiktok|linkedin|content|reels?|stories/i;
const WEB_RE    = /websei?ten?|web.?design|e.?commerce|webseite|online.?shop|app|landing/i;

type ProjectType = "social" | "web" | "standard";
function getType(cat: string): ProjectType {
  if (SOCIAL_RE.test(cat)) return "social";
  if (WEB_RE.test(cat))    return "web";
  return "standard";
}

const CARD_PALETTES = [
  { accent: "#1a56db", lightBg: "#eff6ff", badgeBg: "#1a56db", shadow: "hover:shadow-blue-100" },
  { accent: "#f97316", lightBg: "#fff7ed", badgeBg: "#f97316", shadow: "hover:shadow-orange-100" },
  { accent: "#7c3aed", lightBg: "#f5f3ff", badgeBg: "#7c3aed", shadow: "hover:shadow-violet-100" },
  { accent: "#0891b2", lightBg: "#ecfeff", badgeBg: "#0891b2", shadow: "hover:shadow-cyan-100" },
  { accent: "#16a34a", lightBg: "#f0fdf4", badgeBg: "#16a34a", shadow: "hover:shadow-green-100" },
  { accent: "#dc2626", lightBg: "#fef2f2", badgeBg: "#dc2626", shadow: "hover:shadow-red-100" },
];

function PhoneMockupCard({ src, alt }: { src?: string; alt: string }) {
  return (
    <div
      className="relative w-[155px] shrink-0"
      style={{ transform: "rotate(-8deg)", filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.5))" }}
    >
      <div className="relative bg-[#111] rounded-[2.6rem] p-[5px] border border-white/10">
        {/* Side buttons */}
        <div className="absolute -left-[3px] top-20 w-[3px] h-7 bg-[#333] rounded-l-full" />
        <div className="absolute -left-[3px] top-32 w-[3px] h-10 bg-[#333] rounded-l-full" />
        <div className="absolute -left-[3px] top-44 w-[3px] h-10 bg-[#333] rounded-l-full" />
        <div className="absolute -right-[3px] top-36 w-[3px] h-14 bg-[#333] rounded-r-full" />

        <div className="rounded-[2.1rem] overflow-hidden relative bg-black" style={{ width: "145px", height: "295px" }}>
          {/* Dynamic Island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-black rounded-full z-30" />

          {src ? (
            <img src={src} alt={alt} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <Globe className="w-10 h-10 text-gray-600" />
            </div>
          )}
          {/* Glare */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Home bar */}
        <div className="flex justify-center pt-1.5 pb-0.5">
          <div className="w-12 h-[3px] bg-[#444] rounded-full" />
        </div>
      </div>
    </div>
  );
}

function BrowserMockupCard({ src, alt }: { src?: string; alt: string }) {
  const slug = alt.toLowerCase().replace(/[^a-z0-9]+/g,"-");
  return (
    <div
      className="relative w-[200px] shrink-0"
      style={{ transform: "rotate(-6deg)", filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.5))" }}
    >
      <div className="bg-[#1a1a1a] rounded-xl border border-white/10 overflow-hidden">
        {/* Browser chrome */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-[#111]">
          {["#ff5f57","#ffbd2e","#28c840"].map(c => (
            <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
          ))}
          <div className="flex-1 mx-2 h-4 bg-[#2a2a2a] rounded-full text-[8px] text-gray-500 flex items-center justify-center px-2 overflow-hidden">
            {slug}.de
          </div>
        </div>
        <div className="overflow-hidden" style={{ aspectRatio: "4/3" }}>
          {src ? (
            <img src={src} alt={alt} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
              <Globe className="w-10 h-10 text-gray-600" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: any; index: number }) {
  const type = getType(project.category ?? "");
  const palette = CARD_PALETTES[index % CARD_PALETTES.length];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { type: "spring", stiffness: 260, damping: 22 } }}
      className={`group relative bg-white rounded-3xl overflow-visible border border-gray-100 shadow-md ${palette.shadow} hover:shadow-xl transition-shadow duration-400 flex flex-row items-end min-h-[200px]`}
    >
      {/* Subtle tinted bg patch on right */}
      <div
        className="absolute right-0 top-0 bottom-0 w-2/3 rounded-r-3xl pointer-events-none"
        style={{ background: palette.lightBg }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-6 right-6 h-[3px] rounded-b-full"
        style={{ background: palette.accent }}
      />

      {/* Category badge – top right */}
      <div
        className="absolute top-4 right-4 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest z-10"
        style={{ background: palette.accent }}
      >
        {project.category}
      </div>

      {/* Device mockup – sticks out above */}
      <div className="shrink-0 pl-6 pb-0 flex items-end relative z-10" style={{ marginTop: "-32px" }}>
        {type === "web" ? (
          <BrowserMockupCard src={project.imageUrl} alt={project.title} />
        ) : (
          <PhoneMockupCard src={project.imageUrl} alt={project.title} />
        )}
      </div>

      {/* Info – right side */}
      <div className="flex flex-col justify-center flex-1 px-6 py-7 relative z-10 min-w-0">
        <h3 className="text-xl md:text-2xl font-display font-black text-primary leading-tight mb-1 truncate">
          {project.title}
        </h3>
        {project.clientName && (
          <p className="text-gray-500 text-sm font-medium mb-4 flex items-center gap-1.5 truncate">
            <Globe className="w-3 h-3 shrink-0" />
            {project.clientName}
          </p>
        )}
        {!project.clientName && <div className="mb-4" />}

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="self-start text-white text-sm font-bold px-6 py-2.5 rounded-full flex items-center gap-2 shadow-md transition-opacity hover:opacity-90"
          style={{ background: palette.accent }}
        >
          Ansehen <ExternalLink className="w-3.5 h-3.5" />
        </motion.button>
      </div>
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
      <section className="py-16 min-h-[50vh] bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              {[1,2,3,4].map(i => (
                <div key={i} className="animate-pulse bg-gray-200 rounded-3xl h-52" />
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
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
              <AnimatePresence mode="popLayout">
                {filtered.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden" style={{ background: "linear-gradient(135deg, #060f1e 0%, #0a1628 50%, #07111f 100%)" }}>
        <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/3 w-80 h-80 rounded-full bg-accent/20 blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.14 } } }}>
            <motion.p variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
              className="text-accent font-bold text-sm tracking-widest uppercase mb-4">
              Ihr Projekt als nächstes?
            </motion.p>
            <motion.h2 variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="text-3xl md:text-5xl font-display font-bold text-white mb-5 leading-tight">
              Lassen Sie uns etwas{" "}<span className="text-accent">Großartiges</span> schaffen.
            </motion.h2>
            <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } }}>
              <div className="relative inline-block">
                <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.35, 0, 0.35] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full bg-accent/40" />
                <Button asChild size="lg" className="relative rounded-full px-10 bg-accent hover:bg-accent/90 text-white font-bold text-lg shadow-2xl shadow-accent/30">
                  <Link href="/kontakt">Jetzt Kontakt aufnehmen <ArrowRight className="ml-2 w-5 h-5 inline" /></Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
