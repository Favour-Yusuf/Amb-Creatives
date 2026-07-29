"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SectionLabel } from "@/components/ui/section-label";
import { SplitText } from "@/components/ui/split-text";
import { GAINS } from "@/lib/content";
import { cn, ordinal } from "@/lib/utils";

/**
 * An index rather than a card grid. Rows behave as an accordion — pointer
 * hover opens on desktop, tap or keyboard opens everywhere — and the active
 * row floods orange so only one thing is ever loud.
 */
export function Gains() {
  const [active, setActive] = useState<number | null>(0);
  const reduced = useReducedMotion();

  return (
    <section id="gains" className="relative py-24 sm:py-32">
      <div className="gutter">
        <SectionLabel index="03">What You&apos;ll Gain</SectionLabel>
        <h2 className="mt-10 max-w-4xl display-tight text-huge">
          <SplitText text="Six things that compound" />{" "}
          <span className="font-editorial lowercase italic text-flare">
            <SplitText text="from day one" delay={0.15} />
          </span>
        </h2>
      </div>

      <ul className="mt-12 border-t border-paper/15">
        {GAINS.map((gain, i) => {
          const isOpen = active === i;
          const panelId = `gain-panel-${i}`;

          return (
            <li
              key={gain.title}
              className="relative overflow-hidden border-b border-paper/15"
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setActive(i);
              }}
            >
              {/* Orange flood behind the whole row */}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-0 origin-left bg-flare transition-transform duration-700 ease-expo",
                  isOpen ? "scale-x-100" : "scale-x-0",
                )}
              />

              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  data-cursor-hover
                  onClick={() => setActive(isOpen ? null : i)}
                  onFocus={() => setActive(i)}
                  className={cn(
                    "group relative flex w-full items-center gap-5 gutter py-7 text-left transition-colors duration-500 sm:gap-8 sm:py-9",
                    // Open rows sit on the orange flood, so they invert too.
                    isOpen ? "invert-surface text-ink" : "text-paper",
                  )}
                >
                  <span
                    className={cn(
                      "label-mono shrink-0 transition-colors duration-500",
                      isOpen ? "text-ink/60" : "text-flare",
                    )}
                  >
                    {ordinal(i)}
                  </span>

                  <span className="display-tight flex-1 text-[clamp(1.15rem,2.4vw,2.25rem)] leading-[1.05]">
                    {gain.title}
                  </span>

                  <span
                    aria-hidden
                    className={cn(
                      "grid h-9 w-9 shrink-0 place-items-center rounded-full border text-lg transition-all duration-500 ease-expo sm:h-11 sm:w-11",
                      isOpen
                        ? "rotate-45 border-ink/30 bg-ink text-flare"
                        : "border-paper/25 group-hover:border-paper/60",
                    )}
                  >
                    +
                  </span>
                </button>
              </h3>

              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    id={panelId}
                    key="panel"
                    className="relative overflow-hidden"
                    initial={reduced ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduced ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="gutter pb-9">
                      <p className="max-w-3xl text-lede leading-relaxed text-ink/80 sm:pl-20">
                        {gain.body}
                      </p>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
