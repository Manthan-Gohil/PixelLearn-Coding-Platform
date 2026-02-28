"use client";

import { useState } from "react";
import { AppProvider, useApp } from "@/store";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SUBSCRIPTION_PLANS } from "@/services/data";
import { Shield } from "lucide-react";

// Components
import PricingHeader from "@/components/pricing/PricingHeader";
import PricingCards from "@/components/pricing/PricingCards";
import ComparisonTable from "@/components/pricing/ComparisonTable";
import PricingFAQ from "@/components/pricing/PricingFAQ";

function PricingContent() {
    const { user, updateSubscription } = useApp();
    const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

    const activePlans = SUBSCRIPTION_PLANS.filter(
        (p) => p.interval === billing || p.price === 0
    );

    return (
        <main className="min-h-screen bg-surface pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-text-muted text-sm">
                        <Shield className="w-4 h-4" />
                        30-day money-back guarantee · SSL encrypted · Cancel anytime
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}

export default function PricingPage() {
    return (
        <AppProvider>
            <Navbar />
            <PricingContent />
        </AppProvider>
    );
}
