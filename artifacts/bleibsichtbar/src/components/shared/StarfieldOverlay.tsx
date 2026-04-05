import { useEffect, useRef } from "react";

/* ShootingStar & Starfield logic from @manufosela (copyleft 2013-2023, ES6 2023/12/03) */

const STARS_NUM = 2000;

class ShootingStar {
  private n = 0;
  private m = 0;
  private defaultOptions = { velocity: 8, starSize: 10, life: 300, beamSize: 400, dir: -1 };
  private options: typeof this.defaultOptions = { ...this.defaultOptions };
  private capa: HTMLElement;
  private wW: number;
  private hW: number;

  constructor(el: HTMLElement) {
    this.capa = el;
    this.wW = el.clientWidth;
    this.hW = el.clientHeight;
  }

  private addBeamPart(x: number, y: number) {
    this.n++;
    const name = this.getRandom(100, 1);
    const oldStar = document.getElementById(`star${name}`);
    if (oldStar) oldStar.remove();

    const starDiv = document.createElement("div");
    starDiv.id = `star${name}`;
    this.capa.appendChild(starDiv);

    const hazDiv = document.createElement("div");
    hazDiv.id = `haz${this.n}`;
    hazDiv.className = "haz";
    hazDiv.style.cssText = `position:absolute; color:#FF0; width:10px; height:10px; font-weight:bold; font-size:${this.options.starSize}px; pointer-events:none; z-index:10;`;
    hazDiv.textContent = "·";
    starDiv.appendChild(hazDiv);

    if (this.n > 1) {
      const prev = document.getElementById(`haz${this.n - 1}`);
      if (prev) prev.style.color = "rgba(255,255,255,0.5)";
    }

    hazDiv.style.top = `${y + this.n}px`;
    hazDiv.style.left = `${x + this.n * this.options.dir}px`;
  }

  private delTrozoHaz() {
    this.m++;
    const haz = document.getElementById(`haz${this.m}`);
    if (haz) haz.style.opacity = "0";
  }

  private getRandom(max: number, min: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  launchStar(opts?: Partial<typeof this.defaultOptions>) {
    this.options = Object.assign({}, this.defaultOptions, opts);
    this.n = 0;
    this.m = 0;
    const x = this.getRandom(this.wW - this.options.beamSize - 100, 100);
    const y = this.getRandom(this.hW - this.options.beamSize - 100, 100);

    for (let i = 0; i < this.options.beamSize; i++) {
      setTimeout(() => this.addBeamPart(x, y), this.options.life + i * this.options.velocity);
    }
    for (let i = 0; i < this.options.beamSize; i++) {
      setTimeout(() => this.delTrozoHaz(), this.options.beamSize + i * this.options.velocity);
    }
  }

  launch(everySeconds: number) {
    this.launchStar();
    setInterval(() => {
      this.launchStar({
        dir: this.getRandom(1, 0) ? 1 : -1,
        life: this.getRandom(400, 100),
        beamSize: this.getRandom(700, 400),
        velocity: this.getRandom(10, 4),
      });
    }, everySeconds * 1000);
  }
}

class Starfield {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = this.canvas.parentElement?.clientWidth ?? window.innerWidth;
    this.canvas.height = this.canvas.parentElement?.clientHeight ?? window.innerHeight;
    this.drawStars();
  }

  private drawStars() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBackground();
    for (let i = 0; i < STARS_NUM; i++) {
      this.drawStar(
        Math.random() * this.canvas.width,
        Math.random() * this.canvas.height,
        Math.random() * 1.5,
        "white",
        Math.random() > 0.5,
      );
    }
  }

  private drawBackground() {
    const g = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    g.addColorStop(0, "black");
    g.addColorStop(0.5, "rgba(0,0,50,0.7)");
    g.addColorStop(1, "black");
    this.ctx.fillStyle = g;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawStar(x: number, y: number, radius: number, color: string, isBlur: boolean) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    this.ctx.fillStyle = color;
    if (isBlur) { this.ctx.shadowColor = color; this.ctx.shadowBlur = radius * 5; }
    this.ctx.fill();
    this.ctx.restore();
  }
}

export function StarfieldOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const sf = new Starfield(canvas);

    const ss1 = new ShootingStar(container);
    ss1.launch(5);
    const ss2 = new ShootingStar(container);
    ss2.launch(6);
    const ss3 = new ShootingStar(container);
    ss3.launch(7);

    return () => {
      container.querySelectorAll("[id^='star']").forEach(el => el.remove());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1, position: "absolute" }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: "screen", opacity: 0.8 }}
      />
    </div>
  );
}
