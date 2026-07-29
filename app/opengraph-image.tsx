import { ImageResponse } from "next/og";
import { SITE } from "@/lib/content";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Share card. Built from the same three colours as the site. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#000000",
          color: "#FFFFFF",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          <span>AMB / Creatives</span>
          <span style={{ color: "#FAAB36" }}>Lifetime Membership</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 800,
              lineHeight: 1.0,
              letterSpacing: "-0.04em",
            }}
          >
            The Private Creative
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 800,
              lineHeight: 1.0,
              letterSpacing: "-0.04em",
            }}
          >
            Learning Ecosystem
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 800,
              lineHeight: 1.0,
              letterSpacing: "-0.04em",
              color: "#FAAB36",
            }}
          >
            Built for the AI Era
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.18)",
            paddingTop: 28,
            fontSize: 26,
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.6)" }}>
            Learn AI · Master Creative Skills · Build a Creative Business
          </span>
          <span
            style={{
              display: "flex",
              background: "#FAAB36",
              color: "#000000",
              padding: "12px 28px",
              borderRadius: 999,
              fontWeight: 700,
            }}
          >
            {/* Satori can't source a font with ₦, so the share card spells
                out the currency code instead of the symbol. */}
            NGN {SITE.price.toLocaleString("en-NG")} once
          </span>
        </div>
      </div>
    ),
    size,
  );
}
