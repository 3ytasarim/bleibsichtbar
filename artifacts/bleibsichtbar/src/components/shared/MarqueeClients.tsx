import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Client {
  id: number;
  name: string;
  imageUrl: string | null;
  sortOrder: number;
}

const PLACEHOLDER_GRADIENTS = [
  "linear-gradient(135deg,#f5a623 0%,#c8771a 100%)",
  "linear-gradient(135deg,#e94560 0%,#a01535 100%)",
  "linear-gradient(135deg,#1a1a2e 0%,#3a3a6e 100%)",
  "linear-gradient(135deg,#0f3460 0%,#1a6090 100%)",
  "linear-gradient(135deg,#533483 0%,#8b5fd4 100%)",
  "linear-gradient(135deg,#2d6a4f 0%,#52b788 100%)",
  "linear-gradient(135deg,#c62a47 0%,#e8567a 100%)",
  "linear-gradient(135deg,#1565c0 0%,#2196f3 100%)",
  "linear-gradient(135deg,#795548 0%,#a1887f 100%)",
  "linear-gradient(135deg,#37474f 0%,#607d8b 100%)",
];

function getApiBase() {
  if (typeof window !== "undefined" && window.location.hostname !== "localhost") return "";
  return "";
}

function ClientCard({ client, idx }: { client: Client; idx: number }) {
  const gradient = PLACEHOLDER_GRADIENTS[idx % PLACEHOLDER_GRADIENTS.length]!;

  return (
    <div className="group mx-3 select-none flex-shrink-0" style={{ width: 200 }}>
      <div
        className="relative rounded-2xl overflow-hidden shadow-sm border border-white/10
          group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300"
        style={{ height: 130 }}
      >
        {client.imageUrl ? (
          <img
            src={client.imageUrl}
            alt={client.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            draggable={false}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: gradient }}
          />
        )}
      </div>
    </div>
  );
}

interface MarqueeTrackProps {
  items: Client[];
  direction: "left" | "right";
}

function MarqueeTrack({ items, direction }: MarqueeTrackProps) {
  const animClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";
  const doubled = [...items, ...items, ...items];
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 z-10"
        style={{ background: "linear-gradient(to right, #f9fafb, transparent)" }} />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 z-10"
        style={{ background: "linear-gradient(to left, #f9fafb, transparent)" }} />
      <div className={`flex ${animClass}`} style={{ width: "max-content" }}>
        {doubled.map((client, i) => (
          <ClientCard key={`${client.id}-${i}`} client={client} idx={i % items.length} />
        ))}
      </div>
    </div>
  );
}

export function MarqueeClients() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    fetch("/api/clients")
      .then(r => r.json())
      .then((data: Client[]) => setClients(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const row1 = clients.length > 0 ? clients : [];
  const row2 = clients.length > 0 ? [...clients.slice(Math.ceil(clients.length / 2)), ...clients.slice(0, Math.ceil(clients.length / 2))] : [];

  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
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
          Unsere <span className="text-accent">Kunden</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Starke Marken, die uns vertrauen – gemeinsam für Ihren Erfolg.
        </p>
      </motion.div>

      {clients.length > 0 ? (
        <div className="space-y-4">
          <MarqueeTrack direction="left" items={row1} />
          {row2.length > 0 && <MarqueeTrack direction="right" items={row2} />}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-sm py-8">Kunden werden bald hinzugefügt.</p>
      )}

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
          { value: "5 Jahre", label: "Erfahrung & Expertise" },
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
