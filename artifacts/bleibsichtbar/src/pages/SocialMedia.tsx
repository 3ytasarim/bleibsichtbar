import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedHeroBackground, heroFadeUp } from "@/components/shared/AnimatedHero";
import { useGetProjects } from "@workspace/api-client-react";
import {
  Camera, Edit3, BarChart3, MessageSquare,
  CheckCircle2, Clock, Search, Target, Send, TrendingUp, Zap,
} from "lucide-react";

const SOCIAL_RE = /social.?media|instagram|tiktok|linkedin|content|reels?|stories/i;

// ─── Floating Social Platform Icons ───────────────────────────────────────────
const PLATFORMS = [
  {
    name: "Instagram",
    bg: "linear-gradient(135deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full p-[22%]">
        <rect x="2" y="2" width="20" height="20" rx="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill="white" stroke="none"/>
      </svg>
    ),
    x: "7%", y: "22%", size: 58, delay: 0, dur: 5.6, rotRange: [-6, 4], ampY: 12, opacity: 0.9,
  },
  {
    name: "TikTok",
    bg: "#010101",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-[22%]">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.06a8.16 8.16 0 004.79 1.53V7.12a4.85 4.85 0 01-1.02-.43z"/>
      </svg>
    ),
    x: "87%", y: "18%", size: 50, delay: 0.8, dur: 6.2, rotRange: [4, -3], ampY: 10, opacity: 0.8,
  },
  {
    name: "LinkedIn",
    bg: "#0A66C2",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-[20%]">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    x: "5%", y: "62%", size: 46, delay: 1.4, dur: 7.0, rotRange: [-3, 5], ampY: 9, opacity: 0.75,
  },
  {
    name: "YouTube",
    bg: "#FF0000",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-[20%]">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    x: "91%", y: "55%", size: 44, delay: 2.1, dur: 5.8, rotRange: [5, -5], ampY: 14, opacity: 0.7,
  },
  {
    name: "Facebook",
    bg: "#1877F2",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-[20%]">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    x: "14%", y: "78%", size: 40, delay: 0.5, dur: 6.5, rotRange: [-4, 4], ampY: 8, opacity: 0.6,
  },
  {
    name: "WhatsApp",
    bg: "#25D366",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-[20%]">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    x: "82%", y: "78%", size: 38, delay: 1.8, dur: 7.4, rotRange: [3, -3], ampY: 10, opacity: 0.6,
  },
  {
    name: "X",
    bg: "#000",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-[22%]">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    x: "48%", y: "85%", size: 36, delay: 2.5, dur: 6.8, rotRange: [-6, 6], ampY: 11, opacity: 0.5,
  },
  {
    name: "Pinterest",
    bg: "#E60023",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-[20%]">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
      </svg>
    ),
    x: "3%", y: "42%", size: 34, delay: 3.1, dur: 8.0, rotRange: [4, -4], ampY: 7, opacity: 0.45,
  },
];

function FloatingSocialIcons() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {PLATFORMS.map((p, i) => (
        <motion.div
          key={p.name}
          className="absolute select-none"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -p.ampY, 0, p.ampY * 0.6, 0],
            rotate: [p.rotRange[0], p.rotRange[1], p.rotRange[0]],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        >
          <div
            className="w-full h-full rounded-2xl shadow-2xl ring-1 ring-white/10"
            style={{ background: p.bg }}
          >
            {p.icon}
          </div>
          {/* Glow under each icon */}
          <div
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3/4 h-4 blur-xl rounded-full opacity-60"
            style={{ background: p.bg === "#010101" ? "#69C9D0" : p.bg }}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ─── Rising Reaction Particles ─────────────────────────────────────────────────
const REACTION_TYPES = [
  {
    color: "#e94560",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-[24%]">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    ),
  },
  {
    color: "#1877F2",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-[22%]">
        <path d="M1 21V9l7-7h6l1 1v4h5l2 2v6l-2 2h-5v4l-1 1H8l-7-7zm9-14H5l-2 2v9l5-4V7zm4 0v4l1 1h4v4h-4l-1 1v4h3v-3h4V10h-5l-1-1V7h-1z"/>
        <path d="M7 10h10v2H7z" transform="translate(-1 2)"/>
      </svg>
    ),
  },
  {
    color: "#1877F2",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-[22%]">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
      </svg>
    ),
  },
  {
    color: "#e94560",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-[22%]">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.86 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
      </svg>
    ),
  },
  {
    color: "#f97316",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-[22%]">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
      </svg>
    ),
  },
  {
    color: "#a855f7",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-[22%]">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      </svg>
    ),
  },
];

