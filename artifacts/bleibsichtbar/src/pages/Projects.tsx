import React, { useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useGetProjects } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedHeroBackground, heroFadeUp } from "@/components/shared/AnimatedHero";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

// ─── Category Detection ────────────────────────────────────────────────────────
const SOCIAL_RE = /social.?media|instagram|tiktok|linkedin|content|reels?|stories/i;
const WEB_RE    = /websei?ten?|web.?design|e.?commerce|webseite|online.?shop|app|landing/i;

type ProjectType = "social" | "web" | "standard";

function getType(cat: string): ProjectType {
  if (SOCIAL_RE.test(cat)) return "social";
  if (WEB_RE.test(cat))    return "web";
  return "standard";
}

// ─── Phone Frame ──────────────────────────────────────────────────────────────
function PhoneFrame({ src, alt }: { src?: string; alt: string }) {
  return (
    <div className="flex items-end justify-center h-full py-4">
      <div className="relative w-[140px] shrink-0">
        <div className="relative bg-gray-900 rounded-[2.2rem] p-1.5 shadow-2xl border-[6px] border-gray-800 ring-1 ring-white/10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-gray-900 rounded-b-2xl z-10" />
          <div className="rounded-[1.5rem] overflow-hidden" style={{ aspectRatio: "9/16" }}>
            {src ? (
              <img src={src} alt={alt} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-gray-500 text-xs">Kein Bild</div>
            )}
          </div>
          <div className="flex justify-center py-1.5">
            <div className="w-10 h-0.5 bg-gray-600 rounded-full" />
          </div>
        </div>
        <div className="absolute -inset-4 bg-accent/10 rounded-[3rem] blur-2xl -z-10" />
      </div>
    </div>
  );
}

// ─── Monitor Frame ─────────────────────────────────────────────────────────────
function MonitorFrame({ src, alt }: { src?: string; alt: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-4">
      <div className="relative w-full max-w-[280px]">
        <div className="bg-gray-800 rounded-xl p-[6px] shadow-2xl border border-gray-700 ring-1 ring-white/10">
          <div className="flex items-center gap-1.5 px-2 py-1.5 bg-gray-900 rounded-t-lg">
            {["#ff5f57","#ffbd2e","#28c840"].map(c => (
              <div key={c} className="w-2 h-2 rounded-full" style={{ background: c }} />
            ))}
            <div className="flex-1 mx-2 h-3 bg-gray-700/60 rounded-full text-[7px] text-gray-500 flex items-center justify-center overflow-hidden px-2 truncate">
              {alt.toLowerCase().replace(/[^a-z0-9]+/g,"-")}.de
            </div>
          </div>
          <div className="rounded-b-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
            {src ? (
              <img src={src} alt={alt} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-gray-500 text-xs">Kein Bild</div>
            )}
          </div>
        </div>
        <div className="flex justify-center mt-0.5">
          <div className="w-12 h-3 bg-gray-700 rounded-b-sm" />
        </div>
        <div className="flex justify-center">
          <div className="w-20 h-1.5 bg-gray-600 rounded-full mt-0.5" />
        </div>
        <div className="absolute -inset-4 bg-blue-500/10 rounded-2xl blur-2xl -z-10" />
      </div>
    </div>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, index }: { project: any; index: number }) {
  const type = getType(project.category ?? "");

  if (type === "social") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ delay: index * 0.07, duration: 0.5 }}
        className="group bg-gradient-to-br from-gray-900 via-[#0a1628] to-gray-900 rounded-3xl overflow-hidden border border-white/10 hover:border-accent/40 shadow-lg hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500"
      >
        <div className="h-52 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-pink-900/20 to-orange-900/30" />
          <div className="absolute top-3 right-3 bg-accent/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10">{project.category}</div>
          <PhoneFrame src={project.imageUrl} alt={project.title} />
        </div>
        <div className="p-6">
          <h3 className="text-lg font-display font-bold text-white mb-1 group-hover:text-accent transition-colors line-clamp-1">{project.title}</h3>
          {project.clientName && <p className="text-white/50 text-xs font-medium mb-3">{project.clientName}</p>}
          <p className="text-white/60 text-sm line-clamp-2 leading-relaxed">{project.description}</p>
        </div>
      </motion.div>
    );
  }

  if (type === "web") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ delay: index * 0.07, duration: 0.5 }}
        className="group bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-3xl overflow-hidden border border-gray-200 hover:border-blue-300/60 shadow-md hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
      >
        <div className="h-52 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-100 to-blue-50">
          <div className="absolute top-3 right-3 bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10">{project.category}</div>
          <MonitorFrame src={project.imageUrl} alt={project.title} />
        </div>
        <div className="p-6">
          <h3 className="text-lg font-display font-bold mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{project.title}</h3>
          {project.clientName && <p className="text-muted-foreground text-xs font-medium mb-3">{project.clientName}</p>}
          <p className="text-foreground/60 text-sm line-clamp-2 leading-relaxed">{project.description}</p>
        </div>
      </motion.div>
    );
  }

  // Standard card
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
      className="group rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-500 bg-white"
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
        {project.imageUrl ? (
          <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Kein Bild</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold px-2.5 py-1 rounded-full">
          {project.category}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-display font-bold mb-1 group-hover:text-accent transition-colors line-clamp-1">{project.title}</h3>
        {project.clientName && <p className="text-muted-foreground text-xs font-medium mb-3">{project.clientName}</p>}
        <p className="text-foreground/60 text-sm line-clamp-2 leading-relaxed">{project.description}</p>
      </div>
    </motion.div>
  );
}

