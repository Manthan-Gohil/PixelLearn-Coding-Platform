"use client";

import StandardLayout from "@/components/layout/StandardLayout";
import DashboardContent from "@/components/dashboard/DashboardContent";

export default function DashboardPage() {
    return (
        <StandardLayout particlesCount={12} showFooter={false} flowblockTheme>
            <DashboardContent />
        </StandardLayout>
    );
}
