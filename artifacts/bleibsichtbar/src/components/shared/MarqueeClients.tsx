import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface MarqueeItem {
  id: string;
  name: string;
  imageUrl: string | null;
  sortOrder: number;
}

function LogoCard({ item }: { item: MarqueeItem; idx?: number }) {
  return (
    <div
      className="group flex-shrink-0 mx-4 select-none cursor-default"
      style={{ width: 260 }}
    >
      <div
        className="relative rounded-2xl transition-all duration-300
          bg-[#eef1f6] border-2 border-[#dde2ec] shadow-sm p-2
          group-hover:border-accent group-hover:shadow-[0_8px_32px_rgba(249,115,22,0.18)]
          group-hover:-translate-y-2 overflow-hidden"
        style={{ height: 170 }}
      >
        {/* Accent top bar on hover */}
        <div
          className="absolute top-0 left-4 right-4 h-0.5 rounded-full bg-accent
            scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
        />

        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-contain"
            style={{
              filter:
                "drop-shadow(0 0 6px rgba(0,0,0,0.35)) drop-shadow(0 0 2px rgba(0,0,0,0.5))",
            }}
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[#0a1628] font-bold text-2xl tracking-wide">
              {item.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function MarqueeTrack({ items, direction }: { items: MarqueeItem[]; direction: "left" | "right" }) {
  // Triple the items so CSS -33.333% translate = exactly one set = seamless loop
  const tripled = [...items, ...items, ...items];
  const animClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 z-10"
        style={{ background: "linear-gradient(to right, #f3f4f6, transparent)" }} />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 z-10"
        style={{ background: "linear-gradient(to left, #f3f4f6, transparent)" }} />

      <div className={`flex py-2 ${animClass}`} style={{ width: "max-content", willChange: "transform" }}>
        {tripled.map((item, i) => (
          <LogoCard key={`${item.id}-${i}`} item={item} idx={i % items.length} />
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
        ? clients.map((c: { id: number; name: string; imageUrl: string | null; sortOrder: number }) => ({
            id: `c-${c.id}`,
            name: c.name,
            imageUrl: c.imageUrl,
            sortOrder: c.sortOrder ?? 0,
          }))
        : [];

      const fromRefs: MarqueeItem[] = Array.isArray(references)
        ? references
            .filter((r: { logoUrl?: string | null }) => r.logoUrl)
            .map((r: { id: number; company: string; logoUrl: string | null; sortOrder: number }) => ({
              id: `r-${r.id}`,
              name: r.company,
              imageUrl: r.logoUrl,
              sortOrder: r.sortOrder ?? 0,
            }))
        : [];

      const merged = [...fromClients, ...fromRefs].sort((a, b) => a.sortOrder - b.sortOrder);
      setItems(merged);
    });
  }, []);

  const half = Math.ceil(items.length / 2);
  const row1 = items.length > 0 ? items : [];
  const row2 = items.length > 0 ? [...items.slice(half), ...items.slice(0, half)] : [];

  return (
    <section className="py-24 overflow-hidden" style={{ background: "#f3f4f6" }}>
      {/* Header */}
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

      {items.length > 0 ? (
        <div className="flex flex-col gap-6">
          <MarqueeTrack direction="left" items={row1} />
          {row2.length > 1 && <MarqueeTrack direction="right" items={row2} />}
        </div>
      ) : (
        <p className="text-center text-gray-400 text-sm py-10">Kunden werden bald hinzugefügt.</p>
      )}

      {/* Stats */}
      <motion.div
        className="max-w-3xl mx-auto mt-16 px-4 grid grid-cols-3 gap-5 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {[
          { value: "50+", label: "Zufriedene Kunden" },
          { value: "4.9★", label: "Durchschnittsbewertung" },
          { value: "5 Jahre", label: "Erfahrung & Expertise" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
            className="bg-white rounded-2xl px-6 py-6 shadow-sm border-2 border-gray-200 flex flex-col items-center
              hover:border-accent hover:shadow-[0_4px_20px_rgba(249,115,22,0.15)] transition-all duration-300"
          >
            <span className="text-2xl font-display font-bold" style={{ color: "#0a1628" }}>
              {s.value}
            </span>
            <span className="text-xs text-gray-400 mt-1 font-medium">{s.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
