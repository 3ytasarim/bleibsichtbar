import { motion } from "framer-motion";
import { AnimatedCountdown } from "@/components/ui/animated-countdown";
import { Heart } from "lucide-react";

const GERMAN_UNIT_LABELS = {
  days: "Tage",
  hours: "Stunden",
  minutes: "Minuten",
  seconds: "Sekunden",
};

/**
 * Live-ticking elapsed time since the customer's admin-set start date —
 * days/hours/minutes/seconds all counting up in real time via the
 * animated-countdown component's `elapsedFrom` mode. Never renders if no
 * start date is on file — no fabricated "day 1".
 */
export function DaysWithUsCounter({ startDate }: { startDate: string | null | undefined }) {
  if (!startDate) return null;

  return (
    <div className="flex flex-col items-center gap-2.5 shrink-0">
      <AnimatedCountdown
        elapsedFrom={startDate}
        variant="modern"
        size="sm"
        unitLabels={GERMAN_UNIT_LABELS}
        numberClassName="text-[#0a1f44]"
      />
      <p className="flex items-center gap-2 text-base font-semibold">
        <motion.span
          animate={{ scale: [1, 1.3, 1, 1.25, 1] }}
          transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 0.25, ease: "easeInOut", times: [0, 0.2, 0.35, 0.55, 0.7] }}
        >
          <Heart className="w-4 h-4 text-sky-400 fill-sky-400" />
        </motion.span>
        <motion.span
          // Two literal via-* utilities collapse to one (CSS rule order beats
          // className order in Tailwind's gradient stack), so the two-step
          // lighten only actually renders as an explicit arbitrary gradient.
          // Stops stay in the same navy hue as #0a1f44 (not the sky-* family,
          // which is a visibly different, more cyan blue) so this reads as
          // genuine tints of "bleibsichtbar blue", not an unrelated color.
          className="bg-[length:200%_100%] bg-[linear-gradient(to_right,#0a1f44_0%,#2563eb_33%,#60a5fa_66%,#0a1f44_100%)] bg-clip-text text-transparent"
          animate={{ backgroundPosition: ["0% 50%", "200% 50%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          Tage mit Bleibsichtbar
        </motion.span>
      </p>
    </div>
  );
}
