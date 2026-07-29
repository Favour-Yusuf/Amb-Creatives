"use client";

import { CtaButton } from "@/components/ui/cta-button";
import { Reveal } from "@/components/ui/reveal";
import { RotatingBadge } from "@/components/ui/rotating-badge";
import { SplitText } from "@/components/ui/split-text";
import { useCheckout } from "@/components/checkout/checkout-provider";
import { INVESTMENT } from "@/lib/content";

/**
 * The single colour inversion on the page. It rises over the section above it
 * on rounded corners, so the palette flip reads as an object arriving rather
 * than a background change.
 */
export function Investment() {
  const { open } = useCheckout();

  return (
    <section
      id="investment"
      className="invert-surface relative z-10 -mt-10 overflow-hidden rounded-t-[2rem] bg-flare text-ink sm:-mt-16 sm:rounded-t-[4rem]"
    >
      <div className="gutter py-24 sm:py-32">
        <div className="flex items-center gap-4 label-mono">
          <span>[07]</span>
          <span className="opacity-60">{INVESTMENT.label}</span>
          <span aria-hidden className="h-px flex-1 bg-ink/25" />
        </div>

        <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Price */}
          <div className="lg:col-span-7">
            <p className="label-mono opacity-60">{INVESTMENT.amountLabel}</p>
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

            <ul className="flex flex-col gap-3 border-t border-ink/25 pt-6">
              {INVESTMENT.assurances.map((line, i) => (
                <Reveal key={line} delay={i * 0.08} from="none">
                  <li className="flex items-center gap-4">
                    <span aria-hidden className="font-mono text-sm opacity-50">
                      ✕
                    </span>
                    <span className="text-lg line-through decoration-ink/40 decoration-2 opacity-60">
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
          className="w-52 text-ink lg:w-64"
        >
          <span className="display-tight text-3xl">✦</span>
        </RotatingBadge>
      </div>
    </section>
  );
}
