"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useCheckout } from "@/components/checkout/checkout-provider";
import { SITE } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Retracts on the way down, returns on the way up. The wordmark stays put so
 * there is always one fixed anchor on screen.
 */
export function SiteNav() {
  const { open } = useCheckout();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [past, setPast] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setPast(y > 80);
    setHidden(y > previous && y > 320);
  });

  return (
    <motion.header
      className={cn(
        "fixed inset-x-0 top-0 z-90 gutter transition-colors duration-500",
        past && "bg-moss/80 backdrop-blur-xl",
      )}
      initial={{ y: 0 }}
      animate={{ y: hidden ? "-130%" : 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className={cn(
          "flex items-center justify-between gap-6 py-5 transition-colors duration-500",
          // A translucent ink plate keeps the bar legible over every section,
          // including the full-orange investment block.
          past ? "border-b border-moss-lift" : "border-b border-transparent",
        )}
      >
        <a
          href="#hero"
          className="group flex items-center"
          data-cursor-hover
          aria-label={`${SITE.name} — back to top`}
        >
          <Image
            src="/amb-logo.png"
            alt={SITE.name}
            width={1200}
            height={361}
            priority
            className="h-6 w-auto transition-opacity duration-300 group-hover:opacity-75 sm:h-7"
          />
        </a>

        <button
          type="button"
          onClick={() => open("nav")}
          data-cursor-hover
          data-cursor-label="Join"
          className="group relative overflow-hidden rounded-full bg-paper px-5 py-2.5 text-moss sm:px-6"
        >
          <span
            aria-hidden
            className="absolute inset-0 origin-bottom scale-y-0 bg-flare transition-transform duration-500 ease-expo group-hover:scale-y-100 group-focus-visible:scale-y-100"
          />
          <span className="relative label-mono font-semibold">
            Join — {SITE.priceLabel}
          </span>
        </button>
      </div>
    </motion.header>
  );
}
