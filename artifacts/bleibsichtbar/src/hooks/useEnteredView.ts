import { useEffect, useRef, useState } from "react";

/**
 * True forever once the ref'd element has scrolled into view at least once.
 * Unlike a raw IntersectionObserver flag, this never flips back to false —
 * useful for "first time the customer actually saw this" triggers (e.g. a
 * one-shot celebration animation) that shouldn't replay on every scroll.
 */
export function useEnteredView<T extends HTMLElement>(threshold = 0.4) {
  const ref = useRef<T>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (entered) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [entered, threshold]);

  return { ref, entered };
}
