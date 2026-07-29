"use client";

import type { ComponentPropsWithoutRef } from "react";
import { Magnetic } from "@/components/ui/magnetic";
import { cn } from "@/lib/utils";

type Variant = "flare" | "ink" | "outline";

type CtaButtonProps = ComponentPropsWithoutRef<"button"> & {
  label: string;
  variant?: Variant;
  size?: "md" | "lg";
  magnetic?: boolean;
};

const shells: Record<Variant, string> = {
  // Moss, not black, on the orange face — warmer and unmistakably art-directed.
  flare: "bg-flare text-moss",
  ink: "bg-moss text-paper ring-1 ring-inset ring-moss-lift",
  outline: "bg-transparent text-paper ring-1 ring-inset ring-moss-lift",
};

const fills: Record<Variant, string> = {
  flare: "bg-paper",
  // `ink` sits on the orange section, so its hover fill has to be white —
  // an orange fill would dissolve the button into its own background.
  ink: "bg-paper",
  outline: "bg-flare",
};

const hoverInk: Record<Variant, string> = {
  flare: "group-hover:text-moss group-focus-visible:text-moss",
  ink: "group-hover:text-moss group-focus-visible:text-moss",
  outline: "group-hover:text-moss group-focus-visible:text-moss",
};

/**
 * The one button on the site. A fill wipes up from the baseline while the
 * label swaps for its own duplicate, so the whole control reads as a single
 * mechanical movement rather than a colour change.
 */
export function CtaButton({
  label,
  variant = "flare",
  size = "lg",
  magnetic = true,
  className,
  ...props
}: CtaButtonProps) {
  const button = (
    <button
      {...props}
      data-cursor-hover
      data-cursor-label="Join"
      className={cn(
        "group relative isolate inline-flex items-center justify-center gap-4 overflow-hidden rounded-full",
        "font-display font-bold uppercase leading-none tracking-[-0.02em] transition-colors duration-500",
        size === "lg"
          ? "px-9 py-5 text-[clamp(0.95rem,1.4vw,1.25rem)] sm:px-12 sm:py-6"
          : "px-7 py-4 text-[clamp(0.8rem,1vw,0.95rem)]",
        shells[variant],
        hoverInk[variant],
        className,
      )}
    >
      {/* Fill wipe */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10 origin-bottom scale-y-0 rounded-full transition-transform duration-650 ease-expo",
          "group-hover:scale-y-100 group-focus-visible:scale-y-100",
          fills[variant],
        )}
      />

      {/* Label swap */}
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-550 ease-expo group-hover:-translate-y-[140%] group-focus-visible:-translate-y-[140%]">
          {label}
        </span>
        <span
          aria-hidden
          className="absolute inset-0 block translate-y-[140%] transition-transform duration-550 ease-expo group-hover:translate-y-0 group-focus-visible:translate-y-0"
        >
          {label}
        </span>
      </span>

      {/* Travelling arrow */}
      <span
        aria-hidden
        className="relative block h-4 w-4 shrink-0 overflow-hidden sm:h-5 sm:w-5"
      >
        <ArrowGlyph className="absolute inset-0 transition-transform duration-550 ease-expo group-hover:translate-x-[150%] group-focus-visible:translate-x-[150%]" />
        <ArrowGlyph className="absolute inset-0 -translate-x-[150%] transition-transform duration-550 ease-expo group-hover:translate-x-0 group-focus-visible:translate-x-0" />
      </span>
    </button>
  );

  return magnetic ? <Magnetic className="inline-block">{button}</Magnetic> : button;
}

function ArrowGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path
        d="M3 10h13M11 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  );
}
