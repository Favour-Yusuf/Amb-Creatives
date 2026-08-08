import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppHandoff } from "@/components/checkout/whatsapp-handoff";
import { SITE, SUPPORT, buildSupportUrl } from "@/lib/content";
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
  | {
      state: "confirmed";
      email: string;
      amount: string;
      reference: string;
      inviteUrl: string;
    }
  | { state: "unpaid"; detail: string }
  /** Anything that leaves a possibly-paying buyer without their invite. */
  | { state: "stranded" };

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

    // Everything below is our problem, not the buyer's. Log the real reason
    // for us; show them a way out, never a configuration instruction.
    console.error(
      "[flutterwave] could not verify",
      { transactionId, txRef: params.tx_ref },
      error instanceof FlutterwaveError ? error.message : error,
    );
    return { state: "stranded" };
  }
}

export default async function JoinSuccessPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const outcome = await resolveOutcome(params);
  const copy = COPY[outcome.state];

  // The reference a buyer can quote us — tx_ref survives even when the
  // verification call itself failed.
  const reference =
    outcome.state === "confirmed"
      ? outcome.reference
      : (params.tx_ref ?? params.transaction_id ?? null);

  const supportUrl = buildSupportUrl(reference);

  // Re-running the same URL re-runs verification, which is all a transient
  // Flutterwave failure needs. Plain <a> so it's a full request, not a
  // client-side no-op back to the identical route.
  const retryUrl = `/join/success?${new URLSearchParams(
    Object.entries(params).filter(([, v]) => Boolean(v)) as [string, string][],
  ).toString()}`;

  return (
    <main className="relative flex min-h-dvh flex-col justify-center gutter py-28">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(38rem_30rem_at_30%_35%,rgba(250,171,54,0.16),transparent_70%)]"
      />
      <span
        aria-hidden
        className="texture-dots fade-radial pointer-events-none absolute inset-0 opacity-60"
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

            <p className="mt-8 text-sm text-paper/55">
              Didn&apos;t make it into the group?{" "}
              <a
                href={supportUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-hover
                className="text-flare underline underline-offset-4 transition-opacity hover:opacity-75"
              >
                Message us on WhatsApp
              </a>
              .
            </p>
          </>
        ) : (
          <>
            {reference ? (
              <div className="mt-9 inline-flex flex-col gap-1 rounded-xl border border-moss-lift bg-moss px-5 py-4">
                <span className="label-mono text-paper/55">
                  Your reference — quote this
                </span>
                <span className="font-mono text-sm text-paper">{reference}</span>
              </div>
            ) : null}

            <div className="mt-12 flex flex-wrap items-center gap-4">
              {outcome.state === "stranded" ? (
                <>
                  <a
                    href={supportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-hover
                    className="group relative inline-flex overflow-hidden rounded-full bg-flare px-8 py-4 text-moss"
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0 origin-bottom scale-y-0 bg-paper transition-transform duration-600 ease-expo group-hover:scale-y-100 group-focus-visible:scale-y-100"
                    />
                    <span className="relative display-tight">
                      Message us on WhatsApp
                    </span>
                  </a>

                  <a
                    href={retryUrl}
                    data-cursor-hover
                    className="inline-flex rounded-full px-8 py-4 ring-1 ring-inset ring-moss-lift transition-colors hover:bg-moss"
                  >
                    <span className="display-tight">Try again</span>
                  </a>
                </>
              ) : (
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
              )}
            </div>

            {outcome.state === "unpaid" ? (
              <p className="mt-8 text-sm text-paper/55">
                Charged anyway?{" "}
                <a
                  href={supportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-hover
                  className="text-flare underline underline-offset-4 transition-opacity hover:opacity-75"
                >
                  Message us on {SUPPORT.whatsappDisplay}
                </a>{" "}
                and we&apos;ll sort it.
              </p>
            ) : null}

            <p className="mt-10 label-mono text-paper/55">
              {SITE.name} · Lifetime Membership
            </p>
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
  stranded: {
    kicker: "Hold tight",
    headline: "We're still confirming your payment.",
    body: "If you've been charged, your membership is safe — we have the record on our side. Message us on WhatsApp with the reference below and we'll get you into the community straight away. You can also try again.",
  },
};
