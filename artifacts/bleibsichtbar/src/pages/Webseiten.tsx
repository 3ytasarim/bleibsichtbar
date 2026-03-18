import React from "react";
import { Link } from "wouter";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedHeroBackground, heroFadeUp } from "@/components/shared/AnimatedHero";
import { Monitor, Zap, Smartphone, Search, Palette, RefreshCw, CheckCircle2, ArrowRight } from "lucide-react";

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
