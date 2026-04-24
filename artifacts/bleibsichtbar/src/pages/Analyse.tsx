import React, { useState } from "react";
import { SeoHead } from "@/hooks/useSeoPage";
import { Link } from "wouter";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedHeroBackground } from "@/components/shared/AnimatedHero";
import { useT } from "@/i18n";
import {
  BarChart3, TrendingUp, Users, Eye, Target, CheckCircle2,
  ArrowRight, PieChart, Activity, Shield, Zap, Star, AlertCircle,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const ANALYSE_ICONS = [
  <BarChart3 className="w-6 h-6" />,
  <TrendingUp className="w-6 h-6" />,
  <Users className="w-6 h-6" />,
  <Eye className="w-6 h-6" />,
  <Target className="w-6 h-6" />,
  <PieChart className="w-6 h-6" />,
];

export default function Analyse() {
  const { t } = useT();
  const an = t.analyse;
  const [form, setForm] = useState({ company: "", instagram: "", tiktok: "", linkedin: "", goals: "", contact: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<{ company?: string; goals?: string; contact?: string; submit?: string }>({});

  return (
    <PublicLayout>
      <SeoHead slug="analyse" defaults={{ metaTitle: "Analyse <PublicLayout> Reporting – Bleibsichtbar" }} />
      {/* HERO */}
      <section className="relative bg-primary text-white overflow-hidden pt-32 pb-24">
        <AnimatedHeroBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block bg-white/10 border border-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6 tracking-wide">
              {an.heroBadge}
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
              {an.heroTitle1} <br />
              <span className="text-accent">{an.heroTitle2}</span>
            </h1>
            <p className="text-xl text-white max-w-2xl mx-auto mb-10">
              {an.heroSub}
            </p>
            <div className="flex justify-center">
              <Button asChild size="lg" variant="outline" className="rounded-full px-8 border-white/30 text-white bg-transparent hover:bg-white/10">
                <Link href="/kontakt">{an.heroCta}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {an.stats.map((s, i) => (
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
              <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">{an.servicesLabel}</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold">{an.servicesTitle1} <span className="text-accent">{an.servicesTitle2}</span></h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mt-4">
                {an.servicesSub}
              </p>
            </motion.div>
            <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {an.services.map((l, i) => (
                <motion.div key={i} variants={fadeUp}
                  className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-accent/30 hover:shadow-md transition-all group">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-5 group-hover:bg-accent group-hover:text-white transition-all">
                    {ANALYSE_ICONS[i]}
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
                <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">{an.reportLabel}</p>
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                  {an.reportTitle} <span className="text-accent">{an.reportTitleAccent}</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  {an.reportSub}
                </p>
              </motion.div>
              <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {an.reportItems.map((item, i) => (
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
                    <div className="font-bold">{an.mockTitle}</div>
                    <div className="text-sm text-muted-foreground">bleibsichtbar.com</div>
                  </div>
                  <span className="ml-auto text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">Live</span>
                </div>
                <div className="space-y-4">
                  {[
                    { label: an.mockStats[0].label, value: "+46%", bar: 72, color: "bg-accent", textColor: "text-accent" },
                    { label: an.mockStats[1].label, value: "+38%", bar: 58, color: "bg-blue-500", textColor: "text-blue-500" },
                    { label: an.mockStats[2].label, value: "+385", bar: 85, color: "bg-green-500", textColor: "text-green-600" },
                    { label: an.mockStats[3].label, value: "+12", bar: 45, color: "bg-purple-500", textColor: "text-purple-500" },
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
                      {an.mockRecommendation}
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
                {an.whyLabel}
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-display font-black mb-6 leading-tight" style={{ color: "#0a1628" }}>
                {an.whyTitle}{" "}
                <span className="text-accent">{an.whyTitleAccent}</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-gray-500 text-lg mb-10 leading-relaxed">
                {an.whySub}
              </motion.p>
              <motion.div variants={stagger} className="space-y-4">
                {an.benefits.map((item, i) => (
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
                  {an.cardTitle}
                </h3>
                <p className="text-white/60 mb-8 leading-relaxed">
                  {an.cardSub}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[{ value: "48h", label: an.cardStat1Label }, { value: "100%", label: an.cardStat2Label }].map(s => (
                    <div key={s.label} className="rounded-xl p-4 border border-white/10"
                      style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="text-2xl font-black text-accent mb-1">{s.value}</div>
                      <div className="text-xs text-white/50 font-medium uppercase tracking-wider">{s.label}</div>
                    </div>
                  ))}
                </div>
                <Button asChild size="lg" className="w-full rounded-full bg-accent hover:bg-accent/90 text-white font-bold text-base">
                  <a href="#kostenlose-analyse">
                    {an.cardBtn} <ArrowRight className="ml-2 w-4 h-4 inline" />
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
              <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">{an.heroBadge}</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                {an.formTitle}
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                {an.formSub}
              </p>
            </motion.div>

            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 bg-green-50 rounded-3xl border border-green-100">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-display font-bold mb-2">{an.formSuccess}</h3>
                <p className="text-muted-foreground">{an.formSuccessSub}</p>
              </motion.div>
            ) : (
              <motion.form noValidate variants={fadeUp}
                onSubmit={async (e) => {
                  e.preventDefault();
                  const errs: typeof errors = {};
                  if (!form.company.trim()) errs.company = an.formValidation.companyRequired;
                  if (!form.goals.trim()) errs.goals = an.formValidation.goalsRequired;
                  if (!form.contact.trim()) {
                    errs.contact = an.formValidation.contactRequired;
                  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact)) {
                    errs.contact = an.formValidation.contactRequired;
                  }
                  if (Object.keys(errs).length > 0) { setErrors(errs); return; }
                  setErrors({});
                  setSending(true);
                  try {
                    const res = await fetch("/api/analyse", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(form),
                    });
                    if (!res.ok) throw new Error("Server error");
                    setSubmitted(true);
                  } catch {
                    setErrors({ submit: an.formValidation.submitError });
                  } finally {
                    setSending(false);
                  }
                }}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-2">{an.formCompany}</label>
                  <input value={form.company}
                    onChange={e => { setForm(f => ({ ...f, company: e.target.value })); setErrors(ev => ({ ...ev, company: undefined })); }}
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 bg-gray-50 hover:bg-white transition-colors ${errors.company ? "border-red-400" : "border-gray-200"}`}
                    placeholder={an.placeholderCompany} />
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
                    { key: "linkedin", label: "LinkedIn", placeholder: an.linkedinPlaceholder },
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
                  <label className="block text-sm font-bold mb-2">{an.formGoals}</label>
                  <textarea value={form.goals}
                    onChange={e => { setForm(f => ({ ...f, goals: e.target.value })); setErrors(ev => ({ ...ev, goals: undefined })); }}
                    rows={3}
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 bg-gray-50 hover:bg-white transition-colors resize-none ${errors.goals ? "border-red-400" : "border-gray-200"}`}
                    placeholder={an.placeholderGoals} />
                  {errors.goals && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                      className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200/80 text-xs text-red-600 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.goals}</span>
                    </motion.div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">{an.formContact}</label>
                  <input type="text" value={form.contact}
                    onChange={e => { setForm(f => ({ ...f, contact: e.target.value })); setErrors(ev => ({ ...ev, contact: undefined })); }}
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 bg-gray-50 hover:bg-white transition-colors ${errors.contact ? "border-red-400" : "border-gray-200"}`}
                    placeholder={an.placeholderContact} />
                  {errors.contact && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                      className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200/80 text-xs text-red-600 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.contact}</span>
                    </motion.div>
                  )}
                </div>
                {errors.submit && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200/80 text-xs text-red-600 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.submit}</span>
                  </motion.div>
                )}
                <Button type="submit" size="lg" disabled={sending} className="w-full rounded-full font-bold bg-accent hover:bg-accent/90 text-white disabled:opacity-60">
                  {sending ? an.formSending : <><span>{an.formSubmit}</span><ArrowRight className="ml-2 w-4 h-4 inline" /></>}
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
