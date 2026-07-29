"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Marquee } from "@/components/ui/marquee";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { DIFFERENT } from "@/lib/content";
import { cn, ordinal } from "@/lib/utils";

/** The manifesto. One thing crossed out, six things put in its place. */
export function Different() {
  const reduced = useReducedMotion();

  return (
    <section
      id="different"
      className="relative overflow-hidden bg-moss py-24 sm:py-32"
    >
      {/* Seams: the moss plate rises out of ink and sinks back into it, so the
          tonal shift reads as a surface rather than a colour swap. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-ink to-transparent"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-ink to-transparent"
      />
      <span
        aria-hidden
        className="texture-grid fade-radial pointer-events-none absolute inset-0 opacity-70 [--texture-color:var(--color-moss-lift)]"
      />

      <div className="gutter relative">
        <SectionLabel index="04">{DIFFERENT.label}</SectionLabel>

        {/* The negative — struck through as it enters. */}
        <div className="relative mt-14 max-w-5xl">
          <h2 className="display-tight text-huge text-paper/50">
            {DIFFERENT.negative}
          </h2>
          <motion.span
            aria-hidden
            className="absolute left-0 top-1/2 h-[3px] w-full origin-left bg-flare sm:h-1"
            initial={reduced ? undefined : { scaleX: 0 }}
            whileInView={reduced ? undefined : { scaleX: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        <Reveal delay={0.1}>
          <p className="mt-12 max-w-2xl text-lede text-paper/70">{DIFFERENT.lead}</p>
        </Reveal>
      </div>

      {/* Rotated band cutting across the composition — flare on moss, the
          section's one loud moment. */}
      <div
        aria-hidden
        className="pointer-events-none relative my-16 -mx-[6vw] w-[112vw] -rotate-[2.5deg] border-y border-moss-lift bg-flare py-4"
      >
        <Marquee speed={1.6} repeat={2}>
          {DIFFERENT.pillars.map((pillar, i) => (
            <span
              key={i}
              className="display-tight flex items-center whitespace-nowrap text-[clamp(1.15rem,2.6vw,2.25rem)] text-moss"
            >
              <span className="px-6">{pillar}</span>
              <span className="text-moss/50">✦</span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* The six pillars, offset for rhythm. */}
      <ol className="gutter relative">
        {DIFFERENT.pillars.map((pillar, i) => (
          <li
            key={pillar}
            className={cn(
              "group border-t border-moss-lift py-6 sm:py-8",
              // Alternating indent breaks the left rag on purpose.
              i % 2 === 1 && "lg:pl-[18%]",
            )}
          >
            <Reveal from="left" distance={40} delay={i * 0.05}>
              <div className="flex items-baseline gap-5 sm:gap-8">
                <span className="label-mono shrink-0 text-flare">{ordinal(i)}</span>
                <span className="display-tight text-[clamp(1.2rem,2.6vw,2.35rem)] leading-tight transition-transform duration-500 ease-expo group-hover:translate-x-2">
                  {pillar}
                </span>
                <span
                  aria-hidden
                  className="ml-auto shrink-0 translate-x-4 text-flare opacity-0 transition-all duration-500 ease-expo group-hover:translate-x-0 group-hover:opacity-100"
                >
                  →
                </span>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>

      <div className="gutter relative mt-16">
        <Reveal>
          <p className="max-w-3xl border-l-2 border-flare pl-6 font-editorial text-[clamp(1.1rem,1.7vw,1.6rem)] italic leading-snug text-paper/85 sm:pl-10">
            {DIFFERENT.close}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
