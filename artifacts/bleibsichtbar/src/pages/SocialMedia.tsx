import React, { useState } from "react";
import { Link } from "wouter";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedHeroBackground, heroFadeUp } from "@/components/shared/AnimatedHero";
import { useGetProjects } from "@workspace/api-client-react";
import {
  Camera, Edit3, BarChart3, MessageSquare,
  CheckCircle2, Clock, Search, Target, Send, TrendingUp, Zap,
} from "lucide-react";

const SOCIAL_RE = /social.?media|instagram|tiktok|linkedin|content|reels?|stories/i;

function getPlatformGlow(category: string): string {
  if (/instagram/i.test(category)) return "#E1306C";
  if (/tiktok/i.test(category)) return "#00f2ea";
  if (/linkedin/i.test(category)) return "#0A66C2";
  if (/facebook/i.test(category)) return "#1877F2";
  if (/youtube/i.test(category)) return "#FF0000";
  return "#f97316";
}

function PhoneCard({ project, index }: { project: any; index: number }) {
  const glowColor = getPlatformGlow(project.category ?? "");
  const floatDuration = 3.2 + (index % 3) * 0.6;
  const floatDelay = (index % 4) * 0.5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group shrink-0 flex flex-col items-center"
      style={{ width: "190px" }}
    >
      {/* Phone + floating wrapper */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: floatDuration, delay: floatDelay, ease: "easeInOut" }}
        whileHover={{ scale: 1.06, rotateY: index % 2 === 0 ? 6 : -6, rotateX: -4 }}
        style={{ transformStyle: "preserve-3d", perspective: "1200px" }}
        className="relative"
      >
        {/* Ambient glow halo under phone */}
        <div
          className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-28 h-10 blur-2xl opacity-40 group-hover:opacity-75 transition-opacity duration-500 rounded-full pointer-events-none z-0"
          style={{ background: glowColor }}
        />

        {/* iPhone frame */}
        <div className="relative z-10 rounded-[2.8rem] bg-[#161616] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)] transition-all duration-500 group-hover:shadow-[0_50px_120px_-10px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.15)]"
          style={{ padding: "5px" }}>

          {/* Side volume buttons */}
          <div className="absolute -left-[3px] top-[88px] w-[3px] h-8 bg-[#2a2a2a] rounded-l-full" />
          <div className="absolute -left-[3px] top-[128px] w-[3px] h-[52px] bg-[#2a2a2a] rounded-l-full" />
          <div className="absolute -left-[3px] top-[188px] w-[3px] h-[52px] bg-[#2a2a2a] rounded-l-full" />
          {/* Power button */}
          <div className="absolute -right-[3px] top-[148px] w-[3px] h-[68px] bg-[#2a2a2a] rounded-r-full" />

          {/* Screen */}
          <div className="rounded-[2.4rem] overflow-hidden relative bg-black" style={{ width: "180px", height: "320px" }}>

            {/* Dynamic Island */}
            <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-[70px] h-[22px] bg-black rounded-full z-30 flex items-center justify-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#1e1e1e]" />
              <div className="w-[6px] h-[6px] rounded-full bg-[#1e1e1e] opacity-60" />
            </div>

            {/* Content image */}
            {project.imageUrl ? (
              <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <Camera className="w-10 h-10 text-gray-600" />
              </div>
            )}

            {/* Bottom overlay with info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
              <p className="text-white text-[11px] font-bold leading-snug line-clamp-2 drop-shadow">{project.title}</p>
              {project.clientName && (
                <p className="text-white/50 text-[9px] mt-0.5 font-medium">{project.clientName}</p>
              )}
            </div>

            {/* Platform badge top-right */}
            <div className="absolute top-8 right-3 z-20">
              <span
                className="text-[8px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-wide shadow"
                style={{ background: glowColor + "dd" }}
              >
                {(project.category ?? "Social").split(" ").slice(0, 2).join(" ")}
              </span>
            </div>

            {/* Subtle screen glare */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none rounded-[2.4rem]" />
          </div>

          {/* Home indicator */}
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-[52px] h-[3px] bg-[#444] rounded-full" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const services = [
  { icon: <Edit3 className="w-6 h-6" />, title: "Feedposts", desc: "Regelmäßige, hochwertige Beiträge, die Ihre Marke authentisch präsentieren und Reichweite aufbauen." },
  { icon: <Camera className="w-6 h-6" />, title: "Reels & Videos", desc: "Kurze, packende Videoinhalte für Instagram, TikTok und YouTube – produziert und geschnitten." },
  { icon: <Clock className="w-6 h-6" />, title: "Stories", desc: "Tägliche Story-Inhalte, die nah am Alltag Ihres Unternehmens sind und Vertrauen aufbauen." },
  { icon: <Camera className="w-6 h-6" />, title: "Content-Tag", desc: "Regelmäßige Drehtage direkt in Ihrem Unternehmen – 1x monatlich oder individuell abgestimmt." },
  { icon: <MessageSquare className="w-6 h-6" />, title: "Community Management", desc: "Wir antworten auf Kommentare und Nachrichten und pflegen Ihre Community aktiv." },
  { icon: <BarChart3 className="w-6 h-6" />, title: "Monatliches Reporting", desc: "Transparente KPI-Auswertung: Reichweite, Follower, Engagement und Handlungsempfehlungen." },
];

const steps = [
  {
    num: "01", title: "Analyse",
    desc: "Wir durchleuchten Ihren Ist-Zustand, analysieren Wettbewerber und definieren Ihre genaue Zielgruppe.",
    icon: Search,
    tags: ["Kanal-Audit", "Wettbewerber-Check", "Zielgruppe"],
    color: "from-blue-500 to-cyan-400",
  },
  {
    num: "02", title: "Strategie",
    desc: "Entwicklung einer maßgeschneiderten Content- und Plattformstrategie. Wer, was, wann und wo.",
    icon: Target,
    tags: ["Content-Plan", "Plattformwahl", "Posting-Rhythmus"],
    color: "from-violet-500 to-purple-400",
  },
  {
    num: "03", title: "Content Creation",
    desc: "Produktion hochwertiger Bilder, Reels und Texte, die Ihre Marke authentisch repräsentieren.",
    icon: Camera,
    tags: ["Fotografie", "Videoproduktion", "Copywriting"],
    color: "from-pink-500 to-rose-400",
  },
  {
    num: "04", title: "Publishing",
    desc: "Vollständige Übernahme der Veröffentlichung und aktives Community Management.",
    icon: Send,
    tags: ["Scheduling", "Hashtag-Optimierung", "Community-Mgmt."],
    color: "from-orange-500 to-amber-400",
  },
  {
    num: "05", title: "Reporting",
    desc: "Monatliche Auswertung aller KPIs und kontinuierliche Strategieanpassung auf Basis der Daten.",
    icon: BarChart3,
    tags: ["KPI-Dashboard", "Monatsbericht", "Strategieanpassung"],
    color: "from-green-500 to-emerald-400",
  },
];

const platforms = ["Instagram", "TikTok", "YouTube", "Facebook", "LinkedIn"];

function StepCard({ step, Icon, isLeft }: { step: typeof steps[0]; Icon: React.ElementType; isLeft: boolean }) {
  return (
    <div className={`group relative bg-white/5 border border-white/10 rounded-3xl p-7 hover:bg-white/10 hover:border-accent/30 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10 ${isLeft ? "lg:mr-10" : "lg:ml-10"}`}>
      <div className="flex items-start gap-4 mb-5">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/10 shrink-0">
          <span className="text-accent font-display font-black text-sm">{step.num}</span>
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-white mb-1">{step.title}</h3>
          <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
        </div>
      </div>
      <div className={`flex flex-wrap gap-2 ${isLeft ? "lg:justify-end" : ""}`}>
        {step.tags.map(tag => (
          <span key={tag} className="text-[11px] bg-white/8 border border-white/15 text-white/60 px-2.5 py-1 rounded-full font-medium">
            {tag}
          </span>
        ))}
      </div>
      <div className={`absolute -inset-px rounded-3xl bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`} />
    </div>
  );
}

export default function SocialMedia() {
  const { data: allProjects = [] } = useGetProjects({ published: true });
  const socialProjects = allProjects.filter(p => SOCIAL_RE.test(p.category ?? ""));

  const [form, setForm] = useState({
    company: "", platforms: [] as string[], feedposts: "", reels: "", stories: "",
    contentDay: "", hasWebsite: "", ads: "", wishes: "", goals: "",
    previousAgency: "", priorities: "", dislikes: "", collaboration: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handlePlatform = (p: string) => {
    setForm(f => ({
      ...f,
      platforms: f.platforms.includes(p) ? f.platforms.filter(x => x !== p) : [...f.platforms, p],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PublicLayout>
      {/* HERO */}
      <section className="relative bg-primary text-white overflow-hidden pt-32 pb-24">
        <AnimatedHeroBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div custom={0} variants={heroFadeUp} initial="hidden" animate="visible">
            <span className="inline-block bg-white/10 border border-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6 tracking-wide">
              Social Media Management
            </span>
          </motion.div>
          <motion.h1 custom={1} variants={heroFadeUp} initial="hidden" animate="visible"
            className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
            Mehr Reichweite.<br />
            <span className="text-accent">Mehr Kunden.</span>
          </motion.h1>
          <motion.p custom={2} variants={heroFadeUp} initial="hidden" animate="visible"
            className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Wir bauen eine starke Präsenz auf, die Vertrauen schafft und neue Kunden bringt. Strategie, Content und Betreuung aus einer Hand.
          </motion.p>
          <motion.div custom={3} variants={heroFadeUp} initial="hidden" animate="visible"
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full px-8 bg-accent hover:bg-accent/90 text-white font-bold">
              <a href="#analysebogen">Jetzt Analysebogen ausfüllen</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 border-white/30 text-white bg-transparent hover:bg-white/10">
              <Link href="/kontakt">Kostenlos beraten lassen</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* LEISTUNGEN */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">Was wir übernehmen</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Unser Social Media <span className="text-accent">Rundum-Paket</span></h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Von der Strategie über die Produktion bis zur Auswertung – wir kümmern uns um alles.
              </p>
            </motion.div>
            <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s, i) => (
                <motion.div key={i} variants={fadeUp} className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-accent/30 hover:shadow-md transition-all group">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-5 group-hover:bg-accent group-hover:text-white transition-all">
                    {s.icon}
                  </div>
                  <h3 className="text-xl font-display font-bold mb-3">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* PROZESS — Animierte Timeline */}
      <section className="py-28 bg-primary text-white relative overflow-hidden">
        <AnimatedHeroBackground />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Header */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="text-center mb-20">
            <motion.p variants={fadeUp} className="text-accent font-semibold text-sm tracking-widest uppercase mb-4">
              Unser Prozess
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-display font-bold text-white">
              Schritt für Schritt zu mehr{" "}
              <span className="text-accent">Sichtbarkeit</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/60 text-lg mt-5 max-w-xl mx-auto">
              Unser bewährter 5-Stufen-Prozess bringt messbare Ergebnisse.
            </motion.p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical center line (desktop) */}
            <div className="hidden lg:block absolute left-1/2 top-6 bottom-6 w-px bg-gradient-to-b from-accent/60 via-white/10 to-transparent -translate-x-1/2 pointer-events-none" />

            <div className="space-y-10 lg:space-y-0">
              {steps.map((step, i) => {
                const isLeft = i % 2 === 0;
                const Icon = step.icon;
                return (
                  <div key={i} className="relative lg:grid lg:grid-cols-2 lg:gap-12 lg:mb-14 items-center">

                    {/* Center node (desktop) */}
                    <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 z-10 flex-col items-center">
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.4, type: "spring" }}
                        className={`w-14 h-14 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-2xl ring-4 ring-primary`}
                      >
                        <span className="text-white font-display font-black text-base">{step.num}</span>
                      </motion.div>
                    </div>

                    {/* Left column (desktop only) */}
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                      className="hidden lg:flex items-center"
                    >
                      {isLeft
                        ? <StepCard step={step} Icon={Icon} isLeft />
                        : <div />
                      }
                    </motion.div>

                    {/* Right column (desktop only) */}
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                      className="hidden lg:flex items-center"
                    >
                      {!isLeft
                        ? <StepCard step={step} Icon={Icon} isLeft={false} />
                        : <div />
                      }
                    </motion.div>

                    {/* Mobile card */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="lg:hidden col-span-2"
                    >
                      <StepCard step={step} Icon={Icon} isLeft={false} />
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* PLATTFORMEN */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/60 text-sm font-medium tracking-widest uppercase mb-6">Wir betreuen Sie auf allen Kanälen</p>
          <div className="flex flex-wrap justify-center gap-4">
            {platforms.map(p => (
              <span key={p} className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white font-semibold text-sm">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL MEDIA PROJEKTE - TELEFON GALERIE */}
      {socialProjects.length > 0 && (
        <section className="py-28 text-white overflow-hidden relative" style={{ background: "radial-gradient(ellipse 120% 80% at 50% 50%, #0d1f3c 0%, #060e1e 60%, #000 100%)" }}>
          {/* Decorative orbs */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] opacity-20 pointer-events-none" style={{ background: "#f97316" }} />
          <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full blur-[100px] opacity-15 pointer-events-none" style={{ background: "#3b82f6" }} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.div variants={fadeUp} className="text-center mb-16">
                <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">Unsere Arbeit</p>
                <h2 className="text-4xl md:text-6xl font-display font-bold text-white">
                  Social Media <span className="text-accent">Projekte</span>
                </h2>
                <p className="text-white/60 text-lg mt-5 max-w-xl mx-auto">
                  Echter Content, echter Erfolg – Einblicke in unsere Kundenprojekte.
                </p>
              </motion.div>

              <div className="relative">
                {/* Left edge fade */}
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#060e1e] to-transparent z-10" />
                {/* Right edge fade */}
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-[#060e1e] to-transparent z-10" />

                <div
                  className="flex gap-10 overflow-x-auto pb-16 pt-8 px-8"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {socialProjects.map((project, i) => (
                    <PhoneCard key={project.id} project={project} index={i} />
                  ))}
                </div>
              </div>

              {/* Scroll hint */}
              <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mt-2">
                <div className="flex gap-1">
                  {socialProjects.slice(0, 5).map((_, i) => (
                    <div key={i} className={`h-1 rounded-full ${i === 0 ? "w-6 bg-accent" : "w-2 bg-white/20"}`} />
                  ))}
                </div>
                <span className="text-white/30 text-xs">Scrollen für mehr</span>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ANALYSEBOGEN */}
      <section id="analysebogen" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-12">
              <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">Kostenlos & unverbindlich</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Social Media <span className="text-accent">Analysebogen</span></h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Füllen Sie unseren Analysebogen aus und wir melden uns innerhalb von 24 Stunden mit einem maßgeschneiderten Angebot.
              </p>
            </motion.div>

            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 bg-green-50 rounded-3xl border border-green-100">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-display font-bold mb-2">Vielen Dank!</h3>
                <p className="text-muted-foreground">Wir melden uns innerhalb von 24 Stunden bei Ihnen.</p>
              </motion.div>
            ) : (
              <motion.form variants={fadeUp} onSubmit={handleSubmit} className="bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100 space-y-8">

                <div>
                  <label className="block text-sm font-bold mb-2">Wie heißt Ihr Unternehmen oder Ihre Marke? *</label>
                  <input required value={form.company} onChange={e => setForm(f => ({...f, company: e.target.value}))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent bg-white"
                    placeholder="Unternehmensname" />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-3">Welche Social-Media-Kanäle nutzen Sie derzeit aktiv? *</label>
                  <div className="flex flex-wrap gap-3">
                    {platforms.concat(["Sonstiges"]).map(p => (
                      <button key={p} type="button" onClick={() => handlePlatform(p)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${form.platforms.includes(p) ? "bg-primary text-white border-primary" : "bg-white border-gray-200 hover:border-primary text-foreground"}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { key: "feedposts", label: "Feedposts / Woche" },
                    { key: "reels", label: "Reels / Woche" },
                    { key: "stories", label: "Stories / Woche" },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-sm font-bold mb-2">{f.label} *</label>
                      <select required value={(form as any)[f.key]} onChange={e => setForm(prev => ({...prev, [f.key]: e.target.value}))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white">
                        <option value="">Wählen</option>
                        {["0", "1", "2", "3", "4", "5+"].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-bold mb-3">Soll regelmäßig ein Content-Tag stattfinden? *</label>
                  <div className="flex flex-wrap gap-3">
                    {["1x pro Monat", "1x alle 3 Monate", "Individuell abgestimmt"].map(opt => (
                      <button key={opt} type="button" onClick={() => setForm(f => ({...f, contentDay: opt}))}
                        className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${form.contentDay === opt ? "bg-primary text-white border-primary" : "bg-white border-gray-200 hover:border-primary"}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {[
                  { key: "hasWebsite", label: "Besitzt Ihr Unternehmen bereits eine Webseite? Wünschen Sie eine Überarbeitung?" },
                  { key: "ads", label: "Möchten Sie zusätzlich Social-Media- oder Google-Ads schalten? Welches monatliche Budget ist geplant?" },
                  { key: "wishes", label: "Gibt es individuelle Wünsche, Themen oder Inhalte, die Ihnen besonders wichtig sind?" },
                  { key: "goals", label: "Was möchten Sie mit Ihrer Social-Media-Betreuung erreichen?" },
                  { key: "previousAgency", label: "Hatten Sie bereits Kontakt mit einer Social-Media-Agentur oder betreuen Sie Ihre Kanäle bisher selbst?" },
                  { key: "priorities", label: "Was ist Ihnen in Ihrem Social-Media-Auftritt am wichtigsten?" },
                  { key: "dislikes", label: "Gibt es bestimmte Dinge oder Darstellungsarten, die Sie nicht wünschen?" },
                  { key: "collaboration", label: "Wie wünschen Sie sich die Zusammenarbeit mit Ihrer Agentur?" },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-bold mb-2">{field.label} *</label>
                    <textarea required value={(form as any)[field.key]} onChange={e => setForm(prev => ({...prev, [field.key]: e.target.value}))}
                      rows={3}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent bg-white resize-none"
                      placeholder="Ihre Antwort..." />
                  </div>
                ))}

                <Button type="submit" size="lg" className="w-full rounded-full font-bold py-4 text-base bg-accent hover:bg-accent/90">
                  Analysebogen absenden
                </Button>
                <p className="text-center text-xs text-muted-foreground">Kostenlos & unverbindlich. Wir melden uns innerhalb von 24 Stunden.</p>
              </motion.form>
            )}
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
