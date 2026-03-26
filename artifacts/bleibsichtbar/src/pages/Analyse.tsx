import React, { useState } from "react";
import { Link } from "wouter";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedHeroBackground } from "@/components/shared/AnimatedHero";
import {
  BarChart3, TrendingUp, Users, Eye, Target, CheckCircle2,
  ArrowRight, PieChart, Activity, Search, Lightbulb, Rocket, RefreshCw,
  LineChart, Shield, Zap, Star, AlertCircle,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const stats = [
  { value: "48h", label: "Erstbericht in 48 Stunden" },
  { value: "+46%", label: "Ø Reichweiten-Steigerung" },
  { value: "100%", label: "Kostenlos & unverbindlich" },
  { value: "6+", label: "Analysebereiche" },
];

const analyseLeistungen = [
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Social Media Audit",
    desc: "Vollständige Analyse Ihrer Kanäle: Reichweite, Engagement, Follower-Qualität und Wettbewerbsvergleich.",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Performance-Tracking",
    desc: "Monatliche KPI-Auswertung mit allen relevanten Metriken – verständlich aufbereitet, nicht nur Zahlen.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Zielgruppenanalyse",
    desc: "Wer sind Ihre Follower? Wir analysieren Demografie, Interessen und das Verhalten Ihrer Community.",
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: "Wettbewerbsanalyse",
    desc: "Was machen Ihre Mitbewerber besser? Wir identifizieren Chancen und Lücken in Ihrem Markt.",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Content-Performance",
    desc: "Welche Inhalte funktionieren am besten? Wir analysieren und nutzen das für Ihre zukünftige Strategie.",
  },
  {
    icon: <PieChart className="w-6 h-6" />,
    title: "ROI-Messung",
    desc: "Wir machen messbar, was Ihre Social-Media-Aktivitäten wirklich bringen – in Leads, Anfragen und Umsatz.",
  },
];

const steps = [
  {
    num: "01",
    icon: <Search className="w-6 h-6" />,
    title: "Daten erfassen",
    desc: "Sie teilen uns Ihre Social-Media-Kanäle und Ihre Ziele mit – völlig kostenlos und unverbindlich.",
  },
  {
    num: "02",
    icon: <LineChart className="w-6 h-6" />,
    title: "Tiefenanalyse",
    desc: "Unser Team analysiert alle relevanten KPIs: Reichweite, Engagement, Zielgruppe und Wettbewerb.",
  },
  {
    num: "03",
    icon: <Lightbulb className="w-6 h-6" />,
    title: "Insights & Report",
    desc: "Sie erhalten einen klaren, verständlichen Bericht mit konkreten Handlungsempfehlungen – binnen 48h.",
  },
  {
    num: "04",
    icon: <Rocket className="w-6 h-6" />,
    title: "Umsetzung & Wachstum",
    desc: "Auf Wunsch setzen wir die Empfehlungen direkt um und begleiten Sie langfristig zum Erfolg.",
  },
];

const reportItems = [
  "Reichweite & Impressionen",
  "Follower-Wachstum",
  "Engagement-Rate",
  "Beste Beiträge & Formate",
  "Zielgruppendemografie",
  "Wettbewerbsvergleich",
  "Google Analytics Integration",
  "Handlungsempfehlungen",
];

const vorteile = [
  "Keine Mindestlaufzeit – fair und transparent",
  "Individueller Report für Ihr Unternehmen",
  "Klare Empfehlungen statt Datenberge",
  "Monatliche Updates & Fortschrittsmessung",
  "Direkter Ansprechpartner für Ihre Fragen",
];

