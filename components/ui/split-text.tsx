"use client";

import { Fragment } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type SplitTextProps = {
  text: string;
  /** Granularity of the reveal. Chars are for short display lines only. */
  by?: "word" | "char";
  className?: string;
  /** Applied to every piece — use for per-word colour or style shifts. */
  itemClassName?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
};

const piece: Variants = {
  hidden: { y: "112%", rotate: 3 },
  show: {
    y: "0%",
    rotate: 0,
    transition: { duration: 1.05, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Masked type reveal. The full string stays in the accessibility tree via
 * aria-label while the visual pieces are hidden from screen readers, so the
 * effect never costs us a readable heading. Pieces are inline-block with real
 * whitespace between them, which keeps native line wrapping intact.
 */
export function SplitText({
  text,
  by = "word",
  className,
  itemClassName,
  delay = 0,
  stagger = 0.045,
  once = true,
}: SplitTextProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <span className={className}>{text}</span>;
  }

  const pieces = by === "char" ? Array.from(text) : text.split(" ");

  return (
    <motion.span
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-10% 0px -10% 0px" }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {pieces.map((value, i) => (
        <Fragment key={`${value}-${i}`}>
          <span
            aria-hidden
            className={cn("line-mask inline-block align-bottom", itemClassName)}
          >
            <motion.span
              variants={piece}
              className="inline-block will-change-transform"
            >
              {value === " " ? " " : value}
            </motion.span>
          </span>
          {by === "word" && i < pieces.length - 1 ? " " : null}
        </Fragment>
      ))}
    </motion.span>
  );
}
