"use client";

import Image from "next/image";
import { useCheckout } from "@/components/checkout/checkout-provider";
import { CHAPTERS, FOUNDER, SITE } from "@/lib/content";

export function SiteFooter() {
  const { open } = useCheckout();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-moss pt-20">
      {/* Bookend to the Different section: the page starts and ends on ink,
          with moss plates carrying the weight in between. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-ink to-transparent"
      />
      <span
        aria-hidden
        className="texture-dots fade-b pointer-events-none absolute inset-0 opacity-60 [--texture-color:var(--color-moss-lift)]"
      />

      <div className="gutter relative grid gap-12 pb-20 sm:grid-cols-2 lg:grid-cols-12">
        {/* Masthead: the logo anchors the footer's first column rather than
            floating on its own row. */}
        <div className="lg:col-span-4">
          <Image
            src="/amb-logo.png"
            alt={SITE.name}
            width={1200}
            height={361}
            sizes="150px"
            className="h-8 w-auto sm:h-9"
          />
          <p className="mt-6 max-w-xs text-lede leading-snug text-paper/70">
            {SITE.tagline}
          </p>
        </div>

        <nav className="lg:col-span-3" aria-label="Sections">
          <p className="label-mono text-paper/55">Index</p>
          <ul className="mt-5 flex flex-col gap-2.5">
            {CHAPTERS.slice(1).map((chapter) => (
              <li key={chapter.id}>
                <a
                  href={`#${chapter.id}`}
                  data-cursor-hover
                  className="group inline-flex items-center gap-3 text-paper/60 transition-colors hover:text-paper"
                >
                  <span className="label-mono text-paper/25 transition-colors group-hover:text-flare">
                    {chapter.index}
                  </span>
                  {chapter.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-2">
          <p className="label-mono text-paper/55">Founded by</p>
          <p className="mt-5 leading-snug text-paper/70">{FOUNDER.name}</p>
          <p className="mt-2 font-mono text-2xs uppercase leading-relaxed tracking-[0.14em] text-paper/55">
            Creative Director
            <br />
            AI Specialist
          </p>
        </div>

        <div className="lg:col-span-3">
          <p className="label-mono text-paper/55">Membership</p>
          <p className="display-tight mt-4 text-[clamp(1.75rem,2.8vw,2.5rem)] leading-none">
            {SITE.priceLabel}
          </p>
          <p className="mt-2 font-mono text-2xs uppercase tracking-[0.14em] text-paper/55">
            Lifetime · One-time
          </p>
          <button
            type="button"
            onClick={() => open("footer")}
            data-cursor-hover
            data-cursor-label="Join"
            className="group relative mt-6 inline-flex overflow-hidden rounded-full bg-paper px-6 py-3 text-moss"
          >
            <span
              aria-hidden
              className="absolute inset-0 origin-bottom scale-y-0 bg-flare transition-transform duration-500 ease-expo group-hover:scale-y-100 group-focus-visible:scale-y-100"
            />
            <span className="relative label-mono font-semibold">Become a member</span>
          </button>
        </div>
      </div>

      <div className="gutter relative flex flex-wrap items-center justify-between gap-4 border-t border-moss-lift py-6">
        <p className="label-mono text-paper/55">
          © {year} {SITE.name}
        </p>
        <p className="label-mono text-paper/55">Built for creatives in the AI era</p>
        <a
          href="#hero"
          data-cursor-hover
          className="label-mono text-paper/55 transition-colors hover:text-flare"
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
