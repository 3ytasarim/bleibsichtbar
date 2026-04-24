import React, { useEffect, useState, useRef, useCallback } from "react";
import { SeoHead } from "@/hooks/useSeoPage";
import { Link } from "wouter";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ArrowRight, BarChart3, Users, Zap, CheckCircle2,
  Heart, MessageCircle, Share2, Bookmark, TrendingUp,
  Monitor, Brain, Target, Clock, ChevronRight, ChevronLeft, Globe, Star,
  Phone, PhoneOff, Mic
} from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { MarqueeClients } from "@/components/shared/MarqueeClients";
import { StarfieldOverlay } from "@/components/shared/StarfieldOverlay";
import { useGetProjects } from "@workspace/api-client-react";
import { useT } from "@/i18n";
import type { Translations } from "@/i18n/translations";

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

// ─── Voice Agent Phone ────────────────────────────────────────────────────────
function SoundWaveBars() {
  const heights = [4, 8, 14, 20, 14, 20, 14, 8, 4];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 28 }}>
      {heights.map((h, i) => (
        <motion.div
          key={i}
          animate={{ scaleY: [1, 1.6, 0.7, 1.3, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
          style={{
            width: 3, height: h, borderRadius: 2,
            background: "rgba(34,197,94,0.85)",
            transformOrigin: "center",
          }}
        />
      ))}
    </div>
  );
}

// ─── iPhone SVG Frame ─────────────────────────────────────────────────────────
function IPhoneFrame({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  const uid = dark ? "d" : "l";
  const f = dark
    ? { f0: "#6a6a74", f1: "#2e2e36", f2: "#545460", f3: "#1e1e26", f4: "#626270" }
    : { f0: "#8c8c98", f1: "#484854", f2: "#707080", f3: "#343442", f4: "#828292" };
  const btn = dark
    ? { b0: "#1a1a24", b1: "#505060", b2: "#2c2c38" }
    : { b0: "#3a3a48", b1: "#747482", b2: "#525262" };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Screen content — below SVG frame overlay */}
      <div style={{
        position: "absolute",
        top: 13, left: 13, right: 13, bottom: 13,
        borderRadius: 37,
        overflow: "hidden",
        background: dark ? "#06080f" : "#f5f7fa",
        zIndex: 1,
      }}>
        {children}
      </div>

      {/* SVG frame — only the frame ring is visible (screen area is transparent via mask) */}
      <svg
        viewBox="0 0 252 535"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none", zIndex: 10 }}
      >
        <defs>
          <linearGradient id={`fg-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor={f.f0} />
            <stop offset="25%"  stopColor={f.f1} />
            <stop offset="55%"  stopColor={f.f2} />
            <stop offset="78%"  stopColor={f.f3} />
            <stop offset="100%" stopColor={f.f4} />
          </linearGradient>
          <linearGradient id={`rg-${uid}`} x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%"   stopColor={btn.b0} />
            <stop offset="50%"  stopColor={btn.b1} />
            <stop offset="100%" stopColor={btn.b2} />
          </linearGradient>
          <linearGradient id={`lg-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor={btn.b0} />
            <stop offset="50%"  stopColor={btn.b1} />
            <stop offset="100%" stopColor={btn.b2} />
          </linearGradient>
          {/* Mask: white = draw frame, black = transparent hole for screen */}
          <mask id={`sm-${uid}`}>
            <rect x="0" y="0" width="252" height="535" rx="48" fill="white" />
            <rect x="13" y="13" width="226" height="509" rx="37" fill="black" />
          </mask>
          <filter id={`sh-${uid}`} x="-40%" y="-15%" width="180%" height="145%">
            <feDropShadow dx="0" dy="28" stdDeviation="32" floodColor="#000" floodOpacity="0.88" />
          </filter>
        </defs>

        {/* Drop shadow (transparent rect just for shadow) */}
        <rect x="0" y="0" width="252" height="535" rx="48" fill="rgba(0,0,0,0.01)" filter={`url(#sh-${uid})`} />

        {/* Titanium frame ring — screen area cut out by mask */}
        <rect x="0" y="0" width="252" height="535" rx="48" fill={`url(#fg-${uid})`} mask={`url(#sm-${uid})`} />

        {/* Top-left shine on frame */}
        <rect x="1" y="1" width="250" height="58" rx="47" fill="rgba(255,255,255,0.08)" mask={`url(#sm-${uid})`} />

        {/* Outer edge highlight line */}
        <rect x="0.5" y="0.5" width="251" height="534" rx="47.5" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" mask={`url(#sm-${uid})`} />

        {/* Inner edge shadow line */}
        <rect x="12" y="12" width="228" height="511" rx="38" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="1.5" mask={`url(#sm-${uid})`} />

        {/* Dynamic Island pill */}
        <rect x="86" y="24" width="80" height="24" rx="12" fill="#000" />
        <circle cx="153" cy="36" r="7.5" fill="#08080f" />
        <circle cx="153" cy="36" r="4.5" fill="#101018" />
        <circle cx="151" cy="34" r="1.5" fill="rgba(255,255,255,0.1)" />

        {/* RIGHT — Power/Sleep button */}
        <rect x="249" y="190" width="14" height="72" rx="5" fill={`url(#rg-${uid})`} />
        <rect x="249.5" y="190.5" width="12" height="71" rx="4" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="0.5" />

        {/* LEFT — Action button (mute) */}
        <rect x="-11" y="108" width="14" height="32" rx="5" fill={`url(#lg-${uid})`} />
        <rect x="-10.5" y="108.5" width="12" height="31" rx="4" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="0.5" />

        {/* LEFT — Volume Up */}
        <rect x="-11" y="152" width="14" height="54" rx="5" fill={`url(#lg-${uid})`} />
        <rect x="-10.5" y="152.5" width="12" height="53" rx="4" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="0.5" />

        {/* LEFT — Volume Down */}
        <rect x="-11" y="218" width="14" height="54" rx="5" fill={`url(#lg-${uid})`} />
        <rect x="-10.5" y="218.5" width="12" height="53" rx="4" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="0.5" />

        {/* Home indicator bar */}
        <rect x="91" y="509" width="70" height="5" rx="2.5" fill={dark ? "rgba(255,255,255,0.22)" : "#1a1a1c"} />
      </svg>
    </div>
  );
}

function VoiceAgentPhone() {
  const { t } = useT();
  const ph = t.home.phone;
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "linear-gradient(170deg, #06080f 0%, #0c1020 60%, #060812 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      paddingTop: 36, paddingBottom: 20,
      position: "relative", overflow: "hidden",
    }}>

      {/* Incoming call label */}
      <div style={{
        color: "rgba(255,255,255,0.40)", fontSize: 9, letterSpacing: 1.5,
        fontWeight: 600, textTransform: "uppercase", marginBottom: 8,
      }}>
        {ph.incomingCall}
      </div>

      {/* Avatar */}
      <div style={{ position: "relative", width: 80, height: 80, marginBottom: 14 }}>
        {/* Orange pulse rings */}
        {[0, 1, 2].map(i => (
          <motion.div key={i}
            animate={{ scale: [1, 2.6], opacity: [0.35, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, delay: i * 1.85, ease: "easeOut" }}
            style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              border: "1.5px solid rgba(249,115,22,0.55)",
            }}
          />
        ))}
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: "linear-gradient(135deg, #f97316 0%, #ef4444 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1, boxShadow: "0 0 28px rgba(249,115,22,0.55)",
          }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: "white", letterSpacing: -0.5 }}>KI</span>
        </motion.div>
      </div>

      {/* Name */}
      <div style={{ color: "white", fontSize: 16, fontWeight: 700, marginBottom: 3 }}>
        {ph.voiceAgent}
      </div>
      <div style={{ color: "rgba(255,255,255,0.40)", fontSize: 10, marginBottom: 14 }}>
        {ph.kiSubtitle}
      </div>

      {/* Sound wave */}
      <SoundWaveBars />

      {/* Call status */}
      <motion.div
        animate={{ opacity: [1, 0.35, 1] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ color: "rgba(34,197,94,0.8)", fontSize: 10, fontWeight: 600, marginTop: 8, letterSpacing: 0.5 }}
      >
        {ph.connecting}
      </motion.div>

      {/* Mic indicator */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6, marginTop: 10,
        background: "rgba(255,255,255,0.06)", borderRadius: 20,
        padding: "5px 12px",
      }}>
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }}
        />
        <Mic size={10} color="rgba(255,255,255,0.5)" />
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>{ph.kiSpeaks}</span>
      </div>

      {/* Accept / Decline buttons */}
      <div style={{ display: "flex", gap: 24, marginTop: "auto", paddingTop: 16 }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%", background: "#ef4444",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(239,68,68,0.45)",
        }}>
          <PhoneOff size={20} color="white" />
        </div>
        <div style={{
            width: 48, height: 48, borderRadius: "50%", background: "#22c55e",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 20px rgba(34,197,94,0.55)",
          }}
        >
          <Phone size={20} color="white" />
        </div>
      </div>
    </div>
  );
}

