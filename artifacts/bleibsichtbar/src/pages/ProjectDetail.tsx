import React from "react";
import { useParams, Link } from "wouter";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useGetProject } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { ArrowLeft, Globe, Tag, ExternalLink, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaBanner } from "@/components/shared/CtaBanner";

const SOCIAL_RE = /social.?media|instagram|tiktok|linkedin|content|reels?|stories/i;
const WEB_RE    = /websei?ten?|web.?design|e.?commerce|webseite|online.?shop|app|landing/i;

function getType(cat: string) {
  if (SOCIAL_RE.test(cat)) return "social";
  if (WEB_RE.test(cat))    return "web";
  return "standard";
}

function PhoneMockup({ src, alt }: { src?: string; alt: string }) {
  return (
    <div className="relative mx-auto" style={{ width: 220 }}>
      <div
        className="relative rounded-[3.2rem] bg-[#111] border border-white/10"
        style={{ padding: 7, boxShadow: "0 40px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)" }}
      >
        <div className="absolute -left-[4px] top-24 w-[4px] h-8 bg-[#2a2a2a] rounded-l-full" />
        <div className="absolute -left-[4px] top-36 w-[4px] h-12 bg-[#2a2a2a] rounded-l-full" />
        <div className="absolute -left-[4px] top-52 w-[4px] h-12 bg-[#2a2a2a] rounded-l-full" />
        <div className="absolute -right-[4px] top-44 w-[4px] h-16 bg-[#2a2a2a] rounded-r-full" />
        <div className="rounded-[2.6rem] overflow-hidden bg-black relative" style={{ width: 206, height: 438 }}>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-30" />
          {src ? (
            <img src={src} alt={alt} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <Globe className="w-12 h-12 text-gray-600" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none" />
        </div>
        <div className="flex justify-center pt-2 pb-0.5">
          <div className="w-14 h-[4px] bg-[#333] rounded-full" />
        </div>
      </div>
    </div>
  );
}

function BrowserMockup({ src, alt }: { src?: string; alt: string }) {
  return (
    <div className="relative mx-auto" style={{ width: 380 }}>
      <div
        className="rounded-2xl bg-[#1a1a1a] border border-white/10 overflow-hidden"
        style={{ boxShadow: "0 40px 80px rgba(0,0,0,0.4)" }}
      >
        <div className="flex items-center gap-1.5 px-4 py-3 bg-[#111]">
          {["#ff5f57","#ffbd2e","#28c840"].map(c => (
            <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
          ))}
          <div className="flex-1 mx-3 h-5 bg-[#2a2a2a] rounded-full flex items-center px-3">
            <span className="text-[10px] text-gray-500 truncate">{alt.toLowerCase().replace(/[^a-z0-9]+/g,"-")}.de</span>
          </div>
        </div>
        <div className="overflow-hidden" style={{ aspectRatio: "16/10" }}>
          {src ? (
            <img src={src} alt={alt} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
              <Globe className="w-12 h-12 text-gray-600" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const PALETTES = [
  "#1a56db","#f97316","#7c3aed","#0891b2","#16a34a","#dc2626","#0a1628","#b45309",
];

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading, isError } = useGetProject(parseInt(id!));

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-accent border-t-transparent animate-spin" />
            <p className="text-muted-foreground">Lade Projekt...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (isError || !project) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Projekt nicht gefunden</h2>
            <Link href="/projekte"><Button variant="outline">← Zurück zu Projekten</Button></Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const type = getType(project.category ?? "");
  const accent = PALETTES[(project.id - 1) % PALETTES.length];
  const allImages = [
    project.imageUrl,
    ...(project.galleryImages ?? []),
  ].filter(Boolean) as string[];

  return (
    <PublicLayout>
      {/* HERO */}
      <section
        className="relative pt-36 pb-20 overflow-hidden"
        style={{ background: `linear-gradient(135deg, #060f1e 0%, #0a1628 60%, ${accent}22 100%)` }}
      >
        <div
          className="absolute -top-40 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${accent}28 0%, transparent 70%)`, filter: "blur(60px)" }}
        />
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Back link */}
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <Link href="/projekte" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm font-medium transition-colors mb-10 group">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Zurück zu Projekten
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: info */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div
                className="inline-block text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest mb-5"
                style={{ background: accent }}
              >
                {project.category}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-4">
                {project.title}
              </h1>
              {project.clientName && (
                <p className="text-white/50 text-lg flex items-center gap-2 mb-6">
                  <Globe className="w-4 h-4" />
                  {project.clientName}
                </p>
              )}
              <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-lg">
                {project.description}
              </p>

              {/* Tags */}
              {project.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full text-white/80 border border-white/15 bg-white/5">
                      <Tag className="w-3 h-3" /> {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Website link */}
              {project.websiteUrl && (
                <a
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-full text-white transition-all hover:opacity-90 shadow-lg"
                  style={{ background: accent }}
                >
                  Website besuchen <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </motion.div>

            {/* Right: main mockup */}
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="flex justify-center"
            >
              {type === "web" ? (
                <BrowserMockup src={project.imageUrl ?? undefined} alt={project.title} />
              ) : (
                <PhoneMockup src={project.imageUrl ?? undefined} alt={project.title} />
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      {allImages.length > 1 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14"
            >
              <p className="text-accent font-black text-xs tracking-widest uppercase mb-3">Galerie</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">Projektbilder</h2>
            </motion.div>

            <div className={`grid gap-10 ${type === "web" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"} justify-items-center`}>
              {allImages.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.09, duration: 0.5 }}
                  whileHover={{ y: -8, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                  style={{ transform: i % 2 === 1 ? "rotate(2deg)" : "rotate(-2deg)" }}
                >
                  {type === "web" ? (
                    <BrowserMockup src={img} alt={`${project.title} – Bild ${i + 1}`} />
                  ) : (
                    <PhoneMockup src={img} alt={`${project.title} – Bild ${i + 1}`} />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROJECT INFO STRIP */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {project.clientName && (
              <div className="text-center p-6 rounded-2xl bg-gray-50 border border-gray-100">
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Kunde</p>
                <p className="text-lg font-bold text-primary">{project.clientName}</p>
              </div>
            )}
            <div className="text-center p-6 rounded-2xl bg-gray-50 border border-gray-100">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Kategorie</p>
              <p className="text-lg font-bold" style={{ color: accent }}>{project.category}</p>
            </div>
            {project.tags?.length > 0 && (
              <div className="text-center p-6 rounded-2xl bg-gray-50 border border-gray-100">
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Leistungen</p>
                <p className="text-base font-semibold text-primary leading-relaxed">{project.tags.join(" · ")}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CtaBanner
        label="Ihr Projekt als nächstes?"
        heading="Lassen Sie uns etwas"
        headingAccent="Großartiges schaffen."
        subtext="Kontaktieren Sie uns und starten Sie noch heute Ihr Projekt mit Bleibsichtbar."
        buttonText="Jetzt Kontakt aufnehmen"
        buttonHref="/kontakt"
      />
    </PublicLayout>
  );
}
