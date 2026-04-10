import React, { useState } from "react";
import { SeoHead } from "@/hooks/useSeoPage";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useGetProjects } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedHeroBackground, heroFadeUp } from "@/components/shared/AnimatedHero";
import { CtaBanner } from "@/components/shared/CtaBanner";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Globe, Folder, ShieldCheck, Mail } from "lucide-react";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

const PRIVATE_FILTERS = ["Social Media", "Webseiten", "Content"] as const;
type PrivateFilter = (typeof PRIVATE_FILTERS)[number];

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
  const placeholder = "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80&fit=crop";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/projekte/${project.id}`} className="block">
        <motion.div
          className="relative overflow-hidden group cursor-pointer"
          style={{ borderRadius: 20, aspectRatio: "4/5" }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        >
          {/* Cover image */}
          <img
            src={project.imageUrl || placeholder}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />

          {/* Base gradient always visible at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 to-transparent z-10 pointer-events-none" />

          {/* Hover full overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/45 to-black/0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Category badge — top left */}
          <div className="absolute top-4 left-4 z-30">
            <span className="bg-black/50 backdrop-blur-sm text-white/90 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/15">
              {project.category}
            </span>
          </div>

          {/* Arrow indicator — top right, visible on hover */}
          <div className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-accent flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
            <ArrowRight className="w-4 h-4 text-white" />
          </div>

          {/* Content — slides up on hover */}
          <div className="absolute inset-x-0 bottom-0 z-30 p-6">
            {/* Title always partially visible at base */}
            <h3
              className="text-xl font-display font-black text-white leading-tight mb-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
            >
              {project.title}
            </h3>

            {/* Client + CTA — hidden until hover */}
            <div className="overflow-hidden">
              <div className="translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-out delay-75">
                {project.clientName && (
                  <p className="text-white/65 text-sm mb-3">{project.clientName}</p>
                )}
                <div className="flex items-center gap-2 text-accent text-sm font-bold">
                  Projekt ansehen <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

const FILTERS = ["Alle", "Social Media", "Webseiten", "Content", "Fotografie"] as const;
type Filter = (typeof FILTERS)[number];

function matchesFilter(project: any, filter: Filter): boolean {
  if (filter === "Alle") return true;
  const cat = project.category ?? "";
  if (filter === "Social Media") return /social.?media|instagram|tiktok|linkedin/i.test(cat);
  if (filter === "Webseiten")    return WEB_RE.test(cat);
  if (filter === "Content")      return /content/i.test(cat);
  if (filter === "Fotografie")   return /fotografie|photo|food|report/i.test(cat);
  return false;
}

export default function Projects() {
  const { data: projects = [], isLoading } = useGetProjects({ published: true });
  const [activeFilter, setActiveFilter] = useState<Filter>("Alle");

  const filtered = projects.filter(p => matchesFilter(p, activeFilter));

  return (
    <PublicLayout>
      <SeoHead slug="projekte" defaults={{ metaTitle: "Unsere Projekte – Bleibsichtbar" }} />
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {(PRIVATE_FILTERS as readonly string[]).includes(activeFilter) ? (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, y: 32, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="py-20 flex justify-center"
              >
                <div className="max-w-2xl w-full">
                  {/* Card */}
                  <div
                    className="rounded-3xl overflow-hidden shadow-xl border border-gray-100"
                    style={{ background: "linear-gradient(135deg, #060d1f 0%, #0f1e3a 60%, #1a2a50 100%)" }}
                  >
                    {/* Top accent bar */}
                    <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #f97316, #ff6b35, #f97316)" }} />

                    <div className="px-10 py-12 text-center">
                      {/* Shield icon with pulse ring */}
                      <div className="relative inline-flex mb-8">
                        <motion.div
                          animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0, 0.35] }}
                          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute inset-0 rounded-full bg-orange-400/30"
                          style={{ margin: "-12px" }}
                        />
                        <div className="relative w-20 h-20 rounded-full flex items-center justify-center"
                          style={{ background: "rgba(249,115,22,0.12)", border: "1.5px solid rgba(249,115,22,0.3)" }}>
                          <ShieldCheck className="w-9 h-9 text-orange-400" />
                        </div>
                      </div>

                      {/* Label */}
                      <motion.p
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="text-xs font-black tracking-[0.25em] uppercase text-orange-400 mb-4"
                      >
                        Datenschutz & Vertraulichkeit
                      </motion.p>

                      {/* Heading */}
                      <motion.h2
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.22 }}
                        className="text-2xl md:text-3xl font-display font-black text-white leading-snug mb-6"
                      >
                        Referenzen auf Anfrage
                      </motion.h2>

                      {/* Divider */}
                      <motion.div
                        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="w-16 h-0.5 mx-auto mb-6 rounded-full bg-orange-400/50"
                      />

                      {/* Body text */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="space-y-3 text-white/70 text-base leading-relaxed mb-10"
                      >
                        <p>
                          Aus Datenschutz- und Vertraulichkeitsgründen verzichten wir auf die öffentliche Darstellung unserer Kundenprojekte.
                        </p>
                        <p>
                          Selbstverständlich stellen wir Ihnen ausgewählte Referenzen gerne persönlich zur Verfügung.
                        </p>
                      </motion.div>

                      {/* CTA buttons */}
                      <motion.div
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                        className="flex flex-col sm:flex-row gap-3 justify-center"
                      >
                        <Link href="/kontakt">
                          <motion.span
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm cursor-pointer transition-all"
                            style={{ background: "linear-gradient(135deg, #f97316, #ff6b35)", color: "#fff", boxShadow: "0 4px 24px rgba(249,115,22,0.35)" }}
                          >
                            <Mail className="w-4 h-4" />
                            Kontaktformular
                          </motion.span>
                        </Link>
                        <a
                          href="https://wa.me/4915567152351?text=Hallo%20Bleibsichtbar%20Team%2C%20ich%20m%C3%B6chte%20gerne%20Referenzen%20anfragen."
                          target="_blank" rel="noopener noreferrer"
                        >
                          <motion.span
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm cursor-pointer transition-all"
                            style={{ background: "#25D366", color: "#fff", boxShadow: "0 4px 20px rgba(37,211,102,0.35)" }}
                          >
                            <WhatsAppIcon className="w-4 h-4" />
                            Per WhatsApp
                          </motion.span>
                        </a>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : isLoading ? (
              <motion.div key="loading" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="animate-pulse rounded-2xl bg-gray-100" style={{ aspectRatio: "4/5" }} />
                ))}
              </motion.div>
            ) : filtered.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="text-center py-28">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Folder className="w-9 h-9 text-gray-400" />
                </div>
                <h3 className="text-xl font-display font-bold text-gray-500 mb-2">Keine Projekte gefunden</h3>
                <p className="text-gray-400 text-sm">In dieser Kategorie sind aktuell keine Projekte vorhanden.</p>
              </motion.div>
            ) : (
              <motion.div key="grid" layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
                <AnimatePresence mode="popLayout">
                  {filtered.map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
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
