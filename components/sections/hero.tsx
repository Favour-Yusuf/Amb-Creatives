"use client";

import { useRef, type PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { CtaButton } from "@/components/ui/cta-button";
import { Marquee } from "@/components/ui/marquee";
import { SplitText } from "@/components/ui/split-text";
import { useCheckout } from "@/components/checkout/checkout-provider";
import { HERO } from "@/lib/content";

/** Headline reveal waits for the intro curtain to clear. */
const INTRO = 0.8;

export function Hero() {
  const { open } = useCheckout();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Pointer-tracked spotlight.
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(40);
  const smoothX = useSpring(glowX, { stiffness: 60, damping: 20 });
  const smoothY = useSpring(glowY, { stiffness: 60, damping: 20 });
  const glow = useTransform(
    [smoothX, smoothY],
    ([x, y]: number[]) =>
      `radial-gradient(36rem 32rem at ${x}% ${y}%, rgba(250,171,54,0.18), transparent 70%)`,
  );

  // Headline drifts slower than the page as you leave the hero.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const headlineY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  function trackPointer(event: PointerEvent<HTMLElement>) {
    if (reduced || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    glowX.set(((event.clientX - rect.left) / rect.width) * 100);
    glowY.set(((event.clientY - rect.top) / rect.height) * 100);
  }

  return (
    <section
      ref={sectionRef}
      id="hero"
      onPointerMove={trackPointer}
      className="relative flex min-h-dvh flex-col justify-between overflow-hidden pt-28 sm:pt-32"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={reduced ? undefined : { backgroundImage: glow }}
      />

      {/* Eyebrow — one line, one job. */}
      <div className="gutter">
        <motion.div
          className="flex items-center gap-3 border-b border-paper/10 pb-5"
          initial={reduced ? undefined : { opacity: 0, y: 12 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: INTRO - 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-flare" />
          <p className="label-mono text-paper/60">{HERO.subhead}</p>
        </motion.div>
      </div>

      {/* Headline */}
      <motion.h1
        style={reduced ? undefined : { y: headlineY, opacity: headlineOpacity }}
        className="gutter display-tight relative py-10 text-hero sm:py-12"
      >
        <span className="block">
          <SplitText text={HERO.headline[0]} delay={INTRO} stagger={0.055} />
        </span>
        <span className="block text-outline-thick text-paper">
          <SplitText text={HERO.headline[1]} delay={INTRO + 0.1} stagger={0.055} />
        </span>
        <span className="block">
          <span className="font-editorial text-flare italic lowercase tracking-[-0.01em]">
            <SplitText text="Ecosystem" delay={INTRO + 0.2} />
          </span>{" "}
          <SplitText text="Built" delay={INTRO + 0.26} />
        </span>
        <span className="block">
          <SplitText text="for the" delay={INTRO + 0.32} stagger={0.05} />{" "}
          <span className="text-flare">
            <SplitText text="AI" delay={INTRO + 0.4} />
          </span>{" "}
          <SplitText text="Era" delay={INTRO + 0.44} />
        </span>
      </motion.h1>

      {/* Foot: what it is on the left, what it costs and how to get it on the right. */}
      <div className="gutter">
        <motion.div
          className="grid gap-10 border-t border-paper/10 py-9 lg:grid-cols-12 lg:gap-8"
          initial={reduced ? undefined : { opacity: 0, y: 20 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: INTRO + 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="lg:col-span-6">
            <p className="max-w-xl text-lede text-paper/75">{HERO.body}</p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-paper/45">
              {HERO.support}
            </p>
          </div>

          <div className="flex flex-col gap-5 lg:col-span-5 lg:col-start-8 lg:items-end">
            <div className="lg:text-right">
              <p className="label-mono text-paper/50">{HERO.membership}</p>
              <p className="mt-1.5 display-tight text-big text-flare">
                {HERO.investment}
              </p>
            </div>

            <CtaButton
              label={HERO.cta}
              onClick={() => open("hero")}
              className="w-full sm:w-auto"
            />

            <span className="label-mono text-paper/35">Scroll to explore ↓</span>
          </div>
        </motion.div>
      </div>

      {/* Ribbon */}
      <div className="border-y border-paper/10 bg-flare py-3 text-ink">
        <Marquee speed={-2} repeat={3}>
          {HERO.ribbon.map((item, i) => (
            <span key={i} className="label-mono flex items-center whitespace-nowrap">
              <span className="px-6">{item}</span>
              <span aria-hidden className="text-[0.6rem]">
                ✦
              </span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
