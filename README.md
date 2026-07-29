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

Three colours, nothing else: `ink` (`#000000`), `paper` (`#FFFFFF`),
`flare` (`#FAAB36`). They're declared as Tailwind theme tokens in
[app/globals.css](app/globals.css) along with the fluid type scale
(`text-hero` → `text-2xs`), easing curves, and the custom utilities
(`display-tight`, `label-mono`, `text-outline`, `gutter`, `invert-surface`).

Four typefaces, all self-hosted through `next/font`:

| Role | Family | Used for |
| --- | --- | --- |
| Display | Syne | Every headline |
| Body | Space Grotesk | Running text and UI |
| Editorial | Instrument Serif *italic* | Emphasised phrases |
| Mono | Geist Mono | Indices, labels, technical furniture |

**Inverted surfaces.** Anything that flips to an orange background gets the
`invert-surface` class. It rebinds `--focus-ring` to ink so focus outlines stay
visible, and it's the signal to check white-on-orange contrast in that subtree.

## Structure

```
app/
  layout.tsx              fonts, metadata, global chrome
  page.tsx                section order + Product JSON-LD
  icon.tsx                generated favicon
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

Register `https://your-domain.com/api/flutterwave/webhook` in the Flutterwave
dashboard under **Settings → Webhooks**.

Persist members and send invites from the `charge.completed` branch of
[app/api/flutterwave/webhook/route.ts](app/api/flutterwave/webhook/route.ts) —
the redirect is what the buyer sees, the webhook is what you reconcile against.

The price lives in `SITE.price` in [lib/content.ts](lib/content.ts). Flutterwave
charges in the major unit, so ₦5,000 is sent as `5000`.

## Brand assets

- `public/amb-logo.png` — the lockup, trimmed of its transparent padding
  (3.32:1). Used in the nav, the intro card and the footer masthead.
- `app/icon.png` / `app/apple-icon.png` — the palette-triangle mark on ink,
  cropped out of the lockup. The wordmark is unreadable at 16px; the mark isn't.
  Regenerate them from `amb-logo.png` if the brand mark ever changes.
- `public/founder.jpg` — the portrait, rendered inside the film frame under an
  orange duotone that clears on hover. Swap it by replacing the file, or change
  `PORTRAIT_SRC` in [components/sections/founder.tsx](components/sections/founder.tsx).
