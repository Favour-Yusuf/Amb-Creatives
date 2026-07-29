"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

type RotatingBadgeProps = {
  text: string;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Circular running text with a slot at the centre. The path is a full circle
 * built from two arcs so the type never hits a seam.
 */
/** Path radius in viewBox units, and the circumference the text has to fill. */
const RADIUS = 76;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
/** Geist Mono advance width, plus the tracking we set below. */
const ADVANCE_EM = 0.6;
const TRACKING_EM = 0.16;

export function RotatingBadge({ text, className, children }: RotatingBadgeProps) {
  const id = useId().replace(/:/g, "");
  const pathId = `badge-path-${id}`;

  // Size the type to the string so it fills the ring exactly — otherwise long
  // labels overrun the path (and get clipped) while short ones leave a gap.
  const fontSize = Math.max(
    7,
    Math.min(16, CIRCUMFERENCE / (text.length * (ADVANCE_EM + TRACKING_EM))),
  );

  return (
    <div className={cn("relative grid aspect-square place-items-center", className)}>
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full animate-spin-slow"
        aria-hidden
      >
        <defs>
          <path
            id={pathId}
            d={`M100,100 m-${RADIUS},0 a${RADIUS},${RADIUS} 0 1,1 ${RADIUS * 2},0 a${RADIUS},${RADIUS} 0 1,1 -${RADIUS * 2},0`}
            fill="none"
          />
        </defs>
        <text
          className="fill-current font-mono uppercase"
          style={{ fontSize, letterSpacing: `${TRACKING_EM}em` }}
        >
          <textPath href={`#${pathId}`} startOffset="0">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="relative">{children}</span>
    </div>
  );
}
