"use client";

import { useRef, type PointerEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { SplitText } from "@/components/ui/split-text";
import { MEMBERSHIP, SITE } from "@/lib/content";

/** Everything in the box, presented as the box itself. */
export function Membership() {
  return (
    <section id="membership" className="relative gutter py-24 sm:py-32">
      <span
        aria-hidden
        className="texture-dots fade-radial pointer-events-none absolute inset-y-0 left-0 -z-10 w-2/3"
      />
      <SectionLabel index="06">Membership Includes</SectionLabel>

      <div className="mt-12 grid gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <MembershipPass />
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <h2 className="display-tight text-huge">
            <SplitText text="Twelve things" />
            <br />
            <span className="font-editorial lowercase italic text-flare">
              <SplitText text="you keep forever" delay={0.1} />
            </span>
          </h2>

          <ul className="mt-12">
            {MEMBERSHIP.map((item, i) => (
              <li key={item} className="border-t border-moss-lift">
                <Reveal delay={Math.min(i, 8) * 0.04} from="left" distance={24}>
                  <div className="group flex items-start gap-5 py-4">
                    <span
                      aria-hidden
                      className="mt-1 font-mono text-sm text-flare transition-transform duration-500 ease-expo group-hover:scale-125"
                    >
                      ✓
                    </span>
                    <span className="flex-1 text-lede leading-snug text-paper/80 transition-colors duration-300 group-hover:text-paper">
                      {item}
                    </span>
                    <span className="label-mono pt-1.5 text-paper/25">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** A physical object on a flat page — tilts toward the pointer with a live sheen. */
function MembershipPass() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const config = { stiffness: 140, damping: 18, mass: 0.5 };
  const rotateY = useSpring(useTransform(px, [0, 1], [-13, 13]), config);
  const rotateX = useSpring(useTransform(py, [0, 1], [11, -11]), config);
  const sheen = useTransform(
    [px, py],
    ([x, y]: number[]) =>
      `radial-gradient(35rem 28rem at ${x * 100}% ${y * 100}%, rgba(250,171,54,0.30), transparent 60%)`,
  );

  function track(event: PointerEvent<HTMLDivElement>) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  }

  function reset() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <div ref={ref} style={{ perspective: 1200 }} onPointerMove={track} onPointerLeave={reset}>
      <motion.div
        style={reduced ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative aspect-7/11 w-full overflow-hidden rounded-2xl border border-flare/50 bg-moss p-7 sm:p-8"
      >
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={reduced ? undefined : { backgroundImage: sheen }}
        />

        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <span className="label-mono text-flare">AMB / Creatives</span>
            <span className="label-mono text-right text-paper/50">
              Member
              <br />
              Pass
            </span>
          </div>

          <div>
            <p className="label-mono text-paper/55">Access level</p>
            <p className="display-tight mt-1 text-[clamp(1.75rem,3.4vw,2.5rem)] leading-none text-paper">
              Life
              <span className="text-flare">time</span>
            </p>
            <p className="mt-5 font-mono text-2xs uppercase tracking-[0.16em] text-paper/55">
              One-time investment · {SITE.priceLabel}
            </p>
          </div>

          {/* Perforation */}
          <div aria-hidden className="flex items-center gap-1.5 py-1">
            {Array.from({ length: 26 }).map((_, i) => (
              <span key={i} className="h-px flex-1 bg-moss-lift" />
            ))}
          </div>

          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="label-mono text-paper/55">Member</p>
              <p className="mt-1 font-mono text-sm text-paper/70">— — — — — —</p>
            </div>
            {/* Barcode */}
            <div aria-hidden className="flex h-9 items-end gap-[3px]">
              {[7, 3, 9, 4, 8, 2, 9, 5, 3, 8, 4, 9, 2, 7].map((height, i) => (
                <span
                  key={i}
                  className="w-[3px] bg-paper/60"
                  style={{ height: `${height * 11}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
