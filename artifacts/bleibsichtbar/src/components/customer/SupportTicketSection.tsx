import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useGetPortalSupportTickets } from "@workspace/api-client-react";
import { AdmitOneTicket, TICKET_LAYOUT, TICKET_TEXTURE, playShutterSound } from "@/components/ui/admit-one-ticket";
import { FluidParticlesBackground } from "@/components/ui/fluid-particles-background";
import { Button } from "@/components/ui/button";
import { CreateTicketModal } from "@/components/customer/CreateTicketModal";
import { heroFadeUp } from "@/components/shared/AnimatedHero";

// Three.js/react-three-fiber is a heavy stack (~150KB+) — lazy-loaded so it
// never delays the initial dashboard paint, only fetched once this card
// actually mounts.
const RobotWalker = lazy(() => import("@/components/ui/robot-walker").then((m) => ({ default: m.RobotWalker })));
import { LifeBuoy, MessageSquareText, ArrowRight } from "lucide-react";

/** Blue brand palette for the ticket visual — the registry component ships with a warm orange default. */
const BLUE_TEXTURE = {
  ...TICKET_TEXTURE,
  colorBack: "#0a1f44",
  colorFront: "#2563eb",
  colorHighlight: "#60a5fa",
};
const BLUE_LAYOUT = {
  ...TICKET_LAYOUT,
  inkColor: "#eaf2ff",
  watermarkColor: "#60a5fa",
  // Label ("KUNDENSUPPORT") and footer ("24/7 ERREICHBAR · ANTWORT < 24H")
  // render at normal weight in the source component — bumped up from the
  // default (~20/741 ≈ tiny at our card width) so they read clearly instead
  // of disappearing next to the bold "SUPPORT"/"BLEIBSICHTBAR".
  labelSize: 30 / 741,
  footerSize: 26 / 741,
};

/** Measures its own width so the (fixed-pixel-width) ticket visual stays responsive. */
function useContainerWidth(min: number, max: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(max);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? max;
      setWidth(Math.max(min, Math.min(max, Math.floor(w))));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [min, max]);
  return [ref, width] as const;
}

/**
 * Dashboard entry point for the support ticket system: the ticket visual +
 * a "Ticket erstellen" CTA. The full ticket history/thread view lives on its
 * own page (/dashboard/support, linked from here) — keeping this card from
 * growing unbounded as tickets pile up over time.
 */
export function SupportTicketSection() {
  const { data: tickets = [], isLoading } = useGetPortalSupportTickets();
  const [open, setOpen] = useState(false);
  const [ticketRef, ticketWidth] = useContainerWidth(240, 400);

  const handleOpen = () => {
    playShutterSound({ volume: 0.22 });
    setOpen(true);
  };

  const openCount = tickets.filter((t) => t.status !== "resolved" && t.status !== "closed").length;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={heroFadeUp}
      className="relative overflow-hidden bg-card border border-border rounded-2xl p-6 sm:p-8 mt-6"
    >
      <FluidParticlesBackground />
      <div className="relative z-10 grid lg:grid-cols-[minmax(0,340px)_1fr] gap-8 items-center">
        <div ref={ticketRef} className="w-full max-w-[360px] mx-auto lg:mx-0">
          <button
            type="button"
            onClick={handleOpen}
            aria-label="Support-Ticket erstellen"
            className="relative block mx-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] rounded-2xl"
            style={{ width: ticketWidth }}
          >
            <AdmitOneTicket
              name="SUPPORT"
              presenter=""
              event="KUNDENSUPPORT"
              venue="24/7 ERREICHBAR"
              dates="ANTWORT < 24H"
              stubText="ÖFFNEN"
              watermark="B"
              width={ticketWidth}
              texture={BLUE_TEXTURE}
              layout={BLUE_LAYOUT}
              tilt={{}}
              className="cursor-pointer"
            />
            {/* Same wordmark treatment as the login page logo (font-display, font-black,
               wide tracking, uppercase) — placed right under "SUPPORT", in white. */}
            <span
              aria-hidden
              className="pointer-events-none absolute font-display font-black uppercase tracking-[0.18em] text-white select-none"
              style={{
                left: BLUE_LAYOUT.padding * ticketWidth,
                top: (BLUE_LAYOUT.nameTop + BLUE_LAYOUT.nameLead + 0.018) * ticketWidth,
                fontSize: Math.max(12, 0.04 * ticketWidth),
              }}
            >
              Bleibsichtbar
            </span>
          </button>
        </div>

        <div className="relative min-w-0 min-h-[220px]">
          {/* The robot wanders the empty space to the right of the text —
             behind it, low-key, never covering the actual copy/CTA. */}
          <Suspense fallback={null}>
            <RobotWalker className="opacity-90" scale={2.2} color="#2563eb" pantallaColor="#93c5fd" />
          </Suspense>

          <div className="relative z-10 max-w-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#2563eb]/10 text-[#2563eb] flex items-center justify-center shrink-0">
                <LifeBuoy className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold font-display text-foreground">Brauchen Sie Hilfe?</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Ob Frage zur Rechnung, zu Social Media oder zur Website — eröffnen Sie ein Ticket und wir melden uns
              innerhalb von 24 Stunden.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <Button onClick={handleOpen} className="bg-[#2563eb] hover:bg-[#2563eb]/90">
                <MessageSquareText className="w-4 h-4 mr-2" /> Ticket erstellen
              </Button>

              {!isLoading && tickets.length > 0 && (
                <Link
                  href="/dashboard/support"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2563eb] hover:underline"
                >
                  Alle Tickets ansehen
                  {openCount > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#2563eb]/10 text-[#2563eb] text-[11px] font-semibold">
                      {openCount}
                    </span>
                  )}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <CreateTicketModal open={open} onOpenChange={setOpen} />
    </motion.div>
  );
}
