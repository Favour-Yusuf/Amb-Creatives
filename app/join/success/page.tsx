import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppHandoff } from "@/components/checkout/whatsapp-handoff";
import { SITE } from "@/lib/content";
import {
  FlutterwaveError,
  PaymentNotSuccessfulError,
  getCommunityInviteUrl,
  verifyTransaction,
} from "@/lib/flutterwave";

export const metadata: Metadata = {
  title: "Membership confirmed",
  robots: { index: false, follow: false },
};

/** Flutterwave appends these on the redirect back from checkout. */
type SearchParams = {
  status?: string;
  tx_ref?: string;
  transaction_id?: string;
};

type Outcome =
  | { state: "missing" }
  | { state: "unconfigured" }
  | {
      state: "confirmed";
      email: string;
      amount: string;
      reference: string;
      inviteUrl: string;
    }
  | { state: "unpaid"; detail: string }
  | { state: "error"; message: string };

async function resolveOutcome(params: SearchParams): Promise<Outcome> {
  const { status, transaction_id: transactionId } = params;

  if (!transactionId) return { state: "missing" };

  // Flutterwave's own verdict is a hint, not proof — but if it already says
  // the payment failed there is nothing to verify.
  if (status && status !== "successful" && status !== "completed") {
    return { state: "unpaid", detail: `Checkout reported "${status}".` };
  }

  try {
    const payment = await verifyTransaction(transactionId);

    return {
      state: "confirmed",
      email: payment.email,
      reference: payment.reference,
      inviteUrl: getCommunityInviteUrl(),
      amount: new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: payment.currency,
        maximumFractionDigits: 0,
      }).format(payment.amount),
    };
  } catch (error) {
    if (error instanceof PaymentNotSuccessfulError) {
      return { state: "unpaid", detail: error.message };
    }
    if (error instanceof FlutterwaveError) {
      return error.status === 503
        ? { state: "unconfigured" }
        : { state: "error", message: error.message };
    }

    console.error("[flutterwave] verification failed", error);
    return { state: "error", message: "We couldn't confirm that payment." };
  }
}

export default async function JoinSuccessPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const outcome = await resolveOutcome(await searchParams);
  const copy = COPY[outcome.state];

  return (
    <main className="relative flex min-h-dvh flex-col justify-center gutter py-28">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(38rem_30rem_at_30%_35%,rgba(250,171,54,0.16),transparent_70%)]"
      />

      <div className="relative max-w-4xl">
        <p className="label-mono text-flare">{copy.kicker}</p>

        <h1 className="mt-7 display-tight text-jumbo">{copy.headline}</h1>

        <p className="mt-7 max-w-2xl text-lede leading-relaxed text-paper/70">
          {copy.body}
        </p>

        {outcome.state === "confirmed" ? (
          <>
            <dl className="mt-11 grid max-w-2xl gap-px overflow-hidden rounded-xl bg-moss-lift sm:grid-cols-3">
              {[
                { label: "Paid", value: outcome.amount },
                { label: "Receipt to", value: outcome.email },
                { label: "Reference", value: outcome.reference },
              ].map((row) => (
                <div key={row.label} className="bg-moss p-5">
                  <dt className="label-mono text-paper/55">{row.label}</dt>
                  <dd className="mt-2 truncate font-mono text-sm text-paper">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>

            <WhatsAppHandoff url={outcome.inviteUrl} />
          </>
        ) : (
          <>
            {outcome.state === "unpaid" ? (
              <p className="mt-5 label-mono text-paper/55">{outcome.detail}</p>
            ) : null}

            {outcome.state === "error" ? (
              <p className="mt-5 label-mono text-flare">{outcome.message}</p>
            ) : null}

            <div className="mt-14 flex flex-wrap items-center gap-4">
              <Link
                href="/"
                data-cursor-hover
                className="group relative inline-flex overflow-hidden rounded-full bg-flare px-8 py-4 text-moss"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 origin-bottom scale-y-0 bg-paper transition-transform duration-600 ease-expo group-hover:scale-y-100 group-focus-visible:scale-y-100"
                />
                <span className="relative display-tight">Back to the site</span>
              </Link>
              <span className="label-mono text-paper/55">
                {SITE.name} · Lifetime Membership
              </span>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

const COPY: Record<Outcome["state"], { kicker: string; headline: string; body: string }> = {
  confirmed: {
    kicker: "Payment confirmed",
    headline: "You're in.",
    body: "Welcome to AMB Creatives. Your lifetime membership is active and we're taking you into the private community now. If nothing happens, use the button below.",
  },
  unpaid: {
    kicker: "Not completed",
    headline: "That payment didn't go through.",
    body: "Nothing has been charged. You can start checkout again whenever you're ready — your place in the ecosystem is still open.",
  },
  missing: {
    kicker: "Nothing to verify",
    headline: "No transaction here.",
    body: "This page confirms a completed payment. Head back to the site and start checkout to join the community.",
  },
  unconfigured: {
    kicker: "Setup required",
    headline: "Payments aren't fully switched on.",
    body: "Checkout ran, but the server can't verify it yet. Add FLW_SECRET_KEY to the environment to confirm payments and release the community invite.",
  },
  error: {
    kicker: "Verification failed",
    headline: "We couldn't confirm that yet.",
    body: "If money left your account, it's safe — Flutterwave has the record. Send us your reference and we'll get you in straight away.",
  },
};
