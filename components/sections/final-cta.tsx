"use client";

import { useRef, type PointerEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { CtaButton } from "@/components/ui/cta-button";
import { Reveal } from "@/components/ui/reveal";
import { SplitText } from "@/components/ui/split-text";
import { useCheckout } from "@/components/checkout/checkout-provider";
import { FINAL } from "@/lib/content";

/** Last word. Black, quiet at the edges, one lit thing in the middle. */
export function FinalCta() {
  const { open } = useCheckout();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const x = useMotionValue(50);
  const y = useMotionValue(50);
  const smoothX = useSpring(x, { stiffness: 55, damping: 20 });
  const smoothY = useSpring(y, { stiffness: 55, damping: 20 });
  const spotlight = useTransform(
    [smoothX, smoothY],
    ([cx, cy]: number[]) =>
      `radial-gradient(42rem 38rem at ${cx}% ${cy}%, rgba(250,171,54,0.22), transparent 68%)`,
  );

  function track(event: PointerEvent<HTMLElement>) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(((event.clientX - rect.left) / rect.width) * 100);
    y.set(((event.clientY - rect.top) / rect.height) * 100);
  }

  return (
    <section
      ref={ref}
      onPointerMove={track}
      className="relative flex min-h-dvh flex-col justify-center overflow-hidden py-24 sm:py-32"
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={reduced ? undefined : { backgroundImage: spotlight }}
      />

      <div className="gutter relative">
        <p className="label-mono text-flare">{FINAL.label}</p>

        <h2 className="mt-10 display-tight text-jumbo">
          <span className="block">
            <SplitText text={FINAL.headline[0]} />
          </span>
          <span className="block text-outline-thick text-paper">
            <SplitText text={FINAL.headline[1]} delay={0.08} />
          </span>
          <span className="block text-flare">
            <SplitText text={FINAL.headline[2]} delay={0.16} />
          </span>
        </h2>

        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <div className="flex flex-col gap-5 lg:col-span-5">
            {FINAL.body.map((line, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p
                  className={
                    i === 0
                      ? "text-big display-tight text-paper"
                      : "text-lede leading-relaxed text-paper/65"
                  }
                >
                  {line}
                </p>
              </Reveal>
            ))}
          </div>

          <div className="flex flex-col items-start gap-8 lg:col-span-5 lg:col-start-8 lg:items-end lg:text-right">
            <Reveal delay={0.1}>
              <p className="display-tight text-[clamp(1.1rem,1.7vw,1.6rem)] leading-snug">
                {FINAL.kicker}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <CtaButton
                label={FINAL.cta}
                onClick={() => open("final")}
                className="w-full sm:w-auto"
              />
            </Reveal>

            <p className="label-mono text-paper/45">{FINAL.terms}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
