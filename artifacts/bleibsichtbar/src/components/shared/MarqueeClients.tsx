import React from "react";
import { motion } from "framer-motion";

interface Client {
  name: string;
  industry: string;
  imageUrl?: string;
  placeholderGradient?: string;
}

const clients: Client[] = [
  { name: "Berliner Café Kette", industry: "Gastronomie", placeholderGradient: "linear-gradient(135deg,#f5a623 0%,#c8771a 100%)" },
  { name: "TechStart Berlin", industry: "SaaS & Tech", placeholderGradient: "linear-gradient(135deg,#e94560 0%,#a01535 100%)" },
  { name: "FashionForward GmbH", industry: "E-Commerce", placeholderGradient: "linear-gradient(135deg,#1a1a2e 0%,#3a3a6e 100%)" },
  { name: "SaaS Solutions AG", industry: "Software", placeholderGradient: "linear-gradient(135deg,#0f3460 0%,#1a6090 100%)" },
  { name: "Kreativ Studio", industry: "Kreativwirtschaft", placeholderGradient: "linear-gradient(135deg,#533483 0%,#8b5fd4 100%)" },
  { name: "Digital Brands GmbH", industry: "Marketing", placeholderGradient: "linear-gradient(135deg,#2d6a4f 0%,#52b788 100%)" },
  { name: "Media One", industry: "Medien", placeholderGradient: "linear-gradient(135deg,#c62a47 0%,#e8567a 100%)" },
  { name: "Startup Hub", industry: "Startup", placeholderGradient: "linear-gradient(135deg,#1565c0 0%,#2196f3 100%)" },
  { name: "Handwerk & Co.", industry: "Handwerk", placeholderGradient: "linear-gradient(135deg,#795548 0%,#a1887f 100%)" },
  { name: "Luxus Immobilien", industry: "Immobilien", placeholderGradient: "linear-gradient(135deg,#37474f 0%,#607d8b 100%)" },
];

interface ClientCardProps {
  client: Client;
}

function ClientCard({ client }: ClientCardProps) {
  const initials = client.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="group mx-3 select-none flex-shrink-0" style={{ width: 200 }}>
      <div
        className="relative rounded-2xl overflow-hidden shadow-sm border border-white/10
          group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300"
        style={{ height: 130 }}
      >
        {client.imageUrl ? (
          /* Real photo */
          <>
            <img
              src={client.imageUrl}
              alt={client.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              draggable={false}
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 55%)" }}
            />
          </>
        ) : (
          /* Placeholder: branded gradient tile */
          <div className="w-full h-full flex flex-col items-center justify-center"
            style={{ background: client.placeholderGradient ?? "linear-gradient(135deg,#0a1628,#1a3a6b)" }}>
            {/* Logo placeholder area – replace with <img> when ready */}
            <div className="flex flex-col items-center gap-2 opacity-90">
              <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-white font-bold text-base">{initials}</span>
              </div>
              <div className="h-px w-8 bg-white/30 rounded-full" />
            </div>
          </div>
        )}

        {/* Name + industry label at bottom */}
        <div
          className="absolute inset-x-0 bottom-0 px-3 py-2"
          style={{
            background: client.imageUrl
              ? "transparent"
              : "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)",
          }}
        >
          <p className="text-white text-[11px] font-bold leading-tight truncate drop-shadow">{client.name}</p>
          <p className="text-white/70 text-[10px] leading-tight truncate drop-shadow">{client.industry}</p>
        </div>
      </div>
    </div>
  );
}

interface MarqueeTrackProps {
  items: Client[];
  direction: "left" | "right";
}

function MarqueeTrack({ items, direction }: MarqueeTrackProps) {
  const animClass =
    direction === "left" ? "animate-marquee-left" : "animate-marquee-right";
  const doubled = [...items, ...items, ...items];

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 z-10"
        style={{ background: "linear-gradient(to right, #f9fafb, transparent)" }} />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 z-10"
        style={{ background: "linear-gradient(to left, #f9fafb, transparent)" }} />
      <div className={`flex ${animClass}`} style={{ width: "max-content" }}>
        {doubled.map((client, i) => (
          <ClientCard key={i} client={client} />
        ))}
      </div>
    </div>
  );
}

export function MarqueeClients() {
  const row1 = clients;
  const row2 = [...clients.slice(5), ...clients.slice(0, 5)];

  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      {/* Header */}
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">
          Vertrauen seit Tag 1
        </p>
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4" style={{ color: "#0a1628" }}>
          Unsere <span className="text-accent">Referenzkunden</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Starke Marken, die uns vertrauen – gemeinsam für Ihren Erfolg.
        </p>
      </motion.div>

      {/* Two marquee rows */}
      <div className="space-y-4">
        <MarqueeTrack direction="left" items={row1} />
        <MarqueeTrack direction="right" items={row2} />
      </div>

      {/* Stats */}
      <motion.div
        className="max-w-3xl mx-auto mt-16 px-4 grid grid-cols-3 gap-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {[
          { value: "50+", label: "Zufriedene Kunden" },
          { value: "4.9★", label: "Durchschnittsbewertung" },
          { value: "3 Jahre", label: "Erfahrung & Expertise" },
        ].map((s) => (
          <div key={s.label}
            className="bg-white rounded-2xl px-6 py-5 shadow-sm border border-gray-100 flex flex-col items-center">
            <span className="text-2xl font-display font-bold" style={{ color: "#0a1628" }}>
              {s.value}
            </span>
            <span className="text-xs text-muted-foreground mt-1">{s.label}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
