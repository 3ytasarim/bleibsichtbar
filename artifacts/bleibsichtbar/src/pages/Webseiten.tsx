import React from "react";
import { Link } from "wouter";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedHeroBackground, heroFadeUp } from "@/components/shared/AnimatedHero";
import { useGetProjects } from "@workspace/api-client-react";
import { Monitor, Zap, Smartphone, Search, Palette, RefreshCw, CheckCircle2, ArrowRight } from "lucide-react";

const WEB_RE = /websei?ten?|web.?design|e.?commerce|webseite|online.?shop|landing/i;

function MultiDeviceShowcase({ src, alt }: { src?: string; alt: string }) {
  const img = src || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80";
  return (
    <div className="relative flex items-end justify-center gap-5 px-4 pb-6 pt-4">
      {/* Ambient glow behind devices */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-48 h-24 rounded-full blur-3xl opacity-30" style={{ background: "radial-gradient(circle, #f97316 0%, transparent 70%)" }} />
      </div>

      {/* Desktop Monitor */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
        className="flex flex-col items-center flex-1 min-w-0"
        style={{ maxWidth: "300px" }}
      >
        {/* Monitor body */}
        <div className="w-full rounded-xl shadow-[0_30px_80px_rgba(0,0,0,0.9)] ring-1 ring-white/10 overflow-hidden"
          style={{ background: "linear-gradient(160deg,#222 0%,#141414 100%)" }}>
          {/* Browser bar */}
          <div className="flex items-center gap-2 px-3 py-2.5" style={{ background: "#1a1a1a" }}>
            <div className="flex gap-1.5 shrink-0">
              {["#ff5f57","#ffbd2e","#28c840"].map(c => (
                <div key={c} className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ background: c }} />
              ))}
            </div>
            <div className="flex-1 flex items-center bg-[#2d2d2d] rounded-full h-5 px-3 gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 shrink-0" />
              <div className="flex-1 h-1 bg-[#444] rounded-full" />
            </div>
          </div>
          {/* Screen */}
          <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
            <img src={img} alt={alt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
        {/* Stand */}
        <div className="w-9 h-4 rounded-b" style={{ background: "linear-gradient(180deg,#1a1a1a,#0f0f0f)" }} />
        <div className="w-20 h-[3px] rounded-full" style={{ background: "#1a1a1a" }} />
        <span className="text-white/30 text-[9px] mt-2 font-semibold uppercase tracking-widest">Desktop</span>
      </motion.div>

      {/* iPad */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3.8, delay: 0.6, ease: "easeInOut" }}
        className="flex flex-col items-center shrink-0 z-10"
      >
        <div className="rounded-[1.6rem] shadow-[0_20px_60px_rgba(0,0,0,0.85)] ring-1 ring-white/[0.07]"
          style={{ background: "#161616", padding: "4px", width: "90px" }}>
          <div className="flex justify-center py-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#2a2a2a" }} />
          </div>
          <div className="rounded-lg overflow-hidden relative" style={{ aspectRatio: "3/4" }}>
            <img src={img} alt={alt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
          </div>
          <div className="flex justify-center py-2.5">
            <div className="w-5 h-5 rounded-full border-2" style={{ borderColor: "#2a2a2a" }} />
          </div>
        </div>
        <span className="text-white/30 text-[9px] mt-2 font-semibold uppercase tracking-widest">Tablet</span>
      </motion.div>

      {/* iPhone */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3.2, delay: 1.1, ease: "easeInOut" }}
        className="flex flex-col items-center shrink-0 z-20"
      >
        <div className="rounded-[1.3rem] shadow-[0_20px_60px_rgba(0,0,0,0.85)] ring-1 ring-white/[0.07]"
          style={{ background: "#161616", padding: "4px", width: "56px" }}>
          {/* Side buttons */}
          <div className="relative">
            <div className="absolute -left-[3px] top-[20px] w-[3px] h-5 rounded-l-full" style={{ background: "#222" }} />
            <div className="absolute -left-[3px] top-[48px] w-[3px] h-[32px] rounded-l-full" style={{ background: "#222" }} />
            <div className="absolute -right-[3px] top-[38px] w-[3px] h-[38px] rounded-r-full" style={{ background: "#222" }} />
            <div className="rounded-[1rem] overflow-hidden relative bg-black" style={{ width: "48px", height: "90px" }}>
              {/* Dynamic Island */}
              <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-[26px] h-[8px] rounded-full z-10" style={{ background: "#000" }} />
              <img src={img} alt={alt} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
            </div>
            <div className="flex justify-center pt-1 pb-0.5">
              <div className="w-[18px] h-[2px] rounded-full" style={{ background: "#333" }} />
            </div>
          </div>
        </div>
        <span className="text-white/30 text-[9px] mt-2 font-semibold uppercase tracking-widest">Mobile</span>
      </motion.div>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const leistungen = [
  { icon: <Monitor className="w-6 h-6" />, title: "Webseiten-Design & Neuerstellung", desc: "Individuelle, moderne Webseiten von Grund auf – angepasst an Ihre Marke und Zielgruppe." },
  { icon: <RefreshCw className="w-6 h-6" />, title: "Optimierung bestehender Seiten", desc: "Wir analysieren Ihre bestehende Webseite und verbessern Design, Struktur und Performance." },
  { icon: <Palette className="w-6 h-6" />, title: "Struktur & Nutzerführung", desc: "Klare Seitenarchitektur, die Besucher gezielt zu Anfragen und Conversions führt." },
  { icon: <Search className="w-6 h-6" />, title: "Inhalte & visuelles Design", desc: "Überzeugende Texte, starke Bilder und ein kohärentes visuelles Erscheinungsbild." },
  { icon: <Smartphone className="w-6 h-6" />, title: "Mobile & Ladezeit-Optimierung", desc: "Vollständig mobiloptimiert und blitzschnell – für bestmögliche Nutzererfahrung." },
  { icon: <Zap className="w-6 h-6" />, title: "Laufende Betreuung", desc: "Auch nach dem Launch bleiben wir an Ihrer Seite und optimieren kontinuierlich." },
];

const steps = [
  {
    num: "1",
    title: "Analyse",
    desc: "Wir analysieren Ihr Unternehmen, Ihre Ziele und Ihre aktuelle Online-Präsenz. Darauf basierend definieren wir Struktur, Inhalte und eine klare Ausrichtung für Ihre neue Webseite.",
  },
  {
    num: "2",
    title: "Konzept",
    desc: "Wir entwickeln ein modernes Design und eine klare Seitenstruktur, abgestimmt auf Ihre Marke und Zielgruppe. So entsteht ein Auftritt, der professionell wirkt und Vertrauen schafft.",
  },
  {
    num: "3",
    title: "Umsetzung",
    desc: "Wir setzen Ihre Webseite technisch sauber und performant um. Schnell, mobiloptimiert und bereit für einen starken digitalen Auftritt.",
  },
  {
    num: "4",
    title: "Betreuung",
    desc: "Auch nach dem Launch bleiben wir an Ihrer Seite. Ihre Webseite wird laufend optimiert, erweitert und an Ihr Wachstum angepasst.",
  },
];

const includes = [
  "Individuelles Webdesign",
  "Mobile First Entwicklung",
  "SEO-Grundoptimierung",
  "Ladezeit-Optimierung",
  "Kontaktformulare & CTAs",
  "Google Analytics Integration",
  "SSL & Sicherheit",
  "Laufende Betreuung optional",
];

export default function Webseiten() {
  const { data: allProjects = [] } = useGetProjects({ published: true });
  const webProjects = allProjects.filter(p => WEB_RE.test(p.category ?? ""));

  return (
    <PublicLayout>
      {/* HERO */}
      <section className="relative bg-primary text-white overflow-hidden pt-32 pb-24">
        <AnimatedHeroBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-block bg-white/10 border border-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6 tracking-wide">
                Webseiten Optimierung & Design
              </span>
              <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 leading-tight">
                Ihr digitaler <br />
                <span className="text-accent">erster Eindruck</span>
              </h1>
              <p className="text-xl text-white/80 mb-10 max-w-lg">
                Ihre Webseite entscheidet in Sekunden über Vertrauen. Wir entwickeln klare, moderne Auftritte, die Ihr Unternehmen hochwertig präsentieren und Besucher gezielt zu Anfragen führen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="rounded-full px-8 bg-accent hover:bg-accent/90 text-white font-bold">
                  <Link href="/kontakt">Webseite anfragen</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-8 border-white/30 text-white bg-transparent hover:bg-white/10">
                  <Link href="/projekte">Projekte ansehen</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:block">
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6">
                  <img
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80&fit=crop"
                    alt="Webdesign"
                    className="rounded-2xl w-full object-cover h-72"
                  />
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">Ladezeit</div>
                      <div className="text-accent text-2xl font-black">0.8s</div>
                    </div>
                    <div>
                      <div className="text-white font-bold">Mobile Score</div>
                      <div className="text-green-400 text-2xl font-black">98/100</div>
                    </div>
                    <div>
                      <div className="text-white font-bold">Conversion</div>
                      <div className="text-white text-2xl font-black">+240%</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* LEISTUNGEN ÜBERBLICK */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">Unsere Leistungen im Überblick</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold">
                Alles aus <span className="text-accent">einer Hand</span>
              </h2>
            </motion.div>
            <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leistungen.map((l, i) => (
                <motion.div key={i} variants={fadeUp} className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-accent/30 hover:shadow-md transition-all group">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-5 group-hover:bg-accent group-hover:text-white transition-all">
                    {l.icon}
                  </div>
                  <h3 className="text-xl font-display font-bold mb-3">{l.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{l.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* PROZESS */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">Unser Prozess</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold">
                Struktur. Klarheit. <span className="text-accent">Ergebnisse.</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mt-4">
                Klare Prozesse schaffen messbare Ergebnisse. Wir begleiten Sie von der ersten Analyse bis zur laufenden Optimierung.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {steps.map((step, i) => (
                <motion.div key={i} variants={fadeUp} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="absolute top-6 right-6 text-7xl font-black text-gray-100 leading-none">{step.num}</div>
                  <div className="relative z-10">
                    <div className="w-10 h-10 bg-accent text-white rounded-xl flex items-center justify-center font-bold text-lg mb-5">{step.num}</div>
                    <h3 className="text-xl font-display font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* WAS ENTHALTEN IST */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.div variants={fadeUp}>
                <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">Unser Anspruch</p>
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Modern. Klar. <span className="text-accent">Überzeugend.</span></h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Wir verbinden Design, Struktur und Nutzerführung zu einer Webseite, die professionell wirkt und messbar funktioniert. Von der ersten Idee bis zur finalen Umsetzung entsteht ein digitaler Auftritt, der Ihre Marke stärkt und langfristig Ergebnisse liefert.
                </p>
              </motion.div>
              <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {includes.map((item, i) => (
                  <motion.div key={i} variants={fadeUp} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                    <span className="text-sm font-medium">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <img
                src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=700&q=80&fit=crop"
                alt="Moderne Webseite"
                className="rounded-3xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* PROJEKTE SHOWCASE */}
      {webProjects.length > 0 && (
        <section className="py-28 text-white overflow-hidden relative"
          style={{ background: "radial-gradient(ellipse 110% 80% at 50% 40%, #0d1f3c 0%, #070e1d 55%, #020810 100%)" }}>
          {/* Decorative ambient orbs */}
          <div className="absolute top-1/4 left-10 w-80 h-80 rounded-full blur-[140px] opacity-15 pointer-events-none" style={{ background: "#f97316" }} />
          <div className="absolute bottom-1/4 right-10 w-72 h-72 rounded-full blur-[120px] opacity-10 pointer-events-none" style={{ background: "#3b82f6" }} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.div variants={fadeUp} className="text-center mb-20">
                <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-4">Referenzprojekte</p>
                <h2 className="text-4xl md:text-6xl font-display font-bold text-white">
                  Webseiten, die <span className="text-accent">überzeugen</span>
                </h2>
                <p className="text-white/60 text-lg mt-5 max-w-xl mx-auto">
                  Vollständig responsiv – auf Desktop, Tablet und Smartphone perfekt.
                </p>
              </motion.div>

              <div className="space-y-10">
                {webProjects.map((project, i) => (
                  <motion.div key={project.id} variants={fadeUp}
                    className="group relative rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
                    style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {/* Hover gradient border effect */}
                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.06) 0%, transparent 60%)" }} />

                    <div className="grid lg:grid-cols-2 gap-0 items-stretch">
                      {/* Device showcase panel */}
                      <div className={`relative flex items-center justify-center p-8 md:p-10 ${i % 2 === 1 ? "lg:order-2" : ""}`}
                        style={{ background: "rgba(0,0,0,0.25)" }}>
                        <MultiDeviceShowcase src={project.imageUrl ?? undefined} alt={project.title} />
                        {/* Panel separator */}
                        <div className={`hidden lg:block absolute top-8 bottom-8 w-px ${i % 2 === 1 ? "left-0" : "right-0"}`}
                          style={{ background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.1) 70%, transparent)" }} />
                      </div>

                      {/* Info panel */}
                      <div className={`flex flex-col justify-center p-8 md:p-12 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                        <div className="flex items-center gap-3 mb-5">
                          <span className="inline-flex items-center bg-accent/15 text-accent text-xs font-bold px-3.5 py-1.5 rounded-full border border-accent/20">
                            {project.category}
                          </span>
                          {project.clientName && (
                            <span className="text-white/30 text-sm">·</span>
                          )}
                          {project.clientName && (
                            <span className="text-white/50 text-sm font-medium">{project.clientName}</span>
                          )}
                        </div>
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white mb-4 leading-tight">
                          {project.title}
                        </h3>
                        <p className="text-white/60 leading-relaxed text-base md:text-lg">{project.description}</p>
                        {project.tags && project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-7">
                            {project.tags.map(tag => (
                              <span key={tag} className="text-[11px] font-semibold text-white/50 px-3 py-1 rounded-full"
                                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Bereit für Ihre neue <span className="text-accent">Webseite?</span>
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Lassen Sie uns gemeinsam einen digitalen Auftritt entwickeln, der Ihr Unternehmen von seiner besten Seite zeigt.
          </p>
          <Button asChild size="lg" className="rounded-full px-10 bg-accent hover:bg-accent/90 text-white font-bold text-lg">
            <Link href="/kontakt">Jetzt kostenlos anfragen <ArrowRight className="ml-2 w-5 h-5 inline" /></Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}
