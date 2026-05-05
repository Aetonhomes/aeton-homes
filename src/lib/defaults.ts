export const DEFAULTS: Record<string, string> = {
  // Hero
  hero_badge: "Kenya's Premium Real Estate Partner",
  hero_title: "Find Your",
  hero_title_em: "Dream Home",
  hero_title_end: "in Kenya",
  hero_subtitle: "Smart Living · Smart Returns · Exceptional Properties",
  hero_btn1: "Browse Properties",
  hero_btn2: "Book a Viewing",

  // Stats
  stat_1_num: "240+",  stat_1_label: "Properties Listed",
  stat_2_num: "890+",  stat_2_label: "Happy Clients",
  stat_3_num: "12+",   stat_3_label: "Years Experience",
  stat_4_num: "98%",   stat_4_label: "Satisfaction Rate",

  // Properties section
  props_eyebrow: "Curated Listings",
  props_title: "Featured",
  props_title_em: "Properties",
  props_subtitle: "Handpicked luxury homes and investment properties across Nairobi's most sought-after neighbourhoods.",

  // Why Us
  why_eyebrow: "Why Aeton Homes",
  why_title: "The",
  why_title_em: "Smarter",
  why_title_end: "Way to Own",
  why_subtitle: "We don't just sell properties — we match families and investors with the right opportunity at the right time.",
  why_badge_num: "12+",
  why_badge_label: "Years of Excellence",
  why_feat_1_icon: "🛡️", why_feat_1_title: "Verified Properties Only",
  why_feat_1_desc: "Every listing is vetted for legal compliance, title deed authenticity, and structural integrity.",
  why_feat_2_icon: "🚀", why_feat_2_title: "Fast, Seamless Transactions",
  why_feat_2_desc: "From viewing to keys in hand — our streamlined process ensures you close deals faster.",
  why_feat_3_icon: "🕐", why_feat_3_title: "24/7 Dedicated Support",
  why_feat_3_desc: "Your dedicated agent is always reachable via WhatsApp, call, or email.",
  why_feat_4_icon: "📊", why_feat_4_title: "Smart Investment Guidance",
  why_feat_4_desc: "Our analysts identify high-growth areas before the market does.",

  // Process
  process_eyebrow: "Simple Process",
  process_title: "How It",
  process_title_em: "Works",
  process_step_1_title: "Tell Us What You Need",
  process_step_1_desc: "Share your budget, preferred location, and lifestyle needs with our advisors.",
  process_step_2_title: "We Curate Options",
  process_step_2_desc: "We handpick properties that match your brief from our verified portfolio.",
  process_step_3_title: "Go on Viewings",
  process_step_3_desc: "Schedule viewings at your convenience — we handle all the logistics.",
  process_step_4_title: "Close & Get Your Keys",
  process_step_4_desc: "Our legal and finance team ensures a smooth, fast transaction every time.",

  // Testimonials
  testi_eyebrow: "Client Stories",
  testi_title: "What Clients",
  testi_title_em: "Say",

  // Team
  team_eyebrow: "Leadership",
  team_title: "Our",
  team_title_em: "CEO",

  // Contact
  contact_eyebrow: "Get In Touch",
  contact_title: "Let's Find Your",
  contact_title_em: "Perfect Property",
  contact_subtitle: "Whether you're buying, selling, or renting — our team is ready to guide you every step of the way.",
  contact_phone: "+254 700 000 000",
  contact_email: "hello@aetonhomes.com",
  contact_address: "Westlands, Nairobi, Kenya",
  contact_whatsapp: "254700000000",

  // Marquee (JSON array)
  marquee_items: JSON.stringify(["Luxury Homes for Sale","Prime Nairobi Locations","Smart Investment Properties","Premium Rentals Available","Commercial Real Estate","Karen · Westlands · Kilimani","Trusted by 890+ Families"]),

  // Nav
  nav_link_1_label: "Properties", nav_link_1_href: "/#properties",
  nav_link_2_label: "Why Us",     nav_link_2_href: "/#why",
  nav_link_3_label: "Videos",     nav_link_3_href: "/videos",
  nav_link_4_label: "Our CEO",    nav_link_4_href: "/#team",
  nav_link_5_label: "Get In Touch", nav_link_5_href: "/#contact",

  // Footer
  footer_desc: "Kenya's premier luxury real estate agency. Smart living, smart returns.",

  // Videos section
  videos_eyebrow: "Visual Tours",
  videos_title: "Featured",
  videos_title_em: "Videos",
};

export function c(content: Record<string, string>, key: string): string {
  return content[key] ?? DEFAULTS[key] ?? "";
}
