import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, ChevronRight, Palette, Users, Crosshair,
  Film, Camera, Search, ShieldOff, Target, Package,
  ShoppingBag, BookOpen, UserCheck, MessageCircle,
} from "lucide-react";

/* ---------- star field ---------- */
function rng(seed: number) {
  let x = seed;
  x = (((x >> 16) ^ x) * 0x45d9f3b) | 0;
  x = (((x >> 16) ^ x) * 0x45d9f3b) | 0;
  x = (x >> 16) ^ x;
  return Math.abs(x % 10000) / 10000;
}

/* 350 yıldız — katmanlı yoğunluk: referans görüntü gibi yoğun gece gökyüzü */
const STARS = Array.from({ length: 350 }, (_, i) => {
  const r = (s: number) => rng(i * 7919 + s * 104729);
  const tier = i < 180 ? 0 : i < 270 ? 1 : i < 320 ? 2 : 3; // 0=ince 1=küçük 2=orta 3=büyük
  const sizes  = [0.9, 1.6, 2.5, 3.8];
  const opBase = [0.30, 0.50, 0.70, 0.92];
  return {
    id: i, x: r(3) * 100, y: r(4) * 100,
    size: sizes[tier] + r(9) * sizes[tier] * 0.4,
    moveDur: `${20 + r(5) * 25}s`, blinkDur: `${1.8 + r(6) * 3.5}s`,
    delay: `-${r(7) * 30}s`, blinkDelay: `-${r(8) * 6}s`,
    opacity: opBase[tier] + r(9) * 0.2,
    dx1: `${(r(1) - 0.5) * 28}px`, dy1: `${(r(2) - 0.5) * 28}px`,
    dx2: `${(r(1) - 0.5) * -18}px`, dy2: `${(r(2) - 0.5) * 18}px`,
  };
});

/* Kayan yıldız bileşeni — her 5 sn'de bir yeni yıldız, farklı konum */
interface ShootingStar { id: number; x: number; y: number; angle: number; travel: number; len: number; }
let _sId = 0;
function spawnStar(): ShootingStar {
  const id = _sId++;
  const r = (s: number) => rng(id * 7919 + s * 104729);
  return { id, x: 3 + r(1) * 72, y: 2 + r(2) * 52, angle: 18 + r(3) * 30, travel: 260 + r(4) * 220, len: 110 + r(5) * 130 };
}

function ShootingStars() {
  const [stars, setStars] = useState<ShootingStar[]>(() => [spawnStar()]);
  useEffect(() => {
    const t = setInterval(() => setStars(prev => [...prev.slice(-4), spawnStar()]), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <>
      <style>{`
        @keyframes oShoot{
          0%  {opacity:0;transform:rotate(var(--ang)) translateX(0) scaleX(0.04)}
          8%  {opacity:1;transform:rotate(var(--ang)) translateX(0) scaleX(1)}
          88% {opacity:0.65;transform:rotate(var(--ang)) translateX(var(--tv)) scaleX(0.85)}
          100%{opacity:0;transform:rotate(var(--ang)) translateX(var(--tv)) scaleX(0.15)}
        }
        .oShoot{
          position:absolute;transform-origin:left center;border-radius:9999px;pointer-events:none;
          background:linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(200,220,255,0.6) 40%,rgba(255,255,255,0.95) 75%,white 100%);
          animation:oShoot 1.3s cubic-bezier(0.25,0.1,0.15,1) forwards;
        }
      `}</style>
      {stars.map(s => (
        <div key={s.id} className="oShoot" style={{
          left:`${s.x}%`, top:`${s.y}%`,
          width:`${s.len}px`, height:"1.8px",
          "--ang":`${s.angle}deg`, "--tv":`${s.travel}px`,
        } as React.CSSProperties}
          onAnimationEnd={() => setStars(p => p.filter(st => st.id !== s.id))}
        />
      ))}
    </>
  );
}

function StarField() {
  return (
    <>
      <style>{`
        @keyframes oBDrift{
          0%{transform:translate(0,0)}
          25%{transform:translate(var(--dx1),var(--dy2))}
          50%{transform:translate(var(--dx2),var(--dy1))}
          75%{transform:translate(var(--dx1),var(--dy2))}
          100%{transform:translate(0,0)}
        }
        @keyframes oBlink{
          0%,100%{opacity:var(--op)}
          40%{opacity:calc(var(--op)*0.4)}
          70%{opacity:calc(var(--op)*0.95)}
        }
        .obs{
          position:absolute;border-radius:9999px;background:white;
          animation:oBDrift var(--md) ease-in-out var(--dl) infinite,
                     oBlink var(--bd) ease-in-out var(--bld) infinite;
        }
      `}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {STARS.map(s => (
          <div key={s.id} className="obs" style={{
            left:`${s.x}%`, top:`${s.y}%`,
            width:`${s.size}px`, height:`${s.size}px`,
            "--op":s.opacity, "--md":s.moveDur, "--bd":s.blinkDur,
            "--dl":s.delay, "--bld":s.blinkDelay,
            "--dx1":s.dx1, "--dy1":s.dy1, "--dx2":s.dx2, "--dy2":s.dy2,
          } as React.CSSProperties}/>
        ))}
      </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ShootingStars />
      </div>
    </>
  );
}

/* ---------- reusable option button (radio style) ---------- */
function OptionBtn({ label, active, onClick, multi }: {
  label: string; active: boolean; onClick: () => void; multi?: boolean;
}) {
  return (
    <motion.button
      type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-5 py-3.5 rounded-2xl border text-left text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-white/10 border-white/40 text-white"
          : "bg-transparent border-white/15 text-white/70 hover:border-white/28 hover:bg-white/5"
      }`}
    >
      <span className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
        active ? "border-white/80" : "border-white/30"
      }`}>
        {active && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
      </span>
      <span>{label}</span>
    </motion.button>
  );
}

function OptionGrid({ options, selected, onChange, multi }: {
  options: string[]; selected: string | string[]; onChange: (v: string) => void; multi?: boolean;
}) {
  const isSelected = (opt: string) =>
    multi ? (selected as string[]).includes(opt) : selected === opt;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map(opt => (
        <OptionBtn key={opt} label={opt} active={isSelected(opt)} onClick={() => onChange(opt)} multi={multi} />
      ))}
    </div>
  );
}

