import React, { useState } from "react";
import { Link } from "wouter";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Camera, Edit3, Users, BarChart3, MessageSquare, TrendingUp,
  CheckCircle2, Instagram, ChevronRight, Clock, Repeat2
} from "lucide-react";

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
  { num: "01", title: "Analyse", desc: "Wir durchleuchten Ihren Ist-Zustand, analysieren Wettbewerber und definieren Ihre genaue Zielgruppe." },
  { num: "02", title: "Strategie", desc: "Entwicklung einer maßgeschneiderten Content- und Plattformstrategie. Wer, was, wann und wo." },
  { num: "03", title: "Content Creation", desc: "Produktion hochwertiger Bilder, Reels und Texte, die Ihre Marke authentisch repräsentieren." },
  { num: "04", title: "Publishing", desc: "Vollständige Übernahme der Veröffentlichung und aktives Community Management." },
  { num: "05", title: "Reporting", desc: "Monatliche Auswertung aller KPIs und kontinuierliche Strategieanpassung auf Basis der Daten." },
];

const platforms = ["Instagram", "TikTok", "YouTube", "Facebook", "LinkedIn"];

export default function SocialMedia() {
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
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block bg-white/10 border border-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6 tracking-wide">
              Social Media Management
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
              Mehr Reichweite.<br />
              <span className="text-accent">Mehr Kunden.</span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
              Wir bauen eine starke Präsenz auf, die Vertrauen schafft und neue Kunden bringt. Strategie, Content und Betreuung aus einer Hand.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="rounded-full px-8 bg-accent hover:bg-accent/90 text-white font-bold">
                <a href="#analysebogen">Jetzt Analysebogen ausfüllen</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8 border-white/30 text-white hover:bg-white/10">
                <Link href="/kontakt">Kostenlos beraten lassen</Link>
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

      {/* PROZESS */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">Unser Prozess</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold">Schritt für Schritt zu mehr <span className="text-accent">Sichtbarkeit</span></h2>
            </motion.div>
            <div className="space-y-4">
              {steps.map((step, i) => (
                <motion.div key={i} variants={fadeUp} className="flex gap-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-4xl font-display font-black text-accent/20 leading-none shrink-0 w-12">{step.num}</div>
                  <div>
                    <h3 className="text-xl font-display font-bold mb-1">{step.title}</h3>
                    <p className="text-muted-foreground">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
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
