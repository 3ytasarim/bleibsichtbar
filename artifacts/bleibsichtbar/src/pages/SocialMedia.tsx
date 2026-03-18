import React from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion } from "framer-motion";
import { PhoneMockup } from "@/components/shared/PhoneMockup";

const timelineSteps = [
  {
    title: "1. Analyse",
    desc: "Wir durchleuchten Ihren Ist-Zustand, analysieren Wettbewerber und definieren Ihre genaue Zielgruppe. Daten bilden das Fundament.",
    color: "bg-blue-500"
  },
  {
    title: "2. Strategie",
    desc: "Entwicklung einer maßgeschneiderten Content- und Plattformstrategie. Wir legen fest, wer, was, wann und wo kommuniziert wird.",
    color: "bg-indigo-500"
  },
  {
    title: "3. Content Creation",
    desc: "Produktion von hochwertigen Bildern, Kurzvideos (Reels/TikToks) und treffsicheren Texten, die Ihre Marke authentisch repräsentieren.",
    color: "bg-purple-500"
  },
  {
    title: "4. Publishing",
    desc: "Wir übernehmen die komplette Veröffentlichung, das Community Management und interagieren aktiv mit Ihren Followern.",
    color: "bg-accent"
  },
  {
    title: "5. Reporting",
    desc: "Monatliche transparente Auswertung aller KPIs. Wir lernen aus den Daten und optimieren die Strategie kontinuierlich weiter.",
    color: "bg-emerald-500"
  }
];

export default function SocialMedia() {
  return (
    <PublicLayout>
      {/* HERO */}
      <section className="relative py-24 bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img src={`${import.meta.env.BASE_URL}images/social-media-bg.png`} alt="Abstract" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">Social Media <span className="text-accent">Management</span></h1>
            <p className="text-xl max-w-2xl mx-auto text-primary-foreground/80">
              Von der ersten Idee bis zum viralen Hit. Wir bauen Communities auf, die Ihre Marke lieben und bei Ihnen kaufen.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ANIMATED TIMELINE SECTION */}
      <section className="py-32 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Unser Prozess</h2>
            <p className="text-lg text-muted-foreground">Schritt für Schritt zu mehr Sichtbarkeit</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* The central line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gray-200 transform md:-translate-x-1/2 rounded-full" />

            <div className="space-y-24">
              {timelineSteps.map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className={`relative flex items-center md:justify-between flex-col md:flex-row ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className={`absolute left-8 md:left-1/2 w-6 h-6 rounded-full ${step.color} transform -translate-x-1/2 timeline-dot z-10`} />

                  {/* Content Card */}
                  <div className={`w-full md:w-5/12 pl-20 md:pl-0 ${index % 2 === 0 ? "md:text-left" : "md:text-right"}`}>
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-border hover:border-accent/50 transition-colors">
                      <h3 className="text-2xl font-display font-bold mb-4 text-foreground">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                  
                  {/* Empty space for the other side on desktop */}
                  <div className="hidden md:block w-5/12" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MOCKUP SHOWCASE */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold mb-6">Content, der auffällt.</h2>
              <p className="text-lg text-muted-foreground mb-8">
                In einem endlosen Feed entscheiden Millisekunden. Wir gestalten Beiträge, die den Scroll-Vorgang stoppen. Visuell ansprechend, inhaltlich stark und genau auf die Sprache der Plattform abgestimmt.
              </p>
              <ul className="space-y-4">
                {['Instagram Reels & Posts', 'TikTok Videos', 'LinkedIn Thought Leadership'].map((item, i) => (
                  <li key={i} className="flex items-center bg-gray-50 p-4 rounded-xl font-medium">
                    <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-4 text-sm">{i+1}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center">
              <PhoneMockup>
                <div className="bg-white h-full relative">
                  <div className="h-16 border-b flex items-center px-4 font-bold">Instagram</div>
                  <div className="p-4 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full"></div>
                    <div className="font-bold text-sm">bleibsichtbar</div>
                  </div>
                  <div className="aspect-square bg-gray-200 relative overflow-hidden">
                    {/* landing page hero scenic mountain landscape */}
                    <img src="https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=500&h=500&fit=crop" alt="Feed" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex space-x-4 mb-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                      <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                      <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                    </div>
                    <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                    <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </PhoneMockup>
            </div>
          </div>
        </div>
      </section>

    </PublicLayout>
  );
}
