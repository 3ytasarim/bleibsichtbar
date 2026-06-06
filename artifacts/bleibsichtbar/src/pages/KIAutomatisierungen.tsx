import React from "react";
import { SeoHead } from "@/hooks/useSeoPage";
import { Link } from "wouter";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedHeroBackground, heroFadeUp } from "@/components/shared/AnimatedHero";
import { useT } from "@/i18n";
import { Brain, Bot, Zap, MessageSquare, RefreshCw, BarChart3, CheckCircle2, ArrowRight, Settings } from "lucide-react";

// ─── Floating AI Brand Icons ─────────────────────────────────────────────────
const AI_TOOLS = [
  {
    name: "OpenAI",
    bg: "#000000",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-[20%]">
        <path d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 004.981 4.18a5.985 5.985 0 00-3.998 2.9 6.046 6.046 0 00.743 7.097 5.98 5.98 0 00.51 4.911 6.051 6.051 0 006.515 2.9A5.985 5.985 0 0013.26 24a6.056 6.056 0 005.772-4.206 5.99 5.99 0 003.997-2.9 6.056 6.056 0 00-.747-7.073zM13.26 22.43a4.476 4.476 0 01-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 00.392-.681v-6.737l2.02 1.168a.071.071 0 01.038.052v5.583a4.504 4.504 0 01-4.494 4.494zM3.6 18.304a4.47 4.47 0 01-.535-3.014l.142.085 4.783 2.759a.771.771 0 00.78 0l5.843-3.369v2.332a.08.08 0 01-.032.067L9.74 19.95a4.5 4.5 0 01-6.14-1.646zM2.34 7.896a4.485 4.485 0 012.366-1.973V11.6a.766.766 0 00.388.676l5.815 3.355-2.02 1.168a.076.076 0 01-.071 0L3.86 13.944a4.504 4.504 0 01-1.52-6.048zM19.05 12.859l-5.843-3.369 2.02-1.168a.076.076 0 01.071 0l4.957 2.863a4.504 4.504 0 01-.696 8.124V13.54a.795.795 0 00-.509-.681zm2.008-3.01l-.142-.085-4.778-2.759a.776.776 0 00-.785 0L10.51 10.37V8.038a.08.08 0 01.032-.067l4.878-2.813a4.5 4.5 0 016.638 4.666zm-12.64 4.135l-2.02-1.167a.08.08 0 01-.038-.053V7.181a4.5 4.5 0 017.375-3.453l-.142.08-4.778 2.758a.795.795 0 00-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
      </svg>
    ),
    x: "6%", y: "18%", size: 60, delay: 0, dur: 5.8, rotRange: [-5, 4], ampY: 13, opacity: 0.88,
  },
  {
    name: "Claude",
    bg: "linear-gradient(135deg, #cc785c 0%, #d97757 100%)",
    icon: (
      // Anthropic wordmark "A" shape
      <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-[18%]">
        <path d="M13.83 3.52h3.6L24 20.52h-3.6l-1.44-3.84H9.04l-1.44 3.84H4L10.17 3.52h3.66zM11.1 13.68h5.8l-2.9-7.75-2.9 7.75zM0.87 3.52h3.6l3.6 9.6-1.8 4.8L0.87 3.52z" />
      </svg>
    ),
    x: "88%", y: "14%", size: 54, delay: 0.9, dur: 6.4, rotRange: [4, -3], ampY: 11, opacity: 0.82,
  },
  {
    name: "Gemini",
    bg: "linear-gradient(135deg, #4285F4 0%, #34A853 50%, #FBBC05 75%, #EA4335 100%)",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-[20%]">
        <path d="M12 24A14.304 14.304 0 000 12 14.304 14.304 0 0012 0a14.305 14.305 0 0012 12 14.305 14.305 0 00-12 12"/>
      </svg>
    ),
    x: "4%", y: "60%", size: 50, delay: 1.5, dur: 7.1, rotRange: [-4, 5], ampY: 10, opacity: 0.78,
  },
  {
    name: "DeepSeek",
    bg: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-[20%]">
        <path d="M23.748 15.573c-.21-.48-.57-.964-1.082-1.456-.813-.766-1.727-1.245-2.498-1.516l-.011-.003c.2-.31.365-.636.493-.978.288-.769.326-1.51.112-2.138-.22-.641-.717-1.15-1.47-1.49-.695-.32-1.565-.47-2.551-.47a13.1 13.1 0 00-2.61.273c-.064-.16-.126-.3-.186-.435a7.624 7.624 0 00-.357-.688c-.433-.733-.966-1.096-1.582-1.075-.516.016-1.063.302-1.682.877-.29.27-.614.626-.974 1.07a14.06 14.06 0 00-1.316-.067c-1.518 0-2.974.37-4.207 1.07C2.098 9.273 1 10.7 1 12.46c0 .666.163 1.37.505 2.015.328.625.808 1.197 1.44 1.695a9.04 9.04 0 003.003 1.68 13.5 13.5 0 004.005.597c1.054 0 2.071-.12 3.005-.352.626.458 1.253.818 1.864 1.066.856.344 1.705.45 2.502.318.813-.135 1.492-.505 1.997-1.072.488-.547.774-1.244.884-2.066l.003-.024c.384-.09.742-.2 1.067-.325a6.6 6.6 0 001.413-.762c.764-.563 1.19-1.2 1.256-1.855.04-.395-.062-.789-.196-1.102zM8.92 14.3a1.5 1.5 0 11-.001-3.001A1.5 1.5 0 018.92 14.3zm6.16 0a1.5 1.5 0 11-.001-3.001A1.5 1.5 0 0115.08 14.3z"/>
      </svg>
    ),
    x: "91%", y: "56%", size: 46, delay: 2.2, dur: 5.9, rotRange: [5, -4], ampY: 14, opacity: 0.72,
  },
  {
    name: "Mistral",
    bg: "linear-gradient(135deg, #ff7000 0%, #ff9a00 100%)",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-[18%]">
        <rect x="0" y="0" width="7" height="7" rx="1"/>
        <rect x="8.5" y="0" width="7" height="7" rx="1"/>
        <rect x="17" y="0" width="7" height="7" rx="1"/>
        <rect x="0" y="8.5" width="7" height="7" rx="1"/>
        <rect x="17" y="8.5" width="7" height="7" rx="1"/>
        <rect x="8.5" y="17" width="7" height="7" rx="1"/>
        <rect x="17" y="17" width="7" height="7" rx="1"/>
      </svg>
    ),
    x: "13%", y: "80%", size: 42, delay: 0.5, dur: 6.7, rotRange: [-3, 4], ampY: 9, opacity: 0.65,
  },
  {
    name: "Grok",
    bg: "#000000",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-[22%]">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    x: "82%", y: "80%", size: 38, delay: 1.8, dur: 7.5, rotRange: [3, -4], ampY: 10, opacity: 0.58,
  },
  {
    name: "Meta AI",
    bg: "linear-gradient(135deg, #0082fb 0%, #00b4ff 100%)",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-[20%]">
        <path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973.63 2.684 2.373 4.579 4.566 4.579 1.578 0 3.071-.873 4.528-2.68.697-.87 1.44-2.04 2.215-3.497l.537-.95.534.948c.74 1.31 1.494 2.487 2.196 3.368C16.025 20.148 17.59 21 19.022 21c2.274 0 4.011-1.85 4.558-4.538.145-.606.42-2.094.42-2.094v-.013c0-2.545-.69-5.215-1.919-7.213-1.233-2.008-3.007-3.112-4.94-3.112-1.586 0-3.052.837-4.58 2.727-.47.578-.95 1.261-1.44 2.015a19.051 19.051 0 00-1.39-1.932C8.084 4.91 7.572 4.03 6.915 4.03zm8.707 10.62c-.493.955-1.023 1.791-1.538 2.41-1.28 1.554-2.439 2.19-3.427 2.19-1.094 0-2.12-.879-2.958-2.535-.8-1.582-1.215-3.583-1.215-5.555 0-1.886.467-3.83 1.284-5.295.747-1.33 1.738-2.153 2.79-2.153 1.022 0 2.024.738 2.961 2.137.497.735.99 1.699 1.471 2.82l.238.554-.294.506c-.456.79-.877 1.63-1.255 2.504l-.223.515.259.49c.44.83.884 1.506 1.324 2.012l.583.4z"/>
      </svg>
    ),
    x: "46%", y: "88%", size: 36, delay: 2.7, dur: 6.9, rotRange: [-5, 5], ampY: 12, opacity: 0.52,
  },
  {
    name: "Perplexity",
    bg: "linear-gradient(135deg, #20b2aa 0%, #00c9a0 100%)",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-[20%]">
        <path d="M22.069 6.85L12.606.598a1.144 1.144 0 00-1.212 0L1.931 6.85a1.144 1.144 0 00-.531.974v8.352c0 .405.213.779.531.974l9.463 6.252c.385.254.827.254 1.212 0l9.463-6.252a1.12 1.12 0 00.531-.974V7.824a1.12 1.12 0 00-.531-.974zM12 15.75L5.25 12 12 8.25 18.75 12 12 15.75z"/>
      </svg>
    ),
    x: "2%", y: "38%", size: 34, delay: 3.2, dur: 8.1, rotRange: [4, -4], ampY: 8, opacity: 0.48,
  },
];

