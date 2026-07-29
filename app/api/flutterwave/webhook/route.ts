import crypto from "node:crypto";

/**
 * Out-of-band payment notifications from Flutterwave.
 *
 * Flutterwave does not sign the body — it sends the secret hash you configured
 * in the dashboard verbatim in the `verif-hash` header, so this is a constant-
 * time string comparison rather than an HMAC check.
 *
 * Register this URL under Settings → Webhooks and set the same value as
 * FLW_SECRET_HASH in the environment.
 */
export async function POST(request: Request) {
  const expected = process.env.FLW_SECRET_HASH?.trim();
  if (!expected) {
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
      status?: string;
      tx_ref?: string;
      amount?: number;
      currency?: string;
      customer?: { email?: string };
    };
  } | null;

  if (event?.event === "charge.completed" && event.data?.status === "successful") {
    // Fulfilment hook — the durable record that someone paid. The redirect on
    // /join/success is what the buyer sees; this is what you should reconcile
    // against (e.g. persist the member, email the invite, update a CRM).
    console.info(
      "[flutterwave] charge.completed",
      event.data.tx_ref,
      event.data.customer?.email,
    );
  }

  // Always acknowledge quickly — anything else and Flutterwave retries.
  return new Response(null, { status: 200 });
}
