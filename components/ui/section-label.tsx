"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type SectionLabelProps = {
  index: string;
  children: React.ReactNode;
  className?: string;
  /** Draws the rule toward the left instead of the right. */
  align?: "left" | "right";
};

/** Chapter furniture: index numeral, label, and a rule that draws itself. */
export function SectionLabel({
  index,
  children,
  className,
  align = "left",
}: SectionLabelProps) {
  const reduced = useReducedMotion();

  return (
    <div
      className={cn(
        "flex items-center gap-4 label-mono",
        align === "right" && "flex-row-reverse text-right",
        className,
      )}
    >
      <span className="text-flare">[{index}]</span>
      <span className="opacity-70">{children}</span>
      <motion.span
        aria-hidden
        className={cn(
          "h-px flex-1 bg-current opacity-25",
          align === "right" ? "origin-right" : "origin-left",
        )}
        initial={reduced ? undefined : { scaleX: 0 }}
        whileInView={reduced ? undefined : { scaleX: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
