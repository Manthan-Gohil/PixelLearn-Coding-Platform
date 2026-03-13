export type BillingCycle = "monthly" | "yearly";

export interface PricingComparisonFeature {
  name: string;
  free: boolean | string;
  pro: boolean | string;
}

export interface PricingFaqItem {
  question: string;
  answer: string;
}

export interface PricingTrustMessage {
  label: string;
}
