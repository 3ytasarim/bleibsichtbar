import React from "react";
import { Link } from "wouter";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Brain, Bot, Zap, MessageSquare, RefreshCw, BarChart3, CheckCircle2, ArrowRight, Settings } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const solutions = [
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "KI-Chatbots & Kundenservice",
    desc: "Automatisierter Kundenservice rund um die Uhr. Unser KI-Bot beantwortet häufige Fragen, qualifiziert Leads und übergibt an Ihr Team – wenn nötig.",
  },
  {
    icon: <RefreshCw className="w-6 h-6" />,
    title: "Automatisierte Anfragen & Follow-ups",
    desc: "Keine Anfrage geht mehr verloren. Eingehende Kontakte werden automatisch erfasst, bewertet und mit personalisierten Nachrichten weiterbetreut.",
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "KI-gestützte Content-Erstellung",
    desc: "Texte, Captions und Kampagnenideen in Minuten – mit KI als kreativen Assistenten, der Ihre Markenstimme kennt.",
  },
  {
    icon: <Settings className="w-6 h-6" />,
    title: "Workflow-Automatisierung",
    desc: "Wiederkehrende Prozesse – von der Terminbuchung bis zum Reporting – werden automatisiert. Sie sparen Zeit, Ihr Team bleibt fokussiert.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "E-Mail- & WhatsApp-Automatisierung",
    desc: "Automatische Begrüßungssequenzen, Angebotsnachrichten und Erinnerungen über alle relevanten Kanäle." ,
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "KI-Analysen & Insights",
    desc: "Wir nutzen KI, um Ihre Daten zu analysieren und Handlungsempfehlungen abzuleiten – schneller und präziser als manuell möglich.",
  },
];

const benefits = [
  { value: "80%", label: "Weniger manuelle Anfragen" },
  { value: "24/7", label: "Automatischer Kundenservice" },
  { value: "3x", label: "Schnellere Reaktionszeiten" },
  { value: "-60%", label: "Reduzierter Zeitaufwand" },
];

const steps = [
  { num: "01", title: "Analyse Ihrer Prozesse", desc: "Wir identifizieren Aufgaben und Abläufe in Ihrem Unternehmen, die sich optimal für Automatisierung eignen." },
  { num: "02", title: "Lösung entwickeln", desc: "Passgenau auf Ihr Business zugeschnitten – keine Standardlösung, sondern maßgeschneiderte KI-Integration." },
  { num: "03", title: "Integration & Setup", desc: "Wir richten die Systeme ein, verbinden Ihre bestehenden Tools und testen alles gründlich." },
  { num: "04", title: "Laufende Optimierung", desc: "KI lernt kontinuierlich dazu. Wir überwachen die Performance und passen Prozesse fortlaufend an." },
];

export default function KIAutomatisierungen() {
  return (
    <PublicLayout>
      {/* HERO */}
      <section className="relative bg-primary text-white overflow-hidden pt-32 pb-24">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-block bg-white/10 border border-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6 tracking-wide">
                Ki & Automatisierungen
              </span>
              <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 leading-tight">
                Mehr Effizienz durch <br />
                <span className="text-accent">smarte KI-Lösungen</span>
              </h1>
              <p className="text-xl text-white/80 mb-10">
                Automatisieren Sie Anfragen, Prozesse und Kundenservice mit moderner KI. Mehr Effizienz, weniger Aufwand, mehr Wachstum.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="rounded-full px-8 bg-accent hover:bg-accent/90 text-white font-bold">
                  <Link href="/kontakt">KI-Potenzial analysieren</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-8 border-white/30 text-white hover:bg-white/10">
                  <Link href="/kontakt">Angebot anfragen</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.3 }}
              className="hidden lg:flex justify-center">
              <div className="relative w-full max-w-sm">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">KI-Assistent</div>
                      <div className="text-green-400 text-xs flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full inline-block" /> Online – 24/7 aktiv</div>
                    </div>
                  </div>
                  {[
                    { from: "user", msg: "Hallo, ich hätte eine Frage zu Ihren Preisen." },
                    { from: "bot", msg: "Hallo! Natürlich helfe ich gerne. Für welche Leistung interessieren Sie sich?" },
                    { from: "user", msg: "Social Media Management für mein Restaurant." },
                    { from: "bot", msg: "Perfekt! Ich leite Ihre Anfrage weiter und ein Berater meldet sich innerhalb von 24h bei Ihnen. 🍽️" },
                  ].map((m, i) => (
                    <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${m.from === "user" ? "bg-white/20 text-white" : "bg-accent/20 text-white border border-accent/30"}`}>
                        {m.msg}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {benefits.map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="text-3xl md:text-4xl font-display font-black text-accent mb-2">{b.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{b.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LÖSUNGEN */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">Unsere KI-Lösungen</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold">Was wir <span className="text-accent">automatisieren</span></h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mt-4">
                Wir identifizieren die Prozesse, die Ihnen Zeit kosten – und automatisieren sie intelligent.
              </p>
            </motion.div>
            <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {solutions.map((s, i) => (
                <motion.div key={i} variants={fadeUp} className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-accent/30 hover:shadow-md transition-all group">
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
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">Unsere Vorgehensweise</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold">Von der Idee zur <span className="text-accent">Automatisierung</span></h2>
            </motion.div>
            <div className="space-y-4">
              {steps.map((step, i) => (
                <motion.div key={i} variants={fadeUp} className="flex gap-6 bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-sm transition-shadow">
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

      {/* CTA */}
      <section className="py-24 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Bereit, Zeit zu sparen und <span className="text-accent">zu wachsen?</span>
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Lassen Sie uns gemeinsam herausfinden, welche Prozesse in Ihrem Unternehmen automatisiert werden können.
          </p>
          <Button asChild size="lg" className="rounded-full px-10 bg-accent hover:bg-accent/90 text-white font-bold text-lg">
            <Link href="/kontakt">KI-Potenzial kostenlos analysieren <ArrowRight className="ml-2 w-5 h-5 inline" /></Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}
