"use client";

import type { ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import { useMediaQuery } from "@/lib/hooks";

/**
 * Lenis-driven inertial scrolling. Skipped entirely when the visitor asks for
 * reduced motion so the native scroll (and its accessibility affordances) is
 * left untouched.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  if (reduced) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.085,
        wheelMultiplier: 0.95,
        smoothWheel: true,
        // Let Lenis own in-page anchor jumps so the chapter rail eases too.
        anchors: { offset: -8, duration: 1.4 },
        // Touch devices keep their native momentum — it feels better than ours.
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
