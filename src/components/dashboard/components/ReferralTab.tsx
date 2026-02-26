"use client";

import { useState } from "react";
import { Share2, CheckCircle2, Copy } from "lucide-react";
import { User } from "@/store";

interface ReferralTabProps {
    user: User;
}

export default function ReferralTab({ user }: ReferralTabProps) {
    const [copied, setCopied] = useState(false);

    const handleCopyReferral = () => {
        navigator.clipboard.writeText(
            `https://pixellearn.com/refer/${user.referralCode}`
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary-light" />
                Refer & Earn
            </h3>
            <p className="text-text-secondary text-sm mb-6">
                Share your unique referral link and earn rewards when friends
                join PixelLearn!
            </p>

            {/* Referral Link */}
            <div className="flex items-center gap-2 mb-6">
                <div className="flex-1 p-3 rounded-lg bg-surface-alt border border-border font-mono text-sm text-text-secondary truncate">
                    https://pixellearn.com/refer/{user.referralCode}
                </div>
                <button
                    onClick={handleCopyReferral}
                    className={`px-4 py-3 rounded-lg font-medium text-sm transition-all ${copied
                        ? "bg-success/10 text-success border border-success/30"
                        : "gradient-primary text-white hover:opacity-90"
                        }`}
                >
                    {copied ? (
                        <CheckCircle2 className="w-5 h-5" />
                    ) : (
                        <Copy className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-surface-alt border border-border text-center">
                    <div className="text-2xl font-bold text-text-primary">
                        {user.referralCount}
                    </div>
                    <div className="text-xs text-text-muted">
                        Referrals
                    </div>
                </div>
                <div className="p-4 rounded-xl bg-surface-alt border border-border text-center">
                    <div className="text-2xl font-bold text-text-primary">
                        {user.referralCount * 100}
                    </div>
                    <div className="text-xs text-text-muted">
                        Bonus XP
                    </div>
                </div>
                <div className="p-4 rounded-xl bg-surface-alt border border-border text-center">
                    <div className="text-2xl font-bold text-success">
                        Active
                    </div>
                    <div className="text-xs text-text-muted">Status</div>
                </div>
            </div>
        </div>
    );
}