function FloatingAIIcons() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {AI_TOOLS.map((tool) => (
        <motion.div
          key={tool.name}
          className="absolute select-none"
          style={{
            left: tool.x,
            top: tool.y,
            width: tool.size,
            height: tool.size,
            opacity: tool.opacity,
          }}
          animate={{
            y: [0, -tool.ampY, 0, tool.ampY * 0.6, 0],
            rotate: [tool.rotRange[0], tool.rotRange[1], tool.rotRange[0]],
          }}
          transition={{
            duration: tool.dur,
            repeat: Infinity,
            delay: tool.delay,
            ease: "easeInOut",
          }}
        >
          <div
            className="w-full h-full rounded-2xl shadow-lg flex items-center justify-center"
            style={{ background: tool.bg, boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}
          >
            {tool.icon}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Audio Demo Section ───────────────────────────────────────────────────────
const VOICE_AGENTS = [
  { industry: "Immobilien",       name: "Lukas",  desc: "Schnell, professionell und lead-orientiert",         grad: "linear-gradient(135deg,#f97316,#ef4444)" },
  { industry: "Friseursalon",     name: "Anna",   desc: "Freundlich, hilfsbereit und terminorientiert",       grad: "linear-gradient(135deg,#a855f7,#ec4899)" },
  { industry: "Anwaltskanzlei",   name: "Jonas",  desc: "Professionell, respektvoll und sorgfältig",          grad: "linear-gradient(135deg,#3b82f6,#6366f1)" },
  { industry: "Zahnarztpraxis",   name: "Sophie", desc: "Ruhig, klar und vertrauensvoll",                     grad: "linear-gradient(135deg,#06b6d4,#3b82f6)" },
  { industry: "Arztpraxis",       name: "Laura",  desc: "Professionell, ruhig und organisiert",               grad: "linear-gradient(135deg,#10b981,#06b6d4)" },
  { industry: "Steuerberater",    name: "Felix",  desc: "Strukturiert, klar und detailorientiert",            grad: "linear-gradient(135deg,#f59e0b,#f97316)" },
  { industry: "Kosmetikstudio",   name: "Clara",  desc: "Sanft, gepflegt und kundenorientiert",               grad: "linear-gradient(135deg,#ec4899,#a855f7)" },
  { industry: "Handwerker",       name: "Max",    desc: "Offen, praktisch und lösungsorientiert",             grad: "linear-gradient(135deg,#64748b,#3b82f6)" },
  { industry: "Kundenservice",    name: "Marie",  desc: "Genau, klar und lösungsorientiert",                  grad: "linear-gradient(135deg,#22c55e,#10b981)" },
  { industry: "Vertrieb",         name: "Leon",   desc: "Selbstbewusst, freundlich und verkaufsorientiert",   grad: "linear-gradient(135deg,#f97316,#f59e0b)" },
  { industry: "Ästhetische Klinik", name: "Emilia", desc: "Premium, ruhig und vertrauensbildend",             grad: "linear-gradient(135deg,#ec4899,#f97316)" },
  { industry: "Terminverwaltung", name: "Lena",   desc: "Organisiert, freundlich und kalenderorientiert",     grad: "linear-gradient(135deg,#8b5cf6,#ec4899)" },
];

function PlayWave({ playing }: { playing: boolean }) {
  const h = [5, 9, 14, 9, 5];
  if (!playing) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, height: 16 }}>
      {h.map((ht, i) => (
        <motion.div key={i}
          animate={{ scaleY: [1, 1.8, 0.6, 1.4, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.14, ease: "easeInOut" }}
          style={{ width: 2.5, height: ht, borderRadius: 2, background: "rgba(249,115,22,0.9)", transformOrigin: "center" }}
        />
      ))}
    </div>
  );
}

function AgentCard({ agent, playing, onToggle }: { agent: typeof VOICE_AGENTS[0]; playing: boolean; onToggle: () => void }) {
  return (
    <div
      style={{
        background: playing ? "rgba(249,115,22,0.07)" : "rgba(255,255,255,0.04)",
        border: playing ? "1px solid rgba(249,115,22,0.35)" : "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12, padding: "12px 14px",
        display: "flex", alignItems: "center", gap: 12,
        cursor: "pointer", transition: "all 0.2s ease",
      }}
      onClick={onToggle}
    >
      <div style={{
        width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
        background: agent.grad,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 800, fontSize: 15, color: "white",
        boxShadow: playing ? "0 0 14px rgba(249,115,22,0.5)" : "none",
      }}>
        {agent.name[0]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 1 }}>
          {agent.industry}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 2 }}>{agent.name}</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", lineHeight: 1.3 }}>{agent.desc}</div>
      </div>
      <div style={{
        width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
        background: playing ? "rgba(249,115,22,0.25)" : "rgba(255,255,255,0.10)",
        border: playing ? "1px solid rgba(249,115,22,0.6)" : "1px solid rgba(255,255,255,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.2s ease",
      }}>
        {playing
          ? <PlayWave playing />
          : <div style={{ width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: "8px solid rgba(255,255,255,0.7)", marginLeft: 2 }} />
        }
      </div>
    </div>
  );
}

