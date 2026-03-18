import React from "react";
import { Link } from "wouter";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const servicesList = [
  {
    title: "Social Media Management",
    desc: "Wir übernehmen die komplette Betreuung Ihrer Social Media Kanäle. Vom Konzept bis zum Community Management.",
    points: ["Strategieentwicklung", "Redaktionsplanung", "Community Management", "Reporting"],
    link: "/services/social-media"
  },
  {
    title: "Performance Marketing",
    desc: "Zielgerichtete Werbekampagnen auf Meta, LinkedIn und TikTok für messbare Ergebnisse.",
    points: ["Leadgenerierung", "E-Commerce Kampagnen", "A/B Testing", "Retargeting"],
    link: "/kontakt"
  },
  {
    title: "Content Creation",
    desc: "Wir produzieren hochwertigen Content, der Ihre Zielgruppe begeistert und konvertiert.",
    points: ["Kurzvideos (Reels/TikToks)", "Professionelle Fotografie", "Copywriting", "Grafikdesign"],
    link: "/kontakt"
  }
];

export default function Services() {
  return (
    <PublicLayout>
      <section className="py-24 bg-gray-50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-display font-bold mb-6"
          >
            Unsere <span className="text-accent">Leistungen</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Maßgeschneiderte digitale Lösungen für Unternehmen, die wachsen wollen.
          </motion.p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {servicesList.map((service, index) => (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                <motion.div 
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={index % 2 !== 0 ? 'lg:order-2' : ''}
                >
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">{service.title}</h2>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{service.desc}</p>
                  
                  <ul className="space-y-4 mb-8">
                    {service.points.map((point, i) => (
                      <li key={i} className="flex items-center text-foreground font-medium">
                        <CheckCircle2 className="w-5 h-5 text-accent mr-3" />
                        {point}
                      </li>
                    ))}
                  </ul>

                  <Button asChild size="lg" variant="outline" className="group">
                    <Link href={service.link}>
                      Details ansehen <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className={`bg-primary/5 rounded-[3rem] p-8 aspect-square flex items-center justify-center ${index % 2 !== 0 ? 'lg:order-1' : ''}`}
                >
                  {/* Decorative placeholder instead of real image to keep it clean */}
                  <div className="w-full h-full border-2 border-dashed border-primary/20 rounded-[2rem] flex items-center justify-center bg-white/50 backdrop-blur-sm">
                    <span className="font-display font-bold text-2xl text-primary/30">Visualisierung</span>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
