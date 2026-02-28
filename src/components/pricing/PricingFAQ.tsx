"use client";

import { useState } from "react";
import { HelpCircle, ArrowRight } from "lucide-react";

const faqItems = [
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

export default function PricingFAQ() {
    const [showFAQ, setShowFAQ] = useState<number | null>(null);

    return (
        <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
                Frequently Asked Questions
            </h2>
            <div className="space-y-3">
                {faqItems.map((faq, i) => (
                    <div
                        key={i}
                        className="glass rounded-xl overflow-hidden transition-all"
                    >
                        <button
                            onClick={() => setShowFAQ(showFAQ === i ? null : i)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-hover/30 transition-colors"
                        >
                            <span className="flex items-center gap-2 text-sm font-medium text-text-primary">
                                <HelpCircle className="w-4 h-4 text-primary-light" />
                                {faq.question}
                            </span>
                            <span
                                className={`transform transition-transform ${showFAQ === i ? "rotate-180" : ""
                                    }`}
                            >
                                <ArrowRight className="w-4 h-4 text-text-muted rotate-90" />
                            </span>
                        </button>
                        {showFAQ === i && (
                            <div className="px-4 pb-4 pt-0 text-sm text-text-secondary animate-fade-in">
                                <div className="pl-6">{faq.answer}</div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
