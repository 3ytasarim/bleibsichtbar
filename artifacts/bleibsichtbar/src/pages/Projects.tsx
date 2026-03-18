import React, { useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useGetProjects } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedHeroBackground, heroFadeUp } from "@/components/shared/AnimatedHero";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, ExternalLink, Folder } from "lucide-react";

const SOCIAL_RE = /social.?media|instagram|tiktok|linkedin|content|reels?|stories/i;
const WEB_RE    = /websei?ten?|web.?design|e.?commerce|webseite|online.?shop|app|landing/i;

type ProjectType = "social" | "web" | "standard";
function getType(cat: string): ProjectType {
  if (SOCIAL_RE.test(cat)) return "social";
  if (WEB_RE.test(cat))    return "web";
  return "standard";
}

const ACCENT_COLORS: Record<ProjectType, { bg: string; text: string; border: string }> = {
  social: { bg: "bg-pink-500/90", text: "text-white", border: "hover:border-pink-400/50" },
  web:    { bg: "bg-blue-500/90", text: "text-white", border: "hover:border-blue-400/50" },
  standard: { bg: "bg-accent/90", text: "text-white", border: "hover:border-accent/50" },
};

function ProjectCard({ project, index }: { project: any; index: number }) {
  const type = getType(project.category ?? "");
  const colors = ACCENT_COLORS[type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, transition: { type: "spring", stiffness: 280, damping: 22 } }}
      className={`group relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-500 ${colors.border}`}
    >
      {/* Image area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-3">
            <Folder className="w-12 h-12" />
            <span className="text-sm text-gray-400">Kein Bild</span>
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        {/* Category badge */}
        <div className={`absolute top-3 left-3 ${colors.bg} ${colors.text} text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm shadow`}>
          {project.category}
        </div>

        {/* Hover CTA */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <div className="flex items-center gap-2 text-white text-sm font-semibold">
            <ExternalLink className="w-4 h-4" />
            <span>Projekt ansehen</span>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5">
        <h3 className="font-display font-bold text-base text-primary group-hover:text-accent transition-colors duration-300 line-clamp-1 mb-1">
          {project.title}
        </h3>
        {project.clientName && (
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">{project.clientName}</p>
        )}
        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{project.description}</p>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {project.tags.slice(0, 3).map((tag: string) => (
              <span key={tag} className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.04 }}
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent/50 to-transparent origin-left opacity-0 group-hover:opacity-100 transition-opacity"
      />
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

        {/* Decorative orbs */}
        <div className="absolute top-1/3 left-16 w-72 h-72 rounded-full bg-accent/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-24 w-64 h-64 rounded-full bg-blue-500/10 blur-[80px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div custom={0} variants={heroFadeUp} initial="hidden" animate="visible">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-semibold px-5 py-2 rounded-full mb-7 tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Unsere Arbeit
            </span>
          </motion.div>

          <motion.h1
            custom={1} variants={heroFadeUp} initial="hidden" animate="visible"
            className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight"
          >
            Unsere <span className="text-accent">Projekte</span>
          </motion.h1>

          <motion.p
            custom={2} variants={heroFadeUp} initial="hidden" animate="visible"
            className="text-xl text-white/65 max-w-xl mx-auto mb-12"
          >
            Einblicke in erfolgreiche Kundenprojekte — von Social Media bis Webdesign.
          </motion.p>

          {/* Stats row */}
          <motion.div
            custom={3} variants={heroFadeUp} initial="hidden" animate="visible"
            className="flex flex-wrap justify-center gap-8 md:gap-16"
          >
            {[
              { value: "50+", label: "Projekte" },
              { value: "4.9★", label: "Kundenbewertung" },
              { value: "3+", label: "Jahre Erfahrung" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black text-accent">{stat.value}</div>
                <div className="text-white/50 text-sm mt-0.5">{stat.label}</div>
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
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-250 ${
                  activeFilter === filter
                    ? "text-white shadow-md shadow-primary/20"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-primary"
                }`}
              >
                {activeFilter === filter && (
                  <motion.div
                    layoutId="filter-pill"
                    className="absolute inset-0 bg-primary rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {filter}
                {activeFilter === filter && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="ml-1.5 inline-flex items-center justify-center w-4 h-4 bg-white/20 rounded-full text-[10px] font-black"
                  >
                    {filtered.length}
                  </motion.span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS GRID */}
      <section className="py-14 min-h-[50vh] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="animate-pulse bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                  <div className="aspect-[4/3] bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                    <div className="h-3 bg-gray-200 rounded-full w-1/2" />
                    <div className="h-3 bg-gray-200 rounded-full w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-28"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Folder className="w-9 h-9 text-gray-400" />
              </div>
              <h3 className="text-xl font-display font-bold text-gray-500 mb-2">Keine Projekte gefunden</h3>
              <p className="text-gray-400 text-sm">In dieser Kategorie sind aktuell keine Projekte vorhanden.</p>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
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
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/3 w-80 h-80 rounded-full bg-accent/20 blur-[100px] pointer-events-none"
        />
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.14 } } }}
          >
            <motion.p
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
              className="text-accent font-bold text-sm tracking-widest uppercase mb-4"
            >
              Ihr Projekt als nächstes?
            </motion.p>
            <motion.h2
              variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="text-3xl md:text-5xl font-display font-bold text-white mb-5 leading-tight"
            >
              Lassen Sie uns etwas{" "}
              <span className="text-accent">Großartiges</span> schaffen.
            </motion.h2>
            <motion.p
              variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
              className="text-white/55 text-lg mb-10"
            >
              Wir freuen uns auf Ihr Projekt — egal ob Social Media, Webseite oder Marketing.
            </motion.p>
            <motion.div
              variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } }}
            >
              <div className="relative inline-block">
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.35, 0, 0.35] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full bg-accent/40"
                />
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
