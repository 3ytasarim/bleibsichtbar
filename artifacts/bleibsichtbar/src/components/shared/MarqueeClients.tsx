import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface MarqueeItem {
  id: string;
  name: string;
  imageUrl: string | null;
  sortOrder: number;
  row?: number;
}

function LogoCard({ item }: { item: MarqueeItem }) {
  return (
    <div className="flex-shrink-0 mx-10 select-none cursor-default flex items-center justify-center">
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.name}
          style={{ height: 80, width: "auto", maxWidth: 260 }}
          className="object-contain transition-opacity duration-300 opacity-90 hover:opacity-100"
          draggable={false}
        />
      ) : (
        <span className="text-gray-500 font-bold text-2xl tracking-wide">
          {item.name.slice(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  );
}

function MarqueeTrack({ items, direction, duration = 40, delay = 0 }: { items: MarqueeItem[]; direction: "left" | "right"; duration?: number; delay?: number }) {
  const tripled = [...items, ...items, ...items];
  const animName = direction === "left" ? "marquee-left" : "marquee-right";

  return (
    <div className="relative overflow-hidden marquee-row">
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 z-10"
        style={{ background: "linear-gradient(to right, #f3f4f6, transparent)" }} />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 z-10"
        style={{ background: "linear-gradient(to left, #f3f4f6, transparent)" }} />

      <div
        className="flex py-3"
        style={{
          width: "max-content",
          willChange: "transform",
          animation: `${animName} ${duration}s linear infinite`,
          animationDelay: `${delay}s`,
        }}
      >
        {tripled.map((item, i) => (
          <LogoCard key={`${item.id}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}

export function MarqueeClients() {
  const [items, setItems] = useState<MarqueeItem[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/clients").then(r => r.json()).catch(() => []),
      fetch("/api/references").then(r => r.json()).catch(() => []),
    ]).then(([clients, references]) => {
      const fromClients: MarqueeItem[] = Array.isArray(clients)
        ? clients.map((c: { id: number; name: string; imageUrl: string | null; sortOrder: number; row?: number }) => ({
            id: `c-${c.id}`,
            name: c.name,
            imageUrl: c.imageUrl,
            sortOrder: c.sortOrder ?? 0,
            row: c.row ?? 1,
          }))
        : [];

      const fromRefs: MarqueeItem[] = Array.isArray(references)
        ? references
            .filter((r: { logoUrl?: string | null }) => r.logoUrl)
            .map((r: { id: number; company: string; logoUrl: string | null; sortOrder: number; row?: number }) => ({
              id: `r-${r.id}`,
              name: r.company,
              imageUrl: r.logoUrl,
              sortOrder: r.sortOrder ?? 0,
              row: r.row ?? 1,
            }))
        : [];

      const merged = [...fromClients, ...fromRefs].sort((a, b) => a.sortOrder - b.sortOrder);
      setItems(merged);
    });
  }, []);

  const row1 = items.filter(i => (i.row ?? 1) === 1);
  const row2 = items.filter(i => (i.row ?? 1) === 2);

  return (
    <section className="py-24 overflow-hidden" style={{ background: "#f3f4f6" }}>
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 text-center"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <p className="text-accent font-semibold text-xs tracking-widest uppercase">
            Vertrauen seit Tag 1
          </p>
        </div>
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-4" style={{ color: "#0a1628" }}>
          Unsere <span className="text-accent">Kunden</span>
        </h2>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Starke Marken, die uns vertrauen – gemeinsam für Ihren Erfolg.
        </p>
      </motion.div>

      {(row1.length > 0 || row2.length > 0) ? (
        <div className="flex flex-col gap-8">
          {row1.length > 0 && <MarqueeTrack direction="left" items={row1} duration={40} delay={0} />}
          {row2.length > 0 && <MarqueeTrack direction="right" items={row2} duration={27} delay={0} />}
        </div>
      ) : (
        <p className="text-center text-gray-400 text-sm py-10">Kunden werden bald hinzugefügt.</p>
      )}

      <motion.div
        className="max-w-3xl mx-auto mt-16 px-4 grid grid-cols-3 gap-3 sm:gap-5 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {[
          { value: "50+", label: "Kunden" },
          { value: "4.9★", label: "Bewertung" },
          { value: "5 Jahre", label: "Erfahrung" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
            className="bg-white rounded-2xl px-2 py-4 sm:px-6 sm:py-6 shadow-sm border-2 border-gray-200 flex flex-col items-center
              hover:border-accent hover:shadow-[0_4px_20px_rgba(249,115,22,0.15)] transition-all duration-300"
          >
            <span className="text-lg sm:text-2xl font-display font-bold leading-tight" style={{ color: "#0a1628" }}>
              {s.value}
            </span>
            <span className="text-[10px] sm:text-xs text-gray-400 mt-1 font-medium leading-snug">{s.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
