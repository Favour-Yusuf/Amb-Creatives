"use client";

import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { SplitText } from "@/components/ui/split-text";
import { DEFINITION } from "@/lib/content";

/**
 * The "what is this" beat, set as a dictionary entry — the headword sticks
 * while its numbered senses scroll past it.
 */
export function Definition() {
  const [before, after] = DEFINITION.body.split(DEFINITION.emphasis);

  return (
    <section id="definition" className="relative gutter py-24 sm:py-32">
      <SectionLabel index="01">{DEFINITION.label}</SectionLabel>

      <div className="mt-12 grid gap-14 lg:grid-cols-12 lg:gap-10">
        {/* Headword */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <h2 className="display-tight text-jumbo">
              <SplitText text="AMB" />
              <br />
              <span className="text-flare">
                <SplitText text="Creatives" delay={0.08} />
              </span>
            </h2>
            <p className="mt-5 font-mono text-micro lowercase tracking-[0.1em] text-paper/45">
              /ˈeɪ·em·biː kriːˈeɪ.tɪvz/ &nbsp;·&nbsp; noun
            </p>
            <p className="mt-2 font-editorial text-xl italic text-paper/60">
              an ecosystem, not an audience
            </p>
          </div>
        </div>

        {/* Senses */}
        <ol className="lg:col-span-6 lg:col-start-7">
          {[
            <>{DEFINITION.lead}</>,
            <>
              {before}
              <em className="font-editorial not-italic text-flare">
                {DEFINITION.emphasis}
              </em>
              {after}
            </>,
            <>{DEFINITION.close}</>,
          ].map((body, i) => (
            <li
              key={i}
              className="border-t border-paper/15 py-8 first:border-t-0 first:pt-0"
            >
              <Reveal delay={i * 0.08}>
                <div className="flex gap-6">
                  <span className="label-mono shrink-0 pt-2 text-flare">
                    {String(i + 1)}.
                  </span>
                  <p
                    className={
                      i === 0
                        ? "text-big display-tight text-paper"
                        : "text-lede leading-relaxed text-paper/75"
                    }
                  >
                    {body}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
