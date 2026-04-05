import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Starfield: new (canvasId: string) => {
      resizeCanvas: () => void;
      canvas: HTMLCanvasElement;
      drawStars: () => void;
    };
    ShootingStar: new (selector: string) => {
      launch: (interval: number) => void;
      wW: number;
      hW: number;
    };
  }
}

let scriptLoaded = false;
let scriptLoading = false;
const onLoadCallbacks: (() => void)[] = [];

function loadScript(cb: () => void) {
  if (scriptLoaded) { cb(); return; }
  onLoadCallbacks.push(cb);
  if (scriptLoading) return;
  scriptLoading = true;
  const script = document.createElement("script");
  script.src = "/shooting-stars.js";
  script.onload = () => {
    scriptLoaded = true;
    onLoadCallbacks.forEach(fn => fn());
    onLoadCallbacks.length = 0;
  };
  document.head.appendChild(script);
}

export function StarfieldOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    loadScript(() => {
      if (!containerRef.current) return;

      const w = container.clientWidth;
      const h = container.clientHeight;

      const sf = new window.Starfield("starCanvas");
      sf.resizeCanvas = function () {
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.drawStars();
      };
      sf.resizeCanvas();

      const ss1 = new window.ShootingStar("#hero-starfield");
      ss1.wW = w;
      ss1.hW = h;
      ss1.launch(5);

      const ss2 = new window.ShootingStar("#hero-starfield");
      ss2.wW = w;
      ss2.hW = h;
      ss2.launch(6);

      const ss3 = new window.ShootingStar("#hero-starfield");
      ss3.wW = w;
      ss3.hW = h;
      ss3.launch(7);
    });
  }, []);

  return (
    <div
      id="hero-starfield"
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 1, position: "absolute" }}
    >
      <canvas
        id="starCanvas"
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: "screen", opacity: 0.75 }}
      />
    </div>
  );
}
