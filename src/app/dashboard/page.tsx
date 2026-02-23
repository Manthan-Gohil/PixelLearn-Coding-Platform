"use client";

import { AppProvider } from "@/store";
import Navbar from "@/components/layout/Navbar";
import DashboardContent from "@/components/dashboard/DashboardContent";

export default function DashboardPage() {
    return (
        <AppProvider>
            <Navbar />
            <DashboardContent />
        </AppProvider>
    );
}
