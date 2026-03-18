import React from "react";
import { motion } from "framer-motion";

interface Orb { x: string; y: string; size: string; color: string; delay: number; dur: number; }

const orbs: Orb[] = [
  { x: "10%",  y: "20%", size: "300px", color: "bg-accent/20",     delay: 0,   dur: 7  },
  { x: "70%",  y: "5%",  size: "400px", color: "bg-blue-600/15",   delay: 1.5, dur: 9  },
  { x: "50%",  y: "60%", size: "250px", color: "bg-violet-600/10", delay: 0.8, dur: 11 },
  { x: "-5%",  y: "65%", size: "200px", color: "bg-accent/10",     delay: 2,   dur: 8  },
  { x: "85%",  y: "55%", size: "180px", color: "bg-cyan-500/10",   delay: 0.3, dur: 10 },
];

const dots = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: `${(i * 137.5 + 5) % 95}%`,
  y: `${(i * 73.1 + 8) % 90}%`,
  delay: (i * 0.3) % 4,
  dur: 3 + (i % 3),
}));

export function AnimatedHeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-[80px] ${orb.color}`}
          style={{ left: orb.x, top: orb.y, width: orb.size, height: orb.size }}
          animate={{
            scale: [1, 1.2, 0.95, 1],
            opacity: [0.6, 1, 0.7, 0.6],
            x: [0, 30, -20, 0],
            y: [0, -20, 15, 0],
          }}
          transition={{ duration: orb.dur, repeat: Infinity, delay: orb.delay, ease: "easeInOut" }}
        />
      ))}
      {dots.map(dot => (
        <motion.div
          key={dot.id}
          className="absolute w-1 h-1 rounded-full bg-white/25"
          style={{ left: dot.x, top: dot.y }}
          animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.5, 0.5] }}
          transition={{ duration: dot.dur, repeat: Infinity, delay: dot.delay, ease: "easeInOut" }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(249,115,22,0.08),transparent_60%)]" />
    </div>
  );
}

export const heroFadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};
