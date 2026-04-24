import { useEffect, useRef } from "react";

const isMobileDevice = () =>
  typeof window !== "undefined" && window.innerWidth < 768;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

class Starfield {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private starCount: number;
  private animFrameId: number | null = null;
  private stars: { x: number; y: number; r: number; blur: boolean }[] = [];

  constructor(canvas: HTMLCanvasElement, starCount: number) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: true })!;
    this.starCount = starCount;
    this.resizeCanvas();
    const ro = new ResizeObserver(() => this.resizeCanvas());
    ro.observe(canvas.parentElement!);
    (canvas as any)._ro = ro;
  }

  resizeCanvas() {
    const parent = this.canvas.parentElement;
    this.canvas.width = parent?.clientWidth ?? window.innerWidth;
    this.canvas.height = parent?.clientHeight ?? window.innerHeight;
    this.buildStars();
    this.draw();
  }

  private buildStars() {
    this.stars = Array.from({ length: this.starCount }, () => ({
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      r: Math.random() * 1.2 + 0.2,
      blur: Math.random() > 0.7,
    }));
  }

  private draw() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
    g.addColorStop(0, "black");
    g.addColorStop(0.5, "rgba(0,0,50,0.7)");
    g.addColorStop(1, "black");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const s of this.stars) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      if (s.blur) {
        ctx.shadowColor = "white";
        ctx.shadowBlur = s.r * 4;
      }
      ctx.fill();
      ctx.restore();
    }
  }

  destroy() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    const ro = (this.canvas as any)._ro;
    if (ro) ro.disconnect();
  }
}

class ShootingStar {
  private el: HTMLElement;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(el: HTMLElement) {
    this.el = el;
  }

  private getRandom(max: number, min: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private launch() {
    const wW = this.el.clientWidth;
    const hW = this.el.clientHeight;
    const beamSize = this.getRandom(500, 300);
    const velocity = this.getRandom(8, 4);
    const life = this.getRandom(300, 100);
    const dir = this.getRandom(1, 0) ? 1 : -1;
    const x = this.getRandom(wW - beamSize - 50, 50);
    const y = this.getRandom(hW - beamSize - 50, 50);
    const uid = Math.random().toString(36).slice(2);

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    for (let i = 0; i < beamSize; i++) {
      const t1 = setTimeout(() => {
        const dot = document.createElement("div");
        dot.className = `ss-dot-${uid}`;
        dot.style.cssText = `position:absolute;width:2px;height:2px;border-radius:50%;background:rgba(255,255,200,0.9);pointer-events:none;will-change:opacity;top:${y + i}px;left:${x + i * dir}px;`;
        this.el.appendChild(dot);
      }, life + i * velocity);
      timeouts.push(t1);
    }

    const t2 = setTimeout(() => {
      this.el.querySelectorAll(`.ss-dot-${uid}`).forEach(el => el.remove());
    }, life + beamSize * velocity + 200);
    timeouts.push(t2);
  }

  start(everySeconds: number) {
    this.launch();
    this.intervalId = setInterval(() => this.launch(), everySeconds * 1000);
  }

  stop() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.el.querySelectorAll("[class^='ss-dot-']").forEach(el => el.remove());
  }
}

export function StarfieldOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const mobile = isMobileDevice();
    const reduced = prefersReducedMotion();
    const starCount = mobile ? 600 : 2000;

    const sf = new Starfield(canvas, starCount);

    let shooters: ShootingStar[] = [];
    if (!mobile && !reduced) {
      const s1 = new ShootingStar(container);
      const s2 = new ShootingStar(container);
      s1.start(5);
      s2.start(8);
      shooters = [s1, s2];
    }

    const handleVisibility = () => {
      if (document.hidden) {
        shooters.forEach(s => s.stop());
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      sf.destroy();
      shooters.forEach(s => s.stop());
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: "screen", opacity: 0.8 }}
      />
    </div>
  );
}
