"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionLabel } from "@/components/ui/section-label";
import { WHY } from "@/lib/content";
import { cn } from "@/lib/utils";

const PANELS = [...WHY.panels, WHY.resolution];
const COUNT = PANELS.length;

/**
 * The pressure sequence. The section is tall; its inner viewport pins and the
 * statements are driven sideways by vertical scroll, so the reader feels the
 * industry moving past them. The final panel inverts to orange — the answer.
 */
export function Why() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `-${((COUNT - 1) / COUNT) * 100}%`],
  );
  const railScale = useTransform(scrollYProgress, [0, 1], [1 / COUNT, 1]);

  return (
    <section
      ref={sectionRef}
      id="why"
      className="relative h-[300vh] md:h-[360vh]"
      aria-label={WHY.label}
    >
      <div className="sticky top-0 flex h-dvh flex-col overflow-hidden">
        <div className="gutter pt-24 sm:pt-28">
          <SectionLabel index="02">{WHY.label}</SectionLabel>
        </div>

        <motion.div
          style={{ x }}
          className="flex flex-1 will-change-transform"
          // The track is COUNT screens wide.
        >
          {PANELS.map((text, i) => {
            const isResolution = i === COUNT - 1;
            return (
              <article
                key={i}
                className="relative flex h-full w-screen shrink-0 items-center gutter"
              >
                <div
                  className={cn(
                    "relative w-full",
                    // The answer arrives as an object, not a background change.
                    // Right clearance keeps the chapter rail off the orange.
                    isResolution &&
                      "invert-surface rounded-3xl bg-flare p-8 text-ink sm:p-14 lg:mr-32",
                  )}
                >
                  <p className="label-mono mb-7 flex items-center gap-3">
                    <span className={isResolution ? "opacity-100" : "text-flare"}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span aria-hidden className="h-px w-8 bg-current opacity-30" />
                    <span className="opacity-50">
                      {isResolution ? "The answer" : `Pressure ${i + 1} / ${COUNT - 1}`}
                    </span>
                  </p>

                  <p
                    className={cn(
                      "relative max-w-5xl",
                      isResolution
                        ? "text-big font-medium leading-snug sm:text-huge"
                        : "display-tight text-huge",
                    )}
                  >
                    {text}
                  </p>

                  {isResolution ? (
                    <p className="label-mono mt-10 max-w-md opacity-60">
                      Knowledge · Community · Resources · Accountability
                    </p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </motion.div>

        {/* Horizontal progress under the pinned viewport. */}
        <div className="gutter pb-8">
          <div className="h-px w-full bg-paper/15">
            <motion.div
              className="h-full w-full origin-left bg-flare"
              style={{ scaleX: railScale }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