interface Particle { id: number; x: number; size: number; reactionIdx: number; dur: number; wobble: number; }
let _pid = 0;

function RisingReactions() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const spawn = () => {
      const p: Particle = {
        id: _pid++,
        x: 5 + Math.random() * 90,
        size: 32 + Math.random() * 24,
        reactionIdx: Math.floor(Math.random() * REACTION_TYPES.length),
        dur: 3.2 + Math.random() * 2.8,
        wobble: (Math.random() - 0.5) * 50,
      };
      setParticles(prev => [...prev.slice(-22), p]);
    };
    spawn();
    const t = setInterval(spawn, 420);
    return () => clearInterval(t);
  }, []);

  const remove = useCallback((id: number) => {
    setParticles(prev => prev.filter(p => p.id !== id));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
      {particles.map(p => {
        const reaction = REACTION_TYPES[p.reactionIdx];
        return (
          <motion.div
            key={p.id}
            className="absolute bottom-0"
            style={{ left: `${p.x}%`, width: p.size, height: p.size }}
            initial={{ y: 0, opacity: 0, scale: 0.4, rotate: -15 }}
            animate={{
              y: -(500 + Math.random() * 200),
              opacity: [0, 0.9, 0.9, 0.9, 0],
              scale: [0.4, 1, 1, 0.85],
              rotate: [Math.random() * 20 - 10, Math.random() * 20 - 10],
              x: [0, p.wobble, p.wobble * 0.5, 0],
            }}
            transition={{ duration: p.dur, ease: [0.22, 1, 0.36, 1], times: [0, 0.15, 0.6, 0.85, 1] }}
            onAnimationComplete={() => remove(p.id)}
          >
            <div
              className="w-full h-full rounded-xl shadow-lg ring-1 ring-white/20"
              style={{ background: reaction.color }}
            >
              {reaction.icon}
            </div>
            <div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-3 blur-md rounded-full opacity-60"
              style={{ background: reaction.color }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

function getPlatformGlow(category: string): string {
  if (/instagram/i.test(category)) return "#E1306C";
  if (/tiktok/i.test(category)) return "#00f2ea";
  if (/linkedin/i.test(category)) return "#0A66C2";
  if (/facebook/i.test(category)) return "#1877F2";
  if (/youtube/i.test(category)) return "#FF0000";
  return "#f97316";
}

function PhoneCard({ project, index }: { project: any; index: number }) {
  const glowColor = getPlatformGlow(project.category ?? "");
  const floatDuration = 3.2 + (index % 3) * 0.6;
  const floatDelay = (index % 4) * 0.5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group shrink-0 flex flex-col items-center"
      style={{ width: "190px" }}
    >
      {/* Phone + floating wrapper */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: floatDuration, delay: floatDelay, ease: "easeInOut" }}
        whileHover={{ scale: 1.06, rotateY: index % 2 === 0 ? 6 : -6, rotateX: -4 }}
        style={{ transformStyle: "preserve-3d", perspective: "1200px" }}
        className="relative"
      >
        {/* Ambient glow halo under phone */}
        <div
          className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-28 h-10 blur-2xl opacity-40 group-hover:opacity-75 transition-opacity duration-500 rounded-full pointer-events-none z-0"
          style={{ background: glowColor }}
        />

        {/* iPhone frame */}
        <div className="relative z-10 rounded-[2.8rem] bg-[#161616] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)] transition-all duration-500 group-hover:shadow-[0_50px_120px_-10px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.15)]"
          style={{ padding: "5px" }}>

          {/* Side volume buttons */}
          <div className="absolute -left-[3px] top-[88px] w-[3px] h-8 bg-[#2a2a2a] rounded-l-full" />
          <div className="absolute -left-[3px] top-[128px] w-[3px] h-[52px] bg-[#2a2a2a] rounded-l-full" />
          <div className="absolute -left-[3px] top-[188px] w-[3px] h-[52px] bg-[#2a2a2a] rounded-l-full" />
          {/* Power button */}
          <div className="absolute -right-[3px] top-[148px] w-[3px] h-[68px] bg-[#2a2a2a] rounded-r-full" />

          {/* Screen */}
          <div className="rounded-[2.4rem] overflow-hidden relative bg-black" style={{ width: "180px", height: "320px" }}>

            {/* Dynamic Island */}
            <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-[70px] h-[22px] bg-black rounded-full z-30 flex items-center justify-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#1e1e1e]" />
              <div className="w-[6px] h-[6px] rounded-full bg-[#1e1e1e] opacity-60" />
            </div>

            {/* Content image */}
            {project.imageUrl ? (
              <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <Camera className="w-10 h-10 text-gray-600" />
              </div>
            )}

            {/* Bottom overlay with info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
              <p className="text-white text-[11px] font-bold leading-snug line-clamp-2 drop-shadow">{project.title}</p>
              {project.clientName && (
                <p className="text-white/50 text-[9px] mt-0.5 font-medium">{project.clientName}</p>
              )}
            </div>

            {/* Platform badge top-right */}
            <div className="absolute top-8 right-3 z-20">
              <span
                className="text-[8px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-wide shadow"
                style={{ background: glowColor + "dd" }}
              >
                {(project.category ?? "Social").split(" ").slice(0, 2).join(" ")}
              </span>
            </div>

            {/* Subtle screen glare */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none rounded-[2.4rem]" />
          </div>

          {/* Home indicator */}
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-[52px] h-[3px] bg-[#444] rounded-full" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

// ─── Case Study Carousel ────────────────────────────────────────────────────────
// White-frame phone à la sparksocialagency.com
function PhoneFrame({ project, size, rotate, opacity, zIndex, onClick }: {
  project: any; size: "sm" | "lg"; rotate: number; opacity: number; zIndex: number; onClick?: () => void;
}) {
  const isLg = size === "lg";
  const totalW  = isLg ? 220 : 155;
  const screenW = isLg ? 196 : 138;
  const screenH = isLg ? 390 : 275;
  const pad     = isLg ? 12 : 8;

  return (
    <div
      onClick={onClick}
      className={`relative flex-shrink-0 select-none ${onClick ? "cursor-pointer" : ""}`}
      style={{ width: totalW, zIndex, transform: `rotate(${rotate}deg)`, opacity, transition: "opacity 0.4s, transform 0.4s" }}
    >
      {/* Outer shell: white/light silver frame */}
      <div
        style={{
          background: "linear-gradient(160deg, #f8f9fb 0%, #e8ecf0 100%)",
          borderRadius: isLg ? 38 : 28,
          padding: pad,
          boxShadow: isLg
            ? "0 32px 80px -8px rgba(0,0,0,0.28), 0 0 0 1px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)"
            : "0 16px 48px -6px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.05)",
          position: "relative",
        }}
      >
        {/* Side buttons (large phone only) */}
        {isLg && <>
          <div style={{ position: "absolute", left: -3, top: 86, width: 3, height: 28, background: "#cdd4dc", borderRadius: "2px 0 0 2px" }} />
          <div style={{ position: "absolute", left: -3, top: 122, width: 3, height: 44, background: "#cdd4dc", borderRadius: "2px 0 0 2px" }} />
          <div style={{ position: "absolute", left: -3, top: 174, width: 3, height: 44, background: "#cdd4dc", borderRadius: "2px 0 0 2px" }} />
          <div style={{ position: "absolute", right: -3, top: 136, width: 3, height: 58, background: "#cdd4dc", borderRadius: "0 2px 2px 0" }} />
        </>}

        {/* Screen */}
        <div
          style={{
            width: screenW, height: screenH,
            borderRadius: isLg ? 28 : 22,
            overflow: "hidden",
            position: "relative",
            background: "#f0f2f5",
          }}
        >
          {/* Status bar */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0,
            height: isLg ? 36 : 28, zIndex: 20, display: "flex",
            alignItems: "center", justifyContent: "space-between",
            padding: "0 14px",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(8px)",
          }}>
            <span style={{ fontSize: isLg ? 11 : 9, fontWeight: 700, color: "#1a2340", fontFamily: "system-ui" }}>
              {isLg ? "9:41" : "5:24"}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {/* Signal dots */}
              {[1,2,3].map(i => <div key={i} style={{ width: isLg ? 4 : 3, height: isLg ? 4 : 3, borderRadius: "50%", background: "#1a2340", opacity: 0.4 + i * 0.2 }} />)}
              {/* Wifi */}
              <svg width={isLg ? 13 : 10} height={isLg ? 10 : 8} viewBox="0 0 13 10" fill="none">
                <path d="M6.5 8.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="#1a2340" opacity=".7"/>
                <path d="M2 5.2A6.5 6.5 0 0 1 11 5.2" stroke="#1a2340" strokeWidth="1.3" strokeLinecap="round" opacity=".5"/>
                <path d="M0 2.8A9.5 9.5 0 0 1 13 2.8" stroke="#1a2340" strokeWidth="1.3" strokeLinecap="round" opacity=".3"/>
              </svg>
              {/* Battery */}
              <div style={{ width: isLg ? 20 : 15, height: isLg ? 10 : 8, border: "1px solid rgba(26,35,64,0.4)", borderRadius: 3, padding: "1px 1px", display: "flex" }}>
                <div style={{ flex: 1, background: "#1a2340", borderRadius: 2, opacity: 0.7 }} />
              </div>
            </div>
          </div>

          {/* Project image */}
          {project?.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project?.title ?? ""}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #c8d4de 0%, #aebece 100%)" }} />
          )}

          {/* Bottom overlay with title (large phone only) */}
          {isLg && (
            <>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,22,40,0.72) 0%, transparent 55%)" }} />
              <div style={{ position: "absolute", bottom: 20, left: 14, right: 14, zIndex: 10 }}>
                <p style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>
                  {project?.category}
                </p>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.3 }} className="line-clamp-2">
                  {project?.title}
                </p>
              </div>
            </>
          )}

          {/* Screen glare */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%)",
            borderRadius: isLg ? 28 : 22,
          }} />
        </div>

        {/* Home indicator */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: isLg ? 10 : 7, paddingBottom: isLg ? 5 : 4 }}>
          <div style={{ width: isLg ? 52 : 38, height: isLg ? 4 : 3, background: "#b8c4ce", borderRadius: 99 }} />
        </div>
      </div>
    </div>
  );
}

