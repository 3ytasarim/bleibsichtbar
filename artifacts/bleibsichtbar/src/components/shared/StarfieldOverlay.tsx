import { useEffect, useRef } from "react";

const STARS_NUM = 1800;

interface SSOptions {
  velocity: number;
  starSize: number;
  life: number;
  beamSize: number;
  dir: number;
}

const DEFAULT_OPTS: SSOptions = { velocity: 8, starSize: 8, life: 300, beamSize: 400, dir: -1 };

class ShootingStarRunner {
  private n = 0;
  private m = 0;
  private wW = 0;
  private hH = 0;
  private opts: SSOptions = { ...DEFAULT_OPTS };
  private timeouts: ReturnType<typeof setTimeout>[] = [];
  private interval: ReturnType<typeof setInterval> | null = null;
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.wW = container.clientWidth;
    this.hH = container.clientHeight;
  }

  private rand(max: number, min: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private addBeamPart(x: number, y: number) {
    this.n++;
    const slot = this.rand(200, 1);
    this.container.querySelector(`#ss-star${slot}`)?.remove();
    const wrap = document.createElement("div");
    wrap.id = `ss-star${slot}`;
    this.container.appendChild(wrap);
    const dot = document.createElement("div");
    dot.id = `ss-haz${this.n}`;
    dot.style.cssText = [
      "position:absolute",
      "color:#FFD700",
      "width:6px",
      "height:6px",
      "font-weight:bold",
      `font-size:${this.opts.starSize}px`,
      "pointer-events:none",
      "z-index:5",
      `top:${y + this.n}px`,
      `left:${x + this.n * this.opts.dir}px`,
    ].join(";");
    dot.textContent = "·";
    wrap.appendChild(dot);
    if (this.n > 1) {
      const prev = this.container.querySelector<HTMLElement>(`#ss-haz${this.n - 1}`);
      if (prev) prev.style.color = "rgba(255,255,255,0.35)";
    }
  }

  private delBeamPart() {
    this.m++;
    const el = this.container.querySelector<HTMLElement>(`#ss-haz${this.m}`);
    if (el) el.style.opacity = "0";
  }

  launchStar(overrides?: Partial<SSOptions>) {
    this.opts = { ...DEFAULT_OPTS, ...overrides };
    this.n = 0;
    this.m = 0;
    this.wW = this.container.clientWidth;
    this.hH = this.container.clientHeight;
    const maxX = Math.max(60, this.wW - this.opts.beamSize - 80);
    const maxY = Math.max(60, this.hH - this.opts.beamSize - 80);
    const x = this.rand(maxX, 40);
    const y = this.rand(maxY, 40);
    for (let i = 0; i < this.opts.beamSize; i++) {
      this.timeouts.push(setTimeout(() => this.addBeamPart(x, y), this.opts.life + i * this.opts.velocity));
    }
    for (let i = 0; i < this.opts.beamSize; i++) {
      this.timeouts.push(setTimeout(() => this.delBeamPart(), this.opts.beamSize + i * this.opts.velocity));
    }
  }

  launch(everySeconds: number) {
    this.launchStar();
    this.interval = setInterval(() => {
      this.launchStar({
        dir: this.rand(1, 0) ? 1 : -1,
        life: this.rand(400, 100),
        beamSize: this.rand(600, 300),
        velocity: this.rand(8, 3),
      });
    }, everySeconds * 1000);
  }

  destroy() {
    this.timeouts.forEach(clearTimeout);
    this.timeouts = [];
    if (this.interval !== null) clearInterval(this.interval);
    this.container.querySelectorAll("[id^='ss-star']").forEach(el => el.remove());
  }
}

function renderStars(canvas: HTMLCanvasElement) {
  canvas.width = canvas.offsetWidth || canvas.parentElement?.clientWidth || 800;
  canvas.height = canvas.offsetHeight || canvas.parentElement?.clientHeight || 600;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < STARS_NUM; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = Math.random() * 1.2 + 0.1;
    const alpha = 0.25 + Math.random() * 0.75;
    const isBlur = Math.random() > 0.55;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    if (isBlur) { ctx.shadowColor = "white"; ctx.shadowBlur = r * 5; }
    ctx.fill();
    ctx.restore();
  }
}

export function StarfieldOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    renderStars(canvas);
    const onResize = () => renderStars(canvas);
    window.addEventListener("resize", onResize);

    const configs: Array<{ delay: number; interval: number }> = [
      { delay: 200, interval: 5 },
      { delay: 1800, interval: 7 },
      { delay: 3400, interval: 9 },
    ];

    const runners: ShootingStarRunner[] = [];
    const initTimeouts: ReturnType<typeof setTimeout>[] = [];

    configs.forEach(({ delay, interval }) => {
      initTimeouts.push(setTimeout(() => {
        const r = new ShootingStarRunner(wrap);
        r.launch(interval);
        runners.push(r);
      }, delay));
    });

    return () => {
      window.removeEventListener("resize", onResize);
      initTimeouts.forEach(clearTimeout);
      runners.forEach(r => r.destroy());
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 1 }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.5 }}
      />
    </div>
  );
}
