import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vr: number;
  size: number;
  color: string;
  shape: "rect" | "circle";
}

const CONFETTI_COLORS = ["#0ea5e9", "#10b981", "#f97316", "#8b5cf6", "#facc15"];
const DURATION_MS = 15000;
const SPAWN_WINDOW_MS = DURATION_MS * 0.4; // keep confetti falling for the first ~6s, then let it clear out
const FADE_MS = 2000;

function spawnParticle(canvas: HTMLCanvasElement, fromTop: boolean): Particle {
  const dpr = window.devicePixelRatio || 1;
  return {
    x: Math.random() * canvas.width,
    y: fromTop ? -10 : -20 - Math.random() * canvas.height * 0.4,
    vx: (Math.random() - 0.5) * 2.2 * dpr,
    vy: (1 + Math.random() * 2) * dpr,
    rotation: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.2,
    size: (5 + Math.random() * 5) * dpr,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    shape: Math.random() > 0.5 ? "rect" : "circle",
  };
}

/**
 * One-shot celebratory confetti burst layered over its parent (the parent
 * must be `position: relative` — this canvas fills it with `absolute
 * inset-0`). Fires once when `active` flips true and runs for ~10s, then
 * clears itself and never fires again for this mounted instance. Skips
 * entirely under prefers-reduced-motion.
 */
export function ConfettiBurst({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!active || firedRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !parent || !ctx) return;

    firedRef.current = true;

    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    let particles: Particle[] = Array.from({ length: 90 }, () => spawnParticle(canvas, false));
    const startTime = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (elapsed < SPAWN_WINDOW_MS && Math.random() < 0.5) {
        particles.push(spawnParticle(canvas, true));
      }

      const fadeStart = DURATION_MS - FADE_MS;
      const alpha = elapsed > fadeStart ? Math.max(0, 1 - (elapsed - fadeStart) / FADE_MS) : 1;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02 * dpr; // gravity
        p.rotation += p.vr;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      particles = particles.filter((p) => p.y < canvas.height + 40);

      if (elapsed < DURATION_MS) {
        raf = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-10" />;
}
