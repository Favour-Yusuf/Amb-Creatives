"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useLenis } from "lenis/react";
import { INTRO_SEEN_KEY, useIntroSeen } from "@/lib/hooks";

const PANELS = 5;

/**
 * Opening title card. Rendered in the server HTML so there is no hydration
 * flash, then dismissed immediately on repeat visits (session-scoped) and for
 * reduced-motion visitors.
 */
export function Preloader() {
  const reduced = useReducedMotion();
  const introSeen = useIntroSeen();
  const lenis = useLenis();

  const [finished, setFinished] = useState(false);
  const skip = introSeen || Boolean(reduced);
  const open = !skip && !finished;

  const count = useMotionValue(0);
  const display = useTransform(count, (v) => String(Math.round(v)).padStart(3, "0"));
  const barScale = useTransform(count, [0, 100], [0, 1]);

  // Drive the counter; the curtain leaves when it lands on 100.
  useEffect(() => {
    if (!open) return;

    const controls = animate(count, 100, {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1],
      onComplete: () => {
        sessionStorage.setItem(INTRO_SEEN_KEY, "1");
        setFinished(true);
      },
    });

    return () => controls.stop();
  }, [open, count]);

  // Hold the page still for exactly as long as the curtain is up.
  useEffect(() => {
    if (!open) return;

    lenis?.stop();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
      lenis?.start();
    };
  }, [open, lenis]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-200 flex flex-col justify-between gutter py-8"
          aria-hidden
        >
          {/* Curtain panels — these are what actually leave the screen. */}
          <div className="absolute inset-0 -z-10 flex">
            {Array.from({ length: PANELS }).map((_, i) => (
              <motion.div
                key={i}
                className={i % 2 === 0 ? "h-full flex-1 bg-ink" : "h-full flex-1 bg-moss"}
                exit={{ y: "-100%" }}
                transition={{
                  duration: 0.75,
                  ease: [0.76, 0, 0.24, 1],
                  delay: i * 0.055,
                }}
              />
            ))}
          </div>

          <motion.div
            className="flex items-start justify-between"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            <Image
              src="/amb-logo.png"
              alt="AMB Creatives"
              width={1200}
              height={361}
              priority
              className="h-7 w-auto sm:h-9"
            />
            <span className="label-mono text-paper/50">Est. Lagos</span>
          </motion.div>

          <motion.div
            className="flex flex-col gap-6"
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.32 }}
          >
            <div className="flex items-end justify-between gap-6">
              <p className="display-tight text-huge text-paper">
                Creative
                <br />
                <span className="text-flare">Learning</span> Ecosystem
              </p>
              <motion.span className="display-tight text-jumbo leading-none text-paper/90 tabular-nums">
                {display}
              </motion.span>
            </div>

            <div className="h-px w-full bg-paper/20">
              <motion.div
                className="h-full origin-left bg-flare"
                style={{ scaleX: barScale }}
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
