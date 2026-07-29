/**
 * Single source of truth for every word on the page.
 * Copy is transcribed verbatim from the brand positioning document —
 * sections reference these constants rather than inlining strings.
 */

export const SITE = {
  name: "AMB Creatives",
  tagline: "The Private Creative Learning Ecosystem Built for the AI Era",
  url: "https://ambcreatives.com",
  price: 5000,
  priceLabel: "₦5,000",
  currency: "NGN",
} as const;

export const HERO = {
  headline: ["Join the Private", "Creative Learning", "Ecosystem Built", "for the AI Era"],
  subhead: "Learn AI. Master Creative Skills. Build a Thriving Creative Business.",
  body: "AMB Creatives is an exclusive learning ecosystem designed for creators, entrepreneurs, designers, filmmakers, photographers, video editors, and ambitious professionals who want to stay ahead in an AI-driven world.",
  support:
    "Inside, you'll gain practical knowledge, exclusive resources, valuable industry connections, and continuous support from a community committed to growth and excellence.",
  membership: "Lifetime Membership",
  investment: "One-Time Investment: ₦5,000",
  cta: "Join the Community",
  ribbon: ["Private Community", "Exclusive Resources", "Networking", "Lifetime Access"],
} as const;

export const DEFINITION = {
  label: "What is AMB Creatives?",
  lead: "AMB Creatives is more than a community.",
  body: "It's a private creative learning ecosystem where ambitious creatives come together to learn, collaborate, share opportunities, solve problems, and build sustainable careers using creativity and artificial intelligence.",
  close:
    "Whether you're just starting or already established, you'll find practical insights, meaningful connections, and ongoing support to help you grow.",
  emphasis: "private creative learning ecosystem",
} as const;

export const WHY = {
  label: "Why Join AMB Creatives?",
  panels: [
    "The creative industry is evolving faster than ever.",
    "Artificial Intelligence is transforming how creators work.",
    "Clients expect higher-quality results.",
    "Businesses need creative professionals who understand modern tools.",
    "Trying to keep up alone can be overwhelming.",
  ],
  resolution:
    "AMB Creatives brings everything together in one place, giving you the knowledge, community, resources, and accountability needed to grow with confidence.",
} as const;

export const GAINS = [
  {
    title: "Exclusive Learning Resources",
    body: "Access carefully curated training materials, guides, templates, and educational resources designed to help you continuously improve your creative and business skills.",
  },
  {
    title: "AI for Modern Creatives",
    body: "Learn practical ways to integrate AI into your workflow, improve productivity, automate repetitive tasks, generate ideas faster, and deliver better results for clients.",
  },
  {
    title: "Networking Opportunities",
    body: "Connect with passionate creators, entrepreneurs, freelancers, business owners, and industry professionals who are actively building, creating, and growing. Meaningful relationships often lead to collaborations, referrals, mentorship, and new opportunities.",
  },
  {
    title: "Live Learning Sessions",
    body: "Participate in exclusive workshops, discussions, Q&A sessions, masterclasses, and community conversations focused on today's most valuable creative skills.",
  },
  {
    title: "Creative Collaboration",
    body: "Find collaborators, receive constructive feedback on your work, exchange ideas, and work alongside people who challenge you to become better.",
  },
  {
    title: "Ongoing Growth",
    body: "The value doesn't end after joining. New resources, discussions, learning opportunities, and community activities are continually added to keep members learning and growing.",
  },
] as const;

export const DIFFERENT = {
  label: "What Makes AMB Creatives Different?",
  negative: "We're not another social media group filled with distractions.",
  lead: "We're building a focused environment where creatives can:",
  pillars: [
    "Learn intentionally",
    "Build meaningful relationships",
    "Discover opportunities",
    "Stay ahead of industry trends",
    "Master AI-powered workflows",
    "Grow personally and professionally",
  ],
  close:
    "Everything inside the ecosystem is designed to help members create more, learn faster, and grow together.",
} as const;

export const FOUNDER = {
  label: "The Founder",
  name: "Attah Moses Bob",
  roles: [
    "Creative Director",
    "AI Specialist",
    "Educator",
    "Cinematographer",
    "Multimedia Strategist",
  ],
  intro:
    "An award-winning Creative Director, AI Specialist, Educator, Cinematographer, and Multimedia Strategist with over 13 years of experience in the media and creative industry. He is passionate about helping organizations, businesses, and individuals communicate ideas, solve problems, and drive meaningful impact through storytelling, technology, and visual innovation.",
  body: "As the Founder of AMB Creatives Community, Bob leads a growing network of creatives, innovators, and aspiring professionals committed to learning, collaboration, and excellence in the creative industry. Through mentorship, training, and practical education, he empowers creatives with the skills, tools, and mindset needed to thrive in today's rapidly evolving digital landscape.",
  mission: "To create work that inspires, educates, and delivers lasting value.",
  stats: [
    { value: "13+", label: "Years in the industry" },
    { value: "10+", label: "Creative disciplines" },
    { value: "5", label: "Flagship client partners" },
  ],
  clients: [
    "Sujimoto Real Estate",
    "Babban Gona",
    "Celebration Church International",
    "KOICA",
    "UBEC",
  ],
  disciplines: [
    "Cinematography",
    "Motion Graphics",
    "Video Production",
    "Photography",
    "Visual Branding",
    "Animation",
    "Graphic Design",
    "Creative Direction",
    "Digital Communications",
    "Artificial Intelligence",
  ],
} as const;

export const MEMBERSHIP = [
  "Lifetime access to the private community",
  "Exclusive AI resources",
  "Members-only learning materials",
  "Creative business insights",
  "Networking opportunities",
  "Live community sessions",
  "Practical tutorials",
  "Creative templates",
  "Collaboration opportunities",
  "Industry discussions",
  "Early access to future courses, events, and digital products",
  "Continuous updates and new resources",
] as const;

export const INVESTMENT = {
  label: "Investment",
  lead: "Become part of a growing ecosystem of creators preparing for the future.",
  membership: "Lifetime Membership",
  amount: "₦5,000",
  amountLabel: "One-Time Investment",
  assurances: ["No monthly subscriptions.", "No recurring charges."],
  close: "Pay once and become part of the AMB Creatives ecosystem.",
  cta: "Become a Member",
} as const;

export const FINAL = {
  label: "Final Call",
  headline: ["Your Growth", "Deserves the", "Right Environment."],
  body: [
    "Success rarely happens in isolation.",
    "Surround yourself with creators who are learning, building, experimenting, and embracing the future of creativity through AI.",
    "If you're serious about improving your skills, expanding your network, and unlocking new opportunities, AMB Creatives is where your next chapter begins.",
  ],
  kicker: "Join the Private Creative Learning Ecosystem Today",
  terms: "Lifetime Membership • One-Time Investment: ₦5,000",
  cta: "Become a Member",
} as const;

/** Chapter markers driving the fixed navigation HUD. */
export const CHAPTERS = [
  { id: "hero", index: "00", name: "Index" },
  { id: "definition", index: "01", name: "The Ecosystem" },
  { id: "why", index: "02", name: "The Shift" },
  { id: "gains", index: "03", name: "What You Gain" },
  { id: "different", index: "04", name: "The Difference" },
  { id: "founder", index: "05", name: "The Founder" },
  { id: "membership", index: "06", name: "The Pass" },
  { id: "investment", index: "07", name: "Investment" },
] as const;
