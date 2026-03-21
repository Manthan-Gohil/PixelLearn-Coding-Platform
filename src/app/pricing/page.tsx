"use client";

import { useState } from "react";
import { useApp } from "@/store";
import StandardLayout from "@/components/layout/StandardLayout";
import { SUBSCRIPTION_PLANS } from "@/services/data";
import { DEFAULT_BILLING_CYCLE, PRICING_TRUST_MESSAGE } from "@/constants/pricing";
import { getActivePricingPlans } from "@/utils/pricing";
import type { BillingCycle } from "@/types/pricing";
import { Shield } from "lucide-react";

// Components
import PricingHeader from "@/components/pricing/PricingHeader";
import PricingCards from "@/components/pricing/PricingCards";
import ComparisonTable from "@/components/pricing/ComparisonTable";
import PricingFAQ from "@/components/pricing/PricingFAQ";

function PricingContent() {
    const { user, updateSubscription } = useApp();
    const [billing, setBilling] = useState<BillingCycle>(DEFAULT_BILLING_CYCLE);

    const activePlans = getActivePricingPlans(SUBSCRIPTION_PLANS, billing);

    return (
        <StandardLayout
            particlesCount={18}
            flowblockTheme
            containerClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        >
            <PricingHeader
                billing={billing}
                onBillingChange={setBilling}
            />

            <PricingCards
                plans={activePlans}
                user={user}
                updateSubscription={updateSubscription}
            />

            <ComparisonTable />

            <PricingFAQ />

            {/* Trust Section */}
            <div className="text-center animate-fade-in">
                <div className="inline-flex items-center gap-2 text-text-muted text-sm glass px-4 py-2 rounded-full">
                    <Shield className="w-4 h-4 text-success" />
                    {PRICING_TRUST_MESSAGE.label}
                </div>
            </div>
        </StandardLayout>
    );
}

export default function PricingPage() {
    return <PricingContent />;
}
