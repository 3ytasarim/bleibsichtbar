import React from "react";
import { SeoHead } from "@/hooks/useSeoPage";
import { Link } from "wouter";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedHeroBackground, heroFadeUp } from "@/components/shared/AnimatedHero";
import { useT } from "@/i18n";
import { Target, TrendingUp, BarChart3, Search, Globe, MousePointer, CheckCircle2, ArrowRight, Zap } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const AD_TYPE_ICONS = [
  <Search className="w-6 h-6" />,
  <Globe className="w-6 h-6" />,
  <Target className="w-6 h-6" />,
  <MousePointer className="w-6 h-6" />,
  <Zap className="w-6 h-6" />,
  <BarChart3 className="w-6 h-6" />,
];

export default function MarketingAds() {
  const { t } = useT();
  const ma = t.marketingAds;

  return (
    <PublicLayout>
      <SeoHead slug="marketing-ads" defaults={{ metaTitle: "Marketing Ads – Bleibsichtbar" }} />
      {/* HERO */}
      <section className="relative bg-primary text-white overflow-hidden pt-32 pb-24">
        <AnimatedHeroBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block bg-white/10 border border-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6 tracking-wide">
              {ma.heroBadge}
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
              {ma.heroTitle1} <br />
              <span className="text-accent">{ma.heroTitle2}</span>
            </h1>
            <p className="text-xl text-white max-w-2xl mx-auto mb-10">
              {ma.heroSub}
            </p>
            <div className="flex justify-center">
              <Button asChild size="lg" variant="outline" className="rounded-full px-8 border-white/30 text-white bg-transparent hover:bg-white/10">
                <Link href="/kontakt">{ma.heroCta}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {ma.stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="text-3xl md:text-4xl font-display font-black text-accent mb-2">{s.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AD TYPES */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">{ma.adTypesLabel}</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold">{ma.adTypesTitle1} <span className="text-accent">{ma.adTypesTitle2}</span></h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mt-4">
                {ma.adTypesSub}
              </p>
            </motion.div>
            <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ma.adTypes.map((ad, i) => (
                <motion.div key={i} variants={fadeUp} className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-accent/30 hover:shadow-md transition-all group">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-5 group-hover:bg-accent group-hover:text-white transition-all">
                    {AD_TYPE_ICONS[i]}
                  </div>
                  <h3 className="text-xl font-display font-bold mb-3">{ad.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{ad.desc}</p>
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
              <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">{ma.processLabel}</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold">{ma.processTitle1} <span className="text-accent">{ma.processTitle2}</span></h2>
            </motion.div>
            <div className="space-y-4">
              {ma.steps.map((step, i) => (
                <motion.div key={i} variants={fadeUp} className="flex gap-6 bg-gray-50 rounded-2xl p-6 border border-gray-100">
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

      {/* WHY US */}
      <section className="py-28 bg-white relative overflow-hidden">
        {/* subtle decorative orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)" }} />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(10,22,40,0.06) 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}
            className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: text + checklist */}
            <div>
              <motion.p variants={fadeUp} className="text-accent font-semibold text-sm tracking-widest uppercase mb-4">
                {ma.whyLabel}
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-display font-black mb-6 leading-tight" style={{ color: "#0a1628" }}>
                {ma.whyTitle1}{" "}
                <span className="text-accent">{ma.whyTitle2}</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-gray-500 text-lg mb-10 leading-relaxed">
                {ma.whySub}
              </motion.p>
              <motion.div variants={stagger} className="space-y-4">
                {ma.benefits.map((item, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent transition-colors duration-300">
                      <CheckCircle2 className="w-4 h-4 text-accent group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right: floating CTA card */}
            <motion.div
              variants={fadeUp}
              whileHover={{ y: -6, boxShadow: "0 32px 64px -12px rgba(10,22,40,0.18)" }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative rounded-3xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #0a1628 0%, #1a2f52 100%)",
                boxShadow: "0 20px 48px -8px rgba(10,22,40,0.22)",
              }}
            >
              {/* card glow accent top-right */}
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(249,115,22,0.25) 0%, transparent 70%)" }} />

              <div className="relative p-10 z-10">
                <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-4 leading-snug">
                  {ma.ctaCardTitle1}<br />{ma.ctaCardTitle2}
                </h3>
                <p className="text-white/60 mb-8 leading-relaxed">
                  {ma.ctaCardSub}
                </p>

                {/* Mini stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { value: "3–8x", label: "ROAS" },
                    { value: "24h", label: "Reaktion" },
                  ].map((s) => (
                    <div key={s.label} className="bg-white/8 rounded-xl p-4 border border-white/10">
                      <div className="text-2xl font-black text-accent mb-1">{s.value}</div>
                      <div className="text-xs text-white/50 font-medium uppercase tracking-wider">{s.label}</div>
                    </div>
                  ))}
                </div>

                <Button asChild size="lg" className="w-full rounded-full bg-accent hover:bg-accent/90 text-white font-bold text-base">
                  <Link href="/kontakt">
                    {ma.ctaCardBtn} <ArrowRight className="ml-2 w-4 h-4 inline" />
                  </Link>
                </Button>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
