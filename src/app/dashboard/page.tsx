"use client";

import { AppProvider } from "@/lib/store";
import Navbar from "@/components/Navbar";
import DashboardContent from "@/components/DashboardContent";

export default function DashboardPage() {
    return (
        <AppProvider>
            <Navbar />
            <DashboardContent />
        </AppProvider>
    );
}