export default function Analyse() {
  const [form, setForm] = useState({ company: "", instagram: "", tiktok: "", linkedin: "", goals: "", contact: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ company?: string; goals?: string; contact?: string }>({});

  return (
    <PublicLayout>
      {/* HERO */}
      <section className="relative bg-primary text-white overflow-hidden pt-32 pb-24">
        <AnimatedHeroBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block bg-white/10 border border-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6 tracking-wide">
              Analyse & Reporting
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
              Daten, die <br />
              <span className="text-accent">Entscheidungen tragen.</span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
              Wir analysieren Ihre Online-Präsenz, messen Ihre Performance und liefern Ihnen die Insights, die Sie brauchen, um besser zu werden.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="rounded-full px-8 bg-accent hover:bg-accent/90 text-white font-bold">
                <a href="#kostenlose-analyse">Kostenlose Analyse starten</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8 border-white/30 text-white bg-transparent hover:bg-white/10">
                <Link href="/kontakt">Jetzt beraten lassen</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="text-3xl md:text-4xl font-display font-black text-accent mb-2">{s.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LEISTUNGEN */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">Was wir analysieren</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold">Vollständige <span className="text-accent">Performance-Analyse</span></h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mt-4">
                Keine Spekulation, sondern Fakten. Wir liefern Ihnen ein klares Bild davon, was funktioniert und was nicht.
              </p>
            </motion.div>
            <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analyseLeistungen.map((l, i) => (
                <motion.div key={i} variants={fadeUp}
                  className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-accent/30 hover:shadow-md transition-all group">
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
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">Unser Vorgehen</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold">Von der Analyse zum <span className="text-accent">Wachstum</span></h2>
            </motion.div>
            <div className="space-y-4">
              {steps.map((step, i) => (
                <motion.div key={i} variants={fadeUp}
                  className="flex gap-6 bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-accent/20 hover:shadow-sm transition-all group">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-black text-accent/50 uppercase tracking-widest">{step.num}</span>
                      <h3 className="text-xl font-display font-bold">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* REPORT INHALTE */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.div variants={fadeUp}>
                <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">Monatliches Reporting</p>
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                  Ihr Report enthält <span className="text-accent">alles, was zählt.</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Kein Zahlenfriedhof – unser Reporting ist klar strukturiert, visuell aufbereitet und enthält immer konkrete Handlungsempfehlungen.
                </p>
              </motion.div>
              <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {reportItems.map((item, i) => (
                  <motion.div key={i} variants={fadeUp} className="flex items-center gap-3 group">
                    <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent transition-colors">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-sm font-medium">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold">Monatsbericht März 2026</div>
                    <div className="text-sm text-muted-foreground">bleibsichtbar.com</div>
                  </div>
                  <span className="ml-auto text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">Live</span>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Reichweite", value: "+46%", bar: 72, color: "bg-accent", textColor: "text-accent" },
                    { label: "Engagement", value: "+38%", bar: 58, color: "bg-blue-500", textColor: "text-blue-500" },
                    { label: "Follower-Wachstum", value: "+385", bar: 85, color: "bg-green-500", textColor: "text-green-600" },
                    { label: "Anfragen via Social", value: "+12", bar: 45, color: "bg-purple-500", textColor: "text-purple-500" },
                  ].map((stat, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium text-gray-700">{stat.label}</span>
                        <span className={`font-bold ${stat.textColor}`}>{stat.value}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${stat.color} rounded-full`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${stat.bar}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: i * 0.15, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <div className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-gray-700">Empfehlung:</span> Erhöhung der Reels-Frequenz auf 3×/Woche basierend auf Best Performers.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-28 bg-white relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)" }} />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(10,22,40,0.05) 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}
            className="grid lg:grid-cols-2 gap-16 items-center">

            <div>
              <motion.p variants={fadeUp} className="text-accent font-semibold text-sm tracking-widest uppercase mb-4">
                Ihre Vorteile
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-display font-black mb-6 leading-tight" style={{ color: "#0a1628" }}>
                Warum Bleibsichtbar{" "}
                <span className="text-accent">für Ihre Analyse?</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-gray-500 text-lg mb-10 leading-relaxed">
                Daten allein bringen nichts. Erst die richtige Interpretation macht aus Zahlen echte Entscheidungen.
              </motion.p>
              <motion.div variants={stagger} className="space-y-4">
                {vorteile.map((item, i) => (
                  <motion.div key={i} variants={fadeUp} className="flex items-center gap-4 group">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent transition-colors duration-300">
                      <CheckCircle2 className="w-4 h-4 text-accent group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <motion.div
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative rounded-3xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #0a1628 0%, #1a2f52 100%)",
                boxShadow: "0 20px 48px -8px rgba(10,22,40,0.22)",
              }}
            >
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(249,115,22,0.22) 0%, transparent 70%)" }} />
              <div className="relative p-10 z-10">
                <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-4 leading-snug">
                  Kostenlose<br />Social-Media-Analyse
                </h3>
                <p className="text-white/60 mb-8 leading-relaxed">
                  Wir analysieren Ihre Kanäle und senden Ihnen innerhalb von 48 Stunden einen kostenlosen Erstbericht.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[{ value: "48h", label: "Erstbericht" }, { value: "100%", label: "Kostenlos" }].map(s => (
                    <div key={s.label} className="rounded-xl p-4 border border-white/10"
                      style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="text-2xl font-black text-accent mb-1">{s.value}</div>
                      <div className="text-xs text-white/50 font-medium uppercase tracking-wider">{s.label}</div>
                    </div>
                  ))}
                </div>
                <Button asChild size="lg" className="w-full rounded-full bg-accent hover:bg-accent/90 text-white font-bold text-base">
                  <a href="#kostenlose-analyse">
                    Jetzt Analyse starten <ArrowRight className="ml-2 w-4 h-4 inline" />
                  </a>
                </Button>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* KOSTENLOSE ANALYSE FORMULAR */}
      <section id="kostenlose-analyse" className="py-28 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-40"
          style={{ backgroundImage: "radial-gradient(circle at 70% 30%, rgba(249,115,22,0.07) 0%, transparent 50%)" }} />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-12">
              <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">Kostenlos & unverbindlich</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Kostenlose <span className="text-accent">Social-Media-Analyse</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Tragen Sie Ihre Daten ein – wir analysieren Ihre Kanäle und senden Ihnen innerhalb von 48 Stunden einen kostenlosen Erstbericht.
              </p>
            </motion.div>

            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 bg-green-50 rounded-3xl border border-green-100">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-display font-bold mb-2">Anfrage erhalten!</h3>
                <p className="text-muted-foreground">Ihr kostenloser Analysebericht wird innerhalb von 48 Stunden zugesendet.</p>
              </motion.div>
            ) : (
              <motion.form noValidate variants={fadeUp}
                onSubmit={(e) => {
                  e.preventDefault();
                  const errs: typeof errors = {};
                  if (!form.company.trim()) errs.company = "Bitte geben Sie Ihren Unternehmensnamen ein.";
                  if (!form.goals.trim()) errs.goals = "Bitte beschreiben Sie Ihre Ziele.";
                  if (!form.contact.trim()) {
                    errs.contact = "Bitte geben Sie Ihre E-Mail-Adresse ein.";
                  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact)) {
                    errs.contact = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
                  }
                  if (Object.keys(errs).length > 0) { setErrors(errs); return; }
                  setErrors({});
                  setSubmitted(true);
                }}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-2">Unternehmensname *</label>
                  <input value={form.company}
                    onChange={e => { setForm(f => ({ ...f, company: e.target.value })); setErrors(ev => ({ ...ev, company: undefined })); }}
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 bg-gray-50 hover:bg-white transition-colors ${errors.company ? "border-red-400" : "border-gray-200"}`}
                    placeholder="Ihr Unternehmen" />
                  {errors.company && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                      className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200/80 text-xs text-red-600 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.company}</span>
                    </motion.div>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { key: "instagram", label: "Instagram", placeholder: "@handle" },
                    { key: "tiktok", label: "TikTok", placeholder: "@handle" },
                    { key: "linkedin", label: "LinkedIn", placeholder: "Seiten-URL" },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-sm font-bold mb-2">{f.label}</label>
                      <input
                        value={(form as any)[f.key]}
                        onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 bg-gray-50 hover:bg-white transition-colors"
                        placeholder={f.placeholder} />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Was möchten Sie mit Social Media erreichen? *</label>
                  <textarea value={form.goals}
                    onChange={e => { setForm(f => ({ ...f, goals: e.target.value })); setErrors(ev => ({ ...ev, goals: undefined })); }}
                    rows={3}
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 bg-gray-50 hover:bg-white transition-colors resize-none ${errors.goals ? "border-red-400" : "border-gray-200"}`}
                    placeholder="z.B. mehr Anfragen, Bekanntheit steigern, neue Kunden..." />
                  {errors.goals && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                      className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200/80 text-xs text-red-600 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.goals}</span>
                    </motion.div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Ihre E-Mail-Adresse *</label>
                  <input type="text" value={form.contact}
                    onChange={e => { setForm(f => ({ ...f, contact: e.target.value })); setErrors(ev => ({ ...ev, contact: undefined })); }}
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 bg-gray-50 hover:bg-white transition-colors ${errors.contact ? "border-red-400" : "border-gray-200"}`}
                    placeholder="ihre@email.de" />
                  {errors.contact && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                      className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200/80 text-xs text-red-600 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.contact}</span>
                    </motion.div>
                  )}
                </div>
                <Button type="submit" size="lg" className="w-full rounded-full font-bold bg-accent hover:bg-accent/90 text-white">
                  Kostenlose Analyse anfordern <ArrowRight className="ml-2 w-4 h-4 inline" />
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  100% kostenlos & unverbindlich. Wir melden uns innerhalb von 48 Stunden.
                </p>
              </motion.form>
            )}
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
