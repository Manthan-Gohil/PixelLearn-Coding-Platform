import type {
  BillingCycle,
  PricingComparisonFeature,
  PricingFaqItem,
  PricingTrustMessage,
} from "@/types/pricing";

export const DEFAULT_BILLING_CYCLE: BillingCycle = "monthly";

export const PRICING_BILLING_LABELS: Record<BillingCycle, string> = {
  monthly: "Monthly",
  yearly: "Yearly",
};

export const PRICING_YEARLY_SAVE_TEXT = "Save 35%";

export const PRICING_COMPARISON_FEATURES: PricingComparisonFeature[] = [
  { name: "Free Courses", free: true, pro: true },
  { name: "Basic Coding Playground", free: true, pro: true },
  { name: "Progress Tracking", free: true, pro: true },
  { name: "Community Support", free: true, pro: true },
  { name: "Daily Exercise Limit", free: "5/day", pro: "Unlimited" },
  { name: "Premium Courses", free: false, pro: true },
  { name: "AI Career Q&A", free: false, pro: true },
  { name: "AI Resume Analyzer", free: false, pro: true },
  { name: "AI Career Roadmap", free: false, pro: true },
  { name: "Certificate of Completion", free: false, pro: true },
  { name: "Priority Support", free: false, pro: true },
  { name: "Advanced Analytics", free: false, pro: true },
];

export const PRICING_FAQ_ITEMS: PricingFaqItem[] = [
  {
    question: "Can I switch between plans?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated.",
  },
  {
    question: "Is there a free trial for Pro?",
    answer:
      "We offer a 14-day free trial for Pro. No credit card required to start. Cancel anytime during the trial.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, Amex), PayPal, and UPI. All payments are processed securely.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Yes, we offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund.",
  },
  {
    question: "Do you offer team/student discounts?",
    answer:
      "Yes! We offer 50% discount for students with a valid .edu email and custom pricing for teams of 5+. Contact us for details.",
  },
];

export const PRICING_TRUST_MESSAGE: PricingTrustMessage = {
  label: "30-day money-back guarantee · SSL encrypted · Cancel anytime",
};
