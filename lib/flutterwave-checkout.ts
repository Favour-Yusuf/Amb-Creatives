"use client";

/** Minimal shape of the pieces of FlutterwaveCheckout we actually use. */
type CheckoutOptions = {
  public_key: string;
  tx_ref: string;
  amount: number;
  currency: string;
  payment_options?: string;
  redirect_url?: string;
  customer: { email: string; name?: string; phone_number?: string };
  customizations?: { title?: string; description?: string; logo?: string };
  onclose?: () => void;
};

declare global {
  interface Window {
    FlutterwaveCheckout?: (options: CheckoutOptions) => { close: () => void };
  }
}

const SCRIPT_SRC = "https://checkout.flutterwave.com/v3.js";

let loader: Promise<void> | null = null;

/**
 * Loads Flutterwave's widget the first time someone actually opens checkout,
 * so the landing page itself ships no third-party JavaScript. Repeat calls
 * share the same promise.
 */
export function loadFlutterwave(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Flutterwave can only load in the browser"));
  }

  if (window.FlutterwaveCheckout) return Promise.resolve();

  loader ??= new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`,
    );

    const script = existing ?? document.createElement("script");
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener(
      "error",
      () => {
        // Let a later attempt retry from scratch.
        loader = null;
        script.remove();
        reject(new Error("Could not load the payment widget"));
      },
      { once: true },
    );

    if (!existing) {
      script.src = SCRIPT_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
  });

  return loader;
}

export type { CheckoutOptions };