// ─── Filter Tabs ──────────────────────────────────────────────────────────────
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Projects() {
  const { data: projects = [], isLoading } = useGetProjects({ published: true });
  const [activeFilter, setActiveFilter] = useState<Filter>("Alle");

  const filtered = projects.filter(p => matchesFilter(p, activeFilter));

  return (
    <PublicLayout>
      {/* HERO */}
      <section className="relative bg-primary text-white overflow-hidden pt-32 pb-20">
        <AnimatedHeroBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div custom={0} variants={heroFadeUp} initial="hidden" animate="visible">
            <span className="inline-block bg-white/10 border border-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6 tracking-wide">
              Unsere Arbeit
            </span>
          </motion.div>
          <motion.h1 custom={1} variants={heroFadeUp} initial="hidden" animate="visible"
            className="text-5xl md:text-7xl font-display font-bold mb-5 leading-tight">
            Unsere <span className="text-accent">Projekte</span>
          </motion.h1>
          <motion.p custom={2} variants={heroFadeUp} initial="hidden" animate="visible"
            className="text-xl text-white/75 max-w-xl mx-auto">
            Einblicke in erfolgreiche Kundenprojekte – von Social Media bis Webdesign.
          </motion.p>
        </div>
      </section>

      {/* FILTER TABS */}
      <section className="sticky top-16 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-100 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {FILTERS.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeFilter === filter
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 text-foreground/70 hover:bg-gray-200"
                }`}
              >
                {activeFilter === filter && (
                  <motion.div layoutId="filter-pill" className="absolute inset-0 bg-primary rounded-full -z-10" />
                )}
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS GRID */}
      <section className="py-16 min-h-[50vh] bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="animate-pulse bg-white rounded-3xl overflow-hidden border border-gray-100">
                  <div className="h-52 bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center text-muted-foreground py-20">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-lg font-medium">Keine Projekte in dieser Kategorie.</p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      <section className="py-20 bg-primary text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Ihr Projekt als nächstes?
          </h2>
          <p className="text-white/75 mb-8">Lassen Sie uns gemeinsam etwas Großartiges schaffen.</p>
          <Button asChild size="lg" className="rounded-full px-8 bg-accent hover:bg-accent/90 font-bold">
            <Link href="/kontakt">Jetzt Kontakt aufnehmen <ArrowRight className="ml-2 w-5 h-5 inline" /></Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}