function TextArea({ value, onChange, placeholder, required }: {
  value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean;
}) {
  return (
    <textarea
      value={value} rows={3} required={required}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white/5 border border-white/15 rounded-2xl px-5 py-4 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/35 focus:bg-white/8 transition-all duration-200 resize-none"
    />
  );
}

function TextInput({ value, onChange, placeholder, required }: {
  value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean;
}) {
  return (
    <input
      type="text" value={value} required={required}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white/5 border border-white/15 rounded-2xl px-5 py-3.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/35 focus:bg-white/8 transition-all duration-200"
    />
  );
}

/* ---------- section wrapper ---------- */
function Section({ icon: Icon, color, title, subtitle, children }: {
  icon: React.ElementType; color: string; title: string; subtitle: string; children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5 }}
      className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 mb-7">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-white font-bold text-lg leading-tight">{title}</h2>
          <p className="text-white/40 text-sm">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-7">{children}</div>
    </motion.div>
  );
}

function QLabel({ n, text, required }: { n: number; text: string; required?: boolean }) {
  return (
    <div className="flex items-start gap-2 mb-3">
      <span className="text-white/30 text-xs font-bold mt-0.5 w-5 flex-shrink-0">{n}.</span>
      <p className="text-white/85 text-sm font-semibold leading-snug">
        {text}{required && <span className="text-orange-400 ml-1">*</span>}
      </p>
    </div>
  );
}

