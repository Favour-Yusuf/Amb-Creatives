import { SiteFooter } from "@/components/chrome/site-footer";
import { Definition } from "@/components/sections/definition";
import { Different } from "@/components/sections/different";
import { FinalCta } from "@/components/sections/final-cta";
import { Founder } from "@/components/sections/founder";
import { Gains } from "@/components/sections/gains";
import { Hero } from "@/components/sections/hero";
import { Investment } from "@/components/sections/investment";
import { Membership } from "@/components/sections/membership";
import { Why } from "@/components/sections/why";
import { FOUNDER, SITE } from "@/lib/content";

/** Structured data so the offer and the founder are legible to search. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: `${SITE.name} — Lifetime Membership`,
  description: SITE.tagline,
  brand: { "@type": "Brand", name: SITE.name },
  offers: {
    "@type": "Offer",
    price: SITE.price,
    priceCurrency: SITE.currency,
    availability: "https://schema.org/InStock",
  },
  author: {
    "@type": "Person",
    name: FOUNDER.name,
    jobTitle: "Creative Director & AI Specialist",
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <Hero />
        <Definition />
        <Why />
        <Gains />
        <Different />
        <Founder />
        <Membership />
        <Investment />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