// ─── Social Media Phone ───────────────────────────────────────────────────────
function SocialMediaPhone() {
  const { t } = useT();
  const ph = t.home.phone;
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
    <div className="pt-5 p-2.5 space-y-2 select-none pb-2">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2">
          <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${current.gradient} flex items-center justify-center overflow-hidden`}>
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
        className={`h-28 rounded-2xl bg-gradient-to-br ${current.gradient} overflow-hidden relative`}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <motion.div
            animate={{ scale: [1, 1.08, 1], rotate: [0, 4, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mb-1"
          >
            {current.bigIcon}
          </motion.div>
          <div className="text-[11px] font-bold opacity-90">{current.label} Content</div>
          <div className="text-[9px] opacity-60 mt-0.5">Bleibsichtbar Agency</div>
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
            <span className="text-[9px] text-gray-500 font-medium">{ph.reach}</span>
          </div>
          <div className="text-base font-bold text-gray-900">46%</div>
          <div className="mt-1.5 h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div className="h-full bg-accent rounded-full" initial={{ width: 0 }} animate={{ width: "46%" }} transition={{ duration: 1.2, ease: "easeOut" }} />
          </div>
        </div>
        <div className="bg-white rounded-xl p-2.5 border border-gray-100 shadow-sm">
          <div className="flex items-center space-x-1 mb-1.5">
            <Users className="w-3 h-3 text-blue-500" />
            <span className="text-[9px] text-gray-500 font-medium">{ph.followers}</span>
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
const HERO_BG = [
  "from-[#1e4080] via-[#2d5fbe] to-[#1e4080]",
  "from-[#1e4080] via-[#264fa8] to-[#1e4080]",
  "from-[#1e4080] via-[#1e6080] to-[#1e4080]",
];
const HERO_LINKS = ["/kontakt", "/kontakt", "/ki-automatisierungen"];

function makeHeroSlides(t: Translations) {
  return t.home.hero.map((h, i) => ({
    headline: [h.line1, h.line2],
    sub: h.sub,
    cta: h.cta,
    ctaLink: HERO_LINKS[i],
    bg: HERO_BG[i],
    pill: h.pill,
  }));
}

// ─── Animated Star Field ─────────────────────────────────────────────────────
function rng(seed: number): number {
  let x = seed;
  x = ((x >> 16) ^ x) * 0x45d9f3b | 0;
  x = ((x >> 16) ^ x) * 0x45d9f3b | 0;
  x = (x >> 16) ^ x;
  return Math.abs(x % 10000) / 10000;
}

const STARS = Array.from({ length: 250 }, (_, i) => {
  const r = (salt: number) => rng(i * 7919 + salt * 104729);
  const dx = (r(1) - 0.5) * 44;
  const dy = (r(2) - 0.5) * 44;
  return {
    id: i,
    x: r(3) * 98 + 1,
    y: r(4) * 98 + 1,
    size: i % 7 === 0 ? 3.8 : i % 4 === 0 ? 2.8 : i % 2 === 0 ? 2.0 : 1.5,
    moveDur: `${14 + r(5) * 20}s`,
    blinkDur: `${2 + r(6) * 4}s`,
    delay: `-${r(7) * 22}s`,
    blinkDelay: `-${r(8) * 5}s`,
    opacity: 0.3 + r(9) * 0.55,
    dx1: `${dx}px`,
    dy1: `${dy}px`,
    dx2: `${-dx * 0.7}px`,
    dy2: `${dy * 0.5}px`,
  };
});

function FloatingDots() {
  return (
    <>
      <style>{`
        @keyframes starDrift {
          0%   { transform: translate(0, 0); }
          25%  { transform: translate(var(--dx1), var(--dy2)); }
          50%  { transform: translate(var(--dx2), var(--dy1)); }
          75%  { transform: translate(var(--dx1), var(--dy2)); }
          100% { transform: translate(0, 0); }
        }
        @keyframes starBlink {
          0%, 100% { opacity: var(--op); }
          40%       { opacity: calc(var(--op) * 0.2); }
          70%       { opacity: calc(var(--op) * 0.85); }
        }
        .star-dot {
          position: absolute;
          border-radius: 9999px;
          background: white;
          animation:
            starDrift var(--move-dur) ease-in-out var(--delay) infinite,
            starBlink var(--blink-dur) ease-in-out var(--blink-delay) infinite;
        }
      `}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {STARS.map(s => (
          <div
            key={s.id}
            className="star-dot"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              "--op": s.opacity,
              "--move-dur": s.moveDur,
              "--blink-dur": s.blinkDur,
              "--delay": s.delay,
              "--blink-delay": s.blinkDelay,
              "--dx1": s.dx1,
              "--dy1": s.dy1,
              "--dx2": s.dx2,
              "--dy2": s.dy2,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </>
  );
}

// ─── Services ────────────────────────────────────────────────────────────────
const SERVICE_META = [
  { icon: Users,    color: "from-pink-500 to-rose-600",    link: "/social-media" },
  { icon: Brain,    color: "from-violet-500 to-purple-700", link: "/ki-automatisierungen" },
  { icon: Monitor,  color: "from-blue-500 to-indigo-700",  link: "/webseiten" },
  { icon: Target,   color: "from-orange-400 to-amber-600", link: "/analyse" },
  { icon: BarChart3,color: "from-green-500 to-emerald-700",link: "/marketing-ads" },
  { icon: Clock,    color: "from-slate-500 to-gray-700",   link: "/kontakt" },
];

function makeServices(t: Translations) {
  return t.home.services.map((s, i) => ({
    ...SERVICE_META[i],
    title: s.title,
    desc: s.desc,
  }));
}

// ─── Process Steps ───────────────────────────────────────────────────────────
const STEP_NUMS = ["01", "02", "03", "04"];
function makeSteps(t: Translations) {
  return t.home.steps.map((s, i) => ({ num: STEP_NUMS[i], title: s.title, desc: s.desc }));
}

// ─── Counter Stats ─────────────────────────────────────────────────────────────
const STAT_VALUES = [
  { value: 5,   suffix: "+" },
  { value: 200, suffix: "+" },
  { value: 4,   suffix: ""  },
  { value: 1,   suffix: ""  },
];
function makeStats(t: Translations) {
  return t.home.counterStats.map((s, i) => ({ ...STAT_VALUES[i], label: s.label }));
}


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

// ─── Social Media Slider ───────────────────────────────────────────────────────
const CARDS_PER_VIEW = 3;

// Deterministic "random" based on project id so same project always shows same stats
function autoStat(seed: number, min: number, max: number): string {
  const x = Math.abs(Math.sin(seed * 9301 + 49297) * 233280);
  const val = Math.floor((x % 1) * (max - min) + min);
  if (val >= 1_000_000) return (val / 1_000_000).toFixed(1).replace(".0", "") + "M";
  if (val >= 1_000) return (val / 1_000).toFixed(0) + "k";
  return String(val);
}

function SocialMediaSlider() {
  const { t } = useT();
  const { data: allProjects = [], isLoading } = useGetProjects({ published: true });
  const projects = allProjects.filter((p: any) => p.showOnHomepage === true);

  const totalSlides = Math.max(0, projects.length - CARDS_PER_VIEW + 1);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => setCurrent(c => (c + 1) % totalSlides), [totalSlides]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + totalSlides) % totalSlides), [totalSlides]);

  useEffect(() => {
    if (projects.length > CARDS_PER_VIEW) {
      timerRef.current = setInterval(next, 5000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next, projects.length]);

  const FALLBACK = [
    {
      id: -1, title: "Studio Content Produktion", clientName: "Reichweiten-Kampagne", category: "Social Media",
      imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80&fit=crop",
      statFollowers: "25k", statLikes: "323k", statViews: "93M",
    },
    {
      id: -2, title: "Product & Lifestyle Shoots", clientName: "Brand-Kooperation", category: "Social Media",
      imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80&fit=crop",
      statFollowers: "111k", statLikes: "782k", statViews: "33M",
    },
    {
      id: -3, title: "Influencer Marketing", clientName: "Performance-Kampagne", category: "Social Media",
      imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80&fit=crop",
      statFollowers: "37k", statLikes: "38k", statViews: "1.4M",
    },
  ] as any[];

  const displayProjects = projects.length === 0 && !isLoading ? FALLBACK : (projects.length > 0 ? projects : []);
  const displayVisible = displayProjects.length > CARDS_PER_VIEW ? displayProjects.slice(current, current + CARDS_PER_VIEW) : displayProjects;
  const displayTotal = Math.max(0, displayProjects.length - CARDS_PER_VIEW + 1);
  const showControls = displayProjects.length > CARDS_PER_VIEW;

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: "#0a1628" }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.4) 0%, transparent 100%), radial-gradient(1px 1px at 60% 70%, rgba(255,255,255,0.3) 0%, transparent 100%), radial-gradient(1px 1px at 80% 20%, rgba(255,255,255,0.25) 0%, transparent 100%), radial-gradient(1px 1px at 40% 80%, rgba(255,255,255,0.2) 0%, transparent 100%)",
      }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] pointer-events-none blur-[120px]"
        style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.08) 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-3">{t.home.refsLabel}</p>
            <h2 className="text-4xl md:text-5xl font-display font-black leading-tight text-white">
              {t.home.refsTitle1}{" "}
              <span className="text-accent">{t.home.refsTitle2}</span>
            </h2>
          </div>
          <Link
            href="/projekte"
            className="group hidden md:inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest border rounded-full px-7 py-3 transition-all duration-300 text-white hover:bg-white hover:text-[#0a1628]"
            style={{ borderColor: "rgba(255,255,255,0.25)" }}
          >
            {t.home.refsViewAll} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {/* Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[0, 1, 2].map(i => (
              <div key={i} className="rounded-3xl bg-white/5 animate-pulse" style={{ height: 420 }} />
            ))}
          </div>
        ) : (
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.38, ease: "easeInOut" }}
                className="grid grid-cols-1 md:grid-cols-3 gap-5"
              >
                {displayVisible.map((p: any, i: number) => {
                  const seed = Math.abs(p.id ?? i + 1);
                  const followers = p.statFollowers || autoStat(seed, 8000, 180000);
                  const likes    = p.statLikes    || autoStat(seed + 1, 150000, 950000);
                  const views    = p.statViews    || autoStat(seed + 2, 5000000, 120000000);
                  return (
                  <motion.div
                    key={p.id ?? i}
                    whileHover={{ y: -8, scale: 1.015 }}
                    transition={{ type: "spring", stiffness: 280, damping: 22 }}
                  >
                    <div className="block group cursor-default">
                      <div
                        className="relative overflow-hidden"
                        style={{
                          height: 420,
                          borderRadius: 24,
                          boxShadow: "0 24px 64px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.08)",
                        }}
                      >
                        {/* Full-bleed photo */}
                        <img
                          src={p.imageUrl || "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80&fit=crop"}
                          alt={p.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* Hover tint */}
                        <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-300 z-10" />

                        {/* Bottom dark stat bar */}
                        <div
                          className="absolute bottom-0 inset-x-0 z-20 flex items-center gap-6 px-5 py-4"
                          style={{ background: "rgba(8,8,8,0.80)", backdropFilter: "blur(14px)" }}
                        >
                          {/* Follower — user-plus icon */}
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="#f97316" strokeWidth="1.8" viewBox="0 0 24 24">
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                              <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                              <line x1="19" y1="8" x2="19" y2="14" strokeLinecap="round"/>
                              <line x1="16" y1="11" x2="22" y2="11" strokeLinecap="round"/>
                            </svg>
                            <span className="text-white font-bold text-sm">{followers}</span>
                          </div>
                          {/* Likes */}
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="#f97316" strokeWidth="1.8" viewBox="0 0 24 24">
                              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="text-white font-bold text-sm">{likes}</span>
                          </div>
                          {/* Views — camera icon */}
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="#f97316" strokeWidth="1.8" viewBox="0 0 24 24">
                              <path d="M23 7l-7 5 7 5V7z" strokeLinecap="round" strokeLinejoin="round"/>
                              <rect x="1" y="5" width="15" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="text-white font-bold text-sm">{views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* Slider controls */}
            {showControls && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <button
                  onClick={prev}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: displayTotal }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`rounded-full transition-all duration-300 ${i === current ? "w-6 h-2 bg-accent" : "w-2 h-2 bg-white/30 hover:bg-white/60"}`}
                    />
                  ))}
                </div>
                <button
                  onClick={next}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link
            href="/projekte"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest border rounded-full px-8 py-3 text-white transition-all duration-300 hover:bg-white hover:text-[#0a1628]"
            style={{ borderColor: "rgba(255,255,255,0.25)" }}
          >
            {t.home.refsViewAllBottom} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { t } = useT();
  const heroSlides = makeHeroSlides(t);
  const services = makeServices(t);
  const steps = makeSteps(t);
  const stats = makeStats(t);
  const [slide, setSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );

  useEffect(() => {
    const timer = setInterval(() => setSlide(s => (s + 1) % heroSlides.length), 8000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const current = heroSlides[slide];

  return (
    <PublicLayout>
      <SeoHead slug="home" defaults={{ metaTitle: "Bleibsichtbar – Social Media Agentur | Digitale Sichtbarkeit", metaDescription: "Bleibsichtbar ist Ihre Social Media Agentur für professionelles Marketing, Webseiten, KI-Automatisierungen und mehr." }} />
      {/* ─── Hero ────────────────────────────────────────────────────────── */}
      <div
        className="relative min-h-[auto] sm:min-h-[100svh] flex items-center overflow-hidden -mt-20 pb-4 sm:pb-4"
        style={isMobile ? { background: "#ffffff" } : undefined}
      >
        {/* Animated bg — desktop/tablet only */}
        {!isMobile && (
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
        )}

        {/* Starfield + shooting stars overlay — desktop/tablet only */}
        {!isMobile && <StarfieldOverlay />}

        {/* Animated floating dots — desktop/tablet only */}
        {!isMobile && <FloatingDots />}

        {/* Glow orbs — desktop/tablet only */}
        {!isMobile && (
          <>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />
          </>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-4 sm:pt-24 sm:pb-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-6 lg:gap-12 items-center">
            {/* Left */}
            <div className="space-y-5 sm:space-y-8">
              <AnimatePresence mode="wait">
                <motion.div key={slide} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.6 }}>
                  {/* Pill */}
                  <div
                    className="inline-flex items-center space-x-2 rounded-full px-4 py-2 mb-5 sm:mb-8"
                    style={isMobile
                      ? { background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)" }
                      : { background: "rgba(255,255,255,0.10)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.20)" }
                    }
                  >
                    <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                    <span
                      className="text-sm font-medium"
                      style={isMobile ? { color: "#0a1628" } : { color: "rgba(255,255,255,0.9)" }}
                    >
                      {current.pill}
                    </span>
                  </div>

                  <h1
                    className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.08] tracking-tight"
                    style={isMobile ? { color: "#0a1628" } : { color: "#ffffff" }}
                  >
                    {current.headline.map((line, i) => (
                      <span key={i} className="block">
                        {i === 1 ? <span className="text-accent">{line}</span> : line}
                      </span>
                    ))}
                  </h1>

                  <p
                    className="text-base sm:text-xl max-w-lg leading-relaxed mt-4 sm:mt-6"
                    style={isMobile ? { color: "#374151" } : { color: "#ffffff" }}
                  >
                    {current.sub}
                  </p>

                  <div className="flex flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8">
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

                    {/* Secondary */}
                    <motion.div
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <Link
                        href="/projekte"
                        className="relative inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-base group overflow-hidden"
                        style={isMobile
                          ? { color: "#0a1628", background: "transparent", border: "1.5px solid #0a162820" }
                          : { color: "rgba(255,255,255,0.9)", background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.18)", backdropFilter: "blur(10px)" }
                        }
                      >
                        <motion.span
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
                          style={isMobile ? { background: "rgba(0,0,0,0.04)" } : { background: "rgba(255,255,255,0.1)" }}
                        />
                        <span className="relative">{t.home.viewProjects}</span>
                        <ChevronRight className="relative w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                      </Link>
                    </motion.div>
                  </div>

                  {/* Trust badges */}
                  <div
                    className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 sm:mt-10 pt-5 sm:pt-8 border-t"
                    style={isMobile ? { borderColor: "rgba(10,22,40,0.10)" } : { borderColor: "rgba(255,255,255,0.10)" }}
                  >
                    {t.home.badges.map(badge => (
                      <div
                        key={badge}
                        className="flex items-center space-x-2"
                        style={isMobile ? { color: "#4b5563" } : { color: "rgba(255,255,255,0.70)" }}
                      >
                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                        <span className="text-sm font-medium">{badge}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right — Dual Phone Composition */}
            <div className="flex justify-center relative mt-10 sm:mt-6 lg:mt-0 pt-6 pb-16 lg:py-10">

              {/* Ambient glows */}
              <div className="absolute pointer-events-none" style={{
                top: "5%", left: "0%", width: "55%", height: "70%",
                background: "radial-gradient(ellipse, rgba(34,197,94,0.16) 0%, transparent 65%)",
                filter: "blur(48px)",
              }} />
              <div className="absolute pointer-events-none" style={{
                top: "15%", right: "0%", width: "55%", height: "70%",
                background: "radial-gradient(ellipse, rgba(249,115,22,0.24) 0%, rgba(96,165,250,0.08) 55%, transparent 100%)",
                filter: "blur(48px)",
              }} />

              {/* ── Dual Phone Stage — fixed desktop size, CSS-scaled on mobile ── */}
              {(() => {
                const STAGE_W = 480;
                const STAGE_H = 640;
                // On mobile clamp available width to viewport minus 32px padding
                const availW = isMobile ? Math.min(typeof window !== "undefined" ? window.innerWidth - 32 : 340, 420) : STAGE_W;
                const scale = isMobile ? availW / STAGE_W : 1;
                return (
                  <div
                    style={{
                      width: isMobile ? availW : STAGE_W,
                      height: isMobile ? STAGE_H * scale : STAGE_H,
                      position: "relative",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      className="select-none"
                      style={{
                        position: "absolute",
                        top: 0, left: 0,
                        width: STAGE_W,
                        height: STAGE_H,
                        transform: isMobile ? `scale(${scale})` : undefined,
                        transformOrigin: "top left",
                        perspective: "1400px",
                        perspectiveOrigin: "50% 50%",
                      }}
                    >
                      {/* ── Voice Agent Phone — top-right, tilted right ── */}
                      <motion.div
                        animate={{ y: [0, -12, 0] }}
                        transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          width: 252,
                          height: 513,
                          zIndex: 4,
                          rotateY: 10,
                          rotateZ: 4,
                        }}
                      >
                        <div style={{
                          width: "100%", height: "100%",
                          borderRadius: 38, border: "8px solid #1a1a1c", background: "#1a1a1c",
                          overflow: "hidden", position: "relative", isolation: "isolate", willChange: "transform",
                          boxShadow: "8px 16px 40px rgba(0,0,0,0.35), 0 0 40px rgba(34,197,94,0.15), 0 0 0 1px rgba(255,255,255,0.10)",
                        }}>
                          <div style={{ position: "absolute", inset: 0, borderRadius: 30, overflow: "hidden", background: "#06080f" }}>
                            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 24, zIndex: 20, background: "#1a1a1c", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <div style={{ width: 64, height: 9, background: "#0a0a0a", borderRadius: 5 }} />
                            </div>
                            <div style={{ width: "100%", paddingTop: 24, height: "100%" }}>
                              <VoiceAgentPhone />
                            </div>
                            <div style={{ position: "absolute", bottom: 5, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 20 }}>
                              <div style={{ width: 60, height: 4, background: "#333", borderRadius: 3 }} />
                            </div>
                            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(170deg,rgba(255,255,255,0.05) 0%,transparent 100%)", pointerEvents: "none", zIndex: 10 }} />
                          </div>
                        </div>
                      </motion.div>

                      {/* ── Social Media Phone — bottom-left, tilted left ── */}
                      <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          width: 272,
                          height: 554,
                          zIndex: 5,
                          rotateY: -10,
                          rotateZ: -4,
                        }}
                      >
                        <div style={{
                          width: "100%", height: "100%",
                          borderRadius: 40, border: "8px solid #1a1a1c", background: "#1a1a1c",
                          overflow: "hidden", position: "relative", isolation: "isolate", willChange: "transform",
                          boxShadow: "-8px 16px 40px rgba(0,0,0,0.35), 0 0 45px rgba(249,115,22,0.15), 0 0 0 1px rgba(255,255,255,0.12)",
                        }}>
                          <div style={{ position: "absolute", inset: 0, borderRadius: 32, overflow: "hidden", background: "#f5f7fa" }}>
                            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 26, zIndex: 20, background: "#1a1a1c", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <div style={{ width: 70, height: 10, background: "#0a0a0a", borderRadius: 5 }} />
                            </div>
                            <div style={{ width: "100%", paddingTop: 26, height: "100%" }}>
                              <SocialMediaPhone />
                            </div>
                            <div style={{ position: "absolute", bottom: 5, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 20 }}>
                              <div style={{ width: 70, height: 4, background: "#1a1a1c", borderRadius: 3 }} />
                            </div>
                            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "35%", background: "linear-gradient(170deg,rgba(255,255,255,0.09) 0%,transparent 100%)", pointerEvents: "none", zIndex: 10 }} />
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Slide indicators */}
          <div className="flex items-center justify-center space-x-3 mt-4 sm:mt-8">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`transition-all duration-500 rounded-full ${i === slide ? "w-8 h-2 bg-accent" : "w-2 h-2 bg-white/30 hover:bg-white/50"}`}
              />
            ))}
          </div>
        </div>

        {/* Scroll indicator — desktop only */}
        <div className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2">
          <span className="text-white/80 text-[13px] font-semibold tracking-[0.25em] uppercase select-none drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">{t.home.discover}</span>
          <button
            onClick={() => document.getElementById("leistungen")?.scrollIntoView({ behavior: "smooth" })}
            className="relative flex items-center justify-center focus:outline-none group"
            aria-label="Zu Leistungen scrollen"
          >
            {/* Pulsing rings */}
            <motion.span
              className="absolute w-12 h-12 rounded-full border border-white/20"
              animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.span
              className="absolute w-12 h-12 rounded-full border border-white/15"
              animate={{ scale: [1, 1.6], opacity: [0.3, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
            />
            {/* Circle */}
            <motion.span
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/25 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.svg
                className="w-4 h-4 text-white"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </motion.svg>
            </motion.span>
          </button>
        </div>
      </div>

      {/* ─── Problem Statement ─────────────────────────────────────────────── */}
      <section className="py-24 bg-[#0a1628] text-white relative overflow-hidden">
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
            <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-6">{t.home.problemLabel}</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-tight mb-8">
              {t.home.problemQ1}{" "}
              <span className="text-accent">{t.home.problemQ2}</span> {t.home.problemQ3}
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
              {t.home.problemSub}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } } }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          >
            {t.home.stats.map((item, i) => {
              const icons = [Globe, Monitor, Target];
              const Icon = icons[i];
              return { ...item, icon: Icon };
            }).map((item, i) => (
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
      <section id="leistungen" className="py-28 bg-white relative overflow-hidden">
        {/* Subtle bg grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "radial-gradient(circle, #0a1628 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="text-center mb-20">
            <motion.span
              className="inline-flex items-center gap-2 bg-accent/10 text-accent font-semibold text-xs tracking-[0.18em] uppercase px-4 py-2 rounded-full mb-5"
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent" /> {t.home.servicesLabel}
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-5">
              {t.home.servicesTitle1} <span className="text-accent">{t.home.servicesTitle2}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.home.servicesSub}
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
                        {t.home.learnMore}
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
            <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-4">{t.home.processLabel}</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              {t.home.processTitle1} <span className="text-accent">{t.home.processTitle2}</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t.home.processSub}
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

      {/* ─── Social Media Projekte Slider ──────────────────────────────────── */}
      <SocialMediaSlider />

      {/* ─── Client Marquee ────────────────────────────────────────────────── */}
      <MarqueeClients />
    </PublicLayout>
  );
}
