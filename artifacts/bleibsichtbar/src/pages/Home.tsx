import React, { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ArrowRight, BarChart3, Users, Zap, CheckCircle2,
  Heart, MessageCircle, Share2, Bookmark, TrendingUp,
  Monitor, Brain, Target, Clock, ChevronRight, Globe, Star
} from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { PhoneMockup } from "@/components/shared/PhoneMockup";
import { MarqueeClients } from "@/components/shared/MarqueeClients";

// ─── Like Notification Bubble ─────────────────────────────────────────────────
interface LikeNotif { id: number; name: string; }

function LikeNotifications() {
  const [notifs, setNotifs] = useState<LikeNotif[]>([]);
  const idRef = useRef(0);
  const names = ["Max M.", "Sarah K.", "Thomas B.", "Anna L.", "Felix R.", "Julia W.", "Kevin S."];

  useEffect(() => {
    const show = () => {
      const name = names[Math.floor(Math.random() * names.length)];
      const id = idRef.current++;
      setNotifs(prev => [...prev.slice(-2), { id, name }]);
      setTimeout(() => setNotifs(prev => prev.filter(n => n.id !== id)), 2400);
    };
    show();
    const t = setInterval(show, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col-reverse items-center gap-1.5 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifs.map(n => (
          <motion.div
            key={n.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.92 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="bg-white/95 backdrop-blur-sm rounded-full pl-1.5 pr-3 py-1 flex items-center gap-1.5 shadow-md border border-gray-100/80"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center text-[8px] font-bold text-white shrink-0">
              {n.name[0]}
            </div>
            <Heart className="w-2.5 h-2.5 fill-red-500 text-red-500 shrink-0" />
            <span className="text-[9px] text-gray-700 font-semibold whitespace-nowrap">{n.name} hat geliked</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Social Media Phone ───────────────────────────────────────────────────────
function SocialMediaPhone() {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(2847);
  const [activePost, setActivePost] = useState(0);

  const InstagramIcon = ({ size }: { size: string }) => (
    <svg viewBox="0 0 24 24" className={`${size} fill-white`} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
  const TikTokIcon = ({ size }: { size: string }) => (
    <svg viewBox="0 0 24 24" className={`${size} fill-white`} xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.16 8.16 0 004.77 1.52V6.75a4.85 4.85 0 01-1-.06z" />
    </svg>
  );
  const LinkedInIcon = ({ size }: { size: string }) => (
    <svg viewBox="0 0 24 24" className={`${size} fill-white`} xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );

  const posts = [
    {
      gradient: "from-purple-500 via-pink-500 to-orange-400",
      label: "Instagram",
      tag: "@bleibsichtbar",
      smallIcon: <InstagramIcon size="w-4 h-4" />,
      bigIcon: <InstagramIcon size="w-12 h-12" />,
    },
    {
      gradient: "from-gray-900 via-gray-800 to-black",
      label: "TikTok",
      tag: "@bleibsichtbar",
      smallIcon: <TikTokIcon size="w-4 h-4" />,
      bigIcon: <TikTokIcon size="w-12 h-12" />,
    },
    {
      gradient: "from-blue-700 via-blue-600 to-blue-500",
      label: "LinkedIn",
      tag: "Bleibsichtbar",
      smallIcon: <LinkedInIcon size="w-4 h-4" />,
      bigIcon: <LinkedInIcon size="w-12 h-12" />,
    },
  ];

  useEffect(() => {
    const t = setInterval(() => setActivePost(p => (p + 1) % posts.length), 3000);
    return () => clearInterval(t);
  }, []);

  const current = posts[activePost];

  const [counter, setCounter] = useState(385);
  useEffect(() => {
    const t = setInterval(() => setCounter(c => c + 1), 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="pt-8 p-3 space-y-3 select-none pb-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2">
          <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${current.gradient} flex items-center justify-center overflow-hidden`}>
            {current.smallIcon}
          </div>
          <div>
            <div className="text-[10px] font-bold text-gray-900 leading-none">{current.label}</div>
            <div className="text-[9px] text-gray-400">{current.tag}</div>
          </div>
        </div>
        <div className="flex space-x-1">
          {posts.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === activePost ? "w-4 bg-accent" : "w-1 bg-gray-200"}`} />
          ))}
        </div>
      </div>

      <motion.div
        key={activePost}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className={`h-40 rounded-2xl bg-gradient-to-br ${current.gradient} overflow-hidden relative`}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <motion.div
            animate={{ scale: [1, 1.08, 1], rotate: [0, 4, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mb-2"
          >
            {current.bigIcon}
          </motion.div>
          <div className="text-xs font-bold opacity-90">{current.label} Content</div>
          <div className="text-[10px] opacity-60 mt-1">Bleibsichtbar Agency</div>
        </div>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            animate={{
              x: [Math.random() * 200 - 100, Math.random() * 200 - 100],
              y: [Math.random() * 160 - 80, Math.random() * 160 - 80],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{ duration: 2 + i, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
            style={{ left: "50%", top: "50%" }}
          />
        ))}
      </motion.div>

      <div className="flex items-center justify-between px-2 py-1">
        <div className="flex items-center space-x-3">
          <button onClick={() => { setLiked(l => !l); setLikes(n => liked ? n - 1 : n + 1); }} className="flex items-center space-x-1 group">
            <Heart className={`w-4 h-4 transition-all ${liked ? "fill-red-500 text-red-500 scale-110" : "text-gray-600 group-hover:text-red-400"}`} />
            <span className="text-[10px] text-gray-600 font-medium">{likes.toLocaleString("de")}</span>
          </button>
          <div className="flex items-center space-x-1">
            <MessageCircle className="w-4 h-4 text-gray-600" />
            <span className="text-[10px] text-gray-600">342</span>
          </div>
          <div className="flex items-center space-x-1">
            <Share2 className="w-4 h-4 text-gray-600" />
            <span className="text-[10px] text-gray-600">89</span>
          </div>
        </div>
        <Bookmark className="w-4 h-4 text-gray-600" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white rounded-xl p-2.5 border border-gray-100 shadow-sm">
          <div className="flex items-center space-x-1 mb-1.5">
            <TrendingUp className="w-3 h-3 text-accent" />
            <span className="text-[9px] text-gray-500 font-medium">Reichweite</span>
          </div>
          <div className="text-base font-bold text-gray-900">46%</div>
          <div className="mt-1.5 h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div className="h-full bg-accent rounded-full" initial={{ width: 0 }} animate={{ width: "46%" }} transition={{ duration: 1.2, ease: "easeOut" }} />
          </div>
        </div>
        <div className="bg-white rounded-xl p-2.5 border border-gray-100 shadow-sm">
          <div className="flex items-center space-x-1 mb-1.5">
            <Users className="w-3 h-3 text-blue-500" />
            <span className="text-[9px] text-gray-500 font-medium">Follower</span>
          </div>
          <div className="text-base font-bold text-green-600">+{counter.toLocaleString("de")}</div>
          <div className="mt-1 h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div className="h-full bg-green-400 rounded-full" initial={{ width: 0 }} animate={{ width: "72%" }} transition={{ duration: 1.4, ease: "easeOut" }} />
          </div>
        </div>
      </div>

      {/* Instagram-style like notifications */}
      <div className="pt-1">
        <LikeNotifications />
      </div>
    </div>
  );
}

// ─── Hero Slides ──────────────────────────────────────────────────────────────
const heroSlides = [
  {
    headline: ["Sichtbarkeit", "beginnt mit uns"],
    sub: "Digitale Präsenz, die Kunden überzeugt und messbar mehr Umsatz generiert.",
    cta: "Jetzt starten",
    ctaLink: "/kontakt",
    bg: "from-slate-900 via-[#0a1628] to-slate-900",
    pill: "Ihre Agentur für digitale Sichtbarkeit",
  },
  {
    headline: ["Webseiten,", "die überzeugen."],
    sub: "Moderne, schnelle Websites, die nicht nur gut aussehen, sondern Anfragen generieren.",
    cta: "Website anfragen",
    ctaLink: "/kontakt",
    bg: "from-slate-900 via-[#0d1f3c] to-slate-900",
    pill: "Webseiten Optimierung & Design",
  },
  {
    headline: ["Smarte KI-", "Lösungen für Sie"],
    sub: "Automatisieren Sie Anfragen, Prozesse und Kundenservice mit moderner KI.",
    cta: "Mehr erfahren",
    ctaLink: "/ki-automatisierungen",
    bg: "from-slate-900 via-[#0a2218] to-slate-900",
    pill: "KI & Automatisierung",
  },
];

// ─── Services ────────────────────────────────────────────────────────────────
const services = [
  {
    icon: Users,
    title: "Social Media Management",
    desc: "Wir bauen eine starke Präsenz auf, die Vertrauen schafft und neue Kunden bringt. Strategie, Content und Betreuung aus einer Hand.",
    color: "from-pink-500 to-rose-600",
    link: "/social-media",
  },
  {
    icon: Brain,
    title: "KI & Automatisierung",
    desc: "Automatisieren Sie Anfragen, Prozesse und Kundenservice mit moderner KI. Mehr Effizienz, weniger Aufwand, mehr Wachstum.",
    color: "from-violet-500 to-purple-700",
    link: "/ki-automatisierungen",
  },
  {
    icon: Monitor,
    title: "Webseiten Optimierung & Design",
    desc: "Moderne Webseiten, die nicht nur gut aussehen, sondern Anfragen generieren. Schnell, professionell und zugeschnitten.",
    color: "from-blue-500 to-indigo-700",
    link: "/webseiten",
  },
  {
    icon: Target,
    title: "Strategie & Beratung",
    desc: "Wir analysieren Ihr Unternehmen und entwickeln eine digitale Strategie, die wirklich zu Ihnen passt.",
    color: "from-orange-400 to-amber-600",
    link: "/analyse",
  },
  {
    icon: BarChart3,
    title: "Performance Marketing & Ads",
    desc: "Gezielte Werbung bei Google, damit Kunden Sie genau dann finden, wenn sie suchen. Messbare Ergebnisse statt Streuverlust.",
    color: "from-green-500 to-emerald-700",
    link: "/marketing-ads",
  },
  {
    icon: Clock,
    title: "Langfristige Betreuung",
    desc: "Wir begleiten Unternehmen langfristig – von der ersten Idee bis zur laufenden Optimierung.",
    color: "from-slate-500 to-gray-700",
    link: "/kontakt",
  },
];

// ─── Process Steps ───────────────────────────────────────────────────────────
const steps = [
  {
    num: "01",
    title: "Analyse",
    desc: "Wir analysieren Ihr Unternehmen, Ihre Zielgruppe und Ihren aktuellen Auftritt – und definieren eine klare Strategie für nachhaltige Sichtbarkeit.",
  },
  {
    num: "02",
    title: "Strategie",
    desc: "Wir entwickeln einen strukturierten Content-Plan mit klarer Linie, Design und Wiedererkennungswert – abgestimmt auf Ihre Marke und Ziele.",
  },
  {
    num: "03",
    title: "Umsetzung",
    desc: "Wir erstellen hochwertige Inhalte und betreuen Ihre Kanäle professionell und zuverlässig. Einheitlich, modern und markengerecht.",
  },
  {
    num: "04",
    title: "Optimierung",
    desc: "Wir analysieren die Performance laufend und entwickeln Inhalte gezielt weiter. So entstehen planbare Sichtbarkeit und neue Anfragen.",
  },
];

// ─── Stats ───────────────────────────────────────────────────────────────────
const stats = [
  { value: 5, suffix: "+", label: "Jahre Erfahrung" },
  { value: 200, suffix: "+", label: "Betreute Projekte & Anfragen" },
  { value: 4, suffix: "", label: "Bereiche: Web · Social · Ads · KI" },
  { value: 1, suffix: "", label: "Ziel – Mehr Kunden für Sie" },
];

// ─── Portfolio ───────────────────────────────────────────────────────────────
const portfolio = [
  {
    title: "Atmosphäre & Markenauftritt",
    cat: "Branding",
    img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80&fit=crop",
  },
  {
    title: "Autohaus Content Produktion",
    cat: "Content Production",
    img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80&fit=crop",
  },
  {
    title: "Business- & Imagefotografie",
    cat: "Fotografie",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&fit=crop",
  },
  {
    title: "Immobilienvermarktung",
    cat: "Marketing",
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80&fit=crop",
  },
  {
    title: "Food Content",
    cat: "Social Media",
    img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80&fit=crop",
  },
  {
    title: "Menü und Werbefotografie",
    cat: "Fotografie",
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&fit=crop",
  },
];

// ─── Animated Counter ─────────────────────────────────────────────────────────
function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) { setCount(value); clearInterval(timer); return; }
      setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Fade-in wrapper ──────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Home() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const current = heroSlides[slide];

  return (
    <PublicLayout>
      {/* ─── Hero ────────────────────────────────────────────────────────── */}
      <div className="relative h-screen min-h-[640px] max-h-[900px] flex items-center overflow-hidden -mt-20">
        {/* Animated bg */}
        <AnimatePresence mode="sync">
          <motion.div
            key={slide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className={`absolute inset-0 bg-gradient-to-br ${current.bg}`}
          />
        </AnimatePresence>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)", backgroundSize: "60px 60px" }}
        />

        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="space-y-8">
              <AnimatePresence mode="wait">
                <motion.div key={slide} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.6 }}>
                  {/* Pill */}
                  <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
                    <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                    <span className="text-white/90 text-sm font-medium">{current.pill}</span>
                  </div>

                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.05] tracking-tight">
                    {current.headline.map((line, i) => (
                      <span key={i} className="block">
                        {i === 1 ? <span className="text-accent">{line}</span> : line}
                      </span>
                    ))}
                  </h1>

                  <p className="text-xl text-white/70 max-w-lg leading-relaxed mt-6">
                    {current.sub}
                  </p>

                  <div className="flex flex-wrap gap-4 mt-8">
                    <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white rounded-full px-8 py-6 text-lg font-semibold shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all">
                      <Link href={current.ctaLink}>
                        {current.cta}
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg font-semibold border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm">
                      <Link href="/projekte">Projekte ansehen</Link>
                    </Button>
                  </div>

                  {/* Trust badges */}
                  <div className="flex flex-wrap items-center gap-6 mt-10 pt-8 border-t border-white/10">
                    {["Datengetrieben", "Transparent", "Zielorientiert"].map(badge => (
                      <div key={badge} className="flex items-center space-x-2 text-white/70">
                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                        <span className="text-sm font-medium">{badge}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right — Phone */}
            <div className="flex justify-center lg:justify-end relative">
              <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl scale-75" />
              <PhoneMockup className="relative shadow-2xl shadow-black/50 border-gray-800">
                <SocialMediaPhone />
              </PhoneMockup>
            </div>
          </div>

          {/* Slide indicators */}
          <div className="flex items-center justify-center space-x-3 mt-8">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`transition-all duration-500 rounded-full ${i === slide ? "w-8 h-2 bg-accent" : "w-2 h-2 bg-white/30 hover:bg-white/50"}`}
              />
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </div>

      {/* ─── Problem Statement ─────────────────────────────────────────────── */}
      <section className="py-24 bg-[#0a0f1e] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(234,88,12,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(59,130,246,0.1) 0%, transparent 50%)" }}
        />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-6">Die entscheidende Frage</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-tight mb-8">
              Wie viele Kunden verlieren Sie, weil Ihr Unternehmen{" "}
              <span className="text-accent">online nicht sichtbar</span> ist?
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
              Digitale Sichtbarkeit entsteht dort, wo Entscheidungen getroffen werden – auf Webseiten, Social Media und bei Google. Wir sorgen dafür, dass Ihr Unternehmen genau dort gefunden wird, wo Kunden suchen.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } } }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          >
            {[
              { icon: Globe, label: "Social Media", val: "70%", desc: "der Kaufentscheidungen werden durch Social Media beeinflusst" },
              { icon: Monitor, label: "Webseite", val: "3 Sek.", desc: "haben Sie, um einen Besucher zu überzeugen – oder zu verlieren" },
              { icon: Target, label: "Google Ads", val: "200%", desc: "höherer ROI mit gezielten Performance-Kampagnen möglich" },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <item.icon className="w-8 h-8 text-accent mb-4" />
                <div className="text-3xl font-bold text-white mb-2">{item.val}</div>
                <div className="text-sm font-semibold text-accent mb-2">{item.label}</div>
                <div className="text-white/50 text-sm leading-relaxed">{item.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Services ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="text-center mb-16">
            <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-4">Was wir tun</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Unsere Leistungen im <span className="text-accent">Überblick</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Maßgeschneiderte digitale Lösungen für Unternehmen, die online wachsen wollen.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((s, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Link href={s.link} className="block group h-full">
                  <div className="h-full border border-gray-100 rounded-2xl p-7 hover:border-gray-200 hover:shadow-xl transition-all duration-300 bg-white hover:-translate-y-1">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                      <s.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold font-display mb-3 group-hover:text-accent transition-colors">{s.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{s.desc}</p>
                    <div className="flex items-center text-accent text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Mehr erfahren <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Process ───────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="text-center mb-16">
            <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-4">Unser Prozess</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Der Weg zu mehr <span className="text-accent">Sichtbarkeit</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Wir analysieren Ihr Unternehmen, entwickeln eine klare Strategie und setzen alles strukturiert für Sie um.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-accent/20 via-accent to-accent/20" />

            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={{ hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.12 } } }}
                className="relative text-center"
              >
                <div className="w-20 h-20 bg-white border-2 border-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10">
                  <span className="text-2xl font-display font-bold text-accent">{step.num}</span>
                </div>
                <h3 className="text-xl font-display font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats ─────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl md:text-6xl font-display font-bold text-accent mb-3">
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div className="text-white/60 text-sm font-medium">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Portfolio ─────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="text-center mb-16">
            <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-4">Portfolio</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Einblick in unsere <span className="text-accent">bisherigen Projekte</span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {portfolio.map((p, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Link href="/projekte" className="block group">
                  <div className="aspect-[4/3] rounded-2xl relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
                    <img
                      src={p.img}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/60 transition-colors duration-300" />
                    <div className="absolute bottom-0 inset-x-0 p-6">
                      <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-2">{p.cat}</span>
                      <h3 className="text-white font-display font-bold text-lg leading-snug">{p.title}</h3>
                    </div>
                    <div className="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-2 hover:bg-primary hover:text-white hover:border-primary transition-all">
              <Link href="/projekte">Alle Projekte ansehen <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ─── Client Marquee ────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
            Unternehmen, die uns vertrauen
          </motion.p>
        </div>
        <MarqueeClients />
      </section>
    </PublicLayout>
  );
}
