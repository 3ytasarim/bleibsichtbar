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
    title: "Studio Content Produktion",
    brand: "Reichweiten-Kampagne",
    cat: "Content Production",
    img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80&fit=crop",
    followers: "25k",
    likes: "323k",
    views: "93M",
  },
  {
    title: "Product & Lifestyle Shoots",
    brand: "Brand-Kooperation",
    cat: "Social Media",
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80&fit=crop",
    followers: "111k",
    likes: "782k",
    views: "33M",
  },
  {
    title: "Influencer Marketing",
    brand: "Performance-Ads",
    cat: "Marketing Ads",
    img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80&fit=crop",
    followers: "37k",
    likes: "38k",
    views: "1.4M",
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
                    {/* Primary CTA */}
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <Link
                        href={current.ctaLink}
                        className="relative overflow-hidden inline-flex items-center gap-2.5 px-8 py-4 rounded-full text-white font-bold text-base group"
                        style={{
                          background: "linear-gradient(135deg, #ff6b35 0%, #e8522a 100%)",
                          boxShadow: "0 8px 32px rgba(255,107,53,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
                        }}
                      >
                        {/* Shimmer sweep */}
                        <motion.span
                          className="absolute inset-0 -translate-x-full skew-x-12 pointer-events-none"
                          style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)" }}
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.8, ease: "easeInOut" }}
                        />
                        <span className="relative">{current.cta}</span>
                        <motion.span
                          className="relative"
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.span>
                      </Link>
                    </motion.div>

                    {/* Secondary — Ghost */}
                    <motion.div
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <Link
                        href="/projekte"
                        className="relative inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-base text-white/90 group overflow-hidden"
                        style={{
                          background: "rgba(255,255,255,0.08)",
                          border: "1.5px solid rgba(255,255,255,0.18)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        {/* Hover fill */}
                        <motion.span
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
                          style={{ background: "rgba(255,255,255,0.1)" }}
                        />
                        <span className="relative">Projekte ansehen</span>
                        <ChevronRight className="relative w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                      </Link>
                    </motion.div>
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
      <section className="py-28 bg-white relative overflow-hidden">
        {/* Subtle bg grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "radial-gradient(circle, #0a1628 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="text-center mb-20">
            <motion.span
              className="inline-flex items-center gap-2 bg-accent/10 text-accent font-semibold text-xs tracking-[0.18em] uppercase px-4 py-2 rounded-full mb-5"
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Was wir tun
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-5">
              Unsere Leistungen im <span className="text-accent">Überblick</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Maßgeschneiderte digitale Lösungen für Unternehmen, die online wachsen wollen.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => {
              const glowMap: Record<number, string> = {
                0: "rgba(236,72,153,0.14)", 1: "rgba(139,92,246,0.14)", 2: "rgba(59,130,246,0.14)",
                3: "rgba(249,115,22,0.14)", 4: "rgba(34,197,94,0.14)", 5: "rgba(100,116,139,0.12)",
              };
              const glow = glowMap[i] ?? "rgba(10,22,40,0.10)";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link href={s.link} className="block h-full">
                    <motion.div
                      className="group relative h-full bg-white rounded-3xl p-8 border border-gray-100 overflow-hidden cursor-pointer"
                      whileHover={{ y: -8, boxShadow: `0 28px 56px ${glow}` }}
                      transition={{ type: "spring", stiffness: 320, damping: 26 }}
                    >
                      {/* Gradient blob – fades in on hover */}
                      <div className={`absolute -right-10 -top-10 w-44 h-44 rounded-full bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-[0.09] transition-opacity duration-500 blur-2xl`} />

                      {/* Card number – ghosted top-right */}
                      <div className="absolute top-5 right-6 font-black text-[52px] leading-none select-none text-gray-900/[0.04]">
                        {String(i + 1).padStart(2, "0")}
                      </div>

                      {/* Icon */}
                      <motion.div
                        className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-6 shadow-lg`}
                        whileHover={{ scale: 1.12, rotate: -6 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      >
                        <s.icon className="w-7 h-7 text-white" />
                        {/* Inner glow ring */}
                        <div className="absolute inset-0 rounded-2xl ring-1 ring-white/30" />
                      </motion.div>

                      {/* Content */}
                      <h3 className="text-xl font-display font-bold mb-3 group-hover:text-accent transition-colors duration-200">
                        {s.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-6">{s.desc}</p>

                      {/* CTA row */}
                      <div className="flex items-center gap-1.5 text-accent text-sm font-bold">
                        Mehr erfahren
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
                      </div>

                      {/* Animated bottom accent line */}
                      <motion.div
                        className={`absolute bottom-0 left-0 h-[3px] bg-gradient-to-r ${s.color}`}
                        initial={{ width: "0%" }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                      />
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
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

      {/* ─── Referenzen / Projekte ─────────────────────────────────────────── */}
      <section className="py-28 relative overflow-hidden" style={{ background: "#06090f" }}>
        {/* Starfield / space effect */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.4) 0%, transparent 100%), radial-gradient(1px 1px at 60% 70%, rgba(255,255,255,0.3) 0%, transparent 100%), radial-gradient(1px 1px at 80% 20%, rgba(255,255,255,0.25) 0%, transparent 100%), radial-gradient(1px 1px at 40% 80%, rgba(255,255,255,0.2) 0%, transparent 100%), radial-gradient(1px 1px at 10% 60%, rgba(255,255,255,0.35) 0%, transparent 100%)",
        }} />
        {/* Accent glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] pointer-events-none blur-[120px]"
          style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.08) 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Section header */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <motion.p variants={fadeUp} className="text-accent font-semibold tracking-widest uppercase text-sm mb-3">
                Unsere Referenzen
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-display font-black leading-tight text-white">
                Einblick in unsere{" "}
                <span className="text-accent">bisherigen Projekte</span>
              </motion.h2>
            </div>
            <motion.div variants={fadeUp}>
              <Link
                href="/projekte"
                className="group hidden md:inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest border rounded-full px-7 py-3 transition-all duration-300 text-white hover:bg-white hover:text-[#0a1628]"
                style={{ borderColor: "rgba(255,255,255,0.25)" }}
              >
                Alle ansehen
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Phone-card grid — 3 tall cards side by side */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {portfolio.map((p, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                <Link href="/projekte" className="block group">
                  <div
                    className="relative rounded-3xl overflow-hidden"
                    style={{
                      height: 480,
                      boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07)",
                    }}
                  >
                    {/* Image */}
                    <img
                      src={p.img}
                      alt={p.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Strong dark overlay */}
                    <div className="absolute inset-0" style={{
                      background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.15) 100%)"
                    }} />

                    {/* Category pill — top left */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center bg-accent text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                        {p.cat}
                      </span>
                    </div>

                    {/* Arrow — top right on hover */}
                    <div className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-1 group-hover:translate-y-0">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>

                    {/* Bottom content */}
                    <div className="absolute bottom-0 inset-x-0 p-5 z-10">
                      <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-1">{p.brand}</p>
                      <h3 className="text-white font-display font-bold text-lg leading-snug mb-4">{p.title}</h3>

                      {/* Stats bar */}
                      <div className="flex items-center gap-4 pt-4 border-t border-white/15">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                          </svg>
                          <span className="text-white text-xs font-bold">{p.followers}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                          <span className="text-white text-xs font-bold">{p.likes}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                          </svg>
                          <span className="text-white text-xs font-bold">{p.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mt-12">
            <Link
              href="/projekte"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest border rounded-full px-8 py-3 text-white transition-all duration-300 hover:bg-white hover:text-[#0a1628]"
              style={{ borderColor: "rgba(255,255,255,0.25)" }}
            >
              Alle Projekte ansehen
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── Client Marquee ────────────────────────────────────────────────── */}
      <MarqueeClients />
    </PublicLayout>
  );
}
