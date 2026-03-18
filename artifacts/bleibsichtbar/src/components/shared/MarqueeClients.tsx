import React from "react";

interface Client {
  name: string;
  initial: string;
  color: string;
}

const clients: Client[] = [
  { name: "FashionForward GmbH", initial: "FF", color: "#1a1a2e" },
  { name: "TechStart Berlin", initial: "TS", color: "#e94560" },
  { name: "Berliner Café Kette", initial: "BC", color: "#f5a623" },
  { name: "SaaS Solutions AG", initial: "SS", color: "#0f3460" },
  { name: "Kreativ Studio", initial: "KS", color: "#533483" },
  { name: "Digital Brands GmbH", initial: "DB", color: "#2d6a4f" },
  { name: "Media One", initial: "MO", color: "#c62a47" },
  { name: "Startup Hub", initial: "SH", color: "#1565c0" },
];

interface ClientCardProps {
  client: Client;
}

function ClientCard({ client }: ClientCardProps) {
  return (
    <div className="flex items-center space-x-3 bg-white border border-gray-100 rounded-2xl px-6 py-4 shadow-sm mx-3 min-w-[200px] select-none">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
        style={{ backgroundColor: client.color }}
      >
        {client.initial}
      </div>
      <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">{client.name}</span>
    </div>
  );
}

interface MarqueeTrackProps {
  direction: "left" | "right";
  items: Client[];
}

function MarqueeTrack({ direction, items }: MarqueeTrackProps) {
  const animClass =
    direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  const doubled = [...items, ...items, ...items];

  return (
    <div className="relative overflow-hidden">
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
  const row2 = [...clients].reverse();

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
          Unsere <span className="text-accent">Referenzkunden</span>
        </h2>
        <p className="text-muted-foreground text-lg">
          Starke Marken, die uns vertrauen – gemeinsam für Ihren Erfolg.
        </p>
      </div>

      <div className="space-y-4 py-2">
        <MarqueeTrack direction="left" items={row1} />
        <MarqueeTrack direction="right" items={row2} />
      </div>
    </section>
  );
}
