"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useMediaQuery } from "@/lib/hooks";

/**
 * Replaces the system pointer on precise-pointer devices: a hard dot that
 * tracks exactly, and a lagging ring that swells and picks up a label over
 * anything marked `data-cursor-hover`.
 */
export function Cursor() {
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const active = finePointer && !reduced;

  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const ringX = useSpring(x, { stiffness: 380, damping: 34, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 380, damping: 34, mass: 0.5 });

  useEffect(() => {
    if (!active) return;

    document.body.dataset.cursor = "custom";

    function onMove(event: PointerEvent) {
      x.set(event.clientX);
      y.set(event.clientY);

      const target = (event.target as Element | null)?.closest?.(
        "[data-cursor-hover], a, button",
      );
      setHovering(Boolean(target));
      setLabel(
        target instanceof HTMLElement ? (target.dataset.cursorLabel ?? null) : null,
      );
    }

    function onLeave() {
      x.set(-200);
      y.set(-200);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      delete document.body.dataset.cursor;
    };
  }, [active, x, y]);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-120 hidden md:block" aria-hidden>
      <motion.div
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-paper"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        className="absolute left-0 top-0 grid place-items-center rounded-full border border-paper/50"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        // An ink chip with an orange label reads on black *and* on the orange
        // section — an orange chip would vanish on one of them.
        animate={{
          width: hovering ? (label ? 84 : 56) : 30,
          height: hovering ? (label ? 84 : 56) : 30,
          borderColor: hovering ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
          backgroundColor: label ? "rgba(0,0,0,1)" : "rgba(0,0,0,0)",
        }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
      >
        <AnimatePresence>
          {label ? (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.2 }}
              className="label-mono text-[0.5rem] text-flare"
            >
              {label}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