function AudioDemoSection({ ki }: { ki: any }) {
  const [playingIdx, setPlayingIdx] = React.useState<number | null>(null);
  const toggle = (i: number) => setPlayingIdx(prev => prev === i ? null : i);
  return (
    <section className="py-20 relative overflow-hidden" style={{ background: "#060d1f" }}>
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 65%)" }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-[380px_1fr] gap-12 items-start">
          {/* Left */}
          <div className="lg:sticky lg:top-24">
            <span style={{ display: "inline-block", border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.6)", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", borderRadius: 4, padding: "3px 10px", marginBottom: 20 }}>
              Audio-Demos
            </span>
            <h2 className="font-display font-bold leading-tight text-white mb-5" style={{ fontSize: "clamp(26px,3.5vw,38px)" }}>
              Hören Sie, wie Bleibsichtbar Anrufe beantworten könnte für{" "}
              <span style={{ color: "#60a5fa" }}>verschiedene Unternehmen.</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.7 }}>
              Dies sind Demo-Beispiele. Jeder KI Voice Agent wird individuell für das jeweilige Unternehmen entwickelt – mit spezifischen Dienstleistungen, Kundenfragen, Tonfall und Workflow.
            </p>
          </div>
          {/* Right: grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {VOICE_AGENTS.map((agent, i) => (
              <AgentCard key={i} agent={agent} playing={playingIdx === i} onToggle={() => toggle(i)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const SOLUTION_ICONS = [
  <MessageSquare className="w-6 h-6" />,
  <RefreshCw className="w-6 h-6" />,
  <Brain className="w-6 h-6" />,
  <Settings className="w-6 h-6" />,
  <Zap className="w-6 h-6" />,
  <BarChart3 className="w-6 h-6" />,
];

export default function KIAutomatisierungen() {
  const { t } = useT();
  const ki = t.ki;

  return (
    <PublicLayout>
      <SeoHead slug="ki-automatisierungen" defaults={{ metaTitle: "KI <PublicLayout> Automatisierungen – Bleibsichtbar" }} />
      {/* HERO */}
      <section className="relative bg-primary text-white overflow-hidden pt-32 pb-24">
        <AnimatedHeroBackground />
        <FloatingAIIcons />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-block bg-white/10 border border-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6 tracking-wide">
                {ki.heroBadge}
              </span>
              <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 leading-tight">
                {ki.heroTitle1} <br />
                <span className="text-accent">{ki.heroTitle2}</span>
              </h1>
              <p className="text-xl text-white mb-10">
                {ki.heroSub}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="rounded-full px-8 bg-accent hover:bg-accent/90 text-white font-bold">
                  <Link href="/kontakt">{ki.heroCta1}</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-8 border-white/30 text-white bg-transparent hover:bg-white/10">
                  <Link href="/kontakt">{ki.heroCta2}</Link>
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
                      <div className="text-white font-bold text-sm">{ki.chatBot}</div>
                      <div className="text-green-400 text-xs flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full inline-block" /> {ki.chatOnline}</div>
                    </div>
                  </div>
                  {ki.chatMessages.map((m, i) => (
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
            {ki.benefits.map((b, i) => (
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
              <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">{ki.solutionsLabel}</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold">{ki.solutionsTitle1} <span className="text-accent">{ki.solutionsTitle2}</span></h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mt-4">
                {ki.solutionsSub}
              </p>
            </motion.div>
            <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ki.solutions.map((s, i) => (
                <motion.div key={i} variants={fadeUp} className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-accent/30 hover:shadow-md transition-all group">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-5 group-hover:bg-accent group-hover:text-white transition-all">
                    {SOLUTION_ICONS[i]}
                  </div>
                  <h3 className="text-xl font-display font-bold mb-3">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* AUDIO DEMOS */}
      <AudioDemoSection ki={ki} />

      {/* PROZESS */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">{ki.processLabel}</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold">{ki.processTitle1} <span className="text-accent">{ki.processTitle2}</span></h2>
            </motion.div>
            <div className="space-y-4">
              {ki.steps.map((step, i) => (
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
      <section className="py-28 bg-white relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)" }} />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(10,22,40,0.05) 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            {/* Left */}
            <div>
              <motion.p variants={fadeUp} className="text-accent font-semibold text-sm tracking-widest uppercase mb-4">
                {ki.ctaLabel}
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-display font-black leading-tight mb-6" style={{ color: "#0a1628" }}>
                {ki.ctaTitle1}{" "}
                <span className="text-accent">{ki.ctaTitle2}</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-gray-500 text-lg leading-relaxed">
                {ki.ctaSub}
              </motion.p>
            </div>

            {/* Right: card */}
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
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(249,115,22,0.22) 0%, transparent 70%)" }} />
              <div className="relative p-10 z-10">
                <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center mb-6">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-4 leading-snug">
                  {ki.ctaCardTitle1}<br />{ki.ctaCardTitle2}
                </h3>
                <p className="text-white/60 mb-8 leading-relaxed">
                  {ki.ctaCardSub}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[{ value: "80%", label: "Zeitersparnis" }, { value: "24/7", label: "Verfügbarkeit" }].map(s => (
                    <div key={s.label} className="rounded-xl p-4 border border-white/10" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="text-2xl font-black text-accent mb-1">{s.value}</div>
                      <div className="text-xs text-white/50 font-medium uppercase tracking-wider">{s.label}</div>
                    </div>
                  ))}
                </div>
                <Button asChild size="lg" className="w-full rounded-full bg-accent hover:bg-accent/90 text-white font-bold text-base">
                  <Link href="/kontakt">{ki.ctaCardBtn} <ArrowRight className="ml-2 w-4 h-4 inline" /></Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
