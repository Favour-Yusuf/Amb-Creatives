import crypto from "node:crypto";
import { verifyTransaction } from "@/lib/flutterwave";

/**
 * Out-of-band payment notifications from Flutterwave.
 *
 * Flutterwave does not sign the body — it sends the secret hash you configured
 * in the dashboard verbatim in the `verif-hash` header, so authentication is a
 * constant-time string comparison rather than an HMAC check.
 *
 * Register this URL under Settings → Webhooks and set the same value as
 * FLW_SECRET_HASH in the environment. Use the canonical host: a webhook sender
 * will not follow a redirect, so pointing it at a domain that 3xx's to `www`
 * makes every delivery fail.
 *
 * This is the safety net for the buyer-facing redirect. If someone closes the
 * tab, loses connection, or pays by transfer that settles later, this is the
 * only record that they paid — so it must not be the thing that silently
 * breaks.
 */
export async function POST(request: Request) {
  const expected = process.env.FLW_SECRET_HASH?.trim();
  if (!expected) {
    console.error("[flutterwave] webhook hit but FLW_SECRET_HASH is not set");
    return new Response("Webhook not configured", { status: 503 });
  }

  const received = request.headers.get("verif-hash") ?? "";
  const receivedBuffer = Buffer.from(received, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");

  const valid =
    receivedBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(receivedBuffer, expectedBuffer);

  if (!valid) {
    return new Response("Invalid signature", { status: 401 });
  }

  const event = (await request.json().catch(() => null)) as {
    event?: string;
    data?: {
      id?: number;
      status?: string;
      tx_ref?: string;
      customer?: { email?: string };
    };
  } | null;

  if (event?.event !== "charge.completed") {
    return new Response(null, { status: 200 });
  }

  const transactionId = event.data?.id;
  if (!transactionId) {
    console.warn("[flutterwave] charge.completed with no transaction id");
    return new Response(null, { status: 200 });
  }

  try {
    // The header hash is a shared secret, not a signature over this body, so
    // the payload's own claim of success proves nothing. Ask Flutterwave.
    const payment = await verifyTransaction(String(transactionId));

    // ── Fulfilment ──────────────────────────────────────────────────────────
    // This is the durable record that someone paid, and the place to hook up
    // persistence: save the member, email them the invite, push to a CRM.
    // Until then it is a structured log line you can search when a buyer says
    // they never got in.
    console.info(
      "[flutterwave] PAID",
      JSON.stringify({
        reference: payment.reference,
        transactionId,
        email: payment.email,
        name: payment.name,
        amount: payment.amount,
        currency: payment.currency,
        paidAt: payment.paidAt,
      }),
    );
  } catch (error) {
    // Never 5xx on a verification problem — Flutterwave would retry a delivery
    // that was itself fine. Record it loudly instead.
    console.error(
      "[flutterwave] webhook verification failed",
      { transactionId, txRef: event.data?.tx_ref, email: event.data?.customer?.email },
      error instanceof Error ? error.message : error,
    );
  }

  // Always acknowledge quickly — anything else and Flutterwave retries.
  return new Response(null, { status: 200 });
}
