import React, { useState } from "react";
import { Link } from "wouter";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion } from "framer-motion";
import { Users, Brain, Monitor, Target, BarChart3, Clock, ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const services = [
  {
    icon: Users,
    color: "from-pink-500 to-rose-600",
    bg: "bg-rose-50",
    title: "Social Media Management",
    tagline: "Wir bauen eine starke Präsenz auf, die Vertrauen schafft und neue Kunden bringt.",
    desc: "Strategie, Content und Betreuung aus einer Hand. Wir kümmern uns um alles – von der Konzeption über die Content-Produktion bis hin zum Community Management. Ihre Marke wird sichtbar, wo Ihre Kunden sind.",
    points: [
      "Strategieentwicklung & Redaktionsplanung",
      "Content-Produktion (Fotos, Videos, Grafiken)",
      "Community Management & Interaktion",
      "Monatliches Reporting & Analytics",
      "Plattformen: Instagram, TikTok, LinkedIn, Facebook",
    ],
  },
  {
    icon: Brain,
    color: "from-violet-500 to-purple-700",
    bg: "bg-violet-50",
    title: "KI & Automatisierung",
    tagline: "Automatisieren Sie Anfragen, Prozesse und Kundenservice mit moderner KI.",
    desc: "Mehr Effizienz, weniger Aufwand, mehr Wachstum. Wir analysieren Ihre Prozesse und implementieren smarte KI-Lösungen, die Ihnen Zeit sparen und Ihre Conversion-Rate steigern.",
    points: [
      "KI-gestützter Chatbot & Kundenservice",
      "Automatisierte Lead-Qualifizierung",
      "Workflow-Automatisierung & Prozessoptimierung",
      "CRM-Integration & Datenpflege",
      "KI-Content-Erstellung & Personalisierung",
    ],
  },
  {
    icon: Monitor,
    color: "from-blue-500 to-indigo-700",
    bg: "bg-blue-50",
    title: "Webseiten Optimierung & Design",
    tagline: "Moderne Webseiten, die nicht nur gut aussehen, sondern Anfragen generieren.",
    desc: "Schnell, professionell und auf Ihr Unternehmen zugeschnitten. Wir optimieren bestehende Websites oder entwickeln komplett neue digitale Auftritte, die Besucher in Kunden verwandeln.",
    points: [
      "Professionelles Webdesign & UX",
      "Conversion-Optimierung (CRO)",
      "Performance & Core Web Vitals",
      "SEO-Grundoptimierung",
      "Mobile-First & barrierefreies Design",
    ],
  },
  {
    icon: Target,
    color: "from-orange-400 to-amber-600",
    bg: "bg-amber-50",
    title: "Strategie & Beratung",
    tagline: "Wir analysieren Ihr Unternehmen und entwickeln eine digitale Strategie, die wirklich zu Ihnen passt.",
    desc: "Keine Schablonenlösung, sondern eine maßgeschneiderte digitale Strategie. Wir analysieren Ihre Ist-Situation, definieren Ziele und entwickeln einen klaren Fahrplan für Ihren digitalen Erfolg.",
    points: [
      "Umfassende Ist-Analyse & Wettbewerbsanalyse",
      "Zieldefinition & KPI-Festlegung",
      "Digitale Roadmap & Umsetzungsplan",
      "Markenpositionierung & Zielgruppenanalyse",
      "Quartalsweise Strategiereview",
    ],
  },
  {
    icon: BarChart3,
    color: "from-green-500 to-emerald-700",
    bg: "bg-emerald-50",
    title: "Performance Marketing & Ads",
    tagline: "Gezielte Werbung bei Google, damit Kunden Sie genau dann finden, wenn sie suchen.",
    desc: "Messbare Ergebnisse statt Streuverlust. Wir planen, erstellen und optimieren Ihre Werbekampagnen auf Google und weiteren Plattformen – für maximalen ROI bei minimalem Budget.",
    points: [
      "Google Ads (Search, Display, Shopping)",
      "Meta Ads (Facebook & Instagram)",
      "TikTok & LinkedIn Ads",
      "Conversion-Tracking & Analytics",
      "A/B-Testing & kontinuierliche Optimierung",
    ],
  },
  {
    icon: Clock,
    color: "from-slate-500 to-gray-700",
    bg: "bg-slate-50",
    title: "Langfristige Betreuung",
    tagline: "Wir begleiten Unternehmen langfristig – von der ersten Idee bis zur laufenden Optimierung.",
    desc: "Digitaler Erfolg ist kein Sprint, sondern ein Marathon. Deshalb bieten wir langfristige Partnerschaften an, in denen wir Ihre digitale Präsenz kontinuierlich weiterentwickeln und optimieren.",
    points: [
      "Fester Ansprechpartner & Account Manager",
      "Monatliche Performance-Reviews",
      "Kontinuierliche Optimierung aller Kanäle",
      "Flexibles Paket – anpassbar an Ihre Bedürfnisse",
      "Bevorzugter Support & schnelle Reaktionszeiten",
    ],
  },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, delay: (index % 2) * 0.1 } } }}
      className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-400 group"
    >
      <div className="p-8 lg:p-10">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
            <service.icon className="w-7 h-7 text-white" />
          </div>
          <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${service.bg} text-gray-600 mt-1`}>
            {["Social Media", "KI", "Web", "Strategie", "Ads", "Betreuung"][index]}
          </span>
        </div>

        <h3 className="text-2xl font-display font-bold mb-3 group-hover:text-accent transition-colors">{service.title}</h3>
        <p className="text-accent font-semibold text-sm mb-4 leading-relaxed">{service.tagline}</p>
        <p className="text-muted-foreground leading-relaxed mb-6">{service.desc}</p>

        <button
          onClick={() => setOpen(!open)}
          className="flex items-center space-x-2 text-sm font-semibold text-foreground/70 hover:text-accent transition-colors mb-4"
        >
          <span>{open ? "Details ausblenden" : "Details anzeigen"}</span>
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <motion.div
          initial={false}
          animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <ul className="space-y-2.5 mb-6">
            {service.points.map((p, i) => (
              <li key={i} className="flex items-start space-x-3">
                <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-sm text-foreground/80">{p}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <Button asChild variant="outline" className="rounded-full border-2 hover:bg-primary hover:text-white hover:border-primary transition-all group/btn">
          <Link href="/kontakt">
            Anfrage stellen
            <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}

export default function Services() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="py-28 bg-gradient-to-br from-slate-900 via-[#0a1628] to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-y-24 translate-x-24" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}>
            <motion.p variants={fadeUp} className="text-accent font-semibold tracking-widest uppercase text-sm mb-6">Leistungen</motion.p>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl font-display font-bold mb-6 leading-tight">
              Alles, was Sie für Ihre<br /><span className="text-accent">digitale Sichtbarkeit</span> brauchen
            </motion.h1>
            <motion.p variants={fadeUp} className="text-xl text-white max-w-2xl mx-auto leading-relaxed">
              Von Social Media über KI-Automatisierung bis hin zu Performance Marketing – wir sind Ihr Full-Service-Partner für die digitale Welt.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, i) => (
              <ServiceCard key={i} service={service} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Nicht sicher, was zu Ihnen passt?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              In einem kostenlosen Erstgespräch analysieren wir Ihre Situation und empfehlen Ihnen die passenden Leistungen.
            </p>
            <Button asChild size="lg" className="rounded-full px-10 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all bg-accent hover:bg-accent/90 text-white">
              <Link href="/kontakt">Kostenloses Erstgespräch <ArrowRight className="ml-2 w-5 h-5" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
