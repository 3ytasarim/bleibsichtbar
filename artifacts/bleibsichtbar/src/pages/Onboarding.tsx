import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, Building2, User, Mail, Phone, Globe, Target, BarChart3, MessageSquare, Play, X } from "lucide-react";

const PLATFORMS = ["Instagram", "Facebook", "TikTok", "LinkedIn", "YouTube", "Pinterest"];
const GOALS = [
  "Mehr Follower & Reichweite",
  "Umsatzsteigerung",
  "Markenbekanntheit aufbauen",
  "Kundenbindung stärken",
  "Leadgenerierung",
  "Community aufbauen",
];
const SIZES = ["1–5 Mitarbeiter", "6–20 Mitarbeiter", "21–50 Mitarbeiter", "51–200 Mitarbeiter", "200+ Mitarbeiter"];
const BUDGETS = ["bis 500 €/Monat", "500–1.000 €/Monat", "1.000–2.500 €/Monat", "2.500–5.000 €/Monat", "5.000+ €/Monat"];

function rng(seed: number) {
  let x = seed;
  x = ((x >> 16) ^ x) * 0x45d9f3b | 0;
  x = ((x >> 16) ^ x) * 0x45d9f3b | 0;
  x = (x >> 16) ^ x;
  return Math.abs(x % 10000) / 10000;
}

const STARS = Array.from({ length: 120 }, (_, i) => {
  const r = (s: number) => rng(i * 7919 + s * 104729);
  return {
    id: i, x: r(3) * 98 + 1, y: r(4) * 98 + 1,
    size: i % 7 === 0 ? 3.2 : i % 4 === 0 ? 2.2 : 1.5,
    moveDur: `${16 + r(5) * 18}s`, blinkDur: `${2 + r(6) * 4}s`,
    delay: `-${r(7) * 20}s`, blinkDelay: `-${r(8) * 5}s`,
    opacity: 0.25 + r(9) * 0.5,
    dx1: `${(r(1) - 0.5) * 35}px`, dy1: `${(r(2) - 0.5) * 35}px`,
    dx2: `${(r(1) - 0.5) * -24}px`, dy2: `${(r(2) - 0.5) * 18}px`,
  };
});

function StarField() {
  return (
    <>
      <style>{`
        @keyframes oBoardDrift {
          0% { transform: translate(0,0); }
          25% { transform: translate(var(--dx1), var(--dy2)); }
          50% { transform: translate(var(--dx2), var(--dy1)); }
          75% { transform: translate(var(--dx1), var(--dy2)); }
          100% { transform: translate(0,0); }
        }
        @keyframes oBoardBlink {
          0%, 100% { opacity: var(--op); }
          40% { opacity: calc(var(--op) * 0.2); }
          70% { opacity: calc(var(--op) * 0.85); }
        }
        .ob-star {
          position: absolute; border-radius: 9999px; background: white;
          animation: oBoardDrift var(--move-dur) ease-in-out var(--delay) infinite,
                     oBoardBlink var(--blink-dur) ease-in-out var(--blink-delay) infinite;
        }
      `}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {STARS.map(s => (
          <div key={s.id} className="ob-star" style={{
            left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size,
            "--op": s.opacity, "--move-dur": s.moveDur, "--blink-dur": s.blinkDur,
            "--delay": s.delay, "--blink-delay": s.blinkDelay,
            "--dx1": s.dx1, "--dy1": s.dy1, "--dx2": s.dx2, "--dy2": s.dy2,
          } as React.CSSProperties} />
        ))}
      </div>
    </>
  );
}

function CheckboxGroup({ options, selected, onChange }: { options: string[]; selected: string[]; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map(opt => {
        const active = selected.includes(opt);
        return (
          <motion.button key={opt} type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onChange(opt)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm font-medium transition-all duration-200 ${
              active
                ? "bg-accent/20 border-accent text-white"
                : "bg-white/5 border-white/15 text-white/70 hover:border-white/30 hover:bg-white/8"
            }`}
          >
            <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
              active ? "border-accent bg-accent" : "border-white/30"
            }`}>
              {active && <CheckCircle2 className="w-3 h-3 text-white" />}
            </span>
            {opt}
          </motion.button>
        );
      })}
    </div>
  );
}

function RadioGroup({ options, selected, onChange }: { options: string[]; selected: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map(opt => {
        const active = selected === opt;
        return (
          <motion.button key={opt} type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onChange(opt)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm font-medium transition-all duration-200 ${
              active
                ? "bg-accent/20 border-accent text-white"
                : "bg-white/5 border-white/15 text-white/70 hover:border-white/30 hover:bg-white/8"
            }`}
          >
            <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
              active ? "border-accent bg-accent" : "border-white/30"
            }`}>
              {active && <span className="w-2 h-2 rounded-full bg-white" />}
            </span>
            {opt}
          </motion.button>
        );
      })}
    </div>
  );
}

