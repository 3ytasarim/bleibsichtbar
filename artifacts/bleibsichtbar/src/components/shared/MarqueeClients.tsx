import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useT } from "@/i18n";

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
          loading="lazy"
          decoding="async"
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
  const { t } = useT();
  const cl = t.clients;
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

  const row1Items = items.filter(i => (i.row ?? 1) === 1);
  const row2Items = items.filter(i => (i.row ?? 1) === 2);

  // Row2'ye hiç atanmamışsa tüm öğeleri iki eşit parçaya böl
  const useAutoSplit = row2Items.length === 0 && row1Items.length > 0;
  const half = Math.ceil(row1Items.length / 2);
  const row1 = useAutoSplit ? row1Items.slice(0, half) : row1Items;
  const row2 = useAutoSplit ? row1Items.slice(half) : row2Items;

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
            {cl.badge}
          </p>
        </div>
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-4" style={{ color: "#0a1628" }}>
          {cl.title1} <span className="text-accent">{cl.title2}</span>
        </h2>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          {cl.sub}
        </p>
      </motion.div>

      {(row1.length > 0 || row2.length > 0) ? (
        <div className="flex flex-col gap-8">
          {row1.length > 0 && <MarqueeTrack direction="left" items={row1} duration={40} delay={0} />}
          {row2.length > 0 && <MarqueeTrack direction="right" items={row2} duration={27} delay={0} />}
        </div>
      ) : (
        <p className="text-center text-gray-400 text-sm py-10">{cl.empty}</p>
      )}

      {/* ─── Partner Logos ──────────────────────────────────────── */}
      <motion.div
        className="max-w-3xl mx-auto mt-16 px-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-3 gap-4 sm:gap-6">
          {[
            { name: "Strom Strategen", logo: `${import.meta.env.BASE_URL}partners/strom-strategen-t.png`, href: "https://strom-strategen.de/" },
            { name: "Rufschmiede",     logo: `${import.meta.env.BASE_URL}partners/rufschmiede-t.png`,     href: "https://rufschniede.com/"    },
            { name: "B2B Voice",       logo: `${import.meta.env.BASE_URL}partners/b2b-voice-t.png`,       href: "https://b2b-voice.com/"      },
          ].map((p, i) => (
            <motion.a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              whileHover={{ y: -4, scale: 1.07 }}
              className={`flex items-center justify-center transition-all duration-300 group
                ${i === 1 ? "rounded-2xl bg-[#0a1628] px-5 py-4" : ""}`}
            >
              <img
                src={p.logo}
                alt={p.name}
                loading="eager"
                draggable={false}
                className="w-full h-auto max-h-28 sm:max-h-32 object-contain select-none"
              />
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* ─── Stats ──────────────────────────────────────────────── */}
      <motion.div
        className="max-w-3xl mx-auto mt-5 px-4 grid grid-cols-3 gap-3 sm:gap-5 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {cl.stats.map((s, i) => (
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
