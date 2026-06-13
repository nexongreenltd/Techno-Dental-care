import {
  Stethoscope, Sparkles, Drill, Scissors, Smile, Atom, Brush, Baby,
} from "lucide-react";
import type { Lang } from "@/contexts/LanguageContext";

export type ServiceCategory = {
  slug: string;
  title: string;
  title_bn: string;
  tagline: string;
  tagline_bn: string;
  icon: React.ComponentType<{ className?: string }>;
  items: string[];
  items_bn: string[];
  description: string;
  description_bn: string;
  benefits: string[];
  benefits_bn: string[];
  symptoms: string[];
  symptoms_bn: string[];
  cta: string;
  cta_bn: string;
};

export const services: ServiceCategory[] = [
  {
    slug: "general-dentistry",
    title: "General Dentistry",
    title_bn: "সাধারণ দন্তচিকিৎসা",
    tagline: "Foundational care for a lifetime of healthy smiles.",
    tagline_bn: "সারাজীবনের সুস্থ হাসির ভিত্তি।",
    icon: Stethoscope,
    items: ["Consultation", "Dental Checkup", "Oral Examination"],
    items_bn: ["পরামর্শ", "দাঁতের চেকআপ", "মৌখিক পরীক্ষা"],
    description: "Comprehensive oral assessments using digital diagnostics to detect issues before they become problems.",
    description_bn: "ডিজিটাল ডায়াগনস্টিক্স ব্যবহার করে সম্পূর্ণ মৌখিক মূল্যায়ন — সমস্যা হওয়ার আগেই চিহ্নিত করি।",
    benefits: ["Early detection", "Personalized care plan", "Digital records"],
    benefits_bn: ["দ্রুত সনাক্তকরণ", "ব্যক্তিগতকৃত পরিচর্যা পরিকল্পনা", "ডিজিটাল রেকর্ড"],
    symptoms: ["Routine checkup overdue", "Mild tooth discomfort", "Unsure where to start"],
    symptoms_bn: ["রুটিন চেকআপ বাকি", "হালকা দাঁতের ব্যথা", "কোথা থেকে শুরু বুঝতে পারছেন না"],
    cta: "Book Checkup",
    cta_bn: "চেকআপ বুক করুন",
  },
  {
    slug: "preventive-dentistry",
    title: "Preventive Dentistry",
    title_bn: "প্রতিরোধমূলক দন্তচিকিৎসা",
    tagline: "Keep teeth strong and disease-free.",
    tagline_bn: "দাঁত শক্ত ও রোগমুক্ত রাখুন।",
    icon: Sparkles,
    items: ["Scaling & Polishing", "Teeth Cleaning", "Fluoride Care"],
    items_bn: ["স্কেলিং ও পলিশিং", "দাঁত পরিষ্কার", "ফ্লোরাইড সেবা"],
    description: "Professional cleaning and fluoride therapy designed to protect enamel and prevent decay.",
    description_bn: "দাঁতের এনামেল রক্ষা ও ক্ষয় প্রতিরোধের জন্য পেশাদার পরিষ্কার ও ফ্লোরাইড থেরাপি।",
    benefits: ["Fresher breath", "Brighter smile", "Long-term gum health"],
    benefits_bn: ["সতেজ নিঃশ্বাস", "উজ্জ্বল হাসি", "দীর্ঘমেয়াদী মাড়ির স্বাস্থ্য"],
    symptoms: ["Stained or yellow teeth", "Bleeding gums", "Tartar build-up", "Bad breath"],
    symptoms_bn: ["দাঁতে দাগ বা হলদে রং", "মাড়ি থেকে রক্ত পড়া", "টার্টার জমা", "মুখে দুর্গন্ধ"],
    cta: "Book Cleaning",
    cta_bn: "পরিষ্কার বুক করুন",
  },
  {
    slug: "restorative-dentistry",
    title: "Restorative Dentistry",
    title_bn: "পুনরুদ্ধারমূলক দন্তচিকিৎসা",
    tagline: "Rebuild and restore with precision.",
    tagline_bn: "নির্ভুলতায় পুনর্নির্মাণ।",
    icon: Drill,
    items: ["Dental Fillings", "Root Canal Treatment", "Crowns & Bridges"],
    items_bn: ["ডেন্টাল ফিলিং", "রুট ক্যানেল চিকিৎসা", "ক্রাউন ও ব্রিজ"],
    description: "Preserve infected or damaged teeth and eliminate pain while maintaining natural tooth structure with tooth-coloured materials and digital impressions.",
    description_bn: "সংক্রমিত বা ক্ষতিগ্রস্ত দাঁত সংরক্ষণ — টুথ-কালার্ড উপকরণ ও ডিজিটাল ইম্প্রেশনে ব্যথামুক্ত চিকিৎসা।",
    benefits: ["Natural look", "Long-lasting", "Pain-managed care"],
    benefits_bn: ["প্রাকৃতিক চেহারা", "দীর্ঘস্থায়ী ফলাফল", "ব্যথা-নিয়ন্ত্রিত সেবা"],
    symptoms: ["Severe toothache", "Sensitivity to hot/cold", "Cracked or broken tooth", "Deep cavity"],
    symptoms_bn: ["তীব্র দাঁতব্যথা", "গরম/ঠান্ডায় সংবেদনশীলতা", "ভাঙা বা ফাটা দাঁত", "গভীর ক্যাভিটি"],
    cta: "Book Consultation",
    cta_bn: "পরামর্শ নিন",
  },
  {
    slug: "oral-surgery",
    title: "Oral Surgery",
    title_bn: "ওরাল সার্জারি",
    tagline: "Surgical expertise with a gentle touch.",
    tagline_bn: "কোমল স্পর্শে সার্জিক্যাল দক্ষতা।",
    icon: Scissors,
    items: ["Tooth Extraction", "Surgical Extraction", "Minor Oral Surgery"],
    items_bn: ["দাঁত তোলা", "সার্জিক্যাল এক্সট্র্যাকশন", "মাইনর ওরাল সার্জারি"],
    description: "Surgical procedures performed with the latest sterilization and minimally-invasive techniques.",
    description_bn: "সর্বাধুনিক স্টেরিলাইজেশন ও মিনিমাল-ইনভেসিভ কৌশলে সার্জিক্যাল প্রক্রিয়া।",
    benefits: ["Sterile protocols", "Faster recovery", "Sedation options"],
    benefits_bn: ["স্টেরাইল প্রোটোকল", "দ্রুত সুস্থতা", "অবেদন বিকল্প"],
    symptoms: ["Impacted wisdom tooth", "Severe pain or swelling", "Unrestorable tooth", "Jaw clicking"],
    symptoms_bn: ["আক্কেল দাঁতের সমস্যা", "তীব্র ব্যথা বা ফোলা", "সংরক্ষণযোগ্য নয় এমন দাঁত", "চোয়াল ক্লিক"],
    cta: "Book Consultation",
    cta_bn: "পরামর্শ নিন",
  },
  {
    slug: "orthodontics",
    title: "Orthodontics",
    title_bn: "অর্থোডন্টিক্স",
    tagline: "Straighter teeth, confident smiles.",
    tagline_bn: "সোজা দাঁত, আত্মবিশ্বাসী হাসি।",
    icon: Smile,
    items: ["Braces", "Orthodontic Consultation"],
    items_bn: ["ব্রেসেস", "অর্থোডন্টিক পরামর্শ"],
    description: "Tailored orthodontic treatment with specialist training to align your smile efficiently.",
    description_bn: "বিশেষজ্ঞ প্রশিক্ষণে কাস্টমাইজড অর্থোডন্টিক চিকিৎসায় আপনার হাসি সাজান।",
    benefits: ["Specialist-led", "Custom plans", "Aesthetic options"],
    benefits_bn: ["বিশেষজ্ঞ পরিচালিত", "কাস্টম পরিকল্পনা", "নান্দনিক বিকল্প"],
    symptoms: ["Crowded or crooked teeth", "Gapped smile", "Overbite or underbite", "Difficulty chewing"],
    symptoms_bn: ["ঘিঞ্জি বা বাঁকা দাঁত", "দাঁতে ফাঁক", "অতিরিক্ত বা কম কামড়", "চিবাতে অসুবিধা"],
    cta: "Book Ortho Consult",
    cta_bn: "অর্থো পরামর্শ নিন",
  },
  {
    slug: "implant-dentistry",
    title: "Implant Dentistry",
    title_bn: "ইমপ্লান্ট ডেন্টিস্ট্রি",
    tagline: "Certified implants by AIC, Korea trained surgeon.",
    tagline_bn: "AIC, কোরিয়া সার্টিফাইড ইমপ্লান্ট বিশেষজ্ঞ।",
    icon: Atom,
    items: ["Dental Implants", "Implant Restoration"],
    items_bn: ["ডেন্টাল ইমপ্লান্ট", "ইমপ্লান্ট রিস্টোরেশন"],
    description: "Permanent, natural-feeling tooth replacement using world-class implant systems.",
    description_bn: "বিশ্বমানের ইমপ্লান্ট সিস্টেমে স্থায়ী, প্রাকৃতিক অনুভূতির দাঁত প্রতিস্থাপন।",
    benefits: ["AIC, Korea certified", "Lifelong solution", "Looks natural"],
    benefits_bn: ["AIC, কোরিয়া সার্টিফাইড", "আজীবন সমাধান", "প্রাকৃতিক চেহারা"],
    symptoms: ["Missing one or more teeth", "Loose or failing denture", "Bone loss in jaw", "Difficulty eating"],
    symptoms_bn: ["এক বা একাধিক দাঁত নেই", "ঢিলা বা ব্যর্থ ডেনচার", "চোয়ালে হাড় ক্ষয়", "খেতে অসুবিধা"],
    cta: "Book Implant Consult",
    cta_bn: "ইমপ্লান্ট পরামর্শ নিন",
  },
  {
    slug: "cosmetic-dentistry",
    title: "Cosmetic Dentistry",
    title_bn: "কসমেটিক ডেন্টিস্ট্রি",
    tagline: "Aesthetic dentistry, trained in Dubai.",
    tagline_bn: "নান্দনিক দন্তচিকিৎসা, দুবাইতে প্রশিক্ষিত।",
    icon: Brush,
    items: ["Teeth Whitening", "Smile Design", "Aesthetic Dentistry"],
    items_bn: ["দাঁত সাদাকরণ", "স্মাইল ডিজাইন", "এস্থেটিক ডেন্টিস্ট্রি"],
    description: "Smile makeovers that combine art and science for a result that looks unmistakably you.",
    description_bn: "শিল্প ও বিজ্ঞানের মিশেলে স্মাইল মেকওভার — একটি অনন্য, স্বাভাবিক হাসির জন্য।",
    benefits: ["Bespoke smile design", "Premium materials", "Predictable results"],
    benefits_bn: ["কাস্টম স্মাইল ডিজাইন", "প্রিমিয়াম উপকরণ", "পূর্বাভাসযোগ্য ফলাফল"],
    symptoms: ["Discoloured teeth", "Chipped front teeth", "Uneven smile line", "Wedding / event prep"],
    symptoms_bn: ["বিবর্ণ দাঁত", "সামনের দাঁত ভাঙা", "অসম হাসির রেখা", "বিয়ে/অনুষ্ঠানের প্রস্তুতি"],
    cta: "Plan My Smile",
    cta_bn: "স্মাইল পরিকল্পনা করুন",
  },
  {
    slug: "pediatric-dentistry",
    title: "Pediatric Dentistry",
    title_bn: "শিশু দন্তচিকিৎসা",
    tagline: "A gentle introduction to lifelong dental care.",
    tagline_bn: "শিশুর দাঁতের সেবায় বিশেষজ্ঞ যত্ন।",
    icon: Baby,
    items: ["Child Dental Care", "Preventive Pediatric Care"],
    items_bn: ["শিশু দন্তসেবা", "প্রতিরোধমূলক শিশুসেবা"],
    description: "Led by the Head of Pediatric Dentistry at Marks Medical College — a safe space for children.",
    description_bn: "মার্কস মেডিকেল কলেজের শিশু দন্তচিকিৎসা বিভাগের প্রধানের নেতৃত্বে — শিশুর জন্য নিরাপদ পরিবেশ।",
    benefits: ["Child-friendly", "Specialist-led", "Calm environment"],
    benefits_bn: ["শিশু-বান্ধব", "বিশেষজ্ঞ পরিচালিত", "শান্ত পরিবেশ"],
    symptoms: ["First dental visit", "Cavities in milk teeth", "Thumb-sucking concerns", "Dental anxiety"],
    symptoms_bn: ["প্রথম দাঁতের ভিজিট", "দুধ দাঁতে ক্যাভিটি", "বুড়ো আঙুল চোষার সমস্যা", "দাঁতের ভয়"],
    cta: "Book Child Visit",
    cta_bn: "শিশুর ভিজিট বুক করুন",
  },
];

export function getService(slug: string, lang: Lang = "en") {
  const svc = services.find((s) => s.slug === slug);
  if (!svc) return null;
  return lang === "bn"
    ? { ...svc, title: svc.title_bn, tagline: svc.tagline_bn, items: svc.items_bn, description: svc.description_bn, benefits: svc.benefits_bn, symptoms: svc.symptoms_bn, cta: svc.cta_bn }
    : svc;
}
