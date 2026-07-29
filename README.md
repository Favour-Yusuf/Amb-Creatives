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
- `app/icon.png` / `app/apple-icon.png` — the palette-triangle mark on moss,
  cropped out of the lockup. The wordmark is unreadable at 16px; the mark isn't.
  Regenerate them from `amb-logo.png` if the brand mark ever changes.
- `public/founder.jpg` — the portrait, rendered inside the film frame under a
  moss/flare duotone that clears on hover. Swap it by replacing the file, or change
  `PORTRAIT_SRC` in [components/sections/founder.tsx](components/sections/founder.tsx).
