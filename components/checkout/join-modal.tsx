"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { useCheckout } from "@/components/checkout/checkout-provider";
import { SITE } from "@/lib/content";
import { buildReference, isValidEmail } from "@/lib/flutterwave";
import { loadFlutterwave } from "@/lib/flutterwave-checkout";
import { cn } from "@/lib/utils";

type FieldErrors = Partial<Record<"name" | "email", string>>;

const HIGHLIGHTS = [
  "Instant access to the private community",
  "Exclusive AI resources & members-only material",
  "Live sessions, templates and tutorials",
  "Early access to future courses and products",
];

export function JoinModal() {
  const { isOpen, close } = useCheckout();
  const lenis = useLenis();
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const titleId = useId();

  // Scroll lock + focus management while the dialog owns the screen.
  useEffect(() => {
    if (!isOpen) return;

    lenis?.stop();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => firstFieldRef.current?.focus(), 420);

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      lenis?.start();
    };
  }, [isOpen, close, lenis]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-150 flex"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial="hidden"
          animate="shown"
          exit="hidden"
        >
          <motion.button
            type="button"
            aria-label="Close checkout"
            onClick={close}
            className="absolute inset-0 bg-ink/85 backdrop-blur-sm"
            variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}
            transition={{ duration: 0.35 }}
            tabIndex={-1}
          />

          <motion.div
            ref={panelRef}
            className="relative m-auto flex max-h-dvh w-full max-w-6xl flex-col overflow-y-auto bg-ink shadow-2xl md:max-h-[92dvh] md:flex-row md:overflow-hidden"
            variants={{
              hidden: { y: 40, opacity: 0, scale: 0.985 },
              shown: { y: 0, opacity: 1, scale: 1 },
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Offer panel */}
            <div className="invert-surface relative flex flex-col justify-between gap-10 bg-flare p-8 text-ink sm:p-10 md:w-[42%]">
              <div>
                <p className="label-mono opacity-70">Membership</p>
                <h2
                  id={titleId}
                  className="mt-4 display-tight text-[clamp(1.4rem,2.4vw,2rem)]"
                >
                  Lifetime
                  <br />
                  Membership
                </h2>
              </div>

              <div>
                <p className="label-mono opacity-70">One-time investment</p>
                <p className="display-tight mt-1 text-[clamp(2.25rem,4.5vw,3.5rem)] leading-none">
                  {SITE.priceLabel}
                </p>
                <p className="mt-3 font-mono text-micro uppercase tracking-[0.14em] opacity-70">
                  No subscriptions · No recurring charges
                </p>
              </div>

              <ul className="flex flex-col gap-3 border-t border-ink/25 pt-6">
                {HIGHLIGHTS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-snug">
                    <span aria-hidden className="mt-0.5 font-mono text-xs">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Form panel */}
            <div className="flex flex-1 flex-col justify-center gap-8 p-8 sm:p-10 md:p-12">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="label-mono text-flare">Secure checkout</p>
                  <p className="mt-3 max-w-sm text-lede text-paper/70">
                    Tell us who you are, pay securely, and you&apos;ll be taken
                    straight into the community.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  data-cursor-hover
                  aria-label="Close checkout"
                  className="group grid h-11 w-11 shrink-0 place-items-center rounded-full ring-1 ring-paper/25 transition-colors hover:bg-paper hover:text-ink"
                >
                  <span className="block transition-transform duration-500 ease-expo group-hover:rotate-90">
                    ✕
                  </span>
                </button>
              </div>

              <CheckoutForm firstFieldRef={firstFieldRef} />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/**
 * Mounted only while the dialog is open, so its transient state (submitting,
 * validation errors) is discarded on close without an effect to reset it.
 */
function CheckoutForm({
  firstFieldRef,
}: {
  firstFieldRef: React.RefObject<HTMLInputElement | null>;
}) {
  const [status, setStatus] = useState<"idle" | "opening">("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const busy = status !== "idle";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim().toLowerCase();
    const phone = String(data.get("phone") ?? "").trim();

    const errors: FieldErrors = {};
    if (name.length < 2) errors.name = "Please tell us your name.";
    if (!isValidEmail(email)) errors.email = "That email doesn't look right.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const publicKey = process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY;
    if (!publicKey) {
      setFormError(
        "Payments aren't switched on yet. Add NEXT_PUBLIC_FLW_PUBLIC_KEY to enable checkout.",
      );
      return;
    }

    setStatus("opening");

    try {
      await loadFlutterwave();

      window.FlutterwaveCheckout?.({
        public_key: publicKey,
        tx_ref: buildReference(),
        amount: SITE.price,
        currency: SITE.currency,
        payment_options: "card,banktransfer,ussd",
        // Flutterwave sends the visitor back here with a transaction id, which
        // /join/success verifies server-side before handing over the invite.
        redirect_url: `${window.location.origin}/join/success`,
        customer: { email, name, phone_number: phone || undefined },
        customizations: {
          title: "AMB Creatives",
          description: "Lifetime Membership — private creative learning ecosystem",
        },
        onclose: () => setStatus("idle"),
      });
    } catch {
      setFormError("We couldn't open the payment window. Check your connection.");
      setStatus("idle");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <Field
        ref={firstFieldRef}
        name="name"
        label="Full name"
        autoComplete="name"
        required
        error={fieldErrors.name}
      />
      <Field
        name="email"
        type="email"
        label="Email address"
        autoComplete="email"
        required
        error={fieldErrors.email}
      />
      <Field name="phone" type="tel" label="Phone (optional)" autoComplete="tel" />

      {formError ? (
        <p role="alert" className="text-sm text-flare">
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        data-cursor-hover
        className={cn(
          "group relative mt-2 overflow-hidden rounded-full bg-paper px-8 py-5 text-ink transition-opacity",
          busy && "opacity-60",
        )}
      >
        <span
          aria-hidden
          className="absolute inset-0 origin-bottom scale-y-0 bg-flare transition-transform duration-600 ease-expo group-hover:scale-y-100 group-focus-visible:scale-y-100"
        />
        <span className="relative display-tight text-base">
          {status === "idle"
            ? `Pay ${SITE.priceLabel} — Join now`
            : "Opening secure checkout…"}
        </span>
      </button>

      <p className="font-mono text-2xs uppercase tracking-[0.16em] text-paper/40">
        Card, transfer or USSD via Flutterwave. Payment details never touch this site.
      </p>
    </form>
  );
}

type FieldProps = React.ComponentPropsWithRef<"input"> & {
  label: string;
  error?: string;
};

/** Underlined input with a rule that fills orange on focus. */
function Field({ label, error, name, className, ref, ...props }: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="group relative">
      <label
        htmlFor={id}
        className="label-mono block text-paper/45 transition-colors group-focus-within:text-flare"
      >
        {label}
      </label>
      <input
        {...props}
        ref={ref}
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "peer w-full bg-transparent pb-3 pt-2 text-lg text-paper outline-none placeholder:text-paper/30",
          className,
        )}
      />
      <span aria-hidden className="block h-px w-full bg-paper/20" />
      <span
        aria-hidden
        className={cn(
          "block h-px w-full origin-left scale-x-0 bg-flare transition-transform duration-500 ease-expo -mt-px",
          "peer-focus:scale-x-100",
          error && "scale-x-100",
        )}
      />
      {error ? (
        <p id={errorId} className="mt-2 text-xs text-flare">
          {error}
        </p>
      ) : null}
    </div>
  );
}
