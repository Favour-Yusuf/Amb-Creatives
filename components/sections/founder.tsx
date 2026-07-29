"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Marquee } from "@/components/ui/marquee";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { SplitText } from "@/components/ui/split-text";
import { FOUNDER } from "@/lib/content";

const PORTRAIT_SRC = "/founder.jpg";

export function Founder() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  return (
    <section ref={sectionRef} id="founder" className="relative overflow-hidden py-24 sm:py-32">
      <span aria-hidden className="pointer-events-none absolute right-[-10vw] top-[10%] -z-10 hidden aspect-square w-[38vw] rounded-full bg-[radial-gradient(circle,var(--color-moss)_0%,transparent_70%)] lg:block" />
      <div className="gutter">
        <SectionLabel index="05">{FOUNDER.label}</SectionLabel>

        <div className="mt-12 grid gap-14 lg:grid-cols-12 lg:gap-12">
          {/* Portrait */}
          <motion.div
            className="lg:col-span-5"
            style={reduced ? undefined : { y: portraitY }}
          >
            <PortraitFrame src={PORTRAIT_SRC} alt={`${FOUNDER.name}, founder of AMB Creatives`} />
          </motion.div>

          {/* Biography */}
          <div className="lg:col-span-6 lg:col-start-7">
            <h2 className="display-tight text-jumbo">
              <SplitText text="Attah" />
              <br />
              <SplitText text="Moses" delay={0.06} />{" "}
              <span className="text-flare">
                <SplitText text="Bob" delay={0.12} />
              </span>
            </h2>

            <ul className="mt-8 flex flex-wrap gap-2">
              {FOUNDER.roles.map((role, i) => (
                <Reveal key={role} delay={i * 0.05} from="none">
                  <li className="label-mono rounded-full border border-moss-lift bg-moss/40 px-4 py-2 text-paper/70 transition-colors duration-300 hover:border-flare/50 hover:text-flare">
                    {role}
                  </li>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.1}>
              <p className="mt-10 text-lede leading-relaxed text-paper/80">
                {FOUNDER.intro}
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mt-6 leading-relaxed text-paper/60">{FOUNDER.body}</p>
            </Reveal>

            <Reveal delay={0.2}>
              <blockquote className="mt-10 border-t border-moss-lift pt-8">
                <p className="font-editorial text-[clamp(1.15rem,1.9vw,1.75rem)] italic leading-snug text-flare">
                  “{FOUNDER.mission}”
                </p>
                <footer className="label-mono mt-4 text-paper/55">
                  His mission, unchanged
                </footer>
              </blockquote>
            </Reveal>

            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-moss-lift pt-8">
              {FOUNDER.stats.map((stat, i) => (
                <Reveal key={stat.label} delay={i * 0.08}>
                  <div>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="display-tight text-[clamp(1.6rem,2.4vw,2.25rem)] leading-none text-paper">
                      {stat.value}
                    </dd>
                    <p className="mt-3 font-mono text-2xs uppercase leading-relaxed tracking-[0.14em] text-paper/55">
                      {stat.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Client roll */}
      <div className="relative mt-20 border-y border-moss-lift bg-moss/35 py-6">
        <p className="gutter label-mono mb-5 text-paper/55">Selected partners</p>
        <Marquee speed={-1.6} repeat={2}>
          {FOUNDER.clients.map((client) => (
            <span
              key={client}
              className="display-tight flex items-center whitespace-nowrap text-[clamp(1rem,1.9vw,1.65rem)] text-paper/80"
            >
              <span className="px-8">{client}</span>
              <span className="text-flare">/</span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* Disciplines */}
      <div className="gutter mt-14">
        <p className="label-mono mb-6 text-paper/55">Disciplines</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-3">
          {FOUNDER.disciplines.map((discipline, i) => (
            <Reveal key={discipline} delay={i * 0.03} from="none">
              <li className="font-mono text-micro uppercase tracking-[0.12em] text-paper/50 transition-colors hover:text-flare">
                {discipline}
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Film-frame plate. The portrait sits under a moss/flare duotone that clears on hover. */
function PortraitFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="group relative isolate aspect-4/5 w-full overflow-hidden border border-moss-lift bg-moss">
      {/* Sprocket holes — a nod to the cinematography half of the practice. */}
      {["left-2", "right-2"].map((side) => (
        <span
          key={side}
          aria-hidden
          className={`absolute ${side} inset-y-4 z-10 flex w-2 flex-col justify-between`}
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="block h-2 w-full rounded-[1px] bg-paper/40" />
          ))}
        </span>
      ))}

      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 40vw, 92vw"
        className="scale-[1.02] object-cover grayscale contrast-125 transition-all duration-700 ease-expo group-hover:scale-105 group-hover:grayscale-0 group-hover:contrast-100"
      />
      {/* A real duotone rather than a single tint: moss takes the shadows via
          `color`, flare lifts the highlights via `overlay`. Both clear on
          hover to hand the photograph back. */}
      <span
        aria-hidden
        className="absolute inset-0 bg-moss opacity-85 mix-blend-color transition-opacity duration-700 ease-expo group-hover:opacity-0"
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-flare opacity-45 mix-blend-overlay transition-opacity duration-700 ease-expo group-hover:opacity-0"
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-moss via-transparent to-moss/40"
      />

      {/* Corner crop marks */}
      {[
        "left-4 top-4 border-l border-t",
        "right-4 top-4 border-r border-t",
        "left-4 bottom-4 border-b border-l",
        "right-4 bottom-4 border-b border-r",
      ].map((position) => (
        <span
          key={position}
          aria-hidden
          className={`absolute ${position} h-5 w-5 border-flare`}
        />
      ))}

      <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-linear-to-t from-moss to-transparent px-6 pb-6 pt-14">
        <span className="label-mono text-paper">{FOUNDER.name}</span>
        <span className="label-mono text-flare">Founder</span>
      </figcaption>
    </figure>
  );
}
