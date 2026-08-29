import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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

// Blue = trust/stability, emerald = growth/positive, a small bleibsichtbar-
// navy pop keeps the brand present without dominating the mood (replaces
// the earlier accent-orange pop per explicit request).
const orbs: Orb[] = [
  { x: "8%",  y: "15%", size: "320px", color: "bg-sky-400/20",    delay: 0,   dur: 9  },
  { x: "68%", y: "8%",  size: "280px", color: "bg-emerald-400/18", delay: 1.2, dur: 11 },
  { x: "45%", y: "55%", size: "240px", color: "bg-sky-300/15",    delay: 0.6, dur: 10 },
  { x: "85%", y: "60%", size: "180px", color: "bg-[#0a1f44]/12",  delay: 2,   dur: 8  },
  { x: "-5%", y: "65%", size: "220px", color: "bg-emerald-300/15", delay: 0.3, dur: 12 },
];

const mobileOrbs: Orb[] = [
  { x: "5%",  y: "10%", size: "200px", color: "bg-sky-400/18",    delay: 0, dur: 9  },
  { x: "60%", y: "5%",  size: "220px", color: "bg-emerald-400/15", delay: 1, dur: 11 },
];

function buildSparkles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: `${(i * 137.5 + 5) % 96}%`,
    y: `${(i * 73.1 + 8) % 94}%`,
    size: i % 5 === 0 ? "w-2 h-2" : i % 3 === 0 ? "w-1 h-1" : "w-1.5 h-1.5",
    color: i % 3 === 0 ? "bg-[#0a1f44]/55" : i % 3 === 1 ? "bg-sky-500/55" : "bg-emerald-500/50",
    delay: (i * 0.27) % 5,
    dur: 2.5 + (i % 4),
  }));
}

const sparkles = buildSparkles(110);
const mobileSparkles = buildSparkles(55);

/**
 * Ambient background for light surfaces (Login, customer Dashboard hero) —
 * soft trust-blue/emerald orbs plus small colored sparkle dots. Deliberately
 * NOT the WebGL AnimatedStarfield (additive-blended, needs a dark backdrop
 * to read) — everything here is plain opacity so it stays visible on white.
 */
export function LightTrustBackground() {
  const { reduced, mobile } = useMotionPrefs();
  const activeOrbs = mobile ? mobileOrbs : orbs;
  const blurClass = mobile ? "blur-[50px]" : "blur-[70px]";

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {activeOrbs.map((orb, i) => (
        reduced ? (
          <div
            key={i}
            className={`absolute rounded-full ${blurClass} ${orb.color}`}
            style={{ left: orb.x, top: orb.y, width: orb.size, height: orb.size }}
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
              scale: [1, 1.12, 0.95, 1],
              opacity: [0.7, 1, 0.8, 0.7],
              x: [0, mobile ? 12 : 25, mobile ? -8 : -18, 0],
              y: [0, mobile ? -8 : -18, mobile ? 6 : 12, 0],
            }}
            transition={{ duration: orb.dur, repeat: Infinity, delay: orb.delay, ease: "easeInOut" }}
          />
        )
      ))}

      {!reduced && (mobile ? mobileSparkles : sparkles).map((s) => (
        <motion.div
          key={s.id}
          className={`absolute rounded-full ${s.size} ${s.color}`}
          style={{ left: s.x, top: s.y }}
          animate={{ opacity: [0, 0.9, 0], scale: [0.5, 1.4, 0.5] }}
          transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