function InputField({ label, type = "text", value, onChange, placeholder, icon: Icon }: {
  label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string; icon?: React.ElementType;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-white/80">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-white/8 border border-white/15 rounded-xl py-3 ${Icon ? "pl-11 pr-4" : "px-4"} text-white placeholder-white/35 text-sm focus:outline-none focus:border-accent/60 focus:bg-white/12 transition-all duration-200`}
        />
      </div>
    </div>
  );
}

const sections = [
  { id: "company", icon: Building2, label: "Unternehmen" },
  { id: "contact", icon: User, label: "Kontakt" },
  { id: "platforms", icon: Globe, label: "Plattformen" },
  { id: "goals", icon: Target, label: "Ziele" },
  { id: "details", icon: BarChart3, label: "Details" },
  { id: "message", icon: MessageSquare, label: "Nachricht" },
];

export default function Onboarding() {
  const [form, setForm] = useState({
    company: "", industry: "", website: "",
    name: "", email: "", phone: "", position: "",
    platforms: [] as string[], currentFollowers: "",
    goals: [] as string[],
    size: "", budget: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const toggleArr = (k: "platforms" | "goals", v: string) =>
    set(k, form[k].includes(v) ? form[k].filter((x: string) => x !== v) : [...form[k], v]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setVideoOpen(true);
      setTimeout(() => {
        videoRef.current?.play();
      }, 300);
    }, 800);
  };

  const closeVideo = () => {
    setVideoOpen(false);
    videoRef.current?.pause();
  };

  return (
    <div className="min-h-screen bg-[#0a1628] relative overflow-hidden">
      <StarField />

      {/* Glow orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-accent/15 border border-accent/30 rounded-full px-5 py-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-accent text-sm font-semibold tracking-wide">Willkommen bei Bleibsichtbar</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
            Ihr persönliches<br />
            <span className="text-accent">Onboarding</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto leading-relaxed">
            Damit wir Ihre Zusammenarbeit optimal vorbereiten können, bitten wir Sie, die folgenden Informationen auszufüllen. Dies dauert nur wenige Minuten.
          </p>
        </motion.div>

        {/* Progress steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center gap-1 sm:gap-2 mb-12 flex-wrap"
        >
          {sections.map((s, i) => (
            <div key={s.id} className="flex items-center gap-1 sm:gap-2">
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
                <s.icon className="w-3.5 h-3.5 text-accent" />
                <span className="text-white/60 text-xs font-medium hidden sm:block">{s.label}</span>
              </div>
              {i < sections.length - 1 && <ChevronRight className="w-3 h-3 text-white/20 flex-shrink-0" />}
            </div>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              {/* Section 1: Company */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">Ihr Unternehmen</h2>
                    <p className="text-white/45 text-sm">Erzählen Sie uns von Ihrer Marke</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField label="Unternehmensname *" value={form.company} onChange={v => set("company", v)} placeholder="z.B. Mustermann GmbH" icon={Building2} />
                  <InputField label="Branche" value={form.industry} onChange={v => set("industry", v)} placeholder="z.B. E-Commerce, Gastronomie" />
                  <div className="sm:col-span-2">
                    <InputField label="Website" type="url" value={form.website} onChange={v => set("website", v)} placeholder="https://www.ihre-website.de" icon={Globe} />
                  </div>
                </div>
              </motion.div>

              {/* Section 2: Contact */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">Ihr Ansprechpartner</h2>
                    <p className="text-white/45 text-sm">Wer ist unser direkter Kontakt?</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField label="Vor- und Nachname *" value={form.name} onChange={v => set("name", v)} placeholder="Max Mustermann" icon={User} />
                  <InputField label="Position / Rolle" value={form.position} onChange={v => set("position", v)} placeholder="z.B. Geschäftsführer, Marketing" />
                  <InputField label="E-Mail-Adresse *" type="email" value={form.email} onChange={v => set("email", v)} placeholder="max@mustermann.de" icon={Mail} />
                  <InputField label="Telefonnummer" type="tel" value={form.phone} onChange={v => set("phone", v)} placeholder="+49 170 1234567" icon={Phone} />
                </div>
              </motion.div>

              {/* Section 3: Platforms */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">Social-Media-Plattformen</h2>
                    <p className="text-white/45 text-sm">Welche Kanäle nutzen oder möchten Sie nutzen?</p>
                  </div>
                </div>
                <CheckboxGroup options={PLATFORMS} selected={form.platforms} onChange={v => toggleArr("platforms", v)} />
                <div className="mt-5">
                  <InputField label="Aktuelle Follower-Anzahl (gesamt, ca.)" value={form.currentFollowers} onChange={v => set("currentFollowers", v)} placeholder="z.B. 500 auf Instagram, 200 auf Facebook" />
                </div>
              </motion.div>

              {/* Section 4: Goals */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">Ihre Ziele</h2>
                    <p className="text-white/45 text-sm">Was möchten Sie mit Social Media erreichen?</p>
                  </div>
                </div>
                <CheckboxGroup options={GOALS} selected={form.goals} onChange={v => toggleArr("goals", v)} />
              </motion.div>

              {/* Section 5: Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">Unternehmensgröße & Budget</h2>
                    <p className="text-white/45 text-sm">Helfen Sie uns, das passende Angebot zu erstellen</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-semibold text-white/80 mb-3">Anzahl der Mitarbeiter</p>
                    <RadioGroup options={SIZES} selected={form.size} onChange={v => set("size", v)} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/80 mb-3">Monatliches Budget für Social Media</p>
                    <RadioGroup options={BUDGETS} selected={form.budget} onChange={v => set("budget", v)} />
                  </div>
                </div>
              </motion.div>

              {/* Section 6: Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">Besondere Wünsche & Anmerkungen</h2>
                    <p className="text-white/45 text-sm">Was ist Ihnen noch wichtig?</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white/80">Ihre Nachricht (optional)</label>
                  <textarea
                    value={form.message}
                    onChange={e => set("message", e.target.value)}
                    rows={4}
                    placeholder="Haben Sie spezielle Anforderungen, Fragen oder Wünsche? Teilen Sie uns gerne alles mit..."
                    className="w-full bg-white/8 border border-white/15 rounded-xl p-4 text-white placeholder-white/35 text-sm focus:outline-none focus:border-accent/60 focus:bg-white/12 transition-all duration-200 resize-none"
                  />
                </div>
              </motion.div>

              {/* Submit */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="text-center pt-4"
              >
                <p className="text-white/45 text-sm mb-6">
                  Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Daten gemäß unserer{" "}
                  <a href="/datenschutz" className="text-accent hover:underline" target="_blank">Datenschutzerklärung</a> zu.
                </p>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.04, boxShadow: "0 12px 40px rgba(255,107,53,0.4)" }}
                  whileTap={{ scale: 0.97 }}
                  className="relative overflow-hidden px-12 py-4 rounded-full font-bold text-white text-lg"
                  style={{ background: "linear-gradient(135deg, #ff6b35 0%, #e8522a 100%)" }}
                >
                  <motion.span
                    className="absolute inset-0 -translate-x-full skew-x-12"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.4 }}
                  />
                  <span className="relative">Formular absenden →</span>
                </motion.button>
              </motion.div>
            </motion.form>
          ) : (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-center py-16"
            >
              {/* Success ring */}
              <div className="relative inline-flex items-center justify-center mb-10">
                <motion.div
                  className="absolute w-32 h-32 rounded-full border-2 border-green-400/30"
                  animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                />
                <motion.div
                  className="absolute w-32 h-32 rounded-full border-2 border-green-400/20"
                  animate={{ scale: [1, 1.4], opacity: [0.4, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-400 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-12 h-12 text-green-400" />
                </motion.div>
              </div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl sm:text-5xl font-bold text-white mb-4"
              >
                Vielen Dank!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="text-xl text-white/70 mb-3 max-w-lg mx-auto leading-relaxed"
              >
                Vielen Dank für Ihre Angaben.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-white/50 text-base max-w-xl mx-auto leading-relaxed"
              >
                Im folgenden Video erfahren Sie, was nach dem Onboarding als nächstes passiert und was Sie erwartet.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mt-8 inline-flex items-center gap-2 text-white/40 text-sm"
              >
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                Video wird geladen…
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Video Popup */}
      <AnimatePresence>
        {videoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(5,10,20,0.92)", backdropFilter: "blur(12px)" }}
            onClick={closeVideo}
          >
            <motion.div
              initial={{ scale: 0.85, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative w-full max-w-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Close */}
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                onClick={closeVideo}
                className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Glow behind video */}
              <div className="absolute -inset-4 bg-accent/15 rounded-3xl blur-2xl" />

              {/* Video card */}
              <div className="relative bg-[#0a1628] border border-white/15 rounded-2xl overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <Play className="w-4 h-4 text-accent" />
                    <span className="text-white/60 text-sm font-medium">Was passiert nach dem Onboarding?</span>
                  </div>
                </div>
                {/* Video */}
                <video
                  ref={videoRef}
                  src="/onboarding-video.mp4"
                  controls
                  autoPlay
                  playsInline
                  className="w-full aspect-video bg-black"
                  style={{ display: "block" }}
                />
              </div>

              <p className="text-center text-white/35 text-sm mt-4">
                Klicken Sie außerhalb des Videos, um zu schließen
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
