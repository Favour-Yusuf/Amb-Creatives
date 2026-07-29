"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "framer-motion";
import { cn } from "@/lib/utils";

type MarqueeProps = {
  children: ReactNode;
  /** Percent of track width travelled per second. Negative runs right-to-left. */
  speed?: number;
  /** Copies of `children` per half-track. Raise it when the content is short. */
  repeat?: number;
  className?: string;
  trackClassName?: string;
};

/**
 * Infinite marquee whose speed and direction are coupled to scroll velocity —
 * flick down and the band accelerates, scroll up and it reverses. Exactly two
 * copies of the track are rendered so a -50% translate lands on the seam.
 */
export function Marquee({
  children,
  speed = -4,
  repeat = 2,
  className,
  trackClassName,
}: MarqueeProps) {
  const reduced = useReducedMotion();
  const baseX = useMotionValue(0);
  const direction = useRef(1);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 380,
  });
  // Clamped, and deliberately shallow: scrolling should nudge the band, not
  // fling it. Beyond ±4000px/s of scroll the boost stops growing entirely.
  const velocityFactor = useTransform(
    smoothVelocity,
    [-4000, 0, 4000],
    [-1, 0, 1],
    { clamp: true },
  );

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduced) return;

    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;

    // Base drift plus at most an equal amount again from scroll — so the
    // fastest the type ever moves is twice its resting speed, still readable.
    const moveBy =
      direction.current * speed * (delta / 1000) * (1 + Math.abs(factor));

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className={cn("relative flex overflow-hidden", className)}>
      <motion.div
        style={reduced ? undefined : { x }}
        className={cn("flex w-max shrink-0 flex-nowrap", trackClassName)}
      >
        {/* Two identical halves — a -50% translate lands exactly on the seam.
            Only the first is exposed to assistive tech. */}
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 flex-nowrap items-center">
            {Array.from({ length: repeat }).map((_, copy) => (
              <div
                key={copy}
                className="flex shrink-0 flex-nowrap items-center"
                aria-hidden={half === 0 && copy === 0 ? undefined : true}
              >
                {children}
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
