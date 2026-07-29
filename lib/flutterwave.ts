import { SITE } from "@/lib/content";

/**
 * Flutterwave integration.
 *
 * Checkout runs inline with the *public* key (Flutterwave's own modal, opened
 * from the join dialog), and Flutterwave then redirects back to /join/success
 * with a transaction id. Everything that matters is decided on the server:
 *
 *   1. Join dialog opens FlutterwaveCheckout with NEXT_PUBLIC_FLW_PUBLIC_KEY
 *   2. Visitor pays; Flutterwave redirects to /join/success?transaction_id=…
 *   3. That page calls verifyTransaction() with the SECRET key and re-checks
 *      status, amount and currency against what we expect
 *   4. Only a verified payment is handed the community invite link
 *   5. /api/flutterwave/webhook is the out-of-band record for fulfilment
 *
 * The amount is set client-side by the checkout widget, so step 3 is not
 * optional — it is the only thing standing between a forged redirect and a
 * free membership.
 *
 * `.env.local`:
 *   NEXT_PUBLIC_FLW_PUBLIC_KEY=FLWPUBK_TEST-…
 *   FLW_SECRET_KEY=FLWSECK_TEST-…
 *   FLW_SECRET_HASH=…            (webhook only)
 *   COMMUNITY_INVITE_URL=…       (optional override)
 */

export const FLW_API = "https://api.flutterwave.com/v3";

/** Flutterwave charges in the major unit — naira, not kobo. */
export const EXPECTED_AMOUNT = SITE.price;

/** Where a verified member is sent. Overridable so the invite can be rotated. */
export function getCommunityInviteUrl(): string {
  return (
    process.env.COMMUNITY_INVITE_URL?.trim() ||
    "https://chat.whatsapp.com/LjHXA5Kw5pV4CqZVniNxWM?mode=gi_t"
  );
}

export function getSecretKey(): string | undefined {
  return process.env.FLW_SECRET_KEY?.trim() || undefined;
}

export function getPublicKey(): string | undefined {
  return process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY?.trim() || undefined;
}

/** Verification — and therefore the invite handoff — needs the secret key. */
export function canVerify(): boolean {
  return Boolean(getSecretKey());
}

export type VerifiedPayment = {
  reference: string;
  amount: number;
  currency: string;
  email: string;
  name: string | null;
  paidAt: string | null;
};

export class FlutterwaveError extends Error {
  constructor(
    message: string,
    readonly status = 502,
  ) {
    super(message);
    this.name = "FlutterwaveError";
  }
}

export class NotConfiguredError extends FlutterwaveError {
  constructor() {
    super(
      "Payments are not fully configured. Add FLW_SECRET_KEY to verify transactions.",
      503,
    );
    this.name = "NotConfiguredError";
  }
}

export class PaymentNotSuccessfulError extends FlutterwaveError {
  constructor(readonly transactionStatus: string) {
    super(`Flutterwave reported this transaction as "${transactionStatus}".`, 402);
    this.name = "PaymentNotSuccessfulError";
  }
}

type FlutterwaveEnvelope<T> = {
  status: "success" | "error";
  message: string;
  data: T;
};

type VerifyData = {
  id: number;
  tx_ref: string;
  status: string;
  amount: number;
  charged_amount: number;
  currency: string;
  created_at: string | null;
  customer: { email: string; name?: string | null };
};

/**
 * Confirms a payment with Flutterwave and re-asserts everything we care about.
 * Throws rather than returning a falsy result so no caller can forget to check.
 */
export async function verifyTransaction(
  transactionId: string,
): Promise<VerifiedPayment> {
  const secret = getSecretKey();
  if (!secret) throw new NotConfiguredError();

  const response = await fetch(
    `${FLW_API}/transactions/${encodeURIComponent(transactionId)}/verify`,
    {
      cache: "no-store",
      headers: { Authorization: `Bearer ${secret}` },
    },
  );

  const payload = (await response
    .json()
    .catch(() => null)) as FlutterwaveEnvelope<VerifyData> | null;

  if (!response.ok || payload?.status !== "success" || !payload.data) {
    throw new FlutterwaveError(
      payload?.message ?? `Could not reach Flutterwave (${response.status})`,
    );
  }

  const data = payload.data;

  if (data.status !== "successful") {
    throw new PaymentNotSuccessfulError(data.status);
  }

  // The widget sets the amount in the browser, so trust only what came back
  // from Flutterwave — and only if it matches what we actually charge.
  if (data.currency !== SITE.currency) {
    throw new FlutterwaveError(
      `Unexpected currency: ${data.currency} (expected ${SITE.currency}).`,
    );
  }

  if (data.amount < EXPECTED_AMOUNT) {
    throw new FlutterwaveError(
      `Underpayment: ${data.amount} ${data.currency} (expected ${EXPECTED_AMOUNT}).`,
    );
  }

  return {
    reference: data.tx_ref,
    amount: data.amount,
    currency: data.currency,
    email: data.customer.email,
    name: data.customer.name ?? null,
    paidAt: data.created_at,
  };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string) {
  return EMAIL_PATTERN.test(value);
}

/** Readable, unique, and traceable back to this product in the dashboard. */
export function buildReference() {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `amb-${Date.now().toString(36)}-${random}`;
}
