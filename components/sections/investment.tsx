"use client";

import { CtaButton } from "@/components/ui/cta-button";
import { Reveal } from "@/components/ui/reveal";
import { RotatingBadge } from "@/components/ui/rotating-badge";
import { SplitText } from "@/components/ui/split-text";
import { useCheckout } from "@/components/checkout/checkout-provider";
import { INVESTMENT } from "@/lib/content";

/**
 * The one colour inversion on the page. Moss does the heavy lifting here: it
 * is the ink of the whole section (6.99:1 on flare), the dot field that stops
 * the orange reading as a flat fill, and the concentric rings behind the price.
 */
export function Investment() {
  const { open } = useCheckout();

  return (
    <section
      id="investment"
      className="invert-surface relative z-10 -mt-10 overflow-hidden rounded-t-[2rem] bg-flare text-moss sm:-mt-16 sm:rounded-t-[4rem]"
    >
      {/* Moss dot field — stops the orange from reading as a flat plane. */}
      <span
        aria-hidden
        className="texture-dots fade-t pointer-events-none absolute inset-0 opacity-25"
      />

      {/* Concentric rings, anchored off the left edge behind the price. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/2 hidden -translate-y-1/2 md:block"
      >
        {[0, 1, 2].map((ring) => (
          <span
            key={ring}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-moss/25"
            style={{ width: 340 + ring * 190, height: 340 + ring * 190 }}
          />
        ))}
      </span>

      <div className="gutter relative py-24 sm:py-32">
        <div className="flex items-center gap-4 label-mono">
          <span>[07]</span>
          <span className="text-moss/80">{INVESTMENT.label}</span>
          <span aria-hidden className="h-px flex-1 bg-moss/30" />
        </div>

        <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Price */}
          <div className="lg:col-span-7">
            <p className="label-mono text-moss/80">{INVESTMENT.amountLabel}</p>
            <p className="display-tight mt-3 text-mega leading-[0.8]">
              <SplitText text={INVESTMENT.amount} by="char" stagger={0.04} />
            </p>
            <p className="display-tight mt-5 text-big">{INVESTMENT.membership}</p>
          </div>

          {/* Terms + action */}
          <div className="flex flex-col gap-8 lg:col-span-4 lg:col-start-9">
            <Reveal>
              <p className="text-lede leading-relaxed">{INVESTMENT.lead}</p>
            </Reveal>

            <ul className="flex flex-col gap-3 border-t border-moss/30 pt-6">
              {INVESTMENT.assurances.map((line, i) => (
                <Reveal key={line} delay={i * 0.08} from="none">
                  <li className="flex items-center gap-4">
                    <span aria-hidden className="font-mono text-sm text-moss/80">
                      ✕
                    </span>
                    <span className="text-lg text-moss/80 line-through decoration-moss/50 decoration-2">
                      {line}
                    </span>
                  </li>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.15}>
              <p className="display-tight text-[clamp(1.15rem,2vw,1.6rem)] leading-snug">
                {INVESTMENT.close}
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <CtaButton
                label={INVESTMENT.cta}
                variant="ink"
                onClick={() => open("investment")}
                className="w-full sm:w-auto"
              />
            </Reveal>
          </div>
        </div>
      </div>

      {/* Badge tucked into the corner, half off the edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-14 -right-10 hidden opacity-90 md:block"
      >
        <RotatingBadge
          text="Pay once · Belong for life · AMB Creatives · "
          className="w-52 text-moss lg:w-64"
        >
          <span className="display-tight text-3xl">✦</span>
        </RotatingBadge>
      </div>
    </section>
  );
}