function CaseStudyCarousel({ projects }: { projects: any[] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const n = projects.length;

  useEffect(() => {
    if (isPaused || n === 0) return;
    const t = setInterval(() => setActiveIdx(i => (i + 1) % n), 3800);
    return () => clearInterval(t);
  }, [isPaused, n]);

  if (n === 0) return null;

  const active = projects[activeIdx];
  const prev   = projects[(activeIdx - 1 + n) % n];
  const next   = projects[(activeIdx + 1) % n];

  return (
    <div
      className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── Left: animated project content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Category + client */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs font-black text-accent uppercase tracking-widest">{active.category}</span>
            {active.clientName && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-400" />
                <span className="text-xs text-gray-500 font-medium">{active.clientName}</span>
              </>
            )}
          </div>

          <h3 className="text-3xl md:text-4xl lg:text-[2.8rem] font-display font-black leading-tight mb-5" style={{ color: "#0a1628" }}>
            {active.title}
          </h3>

          <div className="w-12 h-1 bg-accent rounded-full mb-6" />

          {active.description && (
            <p className="text-gray-600 text-base leading-relaxed mb-8 max-w-md">
              {active.description}
            </p>
          )}

          {active.tags && active.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {active.tags.map((tag: string) => (
                <span key={tag} className="text-[11px] font-semibold text-gray-500 border border-gray-300 px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Buttons row */}
          <div className="flex flex-wrap items-center gap-4">
            <Link href={`/projekte/${active.id}`}>
              <motion.span
                whileHover={{ x: 4 }}
                className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest border px-7 py-3 rounded-full transition-colors cursor-pointer hover:border-accent hover:text-accent"
                style={{ color: "#0a1628", borderColor: "rgba(10,22,40,0.35)" }}
              >
                Fallstudie ansehen
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.span>
            </Link>

            {/* Dot nav */}
            <div className="flex gap-2">
              {projects.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className={`rounded-full transition-all duration-300 ${i === activeIdx ? "w-6 h-2 bg-accent" : "w-2 h-2 bg-gray-300 hover:bg-gray-400"}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Right: 3 phones ── */}
      <div className="flex items-end justify-center gap-4 md:gap-6">
        {/* Left ghost phone */}
        <motion.div
          key={`prev-${activeIdx}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4"
        >
          <PhoneFrame
            project={prev}
            size="sm"
            rotate={-10}
            opacity={0.55}
            zIndex={10}
            onClick={() => setActiveIdx((activeIdx - 1 + n) % n)}
          />
        </motion.div>

        {/* Center main phone */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`center-${activeIdx}`}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ zIndex: 20 }}
          >
            <PhoneFrame project={active} size="lg" rotate={0} opacity={1} zIndex={20} />
          </motion.div>
        </AnimatePresence>

        {/* Right ghost phone */}
        <motion.div
          key={`next-${activeIdx}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4"
        >
          <PhoneFrame
            project={next}
            size="sm"
            rotate={10}
            opacity={0.55}
            zIndex={10}
            onClick={() => setActiveIdx((activeIdx + 1) % n)}
          />
        </motion.div>
      </div>
    </div>
  );
}

const services = [
  { icon: <Edit3 className="w-6 h-6" />, title: "Feedposts", desc: "Regelmäßige, hochwertige Beiträge, die Ihre Marke authentisch präsentieren und Reichweite aufbauen." },
  { icon: <Camera className="w-6 h-6" />, title: "Reels & Videos", desc: "Kurze, packende Videoinhalte für Instagram, TikTok und YouTube – produziert und geschnitten." },
  { icon: <Clock className="w-6 h-6" />, title: "Stories", desc: "Tägliche Story-Inhalte, die nah am Alltag Ihres Unternehmens sind und Vertrauen aufbauen." },
  { icon: <Camera className="w-6 h-6" />, title: "Content-Tag", desc: "Regelmäßige Drehtage direkt in Ihrem Unternehmen – 1x monatlich oder individuell abgestimmt." },
  { icon: <MessageSquare className="w-6 h-6" />, title: "Community Management", desc: "Wir antworten auf Kommentare und Nachrichten und pflegen Ihre Community aktiv." },
  { icon: <BarChart3 className="w-6 h-6" />, title: "Monatliches Reporting", desc: "Transparente KPI-Auswertung: Reichweite, Follower, Engagement und Handlungsempfehlungen." },
];

const steps = [
  {
    num: "01", title: "Analyse",
    desc: "Wir durchleuchten Ihren Ist-Zustand, analysieren Wettbewerber und definieren Ihre genaue Zielgruppe.",
    icon: Search,
    tags: ["Kanal-Audit", "Wettbewerber-Check", "Zielgruppe"],
    color: "from-blue-500 to-cyan-400",
  },
  {
    num: "02", title: "Strategie",
    desc: "Entwicklung einer maßgeschneiderten Content- und Plattformstrategie. Wer, was, wann und wo.",
    icon: Target,
    tags: ["Content-Plan", "Plattformwahl", "Posting-Rhythmus"],
    color: "from-violet-500 to-purple-400",
  },
  {
    num: "03", title: "Content Creation",
    desc: "Produktion hochwertiger Bilder, Reels und Texte, die Ihre Marke authentisch repräsentieren.",
    icon: Camera,
    tags: ["Fotografie", "Videoproduktion", "Copywriting"],
    color: "from-pink-500 to-rose-400",
  },
  {
    num: "04", title: "Publishing",
    desc: "Vollständige Übernahme der Veröffentlichung und aktives Community Management.",
    icon: Send,
    tags: ["Scheduling", "Hashtag-Optimierung", "Community-Mgmt."],
    color: "from-orange-500 to-amber-400",
  },
  {
    num: "05", title: "Reporting",
    desc: "Monatliche Auswertung aller KPIs und kontinuierliche Strategieanpassung auf Basis der Daten.",
    icon: BarChart3,
    tags: ["KPI-Dashboard", "Monatsbericht", "Strategieanpassung"],
    color: "from-green-500 to-emerald-400",
  },
];

const platforms = ["Instagram", "TikTok", "YouTube", "Facebook", "LinkedIn"];

function StepCard({ step, Icon, isLeft }: { step: typeof steps[0]; Icon: React.ElementType; isLeft: boolean }) {
  return (
    <div className={`group relative bg-white/5 border border-white/10 rounded-3xl p-7 hover:bg-white/10 hover:border-accent/30 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10 ${isLeft ? "lg:mr-10" : "lg:ml-10"}`}>
      <div className="flex items-start gap-4 mb-5">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/10 shrink-0">
          <span className="text-accent font-display font-black text-sm">{step.num}</span>
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-white mb-1">{step.title}</h3>
          <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
        </div>
      </div>
      <div className={`flex flex-wrap gap-2 ${isLeft ? "lg:justify-end" : ""}`}>
        {step.tags.map(tag => (
          <span key={tag} className="text-[11px] bg-white/8 border border-white/15 text-white/60 px-2.5 py-1 rounded-full font-medium">
            {tag}
          </span>
        ))}
      </div>
      <div className={`absolute -inset-px rounded-3xl bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`} />
    </div>
  );
}

export default function SocialMedia() {
  const { data: allProjects = [] } = useGetProjects({ published: true });
  const socialProjects = allProjects.filter(p => SOCIAL_RE.test(p.category ?? ""));

  const [form, setForm] = useState({
    company: "", platforms: [] as string[], feedposts: "", reels: "", stories: "",
    contentDay: "", hasWebsite: "", ads: "", wishes: "", goals: "",
    previousAgency: "", priorities: "", dislikes: "", collaboration: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const handlePlatform = (p: string) => {
    setForm(f => ({
      ...f,
      platforms: f.platforms.includes(p) ? f.platforms.filter(x => x !== p) : [...f.platforms, p],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company.trim()) {
      setFormError("Bitte geben Sie den Unternehmensnamen ein.");
      return;
    }
    setFormError("");
    setSubmitted(true);
  };

  return (
    <PublicLayout>
      {/* HERO */}
      <section className="relative bg-primary text-white overflow-hidden pt-32 pb-24">
        <AnimatedHeroBackground />
        <FloatingSocialIcons />
        <RisingReactions />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div custom={0} variants={heroFadeUp} initial="hidden" animate="visible">
            <span className="inline-block bg-white/10 border border-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6 tracking-wide">
              Social Media Management
            </span>
          </motion.div>
          <motion.h1 custom={1} variants={heroFadeUp} initial="hidden" animate="visible"
            className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
            Mehr Reichweite.<br />
            <span className="text-accent">Mehr Kunden.</span>
          </motion.h1>
          <motion.p custom={2} variants={heroFadeUp} initial="hidden" animate="visible"
            className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Wir bauen eine starke Präsenz auf, die Vertrauen schafft und neue Kunden bringt. Strategie, Content und Betreuung aus einer Hand.
          </motion.p>
          <motion.div custom={3} variants={heroFadeUp} initial="hidden" animate="visible"
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full px-8 bg-accent hover:bg-accent/90 text-white font-bold">
              <a href="#analysebogen">Jetzt Analysebogen ausfüllen</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 border-white/30 text-white bg-transparent hover:bg-white/10">
              <Link href="/kontakt">Kostenlos beraten lassen</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* LEISTUNGEN */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">Was wir übernehmen</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Unser Social Media <span className="text-accent">Rundum-Paket</span></h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Von der Strategie über die Produktion bis zur Auswertung – wir kümmern uns um alles.
              </p>
            </motion.div>
            <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s, i) => (
                <motion.div key={i} variants={fadeUp} className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-accent/30 hover:shadow-md transition-all group">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-5 group-hover:bg-accent group-hover:text-white transition-all">
                    {s.icon}
                  </div>
                  <h3 className="text-xl font-display font-bold mb-3">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* PROZESS — Animierte Timeline */}
      <section className="py-28 bg-primary text-white relative overflow-hidden">
        <AnimatedHeroBackground />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Header */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="text-center mb-20">
            <motion.p variants={fadeUp} className="text-accent font-semibold text-sm tracking-widest uppercase mb-4">
              Unser Prozess
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-display font-bold text-white">
              Schritt für Schritt zu mehr{" "}
              <span className="text-accent">Sichtbarkeit</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/60 text-lg mt-5 max-w-xl mx-auto">
              Unser bewährter 5-Stufen-Prozess bringt messbare Ergebnisse.
            </motion.p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical center line (desktop) */}
            <div className="hidden lg:block absolute left-1/2 top-6 bottom-6 w-px bg-gradient-to-b from-accent/60 via-white/10 to-transparent -translate-x-1/2 pointer-events-none" />

            <div className="space-y-10 lg:space-y-0">
              {steps.map((step, i) => {
                const isLeft = i % 2 === 0;
                const Icon = step.icon;
                return (
                  <div key={i} className="relative lg:grid lg:grid-cols-2 lg:gap-12 lg:mb-14 items-center">

                    {/* Center node (desktop) */}
                    <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 z-10 flex-col items-center">
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.4, type: "spring" }}
                        className={`w-14 h-14 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-2xl ring-4 ring-primary`}
                      >
                        <span className="text-white font-display font-black text-base">{step.num}</span>
                      </motion.div>
                    </div>

                    {/* Left column (desktop only) */}
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                      className="hidden lg:flex items-center"
                    >
                      {isLeft
                        ? <StepCard step={step} Icon={Icon} isLeft />
                        : <div />
                      }
                    </motion.div>

                    {/* Right column (desktop only) */}
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                      className="hidden lg:flex items-center"
                    >
                      {!isLeft
                        ? <StepCard step={step} Icon={Icon} isLeft={false} />
                        : <div />
                      }
                    </motion.div>

                    {/* Mobile card */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="lg:hidden col-span-2"
                    >
                      <StepCard step={step} Icon={Icon} isLeft={false} />
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* PLATTFORMEN */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/60 text-sm font-medium tracking-widest uppercase mb-6">Wir betreuen Sie auf allen Kanälen</p>
          <div className="flex flex-wrap justify-center gap-4">
            {platforms.map(p => (
              <span key={p} className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white font-semibold text-sm">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FALLSTUDIEN / CASE STUDIES CAROUSEL */}
      {allProjects.length > 0 && (
        <section className="overflow-hidden" style={{ background: "#dce8f0" }}>
          {/* Section Header */}
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 pt-20 pb-4">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <motion.p variants={fadeUp} className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">
                  Ergebnisse die überzeugen
                </motion.p>
                <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-display font-black leading-tight" style={{ color: "#0a1628" }}>
                  Unsere <span className="text-accent">Projekte</span>
                </motion.h2>
              </div>
              <motion.p variants={fadeUp} className="text-gray-500 text-base max-w-xs leading-relaxed">
                Klicken Sie durch die iPhones, um eine Auswahl unserer Projekte zu sehen.
              </motion.p>
            </motion.div>
            <motion.div
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="mt-8 h-px bg-gray-400/30"
            />
          </div>

          {/* Single Carousel */}
          <CaseStudyCarousel projects={allProjects} />
        </section>
      )}

      {/* ANALYSEBOGEN */}
      <section id="analysebogen" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-12">
              <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">Kostenlos & unverbindlich</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Social Media <span className="text-accent">Analysebogen</span></h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Füllen Sie unseren Analysebogen aus und wir melden uns innerhalb von 24 Stunden mit einem maßgeschneiderten Angebot.
              </p>
            </motion.div>

            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 bg-green-50 rounded-3xl border border-green-100">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-display font-bold mb-2">Vielen Dank!</h3>
                <p className="text-muted-foreground">Wir melden uns innerhalb von 24 Stunden bei Ihnen.</p>
              </motion.div>
            ) : (
              <motion.form noValidate variants={fadeUp} onSubmit={handleSubmit} className="bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100 space-y-8">

                <div>
                  <label className="block text-sm font-bold mb-2">Wie heißt Ihr Unternehmen oder Ihre Marke? *</label>
                  <input value={form.company} onChange={e => setForm(f => ({...f, company: e.target.value}))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent bg-white"
                    placeholder="Unternehmensname" />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-3">Welche Social-Media-Kanäle nutzen Sie derzeit aktiv? *</label>
                  <div className="flex flex-wrap gap-3">
                    {platforms.concat(["Sonstiges"]).map(p => (
                      <button key={p} type="button" onClick={() => handlePlatform(p)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${form.platforms.includes(p) ? "bg-primary text-white border-primary" : "bg-white border-gray-200 hover:border-primary text-foreground"}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { key: "feedposts", label: "Feedposts / Woche" },
                    { key: "reels", label: "Reels / Woche" },
                    { key: "stories", label: "Stories / Woche" },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-sm font-bold mb-2">{f.label} *</label>
                      <select value={(form as any)[f.key]} onChange={e => setForm(prev => ({...prev, [f.key]: e.target.value}))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 bg-white">
                        <option value="">Wählen</option>
                        {["0", "1", "2", "3", "4", "5+"].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-bold mb-3">Soll regelmäßig ein Content-Tag stattfinden? *</label>
                  <div className="flex flex-wrap gap-3">
                    {["1x pro Monat", "1x alle 3 Monate", "Individuell abgestimmt"].map(opt => (
                      <button key={opt} type="button" onClick={() => setForm(f => ({...f, contentDay: opt}))}
                        className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${form.contentDay === opt ? "bg-primary text-white border-primary" : "bg-white border-gray-200 hover:border-primary"}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {[
                  { key: "hasWebsite", label: "Besitzt Ihr Unternehmen bereits eine Webseite? Wünschen Sie eine Überarbeitung?" },
                  { key: "ads", label: "Möchten Sie zusätzlich Social-Media- oder Google-Ads schalten? Welches monatliche Budget ist geplant?" },
                  { key: "wishes", label: "Gibt es individuelle Wünsche, Themen oder Inhalte, die Ihnen besonders wichtig sind?" },
                  { key: "goals", label: "Was möchten Sie mit Ihrer Social-Media-Betreuung erreichen?" },
                  { key: "previousAgency", label: "Hatten Sie bereits Kontakt mit einer Social-Media-Agentur oder betreuen Sie Ihre Kanäle bisher selbst?" },
                  { key: "priorities", label: "Was ist Ihnen in Ihrem Social-Media-Auftritt am wichtigsten?" },
                  { key: "dislikes", label: "Gibt es bestimmte Dinge oder Darstellungsarten, die Sie nicht wünschen?" },
                  { key: "collaboration", label: "Wie wünschen Sie sich die Zusammenarbeit mit Ihrer Agentur?" },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-bold mb-2">{field.label} *</label>
                    <textarea value={(form as any)[field.key]} onChange={e => setForm(prev => ({...prev, [field.key]: e.target.value}))}
                      rows={3}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent bg-white resize-none"
                      placeholder="Ihre Antwort..." />
                  </div>
                ))}

                {formError && (
                  <p className="text-sm text-red-600 font-medium text-center">{formError}</p>
                )}
                <Button type="submit" size="lg" className="w-full rounded-full font-bold py-4 text-base bg-accent hover:bg-accent/90">
                  Analysebogen absenden
                </Button>
                <p className="text-center text-xs text-muted-foreground">Kostenlos & unverbindlich. Wir melden uns innerhalb von 24 Stunden.</p>
              </motion.form>
            )}
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  );
}
