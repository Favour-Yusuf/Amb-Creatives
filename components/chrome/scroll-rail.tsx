"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { CHAPTERS } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Vertical chapter rail pinned to the right edge. Doubles as the table of
 * contents — each tick scrolls to its section.
 */
export function ScrollRail() {
  const [activeId, setActiveId] = useState<string>(CHAPTERS[0].id);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const sections = CHAPTERS.map((c) => document.getElementById(c.id)).filter(
      (el): el is HTMLElement => el !== null,
    );

    const observer = new IntersectionObserver(
      (entries) => {
        // The section occupying the middle band of the viewport wins.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const active = CHAPTERS.find((c) => c.id === activeId) ?? CHAPTERS[0];
  // The investment block is full-orange; white-on-orange furniture is unreadable,
  // so the rail flips to ink while it owns the viewport.
  const onFlare = activeId === "investment";

  return (
    <aside
      className={cn(
        "pointer-events-none fixed right-0 top-1/2 z-90 hidden -translate-y-1/2 pr-5 transition-colors duration-500 lg:block xl:pr-8",
        onFlare ? "text-moss" : "text-paper",
      )}
      aria-label="Section navigation"
    >
      <div className="flex flex-col items-end gap-3">
        <div className="mb-2 flex items-center gap-3 text-right">
          <span className="label-mono opacity-45">{active.name}</span>
          <span className={cn("label-mono", onFlare ? "opacity-100" : "text-flare")}>
            [{active.index}]
          </span>
        </div>

        {CHAPTERS.map((chapter) => {
          const isActive = chapter.id === activeId;
          return (
            <a
              key={chapter.id}
              href={`#${chapter.id}`}
              data-cursor-hover
              aria-label={`Go to ${chapter.name}`}
              aria-current={isActive ? "true" : undefined}
              className="pointer-events-auto group flex items-center justify-end gap-3 py-1"
            >
              <span className="label-mono translate-x-2 text-[0.5rem] opacity-0 transition-all duration-400 group-hover:translate-x-0 group-hover:opacity-60">
                {chapter.name}
              </span>
              <span
                className={cn(
                  "block h-px bg-current transition-all duration-500 ease-expo",
                  isActive
                    ? cn("w-9", !onFlare && "bg-flare")
                    : "w-4 opacity-30 group-hover:w-7 group-hover:opacity-70",
                )}
              />
            </a>
          );
        })}

        <div className={cn("mt-3 h-24 w-px", onFlare ? "bg-moss/30" : "bg-moss-lift")}>
          <motion.div
            className={cn("h-full w-full origin-top", onFlare ? "bg-moss" : "bg-flare")}
            style={{ scaleY: progress }}
          />
        </div>
      </div>
    </aside>
  );
}
