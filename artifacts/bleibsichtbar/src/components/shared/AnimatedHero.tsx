import React, { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { StarfieldOverlay } from "./StarfieldOverlay";

function useMotionPrefs() {
  const [reduced, setReduced] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);

    setMobile(window.innerWidth < 768);

    return () => mq.removeEventListener("change", onChange);
  }, []);

  return { reduced, mobile };
}

interface Orb { x: string; y: string; size: string; color: string; delay: number; dur: number; }

const orbs: Orb[] = [
  { x: "10%",  y: "20%", size: "300px", color: "bg-accent/20",     delay: 0,   dur: 7  },
  { x: "70%",  y: "5%",  size: "400px", color: "bg-blue-600/15",   delay: 1.5, dur: 9  },
  { x: "50%",  y: "60%", size: "250px", color: "bg-violet-600/10", delay: 0.8, dur: 11 },
  { x: "-5%",  y: "65%", size: "200px", color: "bg-accent/10",     delay: 2,   dur: 8  },
  { x: "85%",  y: "55%", size: "180px", color: "bg-cyan-500/10",   delay: 0.3, dur: 10 },
];

const mobileOrbs: Orb[] = [
  { x: "5%",   y: "10%", size: "200px", color: "bg-accent/15",     delay: 0,   dur: 8  },
  { x: "65%",  y: "5%",  size: "250px", color: "bg-blue-600/12",   delay: 1,   dur: 10 },
];

const dots = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: `${(i * 137.5 + 5) % 95}%`,
  y: `${(i * 73.1 + 8) % 90}%`,
  delay: (i * 0.3) % 4,
  dur: 3 + (i % 3),
}));

export function AnimatedHeroBackground() {
  const { reduced, mobile } = useMotionPrefs();
  const activeOrbs = mobile ? mobileOrbs : orbs;
  const blurClass = mobile ? "blur-[50px]" : "blur-[80px]";

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <StarfieldOverlay />

      {activeOrbs.map((orb, i) => (
        reduced ? (
          <div
            key={i}
            className={`absolute rounded-full ${blurClass} ${orb.color}`}
            style={{
              left: orb.x, top: orb.y,
              width: orb.size, height: orb.size,
              willChange: "auto",
            }}
          />
        ) : (
          <motion.div
            key={i}
            className={`absolute rounded-full ${blurClass} ${orb.color}`}
            style={{
              left: orb.x, top: orb.y,
              width: orb.size, height: orb.size,
              willChange: "transform",
              transform: "translateZ(0)",
            }}
            animate={{
              scale: [1, 1.15, 0.95, 1],
              opacity: [0.6, 1, 0.7, 0.6],
              x: [0, mobile ? 15 : 30, mobile ? -10 : -20, 0],
              y: [0, mobile ? -10 : -20, mobile ? 8 : 15, 0],
            }}
            transition={{ duration: orb.dur, repeat: Infinity, delay: orb.delay, ease: "easeInOut" }}
          />
        )
      ))}

      {!mobile && !reduced && dots.map(dot => (
        <motion.div
          key={dot.id}
          className="absolute w-1 h-1 rounded-full bg-white/25"
          style={{ left: dot.x, top: dot.y, willChange: "opacity, transform" }}
          animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.5, 0.5] }}
          transition={{ duration: dot.dur, repeat: Infinity, delay: dot.delay, ease: "easeInOut" }}
        />
      ))}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(249,115,22,0.08),transparent_60%)]" />
    </div>
  );
}

export const heroFadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
};
