# AMB Creatives

Landing page for the AMB Creatives community — a private creative learning
ecosystem. Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Framer Motion,
Lenis, and Flutterwave checkout with server-side verification.

```bash
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

## The design system

`ink` (`#000000`), `paper` (`#FFFFFF`), `flare` (`#FAAB36`) — and `moss`
(`#2B3210`) as the supporting accent. Declared as Tailwind theme tokens in
[app/globals.css](app/globals.css) along with the fluid type scale
(`text-hero` → `text-2xs`), easing curves, and the custom utilities
(`display-tight`, `label-mono`, `text-outline`, `gutter`, `invert-surface`).

### How moss is used

Two contrast facts decide everything:

| Pairing | Ratio | Consequence |
| --- | --- | --- |
| moss on ink | **1.57:1** | Unusable for text — ideal for large graphic form |
| moss on flare | **6.99:1** | Can serve as the *ink* of every orange surface |

So moss plays three distinct roles, never a fourth:

1. **The ink of orange surfaces.** Every flare surface — the investment
   section, the hero ribbon, open gain rows, the Why resolution card, the
   checkout offer panel, primary buttons — sets its text in moss rather than
   black. Warmer, and the single biggest shift in the page's character.
   **Small text on flare must be `moss/80` or darker** (4.62:1); `moss/70`
   drops to 3.71:1 and fails.
2. **Graphic form on ink.** Because it barely separates from black, moss can
   carry large shapes without competing with the headline: the ring in the
   definition section, the hero's corner wash, the founder's radial, and the
   `texture-dots` / `texture-grid` / `texture-stripes` fields. This is why the
   page reads as layered rather than busy.
3. **Whole plates.** The Different section and the footer are moss grounds,
   gradient-seamed into the ink above and below. They give the scroll a
   tonal rhythm: ink → moss → ink → flare → ink → moss.

`moss-lift` (`#594D18`) is moss warmed 22% toward flare — same family, 2.5:1 on
ink. It replaces every white-alpha hairline; borders now read warm instead of
grey.

The portrait is a genuine duotone: moss takes the shadows via `mix-blend-color`,
flare lifts the highlights via `mix-blend-overlay`, both clearing on hover.

**Textures** take `--texture-color`, so a field can be retinted on a moss
ground: `texture-grid [--texture-color:var(--color-moss-lift)]`. Always pair
one with `fade-b` / `fade-t` / `fade-radial` so it never ends on a hard edge.

Four typefaces, all self-hosted through `next/font`:

| Role | Family | Used for |
| --- | --- | --- |
| Display | Syne | Every headline |
| Body | Space Grotesk | Running text and UI |
| Editorial | Instrument Serif *italic* | Emphasised phrases |
| Mono | Geist Mono | Indices, labels, technical furniture |

**Inverted surfaces.** Anything that flips to an orange background gets the
`invert-surface` class. It rebinds `--focus-ring` to moss so focus outlines stay
visible, and it's the signal to check white-on-orange contrast in that subtree.

## Structure

```
app/
  layout.tsx              fonts, metadata, global chrome
  page.tsx                section order + Product JSON-LD
  icon.png / apple-icon   brand mark, cropped from the lockup
  opengraph-image.tsx     generated share card
  join/success/           verification + WhatsApp handoff
  api/flutterwave/        webhook
components/
  chrome/                 preloader, cursor, grain, nav, chapter rail, footer
  sections/               the nine page sections, one file each
  ui/                     SplitText, Reveal, Marquee, Magnetic, CtaButton, …
  checkout/               checkout context + full-screen join dialog
lib/
  content.ts              all copy, verbatim — sections import from here
  flutterwave.ts          verification, config, error types
  flutterwave-checkout.ts on-demand widget loader (client)
  hooks.ts                useMediaQuery, useIntroSeen
```

All copy lives in [lib/content.ts](lib/content.ts). Edit it there, never in a
section component.

## Motion

Scroll is driven by Lenis; scroll-linked animation by Framer Motion. The
signature moments are the pinned horizontal "pressure" sequence
([components/sections/why.tsx](components/sections/why.tsx)), the orange flood
on the gains index, the tilting membership pass, and the velocity-coupled
marquees.

Every animation checks `prefers-reduced-motion` in JS, and `globals.css`
neutralises CSS animation as a second line of defence. With reduced motion on:
no intro curtain, no smooth scroll, no custom cursor, and `SplitText` renders
plain text.

## Payments — Flutterwave

Checkout opens in Flutterwave's own widget, then everything that matters is
decided on the server.

