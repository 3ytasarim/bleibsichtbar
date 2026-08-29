import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";

const POP_DURATION_MS = 1600;

/**
 * One-shot "big trophy" celebration — pops in large centered over its parent
 * (which must be `position: relative`), wobbles once, then shrinks away and
 * unmounts. Fires once when `active` flips true; never replays for this
 * mounted instance. Skips entirely under prefers-reduced-motion.
 */
export function TrophyPop({ active }: { active: boolean }) {
  const [show, setShow] = useState(false);
  const [fired, setFired] = useState(false);

  useEffect(() => {
    if (!active || fired) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setFired(true);
    setShow(true);
    const timer = setTimeout(() => setShow(false), POP_DURATION_MS);
    return () => clearTimeout(timer);
  }, [active, fired]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
        >
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{
              scale: [0, 1.5, 1.25, 1.35, 1.25, 0],
              rotate: [0, -14, 14, -9, 9, 0],
            }}
            transition={{ duration: POP_DURATION_MS / 1000, times: [0, 0.22, 0.4, 0.55, 0.7, 1], ease: "easeInOut" }}
            className="drop-shadow-xl"
          >
            <Trophy className="w-20 h-20 text-emerald-500 fill-emerald-400/30" strokeWidth={1.5} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
