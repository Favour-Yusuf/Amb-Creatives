"use client";

import { useEffect, useState } from "react";

const DELAY_SECONDS = 4;

/**
 * Sends a verified member into the community. The short countdown exists so
 * the confirmation is actually readable, and the button stays as a fallback
 * for anyone whose browser blocks the automatic navigation.
 */
export function WhatsAppHandoff({ url }: { url: string }) {
  const [remaining, setRemaining] = useState(DELAY_SECONDS);

  useEffect(() => {
    const tick = window.setInterval(() => {
      setRemaining((value) => (value > 0 ? value - 1 : 0));
    }, 1000);

    const jump = window.setTimeout(() => {
      window.location.replace(url);
    }, DELAY_SECONDS * 1000);

    return () => {
      window.clearInterval(tick);
      window.clearTimeout(jump);
    };
  }, [url]);

  return (
    <div className="mt-14 flex flex-wrap items-center gap-5">
      <a
        href={url}
        data-cursor-hover
        className="group relative inline-flex overflow-hidden rounded-full bg-flare px-8 py-4 text-moss"
      >
        <span
          aria-hidden
          className="absolute inset-0 origin-bottom scale-y-0 bg-paper transition-transform duration-600 ease-expo group-hover:scale-y-100 group-focus-visible:scale-y-100"
        />
        <span className="relative display-tight">Open the community now</span>
      </a>

      <p aria-live="polite" className="label-mono text-paper/55">
        {remaining > 0
          ? `Taking you there in ${remaining}s…`
          : "Opening the community…"}
      </p>
    </div>
  );
}
