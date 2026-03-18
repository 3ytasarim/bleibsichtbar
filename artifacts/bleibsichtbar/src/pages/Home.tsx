import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Users, Zap, CheckCircle2 } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { PhoneMockup } from "@/components/shared/PhoneMockup";
import { MarqueeClients } from "@/components/shared/MarqueeClients";
import { useGetProjects, useGetReferences } from "@workspace/api-client-react";

export default function Home() {
  const { data: projects = [] } = useGetProjects({ published: true });
  const { data: references = [] } = useGetReferences({ published: true });

  const recentProjects = projects.slice(0, 3);
  const featuredReferences = references.slice(0, 3);

  return (
    <PublicLayout>
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-abstract.png`} 
            alt="Background" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/80 to-white" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center space-x-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
                <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
                <span>Ihre Agentur für messbare Ergebnisse</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-display font-extrabold leading-tight mb-6">
                Wir machen Ihre Marke <span className="text-accent relative">
                  sichtbar
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-accent/30" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none"/></svg>
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
                Professionelles Social Media Marketing, das nicht nur gut aussieht, sondern messbar mehr Kunden und Umsatz generiert.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button asChild size="lg" variant="default" className="text-lg">
                  <Link href="/kontakt">Jetzt starten</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg bg-white/50 backdrop-blur-sm">
                  <Link href="/services">Unsere Leistungen</Link>
                </Button>
              </div>
              
              <div className="mt-12 flex items-center space-x-8 text-sm font-medium text-muted-foreground">
                <div className="flex items-center"><CheckCircle2 className="w-5 h-5 text-accent mr-2"/> Datengetrieben</div>
                <div className="flex items-center"><CheckCircle2 className="w-5 h-5 text-accent mr-2"/> Transparent</div>
                <div className="flex items-center"><CheckCircle2 className="w-5 h-5 text-accent mr-2"/> Zielorientiert</div>
              </div>
            </motion.div>

            <div className="relative hidden lg:flex justify-center items-center">
              <div className="absolute w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
              <PhoneMockup className="rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
                <div className="p-4 space-y-4">
                  <div className="h-48 rounded-xl bg-gray-200 overflow-hidden relative">
                    {/* Unsplash abstract marketing graphic */}
                    <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500&h=400&fit=crop" alt="Social Media" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="h-24 bg-primary/5 rounded-xl flex flex-col justify-center items-center border border-primary/10">
                      <BarChart3 className="w-6 h-6 text-primary mb-2" />
                      <span className="text-xs font-bold">+150%</span>
                    </div>
                    <div className="h-24 bg-accent/5 rounded-xl flex flex-col justify-center items-center border border-accent/20">
                      <Users className="w-6 h-6 text-accent mb-2" />
                      <span className="text-xs font-bold">+3.2k</span>
                    </div>
                  </div>
                </div>
              </PhoneMockup>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
            {[
              { label: "Erfolgreiche Projekte", value: "250+" },
              { label: "Generierter Umsatz", value: "€5M+" },
              { label: "Zufriedene Kunden", value: "98%" },
              { label: "Jahre Erfahrung", value: "7+" }
            ].map((stat, i) => (
              <div key={i} className="px-4">
                <div className="text-3xl md:text-5xl font-display font-bold text-accent mb-2">{stat.value}</div>
                <div className="text-sm md:text-base text-primary-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENTS MARQUEE */}
      <MarqueeClients />

      {/* SERVICES OVERVIEW */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Was wir für Sie tun können</h2>
            <p className="text-lg text-muted-foreground">Ein ganzheitlicher Ansatz für Ihre digitale Präsenz. Wir verbinden kreativen Content mit knallharter Performance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Social Media Management",
                desc: "Ganzheitliche Betreuung Ihrer Kanäle von der Strategie bis zum fertigen Post.",
                icon: <Users className="w-8 h-8 text-accent" />,
                link: "/services/social-media"
              },
              {
                title: "Performance Marketing",
                desc: "Datengetriebene Werbekampagnen, die genau Ihre Zielgruppe erreichen.",
                icon: <Zap className="w-8 h-8 text-accent" />,
                link: "/services"
              },
              {
                title: "Content Creation",
                desc: "Hochwertige Fotos, Videos und Texte, die Ihre Marke im besten Licht zeigen.",
                icon: <BarChart3 className="w-8 h-8 text-accent" />,
                link: "/services"
              }
            ].map((service, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-3xl shadow-lg border border-border/50 transition-all"
              >
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold font-display mb-4">{service.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{service.desc}</p>
                <Link href={service.link} className="inline-flex items-center text-primary font-bold hover:text-accent transition-colors">
                  Mehr erfahren <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RECENT PROJECTS PREVIEW */}
      {recentProjects.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Aktuelle Projekte</h2>
                <p className="text-lg text-muted-foreground">Ergebnisse, die für sich selbst sprechen.</p>
              </div>
              <Button asChild variant="outline" className="hidden md:flex">
                <Link href="/projekte">Alle ansehen</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentProjects.map(project => (
                <Link key={project.id} href={`/projekte`} className="group block">
                  <div className="rounded-3xl overflow-hidden mb-4 relative aspect-[4/3] bg-gray-100">
                    {project.imageUrl && (
                      <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white text-primary px-6 py-3 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform">Fallstudie ansehen</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold font-display">{project.title}</h3>
                  <p className="text-muted-foreground">{project.category}</p>
                </Link>
              ))}
            </div>
            
            <div className="mt-8 text-center md:hidden">
              <Button asChild variant="outline" className="w-full">
                <Link href="/projekte">Alle Projekte ansehen</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {featuredReferences.length > 0 && (
        <section className="py-24 bg-primary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Das sagen unsere Kunden</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredReferences.map(ref => (
                <div key={ref.id} className="bg-white p-8 rounded-3xl shadow-sm border border-border">
                  <div className="flex items-center space-x-1 mb-6 text-accent">
                    {[...Array(ref.rating || 5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <p className="text-lg italic mb-6">"{ref.testimonial}"</p>
                  <div className="flex items-center">
                    {ref.logoUrl ? (
                      <img src={ref.logoUrl} alt={ref.company} className="w-12 h-12 rounded-full object-cover mr-4 bg-gray-100" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mr-4">
                        {ref.clientName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-bold">{ref.clientName}</div>
                      <div className="text-sm text-muted-foreground">{ref.clientTitle && `${ref.clientTitle}, `}{ref.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </PublicLayout>
  );
}