1. The join dialog collects name / email / phone and opens `FlutterwaveCheckout`
   with `NEXT_PUBLIC_FLW_PUBLIC_KEY`
2. The visitor pays by card, bank transfer or USSD
3. Flutterwave redirects to `/join/success?status=…&transaction_id=…`
4. That page calls Flutterwave with the **secret** key and re-checks status,
   amount and currency against what we actually charge
5. Only a verified payment is shown the community invite link, which then
   forwards to the WhatsApp group
6. `/api/flutterwave/webhook` is the out-of-band record for fulfilment

The widget script is injected on demand the first time someone opens checkout
([lib/flutterwave-checkout.ts](lib/flutterwave-checkout.ts)), so the landing
page itself ships no third-party JavaScript.

> **The amount is set in the browser by the widget**, which is exactly why
> step 4 re-reads it from Flutterwave. Never release the invite on the strength
> of the redirect's query string alone.

### Configuration

```bash
cp .env.example .env.local
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_FLW_PUBLIC_KEY` | yes | Opens the checkout widget. Public by design. |
| `FLW_SECRET_KEY` | **yes** | Verifies payments. Without it nothing can be confirmed and no invite is released. |
| `FLW_SECRET_HASH` | for webhooks | Must match the "Secret hash" set under Settings → Webhooks. |
| `COMMUNITY_INVITE_URL` | no | Overrides the WhatsApp invite so it can be rotated without a deploy. |
| `NEXT_PUBLIC_SITE_URL` | no | Absolute origin for Open Graph / canonical URLs. |

Register the webhook under **Settings → Webhooks**, using the **canonical
host**:

```
https://www.ambcreatives.com.ng/api/flutterwave/webhook
```

> ⚠️ **Use the exact host the site serves from.** The apex `ambcreatives.com.ng`
> 308-redirects to `www`, and webhook senders do not follow redirects — they
> record the 3xx as a failed delivery. This has already bitten us once: every
> delivery failed while the endpoint itself was perfectly healthy. If
> Flutterwave reports delivery trouble, check the registered URL for a redirect
> before touching any code:
>
> ```bash
> curl -s -o /dev/null -w '%{http_code}\n' -X POST <registered-url> -d '{}'
> # 401 = reachable, rejecting an unsigned request (healthy)
> # 3xx = wrong host — this is the bug
> # 503 = FLW_SECRET_HASH missing from the deployed environment
> ```

The webhook re-verifies every `charge.completed` against Flutterwave rather than
trusting the payload — the `verif-hash` header is a shared secret, not a
signature over the body, so the payload's own claim of success proves nothing.
It always returns 200 once authenticated, including when verification fails, so
Flutterwave never retries a delivery that was itself fine; failures are logged
instead.

Persist members and send invites from the fulfilment block in
[app/api/flutterwave/webhook/route.ts](app/api/flutterwave/webhook/route.ts) —
the redirect is what the buyer sees, the webhook is what you reconcile against.

### When the buyer-facing flow fails

The redirect and the webhook are independent. A webhook failure never affects a
buyer's redirect, and fixing one does not fix the other.

If verification fails on `/join/success`, the buyer is never shown a dead end or
an internal message. They get the `stranded` state: their payment reference, a
**Try again** link that re-runs verification, and a WhatsApp button to
`SUPPORT.whatsappDisplay` pre-filled with the problem and the reference. The
real cause is logged server-side for us, never rendered to them.

Because the reference is always in that pre-filled message, you can paste it
straight into the Flutterwave dashboard to confirm a payment before releasing
the invite by hand. The state deliberately errs toward "you may have paid" — a
stranded customer must never be turned away, so someone who merely poked the URL
will see it too.

Support contact lives in `SUPPORT` in [lib/content.ts](lib/content.ts).

The price lives in `SITE.price` in [lib/content.ts](lib/content.ts). Flutterwave
charges in the major unit, so ₦5,000 is sent as `5000`.

## Brand assets

- `public/amb-logo.png` — the lockup, trimmed of its transparent padding
  (3.32:1). Used in the nav, the intro card and the footer masthead.
- `app/icon.png` / `app/apple-icon.png` — the palette-triangle mark on moss,
  cropped out of the lockup. The wordmark is unreadable at 16px; the mark isn't.
  Regenerate them from `amb-logo.png` if the brand mark ever changes.
- `public/founder.jpg` — the portrait, rendered inside the film frame under a
  moss/flare duotone that clears on hover. Swap it by replacing the file, or change
  `PORTRAIT_SRC` in [components/sections/founder.tsx](components/sections/founder.tsx).
