import React, { useState } from "react";
import { Link } from "wouter";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedHeroBackground, heroFadeUp } from "@/components/shared/AnimatedHero";
import { BarChart3, TrendingUp, Users, Eye, Target, CheckCircle2, ArrowRight, PieChart, Activity } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

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

export default function Analyse() {
  const [form, setForm] = useState({ company: "", instagram: "", tiktok: "", linkedin: "", goals: "", contact: "" });
  const [submitted, setSubmitted] = useState(false);

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

      {/* LEISTUNGEN */}
      <section className="py-24 bg-white">
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

      {/* REPORT INHALTE */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.div variants={fadeUp}>
                <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">Monatliches Reporting</p>
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Ihr Report enthält <span className="text-accent">alles, was zählt.</span></h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Kein Zahlenfriedhof – unser Reporting ist klar strukturiert, visuell aufbereitet und enthält immer konkrete Handlungsempfehlungen.
                </p>
              </motion.div>
              <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {reportItems.map((item, i) => (
                  <motion.div key={i} variants={fadeUp} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                    <span className="text-sm font-medium">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold">Monatsbericht Februar 2026</div>
                    <div className="text-sm text-muted-foreground">bleibsichtbar.com</div>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Reichweite", value: "+46%", bar: 72, color: "bg-accent" },
                    { label: "Engagement", value: "+38%", bar: 58, color: "bg-blue-500" },
                    { label: "Follower-Wachstum", value: "+385", bar: 85, color: "bg-green-500" },
                    { label: "Anfragen via Social", value: "+12", bar: 45, color: "bg-purple-500" },
                  ].map((stat, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium text-gray-700">{stat.label}</span>
                        <span className={`font-bold ${stat.color === "bg-accent" ? "text-accent" : stat.color === "bg-blue-500" ? "text-blue-500" : stat.color === "bg-green-500" ? "text-green-600" : "text-purple-500"}`}>{stat.value}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div className={`h-full ${stat.color} rounded-full`} initial={{ width: 0 }} whileInView={{ width: `${stat.bar}%` }} viewport={{ once: true }} transition={{ duration: 1.2, delay: i * 0.15, ease: "easeOut" }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100 text-sm text-muted-foreground">
                  📌 Empfehlung: Erhöhung der Reels-Frequenz auf 3x/Woche basierend auf Best Performers.
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* KOSTENLOSE ANALYSE FORMULAR */}
      <section id="kostenlose-analyse" className="py-24 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-12">
              <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">Kostenlos & unverbindlich</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Kostenlose <span className="text-accent">Social-Media-Analyse</span></h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Tragen Sie Ihre Daten ein – wir analysieren Ihre Kanäle und senden Ihnen innerhalb von 48 Stunden einen kostenlosen Erstbericht.
              </p>
            </motion.div>

            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 bg-green-50 rounded-3xl border border-green-100">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-display font-bold mb-2">Anfrage erhalten!</h3>
                <p className="text-muted-foreground">Ihr kostenloser Analysebericht wird innerhalb von 48 Stunden zugesendet.</p>
              </motion.div>
            ) : (
              <motion.form variants={fadeUp} onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                className="bg-gray-50 rounded-3xl p-8 border border-gray-100 space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-2">Unternehmensname *</label>
                  <input required value={form.company} onChange={e => setForm(f => ({...f, company: e.target.value}))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white"
                    placeholder="Ihr Unternehmen" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { key: "instagram", placeholder: "@instagram_handle" },
                    { key: "tiktok", placeholder: "@tiktok_handle" },
                    { key: "linkedin", placeholder: "LinkedIn-Seite" },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-sm font-bold mb-2 capitalize">{f.key === "linkedin" ? "LinkedIn" : f.key.charAt(0).toUpperCase() + f.key.slice(1)}</label>
                      <input value={(form as any)[f.key]} onChange={e => setForm(prev => ({...prev, [f.key]: e.target.value}))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white"
                        placeholder={f.placeholder} />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Was möchten Sie mit Social Media erreichen? *</label>
                  <textarea required value={form.goals} onChange={e => setForm(f => ({...f, goals: e.target.value}))}
                    rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white resize-none"
                    placeholder="z.B. mehr Anfragen, Bekanntheit steigern, neue Kunden..." />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Ihre E-Mail-Adresse *</label>
                  <input required type="email" value={form.contact} onChange={e => setForm(f => ({...f, contact: e.target.value}))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white"
                    placeholder="ihre@email.de" />
                </div>
                <Button type="submit" size="lg" className="w-full rounded-full font-bold bg-accent hover:bg-accent/90">
                  Kostenlose Analyse anfordern <ArrowRight className="ml-2 w-4 h-4 inline" />
                </Button>
                <p className="text-center text-xs text-muted-foreground">100% kostenlos & unverbindlich. Wir melden uns innerhalb von 48 Stunden.</p>
              </motion.form>
            )}
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
