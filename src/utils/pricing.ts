import type { SubscriptionPlan } from "@/types";
import type { BillingCycle } from "@/types/pricing";

export function getActivePricingPlans(
  plans: SubscriptionPlan[],
  billingCycle: BillingCycle,
): SubscriptionPlan[] {
  return plans.filter(
    (plan) => plan.interval === billingCycle || plan.price === 0,
  );
}