/* ---------- main component ---------- */
export default function Onboarding() {
  const [f, setF] = useState({
    q0: "",                    // Unternehmensname
    q1: [] as string[],        // Corporate Design Ja/Nein
    q2: [] as string[],        // Marke wirken (multi)
    q2sonstiges: "",
    q3: [] as string[],        // Tonalität (multi)
    q4: "",                    // Zielgruppe textarea
    q5: [] as string[],        // neue Zielgruppe Ja/Nein
    q5detail: "",
    q6: "",                    // Konkurrenz
    q7: "",                    // Warum kaufen
    q8: [] as string[],        // Content-Richtung (multi)
    q9: "",                    // No-Gos
    q10: "",                   // hervorheben
    q11: "" as string,         // Kamera Ja/Nein
    q12: [] as string[],       // offen für (multi)
    q13: "",                   // Accounts
    q15: "",                   // vermeiden
    q16: [] as string[],       // Priorität (multi)
    q17: "",                   // Produkte pushen
    q18: "" as string,         // Fotos/Videos Ja/Nein
    q18detail: "",
    q19: "" as string,         // Materialien Ja/Nein
    q20: "",                   // meistverkauftes Produkt
    q21: "",                   // Kundenfragen
    q22: "",                   // Markenstory
    q23: "",                   // Slogans
    q24: "",                   // Ansprechpartner
    q25: "",                   // Sonstiges
  });
  const [submitted, setSubmitted] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const set = (k: string, v: unknown) => setF(p => ({ ...p, [k]: v }));
  const toggleMulti = (k: string, v: string) => {
    const arr = (f as Record<string, string[]>)[k];
    set(k, arr.includes(v) ? arr.filter((x: string) => x !== v) : [...arr, v]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: f.q0 || "Unbekannt",
          ansprechpartner: f.q24 || null,
          data: f,
        }),
      });
    } catch (_) {}
    setTimeout(() => {
      setVideoOpen(true);
      setTimeout(() => videoRef.current?.play(), 300);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#060d1f] relative overflow-hidden">
      {/* Atmosferik gradient — referans gibi üstten aydınlık */}
      <div className="absolute inset-0 pointer-events-none" style={{background:"radial-gradient(ellipse 110% 60% at 50% 0%,#1a3a6e 0%,#0d1f42 30%,#060d1f 70%)"}} />
      <StarField />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-24">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/30 rounded-full px-5 py-2 mb-8">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-orange-400 text-sm font-semibold tracking-wide">🚀 BleibSichtbar – Onboarding</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
            Ihr persönliches<br /><span className="text-orange-400">Onboarding</span>
          </h1>
          <p className="text-white/55 text-base max-w-xl mx-auto leading-relaxed">
            Damit wir Ihre Betreuung optimal vorbereiten können, bitten wir Sie, die folgenden Fragen zu beantworten. Mit <span className="text-orange-400">*</span> markierte Felder sind Pflichtfelder.
          </p>
        </motion.div>

        {/* Welcome info block */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mb-10 bg-white/[0.04] border border-white/10 rounded-2xl p-7 sm:p-9 backdrop-blur-sm relative overflow-hidden"
        >
          {/* subtle accent line */}
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-gradient-to-b from-orange-400 via-orange-500 to-orange-400/30" />

          <motion.h3
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-white font-bold text-xl mb-5 pl-4"
          >
            Willkommen bei Bleibsichtbar! 🚀
          </motion.h3>

          <div className="pl-4 space-y-4">
            {[
              "In diesem Formular finden Sie unseren Onboarding-Fragebogen. Bitte nehmen Sie sich einen Moment Zeit, um alle Pflichtfelder vollständig auszufüllen, so können wir optimal auf Ihre Wünsche und Ziele eingehen.",
              "Sollten Sie bei einzelnen Fragen unsicher sein oder Unterstützung benötigen, zögern Sie bitte nicht, uns jederzeit zu kontaktieren. Wir helfen Ihnen gerne weiter.",
              "Wir freuen uns auf die Zusammenarbeit! 🎯",
            ].map((text, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.15 }}
                className={`text-sm leading-relaxed ${i === 2 ? "text-orange-400 font-semibold" : "text-white/60"}`}
              >
                {text}
              </motion.p>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, delay: 0.2 }} onSubmit={handleSubmit} className="space-y-6">

              {/* ── 0. Unternehmensname ── */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
                <p className="text-white/85 text-sm font-semibold leading-snug mb-3">
                  Wie heißt Ihr Unternehmen oder Ihre Marke?<span className="text-orange-400 ml-1">*</span>
                </p>
                <TextInput value={f.q0} onChange={v => set("q0", v)} placeholder="Ihr Unternehmens- oder Markenname …" required />
              </motion.div>

              {/* ── 1. Marke & Wirkung ── */}
              <Section icon={Palette} color="bg-purple-500/20 text-purple-300" title="1. Marke & Wirkung" subtitle="Wie soll Ihre Marke auftreten?">
                <div>
                  <QLabel n={1} text="Gibt es ein bestehendes Corporate Design? (Logo, Farben, Schriftarten etc.)" required />
                  <OptionGrid options={["Ja (bitte zusenden)", "Nein"]} selected={f.q1} onChange={v => toggleMulti("q1", v)} multi />
                </div>
                <div>
                  <QLabel n={2} text="Wie soll Ihre Marke wirken?" required />
                  <OptionGrid options={["seriös", "modern", "premium", "jung", "humorvoll"]} selected={f.q2} onChange={v => toggleMulti("q2", v)} multi />
                </div>
                <div>
                  <QLabel n={3} text="Welche Tonalität wünschen Sie sich?" required />
                  <OptionGrid options={["professionell", "locker", "verkaufsorientiert", "informativ", "emotional"]} selected={f.q3} onChange={v => toggleMulti("q3", v)} multi />
                </div>
              </Section>

              {/* ── 2. Zielgruppe ── */}
              <Section icon={Users} color="bg-blue-500/20 text-blue-300" title="2. Zielgruppe" subtitle="Wen möchten Sie erreichen?">
                <div>
                  <QLabel n={4} text="Wer ist Ihre aktuelle Zielgruppe? (Alter, Geschlecht, Kurzbeschreibung)" required />
                  <TextArea value={f.q4} onChange={v => set("q4", v)} placeholder="z. B. Frauen 25–45, berufstätig, interessiert an Lifestyle & Mode …" required />
                </div>
                <div>
                  <QLabel n={5} text="Möchten Sie eine neue Zielgruppe erreichen?" required />
                  <p className="text-white/40 text-xs mb-3 -mt-1 pl-7">(Falls ja, welche?)</p>
                  <OptionGrid
                    options={["Ja → welche?", "Wir möchten unsere bisherige Zielgruppe weiterhin ansprechen"]}
                    selected={f.q5} onChange={v => toggleMulti("q5", v)} multi
                  />
                  {f.q5.includes("Ja → welche?") && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 overflow-hidden">
                      <TextInput value={f.q5detail} onChange={v => set("q5detail", v)} placeholder="Neue Zielgruppe beschreiben …" />
                    </motion.div>
                  )}
                </div>
              </Section>

              {/* ── 3. Positionierung ── */}
              <Section icon={Crosshair} color="bg-green-500/20 text-green-300" title="3. Positionierung" subtitle="Was macht Sie einzigartig?">
                <div>
                  <QLabel n={6} text="Was unterscheidet Sie von Ihrer Konkurrenz?" required />
                  <TextArea value={f.q6} onChange={v => set("q6", v)} placeholder="Unser Alleinstellungsmerkmal ist …" required />
                </div>
                <div>
                  <QLabel n={7} text="Warum sollten Kunden genau bei Ihnen kaufen?" />
                  <TextArea value={f.q7} onChange={v => set("q7", v)} placeholder="Bei uns kaufen Kunden, weil …" />
                </div>
              </Section>

              {/* ── 4. Content-Richtung ── */}
              <Section icon={Film} color="bg-pink-500/20 text-pink-300" title="4. Content-Richtung" subtitle="Welche Inhalte passen zu Ihnen?">
                <div>
                  <QLabel n={8} text="Welche Inhalte gefallen Ihnen besonders?" />
                  <OptionGrid options={["Reels / Videos", "Bilder / Carousels", "informative Inhalte", "Verkaufsposts", "Humor / Trends"]} selected={f.q8} onChange={v => toggleMulti("q8", v)} multi />
                </div>
                <div>
                  <QLabel n={9} text="Gibt es Inhalte oder Dinge, die Sie nicht möchten? (No-Gos)" />
                  <TextArea value={f.q9} onChange={v => set("q9", v)} placeholder="Wir möchten keinesfalls …" />
                </div>
                <div>
                  <QLabel n={10} text="Gibt es Themen, Produkte oder Aussagen, die wir häufig hervorheben sollen?" required />
                  <TextArea value={f.q10} onChange={v => set("q10", v)} placeholder="Besonders wichtig für uns ist …" required />
                </div>
              </Section>

              {/* ── 5. Kamera & Stil ── */}
              <Section icon={Camera} color="bg-yellow-500/20 text-yellow-300" title="5. Kamera & Stil" subtitle="Auftreten vor der Kamera">
                <div>
                  <QLabel n={11} text="Wären Sie oder Ihr Team bereit, vor die Kamera zu gehen?" />
                  <OptionGrid options={["Ja", "Nein"]} selected={f.q11} onChange={v => set("q11", v === f.q11 ? "" : v)} />
                </div>
                <div>
                  <QLabel n={12} text="Sind Sie offen für …?" required />
                  <OptionGrid options={["humorvolle Inhalte", "Trends / virale Videos"]} selected={f.q12} onChange={v => toggleMulti("q12", v)} multi />
                </div>
              </Section>

              {/* ── 6. Inspiration & Konkurrenz ── */}
              <Section icon={Search} color="bg-cyan-500/20 text-cyan-300" title="6. Inspiration & Konkurrenz" subtitle="Referenzen und Mitbewerber">
                <div>
                  <QLabel n={13} text="Nennen Sie 1–3 Accounts, die Ihnen gefallen" required />
                  <TextArea value={f.q13} onChange={v => set("q13", v)} placeholder="z. B. @beispiel1, @beispiel2 – weil …" required />
                </div>
              </Section>

              {/* ── 7. Grenzen & Sensibilität ── */}
              <Section icon={ShieldOff} color="bg-red-500/20 text-red-300" title="7. Grenzen & Sensibilität" subtitle="Was soll vermieden werden?">
                <div>
                  <QLabel n={15} text="Gibt es Themen, Wörter oder Zielgruppen, die wir vermeiden sollen?" />
                  <TextArea value={f.q15} onChange={v => set("q15", v)} placeholder="Wir möchten folgendes unbedingt vermeiden: …" />
                </div>
              </Section>

              {/* ── 8. Fokus & Priorität ── */}
              <Section icon={Target} color="bg-orange-500/20 text-orange-300" title="8. Fokus & Priorität" subtitle="Was ist am wichtigsten?">
                <div>
                  <QLabel n={16} text="Was hat für Sie oberste Priorität?" required />
                  <OptionGrid options={["Verkäufe", "Reichweite", "Vertrauen", "Branding", "Reservierungen", "Buchungen", "Kontaktanfragen"]} selected={f.q16} onChange={v => toggleMulti("q16", v)} multi />
                </div>
                <div>
                  <QLabel n={17} text="Welche Produkte/Dienstleistungen sollen besonders gepusht werden?" />
                  <TextArea value={f.q17} onChange={v => set("q17", v)} placeholder="Diese Produkte / Angebote sollen im Fokus stehen: …" />
                </div>
              </Section>

              {/* ── 9. Inhalte & Material ── */}
              <Section icon={Package} color="bg-indigo-500/20 text-indigo-300" title="9. Inhalte & Material" subtitle="Vorhandenes Material">
                <div>
                  <QLabel n={18} text="Haben Sie Fotos/Videos, die wir nutzen können?" required />
                  <OptionGrid options={["Ja (bitte zusenden)", "Nein – haben Sie bereits einen Content-Tag gebucht?"]} selected={f.q18} onChange={v => set("q18", v === f.q18 ? "" : v)} />
                  {f.q18 === "Nein – haben Sie bereits einen Content-Tag gebucht?" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 overflow-hidden">
                      <TextInput value={f.q18detail} onChange={v => set("q18detail", v)} placeholder="Details zum Content-Tag …" />
                    </motion.div>
                  )}
                </div>
                <div>
                  <QLabel n={19} text="Haben Sie zusätzliche Materialien? (z. B. Menükarte, Leistungen, Angebote etc.)" required />
                  <OptionGrid options={["Ja (bitte zusenden)", "Nein"]} selected={f.q19} onChange={v => set("q19", v === f.q19 ? "" : v)} />
                </div>
              </Section>

              {/* ── 10. Kundenverständnis ── */}
              <Section icon={ShoppingBag} color="bg-teal-500/20 text-teal-300" title="10. Kundenverständnis" subtitle="Was Ihre Kunden wollen">
                <div>
                  <QLabel n={20} text="Was ist Ihr meistverkauftes Produkt/Dienstleistung?" required />
                  <TextArea value={f.q20} onChange={v => set("q20", v)} placeholder="Unser Bestseller ist …" required />
                </div>
                <div>
                  <QLabel n={21} text="Welche Fragen stellen Kunden vor dem Kauf am häufigsten?" required />
                  <TextArea value={f.q21} onChange={v => set("q21", v)} placeholder="Häufige Fragen sind z. B. …" required />
                </div>
              </Section>

              {/* ── 11. Marke & Kommunikation ── */}
              <Section icon={BookOpen} color="bg-violet-500/20 text-violet-300" title="11. Marke & Kommunikation" subtitle="Ihre Markenbotschaft">
                <div>
                  <QLabel n={22} text="Gibt es eine Markenstory oder Hintergrundgeschichte?" />
                  <TextArea value={f.q22} onChange={v => set("q22", v)} placeholder="Unsere Geschichte begann …" />
                </div>
                <div>
                  <QLabel n={23} text="Gibt es feste Slogans oder Botschaften, die wir verwenden sollen?" />
                  <TextArea value={f.q23} onChange={v => set("q23", v)} placeholder="Unser Slogan lautet …" />
                </div>
              </Section>

              {/* ── 12. Organisation ── */}
              <Section icon={UserCheck} color="bg-sky-500/20 text-sky-300" title="12. Organisation" subtitle="Ansprechpartner & Freigaben">
                <div>
                  <QLabel n={24} text="Wer ist Ansprechpartner für Feedback & Freigaben?" />
                  <p className="text-white/40 text-xs mb-3 -mt-1 pl-7">(Bitte Vorname/Name und Telefonnummer angeben)</p>
                  <TextInput value={f.q24} onChange={v => set("q24", v)} placeholder="Name, E-Mail, Telefon …" />
                </div>
              </Section>

              {/* ── 13. Optional ── */}
              <Section icon={MessageCircle} color="bg-rose-500/20 text-rose-300" title="13. Sonstiges" subtitle="Gibt es noch etwas Wichtiges?">
                <div>
                  <QLabel n={25} text="Gibt es noch etwas, das wir unbedingt beachten sollten?" required />
                  <TextArea value={f.q25} onChange={v => set("q25", v)} placeholder="Wichtig für uns ist außerdem …" required />
                </div>
              </Section>

              {/* Submit */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center pt-4">
                <p className="text-white/35 text-sm mb-6">
                  Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Daten gemäß unserer{" "}
                  <a href="/datenschutz" className="text-orange-400 hover:underline" target="_blank">Datenschutzerklärung</a> zu.
                </p>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.04, boxShadow: "0 12px 40px rgba(255,107,53,0.4)" }}
                  whileTap={{ scale: 0.97 }}
                  className="relative overflow-hidden px-14 py-4 rounded-full font-bold text-white text-lg"
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
            /* ── success state ── */
            <motion.div key="thanks" initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }} className="text-center py-20">
              <div className="relative inline-flex items-center justify-center mb-10">
                {[0, 0.6].map(d => (
                  <motion.div key={d} className="absolute w-32 h-32 rounded-full border-2 border-green-400/30"
                    animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: d }} />
                ))}
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-400 flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-400" />
                </motion.div>
              </div>
              <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Vielen Dank!
              </motion.h2>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="text-xl text-white/65 mb-3 max-w-lg mx-auto leading-relaxed">
                Vielen Dank für Ihre Angaben.
              </motion.p>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="text-white/45 text-base max-w-xl mx-auto leading-relaxed">
                Im folgenden Video erfahren Sie, was nach dem Onboarding als nächstes passiert und was Sie erwartet.
              </motion.p>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-6 inline-flex items-center gap-2 text-white/30 text-sm">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                Video wird geöffnet…
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Video popup ── */}
      <AnimatePresence>
        {videoOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(5,10,20,0.93)", backdropFilter: "blur(14px)" }}
            onClick={() => { setVideoOpen(false); videoRef.current?.pause(); }}>
            <motion.div initial={{ scale: 0.85, y: 40, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative w-full max-w-2xl"
              onClick={e => e.stopPropagation()}>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                onClick={() => { setVideoOpen(false); videoRef.current?.pause(); }}
                className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors">
                ✕
              </motion.button>
              <div className="absolute -inset-4 bg-orange-500/12 rounded-3xl blur-2xl" />
              <div className="relative bg-[#0d1f3c] border border-white/15 rounded-2xl overflow-hidden shadow-2xl">
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/10">
                  <div className="flex gap-1.5">
                    {["bg-red-500/70","bg-yellow-500/70","bg-green-500/70"].map(c => <div key={c} className={`w-3 h-3 rounded-full ${c}`} />)}
                  </div>
                  <span className="text-white/50 text-sm font-medium ml-2">Was passiert nach dem Onboarding?</span>
                </div>
                <video ref={videoRef} src="/onboarding-video.mp4" controls autoPlay playsInline className="w-full aspect-video bg-black block" />
              </div>
              <p className="text-center text-white/30 text-sm mt-4">Klicken Sie außerhalb des Videos, um zu schließen</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
